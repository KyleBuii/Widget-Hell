import Slider from 'rc-slider';
import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa6';
import { TbMoneybag } from 'react-icons/tb';


let colors = {
    1: { current: '#3edd4b', new: '#116017' },
    2: { current: '#dd4b3e', new: '#601711' },
    3: { current: '#ffea37', new: '#7c6f00' },
    4: { current: '#4b3edd', new: '#171160' }
};
let colorsPath = [];
let intervalTimer;
let timeoutDelay;

const WidgetSimonGame = ({ defaultProps, gameProps }) => {
    const [state, setState] = useState({
        goldEarned: 0,
        timer: 0,
        score: 0,
        highscore: 0,
        counter: 0,
        clickCounter: -1,
        pathGenerating: false,
        gameover: false,
        settings: false,
        speed: 600,
        maxHealth: 1,
        health: 1
    });
    const refState = useRef({
        highscore: state.highscore,
        speed: state.speed
    });
    useEffect(() => {
        document.getElementById('simongame-overlay-gameover').style.visibility = 'visible';
        window.addEventListener('beforeunload', storeData);
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let localStorageSimonGame = dataLocalStorage['games']['simongame'];
            if (localStorageSimonGame['highscore'] !== undefined) {
                setState((prevState) => ({
                    ...prevState,
                    highscore: localStorageSimonGame['highscore'],
                    speed: localStorageSimonGame['speed']
                }));    
            };
        };
        let calculateMaxHealth = calculateHealth();
        setState((prevState) => ({
            ...prevState,
            maxHealth: calculateMaxHealth,
            health: calculateMaxHealth
        }));
        return () => {
            window.removeEventListener('beforeunload', storeData);
            storeData();
            clearInterval(intervalTimer);
            clearTimeout(timeoutDelay);    
        };
    }, []);
    useEffect(() => {
        refState.current = {
            highscore: state.highscore,
            speed: state.speed    
        };
    }, [state.highscore, state.speed]);
    useEffect(() => {
        if(state.clickCounter === state.score){
            setState((prevState) => ({
                ...prevState,
                clickCounter: 0
            }));    
            randomPath();
        };
    }, [state.clickCounter]);
    useEffect(() => {
        if (state.health <= 0) gameover();
    }, [state.health]);
    const delay = async (time) => {
        return await new Promise((resolve) => {
            timeoutDelay = setTimeout(resolve, time)
        });
    };
    const randomPath = async () => {
        colorsPath.push(randomColor());
        setState((prevState) => ({
            ...prevState,
            score: colorsPath.length,
            pathGenerating: true
        }));
        await showPath(colorsPath);
    };
    const showPath = async (path) => {
        for (let color of path) {
            let currentColor = document.getElementById(`simongame-color-${color}`);
            await delay(500);
            currentColor.style.backgroundColor = colors[color].new;
            await delay(state.speed);
            currentColor.style.backgroundColor = colors[color].current;
        };
        setState((prevState) => ({
            ...prevState,
            pathGenerating: false
        }));
    };
    const handleColorClick = async (event) => {
        if (state.pathGenerating) return false;
        if (event.target.id === `simongame-color-${colorsPath[state.clickCounter]}`) {
            event.target.style.backgroundColor = colors[colorsPath[state.clickCounter]].new;
            await delay(100);
            event.target.style.backgroundColor = colors[colorsPath[state.clickCounter]].current;
            setState((prevState) => ({
                ...prevState,
                goldEarned: prevState.goldEarned + 1,
                clickCounter: prevState.clickCounter + 1
            }));    
        } else {
            setState((prevState) => ({
                ...prevState,
                health: prevState.health - 1
            }));    
        };
    };
    const handleColorKeyDown = (event) => {
        if (event.code.match(/Space|Enter/)) {
            event.preventDefault();
            handleColorClick(event);
        };
    };
    const handlePressableButton = () => {
        const buttonSettings = document.getElementById('simongame-button-settings');
        const popoutSettings = document.getElementById('simongame-popout-settings');
        if (state.settings === false) {
            setState((prevState) => ({
                ...prevState,
                settings: true
            }));
            buttonSettings.style.opacity = '1';
            popoutSettings.style.visibility = 'visible';
        } else {
            setState((prevState) => ({
                ...prevState,
                settings: false
            }));
            buttonSettings.style.opacity = '0.5';
            popoutSettings.style.visibility = 'hidden';
        };
    };
    const handleSetting = (what, action, value) => {
        switch (what) {
            case 'speed':
                switch (action) {
                    case 'reset':
                        setState((prevState) => ({
                            ...prevState,
                            speed: 600
                        }));            
                        break;
                    case 'change':
                        setState((prevState) => ({
                            ...prevState,
                            speed: value
                        }));            
                        break;
                    default: break;
                };
                break;
            default: break;
        };
    };
    const randomColor = () => {
        let colorsKeys = Object.keys(colors);
        return colorsKeys[Math.floor(Math.random() * colorsKeys.length)];
    };
    const start = () => {
        if (state.settings === true) {
            setState((prevState) => ({
                ...prevState,
                settings: false
            }));    
            document.getElementById('simongame-button-settings').style.opacity = '0.5';
            document.getElementById('simongame-popout-settings').style.visibility = 'hidden';
        };
        document.getElementById('simongame-overlay-gameover').style.visibility = 'hidden';
        setState((prevState) => ({
            ...prevState,
            goldEarned: 0,
            timer: 0,
            score: 0,
            clickCounter: 0,
            pathGenerating: false,
            gameover: false,
            health: state.maxHealth
        }));
        colorsPath = [];
        randomPath();
        intervalTimer = setInterval(() => {
            setState((prevState) => ({
                ...prevState,
                timer: prevState.timer + 1
            }));    
        }, 1000);
    };
    const gameover = () => {
        clearInterval(intervalTimer);
        if (state.score >= 7) {
            let amount = Math.floor(state.score / 7);
            gameProps.randomItem(amount);
        };
        gameProps.updateGameValue('gold', state.goldEarned);
        gameProps.updateGameValue('exp', state.goldEarned);
        setState((prevState) => ({
            ...prevState,
            highscore: (state.highscore > state.score)
                ? state.highscore
                : state.score,
            gameover: true
        }));
        document.getElementById('simongame-overlay-gameover').style.visibility = 'visible';
    };
    const calculateHealth = () => {
        if (gameProps.stats.health < 10) {
            return 1;
        } else {
            return Math.floor(gameProps.stats.health / 10);
        };
    };
    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['games']['simongame'] = {
                ...dataLocalStorage['games']['simongame'],
                highscore: refState.current.highscore,
                speed: refState.current.speed
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('simongame')}
            onStop={(event, data) => {
                defaultProps.dragStop('simongame');
                defaultProps.updatePosition('simongame', 'games', data.x, data.y);
            }}
            cancel='button, span, #simongame-container, #simongame-counter-light, .popout'
            bounds='parent'>
            <section id='simongame-widget'
                className='widget'
                aria-labelledby='simongame-widget-heading'>
                <h2 id='simongame-widget-heading'
                    className='screen-reader-only'>Simon Game Widget</h2>
                <div id='simongame-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='simongame-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('simongame', 'games')}
                    {/* Information Container */}
                    <div className='aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold'
                        style={{zIndex: 300}}>
                        {/* Gold Earned */}
                        <span className='text-animation flex-center row'>
                            <IconContext.Provider value={{ size: gameProps.gameIconSize, color: '#f9d700', className: 'global-class-name' }}>
                                <TbMoneybag/>
                            </IconContext.Provider>
                            <span className='font small bold'>+</span>
                            {state.goldEarned}
                        </span>
                        {/* Total Gold */}
                        <span className='text-animation flex-center row'>
                            <IconContext.Provider value={{ size: gameProps.gameIconSize, color: '#f9d700', className: 'global-class-name' }}>
                                <TbMoneybag/>
                            </IconContext.Provider>
                            {gameProps.formatNumber(gameProps.gold, 1)}
                        </span>
                        {/* Timer */}
                        <span className='text-animation flex-center row gap'>
                            <IconContext.Provider value={{ size: gameProps.gameIconSize, className: 'global-class-name' }}>
                                <FaRegClock/>
                            </IconContext.Provider>
                            {state.timer}
                        </span>
                    </div>
                    {/* Game Container */}
                    <div id='simongame-container'
                        className='grid col-auto box'>
                        <div id='simongame-color-1'
                            className='box'
                            onClick={(event) => handleColorClick(event)}
                            onKeyDown={(event) => handleColorKeyDown(event)}
                            tabIndex={0}></div>
                        <div id='simongame-color-2'
                            className='box'
                            onClick={(event) => handleColorClick(event)}
                            onKeyDown={(event) => handleColorKeyDown(event)}
                            tabIndex={0}></div>
                        <div id='simongame-color-3'
                            className='box'
                            onClick={(event) => handleColorClick(event)}
                            onKeyDown={(event) => handleColorKeyDown(event)}
                            tabIndex={0}></div>
                        <div id='simongame-color-4'
                            className='box'
                            onClick={(event) => handleColorClick(event)}
                            onKeyDown={(event) => handleColorKeyDown(event)}
                            tabIndex={0}></div>
                    </div>
                    {/* Counter and Light Indicator */}
                    <div id='simongame-counter-light'
                        className='float center font large bold circle'>
                        <span className='float center circle'
                            style={{
                                backgroundColor: (state.pathGenerating) ? 'red' : 'green'
                            }}></span>
                        <span className='aesthetic-scale scale-self float center'>{state.score}</span>
                    </div>
                    {/* Hearts */}
                    {(gameProps.healthDisplay !== 'none')
                        ? <div id='simongame-health'
                            className='flex-center space-nicely space-top not-bottom'>
                            {gameProps.renderHearts(state.health).map((heart) => {
                                return heart;
                            })}
                        </div>
                        : <></>}
                    {/* Gameover Overlay */}
                    <div id='simongame-overlay-gameover'
                        className='aesthetic-scale scale-span overlay rounded flex-center column gap'>
                        {(state.gameover)
                            ? <div className='flex-center column gap'>
                                <span className='font large bold'>GAME OVER!</span>
                                <span className='font medium'>Score: {state.score}</span>
                                <span className='font medium space-nicely space-bottom'>Highscore: {state.highscore}</span>
                            </div>
                            : <></>}
                        <button className='button-match' 
                            type='button'
                            onClick={() => start()}>Start Game</button>
                        <button id='simongame-button-settings'
                            className='button-match inverse disabled-option space-nicely space-top length-medium'
                            aria-label='Setting'
                            onClick={() => handlePressableButton()}>
                            <IconContext.Provider value={{ size: '1.5em', className: 'global-class-name' }}>
                                <AiOutlineSetting/>
                            </IconContext.Provider>
                        </button>
                    </div>
                    {/* Settings Popout */}
                    <Draggable cancel='span, .slider, button'
                        position={{
                            x: defaultProps.popouts.settings.position.x,
                            y: defaultProps.popouts.settings.position.y
                        }}
                        onStop={(event, data) => {
                            defaultProps.updatePosition('simongame', 'games', data.x, data.y, 'popout', 'settings');
                        }}
                        bounds={defaultProps.calculateBounds('simongame-widget', 'simongame-popout-settings')}>
                        <div id='simongame-popout-settings'
                            className='popout'>
                            <div id='simongame-popout-animation-settings'
                                className='popout-animation'>
                                <div className='aesthetic-scale scale-span font large-medium flex-center column gap space-nicely space-all'>
                                    <div className='div-group'>
                                        <span className='font small when-elements-are-not-straight space-nicely space-bottom length-short'>
                                            <b>Gameplay</b>
                                        </span>
                                        <div className='element-ends'>
                                            <span className='font small'>
                                                Speed
                                            </span>
                                            <button className='button-match inverse when-elements-are-not-straight'
                                                aria-label='Speed reset'
                                                onClick={() => handleSetting('speed', 'reset')}>
                                                <IconContext.Provider value={{ className: 'global-class-name' }}>
                                                    <BsArrowCounterclockwise/>
                                                </IconContext.Provider>
                                            </button>
                                        </div>
                                        <Slider className='slider space-nicely space-top length-medium'
                                            onChange={(event) => handleSetting('speed', 'change', event)}
                                            value={state.speed}
                                            min={1}
                                            max={1000}
                                            marks={{
                                                600: {
                                                    label: 600,
                                                    style: {display: 'none' }
                                                }
                                            }}
                                            defaultValue={600}
                                            reverse/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetSimonGame);