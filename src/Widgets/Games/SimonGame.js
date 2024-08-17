import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import Slider from 'rc-slider';


/// Variables
let colors = {
    1: { current: "#3edd4b", new: "#116017" },
    2: { current: "#dd4b3e", new: "#601711" },
    3: { current: "#ffea37", new: "#7c6f00" },
    4: { current: "#4b3edd", new: "#171160" }
};
let colorsPath = [];


class WidgetSimonGame extends Component{
    constructor(props){
        super(props);
        this.state = {
            score: 0,
            highscore: 0,
            counter: 0,
            clickCounter: 0,
            pathGenerating: false,
            gameover: false,
            settings: false,
            speed: 600
        };
        this.handleColorClick = this.handleColorClick.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    randomColor(){
        let colorsKeys = Object.keys(colors);
        return colorsKeys[Math.floor(Math.random() * colorsKeys.length)];
    };
    async delay(time){
        return await new Promise((resolve) => setTimeout(resolve, time));
    };
    async randomPath(){
        colorsPath.push(this.randomColor());
        this.setState({
            score: colorsPath.length,
            pathGenerating: true
        });
        await this.showPath(colorsPath);
    };
    async showPath(path){
        for(let color of path){
            let currentColor = document.getElementById(`simongame-color-${color}`);
            await this.delay(500);
            currentColor.style.backgroundColor = colors[color].new;
            await this.delay(this.state.speed);
            currentColor.style.backgroundColor = colors[color].current;
        };
        this.setState({
            pathGenerating: false
        });
    };
    start(){
        if(this.state.settings === true){
            this.setState({
                settings: false
            });
            document.getElementById("simongame-button-settings").style.opacity = "0.5";
            document.getElementById("simongame-popout-settings").style.visibility = "hidden";
        };
        document.getElementById("simongame-overlay-gameover")
            .style
            .visibility = "hidden";
        this.setState({
            score: 0,
            clickCounter: 0,
            pathGenerating: false,
            gameover: false
        });
        colorsPath = [];
        this.randomPath();
    };
    gameover(){
        this.setState({
            highscore: (this.state.highscore > this.state.score)
                ? this.state.highscore
                : this.state.score,
            gameover: true
        });
        document.getElementById("simongame-overlay-gameover")
            .style
            .visibility = "visible";
    };
    async handleColorClick(event){
        if(this.state.pathGenerating){
            return false;
        };
        if(event.target.id === `simongame-color-${colorsPath[this.state.clickCounter]}`){
            event.target.style.backgroundColor = colors[colorsPath[this.state.clickCounter]].new;
            await this.delay(100);
            event.target.style.backgroundColor = colors[colorsPath[this.state.clickCounter]].current;
            this.setState({
                clickCounter: this.state.clickCounter + 1
            }, () => {
                if(this.state.clickCounter === this.state.score){
                    this.setState({
                        clickCounter: 0
                    });
                    this.randomPath();
                };
            });
        }else{
            this.gameover();
        };
    };
    handlePressableButton(){
        const buttonSettings = document.getElementById("simongame-button-settings");
        const popoutSettings = document.getElementById("simongame-popout-settings");
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
    };
    handleSetting(what, action, value){
        switch(what){
            case "speed":
                switch(action){
                    case "reset":
                        this.setState({
                            speed: 600
                        });
                        break;
                    case "change":
                        this.setState({
                            speed: value
                        });
                        break;
                    default:
                        break;
                };
                break;
            default:
                break;
        };
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["games"]["simongame"] = {
                ...dataLocalStorage["games"]["simongame"],
                highscore: this.state.highscore,
                speed: this.state.speed
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    componentDidMount(){
        document.getElementById("simongame-overlay-gameover")
            .style
            .visibility = "visible";
        window.addEventListener("beforeunload", this.storeData);
        /// Load widget's data from local storage
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            let localStorageSimonGame = dataLocalStorage["games"]["simongame"];
            if(localStorageSimonGame["highscore"] !== undefined){
                this.setState({
                    highscore: localStorageSimonGame["highscore"],
                    speed: localStorageSimonGame["speed"]
                });
            };
        };    
    };
    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.storeData);
        this.storeData();
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("simongame")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("simongame");
                    this.props.defaultProps.updatePosition("simongame", "games", data.x, data.y);
                }}
                cancel="button, span, #simongame-container, #simongame-counter-light, .popout"
                bounds="parent">
                <div id="simongame-widget"
                    className="widget">
                    <div id="simongame-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="simongame-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("simongame", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("simongame", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Game Container */}
                        <section id="simongame-container"
                            className="grid col-auto box">
                            <div id="simongame-color-1"
                                className="box"
                                onClick={(event) => this.handleColorClick(event)}></div>
                            <div id="simongame-color-2"
                                className="box"
                                onClick={(event) => this.handleColorClick(event)}></div>
                            <div id="simongame-color-3"
                                className="box"
                                onClick={(event) => this.handleColorClick(event)}></div>
                            <div id="simongame-color-4"
                                className="box"
                                onClick={(event) => this.handleColorClick(event)}></div>
                        </section>
                        {/* Counter and Light Indicator */}
                        <div id="simongame-counter-light"
                            className="float middle font large bold circle">
                            <span className="float middle circle"
                                style={{
                                    backgroundColor: (this.state.pathGenerating) ? "red" : "green"
                                }}></span>
                            <span className="float middle">{this.state.score}</span>
                        </div>
                        {/* Gameover Overlay */}
                        <section id="simongame-overlay-gameover"
                            className="overlay rounded flex-center column gap">
                            {(this.state.gameover)
                                ? <div className="flex-center column gap">
                                    <span className="font large bold">GAME OVER!</span>
                                    <span className="font medium">Score: {this.state.score}</span>
                                    <span className="font medium space-nicely bottom">Highscore: {this.state.highscore}</span>
                                </div>
                                : <></>}
                            <button className="btn-match" 
                                type="button"
                                onClick={() => this.start()}>Start Game</button>
                            <button id="simongame-button-settings"
                                className="btn-match inverse disabled-option space-nicely top medium"
                                onClick={() => this.handlePressableButton()}>
                                <IconContext.Provider value={{ size: "1.5em", className: "global-class-name" }}>
                                    <AiOutlineSetting/>
                                </IconContext.Provider>
                            </button>
                        </section>
                        {/* Settings Popout */}
                        <Draggable
                            cancel="span, .slider, button"
                            defaultPosition={{x: 120, y: -25}}
                            bounds={{top: -200, left: -250, right: 200, bottom: 0}}>
                            <section id="simongame-popout-settings"
                                className="popout">
                                <section id="simongame-popout-animation-settings"
                                    className="popout-animation">
                                    <section className="font large-medium flex-center column gap space-nicely all">
                                        <section className="section-group">
                                            <span className="font small when-elements-are-not-straight space-nicely bottom short">
                                                <b>Gameplay</b>
                                            </span>
                                            <section className="element-ends">
                                                <span className="font small">
                                                    Speed
                                                </span>
                                                <button className="btn-match inverse when-elements-are-not-straight"
                                                    onClick={() => this.handleSetting("speed", "reset")}>
                                                    <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                                        <BsArrowCounterclockwise/>
                                                    </IconContext.Provider>
                                                </button>
                                            </section>
                                            <Slider className="slider space-nicely top medium"
                                                onChange={(event) => this.handleSetting("speed", "change", event)}
                                                value={this.state.speed}
                                                min={1}
                                                max={1000}
                                                marks={{
                                                    600: {
                                                        label: 600,
                                                        style: {display: "none" }
                                                    }
                                                }}
                                                defaultValue={600}
                                                reverse/>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
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

export default WidgetSimonGame;