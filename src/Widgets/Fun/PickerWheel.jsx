import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';


/// Variables
let audioSpin = new Audio("/resources/audio/spin.wav");
let size = 290;
let centerX = 300;
let centerY = 300;
let intervalSpin;
let angleCurrent = 0;
let angleDelta = 0;
let spinStart = 0;


class WidgetPickerWheel extends Component{
    constructor(props){
        super(props);
        this.state = {
            segments: ["Me", "I", "Myself", "Yours truly", "Ourself"],
            segmentsColor: ["#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#FF9000"],
            winner: "",
            finished: true,
            maxSpeed: 0,
            duration: 0
        };  
        this.spin = this.spin.bind(this);
        this.onTimerTick = this.onTimerTick.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    handleClick(what){
        let inputValue = document.getElementById("pickerwheel-input").value;
        switch(what){
            case "add":
                if(inputValue !== ""){
                    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
                    this.setState({
                        segments: [...this.state.segments, inputValue],
                        segmentsColor: [...this.state.segmentsColor, `#${randomColor}`]
                    }, () => {
                        this.draw();
                    });
                };
                break;
            case "remove":
                if(inputValue !== ""){
                    let indexRemove = this.state.segments.findIndex((item) => item.toLowerCase() === inputValue.toLowerCase());
                    if(indexRemove > -1){
                        this.setState({
                            segments: [...this.state.segments.slice(0, indexRemove), ...this.state.segments.slice(indexRemove + 1, this.state.segments.length)],
                            segmentsColor: [...this.state.segmentsColor.slice(0, indexRemove), ...this.state.segmentsColor.slice(indexRemove + 1, this.state.segmentsColor.length)]
                        }, () => {
                            this.draw();    
                        });
                    };
                };
                break;
            case "removeAll":
                if(this.state.segments.length){
                    this.setState({
                        segments: [],
                        segmentsColor: []
                    }, () => {
                        this.draw();    
                    });
                };
                break;
            default:
                break;
        };
    };
    handleOverlay(){
        document.getElementById("pickerwheel-overlay-winner")
            .style
            .visibility = "hidden";
    };
    spin(){
        if(!intervalSpin && this.state.segments.length){
            this.props.defaultProps.playAudio(audioSpin);
            this.setState({
                finished: false,
                maxSpeed: Math.PI / this.state.segments.length,
                duration: 0
            });
            intervalSpin = setInterval(this.onTimerTick, this.state.segments.length);
            spinStart = new Date().getTime();
        };
    };
    onTimerTick(){
        let upDuration = this.state.segments.length * 500;
        let downDuration = this.state.segments.length * 700;
        let progress = 0;
        this.draw();
        this.setState({
            duration: new Date().getTime() - spinStart
        });
        if(this.state.duration < upDuration){
            progress = this.state.duration / upDuration;
            angleDelta = this.state.maxSpeed * Math.sin((progress * Math.PI) / 2);
        }else{
            progress = this.state.duration / downDuration;
            if(progress >= 0.8){
                angleDelta =
                    (this.state.maxSpeed / 2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            }else if(progress >= 0.6){
                angleDelta =
                    (this.state.maxSpeed / 1.2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            }else{
                angleDelta =
                    this.state.maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            };
            if(progress >= 1){
                this.setState({
                    finished: true
                });
            };
        };
        angleCurrent += angleDelta;
        while(angleCurrent >= Math.PI * 2){
            angleCurrent -= Math.PI * 2;
        };
        if(this.state.finished){
            clearInterval(intervalSpin);
            intervalSpin = "";
            angleDelta = 0;
            document.getElementById("pickerwheel-overlay-winner")
                .style
                .visibility = "visible";
        };
    };
    draw(){
        let canvas = document.getElementById("pickerwheel-canvas-wheel");
        let ctx = canvas.getContext("2d");
        let change = angleCurrent + Math.PI / 2;
        let i = this.state.segments.length - Math.floor((change / (Math.PI * 2)) * this.state.segments.length) - 1;
        let lastAngle = angleCurrent;
        let len = this.state.segments.length;
        const PI2 = Math.PI * 2;
        if(i < 0){
            i = i + this.state.segments.length;
        };
        if(len === 0){
            ctx.clearRect(0, 0, 600, 600);
        };
        this.setState({
            winner: this.state.segments[i]
        });
        //#region Wheel style
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "1em proxima-nova";
        //#endregion
        //#region Draw segments
        for(let i = 1; i <= len; i++){
            const angle = PI2 * (i / len) + angleCurrent;
            const value = this.state.segments[i - 1];
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, size, lastAngle, angle, false);
            ctx.lineTo(centerX, centerY);
            ctx.closePath();
            ctx.fillStyle = this.state.segmentsColor[i - 1];
            ctx.fill();
            ctx.stroke();
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((lastAngle + angle) / 2);
            ctx.fillStyle = "white";
            ctx.font = "bold 1.4em proxima-nova";
            ctx.fillText(value.substring(0, 21), size / 2 + 20, 0);
            ctx.restore();    
            lastAngle = angle;
        };
        //#endregion
        //#region Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, PI2, false);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.props.color;
        ctx.fill();
        ctx.font = "bold 2em proxima-nova";
        ctx.fillStyle = this.props.color;
        ctx.textAlign = "center";
        ctx.fillText("Spin", centerX, centerY + 3);
        ctx.stroke();
        //#endregion
        //#region Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, PI2, false);
        ctx.closePath();
        ctx.lineWidth = 20;
        ctx.strokeStyle = this.props.color;
        ctx.stroke();
        //#endregion
        //#region Draw needle
        ctx.beginPath();
        ctx.moveTo(centerX + 10, centerY - 40);
        ctx.lineTo(centerX - 10, centerY - 40);
        ctx.lineTo(centerX, centerY - 60);
        ctx.closePath();
        ctx.fill();
        //#endregion
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["fun"]["pickerwheel"] = {
                ...dataLocalStorage["fun"]["pickerwheel"],
                segments: [...this.state.segments],
                segmentsColor: [...this.state.segmentsColor]
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    componentDidUpdate(prevProps){
        if(this.props.color !== prevProps.color){
            this.draw();
        };
    };
    componentDidMount(){
        window.addEventListener("beforeunload", this.storeData);
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            if(dataLocalStorage["fun"]["pickerwheel"].segments !== undefined){
                this.setState({
                    segments: [...dataLocalStorage["fun"]["pickerwheel"].segments],
                    segmentsColor: [...dataLocalStorage["fun"]["pickerwheel"].segmentsColor]
                }, () => {
                    this.draw();    
                });
            }else{
                this.draw();
            };
        };
    };
    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.storeData);
        this.storeData();
        clearInterval(intervalSpin);
    };
    render(){
        return(
            <Draggable position={{ x: this.props.position.x, y: this.props.position.y }}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("pickerwheel")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("pickerwheel");
                    this.props.defaultProps.updatePosition("pickerwheel", "fun", data.x, data.y);
                }}
                cancel="button, span, input"
                bounds="parent">
                <div id="pickerwheel-widget"
                    className="widget">
                    <div id="pickerwheel-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="pickerwheel-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("pickerwheel", "fun")}
                        {/* Input */}
                        <section className="flex-center wrap row gap space-nicely space-bottom length-longer">
                            <input id="pickerwheel-input"
                                className="input-match"/>
                            <button className="button-match with-input"
                                onClick={() => this.handleClick("add")}
                                disabled={!this.state.finished}>Add</button>
                            <button className="button-match with-input"
                                onClick={() => this.handleClick("remove")}
                                disabled={!this.state.finished}>Remove</button>
                            <button className="button-match with-input"
                                onClick={() => this.handleClick("removeAll")}
                                disabled={!this.state.finished}>Remove All</button>
                        </section>
                        {/* Wheel */}
                        <canvas id="pickerwheel-canvas-wheel"
                            width={"600"}
                            height={"600"}/>
                        {/* Invisible Spin Button */}
                        <button id="pickerwheel-button-spin"
                            onClick={this.spin}></button>
                        {/* Winner Overlay */}
                        <section id="pickerwheel-overlay-winner"
                            className="overlay rounded flex-center">
                            <span className="text-animation aesthetic-scale scale-self font largerer bold break-word"
                               onClick={this.handleOverlay}>{this.state.winner}</span>
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

export default memo(WidgetPickerWheel);