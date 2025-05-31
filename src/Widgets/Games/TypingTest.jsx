import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { TbMoneybag } from 'react-icons/tb';


const timeMax = 60;
const wordLimit = 100;
let timer;

const WidgetTypingTest = ({ defaultProps, gameProps, randSentence }) => {
    const [state, setState] = useState({
        goldEarned: 0,
        time: timeMax,
        mistakes: [],
        mistakesCount: 0,
        wrongStrokes: 0,
        wpm: 0,
        cpm: 0,
        characterCount: 0,
        characterIndex: 0,
        text: [],
        isTyping: false,
        preset: '',
        modifications: {
            fontSmall: false
        }
    });
    const refTime = useRef(state.time);
    const refCharacterCount = useRef(state.characterCount);
    const refMistakesCount = useRef(state.mistakesCount);
    useEffect(() => {
        const handleClick = () => {
            document.getElementById('typingtest-input-field').focus();
        };
        const elementText = document.getElementById('typingtest-text');
        elementText.addEventListener('click', handleClick);
        handleLoadText();
        return () => {
            elementText.removeEventListener('click', handleClick);
            clearInterval(timer);
        };
    }, []);
    useEffect(() => {
        refTime.current = state.time;
        refCharacterCount.current = state.characterCount;
        refMistakesCount.current = state.mistakesCount;
    }, [state.time, state.characterCount, state.mistakesCount]);
    useEffect(() => {
        let textField = document.querySelector('#typingtest-text p');
        let characters = textField.querySelectorAll('span');
        if (characters[state.characterIndex]?.classList.contains('incorrect')
            && state.isTyping) {
            setState((prevState) => ({
                ...prevState,
                mistakesCount: prevState.mistakesCount - 1
            }));
        };
        characters[state.characterIndex]?.classList.remove('correct', 'incorrect');
    }, [state.characterIndex]);
    useEffect(() => {
        if (state.preset !== '') {
            handleLoadText(state.preset);
        } else {
            handleLoadText();
        };
    }, [state.text, state.preset]);
    const handleLoadText = (what = '') => {
        let textField = document.querySelector('#typingtest-text p');
        let loadedText;
        textField.innerHTML = '';
        setState((prevState) => ({
            ...prevState,
            characterIndex: 0
        }));
        if (state.text.length === 0) {
            if (what !== '') {
                loadedText = what;
            } else {
                loadedText = randSentence();
            };
            loadedText = loadedText.split(' ');    
            setState((prevState) => ({
                ...prevState,
                text: [...loadedText]
            }));    
        } else {
            loadedText = state.text;
        };
        loadedText.slice(0, wordLimit)
            .join(' ')
            .split('')
            .forEach((character) => {
                let span = `<span>${character}</span>`;
                textField.innerHTML += span;
            }
        );
        textField.querySelectorAll('span')[0].classList.add('active');
    };
    const handleTyping = () => {
        let textField = document.getElementById('typingtest-text');
        let inputField = document.getElementById('typingtest-input-field');
        let characters = textField.querySelectorAll('span');
        let characterTyped = inputField.value.split('')[state.characterIndex];
        if (state.characterIndex < characters.length
            && refTime.current > 0) {
            if (!state.isTyping) {
                timer = setInterval(() => {
                    if (refTime.current > 0) {
                        let wpm = Math.round(((refCharacterCount.current - refMistakesCount.current) / 5) / (timeMax - refTime.current) * 60);
                        wpm = (wpm < 0 || !wpm || wpm === Infinity)
                            ? 0
                            : wpm;
                        let cpm = (refCharacterCount.current - refMistakesCount.current - 1) * (60 / (timeMax - refTime.current));
                        cpm = (cpm < 0 || !cpm || cpm === Infinity)
                            ? 0
                            : cpm;
                        setState((prevState) => ({
                            ...prevState,
                            time: prevState.time - 1,
                            wpm: wpm,
                            cpm: parseInt(cpm, 10)
                        }));
                    } else {
                        textField.style.opacity = '0.5';
                        gameOver();
                    };
                }, 1000);
                setState((prevState) => ({
                    ...prevState,
                    isTyping: true
                }));
            };
            if (characterTyped == null) {
                if (state.characterIndex > 0) {
                    setState((prevState) => ({
                        ...prevState,
                        characterCount: prevState.characterCount - 1,
                        characterIndex: prevState.characterIndex - 1
                    }));            
                };
                characters.forEach((span) => {
                    span.classList.remove('active');
                });
            } else {
                if (characters[state.characterIndex].innerText === characterTyped) {
                    characters[state.characterIndex].classList.add('correct');
                } else {
                    setState((prevState) => ({
                        ...prevState,
                        mistakesCount: prevState.mistakesCount + 1,
                        wrongStrokes: prevState.wrongStrokes + 1
                    }));
                    characters[state.characterIndex].classList.add('incorrect');
                };
                setState((prevState) => ({
                    ...prevState,
                    characterCount: prevState.characterCount + 1,
                    characterIndex: prevState.characterIndex + 1
                }));
                characters.forEach((span) => {
                    span.classList.remove('active');
                });
                /// End of sentence
                if (state.characterIndex + 1 === characters.length) {
                    inputField.value = '';
                    setState((prevState) => ({
                        ...prevState,
                        text: [...state.text.slice(wordLimit)]
                    }));
                } else {
                    characters[state.characterIndex + 1].classList.add('active');
                };    
            };
            let wpm = Math.round(((refCharacterCount.current - refMistakesCount.current) / 5) / (timeMax - refTime.current) * 60);
            wpm = wpm < 0
                || !wpm
                || wpm === Infinity ? 0
                : wpm;
            let cpm = (refCharacterCount.current - refMistakesCount.current - 1) * (60 / (timeMax - refTime.current));
            cpm = cpm < 0
                || !cpm
                || cpm === Infinity ? 0
                : cpm;
            setState((prevState) => ({
                ...prevState,
                wpm: wpm,
                cpm: parseInt(cpm, 10)
            }));
        };
    };
    const gameOver = () => {
        if (state.wpm >= 40) {
            let amount = Math.floor(state.wpm / 40);
            gameProps.randomItem(amount);
        };
        clearInterval(timer);
        let gold = state.wpm / 2;
        setState((prevState) => ({
            ...prevState,
            goldEarned: gold
        }));
        gameProps.updateGameValue('gold', gold);
        gameProps.updateGameValue('exp', gold);
    };
    const handleResetGame = (preset = '') => {
        clearInterval(timer);
        document.getElementById('typingtest-text').style.opacity = '1';
        document.getElementById('typingtest-input-field').value = '';
        setState((prevState) => ({
            ...prevState,
            goldEarned: 0,
            time: timeMax,
            mistakesCount: 0,
            wrongStrokes: 0,
            wpm: 0,
            cpm: 0,
            characterCount: 0,
            characterIndex: 0,
            isTyping: false,
            text: [],
            preset: preset
        }));
    };
    const handlePresets = (what, amount) => {
        let chosenPreset = '';
        switch (what) {
            case 'AZ': {
                chosenPreset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                break;
            };
            case 'az': {
                chosenPreset = 'abcdefghijklmnopqrstuvwxyz';
                break;
            };
            case 'ZA': {
                chosenPreset = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
                break;
            };
            case 'za': {
                chosenPreset = 'zyxwvutsrqponmlkjihgfedcba';
                break;
            };
            case 'brainrot': {
                let words = "skibidi gyatt rizz only in ohio duke dennis did you pray today livvy dunne rizzing up baby gronk sussy imposter pibby glitch in real life sigma alpha omega male grindset andrew tate goon cave freddy fazbear colleen ballinger smurf cat vs strawberry elephant blud dawg shmlawg ishowspeed a whole bunch of turbulence ambatukam bro really thinks he's carti literally hitting the griddy the ocky way kai cenat fanum tax garten of banban no edging in class not the mosquito again bussing axel in harlem whopper whopper whopper whopper 1 2 buckle my shoe goofy ahh aiden ross sin city monday left me broken quirked up white boy busting it down sexual style goated with the sauce john pork grimace shake kiki do you love me huggy wuggy nathaniel b lightskin stare biggest bird omar the referee amogus uncanny wholesome reddit chungus keanu reeves pizza tower zesty poggers kumalala savesta quandale dingle glizzy rose toy ankha zone thug shaker morbin time dj khaled sisyphus oceangate shadow wizard money gang ayo the pizza here PLUH nair butthole waxing t-pose ugandan knuckles family guy funny moments compilation with subway surfers gameplay at the bottom nickeh30 ratio uwu delulu opium bird cg5 mewing fortnite battle pass all my fellas gta 6 backrooms gigachad based cringe kino redpilled no nut november pokénut november wojak literally 1984 foot fetish F in the chat i love lean looksmaxxing gassy incredible theodore john kaczynski social credit bing chilling xbox live mrbeast kid named finger better caul saul i am a surgeon one in a krillion hit or miss i guess they never miss huh i like ya cut g ice spice we go gym kevin james josh hutcherson edit coffin of andy and leyley metal pipe falling"
                    .split(' ');
                let indexRandom = Math.floor(Math.random() * words.length);
                let indexRandomMax = indexRandom + 100;
                let isOverLength = (indexRandomMax > words.length - 1) ? true : false;
                let sentence = [
                    ...words.slice(
                        indexRandom,
                        (indexRandomMax > words.length - 1)
                            ? words.length
                            : indexRandomMax
                    )
                ];
                if (isOverLength) {
                    sentence.push(
                        ...words.slice(
                            0,
                            (indexRandomMax - words.length)
                        )
                    )
                };
                chosenPreset = sentence.join(' ');
                break;
            };
            case 'numbers': {
                let stringNumber = '';
                for (let i = 0; i < amount; i++) {
                    stringNumber += (Math.random() * 10).toString().replace('.', '');
                };
                chosenPreset = stringNumber;
                break;
            };
            default: { break; };
        };
        handleResetGame(chosenPreset);
    };
    const handleModifications = (what) => {
        const elementText = document.querySelector('#typingtest-text p');
        const elementButton = document.getElementById(`typingtest-modifications-button-${what}`);
        setState((prevState) => {
            const newState = {
                ...prevState,
                modifications: {
                    ...prevState.modifications,
                    [what]: !state.modifications[what]
                }
            };
            if(newState.modifications[what]){
                elementButton.style.opacity = '1';
                elementText.className = what.replace(/([A-Z])/g, ' $1').toLowerCase();
            }else{
                elementButton.style.opacity = '0.5';
                elementText.className = '';
            };
            return newState;
        });
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('typingtest')}
            onStop={(event, data) => {
                defaultProps.dragStop('typingtest');
                defaultProps.updatePosition('typingtest', 'games', data.x, data.y);
            }}
            cancel='button, p, span'
            bounds='parent'>
            <section id='typingtest-widget'
                className='widget'
                aria-labelledby='typingtest-widget-heading'>
                <h2 id='typingtest-widget-heading'
                    className='screen-reader-only'>Typing Test Widget</h2>
                <div id='typingtest-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='typingtest-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('typingtest', 'games')}
                    {/* Information Container */}
                    <div className='aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold'>
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
                    </div>
                    {/* Input */}
                    <input id='typingtest-input-field'
                        onChange={handleTyping}
                        autoComplete='off'></input>
                    {/* Text */}
                    <div id='typingtest-text'
                        className='font large-medium line bellow'>
                        <p></p>
                    </div>
                    {/* Information */}
                    <div className='aesthetic-scale scale-div element-ends space-nicely space-bottom'>
                        <div className='text-animation flex-center row gap'>
                            <span className='font medium bold'>Time Left: </span>
                            <span className='font medium'>{state.time}</span>
                        </div>
                        <div className='text-animation flex-center row gap'>
                            <span className='font medium bold'>Mistakes: </span>
                            <span className='font medium'>{state.mistakesCount} | {state.wrongStrokes}</span>
                        </div>
                        <div className='text-animation flex-center row gap'>
                            <span className='font medium bold'>WPM: </span>
                            <span className='font medium'>{state.wpm}</span>
                        </div>
                        <div className='text-animation flex-center row gap'>
                            <span className='font medium bold'>CPM: </span>
                            <span className='font medium'>{state.cpm}</span>
                        </div>
                        <button className='button-match'
                            onClick={() => {
                                handleResetGame();
                            }}>Try Again</button>
                    </div>
                    {/* Settings */}
                    <div className='flex-center column only-flex gap medium-gap section-group group-large space-nicely space-top'
                        style={{ width: 'unset' }}>
                        {/* Presets */}
                        <div className='flex-center column'>
                            <span className='font medium bold line bellow'>Presets</span>
                            <div className='element-ends space-nicely space-bottom'>
                                <button className='button-match option opt-small'
                                    type='button'
                                    onClick={() => handlePresets('AZ')}>A-Z</button>
                                <button className='button-match option opt-small'
                                    type='button'
                                    onClick={() => handlePresets('az')}>a-z</button>
                                <button className='button-match option opt-small'
                                    type='button'
                                    onClick={() => handlePresets('ZA')}>Z-A</button>
                                <button className='button-match option opt-small'
                                    type='button'
                                    onClick={() => handlePresets('za')}>z-a</button>
                                <button className='button-match option opt-small'
                                    type='button'
                                    onClick={() => handlePresets('brainrot')}>Brainrot</button>
                                <button className='button-match option opt-small'
                                    type='button'
                                    onClick={() => handlePresets('numbers', 1)}>1-9: 16</button>
                                <button className='button-match option opt-small'
                                    type='button'
                                    onClick={() => handlePresets('numbers', 2)}>1-9: 32</button>
                                <button className='button-match option opt-small'
                                    type='button'
                                    onClick={() => handlePresets('numbers', 3)}>1-9: 48</button>
                            </div>
                        </div>
                        {/* Modifications */}
                        <div className='flex-center column'>
                            <span className='font medium bold line bellow'>Modifications</span>
                            <div className='element-ends space-nicely space-bottom'>
                                <button id='typingtest-modifications-button-fontSmall'
                                    className='button-match option opt-small disabled-option'
                                    type='button'
                                    onClick={() => handleModifications('fontSmall')}>Font: Small</button>
                            </div>
                        </div>
                    </div>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetTypingTest);