import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0, FaDownload } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import Select from 'react-select';
import QRCode from 'react-qr-code';


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
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("qrcode")}
                onStop={() => this.props.defaultProps.dragStop("qrcode")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("qrcode", "utility", data.x, data.y)}
                cancel="input, .select-match, button, #qrcode"
                bounds="parent">
                <div id="qrcode-widget"
                    className="widget">
                    <div id="qrcode-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="qrcode-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("qrcode", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("qrcode", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Me</span>
                            : <></>}
                        {/* Input Container */}
                        <div className="flex-center row gap small">
                            <input className="input-match" 
                                type="text"
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
                        <div className="box dimmed">
                            <div className="flex-center">
                                <QRCode id="qrcode"
                                    value={this.state.input}
                                    size={this.state.size}
                                    bgColor={this.state.backgroundColor}
                                    fgColor={this.state.foregroundColor}/>
                            </div>
                            {/* Bottom Bar */}
                            <div className="element-ends space-nicely top medium not-bottom">
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
                                <button className="btn-match inverse"
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

export default WidgetQRCode;