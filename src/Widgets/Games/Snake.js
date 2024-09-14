import Slider from 'rc-slider';
import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import { Fa0, FaExpand, FaRegClock } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { TbMoneybag } from "react-icons/tb";


//////////////////// Functions ////////////////////
function shallowEquals(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length)
        return false;
    let equals = true;
    for (var i = 0; i < arr1.length; i++) {
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

/// Displays a single cell
function GridCell(props) {
    const classes = `grid-cell 
        ${props.foodCell ? "grid-cell--food" : ""} 
        ${props.snakeCell ? "grid-cell--snake" : ""}
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


/// Variables
var intervalTimer;
var timeoutInvulnerabilityFrames;


class WidgetSnake extends Component{
    constructor(props){
        super(props);
        this.state = {
            goldEarned: 0,
            timer: 0,
            size: 24,
            settings: false,
            startMoving: false,
            snake: [],
            food: [],
            highscore: 0,
            status: 0,          /// 0 = not started, 1 = in progress, 2 = finished
            direction: 0,       /// Using keycodes to indicate direction
            speed: 130,
            maxHealth: 1,
            health: 1
        };
        this.storeData = this.storeData.bind(this);
        this.resizer = this.resizer.bind(this);
        this.moveFood = this.moveFood.bind(this);
        this.checkIfAteFood = this.checkIfAteFood.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.moveSnake = this.moveSnake.bind(this);
        this.doesntOverlap = this.doesntOverlap.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.removeTimers = this.removeTimers.bind(this);
        this.changeSpeed = this.changeSpeed.bind(this);
        this.resetSpeed = this.resetSpeed.bind(this);
    };
    resizer(){
        if(window.innerWidth < 450){
            this.setState({
                size: (window.innerWidth / 16) - 4
            });
        }else{
            this.setState({
                size: 24
            });
        };
    };
    /// Randomly place snake food
    moveFood(){
        const x = parseInt(Math.random() * this.numCells);
        const y = parseInt(Math.random() * this.numCells);
        this.setState({
            food: [x, y]
        });
    };
    setDirection({keyCode}){
        if(this.state.status !== 0 || this.state.status !== 2){
            const re = new RegExp("\\b83|40|87|38|68|39|65|37\\b");
            if(this.state.startMoving === true
                && re.test(keyCode)){
                this.moveSnakeInterval = setInterval(this.moveSnake, this.state.speed);
                intervalTimer = setInterval(() => {
                    this.setState({
                        timer: this.state.timer + 1
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
        };
    };
    moveSnake(){
        const newSnake = [];
        /// Set in the new "head" of the snake
        switch(this.state.direction){
            /// Down
            case 83:
            case 40:
                newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
                break;
            /// Up
            case 87:
            case 38:
                newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
                break;
            /// Right
            case 68:
            case 39:
                newSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
                break;
            /// Left
            case 65:
            case 37:
                newSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
                break;
            default:
                break;
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
            this.setState({
                health: this.state.health - 1
            }, () => {
                if(this.state.health <= 0){
                    this.endGame()
                }else{
                    timeoutInvulnerabilityFrames = setTimeout(() => {
                        timeoutInvulnerabilityFrames = undefined;
                    }, 1000);
                };
            });
        }else{
            this.setState({
                snake: newSnake
            });
            this.checkIfAteFood(newSnake);
        };
    };
    checkIfAteFood(newSnake){
        if(!shallowEquals(newSnake[0], this.state.food))
            return
        /// Snake gets longer
        let newSnakeSegment;
        const lastSegment = newSnake[newSnake.length - 1];
        /// Where should we position the new snake segment?
        //// Here are some potential positions, we can choose the best looking one
        let lastPositionOptions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        /// The snake is moving along the y-axis, so try that instead
        if(newSnake.length > 1){
            lastPositionOptions[0] = arrayDiff(lastSegment, newSnake[newSnake.length - 2]);
        };
        for(var i = 0; i < lastPositionOptions.length; i++){
            newSnakeSegment = [
                lastSegment[0] + lastPositionOptions[i][0],
                lastSegment[1] + lastPositionOptions[i][1]
            ];
            if(this.isValid(newSnakeSegment)){
                break;
            };
        };
        this.setState({
            goldEarned: this.state.goldEarned + 1,
            snake: newSnake.concat([newSnakeSegment]),
            food: []
        });
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
            health: this.state.maxHealth
        });
        this.el.focus();
    };
    endGame(){
        this.removeTimers();
        clearInterval(intervalTimer);
        if((this.state.snake.length - 1) >= 10){
            let amount = Math.floor((this.state.snake.length - 1) / 10);
            this.props.gameProps.randomItem(amount);
        };
        this.props.gameProps.updateGameValue("gold", this.state.goldEarned);
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
        clearTimeout(timeoutInvulnerabilityFrames);
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
                const popoutSettings = document.getElementById("snake-popout-settings");
                if(this.state.settings === false){
                    this.setState({
                        settings: true
                    });
                    buttonSettings.style.opacity = "1";
                    popoutSettings.style.visibility = "visible";
                }else{
                    this.setState({
                        settings: false
                    });
                    buttonSettings.style.opacity = "0.5";
                    popoutSettings.style.visibility = "hidden";
                };
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
        window.addEventListener("resize", this.resizer);
        window.addEventListener("beforeunload", this.storeData);
        /// Load widget's data from local storage
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
        /// Set stats
        let calculateMaxHealth = this.calculateHealth();
        this.setState({
            maxHealth: calculateMaxHealth,
            health: calculateMaxHealth
        });
    };
    componentWillUnmount(){
        window.removeEventListener("resize", this.resizer);
        window.removeEventListener("beforeunload", this.storeData);
        this.removeTimers();
        this.storeData();
    };
    render(){
        /// Each cell should be approximately 0.9375em wide, so calculate how many we need
        this.numCells = Math.floor(this.state.size / 0.9375);
        const cellSize = this.state.size / this.numCells;
        const cellIndexes = Array.from(Array(this.numCells).keys());
        const cells = cellIndexes.map(y => {
            return cellIndexes.map(x => {
                const foodCell = this.state.food[0] === x && this.state.food[1] === y;
                let snakeCell = this.state.snake.filter(c => c[0] === x && c[1] === y);
                snakeCell = snakeCell.length && snakeCell[0];
                return(
                    <GridCell foodCell={foodCell}
                        snakeCell={snakeCell}
                        size={cellSize}
                        key={x + " " + y}/>
                );
            });
        });
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("snake")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("snake");
                    this.props.defaultProps.updatePosition("snake", "games", data.x, data.y);
                }}
                cancel="button, section"
                bounds="parent">
                <div id="snake-widget"
                    className="widget">
                    <div id="snake-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="snake-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("snake", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("snake", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("snake", "close", "games")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
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
                            <span className="text-animation flex-center row float middle">
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
                            onKeyDown={this.setDirection}
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
                                className="aesthetic-scale scale-span overlay flex-center column gap">
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
                        <Draggable
                            cancel="span, .slider, button"
                            defaultPosition={{x: 120, y: -25}}
                            bounds={{top: -200, left: -250, right: 200, bottom: 0}}>
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
                            ? <span className="font smaller transparent-normal author-name">Created by ?&emsp;Modified by Me</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetSnake);