import { evaluate, round } from 'mathjs';
import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { BiExpand } from 'react-icons/bi';
import { BsPlusSlashMinus } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegPaste, FaRegTrashCan } from 'react-icons/fa6';
import { FiDelete } from 'react-icons/fi';


let timeoutTextShadow;

const WidgetCalculator = ({ defaultProps, copyToClipboard, medIcon, operation }) => {
    const [state, setState] = useState({
        question: '',
        input: '',
        memory: [],
        expandInput: false,
        lastComputation: ''
    });
    const refMemory = useRef(state.memory);
    useEffect(() => {
        const inputField = document.getElementById('calculator-input-field');
        inputField.addEventListener('keydown', handleKeypress);
        if (sessionStorage.getItem('calculator') !== null) {
            setState((prevState) => {
                const newState = {
                    ...prevState,
                    memory: JSON.parse(sessionStorage.getItem('calculator')).memory
                };
                newState.memory.forEach((value, index) => {
                    createLabelMemory(value, index);    
                });
                return newState;
            });
        };
        return () => {
            inputField.removeEventListener('keydown', handleKeypress);
            let data = {
                memory: refMemory.current
            };
            sessionStorage.setItem('calculator', JSON.stringify(data));
            clearTimeout(timeoutTextShadow);
        };
    }, []);
    useEffect(() => {
        refMemory.current = state.memory;
        updateLabelMemory();
    }, [state.memory]);
    const handleChange = (event) => {
        setState((prevState) => ({
            ...prevState,
            input: event.target.value
        }));
    };
    const handleClick = (event, where) => {
        switch (event.target.value) {
            case 'number':
                setState((prevState) => ({
                    ...prevState,
                    input: state.memory[where]
                }));
                break;
            case '=':
                if (state.input !== ''
                    && !/\\bUNDEF\\b|\\bInfinity\\b|\\bNaN\\b/.test(state.input)) {
                    let calculate;
                    const reCheckOperationExist = new RegExp(`(\\d+)([${operation}])`);
                    if (state.lastComputation !== ''
                        && !reCheckOperationExist.test(state.input.toString().replace(/\s/g, ''))) {
                        try {
                            calculate = round(evaluate(state.input + state.lastComputation), 3);
                        } catch (err) {
                            setState((prevState) => ({
                                ...prevState,
                                question: state.input + state.lastComputation,
                                input: 'UNDEF'
                            }));                    
                        };
                        if (calculate === undefined) {
                            setState((prevState) => ({
                                ...prevState,
                                question: state.input + state.lastComputation,
                                input: 'UNDEF'
                            }));                    
                        } else {
                            setState((prevState) => ({
                                ...prevState,
                                question: state.input + state.lastComputation,
                                input: calculate
                            }));                    
                        };    
                    } else {
                        try {
                            calculate = round(evaluate(state.input), 3);
                        } catch (err) {
                            setState((prevState) => ({
                                ...prevState,
                                question: state.input,
                                input: 'UNDEF'
                            }));                    
                        };
                        if (calculate === undefined) {
                            setState((prevState) => ({
                                ...prevState,
                                question: state.input,
                                input: 'UNDEF'
                            }));                    
                        } else {
                            const reLastComputation = new RegExp(`(?!^-)(?:[${operation}]-?)(?=\\d*\\.?\\d+$)(?:\\d*\\.?\\d+)`);
                            setState((prevState) => ({
                                ...prevState,
                                question: state.input,
                                input: calculate,
                                lastComputation: state.input
                                    .replace(/\s/g, '')
                                    .match(reLastComputation)[0]
                            }));                    
                        };
                    };
                };
                break;
            case 'clear-entry':
                if (state.question !== ''
                    || state.input !== '') {
                    setState((prevState) => ({
                        ...prevState,
                        input: state.input
                            .replace(/(\d+)(?!.*\d)/, '')
                    }));                
                };
                break;
            case 'clear':
                if (state.question !== ''
                    || state.input !== '') {
                    setState((prevState) => ({
                        ...prevState,
                        question: '',
                        input: '',
                        lastComputation: ''
                    }))                
                };
                break;
            case 'delete':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED') {
                    setState((prevState) => ({
                        ...prevState,
                        input: state.input
                            .toString()
                            .substring(0, state.input.length-1)
                    }))                
                } else {
                    setState((prevState) => ({
                        ...prevState,
                        input: ''
                    }));            
                };
                break;
            case '1/x':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED') {
                    setState((prevState) => ({
                        ...prevState,
                        input: '1/(' + state.input + ')'
                    }));                
                };
                break;
            case 'x^2':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED') {
                    setState((prevState) => ({
                        ...prevState,
                        input: 'square(' + state.input + ')'
                    }));                
                };
                break;
            case 'sqrt(x)':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED') {
                    setState((prevState) => ({
                        ...prevState,
                        input: 'sqrt(' + state.input + ')'
                    }));                
                };
                break;
            case 'negate':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED') {
                    setState((prevState) => ({
                        ...prevState,
                        input: 'unaryMinus(' + state.input + ')'
                    }));                
                };
                break;
            case 'MC':
                if (state.memory.length !== 0) {
                    let contianerMemory = document.getElementById('calculator-button-memory-container');
                    if (where !== undefined) {
                        if (where === 0) {
                            setState((prevState) => ({
                                ...prevState,
                                memory: [...state.memory.slice(1, state.memory.length)]
                            }));                    
                        }else{
                            setState((prevState) => ({
                                ...prevState,
                                memory: [...state.memory.slice(0, where), ...state.memory.slice(where + 1)]
                            }));                    
                        };
                        contianerMemory.removeChild(contianerMemory.children[where]);
                    } else {
                        setState((prevState) => ({
                            ...prevState,
                            memory: []
                        }));                
                        contianerMemory.innerHTML = '';
                    };
                    handleAnimations('MC');
                };
                break;
            case 'MR':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED'
                    && state.memory.length !== 0) {
                    setState((prevState) => ({
                        ...prevState,
                        input: state.memory[0]
                    }));                
                    handleAnimations('MR');
                }
                break;
            case 'M+':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED'
                    && state.memory.length !== 0) {
                    let lastNumberMAdd = state.input.toString().match(/[-]?\d*[.]?\d+(?=\D*$)/);
                    let add;
                    if (where !== undefined) {
                        add = evaluate(state.memory[where] + '+' + lastNumberMAdd);
                        setState((prevState) => ({
                            ...prevState,
                            memory: [...state.memory.slice(0, where), add, ...state.memory.slice(where + 1)]
                        }));    
                        document.getElementById('calculator-button-memory-container').children[where].children[0].innerHTML = add;
                    } else {
                        add = evaluate(state.memory[0] + '+' + lastNumberMAdd);
                        setState((prevState) => ({
                            ...prevState,
                            memory: [add, ...state.memory.slice(1)]
                        }));    
                        document.getElementById('calculator-button-memory-container').children[0].children[0].innerHTML = add;
                    };
                    handleAnimations('M+');
                }
                break;
            case 'M-':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED'
                    && state.memory.length !== 0) {
                    let lastNumberMSubtract = state.input.toString().match(/[-]?\d*[.]?\d+(?=\D*$)/);
                    let subtract;
                    if (where !== undefined) {
                        subtract = evaluate(state.memory[where] + '-' + lastNumberMSubtract);
                        setState((prevState) => ({
                            ...prevState,
                            memory: [...state.memory.slice(0, where), subtract, ...state.memory.slice(where + 1)]
                        }));    
                        document.getElementById('calculator-button-memory-container').children[where].children[0].innerHTML = subtract;
                    } else {
                        subtract = evaluate(state.memory[0] + '-' + lastNumberMSubtract);
                        setState((prevState) => ({
                            ...prevState,
                            memory: [subtract, ...state.memory.slice(1)]
                        }));    
                        document.getElementById('calculator-button-memory-container').children[0].children[0].innerHTML = subtract;
                    };
                    handleAnimations('M-');
                };
                break;
            case 'MS':
                if (state.input !== ''
                    && state.input !== 'UNDEFINED'
                    && /[-]?\d*[.]?\d+(?=\D*$)/.test(state.input)) {
                    const lastNumberMS = state.input.toString().match(/[-]?\d*[.]?\d+(?=\D*$)/);
                    setState((prevState) => {
                        const newState = {
                            ...prevState,
                            memory: [lastNumberMS, ...state.memory]
                        };
                        createLabelMemory(lastNumberMS, state.memory.length - 1);
                        return newState;
                    });
                    handleAnimations('MS');
                };
                break;
            case 'Mv':
                document.getElementById('calculator-button-memory-display').style.visibility = 'visible';
                break;
            case 'memory-close':
                document.getElementById('calculator-button-memory-display').style.visibility = 'hidden';
                break;
            default:
                setState((prevState) => ({
                    ...prevState,
                    input: prevState.input + event.target.value
                }));
                break;
        };
        /// Automatically scroll down in the 'expand input' popout if the 'input' gets too long
        const expandInputPopout = document.getElementById('calculator-input-expand-text');
        if (expandInputPopout.scrollHeight > expandInputPopout.clientHeight) {
            expandInputPopout.scrollTop = expandInputPopout.scrollHeight;
        }
    };
    const handleDelete = () => {
        setState((prevState) => ({
            ...prevState,
            memory: []
        }));
        document.getElementById('calculator-button-memory-container').innerHTML = '';
    };
    const handlePressableButton = (what) => {
        let button = document.getElementById(`calculator-button-${what}`);
        let popoutAnimation = document.getElementById(`calculator-${what}-popout-animation`);
        let whatState = what.replace(/-(.)/, (all, char) => char.toUpperCase()); 
        setState((prevState) => ({
            ...prevState,
            [whatState]: !state[whatState]
        }));
        defaultProps.showHidePopout(popoutAnimation, !state[whatState], button, true);
    };
    const handleKeypress = (event) => {
        const buttonEqual = document.getElementById('calculator-button-equal');
        const reWords = new RegExp('\\bUNDEF\\b|\\bInfinity\\b|\\bNaN\\b');
        switch (event.key) {
            case 'Enter':
                if (reWords.test(state.input)) {
                    setState((prevState) => ({
                        ...prevState,
                        input: ''
                    }));
                } else {
                    event.preventDefault();
                    buttonEqual.click();
                };
                break;
            case 'Backspace':
                if (reWords.test(state.input)) {
                    setState((prevState) => ({
                        ...prevState,
                        input: ''
                    }));
                };
                break;
            default: break;
        };
    };
    const handleCopy = () => {
        copyToClipboard(state.input)
        handleAnimations('copy');
    };
    const handleAnimations = (what) => {
        let elementTranslatedText = document.getElementById('calculator-input-field');
        switch (what) {
            case 'copy':
                elementTranslatedText.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutTextShadow = setTimeout(() => {
                    elementTranslatedText.style.textShadow = 'unset';
                }, 400);
                break;
            case 'MC':
                elementTranslatedText.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutTextShadow = setTimeout(() => {
                    elementTranslatedText.style.textShadow = 'unset';
                }, 400);
                break;
            case 'MR':
                elementTranslatedText.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutTextShadow = setTimeout(() => {
                    elementTranslatedText.style.textShadow = 'unset';
                }, 400);
                break;
            case 'M+':
                elementTranslatedText.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutTextShadow = setTimeout(() => {
                    elementTranslatedText.style.textShadow = 'unset';
                }, 400);
                break;
            case 'M-':
                elementTranslatedText.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutTextShadow = setTimeout(() => {
                    elementTranslatedText.style.textShadow = 'unset';
                }, 400);
                break;
            case 'MS':
                elementTranslatedText.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutTextShadow = setTimeout(() => {
                    elementTranslatedText.style.textShadow = 'unset';
                }, 400);
                break;
            default: break;
        };
    };
    const createLabelMemory = (what, index) => {
        let divLabel = document.createElement('div');
        let divButtons = document.createElement('div');
        let spanLabel = document.createElement('span');
        let buttonClear = document.createElement('button');
        let buttonAdd = document.createElement('button');
        let buttonSubtract = document.createElement('button');
        divLabel.className = 'flex-center row justify-content-right hoverable-label';
        /// Number
        spanLabel.value = 'number';
        spanLabel.onclick = (event) => {
            handleClick(event, index);
        };
        spanLabel.innerHTML = what;
        divLabel.appendChild(spanLabel);
        /// Buttons
        divButtons.className = 'flex-center row gap only-flex';
        divButtons.style.position = 'absolute';
        divButtons.style.left = '0.3em';
        /// Button: MC
        buttonClear.className = 'button-match fadded option';
        buttonClear.value = 'MC';
        buttonClear.onclick = (event) => {
            handleClick(event, index);
        };
        buttonClear.appendChild(document.createTextNode('MC'));
        divButtons.appendChild(buttonClear);
        /// Button: M+
        buttonAdd.className = 'button-match fadded option';
        buttonAdd.value = 'M+';
        buttonAdd.onclick = (event) => {
            handleClick(event, index);
        };
        buttonAdd.appendChild(document.createTextNode('M+'));
        divButtons.appendChild(buttonAdd);
        /// Button: M-
        buttonSubtract.className = 'button-match fadded option';
        buttonSubtract.value = 'M-';
        buttonSubtract.onclick = (event) => {
            handleClick(event, index);
        };
        buttonSubtract.appendChild(document.createTextNode('M\u2212'));
        divButtons.appendChild(buttonSubtract);
        divLabel.appendChild(divButtons);
        document.getElementById('calculator-button-memory-container').appendChild(divLabel);
    };
    const updateLabelMemory = () => {
        document.getElementById('calculator-button-memory-container').innerHTML = '';
        state.memory.forEach((value, index) => {
            createLabelMemory(value, index);    
        });
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('calculator')}
            onStop={(event, data) => { 
                defaultProps.dragStop('calculator');
                defaultProps.updatePosition('calculator', 'utility', data.x, data.y);
            }}
            cancel='button, span, p, input, textarea, section'
            bounds='parent'>
            <div id='calculator-widget'
                className='widget'>
                <div id='calculator-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='calculator-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: medIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('calculator', 'utility')}
                    {/* Display */}
                    <div id='calculator-display-container'
                        className='flex-center column'>
                        <input className='text-animation font small input-typable no-side space-nicely space-right length-short space-bottom length-short'
                            name='calculator-input-question'
                            type='text'
                            value={state.question}
                            readOnly>
                        </input>
                        <input id='calculator-input-field'
                            className='text-animation font large bold input-typable no-side'
                            name='calculator-input-input'
                            type='text'
                            value={state.input}
                            onChange={handleChange}>
                        </input>
                    </div>
                    {/* Utility Bar */}
                    <div className='font smaller flex-center space-nicely space-bottom length-short'>
                        <button className='button-match fadded inversed'
                            onClick={() => handleCopy()}>
                            <IconContext.Provider value={{ className: 'global-class-name' }}>
                                <FaRegPaste/>
                            </IconContext.Provider>
                        </button>
                        <button id='calculator-button-input-expand' 
                            className='button-match fadded inversed'
                            onClick={() => handlePressableButton('input-expand')}>
                            <IconContext.Provider value={{ className: 'global-class-name' }}>
                                <BiExpand/>
                            </IconContext.Provider>
                        </button>
                    </div>
                    {/* Memory Bar */}
                    <div className='font smaller flex-center space-nicely space-bottom length-short'>
                        <button id='calculator-button-MC'
                            className='button-match inverse inv-small'
                            onClick={handleClick}
                            value='MC'>MC</button>
                        <button id='calculator-button-MR'
                            className='button-match inverse inv-small'
                            onClick={handleClick}
                            value='MR'>MR</button>
                        <button id='calculator-button-M+'
                            className='button-match inverse inv-small'
                            onClick={handleClick}
                            value='M+'>M+</button>
                        <button id='calculator-button-M-'
                            className='button-match inverse inv-small'
                            onClick={handleClick}
                            value='M-'>M&minus;</button>
                        <button id='calculator-button-MS'
                            className='button-match inverse inv-small'
                            onClick={handleClick}
                            value='MS'>MS</button>
                        <button id='calculator-button-Mv'
                            className='button-match inverse inv-small'
                            onClick={handleClick}
                            value='Mv'>M&#709;</button>
                    </div>
                    {/* Buttons */}
                    <section className='grid col-4 font'>
                        {/* Memory Display */}
                        <div id='calculator-button-memory-display'>
                            <div id='calculator-button-memory-container'></div>
                            <button id='calculator-button-memory-display-close'
                                onClick={handleClick}
                                value='memory-close'></button>
                            <button id='calculator-button-trash'
                                className='button-match inverse'
                                onClick={handleDelete}
                                value='trash'><FaRegTrashCan id='calculator-button-trash-icon'/></button>
                        </div>
                        <button className='button-match'
                            onClick={handleClick}
                            value='%'>%</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='clear-entry'>CE</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='clear'>C</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='delete'><FiDelete className='pointer-events-none'/></button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='1/x'>1/x</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='x^2'>x&sup2;</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='sqrt(x)'>&#8730;x</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='/'>&divide;</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='7'>7</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='8'>8</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='9'>9</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='*'>&times;</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='4'>4</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='5'>5</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='6'>6</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='-'>&minus;</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='1'>1</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='2'>2</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='3'>3</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='+'>+</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='negate'><BsPlusSlashMinus className='pointer-events-none'/></button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='0'>0</button>
                        <button className='button-match'
                            onClick={handleClick}
                            value='.'>.</button>
                        <button id='calculator-button-equal'
                            className='button-match'
                            onClick={handleClick}
                            value='='>=</button>
                    </section>
                    {/* Expand Input Popout */}
                    <Draggable cancel='p'
                        position={{
                            x: defaultProps.popouts.expandinput.position.x,
                            y: defaultProps.popouts.expandinput.position.y
                        }}
                        onStop={(event, data) => {
                            defaultProps.updatePosition('calculator', 'utility', data.x, data.y, 'popout', 'expandinput');
                        }}
                        bounds={defaultProps.calculateBounds('calculator-widget', 'calculator-input-expand-popout')}>
                        <section id='calculator-input-expand-popout'
                            className='popout'>
                            <section id='calculator-input-expand-popout-animation'
                                className='popout-animation'>
                                <p id='calculator-input-expand-text'
                                    className='cut-scrollbar-corner-part-2 p area-short font medium break-word space-nicely space-all length-long'>
                                    {state.input}
                                </p>
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

export default memo(WidgetCalculator);