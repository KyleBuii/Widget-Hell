import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaDroplet, FaLocationDot, FaRegCircleQuestion, FaWind } from 'react-icons/fa6';
import { MdWaves } from 'react-icons/md';
import { WiCloudyGusts } from 'react-icons/wi';


let timeoutTextShadow;

const WidgetWeather = ({ defaultProps, smallIcon }) => {
    const [state, setState] = useState({
        help: false,
        input: '',
        name: '',           /// Location
        region: '',
        localTime: '',
        lastUpdated: '',    /// Current
        tempC: '',
        tempF: '',
        feelsLikeC: '',
        feelsLikeF: '',
        weatherCondition: '',
        weatherIcon: '',
        windMPH: '',
        windKPH: '',
        windDirection: 30,
        humidity: '',
        precipitationMm: 0,
        precipitationIn: 0,
        gustMPH: '',
        gustKPH: '',
        running: false
    });

    const refInput = useRef(state.input);

    refInput.current = state.input;

    useEffect(() => {
        /// If a value exists in session storage, load it
        if (sessionStorage.getItem('weather') !== null) {
            let dataSessionStorage = JSON.parse(sessionStorage.getItem('weather'));
            setState((prevState) => {
                const newState = {
                    ...prevState,
                    input: dataSessionStorage.input
                };
                handleUpdate(newState.input);
                return newState;
            });
        } else {
            setState((prevState) => {
                const newState = {
                    ...prevState,
                    input: 'auto:ip'
                };
                handleUpdate(newState.input);
                return newState;
            });
        };
        return () => {
            let data = {
                'input': refInput.current
            };
            sessionStorage.setItem('weather', JSON.stringify(data));
            clearTimeout(timeoutTextShadow);    
        };
    }, []);

    const handleChange = (event) => {
        setState((prevState) => ({
            ...prevState,
            input: event.target.value
        }));
    };

    const handlePressableButton = (what) => {
        let popoutAnimation = document.getElementById(`weather-${what}-popout-animation`);
        setState((prevState) => ({
            ...prevState,
            [what]: !state[what]
        }));
        defaultProps.showHidePopout(popoutAnimation, !state[what]);
    };

    const handleUpdate = async (location) => {
        if (location !== '') {
            const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': import.meta.env.VITE_WEATHER_API_KEY,
                    'X-RapidAPI-Host': import.meta.env.VITE_WEATHER_API_HOST
                }
            };
            try {
                setState((prevState) => ({
                    ...prevState,
                    running: true
                }));        
                const response = await fetch(url, options);
                const result = await response.json();
                let dateLastUpdated = new Date(result.current.last_updated);
                let dateOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
                setState((prevState) => ({
                    ...prevState,
                    name: result.location.name,
                    region: result.location.region,
                    localTime: result.location.localtime,
                    lastUpdated: dateLastUpdated.toLocaleString('en-US', dateOptions),
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
                }));        
            } catch (err) {
                setState((prevState) => ({
                    ...prevState,
                    input: 'N/A',
                    running: false
                }));        
            } finally {
                setState((prevState) => ({
                    ...prevState,
                    running: false
                }));        
                let elementWeatherLocation = document.getElementById('weather-location');
                let elementWeatherInformation = document.getElementById('weather-information');
                elementWeatherLocation.style.textShadow = '0px 0px 10px var(--randColorLight)';
                elementWeatherInformation.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutTextShadow = setTimeout(() => {
                    elementWeatherLocation.style.textShadow = 'unset';
                    elementWeatherInformation.style.textShadow = 'unset';
                }, 400);
            };
        };
    };
    
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('weather')}
            onStop={(event, data) => {
                defaultProps.dragStop('weather');
                defaultProps.updatePosition('weather', 'utility', data.x, data.y);
            }}
            cancel='button, span, input, .popout'
            bounds='parent'>
            <section id='weather-widget'
                className='widget'
                aria-labelledby='weather-widget-heading'>
                <h2 id='weather-widget-heading'
                    className='screen-reader-only'>Weather Widget</h2>
                <div id='weather-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='weather-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('weather', 'utility')}
                    {/* Search Container */}
                    <div className='flex-center row gap small-gap space-nicely space-bottom'>
                        <div id='weather-search-input'>
                            <input className='input-match'
                                name='weather-input-search'
                                placeholder='Enter location'
                                aria-labelledby='weather-input-aria-describedby'
                                onChange={handleChange}
                                value={state.input}>
                            </input>
                            <span id='weather-input-aria-describedby'
                                className='screen-reader-only'>
                                Type the location here.
                            </span>
                            <button id='weather-search-help-button'
                                className='button-match inverse'
                                aria-label='Help'
                                onClick={() => handlePressableButton('help')}>
                                <IconContext.Provider value={{ size: smallIcon, className: 'global-class-name' }}>
                                    <FaRegCircleQuestion/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        <button className='button-match with-input'
                            onClick={() => handleUpdate(state.input)}
                            disabled={state.running}>
                            Update
                        </button>
                    </div>
                    {/* Search help popout */}
                    <Draggable cancel='li'
                        position={{
                            x: defaultProps.popouts.searchhelp.position.x,
                            y: defaultProps.popouts.searchhelp.position.y
                        }}
                        onStop={(event, data) => defaultProps.updatePosition('weather', 'utility', data.x, data.y, 'popout', 'searchhelp')}
                        bounds={defaultProps.calculateBounds('weather-widget', 'weather-help-popout')}>
                        <div id='weather-help-popout'
                            className='popout'>
                            <div id='weather-help-popout-animation'
                                className='popout-animation'>
                                <ul className='aesthetic-scale scale-li font medium'>
                                    <li>Latitude and Longitude <br/><span className='font small transparent-normal'>e.g: 48.8567,2.3508</span></li>
                                    <li>City name <span className='font small transparent-normal'>e.g.: Paris</span></li>
                                    <li>US zip <span className='font small transparent-normal'>e.g.: 10001</span></li>
                                    <li>UK postcode <span className='font small transparent-normal'>e.g: SW1</span></li>
                                    <li>Canada postal code <span className='font small transparent-normal'>e.g: G2J</span></li>
                                    <li>Metar:&lt;metar code&gt; <span className='font small transparent-normal'>e.g: metar:EGLL</span></li>
                                    <li>Iata:&lt;3 digit airport code&gt; <span className='font small transparent-normal'>e.g: iata:DXB</span></li>
                                    <li>Auto IP lookup <span className='font small transparent-normal'>e.g: auto:ip</span></li>
                                    <li>IP address (IPv4 and IPv6 supported) <br/><span className='font small transparent-normal'>e.g: 100.0.0.1</span></li>
                                </ul>
                            </div>
                        </div>
                    </Draggable>
                    {/* Location */}
                    <div id='weather-location'
                        className='text-animation aesthetic-scale scale-self origin-left flex-center row gap only-align-items'>
                        <IconContext.Provider value={{ className: 'global-class-name', color: 'var(--randColorLight)' }}>
                            <FaLocationDot/>
                        </IconContext.Provider>
                        <span className='font medium bold'>{state.name}, {state.region}</span>
                    </div>
                    {/* Weather Information */}
                    <div id='weather-information'
                        className='aesthetic-scale scale-span flex-center column gap'>
                        {/* Image */}
                        <img className='no-highlight'
                            src={state.weatherIcon}
                            alt='weather icon'
                            style={{ height: defaultProps.largeIcon, width: defaultProps.largeIcon }}
                            loading='lazy'
                            decoding='async'/>
                        {/* Temperature */}
                        <div id='weather-temperature'
                            className='flex-center row gap larger-gap'>
                            <div className='text-animation flex-center column'>
                                <span className='font larger bold'>
                                    <span>{state.tempC}</span>
                                    <span className='font micro text-above'>&deg;C</span>
                                </span>
                                <span className='font small transparent-bold'>{state.feelsLikeC}&deg;C</span>
                            </div>
                            <div className='text-animation flex-center column'>
                                <span className='font larger bold'>
                                    <span>{state.tempF}</span>
                                    <span className='font micro text-above'>&deg;F</span>
                                </span>
                                <span className='font small transparent-bold'>{state.feelsLikeF}&deg;F</span>
                            </div>
                        </div>
                        {/* Condition */}
                        <span id='weather-condition'
                            className='text-animation font medium'>{state.weatherCondition}</span>
                        <div className='flex-center column gap medium-gap'>
                            <div className='flex-center row gap larger-gap'>
                                {/* Humidity */}
                                <div className='text-animation flex-center row gap small-gap'>
                                    <IconContext.Provider value={{ size: '1.8em', className: 'global-class-name', color: 'var(--randColorLight)' }}>
                                        <MdWaves/>
                                    </IconContext.Provider>
                                    <div className='flex-center column only-justify-content'>
                                        <span className='font medium'>{state.humidity}%</span>
                                        <span className='font small'>Humidity</span>
                                    </div>
                                </div>
                                {/* Wind */}
                                <div className='text-animation flex-center row gap small-gap'>
                                    <IconContext.Provider value={{ size: '1.5em', className: 'global-class-name', color: 'var(--randColorLight)' }}>
                                        <FaWind style={{ transform: `rotate(${state.windDirection}deg)` }}/>
                                    </IconContext.Provider>
                                    <div className='flex-center column only-justify-content'>
                                        <span className='font medium'>{state.windKPH}Km/h</span>
                                        <span className='font medium'>{state.windMPH}Mi/h</span>
                                        <span className='font small'>Wind Speed</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-center row gap small-gap'>
                                {/* Percipitation */}
                                <div className='text-animation flex-center row gap small-gap'>
                                    <IconContext.Provider value={{ size: '1.8em', className: 'global-class-name', color: 'var(--randColorLight)' }}>
                                        <FaDroplet/>
                                    </IconContext.Provider>
                                    <div className='flex-center column only-justify-content'>
                                        <span className='font medium'>{state.precipitationMm}mm</span>
                                        <span className='font medium'>{state.precipitationIn}in</span>
                                        <span className='font small'>Precipitation</span>
                                    </div>
                                </div>
                                {/* Gust */}
                                <div className='text-animation flex-center row gap small-gap'>
                                    <IconContext.Provider value={{ size: '2.5em', className: 'global-class-name', color: 'var(--randColorLight)' }}>
                                        <WiCloudyGusts/>
                                    </IconContext.Provider>
                                    <div className='flex-center column only-justify-content'>
                                        <span className='font medium'>{state.gustKPH}Km/h</span>
                                        <span className='font medium'>{state.gustMPH}Mi/h</span>
                                        <span className='font small'>Wind Gust</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Last Updated */}
                    <span className='text-animation font micro transparent-normal'>Last updated: {state.lastUpdated}</span>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetWeather);