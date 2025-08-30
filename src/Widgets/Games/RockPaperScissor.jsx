import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegClock } from 'react-icons/fa';
import { TbMoneybag } from 'react-icons/tb';
import SimpleBar from 'simplebar-react';


let intervalTimer;

const WidgetRockPaperScissor = ({ defaultProps, gameProps, rps }) => {
    const [state, setState] = useState({
        goldEarned: 0,
        timer: 0,
        score: 0,
        started: false,
        gameover: false,
        choicePlayer: 'rock',
        choiceComputer: 'rock'
    });

    useEffect(() => {
        return () => {
            clearInterval(intervalTimer);
        };
    }, []);

    const changeChoice = (side, choice) => {
        let elementChoice = document.getElementById(`rockpaperscissor-choice-${side}`);
        elementChoice.src = `/resources/rockpaperscissor/${choice}.webp`;
        elementChoice.onerror = () => {
            elementChoice.onerror = null;
            elementChoice.src = `/resources/rockpaperscissor/${choice}.gif`;
        };
        setState((prevState) => ({
            ...prevState,
            [`choice${side.replace(/^./, (char) => char.toUpperCase())}`]: choice
        }));
    };

    const begin = () => {
        if (intervalTimer === undefined) {
            intervalTimer = setInterval(() => {
                setState((prevState) => ({
                    ...prevState,
                    timer: prevState.timer + 1
                }));        
            }, 1000);
        };
        let message = '';
        let gameStatus = true;
        let countScore = state.score;
        let choicePlayer = state.choicePlayer;
        let choices = Object.keys(rps);
        let choiceComputer = choices[Math.floor(Math.random() * choices.length)];
        changeChoice('computer', choiceComputer);
        /// Same choice
        if (choicePlayer === choiceComputer) {
            message = 'Draw';
        /// Lose
        } else if (rps[choicePlayer][choiceComputer] === undefined) {
            if (rps[choiceComputer][choicePlayer] !== undefined) {
                message = `${choiceComputer.replace(/^./, (char) => char.toUpperCase())} ${rps[choiceComputer][choicePlayer]} ${choicePlayer.replace(/^./, (char) => char.toUpperCase())}`;
                gameStatus = false;
                gameover();
            } else {
                message = 'Draw';
            };
        /// Win
        } else {
            message = `${choicePlayer.replace(/^./, (char) => char.toUpperCase())} ${rps[choicePlayer][choiceComputer]} ${choiceComputer.replace(/^./, (char) => char.toUpperCase())}`;
            countScore++;
        };
        setState((prevState) => ({
            ...prevState,
            score: countScore,
            started: gameStatus
        }));
        let elementMessage = document.getElementById('rockpaperscissor-message');
        elementMessage.innerText = message;
    };

    const gameover = () => {
        intervalTimer = clearInterval(intervalTimer);
        setState((prevState) => ({
            ...prevState,
            goldEarned: state.score,
            gameover: true
        }));
        if (state.score >= 2) {
            let amount = Math.floor(state.score / 2);
            gameProps.randomItem(amount);
        };
        gameProps.updateGameValue('gold', state.score);
        gameProps.updateGameValue('exp', state.score);
    };

    const restart = () => {
        setState((prevState) => ({
            ...prevState,
            goldEarned: 0,
            timer: 0,
            score: 0,
            started: false,
            gameover: false
        }));
        changeChoice('player', 'rock');
        changeChoice('computer', 'rock');
        let elementMessage = document.getElementById('rockpaperscissor-message');
        elementMessage.innerText = '';
    };
    
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('rockpaperscissor')}
            onStop={(event, data) => {
                defaultProps.dragStop('rockpaperscissor');
                defaultProps.updatePosition('rockpaperscissor', 'games', data.x, data.y);
            }}
            cancel='button, img, .simplebar-placeholder'
            bounds='parent'>
            <section id='rockpaperscissor-widget'
                className='widget'
                aria-labelledby='rockpaperscissor-widget-heading'>
                <h2 id='rockpaperscissor-widget-heading'
                    className='screen-reader-only'>Rock Paper Scissor Widget</h2>
                <div id='rockpaperscissor-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='rockpaperscissor-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('rockpaperscissor', 'games')}
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
                        {/* Timer */}
                        <span className='text-animation flex-center row gap'>
                            <IconContext.Provider value={{ size: gameProps.gameIconSize, className: 'global-class-name' }}>
                                <FaRegClock/>
                            </IconContext.Provider>
                            {state.timer}
                        </span>
                    </div>
                    {/* Choice */}
                    <div id='rockpaperscissor-choice'
                        className='font bold element-ends'>
                        <div className='flex-center column gap'>
                            <img id='rockpaperscissor-choice-player'
                                style={{ transform: 'scaleX(-1)' }}
                                src={'/resources/rockpaperscissor/rock.webp'}
                                alt='player rock'
                                draggable='false'
                                loading='lazy'
                                decoding='async'/>
                            <span>{state.choicePlayer.replace(/^./, (char) => char.toUpperCase())}</span>
                        </div>
                        <div className='flex-center column gap'>
                            <span className='font medium bold'>Score: {state.score}</span>
                            <span id='rockpaperscissor-message'
                                className='font normal'></span>
                            {(!state.gameover)
                                ? <button className='button-match'
                                    onClick={() => begin()}>
                                    {(!state.started) ? 'Begin' : 'Next'}
                                </button>
                                : <button className='button-match'
                                    onClick={() => restart()}>
                                    Restart
                                </button>}
                        </div>
                        <div className='flex-center column gap'>
                            <img id='rockpaperscissor-choice-computer'
                                src={'/resources/rockpaperscissor/rock.webp'}
                                alt='computer rock'
                                draggable='false'
                                loading='lazy'
                                decoding='async'/>
                            <span>{state.choiceComputer.replace(/^./, (char) => char.toUpperCase())}</span>
                        </div>
                    </div>
                    {/* Choices */}
                    <SimpleBar style={{ maxHeight: '10em' }}
                        role='region'
                        aria-label='Rock Paper Scissors Choices'>
                        <div id='rockpaperscissor-container-choices'>
                            {Object.keys(rps).map((choice) => {
                                return <button className='button-match inverse'
                                    aria-label={choice}
                                    key={choice}
                                    onClick={() => {
                                        changeChoice('player', choice);
                                    }}
                                    disabled={state.gameover}>
                                    <img src={`/resources/rockpaperscissor/${choice}.webp`}
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src = `/resources/rockpaperscissor/${choice}.gif`;
                                        }}
                                        key={choice}
                                        alt={choice}
                                        draggable='false'
                                        loading='lazy'
                                        decoding='async'/>
                                </button>
                            })}
                        </div>
                    </SimpleBar>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetRockPaperScissor);