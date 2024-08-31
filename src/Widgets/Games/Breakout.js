import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0, FaRegClock } from 'react-icons/fa6';
import { AiOutlineSetting } from 'react-icons/ai';
import { TbMoneybag } from "react-icons/tb";
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


/// Variables
let dx = 2;
let dy = -2;
var intervalGame, intervalTimer;


class WidgetBreakout extends Component{
    constructor(props){
        super(props);
        this.state = {
            paddle: {
                height: 12,
                width: 72,
                x: 0,
                y: 0
            },
            ball: {
                radius: 9,
                x: 0,
                y: 0
            },
            bricks: [],
            brick: {
                column: 10,
                row: 10,
                height: 18,
                width: 54,
                padding: 12
            },
            topOffset: 40,
            leftOffset: 33,
            count: 0,
            score: 0,
            highscore: 0,
            goldEarned: 0,
            gameover: false,
            timer: 0
        };
        this.handleMouse = this.handleMouse.bind(this);
        this.drawPaddle = this.drawPaddle.bind(this);
        this.drawBall = this.drawBall.bind(this);
        this.drawBricks = this.drawBricks.bind(this);
        this.hitDetection = this.hitDetection.bind(this);
        this.moveBall = this.moveBall.bind(this);
        this.playing = this.playing.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    handleMouse(event){
        let elementCanvas = document.getElementById("breakout-canvas");
        let relativeX = event.clientX - elementCanvas.offsetLeft;
        if(relativeX > 0 && relativeX < elementCanvas.width){
            this.setState({
                paddle: {
                    ...this.state.paddle,
                    x: relativeX - (this.state.paddle.width / 2)
                }
            });
        };
    };
    drawPaddle(){
        let elementCanvas = document.getElementById("breakout-canvas");
        let ctx = elementCanvas.getContext("2d");
        ctx.clearRect(0, 0, elementCanvas.width, elementCanvas.height);
        ctx.beginPath();
        ctx.roundRect(this.state.paddle.x, this.state.paddle.y, this.state.paddle.width, this.state.paddle.height, 30);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
    };
    drawBall(){
        let elementCanvas = document.getElementById("breakout-canvas");
        let ctx = elementCanvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(this.state.ball.x, this.state.ball.y, this.state.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
    };
    drawBricks(){
        let elementCanvas = document.getElementById("breakout-canvas");
        let ctx = elementCanvas.getContext("2d");
        for(let c = 0; c < this.state.brick.column; c++){
            for(let r = 0; r < this.state.brick.row; r++){
                if(this.state.bricks[c][r].status === 1){
                    let newBricks = [...this.state.bricks];
                    let brickX = (r * (this.state.brick.width + this.state.brick.padding)) + this.state.leftOffset;
                    let brickY = (c * (this.state.brick.height + this.state.brick.padding)) + this.state.topOffset;
                    newBricks[c][r].x = brickX;
                    newBricks[c][r].y = brickY;
                    this.setState({
                        bricks: [...newBricks]
                    });
                    ctx.beginPath();
                    ctx.roundRect(brickX, brickY, this.state.brick.width, this.state.brick.height, 30);
                    ctx.fillStyle = this.state.bricks[c][r].color;
                    ctx.fill();
                    ctx.closePath();
                };
            };
        };    
    };
    hitDetection(){
        for(let c = 0; c < this.state.brick.column; c++){
            for(let r = 0; r < this.state.brick.row; r++){
                let b = this.state.bricks[c][r];
                if(b.status === 1){
                    if(this.state.ball.x > b.x && this.state.ball.x< b.x + this.state.brick.width && this.state.ball.y > b.y && this.state.ball.y < b.y + this.state.brick.height){
                        dy = -dy;
                        b.status = 0;
                        this.setState({
                            count: this.state.count - 1,
                            score: this.state.score + 1,
                            goldEarned: this.state.goldEarned + 1
                        }, () => {
                            /// Win
                            if(this.state.count === 0){
                                this.generateBricks();
                            };
                        });
                    };
                };
            };
        };
    };
    moveBall(){
        let elementCanvas = document.getElementById("breakout-canvas");
        /// Detect left and right walls
        if(this.state.ball.x + dx > elementCanvas.width - this.state.ball.radius || this.state.ball.x + dx < this.state.ball.radius){
            dx = -dx;
        };
        /// Detect top wall
        if(this.state.ball.y + dy < this.state.ball.radius){
            dy = -dy;
        }else if(this.state.ball.y + dy > (elementCanvas.height - 50) - this.state.ball.radius){
            /// Detect paddle hits
            if(this.state.ball.x > this.state.paddle.x && this.state.ball.x < this.state.paddle.x + this.state.paddle.width){
                dy = -dy;
            };
        };
        /// Bottom wall (lose)
        if(this.state.ball.y + dy > elementCanvas.height - this.state.ball.radius || this.state.ball.y + dy < this.state.ball.radius){
            this.gameOver();
        };
        /// Move Ball
        this.setState({
            ball: {
                ...this.state.ball,
                x: this.state.ball.x + dx,
                y: this.state.ball.y + dy
            }
        });
    };
    generateBricks(){
        let randomPattern = Math.floor(Math.random() * this.props.patterns.length);
        let patternString = this.props.patterns[randomPattern].replace(/\s/g, "");
        let charCount = 0;
        let newBricks = [];
        let newBrickCount = 0;
        let brickColor = "";
        let brickStatus = 0;
        for(let c = 0; c < this.state.brick.column; c++){
            newBricks[c] = [];
            for(let r = 0; r < this.state.brick.row; r++){
                let char = patternString.charAt(charCount);
                /// Set brick color
                switch(char){
                    case "1":
                        brickColor = "black";
                        break;
                    case "b":
                        brickColor = "blue";
                        break;
                    case "g":
                        brickColor = "green";
                        break;
                    case "o":
                        brickColor = "orange";
                        break;
                    case "p":
                        brickColor = "pink";
                        break;
                    case "r":
                        brickColor = "red";
                        break;
                    case "v":
                        brickColor = "violet";
                        break;
                    case "y":
                        brickColor = "yellow";
                        break;
                    default:
                        break;
                };
                /// Set brick status
                if(char !== "0"){
                    brickStatus = 1;
                    newBrickCount++;
                }else{
                    brickStatus = 0;
                };
                newBricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: brickStatus,
                    color: brickColor
                };
                charCount++;
            };
        };
        this.setState({
            bricks: [...newBricks],
            count: newBrickCount
        });
    };
    start(){
        dx = 2;
        dy = -2;
        let elementCanvas = document.getElementById("breakout-canvas");
        this.setState({
            ball: {
                ...this.state.ball,
                x: Math.random() * (elementCanvas.width - 100) + 100,
                y: elementCanvas.height - 90
            },
            goldEarned: 0,
            timer: 0,
            score: 0
        });
        this.generateBricks();
        intervalGame = setInterval(this.playing, 10);
        intervalTimer = setInterval(() => {
            this.setState({
                timer: this.state.timer + 1
            });
        }, 1000);
        document.getElementById("breakout-overlay-gameover")
            .style
            .visibility = "hidden";
    };
    playing(){
        this.drawPaddle();
        this.drawBall();
        this.drawBricks();
        this.hitDetection();
        this.moveBall();
    };
    gameOver(){
        clearInterval(intervalGame);
        clearInterval(intervalTimer);
        this.setState({
            gameover: true,
            highscore: (this.state.score > this.state.highscore) ? this.state.score : this.state.highscore
        });
        if(this.state.score >= 100){
            let amount = Math.floor(this.state.score / 100);
            this.props.gameProps.randomItem(amount);
        };
        this.props.gameProps.updateGameValue("gold", this.state.goldEarned);
        document.getElementById("breakout-overlay-gameover")
            .style
            .visibility = "visible";
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["games"]["breakout"] = {
                ...dataLocalStorage["games"]["breakout"],
                highscore: this.state.highscore
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    componentDidMount(){
        window.addEventListener("beforeunload", this.storeData);
        /// Load widget's data from local storage
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            let localStorageBreakout = dataLocalStorage["games"]["breakout"];
            if(localStorageBreakout["highscore"] !== undefined){
                this.setState({
                    highscore: localStorageBreakout["highscore"]
                });
            };
        };
        let elementCanvas = document.getElementById("breakout-canvas");
        let startingBricks = [];
        for(let c = 0; c < this.state.brick.column; c++){
            startingBricks[c] = [];
            for(let r = 0; r < this.state.brick.row; r++){
                /// Set position of bricks
                startingBricks[c][r] = { x: 0, y: 0, status: 1 };
            };
        };
        this.setState({
            paddle: {
                ...this.state.paddle,
                x: (elementCanvas.width - this.state.paddle.width) / 2,
                y: (elementCanvas.height - 50) - this.state.paddle.height
            },
            bricks: [...startingBricks]
        }, () => {
            this.drawPaddle();
            this.drawBricks();
        });
        document.getElementById("breakout-overlay-gameover")
            .style
            .visibility = "visible";
    };
    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.storeData);
        this.storeData();
        clearInterval(intervalGame);
        clearInterval(intervalTimer);
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("breakout")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("breakout");
                    this.props.defaultProps.updatePosition("breakout", "games", data.x, data.y);
                }}
                cancel="button"
                bounds="parent">
                <div id="breakout-widget"
                    className="widget">
                    <div id="breakout-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="breakout-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("breakout", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("breakout", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Information Container */}
                        <section className="aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold">
                            {/* Gold Earned */}
                            <span className="flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                <span className="font small bold">+</span>
                                {this.state.goldEarned}
                            </span>
                            {/* Total Gold */}
                            <span className="flex-center row float middle">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                {this.props.gameProps.formatNumber(this.props.gameProps.gold, 1)}
                            </span>
                            {/* Timer */}
                            <span className="flex-center row gap">
                                <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                    <FaRegClock/>
                                </IconContext.Provider>
                                {this.state.timer}
                            </span>
                        </section>
                        {/* Game Canvas */}
                        <canvas id="breakout-canvas"
                            height={600}
                            width={700}
                            onMouseMove={this.handleMouse}/>
                        {/* Gameover Overlay */}
                        <section id="breakout-overlay-gameover"
                            className="aesthetic-scale scale-span overlay rounded flex-center column gap">
                            {(this.state.gameover)
                                ? <div className="flex-center column gap">
                                    <span className="font large bold">GAME OVER!</span>
                                    <span className="font medium">Score: {this.state.score}</span>
                                    <span className="font medium space-nicely space-bottom">Highscore: {this.state.highscore}</span>
                                </div>
                                : <></>}
                            <button className="button-match" 
                                type="button"
                                onClick={() => this.start()}>Start Game</button>
                            {/* <button id="breakout-button-settings"
                                className="button-match inverse disabled-option space-nicely space-top length-medium"
                                onClick={() => this.handlePressableButton()}>
                                <IconContext.Provider value={{ size: "1.5em", className: "global-class-name" }}>
                                    <AiOutlineSetting/>
                                </IconContext.Provider>
                            </button> */}
                        </section>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Me</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetBreakout;