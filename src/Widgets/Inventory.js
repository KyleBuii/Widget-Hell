import { React, Component } from 'react';
import { FaGripHorizontal, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


/// Variables
const regexItemsLeftAndRight = /bracelet|wrist|glove|ring|hidden|boot/;


class WidgetInventory extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: [],
            item: {name: "Creampuff", rarity: "rare"},
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
    addItem(){
        let dataLocalStorage = JSON.parse(localStorage.getItem("inventory"));
        let arrayItems = [...this.state.items];
        arrayItems[dataLocalStorage.length - 1] = (
            <button
                onClick={() => this.viewItem(dataLocalStorage[dataLocalStorage.length - 1])}
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL + this.props.items[dataLocalStorage[dataLocalStorage.length - 1].rarity][dataLocalStorage[dataLocalStorage.length - 1].name].image})`
                }}>
            </button>
        );
        this.setState({
            items: [...arrayItems]
        });
        /// If the added item is on the next page, update the inventory
        if(((dataLocalStorage.length - 1) % 16) === 0){
            this.updateInventory();
        };
    };
    updateInventory(){
        var itemSlots;
        if(JSON.parse(localStorage.getItem("inventory")).length !== 0){
            let dataLocalStorage = JSON.parse(localStorage.getItem("inventory"));
            /// Prefill inventory
            if(dataLocalStorage.length % 16 !== 0){
                let amountSlots = dataLocalStorage.length + (16 - (dataLocalStorage.length % 16));
                itemSlots = new Array(amountSlots);
                for(let i = 0; i < amountSlots; i++){
                    itemSlots[i] = (
                        <button></button>
                    );
                };
            }else{
                itemSlots = new Array(dataLocalStorage.length);
            };
            /// Fill inventory with items
            for(let i = 0; i < dataLocalStorage.length; i++){
                itemSlots[i] = (
                    <button
                        onClick={() => this.viewItem(dataLocalStorage[i])}
                        style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL + this.props.items[dataLocalStorage[i].rarity][dataLocalStorage[i].name].image})`
                        }}>
                    </button>
                );
            };
            this.setState({
                pageMax: Math.ceil(itemSlots.length / 16) - 1
            });
        }else{
            /// Prefill inventory
            itemSlots = new Array(16);
            for(let i = 0; i < 16; i++){
                itemSlots[i] = (
                    <button></button>
                );
            };
        };
        this.setState({
            items: [...itemSlots]
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
        this.updateInventory();
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
                cancel="button, .overlay"
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
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("inventory", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("inventory", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Inventory */}
                        <section className="flex-center column gap medium">
                            {/* Inventory Slots */}
                            <section className="flex-center column">
                                {/* Slots */}
                                <div id="inventory-slots" 
                                    className="grid col-4 spread-inventory slot box dimmed">
                                    {this.state.items.slice(0 + (16 * this.state.page), 16 + (16 * this.state.page)).map((item, index) => {
                                        return <div key={`slot-${index}`}>
                                            {item}
                                        </div>
                                    })}
                                </div>
                                {/* Pages */}
                                <div id="inventory-pages">
                                    <button className="btn-match inverse flex-center"
                                        onClick={() => this.handlePages("left")}>
                                        <IconContext.Provider value={{ size: "1.5em", className: "global-class-name" }}>
                                            <FaRegArrowAltCircleLeft color={
                                                (this.state.page === 0)
                                                    ? "rgba(var(--randColorOpacity), 0.4)"
                                                    : "var(--randColor)"
                                            }/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className="btn-match inverse flex-center"
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
                        {/* View Item Popout */}
                        <section id="inventory-popout-view-item"
                            className="overlay rounded flex-center column gap font no-highlight"
                            onClick={() => {
                                document.getElementById("inventory-popout-view-item").style.visibility = "hidden";
                            }}>
                            <span className="font bold large-medium">{this.state.item.name}</span>
                            <div className="flex-center row gap medium space-nicely all">
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
                                            <td>{this.props.items[this.state.item.rarity][this.state.item.name].slot.replace(/^./, (char) => char.toUpperCase())}</td>
                                        </tr>
                                        {(this.props.items[this.state.item.rarity][this.state.item.name].type === "stat")
                                            ? Object.keys(this.props.items[this.state.item.rarity][this.state.item.name].stats)
                                                .map((value, index) => {
                                                    return <tr key={`row-stat-${index}`}>
                                                        <td>{value.replace(/^./, (char) => char.toUpperCase())}:</td>
                                                        <td>+{this.props.items[this.state.item.rarity][this.state.item.name].stats[value]}</td>
                                                    </tr>
                                                })
                                            : <tr>
                                                <td colSpan={2}>{this.props.items[this.state.item.rarity][this.state.item.name].information}</td>
                                            </tr>}
                                    </tbody>
                                </table>
                            </div>
                            <span>{this.props.items[this.state.item.rarity][this.state.item.name].description}</span>
                            <span className="font micro transparent-normal">Source: {this.props.items[this.state.item.rarity][this.state.item.name].source}</span>
                            {(regexItemsLeftAndRight.test(this.props.items[this.state.item.rarity][this.state.item.name].slot))
                                ? <div className="flex-center row gap">
                                    <button className="btn-match space-nicely top not-bottom"
                                        onClick={() => this.equipItem(
                                            this.state.item.name,
                                            this.state.item.rarity,
                                            this.props.items[this.state.item.rarity][this.state.item.name].slot,
                                            "left"
                                        )}>Equip Left</button>
                                    <button className="btn-match space-nicely top not-bottom"
                                        onClick={() => this.equipItem(
                                            this.state.item.name,
                                            this.state.item.rarity,
                                            this.props.items[this.state.item.rarity][this.state.item.name].slot,
                                            "right"
                                        )}>Equip Right</button>
                                </div>
                                : <button className="btn-match space-nicely top not-bottom"
                                    onClick={() => this.equipItem(
                                        this.state.item.name,
                                        this.state.item.rarity,
                                        this.props.items[this.state.item.rarity][this.state.item.name].slot
                                    )}>Equip</button>}
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

export default WidgetInventory;