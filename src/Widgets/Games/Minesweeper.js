import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0, FaBomb, FaRegClock } from 'react-icons/fa6';
import { TbMoneybag } from "react-icons/tb";
import { PiFlagPennantFill } from "react-icons/pi";
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import Slider from 'rc-slider';


/// Variables
let intervalTimer;


class WidgetMinesweeper extends Component{
    constructor(props){
        super(props);
        this.state = {
            grid: [],
            mines: 10,
            minesLeft: 10,
            money: 0,
            moneyEarned: 0,
            width: 8,
            height: 8,
            timer: 0,
            started: false,
            disabled: false
        };
        this.createBoard = this.createBoard.bind(this);
        this.revealBoard = this.revealBoard.bind(this);
        this.restartBoard = this.restartBoard.bind(this);
        this.checkVictory = this.checkVictory.bind(this);
        this.getRevealed = this.getRevealed.bind(this);
        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.storeData = this.storeData.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
    };
    createBoard(click = null){
        let grid = [];
        let rows = this.state.width;
        let columns = this.state.height;
        let mines = this.state.mines;
        let minesArray = this.randomMines(mines, columns, rows, click);
        for(let i = 0; i < columns; ++i){
            grid.push([]);
            for(let j = 0; j < rows; ++j){
                let cell = new Cell(i, j, minesArray.includes(i * rows + j));
                this.addCell(grid, cell);
            };
        };
        return grid;
    };
    randomMines(amount, columns, rows, starter = null){
        let minesArray = [];
        let limit = columns * rows;
        let minesPool = [...Array(limit).keys()];
        if(starter > 0 && starter < limit){
            minesPool.splice(starter, 1);
        };
        for(let i = 0; i < amount; ++i){
            let n = Math.floor(Math.random() * minesPool.length);
            minesArray.push(...minesPool.splice(n, 1));
        };
        return minesArray;    
    };
    addCell(grid, cell){
        let y = grid.length - 1;
        let x = grid[y].length;
        let lastCell = cell;
        let neighbours = this.getNeighbours(grid, y, x);
        for(let neighbourCell of neighbours){
            if(lastCell.isMine){
                neighbourCell.n += 1;
            }else if(neighbourCell.isMine){
                lastCell.n += 1;
            };
        };
        grid[y].push(cell);
    };
    getNeighbours(grid, y, x){
        let neighbours = [];
        let currentRow = grid[y];
        let prevRow = grid[y - 1];
        let nextRow = grid[y + 1];
        if(currentRow[x - 1]) neighbours.push(currentRow[x - 1]);
        if(currentRow[x + 1]) neighbours.push(currentRow[x + 1]);
        if(prevRow){
            if(prevRow[x - 1]) neighbours.push(prevRow[x - 1]);
            if(prevRow[x]) neighbours.push(prevRow[x]);
            if(prevRow[x + 1]) neighbours.push(prevRow[x + 1]);
        };
        if(nextRow){
            if(nextRow[x - 1]) neighbours.push(nextRow[x - 1]);
            if(nextRow[x]) neighbours.push(nextRow[x]);
            if(nextRow[x + 1]) neighbours.push(nextRow[x + 1]);
        };
        return neighbours;    
    };
    revealBoard(){
        for(let row of this.state.grid){
            for(let cell of row){
                cell.isRevealed = true;
            };
        };
        this.setState({});
    };
    restartBoard(){
        this.setState({
            grid: this.createBoard(),
            moneyEarned: 0,
            minesLeft: this.state.mines,
            timer: 0,
            started: false
        });
        clearInterval(intervalTimer);
    };
    revealEmptyNeighbours(grid, y, x){
        let neighbours = [...this.getNeighbours(grid, y, x)];
        grid[y][x].isFlagged = false;
        grid[y][x].isRevealed = true;
        while(neighbours.length){
            let neighbourCell = neighbours.shift();
            if(neighbourCell.isRevealed){
                continue;
            };
            if(neighbourCell.isEmpty){
                neighbours.push(
                    ...this.getNeighbours(grid, neighbourCell.y, neighbourCell.x)
                );
            };
            neighbourCell.isFlagged = false;
            neighbourCell.isRevealed = true;
        };
    };
    checkVictory(){
        let revealed = this.getRevealed();
        if(revealed >= this.state.height * this.state.width - this.state.mines){
            this.gameOver("win");
        };
    };
    updateMoney(){
        let dataLocalStorageMoney = JSON.parse(localStorage.getItem("money"));
        this.setState({
            money: dataLocalStorageMoney
        });
    };
    getRevealed(){
        return this.state.grid
            .reduce((r, v) => {
                r.push(...v);
                return r;
            }, [])
            .map((v) => v.isRevealed)
            .filter((v) => !!v).length;  
    };
    handleLeftClick(y, x){
        if(!this.state.started){
            this.setState({
                started: true,
                disabled: true
            });
            intervalTimer = setInterval(() => {
                this.setState({
                    timer: this.state.timer + 1
                });
            }, 1000);
        };
        let cell = this.state.grid[y][x];
        cell.isClicked = true;
        if(cell.isRevealed || cell.isFlagged){
            return false;
        };
        if(cell.isMine){
            this.gameOver();
            return false;
        };
        if(cell.isEmpty){
            this.revealEmptyNeighbours(this.state.grid, y, x);
        };
        cell.isFlagged = false;
        cell.isRevealed = true;
        this.checkVictory();
        this.setState({});
    };
    handleRightClick(e, y, x){
        e.preventDefault();
        let grid = this.state.grid;
        let minesLeft = this.state.minesLeft;
        if(grid[y][x].isRevealed){
            return false;
        };
        if(grid[y][x].isFlagged){
            grid[y][x].isFlagged = false;
            minesLeft++;
        }else{
            grid[y][x].isFlagged = true;
            minesLeft--;
        };
        this.setState({
            minesLeft: minesLeft,
        });
    };
    handleSlider(what, value){
        if(what === "height" || what === "width"){
            this.setState({
                [what]: value
            });
            /// If mines is currently at max and height/width slider is lowered, max mines should lower too
            if(this.state.mines > (Math.floor((this.state.height * this.state.width) / 3))){
                let maxMines = Math.floor((this.state.height * this.state.width) / 3);
                this.setState({
                    mines: maxMines,
                    minesLeft: maxMines
                });
            };
        }else if(what === "mines"){
            this.setState({
                mines: value,
                minesLeft: value
            });
        };
    };
    gameOver(type){
        this.revealBoard();
        clearInterval(intervalTimer);
        this.setState({
            disabled: false
        });
        if(type === "win"){
            let dataLocalStorageMoney = JSON.parse(localStorage.getItem("money"));
            let randomItem = this.props.randomItem();
            let goldBag = 0;
            if(randomItem !== undefined
                && randomItem.name !== undefined){
                if(randomItem.name === "gold"){
                    goldBag = randomItem.amount;
                };
            };
            this.setState({
                moneyEarned: (this.state.mines + goldBag),
            }, () => {
                localStorage.setItem("money", (dataLocalStorageMoney + this.state.moneyEarned));
                this.updateMoney();
            });
        };
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["games"]["minesweeper"] = {
                ...dataLocalStorage["games"]["minesweeper"],
                mines: this.state.mines,
                width: this.state.width,
                height: this.state.height
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    renderBoard(){
        return this.state.grid.map((row, i) => {
            let rowCells = row.map((cell, i) => {
                let cellClassname = `cell minesweeper no-highlight
                    ${(cell.isRevealed) ? "" : " hidden"}
                    ${(cell.isMine) ? " mine" : " "}
                    ${(cell.isClicked) ? " clicked" : " "}
                    ${(cell.isEmpty) ? " empty" : " "}
                    ${(cell.isUnknown) ? " unknown" : " "}
                    ${(cell.isFlagged) ? " flag" : " "}
                    ${(cell.n !== 0) ? ` cell-${cell.n}` : ""}
                `;
                return <div className={cellClassname}
                    key={`cell-${i}`}
                    onClick={() => this.handleLeftClick(cell.y, cell.x)}
                    onContextMenu={(e) => this.handleRightClick(e, cell.y, cell.x)}>
                    {(!cell.isRevealed)
                        ? (cell.isFlagged)
                            ? <IconContext.Provider value={{ size: "1em", color: "red", className: "global-class-name" }}>
                                <PiFlagPennantFill/>
                            </IconContext.Provider>
                            : null
                        : (cell.isMine)
                            ? <IconContext.Provider value={{ size: "1em", color: "black", className: "global-class-name" }}>
                                <FaBomb/>
                            </IconContext.Provider>
                            : (cell.isEmpty)
                                ? ""
                                : cell.n}
                </div>
            });
            return <div key={`row-${i}`} 
                className="flex-center row">{rowCells}</div>;
        });
    };
    componentDidMount(){
        let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
        let localStorageMinesweeper = dataLocalStorage["games"]["minesweeper"];
        if(localStorageMinesweeper["mines"] !== undefined){
            this.setState({
                mines: localStorageMinesweeper["mines"],
                minesLeft: localStorageMinesweeper["mines"],
                width: localStorageMinesweeper["width"],
                height: localStorageMinesweeper["height"],
                money: localStorage.getItem("money")
            }, () => {
                this.setState({
                    grid: this.createBoard()
                });
            });
        }else{
            this.setState({
                grid: this.createBoard()
            });
        };
    };
    componentWillUnmount(){
        this.storeData();
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("minesweeper")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("minesweeper");
                    this.props.defaultProps.updatePosition("minesweeper", "games", data.x, data.y);
                }}
                cancel="button, span, .slider, #minesweeper-board"
                bounds="parent">
                <div id="minesweeper-widget"
                    className="widget">
                    <div id="minesweeper-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="minesweeper-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("minesweeper", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("minesweeper", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Information Container */}
                        <section className="element-ends space-nicely bottom font medium bold">
                            {/* Mines Left */}
                            <span className="flex-center row gap">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "black", className: "global-class-name" }}>
                                    <FaBomb/>
                                </IconContext.Provider>
                                {this.state.minesLeft}
                            </span>
                            {/* Money Earned */}
                            <span className="flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                <span className="font small bold">+</span>
                                {this.state.moneyEarned}
                            </span>
                            {/* Total Money */}
                            <span className="flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                {this.props.formatNumber(this.state.money, 1)}
                            </span>
                            {/* Timer */}
                            <span className="flex-center row gap">
                                <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                    <FaRegClock/>
                                </IconContext.Provider>
                                {this.state.timer}
                            </span>
                        </section>
                        {/* Board */}
                        <section id="minesweeper-board"
                            className="flex-center column">{this.renderBoard()}</section>
                        {/* Controller Container */}
                        <section id="minesweeper-container-controller"
                            className="space-nicely top">
                            <button className="btn-match space-nicely bottom"
                                type="button"
                                onClick={this.restartBoard}>Reset Game</button>
                            {/* Sliders */}
                            <div className="font bold box dimmed dimmed-border">
                                {/* Height */}
                                <span>Height</span>
                                <Slider className="slider space-nicely top medium"
                                    onChange={(value) => this.handleSlider("height", value)}
                                    min={5}
                                    max={18}
                                    step={1}
                                    marks={{
                                        8: {
                                            label: 8,
                                            style: { display: "none" }
                                        }
                                    }}
                                    value={this.state.height}
                                    disabled={this.state.disabled}/>
                                {/* Width */}
                                <span>Width</span>
                                <Slider className="slider space-nicely top medium"
                                    onChange={(value) => this.handleSlider("width", value)}
                                    min={5}
                                    max={30}
                                    step={1}
                                    marks={{
                                        8: {
                                            label: 8,
                                            style: {display: "none" }
                                        }
                                    }}
                                    value={this.state.width}
                                    disabled={this.state.disabled}/>
                                {/* Mines */}
                                <span>Mines</span>
                                <Slider className="slider space-nicely top medium"
                                    onChange={(value) => this.handleSlider("mines", value)}
                                    min={1}
                                    max={Math.floor((this.state.height * this.state.width) / 3)}
                                    step={1}
                                    value={this.state.mines}
                                    disabled={this.state.disabled}/>
                            </div>
                        </section>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by [AUTHOR NAME]</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

class Cell{
    constructor(y, x, isMine){
        this.x = x;
        this.y = y;
        this.n = 0;
        this.isMine = isMine;
        this.isRevealed = false;
        this.isFlagged = false;
        this.isUnknown = false;
        this.isClicked = false;
    };
    get isEmpty(){
        return (this.n === 0 && !this.isMine);
    };
};


export default WidgetMinesweeper;