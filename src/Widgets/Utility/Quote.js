import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegPaste, FaExpand } from 'react-icons/fa6';
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
        const randQuote = Math.floor(Math.random() * this.props.varQuotes.length);
        const randQuoteAuthor = (this.props.varQuotes[randQuote]["au"] === "") ? "Anon" : this.props.varQuotes[randQuote]["au"];
        this.setState({
            currentQuote: this.props.varQuotes[randQuote]["qte"],
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
    handleHotbarBtn(what){
        this.props.funcHandleHotbar("quote", what, "utility");
    };
    componentDidMount(){
        this.handleNewQuote();
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.varPosition.x,
                    y: this.props.varPosition.y}}
                disabled={this.props.varDragDisabled}
                onStart={() => this.props.funcDragStart("quote")}
                onStop={() => this.props.funcDragStop("quote")}
                onDrag={(event, data) => this.props.funcUpdatePosition("quote", "utility", data.x, data.y)}
                cancel="button, span, p"
                bounds="parent">
                <div id="quote-widget" 
                    className="widget">
                    <div id="quote-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="quote-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.varLargeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        {(this.props.varFullscreenFeature) 
                            ? <section className="hotbar">
                                <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.handleHotbarBtn("fullscreen")}>
                                    <FaExpand/>
                                </button>
                            </section>
                            : <></>}
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
                                onClick={() => this.props.funcCopyToClipboard(this.state.currentQuote)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                            <button className="btn-match"
                                onClick={this.handleNewQuote}>New quote</button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetQuote;