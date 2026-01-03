import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { RiBattery2ChargeLine } from 'react-icons/ri';
import Select from 'react-select';
import { batteryInformation, classStack, decorationValue, smallMedIcon } from '../../data';
import { formatGroupLabel, menuListScrollbar } from '../../helpers';

const optionsPhone = [{ label: 'Type', options: [] }];
const optionsPower = [{ label: 'Power Draw', options: [] }];

const WidgetBattery = ({ defaultProps, parentRef }) => {
    const [percentage, setPercentage] = useState(0);
    const [optionPhone, setOptionPhone] = useState({});
    const [optionPower, setOptionPower] = useState({});
    const [lifeHour, setLifeHour] = useState(0);
    const [lifeMinute, setLifeMinute] = useState(0);
    const [charging85, setCharging85] = useState({ hour: 0, minute: 0 });
    const [charging100, setCharging100] = useState({ hour: 0, minute: 0 });
    const [isCharging, setIsCharging] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    const refBattery = useRef(null);
    const refDebounce = useRef(null);
    const refInterval = useRef(null);
    const refTimePerPercentage = useRef(0);
    const refCounter = useRef(0);
    const refIsCharging = useRef(isCharging);

    useEffect(() => {
        optionsPhone[0].options.length = 0;
        optionsPower[0].options.length = 0;

        Object.entries(batteryInformation.power).forEach(([type, data]) => {
            data.examples.forEach((example) => {
                optionsPhone[0].options.push({ value: type, label: example });
            });
        });
        Object.entries(batteryInformation.powerDraw).forEach(([type, number]) => {
            optionsPower[0].options.push({
                value: number,
                label: type.replace(/^./, (char) => char.toUpperCase())
            });
        });

        const storedData = JSON.parse(localStorage.getItem('widgets'))?.utility?.battery;
        const phone =
            storedData?.phone && (Object.keys(storedData.phone).length > 0)
                ? storedData.phone
                : optionsPhone[0].options[0];
        const power =
            storedData?.power && (Object.keys(storedData.power).length > 0)
                ? storedData.power
                : optionsPower[0].options[0];

        setOptionPhone(phone);
        setOptionPower(power);

        window.addEventListener('beforeunload', storeData);

        return () => {
            window.removeEventListener('beforeunload', storeData);
            clearInterval(refInterval.current);
            storeData();
        };
    }, []);

    useEffect(() => {
        refIsCharging.current = isCharging;
    }, [isCharging]);

    useEffect(() => {
        if (!optionPhone?.value || !optionPower?.value) return;

        if (!refInterval.current) {
            calculateTimer(optionPhone, optionPower, percentage, isCharging);
            calculateTimePerPercentage(optionPhone, optionPower);
        };

        handleBatteryLevel(percentage);
    }, [optionPhone, optionPower, percentage, isCharging]);

    const storeData = () => {
        const stored = JSON.parse(localStorage.getItem('widgets') || '{}');
        stored.utility = stored.utility || {};
        stored.utility.battery = { ...stored.utility.battery, phone: optionPhone, power: optionPower };
        localStorage.setItem('widgets', JSON.stringify(stored));
    };

    const handlePercentage = (percentage) => {
        clearInterval(refInterval.current);
        refInterval.current = null;
        const num = Math.max(0, Math.min(100, Number(percentage)));
        setPercentage(num);
    };

    const calculateTimer = (phoneOption, powerOption, percent, charging) => {
        setIsCalculating(true);

        clearTimeout(refDebounce.current);
        refDebounce.current = setTimeout(() => {
            if (charging) {
                calculateCharging(phoneOption, powerOption, percent);
            } else {
                calculateLife(phoneOption, powerOption, percent);
            };

            clearInterval(refInterval.current);

            refInterval.current = setInterval(() => {
                if (refIsCharging.current) {
                    setCharging85((prev) => incrementTime(prev));
                    setCharging100((prev) => incrementTime(prev));
                } else {
                    setLifeMinute((prev) => {
                        if (prev === 0) {
                            setLifeHour((prev) => prev - 1);
                            handleCounter();
                            return 59;
                        };
                        
                        handleCounter();
                        return prev - 1;
                    });
                };
            }, 60000);
        }, 2000);
    };

    const incrementTime = (prev) => {
        let newMinute = prev.minute + 1;
        let newHour = prev.hour;

        if (newMinute === 60) {
            newMinute = 0;
            newHour += 1;
            
            handleCounter();
        };

        return { hour: newHour, minute: newMinute };
    };

    const calculateLife = (phoneOption, powerOption, percent) => {
        const powerData = batteryInformation.power[phoneOption.value];
        const batteryEnergy = powerData.energy;
        const remainingTime = (batteryEnergy * (percent / 100)) / powerOption.value;
        const timeHour = Math.floor(remainingTime);
        const timeMinute = Math.floor((remainingTime - timeHour) * 60);

        setLifeHour(timeHour);
        setLifeMinute(timeMinute);
        setIsCalculating(false);
    };

    const calculateCharging = (phoneOption, powerOption, percent) => {
        const powerData = batteryInformation.power[phoneOption.value];
        const batteryEnergy = powerData.energy;

        const energyNeeded85 = batteryEnergy * 0.85 - batteryEnergy * (percent / 100);
        const energyNeeded100 = batteryEnergy - batteryEnergy * (percent / 100);

        const chargeTime85 = energyNeeded85 / powerOption.value;
        const chargeTime100 = energyNeeded100 / powerOption.value;

        setCharging85({ hour: Math.floor(chargeTime85), minute: Math.floor((chargeTime85 % 1) * 60) });
        setCharging100({ hour: Math.floor(chargeTime100), minute: Math.floor((chargeTime100 % 1) * 60) });
        setIsCalculating(false);
    };

    const handleCounter = () => {
        refCounter.current++;

        if (refCounter.current >= refTimePerPercentage.current) {
            refCounter.current = 0;
            setPercentage((prev) =>
                refIsCharging.current
                    ? Math.min(100, prev + 1)
                    : Math.max(0, prev - 1)
            );
        };
    };

    const handleBatteryLevel = (percentage) => {
        if (!refBattery.current) return;

        const batteryLiquid = refBattery.current;
        const level = Math.max(0, Math.min(100, Math.floor(percentage)));

        batteryLiquid.style.height = `${level}%`;

        if (level === 100) {
            batteryLiquid.style.height = '103%';
        };

        batteryLiquid.classList.remove(
            'gradient-color-red',
            'gradient-color-orange',
            'gradient-color-yellow',
            'gradient-color-green'
        );

        if (level <= 20) {
            batteryLiquid.classList.add('gradient-color-red');
        } else if (level <= 48) {
            batteryLiquid.classList.add('gradient-color-orange');
        } else if (level <= 80) {
            batteryLiquid.classList.add('gradient-color-yellow');
        } else {
            batteryLiquid.classList.add('gradient-color-green');
        };
    };

    const handleSelect = (setter, option) => {
        clearInterval(refInterval.current);
        refInterval.current = null;
        setter(option);
    };

    const handleCheckbox = (setter, value) => {
        clearInterval(refInterval.current);
        refInterval.current = null;
        setter(value);
    };

    const calculateTimePerPercentage = (phoneOption, powerOption) => {
        refCounter.current = 0;

        const powerData = batteryInformation.power[phoneOption.value];
        const batteryEnergy = powerData.energy;
        const totalTime = batteryEnergy / powerOption.value;

        refTimePerPercentage.current = (totalTime * 60) / 100;
    };
    
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('battery')}
            onStop={(event, data) => {
                defaultProps.dragStop('battery');
                defaultProps.updatePosition('battery', 'utility', data.x, data.y);
            }}
            cancel='button, input, label, .select-match, .battery-pet'
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
                    <section className='battery-pet flex-center column gap'>
                        {/* Battery Image */}
                        <div id='battery-pill'>
                            <div id='battery-level'>
                                <div ref={refBattery}
                                    id='battery-liquid'></div>
                            </div>
                        </div>
                        {/* Battery Information */}
                        <div id='battery-information'
                            className='flex-center column float middle'>
                            {(isCharging)
                                ? <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}><RiBattery2ChargeLine/></IconContext.Provider>
                                : <></>}
                            <p id='battery-percentage'
                                className='text-animation font bold black'>{percentage}%</p>
                        </div>
                    </section>
                    {!isCharging
                        ? <section className='line bellow font flex-center row gap small-gap wrap'>
                            <span className='font bold large'>{percentage}%</span>
                            <div className='flex-center row gap'>
                                <span>{lifeHour}h</span>
                                <span>{lifeMinute}m</span>
                            </div>
                        </section>
                        : <section className='line bellow font flex-center column gap'>
                            <section className='flex-center row gap small-gap wrap'>
                                <span className='font bold large'>85%</span>
                                <div className='flex-center row gap'>
                                    <span>{charging85.hour}h</span>
                                    <span>{charging85.minute}m</span>
                                </div>
                            </section>
                            <section className='flex-center row gap small-gap wrap'>
                                <span className='font bold large'>100%</span>
                                <div className='flex-center row gap'>
                                    <span>{charging100.hour}h</span>
                                    <span>{charging100.minute}m</span>
                                </div>
                            </section>
                        </section>}
                    {isCalculating &&
                        <div className='battery-calculating'>
                            <img src='/resources/singles/fumo_speen.gif'
                                alt='fumo spin'
                                draggable={false}/>
                            <img src='/resources/reimu/reimu-calculating.webp'
                                alt='reimu calculating'
                                draggable={false}/>
                        </div>}
                    <section className='flex-center column gap'>
                        <section className='flex-center row gap small-gap fill-width'>
                            <input className='input-match fill-width'
                                placeholder='Percentage (%)'
                                type='number'
                                min={0}
                                max={100}
                                onChange={(event) => handlePercentage(event.target.value)}/>
                            <section className='font element-ends'>
                                <label htmlFor='battery-checkbox-charging'>
                                    Charging
                                </label>
                                <input id='battery-checkbox-charging'
                                    name='battery-checkbox-charging'
                                    type='checkbox'
                                    onChange={(event) => handleCheckbox(setIsCharging, event.target.checked)}
                                    checked={isCharging}/>
                            </section>
                        </section>
                        <section className='flex-center row gap small-gap fill-width'>
                            <Select className='select-match space-nicely space-top length-small'
                                value={optionPhone}
                                onChange={(event) => handleSelect(setOptionPhone, event)}
                                options={optionsPhone}
                                formatGroupLabel={formatGroupLabel}
                                components={{
                                    MenuList: menuListScrollbar
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...parentRef.state.selectTheme
                                    }
                                })}/>
                            <Select className='select-match space-nicely space-top length-small'
                                value={optionPower}
                                onChange={(event) => handleSelect(setOptionPower, event)}
                                options={optionsPower}
                                formatGroupLabel={formatGroupLabel}
                                components={{
                                    MenuList: menuListScrollbar
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...parentRef.state.selectTheme
                                    }
                                })}/>
                        </section>
                    </section>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetBattery);