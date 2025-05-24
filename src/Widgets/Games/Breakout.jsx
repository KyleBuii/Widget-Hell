import React, { useEffect, useRef, useState } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa6';
// import { AiOutlineSetting } from 'react-icons/ai';
import { memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { TbMoneybag } from 'react-icons/tb';


let dx = 2;
let dy = -2;
let intervalGame, intervalTimer;

const WidgetBreakout = ({ defaultProps, gameProps, patterns }) => {
    const [state, setState] = useState({
        paddle: {
            height: 12,
            width: 72,
            x: 0,
            y: 0
        },
        ball: {
            radius: 9,
            x: 10,
            y: 10
        },
        bricks: [],
        brick: {
            column: 10,
            row: 10,
            height: 18,
            width: 54,
            padding: 12
        },
        topOffset: 40,
        leftOffset: 33,
        count: 0,
        score: 0,
        highscore: 0,
        goldEarned: 0,
        gameover: false,
        timer: 0,
        maxHealth: 1,
        health: 1
    });
    const refPaddle = useRef(state.paddle);
    const refBricks = useRef(state.bricks);
    const refBall = useRef(state.ball);
    const refHighscore = useRef(state.highscore);
    const refKeyPressed = useRef({
        ArrowLeft: false,
        ArrowRight: false,
        a: false,
        d: false,
    });
    useEffect(() => {
        window.addEventListener('beforeunload', storeData);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let localStorageBreakout = dataLocalStorage['games']['breakout'];
            if (localStorageBreakout['highscore'] !== undefined) {
                setState((prevState) => ({
                    ...prevState,
                    highscore: localStorageBreakout['highscore']
                }));
            };
        };

        let elementCanvas = document.getElementById('breakout-canvas');
        let startingBricks = [];
        let calculateMaxHealth = calculateHealth();
        for (let c = 0; c < state.brick.column; c++) {
            startingBricks[c] = [];
            for (let r = 0; r < state.brick.row; r++) {
                /// Set position of bricks
                startingBricks[c][r] = { x: 0, y: 0, status: 1 };
            };
        };
        setState((prevState) => ({
            ...prevState,
            paddle: {
                ...state.paddle,
                x: (elementCanvas.width - state.paddle.width) / 2,
                y: (elementCanvas.height - 50) - state.paddle.height
            },
            bricks: [...startingBricks],
            maxHealth: calculateMaxHealth,
            health: calculateMaxHealth
        }));

        document.getElementById('breakout-overlay-gameover').style.visibility = 'visible';

        return () => {
            window.removeEventListener('beforeunload', storeData);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);

            storeData();

            clearInterval(intervalGame);
            clearInterval(intervalTimer);
        };
    }, []);
    useEffect(() => {
        refPaddle.current = state.paddle;
        refBricks.current = state.bricks;
        refBall.current = state.ball;
        refHighscore.current = state.highscore;
    }, [state.paddle, state.bricks, state.ball, state.highscore]);
    const handlePaddleMovement = (inputType, event) => {
        let elementCanvas = document.getElementById('breakout-canvas');
        let elementCanvasRect = elementCanvas.getBoundingClientRect();
        let relativeX = 0;
        switch (inputType) {
            case 'mouse':
                relativeX = event.clientX - elementCanvas.offsetLeft;
                break;
            case 'touch':
                relativeX = (event.touches[0].clientX - elementCanvasRect.left) * (elementCanvas.width / elementCanvasRect.width);
                break;
            default: break;
        };
        if (relativeX > 0 && relativeX < elementCanvas.width) {
            setState((prevState) => ({
                ...prevState,
                paddle: {
                    ...prevState.paddle,
                    x: relativeX - (prevState.paddle.width / 2)
                }
            }));
        };
    };
    const handleKeyDown = (event) => {
        if (event.key.match(/ArrowLeft|ArrowRight|a|d/)) {
            refKeyPressed.current[event.key] = true;
        };
    };
    const handleKeyUp = (event) => {
        if (event.key.match(/ArrowLeft|ArrowRight|a|d/)) {
            refKeyPressed.current[event.key] = false;
        };
    };
    const keyboardMovePaddle = () => {
        let elementCanvas = document.getElementById('breakout-canvas');
        let newX = refPaddle.current.x;

        if (refKeyPressed.current.ArrowLeft || refKeyPressed.current.a) {
            newX -= 7;
        };
        if (refKeyPressed.current.ArrowRight || refKeyPressed.current.d) {
            newX += 7;
        };

        newX = Math.max(0, Math.min(elementCanvas.width - refPaddle.current.width, newX));

        setState(prev => ({
            ...prev,
            paddle: {
                ...prev.paddle,
                x: newX
            }
        }));
    };
    const drawPaddle = () => {
        let elementCanvas = document.getElementById('breakout-canvas');
        let ctx = elementCanvas.getContext('2d');
        ctx.clearRect(0, 0, elementCanvas.width, elementCanvas.height);
        ctx.beginPath();
        ctx.roundRect(refPaddle.current.x, refPaddle.current.y, refPaddle.current.width, refPaddle.current.height, 30);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
    };
    const drawBall = () => {
        let elementCanvas = document.getElementById('breakout-canvas');
        let ctx = elementCanvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(refBall.current.x, refBall.current.y, refBall.current.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
    };
    const drawBricks = () => {
        if (refBricks.current.length !== 0){
            let elementCanvas = document.getElementById('breakout-canvas');
            let ctx = elementCanvas.getContext('2d');
            let newBricks = [];
            for (let c = 0; c < state.brick.column; c++) {
                for (let r = 0; r < state.brick.row; r++) {
                    if (refBricks.current[c][r].status === 1) {
                        newBricks = [...refBricks.current];
                        let brickX = (r * (state.brick.width + state.brick.padding)) + state.leftOffset;
                        let brickY = (c * (state.brick.height + state.brick.padding)) + state.topOffset;
                        newBricks[c][r].x = brickX;
                        newBricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.roundRect(brickX, brickY, state.brick.width, state.brick.height, 30);
                        ctx.fillStyle = refBricks.current[c][r].color;
                        ctx.fill();
                        ctx.closePath();
                    };
                };
            };
        };
    };
    const hitDetection = () => {
        for (let c = 0; c < state.brick.column; c++) {
            for (let r = 0; r < state.brick.row; r++) {
                let b = refBricks.current[c][r];
                if (b.status === 1) {
                    if (refBall.current.x > b.x && refBall.current.x< b.x + state.brick.width && refBall.current.y > b.y && refBall.current.y < b.y + state.brick.height) {
                        dy = -dy;
                        b.status = 0;
                        setState((prevState) => {
                            const newState = {
                                ...prevState,
                                count: prevState.count - 1,
                                score: prevState.score + 1,
                                goldEarned: prevState.goldEarned + 1
                            };
                            if (newState.count === 0) generateBricks();
                            return newState;
                        });
                    };
                };
            };
        };
    };
    const moveBall = () => {
        let elementCanvas = document.getElementById('breakout-canvas');
        /// Detect left and right walls
        if (refBall.current.x + dx > elementCanvas.width - refBall.current.radius || refBall.current.x + dx < refBall.current.radius) {
            dx = -dx;
        };
        /// Detect top wall
        if (refBall.current.y + dy < refBall.current.radius) {
            dy = -dy;
        } else if (refBall.current.y + dy > (elementCanvas.height - 50) - refBall.current.radius) {
            /// Detect paddle hits
            if (refBall.current.x > refPaddle.current.x && refBall.current.x < refPaddle.current.x + refPaddle.current.width) {
                dy = -dy;
            };
        };
        /// Bottom wall (lose)
        if (refBall.current.y + dy > elementCanvas.height - refBall.current.radius || refBall.current.y + dy < refBall.current.radius) {
            setState((prevState) => {
                const newState = {
                    ...prevState,
                    health: prevState.health - 1
                };
                if (newState.health <= 0) {
                    gameOver();
                } else {
                    dy = -dy;
                };
                return newState;
            });
        };
        /// Move Ball
        setState((prevState) => ({
            ...prevState,
            ball: {
                ...prevState.ball,
                x: prevState.ball.x + dx,
                y: prevState.ball.y + dy
            }
        }));
    };
    const generateBricks = () => {
        let randomPattern = Math.floor(Math.random() * patterns.length);
        let patternString = patterns[randomPattern].replace(/\s/g, '');
        let charCount = 0;
        let newBricks = [];
        let newBrickCount = 0;
        let brickColor = '';
        let brickStatus = 0;
        for (let c = 0; c < state.brick.column; c++) {
            newBricks[c] = [];
            for (let r = 0; r < state.brick.row; r++) {
                let char = patternString.charAt(charCount);
                /// Set brick color
                switch (char) {
                    case '1': brickColor = 'black';  break;
                    case '2': brickColor = 'brown';  break;
                    case 'b': brickColor = 'blue';   break;
                    case 'g': brickColor = 'green';  break;
                    case 'o': brickColor = 'orange'; break;
                    case 'p': brickColor = 'pink';   break;
                    case 'r': brickColor = 'red';    break;
                    case 'v': brickColor = 'violet'; break;
                    case 'y': brickColor = 'yellow'; break;
                    default: break;
                };
                /// Set brick status
                if (char !== '0') {
                    brickStatus = 1;
                    newBrickCount++;
                } else {
                    brickStatus = 0;
                };
                newBricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: brickStatus,
                    color: brickColor
                };
                charCount++;
            };
        };
        setState((prevState) => ({
            ...prevState,
            bricks: [...newBricks],
            count: newBrickCount
        }));
    };
    const calculateHealth = () => {
        if (gameProps.stats.health < 10) {
            return 1;
        } else {
            return Math.floor(gameProps.stats.health / 10);
        };
    };
    const start = () => {
        dx = 2;
        dy = -2;
        let elementCanvas = document.getElementById('breakout-canvas');
        setState((prevState) => ({
            ...prevState,
            ball: {
                ...state.ball,
                x: Math.random() * (elementCanvas.width - 100) + 100,
                y: elementCanvas.height - 90
            },
            goldEarned: 0,
            timer: 0,
            score: 0,
            health: state.maxHealth
        }));
        generateBricks();
        intervalGame = setInterval(playing, 10);
        intervalTimer = setInterval(() => {
            setState((prevState) => ({
                ...prevState,
                timer: prevState.timer + 1
            }));
        }, 1000);
        document.getElementById('breakout-overlay-gameover').style.visibility = 'hidden';
    };
    const playing = () => {
        keyboardMovePaddle();
        drawPaddle();
        drawBall();
        drawBricks();
        hitDetection();
        moveBall();
    };
    const gameOver = () => {
        clearInterval(intervalGame);
        clearInterval(intervalTimer);
        setState((prevState) => ({
            ...prevState,
            gameover: true,
            highscore: (state.score > state.highscore) ? state.score : state.highscore
        }));
        if (state.score >= 100) {
            let amount = Math.floor(state.score / 100);
            gameProps.randomItem(amount);
        };
        gameProps.updateGameValue('gold', state.goldEarned);
        gameProps.updateGameValue('exp', state.goldEarned);
        document.getElementById('breakout-overlay-gameover').style.visibility = 'visible';
    };
    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['games']['breakout'] = {
                ...dataLocalStorage['games']['breakout'],
                highscore: refHighscore.current
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('breakout')}
            onStop={(event, data) => {
                defaultProps.dragStop('breakout');
                defaultProps.updatePosition('breakout', 'games', data.x, data.y);
            }}
            cancel='button, canvas'
            bounds='parent'>
            <div id='breakout-widget'
                className='widget'>
                <div id='breakout-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='breakout-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('breakout', 'games')}
                    {/* Information Container */}
                    <section className='aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold'>
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
                    </section>
                    {/* Game Canvas */}
                    <canvas id='breakout-canvas'
                        height={600}
                        width={700}
                        onMouseMove={(event) => handlePaddleMovement('mouse', event)}
                        onTouchMove={(event) => handlePaddleMovement('touch', event)}/>
                    {/* Hearts */}
                    {(gameProps.healthDisplay !== 'none') 
                        ? <div id='breakout-health'
                            className='flex-center space-nicely space-top not-bottom'>
                            {gameProps.renderHearts(state.health).map((heart) => {
                                return heart;
                            })}
                        </div>
                        : <></>}
                    {/* Gameover Overlay */}
                    <section id='breakout-overlay-gameover'
                        className='aesthetic-scale scale-span overlay rounded flex-center column gap'>
                        {(state.gameover)
                            ? <div className='flex-center column gap'>
                                <span className='font large bold'>GAME OVER!</span>
                                <span className='font medium'>Score: {state.score}</span>
                                <span className='font medium space-nicely space-bottom'>Highscore: {state.highscore}</span>
                            </div>
                            : <></>}
                        <button className='button-match' 
                            type='button'
                            onClick={() => start()}>Start Game</button>
                        {/* <button id='breakout-button-settings'
                            className='button-match inverse disabled-option space-nicely space-top length-medium'
                            onClick={() => handlePressableButton()}>
                            <IconContext.Provider value={{ size: '1.5em', className: 'global-class-name' }}>
                                <AiOutlineSetting/>
                            </IconContext.Provider>
                        </button> */}
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

export default memo(WidgetBreakout);