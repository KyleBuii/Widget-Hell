import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { AiOutlineSetting } from 'react-icons/ai';
import { FaGripHorizontal, FaRandom } from 'react-icons/fa';

const P = new Pokedex.Pokedex();
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const clamp = (value, min = 0, max = 100 ) => {
    return Math.min(Math.max(value, min), max);
};
const adjust = (value, fromMin, fromMax, toMin, toMax) => {
	return round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
};
let springRotate = { x: 0, y: 0 };
let springGlare = { x: 50, y: 50, o: 0 };
let springBackground = { x: 50, y: 50 };
let springRotateDelta = { x: 0, y: 0 };
let timeoutReset;

const WidgetPokemonSearch = ({ defaultProps, microIcon }) => {
    const [state, setState] = useState({
        input: '',
        searched: 'furret',
        name: '',
        id: '',
        weight: '',
        height: '',
        hp: '',
        attack: '',
        defense: '',
        specialAttack: '',
        specialDefense: '',
        speed: '',
        setting: false,
        shiny: false,
        flipped: false,
        previousValue: '',
        running: false
    });
    useEffect(() => {
        let inputPokemonSearch = document.getElementById('pokemonsearch-input-search');
        inputPokemonSearch.addEventListener('keydown', handleKeyPress);
        fetchPokemon('furret');
        showExtraInformation();
        return () => {
            inputPokemonSearch.removeEventListener('keydown', handleKeyPress);
            clearTimeout(timeoutReset);    
        };
    }, []);
    useEffect(() => {
        fetchPokemon(state.searched);
    }, [state.searched, state.shiny, state.flipped]);
    const fetchPokemon = async (what) => {
        try {
            setState((prevState) => ({
                ...prevState,
                running: true
            }));
            const data = await P.getPokemonByName(what);
            let divPokemonCard = document.getElementById('pokemonsearch-card-pokemon');
            let divPokemonName = document.querySelector('#pokemonsearch-div-name span');
            let divPokemonHp = document.getElementById('pokemonsearch-div-hp');
            let divPokemonHpSpan = document.querySelectorAll('#pokemonsearch-div-hp span');
            let divPokemonImage = document.getElementById('pokemonsearch-div-image'); 
            let divPokemonTypes = document.getElementById('pokemonsearch-div-types');
            /// Clear divs
            divPokemonImage.innerHTML = '';
            divPokemonTypes.innerHTML = '';
            setState((prevState) => ({
                ...prevState,
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
            }));
            /// Pokemon image
            let imagePokemon = document.createElement('img');
            imagePokemon.alt = 'Searched pokemon';
            imagePokemon.loading = 'lazy';
            imagePokemon.decoding = 'async';
            if (state.flipped) {
                imagePokemon.src = (state.shiny) ? data.sprites.back_shiny : data.sprites.back_default;
            } else {
                imagePokemon.src = (state.shiny) ? data.sprites.front_shiny : data.sprites.front_default;
            };
            divPokemonImage.appendChild(imagePokemon);
            /// Pokemon types
            divPokemonCard.className = `card-pokemon card-${data.types[0].type.name}`;
            if (data.types[0].type.name === 'dark') {
                divPokemonName.classList.add('no-color');
                divPokemonName.classList.remove('black');
                divPokemonHpSpan[0].classList.add('no-color');
                divPokemonHpSpan[0].classList.remove('black');
                divPokemonHpSpan[1].classList.add('no-color');
                divPokemonHpSpan[1].classList.remove('black');
            } else if (!divPokemonName.classList.contains('black')) {
                divPokemonName.classList.add('black');
                divPokemonName.classList.remove('no-color');
                divPokemonHpSpan[0].classList.add('black');
                divPokemonHpSpan[0].classList.remove('no-color');
                divPokemonHpSpan[1].classList.add('black');
                divPokemonHpSpan[1].classList.remove('no-color');
            };
            if (data.types.length === 1) {
                divPokemonHp.className = 'hp-type-one';
                divPokemonTypes.className = 'type-one';
            } else {
                divPokemonHp.className = 'hp-type-two';
                divPokemonTypes.className = 'type-two';
            };
            for (const i in data.types) {
                let tempSpan = document.createElement('span');
                let tempImg = document.createElement('img');
                tempSpan.className = `circle pokemon ${data.types[i].type.name}`;
                tempImg.alt = 'type';
                tempImg.loading = 'lazy';
                tempImg.decoding = 'async';
                tempImg.src = `/resources/pokemon/type/${data.types[i].type.name}.svg`;
                tempSpan.appendChild(tempImg);
                divPokemonTypes.prepend(tempSpan);
            };
        } catch(err) {
            console.error(err);
            setState((prevState) => ({
                ...prevState,
                running: false
            }));
        } finally {
            setState((prevState) => ({
                ...prevState,
                running: false
            }));
        };
    };
    const handleButton = (what) => {
        switch (what) {
            case 'search': {
                if (state.input !== '') {
                    setState((prevState) => ({
                        ...prevState,
                        searched: state.input
                    }));
                };
                break;
            };
            case 'random': {
                P.getPokemonSpeciesList({
                    limit: 0
                }).then((data) => {
                    setState((prevState) => ({
                        ...prevState,
                        searched: (Math.floor(Math.random() * data.count) + 1).toString()
                    }));
                });
                break;
            };
            case 'setting': {
                let buttonSetting = document.getElementById('pokemonsearch-button-setting');
                let popoutAnimationSetting = document.getElementById('pokemonsearch-popout-animation-setting');
                setState((prevState) => ({
                    ...prevState,
                    setting: !prevState.setting
                }));
                defaultProps.showHidePopout(popoutAnimationSetting, !state.setting, buttonSetting);
                break;
            };
            default: { break; };
        };
    };
    const handleButtonPressable = (what) => {
        const popoutButton = document.getElementById(`pokemonsearch-popout-setting-button-${what}`);
        popoutButton.style.opacity = (state[what] === false) ? '1' : '0.5';
        setState((prevState) => ({
            ...prevState,
            [what]: !prevState[what]
        }));
    };
    const handleRadioPressable = (what) => {
        let currentValue = what.target.value;
        let value = '';
        let cardPokemon = document.getElementById('pokemonsearch-card-pokemon');
        let popoutButton = document.getElementById(`pokemonsearch-popout-setting-button-${currentValue}`);
        if (state.previousValue === currentValue) {
            cardPokemon.setAttribute('rarity', '');
            popoutButton.checked = false;
            value = '';
        } else {
            cardPokemon.setAttribute('rarity', currentValue);
            value = currentValue;
        };
        setState((prevState) => ({
            ...prevState,
            previousValue: value
        }));
        /// Speciifc rarities
        if (currentValue === 'cosmosHolo') {
            const r = document.documentElement;
            let randomSeed = {
                x: Math.random(),
                y: Math.random()
            }
            let cosmosPosition = { 
                x: Math.floor( randomSeed.x * 734 ), 
                y: Math.floor( randomSeed.y * 1280 ) 
            };
            r.style.setProperty('--cosmosbg', `${cosmosPosition.x}px ${cosmosPosition.y}px`);    
        };
    };
    const handleInteract = (e) => {
        const $el = e.target;
        const rect = $el.getBoundingClientRect();
        const absolute = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        const percent = {
            x: clamp(round((100 / rect.width) * absolute.x)),
            y: clamp(round((100 / rect.height) * absolute.y)),
        };
        const center = {
            x: percent.x - 50,
            y: percent.y - 50,
        };
        springBackground = {
            x: adjust(percent.x, 0, 100, 37, 63),
            y: adjust(percent.y, 0, 100, 33, 67)
        };
        springRotate = {
            x: round(-(center.x / 3.5)),
            y: round(center.y / 2),
        };
        springGlare = {
            x: round(percent.x),
            y: round(percent.y),
            o: 1,
        };
        const r = document.documentElement;
        r.style.setProperty('--pointer-x', `${springGlare.x}%`);
        r.style.setProperty('--pointer-y', `${springGlare.y}%`);
        r.style.setProperty('--pointer-from-center', clamp(
            Math.sqrt(
                (springGlare.y - 50) * (springGlare.y - 50) +
                (springGlare.x - 50) * (springGlare.x - 50)
            ) / 50
            , 0
            , 1)
        );
        r.style.setProperty('--pointer-from-top', (springGlare.y / 100));
        r.style.setProperty('--pointer-from-left', (springGlare.x / 100));
        r.style.setProperty('--card-opacity', springGlare.o);
        r.style.setProperty('--rotate-x', `${springRotate.x + springRotateDelta.x}deg`);
        r.style.setProperty('--rotate-y', `${springRotate.y + springRotateDelta.y}deg`);
        r.style.setProperty('--background-x', `${springBackground.x}%`);
        r.style.setProperty('--background-y', `${springBackground.y}%`);
    };
    const handleInteractEnd = (e, delay = 500) => {
        timeoutReset = setTimeout(() => {
            springRotate = { x: 0, y: 0 };
            springGlare = { x: 50, y: 50, o: 0 };
            springBackground = { x: 50, y: 50 };
            const r = document.documentElement;
            r.style.setProperty('--pointer-x', `${springGlare.x}%`);
            r.style.setProperty('--pointer-y', `${springGlare.y}%`);
            r.style.setProperty('--pointer-from-center', clamp(
                Math.sqrt(
                    (springGlare.y - 50) * (springGlare.y - 50) +
                    (springGlare.x - 50) * (springGlare.x - 50)
                ) / 50
                , 0
                , 1)
            );
            r.style.setProperty('--pointer-from-top', (springGlare.y / 100));
            r.style.setProperty('--pointer-from-left', (springGlare.x / 100));
            r.style.setProperty('--card-opacity', springGlare.o);
            r.style.setProperty('--rotate-x', `${springRotate.x + springRotateDelta.x}deg`);
            r.style.setProperty('--rotate-y', `${springRotate.y + springRotateDelta.y}deg`);
            r.style.setProperty('--background-x', `${springBackground.x}%`);
            r.style.setProperty('--background-y', `${springBackground.y}%`);
        }, delay);
    };
    const handleKeyPress = (event) => {
        const buttonPokemonSearch = document.getElementById('pokemonsearch-button-search');
        switch (event.key) {
            case 'Enter':
                if (state.input !== '') {
                    event.preventDefault();
                    buttonPokemonSearch.click();
                };
                break;
            default: break;
        };
    };
    const showExtraInformation = () => {
        const elementExtraInformation = document.getElementById('pokemonsearch-extra-information');
        const buttonExtraInformation = document.getElementById('pokemonsearch-button-extra-information');
        if(elementExtraInformation.checkVisibility({ visibilityProperty: true })){
            buttonExtraInformation.innerText = 'Expand Information';
        }else{
            buttonExtraInformation.innerText = 'Collapse Information';
        };
        elementExtraInformation.classList.toggle('animation-table');
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('pokemonsearch')}
            onStop={(event, data) => {
                defaultProps.dragStop('pokemonsearch');
                defaultProps.updatePosition('pokemonsearch', 'fun', data.x, data.y);
            }}
            cancel='input, button, .card, .popout'
            bounds='parent'>
            <div id='pokemonsearch-widget'
                className='widget'>
                <div id='pokemonsearch-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='pokemonsearch-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('pokemonsearch', 'fun')}
                    {/* Pokemon Search */}
                    <div className='flex-center column gap space-nicely space-bottom length-longer'>
                        <label className='aesthetic-scale scale-self font medium bold'
                            htmlFor='pokemonsearch-input-search'>Search for Pokémon Name or ID:</label>
                        <div className='flex-center row gap wrap'>
                            <div className='input-with-button-inside'>
                                {/* Search Field */}
                                <input id='pokemonsearch-input-search'
                                    className='input-match'
                                    type='text'
                                    name='pokemonsearch-input-search'
                                    onChange={(e) => setState((prevState) => ({
                                        ...prevState,
                                        input: e.target.value.toLowerCase()
                                    }))}/>
                                {/* Random Button */}
                                <button className='button-match inverse'
                                    aria-label='Random pokemon'
                                    type='button'
                                    onClick={() => handleButton('random')}>
                                    <IconContext.Provider value={{ size: microIcon, className: 'global-class-name' }}>
                                        <FaRandom/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            {/* Search Button */}
                            <button id='pokemonsearch-button-search' 
                                className='button-match'
                                type='button'
                                onClick={() => handleButton('search')}
                                disabled={state.running}>Search</button>
                            {/* Setting Button */}
                            <button id='pokemonsearch-button-setting'
                                className='button-match inverse disabled-option space-nicely space-top length-medium'
                                aria-label='Setting'
                                onClick={() => handleButton('setting')}>
                                <IconContext.Provider value={{ size: '1.5em', className: 'global-class-name' }}>
                                    <AiOutlineSetting/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                    {/* Pokemon Information */}
                    <div className='flex-center column'>
                        {/* Pokemon Card */}
                        <div className='card space-nicely space-bottom length-longer'>
                            <div className='card-translater'>
                                <div className='card-rotator flex-center'
                                    onPointerMove={handleInteract}
                                    onMouseOut={handleInteractEnd}>
                                    <div id='pokemonsearch-card-pokemon'>
                                        {/* Subtype */}
                                        <span id='pokemonsearch-span-subtype'
                                            className='font no-color'>BASIC</span>
                                        {/* Name */}
                                        <div id='pokemonsearch-div-name'>
                                            <span className='font medium bold black'>{state.name}</span>
                                        </div>
                                        {/* Health */}
                                        <div id='pokemonsearch-div-hp'>
                                            <span className='font micro bold black'>HP</span>
                                            <span className='font medium bold black'>{state.hp}</span>
                                        </div>
                                        {/* Type */}
                                        <div id='pokemonsearch-div-types'></div>
                                        {/* Pokemon Image */}
                                        <div id='pokemonsearch-div-image'
                                            className='flex-center'></div>
                                        {/* Number, Height, and Weight */}
                                        <div id='pokemonsearch-div-data' 
                                            className='font micro'>
                                            <span>NO. {state.id}</span>
                                            <span>HT: {state.height}</span>
                                            <span>WT: {state.weight} lbs.</span>
                                        </div>
                                        {/* Moves */}
                                        <div id='pokemonsearch-div-moves'></div>
                                        {/* Footer */}
                                        <div id='pokemonsearch-div-bottom'
                                            className='font micro bold'>
                                            <div id='pokemonsearch-div-bottom-weakness'>
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
                                            <div id='pokemonsearch-div-flavortext'
                                                className='font italic'></div>
                                        </div>
                                        <div className='card-shine'></div>
                                        <div className='card-glare'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Extra Information */}
                        <button id='pokemonsearch-button-extra-information'
                            className='button-expand'
                            onClick={() => showExtraInformation()}>Collapse Information</button>
                        <table id='pokemonsearch-extra-information'
                            className='aesthetic-scale scale-table table font'>
                            <thead>
                                <tr>
                                    <th scope='col'>Base</th>
                                    <th scope='col'>Stats</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Attack:</td>
                                    <td className='text-animation'>{state.attack}</td>
                                </tr>
                                <tr>
                                    <td>Defense:</td>
                                    <td className='text-animation'>{state.defense}</td>
                                </tr>
                                <tr>
                                    <td>Sp. Attack:</td>
                                    <td className='text-animation'>{state.specialAttack}</td>
                                </tr>
                                <tr>
                                    <td>Sp. Defense:</td>
                                    <td className='text-animation'>{state.specialDefense}</td>
                                </tr>
                                <tr>
                                    <td>Speed:</td>
                                    <td className='text-animation'>{state.speed}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Settings Popout */}
                    <Draggable cancel='button, .radio-match'
                        position={{
                            x: defaultProps.popouts.settings.position.x,
                            y: defaultProps.popouts.settings.position.y
                        }}
                        onStop={(event, data) => defaultProps.updatePosition('pokemonsearch', 'fun', data.x, data.y, 'popout', 'settings')}
                        bounds={defaultProps.calculateBounds('pokemonsearch-widget', 'pokemonsearch-popout-setting')}>
                        <section id='pokemonsearch-popout-setting'
                            className='popout'>
                            <section id='pokemonsearch-popout-animation-setting'
                                className='popout-animation'>
                                <section className='grid space-nicely space-all length-long font medium'>
                                    <button id='pokemonsearch-popout-setting-button-shiny'
                                        className='button-match option opt-long disabled-option'
                                        onClick={() => handleButtonPressable('shiny')}>Shiny</button>
                                    <button id='pokemonsearch-popout-setting-button-flipped'
                                        className='button-match option opt-long disabled-option'
                                        onClick={() => handleButtonPressable('flipped')}>Flipped</button>
                                    <section className='flex-center row gap'>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-amazingRare'
                                                type='radio'
                                                name='groupRarity'
                                                value='amazingRare'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-amazingRare'>Amazing Rare</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-cosmosHolo'
                                                type='radio'
                                                name='groupRarity'
                                                value='cosmosHolo'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-cosmosHolo'>Cosmos Holo</label>
                                        </div>
                                    </section>
                                    <section className='flex-center row gap'>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-radiantHolo'
                                                type='radio'
                                                name='groupRarity'
                                                value='radiantHolo'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-radiantHolo'>Radiant Holo</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-rainbowAlt'
                                                type='radio'
                                                name='groupRarity'
                                                value='rainbowAlt'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-rainbowAlt'>Rainbow Alt</label>
                                        </div>
                                    </section>
                                    <section className='flex-center row gap'>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-rainbowHolo'
                                                type='radio'
                                                name='groupRarity'
                                                value='rainbowHolo'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-rainbowHolo'>Rainbow Holo</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-regularHolo'
                                                type='radio'
                                                name='groupRarity'
                                                value='regularHolo'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-regularHolo'>Regular Holo</label>
                                        </div>
                                    </section>
                                    <section className='flex-center row gap'>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-reverseHolo'
                                                type='radio'
                                                name='groupRarity'
                                                value='reverseHolo'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-reverseHolo'>Reverse Holo</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-secretRare'
                                                type='radio'
                                                name='groupRarity'
                                                value='secretRare'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-secretRare'>Secret Rare</label>
                                        </div>
                                    </section>
                                    <section className='flex-center row gap'>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-shinyRare'
                                                type='radio'
                                                name='groupRarity'
                                                value='shinyRare'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-shinyRare'>Shiny Rare</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-shinyV'
                                                type='radio'
                                                name='groupRarity'
                                                value='shinyV'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-shinyV'>Shiny V</label>
                                        </div>
                                    </section>
                                    <section className='flex-center row gap'>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-shinyVmax'
                                                type='radio'
                                                name='groupRarity'
                                                value='shinyVmax'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-shinyVmax'>Shiny VMAX</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-vmax'
                                                type='radio'
                                                name='groupRarity'
                                                value='vmax'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-vmax'>VMAX</label>
                                        </div>
                                    </section>
                                    <section className='flex-center row gap'>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-v'
                                                type='radio'
                                                name='groupRarity'
                                                value='v'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-v'>V</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='pokemonsearch-popout-setting-button-vstar'
                                                type='radio'
                                                name='groupRarity'
                                                value='vstar'
                                                onClick={(event) => handleRadioPressable(event)}/>
                                            <label htmlFor='pokemonsearch-popout-setting-button-vstar'>VSTAR</label>
                                        </div>
                                    </section>
                                </section>
                            </section>
                        </section>
                    </Draggable>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetPokemonSearch);