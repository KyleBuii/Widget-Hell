import Slider from 'rc-slider';
import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa6';
import { TbMoneybag } from 'react-icons/tb';


//////////////////// Guides ////////////////////
/// Debris spawning guide
/*
Direction      Start       Every
Debris left    4 seconds   3 seconds
Debris top     8 seconds   4 seconds
Debris right   13 seconds  5 seconds
Debris bottom  20 seconds  7 seconds
*/

//////////////////// Functions ////////////////////
function shallowEquals (arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    let equals = true;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) equals = false;
    };
    return equals;
};

function arrayDiff (arr1, arr2) {
    return arr1.map((a, i) => {
        return a - arr2[i];
    });
};

/// Checks if arr1 values falls between [arr2 - arr3]
function fallsBetween (arr1, arr2, arr3) {
    if (((arr1[0] >= arr2[0]) && (arr1[0] <= arr3[0]))
        && ((arr1[1] >= arr2[1]) && (arr1[1] <= arr3[1]))) {
        return true;
    };
    return false;
};

/// Displays a single cell
function GridCell (props) {
    const classes = `grid-cell 
        ${props.foodCell ? `grid-cell--food${props.foodType}` : ''} 
        ${props.snakeCell ? 'grid-cell--snake' : ''}
        ${props.debrisCell ? 'grid-cell--debris' : ''}
    `;
    return (
        <div className={classes}
            style={{
                height: props.size + 'em', 
                width: props.size + 'em'
            }}>
        </div>
    );
};

//////////////////// Variables ////////////////////
let intervalTimer;
let moveSnakeInterval;
let timeoutDebrisLeft;
let timeoutDebrisTop;
let timeoutDebrisRight;
let timeoutDebrisBottom;
let timeoutInvulnerabilityFrames = undefined;
let delayDebrisLeft = 3000;
let delayDebrisTop = 4000;
let delayDebrisRight = 5000;
let delayDebrisBottom = 7000;
let numCells;

const WidgetSnake = ({ defaultProps, gameProps, foodTypes, debris }) => {
    const [state, setState] = useState({
        goldEarned: 0,
        timer: 0,
        size: 0,
        settings: false,
        help: false,
        startMoving: false,
        snake: [],
        debrisLeft: [],
        debrisTop: [],
        debrisRight: [],
        debrisBottom: [],
        food: [],
        foodType: 'normal',
        foodDelay: 0,
        highscore: 0,
        status: 0,          /// 0 = not started, 1 = in progress, 2 = finished
        direction: 0,       /// Using keycodes to indicate direction
        speed: 130,
        step: 1,
        maxHealth: 1,
        health: 1
    });
    useEffect(() => {
        window.addEventListener('beforeunload', storeData);
        window.addEventListener('resize', calculateSize);
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let localStorageSnake = dataLocalStorage['games']['snake'];
            if (localStorageSnake['highscore'] !== undefined) {
                setState((prevState) => ({
                    ...prevState,
                    highscore: localStorageSnake['highscore'],
                    speed: localStorageSnake['speed']
                }));
            };
        };
        document.getElementById('snake-overlay').style.visibility = 'visible';
        calculateSize();
        let calculateMaxHealth = calculateHealth();
        setState((prevState) => ({
            ...prevState,
            maxHealth: calculateMaxHealth,
            health: calculateMaxHealth
        }));
    }, []);
    useEffect(() => {
        return () => {
            window.removeEventListener('beforeunload', storeData);
            removeTimers();
            storeData();    
        };
    }, [state.highscore, state.speed]);
    useEffect(() => {
        if (state.timer === 1) spawnDebris('left');
        if (state.timer === 4) spawnDebris('top');  
        if (state.timer === 8) spawnDebris('right');  
        if (state.timer === 13) spawnDebris('bottom');  
    }, [state.timer]);
    useEffect(() => {
        if (state.health <= 0) {
            endGame()
        } else {
            timeoutInvulnerabilityFrames = setTimeout(() => {
                timeoutInvulnerabilityFrames = undefined;
            }, 500);
        };
    }, [state.health]);
    useEffect(() => {
        const overlay = document.getElementById('snake-overlay');
        if (state.status === 1) {
            overlay.style.visibility = 'hidden';
        } else {
            overlay.style.visibility = 'visible';
        };
    }, [state.status]);
    /// Randomly place a random snake food
    const moveFood = () => {
        const x = parseInt(Math.random() * numCells);
        const y = parseInt(Math.random() * numCells);
        let keysFoodTypes = Object.keys(foodTypes);
        let randomFoodType = Math.floor(Math.random() * keysFoodTypes.length);
        setState((prevState) => ({
            ...prevState,
            food: [x, y],
            foodType: keysFoodTypes[randomFoodType],
            foodDelay: (foodTypes[keysFoodTypes[randomFoodType]].delay)
                ? foodTypes[keysFoodTypes[randomFoodType]].delay
                : 0
        }));
    };
    const keyDown = ({ keyCode }) => {
        if (state.status !== 0 || state.status !== 2) {
            const re = new RegExp('\\b83|40|87|38|68|39|65|37\\b');
            if (state.startMoving === true
                && re.test(keyCode)) {
                moveSnakeInterval = setInterval(loop, state.speed);
                intervalTimer = setInterval(() => {
                    setState((prevState) => ({
                        ...prevState,
                        timer: prevState.timer + 1
                    }));            
                }, 1000);
                setState((prevState) => ({
                    ...prevState,
                    startMoving: false
                }));
            };
            /// Ignore if same direction or reverse
            let changeDirection = true;
            [[83, 40, 87, 38], [68, 39, 65, 37]].forEach(dir => {
                if (dir.indexOf(state.direction) > -1 && dir.indexOf(keyCode) > -1) changeDirection = false;
            });
            if (re.test(keyCode)
                && changeDirection) {
                setState((prevState) => ({
                    ...prevState,
                    direction: keyCode
                }));
            };
            /// Dash key (shift)
            if (keyCode === 16) {
                setState((prevState) => ({
                    ...prevState,
                    step: 2
                }));
            };
        };
    };
    const spawnDebris = (where) => {
        let randomPosition;
        let randomDebris = debris[Math.floor(Math.random() * debris.length)];
        let calculateDebris = [];
        switch (where) {
            case 'left':
                randomPosition = Math.floor(Math.random() * (state.size + randomDebris[0][0]) + Math.abs(randomDebris[0][0]));
                for (let i of randomDebris) {
                    calculateDebris.push([i[0] + randomPosition, i[1]]);
                };
                setState((prevState) => ({
                    ...prevState,
                    debrisLeft: calculateDebris
                }));
                break;
            case 'top':
                randomPosition = Math.floor(Math.random() * (state.size + randomDebris[0][1]) + Math.abs(randomDebris[0][1]));
                for (let i of randomDebris) {
                    calculateDebris.push([i[0], i[1] + randomPosition]);
                };
                setState((prevState) => ({
                    ...prevState,
                    debrisTop: calculateDebris
                }));
                break;
            case 'right':
                randomPosition = Math.floor(Math.random() * (state.size + randomDebris[0][0]) + Math.abs(randomDebris[0][0]));
                for (let i of randomDebris) {
                    calculateDebris.push([i[0] + randomPosition, Math.abs(i[1]) + state.size]);
                };
                setState((prevState) => ({
                    ...prevState,
                    debrisRight: calculateDebris
                }));
                break;
            case 'bottom':
                randomPosition = Math.floor(Math.random() * (state.size + randomDebris[0][1]) + Math.abs(randomDebris[0][1]));
                for (let i of randomDebris) {
                    calculateDebris.push([Math.abs(i[0]) + state.size, i[1] + randomPosition]);
                };
                setState((prevState) => ({
                    ...prevState,
                    debrisBottom: calculateDebris
                }));
                break;
            default: break;
        };
    };
    /// Move snake, food, debris, eating food
    const loop = () => {
        const newSnake = [];
        /// Set in the new 'head' of the snake
        switch (state.direction) {
            /// Down
            case 83:
            case 40:
                newSnake[0] = [state.snake[0][0] + state.step, state.snake[0][1]];
                break;
            /// Up
            case 87:
            case 38:
                newSnake[0] = [state.snake[0][0] - state.step, state.snake[0][1]];
                break;
            /// Right
            case 68:
            case 39:
                newSnake[0] = [state.snake[0][0], state.snake[0][1] + state.step];
                break;
            /// Left
            case 65:
            case 37:
                newSnake[0] = [state.snake[0][0], state.snake[0][1] - state.step];
                break;
            default: break;
        };
        if (state.step !== 1) {
            setState((prevState) => ({
                ...prevState,
                step: 1
            }));
        };
        /// Shift each 'body' segment to the previous segment's position
        [].push.apply(
            newSnake,
            state.snake.slice(1).map((s, i) => {
                // since we're starting from the second item in the list,
                // just use the index, which will refer to the previous item
                // in the original list
                return state.snake[i];
            })
        );
        if ((!(newSnake[0]) 
            || !doesntOverlap(newSnake))
            && timeoutInvulnerabilityFrames === undefined) {
            takeDamage();
        } else {
            /// If moving food
            let copyFood = state.food;
            if (foodTypes[state.foodType].moving
                && state.foodDelay === 0) {
                let foodPositions = [-1, 0, 1];
                let randomPosition = Math.floor(Math.random() * 2);
                copyFood[randomPosition] = copyFood[randomPosition] + foodPositions[Math.floor(Math.random() * foodPositions.length)];
                if (!isValid(copyFood)) copyFood = [state.size/2, state.size/2];
            };
            /// Debris Left
            let newDebrisLeft = state.debrisLeft;
            if (state.debrisLeft.length !== 0) {
                for (let i = 0; i < newDebrisLeft.length; i++) {
                    newDebrisLeft[i][1] = newDebrisLeft[i][1] + 1;
                };
                if (fallsBetween(newSnake[0], newDebrisLeft[0], newDebrisLeft[state.debrisLeft.length - 1])
                    && timeoutInvulnerabilityFrames === undefined) {
                    takeDamage();
                };
                if (newDebrisLeft[0][1] === state.size + 1) {
                    newDebrisLeft = [];
                    timeoutDebrisLeft = setTimeout(() => {
                        spawnDebris('left');
                    }, delayDebrisLeft);
                };
            };
            /// Debris Top
            let newDebrisTop = state.debrisTop;
            if (state.debrisTop.length !== 0) {
                for (let i = 0; i < newDebrisTop.length; i++) {
                    newDebrisTop[i][0] = newDebrisTop[i][0] + 1;
                };
                if (fallsBetween(newSnake[0], newDebrisTop[0], newDebrisTop[state.debrisTop.length - 1])
                    && timeoutInvulnerabilityFrames === undefined) {
                    takeDamage();
                };
                if (newDebrisTop[0][0] === state.size + 1) {
                    newDebrisTop = [];
                    timeoutDebrisTop = setTimeout(() => {
                        spawnDebris('top');
                    }, delayDebrisTop);
                };
            };
            /// Debris Right
            let newDebrisRight = state.debrisRight;
            if (state.debrisRight.length !== 0) {
                for (let i = 0; i < newDebrisRight.length; i++) {
                    newDebrisRight[i][1] = newDebrisRight[i][1] - 1;
                };
                if (fallsBetween(newSnake[0], newDebrisRight[0], newDebrisRight[state.debrisRight.length - 1])
                    && timeoutInvulnerabilityFrames === undefined) {
                    takeDamage();
                };
                if (newDebrisRight[newDebrisRight.length - 1][1] === -1) {
                    newDebrisRight = [];
                    timeoutDebrisRight = setTimeout(() => {
                        spawnDebris('right');
                    }, delayDebrisRight);
                };
            };
            /// Debris Bottom
            let newDebrisBottom = state.debrisBottom;
            if (state.debrisBottom.length !== 0) {
                for (let i = 0; i < newDebrisBottom.length; i++) {
                    newDebrisBottom[i][0] = newDebrisBottom[i][0] - 1;
                };
                if (fallsBetween(newSnake[0], newDebrisBottom[0], newDebrisBottom[state.debrisBottom.length - 1])
                    && timeoutInvulnerabilityFrames === undefined) {
                    takeDamage();
                };
                if (newDebrisBottom[newDebrisBottom.length - 1][0] === (0 - newDebrisBottom.length)) {
                    newDebrisBottom = [];
                    timeoutDebrisBottom = setTimeout(() => {
                        spawnDebris('bottom');
                    }, delayDebrisBottom);
                };
            };
            setState((prevState) => ({
                ...prevState,
                snake: newSnake,
                debrisLeft: newDebrisLeft,
                debrisTop: newDebrisTop,
                debrisRight: newDebrisRight,
                debrisBottom: newDebrisBottom,
                food: copyFood,
                foodDelay: (state.foodDelay !== 0) ? (state.foodDelay - 1) : foodTypes[state.foodType].delay
            }));
            checkIfAteFood(newSnake);
        };
    };
    const takeDamage = () => {
        setState((prevState) => ({
            ...prevState,
            health: prevState.health - 1
        }));
    };
    const checkIfAteFood = (newSnake) => {
        if (!shallowEquals(newSnake[0], state.food)) return;
        /// Snake gets longer
        let newSnakeSegment = [];
        const lastSegment = newSnake[newSnake.length - 1];
        let snakeLengthIncrease = foodTypes[state.foodType].score;
        let currentLengthIncrease = 0;
        /// Where should we position the new snake segment?
        //// Here are some potential positions, we can choose the best looking one
        let lastPositionOptions = [[-1 * currentLengthIncrease, 0], [0, -1 * currentLengthIncrease], [1 * currentLengthIncrease, 0], [0, 1 * currentLengthIncrease]];
        /// The snake is moving along the y-axis, so try that instead
        if (newSnake.length > 1) {
            lastPositionOptions[0] = arrayDiff(lastSegment, newSnake[newSnake.length - 2]);
        };
        for (let i = 0; i < lastPositionOptions.length; i++) {
            let tempNewSnakeSegment = [
                lastSegment[0] + lastPositionOptions[i][0],
                lastSegment[1] + lastPositionOptions[i][1]
            ];
            if (isValid(tempNewSnakeSegment)
                && currentLengthIncrease < snakeLengthIncrease) {
                newSnakeSegment.push(tempNewSnakeSegment);
                currentLengthIncrease++;
            } else if (currentLengthIncrease === snakeLengthIncrease) {
                break;
            };
        };
        setState((prevState) => ({
            ...prevState,
            goldEarned: state.goldEarned + snakeLengthIncrease,
            snake: newSnake.concat(newSnakeSegment),
            food: []
        }));
        if (state.foodType === 'bomb') {
            setState((prevState) => ({
                ...prevState,
                debrisLeft: [],
                debrisTop: [],
                debrisRight: [],
                debrisBottom: []    
            }));
            clearTimeout(timeoutDebrisLeft);
            clearTimeout(timeoutDebrisTop);
            clearTimeout(timeoutDebrisRight);
            clearTimeout(timeoutDebrisBottom);    
            timeoutDebrisLeft = setTimeout(() => {
                spawnDebris('left');
            }, delayDebrisLeft);
            timeoutDebrisTop = setTimeout(() => {
                spawnDebris('top');
            }, delayDebrisTop);
            timeoutDebrisRight = setTimeout(() => {
                spawnDebris('right');
            }, delayDebrisRight);
            timeoutDebrisBottom = setTimeout(() => {
                spawnDebris('bottom');
            }, delayDebrisBottom);
        };
        moveFood();
    };
    /// Is the cell's position inside the grid?
    const isValid = (cell) => {
        return (
            cell[0] > -1 &&
            cell[1] > -1 &&
            cell[0] < numCells &&
            cell[1] < numCells
        );
    };
    const doesntOverlap = (snake) => {
        return (
            snake.slice(1).filter(c => {
                return shallowEquals(snake[0], c);
            }).length === 0
        );
    };
    const startGame = () => {
        if (state.settings === true) {
            setState((prevState) => ({
                ...prevState,
                settings: false
            }));
            document.getElementById('snake-button-settings').style.opacity = '0.5';
            document.getElementById('snake-popout-settings').style.visibility = 'hidden';
        };
        const cells = Math.floor((state.size / 0.9375)/2);
        removeTimers();
        moveFood(); 
        setState((prevState) => ({
            ...prevState,
            timer: 0,
            goldEarned: 0,
            direction: 0,
            startMoving: true,
            status: 1,
            snake: [[cells, cells]],
            debrisLeft: [],
            debrisTop: [],
            debrisRight: [],
            debrisBottom: [],
            health: state.maxHealth
        }));
        document.getElementById('snake-display').focus();
    };
    const endGame = () => {
        removeTimers();
        if ((state.snake.length - 1) >= 10) {
            let amount = Math.floor((state.snake.length - 1) / 10);
            gameProps.randomItem(amount);
        };
        gameProps.updateGameValue('gold', state.goldEarned);
        gameProps.updateGameValue('exp', state.goldEarned);
        setState((prevState) => ({
            ...prevState,
            status: 2,
            highscore: (state.snake.length - 1 > state.highscore)
                ? state.snake.length - 1
                : state.highscore
        }));
    };
    const removeTimers = () => {
        if (moveSnakeInterval) {
            clearInterval(moveSnakeInterval);
        };
        clearInterval(intervalTimer);
        clearTimeout(timeoutDebrisLeft);
        clearTimeout(timeoutDebrisTop);
        clearTimeout(timeoutDebrisRight);
        clearTimeout(timeoutDebrisBottom);
        timeoutInvulnerabilityFrames = clearTimeout(timeoutInvulnerabilityFrames);
    };
    const changeSpeed = (value) => {
        setState((prevState) => ({
            ...prevState,
            speed: value
        }));
    };
    const resetSpeed = () => {
        setState((prevState) => ({
            ...prevState,
            speed: 130
        }));
    };
    /// Handles all pressable buttons (opacity: 0.5 on click)
    const handlePressableButton = (what) => {
        switch (what) {
            case 'settings':
                const buttonSettings = document.getElementById('snake-button-settings');
                const popoutAnimationSettings = document.getElementById('snake-popout-animation-settings');
                setState((prevState) => ({
                    ...prevState,
                    settings: !state.settings
                }));    
                defaultProps.showHidePopout(popoutAnimationSettings, !state.settings, buttonSettings);
                break;
            default: break;
        };
    };
    const calculateHealth = () => {
        if (gameProps.stats.health < 10) {
            return 1;
        } else {
            return Math.floor(gameProps.stats.health / 10);
        };
    };
    const calculateSize = () => {
        let calculateSize;
        if (window.innerWidth > 507) {
            calculateSize = 28;
        } else {
            calculateSize = Math.floor(window.innerWidth / 20);
        };
        setState((prevState) => ({
            ...prevState,
            size: calculateSize
        }));
    };
    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['games']['snake'] = {
                ...dataLocalStorage['games']['snake'],
                highscore: state.highscore,
                speed: state.speed
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };
    /// Each cell should be approximately 0.9375em wide, so calculate how many we need
    numCells = Math.floor(state.size / 0.9375);
    const cellSize = state.size / numCells;
    const cellIndexes = Array.from(Array(numCells).keys());
    const cells = cellIndexes.map(x => {
        return cellIndexes.map((y) => {
            const foodCell = (state.food[0] === x) && (state.food[1] === y);
            let snakeCell = state.snake.filter((c) => (c[0] === x) && (c[1] === y));
            snakeCell = snakeCell.length && snakeCell[0];
            let debrisCellLeft = state.debrisLeft.filter((c) => (c[0] === x) && (c[1] === y));
            let debrisCellTop = state.debrisTop.filter((c) => (c[0] === x) && (c[1] === y));
            let debrisCellRight = state.debrisRight.filter((c) => (c[0] === x) && (c[1] === y));
            let debrisCellBottom = state.debrisBottom.filter((c) => (c[0] === x) && (c[1] === y));
            let debrisCell = (debrisCellLeft.length && debrisCellLeft[0])
                || (debrisCellTop.length && debrisCellTop[0])
                || (debrisCellRight.length && debrisCellRight[0])
                || (debrisCellBottom.length && debrisCellBottom[0]);
            return (
                <GridCell foodCell={foodCell}
                    foodType={state.foodType}
                    snakeCell={snakeCell}
                    debrisCell={debrisCell}
                    size={cellSize}
                    key={x + ' ' + y}/>
            );
        });
    });
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('snake')}
            onStop={(event, data) => {
                defaultProps.dragStop('snake');
                defaultProps.updatePosition('snake', 'games', data.x, data.y);
            }}
            cancel='button, section, a'
            bounds='parent'>
            <div id='snake-widget'
                className='widget'>
                <div id='snake-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='snake-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('snake', 'games')}
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
                    {/* Game Container */}
                    <section id='snake-display'
                        onKeyDown={keyDown}
                        style={{
                            width: state.size + 'em',
                            height: state.size + 'em'
                        }}
                        tabIndex={-1}>
                        <div id='snake-display-grid'
                            style={{
                                width: state.size + 'em',
                                height: state.size + 'em'
                            }}>
                            {cells}
                        </div>
                        {/* Overlay */}
                        <div id='snake-overlay'
                            className='aesthetic-scale scale-span overlay rounded flex-center column gap'>
                            {(state.status === 2) ? <span className='font large bold'>GAME OVER!</span>
                                : ''}
                            {(state.status === 2) ? <span className='font medium'>Score: {state.snake.length - 1}</span>
                                : ''}
                            {(state.status === 2) ? <span className='font medium space-nicely space-bottom'>Highscore: {state.highscore}</span>
                                : ''}
                            <button id='snake-button-start-game'
                                className='button-match'
                                onClick={startGame}
                                disabled>Start Game</button>
                            <button id='snake-button-settings'
                                className='button-match inverse disabled-option space-nicely space-top length-medium'
                                onClick={() => handlePressableButton('settings')}>
                                <IconContext.Provider value={{ size: '1.5em', className: 'global-class-name' }}>
                                    <AiOutlineSetting/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </section>
                    {/* Hearts */}
                    {(gameProps.healthDisplay !== 'none') 
                        ? <section id='snake-health'
                            className='flex-center space-nicely space-top not-bottom'>
                            {gameProps.renderHearts(state.health).map((heart) => {
                                return heart;
                            })}
                        </section>
                        : <></>}
                    {/* Settings Popout */}
                    <Draggable cancel='span, .slider, button'
                        position={{
                            x: defaultProps.popouts.settings.position.x,
                            y: defaultProps.popouts.settings.position.y
                        }}
                        onStop={(event, data) => {
                            defaultProps.updatePosition('snake', 'games', data.x, data.y, 'popout', 'settings');
                        }}
                        bounds={defaultProps.calculateBounds('snake-widget', 'snake-popout-settings')}>
                        <section id='snake-popout-settings'
                            className='popout'>
                            <section id='snake-popout-animation-settings'
                                className='popout-animation'>
                                <section className='aesthetic-scale scale-span font large-medium flex-center column gap space-nicely space-all'>
                                    {/* Gameplay Settings */}
                                    <section className='section-group'>
                                        <span className='font small when-elements-are-not-straight space-nicely space-bottom length-short'>
                                            <b>Gameplay</b>
                                        </span>
                                        <section className='element-ends'>
                                            <span className='font small'>
                                                Speed
                                            </span>
                                            <button className='button-match inverse when-elements-are-not-straight'
                                                onClick={resetSpeed}>
                                                <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                                    <BsArrowCounterclockwise/>
                                                </IconContext.Provider>
                                            </button>
                                        </section>
                                        <Slider className='slider space-nicely space-top length-medium'
                                            onChange={changeSpeed}
                                            value={state.speed}
                                            min={50}
                                            max={130}
                                            defaultValue={130}
                                            reverse/>
                                    </section>
                                </section>
                            </section>
                        </section>
                    </Draggable>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>
                            Created by
                            <a className='font transparent-normal link-match'
                                href='https://codepen.io/anh194/pen/LwVbew'
                                target='_blank'> anh</a>
                            &emsp;
                            Modified by Me
                        </span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetSnake);