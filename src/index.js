import './index.scss';
import { React, Component } from 'react';
import ReactDOM from 'react-dom/client';
import $ from 'jquery';
/// Games
import WidgetSnake from './Widgets/Games/Snake.js';
/// Utility
import WidgetSetting from './Widgets/Utility/Setting.js';
import WidgetQuote from './Widgets/Utility/Quote.js';
import WidgetTranslator from './Widgets/Utility/Translator.js';
import WidgetGoogleTranslator from './Widgets/Utility/GoogleTranslator.js';
import WidgetCalculator from './Widgets/Utility/Calculator.js';
import WidgetWeather from './Widgets/Utility/Weather.js';


//////////////////// Variables ////////////////////
const smallIcon = "0.88em";
const medIcon = "4em";
const largeIcon = "5em";
const zIndexDefault = 2;
const zIndexDrag = 5;
const colorRange = 200;
const widgetsUtilityActive = [];
const widgetsGamesActive = [];
const widgetsFunActive = [];
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


//////////////////// Widgets ///////////////////////
class Widgets extends Component{
    constructor(props){
        super(props);
        this.state = {
            quote: false,
            translator: false,
            googleTranslator: false,
            calculator: false,
            weather: false,
            snake: false,
            iceberg: false
        };
        this.handleCallBack = this.handleCallBack.bind(this);
    };
    handleCallBack(what){
        this.setState({
            [what]: !this.state[what]
        });
    };
    updateWidgetsActive(what, where){
        switch(where){
            case "utility":
                widgetsUtilityActive.push(what);
                break;
            case "games":
                widgetsGamesActive.push(what);
                break;
            case "fun":
                widgetsFunActive.push(what);
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
                <WidgetSetting 
                    showHide={this.handleCallBack}
                    funcDragStart={dragStart}
                    funcDragStop={dragStop}
                    funcSortSelect={sortSelect}
                    funcUpdateWidgetsActive={this.updateWidgetsActive}
                    varWidgetsUtilityActive={widgetsUtilityActive}
                    varWidgetsGamesActive={widgetsGamesActive}
                    varWidgetsFunActive={widgetsFunActive}
                    varAnimations={animations}
                />
                {this.state.quote === true
                    ? <WidgetQuote 
                            showHide={this.handleCallBack}
                            funcDragStart={dragStart}
                            funcDragStop={dragStop}
                            funcRandColor={randColor}
                            funcCopyToClipboard={copyToClipboard}
                            varQuotes={quotes}
                            varLargeIcon={largeIcon}
                        />
                    : <></>}
                {this.state.translator === true
                    ? <WidgetTranslator
                            showHide={this.handleCallBack}
                            funcDragStart={dragStart}
                            funcDragStop={dragStop}
                            funcRandColor={randColor}
                            funcCopyToClipboard={copyToClipboard}
                            funcGrep={grep}
                            funcMergePunctuation={mergePunctuation}
                            funcRandSentence={randSentence}
                            funcSortSelect={sortSelect}
                            varBrailleDictionary={brailleDictionary}
                            varBrailleFromDictionary={brailleFromDictionary}
                            varUwuDictionary={uwuDictionary}
                            varUwuEmoticons={uwuEmoticons}
                            varEmojifyDictionary={emojifyDictionary}
                            varMatchAll={matchAll}
                            varSmallIcon={smallIcon}
                            varLargeIcon={largeIcon}
                        />
                    : <></>}
                {this.state.googleTranslator === true
                    ? <WidgetGoogleTranslator 
                            showHide={this.handleCallBack}
                            funcDragStart={dragStart}
                            funcDragStop={dragStop}
                            funcRandColor={randColor}
                            funcCopyToClipboard={copyToClipboard}
                            funcRandSentence={randSentence}
                            varLanguages={languages}
                            varSmallIcon={smallIcon}
                            varLargeIcon={largeIcon}
                        />
                    : <></>}
                {this.state.calculator === true
                    ? <WidgetCalculator
                            showHide={this.handleCallBack}
                            funcDragStart={dragStart}
                            funcDragStop={dragStop}
                            funcRandColor={randColor}
                            funcCopyToClipboard={copyToClipboard}
                            varMedIcon={medIcon}
                        />
                    : <></>}
                {this.state.weather === true
                    ? <WidgetWeather 
                            showHide={this.handleCallBack}
                            funcDragStart={dragStart}
                            funcDragStop={dragStop}
                            funcRandColor={randColor}
                            varSmallIcon={smallIcon}
                            varMedIcon={medIcon}
                            varLargeIcon={largeIcon}
                        />
                    : <></>}
                {this.state.snake === true
                    ? <WidgetSnake 
                            showHide={this.handleCallBack}
                            funcDragStart={dragStart}
                            funcDragStop={dragStop}
                            varLargeIcon={largeIcon}
                        />
                    : <></>}
            </div>
        );
    }
};
/// Widget template
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


//////////////////// Render to page ////////////////////
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <div id="App">
        <Widgets/>
    </div>
);