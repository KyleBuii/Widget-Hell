import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegCircleQuestion, FaExpand, Fa0, FaWind, FaLocationDot, FaDroplet } from 'react-icons/fa6';
import { MdWaves } from "react-icons/md";
import { WiCloudyGusts } from "react-icons/wi";
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


class WidgetWeather extends Component{
    constructor(props){
        super(props);
        this.state = {
            help: false,
            input: "",
            name: "",           /// Location
            region: "",
            localTime: "",
            lastUpdated: "",    /// Current
            tempC: "",
            tempF: "",
            feelsLikeC: "",
            feelsLikeF: "",
            weatherCondition: "",
            weatherIcon: "",
            windMPH: "",
            windKPH: "",
            windDirection: 30,
            humidity: "",
            precipitationMm: 0,
            precipitationIn: 0,
            gustMPH: "",
            gustKPH: ""
        };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePressableButton = this.handlePressableButton.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    handlePressableButton(what){
        let popoutAnimation = document.getElementById(`weather-${what}-popout-animation`);
        this.setState({
            [what]: !this.state[what]
        });
        this.props.defaultProps.showHidePopout(popoutAnimation, !this.state[what]);
    };
    /// API call
    async handleUpdate(){
        if(this.state.input !== ""){
            const url = "https://weatherapi-com.p.rapidapi.com/current.json?q=" + this.state.input;
            const options = {
                method: "GET",
                headers: {
                    "X-RapidAPI-Key": process.env.REACT_APP_WEATHER_API_KEY,
                    "X-RapidAPI-Host": process.env.REACT_APP_WEATHER_API_HOST
                }
            };
            try{
                const response = await fetch(url, options);
                const result = await response.json();
                this.setState({
                    name: result.location.name,
                    region: result.location.region,
                    localTime: result.location.localtime,
                    lastUpdated: result.current.last_updated,
                    tempC: result.current.temp_c,
                    tempF: result.current.temp_f,
                    feelsLikeC: result.current.feelslike_c,
                    feelsLikeF: result.current.feelslike_f,
                    weatherCondition: result.current.condition.text,
                    weatherIcon: result.current.condition.icon,
                    windMPH: result.current.wind_mph,
                    windKPH: result.current.wind_kph,
                    windDirection: result.current.wind_degree,
                    humidity: result.current.humidity,
                    percipitationMm: result.current.precip_mm,
                    percipitationIn: result.current.precip_in,
                    gustMPH: result.current.gust_mph,
                    gustKPH: result.current.gust_kph
                });
            }catch(err){
                this.setState({
                    input: "N/A"
                });
            };
        };
    };
    componentDidMount(){
        /// If a value exists in session storage, load it
        if(sessionStorage.getItem("weather") !== null){
            let dataSessionStorage = JSON.parse(sessionStorage.getItem("weather"));
            this.setState({
                input: dataSessionStorage.input
            }, () => {
                this.handleUpdate();    
            });
        }else{
            this.setState({
                input: "auto:ip"
            }, () => {
                this.handleUpdate();    
            });
        };
    };
    componentWillUnmount(){
        let data = {
            "input": this.state.input
        };
        sessionStorage.setItem("weather", JSON.stringify(data));
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("weather")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("weather");
                    this.props.defaultProps.updatePosition("weather", "utility", data.x, data.y);
                }}
                cancel="button, span, input, section"
                bounds="parent">
                <div id="weather-widget"
                    className="widget">
                    <div id="weather-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="weather-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("weather", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("weather", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Search */}
                        <div className="flex-center row gap small space-nicely bottom">
                            <div id="weather-search-input">
                                <input className="input-match"
                                    name="weather-input-search"
                                    placeholder="Enter location"
                                    onChange={this.handleChange}
                                    value={this.state.input}>
                                </input>
                                <button id="weather-search-help-button"
                                    className="btn-match inverse"
                                    onClick={() => this.handlePressableButton("help")}>
                                    <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                        <FaRegCircleQuestion/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            <button className="btn-match with-input"
                                onClick={this.handleUpdate}>
                                Update
                            </button>
                        </div>
                        {/* Search help popout */}
                        <Draggable
                            cancel="li"
                            position={{
                                x: this.props.positionPopout.searchhelp.x,
                                y: this.props.positionPopout.searchhelp.y}}
                            onStop={(event, data) => this.props.defaultProps.updatePosition("weather", "utility", data.x, data.y, "popout", "searchhelp")}
                            bounds={{top: -135, left: -325, right: 325, bottom: 350}}>
                            <section id="weather-help-popout"
                                className="popout">
                                <section id="weather-help-popout-animation"
                                    className="popout-animation">
                                    <ul className="font medium">
                                        <li>Latitude and Longitude <br/><span className="font small transparent-normal">e.g: 48.8567,2.3508</span></li>
                                        <li>City name <span className="font small transparent-normal">e.g.: Paris</span></li>
                                        <li>US zip <span className="font small transparent-normal">e.g.: 10001</span></li>
                                        <li>UK postcode <span className="font small transparent-normal">e.g: SW1</span></li>
                                        <li>Canada postal code <span className="font small transparent-normal">e.g: G2J</span></li>
                                        <li>Metar:&lt;metar code&gt; <span className="font small transparent-normal">e.g: metar:EGLL</span></li>
                                        <li>Iata:&lt;3 digit airport code&gt; <span className="font small transparent-normal">e.g: iata:DXB</span></li>
                                        <li>Auto IP lookup <span className="font small transparent-normal">e.g: auto:ip</span></li>
                                        <li>IP address (IPv4 and IPv6 supported) <br/><span className="font small transparent-normal">e.g: 100.0.0.1</span></li>
                                    </ul>
                                </section>
                            </section>
                        </Draggable>
                        {/* Location */}
                        <div className="flex-center row gap only-align-items">
                            <IconContext.Provider value={{ size: "1em", className: "global-class-name", color: "var(--randColorLight)" }}>
                                <FaLocationDot/>
                            </IconContext.Provider>
                            <span className="font medium bold">{this.state.name}, {this.state.region}</span>
                        </div>
                        {/* Weather Information */}
                        <section className="flex-center column gap">
                            {/* Image */}
                            <img className="no-highlight"
                                src={this.state.weatherIcon}
                                alt="weather icon"
                                style={{height: this.props.largeIcon, width: this.props.largeIcon}}></img>
                            {/* Temperature */}
                            <div id="weather-temperature"
                                className="flex-center row gap larger">
                                <div className="flex-center column">
                                    <span className="font larger bold">
                                        <span>{this.state.tempC}</span>
                                        <span className="font micro text-above">&deg;C</span>
                                    </span>
                                    <span className="font small transparent-bold">{this.state.feelsLikeC}&deg;C</span>
                                </div>
                                <div className="flex-center column">
                                    <span className="font larger bold">
                                        <span>{this.state.tempF}</span>
                                        <span className="font micro text-above">&deg;F</span>
                                    </span>
                                    <span className="font small transparent-bold">{this.state.feelsLikeF}&deg;F</span>
                                </div>
                            </div>
                            {/* Condition */}
                            <span id="weather-condition"
                                className="font medium">{this.state.weatherCondition}</span>
                            <div className="flex-center column gap medium">
                                <div className="flex-center row gap larger">
                                    {/* Humidity */}
                                    <div className="flex-center row gap small">
                                        <IconContext.Provider value={{ size: "1.8em", className: "global-class-name", color: "var(--randColorLight)" }}>
                                            <MdWaves/>
                                        </IconContext.Provider>
                                        <div className="flex-center column only-justify-content">
                                            <span className="font medium">{this.state.humidity}%</span>
                                            <span className="font small">Humidity</span>
                                        </div>
                                    </div>
                                    {/* Wind */}
                                    <div className="flex-center row gap small">
                                        <IconContext.Provider value={{ size: "1.5em", className: "global-class-name", color: "var(--randColorLight)" }}>
                                            <FaWind style={{ transform: `rotate(${this.state.windDirection}deg)` }}/>
                                        </IconContext.Provider>
                                        <div className="flex-center column only-justify-content">
                                            <span className="font medium">{this.state.windKPH}Km/h</span>
                                            <span className="font medium">{this.state.windMPH}Mi/h</span>
                                            <span className="font small">Wind Speed</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-center row gap small">
                                    {/* Percipitation */}
                                    <div className="flex-center row gap small">
                                        <IconContext.Provider value={{ size: "1.8em", className: "global-class-name", color: "var(--randColorLight)" }}>
                                            <FaDroplet/>
                                        </IconContext.Provider>
                                        <div className="flex-center column only-justify-content">
                                            <span className="font medium">{this.state.precipitationMm}mm</span>
                                            <span className="font medium">{this.state.precipitationIn}in</span>
                                            <span className="font small">Precipitation</span>
                                        </div>
                                    </div>
                                    {/* Gust */}
                                    <div className="flex-center row gap small">
                                        <IconContext.Provider value={{ size: "2.5em", className: "global-class-name", color: "var(--randColorLight)" }}>
                                            <WiCloudyGusts/>
                                        </IconContext.Provider>
                                        <div className="flex-center column only-justify-content">
                                            <span className="font medium">{this.state.gustKPH}Km/h</span>
                                            <span className="font medium">{this.state.gustMPH}Mi/h</span>
                                            <span className="font small">Wind Gust</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Last Updated */}
                        <span className="font micro transparent-normal">Last updated: {this.state.lastUpdated}</span>
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

export default WidgetWeather;