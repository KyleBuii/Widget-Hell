import { Chess } from 'chess.js';
import { Component, memo, React } from 'react';
import { Chessboard } from 'react-chessboard';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegClock } from 'react-icons/fa';
import { FaRegChessPawn } from 'react-icons/fa6';
import { TbMoneybag } from 'react-icons/tb';


/// Variables
let timeoutRandomMove;
let intervalTimer;


class WidgetChess extends Component{
    constructor(props){
        super(props);
        this.state = {
            game: new Chess(),
            moveFrom: "",
            moveTo: "",
            promotionDialog: false,
            rightClickedSquares: {},
            moveSquares: {},
            optionSquares: {},
            goldEarned: 0,
            timer: 0,
            capturedBlackPieces: [],
            capturedWhitePieces: [],
            capturedWhitePiecesCount: 0,
            gameover: false
        };
        this.getMoveOptions = this.getMoveOptions.bind(this);
        this.randomMove = this.randomMove.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
        this.onPromotionPieceSelect = this.onPromotionPieceSelect.bind(this);
        this.onSquareRightClick = this.onSquareRightClick.bind(this);
        this.updateData = this.updateData.bind(this);
        this.gameOver = this.gameOver.bind(this);
    };
    getMoveOptions(square){
        const moves = this.state.game.moves({
            square,
            verbose: true
        });
        if(moves.length === 0){
            this.setState({
                optionSquares: {}
            });
            return false;
        };
        const newSquares = {};
        moves.map((move) => {
            newSquares[move.to] = {
                background: (this.state.game.get(move.to)
                    && (this.state.game.get(move.to).color !== this.state.game.get(square).color))
                    ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                    : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
                borderRadius: "50%"
            };
            return move;
        });
        newSquares[square] = {
            background: "rgba(255, 255, 0, 0.4)"
        };
        this.setState({
            optionSquares: newSquares
        });
        return true;      
    };
    randomMove(){
        const possibleMoves = this.state.game.moves();
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        /// Check if player has won
        if(this.state.game.isGameOver()
            || this.state.game.isCheckmate()
            || this.state.game.isDraw()
            || this.state.game.isStalemate()
            || possibleMoves.length === 0){
            this.gameOver();
            return;
        };
        this.state.game.move(possibleMoves[randomIndex]);
    };
    onSquareClick(square){
        if(!this.state.gameover){
            this.setState({
                rightClickedSquares: {}
            });
            /// From square
            if(!this.state.moveFrom){
                const hasMoveOptions = this.getMoveOptions(square);
                if(hasMoveOptions){
                    this.setState({
                        moveFrom: square
                    });
                };
                return;
            };
            /// To square
            if(!this.state.moveTo){
                /// Check if valid move before showing dialog
                const moves = this.state.game.moves({
                    square: this.state.moveFrom,
                    verbose: true
                });
                const foundMove = moves.find((m) => m.from === this.state.moveFrom && m.to === square);
                /// Not a valid move
                if(!foundMove){
                    /// Check if clicked on new piece
                    const hasMoveOptions = this.getMoveOptions(square);
                    /// If new piece, setMoveFrom, otherwise clear moveFrom
                    this.setState({
                        moveFrom: (hasMoveOptions) ? square : ""
                    });
                    return;
                };
                /// Valid move
                this.setState({
                    moveTo: square
                });
                /// If promotion move
                if(((foundMove.color === "w")
                    && (foundMove.piece === "p")
                    && (square[1] === "8"))
                    || ((foundMove.color === "b")
                    && (foundMove.piece === "p")
                    && (square[1] === "1"))){
                    this.setState({
                        promotionDialog: true
                    });
                    return;
                };
                /// Is normal move
                try{
                    const gameCopy = this.state.game;
                    let move = gameCopy.move({
                        from: this.state.moveFrom,
                        to: square,
                        promotion: "q"
                    });
                    /// Set timer
                    if(intervalTimer === undefined){
                        intervalTimer = setInterval(() => {
                            this.setState({
                                timer: this.state.timer + 1
                            });
                        }, 1000);
                    };
                    this.updateData(move);
                    this.setState({
                        game: gameCopy
                    });
                    timeoutRandomMove = setTimeout(this.randomMove(), 300);
                }catch(err){
                    /// If invalid, setMoveFrom and getMoveOptions
                    const hasMoveOptions = this.getMoveOptions(square);
                    if(hasMoveOptions){
                        this.setState({
                            moveFrom: square
                        });
                    };
                    return;
                };
                this.setState({
                    moveFrom: "",
                    moveTo: null,
                    optionSquares: {}
                });
                return;
            };
        };
    };
    onPromotionPieceSelect(piece){
        /// If no piece passed then user has cancelled dialog, don't make move and reset
        if(piece){
            const gameCopy = this.state.game;
            let move = gameCopy.move({
                from: this.state.moveFrom,
                to: this.state.moveTo,
                promotion: piece[1].toLowerCase() ?? "q"
            });
            this.updateData(move);
            this.setState({
                game: gameCopy
            });
            timeoutRandomMove = setTimeout(this.randomMove(), 300);
        };
        this.setState({
            moveFrom: "",
            moveTo: null,
            promotionDialog: false,
            optionSquares: {}
        });
        return true;
    };
    onSquareRightClick(square){
        const colour = "rgba(0, 0, 255, 0.4)";
        this.setState({
            rightClickedSquares: {
                ...this.state.rightClickedSquares,
                [square]: this.state.rightClickedSquares[square] && this.state.rightClickedSquares[square].backgroundColor === colour ? undefined : {
                    backgroundColor: colour
                }
            }
        });
    };
    handleButton(what){
        switch(what){
            case "reset":
                document.getElementById("chess-captured-pieces-black")
                    .innerHTML = "";
                this.state.game.reset();
                clearInterval(intervalTimer);
                intervalTimer = undefined;
                this.setState({
                    goldEarned: 0,
                    timer: 0,
                    capturedBlackPieces: [],
                    capturedWhitePieces: [],
                    capturedWhitePiecesCount: 0,
                    gameover: false     
                });
                break;
            case "undo":
                let undoBlack = this.state.game.undo();
                let undoWhite = this.state.game.undo();
                if(!this.state.gameover && undoBlack !== null){
                    if(undoBlack.captured){
                        this.setState({
                            capturedWhitePieces: [...this.state.capturedWhitePieces.slice(0, -1)]
                        });
                    };
                    if(undoWhite.captured){
                        const elementCapturedPiecesBlack = document.getElementById("chess-captured-pieces-black");
                        elementCapturedPiecesBlack.removeChild(elementCapturedPiecesBlack.lastChild);
                        this.setState({
                            capturedBlackPieces: [...this.state.capturedBlackPieces.slice(0, -1)]
                        });
                    };
                    this.setState({
                        goldEarned: this.state.goldEarned - 1,
                        capturedWhitePiecesCount: this.state.capturedWhitePiecesCount - 1        
                    });
                };
                break;
            default:
                break;
        };
        clearTimeout(timeoutRandomMove);
        this.setState({});
    };
    updateData(move){
        let gold = 1;
        if(move.captured === "q" || move.captured === "k"){
            gold = 5;
        };
        if(move.captured){
            this.setState({
                capturedBlackPieces: [...this.state.capturedBlackPieces, move.captured],
                capturedWhitePiecesCount: this.state.capturedWhitePiecesCount + 1,
                goldEarned: this.state.goldEarned + gold
            });
            const elementCapturedPiecesBlack = document.getElementById("chess-captured-pieces-black");
            const elementImage = document.createElement("img");
            elementImage.src = `/resources/chess/b${move.captured.toUpperCase()}.png`;
            elementImage.alt = `captured ${move.captured} black piece`;
            elementImage.draggable = false;
            elementCapturedPiecesBlack.appendChild(elementImage);
        };
    };
    gameOver(){
        clearInterval(intervalTimer);
        this.setState({
            gameover: true
        });
        if(this.state.capturedWhitePiecesCount >= 5){
            let amount = Math.floor(this.state.capturedWhitePiecesCount / 5);
            this.props.gameProps.randomItem(amount);
        };
        this.props.gameProps.updateGameValue("gold", this.state.goldEarned);
        this.props.gameProps.updateGameValue("exp", this.state.goldEarned);
    };
    componentWillUnmount(){
        clearInterval(intervalTimer);
        clearTimeout(timeoutRandomMove);
    };
    render(){
        return(
            <Draggable position={{ x: this.props.position.x, y: this.props.position.y }}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("chess")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("chess");
                    this.props.defaultProps.updatePosition("chess", "games", data.x, data.y);
                }}
                cancel="button, #chess-board"
                bounds="parent">
                <div id="chess-widget"
                    className="widget flex-center column gap medium-gap">
                    {/* Chess Board */}
                    <section id="chess-board">
                        <Chessboard animationDuration={200}
                            arePiecesDraggable={false}
                            position={this.state.game.fen()}
                            onSquareClick={this.onSquareClick}
                            onSquareRightClick={this.onSquareRightClick}
                            onPromotionPieceSelect={this.onPromotionPieceSelect}
                            customSquareStyles={{
                                ...this.state.moveSquares,
                                ...this.state.optionSquares,
                                ...this.state.rightClickedSquares
                            }}
                            customArrowColor='var(--randColor)'
                            promotionToSquare={this.state.moveTo}
                            showPromotionDialog={this.state.promotionDialog}/>
                    </section>
                    <div id="chess-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="chess-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("chess", "games")}
                        {/* Information Container */}
                        <section className="aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold">
                            {/* Pieces Captured */}
                            <span className="text-animation flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#000", className: "global-class-name" }}>
                                    <FaRegChessPawn/>
                                </IconContext.Provider>
                                {this.state.capturedWhitePiecesCount}
                            </span>
                            {/* Gold Earned */}
                            <span className="text-animation flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                <span className="font small bold">+</span>
                                {this.state.goldEarned}
                            </span>
                            {/* Total Gold */}
                            <span className="text-animation flex-center row">
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
                        {/* Buttons */}
                        <section className="flex-center column gap">
                            <button className="button-match option opt-long"
                                onClick={() => this.handleButton("reset")}>Reset</button>
                            <button className="button-match option opt-long"
                                onClick={() => this.handleButton("undo")}>Undo</button>
                        </section>
                        {/* Captured Pieces */}
                        <section className="flex-center">
                            <div id="chess-captured-pieces-black"></div>
                        </section>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Me</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetChess);