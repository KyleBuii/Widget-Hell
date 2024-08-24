import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { TbMoneybag } from "react-icons/tb";
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


/// Variables
const timeMax = 60;
let timer;


class WidgetTypingTest extends Component{
    constructor(props){
        super(props);
        this.state = {
            moneyEarned: 0,
            time: timeMax,
            mistakes: 0,
            wrongStrokes: 0,
            wpm: 0,
            cpm: 0,
            characterIndex: 0,
            isTyping: false
        };
        this.handleTyping = this.handleTyping.bind(this);
        this.handleResetGame = this.handleResetGame.bind(this);
        this.gameOver = this.gameOver.bind(this);
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
                        textField.style.opacity = "0.5";
                        this.gameOver();
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
                        mistakes: this.state.mistakes + 1,
                        wrongStrokes: this.state.wrongStrokes + 1
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
                    inputField.value = "";
                    this.gameOver();
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
    gameOver(){
        if(this.state.wpm >= 40){
            this.props.gameProps.randomItem();
        };
        clearInterval(timer);
        this.setState({
            moneyEarned: this.state.wpm
        });
        this.props.gameProps.updateMoney(this.state.wpm);
    };
    handleResetGame(){
        clearInterval(timer);
        document.getElementById("typingtest-text").style.opacity = "1";
        document.getElementById("typingtest-input-field").value = "";
        this.setState({
            moneyEarned: 0,
            time: timeMax,
            mistakes: 0,
            wpm: 0,
            cpm: 0,
            characterIndex: 0,
            isTyping: false
        });
    };
    handleButton(what, amount){
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
            case "brainrot":
                let words = "skibidi gyatt rizz only in ohio duke dennis did you pray today livvy dunne rizzing up baby gronk sussy imposter pibby glitch in real life sigma alpha omega male grindset andrew tate goon cave freddy fazbear colleen ballinger smurf cat vs strawberry elephant blud dawg shmlawg ishowspeed a whole bunch of turbulence ambatukam bro really thinks he's carti literally hitting the griddy the ocky way kai cenat fanum tax garten of banban no edging in class not the mosquito again bussing axel in harlem whopper whopper whopper whopper 1 2 buckle my shoe goofy ahh aiden ross sin city monday left me broken quirked up white boy busting it down sexual style goated with the sauce john pork grimace shake kiki do you love me huggy wuggy nathaniel b lightskin stare biggest bird omar the referee amogus uncanny wholesome reddit chungus keanu reeves pizza tower zesty poggers kumalala savesta quandale dingle glizzy rose toy ankha zone thug shaker morbin time dj khaled sisyphus oceangate shadow wizard money gang ayo the pizza here PLUH nair butthole waxing t-pose ugandan knuckles family guy funny moments compilation with subway surfers gameplay at the bottom nickeh30 ratio uwu delulu opium bird cg5 mewing fortnite battle pass all my fellas gta 6 backrooms gigachad based cringe kino redpilled no nut november pokénut november wojak literally 1984 foot fetish F in the chat i love lean looksmaxxing gassy incredible theodore john kaczynski social credit bing chilling xbox live mrbeast kid named finger better caul saul i am a surgeon one in a krillion hit or miss i guess they never miss huh i like ya cut g ice spice we go gym kevin james josh hutcherson edit coffin of andy and leyley metal pipe falling"
                    .split(" ");
                let indexRandom = Math.floor(Math.random() * words.length);
                let indexRandomMax = indexRandom + 100;
                let isOverLength = (indexRandomMax > words.length - 1) ? true : false;
                let sentence = [
                    ...words.slice(
                        indexRandom,
                        (indexRandomMax > words.length - 1)
                            ? words.length
                            : indexRandomMax
                    )
                ];
                if(isOverLength){
                    sentence.push(
                        ...words.slice(
                            0,
                            (indexRandomMax - words.length)
                        )
                    )
                };
                this.handleLoadText(sentence.join(" "));
                break;
            case "numbers":
                let stringNumber = "";
                for(let i = 0; i < amount; i++){
                    stringNumber += (Math.random() * 10).toString().replace(".", "");
                };
                this.handleLoadText(stringNumber);
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
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("typingtest");
                    this.props.defaultProps.updatePosition("typingtest", "games", data.x, data.y);
                }}
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
                        {/* Information Container */}
                        <section className="element-ends space-nicely bottom font medium bold">
                            {/* Money Earned */}
                            <span className="flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                <span className="font small bold">+</span>
                                {this.state.moneyEarned}
                            </span>
                            {/* Total Money */}
                            <span className="flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                {this.props.gameProps.formatNumber(this.props.gameProps.money, 1)}
                            </span>
                        </section>
                        {/* Input */}
                        <input id="typingtest-input-field"
                            className="input-invisible"
                            onChange={this.handleTyping}
                            autoComplete="off"></input>
                        {/* Text */}
                        <div id="typingtest-text"
                            className="font large-medium line bellow">
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
                                <span className="font medium">{this.state.mistakes} | {this.state.wrongStrokes}</span>
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
                            <span className="font medium bold line bellow">Presets</span>
                            <div className="flex-center column gap medium">
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
                                    <button className="btn-match option opt-small"
                                        type="button"
                                        onClick={() => this.handleButton("brainrot")}>Brainrot</button>
                                </div>
                                <div className="flex-center row gap medium">
                                    <button className="btn-match option opt-small"
                                        type="button"
                                        onClick={() => this.handleButton("numbers", 1)}>1-9: 16</button>
                                    <button className="btn-match option opt-small"
                                        type="button"
                                        onClick={() => this.handleButton("numbers", 2)}>1-9: 32</button>
                                    <button className="btn-match option opt-small"
                                        type="button"
                                        onClick={() => this.handleButton("numbers", 3)}>1-9: 48</button>
                                </div>
                            </div>
                        </div>
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

export default WidgetTypingTest;