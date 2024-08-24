import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


class WidgetEquipment extends Component{
    constructor(props){
        super(props);
        this.state = {
            equipped: {
                headband: {
                    name: "",
                    rarity: ""
                },
                helmet: {
                    name: "",
                    rarity: ""
                },
                eyewear: {
                    name: "",
                    rarity: ""
                },
                necklace: {
                    name: "",
                    rarity: ""
                },
                undershirt: {
                    name: "",
                    rarity: ""
                },
                chestplate: {
                    name: "",
                    rarity: ""
                },
                cape: {
                    name: "",
                    rarity: ""
                },
                bracelet: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                wrist: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                belt: {
                    name: "",
                    rarity: ""
                },
                main: {
                    name: "",
                    rarity: ""
                },
                glove: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                ring: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                legging: {
                    name: "",
                    rarity: ""
                },
                offhand: {
                    name: "",
                    rarity: ""
                },
                hidden: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                boot: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                }
            },
            item: {name: "Creampuff", rarity: "rare", slot: "hidden"},
            stats: {
                level: 1,
                exp: 0,
                health: 1,
                mana: 1,
                attack: 1,
                defense: 1,
                strength: 1,
                agility: 1,
                vitality: 1,
                resilience: 1,
                intelligence: 1,
                dexterity: 1,
                luck: 1
            },
            abilities: []
        };
        this.updateEquipment = this.updateEquipment.bind(this);
        this.updateStats = this.updateStats.bind(this);
        this.updateAbilities = this.updateAbilities.bind(this);
    };
    viewItem(item){
        document.getElementById("equipment-popout-view-item")
            .style
            .visibility = "visible";
        this.setState({
            item: item
        });
    };
    unequipItem(){
        var itemSlot;
        if(this.state.item.side){
            itemSlot = document.getElementById(`equipment-slot-${this.state.item.slot}-${this.state.item.side}`);
            this.setState({
                equipped: {
                    ...this.state.equipped,
                    [this.state.item.slot]: {
                        ...this.state.equipped[this.state.item.slot],
                        [this.state.item.side]: {
                            name: "",
                            rarity: ""
                        }
                    }
                }
            });
        }else{
            itemSlot = document.getElementById(`equipment-slot-${this.state.item.slot}`);
            this.setState({
                equipped: {
                    ...this.state.equipped,
                    [this.state.item.slot]: {
                        name: "",
                        rarity: ""
                    }
                }
            });
        };
        itemSlot.style.backgroundImage = `url(${process.env.PUBLIC_URL}/images/inventory/${this.state.item.slot}.png)`;
        itemSlot.style.opacity = "0.5";
        itemSlot.onclick = null;
        this.updateStats(this.state.item, true);
    };
    updateEquipment(event){
        const itemData = {
            "name": event.detail.name,
            "rarity": event.detail.rarity
        };
        var itemSlot;
        if(event.detail.side){
            if(this.state.equipped[event.detail.slot][event.detail.side].name !== event.detail.name
                && this.state.equipped[event.detail.slot][event.detail.side].name === ""){
                itemSlot = document.getElementById(`equipment-slot-${event.detail.slot}-${event.detail.side}`);
                this.setState({
                    equipped: {
                        ...this.state.equipped,
                        [event.detail.slot]: {
                            ...this.state.equipped[event.detail.slot],
                            [event.detail.side]: {
                                ...itemData
                            } 
                        }
                    }
                });
                itemSlot.style.backgroundImage = `url(${process.env.PUBLIC_URL + this.props.items[itemData.rarity][itemData.name].image})`;
                itemSlot.style.opacity = "1";
                itemSlot.onclick = () => {
                    this.viewItem({
                        ...itemData,
                        "slot": event.detail.slot,
                        "side": event.detail.side
                    });
                };
                this.updateStats(itemData);
            };
        }else{
            if(this.state.equipped[event.detail.slot].name !== event.detail.name
                && this.state.equipped[event.detail.slot].name === ""){
                itemSlot = document.getElementById(`equipment-slot-${event.detail.slot}`);
                this.setState({
                    equipped: {
                        ...this.state.equipped,
                        [event.detail.slot]: {
                            ...itemData
                        }
                    }
                });
                itemSlot.style.backgroundImage = `url(${process.env.PUBLIC_URL + this.props.items[itemData.rarity][itemData.name].image})`;
                itemSlot.style.opacity = "1";
                itemSlot.onclick = () => {
                    this.viewItem({
                        ...itemData,
                        "slot": event.detail.slot
                    });
                };
                this.updateStats(itemData);
            };
        };
    };
    updateStats(itemData, remove = false){
        let item = this.props.items[itemData.rarity][itemData.name];
        if(remove){
            if(item.type === "ability"){
                let indexRemove = this.state.abilities.indexOf(item.information);
                if(indexRemove === 0){
                    this.setState({
                        abilities: [...this.state.abilities.slice(1)]
                    }, () => {
                        this.updateAbilities();
                    });
                }else{
                    this.setState({
                        abilities: [...this.state.abilities.slice(0, indexRemove), ...this.state.abilities.slice(indexRemove + 1)]
                    }, () => {
                        this.updateAbilities();
                    });
                };
            };
            if(item.type === "stat"){
                let itemStats = Object.keys(item.stats);
                let newStats = {};
                for(let i in itemStats){
                    newStats[itemStats[i]] = this.state.stats[itemStats] - item.stats[itemStats];
                };
                this.setState({
                    stats: {
                        ...this.state.stats,
                        ...newStats
                    }
                });
            };
        }else{
            if(item.type === "ability"){
                this.setState({
                    abilities: [...this.state.abilities, item.information]
                }, () => {
                    this.updateAbilities();
                });
            };
            if(item.type === "stat"){
                let itemStats = Object.keys(item.stats);
                let newStats = {};
                for(let i in itemStats){
                    newStats[itemStats[i]] = item.stats[itemStats] + this.state.stats[itemStats];
                };
                this.setState({
                    stats: {
                        ...this.state.stats,
                        ...newStats
                    }
                });
            };
        };
    };
    updateAbilities(){
        let elementAbilities = document.getElementById("equipment-abilities");
        if(this.state.abilities.length === 0){
            elementAbilities.innerHTML = `
                <tr>
                    <td>Nothing here...</td>
                </tr>`;
        }else{
            let abilityCounts = {};
            elementAbilities.innerHTML = "";
            this.state.abilities.forEach((value) => {
                abilityCounts[value] = (abilityCounts[value] || 0) + 1;
            });
            let abilityKeys = Object.keys(abilityCounts);
            for(let i in abilityKeys){
                let abilityRow = document.createElement("tr");
                let ability = document.createElement("td");
                ability.innerText = `${abilityKeys[i]} ${(abilityCounts[abilityKeys[i]] === 1) ? "" : `x${abilityCounts[abilityKeys[i]]}`}`;
                abilityRow.appendChild(ability);
                elementAbilities.appendChild(abilityRow);
            };
        };
    };
    componentDidMount(){
        window.addEventListener("equip item", (event) => this.updateEquipment(event));
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("equipment", JSON.stringify(this.state.equipped));
            localStorage.setItem("stats", JSON.stringify(this.state.stats));
            localStorage.setItem("abilities", JSON.stringify(this.state.abilities));    
        });
        if(localStorage.getItem("equipment") !== null){
            let dataLocalStorageEquipment = JSON.parse(localStorage.getItem("equipment"));
            var itemSlot;
            this.setState({
                equipped: dataLocalStorageEquipment
            });
            /// Fill equipment slots with image of equipped item
            for(let i in dataLocalStorageEquipment){
                if(dataLocalStorageEquipment[i].name !== ""){
                    /// Equipped items with no left and right
                    if(dataLocalStorageEquipment[i].name !== undefined){
                        itemSlot = document.getElementById(`equipment-slot-${i}`);
                        itemSlot.style.backgroundImage = `url(${process.env.PUBLIC_URL + this.props.items[dataLocalStorageEquipment[i].rarity][dataLocalStorageEquipment[i].name].image})`;
                        itemSlot.style.opacity = "1";
                        itemSlot.onclick = () => {
                            this.viewItem({
                                ...dataLocalStorageEquipment[i],
                                "slot": i
                            });
                        };  
                    }else{
                        /// Left equipped item
                        if(dataLocalStorageEquipment[i].left.name !== ""){
                            itemSlot = document.getElementById(`equipment-slot-${i}-left`);
                            itemSlot.style.backgroundImage = `url(${process.env.PUBLIC_URL + this.props.items[dataLocalStorageEquipment[i].left.rarity][dataLocalStorageEquipment[i].left.name].image})`;
                            itemSlot.style.opacity = "1";
                            itemSlot.onclick = () => {
                                this.viewItem({
                                    ...dataLocalStorageEquipment[i].left,
                                    "slot": i,
                                    "side": "left"
                                });
                            };          
                        };
                        /// Right equipped item
                        if(dataLocalStorageEquipment[i].right.name !== ""){
                            itemSlot = document.getElementById(`equipment-slot-${i}-right`);
                            itemSlot.style.backgroundImage = `url(${process.env.PUBLIC_URL + this.props.items[dataLocalStorageEquipment[i].right.rarity][dataLocalStorageEquipment[i].right.name].image})`;
                            itemSlot.style.opacity = "1";
                            itemSlot.onclick = () => {
                                this.viewItem({
                                    ...dataLocalStorageEquipment[i].right,
                                    "slot": i,
                                    "side": "right"
                                });
                            };         
                        };
                    };
                };
            };
        };
        if(localStorage.getItem("stats") !== null){
            let dataLocalStorageStats = JSON.parse(localStorage.getItem("stats"));
            this.setState({
                stats: {
                    ...dataLocalStorageStats
                }
            });
        };
        if(localStorage.getItem("abilities") !== null){
            let dataLocalStorageAbilities = JSON.parse(localStorage.getItem("abilities"));
            this.setState({
                abilities: [...dataLocalStorageAbilities]
            }, () => {
                this.updateAbilities();    
            });
        };
    };
    componentWillUnmount(){
        localStorage.setItem("equipment", JSON.stringify(this.state.equipped));
        localStorage.setItem("stats", JSON.stringify(this.state.stats));
        localStorage.setItem("abilities", JSON.stringify(this.state.abilities));
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("equipment")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("equipment");
                    this.props.defaultProps.updatePosition("equipment", "utility", data.x, data.y);
                }}
                cancel="table, button, span, #equipment-popout-view-item"
                bounds="parent">
                <div id="equipment-widget"
                    className="widget">
                    <div id="equipment-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="equipment-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("equipment", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("equipment", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Equipment Container */}
                        <section className="flex-center column gap medium">
                            {/* Slots and Stats */}
                            <section className="flex-center row gap medium">
                                {/* Slots */}
                                <section className="flex-center column gap medium">
                                    {/* Level */}
                                    <div className="flex-center column">
                                        <span className="font medium bold">Level {this.state.stats.level}</span>
                                        <span className="font micro transparent-normal">EXP: {this.state.stats.exp}</span>
                                    </div>
                                    {/* Armor Slots */}
                                    <div id="equipment-slots-armor"
                                        className="slot flex-center column gap">
                                        {/* Helmet Container */}
                                        <div className="flex-center row gap">
                                            {/* Headband */}
                                            <button id="equipment-slot-headband"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/headband.png)`
                                                }}></button>
                                            {/* Helmet */}
                                            <button id="equipment-slot-helmet"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/helmet.png)`
                                                }}></button>
                                            {/* Eyewear */}
                                            <button id="equipment-slot-eyewear"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/eyewear.png)`,
                                                    backgroundSize: "25px"
                                                }}></button>
                                        </div>
                                        {/* Necklace Container */}
                                        <div className="flex-center row gap">
                                            {/* Necklace */}
                                            <button id="equipment-slot-necklace"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/necklace.png)`,
                                                    backgroundSize: "25px"
                                                }}></button>
                                        </div>
                                        {/* Chestplate Container */}
                                        <div className="flex-center row gap">
                                            {/* Undershirt */}
                                            <button id="equipment-slot-undershirt"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/undershirt.png)`
                                                }}></button>
                                            {/* Chestplate */}
                                            <button id="equipment-slot-chestplate"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/chestplate.png)`
                                                }}></button>
                                            {/* Cape */}
                                            <button id="equipment-slot-cape"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/cape.png)`
                                                }}></button>
                                        </div>
                                        {/* Belt Container */}
                                        <div className="flex-center row gap">
                                            {/* Right Bracelet */}
                                            <button id="equipment-slot-bracelet-right"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/bracelet.png)`,
                                                    backgroundSize: "25px",
                                                    transform: "scaleX(-1)"
                                                }}></button>
                                            {/* Right Wrist */}
                                            <button id="equipment-slot-wrist-right"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/wrist.png)`,
                                                    backgroundSize: "20px"
                                                }}></button>
                                            {/* Belt */}
                                            <button id="equipment-slot-belt"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/belt.png)`
                                                }}></button>
                                            {/* Left Wrist */}
                                            <button id="equipment-slot-wrist-left"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/wrist.png)`,
                                                    backgroundSize: "20px"
                                                }}></button>
                                            {/* Left Bracelet */}
                                            <button id="equipment-slot-bracelet-left"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/bracelet.png)`,
                                                    backgroundSize: "25px"
                                                }}></button>
                                        </div>
                                        {/* Legging Container */}
                                        <div className="flex-center row gap">
                                            {/* Main Item */}
                                            <button id="equipment-slot-main"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/main.png)`
                                                }}></button>
                                            {/* Right Glove */}
                                            <button id="equipment-slot-glove-right"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/glove.png)`,
                                                    backgroundSize: "22px"
                                                }}></button>
                                            {/* Right Ring */}
                                            <button id="equipment-slot-ring-right"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/ring.png)`,
                                                    backgroundSize: "20px",
                                                    transform: "scaleX(-1)"
                                                }}></button>
                                            {/* Legging */}
                                            <button id="equipment-slot-legging"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/legging.png)`
                                                }}></button>
                                            {/* Left Ring */}
                                            <button id="equipment-slot-ring-left"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/ring.png)`,
                                                    backgroundSize: "20px"
                                                }}></button>
                                            {/* Left Glove */}
                                            <button id="equipment-slot-glove-left"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/glove.png)`,
                                                    backgroundSize: "22px",
                                                    transform: "scaleX(-1)"
                                                }}></button>
                                            {/* Offhand Item */}
                                            <button id="equipment-slot-offhand"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/offhand.png)`,
                                                    backgroundSize: "40px"
                                                }}></button>
                                        </div>
                                        {/* Boot Container */}
                                        <div className="flex-center row gap">
                                            {/* Right Hidden Item in Boot */}
                                            <button id="equipment-slot-hidden-right"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/hidden.png)`
                                                }}></button>
                                            {/* Right Boot */}
                                            <button id="equipment-slot-boot-right"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/boot.png)`,
                                                    backgroundSize: "40px"
                                                }}></button>
                                            {/* Left Boot */}
                                            <button id="equipment-slot-boot-left"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/boot.png)`,
                                                    backgroundSize: "40px",
                                                    transform: "scaleX(-1)"
                                                }}></button>
                                            {/* Left Hidden Item in Boot */}
                                            <button id="equipment-slot-hidden-left"
                                                style={{
                                                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/hidden.png)`
                                                }}></button>
                                        </div>
                                    </div>
                                    {/* Potion Slots */}
                                    <div id="equipment-slots-potion" 
                                        className="slot flex-center row gap">
                                        <button id="equipment-slot-potion-1"
                                            style={{
                                                backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/potion.png)`
                                            }}></button>
                                        <button id="equipment-slot-potion-2"
                                            style={{
                                                backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/potion.png)`
                                            }}></button>
                                        <button id="equipment-slot-potion-3"
                                            style={{
                                                backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/potion.png)`
                                            }}></button>
                                        <button id="equipment-slot-potion-4"
                                            style={{
                                                backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/potion.png)`
                                            }}></button>
                                        <button id="equipment-slot-potion-5"
                                            style={{
                                                backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/potion.png)`
                                            }}></button>
                                        <button id="equipment-slot-potion-6"
                                            style={{
                                                backgroundImage: `url(${process.env.PUBLIC_URL}/images/inventory/potion.png)`
                                            }}></button>
                                    </div>
                                </section>
                                {/* Stats */}
                                <table className="table font">
                                    <thead>
                                        <tr>
                                            <th>Stat</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Health:</td>
                                            <td>{this.state.stats.health}</td>
                                        </tr>
                                        <tr>
                                            <td>Mana:</td>
                                            <td>{this.state.stats.mana}</td>
                                        </tr>
                                        <tr>
                                            <td>Attack:</td>
                                            <td>{this.state.stats.attack}</td>
                                        </tr>
                                        <tr>
                                            <td>Defense:</td>
                                            <td>{this.state.stats.defense}</td>
                                        </tr>
                                        <tr>
                                            <td>Strength:</td>
                                            <td>{this.state.stats.strength}</td>
                                        </tr>
                                        <tr>
                                            <td>Agility:</td>
                                            <td>{this.state.stats.agility}</td>
                                        </tr>
                                        <tr>
                                            <td>Vitality:</td>
                                            <td>{this.state.stats.vitality}</td>
                                        </tr>
                                        <tr>
                                            <td>Resilience:</td>
                                            <td>{this.state.stats.resilience}</td>
                                        </tr>
                                        <tr>
                                            <td>Intelligence:</td>
                                            <td>{this.state.stats.intelligence}</td>
                                        </tr>
                                        <tr>
                                            <td>Dexterity:</td>
                                            <td>{this.state.stats.dexterity}</td>
                                        </tr>
                                        <tr>
                                            <td>Luck:</td>
                                            <td>{this.state.stats.luck}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                            {/* Abilities */}
                            <table className="table font">
                                <thead>
                                    <tr>
                                        <th>Abilities</th>
                                    </tr>
                                </thead>
                                <tbody id="equipment-abilities"></tbody>
                            </table>
                        </section>
                        {/* View Item Popout */}
                        <section id="equipment-popout-view-item"
                            className="flex-center column gap font no-highlight"
                            onClick={() => {
                                document.getElementById("equipment-popout-view-item").style.visibility = "hidden";
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
                                            <td>{this.state.item.slot.replace(/^./, (char) => char.toUpperCase())}</td>
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
                            <button className="btn-match space-nicely top not-bottom"
                                onClick={() => this.unequipItem()}>Unequip</button>
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

export default WidgetEquipment;