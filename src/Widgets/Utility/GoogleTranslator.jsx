import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { BsArrowLeftRight } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaArrowRightFromBracket, FaRegPaste, FaVolumeHigh } from 'react-icons/fa6';
import Select from 'react-select';
import { classStack, decorationValue, languages, smallIcon } from '../../data';
import { copyToClipboard, formatGroupLabel, menuListScrollbar, randSentence } from '../../helpers';

let timeoutCopy;
let optionsTranslateFrom = [
    {
        label: 'Languages',
        options: [
            {value: 'auto', label: 'Detect language'}
        ]
    }
];
let optionsTranslateTo = [
    {
        label: 'Languages',
        options: []
    }
];

const WidgetGoogleTranslator = ({ defaultProps, parentRef }) => {
    const [state, setState] = useState({
        input: '',
        converted: '',
        from: {},
        to: {},
        running: false
    });

    const refState = useRef({
        from: state.from,
        to: state.to
    });

    refState.current = {
        from: state.from,
        to: state.to
    };

    useEffect(() => {
        /// Populate select with 'languages' array
        for (let curr = 0; curr < languages.length; curr+=2) {
            optionsTranslateTo[0]['options'].push({
                value: languages[curr+1],
                label: languages[curr]
            });
        };
        optionsTranslateFrom[0]['options'] = [...optionsTranslateFrom[0]['options'], ...optionsTranslateTo[0]['options']];
        /// Default values
        if (sessionStorage.getItem('googletranslator') === null) {
            setState((prevState) => ({
                ...prevState,
                from: { value: 'auto', label: 'Detect language' },
                to: { value: 'en', label: 'English' }
            }));    
        } else {
            let dataSessionStorage = JSON.parse(sessionStorage.getItem('googletranslator'));
            setState((prevState) => ({
                ...prevState,
                from: dataSessionStorage.from,
                to: dataSessionStorage.to
            }));    
        };
        return () => {
            let data = {
                from: refState.current.from,
                to: refState.current.to
            };
            sessionStorage.setItem('googletranslator', JSON.stringify(data));
            clearTimeout(timeoutCopy);
        };
    }, []);

    const handleTranslate = async () => {
        if (state.input !== '') {
            const data = {
                text: state.input,
                from: state.from.value,
                to: state.to.value
            };

            try {
                setState((prevState) => ({
                    ...prevState,
                    running: true
                }));

                const url = `/api/googleTranslator?data=${JSON.stringify(data)}`;
                const response = await fetch(url);
                const result = await response.json();
                
                setState((prevState) => ({
                    ...prevState,
                    converted: result.response
                }));
            } catch (err) {
                setState((prevState) => ({
                    ...prevState,
                    converted: err,
                    running: false
                }));
            } finally {
                setState((prevState) => ({
                    ...prevState,
                    running: false
                }));        
            };
        };
    };

    const handleChange = (event) => {
        setState((prevState) => ({
            ...prevState,
            input: event.target.value
        }));
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };

    const handleFrom = (event) => {
        setState((prevState) => ({
            ...prevState,
            from: event
        }));
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };

    const handleTo = (event) => {
        setState((prevState) => ({
            ...prevState,
            to: event
        }));
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };

    const handleSwap = () => {
        if (state.from.value !== state.to.value) {
            parentRef.randomColor();
            const prev = state.from;
            setState((prevState) => ({
                ...prevState,
                from: prevState.to,
                to: prev
            }));    
        };
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };

    const handleRandSentence = () => {
        setState((prevState) => ({
            ...prevState,
            input: randSentence(),
            from: { value: 'auto', label: 'Detect language' }
        }));
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };

    const handleTalk = () => {
        parentRef.talk(state.converted);
    };

    const handleCopy = () => {
        copyToClipboard(state.converted);
        let elementTranslatedText = document.getElementById('googletranslator-translated-text');
        elementTranslatedText.style.textShadow = '0px 0px 2px var(--randColorLight)';
        timeoutCopy = setTimeout(() => {
            elementTranslatedText.style.textShadow = 'unset';
        }, 400);
    };

    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('googletranslator')}
            onStop={(event, data) => {
                defaultProps.dragStop('googletranslator');
                defaultProps.updatePosition('googletranslator', 'utility', data.x, data.y);
            }}
            cancel='button, span, p, textarea, .select-match'
            bounds='parent'>
            <section id='googletranslator-widget'
                className='widget'
                aria-labelledby='googletranslator-widget-heading'>
                <h2 id='googletranslator-widget-heading'
                    className='screen-reader-only'>Google Translator Widget</h2>
                <div id='googletranslator-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='googletranslator-widget-draggable'
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
                    {defaultProps.renderHotbar('googletranslator', 'utility')}
                    {/* Selects Container */}
                    <div className='flex-center wrap space-nicely space-bottom'>
                        {/* Select From */}
                        <Select id='googletranslator-translate-from'
                            className='select-match'
                            value={state.from}
                            defaultValue={optionsTranslateFrom[0]['options'][0]}
                            onChange={handleFrom}
                            options={optionsTranslateFrom}
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
                        <button className='button-match inverse'
                            aria-label='Swap'
                            onClick={handleSwap}>
                            <IconContext.Provider value={{ size: smallIcon, className: 'global-class-name' }}>
                                <BsArrowLeftRight/>
                            </IconContext.Provider>
                        </button>
                        {/* Select To */}
                        <Select id='googletranslator-translate-to'
                            className='select-match'
                            value={state.to}
                            defaultValue={optionsTranslateTo[0]['options'][0]}
                            onChange={handleTo}
                            options={optionsTranslateTo}
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
                        <button className='button-match inverse'
                            aria-label='Translate'
                            onClick={handleTranslate}
                            disabled={state.running}>
                            <IconContext.Provider value={{ size: smallIcon, className: 'global-class-name' }}>
                                <FaArrowRightFromBracket/>
                            </IconContext.Provider>
                        </button>
                    </div>
                    <div className='cut-scrollbar-corner-part-1 textarea'>
                        <textarea className='cut-scrollbar-corner-part-2 textarea'
                            name='googletranslator-textarea-input'
                            aria-describedby='google-translator-input-aria-describedby'
                            onChange={handleChange}
                            value={state.input}></textarea>
                    </div>
                    <span id='google-translator-input-aria-describedby'
                        className='screen-reader-only'>
                        Type text here to translate it.
                    </span>
                    {/* Display */}
                    <div id='googletranslator-preview-cut-corner'
                        className='cut-scrollbar-corner-part-1 p'>
                        <p id='googletranslator-translated-text'
                            className='text-animation cut-scrollbar-corner-part-2 p flex-center only-justify-content'>{state.converted}</p>
                    </div>
                    {/* Buttons */}
                    <div className='element-ends float relative bottom'
                        style={{ width: 'unset' }}>
                        <div className='flex-center row'>
                            {/* Clipboard */}
                            <button className='button-match fadded inversed'
                                aria-label='Copy'
                                onClick={() => handleCopy()}>
                                <IconContext.Provider value={{ className: 'global-class-name' }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                            {/* Talk */}
                            <button className='button-match fadded inversed'
                                aria-label='Read'
                                onClick={() => handleTalk()}>
                                <IconContext.Provider value={{ className: 'global-class-name' }}>
                                    <FaVolumeHigh/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        {/* Random Sentence */}
                        <button className='button-match fadded'
                            onClick={handleRandSentence}>Random sentence</button>
                    </div>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetGoogleTranslator);