import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaQuestion, FaRegClock } from 'react-icons/fa';
import { Fa0, FaExpand } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { TbMoneybag } from 'react-icons/tb';
import Select from "react-select";
import sanitizeHtml from 'sanitize-html';


/// Variables
const optionsCategory = [
    {
        label: "Category",
        options: [
            {value: "", label: "Any"}
        ]
    }
];
const optionsDifficulty = [
    {
        label: "Difficulty",
        options: [
            {value: "", label: "Any"},
            {value: "easy", label: "Easy"},
            {value: "medium", label: "Medium"},
            {value: "hard", label: "Hard"}
        ]
    }
];
const optionsType = [
    {
        label: "Type",
        options: [
            {value: "", label: "Any"},
            {value: "multiple", label: "Multiple Choice"},
            {value: "boolean", label: "True / False"}
        ]
    }
];
let intervalTimer;


class WidgetTrivia extends Component{
    constructor(props){
        super(props);
        this.state = {
            goldEarned: 0,
            timer: 0,
            running: false,
            gameOver: false,
            questionCount: 0,
            sessionToken: "",
            amount: 1,
            category: {value: "", label: "Any"},
            difficulty: {value: "", label: "Any"},
            type: {value: "", label: "Any"},
            categories: [],
            difficulties: [],
            questions: [],
            choices: [],
            correctChoices: [],
            maxHealth: 1,
            health: 1
        };
        this.handleNumber = this.handleNumber.bind(this);
        this.handleChoice = this.handleChoice.bind(this);
        this.gameOver = this.gameOver.bind(this);
    };
    handleNumber(event){
        if(event.target.value === ""){
            this.setState({
                amount: event.target.value
            });
        }else if(event.target.value < 1){
            this.setState({
                amount: 1
            });
        }else if(event.target.value > 50){
            this.setState({
                amount: 50
            });
        }else{
            this.setState({
                amount: Number(event.target.value)
            });
        };
    };
    handleSelect(selectType, event){
        this.setState({
            [selectType]: event
        });
    };
    async fetchTrivia(){
        if(this.state.amount !== ""){
            try{
                this.setState({
                    running: true
                });
                if(intervalTimer === undefined){
                    intervalTimer = setInterval(() => {
                        this.setState({
                            timer: this.state.timer + 1
                        });
                    }, 1000);
                };
                const urlTrivia = `https://opentdb.com/api.php?amount=${this.state.amount}&category=${this.state.category.value}&difficulty=${this.state.difficulty.value}&type=${this.state.type.value}&token=${this.state.sessionToken}`;
                const responseTrivia = await fetch(urlTrivia);
                const resultTrivia = await responseTrivia.json();
                /// Token not found | Token empty | Doesn't exist
                if(/3|4/.test(resultTrivia.response_code) || (this.state.sessionToken === "")){
                    const urlSessionToken = "https://opentdb.com/api_token.php?command=request";
                    const responseSessionToken = await fetch(urlSessionToken);
                    const resultSessionToken = await responseSessionToken.json();
                    this.setState({
                        sessionToken: resultSessionToken.token
                    });
                };
                var generatedCategories = [];
                var generatedDifficulties = [];
                var generatedQuestions = [];
                var generatedChoices = [];
                var generatedCorrectChoices = [];
                for(let i of resultTrivia.results){
                    generatedCategories.push(i.category);
                    generatedDifficulties.push(i.difficulty
                        .replace(/^./, (char) => char.toUpperCase())
                    );
                    generatedQuestions.push(i.question);
                    generatedChoices.push([
                        ...i["incorrect_answers"]
                    ]);
                    generatedChoices[generatedChoices.length - 1].splice(
                        Math.floor(Math.random() * (generatedChoices[generatedChoices.length - 1].length + 1)),
                        0,
                        i.correct_answer
                    );
                    generatedCorrectChoices.push(i.correct_answer);
                };
                this.setState({
                    categories: [...generatedCategories],
                    difficulties: [...generatedDifficulties],
                    questions: [...generatedQuestions],
                    choices: [...generatedChoices],
                    correctChoices: [...generatedCorrectChoices]
                });
            }catch(err){
                console.error(err);
                document.getElementById("trivia-overlay-customize")
                    .style.display = "block";
                this.setState({
                    running: false
                });    
            }finally{
                document.getElementById("trivia-overlay-customize")
                    .style.display = "none";   
                this.setState({
                    running: false
                });    
            };
        }else{
            document.getElementById("trivia-overlay-customize")
                .style.display = "block";
        };
    };
    handleChoice(choice, index){
        if(choice === this.state.correctChoices[this.state.questionCount]){
            let gold;
            switch(this.state.difficulties[this.state.questionCount]){
                case "Easy":
                    gold = 1;
                    break;
                case "Medium":
                    gold = 2;
                    break;
                case "Hard":
                    gold = 3;
                    break;
                default:
                    break;
            };
            if((this.state.questionCount + 1) === this.state.amount){
                this.gameOver();
            }else{
                this.setState({
                    questionCount: this.state.questionCount + 1,
                    goldEarned: this.state.goldEarned + gold
                });
                this.resetButtons();
            };
        }else{
            let buttonChoice = document.getElementById(`trivia-button-${index}`);
            this.setState({
                health: this.state.health - 1
            }, () => {
                buttonChoice.className += " button-incorrect";
                if(this.state.health <= 0){
                    this.gameOver();
                }else{
                    buttonChoice.style.opacity = "0.5";
                };
            });
        };
    };
    gameOver(){
        let indexButtonCorrect = this.state.choices[this.state.questionCount].indexOf(this.state.correctChoices[this.state.questionCount]);
        document.getElementById(`trivia-button-${indexButtonCorrect}`)
            .className += " button-correct";
        this.setState({
            gameOver: true
        });
        intervalTimer = clearInterval(intervalTimer);
        if((this.state.questionCount + 1) >= 5){
            let amount = Math.floor((this.state.questionCount + 1) / 5);
            this.props.gameProps.randomItem(amount);
        };
        this.props.gameProps.updateGameValue("gold", this.state.goldEarned);
    };
    resetGame(){
        document.getElementById("trivia-overlay-customize")
            .style.display = "block";
        this.setState({
            goldEarned: 0,
            timer: 0,
            gameOver: false,
            health: this.state.maxHealth,
            questionCount: 0,
            categories: [],
            difficulties: [],
            questions: [],
            choices: []
        });
        this.resetButtons();
    };
    resetButtons(){
        for(let i = 0; i < document.getElementById("trivia-choices").children.length; i++){
            let buttonChoice = document.getElementById(`trivia-button-${i}`);
            if(buttonChoice.classList.contains("button-correct")){
                buttonChoice.classList.remove("button-correct");
            };
            if(buttonChoice.classList.contains("button-incorrect")){
                buttonChoice.classList.remove("button-incorrect");
            };
            buttonChoice.style.opacity = "1";
        };
    };
    calculateHealth(){
        if(this.props.gameProps.stats.health < 10){
            return 1;
        }else{
            return Math.floor(this.props.gameProps.stats.health / 10);
        };
    };
    async componentDidMount(){
        document.getElementById("trivia-overlay-customize")
            .style.display = "block";
        /// Populate category options
        if(optionsCategory[0]["options"].length <= 1){
            try{
                const url = "https://opentdb.com/api_category.php";
                const response = await fetch(url);
                const result = await response.json();
                for(let i of result["trivia_categories"]){
                    optionsCategory[0]["options"].push({
                        label: i.name,
                        value: i.id
                    });
                };
            }catch(err){
                console.error(err);
            };
        };
        this.props.sortSelect(optionsCategory);
        if(sessionStorage.getItem("trivia") !== null){
            this.setState({
                sessionToken: sessionStorage.getItem("trivia")
            });
        };
        let calculateMaxHealth = this.calculateHealth();
        this.setState({
            maxHealth: calculateMaxHealth,
            health: calculateMaxHealth
        });
    };
    componentWillUnmount(){
        clearInterval(intervalTimer);
        if(JSON.stringify(sessionStorage.getItem("trivia")) !== this.state.sessionToken){
            sessionStorage.setItem("trivia", this.state.sessionToken);
        };
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("trivia")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("trivia");
                    this.props.defaultProps.updatePosition("trivia", "games", data.x, data.y);
                }}
                cancel="span, button, input, label, .select-match, #trivia-reset"
                bounds="parent">
                <div id="trivia-widget"
                    className="widget">
                    <div id="trivia-widget-animation"
                        className="widget-animation">
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Me</span>
                            : <></>}
                        {/* Drag Handle */}
                        <span id="trivia-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("trivia", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("trivia", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("trivia", "close", "games")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
                        {/* Information Container */}
                        <section className="aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold">
                            {/* Question Number */}
                            <span className="text-animation flex-center row gap">
                                <IconContext.Provider value={{ size: "0.75em", className: "global-class-name" }}>
                                    <FaQuestion/>
                                </IconContext.Provider>
                                {this.state.questionCount + 1}/{(this.state.amount === "") ? 1 : this.state.amount}
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
                        {/* Customize Trivia Overlay */}
                        <section id="trivia-overlay-customize"
                            className="overlay rounded">
                            <div className="aesthetic-scale scale-span font flex-center column gap small-gap only-justify-content fill-width">
                                <label htmlFor="trivia-input-number-of-questions"
                                    className="aesthetic-scale scale-self origin-left">Number of Questions</label>
                                <input id="trivia-input-number-of-questions"
                                    className="input-match"
                                    type="number"
                                    value={this.state.amount}
                                    min={1}
                                    max={50}
                                    name="trivia-input-number-of-questions"
                                    onChange={this.handleNumber}
                                    required
                                    placeholder="# of Questions"/>
                                <span className="origin-left">Select Category</span>
                                <Select className="select-match"
                                    value={this.state.category}
                                    defaultValue={optionsCategory[0]["options"][0]}
                                    onChange={(event) => this.handleSelect("category", event)}
                                    options={optionsCategory}
                                    formatGroupLabel={this.props.formatGroupLabel}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            ...this.props.selectTheme
                                        }
                                    })}/>
                                <span className="origin-left">Select Difficulty</span>
                                <Select className="select-match"
                                    value={this.state.difficulty}
                                    defaultValue={optionsDifficulty[0]["options"][0]}
                                    onChange={(event) => this.handleSelect("difficulty", event)}
                                    options={optionsDifficulty}
                                    formatGroupLabel={this.props.formatGroupLabel}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            ...this.props.selectTheme
                                        }
                                    })}/>
                                <span className="origin-left">Select Type</span>
                                <Select className="select-match"
                                    value={this.state.type}
                                    defaultValue={optionsType[0]["options"][0]}
                                    onChange={(event) => this.handleSelect("type", event)}
                                    options={optionsType}
                                    formatGroupLabel={this.props.formatGroupLabel}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            ...this.props.selectTheme
                                        }
                                    })}/>
                            </div>
                            <button className="button-match fill-width space-nicely space-top not-bottom"
                                onClick={() => this.fetchTrivia()}
                                disabled={this.state.running}>Start Trivia</button>
                        </section>
                        {/* Question and Choices */}
                        <section id="trivia-questions"
                            className="aesthetic-scale scale-span flex-center column gap large-gap">
                            {/* Question */}
                            <div className="flex-center column gap small-gap font space-nicely space-top not-bottom">
                                <span className="text-animation font bold medium"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(this.state.categories[this.state.questionCount], {
                                            allowedTags: [],
                                            allowedAttributes: [],
                                            allowedIframeHostnames: []
                                        })
                                    }}></span>
                                <span className={`text-animation difficulty ${this.state.difficulties[this.state.questionCount]?.toLowerCase()}`}>
                                    {this.state.difficulties[this.state.questionCount]}
                                </span>
                                <span dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(this.state.questions[this.state.questionCount], {
                                        allowedTags: [],
                                        allowedAttributes: [],
                                        allowedIframeHostnames: []
                                    })
                                }}></span>
                            </div>
                            {/* Choices */}
                            <div id="trivia-choices"
                                className="flex-center column gap small-gap">
                                {this.state.choices[this.state.questionCount]?.map((choice, index) => {
                                    return <button id={`trivia-button-${index}`}
                                        className="button-match fill-width"
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizeHtml(choice, {
                                                allowedTags: [],
                                                allowedAttributes: [],
                                                allowedIframeHostnames: []
                                            })
                                        }}
                                        key={`button-${index}`}
                                        onClick={() => this.handleChoice(choice, index)}
                                        disabled={this.state.gameOver}></button>;
                                })}
                            </div>
                            {(this.state.gameOver)
                                ? <div id="trivia-reset"
                                    className="font medium flex-center row gap"
                                    onClick={() => this.resetGame()}>
                                    Click<div> here </div>to reset
                                </div>
                                : <></>}
                        </section>
                        {/* Hearts */}
                        {(this.props.gameProps.healthDisplay !== "none") 
                            ? <section id="trivia-health"
                                className="flex-center space-nicely space-top not-bottom">
                                {this.props.gameProps.renderHearts(this.state.health).map((heart) => {
                                    return heart;
                                })}
                            </section>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetTrivia);