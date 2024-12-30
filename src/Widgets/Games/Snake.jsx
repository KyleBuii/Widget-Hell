import Slider from 'rc-slider';
import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa6';
import { TbMoneybag } from "react-icons/tb";


//////////////////// Guides ////////////////////
/// Debris spawning guide
/*
Direction      Start       Every
Debris left    4 seconds   3 seconds
Debris top     8 seconds   4 seconds
Debris right   13 seconds  5 seconds
Debris bottom  20 seconds  7 seconds
*/


//////////////////// Functions ////////////////////
function shallowEquals(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length)
        return false;
    let equals = true;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            equals = false;
    };
    return equals;
};

function arrayDiff(arr1, arr2) {
    return arr1.map((a, i) => {
        return a - arr2[i];
    });
};

/// Checks if arr1 values falls between [arr2 - arr3]
function fallsBetween(arr1, arr2, arr3){
    if(((arr1[0] >= arr2[0]) && (arr1[0] <= arr3[0]))
        && ((arr1[1] >= arr2[1]) && (arr1[1] <= arr3[1]))){
        return true;
    };
    return false;
};

/// Displays a single cell
function GridCell(props) {
    const classes = `grid-cell 
        ${props.foodCell ? `grid-cell--food${props.foodType}` : ""} 
        ${props.snakeCell ? "grid-cell--snake" : ""}
        ${props.debrisCell ? "grid-cell--debris" : ""}
    `;
    return(
        <div className={classes}
            style={{
                height: props.size + "em", 
                width: props.size + "em"
            }}>
        </div>
    );
};


//////////////////// Variables ////////////////////
let intervalTimer;
let timeoutDebrisLeft;
let timeoutDebrisTop;
let timeoutDebrisRight;
let timeoutDebrisBottom;
let timeoutInvulnerabilityFrames = undefined;
let delayDebrisLeft = 3000;
let delayDebrisTop = 4000;
let delayDebrisRight = 5000;
let delayDebrisBottom = 7000;


class WidgetSnake extends Component{
    constructor(props){
        super(props);
        this.state = {
            goldEarned: 0,
            timer: 0,
            size: 0,
            settings: false,
            help: false,
            startMoving: false,
            snake: [],
            debrisLeft: [],
            debrisTop: [],
            debrisRight: [],
            debrisBottom: [],
            food: [],
            foodType: "normal",
            foodDelay: 0,
            highscore: 0,
            status: 0,          /// 0 = not started, 1 = in progress, 2 = finished
            direction: 0,       /// Using keycodes to indicate direction
            speed: 130,
            step: 1,
            maxHealth: 1,
            health: 1
        };
        this.storeData = this.storeData.bind(this);
        this.moveFood = this.moveFood.bind(this);
        this.checkIfAteFood = this.checkIfAteFood.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.loop = this.loop.bind(this);
        this.doesntOverlap = this.doesntOverlap.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.removeTimers = this.removeTimers.bind(this);
        this.changeSpeed = this.changeSpeed.bind(this);
        this.resetSpeed = this.resetSpeed.bind(this);
        this.calculateSize = this.calculateSize.bind(this);
    };
    /// Randomly place a random snake food
    moveFood(){
        const x = parseInt(Math.random() * this.numCells);
        const y = parseInt(Math.random() * this.numCells);
        let keysFoodTypes = Object.keys(this.props.foodTypes);
        let randomFoodType = Math.floor(Math.random() * keysFoodTypes.length);
        this.setState({
            food: [x, y],
            foodType: keysFoodTypes[randomFoodType],
            foodDelay: (this.props.foodTypes[keysFoodTypes[randomFoodType]].delay) ? this.props.foodTypes[keysFoodTypes[randomFoodType]].delay : 0
        });
    };
    keyDown({keyCode}){
        if(this.state.status !== 0 || this.state.status !== 2){
            const re = new RegExp("\\b83|40|87|38|68|39|65|37\\b");
            if(this.state.startMoving === true
                && re.test(keyCode)){
                this.moveSnakeInterval = setInterval(this.loop, this.state.speed);
                intervalTimer = setInterval(() => {
                    this.setState({
                        timer: this.state.timer + 1
                    }, () => {
                        if(this.state.timer === 1){
                            this.spawnDebris("left");
                        };
                        if(this.state.timer === 4){
                            this.spawnDebris("top");  
                        };
                        if(this.state.timer === 8){
                            this.spawnDebris("right");  
                        };
                        if(this.state.timer === 13){
                            this.spawnDebris("bottom");  
                        };
                    });
                }, 1000);
                this.setState({
                    startMoving: false
                });
            };
            /// Ignore if same direction or reverse
            let changeDirection = true;
            [[83, 40, 87, 38], [68, 39, 65, 37]].forEach(dir => {
                if(dir.indexOf(this.state.direction) > -1 && dir.indexOf(keyCode) > -1){
                    changeDirection = false;
                };
            });
            if(re.test(keyCode)
                && changeDirection){
                this.setState({
                    direction: keyCode
                });
            };
            /// Dash key (shift)
            if(keyCode === 16){
                this.setState({
                    step: 2
                });
            };
        };
    };
    spawnDebris(where){
        let randomPosition;
        let randomDebris = this.props.debris[Math.floor(Math.random() * this.props.debris.length)];
        let calculateDebris = [];
        switch(where){
            case "left":
                randomPosition = Math.floor(Math.random() * (this.state.size + randomDebris[0][0]) + Math.abs(randomDebris[0][0]));
                for(let i of randomDebris){
                    calculateDebris.push([i[0] + randomPosition, i[1]]);
                };
                this.setState({
                    debrisLeft: calculateDebris
                });
                break;
            case "top":
                randomPosition = Math.floor(Math.random() * (this.state.size + randomDebris[0][1]) + Math.abs(randomDebris[0][1]));
                for(let i of randomDebris){
                    calculateDebris.push([i[0], i[1] + randomPosition]);
                };
                this.setState({
                    debrisTop: calculateDebris
                });
                break;
            case "right":
                randomPosition = Math.floor(Math.random() * (this.state.size + randomDebris[0][0]) + Math.abs(randomDebris[0][0]));
                for(let i of randomDebris){
                    calculateDebris.push([i[0] + randomPosition, Math.abs(i[1]) + this.state.size]);
                };
                this.setState({
                    debrisRight: calculateDebris
                });
                break;
            case "bottom":
                randomPosition = Math.floor(Math.random() * (this.state.size + randomDebris[0][1]) + Math.abs(randomDebris[0][1]));
                for(let i of randomDebris){
                    calculateDebris.push([Math.abs(i[0]) + this.state.size, i[1] + randomPosition]);
                };
                this.setState({
                    debrisBottom: calculateDebris
                });
                break;
            default:
                break;
        };
    };
    /// Move snake, food, debris, eating food
    loop(){
        const newSnake = [];
        /// Set in the new "head" of the snake
        switch(this.state.direction){
            /// Down
            case 83:
            case 40:
                newSnake[0] = [this.state.snake[0][0] + this.state.step, this.state.snake[0][1]];
                break;
            /// Up
            case 87:
            case 38:
                newSnake[0] = [this.state.snake[0][0] - this.state.step, this.state.snake[0][1]];
                break;
            /// Right
            case 68:
            case 39:
                newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + this.state.step];
                break;
            /// Left
            case 65:
            case 37:
                newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - this.state.step];
                break;
            default:
                break;
        };
        if(this.state.step !== 1){
            this.setState({
                step: 1
            });
        };
        /// Shift each "body" segment to the previous segment's position
        [].push.apply(
            newSnake,
            this.state.snake.slice(1).map((s, i) => {
                // since we're starting from the second item in the list,
                // just use the index, which will refer to the previous item
                // in the original list
                return this.state.snake[i];
            })
        );
        if((!this.isValid(newSnake[0]) 
            || !this.doesntOverlap(newSnake))
            && timeoutInvulnerabilityFrames === undefined){
            this.takeDamage();
        }else{
            /// If moving food
            let copyFood = this.state.food;
            if(this.props.foodTypes[this.state.foodType].moving
                && this.state.foodDelay === 0){
                let foodPositions = [-1, 0, 1];
                let randomPosition = Math.floor(Math.random() * 2);
                copyFood[randomPosition] = copyFood[randomPosition] + foodPositions[Math.floor(Math.random() * foodPositions.length)];
                if(!this.isValid(copyFood)){
                    copyFood = [this.state.size/2, this.state.size/2];
                };
            };
            /// Debris Left
            let newDebrisLeft = this.state.debrisLeft;
            if(this.state.debrisLeft.length !== 0){
                for(let i = 0; i < newDebrisLeft.length; i++){
                    newDebrisLeft[i][1] = newDebrisLeft[i][1] + 1;
                };
                if(fallsBetween(newSnake[0], newDebrisLeft[0], newDebrisLeft[this.state.debrisLeft.length - 1])
                    && timeoutInvulnerabilityFrames === undefined){
                    this.takeDamage();
                };
                if(newDebrisLeft[0][1] === this.state.size + 1){
                    newDebrisLeft = [];
                    timeoutDebrisLeft = setTimeout(() => {
                        this.spawnDebris("left");
                    }, delayDebrisLeft);
                };
            };
            /// Debris Top
            let newDebrisTop = this.state.debrisTop;
            if(this.state.debrisTop.length !== 0){
                for(let i = 0; i < newDebrisTop.length; i++){
                    newDebrisTop[i][0] = newDebrisTop[i][0] + 1;
                };
                if(fallsBetween(newSnake[0], newDebrisTop[0], newDebrisTop[this.state.debrisTop.length - 1])
                    && timeoutInvulnerabilityFrames === undefined){
                    this.takeDamage();
                };
                if(newDebrisTop[0][0] === this.state.size + 1){
                    newDebrisTop = [];
                    timeoutDebrisTop = setTimeout(() => {
                        this.spawnDebris("top");
                    }, delayDebrisTop);
                };
            };
            /// Debris Right
            let newDebrisRight = this.state.debrisRight;
            if(this.state.debrisRight.length !== 0){
                for(let i = 0; i < newDebrisRight.length; i++){
                    newDebrisRight[i][1] = newDebrisRight[i][1] - 1;
                };
                if(fallsBetween(newSnake[0], newDebrisRight[0], newDebrisRight[this.state.debrisRight.length - 1])
                    && timeoutInvulnerabilityFrames === undefined){
                    this.takeDamage();
                };
                if(newDebrisRight[newDebrisRight.length - 1][1] === -1){
                    newDebrisRight = [];
                    timeoutDebrisRight = setTimeout(() => {
                        this.spawnDebris("right");
                    }, delayDebrisRight);
                };
            };
            /// Debris Bottom
            let newDebrisBottom = this.state.debrisBottom;
            if(this.state.debrisBottom.length !== 0){
                for(let i = 0; i < newDebrisBottom.length; i++){
                    newDebrisBottom[i][0] = newDebrisBottom[i][0] - 1;
                };
                if(fallsBetween(newSnake[0], newDebrisBottom[0], newDebrisBottom[this.state.debrisBottom.length - 1])
                    && timeoutInvulnerabilityFrames === undefined){
                    this.takeDamage();
                };
                if(newDebrisBottom[newDebrisBottom.length - 1][0] === (0 - newDebrisBottom.length)){
                    newDebrisBottom = [];
                    timeoutDebrisBottom = setTimeout(() => {
                        this.spawnDebris("bottom");
                    }, delayDebrisBottom);
                };
            };
            this.setState({
                snake: newSnake,
                debrisLeft: newDebrisLeft,
                debrisTop: newDebrisTop,
                debrisRight: newDebrisRight,
                debrisBottom: newDebrisBottom,
                food: copyFood,
                foodDelay: (this.state.foodDelay !== 0) ? (this.state.foodDelay - 1) : this.props.foodTypes[this.state.foodType].delay
            });
            this.checkIfAteFood(newSnake);
        };
    };
    takeDamage(){
        this.setState({
            health: this.state.health - 1
        }, () => {
            if(this.state.health <= 0){
                this.endGame()
            }else{
                timeoutInvulnerabilityFrames = setTimeout(() => {
                    timeoutInvulnerabilityFrames = undefined;
                }, 500);
            };
        });
    };
    checkIfAteFood(newSnake){
        if(!shallowEquals(newSnake[0], this.state.food))
            return
        /// Snake gets longer
        let newSnakeSegment = [];
        const lastSegment = newSnake[newSnake.length - 1];
        let snakeLengthIncrease = this.props.foodTypes[this.state.foodType].score;
        let currentLengthIncrease = 0;
        /// Where should we position the new snake segment?
        //// Here are some potential positions, we can choose the best looking one
        let lastPositionOptions = [[-1 * currentLengthIncrease, 0], [0, -1 * currentLengthIncrease], [1 * currentLengthIncrease, 0], [0, 1 * currentLengthIncrease]];
        /// The snake is moving along the y-axis, so try that instead
        if(newSnake.length > 1){
            lastPositionOptions[0] = arrayDiff(lastSegment, newSnake[newSnake.length - 2]);
        };
        for(let i = 0; i < lastPositionOptions.length; i++){
            let tempNewSnakeSegment = [
                lastSegment[0] + lastPositionOptions[i][0],
                lastSegment[1] + lastPositionOptions[i][1]
            ];
            if(this.isValid(tempNewSnakeSegment)
                && currentLengthIncrease < snakeLengthIncrease){
                newSnakeSegment.push(tempNewSnakeSegment);
                currentLengthIncrease++;
            }else if(currentLengthIncrease === snakeLengthIncrease){
                break;
            };
        };
        this.setState({
            goldEarned: this.state.goldEarned + snakeLengthIncrease,
            snake: newSnake.concat(newSnakeSegment),
            food: []
        });
        if(this.state.foodType === "bomb"){
            this.setState({
                debrisLeft: [],
                debrisTop: [],
                debrisRight: [],
                debrisBottom: []    
            });
            clearTimeout(timeoutDebrisLeft);
            clearTimeout(timeoutDebrisTop);
            clearTimeout(timeoutDebrisRight);
            clearTimeout(timeoutDebrisBottom);    
            timeoutDebrisLeft = setTimeout(() => {
                this.spawnDebris("left");
            }, delayDebrisLeft);
            timeoutDebrisTop = setTimeout(() => {
                this.spawnDebris("top");
            }, delayDebrisTop);
            timeoutDebrisRight = setTimeout(() => {
                this.spawnDebris("right");
            }, delayDebrisRight);
            timeoutDebrisBottom = setTimeout(() => {
                this.spawnDebris("bottom");
            }, delayDebrisBottom);
        };
        this.moveFood();
    };
    /// Is the cell's position inside the grid?
    isValid(cell){
        return(
            cell[0] > -1 &&
            cell[1] > -1 &&
            cell[0] < this.numCells &&
            cell[1] < this.numCells
        );
    };
    doesntOverlap(snake){
        return(
            snake.slice(1).filter(c => {
                return shallowEquals(snake[0], c);
            }).length === 0
        );
    };
    startGame(){
        if(this.state.settings === true){
            this.setState({
                settings: false
            });
            document.getElementById("snake-button-settings").style.opacity = "0.5";
            document.getElementById("snake-popout-settings").style.visibility = "hidden";
        };
        const cells = Math.floor((this.state.size / 0.9375)/2);
        this.removeTimers();
        this.moveFood(); 
        this.setState({
            timer: 0,
            goldEarned: 0,
            direction: 0,
            startMoving: true,
            status: 1,
            snake: [[cells, cells]],
            debrisLeft: [],
            debrisTop: [],
            debrisRight: [],
            debrisBottom: [],
            health: this.state.maxHealth
        });
        this.el.focus();
    };
    endGame(){
        this.removeTimers();
        if((this.state.snake.length - 1) >= 10){
            let amount = Math.floor((this.state.snake.length - 1) / 10);
            this.props.gameProps.randomItem(amount);
        };
        this.props.gameProps.updateGameValue("gold", this.state.goldEarned);
        this.props.gameProps.updateGameValue("exp", this.state.goldEarned);
        this.setState({
            status: 2,
            highscore: (this.state.snake.length - 1 > this.state.highscore)
                ? this.state.snake.length - 1
                : this.state.highscore
        });
    };
    removeTimers(){
        if(this.moveSnakeInterval){
            clearInterval(this.moveSnakeInterval);
        };
        clearInterval(intervalTimer);
        clearTimeout(timeoutDebrisLeft);
        clearTimeout(timeoutDebrisTop);
        clearTimeout(timeoutDebrisRight);
        clearTimeout(timeoutDebrisBottom);
        timeoutInvulnerabilityFrames = clearTimeout(timeoutInvulnerabilityFrames);
    };
    changeSpeed(value){
        this.setState({
            speed: value
        });
    };
    resetSpeed(){
        this.setState({
            speed: 130
        });
    };
    /// Handles all pressable buttons (opacity: 0.5 on click)
    handlePressableButton(what){
        switch(what){
            case "settings":
                const buttonSettings = document.getElementById("snake-button-settings");
                const popoutAnimationSettings = document.getElementById("snake-popout-animation-settings");
                this.setState({
                    settings: !this.state.settings
                });
                this.props.defaultProps.showHidePopout(popoutAnimationSettings, !this.state.settings, buttonSettings);
                break;
            default:
                break;
        };
    };
    calculateHealth(){
        if(this.props.gameProps.stats.health < 10){
            return 1;
        }else{
            return Math.floor(this.props.gameProps.stats.health / 10);
        };
    };
    calculateSize(){
        let calculateSize;
        if(window.innerWidth > 507){
            calculateSize = 28;
        }else{
            calculateSize = Math.floor(window.innerWidth / 20);
        };
        this.setState({
            size: calculateSize
        });
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["games"]["snake"] = {
                ...dataLocalStorage["games"]["snake"],
                highscore: this.state.highscore,
                speed: this.state.speed
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    componentDidUpdate(){
        const overlay = document.getElementById("snake-overlay");
        if(this.state.status === 1){
            overlay.style.visibility = "hidden";
        }else{
            overlay.style.visibility = "visible";
        };
    };
    componentDidMount(){
        window.addEventListener("beforeunload", this.storeData);
        window.addEventListener("resize", this.calculateSize);
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            let localStorageSnake = dataLocalStorage["games"]["snake"];
            if(localStorageSnake["highscore"] !== undefined){
                this.setState({
                    highscore: localStorageSnake["highscore"],
                    speed: localStorageSnake["speed"]
                });
            };
        };
        document.getElementById("snake-overlay")
            .style
            .visibility = "visible";
        this.calculateSize();
        let calculateMaxHealth = this.calculateHealth();
        this.setState({
            maxHealth: calculateMaxHealth,
            health: calculateMaxHealth
        });
    };
    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.storeData);
        this.removeTimers();
        this.storeData();
    };
    render(){
        /// Each cell should be approximately 0.9375em wide, so calculate how many we need
        this.numCells = Math.floor(this.state.size / 0.9375);
        const cellSize = this.state.size / this.numCells;
        const cellIndexes = Array.from(Array(this.numCells).keys());
        const cells = cellIndexes.map(x => {
            return cellIndexes.map((y) => {
                const foodCell = (this.state.food[0] === x) && (this.state.food[1] === y);
                let snakeCell = this.state.snake.filter((c) => (c[0] === x) && (c[1] === y));
                snakeCell = snakeCell.length && snakeCell[0];
                let debrisCellLeft = this.state.debrisLeft.filter((c) => (c[0] === x) && (c[1] === y));
                let debrisCellTop = this.state.debrisTop.filter((c) => (c[0] === x) && (c[1] === y));
                let debrisCellRight = this.state.debrisRight.filter((c) => (c[0] === x) && (c[1] === y));
                let debrisCellBottom = this.state.debrisBottom.filter((c) => (c[0] === x) && (c[1] === y));
                let debrisCell = (debrisCellLeft.length && debrisCellLeft[0])
                    || (debrisCellTop.length && debrisCellTop[0])
                    || (debrisCellRight.length && debrisCellRight[0])
                    || (debrisCellBottom.length && debrisCellBottom[0]);
                return(
                    <GridCell foodCell={foodCell}
                        foodType={this.state.foodType}
                        snakeCell={snakeCell}
                        debrisCell={debrisCell}
                        size={cellSize}
                        key={x + " " + y}/>
                );
            });
        });
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("snake")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("snake");
                    this.props.defaultProps.updatePosition("snake", "games", data.x, data.y);
                }}
                cancel="button, section, a"
                bounds="parent">
                <div id="snake-widget"
                    className="widget">
                    <div id="snake-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="snake-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("snake", "games")}
                        {/* Information Container */}
                        <section className="aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold">
                            {/* Gold Earned */}
                            <span className="text-animation flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                <span className="font small bold">+</span>
                                {this.state.goldEarned}
                            </span>
                            {/* Total Gold */}
                            <span className="text-animation flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                {this.props.gameProps.formatNumber(this.props.gameProps.gold, 1)}
                            </span>
                            {/* Timer */}
                            <span className="text-animation flex-center row gap">
                                <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                    <FaRegClock/>
                                </IconContext.Provider>
                                {this.state.timer}
                            </span>
                        </section>
                        {/* Game Container */}
                        <section id="snake-display"
                            onKeyDown={this.keyDown}
                            style={{
                                width: this.state.size + "em",
                                height: this.state.size + "em"
                            }}
                            ref={el => (this.el = el)}
                            tabIndex={-1}>
                            <div id="snake-display-grid"
                                style={{
                                    width: this.state.size + "em",
                                    height: this.state.size + "em"
                                }}>
                                {cells}
                            </div>
                            {/* Overlay */}
                            <div id="snake-overlay"
                                className="aesthetic-scale scale-span overlay rounded flex-center column gap">
                                {(this.state.status === 2) ? <span className="font large bold">GAME OVER!</span>
                                    : ""}
                                {(this.state.status === 2) ? <span className="font medium">Score: {this.state.snake.length - 1}</span>
                                    : ""}
                                {(this.state.status === 2) ? <span className="font medium space-nicely space-bottom">Highscore: {this.state.highscore}</span>
                                    : ""}
                                <button id="snake-button-start-game"
                                    className="button-match"
                                    onClick={this.startGame}>Start Game</button>
                                <button id="snake-button-settings"
                                    className="button-match inverse disabled-option space-nicely space-top length-medium"
                                    onClick={() => this.handlePressableButton("settings")}>
                                    <IconContext.Provider value={{ size: "1.5em", className: "global-class-name" }}>
                                        <AiOutlineSetting/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                        </section>
                        {/* Hearts */}
                        {(this.props.gameProps.healthDisplay !== "none") 
                            ? <section id="snake-health"
                                className="flex-center space-nicely space-top not-bottom">
                                {this.props.gameProps.renderHearts(this.state.health).map((heart) => {
                                    return heart;
                                })}
                            </section>
                            : <></>}
                        {/* Settings Popout */}
                        <Draggable cancel="span, .slider, button"
                            position={{
                                x: this.props.defaultProps.popouts.settings.position.x,
                                y: this.props.defaultProps.popouts.settings.position.y
                            }}
                            onStop={(event, data) => {
                                this.props.defaultProps.updatePosition("snake", "games", data.x, data.y, "popout", "settings");
                            }}
                            bounds={this.props.defaultProps.calculateBounds("snake-widget", "snake-popout-settings")}>
                            <section id="snake-popout-settings"
                                className="popout">
                                <section id="snake-popout-animation-settings"
                                    className="popout-animation">
                                    <section className="aesthetic-scale scale-span font large-medium flex-center column gap space-nicely space-all">
                                        {/* Gameplay Settings */}
                                        <section className="section-group">
                                            <span className="font small when-elements-are-not-straight space-nicely space-bottom length-short">
                                                <b>Gameplay</b>
                                            </span>
                                            <section className="element-ends">
                                                <span className="font small">
                                                    Speed
                                                </span>
                                                <button className="button-match inverse when-elements-are-not-straight"
                                                    onClick={this.resetSpeed}>
                                                    <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                                        <BsArrowCounterclockwise/>
                                                    </IconContext.Provider>
                                                </button>
                                            </section>
                                            <Slider className="slider space-nicely space-top length-medium"
                                                onChange={this.changeSpeed}
                                                value={this.state.speed}
                                                min={50}
                                                max={130}
                                                defaultValue={130}
                                                reverse/>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">
                                Created by
                                <a className="font transparent-normal link-match"
                                    href="https://codepen.io/anh194/pen/LwVbew"
                                    target="_blank"> anh</a>
                                &emsp;
                                Modified by Me
                            </span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetSnake);