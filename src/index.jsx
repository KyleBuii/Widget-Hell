import DOMPurify from 'dompurify';
import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import { components } from 'react-select';
import './index.scss';
import WidgetCharacter from './Widgets/Character.jsx';
import WidgetEquipment from './Widgets/Equipment.jsx';
import WidgetAiImageGenerator from './Widgets/Fun/AiImageGenerator.jsx';
import WidgetDonutAnimation from './Widgets/Fun/DonutAnimation.jsx';
import WidgetPickerWheel from './Widgets/Fun/PickerWheel.jsx';
import WidgetPokemonSearch from './Widgets/Fun/PokemonSearch.jsx';
import WidgetSticker from './Widgets/Fun/Sticker.jsx';
import Widget2048 from './Widgets/Games/2048.jsx';
import WidgetBreakout from './Widgets/Games/Breakout.jsx';
import WidgetChess from './Widgets/Games/Chess.jsx';
import WidgetMinesweeper from './Widgets/Games/Minesweeper.jsx';
import WidgetSimonGame from './Widgets/Games/SimonGame.jsx';
import WidgetSnake from './Widgets/Games/Snake.jsx';
import WidgetTetris from './Widgets/Games/Tetris.jsx';
import WidgetTrivia from './Widgets/Games/Trivia.jsx';
import WidgetTypingTest from './Widgets/Games/TypingTest.jsx';
import WidgetInventory from './Widgets/Inventory.jsx';
import WidgetBattery from './Widgets/Utility/Battery.jsx';
import WidgetCalculator from './Widgets/Utility/Calculator.jsx';
import WidgetCurrencyConverter from './Widgets/Utility/CurrencyConverter.jsx';
import WidgetGoogleTranslator from './Widgets/Utility/GoogleTranslator.jsx';
import WidgetImageColorPicker from './Widgets/Utility/ImageColorPicker.jsx';
import WidgetNotepad from './Widgets/Utility/Notepad.jsx';
import WidgetQRCode from './Widgets/Utility/QRCode.jsx';
import WidgetQuote from './Widgets/Utility/Quote.jsx';
import WidgetSetting from './Widgets/Utility/Setting.jsx';
import WidgetSpreadsheet from './Widgets/Utility/Spreadsheet.jsx';
import WidgetTimeConversion from './Widgets/Utility/TimeConversion.jsx';
import WidgetTranslator from './Widgets/Utility/Translator.jsx';
import WidgetURLShortner from './Widgets/Utility/URLShortner.jsx';
import WidgetWeather from './Widgets/Utility/Weather.jsx';
import WidgetMusicPlayer from './Widgets/Utility/MusicPlayer.jsx';
import WidgetFacts from './Widgets/Fun/Facts.jsx';
import WidgetAnimeSearcher from './Widgets/Utility/AnimeSearcher.jsx';
import SimpleBar from 'simplebar-react';
import WidgetGrindshot from './Widgets/Games/Grindshot/Grindshot.jsx';
import Cursor from './cursor.jsx';
import WidgetColorMemory from './Widgets/Games/ColorMemory.jsx';
import Particle from './particle.jsx';


//////////////////// Temp Variables ////////////////////
//#region
let timeoutText;
let intervalHorror;
let intervalHorrorMessages;
let color;
let colorLight;
var healthDisplay;
var voices;
window.username = "Anon";
let currentHour = new Date().getHours();
//#endregion


//////////////////// Functions ////////////////////
//#region
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
            return ["Default", "Auto", "Any"].indexOf(b.label) - ["Default", "Auto", "Any"].indexOf(a.label)
                || a.label.localeCompare(b.label);
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

async function copyToClipboard(what){
    if(what !== ""){
        try{
            let dump = document.getElementById("clipboard-dump");
            dump.innerHTML = DOMPurify.sanitize(what);
            await navigator.clipboard.writeText(dump.innerText);
            createPopup("Copied!");
            dump.innerHTML = "";
            return "success";
        }catch(err){
            return "fail";
        };
    };
    return "empty";
};

function createPopup(text, type = "normal", randomPosition = false){
    let widgetContainer = document.getElementById("widget-container");
    let popup = document.createElement("div");
    let elementText = document.createElement("span");
    let timeoutAnimation, timeoutRemove;
    popup.className = "popup flex-center";
    if(randomPosition){
        popup.style.left = `${Math.random() * (document.body.clientWidth - 100) + 100}px`;
        popup.style.top = `${Math.random() * (document.body.clientHeight - 100) + 100}px`;
    }else{
        popup.style.left = `${window.mouse.x - 50}px`;
        popup.style.top = `${window.mouse.y + 10}px`;
    };
    elementText.className = "font medium bold white flex-center column";
    switch(type){
        case "gold":
            let elementAmount = document.createElement("span");
            popup.className += " gold";
            elementAmount.innerHTML = `&#x1F4B0;+${text}`;
            elementText.innerText = "Gold bag found!";
            elementText.appendChild(elementAmount);
            break;
        case "item":
            let itemImage = document.createElement("img");
            popup.className += ` ${text.rarity}`;
            itemImage.src = items[text.rarity][text.name].image;
            elementText.innerText = "Item acquired!";
            elementText.appendChild(itemImage);
            break;
        default:
            elementText.innerText = text;
            break;
    };
    popup.appendChild(elementText);
    widgetContainer.append(popup);
    window.requestAnimationFrame(() => {
        popup.style.animation = "fadeIn 1s";
    });
    timeoutAnimation = setTimeout(() => {
        window.requestAnimationFrame(() => {
            popup.style.animation = "fadeOut 1s";
        });
        timeoutRemove = setTimeout(() => {
            widgetContainer.removeChild(popup);
            clearTimeout(timeoutAnimation);
            clearTimeout(timeoutRemove);    
        }, 1000);
    }, 1000);
    popup.onclick = () => {
        clearTimeout(timeoutAnimation);
        clearTimeout(timeoutRemove);
        widgetContainer.removeChild(popup);
    };
};

function formatNumber(number, digits, shouldRound = false){
    const lookup = [
        { value: 1,    symbol: ""  },
        { value: 1e3,  symbol: "K" },
        { value: 1e6,  symbol: "M" },
        { value: 1e9,  symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const regexDecimals = new RegExp(`^-?\\d+(?:\\.\\d{0,${digits}})?`);
    const regex = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast(item => number >= item.value);
    if(shouldRound){
        return (item)
            ? (number / item.value)
                .toFixed(digits)
                .replace(regex, "")
                .concat(item.symbol)
            : "0";
    }else{
        return (item)
            ? (number / item.value)
                .toString()
                .match(regexDecimals)[0]
                .replace(regex, "")
                .concat(item.symbol)
            : "0";
    };
};

function randomItem(amount = 1, rarity){
    var item, itemKeys, itemRarity, randomItem, randomRarity;
    var totalGold = 0;
    var allItems = [];
    for(let i = 0; i < amount; i++){
        randomRarity = Math.random();
        if(rarity){
            itemKeys = Object.keys(items[rarity]);
            itemRarity = rarity;
        }else{
            if(randomRarity < itemRates.common.rate){
                itemKeys = Object.keys(items.common);
                itemRarity = "common";
            }else if(randomRarity < (itemRates.common.rate + itemRates.rare.rate)){
                itemKeys = Object.keys(items.rare);
                itemRarity = "rare";
            }else if(randomRarity < (itemRates.common.rate + itemRates.rare.rate + itemRates.exotic.rate)){
                itemKeys = Object.keys(items.exotic);
                itemRarity = "exotic";
            }else if(randomRarity < (itemRates.common.rate + itemRates.rare.rate + itemRates.exotic.rate + itemRates.meme.rate)){
                itemKeys = Object.keys(items.meme);
                itemRarity = "meme";
            };
        };
        randomItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
        if(randomItem !== "nothing"){
            item = {
                name: randomItem,
                rarity: itemRarity
            };
            if(randomItem === "gold"){
                item.amount = Math.floor(Math.random() * 20 + 1);
                totalGold += item.amount;
                createPopup(item.amount, "gold", true);
            }else{
                allItems.push(item);
                createPopup(item, "item", true);
            };
        };
    };
    if(totalGold !== 0){
        window.dispatchEvent(new CustomEvent("gold bag", {
            "detail": totalGold
        }));
    };
    if(allItems.length !== 0){
        window.dispatchEvent(new CustomEvent("new item", {
            "detail": allItems
        }));
    };
};

function renderHearts(health){
    let elementHearts = [];
    if(healthDisplay.value !== "none"){
        let currentHealth = health;
        let calculateHearts = [];
        let heartKeys = Object.keys(heartValues);
        let heartIndex = heartKeys.length;
        let currentHeartValue = heartValues[heartKeys[heartIndex - 1]];
        let amount;
        calculating: while(Math.floor(currentHealth) > 0){
            if(Math.max(currentHealth, currentHeartValue) === currentHealth){
                switch(healthDisplay.value){
                    case "limit5":
                        amount = Math.floor(currentHealth / currentHeartValue);
                        currentHealth -= (amount * currentHeartValue);
                        if(calculateHearts.length === 5){
                            break calculating;
                        };
                        if(amount > 5 && calculateHearts.length === 0){
                            amount = 5;
                        }else if(amount > 5){
                            amount = 5 - calculateHearts.length;
                        };
                        for(let i = amount; i > 0; i--){
                            calculateHearts.push(heartIndex);
                        };
                        break;
                    default:
                        amount = Math.floor(currentHealth / currentHeartValue);
                        currentHealth -= (amount * currentHeartValue);
                        for(let i = amount; i > 0; i--){
                            calculateHearts.push(heartIndex);
                        };
                        break;        
                };
            };
            heartIndex--;
            currentHeartValue = heartValues[heartKeys[heartIndex - 1]];
        };
        for(let i = 0; i < calculateHearts.length; i++){
            if((calculateHearts[i] === 1) && (healthDisplay.value === "noredheart")){
            break; 
            };
            elementHearts.push(<img src={`/resources/hearts/heart${calculateHearts[i]}.png`}
                alt={`heart${calculateHearts[i]} ${i + 1}`}
                key={`heart${calculateHearts[i]} ${i + 1}`}
                draggable={false}/>);
        };
    };
    return elementHearts;
};

function playAudio(audio){
    let duplicateAudio = audio.cloneNode();
    duplicateAudio.play();
    duplicateAudio.onended = () => {
        duplicateAudio.remove();
    };    
};

function hexToRgb(hex){
    /// Input Format: #000000
    /// Return Format: [0, 0, 0]
    return hex.replace(
            /^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b
        ).substring(1)
        .match(/.{2}/g)
        .map(x => parseInt(x, 16));
};

function rgbToHex(rgb){
    /// Input Format: [0, 0, 0]
    /// Return Format: #00000
    return "#" + rgb.map((x) => {
        const hex = x.toString(16);
        return (hex.length === 1) ? '0' + hex : hex;
    }).join('');
};
//#endregion


//////////////////// Variables ////////////////////
//#region
//#region Icon
const microIcon = "0.6em";
const smallIcon = "0.88em";
const smallMedIcon = "1.2em";
const medIcon = "4em";
const largeIcon = "5em";
//#endregion
const zIndexDefault = 2;
const zIndexDrag = 5;
const colorRange = 200;
//#region Data
const tricks = ["spin", "flip", "hinge"];
const textAnimations = [
    "textBobbling 1s 1 cubic-bezier(0.5,220,0.5,-220)",
    "textErratic 1s 1",
    "textGlitch 1s 1 cubic-bezier(0.5,-2000,0.5,2000)",
    "textRotate 1s 1 cubic-bezier(.5,-150,.5,150)"
];
const languages = ["Afrikaans", "af", "Albanian", "sq", "Amharic", "am", "Arabic", "ar", "Armenian", "hy", "Assamese", "as", "Azerbaijani (Latin)", "az", "Bangla", "bn", "Bashkir", "ba", "Basque", "eu", "Bosnian (Latin)", "bs", "Bulgarian", "bg", "Cantonese (Traditional)", "yue", "Catalan", "ca", "Chinese (Literary)", "lzh", "Chinese Simplified", "zh-Hans", "Chinese Traditional", "zh-Hant", "Croatian", "hr", "Czech", "cs", "Danish", "da", "Dari", "prs", "Divehi", "dv", "Dutch", "nl", "English", "en", "Estonian", "et", "Faroese", "fo", "Fijian", "fj", "Filipino", "fil", "Finnish", "fi", "French", "fr", "French (Canada)", "fr-ca", "Galician", "gl", "Georgian", "ka", "German", "de", "Greek", "el", "Gujarati", "gu", "Haitian Creole", "ht", "Hebrew", "he", "Hindi", "hi", "Hmong Daw (Latin)", "mww", "Hungarian", "hu", "Icelandic", "is", "Indonesian", "id", "Inuinnaqtun", "ikt", "Inuktitut", "iu", "Inuktitut (Latin)", "iu-Latn", "Irish", "ga", "Italian", "it", "Japanese", "ja", "Kannada", "kn", "Kazakh", "kk", "Khmer", "km", "Klingon", "tlh-Latn", "Klingon (plqaD)", "tlh-Piqd", "Korean", "ko", "Kurdish (Central)", "ku", "Kurdish (Northern)", "kmr", "Kyrgyz (Cyrillic)", "ky", "Lao", "lo", "Latvian", "lv", "Lithuanian", "lt", "Macedonian", "mk", "Malagasy", "mg", "Malay (Latin)", "ms", "Malayalam", "ml", "Maltese", "mt", "Maori", "mi", "Marathi", "mr", "Mongolian (Cyrillic)", "mn-Cyrl", "Mongolian (Traditional)", "mn-Mong", "Myanmar", "my", "Nepali", "ne", "Norwegian", "nb", "Odia", "or", "Pashto", "ps", "Persian", "fa", "Polish", "pl", "Portuguese (Brazil)", "pt", "Portuguese (Portugal)", "pt-pt", "Punjabi", "pa", "Queretaro Otomi", "otq", "Romanian", "ro", "Russian", "ru", "Samoan (Latin)", "sm", "Serbian (Cyrillic)", "sr-Cyrl", "Serbian (Latin)", "sr-Latn", "Slovak", "sk", "Slovenian", "sl", "Somali (Arabic)", "so", "Spanish", "es", "Swahili (Latin)", "sw", "Swedish", "sv", "Tahitian", "ty", "Tamil", "ta", "Tatar (Latin)", "tt", "Telugu", "te", "Thai", "th", "Tibetan", "bo", "Tigrinya", "ti", "Tongan", "to", "Turkish", "tr", "Turkmen (Latin)", "tk", "Ukrainian", "uk", "Upper Sorbian", "hsb", "Urdu", "ur", "Uyghur (Arabic)", "ug", "Uzbek (Latin)", "uz", "Vietnamese", "vi", "Welsh", "cy", "Yucatec Maya", "yua", "Zulu", "zu"];
const moneyConversions = ["AED", "AE", "AFN", "AF", "XCD", "AG", "ALL", "AL", "AMD", "AM", "ANG", "AN", "AOA", "AO", "AQD", "AQ", "ARS", "AR", "AUD", "AU", "AZN", "AZ", "BAM", "BA", "BBD", "BB", "BDT", "BD", "XOF", "BE", "BGN", "BG", "BHD", "BH", "BIF", "BI", "BMD", "BM", "BND", "BN", "BOB", "BO", "BRL", "BR", "BSD", "BS", "NOK", "BV", "BWP", "BW", "BYR", "BY", "BZD", "BZ", "CAD", "CA", "CDF", "CD", "XAF", "CF", "CHF", "CH", "CLP", "CL", "CNY", "CN", "COP", "CO", "CRC", "CR", "CUP", "CU", "CVE", "CV", "CYP", "CY", "CZK", "CZ", "DJF", "DJ", "DKK", "DK", "DOP", "DO", "DZD", "DZ", "ECS", "EC", "EEK", "EE", "EGP", "EG", "ETB", "ET", "EUR", "FR", "FJD", "FJ", "FKP", "FK", "GBP", "GB", "GEL", "GE", "GGP", "GG", "GHS", "GH", "GIP", "GI", "GMD", "GM", "GNF", "GN", "GTQ", "GT", "GYD", "GY", "HKD", "HK", "HNL", "HN", "HRK", "HR", "HTG", "HT", "HUF", "HU", "IDR", "ID", "ILS", "IL", "INR", "IN", "IQD", "IQ", "IRR", "IR", "ISK", "IS", "JMD", "JM", "JOD", "JO", "JPY", "JP", "KES", "KE", "KGS", "KG", "KHR", "KH", "KMF", "KM", "KPW", "KP", "KRW", "KR", "KWD", "KW", "KYD", "KY", "KZT", "KZ", "LAK", "LA", "LBP", "LB", "LKR", "LK", "LRD", "LR", "LSL", "LS", "LTL", "LT", "LVL", "LV", "LYD", "LY", "MAD", "MA", "MDL", "MD", "MGA", "MG", "MKD", "MK", "MMK", "MM", "MNT", "MN", "MOP", "MO", "MRO", "MR", "MTL", "MT", "MUR", "MU", "MVR", "MV", "MWK", "MW", "MXN", "MX", "MYR", "MY", "MZN", "MZ", "NAD", "NA", "XPF", "NC", "NGN", "NG", "NIO", "NI", "NPR", "NP", "NZD", "NZ", "OMR", "OM", "PAB", "PA", "PEN", "PE", "PGK", "PG", "PHP", "PH", "PKR", "PK", "PLN", "PL", "PYG", "PY", "QAR", "QA", "RON", "RO", "RSD", "RS", "RUB", "RU", "RWF", "RW", "SAR", "SA", "SBD", "SB", "SCR", "SC", "SDG", "SD", "SEK", "SE", "SGD", "SG", "SKK", "SK", "SLL", "SL", "SOS", "SO", "SRD", "SR", "STD", "ST", "SVC", "SV", "SYP", "SY", "SZL", "SZ", "THB", "TH", "TJS", "TJ", "TMT", "TM", "TND", "TN", "TOP", "TO", "TRY", "TR", "TTD", "TT", "TWD", "TW", "TZS", "TZ", "UAH", "UA", "UGX", "UG", "USD", "US", "UYU", "UY", "UZS", "UZ", "VEF", "VE", "VND", "VN", "VUV", "VU", "YER", "YE", "ZAR", "ZA", "ZMK", "ZM", "ZWD", "ZW"];
const quotes = [
    //#region
    {
        quote: "You all have a little bit of 'I want to save the world' in you, that's why you're here, in college. I want you to know that it's okay if you only save one person, and it's okay if that person is you."
        , author: "Some college professor"
    },
    {
        quote: "Your direction is more important than your speed."
        , author: "Richard L. Evans"
    },
    {
        quote: "All things are difficult before they are easy."
        , author: "Thomas Fuller"
    },
    {
        quote: "Your first workout will be bad. Your first podcast will be bad. Your first speech will be bad. Your first video will be bad. Your first ANYTHING will be bad. But you can't make your 100th without making your first."
        , author: ""
    }, 
    {
        quote: "If you are depressed, you are living in the past. If you are anxious, you are living in the future. If you are at peace, you are living in the present."
        , author: "Lao Tzu"
    },
    {
        quote: "Accept both compliments and criticism. It takes both sun and rain for a flower to grow."
        , author: ""
    },
    {
        quote: "Every day is an opportunity to improve, even if it is only by 1%. It's not about being invincible, it's about being unstoppable."
        , author: "改善 (Kaizen)"
    },
    {
        quote: "Start where you are. Use what you have. Do what you can."
        , author: "Arthur Ashe"
    },
    {
        quote: "Some days, it's easier. Other days, it's harder. Be it easy or hard, the only way to get there... is to start."
        , author: ""
    },
    {
        quote: "Never be a prisoner of your past. It was a lesson, not a life sentence."
        , author: ""
    },
    {
        quote: "Just because it's taking time, doesn't mean it's not happening."
        , author: ""
    },
    {
        quote: "If you aren't willing to look like a foolish beginner, you'll never become a graceful master. Embarrassment is the cost of entry."
        , author: ""
    },
    {
        quote: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time."
        , author: "Thomas Edison"
    },
    {
        quote: "Was it a bad day? Or was it a bad five minutes that you milked all day?"
        , author: ""
    },
    {
        quote: "Sometimes it takes ten years to get that one year that changes your life."
        , author: ""
    },
    {
        quote: "It's not the load that breaks you down, it's the way you carry it."
        , author: "Lou Holtz"
    },
    {
        quote: "Care about what other people think and you will always be their prisoner."
        , author: "Lao Tzu"
    },
    {
        quote: "Fear has led to more procrastinations than laziness ever will."
        , author: "Ankur Warikoo"
    },
    {
        quote: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking."
        , author: "Steve Jobs"
    },
    {
        quote: "Don't watch the clock; do what it does. Keep going."
        , author: "Sam Levenson"
    },
    {
        quote: "You are free and that is why you are lost.",
        author: "Franz Kafka"
    },
    {
        quote: "It's hard to hate someone once you understand them."
        , author: "Lucy Christopher"
    },
    {
        quote: "The sunrise, of course, doesn't care if we watch it or not. It will keep on being beautiful, even if no one bothers to look at it."
        , author: "Gene Amole"
    },
    {
        quote: "You’ll stop worrying what others think about you when you realize how seldom they do."
        , author: "David Foster Wallace"
    },
    {
        quote: "Although the world is full of suffering, it is also full of the overcoming of it."
        , author: "Helen Keller"
    },
    {
        quote: "Somewhere, something incredible is waiting to be known."
        , author: "Carl Sagan"
    },
    {
        quote: "We shape clay into a pot, but it is the emptiness inside that holds whatever we want."
        , author: "Lao Tzu"
    },
    {
        quote: "It is during our darkest moments that we must focus to see the light."
        , author: "Aristotle Onassis"
    },
    {
        quote: "You waste years by not being able to waste hours."
        , author: "Amor Tversky"
    },
    {
        quote: "The most common way people give up their power is by thinking they don’t have any."
        , author: "Alice Walker"
    },
    {
        quote: 'How many people long for that "past, simpler, and better world," I wonder, without ever recognizing the truth that perhaps it was they who were simpler and better, and not the world about them?'
        , author: "Drizzt Do'Urden (R. A. Salvatore)"
    },
    {
        quote: "You only live once, but if you do it right, once is enough."
        , author: "Mae West"
    },
    {
        quote: "When people go back in time in movies or books they are often afraid of doing any small thing because it might drastically change the future. Yet people in the present don't realize the small things they do will change the future in ways they can't even imagine."
        , author: "/u/Reichukey"
    },
    {
        quote: "People believe in ghost they never saw, but don't believe in themselves they see everyday."
        , author: ""
    },
    {
        quote: "Once you've accepted your flaws, no one can use them against you."
        , author: "George R.R. Martin"
    },
    //#endregion
    {
        quote: "Yet it is far better to light the candle than to curse the darkness."
        , author: "W. L. Watkinson"
    },
    {
        quote: "Creativity is allowing yourself to make mistakes. Art is knowing which ones to keep."
        , author: "Scott Adams"
    },
    {
        quote: "Monkeys can climb. Crickets can leap. Horses can race. Owls can seek. Cheetahs can run. Eagles can fly. People can try. But that’s about it."
        , author: "Natsuki"
    },
    {
        quote: "It takes only one step to overcome your fears. You just need to take one step forward. The rest will come naturally."
        , author: "Vincent Adenka"
    }
];
const sentences = [
    "My mum (82F) told me (12M) to do the dishes (16) but I (12M) was too busy playing Fortnite (3 kills) so I (12M) grabbed my controller (DualShock 4) and threw it at her (138kph). She fucking died, and I (12M) went to prison (18 years). While in prison I (12M) incited several riots (3) and assumed leadership of a gang responsible for smuggling drugs (cocaine) into the country. I (12M) also ordered the assassination of several celebrities (Michael Jackson, Elvis Presley and Jeffrey Epstein) and planned a terrorist attack (9/11)."
    , "So I (74M) was recently hit by a car (2014 Honda) and died. My wife (5F) organized me a funeral (cost $2747) without asking me (74M) at all. I (74M) was unable to make it because I (74M) was dead (17 days). At the funeral I heard my dad (15M) and other family members talking about how they wish I could be there and now I feel bad for not showing up."
    , "I think fortnite should add a pregnant female skin. Every kill she gets she slowly gives birth. When in water blood comes out. At 10 kills she gives birth and the baby can be your pet."
    , "PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP PLAP GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT GET PREGNANT"    
    , `Twitch should ban the term "live-streaming." It's offensive to dead people. My great grandparents are dead and I would like to show them some respect and have twitch ban the term “live-streaming”. It's a slur used against dead people.`
    , 'I, an atheist, accidentally said "oh my g*d" instead of "oh my science"'
    , "Darkness blacker than black and darker than dark, I beseech thee, combine with my deep crimson. The time of awakening cometh. Justice, fallen upon the infallible boundary, appear now as an intangible distortions! I desire for my torrent of power a destructive force: a destructive force without equal! Return all creation to cinders, and come from the abyss! Explosion!"    
    , "Oh, blackness shrouded in light, Frenzied blaze clad in night, In the name of the crimson demons, let the collapse of thine origin manifest. Summon before me the root of thy power hidden within the lands of the kingdom of demise! Explosion!"
    , "Crimson-black blaze, king of myriad worlds, though I promulgate the laws of nature, I am the alias of destruction incarnate in accordance with the principles of all creation. Let the hammer of eternity descend unto me! Explosion!"    
    , "O crucible which melts my soul, scream forth from the depths of the abyss and engulf my enemies in a crimson wave! Pierce trough, EXPLOSION!"    
    , 'If you ask Rick Astley for a copy of the movie "UP", he cannot give you it as he can never give you up. But, by doing that, he is letting you down, and thus, is creating something known as the Astley Paradox.'
    , "Reddit should rename 'share' to 'spreddit', 'delete' to 'shreddit' and 'karma' to 'creddit'. Yet they haven't. I don't geddit."
    , "The tower of rebellion creeps upon man's world... The unspoken faith displayed before me... The time has come! Now, awaken from your slumber, and by my madness, be wrought! Strike forth, Explosion!"    
    , "Glasses are really versatile. First, you can have glasses-wearing girls take them off and suddenly become beautiful, or have girls wearing glasses flashing those cute grins, or have girls stealing the protagonist's glasses and putting them on like, \"Haha, got your glasses!\" That's just way too cute! Also, boys with glasses! I really like when their glasses have that suspicious looking gleam, and it's amazing how it can look really cool or just be a joke. I really like how it can fulfill all those abstract needs. Being able to switch up the styles and colors of glasses based on your mood is a lot of fun too! It's actually so much fun! You have those half rim glasses, or the thick frame glasses, everything! It's like you're enjoying all these kinds of glasses at a buffet. I really want Luna to try some on or Marine to try some on to replace her eyepatch. We really need glasses to become a thing in hololive and start selling them for HoloComi. Don't. You. Think. We. Really. Need. To. Officially. Give. Everyone. Glasses?"
    , "Eggs, Bacon, Grist, Sausage. The cockroaches in your bedroom held you hostage."
    , "As a man who has a daughter, you are LITERALLY dedicating at least 20 years of your life simply to raise a girl for another man to enjoy. It is the ULTIMATE AND FINAL SIMP. Think about it logically."
    , "A rizzler's last thoughts should be of Ohio."
    , "I can't tell you how much I love Azusa. I want to examine her eyes up close, comfort her delicate wings with all of my sanctity, run my fingers through her soft yet perfect-seeming hair. I want to caress her whole body, not leave every centimeter untouched, massage her sweet head, care for her cheeks, touch and admire her toes and fingers while protecting her sacred legs with all my strength and dignity. How I wish to have a single glimpse of holy Azusa before my death, and store that deep in my mind to revoke at the moment of life's end to depart in bliss. Every time I just think of Azusa, if I haven't averted the sight of this goddess, I am filled with eternal happiness and contentment in all ways, so that even in the most difficult times of my life I have a reason to keep going. Every night I lie on my Azusa body pillow, face crying with joy as I replay scenarios of how I would exchange words with holy Azusa. I dream of her with her hands in mine, sitting on a bank of our city's hill, hidden under the night starry sky, our faces close, her eyes closed as I reach for a tender, protective kiss. Every day I step out of my bed just for Azusa. Every day I can't think of anything but Azusa. Every day I live only for Azusa. Come into my care, into my arms, I will heal you, I will take care of you, I will guarantee to fight for you with all my willpower and vitality until my last breath. I love you Azusa!!"
    , `What the fuck did you just fucking say about me, you little perma-freshie? I'll have you know I graduated top of my class in the blade temple, and I've been involved in numerous secret raids on Duke Erisia’s manor, and I have over 300 confirmed grips. I am trained in primadon warfare and I'm the top sniper in the entire summer company. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on all five Luminants, mark my fucking words. You think you can get away with saying that shit to me over Deepwoken? Think again, fucker. As we speak I am contacting my secret network of Voidwalker spies across the Etrean Luminant and your spawn is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fuckng dead, kid. I can be anywhere, anytime, and I can grip you in over seven hundred ways, and that's just with Way of Navae. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the Central Authority and I will use it to its full extent to wipe your miserable ass off the face of the Luminant, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking wiped, kiddo.`
    , "My name is Guido Mista. I'm 44 years old. My house is in the southwest section of Naples, where all the slums are, and I have 4 wives. I work as a hitman for Passione, and I get home every day by 4:44 AM at the latest. I smoke 4 packs a day, and I always drink. I'm in bed by 4:44PM, and make sure I get 4 hours of sleep, no matter what. After having a glass of cold beer and doing about 44 minutes of stretches before going to bed, I usually have problems sleeping and I stay up until morning. Just like an elderly, I wake up with fatigue and stress in the morning. I was told there were issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care seek trouble with enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me sadness. Although, if I were to fight I would lose to everyone."
    , "Honor among thieves is honor under the seas!"
    , "sniff sniff i-is that a BOY I smell? sniff sniff mmm yes I smell it! BOYSMELL!!!! I smell a boy! W-What is a boy doing here?!?! omygosh what am I gonna do?!?! THERE'S A BOY HERE! I'M FREAKING OUT SO MUCH!!!! calm down calm down and take a nice, deep breathe... sniff sniff it smells so good! I love boysmell so much!!!! It makes me feel so amazing. I'm getting tingles all over from the delicious boyscent! It's driving me boyCRAZY!!!!!!"
    , "When you're on a chicken bender grab a box of chicken tenders, bawk ba gawk!"
    , "I don't care what your pronouns are if you spill foundation secrets, consider yourself was/were."
    , "While he lacked the vocabulary to frame it in modern scientific terms, the man who is credited with the concept that matters composed of atoms from a cosmological perspective is also known as the father of alchemy and creator of toxicology, Paracelsus, or Philippus Aureolus Theophrastus Bombastus von Hohenheim."
    , "Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki! Totsugeki!"
    , "I am so tired of peeing. I drink the water, which I apparently need to live or something, and then I have to go put the water somewhere else 5 minutes later. I drink the water, I go to a place to un-drink the water, I wash my hands, I leave, and then I have to drink more water. Guess where that water ends up? Not in me! I give the water to my body and like a child it tosses it out and demands more. All hours of the day, all hours of the night no matter what I'm doing my life is interrupted by piss fucking bullshit."
    , "Oh senpai, hey! I didn't know you walked this way. We're right in front of your house? I-I wasn't looking or anything, I just happened to be walking by! It'd be creepy to know where you live, s-stupid! What was I walking by for? OKAY! I had to give you something! L-listen, don't get the wrong idea, I was just up at 4 am cooking like schoolgirls do and it happened to be your favorite and I thought maybe you'd like some since I had extra! BE GRATEFUL! UGHHIUGH! Uhh, how did I know it was your favorite? Well I... aaaAAAAAAAHHH!"
    , "Nice opinion. Just one tiny problem with it. Inspecting your post, it looks like your opinion is different from mine. Boy, let me tell you something. I am the baseline for opinions, any opinion I hold is objectively correct and, as a result, any other opinions are wrong. And guess what? You happen to hold a wrong one. And I hope you know that your opinion is now illegal. I have now contacted the FBI, the CIA, the NSA, the Navy SEALs, the Secret Service and your mom. You'll rot in prison for the rest of your life over this, mark my words you'll be sorry you ever shared your opinions. By the time you're reading this, you're done for boy. Nature will punish you. Humanity will punish you. Supernatural beings will punish you. Space will punish you. Oh yeah, and we decided that just to make sure we'll nuke your house from orbit so there's no chance you can run away and everyone you know will die. It's a small price to pay to remove you're wrong opinion from this world."
    , `I bet these hetero's kiss girls General Gravicius grunts, his hips rapidly slamming his erect donger deep into Shadow's lean muscled frame. Sweat drips from his brow as he moans a quiet prayer before both nuts erupt, turning him into a fountain of cum, launching Shadow at least 5 meters onto the floor. Gravicius smirks at the sight, "I fuck for God, Exile. Who do you fuck for?`
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
    , "I was eating dinner at like a small little fold up table in the living room cuz im sick and dont wanna get everyone else sick and I was putting a water bottle cap back on and it got caught in one of my kinda loose bandaids and I went to get it out and it went flying then I went to pick it up but I tripped over one of the couch pillows that were on the ground and tried to grab onto the table for support and it fucking flipped over."
    , "Crazy? I was crazy once. They locked me in a shoebox. A shoebox on September. A shoebox on 21st September. And 21st September make me crazy. Crazy? I was crazy once."
];
const sentencesHorror = [
    "Hello",
    "Why don't you ever check under your bed for people like me?",
];
/* Dictionary template (need to manually put in ` and change \ -> \\)
/// Dictionary
    const allCharacters = `abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890(){}[]<>!?@#$%^&*~-_+|\\/=:;"',.`
        .split("");
    const convertedCharacters = `[CONVERTED CHARACTERS]`
        .split("");
    let string = "";
    let count = 0;
    for(let i in allCharacters){
        if(/27|53|63/.test(i)){
            count = 0;
            string += "\n";
        }else if((count % 4 === 0)){
            string += "\n";
        };
        count++;
        if(allCharacters[i] === "'"){
            string += `"${allCharacters[i]}": "${convertedCharacters[i]}", `;
        }else{
            string += `'${allCharacters[i]}': '${convertedCharacters[i]}', `;
        };
    };
    string += "'`': '[CONVERTED `]'";
    console.log(string);

/// Dictionary from
    const dictionary = DICTIONARY;
    let string = "";
    let count = 0;
    for(let i in dictionary){
        if(/27|53|63/.test(i)){
            count = 0;
            string += "\n";
        }else if((count % 4 === 0)){
            string += "\n";
        };
        count++;
        if(i === "'"){
            string += `"${dictionary[i]}": "${i}", `;
        }else{
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
    '=': '', ':': '', ';': '', '"': '',
    "'": '', ',': '', '.': '', '`': ''
*/
const uwuDictionary = {
    "this":  ["dis"],
    "the":   ["da", "tha"],
    "that":  ["dat"],
    "my":    ["mwie"],
    "have":  ["habe", "habve"],
    "epic":  ["ebic"],
    "worse": ["wose"],
    "you":   ["uwu", "u"],
    "of":    ["ob"],
    "love":  ["wuv"]
};
const uwuEmoticons = ["X3", ":3", "owo", "uwu", ">3<", "o3o"
    , "｡◕‿◕｡", "(o´ω｀o)", "(´･ω･`)", "=w="];
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
    '/': '⠌', "'": '⠄', '"': '⠐', '\\': '⠳',
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
    '⠌': '/', '⠄': "'", '⠐': '"', '⠳': '\\',
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
    "actually": ["&#x1F913;&#x261D;&#xFE0F;"],
    "hey":      ["&#x1F44B;"], "hello": ["&#x1F44B;"],
    "you":      ["&#x1F448;"], "your": ["&#x1F448;"],
    "like":     ["&#x1F44D;"], "liked": ["&#x1F44D;"],
    "money":    ["&#x1F4B0;"], "rich": ["&#x1F4B0;"],
    "run":      ["&#x1F3C3;"], "running": ["&#x1F3C3;"], "ran": ["&#x1F3C3;"],
    "house":    ["&#x1F3E0;", "&#x1F3E1;"], "home": ["&#x1F3E0;", "&#x1F3E1;"],
    "just":     ["&#x261D;&#xFE0F;"],
    "phone":    ["&#x1F4F1;"],
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
    "😭💢💢💢💢😭": "'", '💢💢😭😭💢💢': ',', '😭💢😭💢😭💢': '.', '😭😭💢💢💢💢': '`',
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
        ["These characters were too hard for Arona to encode...", 30],
        ["Sorry, Sensei... Arona made an oopsie...", 18],
        ["Senseiii... these characters are too hard to encode.", 24],
        ["Sorry, Sensei... I tried.", 10]
    ],
    decode: [
        ['Message decoded!', 12],
        ["I'll be here if you need to decode anything else.", 13],
        ["I wonder why &#128557; and &#128162; were used to decode these messages.", 24],
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
            ["I love strawberry milk!<br>Can I have some, Sensei?", 21]
        ],
        how_are_you: [
            [`I'm doing good!<br>I hope you are as well, ${window.username}!`, 32],
        ],
        goodnight: [
            ["Goodnight, Sensei...", 34],
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
            ["S-S-S-Se...!?", 17],
        ],
        sixty_nine: [
            ["Why does everybody say 69 is a nice number, Sensei?", 2],
        ],        
        /// First public cunny code message
        /// https://x.com/SethC1995/status/1839472034721456176
        first_message: [
            ['The first Cunny Code message was sent on September 26th, 2024 by Seth-sensei. It asked the question: "Do you know Cunny Code?"', 31],
        ],
        /// First person to crack the cunny code before the encoder/decoder was released
        /// https://x.com/Roxas13thXIII/status/1839909996383088696
        first_decoder: [
            ['The first person to decode Cunny Code before this tool was released was Haise-sensei on September 28th, 2024.<br>I heard he\'s a big fan of <img src="/resources/translator/cunny-code/kisaki-ball.png" style="height:40px; vertical-align:middle;" title="Kisaki" alt="Kisaki">!', 31],
        ],
        /// Emoji
        sob: [
            ["Why are you sobbing, Sensei?", 24],
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
            ["Yay! Arona is cute and funny!", 11],
        ],
        arona_breedable: [
            ["I-I-I-I am...?", 16],
        ],
        arona_best: [
            ["Aww... Thank you, Sensei!", 32],
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
            ["A-Am not!<br>I had a shower before you got here!", 18],
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
            ["You need to encode or decode something first before I can copy it to your clipboard.", 26]
        ]
    },
    /// Messages displayed upon idle (no encode/decode/help/typing/mouse movement)
    idle: [
        ['Are you still there, Sensei?', 2],
        ['Where did you go, Sensei?', 18],
        ["I guess Sensei fell asleep...", 10],
        ["I'm bored, Sensei...", 24],
        ["Hmm hmm hmm... &#127925;", 33],
        ["Lalala...! &#127926;", 13],
        ["Maybe Sensei left to buy me some more strawberry milk.", 23]
    ],
    idleSleep: [
        ['Me? Doze off? Never... Zzz...'],
        ['Zzz... Strawberry milk... Heeheehee...'],
        ["There's no way I can eat all that..."],
        ["Heehee... So yummy..."],
        ["Heeheehee..."],
        ["Zzz..."],
        ["Sensei, you're so..."],
        ["Sensei... So big..."],
        ["No, Sensei... You can't do that..."],
        ["Zzz... Sensei... Heehee..."]
    ],
    idleAwaken: [
        [`Welome back, ${window.username}!`, 11],
        ["Sensei! I've been waiting for you!", 12],
        ["Ah! Sensei! Did you bring me back anything yummy!?", 21],
        ["I was lonely without you, Sensei...", 24],
        ["Ah! I-I wasn't sleeping!<br>I was just resting my eyes!", 18],
    ],
    /// Messages when picking up Arona
    pickup: [
        ['Weeeeee!', 12],
        ['Higher, Sensei! Higher!', 12],
        ["Arona's flying!", 25],
        ["Wow! I can see so much from up here!", 25],
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
    "common": {
        "nothing": {
            descritpion: "Nothing..."
        },
        "gold": {
            type: "currency",
            description: "A bag containing a random amount of gold."
        },
        "Sensei Mask": {
            slot: "eyewear",
            type: "cosmetic",
            description: `Uohhhhhhhhh! \uD83D\uDE2D`,
            image: "/resources/items/senseimask.png",
            source: "Blue Archive"
        },
        "Carla's Hat": {
            slot: "helmet",
            type: "cosmetic",
            description: `\uD83D\uDE09\u270C`,
            image: "/resources/items/carlashat.png",
            source: "Don't Hurt Me, My Healer!"
        },
        "Nina's Good Luck Charm": {
            slot: "undershirt",
            type: "cosmetic",
            description: "I'm perfectly prepared. I am fully and completely ready for this.",
            image: "/resources/items/ninasgoodluckcharm.png",
            source: "Cautious Hero: The Hero Is Overpowered but Overly Cautious"
        },
        "Creamy": {
            slot: "undershirt",
            type: "cosmetic",
            description: "Lemon's good luck charm.",
            image: "/resources/items/creamy.png",
            source: "Mashle"
        },
    },
    /// Items with basic properties (stat increase/decrease)
    "rare": {
        "Creampuff": {
            slot: "hidden",
            type: "stat",
            stats: {
                health: 1
            },
            description: "Nothing like a cream puff after pumping iron.",
            image: "/resources/items/creampuff.png",
            source: "Mashle"
        },
        "Chunchunmaru": {
            slot: "main",
            type: "stat",
            stats: {
                luck: 99
            },
            description: "Yes, I'm Kazuma.",
            image: "/resources/items/chunchunmaru.png",
            source: "Konosuba"
        },
        "Seed": {
            slot: "consumable1",
            type: "stat",
            stats: {
                health: 1
            },
            description: "Exclusive drop from skeletons in Tululu.",
            image: "/resources/items/seed.png",
            source: "My Unique Skill Makes Me OP Even at Level 1"
        },
        "Mähne": {
            slot: "main",
            type: "stat",
            stats: {
                attack: 1
            },
            description: "Comprised of two large blades joined by a hilt with an extending holder.",
            image: "/resources/items/mahne.png",
            source: "Pumpkin Scissors"
        },
        "Belle Delphine's Bath Water": {
            slot: "consumable1",
            type: "stat",
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
            description: "...",
            image: "/resources/items/belledelphinesbathwater.png",
            source: "Meme"
        },
    },
    /// Items with unique properties (abilities)
    "exotic": {
        "Grass Block": {
            slot: "main",
            type: "ability",
            information: "Places a grass block",
            description: "C418 - Sweden",
            image: "/resources/items/grassblock.png",
            source: "Minecraft"
        },
        "Hestia Knife": {
            slot: "wrist",
            type: "ability",
            information: "Becomes stronger according to the wielder's status",
            description: "A special knife created by Hephaestus with help from Hestia.",
            requirement: "Member of Hestia Familia",
            image: "/resources/items/hestiaknife.png",
            source: "Danmachi"
        },
        "Code of Hammurabi": {
            slot: "offhand",
            type: "ability",
            information: "Redirects every attack against the user back to the attacker",
            description: "An eye for an eye, a tooth for a tooth.",
            image: "/resources/items/codeofhammurabi.png",
            source: "Tomb Raider King"
        },
        "Door Knocker": {
            slot: "main",
            type: "both",
            stats: {
                attack: 99,
                agility: -1
            },
            information: "Decreases the enemy morale",
            description: "Töten Sie. Töten Sie. Töten Sie.",
            requirement: "Must be at point blank range",
            image: "/resources/items/doorknocker.png",
            source: "Pumpkin Scissors"
        },
        "Necklace": {
            slot: "necklace",
            type: "ability",
            information: "Doubles item drops",
            description: "Hello... Yoda?",
            image: "/resources/items/necklace.png",
            source: "My Unique Skill Makes Me OP Even at Level 1"
        },
        "Bicorn Horns": {
            slot: "offhand",
            type: "ability",
            information: "Allows using level 1 magic with no limitations",
            description: "Magic: F",
            image: "/resources/items/bicornhorns.png",
            source: "My Unique Skill Makes Me OP Even at Level 1"
        },
        "Slime Tear": {
            slot: "offhand",
            type: "ability",
            information: "Reflects slime attacks",
            description: "Dead or carrot.",
            image: "/resources/items/slimetear.png",
            source: "My Unique Skill Makes Me OP Even at Level 1"
        },
    },
    /// Items for fun (modifies the application)
    "meme": {
        "Demon Lord's Ring": {
            slot: "ring",
            type: "ability",
            information: "Reflects all magic",
            description: "Most powerful accessory in Cross Reverie.",
            image: "/resources/items/demonlordsring.png",
            source: "How Not to Summon a Demon Lord"
        }
    }
};
const itemRates = {
    "common": {
        rate: .80
    },
    "rare": {
        rate: .15
    },
    "exotic": {
        rate: .04
    },
    "meme": {
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
//#endregion
const widgetsUtilityActive = [];
const widgetsGamesActive = [];
const widgetsFunActive = [];
var widgetsTextActive = [];
const operation = '-+/*%';
const punctuation = '\\[\\!\\"\\#\\$\\%\\&\\\'\\(\\)'
    + '\\*\\+\\,\\\\\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\['
    + '\\]\\^\\_\\`\\{\\|\\}\\~\\]';
const matchAll = new RegExp("\\s*(\\.{3}|\\w+\\-\\w+|\\w+'(?:\\w+)?|\\w+|[" + punctuation + "])");
//#region Select
const formatGroupLabel = (data) => (
    <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"}}>
        <span className="aesthetic-scale scale-self font transparent-bold">{data.label}</span>
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
var selectTheme = {};
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
        <div className="collapse-group-heading"
            onClick={() => {
                document.querySelector(`#${props.id}`)
                    .parentElement
                    .parentElement
                    .classList
                    .toggle("collapse-group");
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
        //             : { ...c, props: { ...c.props, className: "collapse-group" } }
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
class Widgets extends Component{
    constructor(props){
        super(props);
        this.state = {
            developer: false,
            values: {
                animation: {value: "default", label: "Default"},
                customBorder: {value: "default", label: "Default"},
                savePositionPopout: false,
                authorNames: false,
                fullscreen: false,
                resetPosition: false,
                shadow: false,
                voice: {value: "0", label: "David"},
                pitch: 0,
                rate: 0,
                health: {value: "default", label: "Default"},
                close: false,
                randomText: false,
                cursorTrail: false,
                cursorTrailColor: [0, 0, 0],
                cursorTrailFlat: false,
                cursorTrailMode: "default",
                cursorTrailThickness: 7,
                cursorTrailDuration: 0.7,
                horror: false,
                particle: {value: "default", label: "Default"},
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
                    quote: {
                        name: "Quote",
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
                        name: "Translator",
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
                        name: "Google Translator",
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
                        name: "Calculator",
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
                        name: "Weather",
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
                        name: "Time Conversion",
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
                        name: "Spreadsheet",
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    // notepad: {
                    //     name: "Notepad",
                    //     active: false,
                    //     position: {
                    //         x: 0,
                    //         y: 0
                    //     },
                    //     drag: {
                    //         disabled: false
                    //     }
                    // },
                    qrcode: {
                        name: "QR Code",
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
                        name: "Battery",
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
                        name: "Currency Converter",
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    // urlshortner: {
                    //     name: "URL Shortner",
                    //     active: false,
                    //     position: {
                    //         x: 0,
                    //         y: 0
                    //     },
                    //     drag: {
                    //         disabled: false
                    //     }
                    // },
                    imagecolorpicker: {
                        name: "Image Color Picker",
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
                        name: "Music Player",
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    animesearcher: {
                        name: "Anime Searcher",
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
                games: {
                    snake: {
                        name: "Snake",
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
                        name: "Typing Test",
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
                        name: "Simon Game",
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
                        name: "Minesweeper",
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    breakout: {
                        name: "Breakout",
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
                        name: "Chess",
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
                        name: "2048",
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
                        name: "Trivia",
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    tetris: {
                        name: "Tetris",
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
                        name: "Grindshot",
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
                        name: "Color Memory",
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
                    pokemonsearch: {
                        name: "Pokemon Search",
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
                        name: "Picker Wheel",
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    donutanimation: {
                        name: "Donut Animation",
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    aiimagegenerator: {
                        name: "Ai Image Generator",
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        popouts: {
                            prompthelp: {
                                position: {
                                    x: 0,
                                    y: 0
                                }
                            }
                        },
                        drag: {
                            disabled: false
                        }
                    },
                    sticker: {
                        name: "Sticker",
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
                        name: "Facts",
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
                    name: "",
                    rarity: ""
                },
                helmet: {
                    name: "",
                    rarity: ""
                },
                eyewear: {
                    name: "",
                    rarity: ""
                },
                necklace: {
                    name: "",
                    rarity: ""
                },
                undershirt: {
                    name: "",
                    rarity: ""
                },
                chestplate: {
                    name: "",
                    rarity: ""
                },
                cape: {
                    name: "",
                    rarity: ""
                },
                bracelet: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                wrist: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                belt: {
                    name: "",
                    rarity: ""
                },
                main: {
                    name: "",
                    rarity: ""
                },
                glove: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                ring: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                legging: {
                    name: "",
                    rarity: ""
                },
                offhand: {
                    name: "",
                    rarity: ""
                },
                hidden: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                boot: {
                    left: {
                        name: "",
                        rarity: ""
                    },
                    right: {
                        name: "",
                        rarity: ""
                    }
                },
                test: {name: ""},
                consumable1: {
                    name: "",
                    rarity: ""
                },
                consumable2: {
                    name: "",
                    rarity: ""
                },
                consumable3: {
                    name: "",
                    rarity: ""
                },
                consumable4: {
                    name: "",
                    rarity: ""
                },
                consumable5: {
                    name: "",
                    rarity: ""
                },
                consumable6: {
                    name: "",
                    rarity: ""
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
    };
    randomColor(forcedColorR, forcedColorG, forcedColorB){
        const r = document.documentElement;
        var randColorOpacity, randColor, randColorLight;
        if(forcedColorR){
            randColorOpacity = `${forcedColorR},${forcedColorG},${forcedColorB}`;
            randColor = `rgb(${randColorOpacity})`;
            randColorLight = `rgb(${forcedColorR + 50},${forcedColorG + 50},${forcedColorB + 50})`;
        }else{
            const colorR = Math.floor(Math.random() * colorRange);
            const colorG = Math.floor(Math.random() * colorRange);
            const colorB = Math.floor(Math.random() * colorRange);
            randColorOpacity = `${colorR},${colorG},${colorB}`;
            randColor = `rgb(${randColorOpacity})`;
            randColorLight = `rgb(${colorR + 50},${colorG + 50},${colorB + 50})`;
        };
        r.style.setProperty("--randColor", randColor);
        r.style.setProperty("--randColorLight", randColorLight);
        r.style.setProperty("--randColorOpacity", randColorOpacity);
        color = randColor;
        colorLight = randColorLight;
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
    handleShowHide(what, where){
        if(this.state.widgets[where][what].active === false){
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
                let elementSelects = e.querySelectorAll(".select-match");
                widgetsTextActive = [...document.querySelectorAll(".text-animation")];
                /// Show react-selects
                for(let i of elementSelects){
                    i.style.display = "block";
                };
                /// Add animation if it exists
                if(this.state.values.animation.value !== "default"){
                    e.style.animation = "none";
                    window.requestAnimationFrame(() => {
                        switch(this.state.values.animation.value){
                            case "rendering":
                                e.style.clipPath = "inset(0 0 100% 0)";
                                e.style.animation = this.state.values.animation.value + "In 2s steps(11)";
                                break;
                            default:
                                e.style.animation = this.state.values.animation.value + "In 2s";
                                break;
                        };
                    });
                    e.addEventListener("animationend", (event) => {
                        switch(this.state.values.animation.value){
                            case "rendering":
                                e.style.clipPath = "unset";
                                break;
                            default:
                                break;
                        };
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
            let e = document.getElementById(`${what}-widget-animation`);
            let elementSelects = e.querySelectorAll(".select-match");
            e.style.visibility = "hidden";
            if(this.state.values.animation.value !== "default"){
                e.style.animation = "none";
                window.requestAnimationFrame(() => {
                    switch(this.state.values.animation.value){
                        case "rendering":
                            e.style.clipPath = "inset(0 0 100% 0)";
                            e.style.animation = this.state.values.animation.value + "Out 2s steps(11)";
                            break;
                        default:
                            e.style.animation = this.state.values.animation.value + "Out 2s";
                            break;
                    };
                });
                e.addEventListener("animationend", (event) => {
                    if(event.animationName.slice(event.animationName.length - 3) === "Out"){
                        switch(this.state.values.animation.value){
                            case "rendering":
                                e.style.clipPath = "unset";
                                break;
                            default:
                                break;
                        };
                        /// Hide react-selects (prevents flashing)
                        for(let i of elementSelects){
                            i.style.display = "none";
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
                            widgetsTextActive = [...document.querySelectorAll(".text-animation")];
                        });
                    };
                });
            }else{
                /// Hide react-selects (prevents flashing)
                for(let i of elementSelects){
                    i.style.display = "none";
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
                    widgetsTextActive = [...document.querySelectorAll(".text-animation")];
                });
            };
        };
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    handleShowHidePopout(popout, visible, button, inverse){
        if(visible){
            let elementSelects = popout.querySelectorAll(".select-match");
            for(let i of elementSelects){
                i.style.display = "block";
            };
            if(button !== undefined){
                if(inverse){
                    button.style.color = "rgba(var(--randColorOpacity), 1)";
                }else{
                    button.style.opacity = "1";
                };
            };
            popout.style.visibility = "visible";
            if(this.state.values.animation.value !== "default"){
                popout.style.animation = "none";
                window.requestAnimationFrame(() => {
                    switch(this.state.values.animation.value){
                        case "rendering":
                            popout.style.clipPath = "inset(0 0 100% 0)";
                            popout.style.animation = this.state.values.animation.value + "In 2s steps(11)";
                            break;
                        default:
                            popout.style.animation = this.state.values.animation.value + "In 2s";
                            break;
                    };
                });
                popout.addEventListener("animationend", (event) => {
                    switch(this.state.values.animation.value){
                        case "rendering":
                            popout.style.clipPath = "unset";
                            break;
                        default:
                            break;
                    };
                });
            };
        }else{
            let elementSelects = popout.querySelectorAll(".select-match");
            if(button !== undefined){
                if(inverse){
                    button.style.color = "rgba(var(--randColorOpacity), 0.2)";
                }else{
                    button.style.opacity = "0.5";
                };
            };
            popout.style.visibility = "hidden";
            if(this.state.values.animation.value !== "default"){
                popout.style.animation = "none";
                window.requestAnimationFrame(() => {
                    switch(this.state.values.animation.value){
                        case "rendering":
                            popout.style.clipPath = "inset(0 0 100% 0)";
                            popout.style.animation = this.state.values.animation.value + "Out 2s steps(11)";
                            break;
                        default:
                            popout.style.animation = this.state.values.animation.value + "Out 2s";
                            break;
                    };
                });
                popout.addEventListener("animationend", (event) => {
                    if(event.animationName.slice(event.animationName.length - 3) === "Out"){
                        switch(this.state.values.animation.value){
                            case "rendering":
                                popout.style.clipPath = "unset";
                                break;
                            default:
                                break;
                        };
                        /// Hide react-selects (prevents flashing)
                        for(let i of elementSelects){
                            i.style.display = "none";
                        };
                    };
                });
            }else{
                for(let i of elementSelects){
                    i.style.display = "none";
                };    
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
            case "close":
                this.handleShowHide(element, where);
                window.dispatchEvent(new CustomEvent("close", {
                    "detail": {
                        element: element,
                        type: where
                    }
                }));
                break;
            default:
                break;
        };
    };
    handleMouseMove(event){
        window.mouse = {
            x: event.clientX,
            y: event.clientY
        };
    };
    updateStickers(mutateType, stickerName, stickerImage){
        switch(mutateType){
            case "add":
                this.setState({
                    stickers: [...this.state.stickers, stickerName, stickerImage]
                });        
                break;
            case "remove":
                let indexRemove = this.state.stickers.indexOf(stickerName);
                if(indexRemove === 0){
                    this.setState({
                        stickers: [...this.state.stickers.slice(2)]
                    });
                }else{
                    this.setState({
                        stickers: [...this.state.stickers.slice(0, indexRemove), ...this.state.stickers.slice(indexRemove + 2)]
                    });
                };
                break;
            default:
                this.setState({
                    stickers: []
                });
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
    updateCustomBorder(what, value){
        let widget, popout, widgetAll;
        if(what !== undefined && what !== ""){
            widget = document.getElementById(what + "-widget-animation");
            popout = widget.querySelectorAll(".popout-animation");
            widgetAll = [widget, ...popout];
        }else{
            widget = document.querySelectorAll(".widget-animation");
            popout = document.querySelectorAll(".popout-animation");
            widgetAll = [...widget, ...popout];
        };
        if(value !== undefined){
            for(const element of widgetAll){
                element.classList.remove(`border-${this.state.values.customBorder.value}`);
                element.classList.add(`border-${value.value}`);
            };
        }else{
            for(const element of widgetAll){
                element.classList.add(`border-${this.state.values.customBorder.value}`);
            };
        };
    };
    updateValue(value, what, type){
        switch(what){
            case "customBorder":
                this.updateCustomBorder("", value);
                break;
            case "health":
                healthDisplay = value;
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
            if(this.state.values.randomText && (what === "randomText")){
                this.randomTimeoutText();
            }else if(!this.state.values.randomText){
                timeoutText = clearTimeout(timeoutText);
            };
            if(this.state.values.horror){
                this.randomTimeoutHorror();
            }else if(!this.state.values.horror){
                intervalHorror = clearInterval(intervalHorror);
            };
        });
    };
    randomTimeoutText(){
        if(this.state.values.randomText && (timeoutText === undefined)){
            let randomNumber = Math.random() * 60000 + 5000;
            timeoutText = setTimeout(() => {
                this.randomTextAnimation();
                timeoutText = undefined;
                this.randomTimeoutText();
            }, randomNumber);
        };
    };
    randomTextAnimation(){
        if(widgetsTextActive.length > 0){
            let randomTextAnimation = textAnimations[Math.floor(Math.random() * textAnimations.length)];
            let elementRandomText = widgetsTextActive[Math.floor(Math.random() * widgetsTextActive.length)];
            elementRandomText.style.animation = "none";
            window.requestAnimationFrame(() => {
                elementRandomText.style.animation = randomTextAnimation; 
            });
        };
    };
    randomTimeoutHorror(){
        /// Creating a shadow image
        // let randomNumber = Math.random() * 1200000 + 300000;
        let randomNumber = Math.random() * 10000;
        let elementShadow = document.createElement("img");
        elementShadow.src = "/resources/singles/guy.png";
        let elementContainer = document.getElementById("widget-container");
        let elementContainerSize = elementContainer.getBoundingClientRect();
        elementShadow.onload = () => {
            elementShadow.style.filter = "brightness(0%)";
            elementShadow.style.maxHeight = "256px";
            elementShadow.style.position = "absolute";
        };
        intervalHorror = setInterval(() => {
            /// Displays a shadow outside of the screen that peaks its head
            elementContainer.appendChild(elementShadow);
            let sides = ["top", "right", "bottom", "left"];
            let randomSide = sides[Math.floor(Math.random() * sides.length)];
            let realWidth = 256 * (elementShadow.naturalWidth / elementShadow.naturalHeight);
            if(/left|right/.test(randomSide)){
                let randomY = Math.random() * (elementContainerSize.height - 256);
                elementShadow.style.top = `${randomY}px`;
                elementShadow.style[randomSide] = `-${realWidth}px`;
            }else{
                if(randomSide === "top"){
                    elementShadow.style.transform = "scale(-1)";
                };
                let randomX = Math.random() * (elementContainerSize.width - realWidth);
                elementShadow.style.left = `${randomX}px`;
                elementShadow.style[randomSide] = "-256px";
            };
            window.requestAnimationFrame(() => {
                elementShadow.style.animation = `characterPeak${randomSide.replace(/^./, char => char.toUpperCase())} 4s`;
                elementShadow.onanimationend = () => {
                    elementContainer.removeChild(elementShadow);
                };
            });
            /// Changes text to a random horror message
            let elementsText = document.getElementsByClassName("text-animation");
            if(elementsText.length !== 0){
                let randomElementText = elementsText[Math.floor(Math.random() * elementsText.length)];
                let randomSentenceHorror = sentencesHorror[Math.floor(Math.random() * sentencesHorror.length)];
                randomElementText.innerText = randomSentenceHorror;
            };
        }, randomNumber);
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
    addGoldBag(event){
        this.setState({
            gold: this.state.gold + event.detail
        });
    };
    addItem(event){
        this.setState({
            inventory: [...this.state.inventory, ...event.detail]
        });
    };
    equipItem(event){
        const itemData = {
            "name": event.detail.name,
            "rarity": event.detail.rarity
        };
        let newEquipment;
        if(event.detail.side){
            if(this.state.equipment[event.detail.slot][event.detail.side].name !== event.detail.name
                && this.state.equipment[event.detail.slot][event.detail.side].name === ""){
                newEquipment = {
                    ...this.state.equipment,
                    [event.detail.slot]: {
                        ...this.state.equipment[event.detail.slot],
                        [event.detail.side]: {
                            ...itemData
                        } 
                    }
                };
                this.updateGameValue("equipment", newEquipment);
                let item = items[itemData.rarity][itemData.name];
                if(item.type === "stat" || item.type === "both"){
                    let itemStats = Object.keys(item.stats);
                    let newStats = {};
                    for(let i in itemStats){
                        newStats[itemStats[i]] = item.stats[itemStats[i]] + this.state.stats[itemStats[i]];
                    };
                    this.updateGameValue("stats", newStats);
                };
                if(item.type === "ability" || item.type === "both"){
                    let newAbilities = [...this.state.abilities, item.information];
                    this.updateGameValue("abilities", newAbilities);
                };
            };
        }else{
            if(this.state.equipment[event.detail.slot].name !== event.detail.name
                && this.state.equipment[event.detail.slot].name === ""){
                newEquipment = {
                    ...this.state.equipment,
                    [event.detail.slot]: {
                        ...itemData
                    }
                };
                this.updateGameValue("equipment", newEquipment);
                let item = items[itemData.rarity][itemData.name];
                if(item.type === "stat" || item.type === "both"){
                    let itemStats = Object.keys(item.stats);
                    let newStats = {};
                    for(let i in itemStats){
                        newStats[itemStats[i]] = item.stats[itemStats[i]] + this.state.stats[itemStats[i]];
                    };
                    this.updateGameValue("stats", newStats);
                };
                if(item.type === "ability" || item.type === "both"){
                    let newAbilities = [...this.state.abilities, item.information];
                    this.updateGameValue("abilities", newAbilities);
                };
            };
        };
    };
    updateGameValue(what, value){
        switch(what){
            case "equipment":
                this.setState({
                    equipment: value
                });        
                break;
            case "gold":
                this.setState({
                    gold: this.state.gold + value
                });        
                break;
            case "exp":
                this.setState({
                    stats: {
                        ...this.state.stats,
                        exp: this.state.stats.exp + value
                    }
                }, () => {
                    if(this.state.stats.exp >= this.state.stats.maxExp){
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
            case "stats":
                this.setState({
                    stats: {
                        ...this.state.stats,
                        ...value
                    }
                });        
                break;
            case "abilities":
                this.setState({
                    abilities: [...value]
                });        
                break;
            default:
                break;
        };
    };
    calculateMaxExp(){
        const equationMaxExp = this.state.stats.level * 100 * 1.25;
        this.setState({
            stats: {
                ...this.state.stats,
                maxExp: equationMaxExp
            }
        });
    };
    talk(text){
        if(text !== ""){
            if(speechSynthesis.speaking){
                speechSynthesis.cancel();
            }else{
                let utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = voices[this.state.values.voice.value];
                utterance.pitch = this.state.values.pitch;
                utterance.rate = this.state.values.rate;
                speechSynthesis.speak(utterance);
            };
        };
    };
    updateGlobalValue(what, value){
        switch(what){
            case "hour":
                currentHour = value;
                break;
            default:
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
                if(i === "setting"){
                    data["utility"]["setting"] = {
                        ...data["utility"]["setting"],
                        values: {        
                            ...data["utility"]["setting"]["values"],
                            ...this.state.values
                        }
                    };
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
        }else{
            /// First load
            for(let i in this.state.widgets.utility){
                data.utility[i] = {
                    active: false,
                    position: this.state.widgets.utility[i].position
                };
                if(this.state.values.savePositionPopout){
                    data.utility[i].popouts = this.state.widgets.utility[i].popouts;
                };
                if(i === "setting"){
                    data["utility"]["setting"] = {
                        ...data["utility"]["setting"],
                        values: {
                            ...this.state.values,
                            close: true
                        }
                    };
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
            const widgetDates = ["facts", "animesearcher"];
            let objectWidgetDates = {};
            for(let i of widgetDates){
                objectWidgetDates[i] = new Date().getDate();
            };
            localStorage.setItem("date", JSON.stringify(objectWidgetDates));
        };
        localStorage.setItem("widgets", JSON.stringify(data));
        localStorage.setItem("gold", this.state.gold);
        localStorage.setItem("inventory", JSON.stringify(this.state.inventory));
        localStorage.setItem("equipment", JSON.stringify(this.state.equipment));
        localStorage.setItem("stats", JSON.stringify(this.state.stats));
        localStorage.setItem("abilities", JSON.stringify(this.state.abilities));
    };
    componentDidMount(){
        this.randomColor();
        window.addEventListener("beforeunload", this.storeData);
        window.addEventListener("new item", this.addItem);
        window.addEventListener("gold bag", this.addGoldBag);
        window.addEventListener("equip item", this.equipItem);
        /// Load widget's data from local storage
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            let widgetsUtility = {};
            for(let i in dataLocalStorage.utility){
                widgetsUtility[i] = {
                    ...this.state.widgets.utility[i],
                    ...dataLocalStorage.utility[i]
                };
                if(dataLocalStorage.utility[i].active){
                    this.updateWidgetsActive(i, "utility");
                };
                /// For specific widgets that have unique state values
                let localStorageValues = dataLocalStorage["utility"]["setting"]["values"];
                switch(i){
                    case "setting":
                        let objectValues = {};
                        for(let i in this.state.values){
                            objectValues[i] = localStorageValues[i];
                        };
                        this.setState({
                            values: {
                                ...objectValues
                            }
                        }, () => {
                            if(this.state.values.shadow === true){
                                this.updateDesign("shadow", true);
                            };
                            if(this.state.values.randomText){
                                this.randomTimeoutText();
                            };
                            if(this.state.values.horror){
                                this.randomTimeoutHorror();
                            };
                        });
                        /// Setting global variables
                        healthDisplay = localStorageValues["health"];
                        break;
                    default:
                        break;
                };
            };
            let widgetsGames = {};
            for(let i in dataLocalStorage.games){
                widgetsGames[i] = {
                    ...this.state.widgets.games[i],
                    ...dataLocalStorage.games[i]
                };
                if(dataLocalStorage.games[i].active){
                    this.updateWidgetsActive(i, "games");
                };
            };
            let widgetsFun = {};
            for(let i in dataLocalStorage.fun){
                widgetsFun[i] = {
                    ...this.state.widgets.fun[i],
                    ...dataLocalStorage.fun[i]
                };
                if(dataLocalStorage.fun[i].active){
                    this.updateWidgetsActive(i, "fun");
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
                widgetsTextActive = [...document.querySelectorAll(".text-animation")];
            });
        }else{
            this.storeData();
        };
        if(localStorage.getItem("inventory") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("inventory"));
            this.setState({
                inventory: [...dataLocalStorage]
            });
        };
        if(localStorage.getItem("equipment") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("equipment"));
            this.setState({
                equipment: {
                    ...this.state.equipment,
                    ...dataLocalStorage
                }
            });
        };
        if(localStorage.getItem("gold") !== null){
            this.setState({
                gold: JSON.parse(localStorage.getItem("gold"))
            });
        };
        if(localStorage.getItem("stats") !== null){
            let dataLocalStorageStats = JSON.parse(localStorage.getItem("stats"));
            this.setState({
                stats: {
                    ...dataLocalStorageStats
                }
            }, () => {
                if(this.state.stats.maxExp === 0){
                    this.calculateMaxExp();
                };
            });
        };
        if(localStorage.getItem("abilities") !== null){
            let dataLocalStorageAbilities = JSON.parse(localStorage.getItem("abilities"));
            this.setState({
                abilities: [...dataLocalStorageAbilities]
            });
        };
        if(localStorage.getItem("name") !== null){
            name = JSON.parse(localStorage.getItem("name"));
        };
        /// Load voices
        voices = window.speechSynthesis.getVoices();
        speechSynthesis.addEventListener("voiceschanged", () => {
            voices = window.speechSynthesis.getVoices();
        }, { once: true });
    };
    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.storeData);
        window.removeEventListener("new item", this.addItem);
        window.removeEventListener("gold bag", this.addGoldBag);
        window.removeEventListener("equip item", this.equipItem);
        clearTimeout(timeoutText);
        clearInterval(intervalHorror);
    };
    render(){
        const defaultProps = {
            dragStart: dragStart,
            dragStop: dragStop,
            updatePosition: this.updatePosition,
            handleHotbar: this.handleHotbar,
            showHidePopout: this.handleShowHidePopout,
            values: {
                authorNames: this.state.values.authorNames
            },
            hotbar: {
                fullscreen: this.state.values.fullscreen,
                resetPosition: this.state.values.resetPosition,
                close: this.state.values.close
            },
            playAudio: playAudio
        };
        const gameProps = {
            gold: this.state.gold,
            stats: this.state.stats,
            updateGameValue: this.updateGameValue,
            formatNumber: formatNumber,
            randomItem: randomItem,
            renderHearts: renderHearts,
            healthDisplay: this.state.values.health.value
        };
        let widgets = {};
        let widgetActiveVariables = {};
        for(let widgetType of Object.keys(this.state.widgets)){
            for(let widget of Object.keys(this.state.widgets[widgetType])){
                switch(widget){
                    case "setting":
                    case "inventory":
                    case "equipment":
                    case "character":
                        break;
                    default: 
                        widgets[widgetType] = {
                            ...widgets[widgetType],
                            [widget]: this.state.widgets[widgetType][widget].name
                        };
                        break;
                };
                if(widget !== "setting"){
                    widgetActiveVariables[widget] = this.state.widgets[widgetType][widget].active;
                };
            };
        };
        return(
            <div id="widget-container"
                onMouseMove={(event) => this.handleMouseMove(event)}>
                {/* Cursor */}
                {(this.state.values.cursorTrail)
                    ? <Cursor color={this.state.values.cursorTrailColor}
                        flat={this.state.values.cursorTrailFlat}
                        mode={this.state.values.cursorTrailMode}
                        thickness={this.state.values.cursorTrailThickness}
                        duration={this.state.values.cursorTrailDuration}/>
                    : <></>}
                <Particle choice={this.state.values.particle}
                    mute={this.state.values.particleMute}/>
                {/* For copying to clipboard */}
                <pre id="clipboard-dump"></pre>
                {/* For Developers */}
                {(this.state.developer)
                    ? <section style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "absolute",
                        bottom: 0,
                        right: 0}}>
                        <button onClick={() => {
                            console.log(currentHour);
                        }}>Current Hour</button>
                        <button onClick={() => {
                            randomItem(1, "exotic");}}>
                            Add item: exotic
                        </button>
                        <button onClick={() => {
                            randomItem(1, "meme");}}>
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
                    </section>
                    : <></>}
                {/* Widgets: Special */}
                {
                    //#region
                }
                <WidgetSetting
                    widgets={widgets}
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
                    microIcon={microIcon}
                    smallMedIcon={smallMedIcon}/>
                {this.state.widgets.utility.inventory.active === true
                    ? <WidgetInventory
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.utility.inventory.position.x,
                            y: this.state.widgets.utility.inventory.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.inventory.drag.disabled}
                        inventory={this.state.inventory}
                        items={items}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.equipment.active === true
                    ? <WidgetEquipment
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.utility.equipment.position.x,
                            y: this.state.widgets.utility.equipment.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.equipment.drag.disabled}
                        updateGameValue={this.updateGameValue}
                        equipment={this.state.equipment}
                        items={items}
                        stats={this.state.stats}
                        abilities={this.state.abilities}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.character.active === true
                    ? <WidgetCharacter
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.character.position.x,
                            y: this.state.widgets.utility.character.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.character.drag.disabled}
                        punctuation={punctuation}
                        equipment={this.state.equipment}
                        largeIcon={largeIcon}/>
                    : <></>}
                {
                    //#endregion
                }
                {/* Widgets: Utility */}
                {
                    //#region
                }
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
                        talk={this.talk}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.translator.active === true
                    ? <WidgetTranslator
                        defaultProps={defaultProps}
                        randomColor={this.randomColor}
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
                        smallIcon={smallIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.googletranslator.active === true
                    ? <WidgetGoogleTranslator
                        defaultProps={defaultProps}
                        randomColor={this.randomColor}
                        copyToClipboard={copyToClipboard}
                        randSentence={randSentence}
                        position={{
                            x: this.state.widgets.utility.googletranslator.position.x,
                            y: this.state.widgets.utility.googletranslator.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.googletranslator.drag.disabled}
                        languages={languages}
                        talk={this.talk}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        menuListScrollbar={menuListScrollbar}
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
                        smallMedIcon={smallMedIcon}
                        medIcon={medIcon}
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
                        menuListScrollbar={menuListScrollbar}
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
                        formatGroupLabel={formatGroupLabel}
                        selectStyleSmall={selectStyleSmall}
                        selectTheme={selectTheme}
                        smallMedIcon={smallMedIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {/* {this.state.widgets.utility.notepad.active
                    ? <WidgetNotepad
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.notepad.position.x,
                            y: this.state.widgets.utility.notepad.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.notepad.drag.disabled}
                        formatGroupLabel={formatGroupLabel}
                        selectStyleSmall={selectStyleSmall}
                        selectTheme={selectTheme}
                        smallMedIcon={smallMedIcon}
                        largeIcon={largeIcon}/>
                    : <></>} */}
                {this.state.widgets.utility.qrcode.active
                    ? <WidgetQRCode
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.qrcode.position.x,
                            y: this.state.widgets.utility.qrcode.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.qrcode.drag.disabled}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        smallMedIcon={smallMedIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.battery.active
                    ? <WidgetBattery
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.battery.position.x,
                            y: this.state.widgets.utility.battery.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.battery.drag.disabled}
                        smallMedIcon={smallMedIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.currencyconverter.active
                    ? <WidgetCurrencyConverter
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.currencyconverter.position.x,
                            y: this.state.widgets.utility.currencyconverter.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.currencyconverter.drag.disabled}
                        moneyConversions={moneyConversions}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        menuListScrollbar={menuListScrollbar}
                        randomColor={this.randomColor}
                        largeIcon={largeIcon}/>
                    : <></>}
                {/* {this.state.widgets.utility.urlshortner.active
                    ? <WidgetURLShortner
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.urlshortner.position.x,
                            y: this.state.widgets.utility.urlshortner.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.urlshortner.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>} */}
                {this.state.widgets.utility.imagecolorpicker.active
                    ? <WidgetImageColorPicker
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.imagecolorpicker.position.x,
                            y: this.state.widgets.utility.imagecolorpicker.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.imagecolorpicker.drag.disabled}
                        copyToClipboard={copyToClipboard}
                        randomColor={this.randomColor}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.musicplayer.active
                    ? <WidgetMusicPlayer
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.musicplayer.position.x,
                            y: this.state.widgets.utility.musicplayer.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.musicplayer.drag.disabled}
                        copyToClipboard={copyToClipboard}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.utility.animesearcher.active
                    ? <WidgetAnimeSearcher
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.utility.animesearcher.position.x,
                            y: this.state.widgets.utility.animesearcher.position.y
                        }}
                        dragDisabled={this.state.widgets.utility.animesearcher.drag.disabled}
                        copyToClipboard={copyToClipboard}
                        largeIcon={largeIcon}/>
                    : <></>}
                {
                    //#endregion
                }
                {/* Widgets: Games */}
                {
                    //#region
                }
                {this.state.widgets.games.snake.active === true
                    ? <WidgetSnake
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.snake.position.x,
                            y: this.state.widgets.games.snake.position.y
                        }}
                        dragDisabled={this.state.widgets.games.snake.drag.disabled}
                        foodTypes={foodTypes}
                        debris={debrisPatterns}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.typingtest.active === true
                    ? <WidgetTypingTest
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.typingtest.position.x,
                            y: this.state.widgets.games.typingtest.position.y
                        }}
                        dragDisabled={this.state.widgets.games.typingtest.drag.disabled}
                        randSentence={randSentence}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.simongame.active === true
                    ? <WidgetSimonGame
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.simongame.position.x,
                            y: this.state.widgets.games.simongame.position.y
                        }}
                        dragDisabled={this.state.widgets.games.simongame.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.minesweeper.active === true
                    ? <WidgetMinesweeper
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.minesweeper.position.x,
                            y: this.state.widgets.games.minesweeper.position.y
                        }}
                        dragDisabled={this.state.widgets.games.minesweeper.drag.disabled}
                        smallIcon={smallIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.breakout.active === true
                    ? <WidgetBreakout
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.breakout.position.x,
                            y: this.state.widgets.games.breakout.position.y
                        }}
                        dragDisabled={this.state.widgets.games.breakout.drag.disabled}
                        patterns={breakoutPatterns}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.chess.active === true
                    ? <WidgetChess
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.chess.position.x,
                            y: this.state.widgets.games.chess.position.y
                        }}
                        dragDisabled={this.state.widgets.games.chess.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.twentyfortyeight.active === true
                    ? <Widget2048
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.twentyfortyeight.position.x,
                            y: this.state.widgets.games.twentyfortyeight.position.y
                        }}
                        dragDisabled={this.state.widgets.games.twentyfortyeight.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.trivia.active === true
                    ? <WidgetTrivia
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.trivia.position.x,
                            y: this.state.widgets.games.trivia.position.y
                        }}
                        dragDisabled={this.state.widgets.games.trivia.drag.disabled}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        sortSelect={sortSelect}
                        menuListScrollbar={menuListScrollbar}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.tetris.active === true
                    ? <WidgetTetris
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.tetris.position.x,
                            y: this.state.widgets.games.tetris.position.y
                        }}
                        dragDisabled={this.state.widgets.games.tetris.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.grindshot.active === true
                    ? <WidgetGrindshot
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.grindshot.position.x,
                            y: this.state.widgets.games.grindshot.position.y
                        }}
                        dragDisabled={this.state.widgets.games.grindshot.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.games.colormemory.active === true
                    ? <WidgetColorMemory
                        defaultProps={defaultProps}
                        gameProps={gameProps}
                        position={{
                            x: this.state.widgets.games.colormemory.position.x,
                            y: this.state.widgets.games.colormemory.position.y
                        }}
                        dragDisabled={this.state.widgets.games.colormemory.drag.disabled}
                        hexToRgb={hexToRgb}
                        randomColor={this.randomColor}
                        largeIcon={largeIcon}/>
                    : <></>}
                { 
                    //#endregion
                }
                {/* Widgets: Fun */}
                {
                    //#region
                }
                {this.state.widgets.fun.pokemonsearch.active === true
                    ? <WidgetPokemonSearch
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.fun.pokemonsearch.position.x,
                            y: this.state.widgets.fun.pokemonsearch.position.y
                        }}
                        dragDisabled={this.state.widgets.fun.pokemonsearch.drag.disabled}
                        microIcon={microIcon}
                        smallMedIcon={smallMedIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.fun.pickerwheel.active === true
                    ? <WidgetPickerWheel
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.fun.pickerwheel.position.x,
                            y: this.state.widgets.fun.pickerwheel.position.y
                        }}
                        dragDisabled={this.state.widgets.fun.pickerwheel.drag.disabled}
                        color={color}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.fun.donutanimation.active === true
                    ? <WidgetDonutAnimation
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.fun.donutanimation.position.x,
                            y: this.state.widgets.fun.donutanimation.position.y
                        }}
                        dragDisabled={this.state.widgets.fun.donutanimation.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.fun.aiimagegenerator.active === true
                    ? <WidgetAiImageGenerator
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.fun.aiimagegenerator.position.x,
                            y: this.state.widgets.fun.aiimagegenerator.position.y
                        }}
                        positionPopout={{
                            prompthelp: {
                                x: this.state.widgets.fun.aiimagegenerator.popouts.prompthelp.position.x,
                                y: this.state.widgets.fun.aiimagegenerator.popouts.prompthelp.position.y
                            }
                        }}
                        dragDisabled={this.state.widgets.fun.aiimagegenerator.drag.disabled}
                        formatGroupLabel={formatGroupLabel}
                        selectTheme={selectTheme}
                        menuListScrollbar={menuListScrollbar}
                        smallIcon={smallIcon}
                        smallMedIcon={smallMedIcon}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.fun.sticker.active === true
                    ? <WidgetSticker
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.fun.sticker.position.x,
                            y: this.state.widgets.fun.sticker.position.y
                        }}
                        dragDisabled={this.state.widgets.fun.sticker.drag.disabled}
                        stickers={this.state.stickers}
                        updateStickers={this.updateStickers}
                        largeIcon={largeIcon}/>
                    : <></>}
                {this.state.widgets.fun.facts.active === true
                    ? <WidgetFacts
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.fun.facts.position.x,
                            y: this.state.widgets.fun.facts.position.y
                        }}
                        dragDisabled={this.state.widgets.fun.facts.drag.disabled}
                        largeIcon={largeIcon}/>
                    : <></>}
                {
                    //#endregion
                }
            </div>
        );
    };
};
//#region Widget template
// import { React, Component, memo } from 'react';
// import { FaGripHorizontal } from 'react-icons/fa';
// import { FaExpand, Fa0 } from 'react-icons/fa6';
// import { IoClose } from 'react-icons/io5';
// import { IconContext } from 'react-icons';
// import Draggable from 'react-draggable';

// class Widget[] extends Component{
//     render(){
//         return(
//             <Draggable
//                 position={{
//                     x: this.props.position.x,
//                     y: this.props.position.y}}
//                 disabled={this.props.dragDisabled}
//                 onStart={() => this.props.defaultProps.dragStart("[]")}
//                 onStop={(event, data) => {
//                     this.props.defaultProps.dragStop("[]");
//                     this.props.defaultProps.updatePosition("[]", "[WIDGET TYPE]", data.x, data.y);
//                 }}
//                 cancel=""
//                 bounds="parent">
//                 <div id="[]-widget"
//                     className="widget">
//                     <div id="[]-widget-animation"
//                         className="widget-animation">
//                         {/* Drag Handle */}
//                         <span id="[]-widget-draggable"
//                             className="draggable">
//                             <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
//                                 <FaGripHorizontal/>
//                             </IconContext.Provider>
//                         </span>
//                         {/* Hotbar */}
//                         <section className="hotbar">
//                             {/* Reset Position */}
//                             {(this.props.defaultProps.hotbar.resetPosition)
//                                 ? <button className="button-match inverse when-elements-are-not-straight"
//                                     onClick={() => this.props.defaultProps.handleHotbar("[]", "resetPosition", "[WIDGET TYPE]")}>
//                                     <Fa0/>
//                                 </button>
//                                 : <></>}
//                             {/* Fullscreen */}
//                             {(this.props.defaultProps.hotbar.fullscreen)
//                                 ? <button className="button-match inverse when-elements-are-not-straight"
//                                     onClick={() => this.props.defaultProps.handleHotbar("[]", "fullscreen", "[WIDGET TYPE]")}>
//                                     <FaExpand/>
//                                 </button>
//                                 : <></>}
//                             {/* Close */}
//                             {(this.props.defaultProps.hotbar.close)
//                                 ? <button className="button-match inverse when-elements-are-not-straight"
//                                     onClick={() => this.props.defaultProps.handleHotbar("[]", "close", "[WIDGET TYPE]")}>
//                                     <IoClose/>
//                                 </button>
//                                 : <></>}
//                         </section>
//                         {/* Author */}
//                         {(this.props.defaultProps.values.authorNames)
//                             ? <span className="font smaller transparent-normal author-name">Created by [AUTHOR NAME]</span>
//                             : <></>}
//                     </div>
//                 </div>
//             </Draggable>
//         );
//     };
// };
//#endregion


//////////////////// Render to page ////////////////////
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <div id="Base">
        <div id="App"
            className="background-default">
            <Widgets/>
        </div>
    </div>
);