import './App.scss';
import { Component } from 'react';
import { FaTwitter, FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';

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
        const randColorDarker = 
        r.style.setProperty("--randColor", randColor);
        r.style.setProperty("--randColorOpacity", randColorOpacity);
        r.style.setProperty("--randColorDarker", randColorDarker);
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
        document.getElementById("quote-box").style.opacity = "0.7";
    };
    handleStop(){
        document.getElementById("draggable-quote-box").style.visibility = "hidden";
        document.getElementById("quote-box").style.opacity = "1";
    };
    render(){
        return(
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                cancel="button, span, p">
                <div id="quote-box">
                    <span className="draggable"
                        id="draggable-quote-box">
                        <IconContext.Provider value={{ size: "3em", className: "global-class-name" }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    <div id="text">
                        <span className="large-quote">"</span>
                        <span id="rand-quote">{this.state.currentQuote}</span>
                        <span className="large-quote">"</span>
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
            </Draggable>
        );
    };
}

export default function App(){
    return(
        <div className="App">
            <div className="Widgets">
                <QuoteWidget/>
            </div>
        </div>
    );
}