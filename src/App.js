import './App.scss';
import { Component } from 'react';
import { FaTwitter, FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';

const widgetsArray = ["animation-quote-box", "animation-settings-box"];
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
            ],
            authors: [
                "Some college professor",
                "Richard L. Evans",
                "Thomas Fuller",
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
        const randColorOpacity = Math.floor(Math.random() * 255)
            + "," + Math.floor(Math.random() * 255) 
            + "," + Math.floor(Math.random() * 255);
        const randColor = "rgb(" + randColorOpacity + ")";
        r.style.setProperty("--randColor", randColor);
        r.style.setProperty("--randColorOpacity", randColorOpacity);
        this.setState({
            currentQuote: this.state.quotes[randQuote],
            currentAuthor: this.state.authors[randQuote]
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
            input: ""
        };
        this.handleChange = this.handleChange.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    render(){
        return(
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                cancel="button, span, p, textarea"
                bounds="parent">
                <div id="translator-box"
                    className="widget">
                    <div id="animation-translator-box"
                        className="widgetAnimation">
                        <span className="draggable"
                            id="draggable-translator-box">
                            <IconContext.Provider value={{ size: "2em", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="translator-textarea-outer">
                            <div id="translator-textarea-inner">
                                <textarea id="translator-textarea"
                                    onChange={this.handleChange}></textarea>
                            </div>
                        </div>
                        <div id="translator-preview-outer">
                            <div id="translator-preview-inner">
                                <p id="translator-preview">
                                    {this.state.input}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}

export default function App(){
    return(
        <div id="App">
            <div id="Widget-container">
                <SettingWidget/>
                <QuoteWidget/>
                <TranslatorWidget/>
            </div>
        </div>
    );
}