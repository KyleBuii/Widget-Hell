import { Component, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { MdOutlineInventory2 } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
// import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import DOMPurify from 'dompurify';
import { memo } from 'react';
import SimpleBar from 'simplebar-react';


/// Variables
const regexItemsLeftAndRight = /bracelet|wrist|glove|ring|hidden|boot/;
const audioItemOpen = new Audio("/resources/audio/switch_006.wav");
const audioItemClose = new Audio("/resources/audio/switch_007.wav");
const audioPageClick = new Audio("/resources/audio/magnet_on_reduced.wav");
const audioItemEquip = new Audio("/resources/audio/cloth-inventory.wav");
const audioItemEquipJewelry = new Audio("/resources/audio/ring_inventory.wav");
const audioItemEquipConsumable = new Audio("/resources/audio/bite-small.wav");


class WidgetInventory extends Component{
    constructor(props){
        super(props);
        this.state = {
            item: {name: "Creampuff", rarity: "rare"},
            items: [],
            countAll: 0,
            countItem: 0,
            inventorySlots: [],
            page: 0,
            pageMax: 0
        };
        this.addItem = this.addItem.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
    };
    viewItem(item){
        this.props.defaultProps.playAudio(audioItemOpen);
        document.getElementById("inventory-popout-view-item")
            .style
            .visibility = "visible";
        this.setState({
            item: item
        });
    };
    equipItem(event, name, rarity, slot, whatSide){
        event.stopPropagation();
        if(/ring|bracelet|necklace/.test(slot)){
            this.props.defaultProps.playAudio(audioItemEquipJewelry);
        }else if(/consumable/.test(slot)){
            this.props.defaultProps.playAudio(audioItemEquipConsumable);
        }else{
            this.props.defaultProps.playAudio(audioItemEquip);
        };
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
        document.getElementById("inventory-popout-view-item").style.visibility = "hidden";
    };
    addItem(event){
        let newItemCounter = 0;
        let newItemNames = [...this.state.items];
        let arrayItemSlots = [...this.state.inventorySlots];
        for(let i = 0; i < event.detail.length; i++){
            /// If item doesn't exist
            if(!newItemNames.includes(event.detail[i].name)){
                arrayItemSlots[this.state.countItem + newItemCounter] = (
                    <button id={`item-${event.detail[i].name}`}
                        onClick={() => this.viewItem(event.detail[i])}
                        style={{
                            backgroundImage: `url(${this.props.items[event.detail[i].rarity][event.detail[i].name].image})`
                        }}>
                        <div className="item-count">1</div>
                    </button>
                );
                newItemCounter++;
                newItemNames.push(event.detail[i].name);
            /// Item already exist
            }else{
                let itemButtonIndex = arrayItemSlots.findIndex((itemFind) => {
                    return itemFind.props.id.substr(5) === event.detail[i].name;
                });
                arrayItemSlots[itemButtonIndex] = (
                    <button id={`item-${event.detail[i].name}`}
                        onClick={() => this.viewItem(event.detail[i])}
                        style={{
                            backgroundImage: `url(${this.props.items[event.detail[i].rarity][event.detail[i].name].image})`
                        }}>
                        <div className="item-count">{parseFloat(arrayItemSlots[itemButtonIndex].props.children.props.children) + 1}</div>
                    </button>
                );
            };
        };
        this.setState({
            items: [...newItemNames],
            countItem: this.state.countItem + newItemCounter,
            countAll: this.state.countAll + event.detail.length,
            inventorySlots: [...arrayItemSlots]
        }, () => {
            if(this.state.countItem > ((this.state.pageMax + 1) * 16)){
                this.fillInventory();
            };
        });
    };
    /// Fills inventory to be 16x16 with empty slots
    fillInventory(inventory){
        let slots;
        if(this.state.countItem % 16 !== 0){
            let amountSlots = this.state.countItem + (16 - (this.state.countItem % 16));
            slots = new Array(amountSlots);
            slots.fill((<button></button>));
        };
        let pageMax = Math.ceil(slots.length / 16) - 1;
        this.setState({
            inventorySlots: [
                ...((inventory) ? inventory : this.state.inventorySlots),
                ...slots
            ],
            pageMax: pageMax
        });
    };
    /// Fills inventory with items
    updateInventory(){
        let slots = [];
        for(let i = 0; i < this.state.countItem; i++){
            slots[i] = (
                <button id={`item-${this.props.inventory[i].name}`}
                    onClick={() => this.viewItem(this.props.inventory[i])}
                    style={{
                        backgroundImage: `url(${this.props.items[this.props.inventory[i].rarity][this.props.inventory[i].name]?.image})`
                    }}>
                    <div className="item-count">{this.props.inventory[i].count}</div>
                </button>
            );
        };
        this.fillInventory(slots);
    };
    handlePages(direction){
        if((direction === "left")
            && (this.state.page !== 0)){
            this.props.defaultProps.playAudio(audioPageClick);
            this.setState({
                page: this.state.page - 1
            });
        };
        if((direction === "right")
            && (this.state.page !== this.state.pageMax)){
            this.props.defaultProps.playAudio(audioPageClick);
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
            let counter = 0;
            let itemNames = [];
            this.props.inventory.forEach((item) => {
                counter += item.count;
                itemNames.push(item.name);
            });
            this.setState({
                items: [...itemNames],
                countAll: counter,
                countItem: this.props.inventory.length
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
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
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
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("inventory", "utility")}
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
                        <section style={{ marginTop: "0.4em" }}>
                            <div className="aesthetic-scale scale-div element-ends font bold">
                                {/* Item Count */}
                                <div className="flex-center row gap">
                                    <IconContext.Provider value={{ size: "1em", color: "#ba6600", className: "global-class-name" }}>
                                        <MdOutlineInventory2/>
                                    </IconContext.Provider>
                                    <span>{this.state.countAll}</span>
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
                                this.props.defaultProps.playAudio(audioItemClose);
                                document.getElementById("inventory-popout-view-item").style.visibility = "hidden";
                            }}>
                            <span className="font bold large-medium">{this.state.item.name}</span>
                            <div className="flex-center row gap medium-gap space-nicely space-all">
                                <img src={this.props.items[this.state.item.rarity][this.state.item.name]?.image}
                                    alt="viewed inventory item"
                                    decoding="async"/>
                                <SimpleBar style={{ maxHeight: 80, width: 150 }}>
                                    <table className="flex-center column font small">
                                        <tbody>
                                            <tr>
                                                <td scope="row">Rarity:</td>
                                                <td>{this.state.item.rarity.replace(/^./, (char) => char.toUpperCase())}</td>
                                            </tr>
                                            <tr>
                                                <td scope="row">Slot:</td>
                                                <td>{this.props.items[this.state.item.rarity][this.state.item.name]?.slot
                                                    .replace(/^./, (char) => char.toUpperCase())
                                                    .replace(/[0-9]/, "")}</td>
                                            </tr>
                                            {(/stat|both/.test(this.props.items[this.state.item.rarity][this.state.item.name]?.type))
                                                ? Object.keys(this.props.items[this.state.item.rarity][this.state.item.name]?.stats)
                                                    .map((value, index) => {
                                                        return <tr key={`row-stat-${index}`}>
                                                            <td scope="row">{value.replace(/^./, (char) => char.toUpperCase())}:</td>
                                                            <td>
                                                                {(Math.sign(this.props.items[this.state.item.rarity][this.state.item.name].stats[value]) === -1)
                                                                    ? ""
                                                                    : "+"}
                                                                {this.props.items[this.state.item.rarity][this.state.item.name].stats[value]}
                                                            </td>
                                                        </tr>
                                                    })
                                                : <></>}
                                            {(/ability|both/.test(this.props.items[this.state.item.rarity][this.state.item.name]?.type))
                                                ? <tr>
                                                    <td colSpan={2}>{this.props.items[this.state.item.rarity][this.state.item.name].information}</td>
                                                </tr>
                                                : <></>}
                                        </tbody>
                                    </table>
                                </SimpleBar>
                            </div>
                            <span dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(this.props.items[this.state.item.rarity][this.state.item.name]?.description)
                            }}></span>
                            {(this.props.items[this.state.item.rarity][this.state.item.name]?.requirement)
                                ? <span className="font micro"
                                    style={{
                                        color: "red",
                                        opacity: "0.5"
                                    }}>Requirement: {this.props.items[this.state.item.rarity][this.state.item.name]?.requirement}</span>
                                : <></>}
                            <span className="font micro transparent-normal">Source: {this.props.items[this.state.item.rarity][this.state.item.name]?.source}</span>
                            {(regexItemsLeftAndRight.test(this.props.items[this.state.item.rarity][this.state.item.name]?.slot))
                                ? <div className="flex-center row gap">
                                    <button className="button-match space-nicely space-top not-bottom"
                                        onClick={(event) => this.equipItem(
                                            event,
                                            this.state.item.name,
                                            this.state.item.rarity,
                                            this.props.items[this.state.item.rarity][this.state.item.name].slot,
                                            "left"
                                        )}>Equip Left</button>
                                    <button className="button-match space-nicely space-top not-bottom"
                                        onClick={(event) => this.equipItem(
                                            event,
                                            this.state.item.name,
                                            this.state.item.rarity,
                                            this.props.items[this.state.item.rarity][this.state.item.name].slot,
                                            "right"
                                        )}>Equip Right</button>
                                </div>
                                : <button className="button-match space-nicely space-top not-bottom"
                                    onClick={(event) => this.equipItem(
                                        event,
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