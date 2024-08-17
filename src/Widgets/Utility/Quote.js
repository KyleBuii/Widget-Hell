import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegPaste, FaExpand, Fa0, FaVolumeHigh } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


/// Variables
var voices;


class WidgetQuote extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentQuote: "",
            currentAuthor: ""
        };
        this.handleNewQuote = this.handleNewQuote.bind(this);
    };
    handleNewQuote(){
        const randQuote = Math.floor(Math.random() * this.props.quotes.length);
        const randQuoteAuthor = (this.props.quotes[randQuote]["author"] === "") ? "Anon" : this.props.quotes[randQuote]["author"];
        this.setState({
            currentQuote: this.props.quotes[randQuote]["quote"],
            currentAuthor: randQuoteAuthor
        });
        /// Restart animations
        const quoteText = document.getElementById("quote-container");
        const quoteAuthor = document.getElementById("author-container");
        quoteText.style.animation = "none";
        quoteAuthor.style.animation = "none";
        window.requestAnimationFrame(() => {
            quoteText.style.animation = "fadeIn 2s";
            quoteAuthor.style.animation = "fadeIn 2s";
        });
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    handleTalk(){
        if(this.state.currentQuote !== ""){
            if(speechSynthesis.speaking){
                speechSynthesis.cancel();
            }else{
                let utterance = new SpeechSynthesisUtterance(this.state.currentQuote);
                utterance.voice = voices[this.props.voice.value];
                utterance.pitch = this.props.pitch;
                utterance.rate = this.props.rate;
                speechSynthesis.speak(utterance);
            };
        };
    };
    componentDidMount(){
        speechSynthesis.addEventListener("voiceschanged", () => {
            voices = window.speechSynthesis.getVoices();
        }, { once: true });
        this.handleNewQuote();
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("quote")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("quote");
                    this.props.defaultProps.updatePosition("quote", "utility", data.x, data.y);
                }}
                cancel="button, span, p"
                bounds="parent">
                <div id="quote-widget" 
                    className="widget">
                    <div id="quote-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="quote-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("quote", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("quote", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Quote */}
                        <div id="quote-container">
                            <span className="font-quote large">"</span>
                            <span id="quote-text"
                                className="font large normal">{this.state.currentQuote}</span>
                            <span className="font-quote large">"</span>
                        </div>
                        <p id="author-container"
                            className="font-author">- {this.state.currentAuthor}</p>
                        {/* Bottom Bar */}
                        <div className="element-ends">
                            <div className="flex-center row space-nicely left">
                                {/* Clipboard */}
                                <button className="btn-match fadded inversed"
                                    onClick={() => this.props.copyToClipboard(this.state.currentQuote)}>
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
                            {/* New Quote */}
                            <button className="btn-match"
                                onClick={this.handleNewQuote}>New quote</button>
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

export default WidgetQuote;