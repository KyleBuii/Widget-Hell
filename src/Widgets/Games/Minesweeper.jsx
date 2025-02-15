import Slider from 'rc-slider';
import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaBomb, FaRegClock } from 'react-icons/fa6';
import { PiFlagPennantFill } from 'react-icons/pi';
import { TbMoneybag } from 'react-icons/tb';


let intervalTimer;

const WidgetMinesweeper = ({ defaultProps, gameProps }) => {
    const [state, setState] = useState({
        grid: [],
        mines: 10,
        minesLeft: 10,
        goldEarned: 0,
        width: 8,
        height: 8,
        timer: 0,
        started: false,
        disabled: false,
        maxHealth: 1,
        health: 1
    });
    const refState = useRef({
        mines: state.mines,
        width: state.width,
        height: state.health
    });
    useEffect(() => {
        let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
        let localStorageMinesweeper = dataLocalStorage['games']['minesweeper'];
        /// Load data from local storage
        if (localStorageMinesweeper['mines'] !== undefined) {
            setState((prevState) => ({
                ...prevState,
                mines: localStorageMinesweeper['mines'],
                minesLeft: localStorageMinesweeper['mines'],
                width: localStorageMinesweeper['width'],
                height: localStorageMinesweeper['height']
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                grid: createBoard()
            }));
        };
        /// Set stats
        let calculateMaxHealth = calculateHealth();
        setState((prevState) => ({
            ...prevState,
            maxHealth: calculateMaxHealth,
            health: calculateMaxHealth
        }));
        return () => {
            storeData();
            clearInterval(intervalTimer);
        };
    }, []);
    useEffect(() => {
        refState.current = {
            mines: state.mines,
            width: state.width,
            height: state.health    
        };
        restartBoard();
    }, [state.mines, state.width, state.height]);
    useEffect(() => {
        if (state.health <= 0) gameOver();
    }, [state.health]);
    const handleLeftClick = (y, x) => {
        if (!state.started) {
            setState((prevState) => ({
                ...prevState,
                started: true,
                disabled: true
            }));    
            intervalTimer = setInterval(() => {
                setState((prevState) => ({
                    ...prevState,
                    timer: prevState.timer + 1
                }));        
            }, 1000);
        };
        let cell = state.grid[y][x];
        cell.isClicked = true;
        if (cell.isRevealed || cell.isFlagged) return false;
        if (cell.isMine) {
            setState((prevState) => ({
                ...prevState,
                health: prevState.health - 1
            }));    
            return false;
        };
        if (cell.isEmpty) revealEmptyNeighbours(state.grid, y, x);
        cell.isFlagged = false;
        cell.isRevealed = true;
        checkVictory();
        setState((prevState) => ({ ...prevState }));
    };
    const handleRightClick = (e, y, x) => {
        e.preventDefault();
        let grid = state.grid;
        let minesLeft = state.minesLeft;
        if (grid[y][x].isRevealed) return false;
        if (grid[y][x].isFlagged) {
            grid[y][x].isFlagged = false;
            minesLeft++;
        } else {
            grid[y][x].isFlagged = true;
            minesLeft--;
        };
        setState((prevState) => ({
            ...prevState,
            minesLeft: minesLeft,
        }));
    };
    const handleSlider = (what, value) => {
        if (what === 'height' || what === 'width') {
            setState((prevState) => ({
                ...prevState,
                [what]: value
            }));    
            /// If mines is currently at max and height/width slider is lowered, max mines should lower too
            if (state.mines > (Math.floor((state.height * state.width) / 3))) {
                let maxMines = Math.floor((state.height * state.width) / 3);
                setState((prevState) => ({
                    ...prevState,
                    mines: maxMines,
                    minesLeft: maxMines
                }));        
            };
        } else if (what === 'mines') {
            setState((prevState) => ({
                ...prevState,
                mines: value,
                minesLeft: value
            }));    
        };
    };
    const createBoard = (click = null) => {
        let grid = [];
        let rows = state.width;
        let columns = state.height;
        let mines = state.mines;
        let minesArray = randomMines(mines, columns, rows, click);
        for (let i = 0; i < columns; ++i) {
            grid.push([]);
            for (let j = 0; j < rows; ++j) {
                let cell = new Cell(i, j, minesArray.includes(i * rows + j));
                addCell(grid, cell);
            };
        };
        return grid;
    };
    const randomMines = (amount, columns, rows, starter = null) => {
        let minesArray = [];
        let limit = columns * rows;
        let minesPool = [...Array(limit).keys()];
        if (starter > 0 && starter < limit) {
            minesPool.splice(starter, 1);
        };
        for (let i = 0; i < amount; ++i) {
            let n = Math.floor(Math.random() * minesPool.length);
            minesArray.push(...minesPool.splice(n, 1));
        };
        return minesArray;
    };
    const addCell = (grid, cell) => {
        let y = grid.length - 1;
        let x = grid[y].length;
        let lastCell = cell;
        let neighbours = getNeighbours(grid, y, x);
        for (let neighbourCell of neighbours) {
            if (lastCell.isMine) {
                neighbourCell.n += 1;
            } else if (neighbourCell.isMine) {
                lastCell.n += 1;
            };
        };
        grid[y].push(cell);
    };
    const getNeighbours = (grid, y, x) => {
        let neighbours = [];
        let currentRow = grid[y];
        let prevRow = grid[y - 1];
        let nextRow = grid[y + 1];
        if (currentRow[x - 1]) neighbours.push(currentRow[x - 1]);
        if (currentRow[x + 1]) neighbours.push(currentRow[x + 1]);
        if (prevRow) {
            if (prevRow[x - 1]) neighbours.push(prevRow[x - 1]);
            if (prevRow[x]) neighbours.push(prevRow[x]);
            if (prevRow[x + 1]) neighbours.push(prevRow[x + 1]);
        };
        if (nextRow) {
            if (nextRow[x - 1]) neighbours.push(nextRow[x - 1]);
            if (nextRow[x]) neighbours.push(nextRow[x]);
            if (nextRow[x + 1]) neighbours.push(nextRow[x + 1]);
        };
        return neighbours;
    };
    const revealBoard = () => {
        for (let row of state.grid) {
            for (let cell of row) {
                cell.isRevealed = true;
            };
        };
        setState((prevState) => ({ ...prevState }));
    };
    const restartBoard = () => {
        setState((prevState) => ({
            ...prevState,
            grid: createBoard(),
            goldEarned: 0,
            minesLeft: state.mines,
            timer: 0,
            started: false,
            disabled: false,
            health: state.maxHealth
        }));
        clearInterval(intervalTimer);
    };
    const revealEmptyNeighbours = (grid, y, x) => {
        let neighbours = [...getNeighbours(grid, y, x)];
        grid[y][x].isFlagged = false;
        grid[y][x].isRevealed = true;
        while (neighbours.length) {
            let neighbourCell = neighbours.shift();
            if (neighbourCell.isRevealed) continue;
            if (neighbourCell.isEmpty) {
                neighbours.push(
                    ...getNeighbours(grid, neighbourCell.y, neighbourCell.x)
                );
            };
            neighbourCell.isFlagged = false;
            neighbourCell.isRevealed = true;
        };
    };
    const checkVictory = () => {
        let revealed = getRevealed();
        if (revealed >= state.height * state.width - state.mines) {
            gameOver('win');
        };
    };
    const getRevealed = () => {
        return state.grid
            .reduce((r, v) => {
                r.push(...v);
                return r;
            }, [])
            .map((v) => v.isRevealed)
            .filter((v) => !!v).length;
    };
    const gameOver = (type) => {
        revealBoard();
        clearInterval(intervalTimer);
        setState((prevState) => ({
            ...prevState,
            disabled: false
        }));
        if (type === 'win') {
            if (state.mines >= 10) {
                let amount = Math.floor(state.mines / 10);
                gameProps.randomItem(amount);
            };
            setState((prevState) => ({
                ...prevState,
                goldEarned: state.mines
            }));
            gameProps.updateGameValue('gold', state.mines);
            gameProps.updateGameValue('exp', state.mines);
        };
    };
    const calculateHealth = () => {
        if (gameProps.stats.health < 10) {
            return 1;
        } else {
            return Math.floor(gameProps.stats.health / 10);
        };
    };
    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['games']['minesweeper'] = {
                ...dataLocalStorage['games']['minesweeper'],
                mines: refState.current.mines,
                width: refState.current.width,
                height: refState.current.height
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };
    const renderBoard = () => {
        return state.grid.map((row, i) => {
            let rowCells = row.map((cell, i) => {
                let cellClassname = `cell minesweeper no-highlight
                    ${(cell.isRevealed) ? '' : ' hidden'}
                    ${(cell.isMine) ? ' mine' : ' '}
                    ${(cell.isClicked) ? ' clicked' : ' '}
                    ${(cell.isEmpty) ? ' empty' : ' '}
                    ${(cell.isUnknown) ? ' unknown' : ' '}
                    ${(cell.isFlagged) ? ' flag' : ' '}
                    ${(cell.n !== 0) ? ` cell-${cell.n}` : ''}
                `;
                return <div className={cellClassname}
                    key={`cell-${i}`}
                    onClick={() => handleLeftClick(cell.y, cell.x)}
                    onContextMenu={(e) => handleRightClick(e, cell.y, cell.x)}>
                    {(!cell.isRevealed)
                        ? (cell.isFlagged)
                            ? <IconContext.Provider value={{ color: 'red', className: 'global-class-name' }}>
                                <PiFlagPennantFill/>
                            </IconContext.Provider>
                            : null
                        : (cell.isMine)
                            ? <IconContext.Provider value={{ color: 'black', className: 'global-class-name' }}>
                                <FaBomb/>
                            </IconContext.Provider>
                            : (cell.isEmpty)
                                ? ''
                                : cell.n}
                </div>
            });
            return <div key={`row-${i}`} 
                className='flex-center row'>{rowCells}</div>;
        });
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('minesweeper')}
            onStop={(event, data) => {
                defaultProps.dragStop('minesweeper');
                defaultProps.updatePosition('minesweeper', 'games', data.x, data.y);
            }}
            cancel='button, span, .slider, #minesweeper-board'
            bounds='parent'>
            <div id='minesweeper-widget'
                className='widget'>
                <div id='minesweeper-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='minesweeper-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('minesweeper', 'games')}
                    {/* Information Container */}
                    <section className='aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold'>
                        {/* Mines Left */}
                        <span className='text-animation flex-center row gap'>
                            <IconContext.Provider value={{ size: gameProps.gameIconSize, color: 'black', className: 'global-class-name' }}>
                                <FaBomb/>
                            </IconContext.Provider>
                            {state.minesLeft}
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
                    </section>
                    {/* Board */}
                    <div id='minesweeper-board'
                        className='flex-center column scrollable dragscroll'>
                        {renderBoard()}
                    </div>
                    {/* Controller Container */}
                    <section id='minesweeper-container-controller'
                        className='space-nicely space-top'>
                        <button className='button-match fill-width space-nicely space-bottom'
                            type='button'
                            onClick={restartBoard}>Reset Game</button>
                        {/* Sliders */}
                        <div className='font bold box dimmed dimmed-border'>
                            {/* Height */}
                            <span>Height</span>
                            <Slider className='slider space-nicely space-top length-medium'
                                onChange={(value) => handleSlider('height', value)}
                                min={5}
                                max={18}
                                step={1}
                                marks={{
                                    8: {
                                        label: 8,
                                        style: { display: 'none' }
                                    }
                                }}
                                value={state.height}
                                disabled={state.disabled}/>
                            {/* Width */}
                            <span>Width</span>
                            <Slider className='slider space-nicely space-top length-medium'
                                onChange={(value) => handleSlider('width', value)}
                                min={5}
                                max={30}
                                step={1}
                                marks={{
                                    8: {
                                        label: 8,
                                        style: {display: 'none' }
                                    }
                                }}
                                value={state.width}
                                disabled={state.disabled}/>
                            {/* Mines */}
                            <span>Mines</span>
                            <Slider className='slider space-nicely space-top length-medium'
                                onChange={(value) => handleSlider('mines', value)}
                                min={1}
                                max={Math.floor((state.height * state.width) / 3)}
                                step={1}
                                value={state.mines}
                                disabled={state.disabled}/>
                        </div>
                    </section>
                    {/* Hearts */}
                    {(gameProps.healthDisplay !== 'none') 
                        ? <div id='minesweeper-health'
                            className='flex-center space-nicely space-top not-bottom'>
                            {gameProps.renderHearts(state.health).map((heart) => {
                                return heart;
                            })}
                        </div>
                        : <></>}
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

class Cell {
    constructor (y, x, isMine) {
        this.x = x;
        this.y = y;
        this.n = 0;
        this.isMine = isMine;
        this.isRevealed = false;
        this.isFlagged = false;
        this.isUnknown = false;
        this.isClicked = false;
    };
    get isEmpty () {
        return (this.n === 0 && !this.isMine);
    };
};

export default memo(WidgetMinesweeper);