import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { Fa0, FaExpand, FaMinus, FaPlus, FaRegCirclePause, FaRegCirclePlay } from 'react-icons/fa6';
import { IoClose, IoPlayBack, IoPlayForward } from 'react-icons/io5';
import ReactPlayer from 'react-player/lazy';


/// Variables
const audio = new Audio();
let timeoutAnimationRemove;
let timeoutAnimationPrevious;
let timeoutAnimationNext;


class WidgetMusicPlayer extends Component{
    constructor(props){
        super(props);
        this.state = {
            music: [],
            urls: [
                {
                    name: "Origin | Original by Kilia Kurayami",
                    artist: "Kilia Kurayami Ch. 【EIEN Project",
                    url: "https://www.youtube.com/watch?v=7Rb5fxeqVxs"
                },
                {
                    name: "Asian Hideout - ERROR 403: paradise x paradigm",
                    artist: "Asian Hideout",
                    url: "https://www.youtube.com/watch?v=ymxBpO5U2KY"
                },
                {
                    name: "We are cool【轟はじめ/古石ビジュー】",
                    artist: "おだまよ",
                    url: "https://www.youtube.com/watch?v=70PIxN3XM5k"
                },
                {
                    name: "【MV】ABOVE BELOW【hololive English -Justice- Debut Song】",
                    artist: "hololive English",
                    url: "https://www.youtube.com/watch?v=ilLEj-SCCn8"
                },
            ],
            name: "",
            artist: "",
            currentDuration: "00:00",
            maxDuration: "00:00",
            rawMaxDuration: 0,
            widthProgress: 0,
            playing: false,
            songIndex: 0,
            autoplay: false,
            url: null,
            playerDisplay: "none",
            discSwitch: false
        };
        this.ended = this.ended.bind(this);
        this.clearMusic = this.clearMusic.bind(this);
        this.loadMusic = this.loadMusic.bind(this);
        this.updateDuration = this.updateDuration.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    ended(){
        this.setState({
            currentDuration: "00:00",
            maxDuration: "00:00"
        });
        this.loadMusic();
    };
    handleButton(type){
        let combineArrays = [...this.state.music, ...this.state.urls];
        /// Default is next song
        switch(type){
            case "remove":
                if(combineArrays.length !== 0){
                    let findIndexMusic = this.state.music.findIndex((object) => object.name === this.state.name);
                    let copyArrayMusic = [...this.state.music];
                    if(findIndexMusic !== -1){
                        if(findIndexMusic === 0){
                            copyArrayMusic = [...copyArrayMusic.slice(1)];
                        }else{
                            copyArrayMusic = [...copyArrayMusic.slice(0, findIndexMusic), ...copyArrayMusic.slice(findIndexMusic + 1)];
                        };
                        this.setState({
                            music: [...copyArrayMusic]
                        }, () => {
                            if(this.state.music.length !== 0){
                                if(findIndexMusic !== this.state.music.length){
                                    this.loadMusic(findIndexMusic);
                                }else{
                                    this.loadMusic(0);
                                };
                            }else{
                                this.clearMusic();
                            };
                        });
                    };
                    let findIndexUrls = this.state.urls.findIndex((object) => object.name === this.state.name);
                    let copyArrayUrls = [...this.state.urls];
                    if(findIndexUrls !== -1){
                        if(findIndexUrls === 0){
                            copyArrayUrls = [...copyArrayUrls.slice(1)];
                        }else{
                            copyArrayUrls = [...copyArrayUrls.slice(0, findIndexUrls), ...copyArrayUrls.slice(findIndexUrls + 1)];
                        };
                        this.setState({
                            urls: [...copyArrayUrls]
                        }, () => {
                            if(this.state.urls.length !== 0){
                                if(findIndexUrls !== this.state.urls.length){
                                    this.loadMusic(findIndexUrls);
                                }else{
                                    this.loadMusic(0);
                                };
                            }else{
                                this.clearMusic();
                            };
                        });
                    };
                    let elementDetails = document.getElementById("musicplayer-details");
                    elementDetails.classList.add("musicplayer-animation-remove-details");
                    timeoutAnimationRemove = setTimeout(() => {
                        elementDetails.classList.remove("musicplayer-animation-remove-details");
                    }, 300);
                };
                break;
            case "add":
                document.getElementById("musicplayer-input-add")
                    .classList.add("musicplayer-animation-input-add");
                break;
            case "previous":
                if(combineArrays.length > 1){
                    let musicIndex = ((this.state.songIndex - 1) < 0)
                        ? combineArrays.length - 1
                        : this.state.songIndex - 1;
                    this.loadMusic(musicIndex);
                    let elementButtonPrevious = document.getElementById("musicplayer-button-previous");
                    elementButtonPrevious.classList.add("musicplayer-animation-button-previous");
                    timeoutAnimationPrevious = setTimeout(() => {
                        elementButtonPrevious.classList.remove("musicplayer-animation-button-previous");
                    }, 300);
                };
                break;
            default:
                if(combineArrays.length > 1){
                    let musicIndex = ((this.state.songIndex + 1) > combineArrays.length - 1)
                            ? 0
                            : this.state.songIndex + 1;
                    this.loadMusic(musicIndex);
                    let elementButtonPrevious = document.getElementById("musicplayer-button-next");
                    elementButtonPrevious.classList.add("musicplayer-animation-button-next");
                    timeoutAnimationNext = setTimeout(() => {
                        elementButtonPrevious.classList.remove("musicplayer-animation-button-next");
                    }, 300);
                };
                break;
        };
    };
    clearMusic(){
        this.setState({
            name: "",
            artist: "",
            currentDuration: "00:00",
            maxDuration: "00:00",
            rawMaxDuration: 0,
            widthProgress: 0,
            playing: false,
            songIndex: 0,
            autoplay: false,
            url: null,
            playerDisplay: "none"
        });
    };
    loadMusic(music){
        let combineArrays = [...this.state.music, ...this.state.urls];
        let musicIndex = (music !== undefined)
            ? music
            : Math.floor(Math.random() * combineArrays.length);
        let randomMusic = combineArrays[musicIndex];
        if(randomMusic.url){
            if(randomMusic.name){
                this.setState({
                    name: randomMusic.name,
                    artist: randomMusic.artist
                });
            }else{
                this.fetchURLData(randomMusic.url);
            };
            this.setState({
                currentDuration: "00:00",
                maxDuration: "00:00",
                widthProgress: 0,    
                songIndex: musicIndex,
                url: randomMusic.url,
                playerDisplay: "block"
            });
            audio.pause();
            document.getElementById("musicplayer-disc")
                .style.animation = "none";
        }else{
            this.setState({
                name: randomMusic.name,
                artist: randomMusic.artist,
                songIndex: musicIndex,
                playerDisplay: "none"
            });
            /// Audio
            audio.src = randomMusic.song;
            audio.autoplay = this.state.autoplay;
            audio.onloadedmetadata = () => {
                this.setMaxDuration();
            };
            /// Image
            let musicDisc = document.getElementById("musicplayer-disc");
            musicDisc.style.backgroundImage = `url(${process.env.PUBLIC_URL}${randomMusic.cover})`;
            if(this.state.playing){
                window.requestAnimationFrame(() => {
                    document.getElementById("musicplayer-disc")
                        .style.animation = "rotateDisk 5s linear 0s infinite forwards";    
                });
            };
        };
    };
    async fetchURLData(URL){
        try{
            const url = `https://noembed.com/embed?dataType=json&url=${URL}`;
            const result = await fetch(url);
            const data = await result.json();
            this.setState({
                urls: [...this.state.urls.slice(0, -1), {
                    name: data.title,
                    artist: data.author_name,
                    url: URL    
                }],
                name: data.title,
                artist: data.author_name
            });
        }catch(err){
            console.error(err);
        };
    };
    toggleMusic(){
        let combineArrays = [...this.state.music, ...this.state.urls];
        if(combineArrays.length !== 0){
            this.setState({
                playing: !this.state.playing,
                autoplay: !this.state.autoplay
            }, () => {
                if(this.state.playerDisplay === "none"){
                    if(this.state.playing){
                        audio.play();
                        window.requestAnimationFrame(() => {
                            document.getElementById("musicplayer-disc")
                                .style.animation = "rotateDisk 5s linear 0s infinite forwards";    
                        });
                    }else{
                        audio.pause();
                        document.getElementById("musicplayer-disc")
                            .style.animation = "none";
                    };
                };
            });
            let elementButtonPlay = document.getElementById("musicplayer-button-clone-play");
            elementButtonPlay.style.animation = "none";
            window.requestAnimationFrame(() => {
                elementButtonPlay.style.animation = "pulse 0.8s";
            });
        };
    };
    updateDuration(event){
        let minutes, seconds, progress;
        if(event.playedSeconds){
            minutes = Math.floor(event.playedSeconds / 60);
            seconds = Math.floor(event.playedSeconds % 60);
            progress = (event.playedSeconds / this.state.rawMaxDuration) * 100;
        }else{
            minutes = Math.floor(audio.currentTime / 60);
            seconds = Math.floor(audio.currentTime % 60);
            progress = (audio.currentTime / audio.duration) * 100;
        };
        if(minutes < 10){
            minutes = `0${minutes}`;
        };
        if(seconds < 10){
            seconds = `0${seconds}`;
        };
        this.setState({
            currentDuration: `${minutes}:${seconds}`,
            widthProgress: progress
        });
    };
    setMaxDuration(event){
        let minutes, seconds;
        if(event){
            minutes = Math.floor(event / 60);
            seconds = Math.floor(event % 60);
            this.setState({
                rawMaxDuration: event
            });
        }else{
            minutes = Math.floor(audio.duration / 60);
            seconds = Math.floor(audio.duration % 60);
        };
        if(minutes < 10){
            minutes = `0${minutes}`;
        };
        if(seconds < 10){
            seconds = `0${seconds}`;
        };
        this.setState({
            maxDuration: `${minutes}:${seconds}`
        });
    };
    discSwitch(){
        let elementDisc = document.getElementById("musicplayer-disc");
        let elementPlayer = document.getElementById("musicplayer-player");
        this.setState({
            discSwitch: !this.state.discSwitch
        }, () => {
            if(this.state.discSwitch){
                elementDisc.style.height = "11.8em";
                elementDisc.style.width = "21em";
                elementDisc.style.borderRadius = "25px";
                elementDisc.style.top = "-0.4em";
                elementDisc.style.left = "-9.5em";
                elementPlayer.style.top = "-4.6em";
                elementPlayer.style.left = "0";
            }else{
                elementDisc.style.height = "11.5em";
                elementDisc.style.width = "11.5em";
                elementDisc.style.borderRadius = "50%";
                elementDisc.style.top = "0";
                elementDisc.style.left = "0";
                elementPlayer.style.top = "-78px";
                elementPlayer.style.left = "-78px";
            };
        });
    };
    handleInputSubmit(event){
        /// Enter key
        if((event.keyCode === 13)
            && (/(?:https:\/\/)?(?:www\.)?(youtube|soundcloud)\.com/.test(event.target.value))){
            document.getElementById("musicplayer-input-add")
                .classList.remove("musicplayer-animation-input-add");
            this.setState({
                urls: [...this.state.urls, {
                    url: event.target.value
                }]
            }, () => {
                this.loadMusic([...this.state.music, ...this.state.urls].length - 1);
            });
            document.getElementById("musicplayer-input-add")
                .value = "";
            let elementDetails = document.getElementById("musicplayer-details");
            elementDetails.classList.add("musicplayer-animation-add-details");
            timeoutAnimationRemove = setTimeout(() => {
                elementDetails.classList.remove("musicplayer-animation-add-details");
            }, 400);
        };
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["utility"]["musicplayer"] = {
                ...dataLocalStorage["utility"]["musicplayer"],
                urls: [...this.state.urls]
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    componentDidMount(){
        window.addEventListener("beforeunload", this.storeData);
        audio.addEventListener("ended", this.ended);
        audio.addEventListener("timeupdate", this.updateDuration);
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            let dataMusicPlayer = dataLocalStorage["utility"]["musicplayer"];
            if(dataMusicPlayer["urls"] !== undefined){
                this.setState({
                    urls: [...dataMusicPlayer["urls"]]
                }, () => {
                    if(this.state.urls.length !== 0){
                        this.loadMusic();
                    };
                });
            }else{
                this.loadMusic();
            };
        };
    };
    componentWillUnmount(){
        if(!audio.paused){
            audio.pause();
        };
        this.storeData();
        window.removeEventListener("beforeunload", this.storeData);
        audio.removeEventListener("ended", this.ended);
        audio.removeEventListener("timeupdate", this.updateDuration);
        clearTimeout(timeoutAnimationRemove);
        clearTimeout(timeoutAnimationNext);
        clearTimeout(timeoutAnimationPrevious);
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("musicplayer")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("musicplayer");
                    this.props.defaultProps.updatePosition("musicplayer", "utility", data.x, data.y);
                }}
                cancel="button, span, input, #musicplayer-disc"
                bounds="parent">
                <div id="musicplayer-widget"
                    className="widget">
                    <div id="musicplayer-widget-animation"
                        className="widget-animation custom-shape">
                        {/* Drag Handle */}
                        <span id="musicplayer-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section id="musicplayer-hotbar"
                            className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("musicplayer", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("musicplayer", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("musicplayer", "close", "utility")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
                        {/* Song */}
                        <section className="flex-center column">
                            {/* Song Disc */}
                            <div id="musicplayer-disc"
                                className="circle no-highlight"
                                onClick={() => this.discSwitch()}>
                                <ReactPlayer id="musicplayer-player"
                                    url={this.state.url}
                                    playing={this.state.playing && this.state.playerDisplay === "block"}
                                    height={"21em"}
                                    width={"21em"}
                                    onDuration={(event) => this.setMaxDuration(event)}
                                    onProgress={(event) => this.updateDuration(event)}
                                    onEnded={this.ended}
                                    onReady={() => {}}
                                    style={{
                                        display: this.state.playerDisplay
                                    }}
                                    config={{
                                        youtube: {
                                            playerVars: {
                                                fs: 0,
                                                rel: 0
                                            },
                                        }
                                    }}/>
                            </div>
                            {/* Song Information */}
                            <div id="musicplayer-details"
                                className="no-highlight flex-center column gap small-gap only-justify-content">
                                <div className="flex-center column gap only-justify-content">
                                    <div id="musicplayer-name">
                                        <span className="text-animation font bold white large-medium"
                                            onClick={() => this.props.copyToClipboard(this.state.name)}>{this.state.name}</span>
                                    </div>
                                    <span id="musicplayer-author" 
                                        className="text-animation aesthetic-scale scale-self origin-left font white small"
                                        onClick={() => this.props.copyToClipboard(this.state.artist)}>{this.state.artist}</span>
                                </div>
                                <div>
                                    <div className="flex-center only-align-items progress-bar">
                                        <span style={{
                                            width: `${this.state.widthProgress}%`
                                        }}></span>
                                    </div>
                                    <div className="element-ends font small transparent-white">
                                        <span>{this.state.currentDuration}</span>
                                        <span>{this.state.maxDuration}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Song Controls */}
                            <div id="musicplayer-controls"
                                className="flex-center row gap">
                                <button id="musicplayer-remove" 
                                    className="button-match inverse disabled"
                                    onClick={() => this.handleButton("remove")}>
                                    <IconContext.Provider value={{ size: "1.3em", className: "global-class-name" }}>
                                        <FaMinus/>
                                    </IconContext.Provider>
                                </button>
                                <button id="musicplayer-button-previous"
                                    className="button-match inverse"
                                    onClick={() => this.handleButton("previous")}>
                                    <IconContext.Provider value={{ size: "4em", className: "global-class-name" }}>
                                        <IoPlayBack/>
                                    </IconContext.Provider>
                                </button>
                                <button id="musicplayer-button-play"
                                    className="button-match inverse"
                                    onClick={() => this.toggleMusic()}>
                                    {(this.state.playing)
                                        ? <IconContext.Provider value={{ size: "4.5em", className: "global-class-name" }}>
                                            <FaRegCirclePause/>
                                        </IconContext.Provider>
                                        : <IconContext.Provider value={{ size: "4.5em", className: "global-class-name" }}>
                                            <FaRegCirclePlay/>
                                        </IconContext.Provider>}
                                    <button id="musicplayer-button-clone-play"
                                        className="button-match inverse">
                                        {(this.state.playing)
                                            ? <IconContext.Provider value={{ size: "4.5em", className: "global-class-name" }}>
                                                <FaRegCirclePause/>
                                            </IconContext.Provider>
                                            : <IconContext.Provider value={{ size: "4.5em", className: "global-class-name" }}>
                                                <FaRegCirclePlay/>
                                            </IconContext.Provider>}
                                    </button>
                                </button>
                                <button id="musicplayer-button-next"
                                    className="button-match inverse"
                                    onClick={() => this.handleButton("next")}>
                                    <IconContext.Provider value={{ size: "4em", className: "global-class-name" }}>
                                        <IoPlayForward/>
                                    </IconContext.Provider>
                                </button>
                                <button id="musicplayer-add" 
                                    className="button-match inverse disabled"
                                    onClick={() => this.handleButton("add")}>
                                    <IconContext.Provider value={{ size: "1.3em", className: "global-class-name" }}>
                                        <FaPlus/>
                                    </IconContext.Provider>
                                </button>
                                <input id="musicplayer-input-add"
                                    className="input-match"
                                    onKeyDown={(event) => this.handleInputSubmit(event)}
                                    onBlur={() => {
                                        document.getElementById("musicplayer-input-add")
                                            .classList.remove("musicplayer-animation-input-add");
                                    }}
                                    autoComplete="off"
                                    type="text"
                                    name="musicplayer-input-add"/>
                            </div>
                        </section>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Me</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetMusicPlayer);