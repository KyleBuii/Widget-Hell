import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';


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
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
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
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("urlshortner", "utility")}
                        <div className="flex-center column gap small-gap">
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

export default memo(WidgetURLShortner);