import { React, Component } from 'react';
import Draggable from 'react-draggable';
import { FaGripHorizontal, FaRandom } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Switch from 'react-switch';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from "react-select";


/// Variables
let intervalTimeBased;
/// Select options
const optionsAnimation = [
    {
        label: "Animations",
        options: [
            {value: "default", label: "Default"},
            {value: "fade", label: "Fade"},
            {value: "shrink", label: "Shrink"},
            {value: "blastingOff", label: "Blasting Off"}
        ]
    }
];
const optionsBackground = [
    {
        label: "Backgrounds",
        options: [
            {value: "default", label: "Default"},
            {value: "white", label: "White"},
            {value: "linear-gradient", label: "Linear-gradient"},
            {value: "diagonal", label: "Diagonal"},
            {value: "microbial-mat", label: "Microbial Mat"},
            {value: "stairs", label: "Stairs"},
            {value: "half-rombes", label: "Half-Rombes"},
            {value: "arrows", label: "Arrows"},
            {value: "zig-zag", label: "Zig-Zag"},
            {value: "weave", label: "Weave"},
            {value: "upholstery", label: "Upholstery"},
            {value: "starry-night", label: "Starry Night"},
            {value: "marrakesh", label: "Marrakesh"},
            {value: "rainbow-bokeh", label: "Rainbow Bokeh"},
            {value: "carbon", label: "Carbon"},
            {value: "carbon-fibre", label: "Carbon Fibre"},
            {value: "hearts", label: "Hearts"},
            {value: "argyle", label: "Argyle"},
            {value: "steps", label: "Steps"},
            {value: "waves", label: "Waves"},
            {value: "cross", label: "Cross"},
            {value: "yin-yang", label: "Yin Yang"},
            {value: "stars", label: "Stars"},
            {value: "brady-bunch", label: "Brady Bunch"},
            {value: "shippo", label: "Shippo"},
            {value: "bricks", label: "Bricks"},
            {value: "seigaiha", label: "Seigaiha"},
            {value: "japanese-cube", label: "Japanese Cube"},
            {value: "polka-dot", label: "Polka Dot"},
            {value: "houndstooth", label: "Houndstooth"},
            {value: "checkerboard", label: "Checkerboard"},
            {value: "diagonal-checkerboard", label: "Diagonal Checkerboard"},
            {value: "tartan", label: "Tartan"},
            {value: "madras", label: "Madras"},
            {value: "lined-paper", label: "Lined Paper"},
            {value: "blueprint-grid", label: "Blueprint Grid"},
            {value: "tablecloth", label: "Tablecloth"},
            {value: "cicada-stripes", label: "Cicada Stripes"},
            {value: "honeycomb", label: "Honeycomb"},
            {value: "wave", label: "Wave"},
            {value: "pyramid", label: "Pyramid"},
            {value: "chocolate-weave", label: "Chocolate Weave"},
            {value: "cross-dots", label: "Cross-Dots"}
        ]
    }
];
const optionsCustomBorder = [
    {
        label: "Custom Borders",
        options: [
            {value: "default", label: "Default"},
            {value: "diagonal", label: "Diagonal"},
            {value: "dashed", label: "Dashed"},
            {value: "double", label: "Double"}
        ]
    }
];


class WidgetSetting extends Component{
    constructor(props){
        super(props);
        this.state = {
            showHideWidgets: false,
            search: "",
            widgetsBtn: {
                widgetsBtnUtility: {
                    quoteBtn: true,
                    translatorBtn: true,
                    googleTranslatorBtn: true,
                    calculatorBtn: true,
                    weatherBtn: true,
                    timeConversionBtn: true,
                    spreadsheetBtn: true
                },
                widgetsBtnGames: {
                    snakeBtn: true,
                    typingTestBtn: true
                },
                widgetsBtnFun: {
                    pokemonSearchBtn: true
                }
            },
            utilityTab: true,
            gamesTab: false,
            funTab: false,
            settings: false,
            values: {
                screenDimmer: false,
                screenDimmerSlider: false,
                screenDimmerValue: 100,
                background: {value: "default", label: "Default"},
                animation: {value: "default", label: "Default"},
                customBorder: {value: "default", label: "Default"},
                shadow: false,
                authorNames: false,
                fullscreen: false,
                resetPosition: false,
                savePositionPopout: false,
                timeBased: false
            }
        };
        this.handleTrick = this.handleTrick.bind(this);
        this.handlePressableBtn = this.handlePressableBtn.bind(this);
        this.handleToggleableBtn = this.handleToggleableBtn.bind(this);
        this.handleSlider = this.handleSlider.bind(this);
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.storeData = this.storeData.bind(this);
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
                rand = optionsAnimation[0].options[Math.floor(Math.random() * (optionsAnimation[0].options.length - 1)) + 1];
                this.handleSelect(rand, "animation");
                break;
            case "background":
                rand = optionsBackground[0].options[Math.floor(Math.random() * (optionsBackground[0].options.length - 1)) + 1];
                this.handleSelect(rand, "background");
                break;
            case "customBorder":
                rand = optionsCustomBorder[0].options[Math.floor(Math.random() * (optionsCustomBorder[0].options.length - 1)) + 1];
                this.handleSelect(rand, "customBorder");
                break;
            default:
                break;
        };

    };
    handleTrick(){
        const combinedWidgets = [...this.props.widgetsUtilityActive, ...this.props.widgetsGamesActive];
        if(combinedWidgets.length !== 0){
            const randIndexWidget = Math.floor(Math.random() * combinedWidgets.length);
            const randIndexAnimation = Math.floor(Math.random() * this.props.tricks.length);
            const e = document.getElementById(combinedWidgets[randIndexWidget] + "-widget-animation");
            e.style.animation = "none";
            window.requestAnimationFrame(() => {
                e.style.animation = this.props.tricks[randIndexAnimation] + " 2s";
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
                    if(this.state.values.animation.value !== "default"){
                        showHideWidgetsPopout.style.animation = "none";
                        window.requestAnimationFrame(() => {
                            showHideWidgetsPopout.style.animation = this.state.values.animation.value + "In 2s";
                        });
                    };
                }else{
                    this.setState({
                        showHideWidgets: false
                    });
                    btnShowHideWidgets.style.opacity = "0.5";
                    showHideWidgetsPopout.style.visibility = "hidden";
                    if(this.state.values.animation.value !== "default"){
                        showHideWidgetsPopout.style.animation = "none";
                        window.requestAnimationFrame(() => {
                            showHideWidgetsPopout.style.animation = this.state.values.animation.value + "Out 2s";
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
                    settingsPopout.style.display = "block";
                }else{
                    this.setState({
                        settings: false
                    });
                    btnSettings.style.opacity = "0.5";
                    settingsPopout.style.display = "none";
                };
                break;
            default:
                const btn = document.getElementById("show-hide-widgets-popout-btn-" + what);
                this.props.showHide(what, where);
                if(this.props.widgets[what] === false){
                    btn.style.opacity = "1";
                    this.props.updateWidgetsActive(what, where);
                }else{
                    btn.style.opacity = "0.5";
                    switch(where){
                        case "utility":
                            const widgetUtilityIndex = this.props.widgetsUtilityActive.indexOf(what);
                            this.unorderedRemove(this.props.widgetsUtilityActive, widgetUtilityIndex);
                            break;
                        case "games":
                            const widgetGamesIndex = this.props.widgetsGamesActive.indexOf(what);
                            this.unorderedRemove(this.props.widgetsGamesActive, widgetGamesIndex);
                            break;
                        case "fun":
                            const widgetFunIndex = this.props.widgetsFunActive.indexOf(what);
                            this.unorderedRemove(this.props.widgetsFunActive, widgetFunIndex);
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
                    values: {
                        ...this.state.values,
                        screenDimmer: value,
                        screenDimmerSlider: (this.state.values.timeBased) ? false : true
                    }
                }, () => {
                    if(this.state.values.timeBased === false){
                        if(this.state.values.screenDimmer){
                            bg.style.filter = `brightness(${this.state.values.screenDimmerValue}%)`;
                        }else{
                            bg.style.filter = "brightness(100%)";
                            this.setState({
                                values: {
                                    ...this.state.values,
                                    screenDimmerSlider: false
                                }
                            });
                        };
                    }else{
                        if(this.state.values.screenDimmer){
                            this.handleInterval(value);
                        }else{
                            bg.style.filter = "brightness(100%)";
                        };
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
                    values: {
                        ...this.state.values,
                        screenDimmerValue: value
                    }
                }, () => {
                    if(this.state.values.screenDimmer === true){
                        bg.style.filter = "brightness(" + this.state.values.screenDimmerValue + "%)";
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
                this.props.updateValue(what, where, "values");
                break;
            case "background":
                this.updateBackground(what);
                break;
            case "customBorder":
                this.props.updateValue(what, where, "values");
                break;
            default:
                break;
        };
        this.setState({
            values: {
                ...this.state.values,
                [where]: what
            }
        });
    };
    /// Handles all checkboxes
    handleCheckbox(what, where, type){
        this.setState({
            values: {
                ...this.state.values,
                [where]: what
            }
        }, () => {
            switch(where){
                case "savePositionPopout":
                    break;
                case "timeBased":
                    this.setState({
                        values: {
                            ...this.state.values,
                            screenDimmerSlider: !what
                        }
                    });
                    this.handleInterval(what);
                    break;
                default:
                    this.props.updateDesign(where, what);
                    break;
            };    
        });
        this.props.updateValue(what, where, type);
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
                for(var currUtilityWidget in this.props.widgetsUtilityActive){
                    const btn = document.getElementById("show-hide-widgets-popout-btn-" + this.props.widgetsUtilityActive[currUtilityWidget]);
                    btn.style.opacity = "1";
                };
                break;
            case "games":
                for(var currGamesWidget in this.props.widgetsGamesActive){
                    const btn = document.getElementById("show-hide-widgets-popout-btn-" + this.props.widgetsGamesActive[currGamesWidget]);
                    btn.style.opacity = "1";
                };
                break;
            case "fun":
                for(var currFunWidget in this.props.widgetsFunActive){
                    const btn = document.getElementById("show-hide-widgets-popout-btn-" + this.props.widgetsFunActive[currFunWidget]);
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
                this.updateTab(currTab);
            };
        });
    };
    updateBackground(what){
        let e = document.getElementById("App");
        e.classList.remove(`background-${this.state.values.background.value}`);
        e.classList.add(`background-${what.value}`);    
    };
    handleInterval(what){
        if(what === true){
            this.updateScreenDimmer();
            intervalTimeBased = setInterval(this.updateScreenDimmer, 1800000);
        }else{
            let app = document.getElementById("App");
            app.style.filter = `brightness(${this.state.values.screenDimmerValue}%)`;
            clearInterval(intervalTimeBased);
        };
    };
    updateScreenDimmer(){
        /// Triggers a new screen dim every 30 minutes based on time
        /// 24-6 = 40% brightness
        /// 7-8 = 40% - 100% brightness: 2 hours:30 minutes x 4 -> 15% increase
        /// 8-18 = 100% brightness
        /// 19-24 = 100% to 40% brightness: 5 hours:30 minutes x 10 -> 6% decrease
        let app = document.getElementById("App");
        let date = new Date();
        let brightness;
        let hour = date.getHours();
        let minute = date.getMinutes();
        if(hour >= 0 && hour <= 6){
            brightness = 40;
        }else if(hour >= 8 && hour<= 18){
            brightness = 100;
        };
        switch(hour){
            case 7:
                brightness = (minute <= 30) ? 55 : 70;
                break;
            case 8:
                brightness = (minute <= 30) ? 85 : 100;
                break;
            case 19:
                brightness = (minute <= 30) ? 94 : 88;
                break;
            case 20:
                brightness = (minute <= 30) ? 82 : 76;
                break;
            case 21:
                brightness = (minute <= 30) ? 70 : 64;
                break;
            case 22:
                brightness = (minute <= 30) ? 58 : 52;
                break;
            case 23:
                brightness = (minute <= 30) ? 46 : 40;
                break;
            default:
                break;
        };
        app.style.filter = `brightness(${brightness}%)`;
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["utility"]["setting"] = {
                ...dataLocalStorage["utility"]["setting"],
                values: {
                    ...dataLocalStorage["utility"]["setting"]["values"],
                    screenDimmer: this.state.values.screenDimmer,
                    screenDimmerValue: this.state.values.screenDimmerValue,
                    background: this.state.values.background,
                    animation: this.state.values.animation,
                    customBorder: this.state.values.customBorder,
                    authorNames: this.state.values.authorNames,
                    fullscreen: this.state.values.fullscreen,
                    resetPosition: this.state.values.resetPosition,
                    savePositionPopout: this.state.values.savePositionPopout,
                    shadow: this.state.values.shadow,
                    timeBased: this.state.values.timeBased
                }
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    async componentDidMount(){
        /// Sort selects
        this.props.sortSelect(optionsAnimation);
        this.props.sortSelect(optionsBackground);
        this.props.sortSelect(optionsCustomBorder);
        /// Load utility widget's data from local storage
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = await JSON.parse(localStorage.getItem("widgets"));
            let localStorageValues = dataLocalStorage["utility"]["setting"]["values"];
            for(let i in dataLocalStorage.utility){
                if(dataLocalStorage.utility[i].active === true){
                    let btn = document.getElementById("show-hide-widgets-popout-btn-" + i);
                    btn.style.opacity = "1";
                };
                switch(i){
                    case "setting":
                        this.setState({
                            values: {
                                ...this.state.values,
                                screenDimmer: localStorageValues["screenDimmer"],
                                screenDimmerSlider: (localStorageValues["timeBased"]) ? false : localStorageValues["screenDimmer"],
                                screenDimmerValue: localStorageValues["screenDimmerValue"],
                                background: localStorageValues["background"],
                                animation: localStorageValues["animation"],
                                customBorder: localStorageValues["customBorder"],
                                authorNames: localStorageValues["authorNames"],
                                fullscreen: localStorageValues["fullscreen"],
                                resetPosition: localStorageValues["resetPosition"],
                                savePositionPopout: localStorageValues["savePositionPopout"],
                                shadow: localStorageValues["shadow"],
                                timeBased: localStorageValues["timeBased"]
                            }
                        }, () => {
                            /// Update Display
                            document.getElementById("settings-popout-display-timeBased").checked = this.state.values.timeBased;
                            if(this.state.values.screenDimmer && this.state.values.timeBased){
                                this.handleInterval(true);
                            }else if(this.state.values.screenDimmer){
                                document.getElementById("App").style.filter = "brightness(" + this.state.values.screenDimmerValue + "%)";
                            };
                            /// Update Design
                            this.updateBackground(this.state.values.background);
                            document.getElementById("settings-popout-design-shadow").checked = this.state.values.shadow;
                            if(this.state.values.shadow === true){
                                this.props.updateDesign("shadow", true);
                            };
                            /// Update Feature
                            document.getElementById("settings-popout-feature-authorNames").checked = this.state.values.authorNames;
                            document.getElementById("settings-popout-feature-fullscreen").checked = this.state.values.fullscreen;
                            document.getElementById("settings-popout-feature-resetPosition").checked = this.state.values.resetPosition;
                            /// Update Misc
                            document.getElementById("settings-popout-feature-savepositionpopup").checked = this.state.values.savePositionPopout;
                        });
                        break;
                    default:
                        break;
                };
            };
        };
        /// Save widget's data to local storage
        window.addEventListener("beforeunload", this.storeData);
    };
    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.storeData);
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                onStart={() => this.props.dragStart("settings")}
                onStop={() => this.props.dragStop("settings")}
                onDrag={(event, data) => this.props.updatePosition("setting", "utility", data.x, data.y)}
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
                        {/* Buttons */}
                        <section className="font large-medium no-color flex-center column gap">
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
                            position={{
                                x: this.props.positionPopout.showhidewidgets.x,
                                y: this.props.positionPopout.showhidewidgets.y}}
                            onDrag={(event, data) => this.props.updatePosition("setting", "utility", data.x, data.y, "popout", "showhidewidgets")}
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
                                            name="settings-input-show-hide-widgets-search"
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
                                            {(this.state.widgetsBtn.widgetsBtnUtility["timeConversionBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-timeconversion"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("timeconversion", "utility")}>Time Conversion</button>
                                                : <></>}
                                            {(this.state.widgetsBtn.widgetsBtnUtility["spreadsheetBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-spreadsheet"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("spreadsheet", "utility")}>Spreadsheet</button>
                                                : <></>}
                                        </section>
                                    </TabPanel>
                                    {/* Games */}
                                    <TabPanel>
                                        <section id="show-hide-widgets-popout-btn-games"
                                            className="font large-medium no-color grid col-2 spread-long space-nicely all">
                                            {/* {(this.state.widgetsBtn.widgetsBtnGames["snakeBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-snake"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("snake", "games")}>Snake</button>
                                                : <></>} */}
                                            {(this.state.widgetsBtn.widgetsBtnGames["typingTestBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-typingtest"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("typingtest", "games")}>Typing Test</button>
                                                : <></>}
                                        </section>
                                    </TabPanel>
                                    {/* Fun */}
                                    <TabPanel>
                                        <section id="show-hide-widgets-popout-btn-fun"
                                            className="font large-medium no-color grid col-2 spread-long space-nicely all">
                                            {(this.state.widgetsBtn.widgetsBtnFun["pokemonSearchBtn"] === true)
                                                ? <button id="show-hide-widgets-popout-btn-pokemonsearch"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("pokemonsearch", "fun")}>Pokemon Search</button>
                                                : <></>}
                                        </section>
                                    </TabPanel>
                                </Tabs>
                            </section>
                        </Draggable>
                        {/* Settings Popout */}
                        <Draggable
                            cancel="span, .toggleable, .slider, input, button, .select-match"
                            position={{
                                x: this.props.positionPopout.settings.x,
                                y: this.props.positionPopout.settings.y}}
                            onDrag={(event, data) => this.props.updatePosition("setting", "utility", data.x, data.y, "popout", "settings")}
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
                                        <section className="element-ends">
                                            <span className="font small">
                                                Screen Dimmer
                                            </span>
                                            <Switch className="toggleable"
                                                name="settings-switch-screen-dimmer"
                                                checked={this.state.values.screenDimmer}
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
                                            value={this.state.values.screenDimmerValue}
                                            disabled={!this.state.values.screenDimmerSlider}/>
                                        <section className="element-ends">
                                            <label className="font small"
                                                htmlFor="settings-popout-display-timeBased">
                                                Change based on time
                                            </label>
                                            <input id="settings-popout-display-timeBased"
                                                name="settings-input-popout-display-timeBased"
                                                type="checkbox"
                                                disabled={!this.state.values.screenDimmer}
                                                onChange={(event) => this.handleCheckbox(event.target.checked, "timeBased", "values")}/>
                                        </section>
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
                                                    <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                        <FaRandom/>
                                                    </IconContext.Provider>
                                                </button>
                                            </section>
                                            <Select id="settings-popout-design-select-animation"
                                                className="select-match space-nicely top medium"
                                                value={this.state.values.animation}
                                                defaultValue={optionsAnimation[0]["options"][0]}
                                                isDisabled={!this.state.settings}
                                                onChange={(event) => this.handleSelect(event, "animation")}
                                                options={optionsAnimation}
                                                formatGroupLabel={this.props.formatGroupLabel}
                                                styles={this.props.selectStyleSmall}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        ...this.props.selectTheme
                                                    }
                                                })}/>
                                        </section>
                                        {/* Background */}
                                        <section>
                                            <section className="element-ends">
                                                <span className="font small">
                                                    Background
                                                </span>
                                                <button className="btn-match inverse"
                                                    onClick={() => this.randomOption("background")}>
                                                    <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                        <FaRandom/>
                                                    </IconContext.Provider>
                                                </button>
                                            </section>
                                            <Select id="settings-popout-design-select-background"
                                                className="select-match space-nicely top medium"
                                                value={this.state.values.background}
                                                defaultValue={optionsBackground[0]["options"][0]}
                                                onChange={(event) => this.handleSelect(event, "background")}
                                                options={optionsBackground}
                                                formatGroupLabel={this.props.formatGroupLabel}
                                                styles={this.props.selectStyleSmall}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        ...this.props.selectTheme
                                                    }
                                                })}/>
                                        </section>
                                        {/* Custom Border */}
                                        <section>
                                            <section className="element-ends">
                                                <span className="font small">
                                                    Custom Border
                                                </span>
                                                <button className="btn-match inverse"
                                                    onClick={() => this.randomOption("customBorder")}>
                                                    <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                        <FaRandom/>
                                                    </IconContext.Provider>
                                                </button>
                                            </section>
                                            <Select id="settings-popout-design-select-custom-border"
                                                className="select-match space-nicely top medium"
                                                value={this.state.values.customBorder}
                                                defaultValue={optionsCustomBorder[0]["options"][0]}
                                                onChange={(event) => this.handleSelect(event, "customBorder")}
                                                options={optionsCustomBorder}
                                                formatGroupLabel={this.props.formatGroupLabel}
                                                styles={this.props.selectStyleSmall}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        ...this.props.selectTheme
                                                    }
                                                })}/>
                                        </section>
                                        {/* Checkboxes */}
                                        <section className="grid col-2 spread-setting">
                                            {/* Shadow */}
                                            <section className="element-ends not-spaced">
                                                <label className="font small"
                                                    htmlFor="settings-popout-design-shadow">
                                                    Shadow
                                                </label>
                                                <input id="settings-popout-design-shadow"
                                                    name="settings-input-popout-design-shadow"
                                                    type="checkbox"
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, "shadow", "values")}/>
                                            </section>
                                        </section>
                                    </section>
                                    {/* Feature Settings */}
                                    <section className="section-group">
                                        <span className="font small when-elements-are-not-straight space-nicely bottom short">
                                            <b>Feature</b>
                                        </span>
                                        {/* General Sub Section */}
                                        <fieldset className="section-sub">
                                            <legend className="font small space-nicely bottom short">
                                                General
                                            </legend>
                                            {/* Display author names */}
                                            <section className="element-ends">
                                                <label className="font small"
                                                    htmlFor="settings-popout-feature-authorNames">
                                                    Author Names
                                                </label>
                                                <input id="settings-popout-feature-authorNames"
                                                    name="settings-input-popout-feature-authorNames"
                                                    type="checkbox"
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, "authorNames", "values")}/>
                                            </section>
                                        </fieldset>
                                        {/* Hotbar Sub Section */}
                                        <fieldset className="section-sub">
                                            <legend className="font small space-nicely bottom short">
                                                Hotbar
                                            </legend>
                                            {/* Fullscreen */}
                                            <section className="element-ends">
                                                <label className="font small"
                                                    htmlFor="settings-popout-feature-fullscreen">
                                                    Fullscreen
                                                </label>
                                                <input id="settings-popout-feature-fullscreen"
                                                    name="settings-input-popout-feature-fullscreen"
                                                    type="checkbox"
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, "fullscreen", "values")}/>
                                            </section>
                                            {/* Reset Position */}
                                            <section className="element-ends">
                                                <label className="font small"
                                                    htmlFor="settings-popout-feature-resetPosition">
                                                    Reset Position
                                                </label>
                                                <input id="settings-popout-feature-resetPosition"
                                                    name="settings-input-popout-feature-resetPosition"
                                                    type="checkbox"
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, "resetPosition", "values")}/>
                                            </section>
                                        </fieldset>
                                    </section>
                                    {/* Misc Settings */}
                                    <section className="section-group">
                                        <span className="font small when-elements-are-not-straight space-nicely bottom short">
                                            <b>Misc</b>
                                        </span>
                                        {/* Save position of popup */}
                                        <section className="element-ends">
                                            <label className="font small"
                                                htmlFor="settings-popout-feature-savepositionpopup">
                                                Save Position: Popup
                                            </label>
                                            <input id="settings-popout-feature-savepositionpopup"
                                                name="settings-input-popout-feature-savepositionpopout"
                                                type="checkbox"
                                                onChange={(event) => this.handleCheckbox(event.target.checked, "savePositionPopout", "values")}/>
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