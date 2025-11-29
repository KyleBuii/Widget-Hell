import { debounce } from 'lodash';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { AiOutlineBook } from 'react-icons/ai';
import { BiBriefcase, BiVolumeMute } from 'react-icons/bi';
import { FaGripHorizontal, FaRandom } from 'react-icons/fa';
import { GiAxeSword } from 'react-icons/gi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoBodyOutline, IoClose } from 'react-icons/io5';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import Switch from 'react-switch';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { widgetsFunActive, widgetsGamesActive, widgetsUtilityActive } from '../..';
import { classStack, decorationValue, tricks } from '../../data';
import { calculateBounds, dragStart, dragStop, formatGroupLabel, hexToRgb, menuListScrollbar, rgbToHex, selectStyleSmall, sortSelect } from '../../helpers';

let ranOnce = false;
let intervalTimeBased;
let timeoutTrick;
let previousCursor = null;

const optionsAnimation = [
    {
        label: 'Animations',
        options: [
            { value: 'default',     label: 'Default' },
            { value: 'fade',        label: 'Fade' },
            { value: 'shrink',      label: 'Shrink' },
            { value: 'blastingOff', label: 'Blasting Off' },
            { value: 'rendering',   label: 'Rendering' },
        ]
    }
];
const optionsBackground = [
    {
        label: 'Backgrounds',
        options: [
            { value: 'default', label: 'Default' },
            { value: 'white', label: 'White' },
            { value: 'linear-gradient', label: 'Linear-gradient' },
            { value: 'diagonal', label: 'Diagonal' },
            { value: 'microbial-mat', label: 'Microbial Mat' },
            { value: 'stairs', label: 'Stairs' },
            { value: 'half-rombes', label: 'Half-Rombes' },
            { value: 'arrows', label: 'Arrows' },
            { value: 'zig-zag', label: 'Zig-Zag' },
            { value: 'weave', label: 'Weave' },
            { value: 'upholstery', label: 'Upholstery' },
            { value: 'starry-night', label: 'Starry Night' },
            { value: 'marrakesh', label: 'Marrakesh' },
            { value: 'rainbow-bokeh', label: 'Rainbow Bokeh' },
            { value: 'carbon', label: 'Carbon' },
            { value: 'carbon-fibre', label: 'Carbon Fibre' },
            { value: 'hearts', label: 'Hearts' },
            { value: 'argyle', label: 'Argyle' },
            { value: 'steps', label: 'Steps' },
            { value: 'waves', label: 'Waves' },
            { value: 'cross', label: 'Cross' },
            { value: 'yin-yang', label: 'Yin Yang' },
            { value: 'stars', label: 'Stars' },
            { value: 'brady-bunch', label: 'Brady Bunch' },
            { value: 'shippo', label: 'Shippo' },
            { value: 'bricks', label: 'Bricks' },
            { value: 'seigaiha', label: 'Seigaiha' },
            { value: 'japanese-cube', label: 'Japanese Cube' },
            { value: 'polka-dot', label: 'Polka Dot' },
            { value: 'houndstooth', label: 'Houndstooth' },
            { value: 'checkerboard', label: 'Checkerboard' },
            { value: 'diagonal-checkerboard', label: 'Diagonal Checkerboard' },
            { value: 'tartan', label: 'Tartan' },
            { value: 'madras', label: 'Madras' },
            { value: 'lined-paper', label: 'Lined Paper' },
            { value: 'blueprint-grid', label: 'Blueprint Grid' },
            { value: 'tablecloth', label: 'Tablecloth' },
            { value: 'cicada-stripes', label: 'Cicada Stripes' },
            { value: 'honeycomb', label: 'Honeycomb' },
            { value: 'wave', label: 'Wave' },
            { value: 'pyramid', label: 'Pyramid' },
            { value: 'chocolate-weave', label: 'Chocolate Weave' },
            { value: 'cross-dots', label: 'Cross-Dots' }
        ]
    }
];
const optionsCustomBorder = [
    {
        label: 'Custom Borders',
        options: [
            { value: 'default',       label: 'Default' },
            { value: 'diagonal',      label: 'Diagonal' },
            { value: 'dashed',        label: 'Dashed' },
            { value: 'double',        label: 'Double' },
            { value: 'map-inspired',  label: 'Map Inspired' },
            { value: 'default-light', label: 'Default Light' },
        ]
    }
];
const optionsParticle = [
    {
        label: 'Particles',
        options: [
            { value: 0, label: 'Default' },
            { value: 1, label: 'Circle: Connect' },
            { value: 2, label: 'Circle: Pop' },
            { value: 3, label: 'Circle: Free Movement' },
            { value: 4, label: 'Circle: Zig-Zag' },
            { value: 5, label: 'Circle: Wander' },
            { value: 6, label: 'Circle: Infection' },
            { value: 7, label: 'Circle: Push' },
            { value: 8, label: 'Firework' },
            { value: 9, label: 'Confetti' },
            { value: 10, label: 'Mouse: Circle' },
            { value: 11, label: 'Mouse: Magnifying Glass' },
            { value: 12, label: 'Heart' },
        ]
    }
];
const optionsDecoration = [
    {
        label: 'Decorations',
        options: [
            { value: 'default', label: 'Default' },
            { value: 'ribbon', label: 'Ribbon' },
            { value: 'santa-hat', label: 'Santa Hat' },
            { value: 'witch', label: 'Witch' },
        ]
    }
];
const optionsVoice = [
    {
        label: 'Voices',
        options: [
            { value: '0', label: 'David' },
            { value: '1', label: 'Mark' },
            { value: '2', label: 'Zira' }
        ]
    }
];
const optionsHealth = [
    {
        label: 'Health',
        options: [
            { value: 'default', label: 'Default' },
            { value: 'limit5', label: 'Limit 5' },
            { value: 'noredheart', label: 'No Red Hearts' },
            { value: 'none', label: 'None' },
        ]
    }
];
const optionsLoot = [
    {
        label: 'Loot',
        options: [
            { value: 'default', label: 'Default' },
            { value: 'destiny2', label: 'Destiny 2' },
            { value: 'rotmg', label: 'RotMG' },
        ]
    }
];
const optionsCursor = [
    {
        label: 'Cursor',
        options: [
            { value: 'default', label: 'Default' },
            { value: 'delicatepink', label: 'Delicate Pink' },
            { value: 'cutesquid', label: 'Cute Squid' },
            { value: 'cutekoicarp', label: 'Cute Koi Carp' },
            { value: 'reimu', label: 'Reimu' },
            { value: 'gigimurin', label: 'Gigi Murin' },
        ]
    }
];
const optionsCursorSize = [
    {
        label: 'Sizes',
        options: [
            { value: '32', label: '32x32' },
            { value: '48', label: '48x48' },
            { value: '64', label: '64x64' },
        ]
    }
];

class WidgetSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widgetData: {},
            values: {
                screenDimmer: false,
                screenDimmerSlider: false,
                screenDimmerValue: 100,
                background: { value: 'default', label: 'Default' },
                timeBased: false,
                randomTrick: false,
                live2D: false,
                cursor: { value: 'default', label: 'Default' },
                cursorSize: { value: '32', label: '32x32' },
                reducedMotion: false,
            },
            search: '',
            searched: [],
            activeTab: 'utility',
            showHideWidgets: false,
            settings: false,
            inventory: false,
            equipment: false,
            character: false,
            guide: false,
            maxPageUtility: 0,
            maxPageGames: 0,
            maxPageFun: 0,
            pageUtility: -1,
            pageGames: -1,
            pageFun: -1,
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
        this.handleScriptLoaded = this.handleScriptLoaded.bind(this);
        this.hideSettings = this.hideSettings.bind(this);
        this.debounceUpdateSearch = debounce(this.updateSearch.bind(this), 200);
    };

    handleTrick() {
        const combinedWidgets = [...widgetsUtilityActive, ...widgetsGamesActive, ...widgetsFunActive];
        if (combinedWidgets.length !== 0) {
            const randIndexWidget = Math.floor(Math.random() * combinedWidgets.length);
            const randIndexAnimation = Math.floor(Math.random() * tricks.length);
            const e = document.getElementById(combinedWidgets[randIndexWidget] + '-widget-animation');
            e.style.animation = 'none';
            window.requestAnimationFrame(() => {
                e.style.animation = tricks[randIndexAnimation] + ' 2s';
            });
        };
    };

    handleRandomTrick(checked) {
        this.setState({
            values: {
                ...this.state.values,
                randomTrick: checked
            }
        }, () => {
            if (this.state.values.randomTrick) {
                this.randomTimeout('trick');  
            } else {
                clearTimeout(timeoutTrick);
                timeoutTrick = undefined;
            };
        });
    };

    handleClose(event) {
        let elementButton = document.getElementById(`show-hide-widgets-popout-button-${event.detail.element}`);
        if (elementButton !== null) {
            /// Default is a normal pressable button
            switch (event.detail.element) {
                case 'inventory':
                case 'equipment':
                case 'character':
                case 'guide':
                    this.setState({
                        [event.detail.element]: !this.state[event.detail.element]
                    });
                    elementButton.classList.add('disabled');
                    break;
                default:
                    elementButton.classList.add('disabled-option');
                    break;
            };
        };
        switch (event.detail.type) {
            case 'utility': {
                const widgetUtilityIndex = widgetsUtilityActive.indexOf(event.detail.element);
                this.unorderedRemove(widgetsUtilityActive, widgetUtilityIndex);
                break;
            };
            case 'games': {
                const widgetGamesIndex = widgetsGamesActive.indexOf(event.detail.element);
                this.unorderedRemove(widgetsGamesActive, widgetGamesIndex);
                break;
            };
            case 'fun': {
                const widgetFunIndex = widgetsFunActive.indexOf(event.detail.element);
                this.unorderedRemove(widgetsFunActive, widgetFunIndex);
                break;
            };
            default: { break; };
        };
    };

    handlePressableButton(what, where) {
        switch (what) {
            case 'showHideWidgets': {
                const buttonShowHideWidgets = document.getElementById('settings-button-show-hide-widgets');
                const showHideWidgetsPopoutAnimation = document.getElementById('show-hide-widgets-popout-animation');
                this.setState({
                    showHideWidgets: !this.state.showHideWidgets
                });
                this.props.showHidePopout(showHideWidgetsPopoutAnimation, !this.state.showHideWidgets, buttonShowHideWidgets);
                break;
            };
            case 'settings': {
                const buttonSettings = document.getElementById('settings-button-settings');
                const settingsPopoutAnimation = document.getElementById('settings-popout-animation');
                this.setState({
                    settings: !this.state.settings
                });
                this.props.showHidePopout(settingsPopoutAnimation, !this.state.settings, buttonSettings);
                break;
            };
            case 'inventory':
            case 'equipment':
            case 'character':
            case 'guide': {
                let elementButton = document.getElementById(`show-hide-widgets-popout-button-${what}`);
                this.props.showHide(what, where);
                this.setState({
                    [what]: !this.state[what]
                }, () => {
                    if (this.state[what]) {
                        elementButton.classList.remove('disabled');
                        this.props.updateWidgetsActive(what, where);
                    } else {
                        elementButton.classList.add('disabled');
                        const widgetUtilityIndex = widgetsUtilityActive.indexOf(what);
                        this.unorderedRemove(widgetsUtilityActive, widgetUtilityIndex);
                    };
                });
                break;
            };
            default: {
                const button = document.getElementById('show-hide-widgets-popout-button-' + what);

                this.props.showHide(what, where);

                if (!this.props.widgets[where][what].active) {
                    button.classList.remove('disabled-option');
                    this.props.updateWidgetsActive(what, where);
                } else {
                    button.classList.add('disabled-option');

                    switch (where) {
                        case 'utility': {
                            const widgetUtilityIndex = widgetsUtilityActive.indexOf(what);
                            this.unorderedRemove(widgetsUtilityActive, widgetUtilityIndex);
                            break;
                        };
                        case 'games': {
                            const widgetGamesIndex = widgetsGamesActive.indexOf(what);
                            this.unorderedRemove(widgetsGamesActive, widgetGamesIndex);
                            break;
                        };
                        case 'fun': {
                            const widgetFunIndex = widgetsFunActive.indexOf(what);
                            this.unorderedRemove(widgetsFunActive, widgetFunIndex);
                            break;
                        };
                        default: { break; };
                    };
                };
                
                break;
            };
        };
    };

    handleToggleableButton(value, what) {
        switch (what) {
            case 'button-screen-dimmer':
                this.setState({
                    values: {
                        ...this.state.values,
                        screenDimmer: value,
                        screenDimmerSlider: (this.state.values.timeBased) ? false : true
                    }
                }, () => {
                    if (this.state.values.timeBased === false) {
                        if (this.state.values.screenDimmer) {
                            document.body.style.filter = `brightness(${this.state.values.screenDimmerValue}%)`;
                        } else {
                            document.body.style.filter = 'brightness(100%)';
                            this.setState({
                                values: {
                                    ...this.state.values,
                                    screenDimmerSlider: false
                                }
                            });
                        };
                    } else {
                        if (this.state.values.screenDimmer) {
                            this.handleInterval(value);
                        } else {
                            document.body.style.filter = 'brightness(100%)';
                        };
                    };
                });
                break;
            default: break;
        };
    };

    handleSlider(value, what) {
        switch (what) {
            case 'slider-screen-dimmer':
                this.setState({
                    values: {
                        ...this.state.values,
                        screenDimmerValue: value
                    }
                }, () => {
                    if (this.state.values.screenDimmer === true) {
                        document.body.style.filter = 'brightness(' + this.state.values.screenDimmerValue + '%)';
                    };
                });
                break;
            case 'slider-voice-pitch':
                this.setState({
                    values: {
                        ...this.state.values,
                        pitch: value
                    }
                }, () => {
                    this.props.updateValue(value, 'pitch', 'values');
                });
                break;
            case 'slider-voice-rate':
                this.setState({
                    values: {
                        ...this.state.values,
                        rate: value
                    }
                }, () => {
                    this.props.updateValue(value, 'rate', 'values');
                });
                break;
            default:
                this.props.updateValue(value, what, 'values');
                break;
        };
    };

    handleSelect(what, where) {
        switch (where) {
            case 'background':
            case 'cursor':
            case 'cursorSize': {
                if (where === 'cursor') {
                    this.updateCursor(what);
                } else if (where === 'cursorSize') {
                    this.updateCursor(this.state.values.cursor, what);   
                } else {
                    this[`update${where.replace(/^./, (char) => char.toUpperCase())}`](what);
                };

                this.setState({
                    values: {
                        ...this.state.values,
                        [where]: what
                    }
                });
                break;
            };
            default: {
                this.props.updateValue(what, where, 'values');
                break;
            };
        };
    };

    handleCheckbox(checked, what, type) {
        switch (what) {
            case 'timeBased':
            case 'live2D':
            case 'reducedMotion':
                this.setState({
                    values: {
                        ...this.state.values,
                        [what]: checked
                    }
                }, () => {
                    switch (what) {
                        case 'timeBased':
                            this.setState({
                                values: {
                                    ...this.state.values,
                                    screenDimmerSlider: !checked
                                }
                            });
                            this.handleInterval(checked);
                            break;
                        case 'live2D':
                            this.updateLive2D();
                            break;
                        case 'reducedMotion':
                            document.body.classList.toggle('reduced-motion');
                            break;
                        default: break;
                    };    
                });
                break;
            default:
                this.props.updateValue(checked, what, type);
                break;
        };
    };

    handleColor(event, what) {
        this.props.updateValue(hexToRgb(event), what, 'values');
    };

    handleRadio(event) {
        this.props.updateValue(event.target.value, event.target.name, 'values');
    };

    handleSearch(event) {
        const value = event.target.value;
        this.setState({ search: value });
        this.debounceUpdateSearch(value);
    };

    handleInterval(what) {
        if (what === true) {
            this.updateScreenDimmer();
            intervalTimeBased = setInterval(this.updateScreenDimmer, 1800000);
        } else {
            document.body.style.filter = `brightness(${this.state.values.screenDimmerValue}%)`;
            clearInterval(intervalTimeBased);
        };
    };

    handleScroll() {
        let element = document.getElementById('settings-popout-animation');
        let arrowTop = document.getElementById('settings-popout-arrow-top');
        let arrowBottom = document.getElementById('settings-popout-arrow-bottom');
        /// Scrolled to bottom
        if ((element.offsetHeight + element.scrollTop) >= element.scrollHeight) {
            arrowBottom.style.opacity = '0';
        /// Scrolled to top
        } else if (element.scrollTop === 0) {
            arrowTop.style.opacity = '0';
        } else {
            arrowBottom.style.opacity = 'unset';
            arrowTop.style.opacity = 'unset';
        };
    };

    handleMouse(what) {
        let element = document.getElementById('settings-popout-animation');
        let arrowTop = document.getElementById('settings-popout-arrow-top');
        let arrowBottom = document.getElementById('settings-popout-arrow-bottom');
        switch (what) {
            case 'enter':
                if ((element.offsetHeight + element.scrollTop) >= element.scrollHeight) {
                    arrowTop.style.opacity = '1';
                    arrowBottom.style.opacity = '0';
                } else if (element.scrollTop === 0) {
                    arrowTop.style.opacity = '0'; 
                    arrowBottom.style.opacity = '1'; 
                } else {
                    arrowTop.style.opacity = '1';
                    arrowBottom.style.opacity = '1';
                };       
                break;
            case 'leave':
                arrowTop.style.opacity = '0';
                arrowBottom.style.opacity = '0';
                break;
            default: break;
        };
    };

    handleScriptLoaded(event) {
        switch (event.detail.name) {
            case 'live2d':
                this.updateLive2D();
                break;
            default: break;
        };
    };

    handleTabSwitch(what) {
        this.setState({
            search: '',
            activeTab: what
        }, () => {
            this.updateSearch(this.state.search);
            if (this.state[`page${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`] !== 0) {
                this.handlePageClick(0);
            };
        });
    };

    handlePageClick(event) {
        this.setState({
            [`page${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`]: event
        }, () => {
            this.updateTab(this.state.activeTab);    
        });
    };

    updateTab(what) {
        let tabCapitalized = what.replace(/^./, (char) => char.toUpperCase());
        let widgetPage = `page${tabCapitalized}`;
        let widgetKeys = Object.keys(this.state.widgetData[what])
            .sort()
            .slice((12 * this.state[widgetPage]), (12 + (12 * this.state[widgetPage])));
        
        const widgetsActiveLookup = {
            Utility: widgetsUtilityActive,
            Games: widgetsGamesActive,
            Fun: widgetsFunActive
        };

        for (let widget of widgetsActiveLookup[tabCapitalized]) {
            if (widgetKeys.indexOf(widget) !== -1) {
                switch (widget) {
                    case 'inventory':
                    case 'equipment': {
                        break;
                    };
                    default: {
                        let elementButton = document.getElementById('show-hide-widgets-popout-button-' + widget);
                        elementButton.style.opacity = '1';
                        break;
                    };
                };
            };
        };
    };

    updateSearch(what) {
        let widgetsMatch = [];
        let widgetButtons = this[`buttons${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`];
        if (what.length > 2) {
            let regexSearch = new RegExp(`(${what})`, 'i');
            for (let i of widgetButtons) {
                if (regexSearch.test(i.props['data-widgetname'])) {
                    widgetsMatch.push(i.props['data-widgetname']);
                };
            };
        };
        this.setState({
            searched: [...widgetsMatch]
        }, () => {
            if (what.length <= 2) {
                this.updateTab(this.state.activeTab);
            };
        });
    };

    updateBackground(what) {
        let e = document.getElementById('App');
        e.classList.remove(`background-${this.state.values.background.value}`);
        e.classList.add(`background-${what.value}`);    
    };

    updateCursor(what, size = 0) {
        if (what.value === 'default') {
            document.body.classList.remove('cursor-unset', 'cursor-custom');
        } else {
            document.body.classList.remove(previousCursor);
            document.body.classList.add('cursor-unset', 'cursor-custom', what.value);

            const currentSize = size.value || this.state.values.cursorSize.value;

            document.documentElement.style.setProperty('--cursorDefault', `url(/resources/cursor/${what.value}/${what.value}-default-${currentSize}.webp)`);
            document.documentElement.style.setProperty('--cursorHover', `url(/resources/cursor/${what.value}/${what.value}-pointer-${currentSize}.webp)`);

            previousCursor = what.value;
        };
    };

    updateScreenDimmer() {
        /// Triggers a new screen dim every 30 minutes based on time
        /// 24-6 = 40% brightness
        /// 7-8 = 40% - 100% brightness: 2 hours:30 minutes x 4 -> 15% increase
        /// 8-18 = 100% brightness
        /// 19-24 = 100% to 40% brightness: 5 hours:30 minutes x 10 -> 6% decrease
        let date = new Date();
        let brightness;
        let hour = date.getHours();
        let minute = date.getMinutes();
        if (hour >= 0 && hour <= 6) {
            brightness = 40;
        } else if (hour >= 8 && hour<= 18) {
            brightness = 100;
        };
        switch (hour) {
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
            default: break;
        };
        document.body.style.filter = `brightness(${brightness}%)`;
    };

    updateLive2D() {
        let elementLive2DToggle = document.getElementById('waifu-toggle');
        if (elementLive2DToggle !== null) {
            if (!this.state.values.live2D) {
                elementLive2DToggle.style.display = 'none';
                document.getElementById('waifu-tool-quit').click();
            } else {
                elementLive2DToggle.style.display = 'block';
                let elementWaifu = document.getElementById('waifu');
                elementWaifu.style.visibility = 'visible';        
            };
        };
    };

    unorderedRemove(arr, i) {
        if (i < 0 || i >= arr.length) return;
        if (i < arr.length-1) {
            arr[i] = arr[arr.length-1];
        };
        arr.length -= 1;
        return arr;
    };

    randomOption({ what, element, min, max, options }) {
        let random;
        switch (what) {
            case 'slider':
                random = Math.random() * max + min;
                this.handleSlider(random, element);
                break;
            default:
                random = options[0].options[Math.floor(Math.random() * (options[0].options.length - 1)) + 1];
                this.handleSelect(random, what);
                break;
        };

    };

    mute(what) {
        this.props.updateValue(!this.props.values[`${what}Mute`], `${what}Mute`, 'values');
    };

    randomTimeout(what) {
        switch (what) {
            case 'trick':
                if (this.state.values.randomTrick && timeoutTrick === undefined) {
                    let randomNumber = Math.random() * 300000 + 60000;
                    timeoutTrick = setTimeout(() => {
                        timeoutTrick = undefined;
                        this.handleTrick();
                        this.randomTimeout('trick');
                    }, randomNumber);
                };
                break;
            default: break;
        };
    };

    hideSettings() {
        const buttonShowHideWidgets = document.getElementById('settings-button-show-hide-widgets');
        if (!buttonShowHideWidgets.classList.contains('disabled-option')) {
            const showHideWidgetsPopoutAnimation = document.getElementById('show-hide-widgets-popout-animation');
            this.setState({
                showHideWidgets: false
            });
            this.props.showHidePopout(showHideWidgetsPopoutAnimation, false, buttonShowHideWidgets);
        };
        const buttonSettings = document.getElementById('settings-button-settings');
        if (!buttonSettings.classList.contains('disabled-option')) {
            const settingsPopoutAnimation = document.getElementById('settings-popout-animation');
            this.setState({
                settings: false
            });
            this.props.showHidePopout(settingsPopoutAnimation, false, buttonSettings);
        };
    };

    createWidgetButtons() {
        this.buttonsUtility = [];
        this.buttonsGames = [];
        this.buttonsFun = [];

        let tabs = ['utility', 'games', 'fun'];

        for (let tab of tabs) {
            if (!this.state.widgetData[tab]) return;

            let widgetKeys = Object.keys(this.state.widgetData[tab]).sort();

            for (let widgetIndex in widgetKeys) {
                let widget = widgetKeys[widgetIndex];
                let elementButton =
                    <button id={`show-hide-widgets-popout-button-${widget}`}
                        data-widgetname={widget}
                        className='button-match option disabled-option'
                        onClick={() => this.handlePressableButton(widget, tab)}>
                        {this.state.widgetData[tab][widget]}
                    </button>;

                switch (tab) {
                    case 'utility': this.buttonsUtility.push(elementButton); break;
                    case 'games':   this.buttonsGames.push(elementButton);   break;
                    case 'fun':     this.buttonsFun.push(elementButton);     break;
                    default: break;
                };
            };    
        };
    };

    async setupPages() {
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
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = await JSON.parse(localStorage.getItem('widgets'));
            let localStorageValues = dataLocalStorage['utility']['setting']['values'];
            let widgetUtilityKeys = Object.keys(this.props.widgets['utility'])
                .sort()
                .slice(0, 12);
            widgetUtilityKeys = [...widgetUtilityKeys, 'inventory', 'equipment', 'character'];
            for (let i of widgetUtilityKeys) {
                if (dataLocalStorage.utility[i]?.active === true) {
                    switch (i) {
                        case 'inventory':
                        case 'equipment':
                        case 'character':
                        case 'guide': {
                            let buttonRPG = document.getElementById(`show-hide-widgets-popout-button-${i}`);
                            buttonRPG.classList.remove('disabled');
                            this.setState({
                                [i]: dataLocalStorage.utility[i].active
                            });
                            break;
                        };
                        default: {
                            let button = document.getElementById('show-hide-widgets-popout-button-' + i);
                            button?.classList.remove('disabled-option');
                            break;
                        };
                    };
                };
            };
            /// Values saved here
            if (localStorageValues['screenDimmer'] !== undefined) {
                let keyValues = Object.keys(this.state.values);
                let dontStoreValues = ['screenDimmerSlider'];
                let filteredValues = keyValues.filter((value) => !dontStoreValues.includes(value));
                let objectValues = {};
                filteredValues.forEach((value) => {
                    objectValues[value] = localStorageValues[value];
                });    
                this.setState({
                    values: {
                        ...this.state.values,
                        ...objectValues,
                        screenDimmerSlider: (localStorageValues['timeBased']) ? false : localStorageValues['screenDimmer'],
                    }
                }, () => {
                    /// Update Display
                    if (this.state.values.screenDimmer && this.state.values.timeBased) {
                        this.handleInterval(true);
                    } else if (this.state.values.screenDimmer) {
                        document.body.style.filter = `brightness(${this.state.values.screenDimmerValue}%)`;
                    };
                    /// Update Design
                    this.updateBackground(this.state.values.background);
                    this.updateCursor(this.state.values.cursor);
                    /// Set random
                    if (this.state.values.randomTrick) {
                        this.randomTimeout('trick');
                    };
                });
            } else {
                this.updateLive2D();
            };
            /// Values not saved here
            if (localStorageValues['cursorTrailColor'] !== undefined) {
                document.getElementById('settings-popout-misc-cursor-trail-color').defaultValue = rgbToHex(localStorageValues['cursorTrailColor']);
            };
            if (localStorageValues['cursorTrailMode'] !== undefined) {
                document.getElementById(`settings-popout-misc-cursor-trail-${localStorageValues['cursorTrailMode']}`).checked = 'true';
            };
        };
    };

    storeData() {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let keyValues = Object.keys(this.state.values);
            let dontStoreValues = ['screenDimmerSlider'];
            let filteredValues = keyValues.filter((value) => !dontStoreValues.includes(value));
            let objectValues = {};
            filteredValues.forEach((value) => {
                objectValues[value] = this.state.values[value];
            });
            dataLocalStorage['utility']['setting'] = {
                ...dataLocalStorage['utility']['setting'],
                values: {
                    ...dataLocalStorage['utility']['setting']['values'],
                    ...objectValues
                }
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };

    async componentDidUpdate(prevProps) {
        if (!ranOnce && prevProps.widgets !== this.props.widgets) {
            ranOnce = true;

            let newWidgetdata = {};

            for (let widgetType of Object.keys(this.props.widgets)) {
                for (let widget of Object.keys(this.props.widgets[widgetType])) {
                    switch (widget) {
                        case 'setting':
                        case 'inventory':
                        case 'equipment':
                        case 'character':
                        case 'guide': break;
                        default:
                            newWidgetdata[widgetType] = {
                                ...newWidgetdata[widgetType],
                                [widget]: this.props.widgets[widgetType][widget].name
                            };
                            break;
                    };
                };
            };

            this.setState({
                widgetData: newWidgetdata
            }, () => {
                this.createWidgetButtons();
                this.setupPages();
            });
        };
    };

    async componentDidMount() {
        window.addEventListener('close', this.handleClose);
        window.addEventListener('beforeunload', this.storeData);
        window.addEventListener('script loaded', this.handleScriptLoaded);
        window.addEventListener('setting hide', this.hideSettings);
      
        sortSelect(optionsAnimation);
        sortSelect(optionsBackground);
        sortSelect(optionsCustomBorder);
        sortSelect(optionsParticle);
        sortSelect(optionsVoice);
        sortSelect(optionsHealth);

        let elementSelects = document.getElementById('settings-widget-animation')
            .querySelectorAll('.select-match');
        for (let i of elementSelects) {
            i.style.display = 'none';
        };
    };

    componentWillUnmount() {
        window.removeEventListener('close', this.handleClose);
        window.removeEventListener('beforeunload', this.storeData);
        window.removeEventListener('setting hide', this.hideSettings);
        clearInterval(intervalTimeBased);
        clearTimeout(timeoutTrick);
    };
    
    render() {
        return (
            <Draggable position={{ x: this.props.position.x, y: this.props.position.y }}
                onStart={() => dragStart('settings')}
                onStop={(event, data) => {
                    dragStop('settings');
                    this.props.updatePosition('setting', 'utility', data.x, data.y);
                }}
                cancel='button, span, p, li, .popout'
                bounds='parent'>
                <section id='settings-widget'
                    className='widget'
                    aria-labelledby='settings-widget-heading'>
                    <h2 id='settings-widget-heading'
                        className='screen-reader-only'>Settings Widget</h2>
                    <div id='settings-widget-animation'
                        className={`widget-animation ${classStack}`}>
                        <span id='settings-widget-draggable'
                            className='draggable'>
                            <IconContext.Provider value={{ size: '3em', className: 'global-class-name' }}>
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
                        <div className='hotbar'>
                            {/* Close */}
                            {(this.props.valueClose)
                                ? <button className='button-match inverse when-elements-are-not-straight'
                                    aria-label='Hotbar close'
                                    onClick={() => this.props.showSetting()}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </div>
                        {/* Buttons */}
                        <div className='font large-medium no-color flex-center column gap'>
                            <button id='settings-button-show-hide-widgets'
                                className='button-match option opt-long disabled-option'
                                onClick={() => this.handlePressableButton('showHideWidgets')}>Show/Hide Widgets</button>
                            <button id='settings-button-settings'
                                className='button-match option opt-long disabled-option'
                                onClick={() => this.handlePressableButton('settings')}>Settings</button>
                            <div className='button-set-two flex-center row gap'>
                                <button className='button-match option'
                                    onClick={this.handleTrick}>Do a trick!</button>
                                <button className='button-match option'
                                    onClick={() => this.props.randomColor()}>Change color</button>
                            </div>
                        </div>
                        {/* Show/Hide Widgets Popout */}
                        <Draggable defaultPosition={{ x: this.props.positionPopout.showhidewidgets.x, y: this.props.positionPopout.showhidewidgets.y }}
                            onStop={(event, data) => this.props.updatePosition('setting', 'utility', data.x, data.y, 'popout', 'showhidewidgets')}
                            cancel='button, #show-hide-widgets-popout-tabs, .paginate-pages'
                            bounds={calculateBounds('settings-widget', 'show-hide-widgets-popout')}>
                            <section id='show-hide-widgets-popout'
                                className='popout'
                                aria-labelledby='show-hide-widgets-popout-heading'>
                                <h2 id='show-hide-widgets-popout-heading'
                                    className='screen-reader-only'>Show/Hide Widgets Popout</h2>
                                <div id='show-hide-widgets-popout-animation'
                                    className={`popout-animation ${classStack}`}>
                                    <Tabs defaultIndex={0}
                                        onSelect={(index) => {
                                            const tabs = ['utility', 'games', 'fun'];
                                            this.handleTabSwitch(tabs[index]);
                                        }}>
                                        <TabList id='show-hide-widgets-popout-tabs'>
                                            {/* Tabs */}
                                            <div>
                                                <Tab>Utility</Tab>
                                                <Tab>Games</Tab>
                                                <Tab>Fun</Tab>
                                            </div>
                                            {/* Other Stuff */}
                                            <div className='flex-center wrap'>
                                                <button id='show-hide-widgets-popout-button-inventory'
                                                    className='button-match inverse disabled'
                                                    aria-label='Inventory'
                                                    type='button'
                                                    onClick={() => this.handlePressableButton('inventory', 'utility')}>
                                                    <IconContext.Provider value={{ size: this.props.smallMedIcon, className: 'global-class-name' }}>
                                                        <BiBriefcase/>
                                                    </IconContext.Provider>
                                                </button>
                                                <button id='show-hide-widgets-popout-button-equipment'
                                                    className='button-match inverse disabled'
                                                    aria-label='Equipment'
                                                    type='button'
                                                    onClick={() => this.handlePressableButton('equipment', 'utility')}>
                                                    <IconContext.Provider value={{ size: this.props.smallMedIcon, className: 'global-class-name' }}>
                                                        <GiAxeSword/>
                                                    </IconContext.Provider> 
                                                </button>
                                                <button id='show-hide-widgets-popout-button-character'
                                                    className='button-match inverse disabled'
                                                    aria-label='Character'
                                                    type='button'
                                                    onClick={() => this.handlePressableButton('character', 'utility')}>
                                                    <IconContext.Provider value={{ size: this.props.smallMedIcon, className: 'global-class-name' }}>
                                                        <IoBodyOutline/>
                                                    </IconContext.Provider> 
                                                </button>
                                                <button id='show-hide-widgets-popout-button-guide'
                                                    className='button-match inverse disabled'
                                                    aria-label='Guide'
                                                    type='button'
                                                    onClick={() => this.handlePressableButton('guide', 'utility')}>
                                                    <IconContext.Provider value={{ size: this.props.smallMedIcon, className: 'global-class-name' }}>
                                                        <AiOutlineBook/>
                                                    </IconContext.Provider> 
                                                </button>
                                                <input className='input-typable'
                                                    name='settings-input-show-hide-widgets-search'
                                                    type='text'
                                                    placeholder='Search'
                                                    aria-describedby='show-hide-widgets-input-aria-describedby'
                                                    value={this.state.search}
                                                    onChange={this.handleSearch}></input>
                                                <span id='show-hide-widgets-input-aria-describedby'
                                                    className='screen-reader-only'>Type here to search for a widget.</span>
                                            </div>
                                        </TabList>
                                        {/* Utility */}
                                        <TabPanel>
                                            <div id='show-hide-widgets-popout-button-utility'
                                                className='button-set-three font large-medium no-color space-nicely space-all'>
                                                {(this.state.search.length === 0)
                                                    ? this.buttonsUtility?.slice((12 * this.state.pageUtility), (12 + (12 * this.state.pageUtility))).map((widget) => {
                                                        return <span key={`widget-${widget.props['data-widgetname']}`}>
                                                            {widget}
                                                        </span>})
                                                    : (this.state.searched.length !== 0)
                                                        ? this.buttonsUtility?.filter((button) => this.state.searched.includes(button.props['data-widgetname']))
                                                            .map((button) => {
                                                                return <span key={`widget-${button.props['data-widgetname']}`}>
                                                                    {button}
                                                                </span>
                                                            })
                                                        : <></>}
                                            </div>
                                        </TabPanel>
                                        {/* Games */}
                                        <TabPanel>
                                            <div id='show-hide-widgets-popout-button-games'
                                                className='font large-medium no-color space-nicely space-all'>
                                                {(this.state.search.length === 0)
                                                    ? this.buttonsGames?.slice((12 * this.state.pageGames), (12 + (12 * this.state.pageGames))).map((widget) => {
                                                        return <span key={`widget-${widget.props['data-widgetname']}`}>
                                                            {widget}
                                                        </span>})
                                                    : (this.state.searched.length !== 0)
                                                        ? this.buttonsGames?.filter((button) => this.state.searched.includes(button.props['data-widgetname']))
                                                            .map((button) => {
                                                                return <span key={`widget-${button.props['data-widgetname']}`}>
                                                                    {button}
                                                                </span>
                                                            })
                                                        : <></>}
                                            </div>
                                        </TabPanel>
                                        {/* Fun */}
                                        <TabPanel>
                                            <div id='show-hide-widgets-popout-button-fun'
                                                className='font large-medium no-color space-nicely space-all'>
                                                {(this.state.search.length === 0)
                                                    ? this.buttonsFun?.slice((12 * this.state.pageFun), (12 + (12 * this.state.pageFun))).map((widget) => {
                                                        return <span key={`widget-${widget.props['data-widgetname']}`}>
                                                            {widget}
                                                        </span>})
                                                    : (this.state.searched.length !== 0)
                                                        ? this.buttonsFun?.filter((button) => this.state.searched.includes(button.props['data-widgetname']))
                                                            .map((button) => {
                                                                return <span key={`widget-${button.props['data-widgetname']}`}>
                                                                    {button}
                                                                </span>
                                                            })
                                                        : <></>}
                                            </div>
                                        </TabPanel>
                                    </Tabs>
                                    <ReactPaginate className='paginate-pages font bold'
                                        forcePage={this.state[`page${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`]}
                                        breakLabel='...'
                                        nextLabel={
                                            <span className='flex-center'>
                                                <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                                    <IoIosArrowForward/>
                                                </IconContext.Provider>
                                            </span>
                                        }
                                        onPageChange={(event) => this.handlePageClick(event.selected)}
                                        pageRangeDisplayed={3}
                                        pageCount={this.state[`maxPage${this.state.activeTab.replace(/^./, (char) => char.toUpperCase())}`]}
                                        previousLabel={
                                            <span className='flex-center'>
                                                <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                                    <IoIosArrowBack/>
                                                </IconContext.Provider>
                                            </span>
                                        }
                                        renderOnZeroPageCount={null}/>
                                </div>
                            </section>
                        </Draggable>
                        {/* Settings Popout */}
                        <Draggable defaultPosition={{ x: this.props.positionPopout.settings.x, y: this.props.positionPopout.settings.y }}
                            onStop={(event, data) => this.props.updatePosition('setting', 'utility', data.x, data.y, 'popout', 'settings')}
                            cancel='span, label, input, button, .toggleable, .slider, .select-match'
                            bounds={calculateBounds('settings-widget', 'settings-popout')}>
                            <section id='settings-popout'
                                className='popout'
                                aria-labelledby='settings-popout-heading'>
                                <h2 id='settings-popout-heading'
                                    className='screen-reader-only'>Settings Popout</h2>
                                <div id='settings-popout-animation'
                                    className={`popout-animation scrollable ${classStack}`}
                                    onScroll={this.handleScroll}
                                    onMouseEnter={() => this.handleMouse('enter')}
                                    onMouseLeave={() => this.handleMouse('leave')}>
                                    <div className='aesthetic-scale scale-span scale-label scale-legend font large-medium flex-center column gap space-nicely space-all'>
                                        {/* Accessibility Settings */}
                                        <section className='section-group'
                                            aria-labelledby='settings-accessibility-heading'>
                                            <h2 id='settings-accessibility-heading'
                                                className='screen-reader-only'>Accessibility Settings</h2>
                                            <span className='font small when-elements-are-not-straight space-nicely space-bottom length-short'>
                                                <b>Accessibility</b>
                                            </span>
                                            <div className='element-ends'>
                                                <label className='font small'
                                                    htmlFor='settings-popout-accessibility-transcribeAudio'>
                                                    Transcribe Audio
                                                </label>
                                                <input id='settings-popout-accessibility-transcribeAudio'
                                                    name='settings-input-popout-accessibility-transcribeAudio'
                                                    type='checkbox'
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, 'transcribeAudio', 'values')}
                                                    checked={this.props.values.transcribeAudio}/>
                                            </div>
                                            <div className='element-ends'>
                                                <label className='font small'
                                                    htmlFor='settings-popout-accessibility-reducedMotion'>
                                                    Reduced Motion
                                                </label>
                                                <input id='settings-popout-accessibility-reducedMotion'
                                                    name='settings-input-popout-accessibility-reducedMotion'
                                                    type='checkbox'
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, 'reducedMotion', 'values')}
                                                    checked={this.state.values.reducedMotion}/>
                                            </div>
                                        </section>
                                        {/* Display Settings */}
                                        <section className='section-group'
                                            aria-labelledby='settings-display-heading'>
                                            <h2 id='settings-display-heading'
                                                className='screen-reader-only'>Display Settings</h2>
                                            <span className='font small when-elements-are-not-straight space-nicely space-bottom length-short'>
                                                <b>Display</b>
                                            </span>
                                            {/* Screen Dimmer */}
                                            <div className='element-ends'>
                                                <span className='font small'>
                                                    Screen Dimmer
                                                </span>
                                                <Switch className='toggleable'
                                                    name='settings-switch-screen-dimmer'
                                                    checked={this.state.values.screenDimmer}
                                                    onChange={(value) => this.handleToggleableButton(value, 'button-screen-dimmer')}
                                                    onColor='#86d3ff'
                                                    onHandleColor='#2693e6'
                                                    handleDiameter={15}
                                                    uncheckedIcon={false}
                                                    checkedIcon={false}
                                                    boxShadow='0px 1px 3px rgba(0, 0, 0, 0.6)'
                                                    activeBoxShadow='0px 0px 1px 5px rgba(0, 0, 0, 0.2)'
                                                    height={15}
                                                    width={30}/>
                                            </div>
                                            <Slider className='slider space-nicely space-top length-small'
                                                onChange={(value) => this.handleSlider(value, 'slider-screen-dimmer')}
                                                min={5}
                                                max={130}
                                                marks={{
                                                    100: {
                                                        label: 100,
                                                        style: {display: 'none' }
                                                    }
                                                }}
                                                value={this.state.values.screenDimmerValue}
                                                disabled={!this.state.values.screenDimmerSlider}/>
                                            <div className='element-ends'>
                                                <label className='font small'
                                                    htmlFor='settings-popout-display-timeBased'>
                                                    Change based on time
                                                </label>
                                                <input id='settings-popout-display-timeBased'
                                                    name='settings-input-popout-display-timeBased'
                                                    type='checkbox'
                                                    disabled={!this.state.values.screenDimmer}
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, 'timeBased', 'values')}
                                                    checked={this.state.values.timeBased}/>
                                            </div>
                                        </section>
                                        {/* Design Settings */}
                                        <section className='section-group'
                                            aria-labelledby='settings-design-heading'>
                                            <h2 id='settings-design-heading'
                                                className='screen-reader-only'>Design Settings</h2>
                                            <span className='font small when-elements-are-not-straight space-nicely space-bottom length-short'>
                                                <b>Design</b>
                                            </span>
                                            {/* Animation */}
                                            <div>
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Animation
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random animation'
                                                        onClick={() => this.randomOption({ what: 'animation', options: optionsAnimation })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Select id='settings-popout-design-select-animation'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.props.values.animation}
                                                    defaultValue={optionsAnimation[0]['options'][0]}
                                                    onChange={(event) => this.handleSelect(event, 'animation')}
                                                    options={optionsAnimation}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                            </div>
                                            {/* Background */}
                                            <div>
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Background
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random background'
                                                        onClick={() => this.randomOption({ what: 'background', options: optionsBackground })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Select id='settings-popout-design-select-background'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.state.values.background}
                                                    defaultValue={optionsBackground[0]['options'][0]}
                                                    onChange={(event) => this.handleSelect(event, 'background')}
                                                    options={optionsBackground}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                            </div>
                                            {/* Custom Border */}
                                            <div>
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Custom Border
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random border'
                                                        onClick={() => this.randomOption({ what: 'customBorder', options: optionsCustomBorder })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Select id='settings-popout-design-select-custom-border'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.props.values.customBorder}
                                                    defaultValue={optionsCustomBorder[0]['options'][0]}
                                                    onChange={(event) => this.handleSelect(event, 'customBorder')}
                                                    options={optionsCustomBorder}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                            </div>
                                            {/* Particle */}
                                            <div>
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Particle
                                                    </span>
                                                    <div className='flex-center row'>
                                                        <button className='button-match inverse'
                                                            aria-label='Mute particle'
                                                            onClick={() => this.mute('particle')}>
                                                            <IconContext.Provider value={{ size: '0.7em', className: 'global-class-name' }}>
                                                                <BiVolumeMute/>
                                                            </IconContext.Provider>
                                                        </button>
                                                        <button className='button-match inverse'
                                                            aria-label='Random particle'
                                                            onClick={() => this.randomOption({ what: 'particle', options: optionsParticle })}>
                                                            <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                                <FaRandom/>
                                                            </IconContext.Provider>
                                                        </button>
                                                    </div>
                                                </div>
                                                <Select id='settings-popout-design-select-particle'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.props.values.particle}
                                                    defaultValue={optionsParticle[0]['options'][0]}
                                                    onChange={(event) => this.handleSelect(event, 'particle')}
                                                    options={optionsParticle}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                            </div>
                                            {/* Decoration */}
                                            <div>
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Decoration
                                                    </span>
                                                    <div className='flex-center row'>
                                                        <button className='button-match inverse'
                                                            aria-label='Random decoration'
                                                            onClick={() => this.randomOption({ what: 'decoration', options: optionsDecoration })}>
                                                            <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                                <FaRandom/>
                                                            </IconContext.Provider>
                                                        </button>
                                                    </div>
                                                </div>
                                                <Select id='settings-popout-design-select-decoration'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.props.values.decoration}
                                                    defaultValue={optionsDecoration[0]['options'][0]}
                                                    onChange={(event) => this.handleSelect(event, 'decoration')}
                                                    options={optionsDecoration}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                            </div>
                                            <div className='element-ends'>
                                                <label className='font small'
                                                    htmlFor='settings-popout-design-no-color-change'>
                                                    No Color Change
                                                </label>
                                                <input id='settings-popout-design-no-color-change'
                                                    name='settings-input-popout-design-no-color-change'
                                                    type='checkbox'
                                                    onChange={(event) => this.handleCheckbox(event.target.checked, 'noColorChange', 'values')}
                                                    checked={this.props.values.noColorChange}/>
                                            </div>
                                            <input id='settings-popout-design-color-change-color'
                                                name='settings-popout-design-color-change-color'
                                                className='color-input-match boxxed'
                                                type='color'
                                                defaultValue={rgbToHex(this.props.values.colorChange)}
                                                onBlur={(event) => this.handleColor(event.target.value, 'colorChange')}
                                                disabled={!this.props.values.noColorChange}
                                                aria-label='Select site color'/>
                                            {/* Checkboxes */}
                                            <div className='grid col-2 spread-setting'>
                                                {/* Shadow */}
                                                <div className='element-ends not-spaced'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-design-shadow'>
                                                        Shadow
                                                    </label>
                                                    <input id='settings-popout-design-shadow'
                                                        name='settings-input-popout-design-shadow'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'shadow', 'values')}
                                                        checked={this.props.values.shadow}
                                                        />
                                                </div>
                                            </div>
                                        </section>
                                        {/* Feature Settings */}
                                        <section className='section-group'
                                            aria-labelledby='settings-feature-heading'>
                                            <h2 id='settings-feature-heading'
                                                className='screen-reader-only'>Feature Settings</h2>
                                            <span className='font small when-elements-are-not-straight space-nicely space-bottom length-short'>
                                                <b>Feature</b>
                                            </span>
                                            {/* General */}
                                            <fieldset className='section-sub'>
                                                <legend className='font small space-nicely space-bottom length-short'>
                                                    General
                                                </legend>
                                                {/* Display author names */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-feature-authorNames'>
                                                        Author Names
                                                    </label>
                                                    <input id='settings-popout-feature-authorNames'
                                                        name='settings-input-popout-feature-authorNames'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'authorNames', 'values')}
                                                        checked={this.props.values.authorNames}/>
                                                </div>
                                            </fieldset>
                                            {/* Hotbar */}
                                            <fieldset className='section-sub space-nicely space-top not-bottom length-medium'>
                                                <legend className='font small space-nicely space-bottom length-short'>
                                                    Hotbar
                                                </legend>
                                                {/* Close */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-feature-close'>
                                                        Close
                                                    </label>
                                                    <input id='settings-popout-feature-close'
                                                        name='settings-input-popout-feature-close'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'close', 'values')}
                                                        checked={this.props.values.close}/>
                                                </div>
                                                {/* Fullscreen */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-feature-fullscreen'>
                                                        Fullscreen
                                                    </label>
                                                    <input id='settings-popout-feature-fullscreen'
                                                        name='settings-input-popout-feature-fullscreen'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'fullscreen', 'values')}
                                                        checked={this.props.values.fullscreen}/>
                                                </div>
                                                {/* Reset Position */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-feature-resetPosition'>
                                                        Reset Position
                                                    </label>
                                                    <input id='settings-popout-feature-resetPosition'
                                                        name='settings-input-popout-feature-resetPosition'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'resetPosition', 'values')}
                                                        checked={this.props.values.resetPosition}/>
                                                </div>
                                                {/* Show on Top */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-feature-showOnTop'>
                                                        Show on Top
                                                    </label>
                                                    <input id='settings-popout-feature-showOnTop'
                                                        name='settings-input-popout-feature-resetPosition'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'showOnTop', 'values')}
                                                        checked={this.props.values.showOnTop}/>
                                                </div>
                                            </fieldset>
                                        </section>
                                        {/* Game Settings */}
                                        <section className='section-group'
                                            aria-labelledby='settings-game-heading'>
                                            <h2 id='settings-game-heading'
                                                className='screen-reader-only'>Game Settings</h2>
                                            <span className='font small when-elements-are-not-straight space-nicely space-bottom length-short'>
                                                <b>Game</b>
                                            </span>
                                            {/* Health Display */}
                                            <div>
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Health Display
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random health display'
                                                        onClick={() => this.randomOption({ what: 'health', options: optionsHealth })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Select id='settings-popout-game-select-health'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.props.values.health}
                                                    defaultValue={optionsHealth[0]['options'][0]}
                                                    isDisabled={!this.state.settings}
                                                    onChange={(event) => this.handleSelect(event, 'health')}
                                                    options={optionsHealth}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                            </div>
                                            {/* Loot Display */}
                                            <div>
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Loot Display
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random loot display'
                                                        onClick={() => this.randomOption({ what: 'loot', options: optionsLoot })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Select id='settings-popout-game-select-loot'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.props.values.loot}
                                                    defaultValue={optionsLoot[0]['options'][0]}
                                                    isDisabled={!this.state.settings}
                                                    onChange={(event) => this.handleSelect(event, 'loot')}
                                                    options={optionsLoot}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                            </div>
                                        </section>
                                        {/* Misc Settings */}
                                        <section className='section-group'
                                            aria-labelledby='settings-misc-heading'>
                                            <h2 id='settings-misc-heading'
                                                className='screen-reader-only'>Misc Settings</h2>
                                            <span className='font small when-elements-are-not-straight space-nicely space-bottom length-short'>
                                                <b>Misc</b>
                                            </span>
                                            {/* Voice */}
                                            <fieldset className='section-sub'>
                                                <legend className='font small space-nicely space-bottom length-short'>
                                                    Voice
                                                </legend>
                                                {/* Voice Change */}
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Type
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random voice type'
                                                        onClick={() => this.randomOption({ what: 'voice', options: optionsVoice })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Select id='settings-popout-misc-select-type'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.props.values.voice}
                                                    defaultValue={optionsVoice[0]['options'][0]}
                                                    onChange={(event) => this.handleSelect(event, 'voice')}
                                                    options={optionsVoice}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                                {/* Pitch */}
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Pitch
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random voice pitch'
                                                        onClick={() => this.randomOption({ what: 'slider', element: 'slider-voice-pitch', min: 0, max: 2 })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Slider className='slider space-nicely space-top length-small'
                                                    onChange={(value) => this.handleSlider(value, 'slider-voice-pitch')}
                                                    min={0}
                                                    max={2}
                                                    step={0.1}
                                                    marks={{
                                                        0: {
                                                            label: 0,
                                                            style: {display: 'none' }
                                                        }
                                                    }}
                                                    value={this.props.values.pitch}/>
                                                {/* Rate */}
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Rate
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random voice rate'
                                                        onClick={() => this.randomOption({ what: 'slider', element: 'slider-voice-rate', min: 0.1, max: 10 })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Slider className='slider space-nicely space-top length-small'
                                                    onChange={(value) => this.handleSlider(value, 'slider-voice-rate')}
                                                    min={0.1}
                                                    max={10}
                                                    step={0.1}
                                                    marks={{
                                                        1: {
                                                            label: 1,
                                                            style: {display: 'none' }
                                                        }
                                                    }}
                                                    value={this.props.values.rate}/>
                                            </fieldset>
                                            {/* Popout */}
                                            <fieldset className='section-sub'>
                                                <legend className='font small space-nicely space-bottom length-short'>
                                                    Popout
                                                </legend>
                                                {/* Save position of popup */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-misc-savepositionpopup'>
                                                        Save Position
                                                    </label>
                                                    <input id='settings-popout-misc-savepositionpopup'
                                                        name='settings-input-popout-misc-savepositionpopout'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'savePositionPopout', 'values')}
                                                        checked={this.props.values.savePositionPopout}/>
                                                </div>
                                            </fieldset>
                                            {/* Cursor */}
                                            <fieldset className='section-sub space-nicely space-top not-bottom length-medium'>
                                                <legend className='font small space-nicely space-bottom length-short'>
                                                    Cursor
                                                </legend>
                                                {/* Cursor Type */}
                                                <div className='element-ends'>
                                                    <span className='font small'>
                                                        Type
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random cursor type'
                                                        onClick={() => this.randomOption({ what: 'cursor', options: optionsCursor })}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Select id='settings-popout-misc-cursor-select-type'
                                                    className='select-match space-nicely space-top length-small'
                                                    value={this.state.values.cursor}
                                                    defaultValue={optionsCursor[0]['options'][0]}
                                                    onChange={(event) => this.handleSelect(event, 'cursor')}
                                                    options={optionsCursor}
                                                    formatGroupLabel={formatGroupLabel}
                                                    styles={selectStyleSmall}
                                                    components={{
                                                        MenuList: menuListScrollbar
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            ...this.props.selectTheme
                                                        }
                                                    })}/>
                                                {/* Cursor Size */}
                                                <div className='grid col-50-50'>
                                                    <span className='font small'>Size</span>
                                                    <Select id='settings-popout-misc-cursor-select-size'
                                                        className='select-match space-nicely space-top length-small'
                                                        value={this.state.values.cursorSize}
                                                        defaultValue={optionsCursorSize[0]['options'][0]}
                                                        onChange={(event) => this.handleSelect(event, 'cursorSize')}
                                                        options={optionsCursorSize}
                                                        formatGroupLabel={formatGroupLabel}
                                                        styles={selectStyleSmall}
                                                        components={{
                                                            MenuList: menuListScrollbar
                                                        }}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                ...this.props.selectTheme
                                                            }
                                                        })}
                                                        isDisabled={this.state.values.cursor?.value === 'default'}/>
                                                </div>
                                                {/* Cursor Trail */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-misc-cursor-trail'>
                                                        Trail
                                                    </label>
                                                    <input id='settings-popout-misc-cursor-trail'
                                                        name='settings-popout-misc-cursor-trail'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'cursorTrail', 'values')}
                                                        checked={this.props.values.cursorTrail}/>
                                                </div>
                                                {/* Cursor Trail Color */}
                                                <div className='grid col-2 spread-setting'>
                                                    {/* Flat */}
                                                    <div className='element-ends'>
                                                        <label className='font small'
                                                            htmlFor='settings-popout-misc-cursor-trail-flat'>
                                                            Flat
                                                        </label>
                                                        <input id='settings-popout-misc-cursor-trail-flat'
                                                            name='settings-popout-misc-cursor-trail-flat'
                                                            type='checkbox'
                                                            onChange={(event) => this.handleCheckbox(event.target.checked, 'cursorTrailFlat', 'values')}
                                                            checked={this.props.values.cursorTrailFlat}
                                                            disabled={!this.props.values.cursorTrail}/>
                                                    </div>
                                                    {/* Cursor Color */}
                                                    <input id='settings-popout-misc-cursor-trail-color'
                                                        name='settings-popout-misc-cursor-trail-color'
                                                        className='color-input-match boxxed'
                                                        type='color'
                                                        onBlur={(event) => this.handleColor(event.target.value, 'cursorTrailColor')}
                                                        disabled={!this.props.values.cursorTrail}
                                                        aria-label='Select cursor trail color'/>
                                                </div>
                                                {/* Cursor Trail Modes */}
                                                <div className='grid col-2 spread-setting'>
                                                    {/* Default */}
                                                    <div className='element-ends'>
                                                        <label className='font small'
                                                            htmlFor='settings-popout-misc-cursor-trail-default'>
                                                            Default
                                                        </label>
                                                        <input id='settings-popout-misc-cursor-trail-default'
                                                            name='cursorTrailMode'
                                                            type='radio'
                                                            value='default'
                                                            onChange={(event) => this.handleRadio(event)}
                                                            disabled={!this.props.values.cursorTrail}/>
                                                    </div>
                                                    {/* Squiggly */}
                                                    <div className='element-ends'>
                                                        <label className='font small'
                                                            htmlFor='settings-popout-misc-cursor-trail-squiggly'>
                                                            Squiggly
                                                        </label>
                                                        <input id='settings-popout-misc-cursor-trail-squiggly'
                                                            name='cursorTrailMode'
                                                            type='radio'
                                                            value='squiggly'
                                                            onChange={(event) => this.handleRadio(event)}
                                                            disabled={!this.props.values.cursorTrail}/>
                                                    </div>
                                                    {/* Circle */}
                                                    <div className='element-ends'>
                                                        <label className='font small'
                                                            htmlFor='settings-popout-misc-cursor-trail-circle'>
                                                            Circle
                                                        </label>
                                                        <input id='settings-popout-misc-cursor-trail-circle'
                                                            name='cursorTrailMode'
                                                            type='radio'
                                                            value='circle'
                                                            onChange={(event) => this.handleRadio(event)}
                                                            disabled={!this.props.values.cursorTrail}/>
                                                    </div>
                                                </div>
                                                {/* Thickness */}
                                                <div className='element-ends space-nicely space-top length-small'>
                                                    <span className='font small'>
                                                        Thickness
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random cursor thickness'
                                                        onClick={() => this.randomOption({ what: 'slider', element: 'cursorTrailThickness', min: 0, max: 100 })}
                                                        disabled={!this.props.values.cursorTrail}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Slider className='slider space-nicely space-top length-small'
                                                    onChange={(value) => this.handleSlider(value, 'cursorTrailThickness')}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    marks={{
                                                        7: {
                                                            label: 7,
                                                            style: {display: 'none' }
                                                        }
                                                    }}
                                                    value={this.props.values.cursorTrailThickness}
                                                    disabled={!this.props.values.cursorTrail}/>
                                                {/* Duration */}
                                                <div className='element-ends space-nicely space-top length-medium'>
                                                    <span className='font small'>
                                                        Duration
                                                    </span>
                                                    <button className='button-match inverse'
                                                        aria-label='Random cursor trail duration'
                                                        onClick={() => this.randomOption({ what: 'slider', element: 'cursorTrailDuration', min: 0.1, max: 4 })}
                                                        disabled={!this.props.values.cursorTrail}>
                                                        <IconContext.Provider value={{ size: this.props.microIcon, className: 'global-class-name' }}>
                                                            <FaRandom/>
                                                        </IconContext.Provider>
                                                    </button>
                                                </div>
                                                <Slider className='slider space-nicely space-top length-small'
                                                    onChange={(value) => this.handleSlider(value, 'cursorTrailDuration')}
                                                    min={0.1}
                                                    max={4}
                                                    step={0.1}
                                                    marks={{
                                                        0.7: {
                                                            label: 0.7,
                                                            style: {display: 'none' }
                                                        }
                                                    }}
                                                    value={this.props.values.cursorTrailDuration}
                                                    disabled={!this.props.values.cursorTrail}/>
                                            </fieldset>
                                            {/* Random Events */}
                                            <fieldset className='section-sub space-nicely space-top not-bottom length-medium'>
                                                <legend className='font small space-nicely space-bottom length-short'>
                                                    Random Events
                                                </legend>
                                                {/* Trick */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-misc-random-trick'>
                                                        Trick
                                                    </label>
                                                    <input id='settings-popout-misc-random-trick'
                                                        name='settings-input-popout-misc-random-trick'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleRandomTrick(event.target.checked)}
                                                        checked={this.state.values.randomTrick}/>
                                                </div>
                                                {/* Text */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-misc-random-text'>
                                                        Text
                                                    </label>
                                                    <input id='settings-popout-misc-random-text'
                                                        name='settings-input-popout-misc-random-text'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'randomText', 'values')}
                                                        checked={this.props.values.randomText}/>
                                                </div>
                                                {/* Horror */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-misc-horror'>
                                                        Horror
                                                    </label>
                                                    <input id='settings-popout-misc-horror'
                                                        name='settings-input-popout-misc-horror'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'horror', 'values')}
                                                        checked={this.props.values.horror}/>
                                                </div>
                                            </fieldset>
                                            {/* Fun */}
                                            <fieldset className='section-sub space-nicely space-top not-bottom length-medium'>
                                                <legend className='font small space-nicely space-bottom length-short'>
                                                    Fun
                                                </legend>
                                                {/* Live2D */}
                                                <div className='element-ends'>
                                                    <label className='font small'
                                                        htmlFor='settings-popout-misc-fun-live2d'>
                                                        Live2D
                                                    </label>
                                                    <input id='settings-popout-misc-fun-live2d'
                                                        name='settings-popout-misc-fun-live2d'
                                                        type='checkbox'
                                                        onChange={(event) => this.handleCheckbox(event.target.checked, 'live2D', 'values')}
                                                        checked={this.state.values.live2D}/>
                                                </div>
                                            </fieldset>
                                        </section>
                                    </div>
                                    {/* Scrollable Arrow */}
                                    <div id='settings-popout-arrow-top'
                                        className='scrollable-arrow top-arrow'>&#x2BC5;</div>
                                    <div id='settings-popout-arrow-bottom'
                                        className='scrollable-arrow bottom-arrow'>&#x2BC6;</div>
                                </div>
                            </section>
                        </Draggable>
                    </div>
                </section>
            </Draggable>
        );
    };
};

export default memo(WidgetSetting);