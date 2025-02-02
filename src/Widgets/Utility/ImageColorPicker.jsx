import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { EyeDropper } from 'react-eyedrop';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';


class WidgetImageColorPicker extends Component{
    constructor(props){
        super(props);
        this.state = {
            hex: "",
            rgb: "",
            hoverOnce: false,
            colorPicking: false
        };
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorClick = this.handleColorClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    };
    getImage(where, event){
        const elementImageContainer = document.getElementById("imagecolorpicker-image");
        switch(where){
            case "uploaded":
                const elementInput = document.getElementById("imagecolorpicker-uploaded-file");
                if(elementInput.files.length !== 0){
                    const reader = new FileReader();
                    reader.onload = () => {
                        elementImageContainer.innerHTML = "";
                        let elementImage = document.createElement("img");
                        elementImage.src = reader.result;
                        elementImage.alt = "uploaded image";
                        elementImage.draggable = false;
                        elementImage.loading = "lazy";
                        elementImage.decoding = "async";
                        elementImage.onmousemove = this.handleMouseMove;
                        elementImage.onmouseleave = this.handleMouseLeave;
                        elementImageContainer.appendChild(elementImage);
                    };
                    reader.readAsDataURL(elementInput.files[0]);
                };        
                break;
            case "link":
                if(event.target.value !== ""
                    && /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?(jpe?g|gif|png|tiff?|webp|bmp)$)/i.test(event.target.value)){
                    elementImageContainer.innerHTML = "";
                    let elementImage = document.createElement("img");
                    elementImage.src = event.target.value;
                    elementImage.alt = "linked image";
                    elementImage.draggable = false;
                    elementImage.loading = "lazy";
                    elementImage.decoding = "async";
                    elementImage.onmousemove = this.handleMouseMove;
                    elementImage.onmouseleave = this.handleMouseLeave;
                    elementImageContainer.appendChild(elementImage);
                };        
                break;
            default:
                break;
        };
    };
    handleColorChange(event){
        if(this.state.colorPicking){
            const elementColor = document.getElementById("imagecolorpicker-color");
            elementColor.style.backgroundColor = event.hex;    
            this.setState({
                hex: event.hex,
                rgb: event.rgb,
                hoverOnce: false
            });
        };
    };
    handleColorClick(){
        let numbers = this.state.rgb.replace(/rgb\(-?([0-9]+),[\s-]*?([0-9]+),[\s-]*?([0-9]+)\)/, "$1 $2 $3");
        if(numbers !== ""){
            let splitNumbers = numbers.split(" ");
            this.props.randomColor(Number(splitNumbers[0]), Number(splitNumbers[1]), Number(splitNumbers[2]));
        };
    };
    handleMouseMove(){
        if(!this.state.colorPicking){
            this.setState({
                colorPicking: true
            });
        };
        if(!this.state.hoverOnce){
            const elementColorPickerButton = document.getElementById("imagecolorpicker-eye-dropper-button");
            elementColorPickerButton.click();
            this.setState({
                hoverOnce: true
            });
        };
    };
    handleMouseLeave(){
        this.setState({
            colorPicking: false
        });
    };
    renderColorPicker({onClick}){
        return <button id="imagecolorpicker-eye-dropper-button"
            onClick={onClick}></button>
    };
    render(){
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("imagecolorpicker")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("imagecolorpicker");
                    this.props.defaultProps.updatePosition("imagecolorpicker", "utility", data.x, data.y);
                }}
                cancel="input, label, img, #imagecolorpicker-color"
                bounds="parent">
                <div id="imagecolorpicker-widget"
                    className="widget">
                    <div id="imagecolorpicker-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="imagecolorpicker-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("imagecolorpicker", "utility")}
                        <section className="flex-center column gap small-gap">
                            {/* Image */}
                            <div id="imagecolorpicker-image"></div>
                            {/* Button */}
                            <div className="file-input-match fill-width">
                                <input id="imagecolorpicker-uploaded-file"
                                    type="file"
                                    onChange={() => this.getImage("uploaded")}/>
                                <label htmlFor="imagecolorpicker-uploaded-file">Use your image</label>
                            </div>
                            {/* <input className="input-match fill-width"
                                type="text"
                                name="imagecolorpicker-input-link"
                                onChange={(event) => this.getImage("link", event)}
                                placeholder="Use a link"/> */}
                            <EyeDropper id="imagecolorpicker-eye-dropper"
                                onChange={this.handleColorChange}
                                customComponent={this.renderColorPicker}
                                once={this.state.colorPicking}></EyeDropper>
                            {/* Colors */}
                            <div className="flex-center row gap small-gap fill-width">
                                <div className="aesthetic-scale scale-input flex-center column gap small-gap">
                                    <input className="text-animation input-match"
                                        type="text"
                                        name="imagecolorpicker-input-hex"
                                        value={this.state.hex}
                                        placeholder="Hex"
                                        onClick={() => this.props.copyToClipboard(this.state.hex)}
                                        readOnly/>
                                    <input className="text-animation input-match"
                                        type="text"
                                        name="imagecolorpicker-input-rgb"
                                        value={this.state.rgb}
                                        placeholder="RGB"
                                        onClick={() => this.props.copyToClipboard(this.state.rgb)}
                                        readOnly/>
                                </div>
                                <div id="imagecolorpicker-color"
                                    className="aesthetic-scale scale-self box"
                                    onClick={() => this.handleColorClick()}></div>
                            </div>
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

export default memo(WidgetImageColorPicker);