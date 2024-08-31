import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


class WidgetCharacter extends Component{
    constructor(props){
        super(props);
        this.addItem = this.addItem.bind(this);
    };
    addItem(event){
        let lowerCaseRegex = new RegExp(`\\s|[${this.props.punctuation}]`, "g");
        let modifiedName = event.detail.name
            .toLowerCase()
            .replaceAll(lowerCaseRegex, "");
        let equipmentElement;
        let equipmentImage = document.createElement("img");
        if(event.detail.side){
            equipmentElement = document.getElementById(`character-${event.detail.slot}-${event.detail.side}`);
            equipmentImage.src = `/images/character/character-${modifiedName}-${event.detail.side}.png`;
        }else{
            equipmentElement = document.getElementById(`character-${event.detail.slot}`);
            equipmentImage.src = `/images/character/character-${modifiedName}.png`;
        };
        if(equipmentElement.hasChildNodes()){
            equipmentElement.innerHTML = "";
        };
        equipmentImage.draggable = false;
        equipmentElement.appendChild(equipmentImage);
    };
    removeItem(event){
        let equipmentElement;
        if(event.detail.side){
            equipmentElement = document.getElementById(`character-${event.detail.slot}-${event.detail.side}`);
        }else{
            equipmentElement = document.getElementById(`character-${event.detail.slot}`);
        };
        equipmentElement.innerHTML = "";
    };
    componentDidMount(){
        window.addEventListener("equip item", this.addItem);
        window.addEventListener("unequip item", this.removeItem);
        for(let i in this.props.equipment){
            if(this.props.equipment[i].name !== ""){
                /// Equipped items with no left and right
                if(this.props.equipment[i].name !== undefined){
                    this.addItem({
                        "detail": {
                            "name": this.props.equipment[i].name,
                            "slot": i
                        }
                    });
                }else{
                    /// Left equipped item
                    if(this.props.equipment[i].left.name !== ""){
                        this.addItem({
                            "detail": {
                                "name": this.props.equipment[i].left.name,
                                "slot": i,
                                "side": "left"
                            }
                        });
                    };
                    /// Right equipped item
                    if(this.props.equipment[i].right.name !== ""){
                        this.addItem({
                            "detail": {
                                "name": this.props.equipment[i].right.name,
                                "slot": i,
                                "side": "right"
                            }
                        });
                    };
                };
            };
        };
    };
    componentWillUnmount(){
        window.removeEventListener("equip item", this.addItem);
        window.removeEventListener("unequip item", this.removeItem);
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("character")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("character");
                    this.props.defaultProps.updatePosition("character", "utility", data.x, data.y);
                }}
                cancel=""
                bounds="parent">
                <div id="character-widget"
                    className="widget">
                    <div id="character-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="character-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("character", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("character", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Character */}
                        <section id="character-container">
                            <img id="character-image"
                                className="no-highlight"
                                src={"/images/character/character.png"}
                                alt="character"
                                draggable="false"/>
                            <div id="character-headband"></div>
                            <div id="character-eyewear"></div>
                            <div id="character-helmet"></div>
                            <div id="character-undershirt"></div>
                            <div id="character-chestplate"></div>
                            <div id="character-cape"></div>
                            <div id="character-bracelet-left"></div>
                            <div id="character-bracelet-right"></div>
                            <div id="character-wrist-left"></div>
                            <div id="character-wrist-right"></div>
                            <div id="character-belt"></div>
                            <div id="character-main"></div>
                            <div id="character-glove-left"></div>
                            <div id="character-glove-right"></div>
                            <div id="character-ring-left"></div>
                            <div id="character-ring-right"></div>
                            <div id="character-legging"></div>
                            <div id="character-offhand"></div>
                            <div id="character-hidden-left"></div>
                            <div id="character-hidden-right"></div>
                            <div id="character-boot-left"></div>
                            <div id="character-boot-right"></div>
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

export default WidgetCharacter;