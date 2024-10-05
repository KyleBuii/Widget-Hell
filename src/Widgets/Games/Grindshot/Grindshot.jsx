import { Component, createRef, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { Fa0, FaExpand } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';


class WidgetGrindshot extends Component{
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
            EventBus.emit('data', this.props.gameProps.stats);
        };
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("grindshot")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("grindshot");
                    this.props.defaultProps.updatePosition("grindshot", "games", data.x, data.y);
                }}
                cancel="button, #grindshot-game"
                bounds="parent">
                <div id="grindshot-widget"
                    className="widget">
                    <div id="grindshot-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="grindshot-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("grindshot", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("grindshot", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("grindshot", "close", "games")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
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

export default memo(WidgetGrindshot);