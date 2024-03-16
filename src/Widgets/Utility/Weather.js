import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegCircleQuestion, FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


class WidgetWeather extends Component{
    constructor(props){
        super(props);
        this.state = {
            helpShow: false,
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
            windKPH: ""
        };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleHelp = this.handleHelp.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    handleHelp(){
        if(this.state.helpShow === false){
            this.setState({
                helpShow: true
            });
            document.getElementById("weather-search-help-container").style.visibility = "visible";
        }else{
            this.setState({
                helpShow: false
            });
            document.getElementById("weather-search-help-container").style.visibility = "hidden";
        };
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
                    windKPH: result.current.wind_kph
                });
            }catch(err){
                this.setState({
                    input: "N/A"
                });
            };
        };
    };
    componentDidMount(){
        /// Default input
        if(sessionStorage.getItem("weather") === null){
            this.setState({
                input: "auto:ip"
            }, () => {
                this.handleUpdate();   
            });
        }else{
            let dataSessionStorage = JSON.parse(sessionStorage.getItem("weather"));
            this.setState({
                input: dataSessionStorage.input
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
                onStop={() => this.props.defaultProps.dragStop("weather")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("weather", "utility", data.x, data.y)}
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
                            {(this.props.defaultProps.hotbar.resetposition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("weather", "resetposition", "utility")}>
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
                        {/* Search bar */}
                        <div id="weather-search-container"
                            className="flex-center gap">
                            <div className="when-elements-are-not-straight">
                                <input className="input-typable right-side with-help-btn"
                                    placeholder="Enter location"
                                    onChange={this.handleChange}
                                    value={this.state.input}>
                                </input>
                                <button className="help-btn left-side when-elements-are-not-straight"
                                    onClick={this.handleHelp}>
                                    <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                        <FaRegCircleQuestion/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            {/* Search help popout */}
                            <Draggable
                                cancel="li"
                                position={{
                                    x: this.props.positionPopout.searchhelp.x,
                                    y: this.props.positionPopout.searchhelp.y}}
                                onDrag={(event, data) => this.props.defaultProps.updatePosition("weather", "utility", data.x, data.y, "popout", "searchhelp")}
                                bounds={{top: -135, left: -325, right: 325, bottom: 350}}>
                                <section id="weather-search-help-container"
                                    className="popout">
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
                            </Draggable>
                            <button className="btn-match"
                                onClick={this.handleUpdate}>
                                Update
                            </button>
                        </div>
                        {/* Information box */}
                        <section id="weather-info-container"
                            className="flex-center column only-flex">
                            <div id="weather-info-icon-temp">
                                <img className="no-highlight"
                                    src={this.state.weatherIcon}
                                    alt="weather-icon"
                                    style={{height: this.props.medIcon, width: this.props.medIcon}}></img>
                                <div id="weather-info-temp-c-container">
                                    <span id="weather-info-temp-c"
                                        className="font large">
                                        <b>{this.state.tempC}&deg;C</b>
                                    </span>
                                    <span className="font small transparent-bold flex-center">{this.state.feelsLikeC}&deg;C</span>
                                </div>
                                <div id="weather-info-temp-f-container">
                                    <span id="weather-info-temp-f"
                                        className="font large">
                                        <b>{this.state.tempF}&deg;F</b>
                                    </span>
                                    <span className="font small transparent-bold flex-center">{this.state.feelsLikeF}&deg;F</span>
                                </div>
                            </div>
                            <div id="weather-info-cond-local-time"
                                className="font medium normal">
                                <span>{this.state.weatherCondition}</span>
                                <span>{this.state.localTime}</span>
                            </div>
                            <div id="weather-info-wind"
                                className="font medium normal">
                                <span>Wind:</span>
                                <span>{this.state.windKPH} KPH</span>
                                <span>{this.state.windMPH} MPH</span>
                            </div>
                            <div id="weather-info-location"
                                className="font small normal">
                                <span>{this.state.name}, {this.state.region}</span>
                            </div>
                        </section>
                        <span id="weather-last-updated"
                            className="font small normal">Last updated: {this.state.lastUpdated}</span>
                        {/* Author */}
                        {(this.props.defaultProps.values.authornames)
                            ? <span className="font smaller transparent-normal author-name">Created by Kyle</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetWeather;