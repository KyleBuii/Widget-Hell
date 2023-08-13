import './index.scss';
import { React, Component } from 'react';
import ReactDOM from 'react-dom/client';
import { FaTwitter, FaGripHorizontal } from 'react-icons/fa';
import { FaRegTrashCan, FaRegCircleQuestion, FaArrowRightFromBracket
    ,FaArrowRightLong } from 'react-icons/fa6';
import { BsArrowLeftRight, BsPlusSlashMinus } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import $ from 'jquery';
import { evaluate, round } from 'mathjs';
// import { CookiesProvider, useCookies } from 'react-cookie';

/// Variables
const zIndexDefault = 2;
const zIndexDrag = 5;
const widgetsArray = ["settings-box-animation"];
const animationsArray = ["spin", "flip", "hinge"];
const languages = ["Afrikaans", "af", "Albanian", "sq", "Amharic", "am", "Arabic", "ar", "Armenian", "hy", "Assamese", "as", "Azerbaijani (Latin)", "az", "Bangla", "bn", "Bashkir", "ba", "Basque", "eu", "Bosnian (Latin)", "bs", "Bulgarian", "bg", "Cantonese (Traditional)", "yue", "Catalan", "ca", "Chinese (Literary)", "lzh", "Chinese Simplified", "zh-Hans", "Chinese Traditional", "zh-Hant", "Croatian", "hr", "Czech", "cs", "Danish", "da", "Dari", "prs", "Divehi", "dv", "Dutch", "nl", "English", "en", "Estonian", "et", "Faroese", "fo", "Fijian", "fj", "Filipino", "fil", "Finnish", "fi", "French", "fr", "French (Canada)", "fr-ca", "Galician", "gl", "Georgian", "ka", "German", "de", "Greek", "el", "Gujarati", "gu", "Haitian Creole", "ht", "Hebrew", "he", "Hindi", "hi", "Hmong Daw (Latin)", "mww", "Hungarian", "hu", "Icelandic", "is", "Indonesian", "id", "Inuinnaqtun", "ikt", "Inuktitut", "iu", "Inuktitut (Latin)", "iu-Latn", "Irish", "ga", "Italian", "it", "Japanese", "ja", "Kannada", "kn", "Kazakh", "kk", "Khmer", "km", "Klingon", "tlh-Latn", "Klingon (plqaD)", "tlh-Piqd", "Korean", "ko", "Kurdish (Central)", "ku", "Kurdish (Northern)", "kmr", "Kyrgyz (Cyrillic)", "ky", "Lao", "lo", "Latvian", "lv", "Lithuanian", "lt", "Macedonian", "mk", "Malagasy", "mg", "Malay (Latin)", "ms", "Malayalam", "ml", "Maltese", "mt", "Maori", "mi", "Marathi", "mr", "Mongolian (Cyrillic)", "mn-Cyrl", "Mongolian (Traditional)", "mn-Mong", "Myanmar", "my", "Nepali", "ne", "Norwegian", "nb", "Odia", "or", "Pashto", "ps", "Persian", "fa", "Polish", "pl", "Portuguese (Brazil)", "pt", "Portuguese (Portugal)", "pt-pt", "Punjabi", "pa", "Queretaro Otomi", "otq", "Romanian", "ro", "Russian", "ru", "Samoan (Latin)", "sm", "Serbian (Cyrillic)", "sr-Cyrl", "Serbian (Latin)", "sr-Latn", "Slovak", "sk", "Slovenian", "sl", "Somali (Arabic)", "so", "Spanish", "es", "Swahili (Latin)", "sw", "Swedish", "sv", "Tahitian", "ty", "Tamil", "ta", "Tatar (Latin)", "tt", "Telugu", "te", "Thai", "th", "Tibetan", "bo", "Tigrinya", "ti", "Tongan", "to", "Turkish", "tr", "Turkmen (Latin)", "tk", "Ukrainian", "uk", "Upper Sorbian", "hsb", "Urdu", "ur", "Uyghur (Arabic)", "ug", "Uzbek (Latin)", "uz", "Vietnamese", "vi", "Welsh", "cy", "Yucatec Maya", "yua", "Zulu", "zu"];
const uwuDictionary = {
    "this": ["dis"],
    "the": ["da", "tha"],
    "that": ["dat"],
    "my": ["mwie"],
    "have": ["habe", "habve"],
    "epic": ["ebic"],
    "worse": ["wose"]
};
const uwuEmoticons = ["X3", ":3", "owo", "uwu", ">3<", "o3o"
    , "｡◕‿◕｡", "(o´ω｀o)", "(´･ω･`)"];

/// Functions
function randColor(){
    const r = document.querySelector(":root");
    const randColorOpacity = Math.floor(Math.random() * 255)
        + "," + Math.floor(Math.random() * 255) 
        + "," + Math.floor(Math.random() * 255);
    const randColor = "rgb(" + randColorOpacity + ")";
    r.style.setProperty("--randColor", randColor);
    r.style.setProperty("--randColorOpacity", randColorOpacity);
};

function dragStart(what){
    switch(what){
        case "settings":
            document.getElementById(what + "-box-draggable").style.visibility = "visible";
            document.getElementById(what + "-box").style.opacity = "0.5";
            break;
        default:
            document.getElementById(what + "-box-draggable").style.visibility = "visible";
            document.getElementById(what + "-box").style.opacity = "0.5";
            document.getElementById(what + "-box").style.zIndex = zIndexDrag;
            break;
    }
};
function dragStop(what){
    switch(what){
        case "settings":
            document.getElementById(what + "-box-draggable").style.visibility = "hidden";
            document.getElementById(what + "-box").style.opacity = "1";
            break;
        default:
            document.getElementById(what + "-box-draggable").style.visibility = "hidden";
            document.getElementById(what + "-box").style.opacity = "1";
            document.getElementById(what + "-box").style.zIndex = zIndexDefault;
            break;
    }
};

function sortOptgroup(optgroup){
    const optgroupOptions = $(optgroup + ' option');
    const arrOptgroupOptions = optgroupOptions
        .map(function(_, o){
            return{
                text: $(o).text(),
                value: $(o).val()
            };
        }).get();
    arrOptgroupOptions.sort(function(o1, o2){
        return o1.text > o2.text ? 1
            : o1.text < o2.text ? -1
            : 0;
    });
    optgroupOptions.each(function(i, o){
        $(o).val = arrOptgroupOptions.value;
        $(o).text(arrOptgroupOptions[i].text);
    });
};

/// Components
class SettingWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            showHideWidgets: false,
            quote: false,
            translator: false,
            googleTranslator: false,
            calculator: false,
            weather: false
        };
        this.handlePressableBtn = this.handlePressableBtn.bind(this);
    };
    handleTrick(){
        if(widgetsArray.length !== 0){
            const randWidget = Math.floor(Math.random() * widgetsArray.length);
            const randAnimation = Math.floor(Math.random() * animationsArray.length);
            const e = document.getElementById(widgetsArray[randWidget]);
            e.style.animation = "none";
            window.requestAnimationFrame(function(){
                e.style.animation = animationsArray[randAnimation] + " 2s";
            });
        };
    };
    /// Remove element at index "i" where order doesn't matter
    unorderedRemove(arr, i){
        if(i <= 0 || i >= arr.length){
            return;
        };
        if(i < arr.length-1){
            arr[i] = arr[arr.length-1];
        };
        arr.length -= 1;
    };
    /// Handles all buttons that are pressable (opacity: 0.5 on click)
    handlePressableBtn(what){
        const btn = document.getElementById("show-hide-widgets-popout-btn-" + what);
        switch(what){
            case "showHideWidgets":
                const btnShowHideWidgets = document.getElementById("settings-show-hide-widgets-btn");
                const showHideWidgetsPopout = document.getElementById("show-hide-widgets-popout");
                if(this.state.showHideWidgets === false){
                    this.setState({
                        showHideWidgets: true
                    });
                    btnShowHideWidgets.style.opacity = "1";
                    showHideWidgetsPopout.style.visibility = "visible";
                }else{
                    this.setState({
                        showHideWidgets: false
                    });
                    btnShowHideWidgets.style.opacity = "0.5";
                    showHideWidgetsPopout.style.visibility = "hidden";
                };
                break;
            case "advanced":
                break;
            case "quote":
                this.props.showHide("quote");
                if(this.state.quote === false){
                    this.setState({
                        quote: true
                    });
                    btn.style.opacity = "1";
                    widgetsArray.push("quote-box-animation");
                }else{
                    this.setState({
                        quote: false
                    });
                    btn.style.opacity = "0.5";
                    const indexQuote = widgetsArray.indexOf("quote-box-animation");
                    this.unorderedRemove(widgetsArray, indexQuote);
                };
                break;
            case "translator":
                this.props.showHide("translator");
                if(this.state.translator === false){
                    this.setState({
                        translator: true
                    });
                    btn.style.opacity = "1";
                    widgetsArray.push("translator-box-animation");
                }else{
                    this.setState({
                        translator: false
                    });
                    btn.style.opacity = "0.5";
                    const indexTranslator = widgetsArray.indexOf("translator-box-animation");
                    this.unorderedRemove(widgetsArray, indexTranslator);
                };
                break;
            case "google-translator":
                this.props.showHide("googleTranslator");
                if(this.state.googleTranslator === false){
                    this.setState({
                        googleTranslator: true
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        googleTranslator: false
                    });
                    btn.style.opacity = "0.5";
                };
                break;
            case "calculator":
                this.props.showHide("calculator");
                if(this.state.calculator === false){
                    this.setState({
                        calculator: true
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        calculator: false
                    });
                    btn.style.opacity = "0.5";
                };
                break;
            case "weather":
                this.props.showHide("weather");
                if(this.state.weather === false){
                    this.setState({
                        weather: true
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        weather: false
                    });
                    btn.style.opacity = "0.5";
                };
                break;
            default:
                break;
        };
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("settings")}
                onStop={() => dragStop("settings")}
                cancel="button, span, p, section"
                bounds="parent">
                <div id="settings-box"
                    className="widget">
                    <div id="settings-box-animation"
                        className="widget-animation">
                        <span id="settings-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "5.1vh", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <section className="option">
                            <button id="settings-show-hide-widgets-btn"
                                className="option-item btn-match-option long disabled-option"
                                onClick={() => this.handlePressableBtn("showHideWidgets")}>Show/Hide Widgets</button>
                            <section className="option-item">
                                <button className="btn-match-option medium"
                                    onClick={this.handleTrick}>Do a trick!</button>
                            </section>
                        </section>
                        {/* Show/Hide Widgets Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: -25, y: -20}}
                            bounds={{top: -200, left: -250, right: 200, bottom: 0}}>
                            <section id="show-hide-widgets-popout"
                                className="popout">
                                <section className="option space-nicely-all">
                                    <button id="show-hide-widgets-popout-btn-advanced"
                                        className="doesnt-work option-item btn-match-option long disabled-option"
                                        onClick={() => this.handlePressableBtn("advanced")}>Advanced</button>
                                    <section className="option-item">
                                        <button id="show-hide-widgets-popout-btn-quote"
                                            className="btn-match-option medium disabled-option"
                                            onClick={() => this.handlePressableBtn("quote")}>Quote</button>
                                        <button id="show-hide-widgets-popout-btn-translator"
                                            className="btn-match-option medium disabled-option"
                                            onClick={() => this.handlePressableBtn("translator")}>Translator</button>
                                    </section>
                                    <section className="option-item">
                                        <button id="show-hide-widgets-popout-btn-google-translator"
                                            className="btn-match-option medium disabled-option"
                                            onClick={() => this.handlePressableBtn("google-translator")}>Google Translator</button>
                                        <button id="show-hide-widgets-popout-btn-calculator"
                                            className="btn-match-option medium disabled-option"
                                            onClick={() => this.handlePressableBtn("calculator")}>Calculator</button>
                                    </section>
                                    <section className="option-item">
                                        <button id="show-hide-widgets-popout-btn-weather"
                                            className="btn-match-option medium disabled-option"
                                            onClick={() => this.handlePressableBtn("weather")}>Weather</button>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class QuoteWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            quotes: [
                "You all have a little bit of 'I want to save the world' in you, that's why you're here, in college. I want you to know that it's okay if you only save one person, and it's okay if that person is you.",
                "Your direction is more important than your speed.",
                "All things are difficult before they are easy.",
                "Your first workout will be bad. Your first podcast will be bad. Your first speech will be bad. Your first video will be bad. Your first ANYTHING will be bad. But you can't make your 100th without making your first.",
                "If you are depressed, you are living in the past. If you are anxious, you are living in the future. If you are at peace, you are living in the present.",
                "Accept both compliments and criticism. It takes both sun and rain for a flower to grow.",
            ],
            authors: [
                "Some college professor",
                "Richard L. Evans",
                "Thomas Fuller",
                "",
                "Lao Tzu",
                "",
            ],
            quotesInappropiate: [

            ],
            authorsInappropiate: [

            ],
            currentQuote: "",
            currentAuthor: ""
        };
        this.handleNewQuote = this.handleNewQuote.bind(this);
    };
    componentDidMount(){
        this.handleNewQuote();
    };
    handleNewQuote(){
        randColor();
        const randQuote = Math.floor(Math.random() * this.state.quotes.length);
        const randQuoteAuthor = (this.state.authors[randQuote] === "") ? "Anon" : this.state.authors[randQuote];
        this.setState({
            currentQuote: this.state.quotes[randQuote],
            currentAuthor: randQuoteAuthor
        });
        /// Restart animations
        const quoteText = document.getElementById("quote");
        const quoteAuthor = document.getElementById("author");
        quoteText.style.animation = "none";
        quoteAuthor.style.animation = "none";
        window.requestAnimationFrame(function(){
            quoteText.style.animation = "fadeIn 2s";
            quoteAuthor.style.animation = "fadeIn 2s";
        });
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("quote")}
                onStop={() => dragStop("quote")}
                cancel="button, span, p"
                bounds="parent">
                <div id="quote-box"
                    className="widget">
                    <div id="quote-box-animation"
                        className="widget-animation">
                        <span id="quote-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "8.5vh", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="quote">
                            <span className="quote large">"</span>
                            <span id="quote-text"
                                className="font large normal">{this.state.currentQuote}</span>
                            <span className="quote large">"</span>
                        </div>
                        <p id="author"
                            className="author">- {this.state.currentAuthor}</p>
                        <div className="btn-ends">
                            <a className="when-elements-are-not-straight"
                                href={`https://twitter.com/intent/tweet?text="${this.state.currentQuote}" - ${this.state.currentAuthor}`}
                                target="_blank"
                                rel="noreferrer">
                                <button className="btn-match">
                                    <IconContext.Provider value={{ color: "white", className: "global-class-name" }}>
                                        <FaTwitter/>
                                    </IconContext.Provider>
                                </button>
                            </a>
                            <button className="btn-match"
                                onClick={this.handleNewQuote}>New quote</button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class TranslatorWidget extends Component{
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
            replaceCaseSensitive: true,
            reverseWord: false,
            reverseSentence: false,
            reverseEverything: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleReplaceFrom = this.handleReplaceFrom.bind(this);
        this.handleReplaceTo = this.handleReplaceTo.bind(this);
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
            /// Encryption
            case "base64":
                this.setState(prevState => ({
                    convert: atob(prevState.input)
                }));
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
                const reUwuDictionary = new RegExp(Object.keys(uwuDictionary)
                    .map((key) => {
                        return "\\b" + key + "\\b";
                    })
                    .join("|"), "i");
                this.setState(prevState => ({
                    converted: prevState.convert
                        .toString()
                        .toLowerCase()
                        .split(/(\w+)/)
                        .map((word) => {
                            return (/[?]+/.test(word)) ? word.replace(/[?]+/, "???")
                                : (/[!]+/.test(word)) ? word.replace(/[!]+/, "!!11")
                                : (reUwuDictionary.test(word)) ? word.replace(reUwuDictionary, uwuDictionary[word][Math.floor(Math.random() * uwuDictionary[word].length)])
                                : (/(l)\1/.test(word.substring(1, word.length-1))) ? word.replace(/(l)\1/, "ww")
                                : (/(r)\1/.test(word.substring(1, word.length-1))) ? word.replace(/(r)\1/, "ww")
                                : (/[l|r]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([l|r])(\w*)/, "$1w$3")
                                : (/[h]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([h])(\w*)/, "$1b$3")
                                : (/[f]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([f])(\w*)/, "$1b$3")
                                : word.replace(/(?=\w{3,})^(\w{1})(\w*)/, "$1w$2");
                        })
                }), () => {
                    /// Insert emoticon at random position
                    var randPosition;
                    const randEmoticon = Math.floor(Math.random() * uwuEmoticons.length);
                    if(this.state.converted.length > 4){
                        randPosition = Math.floor(Math.random() * (this.state.converted.length - 2) + 2);
                        this.setState(prevState => ({
                            converted: [...prevState.converted.slice(0, randPosition)
                                , uwuEmoticons[randEmoticon]
                                , ...prevState.converted.slice(randPosition)]
                                .join(" ")
                        }));
                    }else{
                        this.setState(prevState => ({
                            converted: prevState.converted
                                .join(" ")
                        }));
                    };
                });
                break;
            /// Encryption
            case "base64":
                this.setState(prevState => ({
                    converted: btoa(prevState.convert)
                }));
                break;
            /// Modify
            case "replace":
                var reReplace;
                if(this.state.replaceCaseSensitive === true){
                    reReplace = new RegExp("(\\b" + this.state.replaceFrom + "\\b)", "g");
                }else{
                    reReplace = new RegExp("(\\b" + this.state.replaceFrom + "\\b)", "ig");
                };
                this.setState(prevState => ({
                    converted: prevState.convert
                        .replace(reReplace, prevState.replaceTo)
                }));
                break;
            case "reverse":
                if(this.state.reverseWord === true && this.state.reverseSentence === true && this.state.reverseEverything === true){
                /// Reverse Word + Sentence + Everything
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .split(/(?<=[.?!])\s*/)
                            .reverse()
                            .join(" ")
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
                            .join(" ")
                    }));
                }else if(this.state.reverseWord === true && this.state.reverseSentence === true){
                /// Reverse Word + Sentence
                    this.setState(prevState => ({
                        converted: prevState.convert
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
                            .join(" ")
                    }));
                }else if(this.state.reverseWord === true && this.state.reverseEverything === true){
                /// Reverse Word + Everything
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .split(/(?<=[.?!])\s*/)
                            .reverse()
                            .join(" ")
                            .split(/(\s|[^\w'])/g)
                            .map(function(word){
                                return word
                                    .split("")
                                    .reverse()
                                    .join("");
                            })
                            .join("")
                    }));
                }else if(this.state.reverseSentence === true && this.state.reverseEverything === true){
                /// Reverse Sentence + Everything
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .split(/(?<=[.?!])\s*/)
                            .reverse()
                            .join(" ")
                            .split(/([.?!])\s*/)
                            .map(function(sentence){
                                return sentence
                                    .split(" ")
                                    .reverse()
                                    .join(" ")
                            })
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
                        converted: prevState.convert
                            .split(/([.?!])\s*/)
                            .map(function(sentence){
                                return sentence
                                    .split(" ")
                                    .reverse()
                                    .join(" ")
                            })
                            .join(" ")
                    }));
                }else if(this.state.reverseEverything === true){
                /// Reverse Everything
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .split(/(?<=[.?!])\s*/)
                            .reverse()
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
            randColor();
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
            case "replace-case-sensitive":
                if(this.state.replaceCaseSensitive === false){
                    this.setState({
                        replaceCaseSensitive: true
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        replaceCaseSensitive: false
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "0.5";
                };
                break;
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
    componentDidMount(){
        randColor();
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
        /// Sort the "translate-to" optgroups options alphabetically
        sortOptgroup('#translator-translate-to #translate-to-other-languages');
        sortOptgroup('#translator-translate-to #translate-to-encryption');
        sortOptgroup('#translator-translate-to #translate-to-modify');
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("translator")}
                onStop={() => dragStop("translator")}
                cancel="button, span, p, textarea, select, section"
                bounds="parent">
                <div id="translator-box"
                    className="widget">
                    <div id="translator-box-animation"
                        className="widget-animation">
                        <span id="translator-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "8.5vh", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div className="center-flex">
                            <select id="translator-translate-from"
                                className="select-match"
                                defaultValue={"en"}
                                onChange={this.handleFrom}>
                                <optgroup label="Languages"
                                    id="translate-from-languages">
                                    <option value="en">English</option>
                                </optgroup>
                                <optgroup label="Other Languages"
                                    id="translate-from-other-languages">
                                    <option value="pekofy">Pekofy</option>
                                </optgroup>
                                <optgroup label="Encryption"
                                    id="translate-from-encryption">
                                    <option value="base64">Base64</option>
                                </optgroup>
                            </select>
                            <button className="btn-match-inverse"
                                onClick={this.handleSwap}>
                                <IconContext.Provider value={{ size: "1.7vh", className: "global-class-name" }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            <select id="translator-translate-to"
                                className="select-match"
                                defaultValue={"english"}
                                onChange={this.handleTo}>
                                <optgroup label="Languages"
                                    id="translate-to-languages"></optgroup>
                                <optgroup label="Other Languages"
                                    id="translate-to-other-languages">
                                    <option value="pig-latin">Pig latin</option>
                                    <option value="uwu">UwU</option>
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
                            defaultPosition={{x: 125, y: 0}}
                            bounds={{top: -105, left: -290, right: 425, bottom: 285}}>
                            <section id="replace-popout"
                                className="popout">
                                <section className="center-flex space-nicely-top">
                                    <input className="input-typable all-side input-button-input"
                                        type="text"
                                        onChange={this.handleReplaceFrom}></input>
                                    <IconContext.Provider value={{ size: "1.7vh", className: "global-class-name" }}>
                                        <FaArrowRightLong/>
                                    </IconContext.Provider> 
                                    <input className="input-typable all-side input-button-input"
                                        type="text"
                                        onChange={this.handleReplaceTo}></input>
                                </section>
                                <section className="option">
                                    <button className="option-item btn-match-option long"
                                        onClick={this.handleSave}>Save</button>
                                    <section className="option-item">
                                        <button id="replace-popout-btn-replace-case-sensitive"
                                            className="btn-match-option medium"
                                            onClick={() => this.handlePressableBtn("replace-case-sensitive", "replace")}>Case Sensitive</button>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Reverse Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 125, y: 0}}
                            bounds={{top: -105, left: -290, right: 425, bottom: 285}}>
                            <section id="reverse-popout"
                                className="popout">
                                <section className="option space-nicely-top">
                                    <button className="option-item btn-match-option long"
                                        onClick={this.handleSave}>Save</button>
                                    <section className="option-item">
                                        <button id="reverse-popout-btn-reverse-word"
                                            className="btn-match-option small disabled-option"
                                            onClick={() => this.handlePressableBtn("reverse-word", "reverse")}>Word</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match-option small disabled-option"
                                            onClick={() => this.handlePressableBtn("reverse-sentence", "reverse")}>Sentence</button>
                                        <button id="reverse-popout-btn-reverse-everything"
                                            className="btn-match-option small disabled-option"
                                            onClick={() => this.handlePressableBtn("reverse-everything", "reverse")}>Everything</button>
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
                                <section className="option space-nicely-top">
                                    <button className="option-item btn-match-option long"
                                        onClick={this.handleSave}>Save</button>
                                    <section className="option-item">
                                        <button id="case-transform-popout-btn-lower"
                                            className="btn-match-option small disabled-option"
                                            onClick={this.handleReverseWord}>Lower</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match-option small disabled-option"
                                            onClick={this.handleReverseSentence}>Upper</button>
                                        <button id="reverse-popout-btn-reverse-everything"
                                            className="btn-match-option small disabled-option"
                                            onClick={this.handleReverseEverything}>Capitalize</button>
                                    </section>
                                    <section className="option-item">
                                        <button id="reverse-popout-btn-reverse-word"
                                            className="btn-match-option small disabled-option"
                                            onClick={this.handleReverseWord}>Alternate</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match-option small disabled-option"
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
                                className="cut-scrollbar-corner-part-2 p center-flex only-justify-content">{this.state.converted}</p>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class GoogleTranslatorWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            converted: "",
            from: "",
            to: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
        this.handleTranslate = this.handleTranslate.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    async handleTranslate(){
        if(this.state.input !== ""){
            const url = 'https://translated-mymemory---translation-memory.p.rapidapi.com/get?langpair=' + this.state.from + '%7C' + this.state.to + '&q=' + this.state.input + '&mt=1&onlyprivate=0&de=a%40b.c';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.REACT_APP_TRANSLATOR_API_KEY,
                    'X-RapidAPI-Host': process.env.REACT_APP_TRANSLATOR_API_HOST
                }
            };
            try{
                const response = await fetch(url, options);
                const result = await response.json();
                this.setState({
                    converted: result.responseData.translatedText
                });
            }catch(err){
                this.setState({
                    converted: err
                });
            };
        };
    };
    /// Handles the "from" language select
    handleFrom(event){
        this.setState({
            from: event.target.value
        });
    };
    /// Handles the "to" language select
    handleTo(event){
        this.setState({
            to: event.target.value,
        });
    };
    /// Swaps "from" language and "to" language
    handleSwap(){
        if(this.state.from !== this.state.to){
            randColor();
            const prev = this.state.from;
            this.setState(prevState => ({
                from: prevState.to,
                to: prev
            }));
            const v1 = $("#google-translator-translate-from").val();
            const v2 = $("#google-translator-translate-to").val();
            $("#google-translator-translate-from").val(v2);
            $("#google-translator-translate-to").val(v1);
        };
    };
    componentDidMount(){
        randColor();
        const select = document.getElementById("select-languages");
        for(var curr = 0; curr < languages.length; curr+=2){
            var optText = languages[curr];
            var optValue = languages[curr+1];
            var el = document.createElement("option");
            el.textContent = optText;
            el.value = optValue;
            select.appendChild(el);
        };
        $('#google-translator-translate-from optgroup').clone().appendTo('#google-translator-translate-to');
        this.setState({
            from: "en",
            to: "ja"
        });
        $("#google-translator-translate-from").val("en");
        $("#google-translator-translate-to").val("ja");
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("google-translator")}
                onStop={() => dragStop("google-translator")}
                cancel="button, span, p, textarea, select"
                bounds="parent">
                <div id="google-translator-box"
                    className="widget">
                    <div id="google-translator-box-animation"
                        className="widget-animation">
                        <span id="google-translator-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "8.5vh", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div className="center-flex">
                            <select id="google-translator-translate-from"
                                className="select-match"
                                onChange={this.handleFrom}>
                                <optgroup id="select-languages"
                                    label="Languages"></optgroup>
                            </select>
                            <button className="btn-match-inverse"
                                onClick={this.handleSwap}>
                                <IconContext.Provider value={{ size: "1.7vh", className: "global-class-name" }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            <select id="google-translator-translate-to"
                                className="select-match"
                                onChange={this.handleTo}></select>
                            <button className="btn-match-inverse"
                                onClick={this.handleTranslate}>
                                <IconContext.Provider value={{ size: "1.5vh", className: "global-class-name" }}>
                                    <FaArrowRightFromBracket/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        <div className="cut-scrollbar-corner-part-1 textarea">
                            <textarea className="cut-scrollbar-corner-part-2 textarea"
                                onChange={this.handleChange}></textarea>
                        </div>
                        <div id="google-translator-preview-cut-corner"
                            className="cut-scrollbar-corner-part-1">
                            <p className="cut-scrollbar-corner-part-2 p center-flex only-justify-content">{this.state.converted}</p>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class CalculatorWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            question: "",
            input: "",
            memory: []
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    };
    handleClick(event){
        switch(event.target.value){
            case "=":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    var ans;
                    try{
                        ans = round(evaluate(this.state.input), 3);
                    }catch(err){
                        this.setState({
                            question: this.state.input,
                            input: "UNDEFINED"
                        });
                    };
                    if(ans === undefined){
                        this.setState({
                            question: this.state.input,
                            input: "UNDEFINED"
                        });
                    }else{
                        this.setState({
                            question: this.state.input,
                            input: ans
                        });
                    };
                };
                break;
            case "clear-entry":
                if(this.state.question !== ""
                    || this.state.input !== ""){
                    this.setState({
                        input: this.state.input
                            .toString()
                            .replace(/(\d+)(?!.*\d)/, "")
                    });
                };
                break;
            case "clear":
                if(this.state.question !== ""
                    || this.state.input !== ""){
                    this.setState({
                        question: "",
                        input: ""
                    });
                };
                break;
            case "delete":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: this.state.input
                            .toString()
                            .substring(0, this.state.input.length-1)
                    });
                }else{
                    this.setState({
                        input: ""
                    });
                };
                break;
            case "1/x":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: "1/(" + this.state.input + ")"
                    });
                };
                break;
            case "x^2":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: "square(" + this.state.input + ")"
                    });
                };
                break;
            case "sqrt(x)":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: "sqrt(" + this.state.input + ")"
                    });
                };
                break;
            case "negate":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: "unaryMinus(" + this.state.input + ")"
                    });
                };
                break;
            case "MC":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        memory: []
                    });
                }
                break;
            case "MR":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: this.state.memory[0]
                    });
                }
                break;
            case "M+":
                if(this.state.input !== ""
                && this.state.input !== "UNDEFINED"){
                    const lastNumberMAdd = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                    const add = evaluate(this.state.memory[0] + "+" + lastNumberMAdd);
                    this.setState({
                        memory: [add, ...this.state.memory.slice(1)]
                    });
                }
                break;
            case "M-":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    const lastNumberMSubtract = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                    const subtract = evaluate(this.state.memory[0] + "-" + lastNumberMSubtract);
                    this.setState({
                        memory: [subtract, ...this.state.memory.slice(1)]
                    });
                }
                break;
            case "MS":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    const lastNumberMS = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                    this.setState({
                        memory: [lastNumberMS, ...this.state.memory]
                    });
                }
                break;
            case "Mv":
                document.getElementById("calculator-btn-memory-display").style.visibility = "visible";
                break;
            case "memory-close":
                document.getElementById("calculator-btn-memory-display").style.visibility = "hidden";
                break;
            default:
                this.setState(prevState => ({
                    input: prevState.input + event.target.value
                }));
        };
    };
    handleDelete(){
        this.setState({
            memory: []
        });
    };
    componentDidMount(){
        randColor();
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("calculator")}
                onStop={() => dragStop("calculator")}
                cancel="button, span, p, input, textarea, section"
                bounds="parent">
                <div id="calculator-box"
                    className="widget">
                    <div id="calculator-box-animation"
                        className="widget-animation">
                        <span id="calculator-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "6.8vh", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="calculator-display-container">
                            <input id="calculator-input-display"
                                type="text"
                                value={this.state.question}
                                readOnly>
                            </input>
                            <input id="calculator-input"
                                type="text"
                                value={this.state.input}
                                readOnly>
                            </input>
                        </div>
                        <div id="calculator-memory-container"
                            className="font smaller">
                            <button id="calculator-btn-MC"
                                className="btn-match-inverse small"
                                onClick={this.handleClick}
                                value="MC">MC</button>
                            <button id="calculator-btn-MR"
                                className="btn-match-inverse small"
                                onClick={this.handleClick}
                                value="MR">MR</button>
                            <button id="calculator-btn-M+"
                                className="btn-match-inverse small"
                                onClick={this.handleClick}
                                value="M+">M+</button>
                            <button id="calculator-btn-M-"
                                className="btn-match-inverse small"
                                onClick={this.handleClick}
                                value="M-">M&minus;</button>
                            <button id="calculator-btn-MS"
                                className="btn-match-inverse small"
                                onClick={this.handleClick}
                                value="MS">MS</button>
                            <button id="calculator-btn-Mv"
                                className="btn-match-inverse small"
                                onClick={this.handleClick}
                                value="Mv">M&#709;</button>
                        </div>
                        <section id="calculator-btn-container">
                            <div id="calculator-btn-memory-display">
                                <div id="calculator-btn-memory-container">
                                    {this.state.memory.map(curr => <p>{curr}</p>)}
                                </div>
                                <button id="calculator-btn-memory-display-close"
                                    onClick={this.handleClick}
                                    value="memory-close"></button>
                                <button id="calculator-btn-trash"
                                    className="btn-match-inverse"
                                    onClick={this.handleDelete}
                                    value="trash"><FaRegTrashCan id="calculator-btn-trash-icon"/></button>
                            </div>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="%">%</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="clear-entry">CE</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="clear">C</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="delete"><FiDelete className="pointer-events-none"/></button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="1/x">1/x</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="x^2">x&sup2;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="sqrt(x)">&#8730;x</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="/">&divide;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="7">7</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="8">8</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="9">9</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="*">&times;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="4">4</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="5">5</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="6">6</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="-">&minus;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="1">1</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="2">2</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="3">3</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="+">+</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="negate"><BsPlusSlashMinus className="pointer-events-none"/></button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="0">0</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value=".">.</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="=">=</button>
                        </section>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class WeatherWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            helpShow: false,
            input: "auto:ip",
            name: "",           /// Location
            region: "",
            country: "",
            localTime: "",
            lastUpdated: "",    /// Current
            tempC: "",
            tempF: "",
            feelsLikeC: "",
            feelsLikeF: "",
            weatherCondition: "",
            weatherIcon: "",
            windMPH: "",
            windKPH: ""
        };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleHelp = this.handleHelp.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    handleHelp(){
        if(this.state.helpShow === false){
            this.setState({
                helpShow: true
            });
            document.getElementById("weather-search-help-container").style.visibility = "visible";
        }else{
            this.setState({
                helpShow: false
            });
            document.getElementById("weather-search-help-container").style.visibility = "hidden";
        };
    };
    /// API call
    async handleUpdate(){
        if(this.state.input !== ""){
            const url = "https://weatherapi-com.p.rapidapi.com/current.json?q=" + this.state.input;
            const options = {
                method: "GET",
                headers: {
                    "X-RapidAPI-Key": process.env.REACT_APP_WEATHER_API_KEY,
                    "X-RapidAPI-Host": process.env.REACT_APP_WEATHER_API_HOST
                }
            };
            try{
                const response = await fetch(url, options);
                const result = await response.json();
                this.setState({
                    name: result.location.name,
                    region: result.location.region,
                    country: result.location.country,
                    localTime: result.location.localtime,
                    lastUpdated: result.current.last_updated,
                    tempC: result.current.temp_c,
                    tempF: result.current.temp_f,
                    feelsLikeC: result.current.feelslike_c,
                    feelsLikeF: result.current.feelslike_f,
                    weatherCondition: result.current.condition.text,
                    weatherIcon: result.current.condition.icon,
                    windMPH: result.current.wind_mph,
                    windKPH: result.current.wind_kph
                });
            }catch(err){
                console.error(err);
            };
        };
    };
    componentDidMount(){
        randColor();
        this.handleUpdate();
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("weather")}
                onStop={() => dragStop("weather")}
                cancel="button, span, input, section"
                bounds="parent">
                <div id="weather-box"
                    className="widget">
                    <div id="weather-box-animation"
                        className="widget-animation">
                        <span id="weather-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "8.5vh", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="weather-search-container"
                            className="center-flex">
                            <div className="when-elements-are-not-straight">
                                <input className="input-typable right-side with-help-btn"
                                    placeholder="Enter location"
                                    onChange={this.handleChange}>
                                </input>
                                <button className="help-btn left-side when-elements-are-not-straight"
                                    onClick={this.handleHelp}>
                                    <IconContext.Provider value={{ size: "1.5vh", className: "global-class-name" }}>
                                        <FaRegCircleQuestion/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            {/* Search help popout */}
                            <Draggable
                                cancel="li"
                                defaultPosition={{x: 10, y: 120}}
                                bounds={{top: -125, left: -280, right: 300, bottom: 250}}>
                                <section id="weather-search-help-container"
                                    className="popout">
                                    <ul className="font small">
                                        <li>Latitude and Longitude <br/><span className="font small normal-transparent">e.g: 48.8567,2.3508</span></li>
                                        <li>City name <span className="font small normal-transparent">e.g.: Paris</span></li>
                                        <li>US zip <span className="font small normal-transparent">e.g.: 10001</span></li>
                                        <li>UK postcode <span className="font small normal-transparent">e.g: SW1</span></li>
                                        <li>Canada postal code <span className="font small normal-transparent">e.g: G2J</span></li>
                                        <li>Metar:&lt;metar code&gt; <span className="font small normal-transparent">e.g: metar:EGLL</span></li>
                                        <li>Iata:&lt;3 digit airport code&gt; <span className="font small normal-transparent">e.g: iata:DXB</span></li>
                                        <li>Auto IP lookup <span className="font small normal-transparent">e.g: auto:ip</span></li>
                                        <li>IP address (IPv4 and IPv6 supported) <br/><span className="font small normal-transparent">e.g: 100.0.0.1</span></li>
                                    </ul>
                                </section>
                            </Draggable>
                            <button id="weather-search-btn-update"
                                className="btn-match"
                                onClick={this.handleUpdate}>
                                Update
                            </button>
                        </div>
                        <section id="weather-info-container">
                            <div id="weather-info-icon-temp">
                                <img id="weather-info-icon"
                                    src={this.state.weatherIcon}
                                    alt="weather-icon"></img>
                                <div id="weather-info-temp-c-container">
                                    <span id="weather-info-temp-c"
                                        className="font large bold">{this.state.tempC}&deg;C</span>
                                    <span className="font small bold-transparent center-flex">{this.state.feelsLikeC}&deg;C</span>
                                </div>
                                <div id="weather-info-temp-f-container">
                                    <span id="weather-info-temp-f"
                                        className="font large bold">{this.state.tempF}&deg;F</span>
                                    <span className="font small bold-transparent center-flex">{this.state.feelsLikeF}&deg;F</span>
                                </div>
                            </div>
                            <div id="weather-info-cond-local-time"
                                className="font medium normal">
                                <span>{this.state.weatherCondition}</span>
                                <span>{this.state.localTime}</span>
                            </div>
                            <div id="weather-info-wind"
                                className="font medium normal">
                                <span>Wind:</span>
                                <span>{this.state.windKPH} KPH</span>
                                <span>{this.state.windMPH} MPH</span>
                            </div>
                            <div id="weather-info-location"
                                className="font small normal">
                                <span>{this.state.name}, {this.state.region}, {this.state.country}</span>
                            </div>
                        </section>
                        <span id="weather-last-updated"
                            className="font small normal">Last updated: {this.state.lastUpdated}</span>
                    </div>
                </div>
            </Draggable>
        );
    };
}

///////////////////////
/// Widget Template ///
///////////////////////
/*
class []Widget extends Component{
    render(){
        return(
            <Draggable
                onStart={() => dragStart("[]")}
                onStop={() => dragStop("[]")}
                cancel="button, section"
                bounds="parent">
                <div id="[]-box"
                    className="widget">
                    <div id="[]-box-animation"
                        className="widget-animation">
                        <span id="[]-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "8.5vh", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                    </div>
                </div>
            </Draggable>
        );
    };
}
*/

class Widgets extends Component{
    constructor(props){
        super(props);
        this.state = {
            quote: false,
            translator: false,
            googleTranslator: false,
            calculator: false,
            weather: false
        };
        this.handleCallBack = this.handleCallBack.bind(this);
    };
    handleCallBack(what){
        switch(what){
            case "quote":
                this.setState({
                    quote: !this.state.quote
                });
                break;
            case "translator":
                this.setState({
                    translator: !this.state.translator
                });
                break;
            case "googleTranslator":
                this.setState({
                    googleTranslator: !this.state.googleTranslator
                });
                break;
            case "calculator":
                this.setState({
                    calculator: !this.state.calculator
                });
                break;
            case "weather":
                this.setState({
                    weather: !this.state.weather
                });
                break;
            default:
                break;
        };
    };
    componentDidMount(){
        randColor();
    };
    render(){
        return(
            <div id="widget-container">
                <SettingWidget showHide={this.handleCallBack}/>
                {this.state.quote === true ? <QuoteWidget/> : <></>}
                {this.state.translator === true ? <TranslatorWidget/> : <></>}
                {this.state.googleTranslator === true ? <GoogleTranslatorWidget/> : <></>}
                {this.state.calculator === true ? <CalculatorWidget/> : <></>}
                {this.state.weather === true ? <WeatherWidget/> : <></>}
            </div>
        );
    }
};

/// Render to page
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <div id="App">
        <Widgets/>
    </div>
);