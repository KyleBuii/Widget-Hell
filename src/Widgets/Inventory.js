import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


class WidgetInventory extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: [],
            health: 1
        };
        this.updateInventory = this.updateInventory.bind(this);
    };
    updateInventory(){
        var itemSlots;
        if(localStorage.getItem("inventory").length !== 0){
            let dataLocalStorage = JSON.parse(localStorage.getItem("inventory"));
            if(dataLocalStorage.length < 16){
                /// Prefill inventory with slots
                itemSlots = new Array(16).fill(null);
                for(let i = 0; i < 16; i++){
                    itemSlots[i] = (
                        <button></button>
                    );
                };
            };
            for(let i = 0; i < dataLocalStorage.length; i++){
                itemSlots[i] = (
                    <button
                        // onClick={() => viewItem(items[i])}
                        style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL + this.props.items[dataLocalStorage[0].rarity][dataLocalStorage[0].name].image})`
                        }}>
                    </button>
                );
            };
        }else{
            /// Prefill inventory with slots
            itemSlots = new Array(16).fill(null);
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
    componentDidMount(){
        window.addEventListener("new item", this.updateInventory);
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
                cancel="button, table"
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
                        <section className="inventory flex-center column gap medium">
                            {/* Inventory Slots */}
                            <div className="grid col-4 spread-inventory box dimmed">
                                <div>{this.state.items[0]}</div>
                                <div>{this.state.items[1]}</div>
                                <div>{this.state.items[2]}</div>
                                <div>{this.state.items[3]}</div>
                                <div>{this.state.items[4]}</div>
                                <div>{this.state.items[5]}</div>
                                <div>{this.state.items[6]}</div>
                                <div>{this.state.items[7]}</div>
                                <div>{this.state.items[8]}</div>
                                <div>{this.state.items[9]}</div>
                                <div>{this.state.items[10]}</div>
                                <div>{this.state.items[11]}</div>
                                <div>{this.state.items[12]}</div>
                                <div>{this.state.items[13]}</div>
                                <div>{this.state.items[14]}</div>
                                <div>{this.state.items[15]}</div>
                            </div>
                            {/* Stats */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Base</th>
                                        <th>Stats</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Health:</td>
                                        <td>{this.state.health}</td>
                                    </tr>
                                </tbody>
                            </table>
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