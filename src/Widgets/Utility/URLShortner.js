import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import { IoClose } from 'react-icons/io5';


class WidgetURLShortner extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            running: false
        };
        this.handleInput = this.handleInput.bind(this);
    };
    handleInput(event){
        this.setState({
            input: event.target.value
        });
    };
    async shortenLink(){
        if(this.state.input !== ""){
            // const elementURL = document.getElementById("urlshortner-url");
        };
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("urlshortner")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("urlshortner");
                    this.props.defaultProps.updatePosition("urlshortner", "utility", data.x, data.y);
                }}
                cancel="input, button"
                bounds="parent">
                <div id="urlshortner-widget"
                    className="widget">
                    <div id="urlshortner-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="urlshortner-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("urlshortner", "close", "utility")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("urlshortner", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("urlshortner", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        <section className="flex-center column gap small-gap">
                            <input className="input-match"
                                type="text"
                                name="urlshortner-input"
                                value={this.state.input}
                                onChange={this.handleInput}
                                placeholder="URL"/>
                            <button className="button-match fill-width"
                                onClick={() => this.shortenLink()}>Shorten</button>
                            <input id="urlshortner-url"
                                className="input-match"
                                type="text"
                                readOnly
                                placeholder="Shorten URL"/>
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

export default WidgetURLShortner;