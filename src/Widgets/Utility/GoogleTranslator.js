import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaArrowRightFromBracket, FaRegPaste, FaExpand, Fa0 } from 'react-icons/fa6';
import { BsArrowLeftRight } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import $ from 'jquery';
import Select from "react-select";


/// Select option
const optionsTranslate = [
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
            from: "",
            to: ""
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
    };
    async handleTranslate(){
        if(this.state.input !== ""){
            const url = 'https://translated-mymemory---translation-memory.p.rapidapi.com/get?langpair=' + this.state.from.value + '%7C' + this.state.to.value + '&q=' + this.state.input + '&mt=1&onlyprivate=0&de=a%40b.c';
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
            from: event
        });
    };
    /// Handles the "to" language select
    handleTo(event){
        this.setState({
            to: event,
        });
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
    };
    /// Handles random sentence button
    handleRandSentence(){
        this.setState({
            input: this.props.randSentence(),
            from: "en"
        }, () => {
            $("#translator-translate-from").val("en");
        });
    };
    componentDidMount(){
        /// Populate select with 'languages' array
        for(var curr = 0; curr < this.props.languages.length; curr+=2){
            // var optText = this.props.languages[curr];
            // var optValue = this.props.languages[curr+1];
            // var el = document.createElement("option");
            // el.textContent = optText;
            // el.value = optValue;
            // select.appendChild(el);
            optionsTranslate[0]["options"].push(
                {value: this.props.languages[curr+1], label: this.props.languages[curr]}
            );
        };
        /// Default values
        if(sessionStorage.getItem("googletranslator") === null){
            this.setState({
                from: {value: "en", label: "English"},
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
                onStop={() => this.props.defaultProps.dragStop("googletranslator")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("googletranslator", "utility", data.x, data.y)}
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
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("googletranslator", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("googletranslator", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Select */}
                        <div className="flex-center space-nicely bottom">
                            {/* Select From */}
                            <Select id="googletranslator-translate-from"
                                className="select-match"
                                value={this.state.from}
                                defaultValue={optionsTranslate[0]["options"][0]}
                                onChange={this.handleFrom}
                                options={optionsTranslate}
                                formatGroupLabel={this.props.formatGroupLabel}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...this.props.selectTheme
                                    }
                                })}/>
                            <button className="btn-match inverse"
                                onClick={this.handleSwap}>
                                <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            {/* Select To */}
                            <Select id="googletranslator-translate-to"
                                className="select-match"
                                value={this.state.to}
                                defaultValue={optionsTranslate[0]["options"][0]}
                                onChange={this.handleTo}
                                options={optionsTranslate}
                                formatGroupLabel={this.props.formatGroupLabel}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...this.props.selectTheme
                                    }
                                })}/>
                            <button className="btn-match inverse"
                                onClick={this.handleTranslate}>
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
                        <div id="googletranslator-preview-cut-corner"
                            className="cut-scrollbar-corner-part-1 p">
                            <p className="cut-scrollbar-corner-part-2 p flex-center only-justify-content">{this.state.converted}</p>
                            <button className="float bottom-right btn-match fadded"
                                onClick={this.handleRandSentence}>Random sentence</button>
                            <button className="float bottom-left btn-match fadded inverse"
                                onClick={() => this.props.copyToClipboard(this.state.converted)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Kyle</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetGoogleTranslator;