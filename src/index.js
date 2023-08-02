import './index.scss';
import { React, Component } from 'react';
import ReactDOM from 'react-dom/client';
import { FaTwitter, FaGripHorizontal } from 'react-icons/fa';
import { FaRegTrashCan, FaRegCircleQuestion } from 'react-icons/fa6';
import { BsArrowLeftRight, BsPlusSlashMinus } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import $ from 'jquery';
import { evaluate, round } from 'mathjs';

const widgetsArray = ["animation-quote-box", "animation-settings-box"
    , "animation-translator-box", "animation-calculator-box"];
const animationsArray = ["spin", "flip", "hinge"];


class SettingWidget extends Component{
    handleTrick(){
        const randWidget = Math.floor(Math.random() * widgetsArray.length);
        const randAnimation = Math.floor(Math.random() * animationsArray.length);
        const e = document.getElementById(widgetsArray[randWidget]);
        e.style.animation = "none";
        window.requestAnimationFrame(function(){
            e.style.animation = animationsArray[randAnimation] + " 2s";
        });
    };
    handleStart(){
        document.getElementById("draggable-settings-box").style.visibility = "visible";
        document.getElementById("settings-box").style.opacity = "0.5";
    };
    handleStop(){
        document.getElementById("draggable-settings-box").style.visibility = "hidden";
        document.getElementById("settings-box").style.opacity = "1";
    };
    render(){
        return(
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                cancel="button, span, p"
                bounds="parent">
                <div id="settings-box"
                    className="widget">
                    <div id="animation-settings-box"
                        className="widgetAnimation">
                        <span className="draggable"
                            id="draggable-settings-box">
                            <IconContext.Provider value={{ size: "2em", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <button id="button-trick"
                            className="btn-match"
                            onClick={this.handleTrick}>Do a trick!</button>
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
        const r = document.querySelector(":root");
        const randQuote = Math.floor(Math.random() * this.state.quotes.length);
        const randQuoteAuthor = (this.state.authors[randQuote] === "") ? "Anon" : this.state.authors[randQuote];
        const randColorOpacity = Math.floor(Math.random() * 255)
            + "," + Math.floor(Math.random() * 255) 
            + "," + Math.floor(Math.random() * 255);
        const randColor = "rgb(" + randColorOpacity + ")";
        r.style.setProperty("--randColor", randColor);
        r.style.setProperty("--randColorOpacity", randColorOpacity);
        this.setState({
            currentQuote: this.state.quotes[randQuote],
            currentAuthor: randQuoteAuthor
        });
        /// Restart animations
        const quoteText = document.getElementById("text");
        quoteText.style.animation = "none";
        window.requestAnimationFrame(function(){
            quoteText.style.animation = "fadeIn 2s";
        });
    };
    handleStart(){
        document.getElementById("draggable-quote-box").style.visibility = "visible";
        document.getElementById("quote-box").style.opacity = "0.5";
        document.getElementById("quote-box").style.zIndex = "3";
    };
    handleStop(){
        document.getElementById("draggable-quote-box").style.visibility = "hidden";
        document.getElementById("quote-box").style.opacity = "1";
        document.getElementById("quote-box").style.zIndex = "2";
    };
    render(){
        return(
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                cancel="button, span, p"
                bounds="parent">
                <div id="quote-box"
                    className="widget">
                    <div id="animation-quote-box"
                        className="widgetAnimation">
                        <span className="draggable"
                            id="draggable-quote-box">
                            <IconContext.Provider value={{ size: "3em", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="text">
                            <span id="large-quote">"</span>
                            <span id="rand-quote">{this.state.currentQuote}</span>
                            <span id="large-quote">"</span>
                        </div>
                        <p id="author">- {this.state.currentAuthor}</p>
                        <div id="btn-container">
                            <span id="btn-left">
                                <a id="tweet-quote"
                                    href={`https://twitter.com/intent/tweet?text="${this.state.currentQuote}" - ${this.state.currentAuthor}`}
                                    target="_blank"
                                    rel="noreferrer">
                                    <button className="btn-match">
                                        <IconContext.Provider value={{ color: "white", className: "global-class-name" }}>
                                            <FaTwitter/>
                                        </IconContext.Provider>
                                    </button>
                                </a>
                            </span>
                            <button id="new-quote"
                                className="btn-match"
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
            from: "english",
            to: "english"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
    };
    handleStart(){
        document.getElementById("draggable-translator-box").style.visibility = "visible";
        document.getElementById("translator-box").style.opacity = "0.5";
        document.getElementById("translator-box").style.zIndex = "3";
    };
    handleStop(){
        document.getElementById("draggable-translator-box").style.visibility = "hidden";
        document.getElementById("translator-box").style.opacity = "1";
        document.getElementById("translator-box").style.zIndex = "2";
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
        this.convertFromText();
    };
    /// Convert the "from" language to english
    convertFromText(){
        if(this.state.from === this.state.to){
            this.setState(prevState => ({
                convert: prevState.input 
            }));
            this.convertToText();
        }else{
            switch(this.state.from){
                /// Other languages
                case "pig-latin":
                    this.setState(prevState => ({
                        convert: prevState.input
                            .split(" ")
                            .map(curr => curr
                                .replace(/(way)$/i, "")
                                .replace(/(\w*)([^aioue]*)(ay)$/i, "$1"))
                            .join(" ")
                    }));
                    this.convertToText();
                    break;
                case "pekofy":
                    this.setState(prevState => ({
                        convert: prevState.input
                            .replace(/\s(peko)/ig, "")
                    }));
                    this.convertToText();
                    break;
                default:
                    this.setState(prevState => ({
                        convert: prevState.input
                    }));
                    this.convertToText();
                    break;
            };
        };
    };
    /// Convert english to the "to" language
    convertToText(){
        if(this.state.from === this.state.to){
            this.setState(prevState => ({
                converted: prevState.input
            }));
        }else{
            switch(this.state.to){
                /// Other languages
                case "pig-latin":
                    this.setState(prevState => ({
                        converted: prevState.convert
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
                default:
                    this.setState(prevState => ({
                        converted: prevState.convert
                    }));
                    break;
            };
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
    };
    /// Swaps "from" language and "to" language
    handleSwap(){
        const prev = this.state.from;
        this.setState(prevState => ({
            from: prevState.to,
            to: prev
        }), () => {
            this.convertFromText();
        });
        const v1 = $("#translate-from").val();
        const v2 = $("#translate-to").val();
        $("#translate-from").val(v2);
        $("#translate-to").val(v1);
    };
    componentDidMount(){
        $('#translate-from optgroup').clone().appendTo('#translate-to');
    };
    render(){
        return(
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                cancel="button, span, p, textarea, select"
                bounds="parent">
                <div id="translator-box"
                    className="widget">
                    <div id="animation-translator-box"
                        className="widgetAnimation">
                        <span className="draggable"
                            id="draggable-translator-box">
                            <IconContext.Provider value={{ size: "5em", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="translator-btn-container">
                            <div id="translate-container">
                                <select id="translate-from"
                                    className="select-match"
                                    defaultValue={"english"}
                                    onChange={this.handleFrom}>
                                    <optgroup label="Languages">
                                        <option value="english">English</option>
                                    </optgroup>
                                    <optgroup label="Other Languages">
                                        {/* <option value="pig-latin">Pig latin</option> */}
                                        <option value="pekofy">Pekofy</option>
                                    </optgroup>
                                    <optgroup label="Encryption">

                                    </optgroup>
                                </select>
                                <button id="translate-btn-switch"
                                    onClick={this.handleSwap}>
                                    <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                        <BsArrowLeftRight/>
                                    </IconContext.Provider>
                                </button>
                                <select id="translate-to"
                                    className="select-match"
                                    defaultValue={"english"}
                                    onChange={this.handleTo}></select>
                            </div>
                        </div>
                        <div id="translator-textarea-cut-corner"
                            className="scrollbar-cut-corner">
                            <textarea id="translator-textarea"
                                onChange={this.handleChange}></textarea>
                        </div>
                        <div id="translator-preview-cut-corner"
                            className="scrollbar-cut-corner">
                            <p id="translator-preview">
                                {this.state.converted}
                            </p>
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
    handleStart(){
        document.getElementById("draggable-calculator-box").style.visibility = "visible";
        document.getElementById("calculator-box").style.opacity = "0.5";
        document.getElementById("calculator-box").style.zIndex = "3";
    };
    handleStop(){
        document.getElementById("draggable-calculator-box").style.visibility = "hidden";
        document.getElementById("calculator-box").style.opacity = "1";
        document.getElementById("calculator-box").style.zIndex = "2";
    };
    handleClick(event){
        switch(event.target.value){
            case "=":
                if(this.state.input !== ""){
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
                this.setState({
                    memory: []
                });
                break;
            case "MR":
                this.setState({
                    input: this.state.memory[0]
                });
                break;
            case "M+":
                const lastNumberMAdd = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                const add = evaluate(this.state.memory[0] + "+" + lastNumberMAdd);
                this.setState({
                    memory: [add, ...this.state.memory.slice(1)]
                });
                break;
            case "M-":
                const lastNumberMSubtract = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                const subtract = evaluate(this.state.memory[0] + "-" + lastNumberMSubtract);
                this.setState({
                    memory: [subtract, ...this.state.memory.slice(1)]
                });
                break;
            case "MS":
                const lastNumberMS = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                this.setState({
                    memory: [lastNumberMS, ...this.state.memory]
                });
                break;
            case "Mv":
                document.getElementById("calculator-btn-memory-display").style.visibility = "visible";
                break;
            case "memory-close":
                document.getElementById("calculator-btn-memory-display").style.visibility = "hidden";
                break;
            default:
                this.setState(prevState => ({
                    input: prevState.input += event.target.value
                }));
        };
    };
    handleDelete(){
        this.setState({
            memory: []
        });
    };
    componentDidUpdate(){
        document.getElementById("calculator-btn-memory-container")
    };
    render(){
        return(
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                cancel="button, span, p, input, textarea"
                bounds="parent">
                <div id="calculator-box"
                    className="widget">
                    <div id="animation-calculator-box"
                        className="widgetAnimation">
                        <span className="draggable"
                            id="draggable-calculator-box">
                            <IconContext.Provider value={{ size: "4em", className: "global-class-name" }}>
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
                        <div id="calculator-memory-container">
                            <button id="calculator-btn-MC"
                                className="btn-word-match"
                                onClick={this.handleClick}
                                value="MC">MC</button>
                            <button id="calculator-btn-MR"
                                className="btn-word-match"
                                onClick={this.handleClick}
                                value="MR">MR</button>
                            <button id="calculator-btn-M+"
                                className="btn-word-match"
                                onClick={this.handleClick}
                                value="M+">M+</button>
                            <button id="calculator-btn-M-"
                                className="btn-word-match"
                                onClick={this.handleClick}
                                value="M-">M-</button>
                            <button id="calculator-btn-MS"
                                className="btn-word-match"
                                onClick={this.handleClick}
                                value="MS">MS</button>
                            <button id="calculator-btn-Mv"
                                className="btn-word-match"
                                onClick={this.handleClick}
                                value="Mv">M&#709;</button>
                        </div>
                        <div id="calculator-btn-container">
                            <div id="calculator-btn-memory-display">
                                <div id="calculator-btn-memory-container">
                                    {this.state.memory.map(curr => <p>{curr}</p>)}
                                </div>
                                <button id="calculator-btn-memory-display-close"
                                    onClick={this.handleClick}
                                    value="memory-close"></button>
                                <button id="calculator-btn-trash"
                                    className="btn-word-match"
                                    onClick={this.handleDelete}
                                    value="trash"><FaRegTrashCan id="calculator-btn-trash-icon"/></button>
                            </div>
                            <button id="calculator-btn-%"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="%">%</button>
                            <button id="calculator-btn-clear-entry"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="clear-entry">CE</button>
                            <button id="calculator-btn-clear"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="clear">C</button>
                            <button id="calculator-btn-delete"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="delete"><FiDelete id="calculator-btn-delete-icon"/></button>
                            <button id="calculator-btn-1-over-x"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="1/x">1/x</button>
                            <button id="calculator-btn-x-squared"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="x^2">x&sup2;</button>
                            <button id="calculator-btn-square-root"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="sqrt(x)">&#8730;x</button>
                            <button id="calculator-btn-divide"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="/">&divide;</button>
                            <button id="calculator-btn-7"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="7">7</button>
                            <button id="calculator-btn-8"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="8">8</button>
                            <button id="calculator-btn-9"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="9">9</button>
                            <button id="calculator-btn-multiply"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="*">&times;</button>
                            <button id="calculator-btn-4"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="4">4</button>
                            <button id="calculator-btn-5"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="5">5</button>
                            <button id="calculator-btn-6"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="6">6</button>
                            <button id="calculator-btn-subtract"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="-">-</button>
                            <button id="calculator-btn-1"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="1">1</button>
                            <button id="calculator-btn-2"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="2">2</button>
                            <button id="calculator-btn-3"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="3">3</button>
                            <button id="calculator-btn-add"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="+">+</button>
                            <button id="calculator-btn-negate"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="negate"><BsPlusSlashMinus id="calculator-btn-negate-icon"/></button>
                            <button id="calculator-btn-0"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="0">0</button>
                            <button id="calculator-btn-decimal"
                                className="btn-match"
                                onClick={this.handleClick}
                                value=".">.</button>
                            <button id="calculator-btn-equal"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="=">=</button>
                        </div>
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
    handleStart(){
        document.getElementById("draggable-weather-box").style.visibility = "visible";
        document.getElementById("weather-box").style.opacity = "0.5";
        document.getElementById("weather-box").style.zIndex = "3";
    };
    handleStop(){
        document.getElementById("draggable-weather-box").style.visibility = "hidden";
        document.getElementById("weather-box").style.opacity = "1";
        document.getElementById("weather-box").style.zIndex = "2";
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
    componentDidMount(){
        this.handleUpdate();
    };
    render(){
        return(
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                cancel="button, span, p, input"
                bounds="parent">
                <div id="weather-box"
                    className="widget">
                    <div id="animation-weather-box"
                        className="widgetAnimation">
                        <span className="draggable"
                            id="draggable-weather-box">
                            <IconContext.Provider value={{ size: "3em", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="weather-search-container">
                            <div id="weather-search-input-container">
                                <input id="weather-search"
                                    placeholder="Enter location"
                                    onChange={this.handleChange}>
                                </input>
                                <button id="weather-search-help-button"
                                    onClick={this.handleHelp}>
                                    <IconContext.Provider value={{ size: "0.9em", className: "global-class-name" }}>
                                        <FaRegCircleQuestion/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            <div id="weather-search-help-container">
                                <ul>
                                    <li>Latitude and Longitude <br/><span className="font-small-light-transparent">e.g: 48.8567,2.3508</span></li>
                                    <li>City name <span className="font-small-light-transparent">e.g.: Paris</span></li>
                                    <li>US zip <span className="font-small-light-transparent">e.g.: 10001</span></li>
                                    <li>UK postcode <span className="font-small-light-transparent">e.g: SW1</span></li>
                                    <li>Canada postal code <span className="font-small-light-transparent">e.g: G2J</span></li>
                                    <li>Metar:&lt;metar code&gt; <span className="font-small-light-transparent">e.g: metar:EGLL</span></li>
                                    <li>Iata:&lt;3 digit airport code&gt; <span className="font-small-light-transparent">e.g: iata:DXB</span></li>
                                    <li>Auto IP lookup <span className="font-small-light-transparent">e.g: auto:ip</span></li>
                                    <li>IP address (IPv4 and IPv6 supported) <br/><span className="font-small-light-transparent">e.g: 100.0.0.1</span></li>
                                </ul>
                            </div>
                            <button id="weather-search-btn-update"
                                className="btn-match"
                                onClick={this.handleUpdate}>
                                Update
                            </button>
                        </div>
                        <p id="weather-info-container">
                            <div id="weather-info-icon-temp">
                                <img id="weather-info-icon"
                                    src={this.state.weatherIcon}
                                    alt="weather-icon"></img>
                                <div id="weather-info-temp-c-container">
                                    <span id="weather-info-temp-c">{this.state.tempC}&deg;C</span>
                                    <span className="font-small-bold-transparent">{this.state.feelsLikeC}&deg;C</span>
                                </div>
                                <div id="weather-info-temp-f-container">
                                    <span id="weather-info-temp-f">{this.state.tempF}&deg;F</span>
                                    <span className="font-small-bold-transparent">{this.state.feelsLikeF}&deg;F</span>
                                </div>
                            </div>
                            <div id="weather-info-cond-local-time">
                                <span>{this.state.weatherCondition}</span>
                                <span>{this.state.localTime}</span>
                            </div>
                            <div id="weather-info-wind">
                                <span>Wind:</span>
                                <span>{this.state.windMPH} MPH</span>
                                <span>{this.state.windKPH} KPH</span>
                            </div>
                            <div id="weather-info-location">
                                <span>{this.state.name}, {this.state.region}, {this.state.country}</span>
                            </div>
                        </p>
                        <span id="weather-last-updated">Last updated: {this.state.lastUpdated}</span>
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
    handleStart(){
        document.getElementById("draggable-[]-box").style.visibility = "visible";
        document.getElementById("[]-box").style.opacity = "0.5";
        document.getElementById("[]-box").style.zIndex = "3";
    };
    handleStop(){
        document.getElementById("draggable-[]-box").style.visibility = "hidden";
        document.getElementById("[]-box").style.opacity = "1";
        document.getElementById("[]-box").style.zIndex = "2";
    };
    render(){
        return(
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                cancel="button, span, p"
                bounds="parent">
                <div id="[]-box"
                    className="widget">
                    <div id="animation-[]-box"
                        className="widgetAnimation">
                        <span className="draggable"
                            id="draggable-[]-box">
                            <IconContext.Provider value={{ size: "2em", className: "global-class-name" }}>
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

function Widgets(){
    return(
        <div id="Widget-container">
            <SettingWidget/>
            <QuoteWidget/>
            <TranslatorWidget/>
            <CalculatorWidget/>
            <WeatherWidget/>
        </div>
    );
}

/// Render to page
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <div id="App">
        <Widgets/>
    </div>
);