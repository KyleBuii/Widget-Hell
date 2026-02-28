import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { color } from '../..';
import { classStack, decorationValue } from '../../data';

let audioSpin = new Audio('/resources/audio/spin.wav');
let size = 290;
let centerX = 300;
let centerY = 300;
let intervalSpin;
let angleCurrent = 0;
let angleDelta = 0;
let spinStart = 0;
let progress = 0;
let duration = 0;

const WidgetPickerWheel = ({ defaultProps }) => {
    const [state, setState] = useState({
        segments: ['Me', 'I', 'Myself', 'Yours truly', 'Ourself'],
        segmentsColor: ['#EE4040', '#F0CF50', '#815CD1', '#3DA5E0', '#FF9000'],
        winner: '',
        finished: true,
        maxSpeed: 0
    });

    const refState = useRef({
        segments: state.segments,
        segmentsColor: state.segmentsColor
    });

    refState.current = {
        segments: state.segments,
        segmentsColor: state.segmentsColor
    };

    useEffect(() => {
        window.addEventListener('beforeunload', storeData);
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            if (dataLocalStorage['fun']['pickerwheel'].segments !== undefined) {
                setState((prevState) => ({
                    ...prevState,
                    segments: [...dataLocalStorage['fun']['pickerwheel'].segments],
                    segmentsColor: [...dataLocalStorage['fun']['pickerwheel'].segmentsColor]
                }));
            } else {
                draw();
            };
        };

        defaultProps.incrementWidgetCounter();

        return () => {
            window.removeEventListener('beforeunload', storeData);
            storeData();
            clearInterval(intervalSpin);
        };
    }, []);

    useEffect(() => {
        draw();
    }, [color, state.segments]);

    useEffect(() => {
        if(!state.finished){
            duration = 0;
            intervalSpin = setInterval(onTimerTick, state.segments.length);
            spinStart = new Date().getTime();
        }else if(duration > 0){
            clearInterval(intervalSpin);
            intervalSpin = '';
            angleDelta = 0;
            progress = 0;
            document.getElementById('pickerwheel-overlay-winner').style.visibility = 'visible';
        };
    }, [state.finished]);

    const handleClick = (what) => {
        let elementInput = document.getElementById('pickerwheel-input');
        let inputValue = elementInput.value;
        switch (what) {
            case 'add':
                handleAdd(inputValue);
                elementInput.value = '';
                break;
            case 'remove':
                if (inputValue !== '') {
                    let indexRemove = state.segments.findIndex((item) => item.toLowerCase() === inputValue.toLowerCase());
                    if (indexRemove > -1) {
                        setState((prevState) => ({
                            ...prevState,
                            segments: [...state.segments.slice(0, indexRemove), ...state.segments.slice(indexRemove + 1, state.segments.length)],
                            segmentsColor: [...state.segmentsColor.slice(0, indexRemove), ...state.segmentsColor.slice(indexRemove + 1, state.segmentsColor.length)]
                        }));
                    };
                };
                break;
            case 'removeAll':
                if (state.segments.length) {
                    setState((prevState) => ({
                        ...prevState,
                        segments: [],
                        segmentsColor: []
                    }));
                };
                break;
            default: break;
        };
    };

    const handleKeyDown = (key) => {
        let elementInput = document.getElementById('pickerwheel-input');
        if (key === 'Enter') {
            handleAdd(elementInput.value);
            elementInput.value = '';
        };
    };

    const handleAdd = (value) => {
        if (value !== '') {
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);
            setState((prevState) => ({
                ...prevState,
                segments: [...state.segments, value],
                segmentsColor: [...state.segmentsColor, `#${randomColor}`]
            }));
        };
    };

    const handleOverlay = () => {
        document.getElementById('pickerwheel-overlay-winner').style.visibility = 'hidden';
    };

    const spin = () => {
        if (!intervalSpin && state.segments.length) {
            defaultProps.playAudio(audioSpin);
            setState((prevState) => ({
                ...prevState,
                finished: false,
                maxSpeed: Math.PI / state.segments.length
            }));
        };
    };

    const onTimerTick = () => {
        let upDuration = state.segments.length * 500;
        let downDuration = state.segments.length * 700;
        draw();
        duration = new Date().getTime() - spinStart;
        if (duration < upDuration) {
            progress = duration / upDuration;
            angleDelta = state.maxSpeed * Math.sin((progress * Math.PI) / 2);
        } else {
            progress = duration / downDuration;
            if (progress >= 0.8) {
                angleDelta = (state.maxSpeed / 2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            } else if(progress >= 0.6) {
                angleDelta = (state.maxSpeed / 1.2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            } else {
                angleDelta = state.maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            };
            if (progress >= 1) {
                setState((prevState) => ({
                    ...prevState,
                    finished: true
                }));
            };
        };
        angleCurrent += angleDelta;
        while (angleCurrent >= Math.PI * 2) {
            angleCurrent -= Math.PI * 2;
        };
    };

    const draw = () => {
        let canvas = document.getElementById('pickerwheel-canvas-wheel');
        let ctx = canvas.getContext('2d');
        let change = angleCurrent + Math.PI / 2;
        let i = state.segments.length - Math.floor((change / (Math.PI * 2)) * state.segments.length) - 1;
        let lastAngle = angleCurrent;
        let len = state.segments.length;
        const PI2 = Math.PI * 2;
        if (i < 0) {
            i = i + state.segments.length;
        };
        if (len === 0) {
            ctx.clearRect(0, 0, 600, 600);
        };
        setState((prevState) => ({
            ...prevState,
            winner: state.segments[i]
        }));
        //#region Wheel style
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '1em proxima-nova';
        //#endregion
        //#region Draw segments
        for (let i = 1; i <= len; i++) {
            const angle = PI2 * (i / len) + angleCurrent;
            const value = state.segments[i - 1];
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, size, lastAngle, angle, false);
            ctx.lineTo(centerX, centerY);
            ctx.closePath();
            ctx.fillStyle = state.segmentsColor[i - 1];
            ctx.fill();
            ctx.stroke();
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((lastAngle + angle) / 2);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 1.4em proxima-nova';
            ctx.fillText(value.substring(0, 21), size / 2 + 20, 0);
            ctx.restore();    
            lastAngle = angle;
        };
        //#endregion
        //#region Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, PI2, false);
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.fill();
        ctx.font = 'bold 2em proxima-nova';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText('Spin', centerX, centerY + 3);
        ctx.stroke();
        //#endregion
        //#region Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, PI2, false);
        ctx.closePath();
        ctx.lineWidth = 20;
        ctx.strokeStyle = color;
        ctx.stroke();
        //#endregion
        //#region Draw needle
        ctx.beginPath();
        ctx.moveTo(centerX + 10, centerY - 40);
        ctx.lineTo(centerX - 10, centerY - 40);
        ctx.lineTo(centerX, centerY - 60);
        ctx.closePath();
        ctx.fill();
        //#endregion
    };

    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['fun']['pickerwheel'] = {
                ...dataLocalStorage['fun']['pickerwheel'],
                segments: [...refState.current.segments],
                segmentsColor: [...refState.current.segmentsColor]
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };

    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('pickerwheel')}
            onStop={(event, data) => {
                defaultProps.dragStop('pickerwheel');
                defaultProps.updatePosition('pickerwheel', 'fun', data.x, data.y);
            }}
            cancel='button, span, input'
            bounds='parent'>
            <section id='pickerwheel-widget'
                className='widget'
                aria-labelledby='pickerwheel-widget-heading'>
                <h2 id='pickerwheel-widget-heading'
                    className='screen-reader-only'>Picker Wheel Widget</h2>
                <div id='pickerwheel-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='pickerwheel-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    <img className={`decoration ${decorationValue}`}
                        src={`/resources/decoration/${decorationValue}.webp`}
                        alt={decorationValue}
                        key={decorationValue}
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                        loading='lazy'
                        decoding='async'/>
                    {defaultProps.renderHotbar('pickerwheel', 'fun')}
                    {/* Input */}
                    <div className='flex-center wrap row gap space-nicely space-bottom length-longer'>
                        <input id='pickerwheel-input'
                            className='input-match'
                            placeholder='Type a choice here'
                            aria-describedby='pickerwheel-input-aria-describedby'
                            onKeyDown={(event) => handleKeyDown(event.key)}/>
                        <span id='pickerwheel-input-aria-describedby'
                            className='screen-reader-only'>
                            Type a choice here.
                        </span>
                        <button className='button-match with-input'
                            onClick={() => handleClick('add')}
                            disabled={!state.finished}>Add</button>
                        <button className='button-match with-input'
                            onClick={() => handleClick('remove')}
                            disabled={!state.finished}>Remove</button>
                        <button className='button-match with-input'
                            onClick={() => handleClick('removeAll')}
                            disabled={!state.finished}>Remove All</button>
                    </div>
                    {/* Wheel */}
                    <canvas id='pickerwheel-canvas-wheel'
                        width={'600'}
                        height={'600'}/>
                    {/* Invisible Spin Button */}
                    <button id='pickerwheel-button-spin'
                        aria-label='Invisible spin'
                        onClick={spin}></button>
                    {/* Winner Overlay */}
                    <div id='pickerwheel-overlay-winner'
                        className='overlay rounded flex-center'>
                        <span className='text-animation aesthetic-scale scale-self font largerer bold break-word'
                           onClick={handleOverlay}>{state.winner}</span>
                    </div>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetPickerWheel);