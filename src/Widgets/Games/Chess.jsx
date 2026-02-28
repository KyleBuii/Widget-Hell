import { Chess } from 'chess.js';
import React, { memo, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegClock } from 'react-icons/fa';
import { FaRegChessPawn } from 'react-icons/fa6';
import { TbMoneybag } from 'react-icons/tb';
import { classStack, decorationValue } from '../../data';

let timeoutRandomMove;
let intervalTimer;

const WidgetChess = ({ defaultProps, gameProps }) => {
    const [state, setState] = useState({
        game: new Chess(),
        moveFrom: '',
        moveTo: '',
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
    });

    useEffect(() => {
        defaultProps.incrementWidgetCounter();

        return () => {
            clearInterval(intervalTimer);
            clearTimeout(timeoutRandomMove);    
        };
    }, []);

    const onSquareClick = (square) => {
        if (!state.gameover) {
            setState((prevState) => ({
                ...prevState,
                rightClickedSquares: {}
            }));
            /// From square
            if (!state.moveFrom) {
                const hasMoveOptions = getMoveOptions(square);
                if (hasMoveOptions) {
                    setState((prevState) => ({
                        ...prevState,
                        moveFrom: square
                    }));
                };
                return;
            };
            /// To square
            if (!state.moveTo) {
                /// Check if valid move before showing dialog
                const moves = state.game.moves({
                    square: state.moveFrom,
                    verbose: true
                });
                const foundMove = moves.find((m) => m.from === state.moveFrom && m.to === square);
                /// Not a valid move
                if (!foundMove) {
                    /// Check if clicked on new piece
                    const hasMoveOptions = getMoveOptions(square);
                    /// If new piece, setMoveFrom, otherwise clear moveFrom
                    setState((prevState) => ({
                        ...prevState,
                        moveFrom: (hasMoveOptions) ? square : ''
                    }));
                    return;
                };
                /// Valid move
                setState((prevState) => ({
                    ...prevState,
                    moveTo: square
                }));
                /// If promotion move
                if (((foundMove.color === 'w')
                    && (foundMove.piece === 'p')
                    && (square[1] === '8'))
                    || ((foundMove.color === 'b')
                    && (foundMove.piece === 'p')
                    && (square[1] === '1'))) {
                    setState((prevState) => ({
                        ...prevState,
                        promotionDialog: true
                    }));
                    return;
                };
                /// Is normal move
                try {
                    const gameCopy = state.game;
                    let move = gameCopy.move({
                        from: state.moveFrom,
                        to: square,
                        promotion: 'q'
                    });
                    /// Set timer
                    if (intervalTimer === undefined) {
                        intervalTimer = setInterval(() => {
                            setState((prevState) => ({
                                ...prevState,
                                timer: prevState.timer + 1
                            }));
                        }, 1000);
                    };
                    updateData(move);
                    setState((prevState) => ({
                        ...prevState,
                        game: gameCopy
                    }));
                    timeoutRandomMove = setTimeout(randomMove(), 300);
                } catch(err) {
                    /// If invalid, setMoveFrom and getMoveOptions
                    const hasMoveOptions = getMoveOptions(square);
                    if (hasMoveOptions) {
                        setState((prevState) => ({
                            ...prevState,
                            moveFrom: square
                        }));
                    };
                    return;
                };
                setState((prevState) => ({
                    ...prevState,
                    moveFrom: '',
                    moveTo: null,
                    optionSquares: {}
                }));
                return;
            };
        };
    };

    const onPromotionPieceSelect = (piece) => {
        /// If no piece passed then user has cancelled dialog, don't make move and reset
        if (piece) {
            const gameCopy = state.game;
            let move = gameCopy.move({
                from: state.moveFrom,
                to: state.moveTo,
                promotion: piece[1].toLowerCase() ?? 'q'
            });
            updateData(move);
            setState((prevState) => ({
                ...prevState,
                game: gameCopy
            }));
            timeoutRandomMove = setTimeout(randomMove(), 300);
        };
        setState((prevState) => ({
            ...prevState,
            moveFrom: '',
            moveTo: null,
            promotionDialog: false,
            optionSquares: {}
        }));
        return true;
    };

    const onSquareRightClick = (square) => {
        const colour = 'rgba(0, 0, 255, 0.4)';
        setState((prevState) => ({
            ...prevState,
            rightClickedSquares: {
                ...state.rightClickedSquares,
                [square]: state.rightClickedSquares[square] && state.rightClickedSquares[square].backgroundColor === colour
                    ? undefined
                    : { backgroundColor: colour }
            }
        }));
    };

    const handleButton = (what) => {
        switch (what) {
            case 'reset': {
                document.getElementById('chess-captured-pieces-black').innerHTML = '';
                state.game.reset();
                clearInterval(intervalTimer);
                intervalTimer = undefined;
                setState((prevState) => ({
                    ...prevState,
                    goldEarned: 0,
                    timer: 0,
                    capturedBlackPieces: [],
                    capturedWhitePieces: [],
                    capturedWhitePiecesCount: 0,
                    gameover: false     
                }));
                break;
            };
            case 'undo': {
                let undoBlack = state.game.undo();
                let undoWhite = state.game.undo();
                if (!state.gameover && undoBlack !== null) {
                    if (undoBlack.captured) {
                        setState((prevState) => ({
                            ...prevState,
                            capturedWhitePieces: [...state.capturedWhitePieces.slice(0, -1)]
                        }));                
                    };
                    if (undoWhite.captured) {
                        const elementCapturedPiecesBlack = document.getElementById('chess-captured-pieces-black');
                        elementCapturedPiecesBlack.removeChild(elementCapturedPiecesBlack.lastChild);
                        setState((prevState) => ({
                            ...prevState,
                            capturedBlackPieces: [...state.capturedBlackPieces.slice(0, -1)]
                        }));
                    };
                    setState((prevState) => ({
                        ...prevState,
                        goldEarned: state.goldEarned - 1,
                        capturedWhitePiecesCount: state.capturedWhitePiecesCount - 1        
                    }));            
                };
                break;
            };
            default: { break; };
        };
        clearTimeout(timeoutRandomMove);
        setState((prevState) => ({ ...prevState }));
    };

    const getMoveOptions = (square) => {
        const moves = state.game.moves({
            square,
            verbose: true
        });
        if (moves.length === 0) {
            setState((prevState) => ({
                ...prevState,
                optionSquares: {}
            }));
            return false;
        };
        const newSquares = {};
        moves.map((move) => {
            newSquares[move.to] = {
                background: (state.game.get(move.to)
                    && (state.game.get(move.to).color !== state.game.get(square).color))
                    ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                borderRadius: '50%'
            };
            return move;
        });
        newSquares[square] = {
            background: 'rgba(255, 255, 0, 0.4)'
        };
        setState((prevState) => ({
            ...prevState,
            optionSquares: newSquares
        }));
        return true;
    };

    const randomMove = () => {
        const possibleMoves = state.game.moves();
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        /// Check if player has won
        if (state.game.isGameOver()
            || state.game.isCheckmate()
            || state.game.isDraw()
            || state.game.isStalemate()
            || possibleMoves.length === 0) {
            gameOver();
            return;
        };
        state.game.move(possibleMoves[randomIndex]);
    };

    const updateData = (move) => {
        let gold = 1;
        if (move.captured === 'q' || move.captured === 'k') {
            gold = 5;
        };
        if (move.captured) {
            setState((prevState) => ({
                ...prevState,
                capturedBlackPieces: [...state.capturedBlackPieces, move.captured],
                capturedWhitePiecesCount: prevState.capturedWhitePiecesCount + 1,
                goldEarned: state.goldEarned + gold
            }));    
            const elementCapturedPiecesBlack = document.getElementById('chess-captured-pieces-black');
            const elementImage = document.createElement('img');
            elementImage.src = `/resources/chess/b${move.captured.toUpperCase()}.webp`;
            elementImage.alt = `captured ${move.captured} black piece`;
            elementImage.draggable = false;
            elementImage.loading = 'lazy';
            elementImage.decoding = 'async';
            elementCapturedPiecesBlack.appendChild(elementImage);
        };
    };

    const gameOver = () => {
        clearInterval(intervalTimer);

        setState((prevState) => ({
            ...prevState,
            gameover: true
        }));

        if (state.capturedWhitePiecesCount >= 4) {
            let amount = Math.floor(state.capturedWhitePiecesCount / 4);
            gameProps.randomItem(amount);
        };

        gameProps.updateGameValue('gold', state.goldEarned);
        gameProps.updateGameValue('exp', state.goldEarned);
    };
    
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('chess')}
            onStop={(event, data) => {
                defaultProps.dragStop('chess');
                defaultProps.updatePosition('chess', 'games', data.x, data.y);
            }}
            cancel='button, #chess-board'
            bounds='parent'>
            <section id='chess-widget'
                className='widget flex-center column gap medium-gap'
                aria-labelledby='chess-widget-heading'>
                <h2 id='chess-widget-heading'
                    className='screen-reader-only'>Chess Widget</h2>
                <div id='chess-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='chess-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    <img className={`decoration ${decorationValue}`}
                        src={`/resources/decoration/${decorationValue}.webp`}
                        alt={decorationValue}
                        key={decorationValue}
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                        loading='lazy'
                        decoding='async'/>
                    {defaultProps.renderHotbar('chess', 'games')}
                    {/* Chess Board */}
                    <div id='chess-board'>
                        <Chessboard animationDuration={200}
                            arePiecesDraggable={false}
                            position={state.game.fen()}
                            onSquareClick={onSquareClick}
                            onSquareRightClick={onSquareRightClick}
                            onPromotionPieceSelect={onPromotionPieceSelect}
                            customSquareStyles={{
                                ...state.moveSquares,
                                ...state.optionSquares,
                                ...state.rightClickedSquares
                            }}
                            customArrowColor='var(--randColor)'
                            promotionToSquare={state.moveTo}
                            showPromotionDialog={state.promotionDialog}/>
                    </div>
                    <div>
                        {/* Information Container */}
                        <div className='aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold'>
                            {/* Pieces Captured */}
                            <span className='text-animation flex-center row'>
                                <IconContext.Provider value={{ size: gameProps.gameIconSize, color: '#000', className: 'global-class-name' }}>
                                    <FaRegChessPawn/>
                                </IconContext.Provider>
                                {state.capturedWhitePiecesCount}
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
                        {/* Buttons */}
                        <div className='flex-center column gap'>
                            <button className='button-match option opt-long'
                                onClick={() => handleButton('reset')}>Reset</button>
                            <button className='button-match option opt-long'
                                onClick={() => handleButton('undo')}>Undo</button>
                        </div>
                        {/* Captured Pieces */}
                        <div className='flex-center'>
                            <div id='chess-captured-pieces-black'></div>
                        </div>
                    </div>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetChess);