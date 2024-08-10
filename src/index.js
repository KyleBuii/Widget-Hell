import './index.scss';
import { React, Component } from 'react';
import ReactDOM from 'react-dom/client';
import WidgetSetting from './Widgets/Utility/Setting.js';
import WidgetQuote from './Widgets/Utility/Quote.js';
import WidgetTranslator from './Widgets/Utility/Translator.js';
import WidgetGoogleTranslator from './Widgets/Utility/GoogleTranslator.js';
import WidgetCalculator from './Widgets/Utility/Calculator.js';
import WidgetWeather from './Widgets/Utility/Weather.js';
import WidgetTimeConversion from './Widgets/Utility/TimeConversion.js';
import WidgetSpreadsheet from './Widgets/Utility/Spreadsheet.js';
import WidgetSnake from './Widgets/Games/Snake.js';
import WidgetTypingTest from './Widgets/Games/TypingTest.js';
import WidgetPokemonSearch from './Widgets/Fun/PokemonSearch.js';
import WidgetNotepad from './Widgets/Utility/Notepad.js';
import WidgetQRCode from './Widgets/Utility/QRCode.js';
import WidgetBattery from './Widgets/Utility/Battery.js';
import WidgetPickerWheel from './Widgets/Fun/PickerWheel.js';


//////////////////// Variables ////////////////////
/// Mutable
const microIcon = "0.6em";
const smallIcon = "0.88em";
const smallMedIcon = "1.2em";
const medIcon = "4em";
const largeIcon = "5em";
const zIndexDefault = 2;
const zIndexDrag = 5;
const colorRange = 200;
const tricks = ["spin", "flip", "hinge"];
const languages = ["Afrikaans", "af", "Albanian", "sq", "Amharic", "am", "Arabic", "ar", "Armenian", "hy", "Assamese", "as", "Azerbaijani (Latin)", "az", "Bangla", "bn", "Bashkir", "ba", "Basque", "eu", "Bosnian (Latin)", "bs", "Bulgarian", "bg", "Cantonese (Traditional)", "yue", "Catalan", "ca", "Chinese (Literary)", "lzh", "Chinese Simplified", "zh-Hans", "Chinese Traditional", "zh-Hant", "Croatian", "hr", "Czech", "cs", "Danish", "da", "Dari", "prs", "Divehi", "dv", "Dutch", "nl", "English", "en", "Estonian", "et", "Faroese", "fo", "Fijian", "fj", "Filipino", "fil", "Finnish", "fi", "French", "fr", "French (Canada)", "fr-ca", "Galician", "gl", "Georgian", "ka", "German", "de", "Greek", "el", "Gujarati", "gu", "Haitian Creole", "ht", "Hebrew", "he", "Hindi", "hi", "Hmong Daw (Latin)", "mww", "Hungarian", "hu", "Icelandic", "is", "Indonesian", "id", "Inuinnaqtun", "ikt", "Inuktitut", "iu", "Inuktitut (Latin)", "iu-Latn", "Irish", "ga", "Italian", "it", "Japanese", "ja", "Kannada", "kn", "Kazakh", "kk", "Khmer", "km", "Klingon", "tlh-Latn", "Klingon (plqaD)", "tlh-Piqd", "Korean", "ko", "Kurdish (Central)", "ku", "Kurdish (Northern)", "kmr", "Kyrgyz (Cyrillic)", "ky", "Lao", "lo", "Latvian", "lv", "Lithuanian", "lt", "Macedonian", "mk", "Malagasy", "mg", "Malay (Latin)", "ms", "Malayalam", "ml", "Maltese", "mt", "Maori", "mi", "Marathi", "mr", "Mongolian (Cyrillic)", "mn-Cyrl", "Mongolian (Traditional)", "mn-Mong", "Myanmar", "my", "Nepali", "ne", "Norwegian", "nb", "Odia", "or", "Pashto", "ps", "Persian", "fa", "Polish", "pl", "Portuguese (Brazil)", "pt", "Portuguese (Portugal)", "pt-pt", "Punjabi", "pa", "Queretaro Otomi", "otq", "Romanian", "ro", "Russian", "ru", "Samoan (Latin)", "sm", "Serbian (Cyrillic)", "sr-Cyrl", "Serbian (Latin)", "sr-Latn", "Slovak", "sk", "Slovenian", "sl", "Somali (Arabic)", "so", "Spanish", "es", "Swahili (Latin)", "sw", "Swedish", "sv", "Tahitian", "ty", "Tamil", "ta", "Tatar (Latin)", "tt", "Telugu", "te", "Thai", "th", "Tibetan", "bo", "Tigrinya", "ti", "Tongan", "to", "Turkish", "tr", "Turkmen (Latin)", "tk", "Ukrainian", "uk", "Upper Sorbian", "hsb", "Urdu", "ur", "Uyghur (Arabic)", "ug", "Uzbek (Latin)", "uz", "Vietnamese", "vi", "Welsh", "cy", "Yucatec Maya", "yua", "Zulu", "zu"];
const quotes = [
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
    {
        quote: "Yet it is far better to light the candle than to curse the darkness."
        , author: "W. L. Watkinson"
    }
];
const sentences = [
    "My mum (82F) told me (12M) to do the dishes (16) but I (12M) was too busy playing Fortnite (3 kills) so I (12M) grabbed my controller (DualShock 4) and threw it at her (138kph). She fucking died, and I (12M) went to prison (18 years). While in prison I (12M) incited several riots (3) and assumed leadership of a gang responsible for smuggling drugs (cocaine) into the country. I (12M) also ordered the assassination of several celebrities (Michael Jackson, Elvis Presley and Jeffrey Epstein) and planned a terrorist attack (9/11)."
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
    , "The tower of rebellion creeps upon man’s world... The unspoken faith displayed before me... The time has come! Now, awaken from your slumber, and by my madness, be wrought! Strike forth, Explosion!"    
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
    , "Hey guys, did you know that in terms of male human and female Pokemon breeding, Vaporeon is the most compatible Pokemon for humans? Not only are they in the field egg group, which is mostly comprised of mammals, Vaporeon are an average of 3”03’ tall and 63.9 pounds, this means they’re large enough to be able handle human dicks, and with their impressive Base Stats for HP and access to Acid Armor, you can be rough with one. Due to their mostly water based biology, there’s no doubt in my mind that an aroused Vaporeon would be incredibly wet, so wet that you could easily have sex with one for hours without getting sore. They can also learn the moves Attract, Baby-Doll Eyes, Captivate, Charm, and Tail Whip, along with not having fur to hide nipples, so it’d be incredibly easy for one to get you in the mood. With their abilities Water Absorb and Hydration, they can easily recover from fatigue with enough water. No other Pokemon comes close to this level of compatibility. Also, fun fact, if you pull out enough, you can make your Vaporeon turn white. Vaporeon is literally built for human dick. Ungodly defense stat+high HP pool+Acid Armor means it can take cock all day, all shapes and sizes and still come for more."
    , "Hey guys, did you know that in terms of human companionship, Flareon is objectively the most huggable Pokemon? While their maximum temperature is likely too much for most, they are capable of controlling it, so they can set themselves to the perfect temperature for you. Along with that, they have a lot of fluff, making them undeniably incredibly soft to touch. But that's not all, they have a very respectable special defense stat of 110, which means that they are likely very calm and resistant to emotional damage. Because of this, if you have a bad day, you can vent to it while hugging it, and it won't mind. It can make itself even more endearing with moves like Charm and Baby Doll Eyes, ensuring that you never have a prolonged bout of depression ever again."
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
    , "｡◕‿◕｡", "(o´ω｀o)", "(´･ω･`)", "=w="];
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
            return ["Default"].indexOf(b.label) - ["Default"].indexOf(a.label)
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
                shadow: false,
                voice: {},
                pitch: 0,
                rate: 0
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
                    },
                    notepad: {
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
                    pokemonsearch: {
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
                        active: false,
                        position: {
                            x: 0,
                            y: 0
                        },
                        drag: {
                            disabled: false
                        }
                    }
                }
            }
        };
        this.handleShowHide = this.handleShowHide.bind(this);
        this.handleShowHidePopout = this.handleShowHidePopout.bind(this);
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
                let e = document.getElementById(`${what}-widget-animation`);
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
            let e = document.getElementById(`${what}-widget-animation`);
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
        if(speechSynthesis.speaking){
            speechSynthesis.cancel();
        };
    };
    handleShowHidePopout(popout, visible, button, inverse){
        if(visible){
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
                    popout.style.animation = this.state.values.animation.value + "In 2s";
                });
            };
        }else{
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
                    popout.style.animation = this.state.values.animation.value + "Out 2s";
                });
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
        // switch(this.state.values.customBorder.value){
        //     case "diagonal":
        //         for(const element of widgetAll){
        //             element.style.border = "10px solid var(--randColor)";
        //             element.style.borderImage = `
        //                 repeating-linear-gradient(45deg,
        //                     transparent,
        //                     transparent 5px,
        //                     var(--randColor) 6px,
        //                     var(--randColor) 15px,
        //                     transparent 16px,
        //                     transparent 20px
        //                 ) 20/1rem`;
        //         };
        //         break;
        //     case "dashed":
        //         for(const element of widgetAll){
        //             element.style.border = "5px dashed var(--randColor)";
        //         };
        //         break;
        //     case "double":
        //         for(const element of widgetAll){
        //             element.style.border = "10px double var(--randColor)";
        //         };
        //         break;
        //     case "default":
        //         for(const element of widgetAll){
        //             element.style.border = "1px solid var(--randColor)";
        //             element.style.borderImage = "none"
        //         };
        //         break;
        //     default:
        //         break;
        // };
    };
    updateValue(what, where, type){
        if(where === "customBorder"){
            this.updateCustomBorder("", what);
        };
        this.setState(prevState => ({
            [type]: {
                ...prevState[type],
                [where]: what
            }
        }));
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
                    if(this.state.widgets.utility[i].active === true){
                        this.updateWidgetsActive(i, "utility");
                    };
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
                                shadow: localStorageValues["shadow"],
                                voice: localStorageValues["voice"],
                                pitch: localStorageValues["pitch"],
                                rate: localStorageValues["rate"]
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
                    if(this.state.widgets.games[i].active === true){
                        this.updateWidgetsActive(i, "games");
                    }; 
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
                    if(this.state.widgets.fun[i].active === true){
                        this.updateWidgetsActive(i, "fun");
                    };
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
            showHidePopout: this.handleShowHidePopout,
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
                        notepad: this.state.widgets.utility.notepad.active,
                        qrcode: this.state.widgets.utility.qrcode.active,
                        battery: this.state.widgets.utility.battery.active,
                        snake: this.state.widgets.games.snake.active,
                        typingtest: this.state.widgets.games.typingtest.active,
                        pokemonsearch: this.state.widgets.fun.pokemonsearch.active,
                        pickerwheel: this.state.widgets.fun.pickerwheel.active
                    }}
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
                {/* Widgets: Utility */}
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
                        voice={this.state.values.voice}
                        pitch={this.state.values.pitch}
                        rate={this.state.values.rate}
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
                        punctuation={punctuation}
                        voice={this.state.values.voice}
                        pitch={this.state.values.pitch}
                        rate={this.state.values.rate}
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
                        voice={this.state.values.voice}
                        pitch={this.state.values.pitch}
                        rate={this.state.values.rate}
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
                {this.state.widgets.utility.notepad.active
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
                    : <></>}
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
                {/* Widgets: Games */}
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
                {this.state.widgets.games.typingtest.active === true
                    ? <WidgetTypingTest
                        defaultProps={defaultProps}
                        position={{
                            x: this.state.widgets.games.typingtest.position.x,
                            y: this.state.widgets.games.typingtest.position.y
                        }}
                        dragDisabled={this.state.widgets.games.typingtest.drag.disabled}
                        randSentence={randSentence}
                        largeIcon={largeIcon}/>
                    : <></>}
                {/* Widgets: Fun */}
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
                        largeIcon={largeIcon}/>
                    : <></>}
            </div>
        );
    };
};
//#region Widget template
// import { React, Component } from 'react';
// import { FaGripHorizontal } from 'react-icons/fa';
// import { FaExpand, Fa0 } from 'react-icons/fa6';
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
//                 onStop={() => this.props.defaultProps.dragStop("[]")}
//                 onDrag={(event, data) => this.props.defaultProps.updatePosition("[]", "[WIDGET TYPE]", data.x, data.y)}
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
//                                 ? <button className="btn-match inverse when-elements-are-not-straight"
//                                     onClick={() => this.props.defaultProps.handleHotbar("[]", "resetPosition", "[WIDGET TYPE]")}>
//                                     <Fa0/>
//                                 </button>
//                                 : <></>}
//                             {/* Fullscreen */}
//                             {(this.props.defaultProps.hotbar.fullscreen)
//                                 ? <button className="btn-match inverse when-elements-are-not-straight"
//                                     onClick={() => this.props.defaultProps.handleHotbar("[]", "fullscreen", "[WIDGET TYPE]")}>
//                                     <FaExpand/>
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