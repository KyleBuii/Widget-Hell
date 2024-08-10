import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaArrowRightLong, FaRegPaste, FaExpand, Fa0, FaVolumeHigh } from 'react-icons/fa6';
import { BsArrowLeftRight } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import sanitizeHtml from 'sanitize-html';
import Select from "react-select";


/// Variables
let regexPopouts = new RegExp(/replace|reverse|case-transform/);
var voices;
/// Select options
const optionsTranslateFrom = [
    {
        label: "Languages",
        options: [
            {value: "en", label: "English"}
        ]
    },
    {
        label: "Other Languages",
        options: [
            {value: "pekofy", label: "Pekofy"},
            {value: "braille", label: "Braille"}
        ]
    },
    {
        label: "Encryption",
        options: [
            {value: "base64", label: "Base64"}
        ]
    }
];
const optionsTranslateTo = [
    {
        label: "Languages",
        options: [
            {value: "en", label: "English"}
        ]
    },
    {
        label: "Other Languages",
        options: [
            {value: "pekofy", label: "Pekofy"},
            {value: "braille", label: "Braille"},
            {value: "pig-latin", label: "Pig latin"},
            {value: "uwu", label: "UwU"},
            {value: "emojify", label: "Emojify"}
        ]
    },
    {
        label: "Encryption",
        options: [
            {value: "base64", label: "Base64"}
        ]
    },
    {
        label: "Modify",
        options: [
            {value: "replace", label: "Replace"},
            {value: "reverse", label: "Reverse"},
            {value: "case-transform", label: "Case Transform"}
        ]
    }
];


class WidgetTranslator extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            convert: "",
            converted: "",
            from: {},
            to: {},
            replaceFrom: "",
            replaceTo: "",
            reverseWord: false,
            reverseSentence: false,
            caseTransformLower: false,
            caseTransformUpper: false,
            caseTransformCapitalize: false,
            caseTransformAlternate: false,
            caseTransformInverse: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleReplaceFrom = this.handleReplaceFrom.bind(this);
        this.handleReplaceTo = this.handleReplaceTo.bind(this);
        this.handleRandSentence = this.handleRandSentence.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
        this.convertFromText();
        const translatedText = document.getElementById("translator-translated-text");
        if(translatedText.scrollHeight > translatedText.clientHeight){
            translatedText.scrollTop = translatedText.scrollHeight;
        };
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    /// Convert the "from" language to english
    convertFromText(){
        switch(this.state.from.value){
            /// Other languages
            case "pekofy":
                this.setState(prevState => ({
                    convert: prevState.input
                        .replace(/\s(peko)/ig, "")
                }));
                break;
            case "braille":
                this.setState(prevState => ({
                    convert: prevState.input
                        .toString()
                        .split("")
                        .map(letter => this.props.brailleFromDictionary[letter])
                        .join("")
                }));
                break;
            /// Encryption
            case "base64":
                if(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(this.state.input)){
                    this.setState(prevState => ({
                        convert: decodeURIComponent(escape(window.atob(prevState.input)))
                    }));
                };
                break;
            default:
                this.setState(prevState => ({
                    convert: prevState.input
                }));
                break;
        };
        this.convertToText();   
    };
    /// Convert english to the "to" language
    convertToText(){
        switch(this.state.to.value){
            /// Other languages
            case "pig-latin":
                this.setState(prevState => ({
                    converted: prevState.convert
                        .toString()
                        .toLowerCase()
                        .split(" ")
                        .map(curr => curr
                            .replace(/^[aioue]\w*/i, "$&way")
                            .replace(/(^[^aioue]+)(\w*)/i, "$2$1ay"))
                        .join(" ")
                }));
                break;
            case "pekofy":
                this.setState(prevState => ({
                    converted: prevState.convert
                        .replace(/[^.!?]$/i, "$& peko")
                        .replace(/[.]/ig, " peko.")
                        .replace(/[!]/ig, " peko!")
                        .replace(/[?]/ig, " peko?")
                }));
                break;
            case "uwu":
                let wordsUwu = Object.keys(this.props.uwuDictionary)
                    .join("|");
                let regexUwuDictionary = new RegExp(`(?<![\\w${this.props.punctuation}])(${wordsUwu})(?![\\w${this.props.punctuation}])`, "i");
                this.setState(prevState => ({
                    converted: this.props.grep(prevState.convert
                        .toString()
                        .toLowerCase()
                        .split(this.props.matchAll))
                        .map((word) => {
                            return (/[?]+/.test(word)) ? word.replace(/[?]+/, "???")
                                : (/[!]+/.test(word)) ? word.replace(/[!]+/, "!!11")
                                : (regexUwuDictionary.test(word)) ? word.replace(regexUwuDictionary, this.props.uwuDictionary[word][Math.floor(Math.random() * this.props.uwuDictionary[word].length)])
                                : (/(l)\1/.test(word.substring(1, word.length))) ? word.replace(/(l)\1/, "ww")
                                : (/(r)\1/.test(word.substring(1, word.length))) ? word.replace(/(r)\1/, "ww")
                                : (/[l|r]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([l|r])(\w*)/, "$1w$3")
                                : (/[h]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([h])(\w*)/, "$1b$3")
                                : (/[f]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([f])(\w*)/, "$1b$3")
                                : (/^\d/.test(word)) ? word
                                : word.replace(/(?=\w{3,})^([^\Ww])(\w*)/, "$1w$2");
                        })
                }), () => {
                    this.setState(prevState => ({
                        converted: this.props.mergePunctuation(prevState.converted)
                    }));
                    /// Insert emoticon at random position
                    var randPosition;
                    const randEmoticon = Math.floor(Math.random() * this.props.uwuEmoticons.length);
                    if(this.state.converted.length > 4){
                        randPosition = Math.floor(Math.random() * (this.state.converted.length - 2) + 2);
                        this.setState(prevState => ({
                            converted: [...prevState.converted.slice(0, randPosition)
                                , this.props.uwuEmoticons[randEmoticon]
                                , ...prevState.converted.slice(randPosition)]
                                .join(" ")
                        }));
                    }else if(this.state.converted.length <= 4
                        && this.state.converted.length >= 2){
                        this.setState(prevState => ({
                            converted: prevState.converted
                                .join(" ")
                        }));
                    };
                });
                break;
            case "braille":
                this.setState(prevState => ({
                    converted: prevState.convert
                        .toString()
                        .toLowerCase()
                        .split("")
                        .map(letter => this.props.brailleDictionary[letter])
                        .join("")
                }));
                break;
            case "emojify":
                let wordsEmojify = Object.keys(this.props.emojifyDictionary)
                    .join("|");
                let regexEmojifyDictionary = new RegExp(`(?<![\\w${this.props.punctuation}])(${wordsEmojify})(?![\\w${this.props.punctuation}])`, "i");
                this.setState(prevState => ({
                    converted: this.props.mergePunctuation(this.props.grep(prevState.convert
                        .split(this.props.matchAll)
                        .map((word) => {
                            return (regexEmojifyDictionary.test(word)) ? word.replace(regexEmojifyDictionary, word + " " + this.props.emojifyDictionary[word.toLowerCase()][
                                Math.floor(Math.random() * this.props.emojifyDictionary[word.toLowerCase()].length)
                            ]) : word;
                        })))
                        .join(" ")
                }), () => {
                    const clean = sanitizeHtml(this.state.converted, {
                        allowedTags: [],
                        allowedAttributes: {},
                        allowedIframeHostnames: []
                    });
                    document.getElementById("translator-translated-text").innerHTML = clean;
                });
                break;
            /// Encryption
            case "base64":
                this.setState(prevState => ({
                    converted: btoa(unescape(encodeURIComponent(prevState.convert)))
                }));
                break;
            /// Modify
            case "replace":
                this.setState(prevState => ({
                    converted: prevState.convert
                        .replace(this.state.replaceFrom, prevState.replaceTo)
                }));
                break;
            case "reverse":
                if(this.state.reverseWord && this.state.reverseSentence){
                /// Reverse Word + Sentence
                    this.setState(prevState => ({
                        converted: this.props.mergePunctuation(prevState.convert
                            .split(/([.?!])\s*/)
                            .map(sentence => sentence
                                .split(" ")
                                .map(word => word
                                    .split("")
                                    .reverse()
                                    .join(""))
                                .reverse()
                                .join(" ")
                            ))
                            .join(" ")
                    }));
                }else if(this.state.reverseWord){
                /// Reverse Word
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .split(/(\s|[^\w'])/g)
                            .map(function(word){
                                return word
                                    .split("")
                                    .reverse()
                                    .join("");
                            })
                            .join("")
                    }));
                }else if(this.state.reverseSentence){
                /// Reverse Sentence
                    this.setState(prevState => ({
                        converted: this.props.mergePunctuation(prevState.convert
                            .split(/([.!?"])\s*/)
                            .map(function(sentence){
                                return sentence
                                    .split(" ")
                                    .reverse()
                                    .join(" ")
                            }))
                            .join(" ")
                    }));
                }else{
                    this.setState(prevState => ({
                        converted: prevState.convert
                    }));   
                };
                break;
            case "case-transform":
                if(this.state.caseTransformUpper){
                    /// Case Transform Upper
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .toUpperCase()
                    }));
                }else if(this.state.caseTransformLower){
                    /// Case Transform Lower
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .toLowerCase()
                    }));
                }else if(this.state.caseTransformCapitalize){
                    /// Case Transform Capitalize
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .replace(/\b\w/g, (char) => {
                                return char.toUpperCase()
                            })
                    }));
                }else if(this.state.caseTransformAlternate){
                    /// Case Transform Alternate
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .toLowerCase()
                            .split("")
                            .map((val, i) => {
                                return (i % 2 === 0) ? val.toUpperCase() : val;
                            })
                            .join("")
                    }));
                }else if(this.state.caseTransformInverse){
                    /// Case Transform Inverse
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .replace(/[a-z]/gi, (char) => {
                                return (char === char.toUpperCase()) ? char.toLowerCase() : char.toUpperCase();
                            })
                    }));
                }else{
                    this.setState(prevState => ({
                        converted: prevState.convert
                    }));
                };
                break;
            default:
                this.setState(prevState => ({
                    converted: prevState.convert
                }));
                break;
        };
    };
    /// Handles "word-break" for unbreakable strings
    handleWordBreak(){
        const translatedText = document.getElementById("translator-translated-text");
        switch(this.state.to.value){
            case "braille":
            case "base64":
                translatedText.style.wordBreak = "break-all";
                break;
            default:
                translatedText.style.wordBreak = "normal";
                break;
        };
    };
    /// Handles the "from" language select
    handleFrom(event){
        this.setState({
            from: event
        }, () => {
            if(this.state.input !== ""){
                this.convertFromText();
            }
        });
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    /// Handles the "to" language select
    handleTo(event){
        let popoutAnimation;
        /// If previous value is a popout, hide it
        if(regexPopouts.test(this.state.to.value)){
            popoutAnimation = document.getElementById(`${this.state.to.value}-popout-animation`);
            this.props.defaultProps.showHidePopout(popoutAnimation, false);
        };
        /// If chosen value is a popout, show it
        if(regexPopouts.test(event.value)){
            popoutAnimation = document.getElementById(`${event.value}-popout-animation`);
            this.props.defaultProps.showHidePopout(popoutAnimation, true);
        };
        this.setState({
            to: event,
        }, () => {
            this.handleWordBreak();
            if(this.state.input !== ""){
                this.convertToText();
            }
        });
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    /// Swaps "from" language and "to" language
    handleSwap(){
        if(this.state.from.value !== this.state.to.value){
            this.props.randColor();
            const prev = this.state.from;
            this.setState(prevState => ({
                from: prevState.to,
                to: prev
            }), () => {
                this.convertFromText();
            });
        };
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    /// Saves "converted" text into "input" field
    handleSave(){
        this.setState(prevState => ({
            input: prevState.converted,
            convert: prevState.converted
        }), () => {
            this.convertToText();
        });
    };
    handleTalk(){
        if(this.state.converted !== ""){
            if(speechSynthesis.speaking){
                speechSynthesis.cancel();
            }else{
                let utterance = new SpeechSynthesisUtterance(this.state.converted);
                utterance.voice = voices[this.props.voice.value];
                utterance.pitch = this.props.pitch;
                utterance.rate = this.props.rate;
                speechSynthesis.speak(utterance);
            };
        };
    };
    /// Handles "replace" from "translator-translate-to"
    handleReplaceFrom(event){
        this.setState({
            replaceFrom: event.target.value
        }, () => {
            if(this.state.converted !== ""){
                this.convertToText();
            };
        });
    };
    handleReplaceTo(event){
        this.setState({
            replaceTo: event.target.value
        }, () => {
            if(this.state.converted !== ""){
                this.convertToText();
            };
        });
    };
    /// Handles all buttons that are pressable (opacity: 0.5 on click)
    handlePressableBtn(what, popout){
        const popoutButton = document.getElementById(`${popout}-popout-btn-${what}`);
        popoutButton.style.opacity = (this.state[what] === false) ? "1" : "0.5";
        this.setState({
            [what]: !this.state[what]
        }, () => {
            this.convertToText();
        });
    };
    /// Handles random sentence button
    handleRandSentence(){
        this.setState({
            input: this.props.randSentence(),
        }, () => {
            this.convertFromText();
        });
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    componentDidMount(){
        speechSynthesis.addEventListener("voiceschanged", () => {
            voices = window.speechSynthesis.getVoices();
        }, { once: true });
        /// Sort the "translate-to" optgroups options alphabetically
        this.props.sortSelect(optionsTranslateFrom);
        this.props.sortSelect(optionsTranslateTo);
        /// Default values
        if(sessionStorage.getItem("translator") === null){
            this.setState({
                from: {value: "en", label: "English"},
                to: {value: "en", label: "English"}
            });
        }else{
            let dataSessionStorage = JSON.parse(sessionStorage.getItem("translator"));
            this.setState({
                from: dataSessionStorage.from,
                to: dataSessionStorage.to
            }, () => {
                if(regexPopouts.test(this.state.to.value)){
                    let popoutAnimation = document.getElementById(`${this.state.to.value}-popout-animation`);
                    this.props.defaultProps.showHidePopout(popoutAnimation, true);        
                };
            });
        };
    };
    componentWillUnmount(){
        let data = {
            "from": this.state.from,
            "to": this.state.to
        };
        sessionStorage.setItem("translator", JSON.stringify(data));
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("translator")}
                onStop={() => this.props.defaultProps.dragStop("translator")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("translator", "utility", data.x, data.y)}
                cancel="button, span, p, textarea, section, .select-match"
                bounds="parent">
                <div id="translator-widget"
                    className="widget">
                    <div id="translator-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="translator-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("translator", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("translator", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Select */}
                        <div className="flex-center space-nicely bottom">
                            {/* Select From */}
                            <Select id="translator-translate-from"
                                className="select-match"
                                value={this.state.from}
                                defaultValue={optionsTranslateFrom[0]["options"][0]}
                                onChange={this.handleFrom}
                                options={optionsTranslateFrom}
                                formatGroupLabel={this.props.formatGroupLabel}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...this.props.selectTheme
                                    }
                                })}/>
                            <button className="btn-match inverse"
                                onClick={this.handleSwap}>
                                <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            {/* Select To */}
                            <Select id="translator-translate-to"
                                className="select-match"
                                value={this.state.to}
                                defaultValue={optionsTranslateTo[0]["options"][0]}
                                onChange={this.handleTo}
                                options={optionsTranslateTo}
                                formatGroupLabel={this.props.formatGroupLabel}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...this.props.selectTheme
                                    }
                                })}/>
                        </div>
                        {/* Display */}
                        <div className="flex-center column">
                            <div className="cut-scrollbar-corner-part-1 textarea">
                                <textarea className="cut-scrollbar-corner-part-2 textarea"
                                    name="translator-textarea-input"
                                    onChange={this.handleChange}
                                    value={this.state.input}></textarea>
                            </div>
                            <div id="translator-preview-cut-corner"
                                className="cut-scrollbar-corner-part-1 p">
                                <p id="translator-translated-text"
                                    className="cut-scrollbar-corner-part-2 p flex-center only-justify-content">{this.state.converted}</p>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="element-ends float bottom">
                            <div className="flex-center row">
                                {/* Clipboard */}
                                <button className="btn-match fadded inversed"
                                    onClick={() => this.props.copyToClipboard(this.state.converted)}>
                                    <IconContext.Provider value={{ className: "global-class-name" }}>
                                        <FaRegPaste/>
                                    </IconContext.Provider>
                                </button>
                                {/* Talk */}
                                <button className="btn-match fadded inversed"
                                    onClick={() => this.handleTalk()}>
                                    <IconContext.Provider value={{ className: "global-class-name" }}>
                                        <FaVolumeHigh/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            {/* Random Sentence */}
                            <button className="btn-match fadded"
                                onClick={this.handleRandSentence}>Random sentence</button>
                        </div>
                        {/* Replace Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 20, y: 0}}
                            bounds={{top: -135, left: -375, right: 425, bottom: 270}}>
                            <section id="replace-popout"
                                className="popout">
                                <section id="replace-popout-animation"
                                    className="popout-animation">
                                    <section className="flex-center column space-nicely all long">
                                        <section className="flex-center">
                                            <input className="input-typable all-side input-button-input"
                                                name="translator-input-popout-replace-from"
                                                type="text"
                                                onChange={this.handleReplaceFrom}></input>
                                            <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                                <FaArrowRightLong/>
                                            </IconContext.Provider>
                                            <input className="input-typable all-side input-button-input"
                                                name="translator-input-popout-replace-to"
                                                type="text"
                                                onChange={this.handleReplaceTo}></input>
                                        </section>
                                        <section className="space-nicely top medium">
                                            <button className="btn-match option opt-long"
                                                onClick={this.handleSave}>Save</button>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Reverse Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 60, y: 0}}
                            bounds={{top: -120, left: -300, right: 425, bottom: 270}}>
                            <section id="reverse-popout"
                                className="popout">
                                <section id="reverse-popout-animation"
                                    className="popout-animation">
                                    <section className="grid space-nicely all long">
                                        <button className="btn-match option opt-long"
                                            onClick={this.handleSave}>Save</button>
                                        <section className="flex-center row gap">
                                            <button id="reverse-popout-btn-reverseWord"
                                                className="btn-match option opt-medium disabled-option"
                                                onClick={() => this.handlePressableBtn("reverseWord", "reverse")}>Word</button>
                                            <button id="reverse-popout-btn-reverseSentence"
                                                className="btn-match option opt-medium disabled-option"
                                                onClick={() => this.handlePressableBtn("reverseSentence", "reverse")}>Sentence</button>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Case Transform Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 60, y: 0}}
                            bounds={{top: -145, left: -300, right: 425, bottom: 270}}>
                            <section id="case-transform-popout"
                                className="popout">
                                <section id="case-transform-popout-animation"
                                    className="popout-animation">
                                    <section className="grid space-nicely all long">
                                        <button className="btn-match option opt-long"
                                            onClick={this.handleSave}>Save</button>
                                        <section className="flex-center row gap">
                                            <button id="case-transform-popout-btn-caseTransformLower"
                                                className="btn-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableBtn("caseTransformLower", "case-transform")}>Lower</button>
                                            <button id="case-transform-popout-btn-caseTransformUpper"
                                                className="btn-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableBtn("caseTransformUpper", "case-transform")}>Upper</button>
                                            <button id="case-transform-popout-btn-caseTransformCapitalize"
                                                className="btn-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableBtn("caseTransformCapitalize", "case-transform")}>Capitalize</button>
                                        </section>
                                        <section className="flex-center row gap">
                                            <button id="case-transform-popout-btn-caseTransformAlternate"
                                                className="btn-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableBtn("caseTransformAlternate", "case-transform")}>Alternate</button>
                                            <button id="case-transform-popout-btn-caseTransformInverse"
                                                className="btn-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableBtn("caseTransformInverse", "case-transform")}>Inverse</button>
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

export default WidgetTranslator;