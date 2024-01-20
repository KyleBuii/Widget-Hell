import { React, Component } from 'react';
import Draggable from 'react-draggable';
import { FaGripHorizontal, FaRandom } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Switch from 'react-switch';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import $ from 'jquery';


class WidgetSetting extends Component{
    constructor(props){
        super(props);
        this.state = {
            showHideWidgets: false,
            search: "",
            widgetsBtn: {                   /// Widgets Buttons
                widgetsBtnUtility: {
                    quoteBtn: true,
                    translatorBtn: true,
                    googleTranslatorBtn: true,
                    calculatorBtn: true,
                    weatherBtn: true
                },
                widgetsBtnGames: {
                    snakeBtn: true,
                    textRPGBtn: true
                },
                widgetsBtnFun: {
                }
            },
            utilityTab: true,               /// Tabs
            gamesTab: false,
            funTab: false,
            settings: false,                /// Settings
            screenDimmer: false,
            screenDimmerValue: ""
        };
        this.handleTrick = this.handleTrick.bind(this);
        this.handlePressableBtn = this.handlePressableBtn.bind(this);
        this.handleToggleableBtn = this.handleToggleableBtn.bind(this);
        this.handleSlider = this.handleSlider.bind(this);
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    };
    /// Remove element at index "i" where order doesn't matter
    unorderedRemove(arr, i){
        if(i < 0 || i >= arr.length){
            return;
        };
        if(i < arr.length-1){
            arr[i] = arr[arr.length-1];
        };
        arr.length -= 1;
        return arr;
    };
    /// Choose random option in select
    randomOption(select){
        let rand;
        switch(select){
            case "animation":
                rand = this.props.varAnimations[Math.floor(Math.random() * this.props.varAnimations.length)];
                $("#settings-popout-design-select-animation").val(rand);
                this.handleSelect(rand, "animation");
                break;
            case "background":
                rand = this.props.varBackgrounds[Math.floor(Math.random() * this.props.varBackgrounds.length)];
                $("#settings-popout-design-select-background").val(rand);
                this.handleSelect(rand, "background");
                break;
            case "custom-border":
                rand = this.props.varCustomBorders[Math.floor(Math.random() * this.props.varCustomBorders.length)];
                $("#settings-popout-design-select-custom-border").val(rand);
                this.handleSelect(rand, "custom-border");
                break;
            default:
                break;
        };

    };
    handleTrick(){
        const combinedWidgets = [...this.props.varWidgetsUtilityActive, ...this.props.varWidgetsGamesActive];
        if(combinedWidgets.length !== 0){
            const randIndexWidget = Math.floor(Math.random() * combinedWidgets.length);
            const randIndexAnimation = Math.floor(Math.random() * this.props.varTricks.length);
            const e = document.getElementById(combinedWidgets[randIndexWidget] + "-widget-animation");
            e.style.animation = "none";
            window.requestAnimationFrame(() => {
                e.style.animation = this.props.varTricks[randIndexAnimation] + " 2s";
            });
        };
    };
    /// Handles all pressable buttons (opacity: 0.5 on click)
    handlePressableBtn(what, where){
        switch(what){
            case "showHideWidgets":
                const btnShowHideWidgets = document.getElementById("settings-btn-show-hide-widgets");
                const showHideWidgetsPopout = document.getElementById("show-hide-widgets-popout");
                if(this.state.showHideWidgets === false){
                    this.setState({
                        showHideWidgets: true
                    });
                    btnShowHideWidgets.style.opacity = "1";
                    showHideWidgetsPopout.style.visibility = "visible";
                    if(this.props.varAnimationValue !== "default"){
                        showHideWidgetsPopout.style.animation = "none";
                        window.requestAnimationFrame(() => {
                            showHideWidgetsPopout.style.animation = this.props.varAnimationValue + "In 2s";
                        });
                    };
                }else{
                    this.setState({
                        showHideWidgets: false
                    });
                    btnShowHideWidgets.style.opacity = "0.5";
                    showHideWidgetsPopout.style.visibility = "hidden";
                    if(this.props.varAnimationValue !== "default"){
                        showHideWidgetsPopout.style.animation = "none";
                        window.requestAnimationFrame(() => {
                            showHideWidgetsPopout.style.animation = this.props.varAnimationValue + "Out 2s";
                        });
                    };
                };    
                break;
            case "settings":
                const btnSettings = document.getElementById("settings-btn-settings");
                const settingsPopout = document.getElementById("settings-popout");
                if(this.state.settings === false){
                    this.setState({
                        settings: true
                    });
                    btnSettings.style.opacity = "1";
                    settingsPopout.style.visibility = "visible";
                    if(this.props.varAnimationValue !== "default"){
                        settingsPopout.style.animation = "none";
                        window.requestAnimationFrame(() => {
                            settingsPopout.style.animation = this.props.varAnimationValue + "In 2s";
                        });
                    };
                }else{
                    this.setState({
                        settings: false
                    });
                    btnSettings.style.opacity = "0.5";
                    settingsPopout.style.visibility = "hidden";
                    if(this.props.varAnimationValue !== "default"){
                        settingsPopout.style.animation = "none";
                        window.requestAnimationFrame(() => {
                            settingsPopout.style.animation = this.props.varAnimationValue + "Out 2s";
                        });
                    };
                };
                break;
            default:
                const btn = document.getElementById("show-hide-widgets-popout-btn-" + what);
                this.props.funcShowHide(what, where);
                if(this.props.widgets[what] === false){
                    btn.style.opacity = "1";
                    this.props.funcUpdateWidgetsActive(what, where);
                }else{
                    btn.style.opacity = "0.5";
                    switch(where){
                        case "utility":
                            const widgetUtilityIndex = this.props.varWidgetsUtilityActive.indexOf(what);
                            this.unorderedRemove(this.props.varWidgetsUtilityActive, widgetUtilityIndex);
                            break;
                        case "games":
                            const widgetGamesIndex = this.props.varWidgetsGamesActive.indexOf(what);
                            this.unorderedRemove(this.props.varWidgetsGamesActive, widgetGamesIndex);
                            break;
                        case "fun":
                            const widgetFunIndex = this.props.varWidgetsFunActive.indexOf(what);
                            this.unorderedRemove(this.props.varWidgetsFunActive, widgetFunIndex);
                            break;
                        default:
                            break;
                    };
                };
                break;
        };
    };
    /// Handles all toggleable buttons (switch)
    handleToggleableBtn(value, what){
        switch(what){
            case "btn-screen-dimmer":
                const bg = document.getElementById("App");
                this.setState({
                    screenDimmer: value
                }, () => {
                    if(this.state.screenDimmer === true){
                        bg.style.filter = "brightness(" + this.state.screenDimmerValue + "%)";
                    }else{
                        bg.style.filter = "brightness(100%)";
                    };
                });
                break;
            default:
                break;
        };
    };
    /// Handles all sliders
    handleSlider(value, what){
        switch(what){
            case "slider-screen-dimmer":
                const bg = document.getElementById("App");
                this.setState({
                    screenDimmerValue: value
                }, () => {
                    if(this.state.screenDimmer === true){
                        bg.style.filter = "brightness(" + this.state.screenDimmerValue + "%)";
                    };
                });
                break;
            default:
                break;
        };
    };
    /// Handles all selects
    handleSelect(what, where){
        switch(where){
            case "animation":
                this.props.funcUpdateValue(what, where);
                break;
            case "background":
                const e = document.getElementById("App");
                switch(what){
                    case "default":
                        e.style.backgroundColor = "var(--randColor)";
                        e.style.backgroundImage = "none";
                        break;
                    case "white":
                        e.style.backgroundColor = "white";
                        e.style.backgroundImage = "none";
                        break;
                    case "linear-gradient":
                        e.style.backgroundImage = "linear-gradient(var(--randColor), var(--randColorLight))";
                        break;
                    default:
                        break;
                };
                break;
            case "custom-border":
                this.props.funcUpdateValue(what, "customBorder");
                break;
            default:
                break;
        };
    };
    /// Handles all checkboxes
    handleCheckbox(what, where){
        this.props.funcUpdateFeature(what, where);
    };
    handleTabSwitch(what){
        const allTabs = ["utility", "games", "fun"];
        for(const i in allTabs){
            this.setState({
                [allTabs[i] + "Tab"]: false
            });
        };
        this.setState({
            search: "",
            [what + "Tab"]: true
        }, () => {
            this.updateSearch(this.state.search);
        });
    };
    updateTab(what){
        switch(what){
            case "utility":
                for(var currUtilityWidget in this.props.varWidgetsUtilityActive){
                    const btn = document.getElementById("show-hide-widgets-popout-btn-" + this.props.varWidgetsUtilityActive[currUtilityWidget]);
                    btn.style.opacity = "1";
                };
                break;
            case "games":
                for(var currGamesWidget in this.props.varWidgetsGamesActive){
                    const btn = document.getElementById("show-hide-widgets-popout-btn-" + this.props.varWidgetsGamesActive[currGamesWidget]);
                    btn.style.opacity = "1";
                };
                break;
            case "fun":
                for(var currFunWidget in this.props.varWidgetsFunActive){
                    const btn = document.getElementById("show-hide0widgets-popout-btn-" + this.props.varWidgetsFunActive[currFunWidget]);
                    btn.style.opacity = "1";
                };
                break;
            default:
                break;
        };
    };
    handleSearch(event){
        this.setState({
            search: event.target.value
        }, () => {
            this.updateSearch(this.state.search);
        });
    };
    updateSearch(what){
        var widgetsBtnKeys, widgetsBtnUpdate, widgetsBtnType, currTab;
        var widgetsMatch = [];
        if(this.state.utilityTab === true){
            widgetsBtnKeys = Object.keys(this.state.widgetsBtn.widgetsBtnUtility);
            widgetsBtnUpdate = this.state.widgetsBtn.widgetsBtnUtility;
            widgetsBtnType = "widgetsBtnUtility";
            currTab = "utility";
        }else if(this.state.gamesTab === true){
            widgetsBtnKeys = Object.keys(this.state.widgetsBtn.widgetsBtnGames);
            widgetsBtnUpdate = this.state.widgetsBtn.widgetsBtnGames;
            widgetsBtnType = "widgetsBtnGames";
            currTab = "games";
        }else if(this.state.funTab === true){
            widgetsBtnKeys = Object.keys(this.state.widgetsBtn.widgetsBtnFun);
            widgetsBtnUpdate = this.state.widgetsBtn.widgetsBtnFun;
            widgetsBtnType = "widgetsBtnFun";
            currTab = "fun";
        };
        if(what.length <= 2){
            for(const i in widgetsBtnKeys){
                widgetsBtnUpdate[widgetsBtnKeys[i]] = true;
            };
            widgetsMatch.length = 0;
        }else if(what.length >= 3){
            const reSearch = new RegExp("(" + what + ")", "i");
            for(const i in widgetsBtnKeys){
                const slicedKey = widgetsBtnKeys[i].slice(0, widgetsBtnKeys[i].length-3);
                if(reSearch.test(slicedKey)){
                    widgetsBtnUpdate[widgetsBtnKeys[i]] = true;
                    widgetsMatch.push(slicedKey);
                }else{
                    widgetsBtnUpdate[widgetsBtnKeys[i]] = false;
                };
            };
        };
        this.setState(prevState => ({
            widgetsBtn: {
                ...prevState.widgetsBtn,
                [widgetsBtnType]: widgetsBtnUpdate
            }
        }), () => {
            if(what.length <= 2){
                this.updateTab(currTab, this.state.widgetsSearch);
            };
        });
    };
    render(){
        return(
            <Draggable
                onStart={() => this.props.funcDragStart("settings")}
                onStop={() => this.props.funcDragStop("settings")}
                cancel="button, span, p, section"
                bounds="parent">
                <div id="settings-widget"
                    className="widget">
                    <div id="settings-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="settings-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "3em", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <section className="font large-medium no-color grid">
                            <button id="settings-btn-show-hide-widgets"
                                className="btn-match option opt-long disabled-option"
                                onClick={() => this.handlePressableBtn("showHideWidgets")}>Show/Hide Widgets</button>
                            <button id="settings-btn-settings"
                                className="btn-match option opt-long disabled-option"
                                onClick={() => this.handlePressableBtn("settings")}>Settings</button>
                            <section className="flex-center row gap">
                                <button className="btn-match option opt-medium"
                                    onClick={this.handleTrick}>Do a trick!</button>
                            </section>
                        </section>
                        {/* Show/Hide Widgets Popout */}
                        <Draggable
                            cancel="button, #show-hide-widgets-popout-tabs"
                            defaultPosition={{x: 30, y: -55}}
                            bounds={{top: -240, left: -360, right: 420, bottom: 8}}>
                            <section id="show-hide-widgets-popout"
                                className="popout">
                                <Tabs defaultIndex={0}>
                                    <TabList id="show-hide-widgets-popout-tabs">
                                        <Tab onClick={() => this.handleTabSwitch("utility")}>Utility</Tab>
                                        <Tab onClick={() => this.handleTabSwitch("games")}>Games</Tab>
                                        <Tab onClick={() => this.handleTabSwitch("fun")}>Fun</Tab>
                                        <input id="show-hide-widgets-popout-search"
                                            className="input-typable all-side"
                                            type="text"
                                            placeholder="Search"
                                            value={this.state.search}
                                            onChange={this.handleSearch}></input>
                                    </TabList>
                                    {/* Utility */}
                                    <TabPanel>
                                        <section id="show-hide-widgets-popout-btn-utility"
                                            className="font large-medium no-color grid col-2 spread-long space-nicely all">
                                            {(this.state.widgetsBtn.widgetsBtnUtility["quoteBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-quote"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("quote", "utility")}>Quote</button>
                                                : <></>}
                                            {(this.state.widgetsBtn.widgetsBtnUtility["translatorBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-translator"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("translator", "utility")}>Translator</button>
                                                : <></>}
                                            {(this.state.widgetsBtn.widgetsBtnUtility["googleTranslatorBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-googletranslator"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("googletranslator", "utility")}>Google Translator</button>
                                                : <></>}
                                            {(this.state.widgetsBtn.widgetsBtnUtility["calculatorBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-calculator"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("calculator", "utility")}>Calculator</button>
                                                : <></>}
                                            {(this.state.widgetsBtn.widgetsBtnUtility["weatherBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-weather"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("weather", "utility")}>Weather</button>
                                                : <></>}
                                        </section>
                                    </TabPanel>
                                    {/* Games */}
                                    <TabPanel>
                                        <section id="show-hide-widgets-popout-btn-games"
                                            className="font large-medium no-color grid col-2 spread-long space-nicely all">
                                            {(this.state.widgetsBtn.widgetsBtnGames["snakeBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-snake"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("snake", "games")}>Snake</button>
                                                : <></>}
                                        </section>
                                    </TabPanel>
                                    {/* Fun */}
                                    <TabPanel>
                                        <section id="show-hide-widgets-popout-btn-fun"
                                            className="font large-medium no-color grid col-2 spread-long space-nicely all">
                                        </section>
                                    </TabPanel>
                                </Tabs>
                            </section>
                        </Draggable>
                        {/* Settings Popout */}
                        <Draggable
                            cancel="span, .toggleable, .slider, select"
                            defaultPosition={{x: 105, y: -25}}
                            bounds={{top: -445, left: -200, right: 410, bottom: 14}}>
                            <section id="settings-popout"
                                className="popout">
                                <section className="font large-medium flex-center column gap space-nicely all">
                                    {/* Display Settings */}
                                    <section className="section-group">
                                        <span className="font small when-elements-are-not-straight space-nicely bottom short">
                                            <b>Display</b>
                                        </span>
                                        {/* Screen Dimmer */}
                                        <section className="flex-center row gap only-align-items">
                                            <span className="font small">
                                                Screen Dimmer
                                            </span>
                                            <Switch className="toggleable"
                                                checked={this.state.screenDimmer}
                                                onChange={(value) => this.handleToggleableBtn(value, "btn-screen-dimmer")}
                                                onColor="#86d3ff"
                                                onHandleColor="#2693e6"
                                                handleDiameter={15}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
                                                activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                                                height={15}
                                                width={30}/>
                                        </section>
                                        <Slider className="slider space-nicely top medium"
                                            onChange={(value) => this.handleSlider(value, "slider-screen-dimmer")}
                                            min={5}
                                            max={130}
                                            defaultValue={100}
                                            disabled={!this.state.screenDimmer}/>
                                    </section>
                                    {/* Design Settings */}
                                    <section className="section-group">
                                        <span className="font small when-elements-are-not-straight space-nicely bottom short">
                                            <b>Design</b>
                                        </span>
                                        {/* Animation */}
                                        <section>
                                            <section className="element-ends">
                                                <span className="font small">
                                                    Animation
                                                </span>
                                                <button className="btn-match inverse"
                                                    onClick={() => this.randomOption("animation")}>
                                                    <IconContext.Provider value={{ size: this.props.varMicroIcon, className: "global-class-name" }}>
                                                        <FaRandom/>
                                                    </IconContext.Provider>
                                                </button>
                                            </section>
                                            <select id="settings-popout-design-select-animation"
                                                className="select-match dropdown-arrow space-nicely top medium"
                                                onChange={(event) => this.handleSelect(event.target.value, "animation")}
                                                defaultValue={"default"}>
                                                <option value="default">Default</option>
                                                <option value="fade">Fade</option>
                                            </select>
                                        </section>
                                        {/* Background */}
                                        <section>
                                            <section className="element-ends">
                                                <span className="font small">
                                                    Background
                                                </span>
                                                <button className="btn-match inverse"
                                                    onClick={() => this.randomOption("background")}>
                                                    <IconContext.Provider value={{ size: this.props.varMicroIcon, className: "global-class-name" }}>
                                                        <FaRandom/>
                                                    </IconContext.Provider>
                                                </button>
                                            </section>
                                            <select id="settings-popout-design-select-background"
                                                className="select-match dropdown-arrow space-nicely top medium"
                                                onChange={(event) => this.handleSelect(event.target.value, "background")}
                                                defaultValue={"default"}>
                                                <option value="default">Default</option>
                                                <option value="white">White</option>
                                                <option value="linear-gradient">Linear-gradient</option>
                                            </select>
                                        </section>
                                        {/* Custom Border */}
                                        <section>
                                            <section className="element-ends">
                                                <span className="font small">
                                                    Custom Border
                                                </span>
                                                <button className="btn-match inverse"
                                                    onClick={() => this.randomOption("custom-border")}>
                                                    <IconContext.Provider value={{ size: this.props.varMicroIcon, className: "global-class-name" }}>
                                                        <FaRandom/>
                                                    </IconContext.Provider>
                                                </button>
                                            </section>
                                            <select id="settings-popout-design-select-custom-border"
                                                className="select-match dropdown-arrow space-nicely top medium"
                                                onChange={(event) => this.handleSelect(event.target.value, "custom-border")}
                                                defaultValue={"default"}>
                                                <option value="default">Default</option>
                                                <option value="diagonal">Diagonal</option>
                                                <option value="dashed">Dashed</option>
                                            </select>
                                        </section>
                                    </section>
                                    {/* Feature Settings */}
                                    <section className="section-group">
                                        <span className="font small when-elements-are-not-straight space-nicely bottom short">
                                            <b>Feature</b>
                                        </span>
                                        {/* Fullscreen */}
                                        <section className="element-ends">
                                            <label className="font small"
                                                htmlFor="settings-popout-feature-fullscreen">
                                                Fullscreen
                                            </label>
                                            <input id="settings-popout-feature-fullscreen"
                                                type="checkbox"
                                                onChange={(event) => this.handleCheckbox(event.target.checked, "fullscreen")}/>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default WidgetSetting;