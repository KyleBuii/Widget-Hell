import DOMPurify from 'dompurify';
import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { BsArrowLeftRight } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import { Fa0, FaArrowRightLong, FaExpand, FaRegPaste, FaVolumeHigh } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import Select from "react-select";


/// Variables
let regexPopouts = new RegExp(/replace|reverse|caseTransform/);
let timeoutCopy;
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
            {value: "braille", label: "Braille"},
            {value: "moorseCode", label: "Moorse Code"},
            {value: "phoneticAlphabet", label: "Phonetic Alphabet"},
        ]
    },
    {
        label: "Encryption",
        options: [
            {value: "base64", label: "Base64"},
            {value: "binary", label: "Binary"},
            {value: "hexadecimal", label: "Hexadecimal"},
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
            {value: "pigLatin", label: "Pig latin"},
            {value: "uwu", label: "UwU"},
            {value: "emojify", label: "Emojify"},
            {value: "moorseCode", label: "Moorse Code"},
            {value: "phoneticAlphabet", label: "Phonetic Alphabet"},
            {value: "spaced", label: "Spaced"},
            {value: "mirrorWriting", label: "Mirror Writing"},
            {value: "enchantingTable", label: "Enchanting Table"},
        ]
    },
    {
        label: "Encryption",
        options: [
            {value: "base64", label: "Base64"},
            {value: "binary", label: "Binary"},
            {value: "hexadecimal", label: "Hexadecimal"},
        ]
    },
    {
        label: "Modify",
        options: [
            {value: "replace", label: "Replace"},
            {value: "reverse", label: "Reverse"},
            {value: "caseTransform", label: "Case Transform"}
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
        if(event.target.value !== " "){
            this.setState({
                input: event.target.value
            }, () => {
                this.convertFromText();
            });
            const translatedText = document.getElementById("translator-translated-text");
            if(translatedText.scrollHeight > translatedText.clientHeight){
                translatedText.scrollTop = translatedText.scrollHeight;
            };
        };
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    /// Convert the "from" language to english
    convertFromText(){
        let stringConvertFrom = "";
        switch(this.state.from.value){
            /// Other languages
            case "pekofy":
                stringConvertFrom = this.state.input
                    .replace(/\s(peko)/ig, "");
                break;
            case "braille":
                stringConvertFrom = this.state.input
                    .toString()
                    .split("")
                    .map(letter => this.props.brailleFromDictionary[letter])
                    .join("");
                break;
            case "moorseCode":
            case "phoneticAlphabet":
                stringConvertFrom = this.state.input
                    .split(" ")
                    .map((char) => this.props[`${this.state.from.value}FromDictionary`][char] || "")
                    .join("");
                break;
            /// Encryption
            case "base64":
                if(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(this.state.input)){
                    stringConvertFrom = window.atob(this.state.input);
                };
                break;
            case "binary":
                stringConvertFrom = this.state.input
                    .split(" ")
                    .map((binary) => String.fromCharCode(parseInt(binary, 2)))
                    .join("");
                break;
            case "hexadecimal":
                stringConvertFrom = this.state.input
                    .split(" ")
                    .map((hex) => String.fromCharCode(parseInt(hex, 16)))
                    .join("");
                break;
            default:
                stringConvertFrom = this.state.input;
                break;
        };
        this.setState({
            convert: stringConvertFrom
        }, () => {
            this.convertToText();
        });
    };
    /// Convert english to the "to" language
    convertToText(){
        let stringConvertTo = "";
        switch(this.state.to.value){
            /// Other languages
            case "pigLatin":
                stringConvertTo = this.state.convert
                    .toString()
                    .toLowerCase()
                    .split(" ")
                    .map(curr => curr
                        .replace(/^[aioue]\w*/i, "$&way")
                        .replace(/(^[^aioue]+)(\w*)/i, "$2$1ay"))
                    .join(" ")
                break;
            case "pekofy":
                stringConvertTo = this.state.convert
                    .replace(/[^.!?]$/i, "$& peko")
                    .replace(/[.]/ig, " peko.")
                    .replace(/[!]/ig, " peko!")
                    .replace(/[?]/ig, " peko?")
                break;
            case "uwu":
                let wordsUwu = Object.keys(this.props.uwuDictionary)
                    .join("|");
                let regexUwuDictionary = new RegExp(`(?<![\\w${this.props.punctuation}])(${wordsUwu})(?![\\w${this.props.punctuation}])`, "i");
                stringConvertTo = this.props.mergePunctuation(
                    this.props.grep(this.state.convert
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
                        }
                    )
                );
                /// Insert emoticon at random position
                var randPosition;
                const randEmoticon = Math.floor(Math.random() * this.props.uwuEmoticons.length);
                if(stringConvertTo.length > 4){
                    randPosition = Math.floor(Math.random() * (stringConvertTo.length - 2) + 2);
                    stringConvertTo = [...stringConvertTo.slice(0, randPosition)
                        , this.props.uwuEmoticons[randEmoticon]
                        , ...stringConvertTo.slice(randPosition)]
                        .join(" ");
                }else if(stringConvertTo.length <= 4){
                    stringConvertTo = stringConvertTo.join(" ");
                };          
                break;
            case "braille":
                stringConvertTo = this.state.convert
                    .split("")
                    .map((letter) => this.props.brailleDictionary[letter.toLowerCase()] || "")
                    .join("")
                    .replace(/\s+/g, " ");
                break;
            case "emojify":
                let wordsEmojify = Object.keys(this.props.emojifyDictionary)
                    .join("|");
                let regexEmojifyDictionary = new RegExp(`(?<![\\w${this.props.punctuation}])(${wordsEmojify})(?![\\w${this.props.punctuation}])`, "i");
                stringConvertTo = this.props.mergePunctuation(
                    this.props.grep(this.state.convert
                        .split(this.props.matchAll)
                        .map((word) => {
                            return (regexEmojifyDictionary.test(word)) ? word.replace(regexEmojifyDictionary, word + " " + this.props.emojifyDictionary[word.toLowerCase()][
                                Math.floor(Math.random() * this.props.emojifyDictionary[word.toLowerCase()].length)
                            ]) : word;
                        })
                    )
                ).join(" ");
                break;
            case "moorseCode":
            case "phoneticAlphabet":
                stringConvertTo = this.state.convert
                    .split("")
                    .map((char) => this.props[`${this.state.to.value}Dictionary`][char.toLowerCase()] || "")
                    .join(" ")
                    .replace(/\s+/g, " ");
                break;
            case "spaced":
                stringConvertTo = this.state.convert
                    .split("")
                    .join(" ");
                break;
            case "mirrorWriting":
                stringConvertTo = this.state.convert
                    .split("")
                    .reverse()
                    .map((char) => this.props.mirrorWrittingDictionary[char] || char)
                    .join("");
                break;
            case "enchantingTable":
                stringConvertTo = this.state.convert
                    .split("")
                    .map((char) => this.props.enchantingTableDictionary[char.toLowerCase()] || char)
                    .join("");
                break;
            /// Encryption
            case "base64":
                stringConvertTo = btoa(unescape(encodeURIComponent(this.state.convert)));
                break;
            case "binary":
                let stringConvertedBinary = "";
                for(let i = 0; i < this.state.convert.length; i++){
                    stringConvertedBinary += this.state.convert[i].charCodeAt(0).toString(2) + " ";
                };
                stringConvertTo = stringConvertedBinary;
                break;
            case "hexadecimal":
                let stringConvertedHexadecimal = "";
                for(let i = 0; i < this.state.convert.length; i++){
                    stringConvertedHexadecimal += this.state.convert[i].charCodeAt(0).toString(16) + " ";
                };
                stringConvertTo = stringConvertedHexadecimal;
                break;
            /// Modify
            case "replace":
                stringConvertTo = this.state.convert
                    .replace(this.state.replaceFrom, this.state.replaceTo)
                break;
            case "reverse":
                if(this.state.reverseWord && this.state.reverseSentence){
                    /// Reverse Word + Sentence
                    stringConvertTo = this.props.mergePunctuation(this.state.convert
                        .split(/([.?!])\s*/)
                        .map(sentence => sentence
                            .split(" ")
                            .map(word => word
                                .split("")
                                .reverse()
                                .join(""))
                            .reverse()
                            .join(" ")
                        )
                    ).join(" ");
                }else if(this.state.reverseWord){
                    /// Reverse Word
                    stringConvertTo = this.state.convert
                        .split(/(\s|[^\w'])/g)
                        .map(function(word){
                            return word
                                .split("")
                                .reverse()
                                .join("");
                        })
                        .join("");
                }else if(this.state.reverseSentence){
                    /// Reverse Sentence
                    stringConvertTo = this.props.mergePunctuation(this.state.convert
                        .split(/([.!?"])\s*/)
                        .map(function(sentence){
                            return sentence
                                .split(" ")
                                .reverse()
                                .join(" ")
                        })
                    ).join(" ");
                }else{
                    stringConvertTo = this.state.convert;
                };
                break;
            case "caseTransform":
                if(this.state.caseTransformUpper){
                    /// Case Transform Upper
                    stringConvertTo = this.state.convert
                        .toUpperCase();
                }else if(this.state.caseTransformLower){
                    /// Case Transform Lower
                    stringConvertTo = this.state.convert
                        .toLowerCase();
                }else if(this.state.caseTransformCapitalize){
                    /// Case Transform Capitalize
                    stringConvertTo = this.state.convert
                        .replace(/\b\w/g, (char) => {
                            return char.toUpperCase()
                        });
                }else if(this.state.caseTransformAlternate){
                    /// Case Transform Alternate
                    stringConvertTo = this.state.convert
                        .toLowerCase()
                        .split("")
                        .map((val, i) => {
                            return (i % 2 === 0) ? val.toUpperCase() : val;
                        })
                        .join("");
                }else if(this.state.caseTransformInverse){
                    /// Case Transform Inverse
                    stringConvertTo = this.state.convert
                        .replace(/[a-z]/gi, (char) => {
                            return (char === char.toUpperCase()) ? char.toLowerCase() : char.toUpperCase();
                        });
                }else{
                    stringConvertTo = this.state.convert;
                };
                break;
            default:
                stringConvertTo = this.state.convert;
                break;
        };
        this.setState({
            converted: stringConvertTo
        });
    };
    /// Handles "word-break" for unbreakable strings
    handleWordBreak(){
        const translatedText = document.getElementById("translator-translated-text");
        switch(this.state.to.value){
            case "braille":
            case "base64":
            case "hexadecimal":
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
                this.handleWordBreak();
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
        this.props.talk(this.state.converted);
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
    handlePressableButton(what, popout){
        const popoutButton = document.getElementById(`${popout}-popout-button-${what}`);
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
    handleCopy(){
        this.props.copyToClipboard(this.state.converted);
        let elementTranslatedText = document.getElementById("translator-translated-text");
        elementTranslatedText.style.textShadow = "0px 0px 2px var(--randColorLight)";
        timeoutCopy = setTimeout(() => {
            elementTranslatedText.style.textShadow = "unset";
        }, 400);
    };
    componentDidMount(){
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
                this.handleWordBreak();
            });
        };
    };
    componentWillUnmount(){
        let data = {
            "from": this.state.from,
            "to": this.state.to
        };
        sessionStorage.setItem("translator", JSON.stringify(data));
        clearTimeout(timeoutCopy);
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("translator")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("translator");
                    this.props.defaultProps.updatePosition("translator", "utility", data.x, data.y);
                }}
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
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("translator", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("translator", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("translator", "close", "utility")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
                        {/* Select */}
                        <div className="flex-center space-nicely space-bottom">
                            {/* Select From */}
                            <Select id="translator-translate-from"
                                className="select-match"
                                value={this.state.from}
                                defaultValue={optionsTranslateFrom[0]["options"][0]}
                                onChange={this.handleFrom}
                                options={optionsTranslateFrom}
                                formatGroupLabel={this.props.formatGroupLabel}
                                components={{
                                    GroupHeading: this.props.selectHideGroupHeading,
                                    MenuList: this.props.selectHideGroupMenuList
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...this.props.selectTheme
                                    }
                                })}/>
                            <button className="button-match inverse"
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
                                components={{
                                    GroupHeading: this.props.selectHideGroupHeading,
                                    MenuList: this.props.selectHideGroupMenuList
                                }}
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
                                    className="text-animation cut-scrollbar-corner-part-2 p flex-center only-justify-content">
                                    {DOMPurify.sanitize(this.state.converted)}
                                </p>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="element-ends float bottom">
                            <div className="flex-center row">
                                {/* Clipboard */}
                                <button className="button-match fadded inversed"
                                    onClick={() => this.handleCopy()}>
                                    <IconContext.Provider value={{ className: "global-class-name" }}>
                                        <FaRegPaste/>
                                    </IconContext.Provider>
                                </button>
                                {/* Talk */}
                                <button className="button-match fadded inversed"
                                    onClick={() => this.handleTalk()}>
                                    <IconContext.Provider value={{ className: "global-class-name" }}>
                                        <FaVolumeHigh/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            {/* Random Sentence */}
                            <button className="button-match fadded"
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
                                    <section className="flex-center column space-nicely space-all length-long">
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
                                        <section className="space-nicely space-top length-medium">
                                            <button className="button-match option opt-long"
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
                                    <section className="grid space-nicely space-all length-long">
                                        <button className="button-match option opt-long"
                                            onClick={this.handleSave}>Save</button>
                                        <section className="flex-center row gap">
                                            <button id="reverse-popout-button-reverseWord"
                                                className="button-match option opt-medium disabled-option"
                                                onClick={() => this.handlePressableButton("reverseWord", "reverse")}>Word</button>
                                            <button id="reverse-popout-button-reverseSentence"
                                                className="button-match option opt-medium disabled-option"
                                                onClick={() => this.handlePressableButton("reverseSentence", "reverse")}>Sentence</button>
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
                            <section id="caseTransform-popout"
                                className="popout">
                                <section id="caseTransform-popout-animation"
                                    className="popout-animation">
                                    <section className="grid space-nicely space-all length-long">
                                        <button className="button-match option opt-long"
                                            onClick={this.handleSave}>Save</button>
                                        <section className="flex-center row gap">
                                            <button id="caseTransform-popout-button-caseTransformLower"
                                                className="button-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableButton("caseTransformLower", "caseTransform")}>Lower</button>
                                            <button id="caseTransform-popout-button-caseTransformUpper"
                                                className="button-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableButton("caseTransformUpper", "caseTransform")}>Upper</button>
                                            <button id="caseTransform-popout-button-caseTransformCapitalize"
                                                className="button-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableButton("caseTransformCapitalize", "caseTransform")}>Capitalize</button>
                                        </section>
                                        <section className="flex-center row gap">
                                            <button id="caseTransform-popout-button-caseTransformAlternate"
                                                className="button-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableButton("caseTransformAlternate", "caseTransform")}>Alternate</button>
                                            <button id="caseTransform-popout-button-caseTransformInverse"
                                                className="button-match option opt-small disabled-option"
                                                onClick={() => this.handlePressableButton("caseTransformInverse", "caseTransform")}>Inverse</button>
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

export default memo(WidgetTranslator);