import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


/// Variables
const timeMax = 60;
let timer;


class WidgetTypingTest extends Component{
    constructor(props){
        super(props);
        this.state = {
            time: timeMax,
            mistakes: 0,
            wpm: 0,
            cpm: 0,
            characterIndex: 0,
            isTyping: false
        };
        this.handleTyping = this.handleTyping.bind(this);
        this.handleResetGame = this.handleResetGame.bind(this);
    };
    handleLoadText(what){
        let text;
        let textField = document.querySelector("#typingtest-text p");
        textField.innerHTML = "";
        if(what !== undefined){
            text = what;
        }else{
            text = this.props.randSentence();
        };
        text.split("")
            .forEach((character) => {
                let span = `<span>${character}</span>`;
                textField.innerHTML += span;
            }
        );
        textField.querySelectorAll("span")[0]
            .classList
            .add("active");
    };
    handleTyping(){
        let textField = document.getElementById("typingtest-text");
        let inputField = document.getElementById("typingtest-input-field");
        let characters = textField.querySelectorAll("span");
        let characterTyped = inputField.value
            .split("")[this.state.characterIndex];
        if(this.state.characterIndex < characters.length
            && this.state.time > 0){
            if(!this.state.isTyping){
                timer = setInterval(() => {
                    if(this.state.time > 0){
                        let wpm = Math.round(((this.state.characterIndex - this.state.mistakes) / 5) / (timeMax - this.state.time) * 60);
                        wpm = wpm < 0
                            || !wpm
                            || wpm === Infinity ? 0
                            : wpm;
                        let cpm = (this.state.characterIndex - this.state.mistakes - 1) * (60 / (timeMax - this.state.time));
                        cpm = cpm < 0
                            || !cpm
                            || cpm === Infinity ? 0
                            : cpm;
                        this.setState({
                            time: this.state.time - 1,
                            wpm: wpm,
                            cpm: parseInt(cpm, 10)
                        });
                    }else{
                        clearInterval(timer);
                    };
                }, 1000);
                this.setState({
                    isTyping: true
                });
            };
            if(characterTyped == null){
                if(this.state.characterIndex > 0){
                    this.setState({
                        characterIndex: this.state.characterIndex - 1
                    }, () => {
                        if(characters[this.state.characterIndex].classList.contains("incorrect")){
                            this.setState({
                                mistakes: this.state.mistakes - 1
                            });
                        };
                        characters[this.state.characterIndex]
                            .classList
                            .remove("correct", "incorrect");
                    });
                };
                characters.forEach((span) => {
                    span.classList.remove("active");
                });
                /// End of sentence
                if(this.state.characterIndex + 1 === characters.length){
                    clearInterval(timer);
                    inputField.value = "";    
                }else{;
                    characters[this.state.characterIndex - 1].classList
                        .add("active");
                };    
            }else{
                if(characters[this.state.characterIndex].innerText === characterTyped){
                    characters[this.state.characterIndex]
                        .classList
                        .add("correct");
                }else{
                    this.setState({
                        mistakes: this.state.mistakes + 1
                    });
                    characters[this.state.characterIndex]
                        .classList
                        .add("incorrect");
                };
                this.setState({
                    characterIndex: this.state.characterIndex + 1
                });
                characters.forEach((span) => {
                    span.classList.remove("active");
                });
                /// End of sentence
                if(this.state.characterIndex + 1 === characters.length){
                    clearInterval(timer);
                    inputField.value = "";    
                }else{;
                    characters[this.state.characterIndex + 1].classList
                        .add("active");
                };    
            };
            let wpm = Math.round(((this.state.characterIndex - this.state.mistakes) / 5) / (timeMax - this.state.time) * 60);
            wpm = wpm < 0
                || !wpm
                || wpm === Infinity ? 0
                : wpm;
            let cpm = (this.state.characterIndex - this.state.mistakes - 1) * (60 / (timeMax - this.state.time));
            cpm = cpm < 0
                || !cpm
                || cpm === Infinity ? 0
                : cpm;
            this.setState({
                wpm: wpm,
                cpm: parseInt(cpm, 10)
            });
        };  
    };
    handleResetGame(){
        clearInterval(timer);
        document.getElementById("typingtest-input-field").value = "";
        this.setState({
            time: timeMax,
            mistakes: 0,
            wpm: 0,
            cpm: 0,
            characterIndex: 0,
            isTyping: false
        });
    };
    handleButton(what){
        switch(what){
            case "AZ":
                this.handleLoadText("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                break;
            case "az":
                this.handleLoadText("abcdefghijklmnopqrstuvwxyz");
                break;
            case "ZA":
                this.handleLoadText("ZYXWVUTSRQPONMLKJIHGFEDCBA");
                break;
            case "za":
                this.handleLoadText("zyxwvutsrqponmlkjihgfedcba");
                break;
            default:
                break;
        };
        this.handleResetGame();
    };
    componentDidMount(){
        this.handleLoadText();
        document.getElementById("typingtest-text").addEventListener("click", () => {
            document.getElementById("typingtest-input-field").focus();
        });
    };
    render(){
        return(
            <Draggable 
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("typingtest")}
                onStop={() => this.props.defaultProps.dragStop("typingtest")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("typingtest", "games", data.x, data.y)}
                cancel="button, p"
                bounds="parent">
                <div id="typingtest-widget"
                    className="widget">
                    <div id="typingtest-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="typingtest-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("typingtest", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("typingtest", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Input */}
                        <input id="typingtest-input-field"
                            className="input-invisible"
                            onChange={this.handleTyping}
                            autoComplete="off"></input>
                        {/* Text */}
                        <div id="typingtest-text"
                            className="font large-medium line">
                            <p></p>
                        </div>
                        {/* Information */}
                        <div className="element-ends space-nicely bottom">
                            <div className="flex-center row gap">
                                <span className="font medium bold">Time Left: </span>
                                <span className="font medium">{this.state.time}</span>
                            </div>
                            <div className="flex-center row gap">
                                <span className="font medium bold">Mistakes: </span>
                                <span className="font medium">{this.state.mistakes}</span>
                            </div>
                            <div className="flex-center row gap">
                                <span className="font medium bold">WPM: </span>
                                <span className="font medium">{this.state.wpm}</span>
                            </div>
                            <div className="flex-center row gap">
                                <span className="font medium bold">CPM: </span>
                                <span className="font medium">{this.state.cpm}</span>
                            </div>
                            <button className="btn-match"
                                onClick={() => {
                                    this.handleLoadText()
                                    this.handleResetGame()
                                }}>Try Again</button>
                        </div>
                        {/* Presets */}
                        <div className="flex-center column section-group group-large space-nicely top">
                            <span className="font medium bold line">Presets</span>
                            <div className="flex-center row gap medium">
                                <button className="btn-match option opt-small"
                                    type="button"
                                    onClick={() => this.handleButton("AZ")}>A-Z</button>
                                <button className="btn-match option opt-small"
                                    type="button"
                                    onClick={() => this.handleButton("az")}>a-z</button>
                                <button className="btn-match option opt-small"
                                    type="button"
                                    onClick={() => this.handleButton("ZA")}>Z-A</button>
                                <button className="btn-match option opt-small"
                                    type="button"
                                    onClick={() => this.handleButton("za")}>z-a</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetTypingTest;