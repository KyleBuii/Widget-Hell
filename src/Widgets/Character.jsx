import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';


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
            equipmentImage.src = `/resources/character/character-${modifiedName}-${event.detail.side}.webp`;
        }else{
            equipmentElement = document.getElementById(`character-${event.detail.slot}`);
            equipmentImage.src = `/resources/character/character-${modifiedName}.webp`;
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
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("character")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("character");
                    this.props.defaultProps.updatePosition("character", "utility", data.x, data.y);
                }}
                cancel="button"
                bounds="parent">
                <div id="character-widget"
                    className="widget">
                    <div id="character-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="character-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("character", "utility")}
                        {/* Character */}
                        <section id="character-container">
                            <img id="character-image"
                                className="no-highlight"
                                src={"/resources/character/character.webp"}
                                alt="character"
                                draggable="false"
                                decoding="async"/>
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
                            <div id="character-consumable1"></div>
                            <div id="character-consumable2"></div>
                            <div id="character-consumable3"></div>
                            <div id="character-consumable4"></div>
                            <div id="character-consumable5"></div>
                            <div id="character-consumable6"></div>
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

export default memo(WidgetCharacter);