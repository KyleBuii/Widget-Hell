import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import QRCode from 'react-qr-code';
import Select from 'react-select';


/// Variables
const optionsSize= [
    {
        label: "Sizes",
        options: [
            {value: 32, label: "32x32"},
            {value: 64, label: "64x64"},
            {value: 128, label: "128x128"},
            {value: 256, label: "256x256"},
            {value: 512, label: "512x512"}
        ]
    }
];


class WidgetQRCode extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            size: 256,
            backgroundColor: "white",
            foregroundColor: "black"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleColorPicker = this.handleColorPicker.bind(this);
    };
    handleChange(what, where){
        this.setState({
            [where]: what
        });
    };
    handleColorPicker(event, where){
        this.setState({
            [`${where}Color`]: event.target.value
        });
    };
    render(){
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("qrcode")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("qrcode");
                    this.props.defaultProps.updatePosition("qrcode", "utility", data.x, data.y);
                }}
                cancel="input, .select-match, button, #qrcode"
                bounds="parent">
                <div id="qrcode-widget"
                    className="widget">
                    <div id="qrcode-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="qrcode-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("qrcode", "utility")}
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Me</span>
                            : <></>}
                        {/* Input Container */}
                        <div className="flex-center row gap small-gap">
                            <input className="input-match"
                                type="text"
                                name="qrcode-input-text"
                                placeholder="Enter QR Text"
                                value={this.state.input}
                                onChange={(event) => this.handleChange(event.target.value, "input")}></input>
                            {/* Dimension */}
                            <Select className="select-match"
                                defaultValue={optionsSize[0]["options"][3]}
                                options={optionsSize}
                                onChange={(event) => this.handleChange(event.value, "size")}
                                formatGroupLabel={this.props.formatGroupLabel}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...this.props.selectTheme
                                    }
                                })}/>
                        </div>
                        {/* QR Code Container */}
                        <div className="box dimmed space-nicely space-top">
                            <div className="flex-center">
                                <QRCode id="qrcode"
                                    className="aesthetic-scale scale-self"
                                    value={this.state.input}
                                    size={this.state.size}
                                    bgColor={this.state.backgroundColor}
                                    fgColor={this.state.foregroundColor}/>
                            </div>
                            {/* Bottom Bar */}
                            <div className="element-ends space-nicely space-top length-medium not-bottom">
                                {/* Color Chosers */}
                                <div className="flex-center row gap">
                                    <input className="color-input-match"
                                        type="color"
                                        defaultValue={"#ffffff"}
                                        onBlur={(event) => this.handleColorPicker(event, "background")}></input>
                                    <input className="color-input-match"
                                        type="color"
                                        defaultValue={"#0000000"}
                                        onBlur={(event) => this.handleColorPicker(event, "foreground")}></input>
                                </div>
                                {/* Download Button */}
                                <button className="button-match inverse"
                                    onClick={() => {
                                        let svg = document.getElementById("qrcode");
                                        let svgData = new XMLSerializer().serializeToString(svg);
                                        let canvas = document.createElement("canvas");
                                        let ctx = canvas.getContext("2d");
                                        let image = new Image();
                                        image.onload = () => {
                                            canvas.width = image.width;
                                            canvas.height = image.height;
                                            ctx.drawImage(image, 0, 0);
                                            let pngFile = canvas.toDataURL("image/png");
                                            let downloadLink = document.createElement("a");
                                            downloadLink.download = "QRCode";
                                            downloadLink.href = pngFile;
                                            downloadLink.click();
                                        };
                                        image.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
                                    }}>
                                    <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                        <FaDownload/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetQRCode);