/*  Template Guide - Part 2/4
1. Add the widget to the matching object [widgetsSpecial, widgetsUtility, widgetsGames, widgetsFun]
   EX1.
   widgets[WIDGET TYPE] = {
        ...[all other widgets],
        '[WIDGET NAME UPPER]': {
            name: '[any display name]',
            popouts [optional]: {
                [POPOUT NAME IN STATE]: { position: { x: [desired x], y: [desired y]] } }
            }
        },
   }

   EX2.
   widgetsUtility = {
        ...[all other widgets],
        'AnimeSearcher': { name: 'Anime Searcher 9000' },
   }

   EX3.
   widgetsUtility = {
        ...[all other widgets],
        'AnimeSearcher': {
            name: 'Anime Searcher 9000',
            popouts: {
                animeviewer: { position: { x: 90, y: 90 } }
            }
        },
   }
2. Finished! View the widget by pressing the corresponding widget button in the Show/Hide Widgets popout.
3. Open Guide.jsx.
   Path: ./src/Widgets/Guide.jsx
*/

import React from 'react';

/// v Add new widget here v
export const
    widgetsSpecial = {
        'Guide'     : { name: 'Guide' },
        'Character' : { name: 'Character' },
        'Equipment' : { name: 'Equipment' },
        'Inventory' : { name: 'Inventory' },
    },
    widgetsUtility = {
        'AnimeSearcher'     : { name: 'Anime Searcher' },
        'Battery'           : { name: 'Battery' },
        'Calculator'        : {
            name: 'Calculator',
            popouts: {
                expandinput: { position: { x: 60, y: 115 } }
            }
        },
        'CurrencyConverter' : { name: 'Currency Converter' },
        'DailyPlanner'      : { name: 'Daily Planner' },
        'GoogleTranslator'  : { name: 'Google Translator' },
        'ImageColorPicker'  : { name: 'Image Color Picker' },
        'MusicPlayer'       : { name: 'Music Player' },
        'QRCode'            : { name: 'QR Code' },
        'Quote'             : { name: 'Quote' },
        'Spreadsheet'       : { name: 'Spreadsheet' },
        'TimeConversion'    : { name: 'Time Conversion' },
        'Translator'        : {
            name: 'Translator',
            popouts: {
                replace:       { position: { x: 50, y: 74 } },
                reverse:       { position: { x: 90, y: 74 } },
                casetransform: { position: { x: 90, y: 74 } }
            }
        },
        'Weather'           : {
            name: 'Weather',
            popouts: {
                searchhelp: { position: { x: 12, y: 70 } }
            }
        },
        'Motivation'        : { name: 'Motivation' },
    },
    widgetsGames   = {
        'Breakout'         : { name: 'Breakout' },
        'DerivativeDomain' : { name: 'Derivative Domain' },
        'Chess'            : { name: 'Chess' },
        'CircleBeat'       : { name: 'Circle Beat' },
        'ColorMemory'      : { name: 'Color Memory' },
        'Minesweeper'      : { name: 'Minesweeper' },
        'RockPaperScissor' : { name: 'Rock Paper Scissor' },
        'SimonGame'        : {
            name: 'Simon Game',
            popouts: {
                settings: { position: { x: 105, y: 290 } }
            }
        },
        'Snake'            : {
            name: 'Snake',
            popouts: {
                settings: { position: { x: 145, y: 325 } }
            }
        },
        'Tetris'           : { name: 'Tetris' },
        'Trivia'           : { name: 'Trivia' },
        'TwentyFortyEight' : { name: '2048' },
        'TypingTest'       : { name: 'Typing Test' },
    },
    widgetsFun     = {
        'AiImageGenerator' : {
            name: 'Ai Image Generator',
            popouts: {
                prompthelp: { position: { x: 230, y: 50 } }
            }
        },
        'DonutAnimation'   : { name: 'Donut Animation' },
        'Facts'            : { name: 'Facts' },
        'Iceberg'          : {
            name: 'Iceberg',
            popouts: {
                viewItem: { position: { x: 560, y: 0 } }
            }
        },
        'PickerWheel'      : { name: 'Picker Wheel' },
        'PokemonSearch'    : {
            name: 'Pokemon Search',
            popouts: {
                settings: { position: { x: 15, y: 85 } }
            }
        },
        'Sticker'          : { name: 'Sticker' },
    };

export const
    widgetsSpecialLookup = {},
    widgetsUtilityLookup = {},
    widgetsGamesLookup   = {},
    widgetsFunLookup     = {};

/* eslint-disable */
const specialModules = import.meta.glob('./Widgets/*.jsx');
const utilityModules = import.meta.glob('./Widgets/Utility/*.jsx');
const gamesModules   = import.meta.glob('./Widgets/Games//**/*.jsx');
const funModules     = import.meta.glob('./Widgets/Fun/*.jsx');
/* eslint-enable */

const widgetTypes = {
    'Special' : [specialModules, widgetsSpecialLookup],
    'Utility' : [utilityModules, widgetsUtilityLookup],
    'Games'   : [gamesModules, widgetsGamesLookup],
    'Fun'     : [funModules, widgetsFunLookup]
};

for (let type in widgetTypes) {
    const currentType = widgetTypes[type];
    
    for (const [path, loader] of Object.entries(currentType[0])) {
        const name = path.split('/').pop().replace('.jsx', '');
        currentType[1][name] = React.lazy(loader);
    };
};

export let classStack = '';

export const
    addClassStack = (newClass) => {
        classStack += `${newClass} `;
    },
    removeClassStack = (removeClass) => {
        const regexRemove = new RegExp(`\\b${removeClass}\\b\\s`);
        classStack = classStack.replace(regexRemove, '');
    };

export let decorationValue = '';

export const setDecorationValue = (value) => {
    decorationValue = value;
};

export let currentHour = new Date().getHours();

export const setCurrentHour = (hour) => {
    currentHour = hour;
};

export const
    microIcon    = '0.6em',
    smallIcon    = '0.88em',
    smallMedIcon = '1.2em',
    medIcon      = '4em',
    largeIcon    = '5em',

    zIndexDefault = 2,
    zIndexDrag    = 5,

    colorRange = 200,

    tricks = [
        'spin', 'flip', 'hinge'
    ],
    textAnimations = [
        'textBobbling 1s 1 cubic-bezier(0.5,220,0.5,-220)',
        'textErratic 1s 1',
        'textGlitch 1s 1 cubic-bezier(0.5,-2000,0.5,2000)',
        'textRotate 1s 1 cubic-bezier(.5,-150,.5,150)'
    ],

    languages = ['Afrikaans', 'af', 'Albanian', 'sq', 'Amharic', 'am', 'Arabic', 'ar', 'Armenian', 'hy', 'Assamese', 'as', 'Azerbaijani (Latin)', 'az', 'Bangla', 'bn', 'Bashkir', 'ba', 'Basque', 'eu', 'Bosnian (Latin)', 'bs', 'Bulgarian', 'bg', 'Cantonese (Traditional)', 'yue', 'Catalan', 'ca', 'Chinese (Literary)', 'lzh', 'Chinese Simplified', 'zh-Hans', 'Chinese Traditional', 'zh-Hant', 'Croatian', 'hr', 'Czech', 'cs', 'Danish', 'da', 'Dari', 'prs', 'Divehi', 'dv', 'Dutch', 'nl', 'English', 'en', 'Estonian', 'et', 'Faroese', 'fo', 'Fijian', 'fj', 'Filipino', 'fil', 'Finnish', 'fi', 'French', 'fr', 'French (Canada)', 'fr-ca', 'Galician', 'gl', 'Georgian', 'ka', 'German', 'de', 'Greek', 'el', 'Gujarati', 'gu', 'Haitian Creole', 'ht', 'Hebrew', 'he', 'Hindi', 'hi', 'Hmong Daw (Latin)', 'mww', 'Hungarian', 'hu', 'Icelandic', 'is', 'Indonesian', 'id', 'Inuinnaqtun', 'ikt', 'Inuktitut', 'iu', 'Inuktitut (Latin)', 'iu-Latn', 'Irish', 'ga', 'Italian', 'it', 'Japanese', 'ja', 'Kannada', 'kn', 'Kazakh', 'kk', 'Khmer', 'km', 'Klingon', 'tlh-Latn', 'Klingon (plqaD)', 'tlh-Piqd', 'Korean', 'ko', 'Kurdish (Central)', 'ku', 'Kurdish (Northern)', 'kmr', 'Kyrgyz (Cyrillic)', 'ky', 'Lao', 'lo', 'Latvian', 'lv', 'Lithuanian', 'lt', 'Macedonian', 'mk', 'Malagasy', 'mg', 'Malay (Latin)', 'ms', 'Malayalam', 'ml', 'Maltese', 'mt', 'Maori', 'mi', 'Marathi', 'mr', 'Mongolian (Cyrillic)', 'mn-Cyrl', 'Mongolian (Traditional)', 'mn-Mong', 'Myanmar', 'my', 'Nepali', 'ne', 'Norwegian', 'nb', 'Odia', 'or', 'Pashto', 'ps', 'Persian', 'fa', 'Polish', 'pl', 'Portuguese (Brazil)', 'pt', 'Portuguese (Portugal)', 'pt-pt', 'Punjabi', 'pa', 'Queretaro Otomi', 'otq', 'Romanian', 'ro', 'Russian', 'ru', 'Samoan (Latin)', 'sm', 'Serbian (Cyrillic)', 'sr-Cyrl', 'Serbian (Latin)', 'sr-Latn', 'Slovak', 'sk', 'Slovenian', 'sl', 'Somali (Arabic)', 'so', 'Spanish', 'es', 'Swahili (Latin)', 'sw', 'Swedish', 'sv', 'Tahitian', 'ty', 'Tamil', 'ta', 'Tatar (Latin)', 'tt', 'Telugu', 'te', 'Thai', 'th', 'Tibetan', 'bo', 'Tigrinya', 'ti', 'Tongan', 'to', 'Turkish', 'tr', 'Turkmen (Latin)', 'tk', 'Ukrainian', 'uk', 'Upper Sorbian', 'hsb', 'Urdu', 'ur', 'Uyghur (Arabic)', 'ug', 'Uzbek (Latin)', 'uz', 'Vietnamese', 'vi', 'Welsh', 'cy', 'Yucatec Maya', 'yua', 'Zulu', 'zu'],
    moneyConversions = ['AED', 'AE', 'AFN', 'AF', 'XCD', 'AG', 'ALL', 'AL', 'AMD', 'AM', 'ANG', 'AN', 'AOA', 'AO', 'AQD', 'AQ', 'ARS', 'AR', 'AUD', 'AU', 'AZN', 'AZ', 'BAM', 'BA', 'BBD', 'BB', 'BDT', 'BD', 'XOF', 'BE', 'BGN', 'BG', 'BHD', 'BH', 'BIF', 'BI', 'BMD', 'BM', 'BND', 'BN', 'BOB', 'BO', 'BRL', 'BR', 'BSD', 'BS', 'NOK', 'BV', 'BWP', 'BW', 'BYR', 'BY', 'BZD', 'BZ', 'CAD', 'CA', 'CDF', 'CD', 'XAF', 'CF', 'CHF', 'CH', 'CLP', 'CL', 'CNY', 'CN', 'COP', 'CO', 'CRC', 'CR', 'CUP', 'CU', 'CVE', 'CV', 'CYP', 'CY', 'CZK', 'CZ', 'DJF', 'DJ', 'DKK', 'DK', 'DOP', 'DO', 'DZD', 'DZ', 'ECS', 'EC', 'EEK', 'EE', 'EGP', 'EG', 'ETB', 'ET', 'EUR', 'FR', 'FJD', 'FJ', 'FKP', 'FK', 'GBP', 'GB', 'GEL', 'GE', 'GGP', 'GG', 'GHS', 'GH', 'GIP', 'GI', 'GMD', 'GM', 'GNF', 'GN', 'GTQ', 'GT', 'GYD', 'GY', 'HKD', 'HK', 'HNL', 'HN', 'HRK', 'HR', 'HTG', 'HT', 'HUF', 'HU', 'IDR', 'ID', 'ILS', 'IL', 'INR', 'IN', 'IQD', 'IQ', 'IRR', 'IR', 'ISK', 'IS', 'JMD', 'JM', 'JOD', 'JO', 'JPY', 'JP', 'KES', 'KE', 'KGS', 'KG', 'KHR', 'KH', 'KMF', 'KM', 'KPW', 'KP', 'KRW', 'KR', 'KWD', 'KW', 'KYD', 'KY', 'KZT', 'KZ', 'LAK', 'LA', 'LBP', 'LB', 'LKR', 'LK', 'LRD', 'LR', 'LSL', 'LS', 'LTL', 'LT', 'LVL', 'LV', 'LYD', 'LY', 'MAD', 'MA', 'MDL', 'MD', 'MGA', 'MG', 'MKD', 'MK', 'MMK', 'MM', 'MNT', 'MN', 'MOP', 'MO', 'MRO', 'MR', 'MTL', 'MT', 'MUR', 'MU', 'MVR', 'MV', 'MWK', 'MW', 'MXN', 'MX', 'MYR', 'MY', 'MZN', 'MZ', 'NAD', 'NA', 'XPF', 'NC', 'NGN', 'NG', 'NIO', 'NI', 'NPR', 'NP', 'NZD', 'NZ', 'OMR', 'OM', 'PAB', 'PA', 'PEN', 'PE', 'PGK', 'PG', 'PHP', 'PH', 'PKR', 'PK', 'PLN', 'PL', 'PYG', 'PY', 'QAR', 'QA', 'RON', 'RO', 'RSD', 'RS', 'RUB', 'RU', 'RWF', 'RW', 'SAR', 'SA', 'SBD', 'SB', 'SCR', 'SC', 'SDG', 'SD', 'SEK', 'SE', 'SGD', 'SG', 'SKK', 'SK', 'SLL', 'SL', 'SOS', 'SO', 'SRD', 'SR', 'STD', 'ST', 'SVC', 'SV', 'SYP', 'SY', 'SZL', 'SZ', 'THB', 'TH', 'TJS', 'TJ', 'TMT', 'TM', 'TND', 'TN', 'TOP', 'TO', 'TRY', 'TR', 'TTD', 'TT', 'TWD', 'TW', 'TZS', 'TZ', 'UAH', 'UA', 'UGX', 'UG', 'USD', 'US', 'UYU', 'UY', 'UZS', 'UZ', 'VEF', 'VE', 'VND', 'VN', 'VUV', 'VU', 'YER', 'YE', 'ZAR', 'ZA', 'ZMK', 'ZM', 'ZWD', 'ZW'],
    sentencesHorror = [
        'Hello',
        'Why don\'t you ever check under your bed for people like me?',
        'I know the exact moment you close your eyes.',
        'The quiet moments are when I\'m closest.',
    ],
    /* Dictionary template (need to manually put in ` and change \ => \\)
    /// Dictionary
        const allCharacters = `abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890(){}[]<>!?@#$%^&*~-_+|\\/=:;'',.`
            .split('');
        const convertedCharacters = `[CONVERTED CHARACTERS]`
            .split('');
        let string = '';
        let count = 0;
        for (let i in allCharacters){
            if (/27|53|63/.test(i)){
                count = 0;
                string += '\n';
            } else if ((count % 4 === 0)){
                string += '\n';
            };
            count++;
            if (allCharacters[i] === '''){
                string += `'${allCharacters[i]}': '${convertedCharacters[i]}', `;
            } else {
                string += `'${allCharacters[i]}': '${convertedCharacters[i]}', `;
            };
        };
        string += ''`': '[CONVERTED `]'';
        console.log(string);

    /// Dictionary from
        const dictionary = DICTIONARY;
        let string = '';
        let count = 0;
        for (let i in dictionary){
            if (/27|53|63/.test(i)){
                count = 0;
                string += '\n';
            } else if ((count % 4 === 0)){
                string += '\n';
            };
            count++;
            if (i === '''){
                string += `'${dictionary[i]}': '${i}', `;
            } else {
                string += `'${dictionary[i]}': '${i}', `;
            };
        };
        console.log(string);

    /// Dictionary manually
        'a': '', 'b': '', 'c': '', 'd': '',
        'e': '', 'f': '', 'g': '', 'h': '',
        'i': '', 'j': '', 'k': '', 'l': '',
        'm': '', 'n': '', 'o': '', 'p': '',
        'q': '', 'r': '', 's': '', 't': '',
        'u': '', 'v': '', 'w': '', 'x': '',
        'y': '', 'z': '', ' ': ' ',
        'A': '', 'B': '', 'C': '', 'D': '',
        'E': '', 'F': '', 'G': '', 'H': '',
        'I': '', 'J': '', 'K': '', 'L': '',
        'M': '', 'N': '', 'O': '', 'P': '',
        'Q': '', 'R': '', 'S': '', 'T': '',
        'U': '', 'V': '', 'W': '', 'X': '',
        'Y': '', 'Z': '',
        '1': '', '2': '', '3': '', '4': '',
        '5': '', '6': '', '7': '', '8': '',
        '9': '', '0': '',
        '(': '', ')': '', '{': '', '}': '',
        '[': '', ']': '', '<': '', '>': '',
        '!': '', '?': '', '@': '', '#': '',
        '$': '', '%': '', '^': '', '&': '',
        '*': '', '~': '', '-': '', '_': '',
        '+': '', '|': '', '\\': '', '/': '',
        '=': '', ':': '', ';': '', ''': '',
        ''': '', ',': '', '.': '', '`': ''
    */
    uwuDictionary = {
        'this' : ['dis'],
        'the'  : ['da', 'tha'],
        'that' : ['dat'],
        'my'   : ['mwie'],
        'have' : ['habe', 'habve'],
        'epic' : ['ebic'],
        'worse': ['wose'],
        'you'  : ['uwu', 'u'],
        'of'   : ['ob'],
        'love' : ['wuv']
    },
    uwuEmoticons = [
        'X3', ':3', 'owo', 'uwu', '>3<', 'o3o'
        , '｡◕‿◕｡', '(o´ω｀o)', '(´･ω･`)', '=w='
    ],
    brailleDictionary = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙',
        'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
        'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇',
        'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
        'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
        'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
        'y': '⠽', 'z': '⠵', ' ': '⠀',
        '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲',
        '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦',
        '9': '⠔', '0': '⠴',
        ']': '⠻', '#': '⠼', ')': '⠾', '=': '⠿',
        '_': '⠸', '-': '⠤', ',': '⠠', ';': '⠰',
        ':': '⠱', '!': '⠮', '?': '⠹', '.': '⠨',
        '(': '⠷', '[': '⠪', '@': '⠈', '*': '⠡',
        '/': '⠌', '"': '⠄', "'": '⠐', '\\': '⠳',
        '&': '⠯', '%': '⠩', '^': '⠘', '+': '⠬',
        '<': '⠣', '>': '⠜', '$': '⠫'
    },
    brailleFromDictionary = {
        '⠁': 'a', '⠃': 'b', '⠉': 'c', '⠙': 'd',
        '⠑': 'e', '⠋': 'f', '⠛': 'g', '⠓': 'h',
        '⠊': 'i', '⠚': 'j', '⠅': 'k', '⠇': 'l',
        '⠍': 'm', '⠝': 'n', '⠕': 'o', '⠏': 'p',
        '⠟': 'q', '⠗': 'r', '⠎': 's', '⠞': 't',
        '⠥': 'u', '⠧': 'v', '⠺': 'w', '⠭': 'x',
        '⠽': 'y', '⠵': 'z', ' ': ' ', 
        '⠂': '1', '⠆': '2', '⠒': '3', '⠲': '4',
        '⠢': '5', '⠖': '6', '⠶': '7', '⠦': '8',
        '⠔': '9', '⠴': '0',
        '⠸': '_', '⠤': '-', '⠠': ',', '⠰': ';',
        '⠱': ':', '⠮': '!', '⠹': '?', '⠨': '.',
        '⠷': '(', '⠪': '[', '⠈': '@', '⠡': '*',
        '⠌': '/', '⠄': '"', '⠐': "'", '⠳': '\\',
        '⠯': '&', '⠩': '%', '⠘': '^', '⠬': '+',
        '⠣': '<', '⠜': '>', '⠫': '$', '⠻': ']',
        '⠼': '#', '⠾': ')', '⠿': '='
    },
    moorseCodeDictionary = {
        'a': '.-',    'b': '-...',  'c': '-.-.', 'd': '-..',
        'e': '.',     'f': '..-.',  'g': '--.',  'h': '....',
        'i': '..',    'j': '.---',  'k': '-.-',  'l': '.-..',
        'm': '--',    'n': '-.',    'o': '---',  'p': '.--.',
        'q': '--.-',  'r': '.-.',   's': '...',  't': '-',
        'u': '..-',   'v': '...-',  'w': '.--',  'x': '-..-',
        'y': '-.--',  'z': '--..',  ' ': '/',
        '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
        '9': '----.', '0': '-----'
    },
    moorseCodeFromDictionary = {
        '.-': 'a',    '-...': 'b',  '-.-.': 'c', '-..': 'd',
        '.': 'e',     '..-.': 'f',  '--.': 'g',  '....': 'h',
        '..': 'i',    '.---': 'j',  '-.-': 'k',  '.-..': 'l',
        '--': 'm',    '-.': 'n',    '---': 'o',  '.--.': 'p',
        '--.-': 'q',  '.-.': 'r',   '...': 's',  '-': 't',
        '..-': 'u',   '...-': 'v',  '.--': 'w',  '-..-': 'x',
        '-.--': 'y',  '--..': 'z',  '/': ' ',
        '.----': '1', '..---': '2', '...--': '3', '....-': '4', 
        '.....': '5', '-....': '6', '--...': '7', '---..': '8', 
        '----.': '9', '-----': '0'
    },
    phoneticAlphabetDictionary = {
        'a': 'Alfa',    'b': 'Bravo',    'c': 'Charlie', 'd': 'Delta',
        'e': 'Echo',    'f': 'Foxtrot',  'g': 'Golf',    'h': 'Hotel',
        'i': 'India',   'j': 'Juliett',  'k': 'Kilo',    'l': 'Lima',
        'm': 'Mike',    'n': 'November', 'o': 'Oscar',   'p': 'Papa',
        'q': 'Quebec',  'r': 'Romeo',    's': 'Sierra',  't': 'Tango',
        'u': 'Uniform', 'v': 'Victor',   'w': 'Whiskey', 'x': 'Xray',
        'y': 'Yankee',  'z': 'Zulu',     ' ': '(space)'
    },
    phoneticAlphabetFromDictionary = {
        'Alfa': 'a',    'Bravo': 'b',    'Charlie': 'c', 'Delta': 'd',
        'Echo': 'e',    'Foxtrot': 'f',  'Golf': 'g',    'Hotel': 'h',
        'India': 'i',   'Juliett': 'j',  'Kilo': 'k',    'Lima': 'l',
        'Mike': 'm',    'November': 'n', 'Oscar': 'o',   'Papa': 'p',
        'Quebec': 'q',  'Romeo': 'r',    'Sierra': 's',  'Tango': 't',
        'Uniform': 'u', 'Victor': 'v',   'Whiskey': 'w', 'Xray': 'x',
        'Yankee': 'y',  'Zulu': 'z',     '(space)': ' '
    },
    mirrorWrittingDictionary = {
        'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 
        'e': 'ɘ', 'f': 'ʇ', 'g': 'ϱ', 'h': 'ʜ', 
        'i': 'i', 'j': 'į', 'k': 'ʞ', 'l': 'l', 
        'm': 'm', 'n': 'n', 'o': 'o', 'p': 'q', 
        'q': 'p', 'r': 'ɿ', 's': 'ƨ', 't': 'Ɉ', 
        'u': 'υ', 'v': 'v', 'w': 'w', 'x': 'x', 
        'y': 'γ', 'z': 'z', ' ': ' ', 
        'A': 'A', 'B': 'ઘ', 'C': 'Ɔ', 'D': 'Ⴇ', 
        'E': 'Ǝ', 'F': 'ᆿ', 'G': 'Ә', 'H': 'H', 
        'I': 'I', 'J': 'Ⴑ', 'K': 'ﻼ', 'L': '⅃', 
        'M': 'M', 'N': 'И', 'O': 'O', 'P': 'Գ', 
        'Q': 'Ϙ', 'R': 'Я', 'S': 'Ƨ', 'T': 'T', 
        'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 
        'Y': 'Y', 'Z': 'Z', 
        '1': 'Ɩ', '2': 'ς', '3': 'Ɛ', '4': 'μ', 
        '5': 'ट', '6': 'მ', '7': '٢', '8': '8', 
        '9': '୧', '0': '0', 
        '(': ')', ')': '(', '{': '}', '}': '{', 
        '[': ']', ']': '[', '<': '>', '>': '<', 
        '!': '!', '?': '⸮', '@': '@', '#': '#', 
        '$': '$', '%': '%', '^': '^', '&': '&', 
        '*': '*', '~': '~', '-': '-', '_': '_', 
        '+': '+', '|': '|', '\\': '/', '/': '\\', 
        '=': '=', ':': ':', ';': ';', '"': '"', 
        "'": "'", ',': ',', '.': '.', '`': '`'
    },
    mirrorWrittingFromDictionary = {
        'ɒ': 'a', 'd': 'b', 'ɔ': 'c', 'b': 'd',
        'ɘ': 'e', 'ʇ': 'f', 'ϱ': 'g', 'ʜ': 'h',
        'i': 'i', 'į': 'j', 'ʞ': 'k', 'l': 'l',
        'm': 'm', 'n': 'n', 'o': 'o', 'q': 'p',
        'p': 'q', 'ɿ': 'r', 'ƨ': 's', 'Ɉ': 't',
        'υ': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
        'γ': 'y', 'z': 'z', ' ': ' ',
        'A': 'A', 'ઘ': 'B', 'Ɔ': 'C', 'Ⴇ': 'D',
        'Ǝ': 'E', 'ᆿ': 'F', 'Ә': 'G', 'H': 'H',
        'I': 'I', 'Ⴑ': 'J', 'ﻼ': 'K', '⅃': 'L',
        'M': 'M', 'И': 'N', 'O': 'O', 'Գ': 'P',
        'Ϙ': 'Q', 'Я': 'R', 'Ƨ': 'S', 'T': 'T',
        'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X',
        'Y': 'Y', 'Z': 'Z',
        'Ɩ': '1', 'ς': '2', 'Ɛ': '3', 'μ': '4',
        'ट': '5', 'მ': '6', '٢': '7', '8': '8',
        '୧': '9', '0': '0',
        ')': '(', '(': ')', '}': '{', '{': '}',
        ']': '[', '[': ']', '>': '<', '<': '>',
        '!': '!', '⸮': '?', '@': '@', '#': '#',
        '$': '$', '%': '%', '^': '^', '&': '&',
        '*': '*', '~': '~', '-': '-', '_': '_',
        '+': '+', '|': '|', '/': '\\', '\\': '/',
        '=': '=', ':': ':', ';': ';', '"': '"',
        "'": "'", ',': ',', '.': '.', '`': '`'
    },
    emojifyDictionary = {
        'actually': ['&#x1F913;&#x261D;&#xFE0F;'],
        'hey':      ['&#x1F44B;'], 'hello': ['&#x1F44B;'],
        'you':      ['&#x1F448;'], 'your': ['&#x1F448;'],
        'like':     ['&#x1F44D;'], 'liked': ['&#x1F44D;'],
        'money':    ['&#x1F4B0;'], 'rich': ['&#x1F4B0;'],
        'run':      ['&#x1F3C3;'], 'running': ['&#x1F3C3;'], 'ran': ['&#x1F3C3;'],
        'house':    ['&#x1F3E0;', '&#x1F3E1;'], 'home': ['&#x1F3E0;', '&#x1F3E1;'],
        'just':     ['&#x261D;&#xFE0F;'],
        'phone':    ['&#x1F4F1;'],
    },
    enchantingTableDictionary = {
        'a': 'ᔑ', 'b': 'ʖ', 'c': 'ᓵ', 'd': '↸', 
        'e': 'ᒷ', 'f': '⎓', 'g': '⊣', 'h': '⍑', 
        'i': '╎', 'j': '⋮', 'k': 'ꖌ', 'l': 'ꖎ', 
        'm': 'ᒲ', 'n': 'リ', 'o': '𝙹', 'p': '!¡', 
        'q': 'ᑑ', 'r': '∷', 's': 'ᓭ', 't': 'ℸ', 
        'u': '⚍', 'v': '⍊', 'w': '∴', 'x': '̣/', 
        'y': '||', 'z': '⨅', ' ': ' '
    },
    enchantingTableFromDictionary = {
        'ᔑ': 'a', 'ʖ': 'b', 'ᓵ': 'c', '↸': 'd',
        'ᒷ': 'e', '⎓': 'f', '⊣': 'g', '⍑': 'h',
        '╎': 'i', '⋮': 'j', 'ꖌ': 'k', 'ꖎ': 'l',
        'ᒲ': 'm', 'リ': 'n', '𝙹': 'o', '!¡': 'p',
        'ᑑ': 'q', '∷': 'r', 'ᓭ': 's', 'ℸ': 't',
        '⚍': 'u', '⍊': 'v', '∴': 'w', '̣/': 'x',
        '||': 'y', '⨅': 'z', ' ': ' '
    },
    cunnyCodeDictionary = {
        'a': '&#128557;&#128162;', 'b': '&#128162;&#128557;&#128557;&#128557;', 'c': '&#128162;&#128557;&#128162;&#128557;', 'd': '&#128162;&#128557;&#128557;',
        'e': '&#128557;', 'f': '&#128557;&#128557;&#128162;&#128557;', 'g': '&#128162;&#128162;&#128557;', 'h': '&#128557;&#128557;&#128557;&#128557;',
        'i': '&#128557;&#128557;', 'j': '&#128557;&#128162;&#128162;&#128162;', 'k': '&#128162;&#128557;&#128162;', 'l': '&#128557;&#128162;&#128557;&#128557;',
        'm': '&#128162;&#128162;', 'n': '&#128162;&#128557;', 'o': '&#128162;&#128162;&#128162;', 'p': '&#128557;&#128162;&#128162;&#128557;',
        'q': '&#128162;&#128162;&#128557;&#128162;', 'r': '&#128557;&#128162;&#128557;', 's': '&#128557;&#128557;&#128557;', 't': '&#128162;',
        'u': '&#128557;&#128557;&#128162;', 'v': '&#128557;&#128557;&#128557;&#128162;', 'w': '&#128557;&#128162;&#128162;', 'x': '&#128162;&#128557;&#128557;&#128162;',
        'y': '&#128162;&#128557;&#128162;&#128162;', 'z': '&#128162;&#128162;&#128557;&#128557;', ' ': '',
        '1': '&#128557;&#128162;&#128162;&#128162;&#128162;', '2': '&#128557;&#128557;&#128162;&#128162;&#128162;', '3': '&#128557;&#128557;&#128557;&#128162;&#128162;', '4': '&#128557;&#128557;&#128557;&#128557;&#128162;',
        '5': '&#128557;&#128557;&#128557;&#128557;&#128557;', '6': '&#128162;&#128557;&#128557;&#128557;&#128557;', '7': '&#128162;&#128162;&#128557;&#128557;&#128557;', '8': '&#128162;&#128162;&#128162;&#128557;&#128557;',
        '9': '&#128162;&#128162;&#128162;&#128162;&#128557;', '0': '&#128162;&#128162;&#128162;&#128162;&#128162;',
        '(': '&#128162;&#128557;&#128162;&#128162;&#128557;', ')': '&#128162;&#128557;&#128162;&#128162;&#128557;&#128162;', '{': '&#128162;&#128162;&#128162;&#128557;&#128162;&#128557;', '}': '&#128162;&#128162;&#128162;&#128557;&#128557;&#128162;',
        '[': '&#128162;&#128557;&#128557;&#128162;&#128557;&#128557;', ']': '&#128162;&#128557;&#128557;&#128162;&#128162;&#128557;', '<': '&#128557;&#128557;&#128557;&#128557;&#128162;&#128162;', '>': '&#128162;&#128162;&#128557;&#128557;&#128557;&#128557;',
        '!': '&#128162;&#128557;&#128162;&#128557;&#128162;&#128162;', '?': '&#128557;&#128557;&#128162;&#128162;&#128557;&#128557;', '@': '&#128557;&#128162;&#128162;&#128557;&#128162;&#128557;', '#': '&#128557;&#128557;&#128557;&#128162;&#128557;&#128162;',
        '$': '&#128557;&#128557;&#128557;&#128162;&#128557;&#128557;&#128162;', '%': '&#128162;&#128557;&#128557;&#128162;&#128557;&#128162;', '^': '&#128162;&#128162;&#128162;&#128557;&#128162;&#128162;&#128162;', '&': '&#128557;&#128162;&#128557;&#128557;&#128557;',
        '*': '&#128557;&#128162;&#128557;&#128162;&#128162;', '~': '&#128557;&#128557;&#128557;&#128162;&#128162;&#128162;', '-': '&#128162;&#128557;&#128557;&#128557;&#128557;&#128162;', '_': '&#128557;&#128557;&#128162;&#128162;&#128557;&#128162;',
        '+': '&#128557;&#128162;&#128557;&#128162;&#128557;', '|': '&#128162;&#128162;&#128162;&#128557;&#128162;', '\\': '&#128162;&#128557;&#128557;&#128162;&#128162;', '/': '&#128162;&#128557;&#128557;&#128162;&#128557;',
        '=': '&#128162;&#128557;&#128557;&#128557;&#128162;', ':': '&#128162;&#128162;&#128162;&#128557;&#128557;&#128557;', ';': '&#128162;&#128557;&#128162;&#128557;&#128162;&#128557;', '"': '&#128557;&#128162;&#128557;&#128557;&#128162;&#128557;',
        "'": '&#128557;&#128162;&#128162;&#128162;&#128162;&#128557;', ',': '&#128162;&#128162;&#128557;&#128557;&#128162;&#128162;', '.': '&#128557;&#128162;&#128557;&#128162;&#128557;&#128162;', '`': '&#128557;&#128557;&#128162;&#128162;&#128162;&#128162;',
        'Ä': '&#128557;&#128162;&#128557;&#128162;', 'Æ': '&#128557;&#128162;&#128557;&#128162;', 'Ą': '&#128557;&#128162;&#128557;&#128162;', 
        'À': '&#128557;&#128162;&#128162;&#128557;&#128162;', 'Å': '&#128557;&#128162;&#128162;&#128557;&#128162;', 
        'Ç': '&#128162;&#128557;&#128162;&#128557;&#128557;', 'Ĉ': '&#128162;&#128557;&#128162;&#128557;&#128557;', 'Ć': '&#128162;&#128557;&#128162;&#128557;&#128557;', 
        'Š': '&#128162;&#128162;&#128162;&#128162;', 'Ĥ': '&#128162;&#128162;&#128162;&#128162;', 
        'Ð': '&#128557;&#128557;&#128162;&#128162;&#128557;',
        'Ś': '&#128557;&#128557;&#128557;&#128162;&#128557;&#128557;&#128557;',
        'È': '&#128557;&#128162;&#128557;&#128557;&#128162;', 'Ł': '&#128557;&#128162;&#128557;&#128557;&#128162;', 
        'É': '&#128557;&#128557;&#128162;&#128557;&#128557;', 'Đ': '&#128557;&#128557;&#128162;&#128557;&#128557;', 'Ę': '&#128557;&#128557;&#128162;&#128557;&#128557;', 
        'Ĝ': '&#128162;&#128162;&#128557;&#128162;&#128557;',
        'Ĵ': '&#128557;&#128162;&#128162;&#128162;&#128557;',
        'Ź': '&#128162;&#128162;&#128557;&#128557;&#128162;&#128557;',
        'Ñ': '&#128162;&#128162;&#128557;&#128162;&#128162;', 'Ń': '&#128162;&#128162;&#128557;&#128162;&#128162;', 
        'Ö': '&#128162;&#128162;&#128162;&#128557;', 'Ø': '&#128162;&#128162;&#128162;&#128557;', 'Ó': '&#128162;&#128162;&#128162;&#128557;', 
        'Ŝ': '&#128557;&#128557;&#128557;&#128162;&#128557;',
        'Þ': '&#128557;&#128162;&#128162;&#128557;&#128557;',
        'Ü': '&#128557;&#128557;&#128162;&#128162;', 'Ŭ': '&#128557;&#128557;&#128162;&#128162;',
        'Ż': '&#128162;&#128162;&#128557;&#128557;&#128162;',
        '😭': '&#128557;&#128557;&#128557;&#128557;&#128557;&#128557;', '💢': '&#128162;&#128162;&#128162;&#128162;&#128162;&#128162;', '🦀': '&#128557;&#128162;&#128557;&#128162;&#128557;&#128557;'
    },
    cunnyCodeFromDictionary = {
        '😭💢': 'a', '💢😭😭😭': 'b', '💢😭💢😭': 'c', '💢😭😭': 'd',
        '😭': 'e', '😭😭💢😭': 'f', '💢💢😭': 'g', '😭😭😭😭': 'h',
        '😭😭': 'i', '😭💢💢💢': 'j', '💢😭💢': 'k', '😭💢😭😭': 'l',
        '💢💢': 'm', '💢😭': 'n', '💢💢💢': 'o', '😭💢💢😭': 'p',
        '💢💢😭💢': 'q', '😭💢😭': 'r', '😭😭😭': 's', '💢': 't',
        '😭😭💢': 'u', '😭😭😭💢': 'v', '😭💢💢': 'w', '💢😭😭💢': 'x',
        '💢😭💢💢': 'y', '💢💢😭😭': 'z', 
        '😭💢💢💢💢': '1', '😭😭💢💢💢': '2', '😭😭😭💢💢': '3', '😭😭😭😭💢': '4',
        '😭😭😭😭😭': '5', '💢😭😭😭😭': '6', '💢💢😭😭😭': '7', '💢💢💢😭😭': '8',
        '💢💢💢💢😭': '9', '💢💢💢💢💢': '0',
        '💢😭💢💢😭': '(', '💢😭💢💢😭💢': ')', '💢💢💢😭💢😭': '{', '💢💢💢😭😭💢': '}',
        '💢😭😭💢😭😭': '[', '💢😭😭💢💢😭': ']', '😭😭😭😭💢💢': '<', '💢💢😭😭😭😭': '>',
        '💢😭💢😭💢💢': '!', '😭😭💢💢😭😭': '?', '😭💢💢😭💢😭': '@', '😭😭😭💢😭💢': '#',
        '😭😭😭💢😭😭💢': '$', '💢😭😭💢😭💢': '%', '💢💢💢😭💢💢💢': '^', '😭💢😭😭😭': '&',
        '😭💢😭💢💢': '*', '😭😭😭💢💢💢': '~', '💢😭😭😭😭💢': '-', '😭😭💢💢😭💢': '_',
        '😭💢😭💢😭': '+', '💢💢💢😭💢': '|', '💢😭😭💢💢': '\\', '💢😭😭💢😭': '/',
        '💢😭😭😭💢': '=', '💢💢💢😭😭😭': ':', '💢😭💢😭💢😭': ';', '😭💢😭😭💢😭': '"',
        '😭💢💢💢💢😭': "'", '💢💢😭😭💢💢': ',', '😭💢😭💢😭💢': '.', '😭😭💢💢💢💢': '`',
        '😭💢😭💢': 'Ą', '😭💢💢😭💢': 'Å', '💢😭💢😭😭': 'Ć', '💢💢💢💢': 'Ĥ',
        '😭😭💢💢😭': 'Ð', '😭😭😭💢😭😭😭': 'Ś', '😭💢😭😭💢': 'Ł', '😭😭💢😭😭': 'Ę',
        '💢💢😭💢😭': 'Ĝ', '😭💢💢💢😭': 'Ĵ', '💢💢😭💢💢': 'Ń', '💢💢💢😭': 'Ó',
        '😭😭😭💢😭': 'Ŝ', '😭💢💢😭😭': 'Þ', '😭😭💢💢': 'Ŭ', '💢💢😭😭💢': 'Ż',
        '😭😭😭😭😭😭': '😭', '💢💢💢💢💢💢': '💢', '😭💢😭💢😭😭': '🦀'
    },
    aronaMessages = {
        greetings: [
            [`Hello, ${window.username}!`, 32],
            [`Good ${(currentHour <= 11)
                ? 'morning'
                : (currentHour <= 16)
                    ? 'afternoon'
                    : 'evening'}, ${window.username}!`, 31],
            [`How are you doing today, ${window.username}?`, 2],
            [`What can I do for you today, ${window.username}?`, 3],
            [`Let's do our best today, ${window.username}!`, 12]
        ],
        encode: [
            ['Message encoded!', 12],
            ['Let me know if you need anything else encoded.', 13],
            ['Heehee, &#128557; is so funny looking.', 32],
            ['Did I do a good job?', 25],
            ['Encoding messages is so much fun!', 11],
            ['Can I have some strawberry milk now?', 21],
            ['Who are you sending this message to, Sensei?', 2]
        ],
        encodeError: [
            ['S-Something went wrong!', 28],
            ['These characters were too hard for Arona to encode...', 30],
            ['Sorry, Sensei... Arona made an oopsie...', 18],
            ['Senseiii... these characters are too hard to encode.', 24],
            ['Sorry, Sensei... I tried.', 10]
        ],
        decode: [
            ['Message decoded!', 12],
            ["I'll be here if you need to decode anything else.", 13],
            ['I wonder why &#128557; and &#128162; were used to decode these messages.', 24],
            ['How did I do?', 25],
            ['What does it say?', 22],
            ['Decoding these messages is like opening a fortune cookie, heehee...', 23],
            ['Who is this message from, Sensei?', 2]
        ],
        decodeError: [
            ['You need to paste your Cunny Code into the input field first, then I can decode it for you!', 4]
        ],
        swap: [
            ['Swapped!', 12],
            ['I swapped the input and output for you!', 31],
            ['Swapping makes Arona dizzy...', 29],
            ['Round and round you go!', 35],
            ['Would you like to swap places with me, Sensei? I want to try some of the sweets in your world...', 23]
        ],
        name: {
            set: [
                [`Okay! Nice to meet you, ${window.username}!`, 32]
            ],
            empty: [
                ["I don't know what to call you if you don't write it, Sensei.", 24]
            ]
        },
        special: {
            /// Normal
            strawberry_milk: [
                ['I love strawberry milk!<br>Can I have some, Sensei?', 21]
            ],
            how_are_you: [
                [`I'm doing good!<br>I hope you are as well, ${window.username}!`, 32],
            ],
            goodnight: [
                ['Goodnight, Sensei...', 34],
            ],
            goodbye: [
                ["Aww... You're leaving already, Sensei? I wanted to spend more time with you...", 24],
            ],
            /// Memey
            uoh: [
                ["What are you uoh'ing at, Sensei?", 2],
            ],
            cunny: [
                ['Am I cunny, Sensei?', 31],
            ],
            cute_and_funny: [
                ['Is Arona cute and funny?', 31],
            ],
            correction: [
                ["P-Please don't correct me, Sensei!<br>I've been good, I promise...!", 18],
            ],
            kms: [
                [`Please don't do that, ${window.username}! Arona would be lonely without you...`, 28],
            ],
            seggs: [
                ['S-S-S-Se...!?', 17],
            ],
            sixty_nine: [
                ['Why does everybody say 69 is a nice number, Sensei?', 2],
            ],        
            /// First public cunny code message
            /// https://x.com/SethC1995/status/1839472034721456176
            first_message: [
                ["The first Cunny Code message was sent on September 26th, 2024 by Seth-sensei. It asked the question: 'Do you know Cunny Code?'", 31],
            ],
            /// First person to crack the cunny code before the encoder/decoder was released
            /// https://x.com/Roxas13thXIII/status/1839909996383088696
            first_decoder: [
                ["The first person to decode Cunny Code before this tool was released was Haise-sensei on September 28th, 2024.<br>I heard he's a big fan of <img src='/resources/translator/cunny-code/kisaki-ball.webp' style='height:40px; vertical-align:middle;' title='Kisaki' alt='Kisaki' loading='lazy' decoding='async'>!", 31],
            ],
            /// Emoji
            sob: [
                ['Why are you sobbing, Sensei?', 24],
            ],
            anger: [
                ["Y-You're not mad at me, are you?", 15],
            ],
            kani: [
                ["You talk about &#129408; a lot, Sensei.<br>Is it because it's yummy?", 23],
            ],
            /// Responses to sensei complimenting/talking about Arona
            arona_cute: [
                ["I-I'm not <em>that</em> cute, hehe...", 13],
            ],
            arona_cunny: [
                ["Yay! I'm cunny!", 12],
            ],
            arona_cute_and_funny: [
                ['Yay! Arona is cute and funny!', 11],
            ],
            arona_breedable: [
                ['I-I-I-I am...?', 16],
            ],
            arona_best: [
                ['Aww... Thank you, Sensei!', 32],
            ],
            arona_love: [
                [`I love you, too, ${window.username}!`, 11],
            ],
            /// Responses to sensei being mean
            arona_hate: [
                ["Y-You don't really mean that, do you...?", 19],
            ],
            arona_dumb: [
                ['A-Am not!<br>Stop being mean!', 5],
            ],
            arona_sucks: [
                ['Quit being mean, Sensei!', 14],
            ],
            arona_smells: [
                ["N-No I don't!<br>I had a shower before you got here!", 18],
            ],
            arona_smelly: [
                ['A-Am not!<br>I had a shower before you got here!', 18],
            ],
            /// Apology response
            arona_sorry: [
                ['Okay... I forgive you, Sensei!', 13]
            ],
            /// General response with Arona
            arona: {
                encode: [
                    ['What did you write about me?', 2],
                ],
                decode: [
                    ['What does it say about me?', 2]
                ],
            },
        },
        /// Message displayed after Sensei is mean to Arona 5 times
        quit: [
            ["That's it! I'm done helping you, you big meanie!!", 6],
        ],
        /// Messages for copying output
        copy: {
            success: [
                ['Copied!', 12],
                ['I just copied the text to your clipboard!', 32],
                ["Copi--...huh? Ah! I-I wasn't looking at your clipboard history, I swear!", 28],
                ["Done! Make sure you don't lose it now!", 31],
                ["You're ready to share!", 20]
            ],
            fail: [
                ["I-I don't know why, but I couldn't copy the text to your clipboard... You'll have to do it manually. Sorry, Sensei...", 30]
            ],
            empty: [
                ['You need to encode or decode something first before I can copy it to your clipboard.', 26]
            ]
        },
        /// Messages displayed upon idle (no encode/decode/help/typing/mouse movement)
        idle: [
            ['Are you still there, Sensei?', 2],
            ['Where did you go, Sensei?', 18],
            ['I guess Sensei fell asleep...', 10],
            ["I'm bored, Sensei...", 24],
            ['Hmm hmm hmm... &#127925;', 33],
            ['Lalala...! &#127926;', 13],
            ['Maybe Sensei left to buy me some more strawberry milk.', 23]
        ],
        idleSleep: [
            ['Me? Doze off? Never... Zzz...'],
            ['Zzz... Strawberry milk... Heeheehee...'],
            ["There's no way I can eat all that..."],
            ['Heehee... So yummy...'],
            ['Heeheehee...'],
            ['Zzz...'],
            ["Sensei, you're so..."],
            ['Sensei... So big...'],
            ["No, Sensei... You can't do that..."],
            ['Zzz... Sensei... Heehee...']
        ],
        idleAwaken: [
            [`Welome back, ${window.username}!`, 11],
            ["Sensei! I've been waiting for you!", 12],
            ['Ah! Sensei! Did you bring me back anything yummy!?', 21],
            ['I was lonely without you, Sensei...', 24],
            ["Ah! I-I wasn't sleeping!<br>I was just resting my eyes!", 18],
        ],
        /// Messages when picking up Arona
        pickup: [
            ['Weeeeee!', 12],
            ['Higher, Sensei! Higher!', 12],
            ["Arona's flying!", 25],
            ['Wow! I can see so much from up here!', 25],
            ["Wah! Please don't drop me, Sensei!", 28]
        ],
        /// Messages when putting Arona back down
        putdown: [
            ['Again! Again!', 12],
            ['That was so much fun!', 25],
            ['That was fun! Thanks for playing with me, Sensei!', 11],
            ['Uh-oh... I think that made Arona dizzy...', 29],
            ['Aww... I wanted you to hold me for just a little longer...', 24]
        ],
        /// Messages displayed when clicking on Arona
        touch: {
            head: [
                ['Heeheehee...', 13]
            ],
            face: [
                ['Is there something on my face?', 2]
            ],
            chest: [
                ["Y-You shouldn't touch Arona there, Sensei!", 18]
            ],
            skirt: [
                ['W-What are you doing with my skirt!?', 28]
            ],
            leg: [
                ['T-That tickles!', 12]
            ],
            shoe: [
                ["Y-You can't take my shoes off, Sensei!<br>I saw what you did to Iori...!", 30]
            ]
        }
    },
    itemRates = {
        'common': {
            rate: .80
        },
        'rare': {
            rate: .15
        },
        'exotic': {
            rate: .04
        },
        'meme': {
            rate: .01
        }
    },
    heartValues = {
        heart1 : 1,
        heart2 : 5,
        heart3 : 10,
        heart4 : 15,
        heart5 : 20,
        heart6 : 25,
        heart7 : 30,
        heart8 : 35,
        heart9 : 40,
        heart10: 45,
        heart11: 50,
        heart12: 55,
        heart13: 60,
    },
    breakoutPatterns = [
        //#region Color guide
        /*
            0 = empty space
            1 = black
            2 = brown
            b = blue
            g = green
            o = orange
            p = pink
            r = red
            v = violet
            y = yellow
        */
        //#endregion
        /// Template
        // `
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        //     0 0 0 0 0 0 0 0 0 0
        // `,
        `
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1 1 1
        `,
        `
            0 0 0 0 0 0 0 0 0 0
            0 1 0 0 1 0 1 1 1 0
            0 1 0 0 1 0 0 1 0 0
            0 1 0 0 1 0 0 1 0 0
            0 1 1 1 1 0 0 1 0 0
            0 1 0 0 1 0 0 1 0 0
            0 1 0 0 1 0 0 1 0 0
            0 1 0 0 1 0 0 1 0 0
            0 1 0 0 1 0 1 1 1 0
            0 0 0 0 0 0 0 0 0 0
        `,
        `
            0 0 r r 0 0 r r 0 0
            0 r 0 0 r r 0 0 r 0
            r 0 0 0 0 0 0 0 0 r
            r 0 0 0 0 0 0 0 0 r
            r 0 0 0 0 0 0 0 0 r
            r 0 0 0 0 0 0 0 0 r
            0 r 0 0 0 0 0 0 r 0
            0 0 r 0 0 0 0 r 0 0
            0 0 0 r 0 0 r 0 0 0
            0 0 0 0 r r 0 0 0 0
        `,
        `
            g g g g g g g g g g
            g g g g g 2 g g g g
            g 2 g g g 2 g 2 g g
            2 2 2 2 g 2 2 2 g 2
            2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 2 2 2
        `,
    ],
    foodTypes = {
        /// Normal
        normal: {
            score: 1
        },
        double: {
            score: 2
        },
        triple: {
            score: 3
        },
        /// Moving
        normalmoving: {
            score: 1,
            moving: true,
            delay: 6
        },
        doublemoving: {
            score: 2,
            moving: true,
            delay: 3
        },
        triplemoving: {
            score: 3,
            moving: true,
            delay: 1
        },
        /// Unique
        bomb: {
            score: 1
        },
    },
    debrisPatterns = [
        /// Draw should fall within the [] side / in Quadrant II
        /// The bottom right of the draw should be [0, -1]
        /// Anything in the () side / in Quadrants I/III/IV will not work
        //                             .
        //              II             .           I
        //     []                      .                   ()
        //       [-3, -3] [-3, -2] [-3, -1] (-3, 0) (-3, 1)
        //       [-2, -3] [-2, -2] [-2, -1] (-2, 0) (-2, 1)
        //       [-1, -3] [-1, -2] [-1, -1] (-1, 0) (-1, 1)
        // . . . [ 0, -3] [ 0, -2] [ 0, -1] ( 0, 0) ( 0, 1) . . .
        //       ( 1, -3) ( 1, -2) ( 1, -1) ( 1, 0) ( 1, 1)
        //       ( 2, -3) ( 2, -2) ( 2, -1) ( 2, 0) ( 2, 1)
        //       ( 3, -3) ( 3, -2) ( 3, -1) ( 3, 0) ( 3, 1)
        //     ()                      .                   ()
        //              III            .           IV
        //                             .
        ///
        /// —
        [ [0, -5], [0, -4], [0, -3], [0, -2], [0, -1] ],
        [ [0, -10], [0, -9], [0, -8], [0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1] ],
        [ [0, -15], [0, -14], [0, -13], [0, -12], [0, -11], [0, -10], [0, -9], [0, -8], [0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1] ],
        /// |
        [ [-4, -1], [-3, -1], [-2, -1], [-1, -1], [0, -1] ],
        [ [-9, -1], [-8, -1], [-7, -1], [-6, -1], [-5, -1], [-4, -1], [-3, -1], [-2, -1], [-1, -1], [0, -1] ],
        [ [-14, -1], [-13, -1], [-12, -1], [-11, -1], [-10, -1], [-9, -1], [-8, -1], [-7, -1], [-6, -1], [-5, -1], [-4, -1], [-3, -1], [-2, -1], [-1, -1], [0, -1] ],
        /// Squares
        [ [-1, -2], [-1, -1],
        [ 0, -2], [ 0, -1] ],
        [ [-2, -3], [-2, -2], [-2, -1],
        [-1, -3], [-1, -2], [-1, -1],
        [ 0, -3], [ 0, -2], [ 0, -1] ],
        [ [-3, -4], [-3, -3], [-3, -2], [-3, -1],
        [-2, -4], [-2, -3], [-2, -2], [-2, -1],
        [-1, -4], [-1, -3], [-1, -2], [-1, -1],
        [ 0, -4], [ 0, -3], [ 0, -2], [ 0, -1] ],
    ],
    motivationVideos = [
        'oth36uDKiD8', 'o3JHNmCud1Q', 'nrFcPe4FixA', 'PATNQ5J2vcw',
        '56vtZsQgAF0', 'KxGRhd_iWuE', 'UhmQOn45E6k',
    ],
    batteryInformation = {
        power     : {
            ultraSmall : {
                capacity : 2050,
                energy   : 7.75,
                examples : [
                    'iPhone <= 8',
                    'small Android <= 2017',
                ],
            },
            small      : {
                capacity : 2650,
                energy   : 10.05,
                examples: [
                    'iPhone mini',
                    'Pixel <= 4',
                    'Galaxy S <= S9',
                ],
            },
            medium     : {
                capacity : 3500,
                energy   : 13.30,
                examples: [
                    'iPhone 11-15',
                    'Galaxy Note <= 10',
                    'Galaxy S10-S20',
                ],
            },
            large      : {
                capacity : 4500,
                energy   : 17.10,
                examples: [
                    'Galaxy S21-S23',
                    'Pixel 6-7',
                    'Galaxy Note 20',
                ],
            },
            XL         : {
                capacity : 5500,
                energy   : 20.90,
                examples: [
                    'Galaxy Ultra',
                    'Pixel Pro',
                    'gaming phone',
                ],
            },
            XXL        : {
                capacity : 6750,
                energy   : 25.65,
                examples: [
                    'Rugged phone',
                    'extreme battery model',
                ],
            },
        },
        powerDraw : {
            idle    : 0.2,
            light   : 1.2,
            medium  : 2.5,
            heavy   : 4.5,
            extreme : 7.5
        }
    },
    operation = '-+/*%',
    punctuation =
        '\\[\\!\\"\\#\\$\\%\\&\\\'\\(\\)'
        + '\\*\\+\\,\\\\\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\['
        + '\\]\\^\\_\\`\\{\\|\\}\\~\\]',
    matchAll = new RegExp('\\s*(\\.{3}|\\w+\\-\\w+|\\w+"(?:\\w+)?|\\w+|[' + punctuation + '])');

export let fetchedData = {
    icebergs  : {},
    items     : {},
    particles : [],
    quotes    : [],
    rps       : {},
    sentences : [],
};

export let isMobile = false;

if ('maxTouchPoints' in navigator) {
    isMobile = navigator.maxTouchPoints > 0;
};

const load = (url) => fetch(url).then((response) => response.json());
const stripComments = (object) => Object.values(object).forEach((value) => delete value['_comment']);

async function fetchData() {
    try {
        const [
            dataIcebergs,
            dataItems,
            dataParticles,
            dataQuotes,
            dataRPS,
            dataSentences,
        ] = await Promise.all([
            load('/data/iceberg.json'),
            load('/data/items.json'),
            load('/data/particles.json'),
            load('/data/quotes.json'),
            load('/data/rps.json'),
            load('/data/sentences.json'),
        ]);

        stripComments(dataItems);
        stripComments(dataIcebergs);

        fetchedData.icebergs = dataIcebergs;
        fetchedData.items = dataItems;
        fetchedData.particles = Object.values(dataParticles);
        fetchedData.quotes = dataQuotes['quotes'];
        fetchedData.rps = dataRPS;
        fetchedData.sentences = dataSentences['sentences'];        
    } catch (error) {
        console.error('Failed to load data:', error);
    };
};

export const dataLoaded = fetchData();

export function getData(type) {
    return fetchedData[type];
};