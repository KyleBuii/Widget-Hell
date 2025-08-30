import DOMPurify from 'dompurify';
import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaQuestion, FaRegClock } from 'react-icons/fa';
import { TbMoneybag } from 'react-icons/tb';
import Select from 'react-select';


const optionsCategory = [
    {
        label: 'Category',
        options: [
            { value: '', label: 'Any' }
        ]
    }
];
const optionsDifficulty = [
    {
        label: 'Difficulty',
        options: [
            { value: '', label: 'Any' },
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' }
        ]
    }
];
const optionsType = [
    {
        label: 'Type',
        options: [
            { value: '', label: 'Any' },
            { value: 'multiple', label: 'Multiple Choice' },
            { value: 'boolean', label: 'True / False' }
        ]
    }
];
let intervalTimer = undefined;


const WidgetTrivia = ({ defaultProps, gameProps, formatGroupLabel, selectTheme, sortSelect, menuListScrollbar }) => {
    const [state, setState] = useState({
        goldEarned: 0,
        timer: 0,
        running: false,
        gameOver: false,
        questionCount: 0,
        sessionToken: '',
        amount: 1,
        category: {value: '', label: 'Any'},
        difficulty: {value: '', label: 'Any'},
        type: {value: '', label: 'Any'},
        categories: [],
        difficulties: [],
        questions: [],
        choices: [],
        correctChoices: [],
        maxHealth: 1,
        health: 1
    });

    useEffect(() => {
        document.getElementById('trivia-overlay-customize').style.display = 'block';
        /// Populate category options
        if (optionsCategory[0]['options'].length <= 1) {
            const fetchData = async () => {
                try {
                    const url = 'https://opentdb.com/api_category.php';
                    const response = await fetch(url);
                    const result = await response.json();
                    for(let i of result['trivia_categories']){
                        optionsCategory[0]['options'].push({
                            label: i.name,
                            value: i.id
                        });
                    };
                } catch(err) {
                    console.error(err);
                };
            };
            fetchData();
        };
        sortSelect(optionsCategory);
        if (sessionStorage.getItem('trivia') !== null) {
            setState((prevState) => ({
                ...prevState,
                sessionToken: sessionStorage.getItem('trivia')
            }));
        };
        let calculateMaxHealth = calculateHealth();
        setState((prevState) => ({
            ...prevState,
            maxHealth: calculateMaxHealth,
            health: calculateMaxHealth
        }));
    }, []);

    useEffect(() => {
        clearInterval(intervalTimer);
        if (JSON.stringify(sessionStorage.getItem('trivia')) !== state.sessionToken) {
            sessionStorage.setItem('trivia', state.sessionToken);
        };
    }, [state.sessionToken]);

    const fetchTrivia = async () => {
        if (state.amount !== '') {
            try {
                setState((prevState) => ({
                    ...prevState,
                    running: true
                }));    
                if (intervalTimer === undefined) {
                    intervalTimer = setInterval(() => {
                        setState((prevState) => ({
                            ...prevState,
                            timer: prevState.timer + 1
                        }));            
                    }, 1000);
                };
                const urlTrivia = `https://opentdb.com/api.php?amount=${state.amount}&category=${state.category.value}&difficulty=${state.difficulty.value}&type=${state.type.value}&token=${state.sessionToken}`;
                const responseTrivia = await fetch(urlTrivia);
                const resultTrivia = await responseTrivia.json();
                /// Token not found | Token empty | Doesn't exist
                if (/3|4/.test(resultTrivia.response_code) || (state.sessionToken === '')) {
                    const urlSessionToken = 'https://opentdb.com/api_token.php?command=request';
                    const responseSessionToken = await fetch(urlSessionToken);
                    const resultSessionToken = await responseSessionToken.json();
                    setState((prevState) => ({
                        ...prevState,
                        sessionToken: resultSessionToken.token
                    }));        
                };
                let generatedCategories = [];
                let generatedDifficulties = [];
                let generatedQuestions = [];
                let generatedChoices = [];
                let generatedCorrectChoices = [];
                for (let i of resultTrivia.results) {
                    generatedCategories.push(i.category);
                    generatedDifficulties.push(i.difficulty
                        .replace(/^./, (char) => char.toUpperCase())
                    );
                    generatedQuestions.push(i.question);
                    generatedChoices.push([
                        ...i['incorrect_answers']
                    ]);
                    generatedChoices[generatedChoices.length - 1].splice(
                        Math.floor(Math.random() * (generatedChoices[generatedChoices.length - 1].length + 1)),
                        0,
                        i.correct_answer
                    );
                    generatedCorrectChoices.push(i.correct_answer);
                };
                setState((prevState) => ({
                    ...prevState,
                    categories: [...generatedCategories],
                    difficulties: [...generatedDifficulties],
                    questions: [...generatedQuestions],
                    choices: [...generatedChoices],
                    correctChoices: [...generatedCorrectChoices]
                }));    
            } catch(err) {
                console.error(err);
                document.getElementById('trivia-overlay-customize').style.display = 'block';
                setState((prevState) => ({
                    ...prevState,
                    running: false
                }));    
            } finally {
                document.getElementById('trivia-overlay-customize').style.display = 'none';   
                setState((prevState) => ({
                    ...prevState,
                    running: false
                }));    
            };
        } else {
            document.getElementById('trivia-overlay-customize').style.display = 'block';
        };
    };

    const handleNumber = (event) => {
        if (event.target.value === '') {
            setState((prevState) => ({
                ...prevState,
                amount: event.target.value
            }));
        } else if (event.target.value < 1) {
            setState((prevState) => ({
                ...prevState,
                amount: 1
            }));
        } else if (event.target.value > 50) {
            setState((prevState) => ({
                ...prevState,
                amount: 50
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                amount: Number(event.target.value)
            }));
        };
    };

    const handleSelect = (selectType, event) => {
        setState((prevState) => ({
            ...prevState,
            [selectType]: event
        }));
    };

    const handleChoice = (choice, index) => {
        if (choice === state.correctChoices[state.questionCount]) {
            let gold;
            switch (state.difficulties[state.questionCount]) {
                case 'Easy':   gold = 1; break;
                case 'Medium': gold = 2; break;
                case 'Hard':   gold = 3; break;
                default: break;
            };
            if ((state.questionCount + 1) === state.amount) {
                gameOver();
            } else {
                setState((prevState) => ({
                    ...prevState,
                    questionCount: state.questionCount + 1,
                    goldEarned: state.goldEarned + gold
                }));    
                resetButtons();
            };
        } else {
            setState((prevState) => {
                const newState = {
                    ...prevState,
                    health: prevState.health - 1
                };
                if(newState.health <= 0){
                    gameOver();
                }else{
                    let buttonChoice = document.getElementById(`trivia-button-${index}`);
                    buttonChoice.classList.add('disabled-option');
                };        
                return newState;
            });
            let buttonChoice = document.getElementById(`trivia-button-${index}`);
            buttonChoice.className += ' button-incorrect';
        };
    };

    const gameOver = () => {
        let indexButtonCorrect = state.choices[state.questionCount].indexOf(state.correctChoices[state.questionCount]);
        document.getElementById(`trivia-button-${indexButtonCorrect}`).className += ' button-correct';
        setState((prevState) => ({
            ...prevState,
            gameOver: true
        }));
        intervalTimer = clearInterval(intervalTimer);
        if ((state.questionCount + 1) >= 5) {
            let amount = Math.floor((state.questionCount + 1) / 5);
            gameProps.randomItem(amount);
        };
        gameProps.updateGameValue('gold', state.goldEarned);
        gameProps.updateGameValue('exp', state.goldEarned);
    };

    const resetGame = () => {
        document.getElementById('trivia-overlay-customize').style.display = 'block';
        setState((prevState) => ({
            ...prevState,
            goldEarned: 0,
            timer: 0,
            gameOver: false,
            health: state.maxHealth,
            questionCount: 0,
            categories: [],
            difficulties: [],
            questions: [],
            choices: []
        }));
        resetButtons();
    };

    const handleResetKeyDown = (event) => {
        if (event.code.match(/Space|Enter/)) {
            event.preventDefault();
            resetGame();
        };
    };

    const resetButtons = () => {
        for (let i = 0; i < document.getElementById('trivia-choices').children.length; i++) {
            let buttonChoice = document.getElementById(`trivia-button-${i}`);
            if (buttonChoice.classList.contains('button-correct')) {
                buttonChoice.classList.remove('button-correct');
            };
            if (buttonChoice.classList.contains('button-incorrect')) {
                buttonChoice.classList.remove('button-incorrect');
            };
            buttonChoice.classList.remove('disabled-option');
        };
    };

    const calculateHealth = () => {
        if (gameProps.stats.health < 10) {
            return 1;
        } else {
            return Math.floor(gameProps.stats.health / 10);
        };
    };
    
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('trivia')}
            onStop={(event, data) => {
                defaultProps.dragStop('trivia');
                defaultProps.updatePosition('trivia', 'games', data.x, data.y);
            }}
            cancel='span, button, input, label, .select-match, #trivia-reset'
            bounds='parent'>
            <section id='trivia-widget'
                className='widget'
                aria-labelledby='trivia-widget-heading'>
                <h2 id='trivia-widget-heading'
                    className='screen-reader-only'>Trivia Widget</h2>
                <div id='trivia-widget-animation'
                    className='widget-animation'>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                    {/* Drag Handle */}
                    <span id='trivia-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('trivia', 'games')}
                    {/* Information Container */}
                    <div className='aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold'>
                        {/* Question Number */}
                        <span className='text-animation flex-center row gap'>
                            <IconContext.Provider value={{ size: '0.75em', className: 'global-class-name' }}>
                                <FaQuestion/>
                            </IconContext.Provider>
                            {state.questionCount + 1}/{(state.amount === '') ? 1 : state.amount}
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
                    {/* Customize Trivia Overlay */}
                    <div id='trivia-overlay-customize'
                        className='overlay rounded'>
                        <div className='aesthetic-scale scale-span font flex-center column gap small-gap only-justify-content fill-width'>
                            <label htmlFor='trivia-input-number-of-questions'
                                className='aesthetic-scale scale-self origin-left'>Number of Questions</label>
                            <input id='trivia-input-number-of-questions'
                                className='input-match'
                                type='number'
                                value={state.amount}
                                min={1}
                                max={50}
                                name='trivia-input-number-of-questions'
                                onChange={handleNumber}
                                required
                                placeholder='# of Questions'/>
                            <span className='origin-left'>Select Category</span>
                            <Select className='select-match'
                                value={state.category}
                                defaultValue={optionsCategory[0]['options'][0]}
                                onChange={(event) => handleSelect('category', event)}
                                options={optionsCategory}
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
                            <span className='origin-left'>Select Difficulty</span>
                            <Select className='select-match'
                                value={state.difficulty}
                                defaultValue={optionsDifficulty[0]['options'][0]}
                                onChange={(event) => handleSelect('difficulty', event)}
                                options={optionsDifficulty}
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
                            <span className='origin-left'>Select Type</span>
                            <Select className='select-match'
                                value={state.type}
                                defaultValue={optionsType[0]['options'][0]}
                                onChange={(event) => handleSelect('type', event)}
                                options={optionsType}
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
                        <button className='button-match fill-width space-nicely space-top not-bottom'
                            onClick={() => fetchTrivia()}
                            disabled={state.running}>Start Trivia</button>
                    </div>
                    {/* Question and Choices */}
                    <div id='trivia-questions'
                        className='aesthetic-scale scale-span flex-center column gap large-gap'>
                        {/* Question */}
                        <div className='flex-center column gap small-gap font space-nicely space-top not-bottom'>
                            <span className='text-animation font bold medium'
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(state.categories[state.questionCount])
                                }}></span>
                            <span className={`text-animation difficulty ${state.difficulties[state.questionCount]?.toLowerCase()}`}>
                                {state.difficulties[state.questionCount]}
                            </span>
                            <span dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(state.questions[state.questionCount])
                            }}></span>
                        </div>
                        {/* Choices */}
                        <div id='trivia-choices'
                            className='flex-center column gap small-gap'>
                            {state.choices[state.questionCount]?.map((choice, index) => {
                                return <button id={`trivia-button-${index}`}
                                    className='button-match fill-width'
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(choice)
                                    }}
                                    key={`button-${index}`}
                                    onClick={() => handleChoice(choice, index)}
                                    disabled={state.gameOver}></button>;
                            })}
                        </div>
                        {(state.gameOver)
                            ? <div id='trivia-reset'
                                className='font medium flex-center row gap'
                                onClick={() => resetGame()}
                                onKeyDown={(event) => handleResetKeyDown(event)}>
                                Click<div tabIndex={0}> here </div>to reset
                            </div>
                            : <></>}
                    </div>
                    {/* Hearts */}
                    {(gameProps.healthDisplay !== 'none') 
                        ? <div id='trivia-health'
                            className='flex-center space-nicely space-top not-bottom'>
                            {gameProps.renderHearts(state.health).map((heart) => {
                                return heart;
                            })}
                        </div>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetTrivia);