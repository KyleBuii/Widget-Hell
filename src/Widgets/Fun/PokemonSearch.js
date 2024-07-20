import { React, Component } from 'react';
import { FaGripHorizontal, FaRandom } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


/// Variables
const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex()


class WidgetPokemonSearch extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            searched: "furret",
            name: "",
            id: "",
            weight: "",
            height: "",
            hp: "",
            attack: "",
            defense: "",
            specialAttack: "",
            specialDefense: "",
            speed: "",
            shiny: false
        };
        this.handleButton = this.handleButton.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.fetchPokemon = this.fetchPokemon.bind(this);
    };
    handleButton(what){
        switch(what){
            case "search":
                if(this.state.input !== ""){
                    this.setState({
                        searched: this.state.input
                    }, () => {
                        this.fetchPokemon(this.state.searched);
                    });
                };
                break;
            case "random":
                P.getPokemonSpeciesList({
                    limit: 0
                }).then((data) => {
                    this.setState({
                        searched: (Math.floor(Math.random() * data.count) + 1).toString()
                    }, () => {
                        this.fetchPokemon(this.state.searched);
                    });
                });
                break;
            case "shiny":
                this.setState({
                    shiny: !this.state.shiny
                }, () => {
                    let buttonPokemonShiny = document.getElementById("pokemonsearch-button-shiny");
                    buttonPokemonShiny.style.opacity = (this.state.shiny) ? "1" : "0.5";    
                });
                this.fetchPokemon(this.state.searched);
                break;
            default:
                break;
        };
    };
    handleKeyPress(event){
        const buttonPokemonSearch = document.getElementById("pokemonsearch-button-search");
        switch(event.key){
            case "Enter":
                if(this.state.input !== ""){
                    event.preventDefault();
                    buttonPokemonSearch.click();
                };
                break;
            default:
                break;
        };
    };
    async fetchPokemon(what){
        try{
            const data = await P.getPokemonByName(what);
            let divPokemonCard = document.getElementById("pokemonsearch-card-pokemon");
            let divPokemonName = document.querySelector("#pokemonsearch-div-name span");
            let divPokemonHp = document.getElementById("pokemonsearch-div-hp");
            let divPokemonHpSpan = document.querySelectorAll("#pokemonsearch-div-hp span");
            let divPokemonImage = document.getElementById("pokemonsearch-div-image"); 
            let divPokemonTypes = document.getElementById("pokemonsearch-div-types");
            /// Clear divs
            divPokemonImage.innerHTML = "";
            divPokemonTypes.innerHTML = "";
            this.setState({
                name: data.name.replace(/^./, (char) => char.toUpperCase()),
                id: data.id,
                weight: data.weight,
                height: data.height,
                hp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                specialAttack: data.stats[3].base_stat,
                specialDefense: data.stats[4].base_stat,
                speed: data.stats[5].base_stat
            });
            /// Pokemon image
            let imagePokemon = document.createElement("img");
            imagePokemon.className = "front";
            imagePokemon.alt = "Searched pokemon";
            imagePokemon.src = (this.state.shiny) ? data.sprites.front_shiny : data.sprites.front_default;
            imagePokemon.onclick = () => {
                if(imagePokemon.classList.contains("front")){
                    imagePokemon.src = (this.state.shiny) ? data.sprites.back_shiny : data.sprites.back_default;
                    imagePokemon.classList.remove("front");
                }else{
                    imagePokemon.src = (this.state.shiny) ? data.sprites.front_shiny : data.sprites.front_default;
                    imagePokemon.classList.add("front");   
                };
            };
            divPokemonImage.appendChild(imagePokemon);
            /// Pokemon types
            divPokemonCard.className = `card-pokemon card-${data.types[0].type.name}`;
            if(data.types[0].type.name === "dark"){
                divPokemonName.classList.add("no-color");
                divPokemonName.classList.remove("black");
                divPokemonHpSpan[0].classList.add("no-color");
                divPokemonHpSpan[0].classList.remove("black");
                divPokemonHpSpan[1].classList.add("no-color");
                divPokemonHpSpan[1].classList.remove("black");
            }else if(!divPokemonName.classList.contains("black")){
                divPokemonName.classList.add("black");
                divPokemonName.classList.remove("no-color");
                divPokemonHpSpan[0].classList.add("black");
                divPokemonHpSpan[0].classList.remove("no-color");
                divPokemonHpSpan[1].classList.add("black");
                divPokemonHpSpan[1].classList.remove("no-color");
            };
            if(data.types.length === 1){
                divPokemonHp.className = "hp-type-one";
                divPokemonTypes.className = "type-one";
            }else{
                divPokemonHp.className = "hp-type-two";
                divPokemonTypes.className = "type-two";
            };
            for(const i in data.types){
                let tempSpan = document.createElement("span");
                let tempImg = document.createElement("img");
                tempSpan.className = `circle pokemon ${data.types[i].type.name}`;
                tempImg.src = `${process.env.PUBLIC_URL}/images/pokemon/${data.types[i].type.name}.svg`;
                tempSpan.appendChild(tempImg);
                divPokemonTypes.prepend(tempSpan);
            };
        }catch(err){
            console.error(err);
        };
    };
    componentDidMount(){
        let inputPokemonSearch = document.getElementById("pokemonsearch-input-search");
        inputPokemonSearch.addEventListener("keydown", this.handleKeyPress);
        let buttonPokemonShiny = document.getElementById("pokemonsearch-button-shiny");
        buttonPokemonShiny.style.opacity = "0.5";    
        this.fetchPokemon("furret");
    };
    componentWillUnmount(){
        const inputPokemonSearch = document.getElementById("pokemonsearch-input-search");
        inputPokemonSearch.removeEventListener("keydown", this.handleKeyPress);
    };
    render(){
        return(
            <Draggable 
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("pokemonsearch")}
                onStop={() => this.props.defaultProps.dragStop("pokemonsearch")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("pokemonsearch", "fun", data.x, data.y)}
                cancel="input, button, .card-pokemon"
                bounds="parent">
                <div id="pokemonsearch-widget"
                    className="widget">
                    <div id="pokemonsearch-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="pokemonsearch-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("pokemonsearch", "resetPosition", "fun")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("pokemonsearch", "fullscreen", "fun")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Pokemon Search */}
                        <div className="flex-center column gap space-nicely bottom">
                            <label className="font medium bold"
                                htmlFor="pokemonsearch-input-search">Search for Pokémon Name or ID:</label>
                            <div className="flex-center row gap">
                                <div className="input-with-button-inside">
                                    {/* Search Field */}
                                    <input id="pokemonsearch-input-search"
                                        className="input-typable"
                                        type="text"
                                        name="pokemonsearch-input-search"
                                        onChange={(e) => this.setState({
                                            input: e.target.value.toLowerCase()
                                        })}/>
                                    {/* Random Button */}
                                    <button className="btn-match inverse"
                                        type="button"
                                        onClick={() => this.handleButton("random")}>
                                        <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                            <FaRandom/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                                {/* Search Button */}
                                <button id="pokemonsearch-button-search" 
                                    className="btn-match option"
                                    type="button"
                                    onClick={() => this.handleButton("search")}>Search</button>
                            </div>
                        </div>
                        {/* Pokemon Information */}
                        <div className="flex-center column gap medium">
                            <div id="pokemonsearch-card-pokemon">
                                {/* Subtype */}
                                <span id="pokemonsearch-span-subtype"
                                    className="font no-color">BASIC</span>
                                {/* Name */}
                                <div id="pokemonsearch-div-name">
                                    <span className="font medium bold black">{this.state.name}</span>
                                </div>
                                {/* Health */}
                                <div id="pokemonsearch-div-hp">
                                    <span className="font micro bold black">HP</span>
                                    <span className="font medium bold black">{this.state.hp}</span>
                                </div>
                                {/* Type */}
                                <div id="pokemonsearch-div-types"></div>
                                {/* Pokemon Image */}
                                <div id="pokemonsearch-div-image"
                                    className="flex-center"></div>
                                {/* Shiny button */}
                                <button id="pokemonsearch-button-shiny" 
                                    className="btn-match inverse"
                                    onClick={() => this.handleButton("shiny")}>
                                    <img src={`${process.env.PUBLIC_URL}/images/pokemon/text/shiny.png`}
                                        alt={"Shiny toggle"}></img>
                                </button>
                                {/* Number, Height, and Weight */}
                                <div id="pokemonsearch-div-data" 
                                    className="flex-center row gap medium font micro">
                                    <span>NO. {this.state.id}</span>
                                    <span>HT: {this.state.height}</span>
                                    <span>WT: {this.state.weight} lbs.</span>
                                </div>
                                {/* Moves */}
                                <div id="pokemonsearch-div-moves"></div>
                                {/* Footer */}
                                <div id="pokemonsearch-div-bottom"
                                    className="flex-center row gap font micro bold">
                                    <div className="flex-center column">
                                        <div>
                                            {/* Weakness */}
                                            <span>weakness</span>
                                            {/* Resistance */}
                                            <span>resistance</span>
                                        </div>
                                        <div>
                                            {/* Retreat */}
                                            <span>retreat</span>
                                        </div>
                                    </div>
                                    {/* Flavortext */}
                                    <div id="pokemonsearch-div-flavortext"
                                        className="font italic"></div>
                                </div>
                            </div>
                            {/* Extra Data */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Base</th>
                                        <th>Stats</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Attack:</td>
                                        <td>{this.state.attack}</td>
                                    </tr>
                                    <tr>
                                        <td>Defense:</td>
                                        <td>{this.state.defense}</td>
                                    </tr>
                                    <tr>
                                        <td>Sp. Attack:</td>
                                        <td>{this.state.specialAttack}</td>
                                    </tr>
                                    <tr>
                                        <td>Sp. Defense:</td>
                                        <td>{this.state.specialDefense}</td>
                                    </tr>
                                    <tr>
                                        <td>Speed:</td>
                                        <td>{this.state.speed}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Kyle</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetPokemonSearch;