import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaArrowRightLong, FaRegPaste } from 'react-icons/fa6';
import { BsArrowLeftRight } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import $ from 'jquery';
import sanitizeHtml from 'sanitize-html';


class WidgetTranslator extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            convert: "",
            converted: "",
            from: "",
            to: "",
            replaceFrom: "",
            replaceTo: "",
            reverseWord: false,
            reverseSentence: false
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
        }
    };
    /// Convert the "from" language to english
    convertFromText(){
        switch(this.state.from){
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
                        .map(letter => this.props.varBrailleFromDictionary[letter])
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
        switch(this.state.to){
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
                const reUwuDictionary = new RegExp(Object.keys(this.props.varUwuDictionary)
                    .map((key) => {
                        return "\\b" + key + "\\b";
                    })
                    .join("|"));
                this.setState(prevState => ({
                    converted: this.props.funcGrep(prevState.convert
                        .toString()
                        .toLowerCase()
                        .split(this.props.varMatchAll))
                        .map((word) => {
                            return (/[?]+/.test(word)) ? word.replace(/[?]+/, "???")
                                : (/[!]+/.test(word)) ? word.replace(/[!]+/, "!!11")
                                : (reUwuDictionary.test(word)) ? word.replace(reUwuDictionary, this.props.varUwuDictionary[word][Math.floor(Math.random() * this.props.varUwuDictionary[word].length)])
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
                        converted: this.props.funcMergePunctuation(prevState.converted)
                    }));
                    /// Insert emoticon at random position
                    var randPosition;
                    const randEmoticon = Math.floor(Math.random() * this.props.varUwuEmoticons.length);
                    if(this.state.converted.length > 4){
                        randPosition = Math.floor(Math.random() * (this.state.converted.length - 2) + 2);
                        this.setState(prevState => ({
                            converted: [...prevState.converted.slice(0, randPosition)
                                , this.props.varUwuEmoticons[randEmoticon]
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
                        .map(letter => this.props.varBrailleDictionary[letter])
                        .join("")
                }));
                break;
            case "emojify":
                const reEmojifyDictionary = new RegExp(Object.keys(this.props.varEmojifyDictionary)
                    .map((key) => {
                        return "\\b" + key + "\\b";
                    })
                    .join("|"), "i");
                this.setState(prevState => ({
                    converted: this.props.funcMergePunctuation(this.props.funcGrep(prevState.convert
                        .split(this.props.varMatchAll)
                        .map((word) => {
                            return (reEmojifyDictionary.test(word)) ? word.replace(reEmojifyDictionary, word + " " + this.props.varEmojifyDictionary[word.toLowerCase()][Math.floor(Math.random() * this.props.varEmojifyDictionary[word.toLowerCase()].length)]) : word;
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
                if(this.state.reverseWord === true && this.state.reverseSentence === true){
                /// Reverse Word + Sentence
                    this.setState(prevState => ({
                        converted: this.props.funcMergePunctuation(prevState.convert
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
                }else if(this.state.reverseWord === true){
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
                }else if(this.state.reverseSentence === true){
                /// Reverse Sentence
                    this.setState(prevState => ({
                        converted: this.props.funcMergePunctuation(prevState.convert
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
        switch(this.state.to){
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
            from: event.target.value
        }, () => {
            if(this.state.input !== ""){
                this.convertFromText();
            }
        });
    };
    /// Handles the "to" language select
    handleTo(event){
        this.setState({
            to: event.target.value,
        }, () => {
            this.handleWordBreak();
            if(this.state.input !== ""){
                this.convertToText();
            }
        });
        document.getElementById("replace-popout").style.visibility = (event.target.value === "replace") ? "visible" : "hidden";
        document.getElementById("reverse-popout").style.visibility = (event.target.value === "reverse") ? "visible" : "hidden";
    };
    /// Swaps "from" language and "to" language
    handleSwap(){
        if(this.state.from !== this.state.to){
            this.props.funcRandColor();
            const prev = this.state.from;
            this.setState(prevState => ({
                from: prevState.to,
                to: prev
            }), () => {
                this.convertFromText();
            });
            const v1 = $("#translator-translate-from").val();
            const v2 = $("#translator-translate-to").val();
            $("#translator-translate-from").val(v2);
            $("#translator-translate-to").val(v1);
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
        let btn;
        if(popout === "replace"){
            btn = document.getElementById("replace-popout-btn-" + what);
        }else if(popout === "reverse"){
            btn = document.getElementById("reverse-popout-btn-" + what);
        };
        switch(what){
            case "reverse-word":
                if(this.state.reverseWord === false){
                    this.setState({
                        reverseWord: true
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        reverseWord: false
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "0.5";
                };
                break; 
            case "reverse-sentence":
                if(this.state.reverseSentence === false){
                    this.setState({
                        reverseSentence: true
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        reverseSentence: false
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "0.5";
                };
                break; 
            case "reverse-everything":
                if(this.state.reverseEverything === false){
                    this.setState({
                        reverseEverything: true
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        reverseEverything: false
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "0.5";
                };
                break;
            default:
                break;
        };
    };
    /// Handles random sentence button
    handleRandSentence(){
        this.setState({
            input: this.props.funcRandSentence(),
            from: "en"
        }, () => {
            this.convertFromText();
            $("#translator-translate-from").val("en");
        });
    };
    componentDidMount(){
        this.props.funcRandColor();
        /// Sort the "translate-to" optgroups options alphabetically
        this.props.funcSortSelect('#translator-translate-to #translate-to-other-languages');
        this.props.funcSortSelect('#translator-translate-to #translate-to-encryption');
        this.props.funcSortSelect('#translator-translate-to #translate-to-modify');
        /// Default values
        this.setState({
            from: "en",
            to: "en"
        });
        $("#translator-translate-from").val("en");
        $("#translator-translate-to").val("en");
        /// Duplicate selects from "translate-from" to "translate-to"
        $('#translator-translate-from #translate-from-languages option').clone().prependTo('#translate-to-languages');
        $('#translator-translate-from #translate-from-other-languages option').clone().prependTo('#translate-to-other-languages');
        $('#translator-translate-from #translate-from-encryption option').clone().prependTo('#translate-to-encryption');
    };
    render(){
        return(
            <Draggable
                onStart={() => this.props.funcDragStart("translator")}
                onStop={() => this.props.funcDragStop("translator")}
                cancel="button, span, p, textarea, select, section"
                bounds="parent">
                <div id="translator-box"
                    className="widget">
                    <div id="translator-box-animation"
                        className="widget-animation">
                        <span id="translator-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.varLargeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div className="flex-center space-nicely bottom">
                            <select id="translator-translate-from"
                                className="select-match dropdown-arrow"
                                defaultValue={"en"}
                                onChange={this.handleFrom}>
                                <optgroup label="Languages"
                                    id="translate-from-languages">
                                    <option value="en">English</option>
                                </optgroup>
                                <optgroup label="Other Languages"
                                    id="translate-from-other-languages">
                                    <option value="pekofy">Pekofy</option>
                                    <option value="braille">Braille</option>
                                </optgroup>
                                <optgroup label="Encryption"
                                    id="translate-from-encryption">
                                    <option value="base64">Base64</option>
                                </optgroup>
                            </select>
                            <button className="btn-match inverse"
                                onClick={this.handleSwap}>
                                <IconContext.Provider value={{ size: this.props.varSmallIcon, className: "global-class-name" }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            <select id="translator-translate-to"
                                className="select-match dropdown-arrow"
                                defaultValue={"english"}
                                onChange={this.handleTo}>
                                <optgroup label="Languages"
                                    id="translate-to-languages"></optgroup>
                                <optgroup label="Other Languages"
                                    id="translate-to-other-languages">
                                    <option value="pig-latin">Pig latin</option>
                                    <option value="uwu">UwU</option>
                                    <option value="emojify">Emojify</option>
                                </optgroup>
                                <optgroup label="Encryption"
                                    id="translate-to-encryption"></optgroup>
                                <optgroup label="Modify">
                                    <option value="replace">Replace</option>
                                    <option value="reverse">Reverse</option>
                                    {/* <option value="case-transform">Case Transform</option> */}
                                </optgroup>
                            </select>
                        </div>
                        {/* Replace Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 75, y: 0}}
                            bounds={{top: -126, left: -390, right: 425, bottom: 265}}>
                            <section id="replace-popout"
                                className="popout">
                                <section className="flex-center column space-nicely all long">
                                    <section className="flex-center">
                                        <input className="input-typable all-side input-button-input"
                                            type="text"
                                            onChange={this.handleReplaceFrom}></input>
                                        <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                            <FaArrowRightLong/>
                                        </IconContext.Provider>
                                        <input className="input-typable all-side input-button-input"
                                            type="text"
                                            onChange={this.handleReplaceTo}></input>
                                    </section>
                                    <section className="space-nicely top medium">
                                        <button className="btn-match option opt-long"
                                            onClick={this.handleSave}>Save</button>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Reverse Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 75, y: 0}}
                            bounds={{top: -126, left: -390, right: 425, bottom: 265}}>
                            <section id="reverse-popout"
                                className="popout">
                                <section className="grid space-nicely all long">
                                    <button className="option-item btn-match option opt-long"
                                        onClick={this.handleSave}>Save</button>
                                    <section className="option-item">
                                        <button id="reverse-popout-btn-reverse-word"
                                            className="btn-match option opt-medium disabled-option"
                                            onClick={() => this.handlePressableBtn("reverse-word", "reverse")}>Word</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match option opt-medium disabled-option"
                                            onClick={() => this.handlePressableBtn("reverse-sentence", "reverse")}>Sentence</button>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Case Transform Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 125, y: 0}}
                            bounds={{top: -105, left: -290, right: 425, bottom: 285}}>
                            <section id="case-transform-popout"
                                className="popout">
                                <section className="option space-nicely top">
                                    <button className="option-item btn-match option opt-long"
                                        onClick={this.handleSave}>Save</button>
                                    <section className="option-item">
                                        <button id="case-transform-popout-btn-lower"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseWord}>Lower</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseSentence}>Upper</button>
                                        <button id="reverse-popout-btn-reverse-everything"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseEverything}>Capitalize</button>
                                    </section>
                                    <section className="option-item">
                                        <button id="reverse-popout-btn-reverse-word"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseWord}>Alternate</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseSentence}>Inverse</button>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        <div className="cut-scrollbar-corner-part-1 textarea">
                            <textarea className="cut-scrollbar-corner-part-2 textarea"
                                onChange={this.handleChange}
                                value={this.state.input}></textarea>
                        </div>
                        <div id="translator-preview-cut-corner"
                            className="cut-scrollbar-corner-part-1 p">
                            <p id="translator-translated-text"
                                className="cut-scrollbar-corner-part-2 p flex-center only-justify-content">{this.state.converted}</p>
                            <button className="bottom-right btn-match fadded"
                                onClick={this.handleRandSentence}>Random sentence</button>
                            <button className="bottom-left btn-match fadded inverse"
                                onClick={() => this.props.funcCopyToClipboard(this.state.converted)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetTranslator;