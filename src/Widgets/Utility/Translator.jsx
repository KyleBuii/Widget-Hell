import DOMPurify from 'dompurify';
import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { BsArrowLeftRight } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaArrowRightLong, FaRegPaste, FaVolumeHigh } from 'react-icons/fa6';
import Select from 'react-select';


let regexPopouts = new RegExp(/replace|reverse|caseTransform/);
let timeoutCopy, timeoutDialogue, timeoutDialogueOut, timeoutIdle, timeoutSleep;
let intervalSleepTalk;
let cunnyCodeEncode = false;  /// Checks if encoding/decoding is done once OR an error was dismissed
let cunnyCodeError = false;   /// Checks if encoding/decoding error is done once
let cunnyCodeSpecial = false; /// Checks if a special message is done once
let cunnyCodeArona = false;   /// Checks if an arona compliment/hate message is done once
let cunnyCodeAronaAnger = 0;  /// Arona gets angry after 5 insults
let cunnyCodeAudioAronaAh = new Audio('/resources/translator/cunny-code/arona/audio/ah.wav');
let cunnyCodeAudioAronaFue = new Audio('/resources/translator/cunny-code/arona/audio/fue.wav');
let cunnyCodeAudioAronaHeeHeeHee = new Audio('/resources/translator/cunny-code/arona/audio/heeheehee.wav');
let cunnyCodeAudioAronaHuh = new Audio('/resources/translator/cunny-code/arona/audio/huh.wav');
const optionsTranslateFrom = [
    {
        label: 'Languages',
        options: [
            { value: 'en', label: 'English' }
        ]
    },
    {
        label: 'Other Languages',
        options: [
            { value: 'pekofy', label: 'Pekofy' },
            { value: 'braille', label: 'Braille' },
            { value: 'moorseCode', label: 'Moorse Code' },
            { value: 'phoneticAlphabet', label: 'Phonetic Alphabet' },
            { value: 'cunnyCode', label: 'Cunny Code' },
            { value: 'dayo', label: 'Dayo' },
        ]
    },
    {
        label: 'Encryption',
        options: [
            { value: 'base64', label: 'Base64' },
            { value: 'binary', label: 'Binary' },
            { value: 'hexadecimal', label: 'Hexadecimal' },
        ]
    }
];
const optionsTranslateTo = [
    {
        label: 'Languages',
        options: [
            { value: 'en', label: 'English' }
        ]
    },
    {
        label: 'Other Languages',
        options: [
            { value: 'pekofy', label: 'Pekofy' },
            { value: 'braille', label: 'Braille' },
            { value: 'pigLatin', label: 'Pig latin' },
            { value: 'uwu', label: 'UwU' },
            { value: 'emojify', label: 'Emojify' },
            { value: 'moorseCode', label: 'Moorse Code' },
            { value: 'phoneticAlphabet', label: 'Phonetic Alphabet' },
            { value: 'spaced', label: 'Spaced' },
            { value: 'mirrorWriting', label: 'Mirror Writing' },
            { value: 'enchantingTable', label: 'Enchanting Table' },
            { value: 'cunnyCode', label: 'Cunny Code' },
            { value: 'dayo', label: 'Dayo' },
        ]
    },
    {
        label: 'Encryption',
        options: [
            { value: 'base64', label: 'Base64' },
            { value: 'binary', label: 'Binary' },
            { value: 'hexadecimal', label: 'Hexadecimal' },
        ]
    },
    {
        label: 'Modify',
        options: [
            { value: 'replace', label: 'Replace' },
            { value: 'reverse', label: 'Reverse' },
            { value: 'caseTransform', label: 'Case Transform' }
        ]
    }
];

class WidgetTranslator extends Component{
    constructor(props) {
        super(props);
        this.state = {
            disableInput: false,
            idle: false,
            input: '',
            convert: '',
            converted: '',
            from: {},
            to: {},
            replaceFrom: '',
            replaceTo: '',
            author: 'Me',
            authorLink: '',
            reverseWord: false,
            reverseSentence: false,
            caseTransformLower: false,
            caseTransformUpper: false,
            caseTransformCapitalize: false,
            caseTransformAlternate: false,
            caseTransformInverse: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleReplaceFrom = this.handleReplaceFrom.bind(this);
        this.handleReplaceTo = this.handleReplaceTo.bind(this);
        this.handleRandSentence = this.handleRandSentence.bind(this);
        this.handleCunnyCodeAronaDrag = this.handleCunnyCodeAronaDrag.bind(this);
        this.handleCunnyCodeAronaDragging = this.handleCunnyCodeAronaDragging.bind(this);
    };
    async handleCopy() {
        try {
            let clipboardStatus = await this.props.copyToClipboard(this.state.converted);
            let elementTranslatedText = document.getElementById('translator-translated-text');
            elementTranslatedText.style.textShadow = '0px 0px 2px var(--randColorLight)';
            timeoutCopy = setTimeout(() => {
                elementTranslatedText.style.textShadow = 'unset';
            }, 400);
            switch (true) {
                case ((this.state.from.value === 'cunnyCode') || (this.state.to.value === 'cunnyCode')):
                    this.handleCunnyCode('copy', clipboardStatus);
                    break;
                default: break;
            };
        } catch (err) {
            console.error(err);
        };
    };
    handleChange(event) {
        if (event.target.value !== ' ') {
            this.setState({
                input: event.target.value
            }, () => {
                this.convertFromText();
            });
            const translatedText = document.getElementById('translator-translated-text');
            if (translatedText.scrollHeight > translatedText.clientHeight) {
                translatedText.scrollTop = translatedText.scrollHeight;
            };
        };
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
        switch (true) {
            /// Set idle to true after 60 seconds
            case ((this.state.from.value === 'cunnyCode') || (this.state.to.value === 'cunnyCode')):
                clearTimeout(timeoutIdle);
                timeoutIdle = setTimeout(() => {
                    this.setState({
                        idle: true
                    }, () => {
                        this.convertToText();    
                    });
                    timeoutIdle = clearTimeout(timeoutIdle);
                }, 60000);
                break;
            default: break;
        };
    };
    handleCunnyCode(type, subtype, subsubtype) {
        let elementDialogue = document.getElementById('translator-cunny-code-arona-dialogue');
        let elementImage = document.getElementById('translator-image');
        elementDialogue.style.visibility = 'visible';
        elementDialogue.style.animation = 'unset';
        clearTimeout(timeoutDialogue);
        clearTimeout(timeoutDialogueOut);
        let randomMessage;
        if (subsubtype !== undefined) {
            randomMessage = this.props.aronaMessages[type][subtype][subsubtype][Math.floor(Math.random() * this.props.aronaMessages[type][subtype][subsubtype].length)];
        } else if (subtype !== undefined) {
            randomMessage = this.props.aronaMessages[type][subtype][Math.floor(Math.random() * this.props.aronaMessages[type][subtype].length)];
        } else {
            randomMessage = this.props.aronaMessages[type][Math.floor(Math.random() * this.props.aronaMessages[type].length)];
        };
        elementDialogue.innerHTML = DOMPurify.sanitize(randomMessage[0]);
        elementImage.src = `/resources/translator/cunny-code/arona/${randomMessage[1]}.webp`;
    };
    handleCunnyCodeAronaTouch(where) {
        let elementImage = document.getElementById('translator-image');
        elementImage.style.animation = 'unset';
        this.handleCunnyCode('touch', where);
        switch (where) {
            case 'head':
            case 'leg':
                window.requestAnimationFrame(() => {
                    elementImage.style.animation = 'characterJump 500ms ease-in-out';
                });
                this.props.defaultProps.playAudio(cunnyCodeAudioAronaHeeHeeHee);
                break;
            case 'face':
                window.requestAnimationFrame(() => {
                    elementImage.style.animation = 'characterLeanIn 600ms ease-in-out forwards';
                });
                this.props.defaultProps.playAudio(cunnyCodeAudioAronaHuh);
                break;
            case 'chest':
            case 'skirt':
            case 'shoe':
                window.requestAnimationFrame(() => {
                    elementImage.style.animation = 'characterShake 200ms linear';
                });
                this.props.defaultProps.playAudio(cunnyCodeAudioAronaAh);
                break;
            default: break;
        };
    };
    handleCunnyCodeAronaDrag(action, event) {
        let elementImage = document.getElementById('translator-image');
        let elementImageAdditions = document.getElementById('translator-image-additions-cunny-code');
        switch (action) {
            case 'pickup':
                this.handleCunnyCode('pickup');
                window.requestAnimationFrame(() => {
                    elementImage.style.animation = 'characterSwing 3s infinite ease-in-out';
                    elementImageAdditions.style.animation = 'characterSwing 3s infinite ease-in-out';
                });
                this.props.defaultProps.playAudio(cunnyCodeAudioAronaFue);
                elementImage.classList.add('dragging');
                elementImage.style.animationFillMode = 'none';
                elementImageAdditions.classList.add('dragging');
                if (this.props.isMobile) {
                    document.addEventListener('touchmove', this.handleCunnyCodeAronaDragging);
                    document.addEventListener('touchend', this.handleCunnyCodeAronaDrag);
                } else {
                    document.addEventListener('mousemove', this.handleCunnyCodeAronaDragging);
                    document.addEventListener('mouseup', this.handleCunnyCodeAronaDrag);
                };
                this.handleCunnyCodeAronaDragging(event);
                break;
            default:
                this.handleCunnyCode('putdown');
                elementImage.style.animation = 'none';
                elementImage.classList.remove('dragging');
                elementImage.style.left = 'unset';
                elementImage.style.top = 'unset';
                elementImageAdditions.style.animation = 'none';
                elementImageAdditions.classList.remove('dragging');
                elementImageAdditions.style.left = '2.5em';
                elementImageAdditions.style.top = '2em';
                if (this.props.isMobile) {
                    document.removeEventListener('touchmove', this.handleCunnyCodeAronaDragging);
                    document.removeEventListener('touchend', this.handleCunnyCodeAronaDrag);
                } else {
                    document.removeEventListener('mousemove', this.handleCunnyCodeAronaDragging);
                    document.removeEventListener('mouseup', this.handleCunnyCodeAronaDrag);
                };
                break;
        };
    };
    handleCunnyCodeAronaDragging(event) {
        const elementImageContainer = document.getElementById('translator-container-image').getBoundingClientRect();
        const elementImage = document.getElementById('translator-image');
        const elementImageAdditions = document.getElementById('translator-image-additions-cunny-code');
        if (this.props.isMobile) {
            const touch = event.touches[0];
            elementImage.style.left = `${touch.clientX - elementImageContainer.left - 66}px`;
            elementImage.style.top = `${touch.clientY - elementImageContainer.top + 108}px`;
            elementImageAdditions.style.setProperty('left', `${touch.clientX - elementImageContainer.left - 56}px`, 'important');
            elementImageAdditions.style.setProperty('top', `${touch.clientY - elementImageContainer.top + 108}px`, 'important');
        } else {
            elementImage.style.left = `${event.clientX - elementImageContainer.left - 66}px`;
            elementImage.style.top = `${event.clientY - elementImageContainer.top + 108}px`;
            elementImageAdditions.style.setProperty('left', `${event.clientX - elementImageContainer.left - 56}px`, 'important');
            elementImageAdditions.style.setProperty('top', `${event.clientY - elementImageContainer.top + 108}px`, 'important');
        };
    };
    /// Handles 'word-break' for unbreakable strings
    handleWordBreak() {
        const translatedText = document.getElementById('translator-translated-text');
        switch (this.state.to.value) {
            case 'braille':
            case 'base64':
            case 'hexadecimal':
                translatedText.style.wordBreak = 'break-all';
                break;
            default:
                translatedText.style.wordBreak = 'normal';
                break;
        };
    };
    /// Handles special stuff for options (author, images, dialogue)
    handleBackground(swap) {
        let toAuthor, toAuthorLink;
        let elementContainer = document.getElementById('translator-widget-animation');
        let elementImage = document.getElementById('translator-image');
        switch (true) {
            case ((this.state.from.value === 'cunnyCode') || (this.state.to.value === 'cunnyCode')):
                if (timeoutSleep === undefined) {
                    cunnyCodeEncode = false;
                    cunnyCodeError = false;
                    cunnyCodeSpecial = false;
                    cunnyCodeArona = false;
                    toAuthor = 'Seth-sensei';
                    toAuthorLink = 'https://github.com/SethClydesdale/cunny-code';
                    this.props.updateGlobalValue('hour', new Date().getHours());
                    this.handleCunnyCode((swap) ? 'swap' : 'greetings');
                    elementContainer.style.backgroundImage = `url(./resources/translator/cunny-code/bg.webp)`;
                    elementImage.style.display = 'block';
                };
                break;
            default:
                toAuthor = 'Me';
                toAuthorLink = '';
                elementContainer.style.backgroundImage = `url(./resources/translator/bg-${this.state.to.value}.webp)`;
                elementImage.src = '';
                elementImage.style.display = 'none';
                break;
        };
        this.setState({
            author: toAuthor,
            authorLink: toAuthorLink
        });
    };
    /// Handles the 'from' language select
    handleFrom(event) {
        this.setState({
            from: event
        }, () => {
            this.handleBackground();
            if (this.state.input !== '') {
                this.convertFromText();
            }
        });
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };
    /// Handles the 'to' language select
    handleTo(event) {
        let popoutAnimation;
        /// If previous value is a popout, hide it
        if (regexPopouts.test(this.state.to.value)) {
            popoutAnimation = document.getElementById(`${this.state.to.value}-popout-animation`);
            this.props.defaultProps.showHidePopout(popoutAnimation, false);
        };
        /// If chosen value is a popout, show it
        if (regexPopouts.test(event.value)) {
            popoutAnimation = document.getElementById(`${event.value}-popout-animation`);
            this.props.defaultProps.showHidePopout(popoutAnimation, true);
        };
        this.setState({
            to: event,
        }, () => {
            this.handleWordBreak();
            this.handleBackground();
            if (this.state.input !== '') {
                this.convertToText();
            }
        });
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };
    /// Swaps 'from' language and 'to' language
    handleSwap() {
        if (this.state.from.value !== this.state.to.value) {
            this.props.randomColor();
            const prev = this.state.from;
            this.setState(prevState => ({
                from: prevState.to,
                to: prev
            }), () => {
                this.convertFromText(true);
                this.handleWordBreak();
                this.handleBackground(true);
            });
        };
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };
    /// Saves 'converted' text into 'input' field
    handleSave() {
        this.setState(prevState => ({
            input: prevState.converted,
            convert: prevState.converted
        }), () => {
            this.convertToText();
        });
    };
    handleTalk() {
        this.props.talk(this.state.converted);
    };
    /// Handles 'replace' from 'translator-translate-to'
    handleReplaceFrom(event) {
        this.setState({
            replaceFrom: event.target.value
        }, () => {
            if (this.state.converted !== '') {
                this.convertToText();
            };
        });
    };
    handleReplaceTo(event) {
        this.setState({
            replaceTo: event.target.value
        }, () => {
            if (this.state.converted !== '') {
                this.convertToText();
            };
        });
    };
    /// Handles all buttons that are pressable (opacity: 0.5 on click)
    handlePressableButton(what, popout) {
        const popoutButton = document.getElementById(`${popout}-popout-button-${what}`);
        popoutButton.style.opacity = (this.state[what] === false) ? '1' : '0.5';
        this.setState({
            [what]: !this.state[what]
        }, () => {
            this.convertToText();
        });
    };
    /// Handles random sentence button
    handleRandSentence() {
        this.setState({
            input: this.props.randSentence(),
        }, () => {
            this.convertFromText();
        });
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };
    /// Convert the 'from' language to english
    convertFromText(swap) {
        let stringConvertFrom = '';
        switch (this.state.from.value) {
            /// Other languages
            case 'braille': {
                stringConvertFrom = this.state.input
                    .toString()
                    .split('')
                    .map(letter => this.props.brailleFromDictionary[letter])
                    .join('');
                break;
            };
            case 'cunnyCode': { 
                let encodeError = false; /// If an error exist
                stringConvertFrom = this.state.input
                    .split(' ')
                    .map((char) => {
                        if (char.charAt(0) === '^') {
                            return this.props.cunnyCodeFromDictionary[char.substring(1)].toUpperCase();
                        } else if (char === '') {
                            return ' ';
                        } else if (this.props.cunnyCodeFromDictionary[char] === undefined) {
                            encodeError = true;
                            return char;
                        } else {
                            return this.props.cunnyCodeFromDictionary[char];
                        };
                    })
                    .join('');
                if (!swap) {
                    /// If there is no typed message
                    if (this.state.input.length === 0) {
                        cunnyCodeEncode = false;
                        cunnyCodeError = false;
                        let elementDialogue = document.getElementById('translator-cunny-code-arona-dialogue');
                        timeoutDialogue = setTimeout(() => {
                            elementDialogue.style.animation = 'unset';
                            window.requestAnimationFrame(() => {
                                elementDialogue.style.animation = 'dialogueOut 2s';
                            });
                        }, 2000);
                        timeoutDialogueOut = setTimeout(() => {
                            elementDialogue.style.visibility = 'hidden';
                        }, 4000);
                    /// If an error is found and an error message isn't displayed yet
                    } else if (encodeError && !cunnyCodeError) {
                        cunnyCodeError = true;
                        this.handleCunnyCode('decodeError');
                    /// If there is no error and the error message boolean is still true
                    } else if (!encodeError && cunnyCodeError) {
                        cunnyCodeError = false;
                        this.handleCunnyCode('decode');
                    /// Arona
                    } else if (/😭💢 😭💢😭 💢💢💢 💢😭 😭💢/i.test(this.state.input)
                        && !cunnyCodeSpecial) {
                        cunnyCodeSpecial = true;
                        this.handleCunnyCode('special', 'arona', 'decode')
                    /// If there is no special case and the special cases boolean is true
                    } else if (!/😭💢 😭💢😭 💢💢💢 💢😭 😭💢/i.test(this.state.input)
                        && cunnyCodeSpecial) {
                        cunnyCodeSpecial = false;
                        this.handleCunnyCode('decode');
                    /// If there are no errors
                    } else if (!cunnyCodeEncode && !encodeError && !cunnyCodeError) {
                        cunnyCodeEncode = true;
                        this.handleCunnyCode('decode');
                    };
                };
                break;
            };
            case 'dayo': {
                stringConvertFrom = this.state.input
                    .replace(/\s(dayo)/ig, '');
                break;
            };
            case 'pekofy': {
                stringConvertFrom = this.state.input
                    .replace(/\s(peko)/ig, '');
                break;
            };
            case 'moorseCode':
            case 'phoneticAlphabet': {
                stringConvertFrom = this.state.input
                    .split(' ')
                    .map((char) => this.props[`${this.state.from.value}FromDictionary`][char] || '')
                    .join('');
                break;
            };
            /// Encryption
            case 'base64': {
                if (/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(this.state.input)) {
                    stringConvertFrom = window.atob(this.state.input);
                };
                break;
            };
            case 'binary': {
                stringConvertFrom = this.state.input
                    .split(' ')
                    .map((binary) => String.fromCharCode(parseInt(binary, 2)))
                    .join('');
                break;
            };
            case 'hexadecimal': {
                stringConvertFrom = this.state.input
                    .split(' ')
                    .map((hex) => String.fromCharCode(parseInt(hex, 16)))
                    .join('');
                break;
            };
            default: {
                stringConvertFrom = this.state.input;
                break;
            };
        };
        this.setState({
            convert: stringConvertFrom
        }, () => {
            this.convertToText(swap);
        });
    };
    /// Convert english to the 'to' language
    convertToText(swap) {
        let stringConvertTo = '';
        switch (this.state.to.value) {
            /// Other languages
            case 'braille': {
                stringConvertTo = this.state.convert
                    .split('')
                    .map((letter) => this.props.brailleDictionary[letter.toLowerCase()] || '')
                    .join('')
                    .replace(/\s+/g, ' ');
                break;
            };
            case 'cunnyCode': {
                let encodeError = false; /// If an error exist
                if (!this.state.disableInput) {
                    stringConvertTo = this.state.convert
                        .split('')
                        .map((char) => {
                            if (/[A-Z]/.test(char)) {
                                return `^${this.props.cunnyCodeDictionary[char.toLowerCase()]}`;
                            } else {
                                if (this.props.cunnyCodeDictionary[char.toLowerCase()] === undefined) {
                                    encodeError = true;
                                    return char;
                                } else {
                                    return this.props.cunnyCodeDictionary[char.toLowerCase()];
                                };
                            };
                        })
                        .join(' ');
                };
                if (!swap) {
                    let elementContainer = document.getElementById('translator-widget-animation');
                    let elementImage = document.getElementById('translator-image');
                    let elementImageAdditions = document.getElementById('translator-image-additions-cunny-code');
                    let elementAronaBody = document.getElementById('translator-cunny-code-arona-body');
                    let elementDialogue = document.getElementById('translator-cunny-code-arona-dialogue');
                    let keysSpecial = Object.keys(this.props.aronaMessages.special)
                    keysSpecial.pop();
                    keysSpecial.join('|').replace(/_/g, ' ');
                    let regexSpecial = new RegExp(`${keysSpecial}`, 'i');
                    let regexAronaPositive = new RegExp('arona.+(cute|cunny|cute and funny|breedable|best|love)', 'i');
                    let regexAronaNegative = new RegExp('arona.+(hate|dumb|sucks|smells|smelly)', 'i');
                    let regexAronaApologize = new RegExp('arona.+(sorry)', 'i');
                    let regexAronaWake = new RegExp('wake up|i( a)?m here', 'i');
                    /// If the user is idle
                    if (this.state.idle) {
                        /// Arona will go to sleep after 30 seconds
                        if ((timeoutSleep === undefined) &&
                            (intervalSleepTalk === undefined)) {
                            this.handleCunnyCode('idle');
                            timeoutSleep = setTimeout(() => {
                                this.setState({
                                    disableInput: true
                                });
                                elementContainer.style.backgroundImage = `url(./resources/translator/cunny-code/bg_sleep.webp)`;
                                elementImage.style.visibility = 'hidden';
                                elementAronaBody.style.visibility = 'hidden';
                                elementDialogue.style.visibility = 'hidden';
                                intervalSleepTalk = setInterval(() => {
                                    elementContainer.style.backgroundImage = `url(./resources/translator/cunny-code/bg_sleeptalk.webp)`;
                                    elementDialogue.style.visibility = 'visible';
                                    elementDialogue.style.top = '-10em';
                                    this.handleCunnyCode('idleSleep');
                                    timeoutDialogue = setTimeout(() => {
                                        elementDialogue.style.animation = 'unset';
                                        window.requestAnimationFrame(() => {
                                            elementDialogue.style.animation = 'dialogueOut 2s';
                                        });
                                    }, 10000);
                                    timeoutDialogueOut = setTimeout(() => {
                                        elementContainer.style.backgroundImage = `url(./resources/translator/cunny-code/bg_sleep.webp)`;
                                        elementDialogue.style.visibility = 'hidden';
                                    }, 12000);
                                }, 20000);
                            }, 30000);
                        };
                        /// If Arona is woken up
                        if (regexAronaWake.test(this.state.convert)) {
                            this.setState({
                                idle: false,
                                disableInput: false
                            });
                            this.handleCunnyCode('idleAwaken');
                            elementContainer.style.backgroundImage = `url(./resources/translator/cunny-code/bg.webp)`;
                            elementImage.style.visibility = 'visible';
                            elementAronaBody.style.visibility = 'visible';
                            elementDialogue.style.top = '-16.2em';
                            timeoutSleep = clearTimeout(timeoutSleep);
                            intervalSleepTalk = clearInterval(intervalSleepTalk);
                        };
                    } else {
                        /// If Arona is angry, you can make Arona not angry by apologizing
                        if (cunnyCodeAronaAnger === 5) {
                            this.setState({
                                disableInput: true
                            });
                            this.handleCunnyCode('quit');
                            if (regexAronaNegative.test(this.state.convert)) {
                                cunnyCodeAronaAnger++;
                            };
                        /// Arona hides if the user continues to be angry
                        } else if (cunnyCodeAronaAnger > 5) {
                            elementImage.style.display = 'none';
                            elementImageAdditions.style.display = 'none';
                            if (regexAronaApologize.test(this.state.convert)) {
                                this.setState({
                                    disableInput: false
                                });    
                                cunnyCodeAronaAnger = 0;
                                elementImage.style.display = 'block';
                                elementImageAdditions.style.display = 'block';    
                                this.handleCunnyCode('special', 'arona_sorry');
                            };
                        /// If Arona is not angry
                        } else if (cunnyCodeAronaAnger !== 5) {
                            /// If there is no typed message, set all checks to false
                            if ((this.state.convert.length === 0)
                                && (timeoutSleep === undefined)) {
                                cunnyCodeEncode = false;
                                cunnyCodeError = false;
                                cunnyCodeSpecial = false;
                                cunnyCodeArona = false;
                                timeoutDialogue = setTimeout(() => {
                                    elementDialogue.style.animation = 'unset';
                                    window.requestAnimationFrame(() => {
                                        elementDialogue.style.animation = 'dialogueOut 2s';
                                    });
                                }, 2000);
                                timeoutDialogueOut = setTimeout(() => {
                                    elementDialogue.style.visibility = 'hidden';
                                }, 4000);
                            /// If an error is found and an error message isn't displayed yet
                            } else if (encodeError && !cunnyCodeError) {
                                cunnyCodeError = true;
                                this.handleCunnyCode('encodeError');
                            /// If there is no error and the error message boolean is still true
                            } else if (!encodeError && cunnyCodeError) {
                                cunnyCodeError = false;
                                this.handleCunnyCode('encode');
                            /// If there are no errors
                            } else if (!cunnyCodeEncode && !encodeError && !cunnyCodeError) {
                                cunnyCodeEncode = true;
                                this.handleCunnyCode('encode');
                            /// Name
                            } else if (/My name is \S+|Call me \S+/i.test(this.state.convert)) {
                                if (this.state.convert.match(/([\S]+)$/) !== null) {
                                    window.username = this.state.convert.match(/([\S]+)$/)[0];
                                    this.handleCunnyCode('name', 'set');
                                } else {
                                    this.handleCunnyCode('name', 'empty');
                                };
                            /// Additional matches for special cases
                            /// Goodnight
                            } else if (/good.?night/i.test(this.state.convert)
                                && !cunnyCodeSpecial) {
                                cunnyCodeSpecial = true;
                                this.handleCunnyCode('special', 'goodnight');
                            /// Goodbye
                            } else if (/good.?bye/i.test(this.state.convert)
                                && !cunnyCodeSpecial) {
                                cunnyCodeSpecial = true;
                                this.handleCunnyCode('special', 'goodbye');
                            /// Uoh
                            } else if (/\bu+o+h+\b/i.test(this.state.convert)
                                && !cunnyCodeSpecial) {
                                cunnyCodeSpecial = true;
                                this.handleCunnyCode('special', 'uoh');
                            /// Kms
                            } else if (/kill.?my.?self/i.test(this.state.convert)
                                && !cunnyCodeSpecial) {
                                cunnyCodeSpecial = true;
                                this.handleCunnyCode('special', 'kms');
                            /// Seggs
                            } else if (/\bs+e+x+\b/i.test(this.state.convert)
                                && !cunnyCodeSpecial) {
                                cunnyCodeSpecial = true;
                                this.handleCunnyCode('special', 'seggs');
                            /// Sixty nine
                            } else if (/\b69\b/.test(this.state.convert)
                                && !cunnyCodeSpecial) {
                                cunnyCodeSpecial = true;
                                this.handleCunnyCode('special', 'sixty_nine');
                            /// Arona
                            } else if (/arona/i.test(this.state.convert)
                                && !cunnyCodeSpecial) {
                                cunnyCodeSpecial = true;
                                this.handleCunnyCode('special', 'arona', 'encode');
                            /// Arona Positives (makes Arona less angry)
                            } else if (regexAronaPositive.test(this.state.convert)
                                && !cunnyCodeArona) {
                                if (cunnyCodeAronaAnger > 0) {
                                    cunnyCodeAronaAnger--;
                                };
                                cunnyCodeArona = true;
                                let aronaPositiveString = (this.state.convert).match(regexAronaPositive);
                                this.handleCunnyCode('special', `arona_${aronaPositiveString[1]}`);
                            /// Arona Negatives
                            } else if (regexAronaNegative.test(this.state.convert)
                                && !cunnyCodeArona) {
                                cunnyCodeAronaAnger++;
                                cunnyCodeArona = true;
                                let aronaNegativeString = (this.state.convert).match(regexAronaNegative);
                                this.handleCunnyCode('special', `arona_${aronaNegativeString[1]}`);
                            /// If an Arona postive and negative is true but there are none, set to false 
                            } else if (cunnyCodeArona
                                && !regexAronaPositive.test(this.state.convert)
                                && !regexAronaNegative.test(this.state.convert)) {
                                cunnyCodeArona = false;
                                this.handleCunnyCode('special', 'arona', 'encode');
                            /// All special cases
                            } else if (regexSpecial.test(this.state.convert)
                                && !cunnyCodeSpecial) {
                                cunnyCodeSpecial = true;
                                let specialString = this.state.convert.match(regexSpecial)[0].replace(/\s/g, '_');
                                this.handleCunnyCode('special', specialString);
                            /// If there is no special case and the special cases boolean is true
                            } else if (!regexSpecial.test(this.state.convert)
                                && !(/good.?night|good.?bye|\bu+o+h+\b|kill.?my.?self|\bs+e+x+\b|\b69\b|arona/i.test(this.state.convert))
                                && !regexAronaPositive.test(this.state.convert)
                                && !regexAronaNegative.test(this.state.convert)
                                && cunnyCodeSpecial) {
                                cunnyCodeSpecial = false;
                                cunnyCodeArona = false;
                                this.handleCunnyCode('encode');
                            };
                        };
                    };
                };
                break;
            };
            case 'dayo': {
                stringConvertTo = this.state.convert
                    .replace(/[^.!?]$/i, '$& dayo')
                    .replace(/[.]/ig, ' dayo.')
                    .replace(/[!]/ig, ' dayo!')
                    .replace(/[?]/ig, ' dayo?')
                break;
            };
            case 'emojify': {
                let wordsEmojify = Object.keys(this.props.emojifyDictionary).join('|');
                let regexEmojifyDictionary = new RegExp(`(?<![\\w${this.props.punctuation}])(${wordsEmojify})(?![\\w${this.props.punctuation}])`, 'i');
                stringConvertTo = this.props.mergePunctuation(
                    this.props.grep(this.state.convert
                        .split(this.props.matchAll)
                        .map((word) => {
                            return (regexEmojifyDictionary.test(word)) ? word.replace(regexEmojifyDictionary, word + ' ' + this.props.emojifyDictionary[word.toLowerCase()][
                                Math.floor(Math.random() * this.props.emojifyDictionary[word.toLowerCase()].length)
                            ]) : word;
                        })
                    )
                ).join(' ');
                break;
            };
            case 'enchantingTable': {
                stringConvertTo = this.state.convert
                    .split('')
                    .map((char) => this.props.enchantingTableDictionary[char.toLowerCase()] || char)
                    .join('');
                break;
            };
            case 'mirrorWriting': {
                stringConvertTo = this.state.convert
                    .split('')
                    .reverse()
                    .map((char) => this.props.mirrorWrittingDictionary[char] || char)
                    .join('');
                break;
            };
            case 'pekofy': {
                stringConvertTo = this.state.convert
                    .replace(/[^.!?]$/i, '$& peko')
                    .replace(/[.]/ig, ' peko.')
                    .replace(/[!]/ig, ' peko!')
                    .replace(/[?]/ig, ' peko?')
                break;
            };
            case 'pigLatin': {
                stringConvertTo = this.state.convert
                    .toString()
                    .toLowerCase()
                    .split(' ')
                    .map(curr => curr
                        .replace(/^[aioue]\w*/i, '$&way')
                        .replace(/(^[^aioue]+)(\w*)/i, '$2$1ay'))
                    .join(' ')
                break;
            };
            case 'spaced': {
                stringConvertTo = this.state.convert
                    .split('')
                    .join(' ');
                break;
            };
            case 'uwu': {
                let wordsUwu = Object.keys(this.props.uwuDictionary).join('|');
                let regexUwuDictionary = new RegExp(`(?<![\\w${this.props.punctuation}])(${wordsUwu})(?![\\w${this.props.punctuation}])`, 'i');
                stringConvertTo = this.props.mergePunctuation(
                    this.props.grep(this.state.convert
                        .toString()
                        .toLowerCase()
                        .split(this.props.matchAll))
                        .map((word) => {
                            return (/[?]+/.test(word)) ? word.replace(/[?]+/, '???')
                                : (/[!]+/.test(word)) ? word.replace(/[!]+/, '!!11')
                                : (regexUwuDictionary.test(word)) ? word.replace(regexUwuDictionary, this.props.uwuDictionary[word][Math.floor(Math.random() * this.props.uwuDictionary[word].length)])
                                : (/(l)\1/.test(word.substring(1, word.length))) ? word.replace(/(l)\1/, 'ww')
                                : (/(r)\1/.test(word.substring(1, word.length))) ? word.replace(/(r)\1/, 'ww')
                                : (/[l|r]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([l|r])(\w*)/, '$1w$3')
                                : (/[h]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([h])(\w*)/, '$1b$3')
                                : (/[f]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([f])(\w*)/, '$1b$3')
                                : (/^\d/.test(word)) ? word
                                : word.replace(/(?=\w{3,})^([^\Ww])(\w*)/, '$1w$2');
                        }
                    )
                );
                /// Insert emoticon at random position
                let randPosition;
                const randEmoticon = Math.floor(Math.random() * this.props.uwuEmoticons.length);
                if (stringConvertTo.length > 4) {
                    randPosition = Math.floor(Math.random() * (stringConvertTo.length - 2) + 2);
                    stringConvertTo = [...stringConvertTo.slice(0, randPosition)
                        , this.props.uwuEmoticons[randEmoticon]
                        , ...stringConvertTo.slice(randPosition)]
                        .join(' ');
                } else if (stringConvertTo.length <= 4) {
                    stringConvertTo = stringConvertTo.join(' ');
                };   
                break;
            };
            case 'moorseCode':
            case 'phoneticAlphabet': {
                stringConvertTo = this.state.convert
                    .split('')
                    .map((char) => this.props[`${this.state.to.value}Dictionary`][char.toLowerCase()] || '')
                    .join(' ')
                    .replace(/\s+/g, ' ');
                break;
            };
            /// Encryption
            case 'base64': {
                stringConvertTo = btoa(unescape(encodeURIComponent(this.state.convert)));
                break;
            };
            case 'binary': {
                let stringConvertedBinary = '';
                for (let i = 0; i < this.state.convert.length; i++) {
                    stringConvertedBinary += this.state.convert[i].charCodeAt(0).toString(2) + ' ';
                };
                stringConvertTo = stringConvertedBinary;
                break;
            };
            case 'hexadecimal': {
                let stringConvertedHexadecimal = '';
                for (let i = 0; i < this.state.convert.length; i++) {
                    stringConvertedHexadecimal += this.state.convert[i].charCodeAt(0).toString(16) + ' ';
                };
                stringConvertTo = stringConvertedHexadecimal;
                break;
            };
            /// Modify
            case 'caseTransform': {
                if (this.state.caseTransformUpper) {
                    /// Case Transform Upper
                    stringConvertTo = this.state.convert.toUpperCase();
                } else if (this.state.caseTransformLower) {
                    /// Case Transform Lower
                    stringConvertTo = this.state.convert.toLowerCase();
                } else if (this.state.caseTransformCapitalize) {
                    /// Case Transform Capitalize
                    stringConvertTo = this.state.convert
                        .replace(/\b\w/g, (char) => {
                            return char.toUpperCase()
                        });
                } else if (this.state.caseTransformAlternate) {
                    /// Case Transform Alternate
                    stringConvertTo = this.state.convert
                        .toLowerCase()
                        .split('')
                        .map((val, i) => {
                            return (i % 2 === 0) ? val.toUpperCase() : val;
                        })
                        .join('');
                } else if (this.state.caseTransformInverse) {
                    /// Case Transform Inverse
                    stringConvertTo = this.state.convert
                        .replace(/[a-z]/gi, (char) => {
                            return (char === char.toUpperCase()) ? char.toLowerCase() : char.toUpperCase();
                        });
                } else {
                    stringConvertTo = this.state.convert;
                };
                break;
            };
            case 'replace': {
                stringConvertTo = this.state.convert.replace(this.state.replaceFrom, this.state.replaceTo)
                break;
            };
            case 'reverse': {
                if (this.state.reverseWord && this.state.reverseSentence) {
                    /// Reverse Word + Sentence
                    stringConvertTo = this.props.mergePunctuation(this.state.convert
                        .split(/([.?!])\s*/)
                        .map(sentence => sentence
                            .split(' ')
                            .map(word => word
                                .split('')
                                .reverse()
                                .join(''))
                            .reverse()
                            .join(' ')
                        )
                    ).join(' ');
                } else if (this.state.reverseWord) {
                    /// Reverse Word
                    stringConvertTo = this.state.convert
                        .split(/(\s|[^\w'])/g)
                        .map(function(word){
                            return word
                                .split('')
                                .reverse()
                                .join('');
                        })
                        .join('');
                } else if (this.state.reverseSentence) {
                    /// Reverse Sentence
                    stringConvertTo = this.props.mergePunctuation(this.state.convert
                        .split(/([.!?'])\s*/)
                        .map(function(sentence){
                            return sentence
                                .split(' ')
                                .reverse()
                                .join(' ')
                        })
                    ).join(' ');
                } else {
                    stringConvertTo = this.state.convert;
                };
                break;
            };
            default: {
                stringConvertTo = this.state.convert;
                break;
            };
        };
        this.setState({
            converted: stringConvertTo
        });
    };
    componentDidMount() {
        /// Sort the 'translate-to' optgroups options alphabetically
        this.props.sortSelect(optionsTranslateFrom);
        this.props.sortSelect(optionsTranslateTo);
        /// Default values
        if (sessionStorage.getItem('translator') === null) {
            this.setState({
                from: { value: 'en', label: 'English' },
                to: { value: 'en', label: 'English' }
            }, () => {
                this.handleBackground();   
            });
        } else {
            let dataSessionStorage = JSON.parse(sessionStorage.getItem('translator'));
            this.setState({
                from: dataSessionStorage.from,
                to: dataSessionStorage.to
            }, () => {
                if (regexPopouts.test(this.state.to.value)) {
                    let popoutAnimation = document.getElementById(`${this.state.to.value}-popout-animation`);
                    this.props.defaultProps.showHidePopout(popoutAnimation, true);        
                };
                this.handleWordBreak();
                this.handleBackground();
            });
        };
    };
    componentWillUnmount() {
        let data = {
            'from': this.state.from,
            'to': this.state.to
        };
        sessionStorage.setItem('translator', JSON.stringify(data));
        clearTimeout(timeoutCopy);
        clearTimeout(timeoutDialogue);
        clearTimeout(timeoutIdle);
        clearTimeout(timeoutSleep);
        clearInterval(intervalSleepTalk);
        document.removeEventListener('mousemove', this.handleCunnyCodeAronaDragging);
        document.removeEventListener('mouseup', this.handleCunnyCodeAronaDrag);
    };
    render() {
        return (
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart('translator')}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop('translator');
                    this.props.defaultProps.updatePosition('translator', 'utility', data.x, data.y);
                }}
                cancel='button, span, p, textarea, section, .select-match'
                bounds='parent'>
                <div id='translator-widget'
                    className='widget'>
                    <div id='translator-widget-animation'
                        className='widget-animation'>
                        {/* Drag Handle */}
                        <span id='translator-widget-draggable'
                            className='draggable'>
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: 'global-class-name' }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar('translator', 'utility')}
                        <section className='flex-center row wrap'
                            style={{
                                flexWrap: 'wrap-reverse'
                            }}>
                            <section id='translator-container-image'>
                                {/* Image */}
                                <img id='translator-image'
                                    className='no-highlight'
                                    alt='translator image'
                                    draggable='false'
                                    loading='lazy'
                                    decoding='async'/>
                                {/* Image Additions: Cunny Code */}
                                {((this.state.to.value === 'cunnyCode') || this.state.from.value === 'cunnyCode')
                                    ? <div id='translator-image-additions-cunny-code'
                                        className='font small'
                                        draggable='false'>
                                        <div id='translator-cunny-code-arona-body'>
                                            <div id='translator-cunny-code-arona-halo'
                                                className='arona-action'
                                                onMouseDown={(event) => this.handleCunnyCodeAronaDrag('pickup', event)}
                                                onTouchStart={(event) => this.handleCunnyCodeAronaDrag('pickup', event)}></div>
                                            <div id='translator-cunny-code-arona-head'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('head')}></div>
                                            <div id='translator-cunny-code-arona-face'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('face')}></div>
                                            <div id='translator-cunny-code-arona-chest'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('chest')}></div>
                                            <div id='translator-cunny-code-arona-skirt'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('skirt')}></div>
                                            <div id='translator-cunny-code-arona-leg1'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('leg')}></div>
                                            <div id='translator-cunny-code-arona-leg2'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('leg')}></div>
                                            <div id='translator-cunny-code-arona-leg3'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('leg')}></div>
                                            <div id='translator-cunny-code-arona-leg4'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('leg')}></div>
                                            <div id='translator-cunny-code-arona-shoes'
                                                className='arona-action'
                                                onClick={() => this.handleCunnyCodeAronaTouch('shoe')}></div>
                                        </div>
                                        <div id='translator-cunny-code-arona-dialogue'
                                            className='dialogue no-highlight'></div>
                                    </div>
                                    : <></>}
                            </section>
                            {/* Translator Container */}
                            <section>
                                {/* Select */}
                                <div className='flex-center space-nicely space-bottom'>
                                    {/* Select From */}
                                    <Select id='translator-translate-from'
                                        className='select-match'
                                        value={this.state.from}
                                        defaultValue={optionsTranslateFrom[0]['options'][0]}
                                        onChange={this.handleFrom}
                                        options={optionsTranslateFrom}
                                        formatGroupLabel={this.props.formatGroupLabel}
                                        components={{
                                            GroupHeading: this.props.selectHideGroupHeading,
                                            MenuList: this.props.selectHideGroupMenuList
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                ...this.props.selectTheme
                                            }
                                        })}/>
                                    <button className='button-match inverse'
                                        aria-label='Swap'
                                        onClick={this.handleSwap}>
                                        <IconContext.Provider value={{ size: this.props.smallIcon, className: 'global-class-name' }}>
                                            <BsArrowLeftRight/>
                                        </IconContext.Provider>
                                    </button>
                                    {/* Select To */}
                                    <Select id='translator-translate-to'
                                        className='select-match'
                                        value={this.state.to}
                                        defaultValue={optionsTranslateTo[0]['options'][0]}
                                        onChange={this.handleTo}
                                        options={optionsTranslateTo}
                                        formatGroupLabel={this.props.formatGroupLabel}
                                        components={{
                                            GroupHeading: this.props.selectHideGroupHeading,
                                            MenuList: this.props.selectHideGroupMenuList
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                ...this.props.selectTheme
                                            }
                                        })}/>
                                </div>
                                {/* Display */}
                                <div className='flex-center column gap small-gap'>
                                    <div className='cut-scrollbar-corner-part-1 textarea'>
                                        <textarea className='cut-scrollbar-corner-part-2 textarea'
                                            name='translator-textarea-input'
                                            onChange={this.handleChange}
                                            value={this.state.input}></textarea>
                                    </div>
                                    <div id='translator-preview-cut-corner'
                                        className='cut-scrollbar-corner-part-1 p'>
                                        <p id='translator-translated-text'
                                            className='text-animation cut-scrollbar-corner-part-2 p flex-center only-justify-content'
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(this.state.converted)
                                            }}>
                                        </p>
                                    </div>
                                </div>
                                {/* Buttons */}
                                <div className='element-ends float relative bottom'
                                    style={{ width: 'unset' }}>
                                    <div className='flex-center row'>
                                        {/* Clipboard */}
                                        <button className='button-match fadded inversed'
                                            aria-label='Copy'
                                            onClick={() => this.handleCopy()}>
                                            <IconContext.Provider value={{ className: 'global-class-name' }}>
                                                <FaRegPaste/>
                                            </IconContext.Provider>
                                        </button>
                                        {/* Talk */}
                                        <button className='button-match fadded inversed'
                                            aria-label='Read'
                                            onClick={() => this.handleTalk()}>
                                            <IconContext.Provider value={{ className: 'global-class-name' }}>
                                                <FaVolumeHigh/>
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                    {/* Random Sentence */}
                                    <button className='button-match fadded'
                                        onClick={this.handleRandSentence}>Random sentence</button>
                                </div>
                            </section>
                        </section>
                        {/* Replace Popout */}
                        <Draggable cancel='input, button'
                            position={{
                                x: this.props.defaultProps.popouts.replace.position.x,
                                y: this.props.defaultProps.popouts.replace.position.y
                            }}
                            onStop={(event, data) => {
                                this.props.defaultProps.updatePosition('translator', 'utility', data.x, data.y, 'popout', 'replace');
                            }}
                            bounds={this.props.defaultProps.calculateBounds('translator-widget', 'replace-popout')}>
                            <section id='replace-popout'
                                className='popout'>
                                <section id='replace-popout-animation'
                                    className='popout-animation'>
                                    <section className='flex-center column space-nicely space-all length-long'>
                                        <section className='flex-center'>
                                            <input className='input-typable all-side input-button-input'
                                                name='translator-input-popout-replace-from'
                                                type='text'
                                                onChange={this.handleReplaceFrom}></input>
                                            <IconContext.Provider value={{ className: 'global-class-name' }}>
                                                <FaArrowRightLong/>
                                            </IconContext.Provider>
                                            <input className='input-typable all-side input-button-input'
                                                name='translator-input-popout-replace-to'
                                                type='text'
                                                onChange={this.handleReplaceTo}></input>
                                        </section>
                                        <section className='space-nicely space-top length-medium'>
                                            <button className='button-match option opt-long'
                                                onClick={this.handleSave}>Save</button>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Reverse Popout */}
                        <Draggable cancel='input, button'
                            position={{
                                x: this.props.defaultProps.popouts.reverse.position.x,
                                y: this.props.defaultProps.popouts.reverse.position.y
                            }}
                            onStop={(event, data) => {
                                this.props.defaultProps.updatePosition('translator', 'utility', data.x, data.y, 'popout', 'reverse');
                            }}
                            bounds={this.props.defaultProps.calculateBounds('translator-widget', 'reverse-popout')}>
                            <section id='reverse-popout'
                                className='popout'>
                                <section id='reverse-popout-animation'
                                    className='popout-animation'>
                                    <section className='grid space-nicely space-all length-long'>
                                        <button className='button-match option opt-long'
                                            onClick={this.handleSave}>Save</button>
                                        <section className='button-set-two flex-center row gap'>
                                            <button id='reverse-popout-button-reverseWord'
                                                className='button-match option disabled-option'
                                                onClick={() => this.handlePressableButton('reverseWord', 'reverse')}>Word</button>
                                            <button id='reverse-popout-button-reverseSentence'
                                                className='button-match option disabled-option'
                                                onClick={() => this.handlePressableButton('reverseSentence', 'reverse')}>Sentence</button>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Case Transform Popout */}
                        <Draggable cancel='input, button'
                            position={{
                                x: this.props.defaultProps.popouts.casetransform.position.x,
                                y: this.props.defaultProps.popouts.casetransform.position.y
                            }}
                            onStop={(event, data) => {
                                this.props.defaultProps.updatePosition('translator', 'utility', data.x, data.y, 'popout', 'casetransform');
                            }}
                            bounds={this.props.defaultProps.calculateBounds('translator-widget', 'caseTransform-popout')}>
                            <section id='caseTransform-popout'
                                className='popout'>
                                <section id='caseTransform-popout-animation'
                                    className='popout-animation'>
                                    <section className='grid space-nicely space-all length-long'>
                                        <button className='button-match option opt-long'
                                            onClick={this.handleSave}>Save</button>
                                        <section className='flex-center row gap'>
                                            <button id='caseTransform-popout-button-caseTransformLower'
                                                className='button-match option opt-small disabled-option'
                                                onClick={() => this.handlePressableButton('caseTransformLower', 'caseTransform')}>Lower</button>
                                            <button id='caseTransform-popout-button-caseTransformUpper'
                                                className='button-match option opt-small disabled-option'
                                                onClick={() => this.handlePressableButton('caseTransformUpper', 'caseTransform')}>Upper</button>
                                            <button id='caseTransform-popout-button-caseTransformCapitalize'
                                                className='button-match option opt-small disabled-option'
                                                onClick={() => this.handlePressableButton('caseTransformCapitalize', 'caseTransform')}>Capitalize</button>
                                        </section>
                                        <section className='flex-center row gap'>
                                            <button id='caseTransform-popout-button-caseTransformAlternate'
                                                className='button-match option opt-small disabled-option'
                                                onClick={() => this.handlePressableButton('caseTransformAlternate', 'caseTransform')}>Alternate</button>
                                            <button id='caseTransform-popout-button-caseTransformInverse'
                                                className='button-match option opt-small disabled-option'
                                                onClick={() => this.handlePressableButton('caseTransformInverse', 'caseTransform')}>Inverse</button>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? (this.state.author === 'Me')
                                ? <span className='font smaller transparent-normal author-name'>Created by {this.state.author}</span>
                                : <div className='author-name'>
                                    <span className='font smaller transparent-normal'>
                                        Created by
                                        <a className='font transparent-normal link-match'
                                            href={this.state.authorLink}
                                            target='_blank'
                                            rel='noreferrer'> {this.state.author}</a>
                                    </span>
                                </div>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetTranslator);