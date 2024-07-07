import './index.scss';
import { React, Component } from 'react';
import ReactDOM from 'react-dom/client';
/// Games
import WidgetSnake from './Widgets/Games/Snake.js';
/// Utility
import WidgetSetting from './Widgets/Utility/Setting.js';
import WidgetQuote from './Widgets/Utility/Quote.js';
import WidgetTranslator from './Widgets/Utility/Translator.js';
import WidgetGoogleTranslator from './Widgets/Utility/GoogleTranslator.js';
import WidgetCalculator from './Widgets/Utility/Calculator.js';
import WidgetWeather from './Widgets/Utility/Weather.js';
import WidgetTimeConversion from './Widgets/Utility/TimeConversion.js';
import WidgetSpreadsheet from './Widgets/Utility/Spreadsheet.js';


//////////////////// Variables ////////////////////
/// Mutable
const microIcon = "0.6em";
const smallIcon = "0.88em";
const medIcon = "4em";
const largeIcon = "5em";
const zIndexDefault = 2;
const zIndexDrag = 5;
const colorRange = 200;
const tricks = ["spin", "flip", "hinge"];
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
    , "Darkness blacker than black and darker than dark, I beseech thee, combine with my deep crimson. The time of awakening cometh. Justice, fallen upon the infallible boundary, appear now as an intangible distortions! I desire for my torrent of power a destructive force: a destructive force without equal! Return all creation to cinders, and come from the abyss! Explosion!"    
    , "Oh, blackness shrouded in light, Frenzied blaze clad in night, In the name of the crimson demons, let the collapse of thine origin manifest. Summon before me the root of thy power hidden within the lands of the kingdom of demise! Explosion!"
    , "Crimson-black blaze, king of myriad worlds, though I promulgate the laws of nature, I am the alias of destruction incarnate in accordance with the principles of all creation. Let the hammer of eternity descend unto me! Explosion!"    
    , "O crucible which melts my soul, scream forth from the depths of the abyss and engulf my enemies in a crimson wave! Pierce trough, EXPLOSION!"    
    , 'If you ask Rick Astley for a copy of the movie "UP", he cannot give you it as he can never give you up. But, by doing that, he is letting you down, and thus, is creating something known as the Astley Paradox.'
    , "Reddit should rename 'share' to 'spreddit', 'delete' to 'shreddit' and 'karma' to 'creddit'. Yet they haven't. I don't geddit."
    , "The tower of rebellion creeps upon man’s world… The unspoken faith displayed before me… The time has come! Now, awaken from your slumber, and by my madness, be wrought! Strike forth, Explosion!"    
    , "Glasses are really versatile. First, you can have glasses-wearing girls take them off and suddenly become beautiful, or have girls wearing glasses flashing those cute grins, or have girls stealing the protagonist's glasses and putting them on like, \"Haha, got your glasses!\" That's just way too cute! Also, boys with glasses! I really like when their glasses have that suspicious looking gleam, and it's amazing how it can look really cool or just be a joke. I really like how it can fulfill all those abstract needs. Being able to switch up the styles and colors of glasses based on your mood is a lot of fun too! It's actually so much fun! You have those half rim glasses, or the thick frame glasses, everything! It's like you're enjoying all these kinds of glasses at a buffet. I really want Luna to try some on or Marine to try some on to replace her eyepatch. We really need glasses to become a thing in hololive and start selling them for HoloComi. Don't. You. Think. We. Really. Need. To. Officially. Give. Everyone. Glasses?"
    , "Eggs, Bacon, Grist, Sausage. The cockroaches in your bedroom held you hostage."
];
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
const widgetsUtilityActive = [];
const widgetsGamesActive = [];
const widgetsFunActive = [];
const operation = '-+/*%';
const punctuation = '\\[\\!\\"\\#\\$\\%\\&\\\'\\(\\)'
    + '\\*\\+\\,\\\\\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\['
    + '\\]\\^\\_\\`\\{\\|\\}\\~\\]';
const matchAll = new RegExp("\\s*(\\.{3}|\\w+\\-\\w+|\\w+'(?:\\w+)?|\\w+|[" + punctuation + "])");
const formatGroupLabel = (data) => (
    <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"}}>
        <span className="font transparent-bold">{data.label}</span>
        <span style={{
            backgroundColor: `rgba(${getComputedStyle(document.documentElement).getPropertyValue("--randColorOpacity")}, 0.3)`,
            borderRadius: "2em",
            color: getComputedStyle(document.documentElement).getPropertyValue("--randColor"),
            display: "inline-block",
            fontSize: 12,
            fontWeight: "normal",
            lineHeight: "1",
            minWidth: 1,
            padding: "0.16666666666667em 0.5em",
            textAlign: "center"}}>
            {data.options.length}
        </span>
    </div>
);
const selectTheme = {};
const selectStyleSmall = {
    control: (base) => ({
        ...base,
        minHeight: 'initial',
      }),
    valueContainer: (base) => ({
        ...base,
        height: `-1px`,
        padding: '0 8px',
    }),
    clearIndicator: (base) => ({
        ...base,
        padding: `0px`,
    }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: `0px`,
    })
};


//////////////////// Functions ////////////////////
function randColor(){
    const r = document.documentElement;
    const colorR = Math.floor(Math.random() * colorRange);
    const colorG = Math.floor(Math.random() * colorRange);
    const colorB = Math.floor(Math.random() * colorRange);
    const randColorOpacity = `${colorR},${colorG},${colorB}`;
    const randColor = `rgb(${randColorOpacity})`;
    const randColorLight = `rgb(${colorR + 50},${colorG + 50},${colorB + 50})`;
    r.style.setProperty("--randColor", randColor);
    r.style.setProperty("--randColorLight", randColorLight);
    r.style.setProperty("--randColorOpacity", randColorOpacity);
    /// Set react-select colors
    selectTheme.primary = randColor;    /// Currently selected option background color
    selectTheme.primary25 = `rgba(${randColorOpacity}, 0.3)`;   /// Hover option background color
    selectTheme.neutral20 = randColor;   /// Border color of select
    selectTheme.neutral30 = randColorLight;  /// Hover border color
    selectTheme.neutral40 = randColorLight;  /// Hover arrow color
    selectTheme.neutral60 = randColorLight;  /// Active arrow color
    selectTheme.neutral80 = randColor;  /// Placeholder text color
};

function dragStart(what){
    switch(what){
        case "settings":
            document.getElementById(what + "-widget-draggable").style.visibility = "visible";
            document.getElementById(what + "-widget").style.opacity = "0.5";
            break;
        default:
            document.getElementById(what + "-widget-draggable").style.visibility = "visible";
            document.getElementById(what + "-widget").style.opacity = "0.5";
            document.getElementById(what + "-widget").style.zIndex = zIndexDrag;
            break;
    };
};
function dragStop(what){
    switch(what){
        case "settings":
            document.getElementById(what + "-widget-draggable").style.visibility = "hidden";
            document.getElementById(what + "-widget").style.opacity = "1";
            break;
        default:
            document.getElementById(what + "-widget-draggable").style.visibility = "hidden";
            document.getElementById(what + "-widget").style.opacity = "1";
            document.getElementById(what + "-widget").style.zIndex = zIndexDefault;
            break;
    };
};

function sortSelect(what){
    what.forEach((value) => {
        value.options.sort((a, b) => {
            return a.label.localeCompare(b.label);  
        });
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
            values: {
                animation: {},
                customBorder: {},    
                savePositionPopout: false,
                authorNames: false,
                fullscreen: false,
                resetPosition: false,
                shadow: false
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
                                    x: 30,
                                    y: -55
                                }
                            },
                            settings: {
                                position: {
                                    x: 85,
                                    y: -25
                                }
                            }
                        }
                    },
                    quote: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    translator: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }   
                    },
                    googletranslator: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }   
                    },
                    calculator: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            expandinput: {
                                position: {
                                    x: 180,
                                    y: -305
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    weather: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            searchhelp: {
                                position: {
                                    x: 0,
                                    y: 125
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    timeconversion: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    spreadsheet: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    }
                },
                games: {
                    snake: {
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    }
                },
                fun: {
                }
            }
        };
        this.handleShowHide = this.handleShowHide.bind(this);
        this.handleHotbar = this.handleHotbar.bind(this);
        this.updateCustomBorder = this.updateCustomBorder.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    handleShowHide(what, where){
        if(this.state.widgets[where][what].active === false){
            randColor();
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
                let e = document.getElementById(`${what}-widget`);
                /// Add animation if it exists
                if(this.state.values.animation.value !== "default"){
                    e.style.animation = "none";
                    window.requestAnimationFrame(() => {
                        e.style.animation = this.state.values.animation.value + "In 2s";
                    });
                };
                /// Add custom border if it exists
                if(this.state.values.customBorder.value !== "default"){
                    this.updateCustomBorder(what);
                };
                /// Add shadow if it exist
                if(this.state.values.shadow === true){
                    this.updateDesign("shadow", true, what);
                };
            });
        }else{
            let e = document.getElementById(`${what}-widget`);
            e.style.visibility = "hidden";
            if(this.state.values.animation.value !== "default"){
                e.style.animation = "none";
                window.requestAnimationFrame(() => {
                    e.style.animation = this.state.values.animation.value + "Out 2s";
                });
                e.addEventListener("animationend", (event) => {
                    if(event.animationName.slice(event.animationName.length-3) === "Out"){
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
                        }));
                    };
                });
            }else{
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
                }));
            };
        };
    };
    handleHotbar(element, what, where){
        switch(what){
            case "fullscreen":
                let e = document.getElementById(element + "-widget");
                let eAnimation = document.getElementById(element + "-widget-animation");
                if(e.classList.contains(what)){
                    e.classList.remove(what);
                    this.updatePosition(element, where, this.state.prevPosition.prevX, this.state.prevPosition.prevY);
                }else{
                    e.classList.add(what);
                    this.setState({
                        prevPosition: {
                            prevX: this.state.widgets[where][element].position.x,
                            prevY: this.state.widgets[where][element].position.y
                        }
                    });
                    this.updatePosition(element, where, 0, 0);
                };
                if(eAnimation.classList.contains(what + "-animation")){
                    eAnimation.classList.remove(what + "-animation");
                }else{
                    eAnimation.classList.add(what + "-animation");
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
            case "resetPosition":
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
            default:
                break;
        };
    };
    updateDesign(what, value, where){
        let widget, popout, combine;
        if(where !== undefined){
            widget = document.getElementById(where + "-widget-animation");
            popout = widget.querySelectorAll(".popout");
            combine = [widget, ...popout];
        }else{
            widget = document.querySelectorAll(".widget-animation");
            popout = document.querySelectorAll(".popout");
            combine = [...widget, ...popout];
        };
        switch(what){
            case "shadow":
                for(const element of combine){
                    if(value === true){
                        element.style.boxShadow = "20px 20px rgba(0, 0, 0, .15)";
                    }else{
                        element.style.boxShadow = "none";
                    };
                };
                break;
            case "default":
                for(const element of combine){
                    element.style.boxShadow = "none"
                };
                break;
            default:
                break;
        };
    };
    updateCustomBorder(what){
        let widget, popout, combine;
        if(what !== undefined){
            widget = document.getElementById(what + "-widget-animation");
            popout = widget.querySelectorAll(".popout");
            combine = [widget, ...popout];
        }else{
            widget = document.querySelectorAll(".widget-animation");
            popout = document.querySelectorAll(".popout");
            combine = [...widget, ...popout];
        };
        switch(this.state.values.customBorder.value){
            case "diagonal":
                for(const element of combine){
                    element.style.border = "10px solid var(--randColor)";
                    element.style.borderImage = `
                        repeating-linear-gradient(45deg,
                            transparent,
                            transparent 5px,
                            var(--randColor) 6px,
                            var(--randColor) 15px,
                            transparent 16px,
                            transparent 20px
                        ) 20/1rem`;
                };
                break;
            case "dashed":
                for(const element of combine){
                    element.style.border = "5px dashed var(--randColor)";
                };
                break;
            case "double":
                for(const element of combine){
                    element.style.border = "10px double var(--randColor)";
                };
                break;
            case "default":
                for(const element of combine){
                    element.style.border = "1px solid var(--randColor)";
                    element.style.borderImage = "none"
                };
                break;
            default:
                break;
        };
    };
    updateValue(what, where, type){
        this.setState(prevState => ({
            [type]: {
                ...prevState[type],
                [where]: what
            }
        }), () => {
            if(where === "customBorder"){
                this.updateCustomBorder();
            };
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
    updatePosition(what, where, xNew, yNew, type, name){
        switch(type){
            case "popout":
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
    storeData(){
        let data = {
            utility: {},
            games: {},
            fun: {}
        };
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            for(let i in this.state.widgets.utility){
                data.utility[i] = {
                    ...dataLocalStorage["utility"][i],
                    active: this.state.widgets.utility[i].active,
                    position: this.state.widgets.utility[i].position
                };
                if(this.state.values.savePositionPopout){
                    data.utility[i].popouts = this.state.widgets.utility[i].popouts;
                };
            };
            for(let i in this.state.widgets.games){
                data.games[i] = {
                    ...dataLocalStorage["games"][i],
                    active: this.state.widgets.games[i].active,
                    position: this.state.widgets.games[i].position
                };
                if(this.state.values.savePositionPopout){
                    data.games[i].popouts = this.state.widgets.games[i].popouts;
                };
            };
            for(let i in this.state.widgets.fun){
                data.fun[i] = {
                    ...dataLocalStorage["fun"][i],
                    active: this.state.widgets.fun[i].active,
                    position: this.state.widgets.fun[i].position
                };
                if(this.state.values.savePositionPopout){
                    data.fun[i].popouts = this.state.widgets.fun[i].popouts;
                };
            };
        /// First load
        }else{
            for(let i in this.state.widgets.utility){
                data.utility[i] = {
                    active: false,
                    position: this.state.widgets.utility[i].position
                };
                if(this.state.values.savePositionPopout){
                    data.utility[i].popouts = this.state.widgets.utility[i].popouts;
                };
            };
            for(let i in this.state.widgets.games){
                data.games[i] = {
                    active: false,
                    position: this.state.widgets.games[i].position
                };
                if(this.state.values.savePositionPopout){
                    data.games[i].popouts = this.state.widgets.games[i].popouts;
                };
            };
            for(let i in this.state.widgets.fun){
                data.fun[i] = {
                    active: false,
                    position: this.state.widgets.fun[i].position
                };
                if(this.state.values.savePositionPopout){
                    data.fun[i].popouts = this.state.widgets.fun[i].popouts;
                };
            };
        };
        localStorage.setItem("widgets", JSON.stringify(data));
    };
    componentDidMount(){
        randColor();
        /// Load widget's data from local storage
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            let localStorageValues = dataLocalStorage["utility"]["setting"]["values"];
            for(let i in this.state.widgets.utility){
                this.setState(prevState => ({
                    widgets: {
                        ...prevState.widgets,
                        utility: {
                            ...prevState.widgets.utility,
                            [i]: {
                                ...prevState.widgets.utility[i],
                                ...dataLocalStorage.utility[i]
                            }
                        }
                    }
                }), () => {
                    this.updateCustomBorder();    
                });
                /// For specific widgets that have unique state values
                switch(i){
                    case "setting":
                        this.setState({
                            values: {
                                ...this.state.values,
                                animation: localStorageValues["animation"],
                                customBorder: localStorageValues["customBorder"],    
                                savePositionPopout: localStorageValues["savePositionPopout"],
                                authorNames: localStorageValues["authorNames"],
                                fullscreen: localStorageValues["fullscreen"],
                                resetPosition: localStorageValues["resetPosition"],
                                shadow: localStorageValues["shadow"]
                            },
                        });
                        break;
                    default:
                        break;
                };
            };
            for(let i in this.state.widgets.games){
                this.setState(prevState => ({
                    widgets: {
                        ...prevState.widgets,
                        games: {
                            ...prevState.widgets.games,
                            [i]: {
                                ...prevState.widgets.games[i],
                                ...dataLocalStorage.games[i]
                            }
                        }
                    }
                }), () => {
                    this.updateCustomBorder();    
                });
            };
            for(let i in this.state.widgets.fun){
                this.setState(prevState => ({
                    widgets: {
                        ...prevState.widgets,
                        fun: {
                            ...prevState.widgets.fun,
                            [i]: {
                                ...prevState.widgets.fun[i],
                                ...dataLocalStorage.fun[i]
                            }
                        }
                    }
                }), () => {
                    this.updateCustomBorder();
                });
            };
        }else{
            this.storeData();
        };
        /// Store widget's data in local storage when the website closes/refreshes
        window.addEventListener("beforeunload", this.storeData);
    };
    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.storeData);
    };
    render(){
        const defaultProps = {
            dragStart:dragStart,
            dragStop:dragStop,
            updatePosition:this.updatePosition,
            handleHotbar:this.handleHotbar,
            values: {
                authorNames: this.state.values.authorNames
            },
            hotbar: {
                fullscreen: this.state.values.fullscreen,
                resetPosition: this.state.values.resetPosition
            }
        };
        return(
            <div id="widget-container">
                <WidgetSetting
                    widgets={{
                        quote: this.state.widgets.utility.quote.active,
                        translator: this.state.widgets.utility.translator.active,
                        googletranslator: this.state.widgets.utility.googletranslator.active,
                        calculator: this.state.widgets.utility.calculator.active,
                        weather: this.state.widgets.utility.weather.active,
                        timeconversion: this.state.widgets.utility.timeconversion.active,
                        spreadsheet: this.state.widgets.utility.spreadsheet.active,
                        snake: this.state.widgets.games.snake.active
                    }}
                    showHide={this.handleShowHide}
                    dragStart={dragStart}
                    dragStop={dragStop}
                    sortSelect={sortSelect}
                    updateWidgetsActive={this.updateWidgetsActive}
                    updateValue={this.updateValue}
                    updatePosition={this.updatePosition}
                    updateDesign={this.updateDesign}
                    widgetsUtilityActive={widgetsUtilityActive}
                    widgetsGamesActive={widgetsGamesActive}
                    widgetsFunActive={widgetsFunActive}
                    tricks={tricks}
                    formatGroupLabel={formatGroupLabel}
                    selectTheme={selectTheme}
                    selectStyleSmall={selectStyleSmall}
                    customBorderValue={this.state.values.customBorder}
                    position={{
                        x: this.state.widgets.utility.setting.position.x,
                        y: this.state.widgets.utility.setting.position.y
                    }}
                    positionPopout={{
                        showhidewidgets: {
                            x: this.state.widgets.utility.setting.popouts.showhidewidgets.position.x,
                            y: this.state.widgets.utility.setting.popouts.showhidewidgets.position.y
                        },
                        settings: {
                            x: this.state.widgets.utility.setting.popouts.settings.position.x,
                            y: this.state.widgets.utility.setting.popouts.settings.position.y
                        }
                    }}
                    microIcon={microIcon}/>
                {this.state.widgets.utility.quote.active === true
                    ? <WidgetQuote
                        defaultProps={defaultProps}
                        copyToClipboard={copyToClipboard}
                        quotes={quotes}
                        position={{
                            x: this.state.widgets.utility.quote.position.x,
                            y: this.state.widgets.utility.quote.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.quote.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.translator.active === true
                    ? <WidgetTranslator
                        defaultProps={defaultProps}
                        randColor={randColor}
                        copyToClipboard={copyToClipboard}
                        grep={grep}
                        mergePunctuation={mergePunctuation}
                        randSentence={randSentence}
                        sortSelect={sortSelect}
                        position={{
                            x: this.state.widgets.utility.translator.position.x,
                            y: this.state.widgets.utility.translator.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.translator.drag.disabled}
                        brailleDictionary={brailleDictionary}
                        brailleFromDictionary={brailleFromDictionary}
                        uwuDictionary={uwuDictionary}
                        uwuEmoticons={uwuEmoticons}
                        emojifyDictionary={emojifyDictionary}
                        matchAll={matchAll}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        smallIcon={smallIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.googletranslator.active === true
                    ? <WidgetGoogleTranslator
                        defaultProps={defaultProps}
                        randColor={randColor}
                        copyToClipboard={copyToClipboard}
                        randSentence={randSentence}
                        position={{
                            x: this.state.widgets.utility.googletranslator.position.x,
                            y: this.state.widgets.utility.googletranslator.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.googletranslator.drag.disabled}
                        languages={languages}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        smallIcon={smallIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.calculator.active === true
                    ? <WidgetCalculator
                        defaultProps={defaultProps}
                        copyToClipboard={copyToClipboard}
                        position={{
                            x: this.state.widgets.utility.calculator.position.x,
                            y: this.state.widgets.utility.calculator.position.y
                        }}
                        positionPopout={{
                            expandinput: {
                                x: this.state.widgets.utility.calculator.popouts.expandinput.position.x,
                                y: this.state.widgets.utility.calculator.popouts.expandinput.position.y
                            }
                        }}
                        dragDisabled={this.state.widgets.utility.calculator.drag.disabled}
                        medIcon={medIcon}
                        operation={operation}/>
                    : <></>}
                {this.state.widgets.utility.weather.active === true
                    ? <WidgetWeather
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.weather.position.x,
                            y: this.state.widgets.utility.weather.position.y
                        }}
                        positionPopout={{
                            searchhelp: {
                                x: this.state.widgets.utility.weather.popouts.searchhelp.position.x,
                                y: this.state.widgets.utility.weather.popouts.searchhelp.position.y
                            }
                        }}
                        dragDisabled={this.state.widgets.utility.weather.drag.disabled}
                        smallIcon={smallIcon}
                        medIcon={medIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.snake.active === true
                    ? <WidgetSnake
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.games.snake.position.x,
                            y: this.state.widgets.games.snake.position.y
                        }}
                        dragDisabled={this.state.widgets.games.snake.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.timeconversion.active === true
                    ? <WidgetTimeConversion
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.timeconversion.position.x,
                            y: this.state.widgets.utility.timeconversion.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.timeconversion.drag.disabled}
                        sortSelect={sortSelect}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.spreadsheet.active === true
                    ? <WidgetSpreadsheet
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.spreadsheet.position.x,
                            y: this.state.widgets.utility.spreadsheet.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.spreadsheet.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
            </div>
        );
    };
};
/// Widget template
/*
class Widget[] extends Component{
    render(){
        return(
            <Draggable 
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("[]")}
                onStop={() => this.props.defaultProps.dragStop("[]")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("[]", "[WIDGET TYPE]", data.x, data.y)}
                cancel=""
                bounds="parent">
                <div id="[]-widget"
                    className="widget">
                    <div id="[]-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle *
                        <span id="[]-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar *
                        <section className="hotbar">
                            {/* Reset Position *
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("[]", "resetPosition", "[WIDGET TYPE]")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen *
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("[]", "fullscreen", "[WIDGET TYPE]")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                    </div>
                </div>
            </Draggable>
        );
    };
};
*/


//////////////////// Render to page ////////////////////
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <div id="App">
        <Widgets/>
    </div>
);