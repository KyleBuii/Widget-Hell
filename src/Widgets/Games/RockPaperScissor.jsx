import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegClock } from 'react-icons/fa';
import { TbMoneybag } from 'react-icons/tb';
import SimpleBar from 'simplebar-react';


let intervalTimer;


class WidgetRockPaperScissor extends Component{
    constructor(props){
        super(props);
        this.state = {
            goldEarned: 0,
            timer: 0,
            score: 0,
            started: false,
            gameover: false,
            choicePlayer: "rock",
            choiceComputer: "rock"
        };
    };
    changeChoice(side, choice){
        let elementChoice = document.getElementById(`rockpaperscissor-choice-${side}`);
        elementChoice.src = `/resources/rockpaperscissor/${choice}.webp`;
        elementChoice.onerror = () => {
            elementChoice.onerror = null;
            elementChoice.src = `/resources/rockpaperscissor/${choice}.gif`;
        };
        this.setState({
            [`choice${side.replace(/^./, (char) => char.toUpperCase())}`]: choice
        });
    };
    begin(){
        if(intervalTimer === undefined){
            intervalTimer = setInterval(() => {
                this.setState({
                    timer: this.state.timer + 1
                });
            }, 1000);
        };
        let message = "";
        let gameStatus = true;
        let countScore = this.state.score;
        let choicePlayer = this.state.choicePlayer;
        let choices = Object.keys(this.props.rps);
        let choiceComputer = choices[Math.floor(Math.random() * choices.length)];
        this.changeChoice("computer", choiceComputer);
        /// Same choice
        if(choicePlayer === choiceComputer){
            message = "Draw";
        /// Lose
        }else if(this.props.rps[choicePlayer][choiceComputer] === undefined){
            if(this.props.rps[choiceComputer][choicePlayer] !== undefined){
                message = `${choiceComputer.replace(/^./, (char) => char.toUpperCase())} ${this.props.rps[choiceComputer][choicePlayer]} ${choicePlayer.replace(/^./, (char) => char.toUpperCase())}`;
                gameStatus = false;
            }else{
                message = "Draw";
            };
        /// Win
        }else{
            message = `${choicePlayer.replace(/^./, (char) => char.toUpperCase())} ${this.props.rps[choicePlayer][choiceComputer]} ${choiceComputer.replace(/^./, (char) => char.toUpperCase())}`;
            countScore++;
        };
        this.setState({
            score: countScore,
            started: gameStatus
        }, () => {
            let elementMessage = document.getElementById("rockpaperscissor-message");
            elementMessage.innerText = message;
            if(this.state.started === false){
                this.gameover();
            };
        });
    };
    gameover(){
        intervalTimer = clearInterval(intervalTimer);
        this.setState({
            goldEarned: this.state.score,
            gameover: true
        });
        if(this.state.score >= 2){
            let amount = Math.floor(this.state.score / 2);
            this.props.gameProps.randomItem(amount);
        };
        this.props.gameProps.updateGameValue("gold", this.state.score);
        this.props.gameProps.updateGameValue("exp", this.state.score);
    };
    restart(){
        this.setState({
            goldEarned: 0,
            timer: 0,
            score: 0,
            started: false,
            gameover: false
        });
        this.changeChoice("player", "rock");
        this.changeChoice("computer", "rock");
        let elementMessage = document.getElementById("rockpaperscissor-message");
        elementMessage.innerText = "";
    };
    componentWillUnmount(){
        clearInterval(intervalTimer);
    };
    render(){
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("rockpaperscissor")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("rockpaperscissor");
                    this.props.defaultProps.updatePosition("rockpaperscissor", "games", data.x, data.y);
                }}
                cancel="button, img"
                bounds="parent">
                <div id="rockpaperscissor-widget"
                    className="widget">
                    <div id="rockpaperscissor-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="rockpaperscissor-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("rockpaperscissor", "games")}
                        {/* Information Container */}
                        <section className="aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold">
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
                        {/* Choice */}
                        <section id="rockpaperscissor-choice"
                            className="font bold element-ends">
                            <div className="flex-center column gap">
                                <img id="rockpaperscissor-choice-player"
                                    style={{ transform: "scaleX(-1)" }}
                                    src={"/resources/rockpaperscissor/rock.webp"}
                                    alt="player rock"
                                    draggable="false"
                                    decoding="async"/>
                                <span>{this.state.choicePlayer.replace(/^./, (char) => char.toUpperCase())}</span>
                            </div>
                            <div className="flex-center column gap">
                                <span className="font medium bold">Score: {this.state.score}</span>
                                <span id="rockpaperscissor-message"
                                    className="font normal"></span>
                                {(!this.state.gameover)
                                    ? <button className="button-match"
                                        onClick={() => this.begin()}>
                                        {(!this.state.started) ? "Begin" : "Next"}
                                    </button>
                                    : <button className="button-match"
                                        onClick={() => this.restart()}>
                                        Restart
                                    </button>}
                            </div>
                            <div className="flex-center column gap">
                                <img id="rockpaperscissor-choice-computer"
                                    src={"/resources/rockpaperscissor/rock.webp"}
                                    alt="computer rock"
                                    draggable="false"
                                    decoding="async"/>
                                <span>{this.state.choiceComputer.replace(/^./, (char) => char.toUpperCase())}</span>
                            </div>
                        </section>
                        {/* Choices */}
                        <SimpleBar style={{ maxHeight: "10em" }}>
                            <div id="rockpaperscissor-container-choices">
                                {Object.keys(this.props.rps).map((choice) => {
                                    return <button className="button-match inverse"
                                        key={choice}
                                        onClick={() => {
                                            this.changeChoice("player", choice);
                                        }}
                                        disabled={this.state.gameover}>
                                        <img src={`/resources/rockpaperscissor/${choice}.webp`}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = `/resources/rockpaperscissor/${choice}.gif`;
                                            }}
                                            key={choice}
                                            alt={choice}
                                            draggable="false"
                                            decoding="async"/>
                                    </button>
                                })}
                            </div>
                        </SimpleBar>
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

export default memo(WidgetRockPaperScissor);