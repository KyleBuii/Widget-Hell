import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0, FaBold, FaSuperscript, FaSubscript, FaListOl, FaListUl, FaRotateLeft, FaRotateRight, FaLink, FaLinkSlash, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaIndent, FaOutdent, FaHighlighter } from 'react-icons/fa6';
import { MdFormatColorText } from 'react-icons/md';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


class WidgetNotepad extends Component{
    constructor(props){
        super(props);
        this.state = {
            text: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    handleChange(event){
        this.setState({
            text: event.target.value
        });
    };
    handleButton(where, what = null){
        let element = document.getElementById(`notepad-button-${where}`);
        if(where === "superscript"){
            if(element.classList.contains("inversed-active")){
                element.checked = false;
            };
        };
        if(where === "subscript"){
            if(element.classList.contains("inversed-active")){
                element.checked = false;
            };
        };
        element.classList.toggle("inversed-active");
        this.handleText(where, what);
    };
    handleText(where, what = null){
        document.execCommand(where, false, what);
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["utility"]["notepad"] = {
                ...dataLocalStorage["utility"]["notepad"],
                text: this.state.text
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    componentDidMount(){
        /// Populate font size section
        let sectionFontSize = document.getElementById("notepad-section-font-size");
        for(let i = 1; i <= 7; i++){
            let button = document.createElement("button");
            let span = document.createElement("span");
            button.className = "btn-match inverse";
            button.onclick = () => {
                this.handleText("fontSize", i);
            };
            span.className = "font bold";
            span.innerText = i;
            button.appendChild(span);
            sectionFontSize.appendChild(button);
        };
        /// Load widget's data from local storage
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            let localStorageSpreadsheet = dataLocalStorage["utility"]["notepad"];
            if(localStorageSpreadsheet["text"] !== undefined){
                this.setState({
                    text: localStorageSpreadsheet["text"]
                });
            };
        };
    };
    componentWillUnmount(){
        this.storeData();
    };
    render(){
        return(
            <Draggable 
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("notepad")}
                onStop={() => this.props.defaultProps.dragStop("notepad")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("notepad", "utility", data.x, data.y)}
                cancel="button, .select-match, input, label, p"
                bounds="parent">
                <div id="notepad-widget"
                    className="widget">
                    <div id="notepad-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="notepad-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("notepad", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("notepad", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Utility Bar */}
                        <section className="flex-center row gap small space-nicely bottom">
                            {/* Buttons */}
                            <section className="flex-center column">
                                {/* General */}
                                <section className="flex-center row">
                                    <button id="notepad-button-bold" 
                                        className="btn-match fadded inversed"
                                        onClick={() => this.handleButton("bold")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaBold/>
                                        </IconContext.Provider>
                                    </button>
                                    <div className="radio-match inverse">
                                        <input id="notepad-button-superscript"
                                            type="radio"
                                            name="groupScript"
                                            value="superscript"
                                            onClick={(event) => this.handleButton(event.target.value)}/>
                                        <label htmlFor="notepad-button-superscript">
                                            <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                                <FaSuperscript/>
                                            </IconContext.Provider>
                                        </label>
                                    </div>
                                    <div className="radio-match inverse">
                                        <input id="notepad-button-subscript"
                                            type="radio"
                                            name="groupScript"
                                            value="subscript"
                                            onClick={(event) => this.handleButton(event.target.value)}/>
                                        <label htmlFor="notepad-button-subscript">
                                            <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                                <FaSubscript/>
                                            </IconContext.Provider>
                                        </label>
                                    </div>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("insertOrderedList")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaListOl/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("insertUnorderedList")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaListUl/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("undo")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaRotateLeft/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("redo")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaRotateRight/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => {
                                            let link = prompt("Enter a URL");
                                            if(!/http/i.test(link)){
                                                link = `http://${link}`;    
                                            };
                                            this.handleText("createLink", `<a href="${link}"></a>`);
                                        }}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaLink/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("unlink")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaLinkSlash/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("justifyLeft")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaAlignLeft/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("justifyCenter")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaAlignCenter/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("justifyRight")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaAlignRight/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("justifyFull")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaAlignJustify/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("indent")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaIndent/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("outdent")}>
                                        <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                            <FaOutdent/>
                                        </IconContext.Provider>
                                    </button>
                                    {/* Font Color */}
                                    <div className="color-input-button">
                                        <button className="btn-match inverse">
                                            <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                                <MdFormatColorText/>
                                            </IconContext.Provider>
                                        </button>
                                        <input type="color"
                                            onBlur={(event) => this.handleText("foreColor", event.target.value)}></input>
                                    </div>
                                    {/* Highlight Color */}
                                    <div className="color-input-button">
                                        <button className="btn-match inverse">
                                            <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                                <FaHighlighter/>
                                            </IconContext.Provider>
                                        </button>
                                        <input type="color"
                                            onBlur={(event) => this.handleText("backColor", event.target.value)}></input>
                                    </div>
                                </section>
                                {/* Font Name */}
                                <section className="flex-center row">
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("fontName", "Arial")}>
                                        <span className="font bold">Arial</span>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("fontName", "Verdana")}>
                                        <span className="font bold">Verdana</span>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("fontName", "Times New Roman")}>
                                        <span className="font bold">Times New Roman</span>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("fontName", "Garamond")}>
                                        <span className="font bold">Garamond</span>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("fontName", "Georgia")}>
                                        <span className="font bold">Georgia</span>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("fontName", "Courier New")}>
                                        <span className="font bold">Courier New</span>
                                    </button>
                                    <button className="btn-match inverse"
                                        onClick={() => this.handleText("fontName", "Cursive")}>
                                        <span className="font bold">Cursive</span>
                                    </button>
                                </section>
                                {/* Headers and Font Size */}
                                <section id="notepad-section-header-and-font-size" 
                                    className="flex-center row gap small">
                                    <section>
                                        <button className="btn-match inverse"
                                            onClick={() => this.handleText("formatBlock", "H1")}>
                                            <span className="font bold">H1</span>
                                        </button>
                                        <button className="btn-match inverse"
                                            onClick={() => this.handleText("formatBlock", "H2")}>
                                            <span className="font bold">H2</span>
                                        </button>
                                        <button className="btn-match inverse"
                                            onClick={() => this.handleText("formatBlock", "H3")}>
                                            <span className="font bold">H3</span>
                                        </button>
                                        <button className="btn-match inverse"
                                            onClick={() => this.handleText("formatBlock", "H4")}>
                                            <span className="font bold">H4</span>
                                        </button>
                                        <button className="btn-match inverse"
                                            onClick={() => this.handleText("formatBlock", "H5")}>
                                            <span className="font bold">H5</span>
                                        </button>
                                        <button className="btn-match inverse"
                                            onClick={() => this.handleText("formatBlock", "H6")}>
                                            <span className="font bold">H6</span>
                                        </button>
                                    </section>
                                    <section id="notepad-section-font-size"></section>
                                </section>
                            </section>
                        </section>
                        {/* Textarea */}
                        <div className="cut-scrollbar-corner-part-1 p area-large">
                            <p className="cut-scrollbar-corner-part-2 p area-large"
                                name="notepad-textarea-text"
                                onChange={this.handleChange}
                                value={this.state.text}
                                contentEditable="true"></p>
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

export default WidgetNotepad;