import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { Fa0, FaExpand, FaRegClock } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { TbMoneybag } from "react-icons/tb";
import { VscDebugBreakpointLogUnverified } from 'react-icons/vsc';
import SimpleBar from 'simplebar-react';


/// Variables
let intervalTimer;
let seenColorsHex = [];
let seenColorsName = [];
let seenColorsImage = [];


class WidgetColorMemory extends Component{
    constructor(props){
        super(props);
        this.state = {
            goldEarned: 0,
            timer: 0,
            score: 0,
            color: "",
            name: "",
            image: "",
            started: false,
            gameover: false
        };
    };
    start(){
        intervalTimer = setInterval(() => {
            this.setState({
                timer: this.state.timer + 1
            });
        }, 1000);
        this.setState({
            goldEarned: 0,
            timer: 0,
            score: 0,
            started: true,
            gameover: false
        }, () => {
            this.resetButtons();   
        });
        document.getElementById("colormemory-button-start")
            .style.visibility = "hidden";
        seenColorsHex = [];
        seenColorsName = [];
        seenColorsImage = [];
        this.randomColor();
    };
    resetButtons(){
        const buttonNew = document.getElementById("colormemory-button-new");
        const buttonSeen = document.getElementById("colormemory-button-seen");
        if(buttonNew.classList.contains("button-correct")){
            buttonNew.classList.remove("button-correct");
            buttonSeen.classList.remove("button-incorrect");
        }else{
            buttonNew.classList.remove("button-incorrect");
            buttonSeen.classList.remove("button-correct");   
        };
    };
    async randomColor(){
        /// 70% - Seen Color
        /// 30% - New color
        const randomChoice = Math.random();
        if((randomChoice < 0.7) && (seenColorsHex.length > 1)){
            let randomSeenColor;
            do{
                randomSeenColor = Math.floor(Math.random() * seenColorsHex.length);
            }while(seenColorsHex[randomSeenColor] === this.state.color);
            this.setState({
                color: seenColorsHex[randomSeenColor],
                name: seenColorsName[randomSeenColor],
                image: seenColorsImage[randomSeenColor]
            });
        }else{
            try{
                const randomColor = (Math.random() * 0xFFFFFF << 0)
                    .toString(16)
                    .padStart(6, '0');
                const response = await fetch(`https://www.thecolorapi.com/id?hex=${randomColor}`);
                const data = await response.json();
                this.setState({
                    color: randomColor,
                    name: data.name.value,
                    image: data.image.bare
                });
            }catch(err){
                console.error(err);
            };
        };
    };
    handleNew(){
        if(seenColorsHex.indexOf(this.state.color) === -1){
            seenColorsHex.push(this.state.color);
            seenColorsName.push(this.state.name);
            seenColorsImage.push(this.state.image);
            this.randomColor();
            this.setState({
                score: this.state.score + 1
            });
        }else{
            document.getElementById("colormemory-button-new")
                .classList.add("button-incorrect");
            document.getElementById("colormemory-button-seen")
                .classList.add("button-correct");
            this.gameover();
        };
    };
    handleSeen(){
        if(seenColorsHex.indexOf(this.state.color) === -1){
            document.getElementById("colormemory-button-new")
                .classList.add("button-correct");
            document.getElementById("colormemory-button-seen")
                .classList.add("button-incorrect");
            this.gameover();
        }else{
            this.randomColor();
            this.setState({
                score: this.state.score + 1
            });
        };
    };
    gameover(){
        clearInterval(intervalTimer);
        this.setState({
            goldEarned: this.state.score,
            gameover: true
        });
        document.getElementById("colormemory-button-start")
            .style.visibility = "visible";
        this.props.gameProps.updateGameValue("gold", this.state.score);
        this.props.gameProps.updateGameValue("exp", this.state.score);
        if(this.state.score >= 10){
            let amount = Math.floor(this.state.score / 10);
            this.props.gameProps.randomItem(amount);
        };
    };
    colorClick(hex){
        let colorRgb = this.props.hexToRgb(`#${hex}`);
        this.props.randomColor(colorRgb[0], colorRgb[1], colorRgb[2]);
    };
    componentWillUnmount(){
        clearInterval(intervalTimer);
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("colormemory")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("colormemory");
                    this.props.defaultProps.updatePosition("colormemory", "games", data.x, data.y);
                }}
                cancel="button, span, .box"
                bounds="parent">
                <div id="colormemory-widget"
                    className="widget">
                    <div id="colormemory-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="colormemory-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("colormemory", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("colormemory", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("colormemory", "close", "games")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
                        {/* Information Container */}
                        <section className="aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold">
                            {/* Score */}
                            <span className="text-animation flex-center row gap">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "green", className: "global-class-name" }}>
                                    <VscDebugBreakpointLogUnverified/>
                                </IconContext.Provider>
                                {this.state.score}
                            </span>
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
                        <div id="colormemory-image"
                            className="box"
                            style={{
                                backgroundImage: `url(${this.state.image})`
                            }}>
                            <span id="colormemory-name"
                                className="text-animation font large white float center">{this.state.name}</span>
                            <button id="colormemory-button-start"
                                className="float center button-match"
                                onClick={() => this.start()}>Start</button>
                        </div>
                        {(this.state.started)
                            ? <section className="grid col-50-50 space-nicely space-top not-bottom length-medium">
                                <button id="colormemory-button-new"
                                    className="button-match"
                                    onClick={() => this.handleNew()}
                                    disabled={this.state.gameover}>New</button>
                                <button id="colormemory-button-seen"
                                    className="button-match"
                                    onClick={() => this.handleSeen()}
                                    disabled={this.state.gameover}>Seen</button>
                            </section>
                            : <></>}
                        {(this.state.gameover)
                            ? <SimpleBar style={{ maxHeight: "13.8em" }}>
                                <section id="colormemory-gameover-colors"
                                    className="aesthetic-scale scale-div flex-center space-nicely space-top not-bottom length-medium">
                                    {seenColorsImage.map((image, index) => {
                                        return <div className="box"
                                            style={{
                                                cursor: "pointer",
                                                width: "3em",
                                                height: "3em",
                                                backgroundImage: `url(${image})`
                                            }}
                                            key={image}
                                            onClick={() => this.colorClick(seenColorsHex[index])}>
                                            <span className="font micro white float center"
                                                style={{
                                                    display: "block",
                                                    position: "relative",
                                                    textAlign: "center"
                                                }}>{seenColorsName[index]}</span>
                                        </div>
                                    })}
                                </section>
                            </SimpleBar>
                            : <></>}
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

export default memo(WidgetColorMemory);