import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaMinus, FaPlus, FaRegCirclePause, FaRegCirclePlay, FaShuffle } from 'react-icons/fa6';
import { IoPlayBack, IoPlayForward } from 'react-icons/io5';
import { RiPlayListFill } from "react-icons/ri";
import { VscClearAll } from "react-icons/vsc";
import ReactPlayer from 'react-player/lazy';
import SimpleBar from 'simplebar-react';


/// Variables
const audio = new Audio();
let timeoutAnimationRemove;
let timeoutAnimationPrevious;
let timeoutAnimationNext;
let timeoutPlaylistClear;
let urlsAdd = [];
let dataSongsAdd = [];
let activePlaylistItem = -1;
let seekedTime = -1;
let playedTimeSeek = 0;


class WidgetMusicPlayer extends Component{
    constructor(props){
        super(props);
        this.ref = player => {
            this.player = player;
        };
        this.state = {
            music: [],
            urls: [
                {
                    name: "Origin | Original by Kilia Kurayami",
                    artist: "Kilia Kurayami Ch. 【EIEN Project】",
                    url: "https://www.youtube.com/watch?v=7Rb5fxeqVxs",
                    timePlayed: 0
                },
                {
                    name: "Asian Hideout - ERROR 403: paradise x paradigm",
                    artist: "Asian Hideout",
                    url: "https://www.youtube.com/watch?v=ymxBpO5U2KY",
                    timePlayed: 0
                },
                {
                    name: "We are cool【轟はじめ/古石ビジュー】",
                    artist: "おだまよ",
                    url: "https://www.youtube.com/watch?v=70PIxN3XM5k",
                    timePlayed: 0
                },
                {
                    name: "【MV】ABOVE BELOW【hololive English -Justice- Debut Song】",
                    artist: "hololive English",
                    url: "https://www.youtube.com/watch?v=ilLEj-SCCn8",
                    timePlayed: 0
                },
            ],
            name: "",
            artist: "",
            currentDuration: "00:00",
            rawCurrentDuration: 0,
            maxDuration: "00:00",
            rawMaxDuration: 0,
            progress: 0,
            playing: false,
            songIndex: 0,
            autoplay: false,
            url: null,
            playerDisplay: "none",
            discSwitch: false,
            seeking: false,
            shuffle: false,
            ready: false,
            confirmClear: false
        };
        this.ended = this.ended.bind(this);
        this.clearMusic = this.clearMusic.bind(this);
        this.loadMusic = this.loadMusic.bind(this);
        this.updateDuration = this.updateDuration.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    ended(){
        this.saveDataMusic(this.state.name, this.state.rawMaxDuration);
        this.setState({
            currentDuration: "00:00",
            maxDuration: "00:00"
        });
        this.handleNextMusic();
        if(activePlaylistItem !== -1){
            activePlaylistItem.classList.remove("musicplayer-playlist-active");
            activePlaylistItem = -1;
        };
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
                if(this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name, this.state.rawCurrentDuration);
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
            case "shuffle":
                this.setState({
                    shuffle: !this.state.shuffle
                });
                const buttonShuffle = document.getElementById("musicplayer-button-shuffle");
                buttonShuffle.classList.toggle("disabled");
                break;
            case "playlist":
                const elementPlaylist = document.getElementById("musicplayer-playlist");
                elementPlaylist.classList.toggle("musicplayer-playlist-show");
                break;
            case "playlist-clear":
                const buttonPlaylistClear = document.getElementById("musicplayer-button-playlist-clear");
                if(buttonPlaylistClear.classList.contains("confirm-delete")){
                    this.setState({
                        urls: []
                    });
                    this.clearMusic();
                };
                buttonPlaylistClear.classList.toggle("confirm-delete");
                if(buttonPlaylistClear.classList.contains("confirm-delete")){
                    timeoutPlaylistClear = setTimeout(() => {
                        buttonPlaylistClear.classList.remove("confirm-delete");
                    }, 2000);
                };
                break;
            default:
                if(this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name, this.state.rawCurrentDuration);
                if(combineArrays.length > 1){
                    this.handleNextMusic();
                    let elementButtonPrevious = document.getElementById("musicplayer-button-next");
                    elementButtonPrevious.classList.add("musicplayer-animation-button-next");
                    timeoutAnimationNext = setTimeout(() => {
                        elementButtonPrevious.classList.remove("musicplayer-animation-button-next");
                    }, 300);
                };
                break;
        };
    };
    handleNextMusic(){
        if(this.state.shuffle){
            this.loadMusic();
        }else{
            let combineArrays = [...this.state.music, ...this.state.urls];
            if(combineArrays.length > 1){
                let musicIndex = ((this.state.songIndex + 1) > combineArrays.length - 1)
                    ? 0
                    : this.state.songIndex + 1;
                this.loadMusic(musicIndex);
            };
        };
    };
    clearMusic(){
        this.setState({
            name: "",
            artist: "",
            currentDuration: "00:00",
            maxDuration: "00:00",
            rawMaxDuration: 0,
            progress: 0,
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
                progress: 0,    
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
            musicDisc.style.backgroundImage = `url(${randomMusic.cover})`;
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
                    url: URL,
                    timePlayed: 0 
                }],
                name: data.title,
                artist: data.author_name
            });
        }catch(err){
            console.error(err);
        };
    };
    async fetchYoutubePlaylist(ID, pageToken = ""){
        try{
            document.getElementById("musicplayer-input-add")
                .classList.remove("musicplayer-animation-input-add");
            document.getElementById("musicplayer-input-add")
                .value = "";
            const result = await fetch(`/api/youtube?playlistId=${ID}&pageToken=${pageToken}`);
            const data = await result.json();
            data.items.forEach((item) => {
                urlsAdd.push({
                    name: item.snippet.title,
                    artist: item.snippet.videoOwnerChannelTitle,
                    url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                    timePlayed: 0
                });
            });
            if(data.nextPageToken){
                this.fetchYoutubePlaylist(ID, data.nextPageToken);
            }else{
                this.setState({
                    urls: [...this.state.urls, ...urlsAdd]
                }, () => {
                    this.loadMusic(Math.abs(this.state.urls.length - urlsAdd.length));
                });
            };
        }catch(err){
            console.error(err);
        }finally{
            this.animationInputAdd();
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
        if(!this.state.seeking){
            let minutes, seconds;
            if(event.playedSeconds){
                minutes = Math.floor(event.playedSeconds / 60);
                seconds = Math.floor(event.playedSeconds % 60);
            }else{
                minutes = Math.floor(audio.currentTime / 60);
                seconds = Math.floor(audio.currentTime % 60);
            };
            if(minutes < 10){
                minutes = `0${minutes}`;
            };
            if(seconds < 10){
                seconds = `0${seconds}`;
            };
            this.setState({
                currentDuration: `${minutes}:${seconds}`,
                rawCurrentDuration: event.playedSeconds,
                progress: event.played
            });
        };
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
            && (/(?:https:\/\/)?(?:www\.)?(youtu(be)?|soundcloud)\.(com|be)/.test(event.target.value))){
            if(/playlist/.test(event.target.value)){
                let playlistID = event.target.value.match(/(?:list=)(.*)/);
                this.fetchYoutubePlaylist(playlistID[1]);
            }else{
                /// Remove queries
                let cleanedUrl = (event.target.value).match(/(?:https:\/\/)?(?:www\.)?(youtu(be)?|soundcloud)\.(com|be).+?(?=[&]|\?[^v])/);
                this.setState({
                    urls: [...this.state.urls, {
                        url: (cleanedUrl) ? cleanedUrl[0] : event.target.value
                    }]
                }, () => {
                    if(this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name, this.state.rawCurrentDuration);
                    this.loadMusic([...this.state.music, ...this.state.urls].length - 1);
                    document.getElementById("musicplayer-input-add")
                        .classList.remove("musicplayer-animation-input-add");
                    document.getElementById("musicplayer-input-add")
                        .value = "";        
                    this.animationInputAdd();
                });
            };
        };
    };
    animationInputAdd(){
        let elementDetails = document.getElementById("musicplayer-details");
        elementDetails.classList.add("musicplayer-animation-add-details");
        timeoutAnimationRemove = setTimeout(() => {
            elementDetails.classList.remove("musicplayer-animation-add-details");
        }, 400);
    };
    handleSeeking({ event, what }){
        /// Default is onChange
        switch(what){
            case "down":
                this.setState({
                    seeking: true
                });        
                break;
            case "up":
                this.setState({
                    seeking: false
                });
                this.updateDuration();   
                this.player.seekTo(parseFloat(event.target.value));
                // if(seekedTime !== -1){
                //     playedTimeSeek = playedTimeSeek + (this.state.rawCurrentDuration - seekedTime);
                // };
                seekedTime = event.target.value * (this.state.rawMaxDuration - this.state.rawCurrentDuration);
                break;
            default:
                this.setState({
                    progress: parseFloat(event.target.value)
                });
                break;
        };
    };
    handlePlaylist(index, element){
        if(this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name, this.state.rawCurrentDuration);
        this.loadMusic(index);
        if(activePlaylistItem !== -1){
            activePlaylistItem.classList.remove("musicplayer-playlist-active");
        };
        activePlaylistItem = element.target;
        element.target.classList.add("musicplayer-playlist-active");
    };
    saveDataMusic(music, duration){
        let calculateTimePlayed;
        if(seekedTime !== -1){
            // calculateTimePlayed = playedTimeSeek + (this.state.rawMaxDuration - seekedTime);
            // playedTimeSeek = 0;
            calculateTimePlayed = this.state.rawMaxDuration - seekedTime;
            seekedTime = -1;
        }else{
            calculateTimePlayed = duration;   
        };
        let dataSong = dataSongsAdd.find((song) => song.name === music);
        if(dataSong !== undefined){
            dataSong = {
                ...dataSong,
                timePlayed: dataSong.timePlayed + calculateTimePlayed
            };
        }else{
            dataSongsAdd.push({
                name: music,
                timePlayed: calculateTimePlayed
            });
        };
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            if(this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name, this.state.rawCurrentDuration);
            const addTimePlayed = Object.values([...this.state.urls, ...dataSongsAdd].reduce((prev, curr) => {
                if(prev[curr.name]){
                    prev[curr.name].timePlayed += curr.timePlayed;
                }else{
                    prev[curr.name] = { ...curr };
                };
                return prev;
            }, {}));
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["utility"]["musicplayer"] = {
                ...dataLocalStorage["utility"]["musicplayer"],
                urls: [...addTimePlayed]
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
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("musicplayer")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("musicplayer");
                    this.props.defaultProps.updatePosition("musicplayer", "utility", data.x, data.y);
                }}
                cancel="button, span, input, #musicplayer-disc, #musicplayer-playlist"
                bounds="parent">
                <div id="musicplayer-widget"
                    className="widget">
                    <div id="musicplayer-widget-animation"
                        className="widget-animation custom-shape">
                        {/* Drag Handle */}
                        <span id="musicplayer-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("musicplayer", "utility")}
                        <section className="flex-center row">
                            {/* Song */}
                            <section className="flex-center column">
                                {/* Song Disc */}
                                <div id="musicplayer-disc"
                                    className="circle no-highlight"
                                    onClick={() => this.discSwitch()}>
                                    <ReactPlayer id="musicplayer-player"
                                        ref={this.ref}
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
                                        <input className="progress-bar"
                                            value={this.state.progress}
                                            type="range"
                                            min={0}
                                            max={0.999999}
                                            step={"any"}
                                            onMouseDown={() => this.handleSeeking({ what: "down" })}
                                            onTouchStart={() => this.handleSeeking({ what: "down" })}
                                            onChange={(event) => this.handleSeeking({ event: event })}
                                            onMouseUp={(event) => this.handleSeeking({ event: event, what: "up" })}
                                            onTouchEnd={(event) => this.handleSeeking({ event: event, what: "up" })}/>
                                        <div className="element-ends font small transparent-white"
                                            style={{
                                                marginTop: "0.1rem"
                                            }}>
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
                                        <div id="musicplayer-button-clone-play"
                                            className="button-match inverse">
                                            {(this.state.playing)
                                                ? <IconContext.Provider value={{ size: "4.5em", className: "global-class-name" }}>
                                                    <FaRegCirclePause/>
                                                </IconContext.Provider>
                                                : <IconContext.Provider value={{ size: "4.5em", className: "global-class-name" }}>
                                                    <FaRegCirclePlay/>
                                                </IconContext.Provider>}
                                        </div>
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
                                {/* Song Expanded Controls */}
                                <div id="musicplayer-controls-expanded">
                                    <button id="musicplayer-button-shuffle"
                                        className="button-match inverse disabled"
                                        onClick={() => this.handleButton("shuffle")}>
                                        <IconContext.Provider value={{ size: "1.3em", className: "global-class-name" }}>
                                            <FaShuffle/>
                                        </IconContext.Provider>
                                    </button>
                                    <button id="musicplayer-button-playlist"
                                        className="button-match inverse"
                                        onClick={() => this.handleButton("playlist")}>
                                        <IconContext.Provider value={{ size: "1.3em", className: "global-class-name" }}>
                                            <RiPlayListFill/>
                                        </IconContext.Provider>
                                    </button>
                                    <button id="musicplayer-button-playlist-clear"
                                        className="button-match inverse"
                                        onClick={() => this.handleButton("playlist-clear")}>
                                        <IconContext.Provider value={{ size: "1.3em", className: "global-class-name" }}>
                                            <VscClearAll/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </section>
                            <SimpleBar id="musicplayer-playlist"
                                style={{ maxHeight: "10em" }}>
                                {this.state.urls.map((url, index) => {
                                    return <section className="flex-center column align-items-left box no-highlight"
                                        onClick={(event) => this.handlePlaylist(index, event)}
                                        key={`playlist-item-${index}`}>
                                        <span>{url.name}</span>
                                        <span className="font transparent-normal">{url.artist}</span>
                                    </section>
                                })}
                            </SimpleBar>
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