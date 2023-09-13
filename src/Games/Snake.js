import { React, Component } from 'react';
import Slider from 'rc-slider';

//////////////////// Functions ////////////////////
function shallowEquals(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length)
        return false;
    let equals = true;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            equals = false;
    };
    return equals;
};

function arrayDiff(arr1, arr2) {
    return arr1.map((a, i) => {
        return a - arr2[i];
    });
};

/// Displays a single cell
function GridCell(props) {
    const classes = `grid-cell 
        ${props.foodCell ? "grid-cell--food" : ""} 
        ${props.snakeCell ? "grid-cell--snake" : ""}
    `;
    return(
        <div className={classes}
            style={{
                height: props.size + "em", 
                width: props.size + "em"
            }}>
        </div>
    );
};

/// Main view
class SnakeGame extends Component{
    constructor(props){
        super(props);
        this.state = {
            startMoving: false,
            snake: [],
            food: [],
            status: 0,          /// 0 = not started, 1 = in progress, 2= finished
            direction: 0,       /// Using keycodes to indicate direction
            speed: 130
        };
        this.moveFood = this.moveFood.bind(this);
        this.checkIfAteFood = this.checkIfAteFood.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.moveSnake = this.moveSnake.bind(this);
        this.doesntOverlap = this.doesntOverlap.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.removeTimers = this.removeTimers.bind(this);
        this.changeSpeed = this.changeSpeed.bind(this);
    };
    /// Randomly place snake food
    moveFood(){
        const x = parseInt(Math.random() * this.numCells);
        const y = parseInt(Math.random() * this.numCells);
        this.setState({
            food: [x, y]
        });
    };
    setDirection({keyCode}){
        const re = new RegExp("\\b83|40|87|38|68|39|65|37\\b");
        if(this.state.startMoving === true
            && re.test(keyCode)){
            this.moveSnakeInterval = setInterval(this.moveSnake, this.state.speed);
            this.setState({
                startMoving: false
            });
        };
        /// Ignore if same direction or reverse
        let changeDirection = true;
        [[83, 40, 87, 38], [68, 39, 65, 37]].forEach(dir => {
            if(dir.indexOf(this.state.direction) > -1 && dir.indexOf(keyCode) > -1){
                changeDirection = false;
            };
        });
        if(re.test(keyCode)
            && changeDirection){
            this.setState({
                direction: keyCode
            });
        };
    };
    moveSnake(){
        const newSnake = [];
        /// Set in the new "head" of the snake
        switch(this.state.direction){
            /// Down
            case 83:
            case 40:
                newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
                break;
            /// Up
            case 87:
            case 38:
                newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
                break;
            /// Right
            case 68:
            case 39:
                newSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
                break;
            /// Left
            case 65:
            case 37:
                newSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
                break;
            default:
                break;
        };
        /// Shift each "body" segment to the previous segment's position
        [].push.apply(
            newSnake,
            this.state.snake.slice(1).map((s, i) => {
                // since we're starting from the second item in the list,
                // just use the index, which will refer to the previous item
                // in the original list
                return this.state.snake[i];
            })
        );
        this.setState({
            snake: newSnake
        });
        this.checkIfAteFood(newSnake);
        if(!this.isValid(newSnake[0]) 
            || !this.doesntOverlap(newSnake)){
            this.endGame()
        };
    };
    checkIfAteFood(newSnake){
        if(!shallowEquals(newSnake[0], this.state.food))
            return
        /// Snake gets longer
        let newSnakeSegment;
        const lastSegment = newSnake[newSnake.length - 1];
        /// Where should we position the new snake segment?
        //// Here are some potential positions, we can choose the best looking one
        let lastPositionOptions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        /// The snake is moving along the y-axis, so try that instead
        if(newSnake.length > 1){
            lastPositionOptions[0] = arrayDiff(lastSegment, newSnake[newSnake.length - 2]);
        };
        for(var i = 0; i < lastPositionOptions.length; i++){
            newSnakeSegment = [
                lastSegment[0] + lastPositionOptions[i][0],
                lastSegment[1] + lastPositionOptions[i][1]
            ];
            if(this.isValid(newSnakeSegment)){
                break;
            };
        };
        this.setState({
            snake: newSnake.concat([newSnakeSegment]),
            food: []
        });
        this.moveFood();
    };
    /// Is the cell's position inside the grid?
    isValid(cell){
        return(
            cell[0] > -1 &&
            cell[1] > -1 &&
            cell[0] < this.numCells &&
            cell[1] < this.numCells
        );
    };
    doesntOverlap(snake){
        return(
            snake.slice(1).filter(c => {
                return shallowEquals(snake[0], c);
            }).length === 0
        );
    };
    startGame(){
        const cells = Math.floor((this.props.size / 0.9375)/2);
        this.removeTimers();
        this.moveFood(); 
        this.setState({
            startMoving: true,
            status: 1,
            snake: [[cells, cells]]
        });
        this.el.focus();
    };
    endGame(){
        this.removeTimers();
        this.setState({
            status: 2,
            direction: 0
        });
    };
    removeTimers(){
        if(this.moveSnakeInterval)
            clearInterval(this.moveSnakeInterval);
    };
    changeSpeed(value){
        this.setState({
            speed: value
        });
    };
    componentDidUpdate(){
        const overlay = document.getElementById("snake-overlay");
        if(this.state.status === 1){
            overlay.style.visibility = "hidden";
        }else{
            overlay.style.visibility = "visible";
        };
    };
    componentDidMount(){
    };
    componentWillUnmount(){
        this.removeTimers();
    };
    render(){
        /// Each cell should be approximately 0.9375em wide, so calculate how many we need
        this.numCells = Math.floor(this.props.size / 0.9375);
        const cellSize = this.props.size / this.numCells;
        const cellIndexes = Array.from(Array(this.numCells).keys());
        const cells = cellIndexes.map(y => {
            return cellIndexes.map(x => {
                const foodCell = this.state.food[0] === x && this.state.food[1] === y;
                let snakeCell = this.state.snake.filter(c => c[0] === x && c[1] === y);
                snakeCell = snakeCell.length && snakeCell[0];
                return(
                    <GridCell foodCell={foodCell}
                        snakeCell={snakeCell}
                        size={cellSize}
                        key={x + " " + y}/>
                );
            });
        });
        return(
            <div id="snake-display"
                onKeyDown={this.setDirection}
                style={{
                    width: this.props.size + "em",
                    height: this.props.size + "em"
                }}
                ref={el => (this.el = el)}
                tabIndex={-1}>
                <div id="snake-display-grid"
                    style={{
                        width: this.props.size + "em",
                        height: this.props.size + "em"
                    }}>
                    {cells}
                </div>
                <div id="snake-overlay"
                    className="overlay flex-center column">
                    {(this.state.status === 2) ? <div className="font medium bold"><b>GAME OVER!</b></div>
                        : ""}
                    {(this.state.status === 2) ? <div className="font medium bold space-nicely top bottom">Score: {this.state.snake.length}</div>
                        : ""}
                    <button id="snake-btn-start-game"
                        className="btn-match"
                        onClick={this.startGame}>Start game</button>
                    <div id="snake-overlay-slider-speed">
                        <Slider className="slider space-nicely top medium"
                            onChange={this.changeSpeed}
                            min={50}
                            max={130}
                            defaultValue={130}
                            reverse/>
                    </div>
                </div>
            </div>
        );
    };
};

export default SnakeGame;