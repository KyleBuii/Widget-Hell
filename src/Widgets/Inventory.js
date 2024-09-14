import { Component, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { Fa0, FaExpand } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { MdOutlineInventory2 } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
// import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { memo } from 'react';


/// Variables
const regexItemsLeftAndRight = /bracelet|wrist|glove|ring|hidden|boot/;


class WidgetInventory extends Component{
    constructor(props){
        super(props);
        this.state = {
            item: {name: "Creampuff", rarity: "rare"},
            count: 0,
            inventorySlots: [],
            page: 0,
            pageMax: 0
        };
        this.addItem = this.addItem.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
    };
    viewItem(item){
        document.getElementById("inventory-popout-view-item")
            .style
            .visibility = "visible";
        this.setState({
            item: item
        });
    };
    equipItem(name, rarity, slot, whatSide){
        if(whatSide){
            window.dispatchEvent(new CustomEvent("equip item", {
                "detail": {
                    "slot": slot,
                    "name": name,
                    "rarity": rarity,
                    "side": whatSide
                }
            }));
        }else{
            window.dispatchEvent(new CustomEvent("equip item", {
                "detail": {
                    "slot": slot,
                    "name": name,
                    "rarity": rarity
                }
            }));
        };
    };
    addItem(event){
        this.setState({
            count: this.state.count + event.detail.length
        }, () => {
            let arrayItemSlots = [...this.state.inventorySlots];
            let nextPage = false;
            for(let i = 0; i < event.detail.length; i++){
                arrayItemSlots[(this.state.count - event.detail.length) + i] = (
                    <button
                        onClick={() => this.viewItem(event.detail[i])}
                        style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL + this.props.items[event.detail[i].rarity][event.detail[i].name].image})`
                        }}>
                    </button>
                );
                if((((this.state.count - event.detail.length) + i) >= 16)
                    && ((((this.state.count - event.detail.length) + i) % 16) === 0)
                    && !nextPage){
                    nextPage = true;
                };
            };
            this.setState({
                inventorySlots: [...arrayItemSlots]
            });
            if(nextPage){
                this.updateInventory();
            };
        });
    };
    updateInventory(){
        var slots;
        /// Prefill inventory with empty slots
        if(this.state.count % 16 !== 0){
            let amountSlots = this.state.count + (16 - (this.state.count % 16));
            slots = new Array(amountSlots);
            for(let i = 0; i < amountSlots; i++){
                slots[i] = (
                    <button></button>
                );
            };
        }else{
            slots = new Array(this.state.count);
        };
        /// Fill inventory with items
        for(let i = 0; i < this.state.count; i++){
            slots[i] = (
                <button
                    onClick={() => this.viewItem(this.props.inventory[i])}
                    style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL + this.props.items[this.props.inventory[i].rarity][this.props.inventory[i].name].image})`
                    }}>
                </button>
            );
        };
        this.setState({
            inventorySlots: [...slots],
            pageMax: Math.ceil(slots.length / 16) - 1
        });
    };
    handlePages(direction){
        if(direction === "left"
            && this.state.page !== 0){
            this.setState({
                page: this.state.page - 1
            });
        };
        if(direction === "right"
            && this.state.page !== this.state.pageMax){
            this.setState({
                page: this.state.page + 1
            });
        };
    };
    componentDidMount(){
        window.addEventListener("new item", this.addItem);
        if(this.props.inventory.length === 0){
            let slots = new Array(16);
            for(let i = 0; i < 16; i++){
                slots[i] = (
                    <button></button>
                );
            };
            this.setState({
                inventorySlots: [...slots]
            });
        }else{
            this.setState({
                count: this.props.inventory.length
            }, () => {
                this.updateInventory();
            });
        };
    };
    componentWillUnmount(){
        window.removeEventListener("new item", this.addItem);
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("inventory")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("inventory");
                    this.props.defaultProps.updatePosition("inventory", "utility", data.x, data.y);
                }}
                cancel="button, span, .overlay, #inventory-tabs"
                bounds="parent">
                <div id="inventory-widget"
                    className="widget">
                    <div id="inventory-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="inventory-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("inventory", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("inventory", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("inventory", "close", "utility")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Me</span>
                            : <></>}
                        {/* Inventory */}
                        <section className="flex-center column gap medium-gap">
                            {/* Inventory Slots */}
                            <section className="flex-center column">
                                {/* Slots */}
                                <div id="inventory-slots" 
                                    className="aesthetic-scale scale-div grid col-4 spread-inventory slot box dimmed">
                                    {this.state.inventorySlots.slice(0 + (16 * this.state.page), 16 + (16 * this.state.page)).map((item, index) => {
                                        return <div key={`slot-${index}`}>
                                            {item}
                                        </div>
                                    })}
                                </div>
                                {/* Pages Buttons */}
                                <div id="inventory-pages">
                                    <button className="button-match inverse flex-center"
                                        onClick={() => this.handlePages("left")}>
                                        <IconContext.Provider value={{ size: "1.5em", className: "global-class-name" }}>
                                            <FaRegArrowAltCircleLeft color={
                                                (this.state.page === 0)
                                                    ? "rgba(var(--randColorOpacity), 0.4)"
                                                    : "var(--randColor)"
                                            }/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="button-match inverse flex-center"
                                        onClick={() => this.handlePages("right")}>
                                        <IconContext.Provider value={{ size: "1.5em", className: "global-class-name" }}>
                                            <FaRegArrowAltCircleRight color={
                                                (this.state.page === this.state.pageMax)
                                                    ? "rgba(var(--randColorOpacity), 0.4)"
                                                    : "var(--randColor)"
                                            }/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </section>
                        </section>
                        {/* Inventory Bar */}
                        <section style={{
                            marginTop: "0.4em"
                        }}>
                            <div className="aesthetic-scale scale-div element-ends font bold">
                                {/* Item Count */}
                                <div className="flex-center row gap">
                                    <IconContext.Provider value={{ size: "1em", color: "#ba6600", className: "global-class-name" }}>
                                        <MdOutlineInventory2/>
                                    </IconContext.Provider>
                                    <span>{this.state.count}</span>
                                </div>
                                {/* Page Count */}
                                <div className="float middle"
                                    style={{
                                        // marginTop: "0.2em"
                                    }}>
                                    <span>{this.state.page + 1}/{this.state.pageMax + 1}</span>
                                </div>
                                {/* Gold */}
                                <div>
                                    <IconContext.Provider value={{ size: "1em", color: "#f9d700", className: "global-class-name" }}>
                                        <TbMoneybag/>
                                    </IconContext.Provider>
                                    <span>{this.props.gameProps.formatNumber(this.props.gameProps.gold, 1)}</span>
                                </div>
                            </div>
                        </section>
                        {/* Inventory Information */}
                        {/* <Tabs id="inventory-tabs">
                            <TabList>
                                <Tab>Currency</Tab>
                            </TabList>
                            <TabPanel>
                                <section id="inventory-currency"
                                    className="grid col-inventory font bold">
                                </section>
                            </TabPanel>
                        </Tabs> */}
                        {/* View Item Popout */}
                        <section id="inventory-popout-view-item"
                            className="overlay rounded flex-center column gap font no-highlight"
                            onClick={() => {
                                document.getElementById("inventory-popout-view-item").style.visibility = "hidden";
                            }}>
                            <span className="font bold large-medium">{this.state.item.name}</span>
                            <div className="flex-center row gap medium-gap space-nicely space-all">
                                <img src={this.props.items[this.state.item.rarity][this.state.item.name].image}
                                    alt="viewed inventory item"/>
                                <table className="flex-center column font small">
                                    <tbody>
                                        <tr>
                                            <td>Rarity:</td>
                                            <td>{this.state.item.rarity.replace(/^./, (char) => char.toUpperCase())}</td>
                                        </tr>
                                        <tr>
                                            <td>Slot:</td>
                                            <td>{this.props.items[this.state.item.rarity][this.state.item.name].slot
                                                .replace(/^./, (char) => char.toUpperCase())
                                                .replace(/[0-9]/, "")}</td>
                                        </tr>
                                        {(/stat|both/.test(this.props.items[this.state.item.rarity][this.state.item.name].type))
                                            ? Object.keys(this.props.items[this.state.item.rarity][this.state.item.name].stats)
                                                .map((value, index) => {
                                                    return <tr key={`row-stat-${index}`}>
                                                        <td>{value.replace(/^./, (char) => char.toUpperCase())}:</td>
                                                        <td>
                                                            {(Math.sign(this.props.items[this.state.item.rarity][this.state.item.name].stats[value]) === -1)
                                                                ? ""
                                                                : "+"}
                                                            {this.props.items[this.state.item.rarity][this.state.item.name].stats[value]}
                                                        </td>
                                                    </tr>
                                                })
                                            : <></>}
                                        {(/ability|both/.test(this.props.items[this.state.item.rarity][this.state.item.name].type))
                                            ? <tr>
                                                <td colSpan={2}>{this.props.items[this.state.item.rarity][this.state.item.name].information}</td>
                                            </tr>
                                            : <></>}
                                    </tbody>
                                </table>
                            </div>
                            <span>{this.props.items[this.state.item.rarity][this.state.item.name].description}</span>
                            {(this.props.items[this.state.item.rarity][this.state.item.name].requirement)
                                ? <span className="font micro"
                                    style={{
                                        color: "red",
                                        opacity: "0.5"
                                    }}>Requirement: {this.props.items[this.state.item.rarity][this.state.item.name].requirement}</span>
                                : <></>}
                            <span className="font micro transparent-normal">Source: {this.props.items[this.state.item.rarity][this.state.item.name].source}</span>
                            {(regexItemsLeftAndRight.test(this.props.items[this.state.item.rarity][this.state.item.name].slot))
                                ? <div className="flex-center row gap">
                                    <button className="button-match space-nicely space-top not-bottom"
                                        onClick={() => this.equipItem(
                                            this.state.item.name,
                                            this.state.item.rarity,
                                            this.props.items[this.state.item.rarity][this.state.item.name].slot,
                                            "left"
                                        )}>Equip Left</button>
                                    <button className="button-match space-nicely space-top not-bottom"
                                        onClick={() => this.equipItem(
                                            this.state.item.name,
                                            this.state.item.rarity,
                                            this.props.items[this.state.item.rarity][this.state.item.name].slot,
                                            "right"
                                        )}>Equip Right</button>
                                </div>
                                : <button className="button-match space-nicely space-top not-bottom"
                                    onClick={() => this.equipItem(
                                        this.state.item.name,
                                        this.state.item.rarity,
                                        this.props.items[this.state.item.rarity][this.state.item.name].slot
                                    )}>Equip</button>}
                        </section>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetInventory);