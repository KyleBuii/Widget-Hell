import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa6';
import { TbMoneybag } from 'react-icons/tb';
import { VscDebugBreakpointLogUnverified } from 'react-icons/vsc';
import SimpleBar from 'simplebar-react';


let intervalTimer;
let seenColorsHex = [];
let seenColorsName = [];
let seenColorsImage = [];

const WidgetColorMemory = ({ defaultProps, gameProps, hexToRgb, randomColor }) => {
    const [state, setState] = useState({
        goldEarned: 0,
        timer: 0,
        score: 0,
        color: '',
        name: '',
        image: '',
        started: false,
        gameover: true
    });

    useEffect(() => {
        return () => {
            clearInterval(intervalTimer);
            seenColorsHex.length = 0;
            seenColorsName.length = 0;
            seenColorsImage.length = 0;
        };
    }, []);

    useEffect(() => {
        if (!state.gameover) resetButtons();
    }, [state.gameover]);

    const fetchRandomColor = async () => {
        /// 70% - Seen Color | 30% - New color
        const randomChoice = Math.random();
        if ((randomChoice < 0.7) && (seenColorsHex.length > 1)) {
            let randomSeenColor;
            do {
                randomSeenColor = Math.floor(Math.random() * seenColorsHex.length);
            } while (seenColorsHex[randomSeenColor] === state.color);
            setState((prevState) => ({
                ...prevState,
                color: seenColorsHex[randomSeenColor],
                name: seenColorsName[randomSeenColor],
                image: seenColorsImage[randomSeenColor]
            }));
        } else {
            try {
                const randomColorHex = (Math.random() * 0xFFFFFF << 0)
                    .toString(16)
                    .padStart(6, '0');
                const response = await fetch(`https://www.thecolorapi.com/id?hex=${randomColorHex}`);
                const data = await response.json();
                setState((prevState) => ({
                    ...prevState,
                    color: randomColorHex,
                    name: data.name.value,
                    image: data.image.bare
                }));    
            } catch(err) {
                console.error(err);
            };
        };
    };

    const handleNew = () => {
        if (seenColorsHex.indexOf(state.color) === -1) {
            seenColorsHex.push(state.color);
            seenColorsName.push(state.name);
            seenColorsImage.push(state.image);
            fetchRandomColor();
            setState((prevState) => ({
                ...prevState,
                score: prevState.score + 1
            }));
        } else {
            document.getElementById('colormemory-button-new')
                .classList.add('button-incorrect');
            document.getElementById('colormemory-button-seen')
                .classList.add('button-correct');
            gameover();
        };
    };

    const handleSeen = () => {
        if (seenColorsHex.indexOf(state.color) === -1) {
            document.getElementById('colormemory-button-new')
                .classList.add('button-correct');
            document.getElementById('colormemory-button-seen')
                .classList.add('button-incorrect');
            gameover();
        } else {
            fetchRandomColor();
            setState((prevState) => ({
                ...prevState,
                score: prevState.score + 1
            }));
        };
    };

    const start = () => {
        intervalTimer = setInterval(() => {
            setState((prevState) => ({
                ...prevState,
                timer: prevState.timer + 1
            }));
        }, 1000);
        setState((prevState) => ({
            ...prevState,
            goldEarned: 0,
            timer: 0,
            score: 0,
            started: true,
            gameover: false
        }));
        document.getElementById('colormemory-button-start').style.visibility = 'hidden';
        seenColorsHex = [];
        seenColorsName = [];
        seenColorsImage = [];
        fetchRandomColor();
    };

    const resetButtons = () => {
        const buttonNew = document.getElementById('colormemory-button-new');
        const buttonSeen = document.getElementById('colormemory-button-seen');
        if (buttonNew.classList.contains('button-correct')) {
            buttonNew.classList.remove('button-correct');
            buttonSeen.classList.remove('button-incorrect');
        } else {
            buttonNew.classList.remove('button-incorrect');
            buttonSeen.classList.remove('button-correct');   
        };
    };

    const gameover = () => {
        clearInterval(intervalTimer);
        setState((prevState) => ({
            ...prevState,
            goldEarned: state.score,
            gameover: true
        }));
        document.getElementById('colormemory-button-start').style.visibility = 'visible';
        gameProps.updateGameValue('gold', state.score);
        gameProps.updateGameValue('exp', state.score);
        if (state.score >= 10) {
            let amount = Math.floor(state.score / 10);
            gameProps.randomItem(amount);
        };
    };

    const colorClick = (hex) => {
        let colorRgb = hexToRgb(`#${hex}`);
        randomColor(colorRgb[0], colorRgb[1], colorRgb[2]);
    };

    const handleColorKeyDown = (index, event) => {
        if (event.code.match(/Space|Enter/)) {
            event.preventDefault();
            colorClick(seenColorsHex[index]);
        };
    };
    
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('colormemory')}
            onStop={(event, data) => {
                defaultProps.dragStop('colormemory');
                defaultProps.updatePosition('colormemory', 'games', data.x, data.y);
            }}
            cancel='button, span, .box'
            bounds='parent'>
            <section id='colormemory-widget'
                className='widget'
                aria-labelledby='colormemory-widget-heading'>
                <h2 id='colormemory-widget-heading'
                    className='screen-reader-only'>Color Memory Widget</h2>
                <div id='colormemory-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='colormemory-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('colormemory', 'games')}
                    {/* Information Container */}
                    <div className='aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold'>
                        {/* Score */}
                        <span className='text-animation flex-center row gap'>
                            <IconContext.Provider value={{ size: gameProps.gameIconSize, color: 'green', className: 'global-class-name' }}>
                                <VscDebugBreakpointLogUnverified/>
                            </IconContext.Provider>
                            {state.score}
                        </span>
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
                    <div id='colormemory-image'
                        className='box'
                        style={{
                            backgroundImage: `url(${state.image})`
                        }}>
                        <span id='colormemory-name'
                            className='text-animation font large white float center'>{state.name}</span>
                        <button id='colormemory-button-start'
                            className='float center button-match'
                            onClick={() => start()}>Start</button>
                    </div>
                    {(state.started)
                        ? <div className='grid col-50-50 space-nicely space-top not-bottom length-medium'>
                            <button id='colormemory-button-new'
                                className='button-match'
                                onClick={() => handleNew()}
                                disabled={state.gameover}>New</button>
                            <button id='colormemory-button-seen'
                                className='button-match'
                                onClick={() => handleSeen()}
                                disabled={state.gameover}>Seen</button>
                        </div>
                        : <></>}
                    {(state.gameover)
                        ? <SimpleBar style={{ maxHeight: '13.8em' }}>
                            <div id='colormemory-gameover-colors'
                                className='aesthetic-scale scale-div flex-center space-nicely space-top not-bottom length-medium'
                                role='list'
                                aria-label='Colors'>
                                {seenColorsImage.map((image, index) => {
                                    return <div className='box'
                                        style={{
                                            cursor: 'pointer',
                                            width: '3em',
                                            height: '3em',
                                            backgroundImage: `url(${image})`
                                        }}
                                        key={image}
                                        role='listitem'
                                        aria-label={`${seenColorsName[index]} Color`}
                                        onClick={() => colorClick(seenColorsHex[index])}
                                        onKeyDown={(event) => handleColorKeyDown(index, event)}
                                        tabIndex={0}>
                                        <span className='font micro white float center'
                                            style={{
                                                display: 'block',
                                                position: 'relative',
                                                textAlign: 'center'
                                            }}>{seenColorsName[index]}</span>
                                    </div>
                                })}
                            </div>
                        </SimpleBar>
                        : <></>}
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetColorMemory);