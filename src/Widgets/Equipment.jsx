import DOMPurify from 'dompurify';
import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import SimpleBar from 'simplebar-react';


//#region Equipment Guide
/* Stats Guide
[Main Stats]   ->       [Side Stats]
   Health      ->         Vitality
    Mana       ->       Intelligence
   Attack      ->   Strength + Dexterity
   Defense     ->        Resilience
   Agility
    Luck
*/
/* Slots Guide
                              Headband -   Helmet   - Eyewear
                                          Necklace
                            Undershirt - Chestplate - Cape
          Right Bracelet - Right Wrist -    Belt    - Left Wrist - Left Bracelet
Main Item -  Right Glove - Right Ring  -  Legging   - Left Ring  - Left Glove - Offhand Item
       Right Hidden Item in Boot - Right Boot - Left Boot - Left Hidden Item in Boot
   Consumable 1 - Consumable 2 - Consumable 3 - Consumable 4 - Consumable 5 - Consumable 6
     [Health]   -    [Mana]    -   [Attack]   -  [Defense]   -  [Agility]   -    [Luck]
*/
//#endregion
/// Variables
const audioItemOpen = new Audio("/resources/audio/switch_006.wav");
const audioItemClose = new Audio("/resources/audio/switch_007.wav");
const audioItemUnequip = new Audio("/resources/audio/cloth.wav");


class WidgetEquipment extends Component{
    constructor(props){
        super(props);
        this.state = {
            item: {name: "Creampuff", rarity: "rare", slot: "hidden"},
            abilities: []
        };
        this.updateEquipment = this.updateEquipment.bind(this);
        this.removeStats = this.removeStats.bind(this);
        this.updateAbilities = this.updateAbilities.bind(this);
    };
    viewItem(item){
        this.props.defaultProps.playAudio(audioItemOpen);
        document.getElementById("equipment-popout-view-item")
            .style
            .visibility = "visible";
        this.setState({
            item: item
        });
    };
    unequipItem(event){
        event.stopPropagation();
        this.props.defaultProps.playAudio(audioItemUnequip);
        let itemSlot;
        let newEquipment;
        if(this.state.item.side){
            itemSlot = document.getElementById(`equipment-slot-${this.state.item.slot}-${this.state.item.side}`);
            newEquipment = {
                ...this.props.equipment,
                [this.state.item.slot]: {
                    ...this.props.equipment[this.state.item.slot],
                    [this.state.item.side]: {
                        name: "",
                        rarity: ""
                    }
                }
            };
            window.dispatchEvent(new CustomEvent("unequip item", {
                "detail": {
                    "slot": this.state.item.slot,
                    "side": this.state.item.side
                }
            }));
        }else{
            itemSlot = document.getElementById(`equipment-slot-${this.state.item.slot}`);
            newEquipment = {
                ...this.props.equipment,
                [this.state.item.slot]: {
                    name: "",
                    rarity: ""
                }
            };
            window.dispatchEvent(new CustomEvent("unequip item", {
                "detail": {
                    "slot": this.state.item.slot
                }
            }));
        };
        if(/consumable/.test(this.state.item.slot)){
            itemSlot.style.backgroundImage = `url(/resources/inventory/consumable.webp)`;
        }else{
            itemSlot.style.backgroundImage = `url(/resources/inventory/${this.state.item.slot}.webp)`;
        };
        itemSlot.style.opacity = "0.5";
        itemSlot.onclick = null;
        this.props.updateGameValue("equipment", newEquipment);
        this.removeStats(this.state.item);
        document.getElementById("equipment-popout-view-item").style.visibility = "hidden";
    };
    updateEquipment(event){
        const itemData = {
            "name": event.detail.name,
            "rarity": event.detail.rarity
        };
        let itemSlot;
        if(event.detail.side){
            if(this.props.equipment[event.detail.slot][event.detail.side].name !== event.detail.name
                && this.props.equipment[event.detail.slot][event.detail.side].name === ""){
                itemSlot = document.getElementById(`equipment-slot-${event.detail.slot}-${event.detail.side}`);
                itemSlot.style.backgroundImage = `url(${this.props.items[itemData.rarity][itemData.name].image})`;
                if(event.detail.side === "left"){
                    itemSlot.style.transform = "scaleX(-1)";
                }else{
                    itemSlot.style.transform = "scaleX(1)";
                };
                itemSlot.style.opacity = "1";
                itemSlot.onclick = () => {
                    this.viewItem({
                        ...itemData,
                        "slot": event.detail.slot,
                        "side": event.detail.side
                    });
                };
            };
        }else{
            if(this.props.equipment[event.detail.slot].name !== event.detail.name
                && this.props.equipment[event.detail.slot].name === ""){
                itemSlot = document.getElementById(`equipment-slot-${event.detail.slot}`);
                itemSlot.style.backgroundImage = `url(${this.props.items[itemData.rarity][itemData.name].image})`;
                itemSlot.style.opacity = "1";
                itemSlot.onclick = () => {
                    this.viewItem({
                        ...itemData,
                        "slot": event.detail.slot
                    });
                };
            };
        };
    };
    removeStats(itemData){
        let item = this.props.items[itemData.rarity][itemData.name];
        let newAbilities;
        if(item.type === "ability" || item.type === "both"){
            let indexRemove = this.props.abilities.indexOf(item.information);
            if(indexRemove === 0){
                newAbilities = [...this.props.abilities.slice(1)];
            }else{
                newAbilities = [...this.props.abilities.slice(0, indexRemove), ...this.props.abilities.slice(indexRemove + 1)];
            };
            this.props.updateGameValue("abilities", newAbilities);
        };
        if(item.type === "stat" || item.type === "both"){
            let itemStats = Object.keys(item.stats);
            let newStats = {};
            for(let i in itemStats){
                newStats[itemStats[i]] = this.props.stats[itemStats[i]] - item.stats[itemStats[i]];
            };
            this.props.updateGameValue("stats", newStats);
        };
    };
    updateAbilities(){
        let elementAbilities = document.getElementById("equipment-abilities");
        if(this.props.abilities.length === 0){
            elementAbilities.innerHTML = `
                <tr>
                    <td>Nothing here...</td>
                </tr>`;
        }else{
            let abilityCounts = {};
            elementAbilities.innerHTML = "";
            this.props.abilities.forEach((value) => {
                abilityCounts[value] = (abilityCounts[value] || 0) + 1;
            });
            let abilityKeys = Object.keys(abilityCounts);
            for(let i in abilityKeys){
                let abilityRow = document.createElement("tr");
                let ability = document.createElement("td");
                ability.innerText = `${abilityKeys[i].replace(/\S(?!\S)/, (char) => (char === "s") ? "" : char)} ${(abilityCounts[abilityKeys[i]] === 1) ? "" : `x${abilityCounts[abilityKeys[i]]}`}`;
                abilityRow.appendChild(ability);
                elementAbilities.appendChild(abilityRow);
            };
        };
    };
    componentDidUpdate(prevProps){
        if(this.props.abilities !== prevProps.abilities){
            this.updateAbilities();
        };
    };
    componentDidMount(){
        audioItemOpen.volume = 0.5;
        audioItemClose.volume = 0.5;
        window.addEventListener("equip item", this.updateEquipment);
        let itemSlot;
        /// Fill equipment slots with image of equipped item
        for(let i in this.props.equipment){
            if(this.props.equipment[i].name !== ""){
                /// Equipped items with no left and right
                if(this.props.equipment[i].name !== undefined){
                    itemSlot = document.getElementById(`equipment-slot-${i}`);
                    itemSlot.style.backgroundImage = `url(${this.props.items[this.props.equipment[i].rarity][this.props.equipment[i].name].image})`;
                    itemSlot.style.opacity = "1";
                    itemSlot.onclick = () => {
                        this.viewItem({
                            ...this.props.equipment[i],
                            "slot": i
                        });
                    };
                }else{
                    /// Left equipped item
                    if(this.props.equipment[i].left.name !== ""){
                        itemSlot = document.getElementById(`equipment-slot-${i}-left`);
                        itemSlot.style.backgroundImage = `url(${this.props.items[this.props.equipment[i].left.rarity][this.props.equipment[i].left.name].image})`;
                        itemSlot.style.transform = "scaleX(-1)";
                        itemSlot.style.opacity = "1";
                        itemSlot.onclick = () => {
                            this.viewItem({
                                ...this.props.equipment[i].left,
                                "slot": i,
                                "side": "left"
                            });
                        };  
                    };
                    /// Right equipped item
                    if(this.props.equipment[i].right.name !== ""){
                        itemSlot = document.getElementById(`equipment-slot-${i}-right`);
                        itemSlot.style.backgroundImage = `url(${this.props.items[this.props.equipment[i].right.rarity][this.props.equipment[i].right.name].image})`;
                        itemSlot.style.transform = "scaleX(1)";
                        itemSlot.style.opacity = "1";
                        itemSlot.onclick = () => {
                            this.viewItem({
                                ...this.props.equipment[i].right,
                                "slot": i,
                                "side": "right"
                            });
                        };         
                    };
                };
            };
        };
        this.updateAbilities();
    };
    componentWillUnmount(){
        window.removeEventListener("equip item", this.updateEquipment);
    };
    render(){
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
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
                        {this.props.defaultProps.renderHotbar("equipment", "utility")}
                        {/* Equipment Container */}
                        <SimpleBar style={{ maxHeight: "36em" }}>
                        <section className="flex-center column gap medium-gap">
                            {/* Slots and Stats */}
                            <section className="flex-center row gap medium-gap">
                                {/* Slots */}
                                <section className="flex-center column gap medium-gap">
                                    {/* Level */}
                                    <div className="aesthetic-scale scale-span flex-center column">
                                        <span className="font medium bold">Level {this.props.stats.level}</span>
                                        <span className="font micro transparent-normal">EXP: {this.props.stats.exp} / {this.props.gameProps.formatNumber(this.props.stats.maxExp, 2)}</span>
                                    </div>
                                    {/* Armor Slots */}
                                    <div id="equipment-slots-armor"
                                        className="aesthetic-scale scale-button slot flex-center column gap">
                                        {/* Helmet Container */}
                                        <div className="flex-center row gap">
                                            {/* Headband */}
                                            <button id="equipment-slot-headband"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/headband.webp)`
                                                }}></button>
                                            {/* Helmet */}
                                            <button id="equipment-slot-helmet"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/helmet.webp)`
                                                }}></button>
                                            {/* Eyewear */}
                                            <button id="equipment-slot-eyewear"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/eyewear.webp)`,
                                                    backgroundSize: "25px"
                                                }}></button>
                                        </div>
                                        {/* Necklace Container */}
                                        <div className="flex-center row gap">
                                            {/* Necklace */}
                                            <button id="equipment-slot-necklace"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/necklace.webp)`,
                                                    backgroundSize: "25px"
                                                }}></button>
                                        </div>
                                        {/* Chestplate Container */}
                                        <div className="flex-center row gap">
                                            {/* Undershirt */}
                                            <button id="equipment-slot-undershirt"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/undershirt.webp)`
                                                }}></button>
                                            {/* Chestplate */}
                                            <button id="equipment-slot-chestplate"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/chestplate.webp)`
                                                }}></button>
                                            {/* Cape */}
                                            <button id="equipment-slot-cape"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/cape.webp)`
                                                }}></button>
                                        </div>
                                        {/* Belt Container */}
                                        <div className="flex-center row gap">
                                            {/* Right Bracelet */}
                                            <button id="equipment-slot-bracelet-right"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/bracelet.webp)`,
                                                    backgroundSize: "25px",
                                                    transform: "scaleX(-1)"
                                                }}></button>
                                            {/* Right Wrist */}
                                            <button id="equipment-slot-wrist-right"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/wrist.webp)`,
                                                    backgroundSize: "20px"
                                                }}></button>
                                            {/* Belt */}
                                            <button id="equipment-slot-belt"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/belt.webp)`
                                                }}></button>
                                            {/* Left Wrist */}
                                            <button id="equipment-slot-wrist-left"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/wrist.webp)`,
                                                    backgroundSize: "20px"
                                                }}></button>
                                            {/* Left Bracelet */}
                                            <button id="equipment-slot-bracelet-left"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/bracelet.webp)`,
                                                    backgroundSize: "25px"
                                                }}></button>
                                        </div>
                                        {/* Legging Container */}
                                        <div className="flex-center row gap">
                                            {/* Main Item */}
                                            <button id="equipment-slot-main"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/main.webp)`
                                                }}></button>
                                            {/* Right Glove */}
                                            <button id="equipment-slot-glove-right"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/glove.webp)`,
                                                    backgroundSize: "22px"
                                                }}></button>
                                            {/* Right Ring */}
                                            <button id="equipment-slot-ring-right"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/ring.webp)`,
                                                    backgroundSize: "20px",
                                                    transform: "scaleX(-1)"
                                                }}></button>
                                            {/* Legging */}
                                            <button id="equipment-slot-legging"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/legging.webp)`
                                                }}></button>
                                            {/* Left Ring */}
                                            <button id="equipment-slot-ring-left"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/ring.webp)`,
                                                    backgroundSize: "20px"
                                                }}></button>
                                            {/* Left Glove */}
                                            <button id="equipment-slot-glove-left"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/glove.webp)`,
                                                    backgroundSize: "22px",
                                                    transform: "scaleX(-1)"
                                                }}></button>
                                            {/* Offhand Item */}
                                            <button id="equipment-slot-offhand"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/offhand.webp)`,
                                                    backgroundSize: "40px"
                                                }}></button>
                                        </div>
                                        {/* Boot Container */}
                                        <div className="flex-center row gap">
                                            {/* Right Hidden Item in Boot */}
                                            <button id="equipment-slot-hidden-right"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/hidden.webp)`
                                                }}></button>
                                            {/* Right Boot */}
                                            <button id="equipment-slot-boot-right"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/boot.webp)`,
                                                    backgroundSize: "40px"
                                                }}></button>
                                            {/* Left Boot */}
                                            <button id="equipment-slot-boot-left"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/boot.webp)`,
                                                    backgroundSize: "40px",
                                                    transform: "scaleX(-1)"
                                                }}></button>
                                            {/* Left Hidden Item in Boot */}
                                            <button id="equipment-slot-hidden-left"
                                                style={{
                                                    backgroundImage: `url(/resources/inventory/hidden.webp)`
                                                }}></button>
                                        </div>
                                    </div>
                                    {/* Consumable Slots */}
                                    <div id="equipment-slots-consumable" 
                                        className="slot flex-center row gap">
                                        <button id="equipment-slot-consumable1"
                                            style={{
                                                backgroundImage: `url(/resources/inventory/consumable.webp)`
                                            }}></button>
                                        <button id="equipment-slot-consumable2"
                                            style={{
                                                backgroundImage: `url(/resources/inventory/consumable.webp)`
                                            }}></button>
                                        <button id="equipment-slot-consumable3"
                                            style={{
                                                backgroundImage: `url(/resources/inventory/consumable.webp)`
                                            }}></button>
                                        <button id="equipment-slot-consumable4"
                                            style={{
                                                backgroundImage: `url(/resources/inventory/consumable.webp)`
                                            }}></button>
                                        <button id="equipment-slot-consumable5"
                                            style={{
                                                backgroundImage: `url(/resources/inventory/consumable.webp)`
                                            }}></button>
                                        <button id="equipment-slot-consumable6"
                                            style={{
                                                backgroundImage: `url(/resources/inventory/consumable.webp)`
                                            }}></button>
                                    </div>
                                </section>
                                {/* Stats */}
                                <table id="equipment-table-stats" 
                                    className="aesthetic-scale scale-table table font"
                                    style={{ width: "unset" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Stat</th>
                                            <th scope="col">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Health:</td>
                                            <td>{this.props.stats.health}</td>
                                        </tr>
                                        <tr>
                                            <td>Mana:</td>
                                            <td>{this.props.stats.mana}</td>
                                        </tr>
                                        <tr>
                                            <td>Attack:</td>
                                            <td>{this.props.stats.attack}</td>
                                        </tr>
                                        <tr>
                                            <td>Defense:</td>
                                            <td>{this.props.stats.defense}</td>
                                        </tr>
                                        <tr>
                                            <td>Strength:</td>
                                            <td>{this.props.stats.strength}</td>
                                        </tr>
                                        <tr>
                                            <td>Agility:</td>
                                            <td>{this.props.stats.agility}</td>
                                        </tr>
                                        <tr>
                                            <td>Vitality:</td>
                                            <td>{this.props.stats.vitality}</td>
                                        </tr>
                                        <tr>
                                            <td>Resilience:</td>
                                            <td>{this.props.stats.resilience}</td>
                                        </tr>
                                        <tr>
                                            <td>Intelligence:</td>
                                            <td>{this.props.stats.intelligence}</td>
                                        </tr>
                                        <tr>
                                            <td>Dexterity:</td>
                                            <td>{this.props.stats.dexterity}</td>
                                        </tr>
                                        <tr>
                                            <td>Luck:</td>
                                            <td>{this.props.stats.luck}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                            {/* Abilities */}
                            <SimpleBar className="fill-width font"
                                style={{
                                    maxHeight: "14.7em"
                                }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Abilities</th>
                                        </tr>
                                    </thead>
                                    <tbody id="equipment-abilities"></tbody>
                                </table>
                            </SimpleBar>
                        </section>
                        </SimpleBar>
                        {/* View Item Popout */}
                        <section id="equipment-popout-view-item"
                            className="flex-center column gap font no-highlight"
                            onClick={() => {
                                this.props.defaultProps.playAudio(audioItemClose);
                                document.getElementById("equipment-popout-view-item").style.visibility = "hidden";
                            }}>
                            <span className="font bold large-medium">{this.state.item.name}</span>
                            <div className="flex-center row gap medium-gap space-nicely space-all">
                                <img src={this.props.items[this.state.item.rarity][this.state.item.name].image}
                                    alt="viewed inventory item"
                                    decoding="async"/>
                                <SimpleBar style={{
                                    maxHeight: 160,
                                    width: 150
                                }}>
                                    <table className="flex-center column font small">
                                        <tbody>
                                            <tr>
                                                <td scope="row">Rarity:</td>
                                                <td>{this.state.item.rarity.replace(/^./, (char) => char.toUpperCase())}</td>
                                            </tr>
                                            <tr>
                                                <td scope="row">Slot:</td>
                                                <td>{this.state.item.slot
                                                    .replace(/^./, (char) => char.toUpperCase())
                                                    .replace(/[0-9]/, "")}</td>
                                            </tr>
                                            {(/stat|both/.test(this.props.items[this.state.item.rarity][this.state.item.name].type))
                                                ? Object.keys(this.props.items[this.state.item.rarity][this.state.item.name].stats)
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
                                            {(/ability|both/.test(this.props.items[this.state.item.rarity][this.state.item.name].type))
                                                ? <tr>
                                                    <td colSpan={2}>{this.props.items[this.state.item.rarity][this.state.item.name].information}</td>
                                                </tr>
                                                : <></>}
                                        </tbody>
                                    </table>
                                </SimpleBar>
                            </div>
                            <span dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(this.props.items[this.state.item.rarity][this.state.item.name].description)
                            }}></span>
                            {(this.props.items[this.state.item.rarity][this.state.item.name].requirement)
                                ? <span className="font micro"
                                    style={{
                                        color: "red",
                                        opacity: "0.5"
                                    }}>Requirement: {this.props.items[this.state.item.rarity][this.state.item.name].requirement}</span>
                                : <></>}
                            <span className="font micro transparent-normal">Source: {this.props.items[this.state.item.rarity][this.state.item.name].source}</span>
                            <button className="button-match space-nicely space-top not-bottom"
                                onClick={(event) => this.unequipItem(event)}>Unequip</button>
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

export default memo(WidgetEquipment);