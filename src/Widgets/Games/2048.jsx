import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegClock } from 'react-icons/fa';
import { Fa0, FaExpand } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { TbMoneybag } from 'react-icons/tb';
import { VscDebugBreakpointLogUnverified } from 'react-icons/vsc';


/// Variables
let intervalTimer;


class Widget2048 extends Component{
    constructor(props){
        super(props);
        this.state = {
            board: new Board(),
            goldEarned: 0,
            timer: 0
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
    };
    handleKeyDown(event){
        if(this.state.board.hasWon() || this.state.board.hasLost()){
            this.gameOver();
            return;
        };
        var direction;
        if((event.keyCode >= 37 && event.keyCode <= 40)
            || /87|65|83|68/.test(event.keyCode)){
            if(intervalTimer === undefined){
                intervalTimer = setInterval(() => {
                    this.setState({
                        timer: this.state.timer + 1
                    });
                }, 1000);
            };    
            switch(event.keyCode){
                /// w
                case 87:
                    direction = 1;
                    break;
                /// a
                case 65:
                    direction = 0;
                    break;
                /// s
                case 83:
                    direction = 3;
                    break;
                /// d
                case 68:
                    direction = 2;
                    break;
                /// arrow keys
                default:
                    direction = event.keyCode - 37;
                    break;
            };
            let boardClone = Object.assign(
                Object.create(Object.getPrototypeOf(this.state.board)),
                this.state.board
            );
            let newBoard = boardClone.move(direction);
            this.setState({
                board: newBoard
            });
        };
    };
    gameOver(){
        document.getElementById("twentyfortyeight-overlay-gameover")
            .style.visibility = "visible";
        intervalTimer = clearInterval(intervalTimer);
        let gold = Math.floor((1/4) * this.state.board.score);
        this.setState({
            goldEarned: gold
        });
        this.props.gameProps.updateGameValue("gold", gold);
        if(this.state.board.hasWon()){
            this.props.gameProps.randomItem(1);
        };
    };
    resetGame(){
        document.getElementById("twentyfortyeight-overlay-gameover")
            .style.visibility = "hidden";
        intervalTimer = clearInterval(intervalTimer);
        this.setState({
            board: new Board(),
            goldEarned: 0,
            timer: 0
        });
    };
    componentWillUnmount(){
        clearInterval(intervalTimer);
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("twentyfortyeight")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("twentyfortyeight");
                    this.props.defaultProps.updatePosition("twentyfortyeight", "games", data.x, data.y);
                }}
                cancel="span, button, .cell, .overlay"
                bounds="parent">
                <div id="twentyfortyeight-widget"
                    className="widget">
                    <div id="twentyfortyeight-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="twentyfortyeight-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("twentyfortyeight", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("twentyfortyeight", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("twentyfortyeight", "close", "games")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
                        {/* Information Container */}
                        <section className="aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold">
                            {/* Score */}
                            <span className="text-animation flex-center row gap">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "green", className: "global-class-name" }}>
                                    <VscDebugBreakpointLogUnverified/>
                                </IconContext.Provider>
                                {this.state.board.score}
                            </span>
                            {/* Gold Earned */}
                            <span className="text-animation flex-center row float middle-left">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                <span className="font small bold">+</span>
                                {this.state.goldEarned}
                            </span>
                            {/* Total Gold */}
                            <span className="text-animation flex-center row float middle-right">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                {this.props.gameProps.formatNumber(this.props.gameProps.gold, 1)}
                            </span>
                            {/* Timer */}
                            <span className="text-animation flex-center row gap">
                                <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                    <FaRegClock/>
                                </IconContext.Provider>
                                {this.state.timer}
                            </span>
                        </section>
                        <section className="flex-center column gap">
                            {/* Board */}
                            <div id="twentyfortyeight-board"
                                onKeyDown={this.handleKeyDown}
                                tabIndex={-1}>
                                {/* Cells */}
                                {this.state.board.cells.map((row, rowIndex) => {
                                    return(
                                        <div key={rowIndex}>
                                            {row.map((col, colIndex) => {
                                                return <span className="cell twentyfortyeight"
                                                    key={rowIndex * this.state.board.size + colIndex}>
                                                </span>;
                                            })}
                                        </div>
                                    );
                                })}
                                {/* Tiles */}
                                {this.state.board.tiles
                                    .filter((tile) => tile.value !== 0)
                                    .map((tile, index) => {
                                        let classArray = ["tile"];
                                        classArray.push("tile" + tile.value);
                                        if(!tile.mergedInto){
                                            classArray.push(`position_${tile.row}_${tile.column}`);
                                        };
                                        if(tile.mergedInto){
                                            classArray.push("merged");
                                        };
                                        if(tile.isNew()){
                                            classArray.push("new");
                                        };
                                        if(tile.hasMoved()){
                                            classArray.push(`row_from_${tile.fromRow()}_to_${tile.toRow()}`);
                                            classArray.push(`column_from_${tile.fromColumn()}_to_${tile.toColumn()}`);
                                            classArray.push("isMoving");
                                        };
                                        let classes = classArray.join(" ");
                                        return <span className={classes}
                                            key={index}></span>;
                                    })
                                }
                            </div>
                            {/* Reset Button */}
                            <button className="button-match fill-width"
                                onClick={() => this.resetGame()}>Reset Game</button>
                        </section>
                        {/* Gameover Overlay */}
                        <div id="twentyfortyeight-overlay-gameover"
                            className="overlay rounded flex-center"
                            onClick={() => this.resetGame()}>
                            {this.state.board.hasWon()
                                ? <div className="flex-center">
                                    <img src="/resources/2048/2048.gif"
                                    draggable="false"
                                        alt="2048 gif"/>
                                </div>
                                : <div className="flex-center">
                                    <img src="/resources/2048/game-over.gif"
                                    draggable="false"
                                        alt="game over gif"/>
                                </div>}
                        </div>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">
                                Created by <a className="font transparent-normal link-match"
                                    href="https://github.com/monicatvera/2048/"
                                    target="_blank"
                                    rel="noreferrer">Mónica Ilenia Tardón Vera</a>
                                &emsp;Modified by Me
                            </span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

function rotateLeft(matrix){
    var rows = matrix.length;
    var columns = matrix[0].length;
    var res = [];
    for(var row = 0; row < rows; row++){
        res.push([]);
        for(var column = 0; column < columns; column++){
            res[row][column] = matrix[column][columns - row - 1];
        };
    };
    return res;
};

class Tile{
    constructor(value, row, column){
        this.value = value || 0;
        this.row = row || -1;
        this.column = column || -1;
        this.oldRow = -1;
        this.oldColumn = -1;
        this.markForDeletion = false;
        this.mergedInto = null;
        this.id = this.id++ || 0;
    };
    moveTo(row, column){
        this.oldRow = this.row;
        this.oldColumn = this.column;
        this.row = row;
        this.column = column;
    };
    isNew(){
        return this.oldRow === -1 && !this.mergedInto;
    };
    hasMoved(){
        return(
            ((this.fromRow() !== -1)
                && ((this.fromRow() !== this.toRow())
                    || (this.fromColumn() !== this.toColumn())))
                || this.mergedInto
        );
    };
    fromRow(){
        return this.mergedInto ? this.row : this.oldRow;
    };
    fromColumn(){
        return this.mergedInto ? this.column : this.oldColumn;
    };
    toRow(){
        return this.mergedInto ? this.mergedInto.row : this.row;
    };
    toColumn(){
        return this.mergedInto ? this.mergedInto.column : this.column;
    };
};

class Board{
    constructor(){
        this.tiles = [];
        this.cells = [];
        this.score = 0;
        this.size = 4;
        this.fourProbability = 0.1;
        this.deltaX = [-1, 0, 1, 0];
        this.deltaY = [0, -1, 0, 1];
        for(var i = 0; i < this.size; i++){
            this.cells[i] = [
                this.addTile(),
                this.addTile(),
                this.addTile(),
                this.addTile(),
            ];
        };
        this.addRandomTile();
        this.addRandomTile();
        this.setPositions();
        this.won = false;
    };
    addTile(args){
        var res = new Tile(args);
        this.tiles.push(res);
        return res;
    };
    moveLeft(){
        var hasChanged = false;
        for(var row = 0; row < this.size; row++){
            var currentRow = this.cells[row].filter((tile) => tile.value !== 0);
            var resultRow = [];
            for(var target = 0; target < this.size; target++){
                var targetTile = currentRow.length
                    ? currentRow.shift()
                    : this.addTile();
                if(currentRow.length > 0 && (currentRow[0].value === targetTile.value)){
                    var tile1 = targetTile;
                    targetTile = this.addTile(targetTile.value);
                    tile1.mergedInto = targetTile;
                    var tile2 = currentRow.shift();
                    tile2.mergedInto = targetTile;
                    targetTile.value += tile2.value;
                    this.score += (Math.log(tile1.value) / Math.log(2));
                };
                resultRow[target] = targetTile;
                /// Win
                this.won |= (targetTile.value === 2048);
                hasChanged |= targetTile.value !== this.cells[row][target].value;
            };
            this.cells[row] = resultRow;
        };
        return hasChanged;
    };
    setPositions(){
        this.cells.forEach((row, rowIndex) => {
            row.forEach((tile, columnIndex) => {
                tile.oldRow = tile.row;
                tile.oldColumn = tile.column;
                tile.row = rowIndex;
                tile.column = columnIndex;
                tile.markForDeletion = false;
            });
        });
    };
    addRandomTile(){
        var emptyCells = [];
        for(var r = 0; r < this.size; r++){
            for(var c = 0; c < this.size; c++){
                if(this.cells[r][c].value === 0){
                    emptyCells.push({ r: r, c: c });
                };
            };
        };
        var index = ~~(Math.random() * emptyCells.length);
        var cell = emptyCells[index];
        var newValue = (Math.random() < this.fourProbability) ? 4 : 2;
        this.cells[cell.r][cell.c] = this.addTile(newValue);
    };
    move(direction){
        /// 0 -> left, 1 -> up, 2 -> right, 3 -> down
        this.clearOldTiles();
        for(var i = 0; i < direction; i++){
            this.cells = rotateLeft(this.cells);
        };
        var hasChanged = this.moveLeft();
        for(let i = direction; i < 4; i++){
            this.cells = rotateLeft(this.cells);
        };
        if(hasChanged){
            this.addRandomTile();
        };
        this.setPositions();
        return this;
    };
    clearOldTiles(){
        this.tiles = this.tiles.filter((tile) => tile.markForDeletion === false);
        this.tiles.forEach((tile) => {
            tile.markForDeletion = true;
        });
    }
    hasWon(){
        return this.won;
    };
    hasLost(){
        var canMove = false;
        for(var row = 0; row < this.size; row++){
            for(var column = 0; column < this.size; column++){
                canMove |= this.cells[row][column].value === 0;
                for(var dir = 0; dir < 4; dir++){
                    var newRow = row + this.deltaX[dir];
                    var newColumn = column + this.deltaY[dir];
                    if(newRow < 0
                        || newRow >= this.size
                        || newColumn < 0
                        || newColumn >= this.size){
                        continue;
                    };
                    canMove |= (this.cells[row][column].value === this.cells[newRow][newColumn].value);
                };
            };
        };
        return !canMove;
    };   
};


export default memo(Widget2048);