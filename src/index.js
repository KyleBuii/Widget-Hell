import './index.scss';
import { React, Component } from 'react';
import ReactDOM from 'react-dom/client';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegTrashCan, FaRegCircleQuestion, FaArrowRightFromBracket
    , FaArrowRightLong, FaRegPaste } from 'react-icons/fa6';
import { BsArrowLeftRight, BsPlusSlashMinus } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';
import { BiExpand } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import $ from 'jquery';
import { evaluate, round } from 'mathjs';
// import { CookiesProvider, useCookies } from 'react-cookie';
import sanitizeHtml from 'sanitize-html';
import Switch from 'react-switch';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
/// Games
import SnakeGame from './Games/Snake.js';

//////////////////// Variables ////////////////////
const smallIcon = "0.88em";
const medIcon = "4em";
const largeIcon = "5em";
const zIndexDefault = 2;
const zIndexDrag = 5;
const colorRange = 200;
const widgetsArray = ["settings-box-animation"];
const animations = ["spin", "flip", "hinge"];
const languages = ["Afrikaans", "af", "Albanian", "sq", "Amharic", "am", "Arabic", "ar", "Armenian", "hy", "Assamese", "as", "Azerbaijani (Latin)", "az", "Bangla", "bn", "Bashkir", "ba", "Basque", "eu", "Bosnian (Latin)", "bs", "Bulgarian", "bg", "Cantonese (Traditional)", "yue", "Catalan", "ca", "Chinese (Literary)", "lzh", "Chinese Simplified", "zh-Hans", "Chinese Traditional", "zh-Hant", "Croatian", "hr", "Czech", "cs", "Danish", "da", "Dari", "prs", "Divehi", "dv", "Dutch", "nl", "English", "en", "Estonian", "et", "Faroese", "fo", "Fijian", "fj", "Filipino", "fil", "Finnish", "fi", "French", "fr", "French (Canada)", "fr-ca", "Galician", "gl", "Georgian", "ka", "German", "de", "Greek", "el", "Gujarati", "gu", "Haitian Creole", "ht", "Hebrew", "he", "Hindi", "hi", "Hmong Daw (Latin)", "mww", "Hungarian", "hu", "Icelandic", "is", "Indonesian", "id", "Inuinnaqtun", "ikt", "Inuktitut", "iu", "Inuktitut (Latin)", "iu-Latn", "Irish", "ga", "Italian", "it", "Japanese", "ja", "Kannada", "kn", "Kazakh", "kk", "Khmer", "km", "Klingon", "tlh-Latn", "Klingon (plqaD)", "tlh-Piqd", "Korean", "ko", "Kurdish (Central)", "ku", "Kurdish (Northern)", "kmr", "Kyrgyz (Cyrillic)", "ky", "Lao", "lo", "Latvian", "lv", "Lithuanian", "lt", "Macedonian", "mk", "Malagasy", "mg", "Malay (Latin)", "ms", "Malayalam", "ml", "Maltese", "mt", "Maori", "mi", "Marathi", "mr", "Mongolian (Cyrillic)", "mn-Cyrl", "Mongolian (Traditional)", "mn-Mong", "Myanmar", "my", "Nepali", "ne", "Norwegian", "nb", "Odia", "or", "Pashto", "ps", "Persian", "fa", "Polish", "pl", "Portuguese (Brazil)", "pt", "Portuguese (Portugal)", "pt-pt", "Punjabi", "pa", "Queretaro Otomi", "otq", "Romanian", "ro", "Russian", "ru", "Samoan (Latin)", "sm", "Serbian (Cyrillic)", "sr-Cyrl", "Serbian (Latin)", "sr-Latn", "Slovak", "sk", "Slovenian", "sl", "Somali (Arabic)", "so", "Spanish", "es", "Swahili (Latin)", "sw", "Swedish", "sv", "Tahitian", "ty", "Tamil", "ta", "Tatar (Latin)", "tt", "Telugu", "te", "Thai", "th", "Tibetan", "bo", "Tigrinya", "ti", "Tongan", "to", "Turkish", "tr", "Turkmen (Latin)", "tk", "Ukrainian", "uk", "Upper Sorbian", "hsb", "Urdu", "ur", "Uyghur (Arabic)", "ug", "Uzbek (Latin)", "uz", "Vietnamese", "vi", "Welsh", "cy", "Yucatec Maya", "yua", "Zulu", "zu"];
const quotes = [
    {
        qte: "You all have a little bit of 'I want to save the world' in you, that's why you're here, in college. I want you to know that it's okay if you only save one person, and it's okay if that person is you."
        , au: "Some college professor"
    },
    {
        qte: "Your direction is more important than your speed."
        , au: "Richard L. Evans"
    },
    {
        qte: "All things are difficult before they are easy."
        , au: "Thomas Fuller"
    },
    {
        qte: "Your first workout will be bad. Your first podcast will be bad. Your first speech will be bad. Your first video will be bad. Your first ANYTHING will be bad. But you can't make your 100th without making your first."
        , au: ""
    }, 
    {
        qte: "If you are depressed, you are living in the past. If you are anxious, you are living in the future. If you are at peace, you are living in the present."
        , au: "Lao Tzu"
    },
    {
        qte: "Accept both compliments and criticism. It takes both sun and rain for a flower to grow."
        , au: ""
    },
    {
        qte: "Every day is an opportunity to improve, even if it is only by 1%. It's not about being invincible, it's about being unstoppable."
        , au: "改善 (Kaizen)"
    },
    {
        qte: "Start where you are. Use what you have. Do what you can."
        , au: "Arthur Ashe"
    },
    {
        qte: "Some days, it's easier. Other days, it's harder. Be it easy or hard, the only way to get there... is to start."
        , au: ""
    },
    {
        qte: "Never be a prisoner of your past. It was a lesson, not a life sentence."
        , au: ""
    },
    {
        qte: "Just because it's taking time, doesn't mean it's not happening."
        , au: ""
    },
    {
        qte: "If you aren't willing to look like a foolish beginner, you'll never become a graceful master. Embarrassment is the cost of entry."
        , au: ""
    },
    {
        qte: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time."
        , au: "Thomas Edison"
    },
    {
        qte: "Was it a bad day? Or was it a bad five minutes that you milked all day?"
        , au: ""
    },
    {
        qte: "Sometimes it takes ten years to get that one year that changes your life."
        , au: ""
    }
];
const sentences = [
    "Curse you Perry the Platypus."
    , "My mum (82F) told me (12M) to do the dishes (16) but I (12M) was too busy playing Fortnite (3 kills) so I (12M) grabbed my controller (DualShock 4) and threw it at her (138kph). She fucking died, and I (12M) went to prison (18 years). While in prison I (12M) incited several riots (3) and assumed leadership of a gang responsible for smuggling drugs (cocaine) into the country. I (12M) also ordered the assassination of several celebrities (Michael Jackson, Elvis Presley and Jeffrey Epstein) and planned a terrorist attack (9/11)."
    , "So I (74M) was recently hit by a car (2014 Honda) and died. My wife (5F) organized me a funeral (cost $2747) without asking me (74M) at all. I (74M) was unable to make it because I (74M) was dead (17 days). At the funeral I heard my dad (15M) and other family members talking about how they wish I could be there and now I feel bad for not showing up."
    , "I think fortnite should add a pregnant female skin. Every kill she gets she slowly gives birth. When in water blood comes out. At 10 kills she gives birth and the baby can be your pet."
    , "PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT"    
    , 'Twitch should ban the term "live-streaming." It’s offensive to dead people. My great grandparents are dead and I would like to show them some respect and have twitch ban the term “live-streaming”. It’s a slur used against dead people.'
    , 'I, an atheist, accidentally said “oh my g*d” instead of “oh my science”'
    , "Darkness blacker than black and darker than dark, I beseech thee, combine with my deep crimson. The time of awakening cometh. Justice, fallen upon the infallible boundary, appear now as an intangible distortions! I desire for my torrent of power a destructive force: a destructive force without equal! Return all creation to cinders, and come frome the abyss! Explosion!"    
    , "Oh, blackness shrouded in light, Frenzied blaze clad in night, In the name of the crimson demons, let the collapse of thine origin manifest. Summon before me the root of thy power hidden within the lands of the kingdom of demise! Explosion!"
    , "Crimson-black blaze, king of myriad worlds, though I promulgate the laws of nature, I am the alias of destruction incarnate in accordance with the principles of all creation. Let the hammer of eternity descend unto me! Explosion!"    
    , "O crucible which melts my soul, scream forth from the depths of the abyss and engulf my enemies in a crimson wave! Pierce trough, EXPLOSION!"    
    , 'If you ask Rick Astley for a copy of the movie "UP", he cannot give you it as he can never give you up. But, by doing that, he is letting you down, and thus, is creating something known as the Astley Paradox.'
    , "Reddit should rename 'share' to 'spreddit', 'delete' to 'shreddit' and 'karma' to 'creddit'. Yet they haven't. I don't geddit."
    , "The tower of rebellion creeps upon man’s world… The unspoken faith displayed before me… The time has come! Now, awaken from your slumber, and by my madness, be wrought! Strike forth, Explosion!"    
    , "Glasses are really versatile. First, you can have glasses-wearing girls take them off and suddenly become beautiful, or have girls wearing glasses flashing those cute grins, or have girls stealing the protagonist's glasses and putting them on like, \"Haha, got your glasses!\" That's just way too cute! Also, boys with glasses! I really like when their glasses have that suspicious looking gleam, and it's amazing how it can look really cool or just be a joke. I really like how it can fulfill all those abstract needs. Being able to switch up the styles and colors of glasses based on your mood is a lot of fun too! It's actually so much fun! You have those half rim glasses, or the thick frame glasses, everything! It's like you're enjoying all these kinds of glasses at a buffet. I really want Luna to try some on or Marine to try some on to replace her eyepatch. We really need glasses to become a thing in hololive and start selling them for HoloComi. Don't. You. Think. We. Really. Need. To. Officially. Give. Everyone. Glasses?"
    , "Eggs, Bacon, Grist, Sausage. The cockroaches in your bedroom held you hostage."
];
const punctuation = '\\[\\!\\"\\#\\$\\%\\&\\\'\\(\\)'
    + '\\*\\+\\,\\\\\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\['
    + '\\]\\^\\_\\`\\{\\|\\}\\~\\]';
const matchAll = new RegExp("\\s*(\\.{3}|\\w+\\-\\w+|\\w+'(?:\\w+)?|\\w+|[" + punctuation + "])");
const uwuDictionary = {
    "this": ["dis"],
    "the": ["da", "tha"],
    "that": ["dat"],
    "my": ["mwie"],
    "have": ["habe", "habve"],
    "epic": ["ebic"],
    "worse": ["wose"],
    "you": ["uwu", "u"],
    "of": ["ob"]
};
const uwuEmoticons = ["X3", ":3", "owo", "uwu", ">3<", "o3o"
    , "｡◕‿◕｡", "(o´ω｀o)", "(´･ω･`)"];
const brailleDictionary = {
    ' ': '⠀',
    '_': '⠸',
    '-': '⠤',
    ',': '⠠',
    ';': '⠰',
    ':': '⠱',
    '!': '⠮',
    '?': '⠹',
    '.': '⠨',
    '(': '⠷',
    '[': '⠪',
    '@': '⠈',
    '*': '⠡',
    '/': '⠌',
    "'": '⠄',
    '"': '⠐',
    '\\': '⠳',
    '&': '⠯',
    '%': '⠩',
    '^': '⠘',
    '+': '⠬',
    '<': '⠣',
    '>': '⠜',
    '$': '⠫',
    '0': '⠴',
    '1': '⠂',
    '2': '⠆',
    '3': '⠒',
    '4': '⠲',
    '5': '⠢',
    '6': '⠖',
    '7': '⠶',
    '8': '⠦',
    '9': '⠔',
    'a': '⠁',
    'b': '⠃',
    'c': '⠉',
    'd': '⠙',
    'e': '⠑',
    'f': '⠋',
    'g': '⠛',
    'h': '⠓',
    'i': '⠊',
    'j': '⠚',
    'k': '⠅',
    'l': '⠇',
    'm': '⠍',
    'n': '⠝',
    'o': '⠕',
    'p': '⠏',
    'q': '⠟',
    'r': '⠗',
    's': '⠎',
    't': '⠞',
    'u': '⠥',
    'v': '⠧',
    'w': '⠺',
    'x': '⠭',
    'z': '⠵',
    ']': '⠻',
    '#': '⠼',
    'y': '⠽',
    ')': '⠾',
    '=': '⠿'
};
const brailleFromDictionary = {
    ' ': ' ', 
    '⠀': ' ',
    '⠸': '_',
    '⠤': '-',
    '⠠': ',',
    '⠰': ';',
    '⠱': ':',
    '⠮': '!',
    '⠹': '?',
    '⠨': '.',
    '⠷': '(',
    '⠪': '[',
    '⠈': '@',
    '⠡': '*',
    '⠌': '/',
    '⠄': "'",
    '⠐': '"',
    '⠳': '\\',
    '⠯': '&',
    '⠩': '%',
    '⠘': '^',
    '⠬': '+',
    '⠣': '<',
    '⠜': '>',
    '⠫': '$',
    '⠴': '0',
    '⠂': '1',
    '⠆': '2',
    '⠒': '3',
    '⠲': '4',
    '⠢': '5',
    '⠖': '6',
    '⠶': '7',
    '⠦': '8',
    '⠔': '9',
    '⠁': 'a',
    '⠃': 'b',
    '⠉': 'c',
    '⠙': 'd',
    '⠑': 'e',
    '⠋': 'f',
    '⠛': 'g',
    '⠓': 'h',
    '⠊': 'i',
    '⠚': 'j',
    '⠅': 'k',
    '⠇': 'l',
    '⠍': 'm',
    '⠝': 'n',
    '⠕': 'o',
    '⠏': 'p',
    '⠟': 'q',
    '⠗': 'r',
    '⠎': 's',
    '⠞': 't',
    '⠥': 'u',
    '⠧': 'v',
    '⠺': 'w',
    '⠭': 'x',
    '⠵': 'z',
    '⠻': ']',
    '⠼': '#',
    '⠽': 'y',
    '⠾': ')',
    '⠿': '='
};
const emojifyDictionary = {
    "actually": ["&#x1F913;&#x261D;&#xFE0F;"],
    "hey": ["&#x1F44B;"],
        "hello": ["&#x1F44B;"],
    "you": ["&#x1F448;"],
        "your": ["&#x1F448;"],
    "like": ["&#x1F44D;"],
        "liked": ["&#x1F44D;"],
    "money": ["&#x1F4B0;"],
        "rich": ["&#x1F4B0;"],
    "run": ["&#x1F3C3;"],
        "running": ["&#x1F3C3;"],
        "ran": ["&#x1F3C3;"],
    "house": ["&#x1F3E0;", "&#x1F3E1;"],
        "home": ["&#x1F3E0;", "&#x1F3E1;"],
    "just": ["&#x261D;&#xFE0F;"],
    "phone": ["&#x1F4F1;"],
};

//////////////////// Functions ////////////////////
function randColor(){
    const r = document.querySelector(":root");
    const randColorOpacity = Math.floor(Math.random() * colorRange)
        + "," + Math.floor(Math.random() * colorRange) 
        + "," + Math.floor(Math.random() * colorRange);
    const randColor = "rgb(" + randColorOpacity + ")";
    r.style.setProperty("--randColor", randColor);
    r.style.setProperty("--randColorOpacity", randColorOpacity);
};

function dragStart(what){
    switch(what){
        case "settings":
            document.getElementById(what + "-box-draggable").style.visibility = "visible";
            document.getElementById(what + "-box").style.opacity = "0.5";
            break;
        default:
            document.getElementById(what + "-box-draggable").style.visibility = "visible";
            document.getElementById(what + "-box").style.opacity = "0.5";
            document.getElementById(what + "-box").style.zIndex = zIndexDrag;
            break;
    }
};
function dragStop(what){
    switch(what){
        case "settings":
            document.getElementById(what + "-box-draggable").style.visibility = "hidden";
            document.getElementById(what + "-box").style.opacity = "1";
            break;
        default:
            document.getElementById(what + "-box-draggable").style.visibility = "hidden";
            document.getElementById(what + "-box").style.opacity = "1";
            document.getElementById(what + "-box").style.zIndex = zIndexDefault;
            break;
    }
};

function sortSelect(what){
    const options = $(what + ' option');
    const arrOptions = options
        .map(function(_, o){
            return{
                text: $(o).text(),
                value: $(o).val()
            };
        }).get();
        arrOptions.sort(function(o1, o2){
            return o1.text > o2.text ? 1
                : o1.text < o2.text ? -1
                : 0;
    });
    options.each(function(i, o){
        $(o).text(arrOptions[i].text);
        $(o).val(arrOptions[i].value);
    });
};

function mergePunctuation(arr){
    if(arr.length <= 1){
        return arr;
    };
    for(let i = 1; i < arr.length; i++){
        if(/^[^\w("$]+/.test(arr[i])){
            arr[i-1] += arr[i];
            arr.splice(i, 1);
        }else if(/^[($]+/.test(arr[i])){
            arr[i] += arr[i+1];
            arr.splice(i+1, 1);
        };
    };
    return arr;
};

function grep(arr, filter){
    var result = [];
    if(arr.length <= 1){
        return arr;
    };
    for(let i = 0; i < arr.length; i++){
        const e = arr[i]||"";
        if(filter ? filter(e) : e){
            result.push(e);
        };
    };
    return result;
};

function randSentence(){
    return sentences[Math.floor(Math.random() * sentences.length)];
};

function copyToClipboard(what){
    if(what !== ""){
        navigator.clipboard.writeText(what);
    };
};

//////////////////// Widgets ////////////////////
class SettingWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            showHideWidgets: false,     /// Widgets
            quote: false,               
            translator: false,
            googleTranslator: false,
            calculator: false,
            weather: false,
            snake: false,
            settings: false,            /// Settings
            screenDimmer: false,
            screenDimmerValue: "",
            customBorder: false,
            customBorderValue: ""
        };
        this.handlePressableBtn = this.handlePressableBtn.bind(this);
        this.handleToggleableBtn = this.handleToggleableBtn.bind(this);
        this.handleSlider = this.handleSlider.bind(this);
    };
    handleTrick(){
        if(widgetsArray.length !== 0){
            const randWidget = Math.floor(Math.random() * widgetsArray.length);
            const randAnimation = Math.floor(Math.random() * animations.length);
            const e = document.getElementById(widgetsArray[randWidget]);
            e.style.animation = "none";
            window.requestAnimationFrame(function(){
                e.style.animation = animations[randAnimation] + " 2s";
            });
        };
    };
    /// Remove element at index "i" where order doesn't matter
    unorderedRemove(arr, i){
        if(i <= 0 || i >= arr.length){
            return;
        };
        if(i < arr.length-1){
            arr[i] = arr[arr.length-1];
        };
        arr.length -= 1;
    };
    /// Handles all pressable buttons (opacity: 0.5 on click)
    handlePressableBtn(what){
        const btn = document.getElementById("show-hide-widgets-popout-btn-" + what);
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
                }else{
                    this.setState({
                        showHideWidgets: false
                    });
                    btnShowHideWidgets.style.opacity = "0.5";
                    showHideWidgetsPopout.style.visibility = "hidden";
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
                }else{
                    this.setState({
                        settings: false
                    });
                    btnSettings.style.opacity = "0.5";
                    settingsPopout.style.visibility = "hidden";
                };
                break;
            case "advanced":
                break;
            case "quote":
                this.props.showHide("quote");
                if(this.state.quote === false){
                    this.setState({
                        quote: true
                    }, () => {
                        this.handleCustomBorder("quote");   
                    });
                    btn.style.opacity = "1";
                    widgetsArray.push("quote-box-animation");
                }else{
                    this.setState({
                        quote: false
                    });
                    btn.style.opacity = "0.5";
                    const indexQuote = widgetsArray.indexOf("quote-box-animation");
                    this.unorderedRemove(widgetsArray, indexQuote);
                };
                break;
            case "translator":
                this.props.showHide("translator");
                if(this.state.translator === false){
                    this.setState({
                        translator: true
                    }, () => {
                        this.handleCustomBorder("translator");
                    });
                    btn.style.opacity = "1";
                    widgetsArray.push("translator-box-animation");
                }else{
                    this.setState({
                        translator: false
                    });
                    btn.style.opacity = "0.5";
                    const indexTranslator = widgetsArray.indexOf("translator-box-animation");
                    this.unorderedRemove(widgetsArray, indexTranslator);
                };
                break;
            case "google-translator":
                this.props.showHide("googleTranslator");
                if(this.state.googleTranslator === false){
                    this.setState({
                        googleTranslator: true
                    }, () => {
                        this.handleCustomBorder("google-translator");
                    });
                    btn.style.opacity = "1";
                    widgetsArray.push("google-translator-box-animation");
                }else{
                    this.setState({
                        googleTranslator: false
                    });
                    btn.style.opacity = "0.5";
                    const indexGoogleTranslator = widgetsArray.indexOf("google-translator-box-animation");
                    this.unorderedRemove(widgetsArray, indexGoogleTranslator);
                };
                break;
            case "calculator":
                this.props.showHide("calculator");
                if(this.state.calculator === false){
                    this.setState({
                        calculator: true
                    }, () => {
                        this.handleCustomBorder("calculator");
                    });
                    btn.style.opacity = "1";
                    widgetsArray.push("calculator-box-animation");
                }else{
                    this.setState({
                        calculator: false
                    });
                    btn.style.opacity = "0.5";
                    const indexCalculator = widgetsArray.indexOf("calculator-box-animation");
                    this.unorderedRemove(widgetsArray, indexCalculator);
                };
                break;
            case "weather":
                this.props.showHide("weather");
                if(this.state.weather === false){
                    this.setState({
                        weather: true
                    }, () => {
                        this.handleCustomBorder("weather");
                    });
                    btn.style.opacity = "1";
                    widgetsArray.push("weather-box-animation");
                }else{
                    this.setState({
                        weather: false
                    });
                    btn.style.opacity = "0.5";
                    const indexWeather = widgetsArray.indexOf("weather-box-animation");
                    this.unorderedRemove(widgetsArray, indexWeather);
                };
                break;
            case "snake":
                this.props.showHide("snake");
                if(this.state.snake === false){
                    this.setState({
                        snake: true
                    }, () => {
                        this.handleCustomBorder("snake");
                    });
                    btn.style.opacity = "1";
                    widgetsArray.push("snake-box-animation");
                }else{
                    this.setState({
                        snake: false
                    });
                    btn.style.opacity = "0.5";
                    const indexSnake = widgetsArray.indexOf("snake-box-animation");
                    this.unorderedRemove(widgetsArray, indexSnake);
                };
                break;    
            default:
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
            case "btn-custom-border":
                this.setState({
                    customBorder: value
                }, () => {
                    this.handleCustomBorder();
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
    handleSelect(event, what){
        switch(what){
            case "custom-border":
                this.setState({
                    customBorderValue: event.target.value
                }, () => {
                    this.handleCustomBorder();   
                });
                break;
            default:
                break;
        };
    };
    handleCustomBorder(what){
        var widget, popout, combine;
        if(what !== undefined){
            widget = document.getElementById(what + "-box-animation");
            popout = widget.querySelectorAll(".popout");
            combine = [widget, ...popout];
        }else{
            widget = document.querySelectorAll(".widget-animation");
            popout = document.querySelectorAll(".popout");
            combine = [...widget, ...popout];
        };
        if(this.state.customBorder === true){
            switch(this.state.customBorderValue){
                case "diagonal":
                    for(const element of combine){
                        element.style.border = "10px solid var(--randColor)";
                        element.style.borderImage = "repeating-linear-gradient(45deg, transparent, transparent 5px, var(--randColor) 6px, var(--randColor) 15px, transparent 16px, transparent 20px) 20/1rem";
                    };
                    break;
                case "dashed":
                    for(const element of combine){
                        element.style.border = "5px dashed var(--randColor)";
                    };
                    break;
                default:
                    break;
            };
        }else{
            for(const element of combine){
                element.style.border = "1px solid var(--randColor)";
                element.style.borderImage = "none"
            };
        };
    };
    componentDidMount(){
        sortSelect("#settings-popout-design-custom-border-select");
        this.setState({
            customBorderValue: "dashed"
        });
        $("#settings-popout-design-custom-border-select").val("dashed");
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("settings")}
                onStop={() => dragStop("settings")}
                cancel="button, span, p, section"
                bounds="parent">
                <div id="settings-box"
                    className="widget">
                    <div id="settings-box-animation"
                        className="widget-animation">
                        <span id="settings-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: "3em", className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <section className="option">
                            <button id="settings-btn-show-hide-widgets"
                                className="option-item btn-match option opt-long disabled-option"
                                onClick={() => this.handlePressableBtn("showHideWidgets")}>Show/Hide Widgets</button>
                            <button id="settings-btn-settings"
                                className="option-item btn-match option opt-long disabled-option"
                                onClick={() => this.handlePressableBtn("settings")}>Settings</button>
                            <section className="option-item">
                                <button className="btn-match option opt-medium"
                                    onClick={this.handleTrick}>Do a trick!</button>
                            </section>
                        </section>
                        {/* Show/Hide Widgets Popout */}
                        <Draggable
                            cancel="button, Tabs, TabList, Tab, TabPanel"
                            defaultPosition={{x: 30, y: -55}}
                            bounds={{top: -200, left: -250, right: 200, bottom: 0}}>
                            <section id="show-hide-widgets-popout"
                                className="popout">
                                <Tabs defaultIndex={0}>
                                    <TabList>
                                        <Tab>Utility</Tab>
                                        <Tab>Games</Tab>
                                    </TabList>
                                    {/* Utility */}
                                    <TabPanel>
                                        <section className="option space-nicely all">
                                            <section className="option-item">
                                                <button id="show-hide-widgets-popout-btn-quote"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("quote")}>Quote</button>
                                                <button id="show-hide-widgets-popout-btn-translator"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("translator")}>Translator</button>
                                            </section>
                                            <section className="option-item">
                                                <button id="show-hide-widgets-popout-btn-google-translator"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("google-translator")}>Google Translator</button>
                                                <button id="show-hide-widgets-popout-btn-calculator"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("calculator")}>Calculator</button>
                                            </section>
                                            <section className="option-item">
                                                <button id="show-hide-widgets-popout-btn-weather"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("weather")}>Weather</button>
                                            </section>
                                        </section>
                                    </TabPanel>
                                    {/* Games */}
                                    <TabPanel>
                                        <section className="option space-nicely all">
                                            <section className="option-item">
                                                <button id="show-hide-widgets-popout-btn-snake"
                                                    className="btn-match option opt-medium disabled-option"
                                                    onClick={() => this.handlePressableBtn("snake")}>Snake</button>
                                            </section>
                                        </section>
                                    </TabPanel>
                                </Tabs>
                            </section>
                        </Draggable>
                        {/* Settings Popout */}
                        <Draggable
                            cancel="span, .toggleable, .slider, select"
                            defaultPosition={{x: 120, y: -25}}
                            bounds={{top: -200, left: -250, right: 200, bottom: 0}}>
                            <section id="settings-popout"
                                className="popout">
                                <section className="option space-nicely all">
                                    {/* Display Settings */}
                                    <section className="section-group">
                                        <span className="font small when-elements-are-not-straight space-nicely bottom short">
                                            <b>Display</b>
                                        </span>
                                        <section className="option-item">
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
                                        <section className="option-item">
                                            <span className="font small">
                                                Custom Border
                                            </span>
                                            <Switch className="toggleable"
                                                checked={this.state.customBorder}
                                                onChange={(value) => this.handleToggleableBtn(value, "btn-custom-border")}
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
                                        <select id="settings-popout-design-custom-border-select"
                                            className="select-match space-nicely top medium"
                                            onChange={(event) => this.handleSelect(event, "custom-border")}
                                            disabled={!this.state.customBorder}
                                            defaultValue={"dashed"}>
                                            <option value="diagonal">Diagonal</option>
                                            <option value="dashed">Dashed</option>
                                        </select>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class QuoteWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentQuote: "",
            currentAuthor: ""
        };
        this.handleNewQuote = this.handleNewQuote.bind(this);
    };
    componentDidMount(){
        this.handleNewQuote();
    };
    handleNewQuote(){
        randColor();
        const randQuote = Math.floor(Math.random() * quotes.length);
        const randQuoteAuthor = (quotes[randQuote]["au"] === "") ? "Anon" : quotes[randQuote]["au"];
        this.setState({
            currentQuote: quotes[randQuote]["qte"],
            currentAuthor: randQuoteAuthor
        });
        /// Restart animations
        const quoteText = document.getElementById("quote");
        const quoteAuthor = document.getElementById("author");
        quoteText.style.animation = "none";
        quoteAuthor.style.animation = "none";
        window.requestAnimationFrame(function(){
            quoteText.style.animation = "fadeIn 2s";
            quoteAuthor.style.animation = "fadeIn 2s";
        });
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("quote")}
                onStop={() => dragStop("quote")}
                cancel="button, span, p"
                bounds="parent">
                <div id="quote-box"
                    className="widget">
                    <div id="quote-box-animation"
                        className="widget-animation">
                        <span id="quote-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="quote">
                            <span className="quote large">"</span>
                            <span id="quote-text"
                                className="font large normal">{this.state.currentQuote}</span>
                            <span className="quote large">"</span>
                        </div>
                        <p id="author"
                            className="author">- {this.state.currentAuthor}</p>
                        <div className="btn-ends">
                            <button className="btn-match fadded inverse"
                                onClick={() => copyToClipboard(this.state.currentQuote)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                            <button className="btn-match"
                                onClick={this.handleNewQuote}>New quote</button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class TranslatorWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            convert: "",
            converted: "",
            from: "",
            to: "",
            replaceFrom: "",
            replaceTo: "",
            reverseWord: false,
            reverseSentence: false,
            reverseEverything: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleReplaceFrom = this.handleReplaceFrom.bind(this);
        this.handleReplaceTo = this.handleReplaceTo.bind(this);
        this.handleRandSentence = this.handleRandSentence.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
        this.convertFromText();
        const translatedText = document.getElementById("translator-translated-text");
        if(translatedText.scrollHeight > translatedText.clientHeight){
            translatedText.scrollTop = translatedText.scrollHeight;
        }
    };
    /// Convert the "from" language to english
    convertFromText(){
        switch(this.state.from){
            /// Other languages
            case "pekofy":
                this.setState(prevState => ({
                    convert: prevState.input
                        .replace(/\s(peko)/ig, "")
                }));
                break;
            case "braille":
                this.setState(prevState => ({
                    convert: prevState.input
                        .toString()
                        .split("")
                        .map(letter => brailleFromDictionary[letter])
                        .join("")
                }));
                break;
            /// Encryption
            case "base64":
                if(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(this.state.input)){
                    this.setState(prevState => ({
                        convert: decodeURIComponent(escape(window.atob(prevState.input)))
                    }));
                };
                break;
            default:
                this.setState(prevState => ({
                    convert: prevState.input
                }));
                break;
        };
        this.convertToText();   
    };
    /// Convert english to the "to" language
    convertToText(){
        switch(this.state.to){
            /// Other languages
            case "pig-latin":
                this.setState(prevState => ({
                    converted: prevState.convert
                        .toString()
                        .toLowerCase()
                        .split(" ")
                        .map(curr => curr
                            .replace(/^[aioue]\w*/i, "$&way")
                            .replace(/(^[^aioue]+)(\w*)/i, "$2$1ay"))
                        .join(" ")
                }));
                break;
            case "pekofy":
                this.setState(prevState => ({
                    converted: prevState.convert
                        .replace(/[^.!?]$/i, "$& peko")
                        .replace(/[.]/ig, " peko.")
                        .replace(/[!]/ig, " peko!")
                        .replace(/[?]/ig, " peko?")
                }));
                break;
            case "uwu":
                const reUwuDictionary = new RegExp(Object.keys(uwuDictionary)
                    .map((key) => {
                        return "\\b" + key + "\\b";
                    })
                    .join("|"));
                this.setState(prevState => ({
                    converted: grep(prevState.convert
                        .toString()
                        .toLowerCase()
                        .split(matchAll))
                        .map((word) => {
                            return (/[?]+/.test(word)) ? word.replace(/[?]+/, "???")
                                : (/[!]+/.test(word)) ? word.replace(/[!]+/, "!!11")
                                : (reUwuDictionary.test(word)) ? word.replace(reUwuDictionary, uwuDictionary[word][Math.floor(Math.random() * uwuDictionary[word].length)])
                                : (/(l)\1/.test(word.substring(1, word.length))) ? word.replace(/(l)\1/, "ww")
                                : (/(r)\1/.test(word.substring(1, word.length))) ? word.replace(/(r)\1/, "ww")
                                : (/[l|r]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([l|r])(\w*)/, "$1w$3")
                                : (/[h]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([h])(\w*)/, "$1b$3")
                                : (/[f]/.test(word.substring(1, word.length-1))) ? word.replace(/(\w*)([f])(\w*)/, "$1b$3")
                                : (/^\d/.test(word)) ? word
                                : word.replace(/(?=\w{3,})^([^\Ww])(\w*)/, "$1w$2");
                        })
                }), () => {
                    this.setState(prevState => ({
                        converted: mergePunctuation(prevState.converted)
                    }));
                    /// Insert emoticon at random position
                    var randPosition;
                    const randEmoticon = Math.floor(Math.random() * uwuEmoticons.length);
                    if(this.state.converted.length > 4){
                        randPosition = Math.floor(Math.random() * (this.state.converted.length - 2) + 2);
                        this.setState(prevState => ({
                            converted: [...prevState.converted.slice(0, randPosition)
                                , uwuEmoticons[randEmoticon]
                                , ...prevState.converted.slice(randPosition)]
                                .join(" ")
                        }));
                    }else if(this.state.converted.length <= 4
                        && this.state.converted.length >= 2){
                        this.setState(prevState => ({
                            converted: prevState.converted
                                .join(" ")
                        }));
                    };
                });
                break;
            case "braille":
                this.setState(prevState => ({
                    converted: prevState.convert
                        .toString()
                        .toLowerCase()
                        .split("")
                        .map(letter => brailleDictionary[letter])
                        .join("")
                }));
                break;
            case "emojify":
                const reEmojifyDictionary = new RegExp(Object.keys(emojifyDictionary)
                    .map((key) => {
                        return "\\b" + key + "\\b";
                    })
                    .join("|"), "i");
                this.setState(prevState => ({
                    converted: mergePunctuation(grep(prevState.convert
                        .split(matchAll)
                        .map((word) => {
                            return (reEmojifyDictionary.test(word)) ? word.replace(reEmojifyDictionary, word + " " + emojifyDictionary[word.toLowerCase()][Math.floor(Math.random() * emojifyDictionary[word.toLowerCase()].length)]) : word;
                        })))
                        .join(" ")
                }), () => {
                    const clean = sanitizeHtml(this.state.converted, {
                        allowedTags: [],
                        allowedAttributes: {},
                        allowedIframeHostnames: []
                    });
                    document.getElementById("translator-translated-text").innerHTML = clean;
                });
                break;
            /// Encryption
            case "base64":
                this.setState(prevState => ({
                    converted: btoa(unescape(encodeURIComponent(prevState.convert)))
                }));
                break;
            /// Modify
            case "replace":
                this.setState(prevState => ({
                    converted: prevState.convert
                        .replace(this.state.replaceFrom, prevState.replaceTo)
                }));
                break;
            case "reverse":
                if(this.state.reverseWord === true && this.state.reverseSentence === true && this.state.reverseEverything === true){
                /// Reverse Word + Sentence + Everything
                    this.setState(prevState => ({
                        converted: mergePunctuation(prevState.convert
                            .split(/(?<=[.?!])\s*/)
                            .reverse()
                            .join(" ")
                            .split(/([.?!])\s*/)
                            .map(sentence => sentence
                                .split(" ")
                                .map(word => word
                                    .split("")
                                    .reverse()
                                    .join(""))
                                .reverse()
                                .join(" ")
                            ))
                            .join(" ")
                    }));
                }else if(this.state.reverseWord === true && this.state.reverseSentence === true){
                /// Reverse Word + Sentence
                    this.setState(prevState => ({
                        converted: mergePunctuation(prevState.convert
                            .split(/([.?!])\s*/)
                            .map(sentence => sentence
                                .split(" ")
                                .map(word => word
                                    .split("")
                                    .reverse()
                                    .join(""))
                                .reverse()
                                .join(" ")
                            ))
                            .join(" ")
                    }));
                }else if(this.state.reverseWord === true && this.state.reverseEverything === true){
                /// Reverse Word + Everything
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .split(/(?<=[.?!])\s*/)
                            .reverse()
                            .join(" ")
                            .split(/(\s|[^\w'])/g)
                            .map(function(word){
                                return word
                                    .split("")
                                    .reverse()
                                    .join("");
                            })
                            .join("")
                    }));
                }else if(this.state.reverseSentence === true && this.state.reverseEverything === true){
                /// Reverse Sentence + Everything
                    this.setState(prevState => ({
                        converted: mergePunctuation(prevState.convert
                            .split(/(?<=[.?!])\s*/)
                            .reverse()
                            .join(" ")
                            .split(/([.?!])\s*/)
                            .map(function(sentence){
                                return sentence
                                    .split(" ")
                                    .reverse()
                                    .join(" ")
                            }))
                            .join(" ")
                    }));
                }else if(this.state.reverseWord === true){
                /// Reverse Word
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .split(/(\s|[^\w'])/g)
                            .map(function(word){
                                return word
                                    .split("")
                                    .reverse()
                                    .join("");
                            })
                            .join("")
                    }));
                }else if(this.state.reverseSentence === true){
                /// Reverse Sentence
                    this.setState(prevState => ({
                        converted: mergePunctuation(prevState.convert
                            .split(/([.!?"])\s*/)
                            .map(function(sentence){
                                return sentence
                                    .split(" ")
                                    .reverse()
                                    .join(" ")
                            }))
                            .join(" ")
                    }), () => {
                        console.log(this.state.converted);   
                    });
                }else if(this.state.reverseEverything === true){
                /// Reverse Everything
                    this.setState(prevState => ({
                        converted: prevState.convert
                            .split(/(?<=[.?!])\s*/)
                            .reverse()
                            .join(" ")
                    }));
                }else{
                    this.setState(prevState => ({
                        converted: prevState.convert
                    }));   
                };
                break;
            default:
                this.setState(prevState => ({
                    converted: prevState.convert
                }));
                break;
        };
    };
    /// Handles "word-break" for unbreakable strings
    handleWordBreak(){
        const translatedText = document.getElementById("translator-translated-text");
        switch(this.state.to){
            case "braille":
            case "base64":
                translatedText.style.wordBreak = "break-all";
                break;
            default:
                translatedText.style.wordBreak = "normal";
                break;
        };
    };
    /// Handles the "from" language select
    handleFrom(event){
        this.setState({
            from: event.target.value
        }, () => {
            if(this.state.input !== ""){
                this.convertFromText();
            }
        });
    };
    /// Handles the "to" language select
    handleTo(event){
        this.setState({
            to: event.target.value,
        }, () => {
            this.handleWordBreak();
            if(this.state.input !== ""){
                this.convertToText();
            }
        });
        document.getElementById("replace-popout").style.visibility = (event.target.value === "replace") ? "visible" : "hidden";
        document.getElementById("reverse-popout").style.visibility = (event.target.value === "reverse") ? "visible" : "hidden";
    };
    /// Swaps "from" language and "to" language
    handleSwap(){
        if(this.state.from !== this.state.to){
            randColor();
            const prev = this.state.from;
            this.setState(prevState => ({
                from: prevState.to,
                to: prev
            }), () => {
                this.convertFromText();
            });
            const v1 = $("#translator-translate-from").val();
            const v2 = $("#translator-translate-to").val();
            $("#translator-translate-from").val(v2);
            $("#translator-translate-to").val(v1);
        };
    };
    /// Saves "converted" text into "input" field
    handleSave(){
        this.setState(prevState => ({
            input: prevState.converted,
            convert: prevState.converted
        }), () => {
            this.convertToText();
        });
    };
    /// Handles "replace" from "translator-translate-to"
    handleReplaceFrom(event){
        this.setState({
            replaceFrom: event.target.value
        }, () => {
            if(this.state.converted !== ""){
                this.convertToText();
            };
        });
    };
    handleReplaceTo(event){
        this.setState({
            replaceTo: event.target.value
        }, () => {
            if(this.state.converted !== ""){
                this.convertToText();
            };
        });
    };
    /// Handles all buttons that are pressable (opacity: 0.5 on click)
    handlePressableBtn(what, popout){
        let btn;
        if(popout === "replace"){
            btn = document.getElementById("replace-popout-btn-" + what);
        }else if(popout === "reverse"){
            btn = document.getElementById("reverse-popout-btn-" + what);
        };
        switch(what){
            case "reverse-word":
                if(this.state.reverseWord === false){
                    this.setState({
                        reverseWord: true
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        reverseWord: false
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "0.5";
                };
                break; 
            case "reverse-sentence":
                if(this.state.reverseSentence === false){
                    this.setState({
                        reverseSentence: true
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        reverseSentence: false
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "0.5";
                };
                break; 
            case "reverse-everything":
                if(this.state.reverseEverything === false){
                    this.setState({
                        reverseEverything: true
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "1";
                }else{
                    this.setState({
                        reverseEverything: false
                    }, () => {
                        this.convertToText();
                    });
                    btn.style.opacity = "0.5";
                };
                break;
            default:
                break;
        };
    };
    /// Handles random sentence button
    handleRandSentence(){
        this.setState({
            input: randSentence(),
            from: "en"
        }, () => {
            this.convertFromText();
            $("#translator-translate-from").val("en");
        });
    };
    componentDidMount(){
        randColor();
        /// Sort the "translate-to" optgroups options alphabetically
        sortSelect('#translator-translate-to #translate-to-other-languages');
        sortSelect('#translator-translate-to #translate-to-encryption');
        sortSelect('#translator-translate-to #translate-to-modify');
        /// Default values
        this.setState({
            from: "en",
            to: "en"
        });
        $("#translator-translate-from").val("en");
        $("#translator-translate-to").val("en");
        /// Duplicate selects from "translate-from" to "translate-to"
        $('#translator-translate-from #translate-from-languages option').clone().prependTo('#translate-to-languages');
        $('#translator-translate-from #translate-from-other-languages option').clone().prependTo('#translate-to-other-languages');
        $('#translator-translate-from #translate-from-encryption option').clone().prependTo('#translate-to-encryption');
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("translator")}
                onStop={() => dragStop("translator")}
                cancel="button, span, p, textarea, select, section"
                bounds="parent">
                <div id="translator-box"
                    className="widget">
                    <div id="translator-box-animation"
                        className="widget-animation">
                        <span id="translator-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div className="flex-center space-nicely bottom">
                            <select id="translator-translate-from"
                                className="select-match"
                                defaultValue={"en"}
                                onChange={this.handleFrom}>
                                <optgroup label="Languages"
                                    id="translate-from-languages">
                                    <option value="en">English</option>
                                </optgroup>
                                <optgroup label="Other Languages"
                                    id="translate-from-other-languages">
                                    <option value="pekofy">Pekofy</option>
                                    <option value="braille">Braille</option>
                                </optgroup>
                                <optgroup label="Encryption"
                                    id="translate-from-encryption">
                                    <option value="base64">Base64</option>
                                </optgroup>
                            </select>
                            <button className="btn-match inverse"
                                onClick={this.handleSwap}>
                                <IconContext.Provider value={{ size: smallIcon, className: "global-class-name" }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            <select id="translator-translate-to"
                                className="select-match"
                                defaultValue={"english"}
                                onChange={this.handleTo}>
                                <optgroup label="Languages"
                                    id="translate-to-languages"></optgroup>
                                <optgroup label="Other Languages"
                                    id="translate-to-other-languages">
                                    <option value="pig-latin">Pig latin</option>
                                    <option value="uwu">UwU</option>
                                    <option value="emojify">Emojify</option>
                                </optgroup>
                                <optgroup label="Encryption"
                                    id="translate-to-encryption"></optgroup>
                                <optgroup label="Modify">
                                    <option value="replace">Replace</option>
                                    <option value="reverse">Reverse</option>
                                    {/* <option value="case-transform">Case Transform</option> */}
                                </optgroup>
                            </select>
                        </div>
                        {/* Replace Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 75, y: 0}}
                            bounds={{top: -126, left: -390, right: 425, bottom: 265}}>
                            <section id="replace-popout"
                                className="popout">
                                <section className="flex-center space-nicely top">
                                    <input className="input-typable all-side input-button-input"
                                        type="text"
                                        onChange={this.handleReplaceFrom}></input>
                                    <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                        <FaArrowRightLong/>
                                    </IconContext.Provider> 
                                    <input className="input-typable all-side input-button-input"
                                        type="text"
                                        onChange={this.handleReplaceTo}></input>
                                </section>
                                <section className="option">
                                    <button className="option-item btn-match option opt-long"
                                        onClick={this.handleSave}>Save</button>
                                </section>
                            </section>
                        </Draggable>
                        {/* Reverse Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 75, y: 0}}
                            bounds={{top: -126, left: -390, right: 425, bottom: 265}}>
                            <section id="reverse-popout"
                                className="popout">
                                <section className="option space-nicely top">
                                    <button className="option-item btn-match option opt-long"
                                        onClick={this.handleSave}>Save</button>
                                    <section className="option-item">
                                        <button id="reverse-popout-btn-reverse-word"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={() => this.handlePressableBtn("reverse-word", "reverse")}>Word</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={() => this.handlePressableBtn("reverse-sentence", "reverse")}>Sentence</button>
                                        <button id="reverse-popout-btn-reverse-everything"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={() => this.handlePressableBtn("reverse-everything", "reverse")}>Everything</button>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        {/* Case Transform Popout */}
                        <Draggable
                            cancel="input, button"
                            defaultPosition={{x: 125, y: 0}}
                            bounds={{top: -105, left: -290, right: 425, bottom: 285}}>
                            <section id="case-transform-popout"
                                className="popout">
                                <section className="option space-nicely top">
                                    <button className="option-item btn-match option opt-long"
                                        onClick={this.handleSave}>Save</button>
                                    <section className="option-item">
                                        <button id="case-transform-popout-btn-lower"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseWord}>Lower</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseSentence}>Upper</button>
                                        <button id="reverse-popout-btn-reverse-everything"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseEverything}>Capitalize</button>
                                    </section>
                                    <section className="option-item">
                                        <button id="reverse-popout-btn-reverse-word"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseWord}>Alternate</button>
                                        <button id="reverse-popout-btn-reverse-sentence"
                                            className="btn-match option opt-small disabled-option"
                                            onClick={this.handleReverseSentence}>Inverse</button>
                                    </section>
                                </section>
                            </section>
                        </Draggable>
                        <div className="cut-scrollbar-corner-part-1 textarea">
                            <textarea className="cut-scrollbar-corner-part-2 textarea"
                                onChange={this.handleChange}
                                value={this.state.input}></textarea>
                        </div>
                        <div id="translator-preview-cut-corner"
                            className="cut-scrollbar-corner-part-1 p">
                            <p id="translator-translated-text"
                                className="cut-scrollbar-corner-part-2 p flex-center only-justify-content">{this.state.converted}</p>
                            <button className="bottom-right btn-match fadded"
                                onClick={this.handleRandSentence}>Random sentence</button>
                            <button className="bottom-left btn-match fadded inverse"
                                onClick={() => copyToClipboard(this.state.converted)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class GoogleTranslatorWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            converted: "",
            from: "",
            to: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
        this.handleTranslate = this.handleTranslate.bind(this);
        this.handleRandSentence = this.handleRandSentence.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    async handleTranslate(){
        if(this.state.input !== ""){
            const url = 'https://translated-mymemory---translation-memory.p.rapidapi.com/get?langpair=' + this.state.from + '%7C' + this.state.to + '&q=' + this.state.input + '&mt=1&onlyprivate=0&de=a%40b.c';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.REACT_APP_TRANSLATOR_API_KEY,
                    'X-RapidAPI-Host': process.env.REACT_APP_TRANSLATOR_API_HOST
                }
            };
            try{
                const response = await fetch(url, options);
                const result = await response.json();
                this.setState({
                    converted: result.responseData.translatedText
                });
            }catch(err){
                this.setState({
                    converted: err
                });
            };
        };
    };
    /// Handles the "from" language select
    handleFrom(event){
        this.setState({
            from: event.target.value
        });
    };
    /// Handles the "to" language select
    handleTo(event){
        this.setState({
            to: event.target.value,
        });
    };
    /// Swaps "from" language and "to" language
    handleSwap(){
        if(this.state.from !== this.state.to){
            randColor();
            const prev = this.state.from;
            this.setState(prevState => ({
                from: prevState.to,
                to: prev
            }));
            const v1 = $("#google-translator-translate-from").val();
            const v2 = $("#google-translator-translate-to").val();
            $("#google-translator-translate-from").val(v2);
            $("#google-translator-translate-to").val(v1);
        };
    };
    /// Handles random sentence button
    handleRandSentence(){
        this.setState({
            input: randSentence(),
            from: "en"
        }, () => {
            $("#translator-translate-from").val("en");
        });
    };
    componentDidMount(){
        randColor();
        const select = document.getElementById("select-languages");
        for(var curr = 0; curr < languages.length; curr+=2){
            var optText = languages[curr];
            var optValue = languages[curr+1];
            var el = document.createElement("option");
            el.textContent = optText;
            el.value = optValue;
            select.appendChild(el);
        };
        $('#google-translator-translate-from optgroup').clone().appendTo('#google-translator-translate-to');
        this.setState({
            from: "en",
            to: "ja"
        });
        $("#google-translator-translate-from").val("en");
        $("#google-translator-translate-to").val("ja");
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("google-translator")}
                onStop={() => dragStop("google-translator")}
                cancel="button, span, p, textarea, select"
                bounds="parent">
                <div id="google-translator-box"
                    className="widget">
                    <div id="google-translator-box-animation"
                        className="widget-animation">
                        <span id="google-translator-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div className="flex-center space-nicely bottom">
                            <select id="google-translator-translate-from"
                                className="select-match"
                                onChange={this.handleFrom}>
                                <optgroup id="select-languages"
                                    label="Languages"></optgroup>
                            </select>
                            <button className="btn-match inverse"
                                onClick={this.handleSwap}>
                                <IconContext.Provider value={{ size: smallIcon, className: "global-class-name" }}>
                                    <BsArrowLeftRight/>
                                </IconContext.Provider>
                            </button>
                            <select id="google-translator-translate-to"
                                className="select-match"
                                onChange={this.handleTo}></select>
                            <button className="btn-match inverse"
                                onClick={this.handleTranslate}>
                                <IconContext.Provider value={{ size: smallIcon, className: "global-class-name" }}>
                                    <FaArrowRightFromBracket/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        <div className="cut-scrollbar-corner-part-1 textarea">
                            <textarea className="cut-scrollbar-corner-part-2 textarea"
                                onChange={this.handleChange}
                                value={this.state.input}></textarea>
                        </div>
                        <div id="google-translator-preview-cut-corner"
                            className="cut-scrollbar-corner-part-1 p">
                            <p className="cut-scrollbar-corner-part-2 p flex-center only-justify-content">{this.state.converted}</p>
                            <button className="bottom-right btn-match fadded"
                                onClick={this.handleRandSentence}>Random sentence</button>
                            <button className="bottom-left btn-match fadded inverse"
                                onClick={() => copyToClipboard(this.state.converted)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class CalculatorWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            question: "",
            input: "",
            memory: [],
            expandInput: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePressableBtn = this.handlePressableBtn.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    handleClick(event){
        switch(event.target.value){
            case "=":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    var ans;
                    try{
                        ans = round(evaluate(this.state.input), 3);
                    }catch(err){
                        this.setState({
                            question: this.state.input,
                            input: "UNDEFINED"
                        });
                    };
                    if(ans === undefined){
                        this.setState({
                            question: this.state.input,
                            input: "UNDEFINED"
                        });
                    }else{
                        this.setState({
                            question: this.state.input,
                            input: ans
                        });
                    };
                };
                break;
            case "clear-entry":
                if(this.state.question !== ""
                    || this.state.input !== ""){
                    this.setState({
                        input: this.state.input
                            .toString()
                            .replace(/(\d+)(?!.*\d)/, "")
                    });
                };
                break;
            case "clear":
                if(this.state.question !== ""
                    || this.state.input !== ""){
                    this.setState({
                        question: "",
                        input: ""
                    });
                };
                break;
            case "delete":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: this.state.input
                            .toString()
                            .substring(0, this.state.input.length-1)
                    });
                }else{
                    this.setState({
                        input: ""
                    });
                };
                break;
            case "1/x":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: "1/(" + this.state.input + ")"
                    });
                };
                break;
            case "x^2":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: "square(" + this.state.input + ")"
                    });
                };
                break;
            case "sqrt(x)":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: "sqrt(" + this.state.input + ")"
                    });
                };
                break;
            case "negate":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: "unaryMinus(" + this.state.input + ")"
                    });
                };
                break;
            case "MC":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        memory: []
                    });
                }
                break;
            case "MR":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    this.setState({
                        input: this.state.memory[0]
                    });
                }
                break;
            case "M+":
                if(this.state.input !== ""
                && this.state.input !== "UNDEFINED"){
                    const lastNumberMAdd = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                    const add = evaluate(this.state.memory[0] + "+" + lastNumberMAdd);
                    this.setState({
                        memory: [add, ...this.state.memory.slice(1)]
                    });
                }
                break;
            case "M-":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    const lastNumberMSubtract = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                    const subtract = evaluate(this.state.memory[0] + "-" + lastNumberMSubtract);
                    this.setState({
                        memory: [subtract, ...this.state.memory.slice(1)]
                    });
                }
                break;
            case "MS":
                if(this.state.input !== ""
                    && this.state.input !== "UNDEFINED"){
                    const lastNumberMS = this.state.input.toString().match(/[-]?\d+(?=\D*$)/);
                    this.setState({
                        memory: [lastNumberMS, ...this.state.memory]
                    });
                }
                break;
            case "Mv":
                document.getElementById("calculator-btn-memory-display").style.visibility = "visible";
                break;
            case "memory-close":
                document.getElementById("calculator-btn-memory-display").style.visibility = "hidden";
                break;
            default:
                this.setState(prevState => ({
                    input: prevState.input + event.target.value
                }));
        };
        /// Automatically scroll down in the "expand input" popout if the "input" gets too long
        const expandInputPopout = document.getElementById("calculator-input-expand-text");
        if(expandInputPopout.scrollHeight > expandInputPopout.clientHeight){
            expandInputPopout.scrollTop = expandInputPopout.scrollHeight;
        }
    };
    handleDelete(){
        this.setState({
            memory: []
        });
    };
    /// Handles all buttons that are pressable
    handlePressableBtn(what){
        const btn = document.getElementById("calculator-btn-input-expand");
        const popout = document.getElementById("calculator-input-expand-popout");
        switch(what){
            case "expand-input":
                if(this.state.expandInput === false){
                    this.setState({
                        expandInput: true
                    });
                    btn.style.color = "rgba(var(--randColorOpacity), 1)";
                    popout.style.visibility = "visible";
                }else{
                    this.setState({
                        expandInput: false
                    });
                    btn.style.color = "rgba(var(--randColorOpacity), 0.2)";
                    popout.style.visibility = "hidden";
                };
                break;
            default:
                break;
        };
    };
    /// Handles keyboard shortcuts
    handleKeypress(event){
        const btnEqual = document.getElementById("calculator-btn-equal");
        if(event.key === "Enter"){
            event.preventDefault();
            btnEqual.click();
        };
    };
    componentDidMount(){
        randColor();
        const inputField = document.getElementById("calculator-input-field");
        inputField.addEventListener("keypress", this.handleKeypress);
    };
    componentWillUnmount(){
        const inputField = document.getElementById("calculator-input-field");
        inputField.removeEventListener("keypress", this.handleKeypress);
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("calculator")}
                onStop={() => dragStop("calculator")}
                cancel="button, span, p, input, textarea, section"
                bounds="parent">
                <div id="calculator-box"
                    className="widget">
                    <div id="calculator-box-animation"
                        className="widget-animation">
                        <span id="calculator-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: medIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="calculator-display-container">
                            <input className="font small input-typable no-side space-nicely right short bottom short"
                                type="text"
                                value={this.state.question}
                                readOnly>
                            </input>
                            <input id="calculator-input-field"
                                className="font large bold input-typable no-side"
                                type="text"
                                value={this.state.input}
                                onChange={this.handleChange}>
                            </input>
                        </div>
                        <div className="font smaller flex-center space-nicely bottom short">
                            <button className="btn-match fadded inverse"
                                onClick={() => copyToClipboard(this.state.input)}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <FaRegPaste/>
                                </IconContext.Provider>
                            </button>
                            <button id="calculator-btn-input-expand" 
                                className="btn-match fadded inverse"
                                onClick={() => this.handlePressableBtn("expand-input")}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <BiExpand/>
                                </IconContext.Provider>
                            </button>
                        </div>
                        <div className="font smaller flex-center space-nicely bottom short">
                            <button id="calculator-btn-MC"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="MC">MC</button>
                            <button id="calculator-btn-MR"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="MR">MR</button>
                            <button id="calculator-btn-M+"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="M+">M+</button>
                            <button id="calculator-btn-M-"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="M-">M&minus;</button>
                            <button id="calculator-btn-MS"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="MS">MS</button>
                            <button id="calculator-btn-Mv"
                                className="btn-match inverse inv-small"
                                onClick={this.handleClick}
                                value="Mv">M&#709;</button>
                        </div>
                        <section className="grid"
                            id="calculator-btn-container">
                            <div id="calculator-btn-memory-display">
                                <div id="calculator-btn-memory-container">
                                    {this.state.memory.map(curr => <p>{curr}</p>)}
                                </div>
                                <button id="calculator-btn-memory-display-close"
                                    onClick={this.handleClick}
                                    value="memory-close"></button>
                                <button id="calculator-btn-trash"
                                    className="btn-match inverse"
                                    onClick={this.handleDelete}
                                    value="trash"><FaRegTrashCan id="calculator-btn-trash-icon"/></button>
                            </div>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="%">%</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="clear-entry">CE</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="clear">C</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="delete"><FiDelete className="pointer-events-none"/></button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="1/x">1/x</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="x^2">x&sup2;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="sqrt(x)">&#8730;x</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="/">&divide;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="7">7</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="8">8</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="9">9</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="*">&times;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="4">4</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="5">5</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="6">6</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="-">&minus;</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="1">1</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="2">2</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="3">3</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="+">+</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="negate"><BsPlusSlashMinus className="pointer-events-none"/></button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value="0">0</button>
                            <button className="btn-match"
                                onClick={this.handleClick}
                                value=".">.</button>
                            <button id="calculator-btn-equal"
                                className="btn-match"
                                onClick={this.handleClick}
                                value="=">=</button>
                        </section>
                        {/* Expand Input Popout */}
                        <Draggable
                            cancel="p"
                            defaultPosition={{x: 180, y: -305}}
                            bounds={{top: -455, left: -150, right: 190, bottom: 15}}>
                            <section id="calculator-input-expand-popout"
                                className="popout">
                                <p id="calculator-input-expand-text"
                                    className="cut-scrollbar-corner-part-2 p short font medium break-word space-nicely all long">
                                    {this.state.input}
                                </p>
                            </section>
                        </Draggable>
                    </div>
                </div>
            </Draggable>
        );
    };
}

class WeatherWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            helpShow: false,
            input: "auto:ip",
            name: "",           /// Location
            region: "",
            localTime: "",
            lastUpdated: "",    /// Current
            tempC: "",
            tempF: "",
            feelsLikeC: "",
            feelsLikeF: "",
            weatherCondition: "",
            weatherIcon: "",
            windMPH: "",
            windKPH: ""
        };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleHelp = this.handleHelp.bind(this);
    };
    handleChange(event){
        this.setState({
            input: event.target.value
        });
    };
    handleHelp(){
        if(this.state.helpShow === false){
            this.setState({
                helpShow: true
            });
            document.getElementById("weather-search-help-container").style.visibility = "visible";
        }else{
            this.setState({
                helpShow: false
            });
            document.getElementById("weather-search-help-container").style.visibility = "hidden";
        };
    };
    /// API call
    async handleUpdate(){
        if(this.state.input !== ""){
            const url = "https://weatherapi-com.p.rapidapi.com/current.json?q=" + this.state.input;
            const options = {
                method: "GET",
                headers: {
                    "X-RapidAPI-Key": process.env.REACT_APP_WEATHER_API_KEY,
                    "X-RapidAPI-Host": process.env.REACT_APP_WEATHER_API_HOST
                }
            };
            try{
                const response = await fetch(url, options);
                const result = await response.json();
                this.setState({
                    name: result.location.name,
                    region: result.location.region,
                    localTime: result.location.localtime,
                    lastUpdated: result.current.last_updated,
                    tempC: result.current.temp_c,
                    tempF: result.current.temp_f,
                    feelsLikeC: result.current.feelslike_c,
                    feelsLikeF: result.current.feelslike_f,
                    weatherCondition: result.current.condition.text,
                    weatherIcon: result.current.condition.icon,
                    windMPH: result.current.wind_mph,
                    windKPH: result.current.wind_kph
                });
            }catch(err){
                this.setState({
                    input: "N/A"
                });
            };
        };
    };
    componentDidMount(){
        randColor();
        this.handleUpdate();
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("weather")}
                onStop={() => dragStop("weather")}
                cancel="button, span, input, section"
                bounds="parent">
                <div id="weather-box"
                    className="widget">
                    <div id="weather-box-animation"
                        className="widget-animation">
                        <span id="weather-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <div id="weather-search-container"
                            className="flex-center">
                            <div className="when-elements-are-not-straight">
                                <input className="input-typable right-side with-help-btn"
                                    placeholder="Enter location"
                                    onChange={this.handleChange}
                                    value={this.state.input}>
                                </input>
                                <button className="help-btn left-side when-elements-are-not-straight"
                                    onClick={this.handleHelp}>
                                    <IconContext.Provider value={{ size: smallIcon, className: "global-class-name" }}>
                                        <FaRegCircleQuestion/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            {/* Search help popout */}
                            <Draggable
                                cancel="li"
                                defaultPosition={{x: 0, y: 125}}
                                bounds={{top: -135, left: -325, right: 325, bottom: 350}}>
                                <section id="weather-search-help-container"
                                    className="popout">
                                    <ul className="font medium">
                                        <li>Latitude and Longitude <br/><span className="font small normal-transparent">e.g: 48.8567,2.3508</span></li>
                                        <li>City name <span className="font small normal-transparent">e.g.: Paris</span></li>
                                        <li>US zip <span className="font small normal-transparent">e.g.: 10001</span></li>
                                        <li>UK postcode <span className="font small normal-transparent">e.g: SW1</span></li>
                                        <li>Canada postal code <span className="font small normal-transparent">e.g: G2J</span></li>
                                        <li>Metar:&lt;metar code&gt; <span className="font small normal-transparent">e.g: metar:EGLL</span></li>
                                        <li>Iata:&lt;3 digit airport code&gt; <span className="font small normal-transparent">e.g: iata:DXB</span></li>
                                        <li>Auto IP lookup <span className="font small normal-transparent">e.g: auto:ip</span></li>
                                        <li>IP address (IPv4 and IPv6 supported) <br/><span className="font small normal-transparent">e.g: 100.0.0.1</span></li>
                                    </ul>
                                </section>
                            </Draggable>
                            <button className="btn-match"
                                onClick={this.handleUpdate}>
                                Update
                            </button>
                        </div>
                        <section id="weather-info-container">
                            <div id="weather-info-icon-temp">
                                <img className="no-select"
                                    src={this.state.weatherIcon}
                                    alt="weather-icon"
                                    style={{height: medIcon, width: medIcon}}></img>
                                <div id="weather-info-temp-c-container">
                                    <span id="weather-info-temp-c"
                                        className="font large">
                                        <b>{this.state.tempC}&deg;C</b>
                                    </span>
                                    <span className="font small bold-transparent flex-center">{this.state.feelsLikeC}&deg;C</span>
                                </div>
                                <div id="weather-info-temp-f-container">
                                    <span id="weather-info-temp-f"
                                        className="font large">
                                        <b>{this.state.tempF}&deg;F</b>
                                    </span>
                                    <span className="font small bold-transparent flex-center">{this.state.feelsLikeF}&deg;F</span>
                                </div>
                            </div>
                            <div id="weather-info-cond-local-time"
                                className="font medium normal">
                                <span>{this.state.weatherCondition}</span>
                                <span>{this.state.localTime}</span>
                            </div>
                            <div id="weather-info-wind"
                                className="font medium normal">
                                <span>Wind:</span>
                                <span>{this.state.windKPH} KPH</span>
                                <span>{this.state.windMPH} MPH</span>
                            </div>
                            <div id="weather-info-location"
                                className="font small normal">
                                <span>{this.state.name}, {this.state.region}</span>
                            </div>
                        </section>
                        <span id="weather-last-updated"
                            className="font small normal">Last updated: {this.state.lastUpdated}</span>
                    </div>
                </div>
            </Draggable>
        );
    };
}

//////////////////// Widgets: Games ////////////////////

class SnakeWidget extends Component{
    constructor(props){
        super(props);
        this.state = {
            size: 24
        };
        this.resizer = this.resizer.bind(this);
    };
    resizer(){
        if(window.innerWidth < 450){
            this.setState({
                size: (window.innerWidth / 16) - 4
            });
        }else{
            this.setState({
                size: 24
            });
        };
    };
    componentDidMount(){
        window.addEventListener("resize", this.resizer);
    };
    componentWillUnmount(){
        window.removeEventListener("resize", this.resizer);
    };
    render(){
        return(
            <Draggable
                onStart={() => dragStart("snake")}
                onStop={() => dragStop("snake")}
                cancel="button, section"
                bounds="parent">
                <div id="snake-box"
                    className="widget">
                    <div id="snake-box-animation"
                        className="widget-animation">
                        <span id="snake-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <section>
                            <SnakeGame size={this.state.size}/>
                        </section>
                    </div>
                </div>
            </Draggable>
        );
    };
}

//////////////////// Widget Template///////////////////////
/*
class []Widget extends Component{
    render(){
        return(
            <Draggable
                onStart={() => dragStart("[]")}
                onStop={() => dragStop("[]")}
                cancel="button, section"
                bounds="parent">
                <div id="[]-box"
                    className="widget">
                    <div id="[]-box-animation"
                        className="widget-animation">
                        <span id="[]-box-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                    </div>
                </div>
            </Draggable>
        );
    };
}
*/

class Widgets extends Component{
    constructor(props){
        super(props);
        this.state = {
            quote: false,
            translator: false,
            googleTranslator: false,
            calculator: false,
            weather: false,
            snake: false
        };
        this.handleCallBack = this.handleCallBack.bind(this);
    };
    handleCallBack(what){
        switch(what){
            case "quote":
                this.setState({
                    quote: !this.state.quote
                });
                break;
            case "translator":
                this.setState({
                    translator: !this.state.translator
                });
                break;
            case "googleTranslator":
                this.setState({
                    googleTranslator: !this.state.googleTranslator
                });
                break;
            case "calculator":
                this.setState({
                    calculator: !this.state.calculator
                });
                break;
            case "weather":
                this.setState({
                    weather: !this.state.weather
                });
                break;
            case "snake":
                this.setState({
                    snake: !this.state.snake
                });
                break;
            default:
                break;
        };
    };
    componentDidMount(){
        randColor();
    };
    render(){
        return(
            <div id="widget-container">
                <SettingWidget showHide={this.handleCallBack}/>
                {this.state.quote === true ? <QuoteWidget showHide={this.handleCallBack}/> : <></>}
                {this.state.translator === true ? <TranslatorWidget showHide={this.handleCallBack}/> : <></>}
                {this.state.googleTranslator === true ? <GoogleTranslatorWidget showHide={this.handleCallBack}/> : <></>}
                {this.state.calculator === true ? <CalculatorWidget showHide={this.handleCallBack}/> : <></>}
                {this.state.weather === true ? <WeatherWidget showHide={this.handleCallBack}/> : <></>}
                {this.state.snake === true ? <SnakeWidget showHide={this.handleCallBack}/> : <></>}
            </div>
        );
    }
};

//////////////////// Render to page ////////////////////
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <div id="App">
        <Widgets/>
    </div>
);