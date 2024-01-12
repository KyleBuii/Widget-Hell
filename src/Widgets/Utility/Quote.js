import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegPaste } from 'react-icons/fa6';
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
    componentDidMount(){
        this.handleNewQuote();
    };
    handleNewQuote(){
        this.props.funcRandColor();
        const randQuote = Math.floor(Math.random() * this.props.varQuotes.length);
        const randQuoteAuthor = (this.props.varQuotes[randQuote]["au"] === "") ? "Anon" : this.props.varQuotes[randQuote]["au"];
        this.setState({
            currentQuote: this.props.varQuotes[randQuote]["qte"],
            currentAuthor: randQuoteAuthor
        });
        /// Restart animations
        const quoteText = document.getElementById("quote");
        const quoteAuthor = document.getElementById("author");
        quoteText.style.animation = "none";
        quoteAuthor.style.animation = "none";
        window.requestAnimationFrame(() => {
            quoteText.style.animation = "fadeIn 2s";
            quoteAuthor.style.animation = "fadeIn 2s";
        });
    };
    render(){
        return(
            <Draggable
                onStart={() => this.props.funcDragStart("quote")}
                onStop={() => this.props.funcDragStop("quote")}
                cancel="button, span, p"
                bounds="parent">
                <div id="quote-box"
                    className="widget">
                    <div id="quote-box-animation"
                        className="widget-animation">
                        <span id="quote-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.varLargeIcon, className: "global-class-name" }}>
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