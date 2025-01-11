import React, { Component, createRef, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { EventBus } from './Game/EventBus';
import { PhaserGame } from './Game/PhaserGame';


class WidgetBulletHell extends Component{
    constructor(props){
        super(props);
        this.phaserRef = createRef();
        this.currentScene = this.currentScene.bind(this);
    };
    changeScene(){
        const scene = this.phaserRef.current.scene;
        if(scene){
            scene.changeScene();
        };
    };
    currentScene(scene){
        if(scene.scene.key === "Game"){
            EventBus.emit('data', {
                stats: this.props.gameProps.stats,
                abilities: this.props.gameProps.abilities
            });
        };
    };
    handleKeydown(event){
        if(/87|65|83|68|37|38|39|40|16|17|32/.test(event.keyCode)) event.preventDefault();
    };
    componentDidMount(){
        window.addEventListener("keydown", this.handleKeydown);
    };
    componentWillUnmount(){
        window.removeEventListener("keydown", this.handleKeydown);
    };
    render(){
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("bullethell")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("bullethell");
                    this.props.defaultProps.updatePosition("bullethell", "games", data.x, data.y);
                }}
                cancel="button, #bullethell-game"
                bounds="parent">
                <div id="bullethell-widget"
                    className="widget">
                    <div id="bullethell-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="bullethell-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("bullethell", "games")}
                        <PhaserGame ref={this.phaserRef}
                            currentActiveScene={this.currentScene}/>
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

export default memo(WidgetBulletHell);