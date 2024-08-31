import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { TbMoneybag } from "react-icons/tb";
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


/// Variables
const timeMax = 60;
const wordLimit = 100;
let timer;


class WidgetTypingTest extends Component{
    constructor(props){
        super(props);
        this.state = {
            goldEarned: 0,
            time: timeMax,
            mistakes: [],
            mistakesCount: 0,
            wrongStrokes: 0,
            wpm: 0,
            cpm: 0,
            characterCount: 0,
            characterIndex: 0,
            text: [],
            isTyping: false,
            preset: "",
            modifications: {
                fontSmall: false
            }
        };
        this.handleLoadText = this.handleLoadText.bind(this);
        this.handleTyping = this.handleTyping.bind(this);
        this.handleResetGame = this.handleResetGame.bind(this);
        this.gameOver = this.gameOver.bind(this);
    };
    handleLoadText(what = ""){
        let textField = document.querySelector("#typingtest-text p");
        let loadedText;
        textField.innerHTML = "";
        this.setState({
            characterIndex: 0
        });
        if(this.state.text.length === 0){
            if(what !== ""){
                loadedText = what;
            }else{
                loadedText = this.props.randSentence();
            };
            loadedText = loadedText.split(" ");    
            this.setState({
                text: [...loadedText]
            });
        }else{
            loadedText = this.state.text;
        };
        loadedText.slice(0, wordLimit)
            .join(" ")
            .split("")
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
                        let wpm = Math.round(((this.state.characterCount - this.state.mistakesCount) / 5) / (timeMax - this.state.time) * 60);
                        wpm = wpm < 0
                            || !wpm
                            || wpm === Infinity ? 0
                            : wpm;
                        let cpm = (this.state.characterCount - this.state.mistakesCount - 1) * (60 / (timeMax - this.state.time));
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
                        characterCount: this.state.characterCount - 1,
                        characterIndex: this.state.characterIndex - 1
                    }, () => {
                        if(characters[this.state.characterIndex].classList.contains("incorrect")){
                            this.setState({
                                mistakesCount: this.state.mistakesCount - 1
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
            }else{
                if(characters[this.state.characterIndex].innerText === characterTyped){
                    characters[this.state.characterIndex]
                        .classList
                        .add("correct");
                }else{
                    this.setState({
                        mistakesCount: this.state.mistakesCount + 1,
                        wrongStrokes: this.state.wrongStrokes + 1
                    });
                    characters[this.state.characterIndex]
                        .classList
                        .add("incorrect");
                };
                this.setState({
                    characterCount: this.state.characterCount + 1,
                    characterIndex: this.state.characterIndex + 1
                });
                characters.forEach((span) => {
                    span.classList.remove("active");
                });
                /// End of sentence
                if(this.state.characterIndex + 1 === characters.length){
                    inputField.value = "";
                    this.setState({
                        text: [...this.state.text.slice(wordLimit)]
                    }, () => {
                        if(this.state.preset !== ""){
                            this.handleLoadText(this.state.preset);
                        }else{
                            this.handleLoadText();
                        };
                    });
                }else{;
                    characters[this.state.characterIndex + 1].classList
                        .add("active");
                };    
            };
            let wpm = Math.round(((this.state.characterCount - this.state.mistakesCount) / 5) / (timeMax - this.state.time) * 60);
            wpm = wpm < 0
                || !wpm
                || wpm === Infinity ? 0
                : wpm;
            let cpm = (this.state.characterCount - this.state.mistakesCount - 1) * (60 / (timeMax - this.state.time));
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
            let amount = Math.floor(this.state.wpm / 40);
            this.props.gameProps.randomItem(amount);
        };
        clearInterval(timer);
        this.setState({
            goldEarned: this.state.wpm
        });
        this.props.gameProps.updateGameValue("gold", this.state.wpm);
    };
    handleResetGame(preset){
        clearInterval(timer);
        document.getElementById("typingtest-text").style.opacity = "1";
        document.getElementById("typingtest-input-field").value = "";
        this.setState({
            goldEarned: 0,
            time: timeMax,
            mistakesCount: 0,
            wrongStrokes: 0,
            wpm: 0,
            cpm: 0,
            characterCount: 0,
            characterIndex: 0,
            isTyping: false,
            text: [],
            preset: ""
        }, () => {
            if(preset){
                this.handleLoadText(preset);
                this.setState({
                    preset: preset
                });
            }else{
                this.handleLoadText();
            };    
        });
    };
    handlePresets(what, amount){
        let chosenPreset = "";
        switch(what){
            case "AZ":
                chosenPreset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                break;
            case "az":
                chosenPreset = "abcdefghijklmnopqrstuvwxyz";
                break;
            case "ZA":
                chosenPreset = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
                break;
            case "za":
                chosenPreset = "zyxwvutsrqponmlkjihgfedcba";
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
                chosenPreset = sentence.join(" ");
                break;
            case "numbers":
                let stringNumber = "";
                for(let i = 0; i < amount; i++){
                    stringNumber += (Math.random() * 10).toString().replace(".", "");
                };
                chosenPreset = stringNumber;
                break;
            default:
                break;
        };
        this.handleResetGame(chosenPreset);
    };
    handleModifications(what){
        const elementText = document.querySelector("#typingtest-text p");
        const elementButton = document.getElementById(`typingtest-modifications-button-${what}`);
        this.setState({
            modifications: {
                ...this.state.modifications,
                [what]: !this.state.modifications[what]
            }
        }, () => {
            if(this.state.modifications[what]){
                elementButton.style.opacity = "1";
                elementText.className = what.replace(/([A-Z])/g, " $1").toLowerCase();
            }else{
                elementButton.style.opacity = "0.5";
                elementText.className = "";
            };
        });
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
                cancel="button, p, span"
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
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("typingtest", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("typingtest", "fullscreen", "games")}>
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
                            <span className="flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                {this.props.gameProps.formatNumber(this.props.gameProps.gold, 1)}
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
                        <div className="aesthetic-scale scale-div element-ends space-nicely space-bottom">
                            <div className="flex-center row gap">
                                <span className="font medium bold">Time Left: </span>
                                <span className="font medium">{this.state.time}</span>
                            </div>
                            <div className="flex-center row gap">
                                <span className="font medium bold">Mistakes: </span>
                                <span className="font medium">{this.state.mistakesCount} | {this.state.wrongStrokes}</span>
                            </div>
                            <div className="flex-center row gap">
                                <span className="font medium bold">WPM: </span>
                                <span className="font medium">{this.state.wpm}</span>
                            </div>
                            <div className="flex-center row gap">
                                <span className="font medium bold">CPM: </span>
                                <span className="font medium">{this.state.cpm}</span>
                            </div>
                            <button className="button-match"
                                onClick={() => {
                                    this.handleResetGame();
                                }}>Try Again</button>
                        </div>
                        {/* Settings */}
                        <section className="flex-center column only-flex gap medium section-group group-large space-nicely space-top">
                            {/* Presets */}
                            <div className="flex-center column">
                                <span className="font medium bold line bellow">Presets</span>
                                <div className="flex-center column gap medium">
                                    <div className="flex-center row gap medium">
                                        <button className="button-match option opt-small"
                                            type="button"
                                            onClick={() => this.handlePresets("AZ")}>A-Z</button>
                                        <button className="button-match option opt-small"
                                            type="button"
                                            onClick={() => this.handlePresets("az")}>a-z</button>
                                        <button className="button-match option opt-small"
                                            type="button"
                                            onClick={() => this.handlePresets("ZA")}>Z-A</button>
                                        <button className="button-match option opt-small"
                                            type="button"
                                            onClick={() => this.handlePresets("za")}>z-a</button>
                                        <button className="button-match option opt-small"
                                            type="button"
                                            onClick={() => this.handlePresets("brainrot")}>Brainrot</button>
                                    </div>
                                    <div className="flex-center row gap medium">
                                        <button className="button-match option opt-small"
                                            type="button"
                                            onClick={() => this.handlePresets("numbers", 1)}>1-9: 16</button>
                                        <button className="button-match option opt-small"
                                            type="button"
                                            onClick={() => this.handlePresets("numbers", 2)}>1-9: 32</button>
                                        <button className="button-match option opt-small"
                                            type="button"
                                            onClick={() => this.handlePresets("numbers", 3)}>1-9: 48</button>
                                    </div>
                                </div>
                            </div>
                            {/* Modifications */}
                            <div className="flex-center column">
                                <span className="font medium bold line bellow">Modifications</span>
                                <div className="flex-center column gap medium">
                                    <div className="flex-center row gap medium">
                                        <button id="typingtest-modifications-button-fontSmall"
                                            className="button-match option opt-small disabled-option"
                                            type="button"
                                            onClick={() => this.handleModifications("fontSmall")}>Font: Small</button>
                                    </div>
                                </div>
                            </div>
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

export default WidgetTypingTest;