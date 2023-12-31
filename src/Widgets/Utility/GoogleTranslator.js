import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaArrowRightFromBracket, FaRegPaste } from 'react-icons/fa6';
import { BsArrowLeftRight } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import $ from 'jquery';


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
            this.props.funcRandColor();
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
    /// Handles random sentence button
    handleRandSentence(){
        this.setState({
            input: this.props.funcRandSentence(),
            from: "en"
        }, () => {
            $("#translator-translate-from").val("en");
        });
    };
    componentDidMount(){
        this.props.funcRandColor();
        const select = document.getElementById("select-languages");
        for(var curr = 0; curr < this.props.varLanguages.length; curr+=2){
            var optText = this.props.varLanguages[curr];
            var optValue = this.props.varLanguages[curr+1];
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
                onStart={() => this.props.funcDragStart("google-translator")}
                onStop={() => this.props.funcDragStop("google-translator")}
                cancel="button, span, p, textarea, select"
                bounds="parent">
                <div id="google-translator-box"
                    className="widget">
                    <div id="google-translator-box-animation"
                        className="widget-animation">
                        <span id="google-translator-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.varLargeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div className="flex-center space-nicely bottom">
                            <select id="google-translator-translate-from"
                                className="select-match"
                                onChange={this.handleFrom}>
                                <optgroup id="select-languages"
                                    label="Languages"></optgroup>
                            </select>
                            <button className="btn-match inverse"
                                onClick={this.handleSwap}>
                                <IconContext.Provider value={{ size: this.props.varSmallIcon, className: "global-class-name" }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            <select id="google-translator-translate-to"
                                className="select-match"
                                onChange={this.handleTo}></select>
                            <button className="btn-match inverse"
                                onClick={this.handleTranslate}>
                                <IconContext.Provider value={{ size: this.props.varSmallIcon, className: "global-class-name" }}>
                                    <FaArrowRightFromBracket/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        <div className="cut-scrollbar-corner-part-1 textarea">
                            <textarea className="cut-scrollbar-corner-part-2 textarea"
                                onChange={this.handleChange}
                                value={this.state.input}></textarea>
                        </div>
                        <div id="google-translator-preview-cut-corner"
                            className="cut-scrollbar-corner-part-1 p">
                            <p className="cut-scrollbar-corner-part-2 p flex-center only-justify-content">{this.state.converted}</p>
                            <button className="bottom-right btn-match fadded"
                                onClick={this.handleRandSentence}>Random sentence</button>
                            <button className="bottom-left btn-match fadded inverse"
                                onClick={() => this.props.funcCopyToClipboard(this.state.converted)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetGoogleTranslator;