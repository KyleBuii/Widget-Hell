import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { BiBriefcase } from "react-icons/bi";
import { FaGripHorizontal, FaRandom } from 'react-icons/fa';
import { GiAxeSword } from "react-icons/gi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoBodyOutline } from "react-icons/io5";
import ReactPaginate from 'react-paginate';
import Select from "react-select";
import Switch from 'react-switch';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';


/// Variables
let intervalTimeBased;
let timeoutTrick;
/// Select options
const optionsAnimation = [
    {
        label: "Animations",
        options: [
            {value: "default", label: "Default"},
            {value: "fade", label: "Fade"},
            {value: "shrink", label: "Shrink"},
            {value: "blastingOff", label: "Blasting Off"},
            {value: "rendering", label: "Rendering"},
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
            {value: "double", label: "Double"},
            {value: "map-inspired", label: "Map Inspired"},
            {value: "default-light", label: "Default Light"},
        ]
    }
];
const optionsVoice = [
    {
        label: "Voices",
        options: [
            {value: "0", label: "David"},
            {value: "1", label: "Mark"},
            {value: "2", label: "Zira"}
        ]
    }
];
const optionsHealth = [
    {
        label: "Health",
        options: [
            {value: "default", label: "Default"},
            {value: "limit5", label: "Limit 5"},
            {value: "noredheart", label: "No Red Hearts"},
            {value: "none", label: "None"},
        ]
    }
];


class WidgetSetting extends Component{
    constructor(props){
        super(props);
        this.state = {
            values: {
                screenDimmer: false,
                screenDimmerSlider: false,
                screenDimmerValue: 100,
                background: {value: "default", label: "Default"},
                timeBased: false,
                randomTrick: false
            },
            search: "",
            searched: [],
            activeTab: "utility",
            showHideWidgets: false,
            settings: false,
            inventory: false,
            equipment: false,
            character: false,
            maxPageUtility: 0,
            maxPageGames: 0,
            maxPageFun: 0,
            pageUtility: -1,
            pageGames: -1,
            pageFun: -1
        };
        this.randomTimeout = this.randomTimeout.bind(this);
        this.handleRandomTrick = this.handleRandomTrick.bind(this);
        this.handleTrick = this.handleTrick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handlePressableButton = this.handlePressableButton.bind(this);
        this.handleToggleableButton = this.handleToggleableButton.bind(this);
        this.handleSlider = this.handleSlider.bind(this);
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
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
    /// Choose random option
    randomOption(what, element, min, max){
        let random;
        switch(what){
            case "slider":
                random = Math.random() * max + min;
                this.handleSlider(random, `slider-${element}`);
                break;
            case "animation":
                random = optionsAnimation[0].options[Math.floor(Math.random() * (optionsAnimation[0].options.length - 1)) + 1];
                this.handleSelect(random, "animation");
                break;
            case "background":
                random = optionsBackground[0].options[Math.floor(Math.random() * (optionsBackground[0].options.length - 1)) + 1];
                this.handleSelect(random, "background");
                break;
            case "customBorder":
                random = optionsCustomBorder[0].options[Math.floor(Math.random() * (optionsCustomBorder[0].options.length - 1)) + 1];
                this.handleSelect(random, "customBorder");
                break;
            case "voice":
                random = optionsVoice[0].options[Math.floor(Math.random() * (optionsVoice[0].options.length - 1)) + 1];
                this.handleSelect(random, "voice");
                break;
            case "health":
                random = optionsHealth[0].options[Math.floor(Math.random() * (optionsHealth[0].options.length - 1)) + 1];
                this.handleSelect(random, "health");
                break;
            default:
                break;
        };

    };
    randomTimeout(what){
        switch(what){
            case "trick":
                if(this.state.values.randomTrick && timeoutTrick === undefined){
                    let randomNumber = Math.random() * 300000 + 60000;
                    timeoutTrick = setTimeout(() => {
                        timeoutTrick = undefined;
                        this.handleTrick();
                        this.randomTimeout("trick");
                    }, randomNumber);
                };
                break;
            default:
                break;
        };
    };
    handleTrick(){
        const combinedWidgets = [...this.props.widgetsUtilityActive, ...this.props.widgetsGamesActive, ...this.props.widgetsFunActive];
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
    handleRandomTrick(checked){
        this.setState({
            values: {
                ...this.state.values,
                randomTrick: checked
            }
        }, () => {
            if(this.state.values.randomTrick){
                this.randomTimeout("trick");  
            }else{
                clearTimeout(timeoutTrick);
                timeoutTrick = undefined;
            };
        });
    };
    handleClose(event){
        let elementButton = document.getElementById(`show-hide-widgets-popout-button-${event.detail.element}`);
        if(elementButton !== null){
            /// Default is a normal pressable button
            switch(event.detail.element){
                case "inventory":
                case "equipment":
                case "character":
                    this.setState({
                        [event.detail.element]: !this.state[event.detail.element]
                    });
                    elementButton.classList.add("disabled");
                    break;
                default:
                    elementButton.style.opacity = "0.5";
                    break;
            };
        };
        switch(event.detail.type){
            case "utility":
                const widgetUtilityIndex = this.props.widgetsUtilityActive.indexOf(event.detail.element);
                this.unorderedRemove(this.props.widgetsUtilityActive, widgetUtilityIndex);
                break;
            case "games":
                const widgetGamesIndex = this.props.widgetsGamesActive.indexOf(event.detail.element);
                this.unorderedRemove(this.props.widgetsGamesActive, widgetGamesIndex);
                break;
            case "fun":
                const widgetFunIndex = this.props.widgetsFunActive.indexOf(event.detail.element);
                this.unorderedRemove(this.props.widgetsFunActive, widgetFunIndex);
                break;
            default:
                break;
        };
    };
    /// Handles all pressable buttons (opacity: 0.5 on click)
    handlePressableButton(what, where){
        switch(what){
            case "showHideWidgets":
                const buttonShowHideWidgets = document.getElementById("settings-button-show-hide-widgets");
                const showHideWidgetsPopoutAnimation = document.getElementById("show-hide-widgets-popout-animation");
                this.setState({
                    showHideWidgets: !this.state.showHideWidgets
                });
                this.props.showHidePopout(showHideWidgetsPopoutAnimation, !this.state.showHideWidgets, buttonShowHideWidgets);
                break;
            case "settings":
                const buttonSettings = document.getElementById("settings-button-settings");
                const settingsPopoutAnimation = document.getElementById("settings-popout-animation");
                this.setState({
                    settings: !this.state.settings
                });
                this.props.showHidePopout(settingsPopoutAnimation, !this.state.settings, buttonSettings);
                break;
            case "inventory":
            case "equipment":
            case "character":
                let elementButton = document.getElementById(`show-hide-widgets-popout-button-${what}`);
                this.props.showHide(what, where);
                this.setState({
                    [what]: !this.state[what]
                }, () => {
                    if(this.state[what]){
                        elementButton.classList.remove("disabled");
                        this.props.updateWidgetsActive(what, where);
                    }else{
                        elementButton.classList.add("disabled");
                        const widgetUtilityIndex = this.props.widgetsUtilityActive.indexOf(what);
                        this.unorderedRemove(this.props.widgetsUtilityActive, widgetUtilityIndex);
                    };
                });
                break;
            default:
                const button = document.getElementById("show-hide-widgets-popout-button-" + what);
                this.props.showHide(what, where);
                if(this.props.widgetActiveVariables[what] === false){
                    button.style.opacity = "1";
                    this.props.updateWidgetsActive(what, where);
                }else{
                    button.style.opacity = "0.5";
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
    handleToggleableButton(value, what){
        switch(what){
            case "button-screen-dimmer":
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
            case "slider-voice-pitch":
                this.setState({
                    values: {
                        ...this.state.values,
                        pitch: value
                    }
                }, () => {
                    this.props.updateValue(value, "pitch", "values");
                });
                break;
            case "slider-voice-rate":
                this.setState({
                    values: {
                        ...this.state.values,
                        rate: value
                    }
                }, () => {
                    this.props.updateValue(value, "rate", "values");
                });
                break;
            default:
                break;
        };
    };
    /// Handles all selects
    handleSelect(what, where){
        switch(where){
            case "background":
                this.updateBackground(what);
                this.setState({
                    values: {
                        ...this.state.values,
                        [where]: what
                    }
                });        
                break;
            default:
                this.props.updateValue(what, where, "values");
                break;
        };
    };
    /// Handles all checkboxes
    handleCheckbox(what, where, type){
        switch(where){
            case "timeBased":
                this.setState({
                    values: {
                        ...this.state.values,
                        [where]: what
                    }
                }, () => {
                    switch(where){
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
                            break;
                    };    
                });
                break;
            default:
                this.props.updateValue(what, where, type);
                break;
        };
    };
    handleTabSwitch(what){
        this.setState({
            search: "",
            activeTab: what
        }, () => {
            this.updateSearch(this.state.search);
            if(this.state[`page${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`] !== 0){
                this.handlePageClick(0);
            };
        });
    };
    updateTab(what){
        let tabCapitalized = what.replace(/^./, (char) => char.toUpperCase());
        let widgetPage = `page${tabCapitalized}`;
        let widgetKeys = Object.keys(this.props.widgets[what])
            .sort()
            .slice((12 * this.state[widgetPage]), (12 + (12 * this.state[widgetPage])));
        for(let widget of this.props[`widgets${tabCapitalized}Active`]){
            if(widgetKeys.indexOf(widget) !== -1){
                switch(widget){
                    case "inventory":
                    case "equipment":
                        break;
                    default:
                        let elementButton = document.getElementById("show-hide-widgets-popout-button-" + widget);
                        elementButton.style.opacity = "1";
                        break;
                };
            };
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
        let widgetsMatch = [];
        let widgetButtons = this[`buttons${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`];
        if(what.length > 2){
            let regexSearch = new RegExp(`(${what})`, "i");
            for(let i of widgetButtons){
                if(regexSearch.test(i.props.widgetname)){
                    widgetsMatch.push(i);
                };
            };
        };
        this.setState({
            searched: [...widgetsMatch]
        }, () => {
            if(what.length <= 2){
                this.updateTab(this.state.activeTab);
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
    handleScroll(){
        let element = document.getElementById("settings-popout-animation");
        let arrowTop = document.getElementById("settings-popout-arrow-top");
        let arrowBottom = document.getElementById("settings-popout-arrow-bottom");
        /// Scrolled to bottom
        if((element.offsetHeight + element.scrollTop) >= element.scrollHeight){
            arrowBottom.style.opacity = "0";
        /// Scrolled to top
        }else if(element.scrollTop === 0){
            arrowTop.style.opacity = "0";
        }else{
            arrowBottom.style.opacity = "unset";
            arrowTop.style.opacity = "unset";
        };
    };
    handleMouse(what){
        let element = document.getElementById("settings-popout-animation");
        let arrowTop = document.getElementById("settings-popout-arrow-top");
        let arrowBottom = document.getElementById("settings-popout-arrow-bottom");
        switch(what){
            case "enter":
                if((element.offsetHeight + element.scrollTop) >= element.scrollHeight){
                    arrowTop.style.opacity = "1";
                    arrowBottom.style.opacity = "0";
                }else if(element.scrollTop === 0){
                    arrowTop.style.opacity = "0"; 
                    arrowBottom.style.opacity = "1"; 
                }else{
                    arrowTop.style.opacity = "1";
                    arrowBottom.style.opacity = "1";
                };       
                break;
            case "leave":
                arrowTop.style.opacity = "0";
                arrowBottom.style.opacity = "0";
                break;
            default:
                break;
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
    handlePageClick(event){
        this.setState({
            [`page${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`]: event
        }, () => {
            this.updateTab(this.state.activeTab);    
        });
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
                    timeBased: this.state.values.timeBased,
                    randomTrick: this.state.values.randomTrick,
                }
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    async componentDidMount(){
        window.addEventListener("close", this.handleClose);
        /// Save widget's data to local storage
        window.addEventListener("beforeunload", this.storeData);
        /// Sort selects
        this.props.sortSelect(optionsAnimation);
        this.props.sortSelect(optionsBackground);
        this.props.sortSelect(optionsCustomBorder);
        this.props.sortSelect(optionsVoice);
        this.props.sortSelect(optionsHealth);
        /// Prevents typing in non-display selects
        let elementSelects = document.getElementById("settings-widget-animation")
            .querySelectorAll(".select-match");
        for(let i of elementSelects){
            i.style.display = "none";
        };
        /// Set max page number
        let utilityPageMax = Math.ceil(this.buttonsUtility.length / 12);
        let gamesPageMax = Math.ceil(this.buttonsGames.length / 12);
        let funPageMax = Math.ceil(this.buttonsFun.length / 12);
        this.setState({
            maxPageUtility: utilityPageMax,
            maxPageGames: gamesPageMax,
            maxPageFun: funPageMax,
            pageUtility: 0
        });        
        /// Load only the first 12 utility widget's data from local storage
        /// as well as unique buttons [inventory, equipment, character]
        /// Since the first render will always be page 1 of utility tab
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = await JSON.parse(localStorage.getItem("widgets"));
            let localStorageValues = dataLocalStorage["utility"]["setting"]["values"];
            let widgetUtilityKeys = Object.keys(this.props.widgets["utility"])
                .sort()
                .slice(0, 12);
            widgetUtilityKeys = [...widgetUtilityKeys, "inventory", "equipment", "character"];
            for(let i of widgetUtilityKeys){
                if(dataLocalStorage.utility[i].active === true){
                    switch(i){
                        case "inventory":
                        case "equipment":
                        case "character":
                            let buttonRPG = document.getElementById(`show-hide-widgets-popout-button-${i}`);
                            buttonRPG.classList.remove("disabled");
                            this.setState({
                                [i]: dataLocalStorage.utility[i].active
                            });
                            break;
                        default:
                            let button = document.getElementById("show-hide-widgets-popout-button-" + i);
                            button.style.opacity = "1";
                            break;
                    };
                };
                if(localStorageValues["screenDimmer"] !== undefined){
                    switch(i){
                        case "setting":
                            this.setState({
                                values: {
                                    ...this.state.values,
                                    screenDimmer: localStorageValues["screenDimmer"],
                                    screenDimmerSlider: (localStorageValues["timeBased"]) ? false : localStorageValues["screenDimmer"],
                                    screenDimmerValue: localStorageValues["screenDimmerValue"],
                                    background: localStorageValues["background"],
                                    timeBased: localStorageValues["timeBased"],
                                    randomTrick: localStorageValues["randomTrick"]
                                }
                            }, () => {
                                /// Update Display
                                if(this.state.values.screenDimmer && this.state.values.timeBased){
                                    this.handleInterval(true);
                                }else if(this.state.values.screenDimmer){
                                    document.getElementById("App").style.filter = "brightness(" + this.state.values.screenDimmerValue + "%)";
                                };
                                /// Update Design
                                this.updateBackground(this.state.values.background);
                                /// Set random
                                if(this.state.values.randomTrick){
                                    this.randomTimeout("trick");
                                };
                            });
                            break;
                        default:
                            break;
                    };
                };
            };
        };
    };
    componentWillUnmount(){
        window.removeEventListener("close", this.handleClose);
        window.removeEventListener("beforeunload", this.storeData);
        clearInterval(intervalTimeBased);
        clearTimeout(timeoutTrick);
    };
    render(){
        this.buttonsUtility = [];
        this.buttonsGames = [];
        this.buttonsFun = [];
        let tabs = ["utility", "games", "fun"];
        for(let tab of tabs){
            let widgetKeys = Object.keys(this.props.widgets[tab])
                .sort();
            for(let widgetIndex in widgetKeys){
                let widget = widgetKeys[widgetIndex];
                let elementButton = <button id={`show-hide-widgets-popout-button-${widget}`}
                    widgetname={widget}
                    className="button-match option opt-medium disabled-option"
                    onClick={() => this.handlePressableButton(widget, tab)}>
                    {this.props.widgets[tab][widget]}
                </button>;
                switch(tab){
                    case "utility": this.buttonsUtility.push(elementButton); break;
                    case "games":   this.buttonsGames.push(elementButton);   break;
                    case "fun":     this.buttonsFun.push(elementButton);     break;
                    default: break;
                };
            };    
        };
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                onStart={() => this.props.dragStart("settings")}
                onStop={(event, data) => {
                    this.props.dragStop("settings");
                    this.props.updatePosition("setting", "utility", data.x, data.y);
                }}
                cancel="button, span, p, section, li"
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
                            <button id="settings-button-show-hide-widgets"
                                className="button-match option opt-long disabled-option"
                                onClick={() => this.handlePressableButton("showHideWidgets")}>Show/Hide Widgets</button>
                            <button id="settings-button-settings"
                                className="button-match option opt-long disabled-option"
                                onClick={() => this.handlePressableButton("settings")}>Settings</button>
                            <section className="flex-center row gap">
                                <button className="button-match option opt-medium"
                                    onClick={this.handleTrick}>Do a trick!</button>
                                <button className="button-match option opt-medium"
                                    onClick={() => this.props.randColor()}>Change color</button>
                            </section>
                        </section>
                        {/* Show/Hide Widgets Popout */}
                        <Draggable
                            cancel="button, #show-hide-widgets-popout-tabs"
                            position={{
                                x: this.props.positionPopout.showhidewidgets.x,
                                y: this.props.positionPopout.showhidewidgets.y}}
                            onStop={(event, data) => this.props.updatePosition("setting", "utility", data.x, data.y, "popout", "showhidewidgets")}
                            bounds={{top: -240, left: -360, right: 420, bottom: 8}}>
                            <section id="show-hide-widgets-popout"
                                className="popout">
                                <section id="show-hide-widgets-popout-animation"
                                    className="popout-animation">
                                    <Tabs defaultIndex={0}>
                                        <TabList id="show-hide-widgets-popout-tabs">
                                            {/* Tabs */}
                                            <div>
                                                <Tab onClick={() => this.handleTabSwitch("utility")}>Utility</Tab>
                                                <Tab onClick={() => this.handleTabSwitch("games")}>Games</Tab>
                                                <Tab onClick={() => this.handleTabSwitch("fun")}>Fun</Tab>
                                            </div>
                                            {/* Other Stuff */}
                                            <div className="flex-center">
                                                <button id="show-hide-widgets-popout-button-inventory"
                                                    className="button-match inverse disabled"
                                                    type="button"
                                                    onClick={() => this.handlePressableButton("inventory", "utility")}>
                                                    <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                                        <BiBriefcase/>
                                                    </IconContext.Provider>
                                                </button>
                                                <button id="show-hide-widgets-popout-button-equipment" 
                                                    className="button-match inverse disabled"
                                                    type="button"
                                                    onClick={() => this.handlePressableButton("equipment", "utility")}>
                                                    <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                                        <GiAxeSword/>
                                                    </IconContext.Provider> 
                                                </button>
                                                <button id="show-hide-widgets-popout-button-character" 
                                                    className="button-match inverse disabled"
                                                    type="button"
                                                    onClick={() => this.handlePressableButton("character", "utility")}>
                                                    <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                                        <IoBodyOutline/>
                                                    </IconContext.Provider> 
                                                </button>
                                                <input className="input-typable all-side"
                                                    name="settings-input-show-hide-widgets-search"
                                                    type="text"
                                                    placeholder="Search"
                                                    value={this.state.search}
                                                    onChange={this.handleSearch}></input>
                                            </div>
                                        </TabList>
                                        {/* Utility */}
                                        <TabPanel>
                                            <section id="show-hide-widgets-popout-button-utility"
                                                className="font large-medium no-color grid col-3 spread-long space-nicely space-all">
                                                {(this.state.searched.length !== 0)
                                                    ? this.state.searched.slice((12 * this.state.pageUtility), (12 + (12 * this.state.pageUtility))).map((widget) => {
                                                        return <span key={`widget-${widget.props.widgetname}`}>
                                                            {widget}
                                                        </span>})
                                                    : this.buttonsUtility.slice((12 * this.state.pageUtility), (12 + (12 * this.state.pageUtility))).map((widget) => {
                                                        return <span key={`widget-${widget.props.widgetname}`}>
                                                            {widget}
                                                        </span>})}
                                            </section>
                                        </TabPanel>
                                        {/* Games */}
                                        <TabPanel>
                                            <section id="show-hide-widgets-popout-button-games"
                                                className="font large-medium no-color grid col-3 spread-long space-nicely space-all">
                                                {(this.state.searched.length !== 0)
                                                    ? this.state.searched.slice((12 * this.state.pageGames), (12 + (12 * this.state.pageGames))).map((widget) => {
                                                        return <span key={`widget-${widget.props.widgetname}`}>
                                                            {widget}
                                                        </span>})
                                                    : this.buttonsGames.slice((12 * this.state.pageGames), (12 + (12 * this.state.pageGames))).map((widget) => {
                                                        return <span key={`widget-${widget.props.widgetname}`}>
                                                            {widget}
                                                        </span>})}
                                            </section>
                                        </TabPanel>
                                        {/* Fun */}
                                        <TabPanel>
                                            <section id="show-hide-widgets-popout-button-fun"
                                                className="font large-medium no-color grid col-3 spread-long space-nicely space-all">
                                                {(this.state.searched.length !== 0)
                                                    ? this.state.searched.slice((12 * this.state.pageFun), (12 + (12 * this.state.pageFun))).map((widget) => {
                                                        return <span key={`widget-${widget.props.widgetname}`}>
                                                            {widget}
                                                        </span>})
                                                    : this.buttonsFun.slice((12 * this.state.pageFun), (12 + (12 * this.state.pageFun))).map((widget) => {
                                                        return <span key={`widget-${widget.props.widgetname}`}>
                                                            {widget}
                                                        </span>})}
                                            </section>
                                        </TabPanel>
                                    </Tabs>
                                    <ReactPaginate className="paginate-pages font bold"
                                        forcePage={this.state[`page${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`]}
                                        breakLabel="..."
                                        nextLabel={
                                            <span className="flex-center">
                                                <IconContext.Provider value={{ size: "1.3em", className: "global-class-name" }}>
                                                    <IoIosArrowForward/>
                                                </IconContext.Provider>
                                            </span>
                                        }
                                        onPageChange={(event) => this.handlePageClick(event.selected)}
                                        pageRangeDisplayed={3}
                                        pageCount={this.state[`maxPage${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`]}
                                        previousLabel={
                                            <span className="flex-center">
                                                <IconContext.Provider value={{ size: "1.3em", className: "global-class-name" }}>
                                                    <IoIosArrowBack/>
                                                </IconContext.Provider>
                                            </span>
                                        }
                                        renderOnZeroPageCount={null}/>
                                </section>
                            </section>
                        </Draggable>
                        {/* Settings Popout */}
                        <Draggable
                            cancel="span, .toggleable, .slider, input, button, .select-match"
                            position={{
                                x: this.props.positionPopout.settings.x,
                                y: this.props.positionPopout.settings.y}}
                            onStop={(event, data) => this.props.updatePosition("setting", "utility", data.x, data.y, "popout", "settings")}
                            bounds={{top: -445, left: -200, right: 410, bottom: 14}}>
                            <section id="settings-popout"
                                className="popout">
                                <section id="settings-popout-animation"
                                    className="popout-animation scrollable"
                                    onScroll={this.handleScroll}
                                    onMouseEnter={() => this.handleMouse("enter")}
                                    onMouseLeave={() => this.handleMouse("leave")}>
                                    <section className="aesthetic-scale scale-span scale-label scale-legend font large-medium flex-center column gap space-nicely space-all">
                                        {/* Display Settings */}
                                        <section className="section-group">
                                            <span className="font small when-elements-are-not-straight space-nicely space-bottom length-short">
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
                                                    onChange={(value) => this.handleToggleableButton(value, "button-screen-dimmer")}
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
                                            <Slider className="slider space-nicely space-top length-medium"
                                                onChange={(value) => this.handleSlider(value, "slider-screen-dimmer")}
                                                min={5}
                                                max={130}
                                                marks={{
                                                    100: {
                                                        label: 100,
                                                        style: {display: "none" }
                                                    }
                                                }}
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
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, "timeBased", "values")}
                                                    checked={this.state.values.timeBased}/>
                                            </section>
                                        </section>
                                        {/* Design Settings */}
                                        <section className="section-group">
                                            <span className="font small when-elements-are-not-straight space-nicely space-bottom length-short">
                                                <b>Design</b>
                                            </span>
                                            {/* Animation */}
                                            <section>
                                                <section className="element-ends">
                                                    <span className="font small">
                                                        Animation
                                                    </span>
                                                    <button className="button-match inverse"
                                                        onClick={() => this.randomOption("animation")}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </section>
                                                <Select id="settings-popout-design-select-animation"
                                                    className="select-match space-nicely space-top length-medium"
                                                    value={this.props.values.animation}
                                                    defaultValue={optionsAnimation[0]["options"][0]}
                                                    onChange={(event) => this.handleSelect(event, "animation")}
                                                    options={optionsAnimation}
                                                    formatGroupLabel={this.props.formatGroupLabel}
                                                    styles={this.props.selectStyleSmall}
                                                    components={{
                                                        MenuList: this.props.menuListScrollbar
                                                    }}
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
                                                    <button className="button-match inverse"
                                                        onClick={() => this.randomOption("background")}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </section>
                                                <Select id="settings-popout-design-select-background"
                                                    className="select-match space-nicely space-top length-medium"
                                                    value={this.state.values.background}
                                                    defaultValue={optionsBackground[0]["options"][0]}
                                                    onChange={(event) => this.handleSelect(event, "background")}
                                                    options={optionsBackground}
                                                    formatGroupLabel={this.props.formatGroupLabel}
                                                    styles={this.props.selectStyleSmall}
                                                    components={{
                                                        MenuList: this.props.menuListScrollbar
                                                    }}
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
                                                    <button className="button-match inverse"
                                                        onClick={() => this.randomOption("customBorder")}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </section>
                                                <Select id="settings-popout-design-select-custom-border"
                                                    className="select-match space-nicely space-top length-medium"
                                                    value={this.props.values.customBorder}
                                                    defaultValue={optionsCustomBorder[0]["options"][0]}
                                                    onChange={(event) => this.handleSelect(event, "customBorder")}
                                                    options={optionsCustomBorder}
                                                    formatGroupLabel={this.props.formatGroupLabel}
                                                    styles={this.props.selectStyleSmall}
                                                    components={{
                                                        MenuList: this.props.menuListScrollbar
                                                    }}
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
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, "shadow", "values")}
                                                        checked={this.props.values.shadow}
                                                        />
                                                </section>
                                            </section>
                                        </section>
                                        {/* Feature Settings */}
                                        <section className="section-group">
                                            <span className="font small when-elements-are-not-straight space-nicely space-bottom length-short">
                                                <b>Feature</b>
                                            </span>
                                            {/* General */}
                                            <fieldset className="section-sub">
                                                <legend className="font small space-nicely space-bottom length-short">
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
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, "authorNames", "values")}
                                                        checked={this.props.values.authorNames}/>
                                                </section>
                                            </fieldset>
                                            {/* Hotbar */}
                                            <fieldset className="section-sub space-nicely space-top not-bottom length-medium">
                                                <legend className="font small space-nicely space-bottom length-short">
                                                    Hotbar
                                                </legend>
                                                {/* Close */}
                                                <section className="element-ends">
                                                    <label className="font small"
                                                        htmlFor="settings-popout-feature-resetPosition">
                                                        Close
                                                    </label>
                                                    <input id="settings-popout-feature-close"
                                                        name="settings-input-popout-feature-close"
                                                        type="checkbox"
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, "close", "values")}
                                                        checked={this.props.values.close}/>
                                                </section>
                                                {/* Fullscreen */}
                                                <section className="element-ends">
                                                    <label className="font small"
                                                        htmlFor="settings-popout-feature-fullscreen">
                                                        Fullscreen
                                                    </label>
                                                    <input id="settings-popout-feature-fullscreen"
                                                        name="settings-input-popout-feature-fullscreen"
                                                        type="checkbox"
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, "fullscreen", "values")}
                                                        checked={this.props.values.fullscreen}/>
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
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, "resetPosition", "values")}
                                                        checked={this.props.values.resetPosition}
                                                        />
                                                </section>
                                            </fieldset>
                                        </section>
                                        {/* Misc Settings */}
                                        <section className="section-group">
                                            <span className="font small when-elements-are-not-straight space-nicely space-bottom length-short">
                                                <b>Misc</b>
                                            </span>
                                            {/* Voice */}
                                            <fieldset className="section-sub">
                                                <legend className="font small space-nicely space-bottom length-short">
                                                    Voice
                                                </legend>
                                                {/* Voice Change */}
                                                <section className="element-ends">
                                                    <span className="font small">
                                                        Type
                                                    </span>
                                                    <button className="button-match inverse"
                                                        onClick={() => this.randomOption("voice")}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </section>
                                                <Select id="settings-popout-misc-select-type"
                                                    className="select-match space-nicely space-top length-medium"
                                                    value={this.props.values.voice}
                                                    defaultValue={optionsVoice[0]["options"][0]}
                                                    onChange={(event) => this.handleSelect(event, "voice")}
                                                    options={optionsVoice}
                                                    formatGroupLabel={this.props.formatGroupLabel}
                                                    styles={this.props.selectStyleSmall}
                                                    components={{
                                                        MenuList: this.props.menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                                {/* Pitch */}
                                                <section className="element-ends">
                                                    <span className="font small">
                                                        Pitch
                                                    </span>
                                                    <button className="button-match inverse"
                                                        onClick={() => this.randomOption("slider", "voice-pitch", 0, 2)}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </section>
                                                <Slider className="slider space-nicely space-top length-medium"
                                                    onChange={(value) => this.handleSlider(value, "slider-voice-pitch")}
                                                    min={0}
                                                    max={2}
                                                    step={0.1}
                                                    marks={{
                                                        0: {
                                                            label: 0,
                                                            style: {display: "none" }
                                                        }
                                                    }}
                                                    value={this.props.values.pitch}/>
                                                {/* Rate */}
                                                <section className="element-ends">
                                                    <span className="font small">
                                                        Rate
                                                    </span>
                                                    <button className="button-match inverse"
                                                        onClick={() => this.randomOption("slider", "voice-rate", 0.1, 10)}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </section>
                                                <Slider className="slider space-nicely space-top length-medium"
                                                    onChange={(value) => this.handleSlider(value, "slider-voice-rate")}
                                                    min={0.1}
                                                    max={10}
                                                    step={0.1}
                                                    marks={{
                                                        1: {
                                                            label: 1,
                                                            style: {display: "none" }
                                                        }
                                                    }}
                                                    value={this.props.values.rate}/>
                                            </fieldset>
                                            {/* Popout */}
                                            <fieldset className="section-sub">
                                                <legend className="font small space-nicely space-bottom length-short">
                                                    Popout
                                                </legend>
                                                {/* Save position of popup */}
                                                <section className="element-ends">
                                                    <label className="font small"
                                                        htmlFor="settings-popout-misc-savepositionpopup">
                                                        Save Position: Popup
                                                    </label>
                                                    <input id="settings-popout-misc-savepositionpopup"
                                                        name="settings-input-popout-misc-savepositionpopout"
                                                        type="checkbox"
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, "savePositionPopout", "values")}
                                                        checked={this.props.values.savePositionPopout}/>
                                                </section>
                                            </fieldset>
                                            {/* Random */}
                                            <fieldset className="section-sub space-nicely space-top not-bottom length-medium">
                                                <legend className="font small space-nicely space-bottom length-short">
                                                    Random Events
                                                </legend>
                                                {/* Trick */}
                                                <section className="element-ends">
                                                    <label className="font small"
                                                        htmlFor="settings-popout-misc-random-trick">
                                                        Trick
                                                    </label>
                                                    <input id="settings-popout-misc-random-trick"
                                                        name="settings-input-popout-misc-random-trick"
                                                        type="checkbox"
                                                        onChange={(event) => this.handleRandomTrick(event.target.checked)}
                                                        checked={this.state.values.randomTrick}/>
                                                </section>
                                                {/* Text */}
                                                <section className="element-ends">
                                                    <label className="font small"
                                                        htmlFor="settings-popout-misc-random-text">
                                                        Text
                                                    </label>
                                                    <input id="settings-popout-misc-random-text"
                                                        name="settings-input-popout-misc-random-text"
                                                        type="checkbox"
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, "randomText", "values")}
                                                        checked={this.props.values.randomText}/>
                                                </section>
                                            </fieldset>
                                        </section>
                                        {/* Game Settings */}
                                        <section className="section-group">
                                            <span className="font small when-elements-are-not-straight space-nicely space-bottom length-short">
                                                <b>Game</b>
                                            </span>
                                            {/* Health Display */}
                                            <section>
                                                <section className="element-ends">
                                                    <span className="font small">
                                                        Health Display
                                                    </span>
                                                    <button className="button-match inverse"
                                                        onClick={() => this.randomOption("health")}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </section>
                                                <Select id="settings-popout-game-select-health"
                                                    className="select-match space-nicely space-top length-medium"
                                                    value={this.props.values.health}
                                                    defaultValue={optionsHealth[0]["options"][0]}
                                                    isDisabled={!this.state.settings}
                                                    onChange={(event) => this.handleSelect(event, "health")}
                                                    options={optionsHealth}
                                                    formatGroupLabel={this.props.formatGroupLabel}
                                                    styles={this.props.selectStyleSmall}
                                                    components={{
                                                        MenuList: this.props.menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                            </section>
                                        </section>
                                    </section>
                                    {/* Scrollable Arrow */}
                                    <section id="settings-popout-arrow-top"
                                        className="scrollable-arrow top-arrow">&#x2BC5;</section>
                                    <section id="settings-popout-arrow-bottom"
                                        className="scrollable-arrow bottom-arrow">&#x2BC6;</section>
                                </section>
                            </section>
                        </Draggable>
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetSetting);