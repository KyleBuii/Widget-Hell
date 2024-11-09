import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegClock } from 'react-icons/fa';
import { Fa0, FaExpand } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { TbMoneybag } from 'react-icons/tb';
import SimpleBar from 'simplebar-react';


let choicePlayer = "";


class WidgetRockPaperScissor extends Component{
    constructor(props){
        super(props);
        this.state = {
            goldEarned: 0,
            timer: 0,
            score: 0,
            started: false,
            gameover: false
        };
    };
    changeChoice(choice){
        let elementChoice = document.getElementById("rockpaperscissor-choice-player");
        elementChoice.src = `/resources/rockpaperscissor/${choice}.png`;
        elementChoice.onerror = () => {
            elementChoice.onerror = null;
            elementChoice.src = `/resources/rockpaperscissor/${choice}.gif`;
        };
        choicePlayer = choice;
    };
    begin(){
        let message = "";
        let countScore = 0;
        let gameStatus = false;
        let choices = Object.keys(this.props.rps);
        let choiceComputer = choices[Math.floor(Math.random() * choices.length)];
        /// Lose
        if(this.props.rps[choicePlayer][choiceComputer] === undefined){
            elementMessage.innerText = this.props.rps[choicePlayer][choiceComputer];
            console.log("lose")
        /// Win
        }else{
            message = this.props.rps[choicePlayer][choiceComputer];
            countScore++;
            gameStatus = true;
            console.log("win")
        };
        this.setState({
            score: countScore,
            started: gameStatus
        }, () => {
            let elementMessage = document.getElementById("rockpaperscissor-message");
            elementMessage.innerText = `${choicePlayer} ${message} ${choiceComputer}`;
        });
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
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
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("rockpaperscissor", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("rockpaperscissor", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("rockpaperscissor", "close", "games")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
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
                            <span className="text-animation flex-center row float middle">
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
                        <section className="flex-center row gap large-gap"
                            style={{
                                marginBottom: "1em"
                            }}>
                            <img id="rockpaperscissor-choice-player"
                                style={{ transform: "scaleX(-1)" }}
                                src={"/resources/rockpaperscissor/rock.png"}
                                alt="player rock"
                                draggable="false"/>
                            <div className="flex-center column gap">
                                <span className="font medium bold">Score: {this.state.score}</span>
                                {(!this.state.started)
                                    ? <button className="button-match"
                                        onClick={() => this.begin()}>
                                        Begin
                                    </button>
                                    : <span id="rockpaperscissor-message"
                                        className="font"></span>}
                            </div>
                            <img id="rockpaperscissor-choice-computer"
                                src={"/resources/rockpaperscissor/rock.png"}
                                alt="computer rock"
                                draggable="false"/>
                        </section>
                        {/* Choices */}
                        <SimpleBar style={{ maxHeight: "10em" }}>
                            <div id="rockpaperscissor-container-choices">
                                {Object.keys(this.props.rps).map((choice) => {
                                    return <button className="button-match inverse"
                                        key={choice}
                                        onClick={() => {
                                            this.changeChoice(choice);
                                        }}
                                        disabled={this.state.gameover}>
                                        <img src={`/resources/rockpaperscissor/${choice}.png`}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = `/resources/rockpaperscissor/${choice}.gif`;
                                            }}
                                            key={choice}
                                            alt={choice}
                                            draggable="false"></img>
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