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
    handleClick(event, where){
        switch(event.target.value){
            case "number":
                this.setState({
                    input: this.state.memory[where]
                });
                break;
            case "=":
                if(this.state.input !== ""
                    && !/\\bUNDEF\\b|\\bInfinity\\b|\\bNaN\\b/.test(this.state.input)){
                    var ans;
                    const reCheckOperationExist = new RegExp(`(\\d+)([${this.props.operation}])`);
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
                            const reLastComputation = new RegExp(`(?!^-)(?:[${this.props.operation}]-?)(?=\\d*\\.?\\d+$)(?:\\d*\\.?\\d+)`);
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
                let contianerMemory = document.getElementById("calculator-btn-memory-container");
                if(where !== undefined){
                    if(where === 0){
                        this.setState({
                            memory: [...this.state.memory.slice(0, this.state.memory.length - 1)]
                        }, () => {
                            this.updateLabelMemory();
                        });
                    }else{
                        this.setState({
                            memory: [...this.state.memory.slice(0, (this.state.memory.length - 1) - where), ...this.state.memory.slice(this.state.memory.length - where)]
                        }, () => {
                            this.updateLabelMemory();
                        });
                    };
                    contianerMemory.removeChild(
                        contianerMemory.children[where]
                    );
                }else{
                    this.setState({
                        memory: []
                    });
                    contianerMemory.innerHTML = "";
                };
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
                    let lastNumberMAdd = this.state.input.toString().match(/[-]?\d*[.]?\d+(?=\D*$)/);
                    var add;
                    if(where !== undefined){
                        add = evaluate(this.state.memory[where] + "+" + lastNumberMAdd);
                        this.setState({
                            memory: [...this.state.memory.slice(0, where), add, ...this.state.memory.slice(where + 1)]
                        });
                        document.getElementById("calculator-btn-memory-container")
                            .children[where]
                            .children[0]
                            .innerHTML = add;
                    }else{
                        add = evaluate(this.state.memory[0] + "+" + lastNumberMAdd);
                        this.setState({
                            memory: [add, ...this.state.memory.slice(1)]
                        });
                        document.getElementById("calculator-btn-memory-container")
                            .children[0]
                            .children[0]
                            .innerHTML = add;
                    };
                }
                break;
            case "M-":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    let lastNumberMSubtract = this.state.input.toString().match(/[-]?\d*[.]?\d+(?=\D*$)/);
                    var subtract;
                    if(where !== undefined){
                        subtract = evaluate(this.state.memory[where] + "-" + lastNumberMSubtract);
                        this.setState({
                            memory: [...this.state.memory.slice(0, where), subtract, ...this.state.memory.slice(where + 1)]
                        });
                        document.getElementById("calculator-btn-memory-container")
                            .children[where]
                            .children[0]
                            .innerHTML = subtract;
                    }else{
                        subtract = evaluate(this.state.memory[0] + "-" + lastNumberMSubtract);
                        this.setState({
                            memory: [subtract, ...this.state.memory.slice(1)]
                        });
                        document.getElementById("calculator-btn-memory-container")
                            .children[0]
                            .children[0]
                            .innerHTML = subtract;
                    };
                };
                break;
            case "MS":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"
                    && /[-]?\d*[.]?\d+(?=\D*$)/.test(this.state.input)){
                    const lastNumberMS = this.state.input.toString().match(/[-]?\d*[.]?\d+(?=\D*$)/);
                    this.setState({
                        memory: [lastNumberMS, ...this.state.memory]
                    }, () => {
                        this.createLabelMemory(lastNumberMS, this.state.memory.length - 1);
                        this.updateLabelMemory();
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
        document.getElementById("calculator-btn-memory-container")
            .innerHTML = "";
    };
    /// Handles all buttons that are pressable
    handlePressableBtn(what){
        let button = document.getElementById(`calculator-btn-${what}`);
        let popoutAnimation = document.getElementById(`calculator-${what}-popout-animation`);
        let whatState = what
            .replace(/-(.)/, (all, char) => char.toUpperCase()); 
        this.setState({
            [whatState]: !this.state[whatState]
        });
        this.props.defaultProps.showHidePopout(popoutAnimation, !this.state[whatState], button, true);
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
    /// Creates a memory label
    createLabelMemory(what, index){
        let divLabel = document.createElement("div");
        let divButtons = document.createElement("div");
        let spanLabel = document.createElement("span");
        let buttonClear = document.createElement("button");
        let buttonAdd = document.createElement("button");
        let buttonSubtract = document.createElement("button");
        divLabel.className = "flex-center row justify-content-right hoverable-label";
        /// Number
        spanLabel.value = "number";
        spanLabel.onclick = (event) => {
            this.handleClick(event, index);
        };
        spanLabel.innerHTML = what;
        divLabel.appendChild(spanLabel);
        /// Buttons
        divButtons.className = "flex-center row gap only-flex float middle-left";
        /// Button: MC
        buttonClear.className = "btn-match fadded option";
        buttonClear.value = "MC";
        buttonClear.onclick = (event) => {
            this.handleClick(event, index);
        };
        buttonClear.appendChild(document.createTextNode("MC"));
        divButtons.appendChild(buttonClear);
        /// Button: M+
        buttonAdd.className = "btn-match fadded option";
        buttonAdd.value = "M+";
        buttonAdd.onclick = (event) => {
            this.handleClick(event, index);
        };
        buttonAdd.appendChild(document.createTextNode("M+"));
        divButtons.appendChild(buttonAdd);
        /// Button: M-
        buttonSubtract.className = "btn-match fadded option";
        buttonSubtract.value = "M-";
        buttonSubtract.onclick = (event) => {
            this.handleClick(event, index);
        };
        buttonSubtract.appendChild(document.createTextNode("M\u2212"));
        divButtons.appendChild(buttonSubtract);
        divLabel.appendChild(divButtons);
        document.getElementById("calculator-btn-memory-container")
            .appendChild(divLabel);
    };
    /// Updates memory labels
    updateLabelMemory(){
        document.getElementById("calculator-btn-memory-container")
            .innerHTML = "";
        this.state.memory.forEach((value, index) => {
            this.createLabelMemory(value, index);    
        });
    };
    componentDidMount(){
        /// Add event listener
        const inputField = document.getElementById("calculator-input-field");
        inputField.addEventListener("keydown", this.handleKeypress);
        /// Read session storage
        if(sessionStorage.getItem("calculator") !== null){
            this.setState({
                memory: JSON.parse(sessionStorage.getItem("calculator")).memory
            }, () => {
                this.state.memory.forEach((value, index) => {
                    this.createLabelMemory(value, index);    
                });
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
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("calculator")}
                onStop={() => this.props.defaultProps.dragStop("calculator")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("calculator", "utility", data.x, data.y)}
                cancel="button, span, p, input, textarea, section"
                bounds="parent">
                <div id="calculator-widget"
                    className="widget">
                    <div id="calculator-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="calculator-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.medIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("calculator", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("calculator", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Display */}
                        <div id="calculator-display-container"
                            className="flex-center column">
                            <input className="font small input-typable no-side space-nicely right short bottom short"
                                name="calculator-input-question"
                                type="text"
                                value={this.state.question}
                                readOnly>
                            </input>
                            <input id="calculator-input-field"
                                className="font large bold input-typable no-side"
                                name="calculator-input-input"
                                type="text"
                                value={this.state.input}
                                onChange={this.handleChange}>
                            </input>
                        </div>
                        {/* Utility Bar */}
                        <div className="font smaller flex-center space-nicely bottom short">
                            <button className="btn-match fadded inverse"
                                onClick={() => this.props.copyToClipboard(this.state.input)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                            <button id="calculator-btn-input-expand" 
                                className="btn-match fadded inverse"
                                onClick={() => this.handlePressableBtn("input-expand")}>
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
                                <div id="calculator-btn-memory-container"></div>
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
                                x: this.props.positionPopout.expandinput.x,
                                y: this.props.positionPopout.expandinput.y}}
                            onDrag={(event, data) => this.props.defaultProps.updatePosition("calculator", "utility", data.x, data.y, "popout", "expandinput")}
                            bounds={{top: -460, left: -150, right: 190, bottom: 10}}>
                            <section id="calculator-input-expand-popout"
                                className="popout">
                                <section id="calculator-input-expand-popout-animation"
                                    className="popout-animation">
                                    <p id="calculator-input-expand-text"
                                        className="cut-scrollbar-corner-part-2 p short font medium break-word space-nicely all long">
                                        {this.state.input}
                                    </p>
                                </section>
                            </section>
                        </Draggable>
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

export default WidgetCalculator;