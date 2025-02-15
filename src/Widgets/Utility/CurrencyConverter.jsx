import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { BsArrowLeftRight } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import Select from 'react-select';


const optionsMoneyConversion = [
    {
        label: 'Currency',
        options: []
    }
];
let timeoutTextShadow;

const WidgetCurrencyConverter = ({ defaultProps, moneyConversions, formatGroupLabel, selectTheme, menuListScrollbar, randomColor }) => {
    const [state, setState] = useState({
        input: 1,
        from: { value: 'US', label: 'USD' },
        to: { value: 'US', label: 'USD' },
        rate: '?',
        result: '?',
        running: false
    });
    const refState = useRef({
        from: state.from,
        to: state.to
    });
    useEffect(() => {
        if (sessionStorage.getItem('currencyconverter') !== null) {
            let dataSessionStorage = JSON.parse(sessionStorage.getItem('currencyconverter'));
            setState((prevState) => ({
                ...prevState,
                from: dataSessionStorage.from,
                to: dataSessionStorage.to
            }));
        };
        /// Populate options
        for (let i = 0; i < moneyConversions.length; i+=2) {
            optionsMoneyConversion[0]['options'].push({
                value: moneyConversions[i + 1],
                label: moneyConversions[i]
            });
        };
        return () => {
            sessionStorage.setItem('currencyconverter', JSON.stringify({
                from: refState.current.from,
                to: refState.current.to
            }));
            clearTimeout(timeoutTextShadow);    
        };
    }, []);
    useEffect(() => {
        refState.current = {
            from: state.from,
            to: state.to    
        };
    }, [state.from, state.to]);
    const fetchExchangeRate = async () => {
        if (state.from.value !== state.to.value
            && /^\d*\.?\d*$/.test(state.input)) {
            try {
                setState((prevState) => ({
                    ...prevState,
                    running: true
                }));    
                const url = `/api/currencyConverter?translateFrom=${refState.current.from.label}`;
                const response = await fetch(url);
                const result = await response.json();
                const exchangeRate = result.conversion_rates[refState.current.to.label];
                const calculateExchangeRate = (state.input * exchangeRate).toFixed(2);
                setState((prevState) => ({
                    ...prevState,
                    result: calculateExchangeRate,
                    rate: exchangeRate
                }));    
            } catch (err) {
                setState((prevState) => ({
                    ...prevState,
                    result: '?',
                    rate: '?',
                    running: false
                }));    
            } finally {
                setState((prevState) => ({
                    ...prevState,
                    running: false
                }));    
                let elementConvertedCurrency = document.getElementById('currencyconverter-result');
                elementConvertedCurrency.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutTextShadow = setTimeout(() => {
                    elementConvertedCurrency.style.textShadow = 'unset';
                }, 400);
            };
        } else {
            setState((prevState) => ({
                ...prevState,
                result: state.input,
                rate: state.input
            }));
        };
    };
    const handleInput = (event) => {
        if (event.target.value !== 'e') {
            setState((prevState) => ({
                ...prevState,
                input: event.target.value,
                rate: (state.rate !== '?') ? '?' : state.rate,
                result: (state.result !== '?') ? '?' : state.result
            }));
        };
    };
    const handleSwap = () => {
        if (state.from.value !== state.to.value) {
            randomColor();
            const prev = state.from;
            setState((prevState) => ({
                ...prevState,
                from: prevState.to,
                to: prev,
                rate: (state.rate !== '?') ? '?' : state.rate,
                result: (state.result !== '?') ? '?' : state.result
            }));
        };
    };
    const handleSelect = (what, event) => {
        setState((prevState) => ({
            ...prevState,
            [what]: event,
            rate: (state.rate !== '?') ? '?' : state.rate,
            result: (state.result !== '?') ? '?' : state.result
        }));
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('currencyconverter')}
            onStop={(event, data) => {
                defaultProps.dragStop('currencyconverter');
                defaultProps.updatePosition('currencyconverter', 'utility', data.x, data.y);
            }}
            cancel='button, input, span, .select-match'
            bounds='parent'>
            <div id='currencyconverter-widget'
                className='widget'>
                <div id='currencyconverter-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='currencyconverter-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('currencyconverter', 'utility')}
                    {/* Currency Converter Container */}
                    <section id='currencyconverter-container'
                        className='flex-center column gap small-gap'>
                        <div id='currencyconverter-result'
                            className='aesthetic-scale scale-span flex-center column fill-width'>
                            <span className='text-animation font large'>{state.input} {state.from.label} = {state.result} {state.to.label}</span>
                            <span className='font micro transparent-normal'>1 {state.from.label} = {state.rate} {state.to.label}</span>
                        </div>
                        <input className='input-match fill-width'
                            type='number'
                            name='currencyconverter-input'
                            onChange={handleInput}
                            value={state.input}/>
                        <div className='flex-center row gap'>
                            <Select id='currencyconverter-select-from'
                                className='select-match'
                                value={state.from}
                                defaultValue={optionsMoneyConversion[0]['options'][0]}
                                options={optionsMoneyConversion}
                                onChange={(event) => handleSelect('from', event)}
                                formatGroupLabel={formatGroupLabel}
                                components={{
                                    MenuList: menuListScrollbar
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...selectTheme
                                    }
                                })}/>
                            <button className='button-match inverse'
                                onClick={handleSwap}>
                                <IconContext.Provider value={{ className: 'global-class-name' }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            <Select id='currencyconverter-select-to'
                                className='select-match'
                                value={state.to}
                                defaultValue={optionsMoneyConversion[0]['options'][0]}
                                options={optionsMoneyConversion}
                                onChange={(event) => handleSelect('to', event)}
                                formatGroupLabel={formatGroupLabel}
                                components={{
                                    MenuList: menuListScrollbar
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...selectTheme
                                    }
                                })}/>
                        </div>
                        <button className='button-match fill-width'
                            type='button'
                            onClick={() => fetchExchangeRate()}
                            disabled={state.running}>Exchange</button>
                    </section>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetCurrencyConverter);