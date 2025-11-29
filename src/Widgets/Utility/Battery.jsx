import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { RiBattery2ChargeLine } from 'react-icons/ri';
import { classStack, decorationValue, smallMedIcon } from '../../data';

const WidgetBattery = ({ defaultProps }) => {
    const [state, setState] = useState({
        percentage: 0,
        charging: false
    });

    useEffect(() => {
        updateBattery();
        navigator.getBattery().then((batteryInformation) => {
            batteryInformation.addEventListener('chargingchange', updateCharging);
            batteryInformation.addEventListener('levelchange', updateBattery);
        });
        return () => {
            navigator.getBattery().then((batteryInformation) => {
                batteryInformation.removeEventListener('chargingchange', updateCharging);
                batteryInformation.removeEventListener('levelchange', updateBattery);
            });    
        };
    }, []);

    const updateBattery = () => {
        let batteryLiquid = document.getElementById('battery-liquid');
        navigator.getBattery().then((batteryInformation) => {
            let level = Math.floor(batteryInformation.level * 100);
            setState((prevState) => ({
                ...prevState,
                percentage: level
            }));
            batteryLiquid.style.height = `${parseInt(level)}%`;
            if (level === 100) {
                batteryLiquid.style.height = '103%';
            };
            if (level <= 20) {
                batteryLiquid.classList.add('gradient-color-red');
                batteryLiquid.classList.remove('gradient-color-green', 'gradient-color-orange', 'gradient-color-yellow');
            } else if (level <= 48) {
                batteryLiquid.classList.add('gradient-color-orange');
                batteryLiquid.classList.remove('gradient-color-green', 'gradient-color-red', 'gradient-color-yellow');
            } else if (level <= 80) {
                batteryLiquid.classList.add('gradient-color-yellow');
                batteryLiquid.classList.remove('gradient-color-green', 'gradient-color-orange', 'gradient-color-red');
            } else {
                batteryLiquid.classList.add('gradient-color-green');
                batteryLiquid.classList.remove('gradient-color-red', 'gradient-color-orange', 'gradient-color-yellow');
            };
        });
    };

    const updateCharging = () => {
        navigator.getBattery().then((batteryInformation) => {
            setState((prevState) => ({
                ...prevState,
                charging: batteryInformation.charging
            }));
        });
    };
    
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('battery')}
            onStop={(event, data) => {
                defaultProps.dragStop('battery');
                defaultProps.updatePosition('battery', 'utility', data.x, data.y);
            }}
            cancel='button'
            bounds='parent'>
            <section id='battery-widget'
                className='widget'
                aria-labelledby='battery-widget-heading'>
                <h2 id='battery-widget-heading'
                    className='screen-reader-only'>Battery Widget</h2>
                <div id='battery-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='battery-widget-draggable'
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
                    {defaultProps.renderHotbar('battery', 'utility')}
                    {/* Battery Image */}
                    <div id='battery-pill'>
                        <div id='battery-level'>
                            <div id='battery-liquid'></div>
                        </div>
                    </div>
                    {/* Battery Information */}
                    <div id='battery-information'
                        className='flex-center column float middle'>
                        {(state.charging)
                            ? <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}><RiBattery2ChargeLine/></IconContext.Provider>
                            : <></>}
                        <p id='battery-percentage'
                            className='text-animation font bold black'>{state.percentage}%</p>
                    </div>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetBattery);