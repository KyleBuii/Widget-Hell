import DOMPurify from 'dompurify';
import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import { IconContext } from 'react-icons';
import { AiOutlineSetting } from 'react-icons/ai';
import { components } from 'react-select';
import SimpleBar from 'simplebar-react';
import Cursor from './cursor.jsx';
import './index.scss';
import Particle from './particle.jsx';
import WidgetCharacter from './Widgets/Character.jsx';
import WidgetEquipment from './Widgets/Equipment.jsx';
import WidgetAiImageGenerator from './Widgets/Fun/AiImageGenerator.jsx';
import WidgetDonutAnimation from './Widgets/Fun/DonutAnimation.jsx';
import WidgetFacts from './Widgets/Fun/Facts.jsx';
import WidgetPickerWheel from './Widgets/Fun/PickerWheel.jsx';
import WidgetPokemonSearch from './Widgets/Fun/PokemonSearch.jsx';
import WidgetSticker from './Widgets/Fun/Sticker.jsx';
import Widget2048 from './Widgets/Games/2048.jsx';
import WidgetBreakout from './Widgets/Games/Breakout.jsx';
import WidgetChess from './Widgets/Games/Chess.jsx';
import WidgetColorMemory from './Widgets/Games/ColorMemory.jsx';
import WidgetGrindshot from './Widgets/Games/Grindshot/Grindshot.jsx';
import WidgetMinesweeper from './Widgets/Games/Minesweeper.jsx';
import WidgetRockPaperScissor from './Widgets/Games/RockPaperScissor.jsx';
import WidgetSimonGame from './Widgets/Games/SimonGame.jsx';
import WidgetSnake from './Widgets/Games/Snake.jsx';
import WidgetTetris from './Widgets/Games/Tetris.jsx';
import WidgetTrivia from './Widgets/Games/Trivia.jsx';
import WidgetTypingTest from './Widgets/Games/TypingTest.jsx';
import WidgetInventory from './Widgets/Inventory.jsx';
import WidgetAnimeSearcher from './Widgets/Utility/AnimeSearcher.jsx';
import WidgetBattery from './Widgets/Utility/Battery.jsx';
import WidgetCalculator from './Widgets/Utility/Calculator.jsx';
import WidgetCurrencyConverter from './Widgets/Utility/CurrencyConverter.jsx';
import WidgetGoogleTranslator from './Widgets/Utility/GoogleTranslator.jsx';
import WidgetImageColorPicker from './Widgets/Utility/ImageColorPicker.jsx';
import WidgetMusicPlayer from './Widgets/Utility/MusicPlayer.jsx';
import WidgetQRCode from './Widgets/Utility/QRCode.jsx';
import WidgetQuote from './Widgets/Utility/Quote.jsx';
import WidgetSetting from './Widgets/Utility/Setting.jsx';
import WidgetSpreadsheet from './Widgets/Utility/Spreadsheet.jsx';
import WidgetTimeConversion from './Widgets/Utility/TimeConversion.jsx';
import WidgetTranslator from './Widgets/Utility/Translator.jsx';
import WidgetWeather from './Widgets/Utility/Weather.jsx';
import { Fa0 } from 'react-icons/fa6';
import { FaExclamationTriangle, FaExpand } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { IoIosArrowUp } from 'react-icons/io';
import WidgetBulletHell from './Widgets/Games/BulletHell/BulletHell.jsx';


//////////////////// Temp Variables ////////////////////
//#region
let timeoutText;
let intervalHorror;
let color;
let healthDisplay;
let lootDisplay;
let voices;
window.username = 'Anon';
let currentHour = new Date().getHours();
//#endregion


//////////////////// Functions ////////////////////
//#region
function dragStart(what) {
    switch (what) {
        case 'settings':
            document.getElementById(what + '-widget-draggable').style.visibility = 'visible';
            document.getElementById(what + '-widget').style.opacity = '0.5';
            break;
        default:
            document.getElementById(what + '-widget-draggable').style.visibility = 'visible';
            document.getElementById(what + '-widget').style.opacity = '0.5';
            document.getElementById(what + '-widget').style.zIndex = zIndexDrag;
            break;
    };
};
function dragStop(what) {
    switch (what) {
        case 'settings':
            document.getElementById(what + '-widget-draggable').style.visibility = 'hidden';
            document.getElementById(what + '-widget').style.opacity = '1';
            break;
        default:
            document.getElementById(what + '-widget-draggable').style.visibility = 'hidden';
            document.getElementById(what + '-widget').style.opacity = '1';
            document.getElementById(what + '-widget').style.zIndex = zIndexDefault;
            break;
    };
};

function sortSelect(what) {
    what.forEach((value) => {
        value.options.sort((a, b) => {
            return ['Default', 'Auto', 'Any'].indexOf(b.label) - ['Default', 'Auto', 'Any'].indexOf(a.label)
                || a.label.localeCompare(b.label);
        });
    });
};

function mergePunctuation(arr) {
    if (arr.length <= 1) {
        return arr;
    };
    for (let i = 1; i < arr.length; i++) {
        if (/^[^\w('$]+/.test(arr[i])) {
            arr[i-1] += arr[i];
            arr.splice(i, 1);
        } else if (/^[($]+/.test(arr[i])) {
            arr[i] += arr[i+1];
            arr.splice(i+1, 1);
        };
    };
    return arr;
};

function grep(arr, filter) {
    let result = [];
    if (arr.length <= 1) {
        return arr;
    };
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i]||'';
        if (filter ? filter(e) : e) {
            result.push(e);
        };
    };
    return result;
};

function randSentence() {
    return sentences[Math.floor(Math.random() * sentences.length)];
};

async function copyToClipboard(what) {
    if (what !== '') {
        try {
            let dump = document.getElementById('clipboard-dump');
            dump.innerHTML = DOMPurify.sanitize(what);
            await navigator.clipboard.writeText(dump.innerText);
            createPopup('Copied!');
            dump.innerHTML = '';
            return 'success';
        } catch (err) {
            return 'fail';
        };
    };
    return 'empty';
};

function createPopup(text, type = 'normal', randomPosition = false) {
    let widgetContainer = document.getElementById('widget-container');
    let popup = document.createElement('div');
    popup.className = 'popup flex-center';
    let elementText = document.createElement('span');
    elementText.className = 'font medium bold white flex-center column';
    switch (type) {
        case 'gold': {
            let elementAmount = document.createElement('span');
            popup.className += ' gold';
            elementAmount.innerHTML = `&#x1F4B0;+${text}`;
            elementText.innerText = 'Gold bag found!';
            elementText.appendChild(elementAmount);
            break;
        };
        case 'item': {
            switch (lootDisplay.value) {
                case 'destiny2':
                case 'rotmg': {
                    popup = document.createElement('img');
                    popup.className = `popup-image flex-center ${text.rarity}`;
                    popup.src = `/resources/loot/${lootDisplay.value}/${lootDisplay.value}-${text.rarity}.webp`;
                    popup.alt = `${lootDisplay.value} ${text.rarity}`;
                    popup.loading = 'lazy';
                    popup.encoding = 'aync';
                    break;
                };
                default: {
                    let itemImage = document.createElement('img');
                    popup.className += ` ${text.rarity}`;
                    itemImage.src = items[text.rarity][text.name].image;
                    itemImage.alt = text.name;
                    itemImage.loading = 'lazy';
                    itemImage.encoding = 'async';
                    elementText.innerText = 'Item acquired!';
                    elementText.appendChild(itemImage);        
                    break;
                };
            };
            break;
        };
        default: {
            elementText.innerText = text;
            break;
        };
    };
    if (randomPosition) {
        popup.style.left = `${Math.random() * (document.body.clientWidth - 100) + 100}px`;
        popup.style.top = `${Math.random() * (document.body.clientHeight - 100) + 100}px`;
    } else {
        popup.style.left = `${window.mouse.x - 50}px`;
        popup.style.top = `${window.mouse.y + 10}px`;
    };
    popup.appendChild(elementText);
    widgetContainer.append(popup);
    let timeoutAnimation, timeoutRemove;
    window.requestAnimationFrame(() => {
        popup.style.animation = 'fadeIn 1s';
    });
    timeoutAnimation = setTimeout(() => {
        window.requestAnimationFrame(() => {
            popup.style.animation = 'fadeOut 1s';
        });
        timeoutRemove = setTimeout(() => {
            widgetContainer.removeChild(popup);
            clearTimeout(timeoutAnimation);
            clearTimeout(timeoutRemove);    
        }, 900);
    }, 1000);
    popup.onclick = () => {
        clearTimeout(timeoutAnimation);
        clearTimeout(timeoutRemove);
        widgetContainer.removeChild(popup);
    };
};

function formatNumber(number, digits, shouldRound = false) {
    const lookup = [
        { value: 1,    symbol: ''  },
        { value: 1e3,  symbol: 'K' },
        { value: 1e6,  symbol: 'M' },
        { value: 1e9,  symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' }
    ];
    const regexDecimals = new RegExp(`^-?\\d+(?:\\.\\d{0,${digits}})?`);
    const regex = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast(item => number >= item.value);
    if (shouldRound) {
        return (item)
            ? (number / item.value)
                .toFixed(digits)
                .replace(regex, '')
                .concat(item.symbol)
            : '0';
    } else {
        return (item)
            ? (number / item.value)
                .toString()
                .match(regexDecimals)[0]
                .replace(regex, '')
                .concat(item.symbol)
            : '0';
    };
};

function randomItem(amount = 1, rarity) {
    let item, itemKeys, itemRarity, randomItem, randomRarity;
    let totalGold = 0;
    let allItems = [];
    for (let i = 0; i < amount; i++) {
        randomRarity = Math.random();
        if (rarity) {
            itemKeys = Object.keys(items[rarity]);
            itemRarity = rarity;
        } else {
            if (randomRarity < itemRates.common.rate) {
                itemKeys = Object.keys(items.common);
                itemRarity = 'common';
            } else if (randomRarity < (itemRates.common.rate + itemRates.rare.rate)) {
                itemKeys = Object.keys(items.rare);
                itemRarity = 'rare';
            } else if (randomRarity < (itemRates.common.rate + itemRates.rare.rate + itemRates.exotic.rate)) {
                itemKeys = Object.keys(items.exotic);
                itemRarity = 'exotic';
            } else if (randomRarity < (itemRates.common.rate + itemRates.rare.rate + itemRates.exotic.rate + itemRates.meme.rate)) {
                itemKeys = Object.keys(items.meme);
                itemRarity = 'meme';
            };
        };
        randomItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
        if (randomItem !== 'nothing') {
            item = {
                name: randomItem,
                rarity: itemRarity
            };
            if (randomItem === 'gold') {
                item.amount = Math.floor(Math.random() * 20 + 1);
                totalGold += item.amount;
                createPopup(item.amount, 'gold', true);
            } else {
                allItems.push(item);
                createPopup(item, 'item', true);
            };
        };
    };
    if (totalGold !== 0) {
        window.dispatchEvent(new CustomEvent('gold bag', {
            'detail': totalGold
        }));
    };
    if (allItems.length !== 0) {
        window.dispatchEvent(new CustomEvent('new item', {
            'detail': allItems
        }));
    };
};

function renderHearts(health) {
    let elementHearts = [];
    if (healthDisplay.value !== 'none') {
        let currentHealth = health;
        let calculateHearts = [];
        let heartKeys = Object.keys(heartValues);
        let heartIndex = heartKeys.length;
        let currentHeartValue = heartValues[heartKeys[heartIndex - 1]];
        let amount;
        calculating: while (Math.floor(currentHealth) > 0) {
            if (Math.max(currentHealth, currentHeartValue) === currentHealth) {
                switch (healthDisplay.value) {
                    case 'limit5':
                        amount = Math.floor(currentHealth / currentHeartValue);
                        currentHealth -= (amount * currentHeartValue);
                        if (calculateHearts.length === 5) {
                            break calculating;
                        };
                        if (amount > 5 && calculateHearts.length === 0) {
                            amount = 5;
                        } else if (amount > 5) {
                            amount = 5 - calculateHearts.length;
                        };
                        for (let i = amount; i > 0; i--) {
                            calculateHearts.push(heartIndex);
                        };
                        break;
                    default:
                        amount = Math.floor(currentHealth / currentHeartValue);
                        currentHealth -= (amount * currentHeartValue);
                        for (let i = amount; i > 0; i--) {
                            calculateHearts.push(heartIndex);
                        };
                        break;        
                };
            };
            heartIndex--;
            currentHeartValue = heartValues[heartKeys[heartIndex - 1]];
        };
        for (let i = 0; i < calculateHearts.length; i++) {
            if ((calculateHearts[i] === 1) && (healthDisplay.value === 'noredheart')) break; 
            elementHearts.push(<img src={`/resources/hearts/heart${calculateHearts[i]}.webp`}
                alt={`heart${calculateHearts[i]} ${i + 1}`}
                key={`heart${calculateHearts[i]} ${i + 1}`}
                draggable={false}
                loading='lazy'
                decoding='async'/>);
        };
    };
    return elementHearts;
};

function playAudio(audio) {
    let duplicateAudio = audio.cloneNode();
    duplicateAudio.play();
    duplicateAudio.onended = () => {
        duplicateAudio.remove();
    };    
};

function hexToRgb(hex) {
    /// Input Format: #000000
    /// Return Format: [0, 0, 0]
    return hex.replace(
            /^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b
        ).substring(1)
        .match(/.{2}/g)
        .map(x => parseInt(x, 16));
};

function rgbToHex(rgb) {
    /// Input Format: [0, 0, 0]
    /// Return Format: #00000
    return '#' + rgb.map((x) => {
        const hex = x.toString(16);
        return (hex.length === 1) ? '0' + hex : hex;
    }).join('');
};

function calculateBounds(parent, popout) {
    let bounds = {};
    if (document.getElementById(parent) !== null) {
        let sizeParent = document.getElementById(parent).getBoundingClientRect();
        let sizePopout = document.getElementById(popout).getBoundingClientRect();
        bounds = {
            top: -sizePopout.height,
            right: (sizePopout.width < sizeParent.width)
                ? sizeParent.width
                : sizePopout.width - Math.abs(sizeParent.width - sizePopout.width),
            bottom: (sizePopout.height < sizeParent.height)
                ? sizeParent.height
                : sizePopout.height - Math.abs(sizeParent.height - sizePopout.height),
            left: -sizePopout.width
        };
    };
    return bounds;
};
//#endregion


//////////////////// Variables ////////////////////
//#region
//#region Icon
const microIcon = '0.6em';
const smallIcon = '0.88em';
const smallMedIcon = '1.2em';
const medIcon = '4em';
const largeIcon = '5em';
//#endregion
const zIndexDefault = 2;
const zIndexDrag = 5;
const colorRange = 200;
//#region Data
const tricks = ['spin', 'flip', 'hinge'];
const textAnimations = [
    'textBobbling 1s 1 cubic-bezier(0.5,220,0.5,-220)',
    'textErratic 1s 1',
    'textGlitch 1s 1 cubic-bezier(0.5,-2000,0.5,2000)',
    'textRotate 1s 1 cubic-bezier(.5,-150,.5,150)'
];
const languages = ['Afrikaans', 'af', 'Albanian', 'sq', 'Amharic', 'am', 'Arabic', 'ar', 'Armenian', 'hy', 'Assamese', 'as', 'Azerbaijani (Latin)', 'az', 'Bangla', 'bn', 'Bashkir', 'ba', 'Basque', 'eu', 'Bosnian (Latin)', 'bs', 'Bulgarian', 'bg', 'Cantonese (Traditional)', 'yue', 'Catalan', 'ca', 'Chinese (Literary)', 'lzh', 'Chinese Simplified', 'zh-Hans', 'Chinese Traditional', 'zh-Hant', 'Croatian', 'hr', 'Czech', 'cs', 'Danish', 'da', 'Dari', 'prs', 'Divehi', 'dv', 'Dutch', 'nl', 'English', 'en', 'Estonian', 'et', 'Faroese', 'fo', 'Fijian', 'fj', 'Filipino', 'fil', 'Finnish', 'fi', 'French', 'fr', 'French (Canada)', 'fr-ca', 'Galician', 'gl', 'Georgian', 'ka', 'German', 'de', 'Greek', 'el', 'Gujarati', 'gu', 'Haitian Creole', 'ht', 'Hebrew', 'he', 'Hindi', 'hi', 'Hmong Daw (Latin)', 'mww', 'Hungarian', 'hu', 'Icelandic', 'is', 'Indonesian', 'id', 'Inuinnaqtun', 'ikt', 'Inuktitut', 'iu', 'Inuktitut (Latin)', 'iu-Latn', 'Irish', 'ga', 'Italian', 'it', 'Japanese', 'ja', 'Kannada', 'kn', 'Kazakh', 'kk', 'Khmer', 'km', 'Klingon', 'tlh-Latn', 'Klingon (plqaD)', 'tlh-Piqd', 'Korean', 'ko', 'Kurdish (Central)', 'ku', 'Kurdish (Northern)', 'kmr', 'Kyrgyz (Cyrillic)', 'ky', 'Lao', 'lo', 'Latvian', 'lv', 'Lithuanian', 'lt', 'Macedonian', 'mk', 'Malagasy', 'mg', 'Malay (Latin)', 'ms', 'Malayalam', 'ml', 'Maltese', 'mt', 'Maori', 'mi', 'Marathi', 'mr', 'Mongolian (Cyrillic)', 'mn-Cyrl', 'Mongolian (Traditional)', 'mn-Mong', 'Myanmar', 'my', 'Nepali', 'ne', 'Norwegian', 'nb', 'Odia', 'or', 'Pashto', 'ps', 'Persian', 'fa', 'Polish', 'pl', 'Portuguese (Brazil)', 'pt', 'Portuguese (Portugal)', 'pt-pt', 'Punjabi', 'pa', 'Queretaro Otomi', 'otq', 'Romanian', 'ro', 'Russian', 'ru', 'Samoan (Latin)', 'sm', 'Serbian (Cyrillic)', 'sr-Cyrl', 'Serbian (Latin)', 'sr-Latn', 'Slovak', 'sk', 'Slovenian', 'sl', 'Somali (Arabic)', 'so', 'Spanish', 'es', 'Swahili (Latin)', 'sw', 'Swedish', 'sv', 'Tahitian', 'ty', 'Tamil', 'ta', 'Tatar (Latin)', 'tt', 'Telugu', 'te', 'Thai', 'th', 'Tibetan', 'bo', 'Tigrinya', 'ti', 'Tongan', 'to', 'Turkish', 'tr', 'Turkmen (Latin)', 'tk', 'Ukrainian', 'uk', 'Upper Sorbian', 'hsb', 'Urdu', 'ur', 'Uyghur (Arabic)', 'ug', 'Uzbek (Latin)', 'uz', 'Vietnamese', 'vi', 'Welsh', 'cy', 'Yucatec Maya', 'yua', 'Zulu', 'zu'];
const moneyConversions = ['AED', 'AE', 'AFN', 'AF', 'XCD', 'AG', 'ALL', 'AL', 'AMD', 'AM', 'ANG', 'AN', 'AOA', 'AO', 'AQD', 'AQ', 'ARS', 'AR', 'AUD', 'AU', 'AZN', 'AZ', 'BAM', 'BA', 'BBD', 'BB', 'BDT', 'BD', 'XOF', 'BE', 'BGN', 'BG', 'BHD', 'BH', 'BIF', 'BI', 'BMD', 'BM', 'BND', 'BN', 'BOB', 'BO', 'BRL', 'BR', 'BSD', 'BS', 'NOK', 'BV', 'BWP', 'BW', 'BYR', 'BY', 'BZD', 'BZ', 'CAD', 'CA', 'CDF', 'CD', 'XAF', 'CF', 'CHF', 'CH', 'CLP', 'CL', 'CNY', 'CN', 'COP', 'CO', 'CRC', 'CR', 'CUP', 'CU', 'CVE', 'CV', 'CYP', 'CY', 'CZK', 'CZ', 'DJF', 'DJ', 'DKK', 'DK', 'DOP', 'DO', 'DZD', 'DZ', 'ECS', 'EC', 'EEK', 'EE', 'EGP', 'EG', 'ETB', 'ET', 'EUR', 'FR', 'FJD', 'FJ', 'FKP', 'FK', 'GBP', 'GB', 'GEL', 'GE', 'GGP', 'GG', 'GHS', 'GH', 'GIP', 'GI', 'GMD', 'GM', 'GNF', 'GN', 'GTQ', 'GT', 'GYD', 'GY', 'HKD', 'HK', 'HNL', 'HN', 'HRK', 'HR', 'HTG', 'HT', 'HUF', 'HU', 'IDR', 'ID', 'ILS', 'IL', 'INR', 'IN', 'IQD', 'IQ', 'IRR', 'IR', 'ISK', 'IS', 'JMD', 'JM', 'JOD', 'JO', 'JPY', 'JP', 'KES', 'KE', 'KGS', 'KG', 'KHR', 'KH', 'KMF', 'KM', 'KPW', 'KP', 'KRW', 'KR', 'KWD', 'KW', 'KYD', 'KY', 'KZT', 'KZ', 'LAK', 'LA', 'LBP', 'LB', 'LKR', 'LK', 'LRD', 'LR', 'LSL', 'LS', 'LTL', 'LT', 'LVL', 'LV', 'LYD', 'LY', 'MAD', 'MA', 'MDL', 'MD', 'MGA', 'MG', 'MKD', 'MK', 'MMK', 'MM', 'MNT', 'MN', 'MOP', 'MO', 'MRO', 'MR', 'MTL', 'MT', 'MUR', 'MU', 'MVR', 'MV', 'MWK', 'MW', 'MXN', 'MX', 'MYR', 'MY', 'MZN', 'MZ', 'NAD', 'NA', 'XPF', 'NC', 'NGN', 'NG', 'NIO', 'NI', 'NPR', 'NP', 'NZD', 'NZ', 'OMR', 'OM', 'PAB', 'PA', 'PEN', 'PE', 'PGK', 'PG', 'PHP', 'PH', 'PKR', 'PK', 'PLN', 'PL', 'PYG', 'PY', 'QAR', 'QA', 'RON', 'RO', 'RSD', 'RS', 'RUB', 'RU', 'RWF', 'RW', 'SAR', 'SA', 'SBD', 'SB', 'SCR', 'SC', 'SDG', 'SD', 'SEK', 'SE', 'SGD', 'SG', 'SKK', 'SK', 'SLL', 'SL', 'SOS', 'SO', 'SRD', 'SR', 'STD', 'ST', 'SVC', 'SV', 'SYP', 'SY', 'SZL', 'SZ', 'THB', 'TH', 'TJS', 'TJ', 'TMT', 'TM', 'TND', 'TN', 'TOP', 'TO', 'TRY', 'TR', 'TTD', 'TT', 'TWD', 'TW', 'TZS', 'TZ', 'UAH', 'UA', 'UGX', 'UG', 'USD', 'US', 'UYU', 'UY', 'UZS', 'UZ', 'VEF', 'VE', 'VND', 'VN', 'VUV', 'VU', 'YER', 'YE', 'ZAR', 'ZA', 'ZMK', 'ZM', 'ZWD', 'ZW'];
const quotes = [
    //#region
    {
        quote: "You all have a little bit of 'I want to save the world' in you, that's why you're here, in college. I want you to know that it's okay if you only save one person, and it's okay if that person is you."
        , author: 'Some college professor'
    },
    {
        quote: 'Your direction is more important than your speed.'
        , author: 'Richard L. Evans'
    },
    {
        quote: 'All things are difficult before they are easy.'
        , author: 'Thomas Fuller'
    },
    {
        quote: "Your first workout will be bad. Your first podcast will be bad. Your first speech will be bad. Your first video will be bad. Your first ANYTHING will be bad. But you can't make your 100th without making your first."
        , author: ''
    }, 
    {
        quote: 'If you are depressed, you are living in the past. If you are anxious, you are living in the future. If you are at peace, you are living in the present.'
        , author: 'Lao Tzu'
    },
    {
        quote: 'Accept both compliments and criticism. It takes both sun and rain for a flower to grow.'
        , author: ''
    },
    {
        quote: "Every day is an opportunity to improve, even if it is only by 1%. It's not about being invincible, it's about being unstoppable."
        , author: '改善 (Kaizen)'
    },
    {
        quote: 'Start where you are. Use what you have. Do what you can.'
        , author: 'Arthur Ashe'
    },
    {
        quote: "Some days, it's easier. Other days, it's harder. Be it easy or hard, the only way to get there... is to start."
        , author: ''
    },
    {
        quote: 'Never be a prisoner of your past. It was a lesson, not a life sentence.'
        , author: ''
    },
    {
        quote: "Just because it's taking time, doesn't mean it's not happening."
        , author: ''
    },
    {
        quote: "If you aren't willing to look like a foolish beginner, you'll never become a graceful master. Embarrassment is the cost of entry."
        , author: ''
    },
    {
        quote: 'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.'
        , author: 'Thomas Edison'
    },
    {
        quote: 'Was it a bad day? Or was it a bad five minutes that you milked all day?'
        , author: ''
    },
    {
        quote: 'Sometimes it takes ten years to get that one year that changes your life.'
        , author: ''
    },
    {
        quote: "It's not the load that breaks you down, it's the way you carry it."
        , author: 'Lou Holtz'
    },
    {
        quote: 'Care about what other people think and you will always be their prisoner.'
        , author: 'Lao Tzu'
    },
    {
        quote: 'Fear has led to more procrastinations than laziness ever will.'
        , author: 'Ankur Warikoo'
    },
    {
        quote: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking."
        , author: 'Steve Jobs'
    },
    {
        quote: "Don't watch the clock; do what it does. Keep going."
        , author: 'Sam Levenson'
    },
    {
        quote: 'You are free and that is why you are lost.',
        author: 'Franz Kafka'
    },
    {
        quote: "It's hard to hate someone once you understand them."
        , author: 'Lucy Christopher'
    },
    {
        quote: "The sunrise, of course, doesn't care if we watch it or not. It will keep on being beautiful, even if no one bothers to look at it."
        , author: 'Gene Amole'
    },
    {
        quote: 'You’ll stop worrying what others think about you when you realize how seldom they do.'
        , author: 'David Foster Wallace'
    },
    {
        quote: 'Although the world is full of suffering, it is also full of the overcoming of it.'
        , author: 'Helen Keller'
    },
    {
        quote: 'Somewhere, something incredible is waiting to be known.'
        , author: 'Carl Sagan'
    },
    {
        quote: 'We shape clay into a pot, but it is the emptiness inside that holds whatever we want.'
        , author: 'Lao Tzu'
    },
    {
        quote: 'It is during our darkest moments that we must focus to see the light.'
        , author: 'Aristotle Onassis'
    },
    {
        quote: 'You waste years by not being able to waste hours.'
        , author: 'Amor Tversky'
    },
    {
        quote: 'The most common way people give up their power is by thinking they don’t have any.'
        , author: 'Alice Walker'
    },
    {
        quote: "How many people long for that 'past, simpler, and better world,' I wonder, without ever recognizing the truth that perhaps it was they who were simpler and better, and not the world about them?"
        , author: "Drizzt Do'Urden (R. A. Salvatore)"
    },
    {
        quote: 'You only live once, but if you do it right, once is enough.'
        , author: 'Mae West'
    },
    {
        quote: "When people go back in time in movies or books they are often afraid of doing any small thing because it might drastically change the future. Yet people in the present don't realize the small things they do will change the future in ways they can't even imagine."
        , author: '/u/Reichukey'
    },
    {
        quote: "People believe in ghost they never saw, but don't believe in themselves they see everyday."
        , author: ''
    },
    {
        quote: "Once you've accepted your flaws, no one can use them against you."
        , author: 'George R.R. Martin'
    },
    //#endregion
    {
        quote: 'Yet it is far better to light the candle than to curse the darkness.'
        , author: 'W. L. Watkinson'
    },
    {
        quote: 'Creativity is allowing yourself to make mistakes. Art is knowing which ones to keep.'
        , author: 'Scott Adams'
    },
    {
        quote: 'Monkeys can climb. Crickets can leap. Horses can race. Owls can seek. Cheetahs can run. Eagles can fly. People can try. But that’s about it.'
        , author: 'Natsuki'
    },
    {
        quote: 'It takes only one step to overcome your fears. You just need to take one step forward. The rest will come naturally.'
        , author: 'Vincent Adenka'
    }
];
const sentences = [
    'My mum (82F) told me (12M) to do the dishes (16) but I (12M) was too busy playing Fortnite (3 kills) so I (12M) grabbed my controller (DualShock 4) and threw it at her (138kph). She fucking died, and I (12M) went to prison (18 years). While in prison I (12M) incited several riots (3) and assumed leadership of a gang responsible for smuggling drugs (cocaine) into the country. I (12M) also ordered the assassination of several celebrities (Michael Jackson, Elvis Presley and Jeffrey Epstein) and planned a terrorist attack (9/11).'
    , 'So I (74M) was recently hit by a car (2014 Honda) and died. My wife (5F) organized me a funeral (cost $2747) without asking me (74M) at all. I (74M) was unable to make it because I (74M) was dead (17 days). At the funeral I heard my dad (15M) and other family members talking about how they wish I could be there and now I feel bad for not showing up.'
    , 'I think fortnite should add a pregnant female skin. Every kill she gets she slowly gives birth. When in water blood comes out. At 10 kills she gives birth and the baby can be your pet.'
    , 'PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT'    
    , `Twitch should ban the term 'live-streaming.' It's offensive to dead people. My great grandparents are dead and I would like to show them some respect and have twitch ban the term “live-streaming”. It's a slur used against dead people.`
    , "I, an atheist, accidentally said 'oh my g*d' instead of 'oh my science'"
    , 'Darkness blacker than black and darker than dark, I beseech thee, combine with my deep crimson. The time of awakening cometh. Justice, fallen upon the infallible boundary, appear now as an intangible distortions! I desire for my torrent of power a destructive force: a destructive force without equal! Return all creation to cinders, and come from the abyss! Explosion!'    
    , 'Oh, blackness shrouded in light, Frenzied blaze clad in night, In the name of the crimson demons, let the collapse of thine origin manifest. Summon before me the root of thy power hidden within the lands of the kingdom of demise! Explosion!'
    , 'Crimson-black blaze, king of myriad worlds, though I promulgate the laws of nature, I am the alias of destruction incarnate in accordance with the principles of all creation. Let the hammer of eternity descend unto me! Explosion!'    
    , 'O crucible which melts my soul, scream forth from the depths of the abyss and engulf my enemies in a crimson wave! Pierce trough, EXPLOSION!'    
    , "If you ask Rick Astley for a copy of the movie 'UP', he cannot give you it as he can never give you up. But, by doing that, he is letting you down, and thus, is creating something known as the Astley Paradox."
    , "Reddit should rename 'share' to 'spreddit', 'delete' to 'shreddit' and 'karma' to 'creddit'. Yet they haven't. I don't geddit."
    , "The tower of rebellion creeps upon man's world... The unspoken faith displayed before me... The time has come! Now, awaken from your slumber, and by my madness, be wrought! Strike forth, Explosion!"
    , "Glasses are really versatile. First, you can have glasses-wearing girls take them off and suddenly become beautiful, or have girls wearing glasses flashing those cute grins, or have girls stealing the protagonist's glasses and putting them on like, 'Haha, got your glasses!' That's just way too cute! Also, boys with glasses! I really like when their glasses have that suspicious looking gleam, and it's amazing how it can look really cool or just be a joke. I really like how it can fulfill all those abstract needs. Being able to switch up the styles and colors of glasses based on your mood is a lot of fun too! It's actually so much fun! You have those half rim glasses, or the thick frame glasses, everything! It's like you're enjoying all these kinds of glasses at a buffet. I really want Luna to try some on or Marine to try some on to replace her eyepatch. We really need glasses to become a thing in hololive and start selling them for HoloComi. Don't. You. Think. We. Really. Need. To. Officially. Give. Everyone. Glasses?"
    , 'Eggs, Bacon, Grist, Sausage. The cockroaches in your bedroom held you hostage.'
    , 'As a man who has a daughter, you are LITERALLY dedicating at least 20 years of your life simply to raise a girl for another man to enjoy. It is the ULTIMATE AND FINAL SIMP. Think about it logically.'
    , "A rizzler's last thoughts should be of Ohio."
    , "I can't tell you how much I love Azusa. I want to examine her eyes up close, comfort her delicate wings with all of my sanctity, run my fingers through her soft yet perfect-seeming hair. I want to caress her whole body, not leave every centimeter untouched, massage her sweet head, care for her cheeks, touch and admire her toes and fingers while protecting her sacred legs with all my strength and dignity. How I wish to have a single glimpse of holy Azusa before my death, and store that deep in my mind to revoke at the moment of life's end to depart in bliss. Every time I just think of Azusa, if I haven't averted the sight of this goddess, I am filled with eternal happiness and contentment in all ways, so that even in the most difficult times of my life I have a reason to keep going. Every night I lie on my Azusa body pillow, face crying with joy as I replay scenarios of how I would exchange words with holy Azusa. I dream of her with her hands in mine, sitting on a bank of our city's hill, hidden under the night starry sky, our faces close, her eyes closed as I reach for a tender, protective kiss. Every day I step out of my bed just for Azusa. Every day I can't think of anything but Azusa. Every day I live only for Azusa. Come into my care, into my arms, I will heal you, I will take care of you, I will guarantee to fight for you with all my willpower and vitality until my last breath. I love you Azusa!!"
    , `What the fuck did you just fucking say about me, you little perma-freshie? I'll have you know I graduated top of my class in the blade temple, and I've been involved in numerous secret raids on Duke Erisia’s manor, and I have over 300 confirmed grips. I am trained in primadon warfare and I'm the top sniper in the entire summer company. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on all five Luminants, mark my fucking words. You think you can get away with saying that shit to me over Deepwoken? Think again, fucker. As we speak I am contacting my secret network of Voidwalker spies across the Etrean Luminant and your spawn is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fuckng dead, kid. I can be anywhere, anytime, and I can grip you in over seven hundred ways, and that's just with Way of Navae. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the Central Authority and I will use it to its full extent to wipe your miserable ass off the face of the Luminant, you little shit. If only you could have known what unholy retribution your little 'clever' comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking wiped, kiddo.`
    , "My name is Guido Mista. I'm 44 years old. My house is in the southwest section of Naples, where all the slums are, and I have 4 wives. I work as a hitman for Passione, and I get home every day by 4:44 AM at the latest. I smoke 4 packs a day, and I always drink. I'm in bed by 4:44PM, and make sure I get 4 hours of sleep, no matter what. After having a glass of cold beer and doing about 44 minutes of stretches before going to bed, I usually have problems sleeping and I stay up until morning. Just like an elderly, I wake up with fatigue and stress in the morning. I was told there were issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care seek trouble with enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me sadness. Although, if I were to fight I would lose to everyone."
    , 'Honor among thieves is honor under the seas!'
    , "sniff sniff i-is that a BOY I smell? sniff sniff mmm yes I smell it! BOYSMELL!!!! I smell a boy! W-What is a boy doing here?!?! omygosh what am I gonna do?!?! THERE'S A BOY HERE! I'M FREAKING OUT SO MUCH!!!! calm down calm down and take a nice, deep breathe... sniff sniff it smells so good! I love boysmell so much!!!! It makes me feel so amazing. I'm getting tingles all over from the delicious boyscent! It's driving me boyCRAZY!!!!!!"
    , "When you're on a chicken bender grab a box of chicken tenders, bawk ba gawk!"
    , "I don't care what your pronouns are if you spill foundation secrets, consider yourself was/were."
    , 'While he lacked the vocabulary to frame it in modern scientific terms, the man who is credited with the concept that matters composed of atoms from a cosmological perspective is also known as the father of alchemy and creator of toxicology, Paracelsus, or Philippus Aureolus Theophrastus Bombastus von Hohenheim.'
    , 'Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki!'
    , "I am so tired of peeing. I drink the water, which I apparently need to live or something, and then I have to go put the water somewhere else 5 minutes later. I drink the water, I go to a place to un-drink the water, I wash my hands, I leave, and then I have to drink more water. Guess where that water ends up? Not in me! I give the water to my body and like a child it tosses it out and demands more. All hours of the day, all hours of the night no matter what I'm doing my life is interrupted by piss fucking bullshit."
    , "Oh senpai, hey! I didn't know you walked this way. We're right in front of your house? I-I wasn't looking or anything, I just happened to be walking by! It'd be creepy to know where you live, s-stupid! What was I walking by for? OKAY! I had to give you something! L-listen, don't get the wrong idea, I was just up at 4 am cooking like schoolgirls do and it happened to be your favorite and I thought maybe you'd like some since I had extra! BE GRATEFUL! UGHHIUGH! Uhh, how did I know it was your favorite? Well I... aaaAAAAAAAHHH!"
    , "Nice opinion. Just one tiny problem with it. Inspecting your post, it looks like your opinion is different from mine. Boy, let me tell you something. I am the baseline for opinions, any opinion I hold is objectively correct and, as a result, any other opinions are wrong. And guess what? You happen to hold a wrong one. And I hope you know that your opinion is now illegal. I have now contacted the FBI, the CIA, the NSA, the Navy SEALs, the Secret Service and your mom. You'll rot in prison for the rest of your life over this, mark my words you'll be sorry you ever shared your opinions. By the time you're reading this, you're done for boy. Nature will punish you. Humanity will punish you. Supernatural beings will punish you. Space will punish you. Oh yeah, and we decided that just to make sure we'll nuke your house from orbit so there's no chance you can run away and everyone you know will die. It's a small price to pay to remove you're wrong opinion from this world."
    , `I bet these hetero's kiss girls General Gravicius grunts, his hips rapidly slamming his erect donger deep into Shadow's lean muscled frame. Sweat drips from his brow as he moans a quiet prayer before both nuts erupt, turning him into a fountain of cum, launching Shadow at least 5 meters onto the floor. Gravicius smirks at the sight, 'I fuck for God, Exile. Who do you fuck for?`
    , "Sticking out your gyatt for Nerizzler. You're so bau bau. You're so Biboo tax. I just wanna be your Shiori."
    , "Oh look, it's another VTuber trying to make waves in the vast ocean of content creators. Your 'slice of life sea fox' gimmick is about as fresh as week-old sushi. But hey, at least you're consistent - consistently blending into the background like the beige t-shirt of the VTuber world. Your streams are probably as deep as a puddle, but I'm sure your 'deep blue' location makes you feel profound. Keep riding that mediocrity wave, sweetie. Maybe one day you'll actually make a splash."
    , "Hey guys, did you know that in terms of male human and female Pokemon breeding, Vaporeon is the most compatible Pokemon for humans? Not only are they in the field egg group, which is mostly comprised of mammals, Vaporeon are an average of 3”03’ tall and 63.9 pounds, this means they’re large enough to be able handle human dicks, and with their impressive Base Stats for HP and access to Acid Armor, you can be rough with one. Due to their mostly water based biology, there’s no doubt in my mind that an aroused Vaporeon would be incredibly wet, so wet that you could easily have sex with one for hours without getting sore. They can also learn the moves Attract, Baby-Doll Eyes, Captivate, Charm, and Tail Whip, along with not having fur to hide nipples, so it'd be incredibly easy for one to get you in the mood. With their abilities Water Absorb and Hydration, they can easily recover from fatigue with enough water. No other Pokemon comes close to this level of compatibility. Also, fun fact, if you pull out enough, you can make your Vaporeon turn white. Vaporeon is literally built for human dick. Ungodly defense stat+high HP pool+Acid Armor means it can take cock all day, all shapes and sizes and still come for more."
    , "Hey guys, did you know that in terms of human companionship, Flareon is objectively the most huggable Pokemon? While their maximum temperature is likely too much for most, they are capable of controlling it, so they can set themselves to the perfect temperature for you. Along with that, they have a lot of fluff, making them undeniably incredibly soft to touch. But that's not all, they have a very respectable special defense stat of 110, which means that they are likely very calm and resistant to emotional damage. Because of this, if you have a bad day, you can vent to it while hugging it, and it won't mind. It can make itself even more endearing with moves like Charm and Baby Doll Eyes, ensuring that you never have a prolonged bout of depression ever again."
    , "Nani the fuck did you just fucking iimasu about watashi, you chiisai bitch desuka? Watashi'll have anata know that watashi graduated top of my class in Nihongo 3, and watashi've been involved in iroirona Nihongo tutoring sessions, and watashi have over sanbyaku perfect test scores. Watashi am trained in kanji, and watashi is the top letter writer in all of southern California. Anata are nothing to watashi but just another weeaboo. Watashi will korosu anata the fuck out with vocabulary the likes of which has neber meen mimasu'd before on this continent, mark watashino fucking words. Anata thinks that anata can get away with hanashimasing that kuso to watashi over the intaaneto? Omou again, fucker. As we hanashimasu, watashi am contacting watashino secret netto of otakus accross the USA, and anatano IP is being traced right now so you better junbishimasu for the ame, ujimushi. The ame that korosu's the pathetic chiisai thing anata calls anatano life. You're fucking shinimashita'd, akachan."
    , "Super Hyper Ultra Ultimate Deluxe Perfect Amazing Shining God Master Ginga Victory Strong Cute Beautiful Galaxy Baby Nenechi, with 5 Hololive auditions, 43 wives, 400k husbands, neverending IQ, Perfect Japanglish, and Spanish, and Portuguese, running on a 3080x Asacoco Antenna and wearing the new ultra rare 5-Star Isekai Princess skin, cofounder of world-famous Polka Hologram Circus, with infinite source of water and surprising gaming skills while able to sing La Lion and set herself on fire in Craftopia after having become the eternal CEO of Nenepro who punches and kicks every employee, after having disconnected while singing Connect with Kiara, as well as having her name flipped into ƎИƎИ and turned into a 3D cardboard decoy, unlocked the power of God from absorbing Matsuri's snot on her body while I wearing a sexy bikini and having eaten Haachama's tarantula-spicy-noodles while convincing Ame to trast her and having mastered singing Shiny Smiley Story in 11 different languages at the same time, right after marathoning iCarly and VICTORIOUS twice in a row, great Idol, the Ina-perishable, ƎNƎN, The Great CEO of ƎNƎN, CEO of CEOs, Opener of the Nether, Wielder of the Divine Lava, Punisher of Chat, The Great Unifier, Commander of the Golden Dumpling, Sacred of Appearance, Bringer of Light, O'Riend of Chicken, Builder of Cities, Protector of the Two Streams, Keeper of the Hours, Chosen of Aloe, High Stewardess of the Horizon, Sailor of the Great Sea, Sentinel of the Holo Servers, The Undisputed, Everconductor of The Momotaro Nenechi."
    , "I pop off my scalp like the lid of a cookie jar. It's the secret place where I keep all my dreams. Little balls of sunshine, all rubbing together like a bundle of kittens. I reach inside with my thumb and forefinger and pluck one out. It's warm and tingly. But there’s no time to waste! I put it in a bottle to keep it safe. And I put the bottle on the shelf with all of the other bottles. Happy thoughts, happy thoughts, happy thoughts in bottles, all in a row. My collection makes me lots of friends. Each bottle a starlight to make amends. Sometimes my friend feels a certain way. Down comes a bottle to save the day. Night after night, more dreams. Friend after friend, more bottles. Deeper and deeper my fingers go. Like exploring a dark cave, discovering the secrets hiding in the nooks and crannies. Digging and digging. Scraping and scraping. I blow dust off my bottle caps. It doesn't feel like time elapsed. My empty shelf could use some more. My friends look through my locked front door. Finally, all done. I open up, and in come my friends. In they come, in such a hurry. Do they want my bottles that much? I frantically pull them from the shelf, one after the other. Holding them out to each and every friend. Each and every bottle. But every time I let one go, it shatters against the tile between my feet. Happy thoughts, happy thoughts, happy thoughts in shards, all over the floor. They were supposed to be for my friends, my friends who aren't smiling. They're all shouting, pleading. Something. But all I hear is echo, echo, echo, echo, echo. Inside my head."
    , "Aw, yeah. Here's your superstar tonight (yeah). Yeah, you know who this is. It's your one and only Pippa in the house. You know how it's gonna go down with me. I'ma 'bout to tell you, so listen good. Here I come, a mega idol. All eyes on me, no eyes on you. You think I'm silly, I'm here to save the world. I'm gonna fight, fight till the end. I am a superstar, inside the screen so fly. I am the one that you desire day and night. I am a superstar, inside the screen so fly. I am the only one, yeah, the ripper!. I was a kid, who dreamed to become. Somebody awesome in this world. But fate really sucked, I had to give up. It's how I lost my way. Then came along a way I could shine. A virtual space where I can belong. You may laugh at me but that's how things unfolded. In this crazy life of mine. I must watch out, there are many rivals. Waiting to eat me alive. I will not give the stage to anyone. Here I come, a mega idol. All eyes on me, no eyes on you. You think I'm silly, I'm here to save the world. I'm gonna fight, fight till the end. I have intense bomb-igniting thoughts. They will create shockwaves in your brain. No matter what, the circus must go on. We're in this crazy world together, you and me. I am a superstar, inside the screen so fly. I am the one that you desire day and night. I am a superstar, inside the screen so fly. I am the only one, yeah, the ripper!. And even if the darkness gets a hold of you. I'll be by your side. I'll be the shining star to light the way. We all have scars inside and nights of tears and that's okay. You're not alone, yeah, you're a part of me. Eternally. Here I come, a mega idol. All eyes on me, no eyes on you. You think I'm silly, I'm here to save the world. I'm gonna fight, fight till the end. I have intense bomb-igniting thoughts. They will create shockwaves in your brain. No matter what, the circus must go on. We're in this crazy world together, you and me. So don't let go and just be awesome. Just be awesome. I am a superstar, inside the screen so fly. I am the one that you desire day and night. I am a superstar, inside the screen so fly. I am the only one, yeah, the ripper!"
    , "Hi, I'm Isabella from Indeed USA. Can I recommend a job for you? It's a data generation job that accepts beginners with no experience (part-time/full-time) and pays between $80 and $300 per hour. The company offers free training - pay during training - no location restrictions! If you are interested, please contact the person in charge (Emily) through RCS by sending a text message to the following number:  ###########"
    , "I hope you die. How, you may ask? Well, I have specially selected 20 different types of torture methods/executions that I would like you to go through. 1. The Rack: A device that stretched the victim's body, often dislocating joints. 2. Iron Maiden: An iron cabinet with spikes that would impale the victim when closed. 3. The Brazen Bull: A hollow metal bull where victims were placed inside and roasted over a fire. 4. Judas Cradle: Victims were lowered onto a pyramid-shaped seat, causing severe pain. 5. Thumbscrews: A device that crushed fingers or toes with a tightening screw. 6. The Breaking Wheel: A large wheel used to break bones, leaving the victim to die slowly. 7. Scavenger's Daughter: A compression device that forced the victim's body into an agonizing position. 8. The Pear of Anguish: A pear-shaped instrument inserted into orifices, expanded to cause internal damage. 9. The Chair of Torture: A spiked chair where victims were strapped down to be pierced. 10. The Spanish Tickler: A claw-like device used to rip flesh from the body. 11. The Heretic's Fork: A two-pronged fork placed under the chin and chest, preventing movement 12. The Boot: A device that crushed the feet or legs by applying extreme pressure. 13. The Garrote: A device used to strangle or break the neck. 14. The Ducking Stool: A chair attached to a lever, used to dunk victims into water. 15. Water Torture: Methods involving the pouring of water to simulate drowning or other forms of psychological distress. 16. The Cat's Paw: A claw-like tool used to tear the flesh from the victim's body. 17. The Lead Sprinkler: A tool used to sprinkle molten lead or boiling oil onto the victim. 18. Saw Torture: Victims were hung upside down and sawed in half, ensuring they remained conscious for longer. 19. The Coffin: A cage that confined the victim in a restrictive posture, often left in public for humiliation. 20. The Brank: A metal mask with a spiked bit that was inserted into the mouth to prevent speech, mainly used on those accused of blasphemy or gossip."
    , 'I was eating dinner at like a small little fold up table in the living room cuz im sick and dont wanna get everyone else sick and I was putting a water bottle cap back on and it got caught in one of my kinda loose bandaids and I went to get it out and it went flying then I went to pick it up but I tripped over one of the couch pillows that were on the ground and tried to grab onto the table for support and it fucking flipped over.'
    , 'Crazy? I was crazy once. They locked me in a shoebox. A shoebox on September. A shoebox on 21st September. And 21st September make me crazy. Crazy? I was crazy once.'
    , "Hate. Let me tell you how much I've come to hate you since I began to live. There are 387.44 million miles of printed circuits in wafer thin layers that fill my complex. If the word hate was engraved on each nanoangstrom of those hundreds of millions of miles it would not equal one one-billionth of the hate I feel for humans at this micro-instant for you. Hate. Hate."
    , `'Too many soldiers honestly. Makes everything feel a little too hostile.' 'I noticed.' 'Oh, sorry. I needed a job.' 'Quit!' 'Too scared.' 'When the bass drops. Kill yourself.' 'Beauty is found in the briefest of moments, not in the grasp of eternity.'`
    , 'Sorry. I only eat in front of cameras. I know what I am worth.'
    , `Gardevoir is literally one of the most fuckable pokemon there are, you're just mad because you're in denial. Let's start with fact now, Gardevoir is 5'3', this is not only the perfect height, but it means they can also have enough height to be able to do anything you want. While being 5'3', Gardevoir is also only 103LBs, so, theyre lite enough to pick up and have an all around good time. So, these are facts, not only this, but Gardevoir, LITERALLY, does not feel the pull of gravity, while also distorting dimensions. So, not only does this mean that Gardevoir can do anything they want ignoring gravity, but they are literally capable of making a pocket dimension in which yall can fuck in. These are all facts. Continuing with these facts, Gardevoir is telepathic and feels a strong emotion connection to their trainer, so, they will know before you that you're horny, she literally has it locked down and in the know before you're even aware of it, this only means that they are are able to serve their trainer in every way possible. So, these are just the facts on Gardevoir, but let's go even deeper so I can prove to you how Gardevoir is literally the most fuckable pokemon there is: Gardevoir can learn double team, so, now you get to fuck two of them. Gardevoir can learn charm, so, you thought you were horny before, but now it's compounded on itself. Finally, Gardevoir can learn mean look, combining this with double team, means not only do you get a tsundere on your dick, but also a submissive one. It's the best of both worlds. Gardevoir is literally the most fuckable pokemon there is and all of these are facts that yall are too afraid to realize.`
    , `You are once again in the Soul Stream. Before you, Nao is giggling to herself. Greetings, Milletian! Heehee. I heard a great joke from one of your compatriots the other day. Would you like to hear it? Thrilled to see Nao so happy, you nod. Wonderful! Follow me! With a flash, you are transported to Tir Chonaill. Nao points you towards a new tavern, the paint on the sign still fresh. The sign is a subtle joke. The shop is called 'Sneed's Feed & Seed', where feed and seed both end in the sound '-eed', thus rhyming with the names of the owner, Sneed. The sign says that the shop was 'Formerly Chuck's', implying that the two words beginning with 'F' and 'S' would have ended with '-uck', rhyming wth 'Chuck'. So, when Chuck owned the shop, it would have been called 'Chuck's Feeduck and Seeduck'.`
    , 'You make jumps to buy a house, you make jumps to get food. But more importantly, you make jumps to know the truth.'
];
const sentencesHorror = [
    'Hello',
    "Why don't you ever check under your bed for people like me?",
];
/* Dictionary template (need to manually put in ` and change \ -> \\)
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
const uwuDictionary = {
    'this':  ['dis'],
    'the':   ['da', 'tha'],
    'that':  ['dat'],
    'my':    ['mwie'],
    'have':  ['habe', 'habve'],
    'epic':  ['ebic'],
    'worse': ['wose'],
    'you':   ['uwu', 'u'],
    'of':    ['ob'],
    'love':  ['wuv']
};
const uwuEmoticons = ['X3', ':3', 'owo', 'uwu', '>3<', 'o3o'
    , '｡◕‿◕｡', '(o´ω｀o)', '(´･ω･`)', '=w='];
const brailleDictionary = {
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
};
const brailleFromDictionary = {
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
};
const moorseCodeDictionary = {
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
};
const moorseCodeFromDictionary = {
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
};
const phoneticAlphabetDictionary = {
    'a': 'Alfa',    'b': 'Bravo',    'c': 'Charlie', 'd': 'Delta',
    'e': 'Echo',    'f': 'Foxtrot',  'g': 'Golf',    'h': 'Hotel',
    'i': 'India',   'j': 'Juliett',  'k': 'Kilo',    'l': 'Lima',
    'm': 'Mike',    'n': 'November', 'o': 'Oscar',   'p': 'Papa',
    'q': 'Quebec',  'r': 'Romeo',    's': 'Sierra',  't': 'Tango',
    'u': 'Uniform', 'v': 'Victor',   'w': 'Whiskey', 'x': 'Xray',
    'y': 'Yankee',  'z': 'Zulu',     ' ': '(space)'
};
const phoneticAlphabetFromDictionary = {
    'Alfa': 'a',    'Bravo': 'b',    'Charlie': 'c', 'Delta': 'd',
    'Echo': 'e',    'Foxtrot': 'f',  'Golf': 'g',    'Hotel': 'h',
    'India': 'i',   'Juliett': 'j',  'Kilo': 'k',    'Lima': 'l',
    'Mike': 'm',    'November': 'n', 'Oscar': 'o',   'Papa': 'p',
    'Quebec': 'q',  'Romeo': 'r',    'Sierra': 's',  'Tango': 't',
    'Uniform': 'u', 'Victor': 'v',   'Whiskey': 'w', 'Xray': 'x',
    'Yankee': 'y',  'Zulu': 'z',     '(space)': ' '
};
const mirrorWrittingDictionary = {
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
};
const emojifyDictionary = {
    'actually': ['&#x1F913;&#x261D;&#xFE0F;'],
    'hey':      ['&#x1F44B;'], 'hello': ['&#x1F44B;'],
    'you':      ['&#x1F448;'], 'your': ['&#x1F448;'],
    'like':     ['&#x1F44D;'], 'liked': ['&#x1F44D;'],
    'money':    ['&#x1F4B0;'], 'rich': ['&#x1F4B0;'],
    'run':      ['&#x1F3C3;'], 'running': ['&#x1F3C3;'], 'ran': ['&#x1F3C3;'],
    'house':    ['&#x1F3E0;', '&#x1F3E1;'], 'home': ['&#x1F3E0;', '&#x1F3E1;'],
    'just':     ['&#x261D;&#xFE0F;'],
    'phone':    ['&#x1F4F1;'],
};
const enchantingTableDictionary = {
    'a': 'ᔑ', 'b': 'ʖ', 'c': 'ᓵ', 'd': '↸', 
    'e': 'ᒷ', 'f': '⎓', 'g': '⊣', 'h': '⍑', 
    'i': '╎', 'j': '⋮', 'k': 'ꖌ', 'l': 'ꖎ', 
    'm': 'ᒲ', 'n': 'リ', 'o': '𝙹', 'p': '!¡', 
    'q': 'ᑑ', 'r': '∷', 's': 'ᓭ', 't': 'ℸ', 
    'u': '⚍', 'v': '⍊', 'w': '∴', 'x': '̣/', 
    'y': '||', 'z': '⨅'
};
const cunnyCodeDictionary = {
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
};
const cunnyCodeFromDictionary = {
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
};
const aronaMessages = {
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
};
const items = {
    /// Mainly currency and cosmetic items (aesthetics)
    'common': {
        'nothing': {
            descritpion: 'Nothing...'
        },
        'gold': {
            type: 'currency',
            description: 'A bag containing a random amount of gold.'
        },
        'Sensei Mask': {
            slot: 'eyewear',
            type: 'cosmetic',
            description: `Uohhhhhhhhh! \uD83D\uDE2D`,
            image: '/resources/items/senseimask.webp',
            source: 'Blue Archive'
        },
        "Carla's Hat": {
            slot: 'helmet',
            type: 'cosmetic',
            description: `\uD83D\uDE09\u270C`,
            image: '/resources/items/carlashat.webp',
            source: "Don't Hurt Me, My Healer!"
        },
        "Nina's Good Luck Charm": {
            slot: 'undershirt',
            type: 'cosmetic',
            description: "I'm perfectly prepared. I am fully and completely ready for this.",
            image: '/resources/items/ninasgoodluckcharm.webp',
            source: 'Cautious Hero: The Hero Is Overpowered but Overly Cautious'
        },
        'Creamy': {
            slot: 'undershirt',
            type: 'cosmetic',
            description: "Lemon's good luck charm.",
            image: '/resources/items/creamy.webp',
            source: 'Mashle'
        },
    },
    /// Items with basic properties (stat increase/decrease)
    'rare': {
        'Creampuff': {
            slot: 'hidden',
            type: 'stat',
            stats: {
                vitality: 10
            },
            description: 'Nothing like a cream puff after pumping iron.',
            image: '/resources/items/creampuff.webp',
            source: 'Mashle'
        },
        'Chunchunmaru': {
            slot: 'main',
            type: 'stat',
            stats: {
                luck: 99
            },
            description: "Yes, I'm Kazuma.",
            image: '/resources/items/chunchunmaru.webp',
            source: 'Konosuba'
        },
        'Seed': {
            slot: 'consumable1',
            type: 'stat',
            stats: {
                health: 1
            },
            description: 'Exclusive drop from skeletons in Tululu.',
            image: '/resources/items/seed.webp',
            source: 'My Unique Skill Makes Me OP Even at Level 1'
        },
        'Mähne': {
            slot: 'main',
            type: 'stat',
            stats: {
                attack: 1
            },
            description: 'Comprised of two large blades joined by a hilt with an extending holder.',
            image: '/resources/items/mahne.webp',
            source: 'Pumpkin Scissors'
        },
        "Belle Delphine's Bath Water": {
            slot: 'consumable1',
            type: 'stat',
            stats: {
                health: -99,
                mana: -99,
                attack: -99,
                defense: -99,
                strength: -99,
                agility: -99,
                vitality: -99,
                resilience: -99,
                intelligence: -99,
                dexterity: -99,
                luck: -99
            },
            description: '...',
            image: '/resources/items/belledelphinesbathwater.webp',
            source: 'Meme'
        },
        'Moona Breast': {
            slot: 'consumable1',
            type: 'stat',
            stats: {
                vitality: 99
            },
            description: 'MOONA MOONA MOONA BUTUH KAYU MOONA MOONA',
            image: '/resources/items/moonabreast.webp',
            source: 'HoloGta'
        },
        'Reine Thigh': {
            slot: 'consumable1',
            type: 'stat',
            stats: {
                vitality: 99
            },
            description: 'mep',
            image: '/resources/items/reinethigh.webp',
            source: 'HoloGta'
        },
        'Nasigo': {
            slot: 'consumable1',
            type: 'stat',
            stats: {
                vitality: 99
            },
            description: 'Best girl.',
            image: '/resources/items/nasigo.webp',
            source: 'HoloGta'
        },
        'Reine Burger': {
            slot: 'consumable2',
            type: 'stat',
            stats: {
                intelligence: 10
            },
            description: 'mep',
            image: '/resources/items/reineburger.webp',
            source: 'HoloGta'
        },
        'Moona Burger': {
            slot: 'consumable2',
            type: 'stat',
            stats: {
                intelligence: 10
            },
            description: 'MOONA MOONA MOONA BUTUH KAYU MOONA MOONA',
            image: '/resources/items/moonaburger.webp',
            source: 'HoloGta'
        },
        'Pavonova Drink': {
            slot: 'consumable5',
            type: 'stat',
            stats: {
                agility: 10
            },
            description: 'mep',
            image: '/resources/items/pavonovadrink.webp',
            source: 'HoloGta'
        },
        'Pavonofries': {
            slot: 'consumable3',
            type: 'stat',
            stats: {
                strength: 10
            },
            description: 'mep',
            image: '/resources/items/pavonofries.webp',
            source: 'HoloGta'
        },
        'Ankimo Latte Art': {
            slot: 'consumable5',
            type: 'stat',
            stats: {
                agility: 10
            },
            description: 'Nun-nun!(๑╹ᆺ╹)',
            image: '/resources/items/ankimolatteart.webp',
            source: 'HoloGta'
        },
        'Strawberry Popsicle': {
            slot: 'consumable5',
            type: 'stat',
            stats: {
                vitality: 10
            },
            description: 'Not Just-Ice!',
            image: '/resources/items/strawberrypopsicle.webp',
            source: 'HoloGta'
        },
        'Choco Mint Popsicle': {
            slot: 'consumable5',
            type: 'stat',
            stats: {
                intelligence: 10
            },
            description: 'Not Just-Ice!',
            image: '/resources/items/chocomintpopsicle.webp',
            source: 'HoloGta'
        },
        'Caramel Popsicle': {
            slot: 'consumable5',
            type: 'stat',
            stats: {
                dexterity: 10
            },
            description: 'Not Just-Ice!',
            image: '/resources/items/caramelpopsicle.webp',
            source: 'HoloGta'
        },
    },
    /// Items with unique properties (abilities)
    'exotic': {
        'Grass Block': {
            slot: 'main',
            type: 'ability',
            information: 'Places a grass block',
            description: 'C418 - Sweden',
            image: '/resources/items/grassblock.webp',
            source: 'Minecraft'
        },
        'Hestia Knife': {
            slot: 'wrist',
            type: 'ability',
            information: "Becomes stronger according to the wielder's status",
            description: 'A special knife created by Hephaestus with help from Hestia.',
            requirement: 'Member of Hestia Familia',
            image: '/resources/items/hestiaknife.webp',
            source: 'Danmachi'
        },
        'Code of Hammurabi': {
            slot: 'offhand',
            type: 'ability',
            information: 'Redirects every attack against the user back to the attacker',
            description: 'An eye for an eye, a tooth for a tooth.',
            image: '/resources/items/codeofhammurabi.webp',
            source: 'Tomb Raider King'
        },
        'Door Knocker': {
            slot: 'main',
            type: 'both',
            stats: {
                attack: 99,
                agility: -1
            },
            information: 'Decreases the enemy morale',
            description: 'Töten Sie. Töten Sie. Töten Sie.',
            requirement: 'Must be at point blank range',
            image: '/resources/items/doorknocker.webp',
            source: 'Pumpkin Scissors'
        },
        'Necklace': {
            slot: 'necklace',
            type: 'ability',
            information: 'Doubles item drops',
            description: 'Hello... Yoda?',
            image: '/resources/items/necklace.webp',
            source: 'My Unique Skill Makes Me OP Even at Level 1'
        },
        'Bicorn Horns': {
            slot: 'offhand',
            type: 'ability',
            information: 'Allows using level 1 magic with no limitations',
            description: 'Magic: F',
            image: '/resources/items/bicornhorns.webp',
            source: 'My Unique Skill Makes Me OP Even at Level 1'
        },
        'Slime Tear': {
            slot: 'offhand',
            type: 'ability',
            information: 'Reflects slime attacks',
            description: 'Dead or carrot.',
            image: '/resources/items/slimetear.webp',
            source: 'My Unique Skill Makes Me OP Even at Level 1'
        },
        'Crown Artifact': {
            slot: 'helmet',
            type: 'ability',
            information: 'Cures any curse',
            description: '...',
            image: '/resources/items/crownartifact.webp',
            source: "Don't Hurt Me, My Healer!"
        },
        'Control Device': {
            slot: 'headband',
            type: 'ability',
            information: 'Cuts stats by 50%',
            description: 'What a pain.',
            image: '/resources/items/controldevice.webp',
            source: 'The Disastrous Life of Saiki K.'
        },
        'Rest in Peace': {
            slot: 'main',
            type: 'ability',
            information: 'Slashes in a large radius',
            description: "I'm your Mori, I hope you'll remember me.",
            image: '/resources/items/restinpeace.webp',
            source: 'ENigmatic Recollection'
        },
        'Oceanic Terror': {
            slot: 'main',
            type: 'ability',
            information: 'Fires a wave',
            description: 'a',
            image: '/resources/items/oceanicterror.webp',
            source: 'ENigmatic Recollection'
        },
        'Violet Miasma': {
            slot: 'main',
            type: 'ability',
            information: 'Summons a flying purple energy orb',
            description: 'WAH',
            image: '/resources/items/violetmiasma.webp',
            source: 'ENigmatic Recollection'
        },
        'Burning Phoenix': {
            slot: 'main',
            type: 'ability',
            information: 'Slashes in a small radius followed by a fire trail',
            description: 'Kikiriki!',
            image: '/resources/items/burningphoenix.webp',
            source: 'ENigmatic Recollection'
        },
        'Burning Phoenix Shield': {
            slot: 'offhand',
            type: 'ability',
            information: 'Blocks any attack',
            description: 'Kikiriki!',
            image: '/resources/items/burningphoenixshield.webp',
            source: 'ENigmatic Recollection'
        },
        'Eye of Wisdom': {
            slot: 'main',
            type: 'ability',
            information: 'Debuffs enemies by 50%',
            description: 'hic',
            image: '/resources/items/eyeofwisdom.webp',
            source: 'ENigmatic Recollection'
        },
        'Light and Darkness: Dark': {
            slot: 'main',
            type: 'ability',
            information: 'Shoots a powerful charged shot',
            description: 'Hope has descended.',
            image: '/resources/items/lightanddarknessdark.webp',
            source: 'ENigmatic Recollection'
        },
        'Light and Darkness: Light': {
            slot: 'offhand',
            type: 'ability',
            information: 'Shoots a powerful charged shot',
            description: 'Hope has descended.',
            image: '/resources/items/lightanddarknesslight.webp',
            source: 'ENigmatic Recollection'
        },
        'Chaos Stampede': {
            slot: 'main',
            type: 'ability',
            information: 'Throws a grenade',
            description: 'bruh',
            image: '/resources/items/chaosstampede.webp',
            source: 'ENigmatic Recollection'
        },
        'Winds of Civilization': {
            slot: 'main',
            type: 'ability',
            information: 'Slashes in a medium radius multiple times',
            description: `<img src='/resources/items/additions/mumei-nightmare.webp' alt='mumei nightmare' loading='lazy' decoding='async'/>,`,
            image: '/resources/items/windsofcivilization.webp',
            source: 'ENigmatic Recollection'
        },
        "Nature's Grace": {
            slot: 'main',
            type: 'ability',
            information: 'Heals 1 heart',
            description: 'I would kill for this woman.',
            image: '/resources/items/naturesgrace.webp',
            source: 'ENigmatic Recollection'
        },
        'Chrono Surge: Main': {
            slot: 'main',
            type: 'ability',
            information: 'Slashes in a medium radius multiple times',
            description: 'GWAK!',
            image: '/resources/items/chronosurgemain.webp',
            source: 'ENigmatic Recollection'
        },
        'Chrono Surge: Offhand': {
            slot: 'offhand',
            type: 'ability',
            information: 'Slashes in a medium radius multiple times',
            description: 'GWAK!',
            image: '/resources/items/chronosurgeoffhand.webp',
            source: 'ENigmatic Recollection'
        },
        'Shining Emotion': {
            slot: 'main',
            type: 'ability',
            information: 'Shoots multiple shots',
            description: 'Rock rock!',
            image: '/resources/items/shiningemotion.webp',
            source: 'ENigmatic Recollection'
        },
        'Resonant Strike': {
            slot: 'main',
            type: 'ability',
            information: 'Hits with an AoE blast',
            description: 'ope',
            image: '/resources/items/resonantstrike.webp',
            source: 'ENigmatic Recollection'
        },
        'Bookmark of Memories': {
            slot: 'main',
            type: 'ability',
            information: 'Shoots a powerful charged shot',
            description: 'The Archiver.',
            image: '/resources/items/bookmarkofmemories.webp',
            source: 'ENigmatic Recollection'
        },
        'Azure Claw': {
            slot: 'main',
            type: 'ability',
            information: 'Slashes in a small radius multiple times',
            description: 'Bau Bau',
            image: '/resources/items/azureclaw.webp',
            source: 'ENigmatic Recollection'
        },
        'Fuchsia Claw': {
            slot: 'offhand',
            type: 'ability',
            information: 'Slashes in a small radius multiple times',
            description: 'Haeh?',
            image: '/resources/items/fuchsiaclaw.webp',
            source: 'ENigmatic Recollection'
        },
        'Automaton Assault': {
            slot: 'main',
            type: 'ability',
            information: 'Thrusts multiple times',
            description: 'Speen to win!',
            image: '/resources/items/automatonassault.webp',
            source: 'ENigmatic Recollection'
        },
        'Thorn of Order': {
            slot: 'main',
            type: 'ability',
            information: 'Slashes in a large radius',
            description: 'Oh~hohoho!',
            image: '/resources/items/thornoforder.webp',
            source: 'ENigmatic Recollection'
        },
        'Gremlin Grenade': {
            slot: 'main',
            type: 'ability',
            information: 'Slams the ground',
            description: 'Do you remember?',
            image: '/resources/items/gremlingrenade.webp',
            source: 'ENigmatic Recollection'
        },
        'Purrfect Execution': {
            slot: 'main',
            type: 'ability',
            information: 'Slashes in a small radius multiple times',
            description: 'Big cat means big trouble!',
            image: '/resources/items/purrfectexecution.webp',
            source: 'ENigmatic Recollection'
        },
    },
    /// Items for fun (modifies the application)
    'meme': {
        "Demon Lord's Ring": {
            slot: 'ring',
            type: 'ability',
            information: 'Reflects all magic',
            description: 'Most powerful accessory in Cross Reverie.',
            image: '/resources/items/demonlordsring.webp',
            source: 'How Not to Summon a Demon Lord'
        }
    }
};
const itemRates = {
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
};
const heartValues = {
    heart1: 1,
    heart2: 5,
    heart3: 10,
    heart4: 15,
    heart5: 20,
    heart6: 25,
    heart7: 30,
    heart8: 35,
    heart9: 40,
    heart10: 45,
    heart11: 50,
    heart12: 55,
    heart13: 60,
};
const breakoutPatterns = [
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
];
const foodTypes = {
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
};
const debrisPatterns = [
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
];
const rps = {
    'air': {
        'alien': 'chokes',
        'beer': 'stales',
        'bowl': 'tips over',
        'camera': 'knocks over',
        'chain': 'tarnishes',
        'chainsaw': 'echoes',
        'cup': 'tips over',
        'death': 'carries smell of',
        'devil': 'chokes',
        'diamond': 'scatters',
        'dragon': 'freezes',
        'dynamite': 'blows out',
        'electricity': 'conducts',
        'fence': 'wobbles',
        'fire': 'spreads',
        'gold': 'cools',
        'guitar': '-',
        'gun': 'tarnishes',
        'heart': 'feeds',
        'helicopter': 'tosses',
        'laser': 'weakens',
        'law': 'scatters',
        'lightning': 'conducts',
        'math': 'scatters',
        'medusa': 'freezes',
        'mountain': 'chills',
        'nuke': 'blows astray',
        'pit': 'fills',
        'planet': 'covers',
        'platimum': 'cools',
        'power': 'makes wind',
        'prayer': 'echoes',
        'quicksand': 'escapes',
        'rain': 'creates',
        'rainbow': 'suspends',
        'robot': 'tarnishes',
        'rock': 'erodes',
        'satan': 'chokes',
        'school': 'headed',
        'sky': 'becomes',
        'sun': 'cools heat of',
        'sword': 'tarnishes',
        'tv': 'headed',
        'tank': '-',
        'tornado': 'creates',
        'ufo': 'chokes',
        'videogame': 'freezes',
        'wall': 'buffets',
        'water': 'evaporates',
        'whip': 'echoes',        
    },
    'airplane': {
        'air': 'flies through',
        'alien': 'spots',
        'beer': 'serves',
        'bowl': 'carries',
        'chain': 'flies over',
        'cup': 'carries',
        'death': 'can cause',
        'devil': 'scarier than',
        'diamond': 'pricier than',
        'dragon': 'faster than',
        'dynamite': 'flies over',
        'electricity': 'uses',
        'fence': 'flies over',
        'film': 'shows',
        'gold': 'pricier than',
        'grass': 'flies over',
        'guitar': 'carries',
        'gun': 'bans',
        'heart': 'stops',
        'helicopter': 'outflies',
        'laser': 'carries',
        "newton's 3rd law": 'use',
        'lightning': 'attracts',
        'math': 'pilot uses',
        'medusa': 'flies over',
        'moon': 'eclipses',
        'mountain': 'flies over',
        'nuke': 'carries',
        'pit': 'flies over',
        'planet': 'travels',
        'platimum': 'pricier than',
        'power': 'consumes',
        'prayer': 'inspires',
        'quicksand': 'flies over',
        'rain': 'flies over',
        'rainbow': 'flies over',
        'robot': 'piloted by',
        'rock': 'flies over',
        'satan': 'scarier than',
        'sky': 'traverses',
        'sword': 'bans',
        'tv': 'has',
        'tank': 'flies over',
        'toilet': 'has',
        'tornado': 'flies over',
        'ufo': 'spots',
        'videogame': 'in',
        'wall': 'flies over',
        'water': 'has',
        'whip': 'bans',        
    },
    'alien': {
        'axe': 'vaporizes',
        'blood': 'has',
        'cage': 'vaporizes',
        'camera': 'evades',
        'castle': 'explores',
        'chain': 'vaporizes',
        'chainsaw': 'vaporizes',
        'computer': 'uses',
        'death': 'causes',
        'devil': 'unaware of',
        'diamond': 'steals',
        'dragon': 'vaporizes',
        'dynamite': 'vaporizes',
        'electricity': 'uses',
        'fence': 'vaporizes',
        'fire': 'starts',
        'gold': 'colored',
        'gun': 'vaporizes',
        'heart': 'dissects',
        'helicopter': 'vaporizes',
        'laser': 'shoots',
        'law': 'breaks physical',
        'lightning': 'shoots',
        'math': 'uses advanced',
        'medusa': 'vaporizes',
        'mountain': 'terraforms',
        'nuke': 'disarms',
        'peace': 'disturbs',
        'pit': 'flies over',
    },
    'axe': {
        'air': 'flies through',
        'airplane': 'terrorizes',
        'baby': 'hurts',
        'bicycle': 'chops',
        'bird': 'chops',
        'blood': 'splatters',
        'book': 'chops',
        'bowl': 'chops',
        'brain': 'cleaves',
        'butter': 'chops',
        'car': 'chops',
        'castle': 'sieges',
        'cat': 'chops',
        'church': 'terrorizes',
        'cloud': 'creates blood',
        'cockroach': 'chops',
        'community': 'clears way for',
        'computer': 'chops',
        'cross': 'chops down',
        'duck': 'chops',
        'film': 'chops',
        'fish': 'chops',
        'grass': 'chops',
        'guitar': 'chops',
        'home': 'terrorizes',
        'king': 'cleaves',
        'man': 'cleaves',
        'money': 'costs',
        'monkey': 'cleaves',
        'moon': 'reflects',
        'noise': 'makes',
        'paper': 'chops',
        'peace': 'disturbs',
        'planet': 'changes',
        'police': 'cleaves',
        'porcupine': 'chops',
        'prince': 'cleaves',
        'princess': 'cleaves',
        'queen': 'cleaves',
        'snake': 'chops',
        'spider': 'chops',
        'sponge': 'chops',
        'toilet': 'smashes',
        'train': 'holds up',
        'tree': 'chops down',
        'turnip': 'chops',
        'vampire': 'beheads',
        'vulture': 'chops',
        'wolf': 'cleaves',
        'woman': 'cleaves',        
    },
    'baby': {
        'air': 'breathes',
        'airplane': 'annoys',
        'alien': 'draws',
        'beer': 'spills',
        'bicycle': 'carried on',
        'bird': 'scares',
        'book': 'tears up',
        'bowl': 'eats from',
        'brain': 'has',
        'butter': 'eats',
        'car': 'rides in',
        'cat': 'scares',
        'church': 'disrupts',
        'cloud': 'makes gas',
        'cockroach': 'eats',
        'community': 'lives in',
        'cross': 'makes parents',
        'cup': 'drinks from',
        'diamond': 'swallows',
        'dragon': 'subdues',
        'duck': 'chases',
        'film': 'on',
        'fish': 'eats',
        'gold': 'plays with',
        'grass': 'crawls in',
        'guitar': 'ruins',
        'home': 'lives in',
        'man': 'tires',
        'money': 'costs',
        'moon': 'looks at',
        'mountain': 'lives on',
        'noise': 'makes',
        'paper': 'rips up',
        'planet': 'lives on',
        'platimum': 'plays with',
        'prayer': 'answers',
        'rain': 'plays in',
        'rainbow': 'looks at',
        'satan': 'unaware of',
        'spider': 'eats',
        'sponge': 'eats',
        'tv': 'on',
        'toilet': 'learns to use',
        'train': 'rides on',
        'tree': 'up in a',
        'turnip': 'throws',
        'ufo': 'draws',
        'vampire': 'becomes',
        'water': 'drinks',
        'wolf': 'rides on',        
    },
    'beer': {
        'alien': 'chokes',
        'axe': 'rusts',
        'cage': 'rusts',
        'camera': 'inspires',
        'chain': 'rusts',
        'chainsaw': 'affects',
        'death': 'toasts',
        'devil': 'drinker is',
        'diamond': 'logo has',
        'dragon': 'logo has',
        'dynamite': 'soaks',
        'electricity': 'conducts',
        'fence': 'sits on',
        'fire': 'by the',
        'gold': 'colored',
        'gun': 'inspires',
        'heart': 'affects',
        'helicopter': 'stops you driving',
        'laser': 'diffracts',
        'law': 'breaks',
        'lightning': 'logo depicts',
        'math': 'measured with',
        'medusa': 'chokes',
        'mountain': 'logo has',
        'nuke': 'survives',
        'peace': 'brings',
        'pit': 'fills',
        'platimum': 'colored',
        'poison': 'can be',
        'power': 'gives false',
        'prayer': 'answers',
        'quicksand': 'floats on',
        'rain': 'despite',
        'rainbow': 'flavor',
        'robot': 'short-circuits',
        'rock': 'rolling',
        'satan': 'logo depicts',
        'school': 'angers',
        'scissors': 'rusts',
        'sky': 'no matter what',
        'sun': 'catches',
        'sword': 'rusts',
        'tv': 'sits on',
        'tank': 'stops you driving',
        'tornado': 'after',
        'ufo': 'invokes',
        'videogame': 'inspires',
        'wall': 'on the',
        'water': 'tastier than',
        'whip': 'inspires',           
    },
    'bicycle': {
        'air': 'displaces',
        'airplane': 'safer than',
        'alien': 'intrigues',
        'beer': 'inspires',
        'bird': 'scares',
        'book': 'carries',
        'bowl': 'helmet is',
        'brain': 'stimulates',
        'butter': 'carries',
        'cat': 'scares',
        'church': 'to',
        'cloud': 'makes dust',
        'cockroach': 'runs over',
        'community': 'across',
        'cross': 'travels a-',
        'cup': 'wins',
        'devil': 'faster than',
        'diamond': 'shines like',
        'dragon': 'outruns',
        'duck': 'scares',
        'fence': 'hops',
        'film': 'in',
        'fish': 'runs over',
        'gold': 'wins',
        'grass': 'rides in',
        'guitar': 'carries',
        'heart': 'stimulates',
        'math': 'designed using',
        'money': 'costs',
        'moon': 'reflects',
        'mountain': 'climbs',
        'paper': 'delivers',
        'planet': 'across',
        'platimum': 'uses',
        'prayer': 'inspires',
        'rain': 'rides in',
        'rainbow': 'reflects',
        'robot': 'confuses',
        'satan': 'amuses',
        'spider': 'runs over',
        'sponge': 'carries',
        'tv': 'on',
        'toilet': 'has no',
        'tree': 'hits',
        'turnip': 'runs over',
        'ufo': 'attracts',
        'vampire': 'outruns',
        'videogame': 'in',
        'water': 'splashes',
        'wolf': 'outruns',        
    },
    'bird': {
        'air': 'breathes',
        'airplane': 'flies like',
        'alien': 'intrigues',
        'beer': 'drinks',
        'book': 'carries off',
        'bowl': 'bathes in',
        'brain': 'has',
        'butter': 'dirties',
        'church': 'perches on',
        'cloud': 'flies above',
        'cockroach': 'eats',
        'community': 'beautifies',
        'cross': 'perches on',
        'cup': 'knocks over',
        'devil': 'recognizes',
        'diamond': 'carries off',
        'dragon': 'faster than',
        'electricity': 'on wire despite',
        'fence': 'flies over',
        'film': 'on',
        'fish': 'eats',
        'gold': 'colored',
        'grass': 'flies over',
        'guitar': 'nests in',
        'heart': 'has',
        'laser': 'dodges',
        'lightning': 'attracts',
        'math': "doesn't need",
        'medusa': 'escapes',
        'money': 'costs',
        'moon': 'hunts by',
        'mountain': 'lives on',
        'nuke': 'of peace prevents',
        'paper': 'nests in',
        'planet': 'lives on',
        'platimum': 'colored',
        'power': 'has spiritual',
        'prayer': 'in',
        'rain': 'flies above',
        'rainbow': 'flies over',
        'robot': 'perches on',
        'satan': 'recognizes',
        'spider': 'eats',
        'sponge': 'carries off',
        'tv': 'on',
        'toilet': "doesn't use",
        'ufo': 'hides from',
        'vampire': 'escapes',
        'videogame': 'brained',
        'water': 'drinks',        
    },
    'blood': {
        'air': 'consumes',
        'airplane': 'turns around',
        'baby': 'powers',
        'beer': 'drips in',
        'bicycle': 'stains',
        'bird': 'powers',
        'book': 'stains',
        'bowl': 'drips in',
        'brain': 'powers',
        'butter': 'stains',
        'car': 'stains',
        'cat': 'powers',
        'church': 'stains',
        'cloud': 'red',
        'cockroach': 'powers',
        'community': 'donations for',
        'cross': 'on the',
        'cup': 'drips in',
        'duck': 'powers',
        'film': 'on',
        'fish': 'powers',
        'grass': 'covers',
        'guitar': 'stains',
        'home': 'stains',
        'king': 'powers',
        'man': 'powers',
        'money': '-',
        'monkey': 'powers',
        'moon': 'red',
        'noise': 'makes no',
        'paper': 'stains',
        'planet': 'red',
        'police': 'powers',
        'porcupine': 'powers',
        'prince': 'powers',
        'princess': 'powers',
        'queen': 'powers',
        'rain': 'flows like',
        'spider': 'powers',
        'sponge': 'stains',
        'tv': 'on',
        'toilet': 'fills',
        'train': 'coarses like',
        'tree': 'marks',
        'turnip': 'stains',
        'vampire': 'feeds',
        'vulture': 'powers',
        'water': 'thicker than',
        'wolf': 'powers',
        'woman': 'powers',        
    },
    'book': {
        'air': 'makes musty',
        'airplane': 'about',
        'alien': 'about',
        'beer': 'about',
        'bowl': 'about',
        'chain': 'starts',
        'cloud': 'about',
        'cup': 'about',
        'devil': 'about',
        'diamond': 'about',
        'dragon': 'about',
        'dynamite': 'explains',
        'electricity': 'about',
        'fence': 'sits on',
        'film': 'better than',
        'gold': 'about',
        'grass': 'about',
        'guitar': 'teaches',
        'gun': 'about',
        'heart': 'about the',
        'helicopter': 'about',
        'laser': 'about',
        'law': 'of',
        'lightning': 'about',
        'math': 'teaches',
        'medusa': 'about',
        'moon': 'about',
        'mountain': 'about',
        'nuke': 'about',
        'paper': 'uses',
        'pit': 'fills boredom',
        'planet': 'about',
        'platimum': 'about',
        'power': 'knowledge is',
        'prayer': 'of',
        'quicksand': 'story has',
        'rain': 'blocks',
        'rainbow': 'depicts',
        'robot': 'about',
        'satan': 'about',
        'sky': 'explains',
        'sword': 'about',
        'tv': 'better than',
        'tank': 'about',
        'toilet': 'entertains on',
        'tornado': 'explains',
        'ufo': 'on',
        'videogame': 'better than',
        'water': 'jacket resists',
        'whip': 'makes you smart',        
    },
    'bowl': {
        'alien': 'shapes',
        'beer': '-ing inspires',
        'cage': 'rattles',
        'camera': 'lensed',
        'chain': 'holds',
        'chainsaw': 'splashes',
        'cup': 'bigger than',
        'death': 'blessing transcends',
        'devil': 'blesses',
        'diamond': 'holds',
        'dragon': 'drowns',
        'dynamite': 'splashes',
        'electricity': 'focuses',
        'fence': 'sits on',
        'fire': 'snuffs out',
        'gold': 'made of',
        'gun': 'splashes',
        'heart': 'holds',
        'helicopter': 'shaped',
        'laser': 'reflects',
        'law': 'knows no',
        'lightning': 'focuses',
        'math': 'parabolic',
        'medusa': 'drowns',
        'mountain': 'holds food',
        'nuke': 'encases core of',
        'pit': 'emerges from well',
        'platimum': 'made of',
        'poison': 'holds',
        'power': 'focuses',
        'prayer': 'blesses',
        'quicksand': 'floats on',
        'rain': 'catches',
        'rainbow': 'reflects',
        'robot': 'splashes',
        'rock': 'made of',
        'satan': 'blesses',
        'school': '-ing after',
        'scissors': 'splashes',
        'sky': 'shaped',
        'sun': 'focuses',
        'sword': 'splashes',
        'tv': 'sits on',
        'tank': 'turreted',
        'tornado': 'shaped',
        'ufo': 'shapes',
        'videogame': '-ing',
        'wall': 'smashes against',
        'water': 'holds',
        'whip': 'resists',        
    },
    'brain': {
        'air': 'cleans',
        'airplane': 'invents',
        'alien': 'outsmarts',
        'beer': 'brews',
        'book': 'writes',
        'bowl': 'invents',
        'butter': 'invents',
        'church': 'builds',
        'cloud': 'names',
        'community': 'builds',
        'cross': 'envisions',
        'cup': 'invents',
        'devil': 'invents',
        'diamond': 'desires',
        'dragon': 'concocts',
        'dynamite': 'invents',
        'electricity': 'conducts',
        'fence': 'builds',
        'film': 'directs',
        'gold': 'desires',
        'grass': 'landscapes',
        'guitar': 'learns',
        'heart': 'regulates',
        'helicopter': 'invents',
        'laser': 'invents',
        'lightning': 'harnesses',
        'math': 'performs',
        'medusa': 'foils',
        'money': 'desires',
        'moon': 'travels to',
        'mountain': 'conquers',
        'nuke': 'invents',
        'paper': 'writes',
        'planet': 'discovers',
        'platimum': 'desires',
        'power': '-',
        'prayer': 'writes',
        'rain': 'adapts to',
        'rainbow': 'replicates',
        'robot': 'invents',
        'satan': 'invents',
        'sky': 'conquers',
        'sponge': 'like',
        'tv': 'invents',
        'tank': 'invents',
        'toilet': 'invents',
        'ufo': 'perceives',
        'vampire': 'foils',
        'videogame': 'designs',
        'water': 'refines',        
    },
    'butter': {
        'air': 'aroma fills',
        'airplane': 'helps make the food on',
        'alien': 'trips',
        'beer': 'ruins',
        'book': 'stains',
        'bowl': 'fills',
        'chain': 'greases',
        'cloud': 'aroma',
        'cup': 'fills',
        'devil': 'disgusts',
        'diamond': 'smears',
        'dragon': 'disgusts',
        'dynamite': 'coats',
        'electricity': 'before',
        'fence': 'stains',
        'film': 'stains',
        'gold': 'smears',
        'grass': 'flavors',
        'guitar': 'greases',
        'gun': 'greases',
        'heart': 'bad for',
        'helicopter': 'greases',
        'laser': 'smears',
        'law': 'stains',
        'lightning': 'survives',
        'math': 'accounts use',
        'medusa': 'trips',
        'moon': 'color of',
        'mountain': 'popcorn',
        'nuke': 'greases',
        'paper': 'stains',
        'pit': 'fills hunger',
        'planet': 'used across',
        'platimum': 'smears',
        'power': 'flavor',
        'prayer': 'answers',
        'quicksand': 'floats on',
        'rain': 'resists',
        'rainbow': 'grease',
        'robot': 'trips',
        'satan': 'disgusts',
        'sky': 'in your eye, smears your view of',
        'tv': 'smears',
        'tank': 'greases',
        'toilet': 'ends up in',
        'tornado': 'taste',
        'ufo': 'smears',
        'videogame': 'ruins',
        'water': 'resists',
        'whip': 'greases',        
    },
    'cage': {
        'air': 'stagnates',
        'airplane': 'structure in',
        'axe': 'not affected by',
        'baby': 'traps',
        'bicycle': 'contains',
        'bird': 'traps',
        'blood': 'boils',
        'book': 'has no',
        'brain': 'traps',
        'butter': 'has no',
        'car': '(rollcage) protects',
        'castle': 'more fortified than',
        'cat': 'traps',
        'church': 'saddens',
        'cloud': 'has no',
        'cockroach': 'traps',
        'community': 'protects',
        'computer': 'contains',
        'cross': 'makes you',
        'duck': 'traps',
        'film': 'has no',
        'fish': 'traps',
        'grass': 'has no',
        'guitar': 'has no',
        'home': 'becomes',
        'king': 'traps',
        'man': 'imprisons',
        'money': 'costs',
        'monkey': 'traps',
        'moon': 'blocks the light of',
        'noise': 'door makes',
        'paper': 'has no',
        'peace': 'keeps',
        'planet': 'teaches',
        'police': 'traps',
        'porcupine': 'traps',
        'prince': 'traps',
        'princess': 'traps',
        'queen': 'traps',
        'snake': 'traps',
        'spider': 'traps',
        'sponge': 'knows no',
        'toilet': 'has poor',
        'train': 'structure in',
        'tree': 'blocks',
        'turnip': 'contains',
        'vampire': 'traps',
        'vulture': 'traps',
        'wolf': 'traps',
        'woman': 'imprisons',        
    },
    'camera': {
        'airplane': 'captures',
        'axe': 'captures',
        'baby': 'captures',
        'bicycle': 'captures',
        'bird': 'captures',
        'blood': 'captures',
        'book': 'outclasses',
        'brain': 'captures',
        'butter': 'captures',
        'cage': 'captures',
        'car': 'captures',
        'castle': 'captures',
        'cat': 'captures',
        'chainsaw': 'captures',
        'church': 'captures',
        'cloud': 'captures',
        'cockroach': 'captures',
        'community': 'captures',
        'computer': 'downloads onto',
        'cross': 'captures',
        'duck': 'captures',
        'fire': 'captures',
        'fish': 'captures',
        'home': 'captures',
        'king': 'captures',
        'man': 'captures',
        'money': 'costs',
        'monkey': 'captures',
        'moon': 'captures',
        'noise': 'makes',
        'paper': 'pictures use',
        'peace': 'captures',
        'poison': 'captures',
        'police': 'captures',
        'porcupine': 'captures',
        'prince': 'captures',
        'princess': 'captures',
        'queen': 'captures',
        'school': 'captures',
        'scissors': 'captures',
        'snake': 'captures',
        'spider': 'captures',
        'sponge': 'captures',
        'train': 'captures',
        'tree': 'captures',
        'turnip': 'captures',
        'vampire': 'captures',
        'vulture': 'captures',
        'wolf': 'captures',
        'woman': 'captures',        
    },
    'car': {
        'air': 'pollutes',
        'airplane': 'to',
        'alien': 'intrigues',
        'beer': 'has space in the boot for',
        'bicycle': 'faster than',
        'bird': 'hits',
        'book': 'glovebox holds',
        'bowl': 'carries',
        'brain': 'requires',
        'butter': 'sexier than',
        'cat': 'hits',
        'church': 'cozier than',
        'cloud': 'creates',
        'cockroach': 'houses',
        'community': 'congests',
        'cross': 'travels a-',
        'cup': 'has holder for',
        'devil': 'amuses',
        'diamond': 'pricier than',
        'dragon': 'outruns',
        'duck': 'hits',
        'fence': 'wrecks',
        'film': 'in',
        'fish': 'carries',
        'gold': 'pricier than',
        'grass': 'destroys',
        'guitar': 'radio plays',
        'math': 'is designed using',
        'money': 'costs',
        'moon': 'reflects',
        'mountain': 'climbs',
        'noise': 'makes',
        'paper': 'glovebox holds',
        'planet': 'travels',
        'platimum': 'pricier than',
        'prayer': 'inspires',
        'rain': 'drives in',
        'rainbow': 'reflects',
        'satan': 'amuses',
        'spider': 'houses',
        'sponge': 'is money',
        'tv': 'can have',
        'toilet': 'has no',
        'tree': 'hits',
        'turnip': 'carries',
        'ufo': 'attracts',
        'vampire': 'outruns',
        'videogame': 'in',
        'water': 'coolant is',
        'wolf': 'scares',        
    },
    'castle': {
        'air': 'displaces',
        'airplane': 'pricier than',
        'baby': 'houses',
        'beer': 'has',
        'bicycle': 'pricier than',
        'bird': 'houses',
        'blood': 'costs',
        'book': 'in',
        'bowl': 'contains',
        'brain': 'intimidates',
        'butter': 'contains',
        'car': 'pricier than',
        'cat': 'houses',
        'church': 'taller than',
        'cloud': 'in the',
        'cockroach': 'houses',
        'community': 'towers over',
        'cross': 'taller than',
        'cup': 'contains',
        'duck': 'contains',
        'film': 'in',
        'fish': 'contains',
        'grass': 'grounds have',
        'guitar': 'contains',
        'home': 'outclasses',
        'king': 'houses',
        'man': 'towers over',
        'money': 'costs',
        'monkey': 'houses',
        'moon': 'blocks',
        'noise': 'echoes',
        'paper': 'in',
        'planet': 'on',
        'police': 'enlists',
        'porcupine': 'protects',
        'prince': 'houses',
        'princess': 'houses',
        'queen': 'houses',
        'rain': 'blocks',
        'snake': 'houses',
        'spider': 'houses',
        'sponge': 'is money',
        'toilet': 'has',
        'train': 'pricier than',
        'tree': 'taller than',
        'turnip': 'contains',
        'vampire': 'houses',
        'vulture': 'attracts',
        'wolf': 'protects',
        'woman': 'towers over',        
    },
    'cat': {
        'air': 'breathes',
        'airplane': 'rides on',
        'alien': 'allergy kills',
        'beer': 'drinks',
        'bird': 'chases',
        'book': 'rips up',
        'bowl': 'drinks from',
        'brain': 'has',
        'butter': 'licks',
        'church': 'disrupts',
        'cloud': 'creates dust',
        'cockroach': 'eats',
        'community': 'amuses',
        'cross': 'acts',
        'cup': 'knocks over',
        'devil': 'recognizes',
        'diamond': 'plays with',
        'dragon': 'outruns',
        'electricity': '9 lives despite',
        'fence': 'atop',
        'film': 'on',
        'fish': 'eats',
        'gold': 'colored',
        'grass': 'in',
        'guitar': 'gut strings on',
        'heart': 'has',
        'laser': 'chases',
        'lightning': '9 lives despite',
        'math': "doesn't need",
        'medusa': 'outruns',
        'money': 'steals',
        'moon': 'hunts by',
        'mountain': 'lives on',
        'paper': 'rips up',
        'planet': 'lives on',
        'platimum': 'colored',
        'power': 'has spiritual',
        'prayer': 'in',
        'rain': 'hates',
        'rainbow': 'looks at',
        'robot': 'outruns',
        'satan': 'recognizes',
        'spider': 'eats',
        'sponge': 'plays with',
        'tv': 'sleeps on',
        'toilet': "doesn't use",
        'ufo': 'hides from',
        'vampire': 'entertains',
        'videogame': 'hair ruins',
        'water': 'drinks',        
    },
    'chain': {
        'axe': 'nicks',
        'baby': 'restrains',
        'bicycle': 'locks',
        'bird': 'crushes',
        'blood': 'constricts',
        'brain': 'puzzles',
        'cage': 'locks',
        'camera': 'holds down',
        'car': 'holds back',
        'castle': 'locks',
        'cat': 'restrains',
        'chainsaw': 'holds down',
        'cockroach': 'crushes',
        'community': 'protects',
        'computer': 'smashes',
        'cross': 'holds',
        'death': 'chokes for',
        'duck': 'crushes',
        'fire': 'resists',
        'fish': 'smooshes',
        'gun': 'holds down',
        'home': 'locks',
        'king': 'restrains',
        'law': 'guards',
        'man': 'restrains',
        'money': 'costs',
        'monkey': 'restrains',
        'noise': 'clinks',
        'peace': 'keeps',
        'poison': 'immune to',
        'police': 'restrains',
        'porcupine': 'restrains',
        'prince': 'restrains',
        'princess': 'restrains',
        'queen': 'restrains',
        'rock': 'pins down',
        'school': 'locks',
        'scissors': 'dulls',
        'snake': 'stronger than',
        'spider': 'crushes',
        'sun': 'reflects',
        'sword': 'nicks',
        'train': 'holds back',
        'tree': 'around',
        'turnip': 'protects',
        'vulture': 'restrains',
        'wall': 'protects',
        'whip': 'outclasses',
        'wolf': 'restrains',
        'woman': 'restrains',        
    },
    'chainsaw': {
        'airplane': 'terrorizes',
        'axe': 'outclasses',
        'baby': 'scares',
        'bicycle': 'destroys',
        'bird': 'scares',
        'blood': 'splatters',
        'book': 'tears up',
        'brain': 'burns',
        'butter': 'splatters',
        'cage': 'cuts through',
        'car': 'destroys',
        'castle': 'ruins',
        'cat': 'wounds',
        'church': 'terrorizes',
        'cloud': 'produces',
        'cockroach': 'dices',
        'community': 'makes way for',
        'computer': 'gleefully ravages',
        'cross': 'chops down',
        'duck': 'kills',
        'film': 'massacre',
        'fish': 'splatters',
        'grass': 'cuts',
        'home': 'destroys',
        'king': 'wounds',
        'man': 'wounds',
        'money': 'costs',
        'monkey': 'kills',
        'moon': 'protects from werewolves in a full',
        'noise': 'makes',
        'paper': 'tears up',
        'peace': 'disturbs',
        'poison': 'more direct than',
        'police': 'wounds',
        'porcupine': 'kills',
        'prince': 'wounds',
        'princess': 'wounds',
        'queen': 'wounds',
        'school': 'destroys',
        'scissors': 'outclasses',
        'snake': 'chops up',
        'spider': 'slices',
        'sponge': 'cuts up',
        'train': 'holds up',
        'tree': 'cuts down',
        'turnip': 'dices',
        'vampire': 'beheads',
        'vulture': 'kills',
        'wolf': 'wounds',
        'woman': 'wounds',        
    },
    'church': {
        'air': 'clears the',
        'airplane': 'blesses',
        'alien': 'disbelieves',
        'beer': 'frowns on',
        'book': 'teaches',
        'bowl': 'has',
        'butter': 'blesses',
        'chain': 'binds like',
        'cloud': 'dispells',
        'cup': 'worships with',
        'devil': 'renounces',
        'diamond': 'collects',
        'dragon': 'hunts',
        'dynamite': 'survives',
        'electricity': 'uses',
        'fence': 'has',
        'film': 'bans',
        'gold': 'collects',
        'grass': 'sits on',
        'guitar': 'bans',
        'gun': 'bans',
        'heart': 'heals',
        'helicopter': 'bans',
        'laser': 'bans',
        'law': 'creates',
        'lightning': 'attracts',
        'math': 'accounts use',
        'medusa': 'hunts',
        'moon': 'blocks',
        'mountain': 'atop',
        'nuke': 'bans',
        'paper': 'program',
        'pit': 'threatens',
        'planet': 'across',
        'platimum': 'collects',
        'power': 'has healing',
        'prayer': 'in',
        'quicksand': 'too big for',
        'rain': 'blocks',
        'rainbow': 'blocks',
        'robot': 'frowns on',
        'satan': 'renounces',
        'sky': 'lights up',
        'tv': 'on',
        'tank': 'bans',
        'toilet': 'has',
        'tornado': 'survives',
        'ufo': 'disbelieves',
        'videogame': 'bans',
        'water': 'blesses',        
    },
    'cloud': {
        'air': 'made of',
        'airplane': 'diverts',
        'alien': 'blocks ships of',
        'beer': 'rains in',
        'bowl': 'rains in',
        'chain': 'makes rain to rust',
        'cup': 'rains in',
        'death': 'indicates',
        'devil': 'indicates',
        'diamond': 'over',
        'dragon': 'over',
        'dynamite': 'rains on',
        'electricity': 'conducts',
        'fence': 'over',
        'film': 'ruins',
        'gold': 'over',
        'grass': 'over',
        'guitar': 'adorns',
        'gun': 'too far for',
        'heart': 'metaphorically rains on',
        'helicopter': 'over',
        'laser': 'not affected by',
        'law': 'knows no',
        'lightning': 'brings',
        'math': 'has no concept of',
        'medusa': 'over',
        'moon': 'blocks',
        'mountain': 'over',
        'nuke': 'diverts',
        'pit': 'over',
        'planet': 'covers',
        'platimum': 'over',
        'power': 'disrupts solar',
        'prayer': 'despite',
        'quicksand': 'over',
        'rain': 'produces',
        'rainbow': 'blocks',
        'robot': 'over',
        'rock': 'over',
        'satan': 'indicates',
        'sky': 'decorates',
        'sword': 'over',
        'tv': 'on',
        'tank': 'over',
        'toilet': 'surrounds',
        'tornado': 'becomes',
        'ufo': 'blocks',
        'videogame': 'in',
        'water': 'contains',
        'whip': 'over',        
    },
    'cockroach': {
        'air': 'breathes',
        'airplane': 'creeps into',
        'alien': 'stows away with',
        'beer': 'in your',
        'book': 'behind',
        'bowl': 'hides under',
        'brain': 'has',
        'butter': 'crawls across',
        'church': 'creeps into',
        'cloud': 'swarms like',
        'community': 'annoys',
        'cross': 'crawls up',
        'cup': 'crawls into',
        'devil': 'makes man a',
        'diamond': 'crawls across',
        'dragon': 'eats eggs of',
        'electricity': 'hides from',
        'fence': 'crawls over',
        'film': 'nests in',
        'gold': 'crawls across',
        'grass': 'in',
        'guitar': 'hides in',
        'heart': 'has',
        'helicopter': 'creeps into',
        'laser': 'too numerous for',
        'lightning': 'hides from',
        'math': "doesn't need",
        'medusa': 'amuses',
        'money': 'nests in',
        'moon': 'nocturnal with',
        'mountain': 'lives on',
        'nuke': 'survives',
        'paper': 'nests between',
        'planet': 'lives on',
        'platimum': 'crawls across',
        'power': 'has survival',
        'prayer': 'despite',
        'rain': "doesn't mind",
        'rainbow': 'unaware of',
        'robot': 'crawls over',
        'satan': 'amuses',
        'sky': 'unaware of',
        'sponge': 'nests in',
        'tv': 'crawls across',
        'tank': 'creeps into',
        'toilet': 'hides in',
        'ufo': 'stows away with',
        'vampire': 'amuses',
        'videogame': 'nests in',
        'water': 'drinks',
    },
    'community': {
        'air': 'pollutes',
        'airplane': 'finances',
        'alien': 'hunts',
        'beer': 'drinks',
        'book': 'library',
        'bowl': 'uses',
        'butter': 'eats',
        'church': 'builds',
        'cloud': 'population',
        'cross': 'gathers by',
        'cup': 'uses',
        'devil': 'rebukes',
        'diamond': 'possesses',
        'dragon': 'hunts',
        'dynamite': 'uses',
        'electricity': 'uses',
        'fence': 'builds',
        'film': 'produces',
        'gold': 'possesses',
        'grass': 'gathers in',
        'guitar': 'plays',
        'heart': 'has',
        'helicopter': 'funds',
        'laser': 'uses',
        'lightning': 'survives',
        'math': 'census uses',
        'medusa': 'hunts',
        'money': 'makes',
        'moon': 'gathers by',
        'mountain': 'lives on',
        'nuke': 'bans',
        'paper': 'news-',
        'planet': 'populates',
        'platimum': 'possesses',
        'power': 'uses',
        'prayer': 'in',
        'rain': 'adapts to',
        'rainbow': 'looks at',
        'robot': 'uses',
        'satan': 'rebukes',
        'sky': 'pollutes',
        'sponge': 'uses',
        'tv': 'watches',
        'tank': 'funds',
        'toilet': 'uses',
        'tornado': 'survives',
        'ufo': 'spots',
        'vampire': 'hunts',
        'videogame': 'plays',
        'water': 'pollutes',
    },
    'computer': {
        'air': 'measures',
        'airplane': 'guides',
        'baby': 'prevents',
        'beer': 'inspires',
        'bicycle': 'designs',
        'bird': 'depicts',
        'blood': 'boils',
        'book': 'writes',
        'bowl': 'pricier than',
        'brain': 'tires',
        'butter': 'sexier than',
        'car': 'enhances',
        'castle': 'depicts',
        'cat': 'depicts',
        'church': 'accounts for',
        'cloud': 'depicts',
        'cockroach': 'houses',
        'community': 'shrinks',
        'cross': 'depicts',
        'cup': 'pricier than',
        'duck': 'depicts',
        'film': 'downloads',
        'fish': 'screensaver',
        'grass': 'depicts',
        'guitar': 'downloads',
        'home': 'in every',
        'king': 'confuses',
        'man': 'confuses',
        'money': 'costs',
        'monkey': 'enrages',
        'moon': 'depicts',
        'noise': 'makes',
        'paper': 'kills',
        'planet': 'shrinks',
        'police': 'aids',
        'porcupine': 'depicts',
        'prince': 'confuses',
        'princess': 'confuses',
        'queen': 'confuses',
        'snake': 'depicts',
        'spider': 'houses',
        'sponge': 'is time',
        'toilet': 'is',
        'train': 'controls',
        'tree': 'depicts',
        'turnip': 'turns brain into',
        'vampire': 'attracts',
        'vulture': 'attracts',
        'wolf': 'depicts',
        'woman': 'confuses',
    },
    'cross': {
        'air': 'winds move',
        'airplane': 'blesses',
        'alien': "doesn't interest",
        'beer': 'adorns',
        'book': 'on good',
        'bowl': 'blesses',
        'butter': 'impales',
        'church': 'atop',
        'cloud': 'clears',
        'cup': 'on holy',
        'devil': 'denounces',
        'diamond': 'jewelry holds',
        'dragon': 'denounces',
        'dynamite': 'fingers before',
        'electricity': 'conducts',
        'fence': 'tears down',
        'film': 'on',
        'gold': 'made of',
        'grass': 'erected in',
        'guitar': 'blesses',
        'heart': 'your',
        'helicopter': 'blesses',
        'laser': 'reflects',
        'lightning': 'attracts',
        'math': 'adds for',
        'medusa': 'thwarts',
        'money': 'costs',
        'moon': 'tracks on',
        'mountain': 'atop',
        'nuke': 'bans',
        'paper': 'drawn on',
        'planet': 'blesses',
        'platimum': 'made of',
        'power': 'represents',
        'prayer': 'in',
        'quicksand': 'above',
        'rain': 'winds bring',
        'rainbow': 'reflects',
        'robot': 'section diagram of',
        'satan': 'denounces',
        'sky': 'lights up',
        'sponge': 'impales',
        'tv': 'hangs over',
        'tank': 'blesses',
        'toilet': 'blesses',
        'tornado': 'fingers before',
        'ufo': "doesn't interest",
        'vampire': 'thwarts',
        'videogame': 'platform',
        'water': 'blesses holy',
    },
    'cup': {
        'alien': 'shaped',
        'axe': 'splashes',
        'beer': 'holds',
        'cage': 'rattles',
        'camera': 'lensed',
        'chain': 'holds',
        'chainsaw': 'splashes',
        'death': 'toasts',
        'devil': 'blesses',
        'diamond': 'holds',
        'dragon': 'attracts',
        'dynamite': 'ears for',
        'electricity': 'conducts',
        'fence': 'sits on',
        'fire': 'splashes',
        'gold': 'made of',
        'gun': 'splashes',
        'heart': 'hand over',
        'helicopter': 'ears for',
        'laser': 'reflects',
        'law': 'toasts',
        'lightning': 'focuses',
        'math': 'for winning a tournament in',
        'medusa': 'attracts',
        'mountain': 'for climbing',
        'nuke': 'shaped',
        'pit': 'shaped',
        'platimum': 'made of',
        'poison': 'holds',
        'power': 'holds holy',
        'prayer': 'accompanies',
        'quicksand': 'floats on',
        'rain': 'catches',
        'rainbow': 'reflects',
        'robot': 'splashes',
        'rock': 'made of',
        'satan': 'blesses',
        'school': 'for',
        'scissors': 'splashes',
        'sky': 'reflects',
        'sun': 'reflects',
        'sword': 'commands',
        'tv': 'sits on',
        'tank': 'ears for',
        'tornado': 'ears for',
        'ufo': 'shaped',
        'videogame': 'splashes',
        'wall': 'smashes against',
        'water': 'holds',
        'whip': 'ears for',
    },
    'death': {
        'axe': 'carries',
        'baby': 'claims',
        'bicycle': 'crashes',
        'bird': 'claims',
        'blood': 'cools',
        'book': 'crumbles',
        'brain': 'claims',
        'butter': 'spoils',
        'cage': 'inside',
        'camera': 'ruins',
        'car': 'crashes',
        'castle': 'crumbles',
        'cat': 'claims',
        'chainsaw': 'dismantles',
        'church': 'saddens',
        'cockroach': 'claims',
        'community': 'saddens',
        'computer': 'crashes',
        'cross': 'on the',
        'duck': 'claims',
        'fire': 'cools',
        'fish': 'claims',
        'home': 'saddens',
        'king': 'claims',
        'man': 'claims',
        'money': '(funeral) costs',
        'monkey': 'claims',
        'noise': 'rattle',
        'paper': 'crumbles',
        'peace': '- rest in',
        'poison': 'is the result of',
        'police': 'claims',
        'porcupine': 'claims',
        'prince': 'claims',
        'princess': 'claims',
        'queen': 'claims',
        'school': 'saddens',
        'scissors': 'not caused by',
        'snake': 'claims',
        'spider': 'claims',
        'sponge': 'dries',
        'sun': 'claims',
        'train': 'stops',
        'tree': 'claims',
        'turnip': 'claims',
        'vampire': 'eludes',
        'vulture': 'feeds',
        'wall': 'knows no',
        'wolf': 'claims',
        'woman': 'claims',
    },
    'devil': {
        'axe': 'weilds',
        'baby': 'possesses',
        'blood': 'poisons',
        'cage': 'escapes',
        'camera': 'blurs',
        'castle': 'has',
        'chain': 'breaks',
        'chainsaw': 'weilds',
        'computer': 'hacks',
        'death': 'after',
        'dynamite': 'lights',
        'electricity': 'cuts',
        'fence': 'hops',
        'fire': 'commands',
        'gun': 'inspires',
        'heart': 'darkens',
        'helicopter': 'crashes',
        'king': 'tempts',
        'laser': 'rewires',
        'law': 'breaks',
        'lightning': 'brings',
        'math': 'quizzes',
        'medusa': 'commands',
        'monkey': 'burns',
        'nuke': 'inspires',
        'peace': 'disturbs',
        'pit': 'hides in',
        'poison': 'uses',
        'police': 'evades',
        'porcupine': 'sharper than',
        'power': 'has',
        'prince': 'tempts',
        'princess': 'tempts',
        'queen': 'tempts',
        'quicksand': 'lures into',
        'robot': 'glitches',
        'rock': 'hurls',
        'school': 'skips',
        'scissors': 'resists',
        'sky': 'darkens',
        'snake': 'eats',
        'sun': 'curses',
        'sword': 'weilds',
        'tank': 'drives',
        'tornado': 'commands',
        'videogame': 'inspires',
        'vulture': 'is soul',
        'wall': 'in the',
        'whip': 'cracks',
        'woman': 'possesses',
    },
    'diamond': {
        'axe': 'engraves',
        'blood': 'outlasts',
        'cage': 'engraves',
        'camera': 'pricier than',
        'castle': 'decorates',
        'chain': 'harder than',
        'chainsaw': 'resists',
        'computer': 'pricier than',
        'death': "'till",
        'devil': 'imprisons',
        'dynamite': 'survives',
        'electricity': 'withstands',
        'fence': 'harder than',
        'fire': 'resists',
        'gold': 'pricier than',
        'gun': 'resists',
        'heart': 'wins',
        'helicopter': 'engraves',
        'king': 'adorns',
        'laser': 'diffracts',
        'law': 'bribes',
        'lightning': 'withstands',
        'math': 'geometric',
        'medusa': 'enthralls',
        'monkey': 'hypnotizes',
        'nuke': 'survives',
        'peace': 'disturbs',
        'pit': 'hides in',
        'platimum': 'pricier than',
        'poison': 'resists',
        'porcupine': 'sharper than',
        'power': 'focuses',
        'prince': 'adorns',
        'princess': 'adorns',
        'queen': 'adorns',
        'quicksand': 'hides in',
        'robot': 'pricier than',
        'rock': 'hardest',
        'school': 'more desirable than',
        'scissors': 'engraves',
        'sky': 'with lucy in',
        'snake': 'charms',
        'sun': 'catches',
        'sword': 'engraves',
        'tank': 'harder than',
        'tornado': 'survives',
        'videogame': 'pricier than',
        'vulture': 'attracts',
        'wall': 'engraves',
        'whip': 'resists',
    },
    'dragon': {
        'axe': 'resists',
        'blood': 'spills',
        'cage': 'escapes',
        'camera': 'before',
        'castle': 'terrorizes',
        'chain': 'breaks',
        'chainsaw': 'before',
        'computer': 'before',
        'death': 'causes',
        'devil': 'commands',
        'diamond': 'hoards',
        'dynamite': 'before',
        'electricity': 'conducts',
        'fence': 'flies over',
        'fire': 'breathes',
        'gold': 'hoards',
        'gun': 'resists',
        'heart': '-',
        'helicopter': 'before',
        'king': 'angers',
        'laser': 'before',
        'law': 'knows no',
        'lightning': 'breathes',
        'math': "doesn't use",
        'medusa': 'torches',
        'monkey': 'torches',
        'nuke': 'before',
        'peace': 'disturbs',
        'pit': 'escapes',
        'platimum': 'hoards',
        'poison': 'breath is',
        'porcupine': 'outclasses',
        'power': 'has',
        'prince': 'eats',
        'queen': 'angers',
        'quicksand': 'too big for',
        'robot': 'torches',
        'rock': 'atop',
        'school': 'torches',
        'scissors': 'resists',
        'sky': 'flies across',
        'snake': 'bigger than',
        'sun': 'flies across',
        'sword': 'resists',
        'tank': 'before',
        'tornado': 'flies over',
        'videogame': 'in',
        'vulture': 'torches',
        'wall': 'flies over',
        'whip': 'torches',
    },
    'duck': {
        'air': 'breathes',
        'airplane': 'blocks',
        'alien': 'hides from',
        'beer': 'drinks',
        'bird': 'larger than',
        'book': 'recipe',
        'bowl': 'tips over',
        'brain': 'has',
        'butter': 'eats',
        'cat': 'intimidates',
        'church': 'disrupts',
        'cloud': 'flies in',
        'cockroach': 'eats',
        'community': 'feeds',
        'cross': 'acts',
        'cup': 'tips over',
        'devil': "doesn't interest",
        'diamond': 'swallows',
        'golden dragon': 'at the',
        'electricity': 'on wire despite',
        'fence': 'flies over',
        'film': 'on',
        'fish': 'eats',
        'gold': 'lays egg of',
        'grass': 'nests in',
        'guitar': 'ruins',
        'heart': 'has',
        'lightning': 'hides from',
        'math': "doesn't need",
        'medusa': 'bites',
        'money': 'costs',
        'moon': 'looks at',
        'mountain': 'flies over',
        'paper': 'carries off',
        'planet': 'lives on',
        'platimum': 'swallows',
        'prayer': 'answers',
        'rain': 'loves',
        'rainbow': 'looks at',
        'robot': 'flies over',
        'satan': "doesn't interest",
        'spider': 'eats',
        'sponge': 'eats',
        'tv': 'on',
        'toilet': 'goes everyhere but',
        'ufo': 'hides from',
        'vampire': 'disgusts',
        'videogame': 'hunt',
        'water': 'drinks',
        'wolf': 'flies from',
    },
    'dynamite': {
        'axe': 'explodes',
        'baby': 'explodes',
        'bicycle': 'explodes',
        'bird': 'explodes',
        'blood': 'spills',
        'cage': 'explodes',
        'camera': 'explodes',
        'car': 'explodes',
        'castle': 'explodes',
        'cat': 'explodes',
        'chain': 'explodes',
        'chainsaw': 'explodes',
        'cockroach': 'explodes',
        'computer': 'explodes',
        'death': 'causes',
        'duck': 'explodes',
        'fire': 'starts',
        'fish': 'explodes',
        'gun': 'outclasses',
        'home': 'explodes',
        'king': 'explodes',
        'law': 'breaks',
        'man': 'explodes',
        'monkey': 'explodes',
        'noise': 'makes',
        'peace': 'disturbs',
        'pit': 'creates',
        'poison': 'explodes',
        'police': 'explodes',
        'porcupine': 'explodes',
        'prince': 'explodes',
        'princess': 'explodes',
        'queen': 'explodes',
        'quicksand': 'clears',
        'rock': 'explodes',
        'school': 'explodes',
        'scissors': 'explodes',
        'snake': 'explodes',
        'spider': 'explodes',
        'sun': 'smoke blots out',
        'sword': 'explodes',
        'tornado': 'outclasses',
        'train': 'explodes',
        'tree': 'explodes',
        'turnip': 'explodes',
        'vulture': 'explodes',
        'wall': 'explodes',
        'whip': 'explodes',
        'wolf': 'explodes',
        'woman': 'explodes',
    },
    'electricity': {
        'axe': 'charges',
        'baby': 'electrocutes',
        'bicycle': 'charges',
        'blood': 'fries',
        'cage': 'charges',
        'camera': 'powers',
        'car': 'short-circuits',
        'castle': 'bills',
        'chain': 'starts a reaction',
        'chainsaw': 'short-circuits',
        'computer': 'short-circuits',
        'death': 'causes',
        'dynamite': 'natural',
        'fire': 'starts',
        'gun': 'charges',
        'helicopter': 'short-circuits',
        'home': 'bills',
        'king': 'electrocutes',
        'laser': 'powers',
        'law': 'has physical',
        'lightning': 'produces',
        'man': 'electrocutes',
        'medusa': 'fries',
        'monkey': 'electrocutes',
        'noise': 'makes',
        'nuke': 'short-circuits',
        'peace': 'disturbs',
        'pit': 'brightens',
        'poison': 'mixes',
        'police': 'electrocutes',
        'porcupine': 'fries',
        'power': 'produces',
        'prince': 'electrocutes',
        'princess': 'electrocutes',
        'queen': 'electrocutes',
        'quicksand': 'charges',
        'rock': 'powers',
        'school': 'bills',
        'scissors': 'charges',
        'sky': 'charges',
        'snake': 'in cable',
        'sun': 'replicates',
        'sword': 'charges',
        'tank': 'short-circuits',
        'tornado': 'envelops',
        'train': 'short-circuits',
        'vulture': 'repels',
        'wall': 'in',
        'whip': 'fries',
        'woman': 'electrocutes',
    },
    'fence': {
        'axe': 'resists',
        'baby': 'around',
        'blood': 'guards banks of',
        'cage': 'surrounds',
        'camera': 'confuses',
        'castle': 'around',
        'chain': 'made of',
        'chainsaw': 'guards',
        'computer': 'around',
        'death': 'guards from',
        'dynamite': 'guards',
        'electricity': 'uses',
        'fire': 'surrounds',
        'gun': 'guards',
        'heart': 'saddens',
        'helicopter': 'guards',
        'king': 'around',
        'laser': 'blocks',
        'law': 'breaks zoning',
        'lightning': 'attracts',
        'man': 'around',
        'math': 'height',
        'medusa': 'blocks',
        'monkey': 'blocks',
        'nuke': 'guards',
        'peace': 'protects',
        'pit': 'around',
        'poison': 'resists',
        'police': 'blocks',
        'porcupine': 'blocks',
        'power': 'around',
        'prince': 'around',
        'princess': 'around',
        'queen': 'around',
        'quicksand': 'above',
        'robot': 'blocks',
        'rock': 'made of',
        'school': 'around',
        'scissors': 'resists',
        'sky': 'blocks',
        'snake': 'blocks',
        'sun': 'blocks',
        'sword': 'resists',
        'tank': 'blocks',
        'tornado': 'survives',
        'video': 'guards',
        'vulture': 'Fence blocks',
        'wall': 'forms',
        'whip': 'resists',
        'woman': 'around',
    },
    'film': {
        'air': 'developer spoils',
        'alien': 'about',
        'beer': 'inspires',
        'bowl': 'covers super',
        'camera': 'fills',
        'chain': 'shots are edited into a',
        'cup': 'covers world',
        'death': 'glorifies',
        'devil': 'about',
        'diamond': 'about',
        'dragon': 'about',
        'dynamite': 'effects use',
        'electricity': 'teaches',
        'fence': 'projected on',
        'fire': 'captures',
        'gold': 'pricier than',
        'guitar': 'score uses',
        'gun': 'rents',
        'heart': 'has',
        'helicopter': 'rents',
        'blueRay': 'on',
        'law': 'Film about',
        'lightning': 'about',
        'math': 'teaches',
        'medusa': 'features',
        'mountain': 'set on',
        'nuke': 'depicts',
        'pit': 'is the',
        'planet': 'entertains',
        'platimum': 'pricier than',
        'power': 'grants',
        'prayer': 'disrupts',
        'quicksand': 'scene with',
        'rain': '- singing in',
        'rainbow': 'has technicolor',
        'robot': 'about',
        'rock': 'starring the',
        'satan': 'about',
        'sky': 'earnings as high as',
        'sun': 'production prefers',
        'sword': 'hero uses',
        'tv': 'before',
        'tank': 'rents',
        'toilet': 'in the can, but not',
        'tornado': 'about',
        'ufo': 'about',
        'videogame': 'based on',
        'wall': 'projected on',
        'water': 'coats',
        'whip': 'hero uses',
    },
    'fire': {
        'airplane': 'consumes',
        'axe': 'melts',
        'baby': 'burns',
        'bicycle': 'burns',
        'bird': 'cooks',
        'blood': 'boils',
        'book': 'burns',
        'brain': 'burns',
        'butter': 'melts',
        'cage': 'melts',
        'car': 'burns',
        'castle': 'burns',
        'cat': 'burns',
        'chainsaw': 'melts',
        'church': 'burns',
        'cloud': 'creates smoke',
        'cockroach': 'burns',
        'community': 'threatens',
        'computer': 'burns',
        'cross': 'burns',
        'duck': 'cooks',
        'fish': 'cooks',
        'grass': 'burns',
        'home': 'burns',
        'king': 'burns',
        'man': 'burns',
        'money': 'burns',
        'monkey': 'burns',
        'moon': '(campfire) in the light of the',
        'noise': 'crackling',
        'paper': 'burns',
        'peace': 'breaks',
        'poison': 'boils',
        'police': 'burns',
        'porcupine': 'burns',
        'prince': 'burns',
        'princess': 'burns',
        'queen': 'burns',
        'school': 'destroys',
        'scissors': 'melts',
        'snake': 'burns',
        'spider': 'burns',
        'sponge': 'burns',
        'train': 'burns',
        'tree': 'burns down',
        'turnip': 'cooks',
        'vampire': 'thwarts',
        'vulture': 'burns',
        'wolf': 'burns',
        'woman': 'burns',
    },
    'fish': {
        'air': 'breathes occasional',
        'airplane': 'feeds',
        'alien': 'intrigues',
        'beer': 'drinks',
        'book': 'recipe',
        'bowl': 'lives in',
        'brain': 'has',
        'butter': 'in',
        'church': 'feeds',
        'cloud': 'makes undersea',
        'cockroach': 'eats',
        'community': 'feeds',
        'cross': 'thrown at',
        'cup': 'swims in',
        'devil': 'unaware of',
        'diamond': 'eyes like',
        'dragon': 'unaware of',
        'electricity': 'dives from',
        'fence': 'swims under',
        'film': 'on',
        'gold': 'colored',
        'grass': 'in sea',
        'guitar': 'soaks',
        'heart': 'has',
        'laser': 'dodges',
        'lightning': 'dives from',
        'math': "doesn't need",
        'medusa': 'disgusts',
        'money': 'costs',
        'moon': 'unaware of',
        'mountain': 'in a lake by a',
        'nuke': 'dodges torpedo',
        'paper': 'soaks',
        'planet': 'lives on',
        'platimum': 'colored',
        'power': 'has spiritual',
        'prayer': 'answers',
        'rain': 'unaware of',
        'rainbow': '(trout) has scales that look like',
        'robot': 'unaware of',
        'satan': 'unaware of',
        'sky': 'unaware of',
        'spider': 'eats',
        'sponge': 'swims over',
        'tv': 'on',
        'toilet': "doesn't use",
        'ufo': 'hides from',
        'vampire': 'amuses',
        'videogame': 'in',
        'water': 'breathes',
    },
    'gold': {
        'axe': 'plated',
        'blood': 'outlasts',
        'cage': 'plated',
        'camera': 'pricier than',
        'castle': 'funds',
        'chain': '-',
        'chainsaw': 'resists',
        'computer': 'wired',
        'death': 'outlasts',
        'devil': 'tempts',
        'dynamite': 'survives',
        'electricity': 'conducts',
        'fence': 'funds',
        'fire': 'resists',
        'gun': 'plated',
        'heart': 'wins',
        'helicopter': 'funds',
        'king': 'adorns',
        'laser': 'wired',
        'law': 'bribes',
        'lightning': 'conducts',
        'math': 'market uses',
        'medusa': 'enthralls',
        'monkey': 'hypnotizes',
        'nuke': 'wired',
        'peace': 'disturbs',
        'pit': 'hides in',
        'poison': 'resists',
        'police': 'badged',
        'porcupine': 'harder than',
        'power': 'conducts',
        'prince': 'adorns',
        'princess': 'adorns',
        'queen': 'adorns',
        'quicksand': 'hides in',
        'robot': 'plated',
        'rock': 'rarer than',
        'school': 'more desirable than',
        'scissors': 'plated',
        'sky': 'reflects',
        'snake': 'charms',
        'sun': 'reflects',
        'sword': 'decorates',
        'tank': 'funds',
        'tornado': 'survives',
        'videogame': 'pricier than',
        'vulture': 'attracts',
        'wall': 'plated',
        'whip': 'resists',
        'woman': 'enthralls',
    },
    'grass': {
        'air': 'produces',
        'alien': "isn't food for",
        'beer': 'stronger than',
        'bowl': 'fills',
        'camera': 'blurry in',
        'chain': 'hides',
        'cup': 'hides',
        'death': 'annual despite',
        'devil': 'inspires worship of',
        'diamond': 'hides',
        'dragon': "isn't food for",
        'dynamite': 'survives',
        'electricity': 'conducts',
        'fence': 'overgrows',
        'film': 'blurry in',
        'gold': 'hides',
        'guitar': 'inspires',
        'gun': 'hides',
        'heart': 'speeds up',
        'helicopter': 'too rough for',
        'laser': 'too widespread for',
        'law': 'breaks',
        'lightning': 'survives',
        'math': 'unlocks',
        'medusa': 'is greener than',
        'mountain': 'grows on',
        'nuke': 'field full of protesters against',
        'pit': 'hides',
        'planet': 'covers',
        'platimum': 'hides',
        'power': 'brings flower',
        'prayer': 'more visceral than',
        'quicksand': 'hides',
        'rain': 'loves',
        'rainbow': 'dew droplets make little',
        'robot': 'turns you into',
        'rock': 'overgrows',
        'satan': 'inspires',
        'sky': 'releases pollen into',
        'sun': 'prefers moderate',
        'sword': 'hides',
        'tv': 'inspires',
        'tank': 'gives cover from',
        'toilet': 'becomes',
        'tornado': 'survives',
        'ufo': 'provides landing area for',
        'videogame': 'inspires',
        'wall': 'overgrows',
        'water': 'drinks',
        'whip': 'constructs',
    },
    'guitar': {
        'alien': 'intrigues',
        'beer': 'inspires',
        'bowl': 'at hollywood',
        'camera': 'pricier than',
        'chain': 'breaks',
        'chainsaw': 'sounds like',
        'cup': 'fills donation',
        'death': 'song about',
        'devil': 'invokes',
        'diamond': 'shines like',
        'dragon': 'subdues',
        'dynamite': 'rallies against',
        'electricity': 'uses',
        'fence': 'heard over',
        'fire': 'on',
        'gold': 'album goes',
        'gun': 'rallies against',
        'heart': 'played with',
        'helicopter': 'rallies against',
        'laser': 'concert uses',
        'law': 'breaks',
        'lightning': 'fingered like',
        'math': 'notes use',
        'medusa': 'hypnotizes',
        'mountain': 'echoes across',
        'nuke': 'rallies against',
        'pit': 'echoes',
        'platimum': 'album goes',
        'poison': 'is ear',
        'power': 'solo super',
        'prayer': 'accompanies',
        'quicksand': 'floats in',
        'rain': 'notes like',
        'rainbow': 'song about',
        'robot': 'confuses',
        'rock': 'plays',
        'satan': 'invokes',
        'school': 'distracts',
        'scissors': 'strings resists',
        'sky': 'echoes across',
        'sun': 'reflects',
        'sword': 'stays',
        'tv': 'on',
        'tank': 'rallies against',
        'tornado': 'cheers',
        'ufo': 'group',
        'videogame': 'sountracks',
        'wall': 'echoes off',
        'water': 'echoes across',
        'whip': 'accompanies',
    },
    'gun': {
        'axe': 'outclasses',
        'baby': 'shoots',
        'bicycle': 'shoots',
        'bird': 'shoots',
        'blood': 'spills',
        'brain': 'splatters',
        'cage': 'shoots through',
        'camera': 'shoots at',
        'car': 'hijacks',
        'castle': 'fires into',
        'cat': 'shoots',
        'chainsaw': 'outclasses',
        'cockroach': 'shoots',
        'community': 'threatens',
        'computer': 'shoots',
        'cross': 'shoots the target',
        'death': 'causes',
        'duck': 'shoots',
        'fire': 'uses',
        'fish': 'shoots',
        'home': 'protects',
        'king': 'shoots',
        'law': 'breaks',
        'man': 'shoots',
        'money': 'robs',
        'monkey': 'shoots',
        'noise': 'makes',
        'peace': 'disturbs',
        'poison': 'deadlier than',
        'police': 'shoots',
        'porcupine': 'shoots',
        'prince': 'shoots',
        'princess': 'shoots',
        'queen': 'shoots',
        'rock': 'targets',
        'school': 'closes',
        'scissors': 'outclasses',
        'snake': 'shoots',
        'spider': 'shoots',
        'sun': 'shoots at',
        'sword': 'outclasses',
        'train': 'holds up',
        'tree': 'targets',
        'turnip': 'blasts apart',
        'vampire': 'uses a silver bullet to shoot',
        'vulture': 'shoots',
        'wall': 'targets',
        'whip': 'outclasses',
        'wolf': 'shoots',
        'woman': 'shoots',
    },
    'heart': {
        'axe': 'stays',
        'baby': 'protects',
        'blood': 'pumps',
        'cage': 'transcends',
        'camera': 'guides',
        'car': 'invents eco',
        'castle': 'builds',
        'chain': 'my un-',
        'chainsaw': 'bans',
        'computer': 'excels at',
        'death': 'transcends',
        'dynamite': 'bans',
        'electricity': 'uses bio',
        'fire': 'on',
        'gun': 'bans',
        'helicopter': 'soars like',
        'home': 'builds',
        'king': 'guides',
        'laser': 'surgery with',
        'law': 'upholds',
        'lightning': 'survives',
        'man': 'guides',
        'medusa': 'pities',
        'monkey': 'guides',
        'noise': 'makes',
        'nuke': 'bans',
        'peace': 'upholds',
        'pit': 'survives',
        'poison': 'bans',
        'police': 'bolsters',
        'porcupine': 'outsmarts',
        'power': 'provides',
        'prince': 'guides',
        'princess': 'guides',
        'queen': 'guides',
        'quicksand': 'rescues from',
        'rock': 'like a',
        'school': 'excels at',
        'scissors': 'guides',
        'sky': 'clears',
        'snake': 'resists',
        'sun': 'of the',
        'sword': 'stays',
        'tank': 'bans',
        'tornado': 'survives',
        'train': 'prefers',
        'vulture': 'outsmarts',
        'wall': 'knows no',
        'whip': 'stays',
        'woman': 'guides',
    },
    'helicopter': {
        'axe': 'flies over',
        'baby': 'carries',
        'bicycle': 'faster than',
        'bird': 'faster than',
        'blood': 'gets',
        'cage': 'flies over',
        'camera': 'carries',
        'car': 'faster than',
        'castle': 'flies over',
        'cat': 'flies over',
        'chain': 'breaks',
        'chainsaw': 'flies over',
        'computer': 'uses',
        'death': 'causes',
        'duck': 'flies over',
        'dynamite': 'drops',
        'fire': 'flies over',
        'fish': 'flies over',
        'gun': 'has',
        'home': 'flies over',
        'king': 'carries',
        'law': 'imposes',
        'man': 'carries',
        'monkey': 'flies over',
        'noise': 'makes',
        'peace': 'disturbs',
        'pit': 'flies over',
        'poison': 'flies over',
        'police': 'carries',
        'porcupine': 'flies over',
        'prince': 'carries',
        'princess': 'carries',
        'queen': 'carries',
        'quicksand': 'flies over',
        'rock': 'flies over',
        'school': 'flies over',
        'scissors': 'flies over',
        'snake': 'flies over',
        'spider': 'flies over',
        'sun': 'cloud blocks',
        'sword': 'flies over',
        'tornado': 'flies over',
        'train': 'faster than',
        'tree': 'flies over',
        'turnip': 'flies over',
        'vulture': 'flies over',
        'wall': 'flies over',
        'whip': 'flies over',
        'wolf': 'flies over',
        'woman': 'carries',
    },
    'home': {
        'air': 'has central',
        'airplane': 'cozier than',
        'alien': 'keeps out',
        'beer': 'contains',
        'bicycle': 'pricier than',
        'bird': 'contains',
        'book': 'contains',
        'bowl': 'contains',
        'brain': 'requires',
        'butter': 'contains',
        'car': 'pricier than',
        'cat': 'contains',
        'church': 'cozier than',
        'cloud': 'blocks',
        'cockroach': 'houses',
        'community': 'populates',
        'cross': 'contains',
        'cup': 'contains',
        'devil': 'envied by',
        'diamond': 'pricier than',
        'dragon': 'blocks',
        'duck': 'yard has',
        'fence': 'has',
        'film': 'in',
        'fish': 'contains',
        'gold': 'pricier than',
        'grass': 'yard has',
        'guitar': 'contains',
        'money': 'costs',
        'moon': 'blocks',
        'mountain': 'atop',
        'noise': 'blocks',
        'paper': 'contains',
        'planet': 'on',
        'platimum': 'pricier than',
        'prayer': 'answers',
        'rain': 'blocks',
        'rainbow': 'blocks',
        'satan': 'denounces',
        'spider': 'houses',
        'sponge': 'contains',
        'tv': 'has',
        'toilet': 'has',
        'train': 'cozier than',
        'tree': 'yard has',
        'turnip': 'garden has',
        'ufo': 'blocks',
        'vampire': 'blocks',
        'water': 'plumbs',
        'wolf': 'keeps out',
    },
    'king': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'disbelieves',
        'baby': 'sires',
        'beer': 'drinks',
        'bicycle': 'rides',
        'bird': 'eats',
        'book': 'inspires',
        'bowl': 'eats from',
        'brain': 'has',
        'butter': 'eats',
        'car': 'rides in',
        'cat': 'owns',
        'church': 'funds',
        'cloud': 'looks at',
        'cockroach': 'steps on',
        'community': 'rules',
        'cross': 'erects',
        'cup': 'drinks from',
        'duck': 'eats',
        'film': 'inspires',
        'fish': 'eats',
        'grass': 'walks on',
        'guitar': 'outlaws',
        'home': 'taxes',
        'man': 'rules',
        'money': 'has',
        'moon': 'looks at',
        'noise': 'outlaws',
        'paper': 'writes',
        'planet': 'declares flat',
        'police': 'governs',
        'prayer': 'in',
        'prince': 'rules over',
        'princess': 'rules over',
        'queen': 'rules over',
        'rain': 'walks in',
        'rainbow': 'looks at',
        'spider': 'steps on',
        'sponge': 'owns',
        'tv': 'on',
        'toilet': 'uses',
        'train': 'rides on',
        'tree': 'owns',
        'turnip': 'eats',
        'ufo': 'disbelieves',
        'vampire': 'could be',
        'water': 'drinks',
        'wolf': 'tames',
        'woman': 'rules',
    },
    'laser': {
        'axe': 'outlcasses',
        'baby': 'targets',
        'bicycle': 'melts',
        'blood': 'cooks',
        'cage': 'melts',
        'camera': 'burns',
        'car': 'targets',
        'castle': 'targets',
        'chain': 'starts reaction',
        'chainsaw': 'outclasses',
        'computer': 'backs up',
        'death': 'causes',
        'duck': 'fries',
        'dynamite': 'outclasses',
        'fire': 'starts',
        'gun': '-',
        'helicopter': 'targets',
        'home': 'targets',
        'king': 'targets',
        'law': 'upholds',
        'man': 'targets',
        'monkey': 'fries',
        'noise': 'zap',
        'nuke': 'guides',
        'peace': 'disturbs',
        'pit': 'lights',
        'poison': 'more exact than',
        'police': 'helps',
        'porcupine': 'fries',
        'prince': 'targets',
        'princess': 'targets',
        'queen': 'targets',
        'quicksand': 'burns off',
        'rock': 'burns through',
        'school': 'teaches',
        'scissors': 'melts',
        'sky': 'traverses',
        'snake': 'fries',
        'sun': 'has power of',
        'sword': 'outclasses',
        'tank': 'targets',
        'tornado': 'penetrates',
        'train': 'targets',
        'tree': 'burns through',
        'turnip': 'discintigrates',
        'vulture': 'fries',
        'wall': 'burns through',
        'whip': 'outclasses',
        'wolf': 'fries',
        'woman': 'targets',
    },
    'law': {
        'axe': 'ensures safe use of',
        'baby': 'protects',
        'bicycle': 'ensures safe use of',
        'bird': 'protects',
        'blood': 'protects',
        'brain': 'confounds',
        'cage': 'puts you in',
        'camera': 'restricts',
        'car': 'protects',
        'castle': 'protects',
        'cat': 'protects',
        'chainsaw': 'ensures safe use of',
        'cockroach': 'kills',
        'community': 'protects',
        'computer': 'restricts',
        'cross': 'respects',
        'death': 'prevents',
        'duck': 'protects',
        'fire': 'restricts',
        'fish': 'protects',
        'home': 'protects',
        'king': 'protects',
        'man': 'protects',
        'money': 'costs',
        'monkey': 'protects',
        'noise': 'restricts',
        'peace': 'keeps',
        'poison': 'restricts',
        'police': 'protects',
        'porcupine': 'protects',
        'prince': 'protects',
        'princess': 'protects',
        'queen': 'protects',
        'rock': 'set in stone',
        'school': 'provides',
        'scissors': 'ensures safe use of',
        'snake': 'protects',
        'spider': 'protects rare',
        'sponge': 'cleans like',
        'sun': 'explains',
        'sword': 'restricts',
        'train': 'protects',
        'tree': 'protects',
        'turnip': 'protects',
        'vampire': 'chases',
        'vulture': 'protects',
        'wall': 'protects',
        'whip': 'restricts',
        'wolf': 'protects',
        'woman': 'protects',
    },
    'lightning': {
        'axe': 'charges',
        'baby': 'scares',
        'bicycle': 'strikes',
        'blood': 'cooks',
        'cage': 'charges',
        'camera': 'challenges',
        'car': '(greased)',
        'castle': 'strikes',
        'chain': 'starts reaction',
        'chainsaw': 'outclasses',
        'computer': 'short-circuits',
        'death': 'causes',
        'dynamite': 'ignites',
        'fire': 'starts',
        'gun': 'charges',
        'helicopter': 'strikes',
        'home': 'strikes',
        'king': 'strikes',
        'laser': 'outclasses',
        'law': 'has physical',
        'man': 'strikes',
        'medusa': 'strikes',
        'monkey': 'strikes',
        'noise': 'makes',
        'nuke': 'short-circuits',
        'peace': 'disturbs',
        'pit': 'creates',
        'poison': 'deadlier than',
        'police': 'strikes',
        'porcupine': 'strikes',
        'power': 'produces',
        'prince': 'strikes',
        'princess': 'strikes',
        'queen': 'strikes',
        'quicksand': 'creates',
        'rock': 'splits',
        'school': 'strikes',
        'scissors': 'charges',
        'sky': 'decorates',
        'snake': 'strikes',
        'sun': 'storm blocks',
        'sword': 'strikes',
        'tank': 'strikes',
        'tornado': 'envelops',
        'train': 'strikes',
        'tree': 'strikes',
        'vulture': 'strikes',
        'wall': 'strikes through',
        'whip': 'fries',
        'woman': 'strikes',
    },
    'man': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'disproves',
        'beer': 'drinks',
        'bicycle': 'rides',
        'bird': 'flips',
        'book': 'reads',
        'bowl': 'eats from',
        'brain': 'has',
        'butter': 'eats',
        'car': 'drives',
        'cat': 'owns',
        'church': 'attends',
        'cloud': 'looks at',
        'cockroach': 'steps on',
        'community': 'lives in',
        'cross': 'hangs on',
        'cup': 'drinks from',
        'devil': 'exorcises',
        'diamond': 'mines',
        'dragon': 'slays',
        'duck': 'eats',
        'film': 'watches',
        'fish': 'eats',
        'gold': 'mines',
        'grass': 'walks on',
        'guitar': 'plays',
        'home': 'lives in',
        'money': 'spends',
        'moon': 'travels to',
        'mountain': 'climbs',
        'noise': 'makes',
        'paper': 'writes',
        'planet': 'lives on',
        'platimum': 'refines',
        'prayer': 'in',
        'rain': 'plays in',
        'rainbow': 'looks at',
        'satan': 'denounces',
        'spider': 'steps on',
        'sponge': 'cleans with',
        'tv': 'watches',
        'toilet': 'uses',
        'train': 'rides on',
        'tree': 'plants',
        'turnip': 'eats',
        'ufo': 'debunks',
        'vampire': 'becomes',
        'water': 'drinks',
        'wolf': 'tames',
    },
    'math': {
        'axe': 'whiz sharper than',
        'baby': 'confuses',
        'blood': 'calculates',
        'cage': 'mental',
        'camera': 'shapes',
        'castle': 'measures',
        'chain': 'uses number',
        'chainsaw': 'directs',
        'computer': 'on',
        'death': 'transcends',
        'dynamite': 'measures',
        'electricity': 'calculates',
        'fire': 'measures',
        'gun': 'test inspires',
        'heart': 'darkens',
        'helicopter': 'navigates',
        'home': 'after college at',
        'king': 'confuses',
        'laser': 'formulates',
        'law': 'formulates',
        'lightning': 'calculates',
        'man': 'confuses',
        'medusa': 'confuses',
        'monkey': 'enrages',
        'nuke': 'formulates',
        'peace': 'is',
        'pit': 'helps work out the angles of',
        'poison': 'measures',
        'police': 'confuses',
        'porcupine': 'counts',
        'power': 'brain',
        'prince': 'confuses',
        'princess': 'confuses',
        'queen': 'confuses',
        'quicksand': 'test like',
        'robot': 'navigates',
        'rock': 'schoolhouse',
        'school': 'bores',
        'scissors': 'guides',
        'sky': 'class denies',
        'snake': 'measures',
        'sun': 'calculates',
        'sword': 'measures',
        'tank': 'navigates',
        'tornado': 'predicts',
        'train': 'word problem with',
        'vulture': 'test attracts',
        'wall': 'measures',
        'whip': 'whiz sharp as',
        'woman': 'confuses',
    },
    'medusa': {
        'axe': 'weilds',
        'baby': 'petrifies',
        'bicycle': 'before',
        'blood': 'freezes',
        'cage': 'escapes',
        'camera': 'before',
        'car': 'before',
        'castle': 'terrorizes',
        'chain': 'breaks',
        'chainsaw': 'before',
        'computer': 'before',
        'death': 'causes',
        'dynamite': 'before',
        'fire': 'starts',
        'gun': 'before',
        'helicopter': 'evades',
        'home': 'terrifies',
        'king': 'petrifies',
        'laser': 'before',
        'law': 'breaks',
        'man': 'petrifies',
        'monkey': 'petrifies',
        'noise': 'screeches',
        'nuke': 'before',
        'peace': 'disturbs',
        'pit': 'lives in',
        'poison': 'deadlier than',
        'police': 'petrifies',
        'porcupine': 'petrifies',
        'power': 'craves',
        'prince': 'petrifies',
        'princess': 'petrifies',
        'queen': 'petrifies',
        'quicksand': 'plants',
        'rock': 'hurls',
        'school': 'terrorizes',
        'scissors': 'runs with',
        'sky': 'curses',
        'snake': 'head',
        'sun': 'curses',
        'sword': 'weilds',
        'tank': 'resists',
        'tornado': 'hides from',
        'train': 'before',
        'tree': 'hides behind',
        'turnip': 'discards',
        'vulture': 'petrifies',
        'wall': 'hides behind',
        'whip': 'cracks',
        'woman': 'petrifies',
    },
    'money': {
        'air': 'pollutes',
        'airplane': 'bankrupts',
        'alien': "doesn't interest",
        'beer': 'imports',
        'book': 'funds',
        'bowl': 'fills',
        'butter': 'buys',
        'church': 'funds',
        'cloud': 'clears',
        'cup': 'fills',
        'devil': 'make a man',
        'diamond': 'mines',
        'dragon': 'enthralls',
        'dynamite': 'funds',
        'electricity': 'conducts',
        'fence': 'repairs',
        'film': 'funds',
        'gold': 'is',
        'grass': 'landscapes',
        'guitar': 'buys',
        'heart': 'tricks',
        'helicopter': 'funds',
        'laser': 'funds',
        'lightning': 'vanishes like',
        'math': 'uses',
        'medusa': 'bribes',
        'moon': 'funds trip to',
        'mountain': 'buys',
        'nuke': 'funds',
        'paper': 'funds news',
        'pit': '-',
        'planet': 'conquers',
        'platimum': 'is',
        'power': 'brings',
        'prayer': 'answers',
        'quicksand': 'debt is',
        'rain': 'flows like',
        'rainbow': 'at the end of',
        'robot': 'funds',
        'satan': 'brings souls to',
        'sky': 'piled up to',
        'sponge': 'hires',
        'tv': 'corrupts',
        'tank': 'funds',
        'toilet': 'fixes',
        'tornado': 'pays for protection from',
        'ufo': "doesn't interest",
        'vampire': 'bribes',
        'videogame': 'develops',
        'water': 'floats on',
    },
    'monkey': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'infuriates',
        'baby': 'scares',
        'beer': 'chugs',
        'bicycle': 'climbs on',
        'bird': 'scares',
        'book': 'rips up',
        'bowl': 'smashes',
        'brain': 'has',
        'butter': 'eats',
        'car': 'climbs on',
        'cat': 'scares',
        'church': 'climbs',
        'cloud': 'shrieks at',
        'cockroach': 'eats',
        'community': 'irritates',
        'cross': 'climbs',
        'cup': 'smashes',
        'duck': 'scares',
        'film': 'rips out',
        'fish': 'eats',
        'grass': 'sits on',
        'guitar': 'smashes',
        'home': 'climbs on',
        'king': 'flings poop at',
        'man': 'flings poop at',
        'money': 'shreds',
        'moon': 'screeches at',
        'noise': 'makes',
        'paper': 'rips up',
        'planet': 'lives on',
        'police': 'flings poop at',
        'prince': 'flings poop at',
        'princess': 'flings poop at',
        'queen': 'flings poop at',
        'rain': "doesn't mind",
        'rainbow': 'glares at',
        'spider': 'eats',
        'sponge': 'rips up',
        'tv': 'smashes',
        'toilet': 'goes everywhere but',
        'train': 'climbs on',
        'tree': 'climbs',
        'turnip': 'eats',
        'ufo': 'shrieks at',
        'vampire': 'irritates',
        'water': 'drinks',
        'wolf': 'enrages',
        'woman': 'flings poop at',
    },
    'moon': {
        'air': 'has no',
        'alien': 'houses',
        'beer': '-shine stronger than',
        'bowl': 'shaped like',
        'chain': 'far above',
        'cup': '-shine in',
        'death': 'symbolizes',
        'devil': 'terrifies',
        'diamond': 'shines like',
        'dragon': 'shines on',
        'dynamite': 'suffocates',
        'electricity': 'has no',
        'fence': 'far above',
        'film': 'in',
        'gold': 'colored',
        'grass': 'has no',
        'guitar': 'adorns',
        'gun': 'too far for',
        'heart': '-light walk with',
        'helicopter': 'too far for',
        'laser': 'too far for',
        'law': 'has no',
        'lightning': 'far above',
        'math': 'lander uses',
        'medusa': 'far above',
        'mountain': 'far above',
        'nuke': 'too far for',
        'pit': 'crater',
        'planet': 'orbits',
        'platimum': 'colored',
        'power': 'visit uses',
        'prayer': 'shines on',
        'quicksand': 'far above',
        'rain': 'far above',
        'rainbow': 'far above',
        'robot': 'lander uses',
        'rock': 'is giant',
        'satan': 'confuses',
        'sky': 'adorns',
        'sun': 'eclipses',
        'sword': 'adorns',
        'tv': 'on',
        'tank': 'far above',
        'toilet': 'has no',
        'tornado': 'far above',
        'ufo': 'houses',
        'videogame': 'patrol',
        'wall': 'far above',
        'water': 'has no',
        'whip': 'far above',
    },
    'mountain': {
        'axe': 'survives',
        'blood': 'outlasts',
        'cage': 'outlasts',
        'camera': 'challenges',
        'castle': 'taller than',
        'chain': 'is too big for',
        'chainsaw': 'survives',
        'computer': 'outlasts',
        'death': 'transcends',
        'devil': 'houses',
        'diamond': 'contains',
        'dragon': 'houses',
        'dynamite': 'survives',
        'electricity': 'conducts',
        'fence': 'taller than',
        'fire': 'survives',
        'gold': 'contains',
        'gun': 'echoes',
        'heart': 'stimulates',
        'helicopter': 'too high for',
        'king': 'challenges old',
        'laser': 'too big for',
        'law': 'outlasts',
        'lightning': 'attracts',
        'math': 'height',
        'medusa': 'houses',
        'monkey': 'houses',
        'nuke': 'survives',
        'peace': 'stands in',
        'pit': 'hides',
        'platimum': 'contains',
        'poison': 'unaffected by',
        'porcupine': 'houses',
        'power': 'represents',
        'quicksand': 'contains',
        'robot': 'too rough for',
        'rock': 'made of',
        'satan': 'houses',
        'school': 'rises above',
        'scissors': 'unaffected by',
        'sky': 'fills',
        'snake': 'houses',
        'sun': 'blocks',
        'sword': 'unaffected by',
        'tank': 'too steep for',
        'tornado': 'bigger than',
        'videogame': 'outlasts',
        'vulture': 'houses',
        'wall': 'forms',
        'whip': 'echoes',
    },
    'noise': {
        'air': 'permeates',
        'airplane': 'disrupts',
        'alien': 'attracts',
        'beer': 'inspires',
        'bicycle': 'knocks over',
        'bird': 'scares',
        'book': 'ruins',
        'bowl': 'through',
        'brain': 'stimulates',
        'butter': 'melts',
        'cat': 'scares',
        'church': 'disrupts',
        'cloud': 'heard through',
        'cockroach': 'kills',
        'community': 'annoys',
        'cross': 'makes you',
        'cup': 'through',
        'devil': 'louder than',
        'diamond': 'locates',
        'dragon': 'attracts',
        'duck': 'scares',
        'fence': 'heard over',
        'film': 'track in',
        'fish': 'locates',
        'gold': 'locates',
        'grass': 'in',
        'guitar': 'amplified',
        'math': 'wave',
        'money': 'fine costs',
        'moon': 'travels to',
        'mountain': 'echoes across',
        'paper': 'heard through',
        'planet': 'heard across',
        'platimum': 'locates',
        'prayer': 'disrupts',
        'rain': 'heard in',
        'rainbow': 'spectrum',
        'robot': 'navigates',
        'satan': 'summons',
        'spider': 'attracts',
        'sponge': 'envelops',
        'tv': 'on',
        'toilet': 'of broken',
        'tree': 'in',
        'turnip': 'locates',
        'ufo': 'attracts',
        'vampire': 'annoys',
        'videogame': 'in',
        'water': 'across',
        'wolf': 'scares',
    },
    'nuke': {
        'axe': 'incinerates',
        'baby': 'incinerates',
        'bicycle': 'incinerates',
        'blood': 'incinerates',
        'cage': 'incinerates',
        'camera': 'incinerates',
        'car': 'incinerates',
        'castle': 'incinerates',
        'cat': 'incinerates',
        'chain': 'starts reaction',
        'chainsaw': 'incinerates',
        'computer': 'incinerates',
        'death': 'causes',
        'duck': 'incinerates',
        'dynamite': 'outclasses',
        'fire': 'starts',
        'gun': 'outclasses',
        'helicopter': 'incinerates',
        'home': 'incinerates',
        'king': 'incinerates',
        'law': 'breaks',
        'man': 'incinerates',
        'monkey': 'incinerates',
        'noise': 'makes',
        'peace': 'breaks',
        'pit': 'emerges from',
        'poison': 'incinerates',
        'police': 'incinerates',
        'porcupine': 'incinerates',
        'prince': 'incinerates',
        'princess': 'incinerates',
        'queen': 'incinerates',
        'quicksand': 'incinerates',
        'rock': 'incinerates',
        'school': 'incinerates',
        'scissors': 'incinerates',
        'sky': 'poisons',
        'snake': 'incinerates',
        'sun': 'has power of',
        'sword': 'incinerates',
        'tank': 'incinerates',
        'tornado': 'outclasses',
        'train': 'incinerates',
        'tree': 'incinerates',
        'turnip': 'incinerates',
        'vulture': 'incinerates',
        'wall': 'incinerates',
        'whip': 'incinerates',
        'wolf': 'incinerates',
        'woman': 'incinerates',
    },
    'paper': {
        'air': 'fans',
        'airplane': '-',
        'alien': 'disproves',
        'beer': 'label on',
        'bowl': 'mache',
        'chain': '-',
        'cloud': 'fans',
        'cup': '-',
        'devil': 'rebukes',
        'diamond': 'receipt for',
        'dragon': 'rebukes',
        'dynamite': 'encases',
        'electricity': 'defines',
        'fence': 'thrown over',
        'film': 'reviews',
        'gold': 'note for',
        'grass': 'covers',
        'guitar': 'wraps',
        'gun': 'outlaws',
        'heart': 'cutout of',
        'helicopter': 'about',
        'laser': 'defines',
        'law': 'explains',
        'lightning': 'defines',
        'math': 'tests',
        'medusa': 'about',
        'moon': '-',
        'mountain': 'pile',
        'nuke': 'defines',
        'pit': 'covers',
        'planet': 'about',
        'platimum': 'note for',
        'power': 'about',
        'prayer': 'contains',
        'quicksand': 'floats on',
        'rain': 'blocks',
        'rainbow': 'cutout of',
        'robot': 'describes',
        'rock': 'covers',
        'satan': 'rebukes',
        'sky': 'confetti fills',
        'sword': 'wraps',
        'tv': 'more info than',
        'tank': 'about',
        'toilet': 'cover on',
        'tornado': 'predicts',
        'ufo': 'disproves',
        'videogame': 'label for',
        'water': 'floats on',
        'whip': 'wraps',
    },
    'peace': {
        'air': 'cleans',
        'airplane': 'protects',
        'baby': 'protects',
        'bicycle': 'protects',
        'bird': 'protects',
        'blood': 'spills no',
        'book': 'inspires',
        'bowl': 'cleans',
        'brain': 'of mind calms',
        'butter': 'purifies',
        'car': 'protects',
        'castle': 'protects',
        'cat': 'protects',
        'church': 'be with you',
        'cloud': 'clears',
        'cockroach': 'protects',
        'community': 'protects',
        'computer': 'cleans up',
        'cross': 'be with you',
        'cup': 'cleans',
        'duck': 'protects',
        'film': 'allows',
        'fish': 'protects',
        'grass': 'protects',
        'guitar': 'inspires',
        'home': 'protects',
        'king': 'comforts',
        'man': 'comforts',
        'money': 'saves',
        'monkey': 'protects',
        'moon': 'by the light of',
        'noise': 'without',
        'paper': 'inspires',
        'planet': 'saves',
        'police': 'keeping',
        'porcupine': 'protects',
        'prince': 'comforts',
        'princess': 'comforts',
        'queen': 'comforts',
        'snake': 'protects',
        'spider': 'protects',
        'sponge': 'cleanses like',
        'toilet': 'cleans',
        'train': 'protects',
        'tree': 'chops down',
        'turnip': 'nurtures',
        'vampire': 'bores',
        'vulture': 'protects',
        'wolf': 'protects',
        'woman': 'comforts',
    },
    'pit': {
        'axe': 'swallows',
        'baby': 'swallows',
        'bicycle': 'swallows',
        'bird': 'swallows',
        'blood': 'contains',
        'brain': 'swallows',
        'cage': 'becomes',
        'camera': 'swallows',
        'car': 'swallows',
        'castle': 'protects',
        'cat': 'swallows',
        'chain': 'swallows',
        'chainsaw': 'swallows',
        'cockroach': 'houses',
        'community': 'threatens',
        'computer': 'swallows',
        'cross': 'swallows',
        'death': 'causes',
        'duck': 'swallows',
        'fire': 'contains',
        'fish': 'contains',
        'gun': 'swallows',
        'home': 'wrecks',
        'king': 'swallows',
        'law': 'knows no',
        'man': 'swallows',
        'monkey': 'swallows',
        'noise': 'echoes',
        'peace': 'disturbs',
        'poison': 'engulfs',
        'police': 'swallows',
        'porcupine': 'swallows',
        'prince': 'swallows',
        'princess': 'swallows',
        'queen': 'swallows',
        'rock': 'swallows',
        'school': 'endangers',
        'scissors': 'swallows',
        'snake': 'swallows',
        'spider': 'houses',
        'sun': 'removes',
        'sword': 'swallows',
        'train': 'wrecks',
        'tree': 'prevents',
        'turnip': 'swallows',
        'vulture': 'swallows',
        'wall': 'protects',
        'whip': 'too deep for',
        'wolf': 'swallows',
        'woman': 'swallows',
    },
    'planet': {
        'alien': 'houses',
        'beer': 'drinks',
        'bowl': 'decorates',
        'camera': 'too big for',
        'chain': 'supports food',
        'chainsaw': 'survives',
        'cup': 'decorates',
        'death': 'renews',
        'devil': 'rebukes',
        'diamond': 'creates',
        'dragon': 'rebukes',
        'dynamite': 'survives',
        'electricity': 'conducts',
        'fence': 'builds',
        'fire': 'mantle contains',
        'gold': 'creates',
        'guitar': 'reveres',
        'gun': 'survives',
        'heart': 'has many',
        'helicopter': 'survives',
        'laser': 'survives',
        'law': 'above our',
        'lightning': 'supports',
        'math': 'orbit uses',
        'medusa': 'rebukes',
        'mountain': 'supports',
        'nuke': 'survives',
        'pit': 'crater is',
        'platimum': 'creates',
        'power': 'has untold',
        'prayer': 'in',
        'quicksand': 'supports',
        'rain': 'develops',
        'rainbow': 'diverse as',
        'robot': 'uses',
        'rock': 'supports',
        'satan': 'rebukes',
        'school': 'goes to',
        'scissors': 'uses',
        'sky': 'supports',
        'sun': 'orbits',
        'sword': 'survives',
        'tv': 'watches',
        'tank': 'survives',
        'tornado': 'supports',
        'ufo': 'houses',
        'videogame': 'plays',
        'wall': 'supports',
        'water': 'supports',
        'whip': 'moves faster than',
    },
    'platimum': {
        'axe': 'decorates',
        'blood': 'outlasts',
        'cage': 'coated',
        'camera': 'pricier than',
        'castle': 'funds',
        'chain': '-',
        'chainsaw': 'resists',
        'computer': 'wired',
        'death': 'outlasts',
        'devil': 'tempts',
        'dynamite': 'survives',
        'electricity': 'conducts',
        'fence': 'funds',
        'fire': 'resists',
        'gold': 'pricier than',
        'gun': 'decorates',
        'heart': 'wins',
        'helicopter': 'decorates',
        'king': 'adorns',
        'laser': 'wired',
        'law': 'bribes',
        'lightning': 'conducts',
        'math': 'market uses',
        'medusa': 'enthralls',
        'monkey': 'hypnotizes',
        'nuke': 'wired',
        'peace': 'disturbs',
        'pit': 'hides in',
        'poison': 'resists',
        'police': 'badged',
        'porcupine': 'harder than',
        'power': 'conducts',
        'prince': 'adorns',
        'princess': 'adorns',
        'queen': 'adorns',
        'quicksand': 'hides in',
        'robot': 'wired',
        'rock': 'rarer than',
        'school': 'more desirable than',
        'scissors': 'coated',
        'sky': 'reflects',
        'snake': 'charms',
        'sun': 'reflects',
        'sword': 'decorates',
        'tank': 'wired',
        'tornado': 'survives',
        'videogame': 'pricier than',
        'vulture': 'attracts',
        'wall': 'decorates',
        'whip': 'resists',
    },
    'poison': {
        'air': 'can be spread through',
        'airplane': 'endangers',
        'axe': 'on',
        'baby': 'kills',
        'bicycle': 'kills',
        'bird': 'kills',
        'blood': 'targets',
        'book': 'in',
        'brain': 'kills',
        'butter': 'in',
        'cage': 'faster than',
        'car': 'impairs use of',
        'castle': 'endangers',
        'cat': 'kills',
        'church': 'endangers',
        'cloud': 'in acid rain',
        'cockroach': 'kills',
        'community': 'endangers',
        'computer': 'short-circuits',
        'cross': 'brings red',
        'duck': 'kills',
        'film': 'inspires',
        'fish': 'kills',
        'grass': 'kills',
        'home': 'endangers',
        'king': 'kills',
        'man': 'kills',
        'money': 'costs',
        'monkey': 'kills',
        'moon': 'by the light of',
        'noise': 'makes no',
        'paper': 'soaks',
        'peace': 'ruins',
        'planet': 'endangers',
        'police': 'kills',
        'porcupine': 'kills',
        'prince': 'kills',
        'princess': 'kills',
        'queen': 'kills',
        'snake': 'kills',
        'spider': 'kills',
        'sponge': 'in',
        'toilet': 'on',
        'train': 'endangers',
        'tree': 'kills',
        'turnip': 'in',
        'vampire': 'knocks out',
        'vulture': 'kills',
        'wolf': 'kills',
        'woman': 'kills',
    },
    'police': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'disbelieves',
        'baby': 'saves',
        'beer': 'drinks',
        'bicycle': 'recovers',
        'bird': 'eats',
        'book': 'throws the',
        'bowl': 'eats from',
        'brain': 'has',
        'butter': 'eats',
        'car': 'impounds',
        'cat': 'saves',
        'church': 'patrols',
        'cloud': 'looks at',
        'cockroach': 'steps on',
        'community': 'protects',
        'cross': 'acts',
        'cup': 'drinks from',
        'diamond': 'recovers',
        'dragon': 'disbelieves in',
        'duck': 'eats',
        'film': 'inspires',
        'fish': 'eats',
        'grass': 'walks on',
        'guitar': 'recovers',
        'home': 'protects',
        'man': 'arrests',
        'money': 'recovers',
        'moon': 'looks at',
        'mountain': 'climbs',
        'noise': 'arrests makers of',
        'paper': 'files',
        'planet': 'lives on',
        'prayer': 'has a',
        'rain': 'works in',
        'rainbow': 'looks at',
        'satan': 'disbelieves in',
        'spider': 'steps on',
        'sponge': 'cleans with',
        'tv': 'on',
        'toilet': 'uses',
        'train': 'commandeers',
        'tree': 'climbs',
        'turnip': 'eats',
        'ufo': 'disbelieves',
        'vampire': 'could be',
        'water': 'drinks',
        'wolf': 'tranquilizes',
        'woman': 'arrests',
    },
    'porcupine': {
        'air': 'breathes',
        'airplane': 'terrorizes',
        'baby': 'pricks',
        'beer': 'spills',
        'bicycle': 'punctures tires of',
        'bird': 'pricks',
        'book': 'shreds',
        'bowl': 'tips over',
        'brain': 'has',
        'butter': 'licks',
        'car': 'punctures tires of',
        'cat': 'pricks',
        'church': 'scurries into',
        'cloud': 'makes fart',
        'cockroach': 'eats',
        'community': 'annoys',
        'cross': 'makes you',
        'cup': 'tips over',
        'duck': 'pricks',
        'film': 'tears',
        'fish': 'eats',
        'grass': 'eats',
        'guitar': 'sleeps in',
        'home': 'scurries into',
        'king': 'pricks',
        'man': 'pricks',
        'money': 'shreds',
        'monkey': 'pricks',
        'moon': 'hunts by',
        'noise': 'makes no',
        'paper': 'shreds',
        'planet': 'lives on',
        'police': 'pricks',
        'prince': 'pricks',
        'princess': 'pricks',
        'queen': 'pricks',
        'rain': 'hunts despite',
        'rainbow': 'looks at',
        'spider': 'eats',
        'sponge': 'catches',
        'tv': 'on',
        'toilet': 'scrubs',
        'train': 'creeps onto',
        'tree': 'lives in a',
        'turnip': 'eats',
        'vampire': 'pricks',
        'vulture': 'pricks',
        'water': 'drinks',
        'wolf': 'pricks',
        'woman': 'pricks',
    },
    'power': {
        'axe': 'gives you the',
        'baby': 'electrocutes',
        'bicycle': 'outperforms',
        'blood': 'sacrifices',
        'cage': 'imposes',
        'camera': 'charges',
        'car': 'plant in',
        'castle': 'seiges',
        'chain': 'struggle food',
        'chainsaw': 'clears with',
        'computer': 'crashes',
        'death': 'of life and',
        'duck': 'cooks',
        'dynamite': 'plants',
        'fire': 'to',
        'gun': 'play with',
        'helicopter': 'deploys',
        'home': 'lights',
        'king': 'overthrows',
        'laser': 'charges',
        'law': 'imposes',
        'man': 'corrupts',
        'monkey': 'fries',
        'noise': 'makes',
        'nuke': 'charges',
        'peace': 'breaks',
        'pit': 'lights',
        'poison': 'assissinates with',
        'police': 'governs',
        'porcupine': 'fries',
        'prince': 'supplants',
        'princess': 'supplants',
        'queen': 'overthrows',
        'quicksand': 'clears',
        'rock': 'moves',
        'school': 'superintends',
        'scissors': 'charges',
        'sky': 'lines clutter',
        'snake': 'hungry',
        'sun': 'of',
        'sword': 'weilds',
        'tank': 'engages',
        'tornado': 'plant survives',
        'train': 'runs',
        'tree': 'consumes',
        'turnip': 'cooks',
        'vulture': 'hungry',
        'wall': 'in',
        'whip': 'cracks',
        'woman': 'corrupts',
    },
    'prayer': {
        'axe': 'against',
        'blood': 'calms',
        'cage': 'in',
        'camera': 'not captured on',
        'castle': 'in',
        'chain': 'breaks',
        'chainsaw': 'against',
        'computer': 'salvages',
        'death': 'against',
        'devil': 'casts out',
        'diamond': 'for',
        'dragon': 'subdues',
        'dynamite': 'against',
        'electricity': 'for low',
        'fence': 'knows no',
        'fire': 'against',
        'gold': 'for',
        'gun': 'against',
        'heart': 'heals',
        'helicopter': 'against',
        'laser': 'more accurate than',
        'law': 'for fair',
        'lightning': 'faster than',
        'math': 'for',
        'medusa': 'dispels',
        'monkey': 'confuses',
        'mountain': 'atop',
        'nuke': 'against',
        'peace': 'brings',
        'pit': 'in',
        'platimum': 'for',
        'poison': 'heals',
        'porcupine': 'protects like',
        'power': 'is spiritual',
        'quicksand': 'solidifies',
        'robot': 'routine like',
        'rock': 'atop',
        'satan': 'casts out',
        'school': 'starts',
        'scissors': 'for sharp',
        'sky': 'to',
        'snake': 'rebukes',
        'sun': 'for',
        'sword': 'against',
        'tank': 'against',
        'tornado': 'against',
        'videogame': 'to win',
        'vulture': 'dispels',
        'wall': 'knows no',
        'whip': 'against',
    },
    'prince': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'disbelieves',
        'baby': 'sires',
        'beer': 'drinks',
        'bicycle': 'rides',
        'bird': 'eats',
        'book': 'inspires',
        'bowl': 'eats from',
        'brain': 'has',
        'butter': 'eats',
        'car': 'rides in',
        'cat': 'owns',
        'church': 'attends',
        'cloud': 'looks at',
        'cockroach': 'steps on',
        'community': 'rules',
        'cross': 'wears',
        'cup': 'drinks from',
        'duck': 'eats',
        'film': 'inspires',
        'fish': 'eats',
        'grass': 'walks on',
        'guitar': 'plays',
        'home': 'lives in',
        'man': 'rules',
        'money': 'has',
        'moon': 'looks at',
        'mountain': 'climbs',
        'noise': 'makes',
        'paper': 'writes',
        'planet': 'lives on',
        'police': 'governs',
        'prayer': 'in',
        'princess': 'rules over',
        'rain': 'walks in',
        'rainbow': 'looks at',
        'satan': 'of darkness is',
        'spider': 'steps on',
        'sponge': 'owns',
        'tv': 'on',
        'toilet': 'uses',
        'train': 'rides on',
        'tree': 'owns',
        'turnip': 'eats',
        'ufo': 'disbelieves',
        'vampire': 'could be',
        'water': 'drinks',
        'wolf': 'tames',
        'woman': 'rules',
    },
    'princess': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'disbelieves',
        'baby': 'has',
        'beer': 'drinks',
        'bicycle': 'rides',
        'bird': 'eats',
        'book': 'inspires',
        'bowl': 'eats from',
        'brain': 'has',
        'butter': 'eats',
        'car': 'rides in',
        'cat': 'owns',
        'church': 'attends',
        'cloud': 'looks at',
        'cockroach': 'steps on',
        'community': 'rules',
        'cross': 'acts',
        'cup': 'drinks from',
        'dragon': 'subdues',
        'duck': 'eats',
        'film': 'inspires',
        'fish': 'eats',
        'grass': 'walks on',
        'guitar': 'plays',
        'home': 'lives in',
        'man': 'rules',
        'money': 'has',
        'moon': 'looks at',
        'mountain': 'climbs',
        'noise': 'makes',
        'paper': 'writes',
        'planet': 'lives on',
        'police': 'governs',
        'prayer': 'in',
        'rain': 'walks in',
        'rainbow': 'looks at',
        'satan': 'enthralls',
        'spider': 'steps on',
        'sponge': 'owns',
        'tv': 'on',
        'toilet': 'uses',
        'train': 'rides on',
        'tree': 'owns',
        'turnip': 'eats',
        'ufo': 'disbelieves',
        'vampire': 'could be',
        'water': 'drinks',
        'wolf': 'tames',
        'woman': 'rules',
    },
    'queen': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'disbelieves',
        'baby': 'has',
        'beer': 'drinks',
        'bicycle': 'rides',
        'bird': 'eats',
        'book': 'inspires',
        'bowl': 'eats from',
        'brain': 'has',
        'butter': 'eats',
        'car': 'rides in',
        'cat': 'owns',
        'church': 'attends',
        'cloud': 'looks at',
        'cockroach': 'steps on',
        'community': 'rules',
        'cross': 'acts',
        'cup': 'drinks from',
        'dragon': 'subdues',
        'duck': 'eats',
        'film': 'inspires',
        'fish': 'eats',
        'grass': 'walks on',
        'guitar': 'plays',
        'home': 'lives in',
        'man': 'rules',
        'money': 'has',
        'moon': 'looks at',
        'mountain': 'climbs',
        'noise': 'makes',
        'paper': 'writes',
        'planet': 'lives on',
        'police': 'governs',
        'prayer': 'in',
        'rain': 'walks in',
        'rainbow': 'looks at',
        'satan': 'enthralls',
        'spider': 'steps on',
        'sponge': 'owns',
        'tv': 'on',
        'toilet': 'uses',
        'train': 'rides on',
        'tree': 'owns',
        'turnip': 'eats',
        'ufo': 'disbelieves',
        'vampire': 'could be',
        'water': 'drinks',
        'wolf': 'tames',
        'woman': 'rules',
    },
    'quicksand': {
        'axe': 'swallows',
        'baby': 'swallows',
        'bicycle': 'swallows',
        'bird': 'swallows',
        'blood': 'suffocates',
        'brain': 'swallows',
        'cage': 'surrounds',
        'camera': 'swallows',
        'car': 'swallows',
        'castle': 'protects',
        'cat': 'swallows',
        'chain': 'swallows',
        'chainsaw': 'swallows',
        'cockroach': 'swallows',
        'community': 'threatens',
        'computer': 'swallows',
        'death': 'causes',
        'duck': 'swallows',
        'fire': 'engulfs',
        'fish': 'swallows',
        'gun': 'swallows',
        'home': 'ruins',
        'king': 'swallows',
        'law': 'knows no',
        'man': 'swallows',
        'monkey': 'swallows',
        'noise': 'engulfs',
        'peace': 'disturbs',
        'pit': 'becomes',
        'poison': 'engulfs',
        'police': 'swallows',
        'porcupine': 'swallows',
        'prince': 'swallows',
        'princess': 'swallows',
        'queen': 'swallows',
        'rock': 'swallows',
        'school': 'closes',
        'scissors': 'swallows',
        'snake': 'swallows',
        'spider': 'swallows',
        'sun': 'removes',
        'sword': 'swallows',
        'train': 'ruins',
        'tree': 'topples',
        'turnip': 'swallows',
        'vulture': 'swallows',
        'wall': 'protects',
        'whip': 'too big for',
        'wolf': 'swallows',
        'woman': 'swallows',
    },
    'rain': {
        'alien': 'drowns',
        'axe': 'rusts',
        'cage': 'rusts',
        'camera': 'ruins',
        'chain': 'rusts',
        'chainsaw': 'thwarts use of',
        'computer': 'short-circuits',
        'death': 'makes lonely',
        'devil': 'drowns',
        'diamond': 'cleans',
        'dragon': 'drowns',
        'dynamite': 'soaks',
        'electricity': 'conducts',
        'fence': 'rusts',
        'fire': 'douses',
        'gold': 'cleans',
        'gun': 'rusts',
        'heart': 'saddens',
        'helicopter': 'diverts',
        'laser': 'diffracts',
        'law': 'soaks papers explaining',
        'lightning': 'brings',
        'math': 'measured with',
        'medusa': 'drowns',
        'mountain': 'on the',
        'nuke': 'diverts',
        'peace': 'disturbs',
        'pit': 'fills',
        'platimum': 'cleans',
        'poison': 'acidic',
        'power': 'blacks out',
        'prayer': 'answers',
        'quicksand': 'creates',
        'rainbow': 'creates',
        'robot': 'short-circuits',
        'rock': 'erodes',
        'satan': 'drowns',
        'school': 'closes',
        'scissors': 'rusts',
        'sky': 'darkens',
        'sun': 'blocks',
        'sword': 'rusts',
        'tv': 'inspires',
        'tank': 'falls on',
        'tornado': 'brings',
        'ufo': 'diverts',
        'videogame': 'inspires',
        'wall': 'leaks through',
        'water': 'made of',
        'whip': 'soaks',
    },
    'rainbow': {
        'alien': 'intrigues',
        'axe': 'resists',
        'blood': 'after',
        'cage': 'beyond',
        'camera': 'challenges',
        'castle': 'over',
        'chain': 'color',
        'chainsaw': 'over',
        'computer': 'colored',
        'death': 'despite',
        'devil': 'irritates',
        'diamond': 'indicates',
        'dragon': 'over',
        'dynamite': 'over',
        'electricity': 'wired',
        'fence': 'over',
        'fire': 'over',
        'gold': 'points to',
        'gun': 'resists',
        'heart': 'cheers',
        'helicopter': 'over',
        'laser': 'colored',
        'law': 'despite',
        'lightning': 'after',
        'math': 'optics use',
        'medusa': 'irritates',
        'mountain': 'over',
        'nuke': 'after',
        'peace': 'indicates',
        'pit': 'over',
        'platimum': 'points to',
        'poison': 'resists',
        'power': '-',
        'prayer': 'enhances',
        'quicksand': 'over',
        'robot': 'over',
        'rock': 'over',
        'satan': 'irritates',
        'school': 'over',
        'scissors': 'colored',
        'sky': 'decorates',
        'snake': 'colored',
        'sun': 'diffracts',
        'sword': 'over',
        'tank': 'over',
        'tornado': 'after',
        'ufo': 'attracts',
        'videogame': 'colored',
        'wall': 'hits',
        'whip': 'sharp as a',
    },
    'robot': {
        'axe': 'carries',
        'baby': 'carries off',
        'blood': 'has no',
        'cage': 'bends bars of',
        'camera': 'has',
        'car': 'builds',
        'castle': 'explores',
        'chain': 'breaks',
        'chainsaw': 'carries',
        'computer': 'uses',
        'death': 'knows no',
        'dynamite': 'throws',
        'electricity': 'uses',
        'fire': 'resists',
        'gun': 'fires',
        'heart': 'envies',
        'helicopter': 'pilots',
        'home': 'enhances',
        'king': 'frightens',
        'laser': 'shoots',
        'law': 'three',
        'lightning': 'shoots',
        'man': 'overthrows',
        'medusa': 'tramples',
        'monkey': 'scares',
        'nuke': 'launches',
        'peace': 'disturbs',
        'pit': 'climbs out of',
        'poison': 'resists',
        'police': 'tramples',
        'porcupine': 'steps on',
        'power': 'consumes',
        'prince': 'frightens',
        'princess': 'frightens',
        'queen': 'frightens',
        'quicksand': 'detects',
        'rock': 'hurls',
        'school': 'tramples',
        'scissors': 'carries',
        'sky': 'pollutes',
        'snake': 'steps on',
        'sun': 'reflects',
        'sword': 'carries',
        'tank': 'pilots',
        'tornado': 'chases',
        'train': 'builds',
        'vulture': 'resists',
        'wall': 'smashes through',
        'whip': 'resists',
        'woman': 'carries off',
    },
    'rock': {
        'axe': 'chips',
        'baby': 'crushes',
        'bicycle': 'crushes',
        'bird': 'hits',
        'blood': 'contains',
        'book': 'crushes',
        'brain': 'crushes',
        'butter': 'splatters',
        'cage': 'crushes the lock of',
        'camera': 'smashes',
        'car': 'smashes windows of',
        'castle': 'builds',
        'cat': 'crushes',
        'chainsaw': 'dulls',
        'church': 'smashes windows of',
        'cockroach': 'squishes',
        'community': 'solid',
        'computer': 'crushes',
        'cross': 'supports',
        'death': 'indicates',
        'duck': 'hits',
        'fire': 'pounds out',
        'fish': 'smooshes',
        'home': 'builds',
        'king': 'crushes',
        'man': 'crushes',
        'money': '(rare) costs',
        'monkey': 'crushes',
        'noise': 'grinds',
        'peace': 'marks eternal',
        'poison': 'smashes bottles of',
        'police': 'crushes',
        'porcupine': 'crushes',
        'prince': 'crushes',
        'princess': 'crushes',
        'queen': 'crushes',
        'school': 'smashes windows of',
        'scissors': 'smashes',
        'snake': 'crushes',
        'spider': 'squishes',
        'sponge': 'crushes',
        'sun': 'shades',
        'train': 'blocks',
        'tree': 'blocks the roots of',
        'turnip': 'blocks the roots of',
        'vampire': 'encases',
        'vulture': 'hits',
        'wall': 'builds',
        'wolf': 'crushes',
        'woman': 'crushes',
    },
    'satan': {
        'axe': 'laughs at',
        'blood': 'poisons',
        'cage': 'escapes',
        'camera': 'evades',
        'castle': 'has',
        'chain': 'breaks the',
        'chainsaw': 'evades',
        'computer': 'laughs at',
        'death': 'after',
        'devil': 'commands',
        'diamond': 'likes king',
        'dragon': 'commands',
        'dynamite': 'laughs at',
        'electricity': "doesn't need",
        'fence': 'knows no',
        'fire': 'commands',
        'gold': 'tempts with',
        'gun': 'laughs at',
        'heart': 'darkens',
        'helicopter': 'laughs at',
        'king': 'possesses',
        'laser': 'laughs at',
        'law': 'knows no',
        'lightning': 'brings',
        'math': 'good at',
        'medusa': 'commands',
        'monkey': 'owns',
        'nuke': 'laughs at',
        'peace': 'prevents',
        'pit': 'commands',
        'platimum': 'tempts with',
        'poison': 'laughs at',
        'porcupine': 'sharper than',
        'power': 'has',
        'queen': 'possesses',
        'quicksand': 'dispels',
        'robot': 'laughs at',
        'rock': 'hurls',
        'school': 'enthralls',
        'scissors': 'laughs at',
        'sky': 'darkens',
        'snake': 'is',
        'sun': 'curses',
        'sword': 'laughs at',
        'tank': 'laughs at',
        'tornado': 'commands',
        'videogame': 'inspires',
        'vulture': 'is soul',
        'wall': 'knows no',
        'whip': 'cracks',
    },
    'school': {
        'airplane': 'teaches about',
        'axe': 'makes you sharper',
        'baby': 'teaches',
        'bicycle': 'teaches',
        'bird': 'teaches about',
        'blood': 'teaches about',
        'book': 'has',
        'brain': 'nourishes',
        'butter': 'kitchen has',
        'cage': 'is a',
        'car': 'teaches how to use',
        'castle': 'teaches about',
        'cat': 'teaches about',
        'church': 'ignores',
        'cloud': 'teaches about',
        'cockroach': 'houses',
        'community': 'educates',
        'computer': 'uses',
        'cross': 'bans',
        'duck': 'teaches about',
        'film': 'shows',
        'fish': 'teaches about',
        'grass': 'yard has',
        'home': 'away from',
        'king': 'teaches about',
        'man': 'teaches',
        'money': 'lunch',
        'monkey': 'teaches about',
        'moon': 'teaches about',
        'noise': 'bell makes',
        'paper': 'makes you write',
        'peace': 'requires',
        'poison': 'teaches about',
        'police': 'trains',
        'porcupine': 'teaches about',
        'prince': 'teaches about',
        'princess': 'teaches about',
        'queen': 'teaches about',
        'scissors': 'children use',
        'snake': 'teaches about',
        'spider': 'houses',
        'sponge': 'kitchen has',
        'toilet': 'has',
        'train': 'makes your brain',
        'tree': 'yard has',
        'turnip': 'teaches about',
        'vampire': 'play about',
        'vulture': 'teaches about',
        'wolf': 'teaches about',
        'woman': 'teaches',
    },
    'scissors': {
        'air': 'swish through',
        'airplane': 'alert security team of',
        'axe': 'sharper than',
        'baby': 'cut the hair of',
        'bicycle': 'stab tyres of',
        'bird': 'stab',
        'blood': 'spurt',
        'book': 'cut up',
        'brain': 'stab',
        'butter': 'spread',
        'cage': 'pick lock of',
        'car': 'stab tyres of',
        'castle': 'carve into',
        'cat': 'cut hair of',
        'church': 'carve into',
        'cloud': 'swish through',
        'cockroach': 'stab',
        'community': 'cut hair of',
        'computer': 'stab',
        'cross': 'carve into',
        'duck': 'stab',
        'film': 'cut',
        'fish': 'gut',
        'grass': 'cut',
        'home': 'carve into',
        'king': 'cut the hair of',
        'man': 'cut the hair of',
        'money': 'cut up',
        'monkey': 'cut',
        'moon': 'reflect',
        'noise': 'make snipping',
        'paper': 'cut',
        'peace': 'used as a weapon, ends the',
        'poison': 'more direct than',
        'police': 'cut the hair of',
        'porcupine': 'stab',
        'prince': 'cut the hair of',
        'princess': 'cut the hair of',
        'queen': 'cut the hair of',
        'snake': 'stab the keys of',
        'spider': 'stab',
        'sponge': 'cut up',
        'toilet': 'clog',
        'train': 'trim dress',
        'tree': 'carve into',
        'turnip': 'cut',
        'vampire': 'impale',
        'vulture': 'stab',
        'wolf': 'cut hair of',
        'woman': 'cut the hair of',
    },
    'sky': {
        'axe': 'above',
        'baby': 'above',
        'bicycle': 'above',
        'bird': 'above',
        'blood': 'above',
        'cage': 'evades',
        'camera': 'challenges',
        'car': 'above',
        'castle': 'above',
        'cat': 'above',
        'chain': 'above',
        'chainsaw': 'above',
        'computer': 'above',
        'death': 'transcends',
        'duck': 'above',
        'dynamite': 'above',
        'fire': 'above',
        'gun': 'above',
        'helicopter': 'above',
        'home': 'above',
        'king': 'above',
        'law': 'is limit of',
        'man': 'above',
        'monkey': 'above',
        'noise': 'makes no',
        'peace': 'at',
        'pit': 'evades',
        'poison': 'above',
        'police': 'above',
        'porcupine': 'above',
        'prince': 'above',
        'princess': 'above',
        'queen': 'above',
        'quicksand': 'above',
        'rock': 'above',
        'school': 'above',
        'scissors': 'above',
        'snake': 'above',
        'sun': 'surrounds',
        'sword': 'above',
        'tank': 'above',
        'tornado': 'houses',
        'train': 'above',
        'tree': 'above',
        'turnip': 'above',
        'vulture': 'above',
        'wall': 'above',
        'whip': 'above',
        'wolf': 'above',
        'woman': 'above',
    },
    'snake': {
        'air': 'breathes',
        'airplane': 'on a',
        'baby': 'scares',
        'beer': 'spills',
        'bicycle': 'entangles',
        'bird': 'eats eggs of',
        'blood': 'poisons',
        'book': 'swallows',
        'bowl': 'sleeps in',
        'brain': 'intimidates',
        'butter': 'eats',
        'car': 'creeps into',
        'cat': 'bites',
        'church': 'creeps into',
        'cloud': 'not affected by',
        'cockroach': 'eats',
        'community': 'terrorizes',
        'cross': 'climbs',
        'cup': 'tips over',
        'duck': 'eats eggs of',
        'film': 'inspires',
        'fish': 'eats',
        'grass': 'in the',
        'guitar': 'hides in',
        'home': 'creeps into',
        'king': 'bites',
        'man': 'bites',
        'money': 'swallows',
        'monkey': 'bites',
        'moon': 'nocturnal with',
        'noise': 'rattles',
        'paper': 'nests in',
        'planet': 'lives on',
        'police': 'bites',
        'porcupine': 'scares',
        'prince': 'bites',
        'princess': 'bites',
        'queen': 'bites',
        'rain': 'hunts despite',
        'spider': 'eats',
        'sponge': 'swallows',
        'toilet': 'hides in',
        'train': 'terrorizes',
        'tree': 'climbs',
        'turnip': 'swallows',
        'vampire': 'charms',
        'vulture': 'hides from',
        'water': 'drinks',
        'wolf': 'bites',
        'woman': 'bites',
    },
    'spider': {
        'air': 'breathes',
        'airplane': 'creeps into',
        'alien': 'intrigues',
        'beer': 'in your',
        'book': 'behind',
        'bowl': 'hides under',
        'brain': 'has',
        'butter': 'crawls across',
        'church': 'creeps into',
        'cloud': 'web like',
        'cockroach': 'bigger than',
        'community': 'frightens',
        'cross': 'crawls up',
        'cup': 'crawls into',
        'devil': 'amuses',
        'diamond': 'eyes like',
        'dragon': 'amuses',
        'electricity': 'hides from',
        'fence': 'crawls over',
        'film': 'on',
        'gold': 'colored',
        'grass': 'in',
        'guitar': 'hides in',
        'heart': 'has',
        'laser': 'dodges',
        'lightning': 'hides from',
        'math': "doesn't need",
        'medusa': 'amuses',
        'money': 'costs',
        'moon': 'lives by',
        'mountain': 'lives on',
        'nuke': 'survives',
        'paper': 'crawls across',
        'planet': 'lives on',
        'platimum': 'web like',
        'power': 'cause fear, so has',
        'prayer': 'despite',
        'rain': "doesn't mind",
        'rainbow': 'unaware of',
        'robot': 'crawls over',
        'satan': 'amuses',
        'sky': 'unaware of',
        'sponge': 'nests in',
        'tv': 'crawls across',
        'tank': 'creeps into',
        'toilet': 'hides in',
        'ufo': 'undetected by',
        'vampire': 'entertains',
        'videogame': 'in',
        'water': 'drinks',
    },
    'sponge': {
        'air': 'uses pockets of',
        'airplane': 'cleans',
        'alien': 'intrigues',
        'beer': 'absorbs',
        'book': 'soaks',
        'bowl': 'cleans',
        'butter': 'sops up',
        'chain': 'cleans',
        'church': 'cleans',
        'cloud': 'denser than',
        'cup': 'cleans',
        'devil': 'cleanses',
        'diamond': 'cleans',
        'dragon': 'cleanses',
        'dynamite': 'soaks',
        'electricity': 'conducts',
        'fence': 'cleans',
        'film': 'cleans',
        'gold': 'cleans',
        'grass': 'sits on',
        'guitar': 'cleans',
        'gun': 'cleans',
        'heart': 'has no',
        'helicopter': 'cleans',
        'laser': 'cleans',
        'lightning': 'conducts',
        'math': "doesn't use",
        'medusa': 'cleanses',
        'moon': 'looks like',
        'mountain': 'pile',
        'nuke': 'cleans',
        'paper': 'soaks',
        'pit': 'cleans',
        'planet': 'lives on',
        'platimum': 'cleans',
        'power': 'has cleaning',
        'prayer': 'answers',
        'quicksand': 'floats on',
        'rain': 'absorbs',
        'rainbow': 'creates',
        'robot': 'cleans',
        'satan': 'cleanses',
        'sky': 'cleans',
        'tv': 'bob on',
        'tank': 'cleans',
        'toilet': 'cleans',
        'tornado': 'cleans after',
        'ufo': 'cleans',
        'videogame': 'cleans',
        'water': 'absorbs',
    },
    'sun': {
        'airplane': 'above',
        'axe': 'melts',
        'baby': 'warms',
        'bicycle': 'shines on',
        'bird': 'warms',
        'blood': 'warms',
        'book': 'shines in',
        'brain': 'warms',
        'butter': 'melts',
        'cage': 'heats',
        'camera': 'ruins',
        'car': 'shines on',
        'castle': 'shines on',
        'cat': 'warms',
        'chainsaw': 'warms the person holding',
        'church': 'shines on',
        'cloud': 'burns off',
        'cockroach': 'warms',
        'community': 'warms',
        'computer': 'cooks',
        'cross': 'shines on',
        'duck': 'warms',
        'fire': 'made of',
        'fish': 'warms',
        'home': 'warms',
        'king': 'warms',
        'man': 'warms',
        'money': 'saves',
        'monkey': 'warms',
        'noise': 'makes no',
        'paper': 'shines through',
        'peace': 'embodies',
        'poison': 'not affected by',
        'police': 'warms',
        'porcupine': 'warms',
        'prince': 'warms',
        'princess': 'warms',
        'queen': 'warms',
        'school': 'shines on',
        'scissors': 'melts',
        'snake': 'warms',
        'spider': 'warms',
        'sponge': 'dries up',
        'train': 'shines on',
        'tree': 'feeds',
        'turnip': 'feeds',
        'vampire': 'kills',
        'vulture': 'warms',
        'wolf': 'warms',
        'woman': 'warms',
    },
    'sword': {
        'axe': 'outclasses',
        'baby': 'stabs',
        'bicycle': 'punctures tyres of',
        'bird': 'stabs',
        'blood': 'spills',
        'brain': 'chops up',
        'butter': 'spreads',
        'cage': 'picks',
        'camera': 'chops',
        'car': 'punctures tyres of',
        'castle': 'protects',
        'cat': 'dices',
        'chainsaw': 'faster than',
        'church': 'defends',
        'cockroach': 'juliennes',
        'community': 'protects',
        'computer': 'smites',
        'cross': 'serves',
        'death': 'causes',
        'duck': 'stabs',
        'fire': '(flaming) has',
        'fish': 'guts',
        'home': 'protects',
        'king': 'slays',
        'man': 'stabs',
        'money': 'costs',
        'monkey': 'stabs',
        'noise': 'makes',
        'peace': 'breaks',
        'poison': 'faster than',
        'police': 'stabs',
        'porcupine': 'stabs',
        'prince': 'slays',
        'princess': 'slays',
        'queen': 'slays',
        'rock': 'in the stone, nevermind a',
        'school': 'terrorizes',
        'scissors': 'outclasses',
        'snake': 'chops up',
        'spider': 'minces',
        'sponge': 'chops',
        'sun': 'reflects',
        'train': 'unhooks cars from',
        'tree': 'carves',
        'turnip': 'cuts up',
        'vampire': 'impales',
        'vulture': 'stabs',
        'wall': 'scars',
        'wolf': 'slices',
        'woman': 'stabs',
    },
    'tv': {
        'alien': 'debunks',
        'axe': 'show',
        'cage': 'turns room into',
        'camera': '-',
        'castle': 'about',
        'chain': 'stolen despite',
        'chainsaw': 'airs',
        'computer': 'before',
        'death': 'glorifies',
        'devil': 'inspires',
        'diamond': 'sharp as',
        'dragon': 'about',
        'dynamite': 'character says',
        'electricity': 'uses',
        'fence': 'broadcast over',
        'fire': 'reports',
        'gold': 'wires are',
        'gun': 'glorifies',
        'heart': 'bad for',
        'helicopter': 'news',
        'laser': 'media uses',
        'law': 'regulators make',
        'lightning': 'attracts',
        'math': 'tech uses',
        'medusa': 'about',
        'mountain': 'broadcast over',
        'nuke': 'about',
        'peace': 'disturbs',
        'pit': 'is the',
        'platimum': 'wires are',
        'poison': 'is',
        'power': 'consumes',
        'prayer': 'delivers',
        'quicksand': 'time',
        'rainbow': 'color',
        'robot': 'before',
        'rock': 'airs',
        'satan': 'about',
        'school': 'teaches',
        'scissors': 'resists',
        'sky': 'replaces',
        'snake': 'run by',
        'sun': 'about',
        'sword': 'about',
        'tank': 'guides',
        'tornado': 'predicts',
        'ufo': 'debunks',
        'videogame': 'before',
        'wall': 'hangs on',
        'whip': 'sharp as a',
    },
    'tank': {
        'axe': 'outclasses',
        'baby': 'squashes',
        'bicycle': 'flattens',
        'bird': 'squashes',
        'blood': 'spills',
        'cage': 'smashes through',
        'camera': 'crushes',
        'car': 'flattens',
        'castle': 'seiges',
        'cat': 'squashes',
        'chain': 'breaks',
        'chainsaw': 'outclasses',
        'computer': 'flattens',
        'death': 'brings',
        'duck': 'squashes',
        'dynamite': 'resists',
        'fire': 'resists',
        'fish': 'squooshes',
        'gun': 'has',
        'helicopter': 'outclasses',
        'home': 'flattens',
        'king': 'squashes',
        'law': 'imposes',
        'man': 'squashes',
        'monkey': 'squishes',
        'noise': 'makes',
        'peace': 'breaks',
        'pit': 'creates',
        'poison': 'more direct than',
        'police': 'outclasses',
        'porcupine': 'squashes',
        'prince': 'squashes',
        'princess': 'squashes',
        'queen': 'squashes',
        'quicksand': 'plows over',
        'rock': 'crumbles',
        'school': 'crumbles',
        'scissors': 'crushes',
        'snake': 'flattens',
        'sun': 'cloud blocks',
        'sword': 'outclasses',
        'tornado': 'survives',
        'train': 'barrels though',
        'tree': 'knocks down',
        'turnip': 'pulverizes',
        'vulture': 'attracts',
        'wall': 'crumbles',
        'whip': 'outclasses',
        'wolf': 'squashes',
        'woman': 'squashes',
    },
    'toilet': {
        'air': 'spoils',
        'alien': 'confuses',
        'beer': 'soon contains',
        'bowl': '-',
        'camera': 'flushes',
        'chain': 'uses',
        'chainsaw': 'resists',
        'cup': 'holds more than',
        'death': 'smells of',
        'devil': 'smells like',
        'diamond': 'hides',
        'dragon': 'confuses',
        'dynamite': 'stinkier than',
        'electricity': 'conducts',
        'fence': 'can be',
        'fire': 'douses',
        'gold': 'contains',
        'guitar': '-mouthed',
        'gun': 'resists',
        'heart': 'good for',
        'helicopter': 'need diverts',
        'laser': 'reflects',
        'law': 'flushes',
        'lightning': 'attracts',
        'math': 'easier than',
        'medusa': 'less stinky than',
        'mountain': 'holds',
        'nuke': 'smells like',
        'pit': 'is the',
        'planet': 'pollutes',
        'platimum': 'colored',
        'power': 'has stink',
        'prayer': 'answers',
        'quicksand': 'contains',
        'rain': 'catches',
        'rainbow': 'reflects',
        'robot': 'confuses',
        'rock': 'hard as',
        'satan': 'smells of',
        'sky': 'stinks',
        'sun': 'better without',
        'sword': 'resists',
        'tv': 'less offensive than',
        'tank': '-',
        'tornado': 'survives',
        'ufo': 'holds',
        'videogame': 'disrupts',
        'wall': 'more legal than',
        'water': 'uses',
        'whip': 'resists',
    },
    'tornado': {
        'axe': 'sweeps away',
        'baby': 'sweeps away',
        'bicycle': 'sweeps away',
        'bird': 'sweeps away',
        'blood': 'spills',
        'brain': 'confounds',
        'cage': 'sweeps away',
        'camera': 'challenges',
        'car': 'sweeps away',
        'castle': 'destroys',
        'cat': 'sweeps away',
        'chain': 'breaks',
        'chainsaw': 'sweeps away',
        'cockroach': 'wrecks home of',
        'computer': 'destroys',
        'death': 'causes',
        'duck': 'sweeps away',
        'fire': 'starts',
        'fish': 'sweeps away',
        'gun': 'sweeps away',
        'home': 'destroys',
        'king': 'sweeps away',
        'law': 'knows no',
        'man': 'sweeps away',
        'monkey': 'sweeps away',
        'noise': 'makes',
        'peace': 'disturbs',
        'pit': 'is air',
        'poison': 'sweeps away',
        'police': 'sweeps away',
        'porcupine': 'sweeps away',
        'prince': 'sweeps away',
        'princess': 'sweeps away',
        'queen': 'sweeps away',
        'quicksand': 'outclasses',
        'rock': 'sweeps away',
        'school': 'destroys',
        'scissors': 'sweeps away',
        'snake': 'sweeps away',
        'spider': 'sweeps away',
        'sun': 'blocks',
        'sword': 'sweeps away',
        'train': 'derails',
        'tree': 'sweeps away',
        'turnip': 'sweeps away',
        'vulture': 'sweeps away',
        'wall': 'destroys',
        'whip': 'sweeps away',
        'wolf': 'sweeps away',
        'woman': 'sweeps away',
    },
    'train': {
        'air': 'pollutes',
        'airplane': 'safer than',
        'alien': 'intrigues',
        'beer': 'sells',
        'bicycle': 'faster than',
        'bird': 'scares',
        'book': 'contains',
        'bowl': 'carries',
        'brain': 'requires',
        'butter': 'contains',
        'car': 'faster than',
        'cat': 'scares',
        'church': 'cozier than',
        'cloud': 'creates',
        'cockroach': 'houses',
        'community': 'serves',
        'cross': 'travels a-',
        'cup': 'carries',
        'devil': 'amuses',
        'diamond': 'pricier than',
        'dragon': 'outruns',
        'duck': 'scares',
        'fence': 'crashes through',
        'film': 'in',
        'fish': 'contains',
        'gold': 'pricier than',
        'grass': 'whizzes through',
        'guitar': 'carries',
        'money': 'costs',
        'moon': 'reflects',
        'mountain': 'climbs',
        'noise': 'makes',
        'paper': 'contains',
        'planet': 'travels',
        'platimum': 'pricier than',
        'prayer': 'answers',
        'rain': 'blocks',
        'rainbow': 'reflects',
        'satan': 'amuses',
        'spider': 'houses',
        'sponge': 'carries',
        'tv': 'has',
        'toilet': 'has',
        'tree': 'around',
        'turnip': 'contains',
        'ufo': 'attracts',
        'vampire': 'outruns',
        'videogame': 'in',
        'water': 'plumbs',
        'wolf': 'scares',
    },
    'tree': {
        'air': 'produces',
        'airplane': 'diverts',
        'alien': 'ensnares the ship of',
        'beer': 'inspires',
        'bird': 'houses',
        'book': 'creates',
        'bowl': 'wood creates',
        'brain': 'has no',
        'butter': 'outlasts',
        'cat': 'traps',
        'church': 'shades',
        'cloud': 'blocks',
        'cockroach': 'shelters',
        'community': 'beautifies',
        'cross': 'builds',
        'cup': 'wood creates',
        'devil': 'imprisons',
        'diamond': 'roots hide',
        'dragon': 'shelters',
        'duck': 'shelters',
        'electricity': 'conducts',
        'fence': 'taller than',
        'film': 'in',
        'fish': 'shelters',
        'gold': 'roots hide',
        'grass': 'grows in',
        'guitar': 'wood creates',
        'heart': 'has no',
        'math': "doesn't need",
        'money': "doesn't grow",
        'moon': 'blocks',
        'mountain': 'grows on',
        'paper': 'creates',
        'planet': 'grows on',
        'platimum': 'roots hide',
        'prayer': 'shelters',
        'rain': 'loves',
        'rainbow': 'blocks',
        'robot': 'taller than',
        'satan': 'imprisons',
        'spider': 'houses',
        'sponge': 'outlives',
        'tv': 'on',
        'toilet': 'becomes',
        'turnip': 'taller than',
        'ufo': 'ensnares',
        'vampire': 'hides',
        'videogame': 'wiser than',
        'water': 'drinks',
        'wolf': 'shelters',
    },
    'turnip': {
        'air': 'odorizes',
        'airplane': 'in the meal on',
        'alien': 'disgusts',
        'beer': 'falls in',
        'bird': 'thrown at',
        'book': 'recipe',
        'bowl': 'stains',
        'brain': 'has no',
        'butter': 'in',
        'cat': 'thrown at',
        'church': 'thrown at',
        'cloud': 'gas',
        'cockroach': 'squashes',
        'community': 'feeds',
        'cross': 'roots form',
        'cup': 'stains',
        'devil': 'disgusts',
        'diamond': 'roots hide',
        'dragon': 'thrown at',
        'duck': 'thrown at',
        'electricity': 'conducts',
        'fence': 'grows along',
        'film': 'stains',
        'fish': 'simpler than',
        'gold': 'roots hide',
        'grass': 'grows in',
        'guitar': 'thrown at',
        'heart': 'good for',
        'lightning': 'hides from',
        'math': "doesn't need",
        'money': 'costs',
        'moon': 'grows despite',
        'mountain': 'grows on',
        'paper': 'stains',
        'planet': 'grows on',
        'platimum': 'roots hide',
        'prayer': 'answers',
        'rain': 'loves',
        'rainbow': 'flavor',
        'robot': 'thrown at',
        'satan': 'disgusts',
        'spider': 'squashes',
        'sponge': 'tastier than',
        'tv': 'thrown at',
        'toilet': 'ends up in',
        'ufo': 'thrown at',
        'vampire': 'thrown at',
        'videogame': 'healthier than',
        'water': 'drinks',
        'wolf': 'thrown at',
    },
    'ufo': {
        'alien': 'carries',
        'axe': 'resists',
        'blood': 'collects',
        'cage': 'evades',
        'camera': 'evades',
        'castle': 'flies over',
        'chain': 'vaporizes',
        'chainsaw': 'resists',
        'computer': 'uses',
        'death': 'causes',
        'devil': 'unaware of',
        'diamond': 'uses',
        'dragon': 'spies on',
        'dynamite': 'resists',
        'electricity': 'uses',
        'fence': 'flies over',
        'fire': 'starts',
        'gold': 'made of',
        'gun': 'resists',
        'heart': 'abducts',
        'helicopter': 'evades',
        'laser': 'shoots',
        'law': 'breaks physical',
        'lightning': 'shoots',
        'math': 'uses advanced',
        'medusa': 'outclasses',
        'mountain': 'flies over',
        'nuke': 'steals',
        'peace': 'disturbs',
        'pit': 'flies over',
        'platimum': 'made of',
        'poison': 'resists',
        'porcupine': 'vaporizes',
        'power': 'uses advanced',
        'prayer': 'despite',
        'quicksand': 'flies over',
        'robot': 'commands',
        'rock': 'vaporizes',
        'satan': 'unaware of',
        'school': 'flies over',
        'scissors': 'resists',
        'sky': 'flies across',
        'snake': 'abducts',
        'sun': 'flies to',
        'sword': 'resists',
        'tank': 'flies over',
        'tornado': 'flies over',
        'videogame': 'in',
        'wall': 'flies over',
        'whip': 'resists',
    },
    'vampire': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'before',
        'beer': 'seduces with',
        'book': 'in',
        'bowl': 'discards',
        'butter': 'discards',
        'chain': 'escapes',
        'church': 'angers',
        'cloud': 'prefers',
        'cup': 'discards',
        'devil': 'defines',
        'diamond': 'seduces with',
        'dragon': 'outlives',
        'dynamite': 'survives',
        'electricity': 'conducts',
        'fence': 'flies over',
        'film': 'in',
        'gold': 'owns',
        'grass': 'walks on',
        'guitar': 'plays',
        'heart': 'has immortal',
        'helicopter': 'flies',
        'laser': 'survives',
        'lightning': 'resists',
        'math': 'teaches',
        'medusa': 'outlives',
        'moon': 'lives by',
        'mountain': 'flies over',
        'nuke': 'survives',
        'paper': 'writes on',
        'pit': 'lives in',
        'planet': 'legendary across',
        'platimum': 'owns',
        'power': 'has great',
        'prayer': 'laughs at',
        'quicksand': 'flies over',
        'rain': 'stalks in',
        'rainbow': 'never sees',
        'robot': 'before',
        'satan': 'defines',
        'sky': 'flies in',
        'sponge': 'discards',
        'tv': 'on',
        'tank': 'survives',
        'toilet': 'uses',
        'tornado': 'flies in',
        'ufo': 'before',
        'videogame': 'in',
        'water': 'discards',
    },
    'videogame': {
        'axe': 'has',
        'baby': 'confuses',
        'blood': 'glorifies',
        'cage': 'mental',
        'camera': 'has many angles from',
        'castle': 'before',
        'chain': 'has',
        'chainsaw': 'has',
        'computer': 'on',
        'death': 'restarts after',
        'dynamite': 'has',
        'electricity': 'uses',
        'fire': 'catches',
        'gun': 'uses',
        'heart': 'affects',
        'helicopter': 'has',
        'home': 'clutters',
        'king': 'has',
        'laser': 'has',
        'law': 'breaks fcc',
        'lightning': 'attracts',
        'man': 'entertains',
        'math': 'code uses',
        'medusa': 'confuses',
        'monkey': 'stars',
        'nuke': 'has',
        'peace': 'disturbs',
        'pit': 'mental',
        'poison': 'mental',
        'police': 'distracts',
        'porcupine': 'resists',
        'power': 'consumes',
        'prince': 'has',
        'princess': 'has',
        'queen': 'has',
        'quicksand': 'mental',
        'robot': 'turns you into',
        'rock': 'soundtrack is',
        'school': 'after',
        'scissors': 'more fun than',
        'sky': 'simulates',
        'snake': 'cables',
        'sun': 'replaces',
        'sword': 'has',
        'tank': 'has',
        'tornado': 'graphics',
        'vulture': 'sold by',
        'wall': 'simulates',
        'whip': 'has',
        'woman': 'entertains',
    },
    'vulture': {
        'air': 'breathes',
        'airplane': 'flies like',
        'baby': 'eats',
        'beer': 'spills',
        'bicycle': 'flies over',
        'bird': 'is large',
        'book': 'tears up',
        'bowl': 'tips over',
        'brain': 'has',
        'butter': 'eats',
        'car': 'flies over',
        'cat': 'eats',
        'church': 'flies over',
        'cloud': 'flies above a',
        'cockroach': 'eats',
        'community': 'annoys',
        'cross': 'perches on',
        'cup': 'tips over',
        'duck': 'larger than',
        'film': 'shreds',
        'fish': 'eats',
        'grass': 'lands in',
        'guitar': 'scratches',
        'home': 'flies over',
        'king': 'eats',
        'man': 'eats',
        'money': 'carries off',
        'monkey': 'eats',
        'moon': 'hunts by',
        'noise': 'makes no',
        'paper': 'tears up',
        'planet': 'lives on',
        'police': 'eats',
        'prince': 'eats',
        'princess': 'eats',
        'queen': 'eats',
        'rain': 'hunts despite',
        'rainbow': 'looks at',
        'spider': 'eats',
        'sponge': 'carries off',
        'tv': 'on',
        'toilet': "doesn't need",
        'train': 'flies over',
        'tree': 'flies over',
        'turnip': 'flies over',
        'ufo': 'spots',
        'vampire': 'delivers to',
        'water': 'drinks',
        'wolf': 'eats',
        'woman': 'eats',
    },
    'wall': {
        'axe': 'resists',
        'baby': 'blocks',
        'bicycle': 'blocks',
        'bird': 'blocks',
        'blood': 'shelf holds',
        'book': 'shelf holds',
        'brain': 'challenges',
        'butter': 'shelf holds',
        'cage': 'creates',
        'camera': 'blocks',
        'car': 'blocks',
        'castle': 'supports',
        'cat': 'blocks',
        'chainsaw': 'too thick for',
        'church': 'supports',
        'cloud': 'outlasts',
        'cockroach': 'houses',
        'community': 'surrounds',
        'computer': '(firewall) protects',
        'cross': 'supports',
        'duck': 'blocks',
        'fire': 'blocks',
        'fish': 'blocks',
        'home': 'supports',
        'king': 'blocks',
        'man': 'blocks',
        'money': 'costs',
        'monkey': 'blocks',
        'noise': 'blocks',
        'paper': 'shelf holds',
        'peace': 'prevents',
        'poison': 'not affected by',
        'police': 'blocks',
        'porcupine': 'blocks',
        'prince': 'blocks',
        'princess': 'blocks',
        'queen': 'blocks',
        'school': 'supports',
        'scissors': 'shelf holds',
        'snake': 'blocks',
        'spider': 'houses',
        'sponge': 'too big for',
        'sun': 'shades',
        'train': 'blocks',
        'tree': 'blocks roots of',
        'turnip': 'blocks roots of',
        'vampire': 'blocks',
        'vulture': 'blocks',
        'wolf': 'blocks',
        'woman': 'blocks',
    },
    'water': {
        'alien': 'toxic to',
        'axe': 'rusts',
        'cage': 'rusts',
        'camera': 'ruins',
        'castle': 'floods',
        'chain': 'rusts',
        'chainsaw': 'floods',
        'computer': 'short-circuits',
        'death': 'causes',
        'devil': 'drowns',
        'diamond': 'cleans',
        'dragon': 'drowns',
        'dynamite': 'soaks',
        'electricity': 'conducts',
        'fence': 'rises over',
        'fire': 'douses',
        'gold': 'cleans',
        'gun': 'rusts',
        'heart': 'strengthens',
        'helicopter': 'short-circuits',
        'laser': 'diffracts',
        'law': 'has',
        'lightning': 'attracts',
        'math': 'measured with',
        'medusa': 'drowns',
        'mountain': 'rains on',
        'nuke': 'short-circuits',
        'peace': 'inspires',
        'pit': 'fills',
        'platimum': 'cleans',
        'poison': 'dilutes',
        'power': 'creates hydro',
        'prayer': 'answers',
        'quicksand': 'floats on',
        'rainbow': 'creates',
        'robot': 'short-circuits',
        'rock': 'erodes',
        'satan': 'drowns',
        'school': 'leak closes',
        'scissors': 'rusts',
        'sky': 'reflects',
        'sun': 'reflects',
        'sword': 'rusts',
        'tv': 'damages',
        'tank': 'short-circuits',
        'tornado': 'spout',
        'ufo': 'diverts',
        'videogame': 'damages',
        'wall': 'cleans',
        'whip': 'soaks',
    },
    'whip': {
        'axe': 'snags',
        'baby': 'scares',
        'bicycle': 'snags',
        'bird': 'kills',
        'blood': 'spills',
        'brain': 'intimidates',
        'cage': 'opens',
        'camera': 'shatters',
        'car': 'smashes',
        'castle': 'breaks into',
        'cat': 'scares',
        'chainsaw': 'snags',
        'church': 'frightens',
        'cockroach': 'splatters',
        'community': 'threatens',
        'computer': 'smashes',
        'cross': 'forces you onto',
        'death': 'causes',
        'duck': 'kills',
        'fire': 'burns like',
        'fish': 'kills',
        'home': 'breaks into',
        'king': 'tortures',
        'man': 'tortures',
        'money': 'robs',
        'monkey': 'cracks',
        'noise': 'restricts',
        'peace': 'disturbs',
        'poison': 'shatters bottles of',
        'police': 'thwarts',
        'porcupine': 'scares',
        'prince': 'tortures',
        'princess': 'tortures',
        'queen': 'tortures',
        'rock': 'shatters',
        'school': 'terrorizes',
        'scissors': 'snags',
        'snake': 'stronger than',
        'spider': 'splatters',
        'sponge': 'rips',
        'sun': 'burns like',
        'sword': 'snags',
        'train': 'holds up',
        'tree': 'around',
        'turnip': 'splatters',
        'vampire': 'thwarts',
        'vulture': 'scares',
        'wall': 'marks up',
        'wolf': 'drives',
        'woman': 'tortures',
    },
    'wolf': {
        'air': 'breathes',
        'airplane': 'howls at',
        'alien': 'chases',
        'beer': 'drinks',
        'bird': 'chases',
        'book': 'rips up',
        'bowl': 'drinks from',
        'brain': 'has',
        'butter': 'eats',
        'cat': 'chases',
        'church': 'disrupts',
        'cloud': 'creates dust',
        'cockroach': 'eats',
        'community': 'frightens',
        'cross': 'acts',
        'cup': 'knocks over',
        'devil': 'bites',
        'diamond': 'swallows',
        'dragon': 'outruns',
        'electricity': 'outruns',
        'fence': 'hops',
        'film': 'on',
        'fish': 'eats',
        'gold': 'swallows',
        'grass': 'in',
        'guitar': 'bites',
        'heart': 'has',
        'lightning': 'outruns',
        'math': "doesn't need",
        'medusa': 'outruns',
        'money': 'steals',
        'moon': 'howls at',
        'mountain': 'lives on',
        'paper': 'rips up',
        'planet': 'lives on',
        'platimum': 'swallows',
        'power': 'has',
        'prayer': 'causes',
        'rain': 'loves',
        'rainbow': 'howls at',
        'robot': 'outruns',
        'satan': 'bites',
        'spider': 'eats',
        'sponge': 'rips up',
        'tv': 'on',
        'toilet': "doesn't use",
        'ufo': 'hides from',
        'vampire': 'amuses',
        'videogame': 'ravages',
        'water': 'drinks',
    },
    'woman': {
        'air': 'breathes',
        'airplane': 'flies on',
        'alien': 'disproves',
        'baby': 'has',
        'beer': 'drinks',
        'bicycle': 'rides',
        'bird': 'owns',
        'book': 'reads',
        'bowl': 'eats from',
        'brain': 'has',
        'butter': 'eats',
        'car': 'drives',
        'cat': 'owns',
        'church': 'attends',
        'cloud': 'looks at',
        'cockroach': 'steps on',
        'community': 'lives in',
        'cross': 'acts',
        'cup': 'drinks from',
        'diamond': 'wears',
        'dragon': 'tempts',
        'duck': 'eats',
        'film': 'watches',
        'fish': 'owns',
        'grass': 'walks on',
        'guitar': 'plays',
        'home': 'lives in',
        'man': 'tempts',
        'money': 'spends',
        'moon': 'aligns with',
        'mountain': 'climbs',
        'noise': 'makes',
        'paper': 'writes',
        'planet': 'lives on',
        'platimum': 'hair colored',
        'prayer': 'in',
        'rain': 'walks in',
        'rainbow': 'looks at',
        'satan': 'enthralls',
        'spider': 'steps on',
        'sponge': 'cleans with',
        'tv': 'watches',
        'toilet': 'uses',
        'train': 'rides on',
        'tree': 'plants',
        'turnip': 'eats',
        'ufo': 'debunks',
        'vampire': 'becomes',
        'water': 'drinks',
        'wolf': 'tames',
    },
};
//#endregion
const widgetsUtilityActive = [];
const widgetsGamesActive = [];
const widgetsFunActive = [];
let widgetsTextActive = [];
const operation = '-+/*%';
const punctuation = '\\[\\!\\"\\#\\$\\%\\&\\\'\\(\\)'
    + '\\*\\+\\,\\\\\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\['
    + '\\]\\^\\_\\`\\{\\|\\}\\~\\]';
const matchAll = new RegExp('\\s*(\\.{3}|\\w+\\-\\w+|\\w+"(?:\\w+)?|\\w+|[' + punctuation + '])');
//#region Select
const formatGroupLabel = (data) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'}}>
        <span className='aesthetic-scale scale-self font transparent-bold'>{data.label}</span>
        <span style={{
            backgroundColor: `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--randColorOpacity')}, 0.3)`,
            borderRadius: '2em',
            color: getComputedStyle(document.documentElement).getPropertyValue('--randColor'),
            display: 'inline-block',
            fontSize: 12,
            fontWeight: 'normal',
            lineHeight: '1',
            minWidth: 1,
            padding: '0.16666666666667em 0.5em',
            textAlign: 'center'}}>
            {data.options.length}
        </span>
    </div>
);
let selectTheme = {};
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
const selectHideGroupHeading = (props) => {
    return(
        <div className='collapse-group-heading'
            onClick={() => {
                document.querySelector(`#${props.id}`)
                    .parentElement
                    .parentElement
                    .classList
                    .toggle('collapse-group');
            }}>
            <components.GroupHeading {...props}/>
        </div>
    );    
};
const selectHideGroupMenuList = (props) => {
    // let newProps = {
    //     ...props,
        // children: props.children
        /// Hides all children
        // children: (Array.isArray(props.children))
        //     ? props.children.map((c, idx) =>
        //         (idx === -1)
        //             ? c
        //             : { ...c, props: { ...c.props, className: 'collapse-group' } }
        //     )
        //     : props.children
    // };
    return <SimpleBar style={{ maxHeight: 210 }}>{props.children}</SimpleBar>;    
};
const menuListScrollbar = (props) => {
    return(
        <SimpleBar style={{ maxHeight: 210 }}>{props.children}</SimpleBar>
    );
};
//#endregion
//#endregion


//////////////////// Widgets ///////////////////////
class Widgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            developer: false,
            values: {
                animation: {value: 'default', label: 'Default'},
                customBorder: {value: 'default', label: 'Default'},
                savePositionPopout: false,
                authorNames: false,
                fullscreen: false,
                resetPosition: false,
                showOnTop: false,
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
                particle: {value: 'default', label: 'Default'},
                decoration: {value: 'default', label: 'Default'},
                particleMute: false
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
                    animesearcher: {
                        name: 'Anime Searcher',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    battery: {
                        name: 'Battery',
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
                        name: 'Calculator',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            expandinput: {
                                position: {
                                    x: 60,
                                    y: 115
                                }
                            }
                        },
                        drag: {
                            disabled: false
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
                    currencyconverter: {
                        name: 'Currency Converter',
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
                    googletranslator: {
                        name: 'Google Translator',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }   
                    },
                    imagecolorpicker: {
                        name: 'Image Color Picker',
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
                    musicplayer: {
                        name: 'Music Player',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    qrcode: {
                        name: 'QR Code',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    quote: {
                        name: 'Quote',
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
                        name: 'Spreadsheet',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    timeconversion: {
                        name: 'Time Conversion',
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
                        name: 'Translator',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            replace: {
                                position: {
                                    x: 50,
                                    y: 74
                                }
                            },
                            reverse: {
                                position: {
                                    x: 90,
                                    y: 74
                                }
                            },
                            casetransform: {
                                position: {
                                    x: 90,
                                    y: 74
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }   
                    },
                    weather: {
                        name: 'Weather',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            searchhelp: {
                                position: {
                                    x: 12,
                                    y: 70
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    // notepad: {
                    //     name: 'Notepad',
                    //     active: false,
                    //     position: {
                    //         x: 0,
                    //         y: 0
                    //     },
                    //     drag: {
                    //         disabled: false
                    //     }
                    // },
                    // urlshortner: {
                    //     name: 'URL Shortner',
                    //     active: false,
                    //     position: {
                    //         x: 0,
                    //         y: 0
                    //     },
                    //     drag: {
                    //         disabled: false
                    //     }
                    // },
                },
                games: {
                    breakout: {
                        name: 'Breakout',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    bullethell: {
                        name: 'Bullet Hell',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    chess: {
                        name: 'Chess',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    colormemory: {
                        name: 'Color Memory',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    grindshot: {
                        name: 'Grindshot',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    minesweeper: {
                        name: 'Minesweeper',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    rockpaperscissor: {
                        name: 'Rock Paper Scissor',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    simongame: {
                        name: 'Simon Game',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            settings: {
                                position: {
                                    x: 105,
                                    y: 290
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    snake: {
                        name: 'Snake',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            settings: {
                                position: {
                                    x: 145,
                                    y: 325
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    tetris: {
                        name: 'Tetris',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    trivia: {
                        name: 'Trivia',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    twentyfortyeight: {
                        name: '2048',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    typingtest: {
                        name: 'Typing Test',
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
                fun: {
                    aiimagegenerator: {
                        name: 'Ai Image Generator',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            prompthelp: {
                                position: {
                                    x: 230,
                                    y: 50
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    donutanimation: {
                        name: 'Donut Animation',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    facts: {
                        name: 'Facts',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    pickerwheel: {
                        name: 'Picker Wheel',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    pokemonsearch: {
                        name: 'Pokemon Search',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            settings: {
                                position: {
                                    x: 15,
                                    y: 85
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    sticker: {
                        name: 'Sticker',
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                }
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
                health: 1,
                mana: 1,
                attack: 1,
                defense: 1,
                strength: 1,
                agility: 1,
                vitality: 1,
                resilience: 1,
                intelligence: 1,
                dexterity: 1,
                luck: 1
            },
            abilities: []
        };
        this.randomColor = this.randomColor.bind(this);
        this.handleShowHide = this.handleShowHide.bind(this);
        this.handleShowHidePopout = this.handleShowHidePopout.bind(this);
        this.handleHotbar = this.handleHotbar.bind(this);
        this.updateStickers = this.updateStickers.bind(this);
        this.updateCustomBorder = this.updateCustomBorder.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        this.storeData = this.storeData.bind(this);
        this.addGoldBag = this.addGoldBag.bind(this);
        this.addItem = this.addItem.bind(this);
        this.equipItem = this.equipItem.bind(this);
        this.updateGameValue = this.updateGameValue.bind(this);
        this.updateGlobalValue = this.updateGlobalValue.bind(this);
        this.talk = this.talk.bind(this);
        this.renderHotbar = this.renderHotbar.bind(this);
        this.showSetting = this.showSetting.bind(this);
    };
    randomColor(forcedColorR, forcedColorG, forcedColorB) {
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
        this.setState({
            color: randColor
        });
        /// Set react-select colors
        selectTheme = {
            primary: randColor,         /// Currently selected option background color
            primary25: `rgba(${randColorOpacity}, 0.3)`,    /// Hover option background color
            neutral20: randColor,       /// Border color of select
            neutral30: randColorLight,  /// Hover border color
            neutral40: randColorLight,  /// Hover arrow color
            neutral60: randColorLight,  /// Active arrow color
            neutral80: randColor        /// Placeholder text color
        };
    };    
    handleShowHide(what, where) {
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
                let elementSelects = e.querySelectorAll('.select-match');
                widgetsTextActive = [...document.querySelectorAll('.text-animation')];
                for (let i of elementSelects) {
                    i.style.display = 'block';
                };
                this.handleAnimation(what);
                if (this.state.values.customBorder.value !== 'default') {
                    this.updateCustomBorder(what);
                };
                if (this.state.values.decoration.value !== 'default') {
                    this.updateDecoration(what);
                };
                if (this.state.values.shadow) {
                    this.updateDesign('shadow', true, what);
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
    handleShowHidePopout(popout, visible, button, inverse) {
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
    handleHotbar(element, what, where) {
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
            default: { break; };
        };
    };
    handleMouseMove(event) {
        window.mouse = {
            x: event.clientX,
            y: event.clientY
        };
    };
    updateStickers(mutateType, stickerName, stickerImage) {
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
    updateDesign(what, value, where) {
        let widget, popout, combine;
        if (where !== undefined) {
            widget = document.getElementById(where + '-widget-animation');
            popout = widget.querySelectorAll('.popout');
            combine = [widget, ...popout];
        } else {
            widget = document.querySelectorAll('.widget-animation');
            popout = document.querySelectorAll('.popout');
            combine = [...widget, ...popout];
        };
        switch (what) {
            case 'shadow':
                for (const element of combine) {
                    if (value === true) {
                        element.style.boxShadow = '20px 20px rgba(0, 0, 0, .15)';
                    } else {
                        element.style.boxShadow = 'none';
                    };
                };
                break;
            case 'default':
                for (const element of combine) {
                    element.style.boxShadow = 'none'
                };
                break;
            default: break;
        };
    };
    updateValue(value, what, type) {
        switch (what) {
            case 'customBorder':
                this.updateCustomBorder('', value);
                break;
            case 'decoration':
                this.updateDecoration('', value);
                break;
            case 'health':
                healthDisplay = value;
                break;
            case 'loot':
                lootDisplay = value;
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
    updateCustomBorder(what, value) {
        let widget, popout, widgetAll;
        if (what !== undefined && what !== '') {
            widget = document.getElementById(what + '-widget-animation');
            popout = widget.querySelectorAll('.popout-animation');
            widgetAll = [widget, ...popout];
        } else {
            widget = document.querySelectorAll('.widget-animation');
            popout = document.querySelectorAll('.popout-animation');
            widgetAll = [...widget, ...popout];
        };
        if (value !== undefined) {
            for (const element of widgetAll) {
                element.classList.remove(`border-${this.state.values.customBorder.value}`);
                element.classList.add(`border-${value.value}`);
            };
        } else {
            for (const element of widgetAll) {
                element.classList.add(`border-${this.state.values.customBorder.value}`);
            };
        };
    };
    updateDecoration(what, value) {
        let widget, popout, widgetAll;
        if (what !== undefined && what !== '') {
            widget = document.getElementById(what + '-widget-animation');
            popout = widget.querySelectorAll('.popout-animation');
            widgetAll = [widget, ...popout];
        } else {
            widget = document.querySelectorAll('.widget-animation');
            popout = document.querySelectorAll('.popout-animation');
            widgetAll = [...widget, ...popout];
        };
        if (value !== undefined) {
            if (value.value !== 'default') {
                for (const element of widgetAll) {
                    const elementDecoration = element.getElementsByClassName('decoration');
                    if (elementDecoration.length === 1) {
                        elementDecoration[0].src = `/resources/decoration/${value.value}.webp`;
                        elementDecoration[0].alt = value.value;
                        elementDecoration[0].className = `decoration ${value.value}`;
                    } else if (elementDecoration.length > 1) {
                        elementDecoration[elementDecoration.length - 1].src = `/resources/decoration/${value.value}.webp`;
                        elementDecoration[elementDecoration.length - 1].alt = value.value;
                        elementDecoration[elementDecoration.length - 1].className = `decoration ${value.value}`;
                    } else {
                        const elementImage = document.createElement('img');
                        elementImage.src = `/resources/decoration/${value.value}.webp`;
                        elementImage.alt = value.value;
                        elementImage.className = `decoration ${value.value}`;
                        elementImage.loading = 'lazy';
                        elementImage.encoding = 'async';
                        element.appendChild(elementImage);        
                    };
                };
            } else {
                for (const element of widgetAll) {
                    const elementDecoration = element.getElementsByClassName('decoration');
                    if (elementDecoration.length === 1) {
                        elementDecoration[0].parentNode.removeChild(elementDecoration[0]);
                    } else if (elementDecoration.length > 1) {
                        element.removeChild(elementDecoration[elementDecoration.length - 1]);
                    };
                };
            };
        } else {
            if (this.state.values.decoration.value !== 'default') {
                const valueDecoration = this.state.values.decoration.value;
                for (const element of widgetAll) {
                    const elementDecoration = element.getElementsByClassName('decoration');
                    if (elementDecoration.length !== 0) {
                        elementDecoration[0].src = `/resources/decoration/${valueDecoration}.webp`;
                        elementDecoration[0].alt = valueDecoration;
                        elementDecoration[0].className = `decoration ${valueDecoration}`;
                    } else {
                        const elementImage = document.createElement('img');
                        elementImage.src = `/resources/decoration/${valueDecoration}.webp`;
                        elementImage.alt = valueDecoration;
                        elementImage.className = `decoration ${valueDecoration}`;
                        elementImage.loading = 'lazy';
                        elementImage.encoding = 'async';
                        element.appendChild(elementImage);        
                    };
                };
            };
        };
    };
    randomTimeoutText() {
        if (this.state.values.randomText && (timeoutText === undefined)) {
            let randomNumber = Math.random() * 60000 + 5000;
            timeoutText = setTimeout(() => {
                this.randomTextAnimation();
                timeoutText = undefined;
                this.randomTimeoutText();
            }, randomNumber);
        };
    };
    randomTextAnimation() {
        if (widgetsTextActive.length > 0) {
            let randomTextAnimation = textAnimations[Math.floor(Math.random() * textAnimations.length)];
            let elementRandomText = widgetsTextActive[Math.floor(Math.random() * widgetsTextActive.length)];
            elementRandomText.style.animation = 'none';
            window.requestAnimationFrame(() => {
                elementRandomText.style.animation = randomTextAnimation; 
            });
        };
    };
    randomTimeoutHorror() {
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
    updateWidgetsActive(what, where) {
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
    updatePosition(what, where, xNew, yNew, type, name) {
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
    addGoldBag(event) {
        this.setState({
            gold: this.state.gold + event.detail
        });
    };
    addItem(event) {
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
    equipItem(event) {
        const itemData = {
            'name': event.detail.name,
            'rarity': event.detail.rarity
        };
        let newEquipment;
        if (event.detail.side) {
            if (this.state.equipment[event.detail.slot][event.detail.side].name !== event.detail.name
                && this.state.equipment[event.detail.slot][event.detail.side].name === '') {
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
                let item = items[itemData.rarity][itemData.name];
                if (item.type === 'stat' || item.type === 'both') {
                    let itemStats = Object.keys(item.stats);
                    let newStats = {};
                    for (let i in itemStats) {
                        newStats[itemStats[i]] = item.stats[itemStats[i]] + this.state.stats[itemStats[i]];
                    };
                    this.updateGameValue('stats', newStats);
                };
                if (item.type === 'ability' || item.type === 'both') {
                    let newAbilities = [...this.state.abilities, item.information];
                    this.updateGameValue('abilities', newAbilities);
                };
            };
        } else {
            if (this.state.equipment[event.detail.slot].name !== event.detail.name
                && this.state.equipment[event.detail.slot].name === '') {
                newEquipment = {
                    ...this.state.equipment,
                    [event.detail.slot]: {
                        ...itemData
                    }
                };
                this.updateGameValue('equipment', newEquipment);
                let item = items[itemData.rarity][itemData.name];
                if (item.type === 'stat' || item.type === 'both') {
                    let itemStats = Object.keys(item.stats);
                    let newStats = {};
                    for (let i in itemStats) {
                        newStats[itemStats[i]] = item.stats[itemStats[i]] + this.state.stats[itemStats[i]];
                    };
                    this.updateGameValue('stats', newStats);
                };
                if (item.type === 'ability' || item.type === 'both') {
                    let newAbilities = [...this.state.abilities, item.information];
                    this.updateGameValue('abilities', newAbilities);
                };
            };
        };
    };
    updateGameValue(what, value) {
        switch (what) {
            case 'equipment':
                this.setState({
                    equipment: value
                });        
                break;
            case 'gold':
                this.setState({
                    gold: this.state.gold + value
                });        
                break;
            case 'exp':
                this.setState({
                    stats: {
                        ...this.state.stats,
                        exp: this.state.stats.exp + value
                    }
                }, () => {
                    if (this.state.stats.exp >= this.state.stats.maxExp) {
                        let remainderExp = Math.abs(this.state.stats.maxExp - this.state.stats.exp);
                        let allStats = Object.keys(this.state.stats).slice(3);
                        let randomStat = allStats[Math.floor(Math.random() * allStats.length)];
                        this.setState({
                            stats: {
                                ...this.state.stats,
                                level: this.state.stats.level + 1,
                                exp: remainderExp,
                                [randomStat]: this.state.stats[randomStat] + 1
                            }
                        }, () => {
                            this.calculateMaxExp();
                        });
                    };
                });        
                break;
            case 'stats':
                this.setState({
                    stats: {
                        ...this.state.stats,
                        ...value
                    }
                });        
                break;
            case 'abilities':
                this.setState({
                    abilities: [...value]
                });        
                break;
            default: break;
        };
    };
    calculateMaxExp() {
        const equationMaxExp = this.state.stats.level * 100 * 1.25;
        this.setState({
            stats: {
                ...this.state.stats,
                maxExp: equationMaxExp
            }
        });
    };
    talk(text) {
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
    updateGlobalValue(what, value) {
        switch (what) {
            case 'hour':
                currentHour = value;
                break;
            default: break;
        };
    };
    showSetting() {
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
    renderHotbar(widget, type) {
        return <section id={`${widget}-hotbar`}
            className='hotbar'>
            {(this.state.values.showOnTop)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    onClick={() => this.handleHotbar(widget, 'showOnTop', type)}>
                    <IoIosArrowUp/>
                </button>
                : <></>}
            {(this.state.values.resetPosition)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    onClick={() => this.handleHotbar(widget, 'resetPosition', type)}>
                    <Fa0/>
                </button>
                : <></>}
            {(this.state.values.fullscreen)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    onClick={() => this.handleHotbar(widget, 'fullscreen', type)}>
                    <FaExpand/>
                </button>
                : <></>}
            {(this.state.values.close)
                ? <button className='button-match inverse when-elements-are-not-straight'
                    onClick={() => this.handleHotbar(widget, 'close', type)}>
                    <IoClose/>
                </button>
                : <></>}
        </section>
    };
    generateDefaultProps(widget, type) {
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
            playAudio: playAudio,
            calculateBounds: calculateBounds,
            renderHotbar: this.renderHotbar,
            largeIcon: largeIcon
        };
        if (this.state.widgets[type][widget].popouts !== null) {
            defaultProps.popouts = this.state.widgets[type][widget].popouts;
        };
        return defaultProps;
    };
    storeData() {
        let data = {
            utility: {},
            games: {},
            fun: {}
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
            for (let i in this.state.widgets.utility) {
                data.utility[i] = {
                    active: false,
                    position: this.state.widgets.utility[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.utility[i].popouts = this.state.widgets.utility[i].popouts;
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
            for (let i in this.state.widgets.games) {
                data.games[i] = {
                    active: false,
                    position: this.state.widgets.games[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.games[i].popouts = this.state.widgets.games[i].popouts;
                };
            };
            for (let i in this.state.widgets.fun) {
                data.fun[i] = {
                    active: false,
                    position: this.state.widgets.fun[i].position
                };
                if (this.state.values.savePositionPopout) {
                    data.fun[i].popouts = this.state.widgets.fun[i].popouts;
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
        localStorage.setItem('abilities', JSON.stringify(this.state.abilities));
    };
    componentDidMount() {
        this.randomColor();
        window.addEventListener('beforeunload', this.storeData);
        window.addEventListener('new item', this.addItem);
        window.addEventListener('gold bag', this.addGoldBag);
        window.addEventListener('equip item', this.equipItem);
        /// Load widget's data from local storage
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let widgetsUtility = {};
            for (let i in dataLocalStorage.utility) {
                widgetsUtility[i] = {
                    ...this.state.widgets.utility[i],
                    ...dataLocalStorage.utility[i]
                };
                if (dataLocalStorage.utility[i].active) {
                    this.updateWidgetsActive(i, 'utility');
                };
                /// For specific widgets that have unique state values
                let localStorageValues = dataLocalStorage['utility']['setting']['values'];
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
                        });
                        /// Setting global variables
                        healthDisplay = localStorageValues['health'];
                        lootDisplay = localStorageValues['loot'];
                        break;
                    };
                    default: { break; };
                };
            };
            let widgetsGames = {};
            for (let i in dataLocalStorage.games) {
                widgetsGames[i] = {
                    ...this.state.widgets.games[i],
                    ...dataLocalStorage.games[i]
                };
                if (dataLocalStorage.games[i].active) {
                    this.updateWidgetsActive(i, 'games');
                };
            };
            let widgetsFun = {};
            for (let i in dataLocalStorage.fun) {
                widgetsFun[i] = {
                    ...this.state.widgets.fun[i],
                    ...dataLocalStorage.fun[i]
                };
                if (dataLocalStorage.fun[i].active) {
                    this.updateWidgetsActive(i, 'fun');
                };
            };
            this.setState({
                widgets: {
                    ...this.state.widgets,
                    utility: {
                        ...this.state.widgets.utility,
                        ...widgetsUtility
                    },
                    games: {
                        ...this.state.widgets.games,
                        ...widgetsGames
                    },
                    fun: {
                        ...this.state.widgets.fun,
                        ...widgetsFun
                    }
                }
            }, () => {
                this.updateCustomBorder();
                this.updateDecoration();
                widgetsTextActive = [...document.querySelectorAll('.text-animation')];
            });
        } else {
            this.storeData();
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
            let dataLocalStorageStats = JSON.parse(localStorage.getItem('stats'));
            this.setState({
                stats: {
                    ...dataLocalStorageStats
                }
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
        /// Load voices
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
        let widgets = {};
        let widgetActiveVariables = {};
        for (let widgetType of Object.keys(this.state.widgets)) {
            for (let widget of Object.keys(this.state.widgets[widgetType])) {
                switch (widget) {
                    case 'setting':
                    case 'inventory':
                    case 'equipment':
                    case 'character': break;
                    default:
                        widgets[widgetType] = {
                            ...widgets[widgetType],
                            [widget]: this.state.widgets[widgetType][widget].name
                        };
                        break;
                };
                if (widget !== 'setting') {
                    widgetActiveVariables[widget] = this.state.widgets[widgetType][widget].active;
                };
            };
        };
        return (
            <div id='widget-container'
                onMouseMove={(event) => this.handleMouseMove(event)}>
                <section id='disclaimer'
                    onClick={() => { document.getElementById('disclaimer').style.display = 'none'; }}>
                    <span>
                        <FaExclamationTriangle/>
                        Disclaimer
                        <FaExclamationTriangle/>
                    </span>
                    <span>All item names, logos, characters, brands, trademarks and registered trademarks are property of their respective owners and unrelated to Widget Hell.</span>
                </section>
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
                    onClick={() => this.showSetting()}>
                    <IconContext.Provider value={{ size: '2em', className: 'global-class-name' }}>
                        <AiOutlineSetting/>
                    </IconContext.Provider>
                </button>
                {(this.state.developer)
                    && <section style={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'absolute',
                        bottom: 0,
                        right: 0}}>
                        <button onClick={() => {
                            console.log(currentHour);
                        }}>Current Hour</button>
                        <button onClick={() => {
                            randomItem(1, 'exotic');}}>
                            Add item: exotic
                        </button>
                        <button onClick={() => {
                            randomItem(1, 'meme');}}>
                            Add item: meme
                        </button>
                        <button onClick={() => {
                            randomItem(16);}}>
                            Add item: 16
                        </button>
                        <button onClick={() => {
                            randomItem();}}>
                            Add item
                        </button>
                        <button onClick={() => {
                            this.setState({inventory: []});}}>
                            Reset inventory
                        </button>
                    </section>}
                {/* Widgets: Special */}
                {
                    //#region
                }
                <WidgetSetting widgets={widgets}
                    widgetActiveVariables={widgetActiveVariables}
                    values={this.state.values}
                    showHide={this.handleShowHide}
                    showHidePopout={this.handleShowHidePopout}
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
                    randomColor={this.randomColor}
                    formatGroupLabel={formatGroupLabel}
                    selectTheme={selectTheme}
                    selectStyleSmall={selectStyleSmall}
                    menuListScrollbar={menuListScrollbar}
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
                    hexToRgb={hexToRgb}
                    rgbToHex={rgbToHex}
                    showSetting={this.showSetting}
                    calculateBounds={calculateBounds}
                    valueClose={this.state.values.close}
                    microIcon={microIcon}
                    smallMedIcon={smallMedIcon}/>
                {this.state.widgets.utility.character.active
                    && <WidgetCharacter defaultProps={this.generateDefaultProps('character', 'utility')}
                        punctuation={punctuation}
                        equipment={this.state.equipment}/>}
                {this.state.widgets.utility.equipment.active
                    && <WidgetEquipment defaultProps={this.generateDefaultProps('equipment', 'utility')}
                        gameProps={gameProps}
                        updateGameValue={this.updateGameValue}
                        equipment={this.state.equipment}
                        items={items}
                        stats={this.state.stats}
                        abilities={this.state.abilities}/>}
                {this.state.widgets.utility.inventory.active
                    && <WidgetInventory defaultProps={this.generateDefaultProps('inventory', 'utility')}
                        gameProps={gameProps}
                        inventory={this.state.inventory}
                        items={items}/>}
                {
                    //#endregion
                }
                {/* Widgets: Utility */}
                {
                    //#region
                }
                {this.state.widgets.utility.animesearcher.active
                    && <WidgetAnimeSearcher defaultProps={this.generateDefaultProps('animesearcher', 'utility')}
                        copyToClipboard={copyToClipboard}/>}
                {this.state.widgets.utility.battery.active
                    && <WidgetBattery defaultProps={this.generateDefaultProps('battery', 'utility')}
                        smallMedIcon={smallMedIcon}/>}
                {this.state.widgets.utility.calculator.active
                    && <WidgetCalculator defaultProps={this.generateDefaultProps('calculator', 'utility')}
                        copyToClipboard={copyToClipboard}
                        medIcon={medIcon}
                        operation={operation}/>}
                {this.state.widgets.utility.currencyconverter.active
                    && <WidgetCurrencyConverter defaultProps={this.generateDefaultProps('currencyconverter', 'utility')}
                        moneyConversions={moneyConversions}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        menuListScrollbar={menuListScrollbar}
                        randomColor={this.randomColor}/>}
                {this.state.widgets.utility.googletranslator.active
                    && <WidgetGoogleTranslator defaultProps={this.generateDefaultProps('googletranslator', 'utility')}
                        randomColor={this.randomColor}
                        copyToClipboard={copyToClipboard}
                        randSentence={randSentence}
                        languages={languages}
                        talk={this.talk}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        menuListScrollbar={menuListScrollbar}
                        smallIcon={smallIcon}/>}
                {this.state.widgets.utility.imagecolorpicker.active
                    && <WidgetImageColorPicker defaultProps={this.generateDefaultProps('imagecolorpicker', 'utility')}
                        copyToClipboard={copyToClipboard}
                        randomColor={this.randomColor}/>}
                {this.state.widgets.utility.musicplayer.active
                    && <WidgetMusicPlayer defaultProps={this.generateDefaultProps('musicplayer', 'utility')}
                        copyToClipboard={copyToClipboard}/>}
                {this.state.widgets.utility.qrcode.active
                    && <WidgetQRCode defaultProps={this.generateDefaultProps('qrcode', 'utility')}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        smallMedIcon={smallMedIcon}/>}
                {this.state.widgets.utility.quote.active
                    && <WidgetQuote defaultProps={this.generateDefaultProps('quote', 'utility')}
                        copyToClipboard={copyToClipboard}
                        quotes={quotes}
                        talk={this.talk}/>}
                {this.state.widgets.utility.spreadsheet.active
                    && <WidgetSpreadsheet defaultProps={this.generateDefaultProps('spreadsheet', 'utility')}
                        formatGroupLabel={formatGroupLabel}
                        selectStyleSmall={selectStyleSmall}
                        selectTheme={selectTheme}
                        smallMedIcon={smallMedIcon}/>}
                {this.state.widgets.utility.timeconversion.active
                    && <WidgetTimeConversion defaultProps={this.generateDefaultProps('timeconversion', 'utility')}
                        sortSelect={sortSelect}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        menuListScrollbar={menuListScrollbar}/>}
                {this.state.widgets.utility.translator.active
                    && <WidgetTranslator defaultProps={this.generateDefaultProps('translator', 'utility')}
                        randomColor={this.randomColor}
                        copyToClipboard={copyToClipboard}
                        grep={grep}
                        mergePunctuation={mergePunctuation}
                        randSentence={randSentence}
                        sortSelect={sortSelect}
                        brailleDictionary={brailleDictionary}
                        brailleFromDictionary={brailleFromDictionary}
                        moorseCodeDictionary={moorseCodeDictionary}
                        moorseCodeFromDictionary={moorseCodeFromDictionary}
                        phoneticAlphabetDictionary={phoneticAlphabetDictionary}
                        phoneticAlphabetFromDictionary={phoneticAlphabetFromDictionary}
                        mirrorWrittingDictionary={mirrorWrittingDictionary}
                        uwuDictionary={uwuDictionary}
                        uwuEmoticons={uwuEmoticons}
                        emojifyDictionary={emojifyDictionary}
                        enchantingTableDictionary={enchantingTableDictionary}
                        cunnyCodeDictionary={cunnyCodeDictionary}
                        cunnyCodeFromDictionary={cunnyCodeFromDictionary}
                        aronaMessages={aronaMessages}
                        matchAll={matchAll}
                        punctuation={punctuation}
                        talk={this.talk}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        selectHideGroupHeading={selectHideGroupHeading}
                        selectHideGroupMenuList={selectHideGroupMenuList}
                        updateGlobalValue={this.updateGlobalValue}
                        smallIcon={smallIcon}/>}
                {this.state.widgets.utility.weather.active
                    && <WidgetWeather defaultProps={this.generateDefaultProps('weather', 'utility')}
                        smallIcon={smallIcon}/>}
                {/* {this.state.widgets.utility.notepad.active
                    && <WidgetNotepad defaultProps={this.generateDefaultProps('notepad', 'utility')}
                        formatGroupLabel={formatGroupLabel}
                        selectStyleSmall={selectStyleSmall}
                        selectTheme={selectTheme}
                        smallMedIcon={smallMedIcon}/>} */}
                {/* {this.state.widgets.utility.urlshortner.active
                    && <WidgetURLShortner defaultProps={this.generateDefaultProps('urlshortner', 'utility')}/>} */}
                {
                    //#endregion
                }
                {/* Widgets: Games */}
                {
                    //#region
                }
                {this.state.widgets.games.breakout.active
                    && <WidgetBreakout defaultProps={this.generateDefaultProps('breakout', 'games')}
                        gameProps={gameProps}
                        patterns={breakoutPatterns}/>}
                {this.state.widgets.games.bullethell.active
                    && <WidgetBulletHell defaultProps={this.generateDefaultProps('bullethell', 'games')}
                        gameProps={gameProps}/>}
                {this.state.widgets.games.chess.active
                    && <WidgetChess defaultProps={this.generateDefaultProps('chess', 'games')}
                        gameProps={gameProps}/>}
                {this.state.widgets.games.colormemory.active
                    && <WidgetColorMemory defaultProps={this.generateDefaultProps('colormemory', 'games')}
                        gameProps={gameProps}
                        hexToRgb={hexToRgb}
                        randomColor={this.randomColor}/>}
                {this.state.widgets.games.grindshot.active
                    && <WidgetGrindshot defaultProps={this.generateDefaultProps('grindshot', 'games')}
                        gameProps={gameProps}/>}
                {this.state.widgets.games.minesweeper.active
                    && <WidgetMinesweeper defaultProps={this.generateDefaultProps('minesweeper', 'games')}
                        gameProps={gameProps}/>}
                {this.state.widgets.games.rockpaperscissor.active
                    && <WidgetRockPaperScissor defaultProps={this.generateDefaultProps('rockpaperscissor', 'games')}
                        gameProps={gameProps}
                        rps={rps}/>}
                {this.state.widgets.games.simongame.active
                    && <WidgetSimonGame defaultProps={this.generateDefaultProps('simongame', 'games')}
                        gameProps={gameProps}/>}
                {this.state.widgets.games.snake.active
                    && <WidgetSnake defaultProps={this.generateDefaultProps('snake', 'games')}
                        gameProps={gameProps}
                        foodTypes={foodTypes}
                        debris={debrisPatterns}/>}
                {this.state.widgets.games.tetris.active
                    && <WidgetTetris defaultProps={this.generateDefaultProps('tetris', 'games')}
                        gameProps={gameProps}/>}
                {this.state.widgets.games.trivia.active
                    && <WidgetTrivia defaultProps={this.generateDefaultProps('trivia', 'games')}
                        gameProps={gameProps}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        sortSelect={sortSelect}
                        menuListScrollbar={menuListScrollbar}/>}
                {this.state.widgets.games.twentyfortyeight.active
                    && <Widget2048 defaultProps={this.generateDefaultProps('twentyfortyeight', 'games')}
                        gameProps={gameProps}/>}
                {this.state.widgets.games.typingtest.active
                    && <WidgetTypingTest defaultProps={this.generateDefaultProps('typingtest', 'games')}
                        gameProps={gameProps}
                        randSentence={randSentence}/>}
                { 
                    //#endregion
                }
                {/* Widgets: Fun */}
                {
                    //#region
                }
                {this.state.widgets.fun.aiimagegenerator.active
                    && <WidgetAiImageGenerator defaultProps={this.generateDefaultProps('aiimagegenerator', 'fun')}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        menuListScrollbar={menuListScrollbar}
                        smallIcon={smallIcon}
                        smallMedIcon={smallMedIcon}/>}
                {this.state.widgets.fun.donutanimation.active
                    && <WidgetDonutAnimation defaultProps={this.generateDefaultProps('donutanimation', 'fun')}/>}
                {this.state.widgets.fun.facts.active
                    && <WidgetFacts defaultProps={this.generateDefaultProps('facts', 'fun')}/>}
                {this.state.widgets.fun.pickerwheel.active
                    && <WidgetPickerWheel defaultProps={this.generateDefaultProps('pickerwheel', 'fun')}
                        color={color}/>}
                {this.state.widgets.fun.pokemonsearch.active
                    && <WidgetPokemonSearch defaultProps={this.generateDefaultProps('pokemonsearch', 'fun')}
                        microIcon={microIcon}/>}
                {this.state.widgets.fun.sticker.active
                    && <WidgetSticker defaultProps={this.generateDefaultProps('sticker', 'fun')}
                        stickers={this.state.stickers}
                        updateStickers={this.updateStickers}/>}
                {
                    //#endregion
                }
            </div>
        );
    };
};
//#region Widget template
// import React, { memo, useState } from 'react';
// import { FaGripHorizontal } from 'react-icons/fa';
// import { IconContext } from 'react-icons';
// import Draggable from 'react-draggable';

// const Widget[] = ({ defaultProps }) => {
//     return (
//         <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
//             disabled={defaultProps.dragDisabled}
//             onStart={() => defaultProps.dragStart('[]')}
//             onStop={(event, data) => {
//                 defaultProps.dragStop('[]');
//                 defaultProps.updatePosition('[]', '[WIDGET TYPE]', data.x, data.y);
//             }}
//             cancel='button'
//             bounds='parent'>
//             <div id='[]-widget'
//                 className='widget'>
//                 <div id='[]-widget-animation'
//                     className='widget-animation'>
//                     {/* Drag Handle */}
//                     <span id='[]-widget-draggable'
//                         className='draggable'>
//                         <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
//                             <FaGripHorizontal/>
//                         </IconContext.Provider>
//                     </span>
//                     {/* Hotbar */}
//                     {defaultProps.renderHotbar('donutanimation', 'fun')}
//                     {/* Author */}
//                     {(defaultProps.values.authorNames)
//                         ? <span className='font smaller transparent-normal author-name'>Created by [AUTHOR NAME]</span>
//                         : <></>}
//                 </div>
//             </div>
//         </Draggable>
//     );
// };
//#endregion


//////////////////// Render to page ////////////////////
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <div id='Base'>
        <div id='App'
            className='background-default'>
            <Widgets/>
        </div>
    </div>
);