import { Component, createRef, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { EventBus } from './Game/EventBus';
import { PhaserGame } from './Game/PhaserGame';


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
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
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
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("grindshot", "games")}
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