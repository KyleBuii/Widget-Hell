import React, { Component, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { IconContext } from 'react-icons';
import { AiOutlineSetting } from 'react-icons/ai';
import { BiCollapse } from 'react-icons/bi';
import { FaExclamationTriangle, FaExpand } from 'react-icons/fa';
import { Fa0 } from 'react-icons/fa6';
import { IoIosArrowUp } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import Cursor from './cursor.jsx';
import { addClassStack, colorRange, fetchedData, largeIcon, removeClassStack, sentencesHorror, setCurrentHour, setDecorationValue, textAnimations, widgetsFun, widgetsFunLookup, widgetsGames, widgetsGamesLookup, widgetsSpecial, widgetsSpecialLookup, widgetsUtility, widgetsUtilityLookup } from './data.jsx';
import { calculateBounds, dragStart, dragStop, formatNumber, LazyWidget, randomItem, renderHearts } from './helpers.jsx';
import './index.scss';
import Particle from './particle.jsx';
import WidgetSetting from './Widgets/Utility/Setting.jsx';

//////////////////// Temp Variables ////////////////////
//#region
export let
    healthDisplay,
    lootDisplay,
    color;
export const
    widgetsUtilityActive = [],
    widgetsGamesActive = [],
    widgetsFunActive = [];
let timeoutText,
    intervalHorror,
    voices;
let widgetsTextActive = [];
window.username = 'Anon';
//#endregion

//////////////////// Widgets ///////////////////////
class Widgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectTheme: {},
            values: {
                animation: {value: 'default', label: 'Default'},
                customBorder: {value: 'default', label: 'Default'},
                savePositionPopout: false,
                authorNames: false,
                fullscreen: false,
                resetPosition: false,
                showOnTop: false,
                collapse: false,
                shadow: false,
                voice: {value: '0', label: 'David'},
                pitch: 0,
                rate: 0,
                health: {value: 'default', label: 'Default'},
                loot: {value: 'default', label: 'Default'},
                close: false,
                randomText: false,
                cursorTrail: false,
                cursorTrailColor: [0, 0, 0],
                cursorTrailFlat: false,
                cursorTrailMode: 'default',
                cursorTrailThickness: 7,
                cursorTrailDuration: 0.7,
                horror: false,
                particle: {value: 0, label: 'Default'},
                decoration: {value: 'default', label: 'Default'},
                particleMute: false,
                transcribeAudio: false,
                noColorChange: false,
                colorChange: [0, 0, 0],
            },
            prevPosition: {
                prevX: 0,
                prevY: 0
            },
            widgets: {
                utility: {
                    setting: {
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            showhidewidgets: {
                                position: {
                                    x: -22,
                                    y: 60
                                }
                            },
                            settings: {
                                position: {
                                    x: 114,
                                    y: 90
                                }
                            }
                        }
                    },
                    character: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    equipment: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    guide: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }   
                    },
                    inventory: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                },
                games: {},
                fun: {}
            },
            stickers: [],
            inventory: [],
            equipment: {
                headband: {
                    name: '',
                    rarity: ''
                },
                helmet: {
                    name: '',
                    rarity: ''
                },
                eyewear: {
                    name: '',
                    rarity: ''
                },
                necklace: {
                    name: '',
                    rarity: ''
                },
                undershirt: {
                    name: '',
                    rarity: ''
                },
                chestplate: {
                    name: '',
                    rarity: ''
                },
                cape: {
                    name: '',
                    rarity: ''
                },
                bracelet: {
                    left: {
                        name: '',
                        rarity: ''
                    },
                    right: {
                        name: '',
                        rarity: ''
                    }
                },
                wrist: {
                    left: {
                        name: '',
                        rarity: ''
                    },
                    right: {
                        name: '',
                        rarity: ''
                    }
                },
                belt: {
                    name: '',
                    rarity: ''
                },
                main: {
                    name: '',
                    rarity: ''
                },
                glove: {
                    left: {
                        name: '',
                        rarity: ''
                    },
                    right: {
                        name: '',
                        rarity: ''
                    }
                },
                ring: {
                    left: {
                        name: '',
                        rarity: ''
                    },
                    right: {
                        name: '',
                        rarity: ''
                    }
                },
                legging: {
                    name: '',
                    rarity: ''
                },
                offhand: {
                    name: '',
                    rarity: ''
                },
                hidden: {
                    left: {
                        name: '',
                        rarity: ''
                    },
                    right: {
                        name: '',
                        rarity: ''
                    }
                },
                boot: {
                    left: {
                        name: '',
                        rarity: ''
                    },
                    right: {
                        name: '',
                        rarity: ''
                    }
                },
                test: {name: ''},
                consumable1: {
                    name: '',
                    rarity: ''
                },
                consumable2: {
                    name: '',
                    rarity: ''
                },
                consumable3: {
                    name: '',
                    rarity: ''
                },
                consumable4: {
                    name: '',
                    rarity: ''
                },
                consumable5: {
                    name: '',
                    rarity: ''
                },
                consumable6: {
                    name: '',
                    rarity: ''
                }
            },
            gold: 0,
            stats: {
                level: 1,
                exp: 0,
                maxExp: 0,
                health       : [1, 0],
                mana         : [1, 0],
                attack       : [1, 0],
                defense      : [1, 0],
                strength     : [1, 0],
                agility      : [1, 0],
                vitality     : [1, 0],
                resilience   : [1, 0],
                intelligence : [1, 0],
                dexterity    : [1, 0],
                luck         : [1, 0]
            },
            statPoints: 0,
            abilities: [],
        };
    };

    randomColor = (forcedColorR, forcedColorG, forcedColorB, bypass = false) => {
        if (this.state.values.noColorChange && !bypass) return;

        const r = document.documentElement;
        let randColorOpacity, randColor, randColorLight;

        if (forcedColorR) {
            randColorOpacity = `${forcedColorR},${forcedColorG},${forcedColorB}`;
            randColor = `rgb(${randColorOpacity})`;
            randColorLight = `rgb(${forcedColorR + 50},${forcedColorG + 50},${forcedColorB + 50})`;
        } else {
            const colorR = Math.floor(Math.random() * colorRange);
            const colorG = Math.floor(Math.random() * colorRange);
            const colorB = Math.floor(Math.random() * colorRange);
            randColorOpacity = `${colorR},${colorG},${colorB}`;
            randColor = `rgb(${randColorOpacity})`;
            randColorLight = `rgb(${colorR + 50},${colorG + 50},${colorB + 50})`;
        };

        r.style.setProperty('--randColor', randColor);
        r.style.setProperty('--randColorLight', randColorLight);
        r.style.setProperty('--randColorOpacity', randColorOpacity);
        color = randColor;

        /// Set react-select colors
        this.setState({
            selectTheme: {
                primary: randColor,         /// Currently selected option background color
                primary25: `rgba(${randColorOpacity}, 0.3)`,    /// Hover option background color
                neutral20: randColor,       /// Border color of select
                neutral30: randColorLight,  /// Hover border color
                neutral40: randColorLight,  /// Hover arrow color
                neutral60: randColorLight,  /// Active arrow color
                neutral80: randColor        /// Placeholder text color
            }
        });
    };

    handleShowHide = (what, where) => {
        if (this.state.widgets[where][what].active === false) {
            this.randomColor();

            this.setState(prevState => ({
                widgets: {
                    ...prevState.widgets,
                    [where]: {
                        ...prevState.widgets[where],
                        [what]: {
                            ...prevState.widgets[where][what],
                            active: true,
                            drag: {
                                disabled: false
                            }
                        }
                    }
                }
            }), () => {
                let e = document.getElementById(`${what}-widget-animation`);
                if (!e) return;

                widgetsTextActive = [...document.querySelectorAll('.text-animation')];

                let elementSelects = e.querySelectorAll('.select-match');
                for (let i of elementSelects) {
                    i.style.display = 'block';
                };

                this.handleAnimation(what);

                if (this.state.values.shadow) {
                    this.updateDesign('shadow', true);
                };
            });
        } else {
            let e = document.getElementById(`${what}-widget-animation`);
            e.style.visibility = 'hidden';
            this.handleAnimation(what, where, true);
        };
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };

    handleShowHidePopout = (popout, visible, button, inverse) => {
        if (visible) {
            let elementSelects = popout.querySelectorAll('.select-match');
            for (let i of elementSelects) {
                i.style.display = 'block';
            };
            if (button !== undefined) {
                if (inverse) {
                    button.style.color = 'rgba(var(--randColorOpacity), 1)';
                } else {
                    button.classList.remove('disabled-option');
                };
            };
            popout.style.visibility = 'visible';
            if (this.state.values.animation.value !== 'default') {
                popout.style.animation = 'none';
                window.requestAnimationFrame(() => {
                    switch (this.state.values.animation.value) {
                        case 'rendering':
                            popout.style.clipPath = 'inset(0 0 100% 0)';
                            popout.style.animation = this.state.values.animation.value + 'In 2s steps(11)';
                            break;
                        default:
                            popout.style.animation = this.state.values.animation.value + 'In 2s';
                            break;
                    };
                });
                popout.addEventListener('animationend', () => {
                    switch (this.state.values.animation.value) {
                        case 'rendering':
                            popout.style.clipPath = 'unset';
                            break;
                        default: break;
                    };
                });
            };
        } else {
            let elementSelects = popout.querySelectorAll('.select-match');
            if (button !== undefined) {
                if (inverse) {
                    button.style.color = 'rgba(var(--randColorOpacity), 0.2)';
                } else {
                    button.classList.add('disabled-option');
                };
            };
            popout.style.visibility = 'hidden';
            if (this.state.values.animation.value !== 'default') {
                popout.style.animation = 'none';
                window.requestAnimationFrame(() => {
                    switch (this.state.values.animation.value) {
                        case 'rendering':
                            popout.style.clipPath = 'inset(0 0 100% 0)';
                            popout.style.animation = this.state.values.animation.value + 'Out 2s steps(11)';
                            break;
                        default:
                            popout.style.animation = this.state.values.animation.value + 'Out 2s';
                            break;
                    };
                });
                popout.addEventListener('animationend', (event) => {
                    if (event.animationName.slice(event.animationName.length - 3) === 'Out') {
                        switch (this.state.values.animation.value) {
                            case 'rendering':
                                popout.style.clipPath = 'unset';
                                break;
                            default: break;
                        };
                        /// Hide react-selects (prevents flashing)
                        for (let i of elementSelects) {
                            i.style.display = 'none';
                        };
                    };
                });
            } else {
                for (let i of elementSelects) {
                    i.style.display = 'none';
                };    
            };   
        };
    };

    handleAnimation(what, where, hide = false) {
        let e = document.getElementById(`${what}-widget-animation`);
        let elementSelects = e.querySelectorAll('.select-match');
        if (this.state.values.animation.value !== 'default') {
            e.style.animation = 'none';
            window.requestAnimationFrame(() => {
                let animationType = (hide) ? 'Out' : 'In';
                switch (this.state.values.animation.value) {
                    case 'rendering':
                        e.style.clipPath = 'inset(0 0 100% 0)';
                        e.style.animation = `${this.state.values.animation.value}${animationType} 2s steps(11)`;
                        break;
                    default:
                        e.style.animation = `${this.state.values.animation.value}${animationType} 2s`;
                        break;
                };
            });
            e.addEventListener('animationend', (event) => {
                if (!hide || (event.animationName.slice(event.animationName.length - 3) === 'Out')) {
                    switch (this.state.values.animation.value) {
                        case 'rendering':
                            e.style.clipPath = 'unset';
                            break;
                        default: break;
                    };
                    if (hide && (what !== 'settings')) {
                        for (let i of elementSelects) {
                            i.style.display = 'none';
                        };
                        this.setState(prevState => ({
                            widgets: {
                                ...prevState.widgets,
                                [where]: {
                                    ...prevState.widgets[where],
                                    [what]: {
                                        ...prevState.widgets[where][what],
                                        active: false
                                    }
                                }
                            }
                        }), () => {
                            widgetsTextActive = [...document.querySelectorAll('.text-animation')];
                        });
                    };
                };
            });
        } else if (hide && (what !== 'settings')) {
            /// Hide react-selects (prevents flashing)
            for (let i of elementSelects) {
                i.style.display = 'none';
            };
            this.setState(prevState => ({
                widgets: {
                    ...prevState.widgets,
                    [where]: {
                        ...prevState.widgets[where],
                        [what]: {
                            ...prevState.widgets[where][what],
                            active: false
                        }
                    }
                }
            }), () => {
                widgetsTextActive = [...document.querySelectorAll('.text-animation')];
            });
        };
    };

    handleHotbar = (element, what, where) => {
        switch (what) {
            case 'fullscreen': {
                let e = document.getElementById(element + '-widget');
                let eAnimation = document.getElementById(element + '-widget-animation');
                if (e.classList.contains(what)) {
                    e.classList.remove(what);
                    this.updatePosition(element, where, this.state.prevPosition.prevX, this.state.prevPosition.prevY);
                } else {
                    e.classList.add(what);
                    this.setState({
                        prevPosition: {
                            prevX: this.state.widgets[where][element].position.x,
                            prevY: this.state.widgets[where][element].position.y
                        }
                    });
                    this.updatePosition(element, where, 0, 0);
                };
                if (eAnimation.classList.contains(what + '-animation')) {
                    eAnimation.classList.remove(what + '-animation');
                } else {
                    eAnimation.classList.add(what + '-animation');
                };
                this.setState(prevState => ({
                    widgets: {
                        ...prevState.widgets,
                        [where]: {
                            ...prevState.widgets[where],
                            [element]: {
                                ...prevState.widgets[where][element],
                                drag: {
                                    disabled: !prevState.widgets[where][element].drag.disabled
                                }
                            }
                        }
                    }
                }));
                break;
            };
            case 'resetPosition': {
                this.setState(prevState => ({
                    widgets: {
                        ...prevState.widgets,
                        [where]: {
                            ...prevState.widgets[where],
                            [element]: {
                                ...prevState.widgets[where][element],
                                position: {
                                    x: 0,
                                    y: 0
                                }
                            }
                        }
                    }
                }));
                break;
            };
            case 'close': {
                this.handleShowHide(element, where);
                window.dispatchEvent(new CustomEvent('close', {
                    'detail': {
                        element: element,
                        type: where
                    }
                }));
                break;
            };
            case 'showOnTop': {
                let checkWidget = document.getElementsByClassName('show-on-top');
                if (checkWidget.length !== 0) {
                    checkWidget[0].classList.remove('show-on-top');
                };
                let widget = document.getElementById(element + '-widget');
                widget.classList.add('show-on-top');
                break;
            };
            case 'collapse': {
                let e = document.getElementById(`${element}-widget`);
                let eAnimation = document.getElementById(`${element}-widget-animation`);

                if (eAnimation.classList.contains(`${what}-animation`)) {
                    eAnimation.classList.remove(`${what}-animation`);
                } else {
                    eAnimation.classList.add(`${what}-animation`);
                };

                const yinYangExist = e.querySelector('.yin-yang');
                if (yinYangExist) {
                    e.removeChild(yinYangExist);
                } else {
                    eAnimation.ontransitionend = (event) => {
                        if (event.propertyName !== 'transform') return;

                        eAnimation.classList.remove(`${what}-animation`);
                        eAnimation.classList.add('collapsed');
                    };

                    const elementYinYang = document.createElement('div');
                    elementYinYang.className = 'yin-yang float center';

                    const elementName = document.createElement('span');
                    elementName.innerText = element.replace(/^./, (char) => char.toUpperCase());
                    elementName.className = 'yin-yang-name';
                    elementName.onclick = () => {
                        e.removeChild(e.querySelector('.yin-yang'));
                        e.removeChild(e.querySelector('.yin-yang-name'));
                        eAnimation.classList.remove(`${what}-animation`, 'collapsed');
                    };

                    e.appendChild(elementName);
                    e.appendChild(elementYinYang);
                };
                break;
            };
            default: { break; };
        };
    };

    renderHotbar = (widget, type) => {
        return <div id={`${widget}-hotbar`}
            className='hotbar'>
            {(this.state.values.showOnTop)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    aria-label='Hotbar show on top'
                    onClick={() => this.handleHotbar(widget, 'showOnTop', type)}>
                    <IoIosArrowUp/>
                </button>
                : <></>}
            {(this.state.values.resetPosition)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    aria-label='Hotbar reset position'
                    onClick={() => this.handleHotbar(widget, 'resetPosition', type)}>
                    <Fa0/>
                </button>
                : <></>}
            {(this.state.values.fullscreen)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    aria-label='Hotbar fullscreen'
                    onClick={() => this.handleHotbar(widget, 'fullscreen', type)}>
                    <FaExpand/>
                </button>
                : <></>}
            {(this.state.values.collapse)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    aria-label='Hotbar collapse'
                    onClick={() => this.handleHotbar(widget, 'collapse', type)}>
                    <BiCollapse/>
                </button>
                : <></>}
            {(this.state.values.close)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    aria-label='Hotbar close'
                    onClick={() => this.handleHotbar(widget, 'close', type)}>
                    <IoClose/>
                </button>
                : <></>}
        </div>
    };

    handleMouseMove = (event) => {
        window.mouse = {
            x: event.clientX,
            y: event.clientY
        };
    };

    updateStickers = (mutateType, stickerName, stickerImage) => {
        switch (mutateType) {
            case 'add': {
                this.setState({
                    stickers: [...this.state.stickers, stickerName, stickerImage]
                });        
                break;
            };
            case 'remove': {
                let indexRemove = this.state.stickers.indexOf(stickerName);
                if (indexRemove === 0) {
                    this.setState({
                        stickers: [...this.state.stickers.slice(2)]
                    });
                } else {
                    this.setState({
                        stickers: [...this.state.stickers.slice(0, indexRemove), ...this.state.stickers.slice(indexRemove + 2)]
                    });
                };
                break;
            };
            default: {
                this.setState({
                    stickers: []
                });
                break;
            };
        };
    };

    updateDesign = (what, value) => {
        if (value) {
            addClassStack(what);
        } else {
            removeClassStack(what);
        };
    };

    updateValue = (value, what, type) => {
        switch (what) {
            case 'customBorder':
                this.updateCustomBorder(value);
                break;
            case 'decoration':
                this.updateDecoration(value);
                break;
            case 'health':
                healthDisplay = value;
                break;
            case 'loot':
                lootDisplay = value;
                break;
            case 'colorChange':
                this.randomColor(value[0], value[1], value[2], true);
                break;
            case 'showOnTop':
            case 'fullscreen':
            case 'collapse':
                break;
            default:
                this.updateDesign(what, value);
                break;
        };

        this.setState(prevState => ({
            [type]: {
                ...prevState[type],
                [what]: value
            }
        }), () => {
            if (this.state.values.randomText && (what === 'randomText')) {
                this.randomTimeoutText();
            } else if (!this.state.values.randomText) {
                timeoutText = clearTimeout(timeoutText);
            };
            if (this.state.values.horror) {
                this.randomTimeoutHorror();
            } else if (!this.state.values.horror) {
                intervalHorror = clearInterval(intervalHorror);
            };
        });
    };

    updateCustomBorder = (option) => {
        if (option) {
            removeClassStack(`border-${this.state.values.customBorder.value}`);
            addClassStack(`border-${option.value}`);
        } else {
            addClassStack(`border-${this.state.values.customBorder.value}`);
        };
    };

    updateDecoration = (option) => {
        if (option) {
            setDecorationValue(option.value);
        } else {
            setDecorationValue(this.state.values.decoration.value);
        };
    };

    randomTimeoutText = () => {
        if (this.state.values.randomText && (timeoutText === undefined)) {
            let randomNumber = Math.random() * 60000 + 5000;
            timeoutText = setTimeout(() => {
                this.randomTextAnimation();
                timeoutText = undefined;
                this.randomTimeoutText();
            }, randomNumber);
        };
    };

    randomTextAnimation = () => {
        if (widgetsTextActive.length > 0) {
            let randomTextAnimation = textAnimations[Math.floor(Math.random() * textAnimations.length)];
            let elementRandomText = widgetsTextActive[Math.floor(Math.random() * widgetsTextActive.length)];
            elementRandomText.style.animation = 'none';
            window.requestAnimationFrame(() => {
                elementRandomText.style.animation = randomTextAnimation; 
            });
        };
    };

    randomTimeoutHorror = () => {
        /// Creating a shadow image
        let randomNumber = Math.random() * 1200000 + 300000;
        let elementShadow = document.createElement('img');
        elementShadow.src = '/resources/singles/guy.webp';
        elementShadow.alt = 'shadow guy';
        elementShadow.loading = 'lazy';
        elementShadow.encoding = 'async';
        let elementContainer = document.getElementById('widget-container');
        let elementContainerSize = elementContainer.getBoundingClientRect();
        elementShadow.onload = () => {
            elementShadow.style.filter = 'brightness(0%)';
            elementShadow.style.maxHeight = '256px';
            elementShadow.style.position = 'absolute';
        };
        intervalHorror = setInterval(() => {
            /// Displays a shadow outside of the screen that peaks its head
            elementContainer.appendChild(elementShadow);
            let sides = ['top', 'right', 'bottom', 'left'];
            let randomSide = sides[Math.floor(Math.random() * sides.length)];
            let realWidth = 256 * (elementShadow.naturalWidth / elementShadow.naturalHeight);
            if (/left|right/.test(randomSide)) {
                let randomY = Math.random() * (elementContainerSize.height - 256);
                elementShadow.style.top = `${randomY}px`;
                elementShadow.style[randomSide] = `-${realWidth}px`;
            } else {
                if (randomSide === 'top') {
                    elementShadow.style.transform = 'scale(-1)';
                };
                let randomX = Math.random() * (elementContainerSize.width - realWidth);
                elementShadow.style.left = `${randomX}px`;
                elementShadow.style[randomSide] = '-256px';
            };
            window.requestAnimationFrame(() => {
                elementShadow.style.animation = `characterPeak${randomSide.replace(/^./, char => char.toUpperCase())} 4s`;
                elementShadow.onanimationend = () => {
                    elementContainer.removeChild(elementShadow);
                };
            });
            /// Changes text to a random horror message
            let elementsText = document.getElementsByClassName('text-animation');
            if (elementsText.length !== 0) {
                let randomElementText = elementsText[Math.floor(Math.random() * elementsText.length)];
                let randomSentenceHorror = sentencesHorror[Math.floor(Math.random() * sentencesHorror.length)];
                randomElementText.innerText = randomSentenceHorror;
            };
        }, randomNumber);
    };

    updateWidgetsActive = (what, where) => {
        switch (where) {
            case 'utility':
                widgetsUtilityActive.push(what);
                break;
            case 'games':
                widgetsGamesActive.push(what);
                break;
            case 'fun':
                widgetsFunActive.push(what);
                break;
            default: break;
        };
    };

    updatePosition = (what, where, xNew, yNew, type, name) => {
        switch (type) {
            case 'popout':
                this.setState(prevState => ({
                    widgets: {
                        ...prevState.widgets,
                        [where]: {
                            ...prevState.widgets[where],
                            [what]: {
                                ...prevState.widgets[where][what],
                                popouts: {
                                    ...prevState.widgets[where][what].popouts,
                                    [name]: {
                                        position: {
                                            x: xNew,
                                            y: yNew
                                        }
                                    }
                                }
                            }
                        }
                    }
                }));
                break;
            default:
                this.setState(prevState => ({
                    widgets: {
                        ...prevState.widgets,
                        [where]: {
                            ...prevState.widgets[where],
                            [what]: {
                                ...prevState.widgets[where][what],
                                position: {
                                    x: xNew,
                                    y: yNew
                                }
                            }
                        }
                    }
                }));
                break;
        };
    };

    addGoldBag = (event) => {
        this.setState({
            gold: this.state.gold + event.detail
        });
    };

    addItem = (event) => {
        let newArray = [...this.state.inventory];
        for (let item of event.detail) {
            let exists = this.state.inventory.findIndex((itemFind) => {
                return itemFind.name === item.name;
            });
            if (exists !== -1) {
                newArray = [
                    ...newArray.slice(0, exists),
                    {
                        ...item,
                        count: newArray[exists].count + 1
                    },
                    ...newArray.slice(exists + 1)
                ];
            } else {
                newArray = [
                    ...newArray,
                    {
                        ...item,
                        count: 1
                    }
                ];
            };
            this.setState({
                inventory: [...newArray]
            });
        };
    };

    equipItem = (event) => {
        const itemData = {
            name: event.detail.name,
            rarity: event.detail.rarity
        };
        let newEquipment;

        if (event.detail.side) {
            if (this.state.equipment[event.detail.slot][event.detail.side].name === event.detail.name) return;

            if (this.state.equipment[event.detail.slot][event.detail.side].name === '') {
                newEquipment = {
                    ...this.state.equipment,
                    [event.detail.slot]: {
                        ...this.state.equipment[event.detail.slot],
                        [event.detail.side]: {
                            ...itemData
                        } 
                    }
                };
                this.updateGameValue('equipment', newEquipment);

                let item = fetchedData.items[itemData.rarity][itemData.name];
                if (item.type === 'stat' || item.type === 'both') {
                    let itemStats = Object.keys(item.stats);
                    let newStats = {};

                    for (let i in itemStats) {
                        let currentStat = item.stats[itemStats[i]];

                        newStats[itemStats[i]] = [
                            this.state.stats[itemStats[i]][0],
                            this.state.stats[itemStats[i]][1] + currentStat
                        ];
                    };

                    this.updateGameValue('stats', newStats);
                };

                if (item.type === 'ability' || item.type === 'both') {
                    let newAbilities = [...this.state.abilities, item.information];
                    this.updateGameValue('abilities', newAbilities);
                };
            };
        } else {
            if (this.state.equipment[event.detail.slot].name === event.detail.name) return;

            newEquipment = {
                ...this.state.equipment,
                [event.detail.slot]: {
                    ...itemData
                }
            };
            this.updateGameValue('equipment', newEquipment);

            const item = fetchedData.items[itemData.rarity][itemData.name];
            if (item.type === 'stat' || item.type === 'both') {
                const itemStats = Object.keys(item.stats);
                let newStats = {};

                if (this.state.equipment[event.detail.slot].name !== '') {
                    const stateItem = this.state.equipment[event.detail.slot];
                    const oldItem = fetchedData.items[stateItem.rarity][stateItem.name];
                    const oldItemStats = Object.keys(oldItem.stats);

                    for (let i in oldItemStats) {
                        let currentStat = oldItem.stats[oldItemStats[i]];

                        newStats[oldItemStats[i]] = [
                            this.state.stats[oldItemStats[i]][0],
                            this.state.stats[oldItemStats[i]][1] - currentStat
                        ];
                    };
                };

                for (let i in itemStats) {
                    let currentStat = item.stats[itemStats[i]];

                    newStats[itemStats[i]] = [
                        this.state.stats[itemStats[i]][0],
                        this.state.stats[itemStats[i]][1] + currentStat
                    ];
                };

                this.updateGameValue('stats', newStats);
            };

            if (item.type === 'ability' || item.type === 'both') {
                let newAbilities = [...this.state.abilities, item.information];

                if (this.state.equipment[event.detail.slot].name !== '') {
                    const stateItem = this.state.equipment[event.detail.slot];
                    const oldItem = fetchedData.items[stateItem.rarity][stateItem.name];
                    const oldItemIndex = newAbilities.indexOf(oldItem.information);

                    if (oldItemIndex === -1) return;

                    newAbilities.splice(oldItemIndex, 1);
                };

                this.updateGameValue('abilities', newAbilities);
            };
        };
    };

    updateGameValue = (what, value) => {
        switch (what) {
            case 'equipment': {
                this.setState({
                    equipment: value
                });
                break;
            };
            case 'gold': {
                this.setState({
                    gold: this.state.gold + value
                });
                break;
            };
            case 'exp': {
                let didLevelUp = false;
                this.setState((prev) => {
                    let newExp = prev.stats.exp + value;
                    let newLevel = prev.stats.level;
                    let newStatPoints = prev.statPoints;

                    if (newExp >= prev.stats.maxEXp) {
                        const remainderExp = newExp - prev.stats.maxExp;
                        newLevel += 1;
                        newExp = remainderExp;
                        newStatPoints += this.calculateStatPoints(newLevel);
                        didLevelUp = true;
                    };

                    return {
                        stats: {
                            ...prev.stats,
                            level: newLevel,
                            exp: newExp
                        },
                        statPoints: newStatPoints
                    };
                }, () => {
                    if (!didLevelUp) return;

                    this.calculateMaxExp();

                    if (this.state.stats.level < 20) {
                        randomItem();
                    } else {
                        randomItem(Math.floor(this.state.stats.level / 10));
                    };
                });
                break;
            };
            case 'stats': {
                this.setState({
                    stats: {
                        ...this.state.stats,
                        ...value
                    }
                });        
                break;
            };
            case 'abilities': {
                this.setState({
                    abilities: [...value]
                });
                break;
            };
            default: { break; };
        };
    };
    
    calculateMaxExp = () => {
        const equationMaxExp = this.state.stats.level * 100 * 1.25;
        this.setState({
            stats: {
                ...this.state.stats,
                maxExp: equationMaxExp
            }
        });
    };

    calculateStatPoints = (level) => {
        if (level === 1)        return 10;
        if (level % 1000 === 0) return 100;
        if (level % 100 === 0)  return 10;
        return 1;
    };

    talk = (text) => {
        if (text !== '') {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            } else {
                let utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = voices[this.state.values.voice.value];
                utterance.pitch = this.state.values.pitch;
                utterance.rate = this.state.values.rate;
                speechSynthesis.speak(utterance);
            };
        };
    };

    playAudio = (audio) => {
        let duplicateAudio = audio.cloneNode();
        duplicateAudio.play();
        duplicateAudio.onended = () => {
            duplicateAudio.remove();
        };

        if (this.state.values.transcribeAudio) {
            const transcriptContainer = document.getElementById('transcript');
            const audioName = audio.src.match(/([^/]+)[.]/)[1];
            const transcribedAudio = this.getTranscribedAudio(audioName);

            const transcribedElement = document.createElement('span');
            transcribedElement.innerText = transcribedAudio;
            transcriptContainer.appendChild(transcribedElement);

            let timeoutAnimation, timeoutRemove;
            timeoutAnimation = setTimeout(() => {
                window.requestAnimationFrame(() => {
                    transcribedElement.style.animation = 'fadeOut 2s';
                });
                timeoutRemove = setTimeout(() => {
                    transcriptContainer.removeChild(transcribedElement);
                    clearTimeout(timeoutAnimation);
                    clearTimeout(timeoutRemove);
                }, 1800);
            }, 2000);
        };
    };

    getTranscribedAudio = (audio) => {
        let transcribedAudio = '';
        switch (audio) {
            case 'bite_small':
                transcribedAudio = 'splorp';
                break;
            case 'cloth':
                transcribedAudio = 'crumph';
                break;
            case 'cloth_inventory':
                transcribedAudio = 'fwump';
                break;
            case 'magnet_on_reduced':
                transcribedAudio = 'clak';
                break;
            case 'ring_inventory':
                transcribedAudio = 'chink';
                break;
            case 'spin':
                transcribedAudio = 'trrrrktktktktktkt...kt...kt...kt...kt';
                break;
            case 'switch_006':
                transcribedAudio = 'plop';
                break;
            case 'switch_007':
                transcribedAudio = 'twud';
                break;
            default: break;
        };
        return transcribedAudio;
    };

    updateGlobalValue = (what, value) => {
        switch (what) {
            case 'hour':
                setCurrentHour(value);
                break;
            default: break;
        };
    };

    showSetting = () => {
        const elementSetting = document.getElementById('settings-widget');
        const elementButtonSetting = document.getElementById('widget-button-setting');
        if (elementSetting.checkVisibility({ visibilityProperty: true })) {
            window.dispatchEvent(new CustomEvent('setting hide'));
            this.handleAnimation('settings', 'utility', true);
            elementSetting.style.visibility = 'hidden';
            elementButtonSetting.classList.remove('button-setting-active');
        } else {
            this.handleAnimation('settings');
            elementSetting.style.visibility = 'visible';
            elementButtonSetting.classList.add('button-setting-active');
        };
    };

    calculateTotalStatPoints = (level) => {
        let total = level;

        if (level >= 1) total += 9;

        total += Math.floor(level / 100) * 9;   /// Bonus at level 100
        total += Math.floor(level / 1000) * 90; /// Bonus at level 1000

        return total;
    };

    useStatPoint = (stat, amount = 1) => {
        this.setState((prev) => ({
            stats: {
                ...prev.stats,
                [stat] : [prev.stats[stat][0] + amount, prev.stats[stat][1]]
            },
            statPoints: prev.statPoints - 1
        }));
    };

    generateDefaultProps = (widget, type) => {
        let defaultProps = {
            position: {
                x: this.state.widgets[type][widget].position.x,
                y: this.state.widgets[type][widget].position.y
            },
            dragDisabled: this.state.widgets[type][widget].drag.disabled,
            dragStart: dragStart,
            dragStop: dragStop,
            updatePosition: this.updatePosition,
            handleHotbar: this.handleHotbar,
            showHidePopout: this.handleShowHidePopout,
            values: {
                authorNames: this.state.values.authorNames
            },
            playAudio: this.playAudio,
            calculateBounds: calculateBounds,
            renderHotbar: this.renderHotbar,
            largeIcon: largeIcon
        };
        if (this.state.widgets[type][widget].popouts !== null) {
            defaultProps.popouts = this.state.widgets[type][widget].popouts;
        };
        return defaultProps;
    };

    storeData = (firstLoadData) => {
        let data = {
            utility: {},
            games:   {},
            fun:     {}
        };

        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            
            for (let i in this.state.widgets.utility) {
                data.utility[i] = {
                    ...dataLocalStorage['utility'][i],
                    active: this.state.widgets.utility[i].active,
                    position: this.state.widgets.utility[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.utility[i].popouts = this.state.widgets.utility[i].popouts;
                };
                if (i === 'setting') {
                    data['utility']['setting'] = {
                        ...data['utility']['setting'],
                        values: {
                            ...data['utility']['setting']['values'],
                            ...this.state.values
                        }
                    };
                };
            };
            for (let i in this.state.widgets.games) {
                data.games[i] = {
                    ...dataLocalStorage['games'][i],
                    active: this.state.widgets.games[i].active,
                    position: this.state.widgets.games[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.games[i].popouts = this.state.widgets.games[i].popouts;
                };
            };
            for (let i in this.state.widgets.fun) {
                data.fun[i] = {
                    ...dataLocalStorage['fun'][i],
                    active: this.state.widgets.fun[i].active,
                    position: this.state.widgets.fun[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.fun[i].popouts = this.state.widgets.fun[i].popouts;
                };
            };
        } else {
            /// First load
            const newWidgetData = {
                ...firstLoadData,
                utility: {
                    ...firstLoadData.utility,
                    ...this.state.widgets.utility
                }
            };

            for (let i in newWidgetData.utility) {
                data.utility[i] = {
                    active: false,
                    position: newWidgetData.utility[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.utility[i].popouts = newWidgetData.utility[i].popouts;
                };
                if (i === 'setting') {
                    data['utility']['setting'] = {
                        ...data['utility']['setting'],
                        values: {
                            ...this.state.values,
                            close: true
                        }
                    };
                };
            };
            for (let i in newWidgetData.games) {
                data.games[i] = {
                    active: false,
                    position: newWidgetData.games[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.games[i].popouts = newWidgetData.games[i].popouts;
                };
            };
            for (let i in newWidgetData.fun) {
                data.fun[i] = {
                    active: false,
                    position: newWidgetData.fun[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.fun[i].popouts = newWidgetData.fun[i].popouts;
                };
            };

            const widgetDates = ['facts', 'animesearcher'];
            let objectWidgetDates = {};

            for (let i of widgetDates) {
                objectWidgetDates[i] = new Date().getDate();
            };

            localStorage.setItem('date', JSON.stringify(objectWidgetDates));
        };

        localStorage.setItem('widgets', JSON.stringify(data));
        localStorage.setItem('gold', this.state.gold);
        localStorage.setItem('inventory', JSON.stringify(this.state.inventory));
        localStorage.setItem('equipment', JSON.stringify(this.state.equipment));
        localStorage.setItem('stats', JSON.stringify(this.state.stats));
        localStorage.setItem('statpoints', this.state.statPoints);
        localStorage.setItem('abilities', JSON.stringify(this.state.abilities));
    };

    async componentDidMount() {
        this.randomColor();

        let newWidgets = {
            utility: {},
            games:   {},
            fun:     {}
        };
        const widgetTypes = [
            ['utility', widgetsUtility],
            ['games'  , widgetsGames],
            ['fun'    , widgetsFun]
        ];
        
        widgetTypes.forEach(([widgetType, widgets]) => {
            Object.entries(widgets).forEach(([name, data]) => {
                newWidgets[widgetType][name.toLowerCase()] = {
                    ...data,
                    active: false,
                    position: { x: 0, y: 0 },
                    drag: { disabled: false }
                };
            });
        });
        
        window.addEventListener('beforeunload', this.storeData);
        window.addEventListener('new item', this.addItem);
        window.addEventListener('gold bag', this.addGoldBag);
        window.addEventListener('equip item', this.equipItem);

        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            
            let newWidgetsUtility = {},
                newWidgetsGames   = {},
                newWidgetsFun     = {};

            for (let i in dataLocalStorage.utility) {
                newWidgetsUtility[i] = {
                    ...this.state.widgets.utility[i],
                    ...dataLocalStorage.utility[i]
                };

                if (dataLocalStorage.utility[i].active) {
                    this.updateWidgetsActive(i, 'utility');
                };

                /// For specific widgets that have unique state values
                let localStorageValues = dataLocalStorage['utility']['setting']?.['values'];
                
                switch (i) {
                    case 'setting': {
                        let objectValues = {};

                        for (let i in this.state.values) {
                            objectValues[i] = localStorageValues[i];
                        };

                        this.setState({
                            values: {
                                ...objectValues
                            }
                        }, () => {
                            if (this.state.values.shadow === true) {
                                this.updateDesign('shadow', true);
                            };
                            if (this.state.values.randomText) {
                                this.randomTimeoutText();
                            };
                            if (this.state.values.horror) {
                                this.randomTimeoutHorror();
                            };
                            if (this.state.values.noColorChange) {
                                const colorChangeValue = [...this.state.values.colorChange];
                                this.randomColor(colorChangeValue[0], colorChangeValue[1], colorChangeValue[2], true);
                            };
                        });

                        /// Setting global variables
                        healthDisplay = localStorageValues['health'];
                        lootDisplay = localStorageValues['loot'];

                        break;
                    };
                    default: { break; };
                };
            };
            for (let i in dataLocalStorage.games) {
                newWidgetsGames[i] = {
                    ...this.state.widgets.games[i],
                    ...dataLocalStorage.games[i]
                };

                if (dataLocalStorage.games[i].active) {
                    this.updateWidgetsActive(i, 'games');
                };
            };
            for (let i in dataLocalStorage.fun) {
                newWidgetsFun[i] = {
                    ...this.state.widgets.fun[i],
                    ...dataLocalStorage.fun[i]
                };

                if (dataLocalStorage.fun[i].active) {
                    this.updateWidgetsActive(i, 'fun');
                };
            };

            const mergedUtility = {},
                  mergedGames   = {},
                  mergedFun     = {};

            const keysUtility = new Set([
                ...Object.keys(this.state.widgets.utility),
                ...Object.keys(newWidgets.utility),
                ...Object.keys(newWidgetsUtility)
            ]);
            const keysGames = new Set([
                ...Object.keys(this.state.widgets.games),
                ...Object.keys(newWidgets.games),
                ...Object.keys(newWidgetsGames)
            ]);
            const keysFun = new Set([
                ...Object.keys(this.state.widgets.fun),
                ...Object.keys(newWidgets.fun),
                ...Object.keys(newWidgetsFun)
            ]);

            const widgetsLookup = {
                utility: {
                    keys: keysUtility,
                    merge: mergedUtility,
                    normal: newWidgets.utility,
                    old: this.state.widgets.utility,
                    saved: newWidgetsUtility
                },
                games: {
                    keys: keysGames,
                    merge: mergedGames,
                    normal: newWidgets.games,
                    old: this.state.widgets.games,
                    saved: newWidgetsGames
                },
                fun: {
                    keys: keysFun,
                    merge: mergedFun,
                    normal: newWidgets.fun,
                    old: this.state.widgets.fun,
                    saved: newWidgetsFun
                }
            };

            Object.values(widgetsLookup).forEach((type) => {
                const { keys, merge, normal, old, saved } = type;

                keys.forEach((key) => {
                    merge[key] = {
                        ...normal[key],
                        ...old[key],
                        ...saved[key]
                    };
                });
            });

            const widgetsObject = {
                utility: mergedUtility,
                games: mergedGames,
                fun: mergedFun
            };

            this.setState({
                widgets: widgetsObject
            }, () => {
                this.updateCustomBorder();
                this.updateDecoration();

                widgetsTextActive = [...document.querySelectorAll('.text-animation')];
            });
        } else {
            this.storeData(newWidgets);

            this.setState({
                widgets: {
                    ...newWidgets,
                    utility: {
                        ...newWidgets.utility,
                        ...this.state.widgets.utility
                    }
                }
            });
        };
        if (localStorage.getItem('inventory') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('inventory'));
            let newArray = [];
            /// If there are duplicate items in inventory that are not stacked
            if (new Set(dataLocalStorage.map((item) => item.name)).size !== dataLocalStorage.length) {
                let counts = {};
                /// Count items
                dataLocalStorage.forEach((item) => {
                    counts[item.name] = (counts[item.name] || 0) + 1;
                });
                /// Create new array
                let allItems = new Set(dataLocalStorage.map((item) => item.name));
                allItems.forEach((item) => {
                    /// Get item information
                    let indexItem = dataLocalStorage.findIndex((itemFind) => {
                        return itemFind.name === item;
                    });
                    newArray.push({
                        ...dataLocalStorage[indexItem],
                        count: counts[item]
                    });
                });
            /// If item in inventory has no count
            } else if (dataLocalStorage[0]?.count === undefined) {
                dataLocalStorage.forEach((item) => {
                    if (item.count === undefined){
                        newArray.push({
                            ...item,
                            count: 1
                        });
                    } else {
                        newArray.push(item);   
                    };
                });
            } else {
                newArray = dataLocalStorage;
            };
            this.setState({
                inventory: [...newArray]
            });
        };
        if (localStorage.getItem('equipment') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('equipment'));
            this.setState({
                equipment: {
                    ...this.state.equipment,
                    ...dataLocalStorage
                }
            });
        };
        if (localStorage.getItem('gold') !== null) {
            this.setState({
                gold: JSON.parse(localStorage.getItem('gold'))
            });
        };
        if (localStorage.getItem('stats') !== null) {
            const dataLocalStorageStats = JSON.parse(localStorage.getItem('stats'));

            if (typeof dataLocalStorageStats.health !== 'object') return;
            
            const localStorageStatPoints = localStorage.getItem('statpoints');
            let dataStatPoints = 0;
            if (localStorageStatPoints !== null) {
                dataStatPoints = JSON.parse(localStorageStatPoints);
            } else {
                dataStatPoints = this.calculateTotalStatPoints(dataLocalStorageStats.level);
            };

            this.setState({
                stats: {
                    ...dataLocalStorageStats
                },
                statPoints: dataStatPoints
            }, () => {
                if (this.state.stats.maxExp === 0) {
                    this.calculateMaxExp();
                };
            });
        };
        if (localStorage.getItem('abilities') !== null) {
            let dataLocalStorageAbilities = JSON.parse(localStorage.getItem('abilities'));
            this.setState({
                abilities: [...dataLocalStorageAbilities]
            });
        };
        if (localStorage.getItem('name') !== null) {
            window.username = JSON.parse(localStorage.getItem('name'));
        };

        voices = window.speechSynthesis.getVoices();
        speechSynthesis.addEventListener('voiceschanged', () => {
            voices = window.speechSynthesis.getVoices();
        }, { once: true });
    };

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.storeData);
        window.removeEventListener('new item', this.addItem);
        window.removeEventListener('gold bag', this.addGoldBag);
        window.removeEventListener('equip item', this.equipItem);
        clearTimeout(timeoutText);
        clearInterval(intervalHorror);
    };
    
    render() {
        const gameProps = {
            gold: this.state.gold,
            stats: this.state.stats,
            abilities: this.state.abilities,
            updateGameValue: this.updateGameValue,
            formatNumber: formatNumber,
            randomItem: randomItem,
            renderHearts: renderHearts,
            healthDisplay: this.state.values.health.value,
            gameIconSize: '1em'
        };

        return (
            <div id='widget-container'
                onMouseMove={(event) => this.handleMouseMove(event)}>
                <h1 className='screen-reader-only'>Widget Hell Dashboard</h1>
                {(this.state.values.transcribeAudio)
                    && <div id='transcript'></div>}
                <div id='disclaimer'
                    onClick={() => { document.getElementById('disclaimer').style.display = 'none'; }}>
                    <span>
                        <FaExclamationTriangle/>
                        Disclaimer
                        <FaExclamationTriangle/>
                    </span>
                    <span>All item names, logos, characters, brands, trademarks and registered trademarks are property of their respective owners and unrelated to Widget Hell.</span>
                    <span>Sources are listed in LICENSE.md</span>
                </div>
                {(this.state.values.cursorTrail)
                    && <Cursor color={this.state.values.cursorTrailColor}
                        flat={this.state.values.cursorTrailFlat}
                        mode={this.state.values.cursorTrailMode}
                        thickness={this.state.values.cursorTrailThickness}
                        duration={this.state.values.cursorTrailDuration}/>}
                <Particle choice={this.state.values.particle}
                    mute={this.state.values.particleMute}/>
                <pre id='clipboard-dump'></pre>
                <button id='widget-button-setting'
                    className='button-match inverse button-setting-active'
                    aria-label='Setting'
                    onClick={() => this.showSetting()}>
                    <IconContext.Provider value={{ size: '2em', className: 'global-class-name' }}>
                        <AiOutlineSetting/>
                    </IconContext.Provider>
                </button>
                <WidgetSetting widgets={this.state.widgets}
                    values={this.state.values}
                    showHide={this.handleShowHide}
                    showHidePopout={this.handleShowHidePopout}
                    updateWidgetsActive={this.updateWidgetsActive}
                    updateValue={this.updateValue}
                    updatePosition={this.updatePosition}
                    updateDesign={this.updateDesign}
                    randomColor={this.randomColor}
                    selectTheme={this.state.selectTheme}
                    customBorderValue={this.state.values.customBorder}
                    position={{ x: this.state.widgets.utility.setting.position.x, y: this.state.widgets.utility.setting.position.y }}
                    positionPopout={{
                        showhidewidgets: {
                            x: this.state.widgets.utility.setting.popouts.showhidewidgets.position.x,
                            y: this.state.widgets.utility.setting.popouts.showhidewidgets.position.y
                        },
                        settings: {
                            x: this.state.widgets.utility.setting.popouts.settings.position.x,
                            y: this.state.widgets.utility.setting.popouts.settings.position.y
                        }
                    }}/>
                {Object.keys(widgetsSpecial).map((widget) => {
                    const lowerCased = widget.toLowerCase();
                    
                    return (
                        (this.state.widgets.utility[lowerCased]?.active)
                            && <LazyWidget Component={widgetsSpecialLookup[widget]}
                                defaultProps={this.generateDefaultProps(lowerCased, 'utility')}
                                gameProps={gameProps}
                                parentRef={this}
                                key={`special widget ${widget}`}/>
                    )
                })}
                {Object.keys(widgetsUtility).map((widget) => {
                    const lowerCased = widget.toLowerCase();
                    
                    return (
                        (this.state.widgets.utility[lowerCased]?.active)
                            && <LazyWidget Component={widgetsUtilityLookup[widget]}
                                defaultProps={this.generateDefaultProps(lowerCased, 'utility')}
                                parentRef={this}
                                key={`utility widget ${widget}`}/>
                    )
                })}
                {Object.keys(widgetsGames).map((widget) => {
                    const lowerCased = widget.toLowerCase();
                    
                    return (
                        (this.state.widgets.games[lowerCased]?.active)
                            && <LazyWidget Component={widgetsGamesLookup[widget]}
                                defaultProps={this.generateDefaultProps(lowerCased, 'games')}
                                gameProps={gameProps}
                                parentRef={this}
                                key={`game widget ${widget}`}/>
                    )
                })}
                {Object.keys(widgetsFun).map((widget) => {
                    const lowerCased = widget.toLowerCase();
                    
                    return (
                        (this.state.widgets.fun[lowerCased]?.active)
                            && <LazyWidget Component={widgetsFunLookup[widget]}
                                defaultProps={this.generateDefaultProps(lowerCased, 'fun')}
                                parentRef={this}
                                key={`fun widget ${widget}`}/>
                    )
                })}
            </div>
        );
    };
};

//////////////////// Render to page ////////////////////
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <StrictMode>
        <div id='Base'>
            <div id='App'
                className='background-default'>
                <Widgets/>
            </div>
        </div>
    </StrictMode>
);