import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegTrashCan, FaRegPaste, FaExpand, Fa0 } from 'react-icons/fa6';
import { BsPlusSlashMinus } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';
import { BiExpand } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import { evaluate, round } from 'mathjs';


class WidgetCalculator extends Component{
    constructor(props){
        super(props);
        this.state = {
            question: "",
            input: "",
            memory: [],
            expandInput: false,
            lastComputation: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePressableBtn = this.handlePressableBtn.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    handleClick(event){
        switch(event.target.value){
            case "=":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEF"){
                    var ans;
                    const reCheckOperationExist = new RegExp(`(\\d+)([${this.props.varOperation}])`);
                    if(this.state.lastComputation !== ""
                        && !reCheckOperationExist.test(this.state.input)){
                        try{
                            ans = round(evaluate(this.state.input + this.state.lastComputation), 3);
                        }catch(err){
                            this.setState({
                                question: this.state.input + this.state.lastComputation,
                                input: "UNDEF"
                            });
                        };
                        if(ans === undefined){
                            this.setState({
                                question: this.state.input + this.state.lastComputation,
                                input: "UNDEF"
                            });
                        }else{
                            this.setState({
                                question: this.state.input + this.state.lastComputation,
                                input: ans
                            });
                        };    
                    }else{
                        try{
                            ans = round(evaluate(this.state.input), 3);
                        }catch(err){
                            this.setState({
                                question: this.state.input,
                                input: "UNDEF"
                            });
                        };
                        if(ans === undefined){
                            this.setState({
                                question: this.state.input,
                                input: "UNDEF"
                            });
                        }else{
                            const reLastComputation = new RegExp(`(?!^-)(?:[${this.props.varOperation}]-?)(?=\\d*\\.?\\d+$)(?:\\d*\\.?\\d+)`);
                            this.setState({
                                question: this.state.input,
                                input: ans,
                                lastComputation: this.state.input
                                    .match(reLastComputation)
                            });
                        };
                    };
                };
                break;
            case "clear-entry":
                if(this.state.question !== ""
                    || this.state.input !== ""){
                    this.setState({
                        input: this.state.input
                            .replace(/(\d+)(?!.*\d)/, "")
                    });
                };
                break;
            case "clear":
                if(this.state.question !== ""
                    || this.state.input !== ""){
                    this.setState({
                        question: "",
                        input: "",
                        lastComputation: ""
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
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        memory: []
                    });
                }
                break;
            case "MR":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: this.state.memory[0]
                    });
                }
                break;
            case "M+":
                if(this.state.input !== ""
                && this.state.input !== "UNDEFINED"){
                    const lastNumberMAdd = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                    const add = evaluate(this.state.memory[0] + "+" + lastNumberMAdd);
                    this.setState({
                        memory: [add, ...this.state.memory.slice(1)]
                    });
                }
                break;
            case "M-":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    const lastNumberMSubtract = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                    const subtract = evaluate(this.state.memory[0] + "-" + lastNumberMSubtract);
                    this.setState({
                        memory: [subtract, ...this.state.memory.slice(1)]
                    });
                }
                break;
            case "MS":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"
                    && /[-]?\d*[.]?\d+(?=\D*$)/.test(this.state.input)){
                    const lastNumberMS = this.state.input.toString().match(/[-]?\d*[.]?\d+(?=\D*$)/);
                    this.setState({
                        memory: [lastNumberMS, ...this.state.memory]
                    });
                };
                break;
            case "Mv":
                document.getElementById("calculator-btn-memory-display").style.visibility = "visible";
                break;
            case "memory-close":
                document.getElementById("calculator-btn-memory-display").style.visibility = "hidden";
                break;
            default:
                this.setState(prevState => ({
                    input: prevState.input + event.target.value
                }));
        };
        /// Automatically scroll down in the "expand input" popout if the "input" gets too long
        const expandInputPopout = document.getElementById("calculator-input-expand-text");
        if(expandInputPopout.scrollHeight > expandInputPopout.clientHeight){
            expandInputPopout.scrollTop = expandInputPopout.scrollHeight;
        }
    };
    handleDelete(){
        this.setState({
            memory: []
        });
    };
    /// Handles all buttons that are pressable
    handlePressableBtn(what){
        const btn = document.getElementById("calculator-btn-input-expand");
        const popout = document.getElementById("calculator-input-expand-popout");
        switch(what){
            case "expand-input":
                if(this.state.expandInput === false){
                    this.setState({
                        expandInput: true
                    });
                    btn.style.color = "rgba(var(--randColorOpacity), 1)";
                    popout.style.visibility = "visible";
                }else{
                    this.setState({
                        expandInput: false
                    });
                    btn.style.color = "rgba(var(--randColorOpacity), 0.2)";
                    popout.style.visibility = "hidden";
                };
                break;
            default:
                break;
        };
    };
    /// Handles keyboard shortcuts
    handleKeypress(event){
        const btnEqual = document.getElementById("calculator-btn-equal");
        const reWords = new RegExp("\\bUNDEF\\b|\\bInfinity\\b|\\bNaN\\b");
        switch(event.key){
            case "Enter":
                if(reWords.test(this.state.input)){
                    this.setState({
                        input: ""
                    });
                }else{
                    event.preventDefault();
                    btnEqual.click();
                };
                break;
            case "Backspace":
                if(reWords.test(this.state.input)){
                    this.setState({
                        input: ""
                    });
                };
                break;
            default:
                break;
        };
    };
    handleHotbarBtn(what){
        this.props.funcHandleHotbar("calculator", what, "utility");
    };
    componentDidMount(){
        /// Add event listener
        const inputField = document.getElementById("calculator-input-field");
        inputField.addEventListener("keydown", this.handleKeypress);
        /// Read session storage
        if(sessionStorage.getItem("calculator") !== null){
            this.setState({
                memory: JSON.parse(sessionStorage.getItem("calculator")).memory
            });
        }
    };
    componentWillUnmount(){
        /// Remove event listener
        const inputField = document.getElementById("calculator-input-field");
        inputField.removeEventListener("keypress", this.handleKeypress);
        /// Add to session storage
        let data = {
            "memory": this.state.memory
        };
        sessionStorage.setItem("calculator", JSON.stringify(data));
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.varPosition.x,
                    y: this.props.varPosition.y}}
                disabled={this.props.varDragDisabled}
                onStart={() => this.props.funcDragStart("calculator")}
                onStop={() => this.props.funcDragStop("calculator")}
                onDrag={(event, data) => this.props.funcUpdatePosition("calculator", "utility", data.x, data.y)}
                cancel="button, span, p, input, textarea, section"
                bounds="parent">
                <div id="calculator-widget"
                    className="widget">
                    <div id="calculator-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="calculator-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.varMedIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.varHotbar.resetposition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.handleHotbarBtn("resetposition")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.varHotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.handleHotbarBtn("fullscreen")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Display */}
                        <div id="calculator-display-container"
                            className="flex-center column">
                            <input className="font small input-typable no-side space-nicely right short bottom short"
                                type="text"
                                value={this.state.question}
                                readOnly>
                            </input>
                            <input id="calculator-input-field"
                                className="font large bold input-typable no-side"
                                type="text"
                                value={this.state.input}
                                onChange={this.handleChange}>
                            </input>
                        </div>
                        {/* Utility Bar */}
                        <div className="font smaller flex-center space-nicely bottom short">
                            <button className="btn-match fadded inverse"
                                onClick={() => this.props.funcCopyToClipboard(this.state.input)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                            <button id="calculator-btn-input-expand" 
                                className="btn-match fadded inverse"
                                onClick={() => this.handlePressableBtn("expand-input")}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <BiExpand/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        {/* Memory Bar */}
                        <div className="font smaller flex-center space-nicely bottom short">
                            <button id="calculator-btn-MC"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="MC">MC</button>
                            <button id="calculator-btn-MR"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="MR">MR</button>
                            <button id="calculator-btn-M+"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="M+">M+</button>
                            <button id="calculator-btn-M-"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="M-">M&minus;</button>
                            <button id="calculator-btn-MS"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="MS">MS</button>
                            <button id="calculator-btn-Mv"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="Mv">M&#709;</button>
                        </div>
                        {/* Buttons */}
                        <section className="grid col-4">
                            {/* Memory Display */}
                            <div id="calculator-btn-memory-display">
                                <div id="calculator-btn-memory-container">
                                    {this.state.memory.map((curr, i) => <p key={i}>{curr}</p>)}
                                </div>
                                <button id="calculator-btn-memory-display-close"
                                    onClick={this.handleClick}
                                    value="memory-close"></button>
                                <button id="calculator-btn-trash"
                                    className="btn-match inverse"
                                    onClick={this.handleDelete}
                                    value="trash"><FaRegTrashCan id="calculator-btn-trash-icon"/></button>
                            </div>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="%">%</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="clear-entry">CE</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="clear">C</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="delete"><FiDelete className="pointer-events-none"/></button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="1/x">1/x</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="x^2">x&sup2;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="sqrt(x)">&#8730;x</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="/">&divide;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="7">7</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="8">8</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="9">9</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="*">&times;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="4">4</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="5">5</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="6">6</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="-">&minus;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="1">1</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="2">2</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="3">3</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="+">+</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="negate"><BsPlusSlashMinus className="pointer-events-none"/></button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="0">0</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value=".">.</button>
                            <button id="calculator-btn-equal"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="=">=</button>
                        </section>
                        {/* Expand Input Popout */}
                        <Draggable
                            cancel="p"
                            position={{
                                x: this.props.varPositionPopout.expandinput.x,
                                y: this.props.varPositionPopout.expandinput.y}}
                            onDrag={(event, data) => this.props.funcUpdatePosition("calculator", "utility", data.x, data.y, "popout", "expandinput")}
                            bounds={{top: -460, left: -150, right: 190, bottom: 10}}>
                            <section id="calculator-input-expand-popout"
                                className="popout">
                                <p id="calculator-input-expand-text"
                                    className="cut-scrollbar-corner-part-2 p short font medium break-word space-nicely all long">
                                    {this.state.input}
                                </p>
                            </section>
                        </Draggable>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetCalculator;