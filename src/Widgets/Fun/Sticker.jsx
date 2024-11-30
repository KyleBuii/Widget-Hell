import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';


class WidgetSticker extends Component{
    constructor(props){
        super(props);
        this.handleFile = this.handleFile.bind(this);
    };
    handleFile(){
        const elementInput = document.getElementById("sticker-file");
        if(elementInput.files.length !== 0){
            const reader = new FileReader();
            reader.onload = () => {
                const elementWidgetContainer = document.getElementById("widget-container");
                /// Image
                let elementImage = document.createElement("img");
                elementImage.src = reader.result;
                elementImage.alt = `uploaded image ${reader.fileName}`;
                elementImage.draggable = false;
                elementImage.style.position = "absolute";
                elementImage.style.top = "0";
                elementImage.style.left = "0";
                elementImage.style.zIndex = "1";
                elementWidgetContainer.appendChild(elementImage);
                this.createPositionEditor(reader.fileName, elementImage);
                this.props.updateStickers("add", reader.fileName
                    .substring(0, 50)
                    .replace(/^./, (char) => char.toUpperCase())
                    .replace(/(.(jpe?g|gif|png|tiff?|webp|bmp))$/, ""),
                    elementImage);
            };
            reader.readAsDataURL(elementInput.files[0]);
            reader.fileName = elementInput.files[0].name;
        };
    };
    createPositionEditor(fileName, image){
        const elementWidgetContainer = document.getElementById("widget-container");
        const elementStickersContainer = document.getElementById("sticker-stickers");
        let maxSize = elementWidgetContainer.getBoundingClientRect();
        /// Name
        let elementName = document.createElement("span");
        let pretierName = fileName
            .substring(0, 50)
            .replace(/^./, (char) => char.toUpperCase())
            .replace(/(.(jpe?g|gif|png|tiff?|webp|bmp))$/, "");
        elementName.innerText = pretierName;
        /// Input: x
        let elementInputX = document.createElement("input");
        elementInputX.className = "input-match";
        elementInputX.type = "number";
        elementInputX.max = maxSize.width;
        elementInputX.name = `sticker-stickers-x-${fileName}`;
        elementInputX.oninput = (event) => {
            this.handlePosition(
                Array.from(elementWidgetContainer.children).indexOf(image),
                "x",
                event);
        };
        elementInputX.placeholder = "x";
        /// Input: y
        let elementInputY = document.createElement("input");
        elementInputY.className = "input-match";
        elementInputY.type = "number";
        elementInputY.max = maxSize.height;
        elementInputY.name = `sticker-stickers-y-${fileName}`;
        elementInputY.oninput = (event) => {
            this.handlePosition(
                Array.from(elementWidgetContainer.children).indexOf(image),
                "y",
                event);
        };
        elementInputY.placeholder = "y";
        /// Delete button
        let elementDelete = document.createElement("button");
        elementDelete.className = "button-match";
        elementDelete.innerText = "X";
        elementDelete.onclick = () => {
            elementWidgetContainer.removeChild(image);
            elementStickersContainer.removeChild(elementName);
            elementStickersContainer.removeChild(elementInputX);
            elementStickersContainer.removeChild(elementInputY);
            elementStickersContainer.removeChild(elementDelete);
            this.props.updateStickers("remove", pretierName);
        };
        elementStickersContainer.append(elementName, elementInputX, elementInputY, elementDelete);
    };
    handlePosition(childIndex, coordinate, event){
        const elementWidgetContainer = document.getElementById("widget-container");
        let maxSize = elementWidgetContainer.getBoundingClientRect();
        if(event.target.value !== ""){
            const elementWidgetContainer = document.getElementById("widget-container");
            let sticker = elementWidgetContainer.children[childIndex];
            if(coordinate === "x"){
                if(event.target.value < maxSize.width){
                    sticker.style.left = `${event.target.value}px`;
                }else{
                    sticker.style.left = `${maxSize.width - 1}px`;
                };
            };
            if(coordinate === "y"){
                if(event.target.value < maxSize.height){
                    sticker.style.top = `${event.target.value}px`;
                }else{
                    sticker.style.top = `${maxSize.height - 1}px`;
                };
            };
        };
    };
    componentDidMount(){
        if(this.props.stickers.length !== 0){
            for(let i = 0; i < this.props.stickers.length; i+=2){
                this.createPositionEditor(this.props.stickers[i], this.props.stickers[i + 1]);
            };
        };
    };
    render(){
        return(
            <Draggable position={{ x: this.props.position.x, y: this.props.position.y }}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("sticker")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("sticker");
                    this.props.defaultProps.updatePosition("sticker", "fun", data.x, data.y);
                }}
                cancel="label, input, button, span"
                bounds="parent">
                <div id="sticker-widget"
                    className="widget">
                    <div id="sticker-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="sticker-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("sticker", "fun")}
                        <section className="flex-center column gap small-gap">
                            {/* File Upload Button */}
                            <div className="file-input-match fill-width">
                                <label htmlFor="sticker-file">Upload image</label>
                                <input id="sticker-file"
                                    type="file"
                                    name="sticker-file"
                                    onChange={this.handleFile}
                                    onClick={(event) => {event.target.value = null}}/>
                            </div>
                            {/* Stickers */}
                            <div id="sticker-stickers"
                                className="font"></div>
                        </section>
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

export default memo(WidgetSticker);