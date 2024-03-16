import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegPaste, FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


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
        const randQuoteAuthor = (this.props.quotes[randQuote]["au"] === "") ? "Anon" : this.props.quotes[randQuote]["au"];
        this.setState({
            currentQuote: this.props.quotes[randQuote]["qte"],
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
    };
    componentDidMount(){
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
                onStop={() => this.props.defaultProps.dragStop("quote")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("quote", "utility", data.x, data.y)}
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
                            {(this.props.defaultProps.hotbar.resetposition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("quote", "resetposition", "utility")}>
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
                        <div className="element-ends space-nicely left">
                            <button className="btn-match fadded inverse"
                                onClick={() => this.props.copyToClipboard(this.state.currentQuote)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                            <button className="btn-match"
                                onClick={this.handleNewQuote}>New quote</button>
                        </div>
                        {/* Author */}
                        {(this.props.defaultProps.values.authornames)
                            ? <span className="font smaller transparent-normal author-name">Created by Kyle</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetQuote;