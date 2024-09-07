import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaArrowRightFromBracket, FaRegPaste, FaExpand, Fa0, FaVolumeHigh } from 'react-icons/fa6';
import { BsArrowLeftRight } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import $ from 'jquery';
import Select from "react-select";
import { IoClose } from 'react-icons/io5';


/// Variables
let voices;
/// Select option
var optionsTranslateFrom = [
    {
        label: "Languages",
        options: [
            {value: "auto", label: "Detect language"}
        ]
    }
];
var optionsTranslateTo = [
    {
        label: "Languages",
        options: []
    }
];


class WidgetGoogleTranslator extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            converted: "",
            from: {},
            to: {},
            running: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
        this.handleTranslate = this.handleTranslate.bind(this);
        this.handleRandSentence = this.handleRandSentence.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    async handleTranslate(){
        if(this.state.input !== ""){
            const url = 'https://translate281.p.rapidapi.com/';
            const data = new FormData();
            data.append('text', this.state.input);
            data.append('from', this.state.from.value);
            data.append('to', this.state.to.value);
            const options = {
                method: 'POST',
                headers: {
                    'X-RapidAPI-Key': process.env.REACT_APP_TRANSLATOR_API_KEY,
                    'X-RapidAPI-Host': process.env.REACT_APP_TRANSLATOR_API_HOST
                },
                body: data      
            };
            try{
                this.setState({
                    running: true
                });
                const response = await fetch(url, options);
                const result = await response.json();
                this.setState({
                    converted: result.response
                });
            }catch(err){
                this.setState({
                    converted: err,
                    running: false
                });
            }finally{
                this.setState({
                    running: false
                });   
            };
        };
    };
    /// Handles the "from" language select
    handleFrom(event){
        this.setState({
            from: event
        });
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    /// Handles the "to" language select
    handleTo(event){
        this.setState({
            to: event,
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
            }));
        };
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    /// Handles random sentence button
    handleRandSentence(){
        this.setState({
            input: this.props.randSentence(),
            from: {value: "auto", label: "Detect language"}
        }, () => {
            $("#translator-translate-from").val("en");
        });
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    handleTalk(){
        if(this.state.converted !== ""){
            if(speechSynthesis.speaking){
                speechSynthesis.cancel();
            }else{
                let utterance = new SpeechSynthesisUtterance(this.state.converted);
                utterance.voice = voices[this.props.voice.value];
                utterance.pitch = this.props.pitch;
                utterance.rate = this.props.rate;
                utterance.lang = this.state.from.value;
                speechSynthesis.speak(utterance);
            };
        };
    };
    componentDidMount(){
        speechSynthesis.addEventListener("voiceschanged", () => {
            voices = window.speechSynthesis.getVoices();
        }, { once: true });
        /// Populate select with 'languages' array
        for(var curr = 0; curr < this.props.languages.length; curr+=2){
            optionsTranslateTo[0]["options"].push(
                {value: this.props.languages[curr+1], label: this.props.languages[curr]}
            );
        };
        optionsTranslateFrom[0]["options"] = [...optionsTranslateFrom[0]["options"], ...optionsTranslateTo[0]["options"]];
        /// Default values
        if(sessionStorage.getItem("googletranslator") === null){
            this.setState({
                from: {value: "auto", label: "Detect language"},
                to: {value: "en", label: "English"}
            });
        }else{
            let dataSessionStorage = JSON.parse(sessionStorage.getItem("googletranslator"));
            this.setState({
                from: dataSessionStorage.from,
                to: dataSessionStorage.to
            }, () => {
                $("#googletranslator-translate-from").val(this.state.from);
                $("#googletranslator-translate-to").val(this.state.to);
            });
        };
    };
    componentWillUnmount(){
        let data = {
            "from": this.state.from,
            "to": this.state.to
        };
        sessionStorage.setItem("googletranslator", JSON.stringify(data));
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("googletranslator")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("googletranslator");
                    this.props.defaultProps.updatePosition("googletranslator", "utility", data.x, data.y);
                }}
                cancel="button, span, p, textarea, .select-match"
                bounds="parent">
                <div id="googletranslator-widget"
                    className="widget">
                    <div id="googletranslator-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="googletranslator-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("googletranslator", "close", "utility")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("googletranslator", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("googletranslator", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Selects Container */}
                        <div className="flex-center space-nicely space-bottom">
                            {/* Select From */}
                            <Select id="googletranslator-translate-from"
                                className="select-match"
                                value={this.state.from}
                                defaultValue={optionsTranslateFrom[0]["options"][0]}
                                onChange={this.handleFrom}
                                options={optionsTranslateFrom}
                                formatGroupLabel={this.props.formatGroupLabel}
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
                            <Select id="googletranslator-translate-to"
                                className="select-match"
                                value={this.state.to}
                                defaultValue={optionsTranslateTo[0]["options"][0]}
                                onChange={this.handleTo}
                                options={optionsTranslateTo}
                                formatGroupLabel={this.props.formatGroupLabel}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...this.props.selectTheme
                                    }
                                })}/>
                            <button className="button-match inverse"
                                onClick={this.handleTranslate}
                                disabled={this.state.running}>
                                <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                    <FaArrowRightFromBracket/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        <div className="cut-scrollbar-corner-part-1 textarea">
                            <textarea className="cut-scrollbar-corner-part-2 textarea"
                                name="googletranslator-textarea-input"
                                onChange={this.handleChange}
                                value={this.state.input}></textarea>
                        </div>
                        {/* Display */}
                        <div id="googletranslator-preview-cut-corner"
                            className="cut-scrollbar-corner-part-1 p">
                            <p className="cut-scrollbar-corner-part-2 p flex-center only-justify-content">{this.state.converted}</p>
                        </div>
                        {/* Bottom Buttons */}
                        <div className="element-ends float bottom">
                            <div className="flex-center row">
                                {/* Clipboard */}
                                <button className="button-match fadded inversed"
                                    onClick={() => this.props.copyToClipboard(this.state.converted)}>
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

export default WidgetGoogleTranslator;