import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaMinus, FaPlus, FaRegCirclePause, FaRegCirclePlay, FaShuffle } from 'react-icons/fa6';
import { IoPlayBack, IoPlayForward, IoStatsChart } from 'react-icons/io5';
import { RiPlayListFill } from 'react-icons/ri';
import { VscClearAll } from 'react-icons/vsc';
import ReactPlayer from 'react-player';
import SimpleBar from 'simplebar-react';
import { TbRepeat, TbRepeatOnce } from 'react-icons/tb';


const audio = new Audio();
let timeoutAnimationRemove, timeoutAnimationPrevious, timeoutAnimationNext, timeoutPlaylistClear, timeoutPlaylistPanel;
let urlsAdd = [];
let dataSongsAdd = [];
let dataSongsRemoved = [];
let activePlaylistItem = -1;
let previousPlaylistItem = 0;
let previousShuffleNextSong = -1;
let timePlayed = 0;
let unplayedSongsIndex = [];
let unplayedSongsMaxIndex = 0;
let totalTimesPlayed = 0;

class WidgetMusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.ref = player => {
            this.player = player;
        };
        this.state = {
            music: [],
            urls: [
                {
                    name: 'Origin | Original by Kilia Kurayami',
                    artist: 'Kilia Kurayami Ch. 【EIEN Project】',
                    url: 'https://www.youtube.com/watch?v=7Rb5fxeqVxs',
                    timePlayed: 0,
                    duration: 229,
                },
                {
                    name: 'Asian Hideout - ERROR 403: paradise x paradigm',
                    artist: 'Asian Hideout',
                    url: 'https://www.youtube.com/watch?v=ymxBpO5U2KY',
                    timePlayed: 0,
                    duration: 213,
                },
                {
                    name: 'We are cool【轟はじめ/古石ビジュー】',
                    artist: 'おだまよ',
                    url: 'https://www.youtube.com/watch?v=70PIxN3XM5k',
                    timePlayed: 0,
                    duration: 95,
                },
                {
                    name: '【MV】ABOVE BELOW【hololive English -Justice- Debut Song】',
                    artist: 'hololive English',
                    url: 'https://www.youtube.com/watch?v=ilLEj-SCCn8',
                    timePlayed: 0,
                    duration: 201,
                },
            ],
            name: '',
            artist: '',
            currentDuration: '00:00',
            rawCurrentDuration: 0,
            maxDuration: '00:00',
            rawMaxDuration: 0,
            progress: 0,
            playing: false,
            songIndex: 0,
            autoplay: false,
            url: null,
            playerVisibility: 'hidden',
            seeking: false,
            shuffle: false,
            ready: false,
            confirmClear: false,
            loop: false,
            loopOnce: false,
            statistics: {
                played: 0,
                time: {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                },
            },
        };
        this.ended = this.ended.bind(this);
        this.clearMusic = this.clearMusic.bind(this);
        this.loadMusic = this.loadMusic.bind(this);
        this.updateDuration = this.updateDuration.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    async fetchURLData(URL) {
        try {
            const url = `https://noembed.com/embed?dataType=json&url=${URL}`;
            const result = await fetch(url);
            const data = await result.json();
            this.setState({
                urls: [...this.state.urls.slice(0, -1), {
                    name: (!data.error) ? data.title : data.url,
                    artist: data.author_name,
                    url: URL,
                    timePlayed: 0 
                }],
                name: data.title,
                artist: data.author_name
            });
        } catch (err) {
            console.error(err);
        };
    };
    async fetchYoutubePlaylist(ID, pageToken = '') {
        try {
            document.getElementById('musicplayer-input-add').classList.remove('musicplayer-animation-input-add');
            document.getElementById('musicplayer-input-add').value = '';
            const result = await fetch(`/api/youtube?playlistId=${ID}&pageToken=${pageToken}`);
            const data = await result.json();
            let itemUrl;
            data.forEach((item) => {
                itemUrl = `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`;
                urlsAdd.push({
                    name: (/\bDeleted video\b|\bPrivate video\b/.test(item.snippet.title)) ? itemUrl : item.snippet.title,
                    artist: item.snippet.videoOwnerChannelTitle,
                    url: itemUrl,
                    timePlayed: 0,
                    duration: item.duration,
                });
            });
            if (data.nextPageToken) {
                this.fetchYoutubePlaylist(ID, data.nextPageToken);
            } else {
                this.setState({
                    urls: [...this.state.urls, ...urlsAdd]
                }, () => {
                    this.loadMusic(Math.abs(this.state.urls.length - urlsAdd.length));
                });
                let newMax = unplayedSongsMaxIndex + urlsAdd.length;
                unplayedSongsIndex = [
                    ...unplayedSongsIndex,
                    ...Array.from({ length: newMax + 1 }, (_, i) => i + unplayedSongsMaxIndex)
                ];
                unplayedSongsMaxIndex = newMax;
            };
        } catch (err) {
            console.error(err);
        } finally {
            this.animationInputAdd();
        };
    };
    handleInputSubmit(link, key) {
        switch (key) {
            case 'Enter':
                if (/(?:https:\/\/)?(?:www\.)?(youtu(be)?|soundcloud)\.(com|be)/.test(link)) {
                    if (/playlist/.test(link)) {
                        let playlistID = link.match(/(?:list=)(.*)/);
                        this.fetchYoutubePlaylist(playlistID[1]);
                    } else {
                        let cleanedUrl = (link).match(/(?:https:\/\/)?(?:www\.)?(youtu(be)?|soundcloud)\.(com|be).+?(?=[&]|\?[^v])/);
                        this.setState({
                            urls: [...this.state.urls, {
                                url: (cleanedUrl) ? cleanedUrl[0] : link
                            }]
                        }, () => {
                            if (this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name);

                            this.loadMusic([...this.state.music, ...this.state.urls].length - 1);
                            document.getElementById('musicplayer-input-add').value = '';        
                            this.animationInputAdd();

                            unplayedSongsIndex.push(unplayedSongsMaxIndex);
                            unplayedSongsMaxIndex++;

                            activePlaylistItem?.classList.remove('musicplayer-playlist-active');
                            const elementPlaylist = this.refPlaylist.getContentElement();
                            elementPlaylist.lastElementChild.classList.add('musicplayer-playlist-active');        
                        });
                    };
                };
                break;
            case 'Escape':
                this.handleBlur();
                break;
            default: break;
        };
    };
    handleButton(type) {
        let combineArrays = [...this.state.music, ...this.state.urls];
        switch (type) {
            case 'remove': {
                if (combineArrays.length !== 0) {
                    let findIndexMusic = this.state.music.findIndex((object) => object.name === this.state.name);
                    let copyArrayMusic = [...this.state.music];
                    if (findIndexMusic !== -1) {
                        let totalTimePlayed = copyArrayUrls[findIndexUrls].timePlayed + this.state.rawCurrentDuration;
                        let dataSong = dataSongsAdd.find((song) => song.name === copyArrayUrls[findIndexUrls].name);
                        if (dataSong !== undefined) {
                            totalTimePlayed += dataSong.timePlayed;
                        };                
                        dataSongsRemoved.push({
                            name: copyArrayUrls[findIndexUrls].name,
                            timePlayed: totalTimePlayed
                        });
                        dataSongsRemoved.push({
                            name: copyArrayMusic[findIndexMusic].name,
                            timePlayed: copyArrayMusic[findIndexMusic].timePlayed
                        });
                        if (findIndexMusic === 0) {
                            copyArrayMusic = [...copyArrayMusic.slice(1)];
                        } else {
                            copyArrayMusic = [...copyArrayMusic.slice(0, findIndexMusic), ...copyArrayMusic.slice(findIndexMusic + 1)];
                        };
                        this.setState({
                            music: [...copyArrayMusic]
                        }, () => {
                            if (this.state.music.length !== 0) {
                                if (findIndexMusic !== this.state.music.length) {
                                    this.loadMusic(findIndexMusic);
                                } else {
                                    this.loadMusic(0);
                                };
                            } else {
                                this.clearMusic();
                            };
                        });
                        let indexValue = unplayedSongsIndex.findIndex((value) => value === findIndexMusic);
                        unplayedSongsIndex.splice(indexValue, 1);
                        unplayedSongsMaxIndex--;
                    };
                    let findIndexUrls = this.state.urls.findIndex((object) => object.name === this.state.name);
                    let findIndexUrlsAdd = urlsAdd.findIndex((object) => object.name === this.state.name);
                    let copyArrayUrls = [...this.state.urls];
                    if (findIndexUrls !== -1) {
                        let totalTimePlayed = copyArrayUrls[findIndexUrls].timePlayed + this.state.rawCurrentDuration;
                        let dataSongIndex = dataSongsAdd.findIndex((song) => song.name === copyArrayUrls[findIndexUrls].name);
                        if (dataSongIndex !== -1) {
                            totalTimePlayed += dataSongsAdd[dataSongIndex].timePlayed;
                            dataSongsAdd.splice(dataSongIndex, 1);
                        };                
                        dataSongsRemoved.push({
                            name: copyArrayUrls[findIndexUrls].name,
                            timePlayed: totalTimePlayed
                        });
                        copyArrayUrls.splice(findIndexUrls, 1);
                        this.setState({
                            urls: [...copyArrayUrls]
                        }, () => {
                            if (this.state.urls.length !== 0) {
                                if (findIndexUrls !== this.state.urls.length) {
                                    this.loadMusic(findIndexUrls);
                                } else {
                                    this.loadMusic(0);
                                };
                            } else {
                                this.clearMusic();
                            };
                        });
                        let indexValue = unplayedSongsIndex.findIndex((value) => value === findIndexUrls);
                        unplayedSongsIndex.splice(indexValue, 1);
                        unplayedSongsMaxIndex--;
                    } else if (findIndexUrlsAdd !== -1) {
                        dataSongsRemoved.push({
                            name: dataSongsAdd[findIndexUrlsAdd].name,
                            timePlayed: dataSongsAdd[findIndexUrlsAdd].timePlayed
                        });
                        dataSongsAdd.splice(findIndexUrlsAdd, 1);
                        let indexValue = unplayedSongsIndex.findIndex((value) => value === findIndexUrlsAdd);
                        unplayedSongsIndex.splice(indexValue, 1);
                        unplayedSongsMaxIndex--;
                    };
                    let elementDetails = document.getElementById('musicplayer-details');
                    elementDetails.classList.add('musicplayer-animation-remove-details');
                    timeoutAnimationRemove = setTimeout(() => {
                        elementDetails.classList.remove('musicplayer-animation-remove-details');
                    }, 300);
                };
                break;
            };
            case 'add': {
                document.getElementById('musicplayer-input-add').classList.add('musicplayer-animation-input-add');
                setTimeout(() => {
                    document.getElementById('musicplayer-input-add').focus();
                }, 500);
                document.getElementById('musicplayer-button-add').classList.add('musicplayer-animation-button-add');
                break;
            };
            case 'next': {
                if (this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name);
                if (combineArrays.length > 1) {
                    this.handleNextMusic();
                    let elementButtonPrevious = document.getElementById('musicplayer-button-next');
                    elementButtonPrevious.classList.add('musicplayer-animation-button-next');
                    timeoutAnimationNext = setTimeout(() => {
                        elementButtonPrevious.classList.remove('musicplayer-animation-button-next');
                    }, 300);
                };
                break;
            };
            case 'previous': {
                if (this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name);
                if (combineArrays.length > 1) {
                    this.handlePreviousMusic();
                    let elementButtonPrevious = document.getElementById('musicplayer-button-previous');
                    elementButtonPrevious.classList.add('musicplayer-animation-button-previous');
                    timeoutAnimationPrevious = setTimeout(() => {
                        elementButtonPrevious.classList.remove('musicplayer-animation-button-previous');
                    }, 300);
                };
                break;
            };
            case 'statistic': {
                const elementStatisticPage = document.getElementById('musicplayer-statistics');
                if (elementStatisticPage.checkVisibility()) {
                    elementStatisticPage.style.display = 'none';  
                } else {
                    elementStatisticPage.style.display = 'block';
                };
                break;
            };
            case 'shuffle': {
                this.setState({
                    shuffle: !this.state.shuffle
                });
                const buttonShuffle = document.getElementById('musicplayer-button-shuffle');
                buttonShuffle.classList.toggle('disabled');
                break;
            };
            case 'loop': {
                const buttonLoop = document.getElementById('musicplayer-button-loop');
                let isLoop = false;
                let isLoopOnce = false;
                if (this.state.loop) {
                    isLoopOnce = true;
                } else if (this.state.loopOnce) {
                    buttonLoop.classList.toggle('disabled');
                } else {
                    isLoop = true;
                    buttonLoop.classList.toggle('disabled');
                };

                this.setState({
                    loop: isLoop,
                    loopOnce: isLoopOnce,
                });
                break;
            };
            case 'playlist': {
                if (timeoutPlaylistPanel === undefined) {
                    const elementPlaylistLength = document.getElementById('musicplayer-playlist-length');
                    const elementPlaylist = document.getElementById('musicplayer-playlist');
                    if (elementPlaylistLength.classList.contains('musicplayer-playlist-length-show')) {
                        elementPlaylistLength.classList.toggle('musicplayer-playlist-length-show');
                        timeoutPlaylistPanel = setTimeout(() => {
                            elementPlaylist.classList.toggle('musicplayer-playlist-show');
                            timeoutPlaylistPanel = undefined;
                        }, 500);
                    } else {
                        elementPlaylist.classList.toggle('musicplayer-playlist-show');
                        timeoutPlaylistPanel = setTimeout(() => {
                            elementPlaylistLength.classList.toggle('musicplayer-playlist-length-show');
                            timeoutPlaylistPanel = undefined;
                        }, 500);
                    };
                };
                break;
            };
            case 'playlist-clear': {
                const buttonPlaylistClear = document.getElementById('musicplayer-button-playlist-clear');
                if (buttonPlaylistClear.classList.contains('confirm-delete')) {
                    if (this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name);
                    this.setState({
                        urls: []
                    });
                    this.clearMusic();
                    unplayedSongsIndex.length = 0;
                    unplayedSongsMaxIndex = 0;
                    let cleanUrls = this.state.urls.map((url) => {
                        return {
                            name: url.name,
                            timePlayed: url.timePlayed
                        }
                    });
                    dataSongsRemoved = [...dataSongsRemoved, ...cleanUrls];
                };
                buttonPlaylistClear.classList.toggle('confirm-delete');
                if (buttonPlaylistClear.classList.contains('confirm-delete')) {
                    timeoutPlaylistClear = setTimeout(() => {
                        buttonPlaylistClear.classList.remove('confirm-delete');
                    }, 2000);
                };
                break;
            };
            case 'input-add': {
                const elementInput = document.getElementById('musicplayer-input-add').value;
                this.handleInputSubmit(elementInput, 'Enter');
                break;
            }
            default: { break; };
        };
    };
    handleNextMusic() {
        if (this.state.shuffle) {
            if (previousShuffleNextSong !== -1) {
                previousShuffleNextSong.click();
                previousShuffleNextSong = -1;
            } else {
                let randomMusicIndex = Math.floor(Math.random() * unplayedSongsIndex.length);
                let randomMusic = unplayedSongsIndex[randomMusicIndex];
                unplayedSongsIndex.splice(randomMusicIndex, 1);
                this.loadMusic(randomMusic);
                if (unplayedSongsIndex.length === 0) {
                    unplayedSongsIndex = [...Array(unplayedSongsMaxIndex).keys()];
                };
            };
        } else {
            let combineArrays = [...this.state.music, ...this.state.urls];
            if (combineArrays.length > 1) {
                let musicIndex = ((this.state.songIndex + 1) > combineArrays.length - 1)
                    ? 0
                    : this.state.songIndex + 1;
                this.loadMusic(musicIndex);
            };
        };
    };
    handlePreviousMusic() {
        if (this.state.shuffle) {
            previousShuffleNextSong = activePlaylistItem;
            previousPlaylistItem.click();
        } else {
            let combineArrays = [...this.state.music, ...this.state.urls];
            if (combineArrays.length > 1) {
                let musicIndex = ((this.state.songIndex - 1) < 0)
                    ? combineArrays.length - 1
                    : this.state.songIndex - 1;
                this.loadMusic(musicIndex);
            };
        };
    };
    handleSeeking({ event, what }) {
        /// Default is onChange
        switch (what) {
            case 'down':
                this.setState({
                    seeking: true
                });
                break;
            case 'up':
                this.setState({
                    seeking: false
                });
                this.player.seekTo(parseFloat(event.target.value));
                break;
            default:
                this.setState({
                    progress: parseFloat(event.target.value)
                });
                break;
        };
    };
    handlePlaylist(index, element) {
        if (this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name);
        this.loadMusic(index);
        if (activePlaylistItem !== -1) {
            activePlaylistItem.classList.remove('musicplayer-playlist-active');
        };
        activePlaylistItem = element.target;
        element.target.classList.add('musicplayer-playlist-active');
    };
    playlistHandleKeyDown(index, event) {
        if (event.code.match(/Space|Enter/)) {
            event.preventDefault();
            this.handlePlaylist(index, event);
        };
    };
    handlePlayerReady() {
        const player = document.getElementById('musicplayer-player');
        const iframe = player?.querySelector('iframe');
        if (iframe) {
            iframe.setAttribute('tabindex', '-1');
        };
    };
    handleBlur() {
        document.getElementById('musicplayer-input-add')
            .classList.remove('musicplayer-animation-input-add');
        document.getElementById('musicplayer-button-add')
            .classList.remove('musicplayer-animation-button-add');
    };
    ended() {
        this.saveDataMusic(this.state.name);
        this.setState({
            currentDuration: '00:00',
            maxDuration: '00:00'
        });

        if (this.state.loop) return;
        if (this.state.loopOnce) {
            if (totalTimesPlayed === 0) {
                totalTimesPlayed++;
                this.player.seekTo(0);
                return;
            } else {
                totalTimesPlayed = 0;
            };
        };

        this.handleNextMusic();
    };
    clearMusic() {
        this.setState({
            name: '',
            artist: '',
            currentDuration: '00:00',
            rawCurrentDuration: 0,
            maxDuration: '00:00',
            rawMaxDuration: 0,
            progress: 0,
            playing: false,
            songIndex: 0,
            autoplay: false,
            url: null,
            playerVisibility: 'hidden'
        });
    };
    discSwitch() {
        let elementDisc = document.getElementById('musicplayer-disc');
        let elementPlayer = document.getElementById('musicplayer-player');
        if (elementDisc.classList.contains('musicplayer-disc-small')) {
            elementDisc.classList.remove('musicplayer-disc-small');
            elementDisc.classList.add('musicplayer-disc-medium');
            elementPlayer.classList.remove('musicplayer-player-small');
            elementPlayer.classList.add('musicplayer-player-medium');
        } else if (elementDisc.classList.contains('musicplayer-disc-medium')) {
            elementDisc.classList.remove('musicplayer-disc-small');  
            elementDisc.classList.remove('musicplayer-disc-medium');    
            elementPlayer.classList.remove('musicplayer-player-small');
            elementPlayer.classList.remove('musicplayer-player-medium');
        } else {
            elementDisc.classList.add('musicplayer-disc-small');
            elementDisc.classList.remove('musicplayer-disc-medium');    
            elementPlayer.classList.add('musicplayer-player-small');
            elementPlayer.classList.remove('musicplayer-player-medium');
        };
    };
    discHandleKeyDown(event) {
        if (event.code.match(/Space|Enter/)) {
            event.preventDefault();
            this.discSwitch();
        };
    };
    animationInputAdd() {
        let elementDetails = document.getElementById('musicplayer-details');
        elementDetails.classList.add('musicplayer-animation-add-details');
        timeoutAnimationRemove = setTimeout(() => {
            elementDetails.classList.remove('musicplayer-animation-add-details');
        }, 400);
    };
    toggleMusic() {
        let combineArrays = [...this.state.music, ...this.state.urls];
        if (combineArrays.length !== 0) {
            this.setState({
                playing: !this.state.playing,
                autoplay: !this.state.autoplay
            }, () => {
                if (this.state.playerVisibility === 'hidden') {
                    if (this.state.playing) {
                        audio.play();
                        window.requestAnimationFrame(() => {
                            document.getElementById('musicplayer-disc')
                                .style.animation = 'rotateDisk 5s linear 0s infinite forwards';    
                        });
                    } else {
                        audio.pause();
                        document.getElementById('musicplayer-disc')
                            .style.animation = 'none';
                    };
                };
            });
            let elementButtonPlay = document.getElementById('musicplayer-button-clone-play');
            elementButtonPlay.style.animation = 'none';
            window.requestAnimationFrame(() => {
                elementButtonPlay.style.animation = 'pulse 0.8s';
            });
        };
    };
    updateDuration(event) {
        if (!this.state.seeking) {
            let minutes, seconds;
            if (event.playedSeconds) {
                minutes = Math.floor(event.playedSeconds / 60);
                seconds = Math.floor(event.playedSeconds % 60);
            } else {
                minutes = Math.floor(audio.currentTime / 60);
                seconds = Math.floor(audio.currentTime % 60);
            };
            if (minutes < 10) {
                minutes = `0${minutes}`;
            };
            if (seconds < 10) {
                seconds = `0${seconds}`;
            };
            this.setState({
                currentDuration: `${minutes}:${seconds}`,
                rawCurrentDuration: event.playedSeconds,
                progress: event.played
            });
            timePlayed += 1;
        };
    };
    setMaxDuration(event) {
        let minutes, seconds;
        if (event) {
            minutes = Math.floor(event / 60);
            seconds = Math.floor(event % 60);
        } else {
            minutes = Math.floor(audio.duration / 60);
            seconds = Math.floor(audio.duration % 60);
        };
        if (minutes < 10) {
            minutes = `0${minutes}`;
        };
        if (seconds < 10) {
            seconds = `0${seconds}`;
        };

        this.setState({
            maxDuration: `${minutes}:${seconds}`,
            rawMaxDuration: event
        });
    };
    loadMusic(music) {
        let combineArrays = [...this.state.music, ...this.state.urls];
        let musicIndex;
        if (music !== undefined) {
            musicIndex = music;
        } else {
            musicIndex = Math.floor(Math.random() * combineArrays.length);
            unplayedSongsIndex.splice(musicIndex, 1);
        };
        const elementPlaylist = this.refPlaylist.getContentElement();
        const elementPlaylistItem = elementPlaylist.children[musicIndex];
        previousPlaylistItem = activePlaylistItem;
        activePlaylistItem.classList?.remove('musicplayer-playlist-active');
        elementPlaylistItem.classList.add('musicplayer-playlist-active');
        elementPlaylistItem.scrollIntoView();
        activePlaylistItem = elementPlaylistItem;
        let randomMusic = combineArrays[musicIndex];
        if (randomMusic.url) {
            if (randomMusic.name) {
                this.setState({
                    name: randomMusic.name,
                    artist: randomMusic.artist
                });
            } else {
                this.fetchURLData(randomMusic.url);
            };
            this.setState({
                currentDuration: '00:00',
                maxDuration: '00:00',
                progress: 0,    
                songIndex: musicIndex,
                url: randomMusic.url,
                playerVisibility: 'visible'
            });
            audio.pause();
            document.getElementById('musicplayer-disc').style.animation = 'none';
        } else {
            this.setState({
                name: randomMusic.name,
                artist: randomMusic.artist,
                songIndex: musicIndex,
                playerVisibility: 'hidden'
            });
            /// Audio
            audio.src = randomMusic.song;
            audio.autoplay = this.state.autoplay;
            audio.onloadedmetadata = () => {
                this.setMaxDuration();
            };
            /// Image
            let musicDisc = document.getElementById('musicplayer-disc');
            musicDisc.style.backgroundImage = `url(${randomMusic.cover})`;
            if (this.state.playing) {
                window.requestAnimationFrame(() => {
                    document.getElementById('musicplayer-disc').style.animation = 'rotateDisk 5s linear 0s infinite forwards';    
                });
            };
        };
    };
    saveDataMusic(music) {
        let dataSong = dataSongsAdd.find((song) => song.name === music);
        if (dataSong !== undefined) {
            dataSong = {
                ...dataSong,
                timePlayed: dataSong.timePlayed + timePlayed
            };
        } else {
            dataSongsAdd.push({
                name: music,
                timePlayed: timePlayed
            });
        };
        timePlayed = 0;
    };
    formatTime() {
        const { days, hours, minutes, seconds } = this.state.statistics.time;
        const textDays = (days !== 0) ? `${this.props.formatNumber(days, 2)} days ` : '';
        const textHours = (hours !== 0) ? `${hours} hours ` : '';
        const textMinutes = (minutes !== 0) ? `${minutes} minutes ` : '';
        const textSeconds = (seconds !== 0) ? `${seconds} seconds ` : '';

        return `${textDays}${textHours}${textMinutes}${textSeconds}`;
    };
    calculateStatistic() {
        let newStatistic = {};
        let totalPlayed = 0;
        let totalTime = 0;

        for (let url of this.state.urls) {
            totalPlayed += url.timePlayed / url.duration;
            totalTime += url.timePlayed;
        };

        const DHMS = this.convertSecondsToDHMS(totalTime);

        newStatistic = {
            played: totalPlayed,
            time: {
                days: DHMS.days,
                hours: DHMS.hours,
                minutes: DHMS.minutes,
                seconds: DHMS.seconds,
            },
        };

        let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
        dataLocalStorage['utility']['musicplayer'] = {
            ...dataLocalStorage['utility']['musicplayer'],
            statistic: { ...newStatistic },
        };
        localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));

        this.setState({
            statistic: { ...newStatistic },
        });
    };
    convertSecondsToDHMS(totalSeconds) {
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { days, hours, minutes, seconds };
    };
    storeData() {
        if (localStorage.getItem('widgets') !== null) {
            if (this.state.rawCurrentDuration !== 0) this.saveDataMusic(this.state.name);
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let addData = [...this.state.urls, ...dataSongsAdd];
            let matchingDataInRemove = [];
            let dataLocalStorageDeleted = (dataLocalStorage['utility']['musicplayer']?.deleted === undefined)
                ? []
                : dataLocalStorage['utility']['musicplayer']['deleted'];
            let deletedData = Object.values([...dataLocalStorageDeleted, ...dataSongsRemoved].reduce((prev, curr) => {
                if (prev[curr.name]) {
                    prev[curr.name].timePlayed += curr.timePlayed;
                } else {
                    prev[curr.name] = { ...curr };
                };
                return prev;
            }, {}));
            deletedData = [...deletedData].filter((song) => {
                if (addData.some((songAdd) => songAdd.name === song.name)) {
                    matchingDataInRemove.push(song);
                } else {
                    return song;   
                };
            });
            let addTimePlayed = Object.values([...addData, ...matchingDataInRemove].reduce((prev, curr) => {
                if (prev[curr.name]) {
                    prev[curr.name].timePlayed += curr.timePlayed;
                } else {
                    prev[curr.name] = { ...curr };
                };
                return prev;
            }, {}));
            dataLocalStorage['utility']['musicplayer'] = {
                ...dataLocalStorage['utility']['musicplayer'],
                urls: [...addTimePlayed],
                deleted: [...deletedData],
                shuffle: this.state.shuffle
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
            dataSongsRemoved.length = 0;
            dataSongsAdd.length = 0;
        };
    };
    componentDidMount() {
        window.addEventListener('beforeunload', this.storeData);
        audio.addEventListener('ended', this.ended);
        audio.addEventListener('timeupdate', this.updateDuration);
        
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let dataMusicPlayer = dataLocalStorage['utility']['musicplayer'];

            if ((new Date().getDate() === 1) || (dataMusicPlayer['statistic'] === undefined) || (dataMusicPlayer['statistic'] === null)) {
                this.calculateStatistic();
            } else {
                this.setState({
                    statistic: { ...dataMusicPlayer['statistic'] }
                });
            };

            if (dataMusicPlayer['urls'] !== undefined) {
                this.setState({
                    urls: [...dataMusicPlayer['urls']],
                    shuffle: dataMusicPlayer.shuffle
                }, () => {
                    if (this.state.urls.length !== 0) {
                        unplayedSongsIndex = [...Array(this.state.urls.length).keys()];
                        unplayedSongsMaxIndex = this.state.urls.length;
                        this.loadMusic();
                    };
                    if (this.state.shuffle) {
                        document.getElementById('musicplayer-button-shuffle').classList.remove('disabled');
                    };
                });
            } else {
                this.setState({}, () => {
                    this.loadMusic();
                });
            };
        };

        setTimeout(() => {
            document.getElementById('musicplayer-playlist').style.display = 'unset';
        }, 100);
    };
    componentWillUnmount() {
        if (!audio.paused) {
            audio.pause();
        };
        this.storeData();
        window.removeEventListener('beforeunload', this.storeData);
        audio.removeEventListener('ended', this.ended);
        audio.removeEventListener('timeupdate', this.updateDuration);
        clearTimeout(timeoutAnimationRemove);
        clearTimeout(timeoutAnimationNext);
        clearTimeout(timeoutAnimationPrevious);
        clearTimeout(timeoutPlaylistClear);
        clearTimeout(timeoutPlaylistPanel);
    };
    render() {
        return (
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart('musicplayer')}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop('musicplayer');
                    this.props.defaultProps.updatePosition('musicplayer', 'utility', data.x, data.y);
                }}
                cancel='button, span, input, #musicplayer-disc, #musicplayer-playlist, #musicplayer-statistics'
                bounds='parent'>
                <section id='musicplayer-widget'
                    className='widget'
                    aria-labelledby='musicplayer-widget-heading'>
                    <h2 id='musicplayer-widget-heading'
                        className='screen-reader-only'>Music Player Widget</h2>
                    <div id='musicplayer-widget-animation'
                        className='widget-animation custom-shape'>
                        {/* Drag Handle */}
                        <span id='musicplayer-widget-draggable'
                            className='draggable'>
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: 'global-class-name' }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar('musicplayer', 'utility')}
                        <div className='flex-center row'>
                            {/* Song */}
                            <div className='flex-center column'>
                                {/* Song Disc */}
                                <div id='musicplayer-disc'
                                    className='circle no-highlight'
                                    role='button'
                                    aria-label='Change music disc'
                                    onClick={() => this.discSwitch()}
                                    onKeyDown={(event) => this.discHandleKeyDown(event)}
                                    tabIndex={0}>
                                    <ReactPlayer id='musicplayer-player'
                                        ref={this.ref}
                                        url={this.state.url}
                                        playing={this.state.playing && this.state.playerVisibility === 'visible'}
                                        loop={this.state.loop}
                                        height={'21em'}
                                        width={'21em'}
                                        onDuration={(event) => this.setMaxDuration(event)}
                                        onProgress={(event) => this.updateDuration(event)}
                                        onEnded={this.ended}
                                        onReady={() => this.handlePlayerReady()}
                                        style={{
                                            visibility: this.state.playerVisibility
                                        }}
                                        config={{
                                            youtube: {
                                                playerVars: {
                                                    fs: 0,
                                                    rel: 0,
                                                    iv_load_policy: 3,
                                                    controls: 0
                                                },
                                            }
                                        }}/>
                                </div>
                                {/* Song Information */}
                                <div id='musicplayer-details'
                                    className='no-highlight flex-center column gap small-gap only-justify-content'>
                                    <div className='flex-center column gap only-justify-content'>
                                        <div id='musicplayer-name'>
                                            <span className='text-animation font bold white large-medium'
                                                onClick={() => this.props.copyToClipboard(this.state.name)}>{this.state.name}</span>
                                        </div>
                                        <span id='musicplayer-author' 
                                            className='text-animation aesthetic-scale scale-self origin-left font white small'
                                            onClick={() => this.props.copyToClipboard(this.state.artist)}>{this.state.artist}</span>
                                    </div>
                                    <div>
                                        <input className='progress-bar'
                                            value={this.state.progress}
                                            type='range'
                                            min={0}
                                            max={0.999999}
                                            step={'any'}
                                            aria-label='Song progress'
                                            aria-valuetext={`${this.state.currentDuration} of ${this.state.maxDuration}`}
                                            onMouseDown={() => this.handleSeeking({ what: 'down' })}
                                            onTouchStart={() => this.handleSeeking({ what: 'down' })}
                                            onChange={(event) => this.handleSeeking({ event: event })}
                                            onMouseUp={(event) => this.handleSeeking({ event: event, what: 'up' })}
                                            onTouchEnd={(event) => this.handleSeeking({ event: event, what: 'up' })}/>
                                        <div className='element-ends font small transparent-white'
                                            style={{
                                                marginTop: '0.1rem'
                                            }}>
                                            <span>{this.state.currentDuration}</span>
                                            <span>{this.state.maxDuration}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Song Controls */}
                                <div id='musicplayer-controls'
                                    className='flex-center row gap'>
                                    <button id='musicplayer-remove'
                                        className='button-match inverse disabled'
                                        aria-label='Remove song'
                                        onClick={() => this.handleButton('remove')}>
                                        <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                            <FaMinus/>
                                        </IconContext.Provider>
                                    </button>
                                    <button id='musicplayer-button-previous'
                                        className='button-match inverse'
                                        aria-label='Previous song'
                                        onClick={() => this.handleButton('previous')}>
                                        <IconContext.Provider value={{ size: '4em', className: 'global-class-name' }}>
                                            <IoPlayBack/>
                                        </IconContext.Provider>
                                    </button>
                                    <button id='musicplayer-button-play'
                                        className='button-match inverse'
                                        aria-label={(this.state.playing) ? 'Pause' : 'Play'}
                                        onClick={() => this.toggleMusic()}>
                                        {(this.state.playing)
                                            ? <IconContext.Provider value={{ size: '4.5em', className: 'global-class-name' }}>
                                                <FaRegCirclePause/>
                                            </IconContext.Provider>
                                            : <IconContext.Provider value={{ size: '4.5em', className: 'global-class-name' }}>
                                                <FaRegCirclePlay/>
                                            </IconContext.Provider>}
                                        <div id='musicplayer-button-clone-play'
                                            className='button-match inverse'>
                                            {(this.state.playing)
                                                ? <IconContext.Provider value={{ size: '4.5em', className: 'global-class-name' }}>
                                                    <FaRegCirclePause/>
                                                </IconContext.Provider>
                                                : <IconContext.Provider value={{ size: '4.5em', className: 'global-class-name' }}>
                                                    <FaRegCirclePlay/>
                                                </IconContext.Provider>}
                                        </div>
                                    </button>
                                    <button id='musicplayer-button-next'
                                        className='button-match inverse'
                                        aria-label='Next song'
                                        onClick={() => this.handleButton('next')}>
                                        <IconContext.Provider value={{ size: '4em', className: 'global-class-name' }}>
                                            <IoPlayForward/>
                                        </IconContext.Provider>
                                    </button>
                                    <button id='musicplayer-add'
                                        className='button-match inverse disabled'
                                        aria-label='Add song'
                                        onClick={() => this.handleButton('add')}>
                                        <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                            <FaPlus/>
                                        </IconContext.Provider>
                                    </button>
                                    <input id='musicplayer-input-add'
                                        className='input-match'
                                        onKeyDown={(event) => this.handleInputSubmit(event.target.value, event.key)}
                                        onBlur={() => this.handleBlur()}
                                        autoComplete='off'
                                        type='text'
                                        name='musicplayer-input-add'
                                        placeholder='Enter URL'
                                        aria-labelledby='musicplayer-input-add-aria-describedby'/>
                                    <span id='musicplayer-input-add-aria-describedby'
                                        className='screen-reader-only'>
                                        Type a link here to add it.
                                    </span>
                                    <button id='musicplayer-button-add'
                                        className='button-match'
                                        onClick={() => this.handleButton('input-add')}
                                        onMouseDown={(event) => event.preventDefault()}
                                        tabIndex={-1}>Add</button>
                                </div>
                                {/* Song Expanded Controls */}
                                <div id='musicplayer-controls-expanded'
                                    tabIndex={0}>
                                    <button id='musicplayer-button-loop'
                                        className='button-match inverse disabled'
                                        aria-label='Loop'
                                        onClick={() => this.handleButton('loop')}>
                                        <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                            {(this.state.loopOnce) ? <TbRepeatOnce/> : <TbRepeat/>}
                                        </IconContext.Provider>
                                    </button>
                                    <button id='musicplayer-button-shuffle'
                                        className='button-match inverse disabled'
                                        aria-label='Shuffle'
                                        onClick={() => this.handleButton('shuffle')}>
                                        <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                            <FaShuffle/>
                                        </IconContext.Provider>
                                    </button>
                                    <button id='musicplayer-button-statistic'
                                        className='button-match inverse'
                                        aria-label='Statistic'
                                        onClick={() => this.handleButton('statistic')}>
                                        <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                            <IoStatsChart/>
                                        </IconContext.Provider>
                                    </button>
                                    <button id='musicplayer-button-playlist'
                                        className='button-match inverse'
                                        aria-label='Playlist'
                                        onClick={() => this.handleButton('playlist')}>
                                        <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                            <RiPlayListFill/>
                                        </IconContext.Provider>
                                    </button>
                                    <button id='musicplayer-button-playlist-clear'
                                        className='button-match inverse'
                                        aria-label='Clear playlist'
                                        onClick={() => this.handleButton('playlist-clear')}>
                                        <IconContext.Provider value={{ size: '1.3em', className: 'global-class-name' }}>
                                            <VscClearAll/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                            <span id='musicplayer-playlist-length'>{this.state.urls.length}</span>
                            <SimpleBar id='musicplayer-playlist'
                                ref={(ref) => this.refPlaylist = ref}
                                role='list'
                                aria-label='Playlist'
                                tabIndex={-1}>
                                {this.state.urls.map((url, index) => {
                                    return <section className='flex-center column align-items-left box no-highlight'
                                        key={`playlist-item-${index}`}
                                        role='button'
                                        aria-label={`Play ${url.name} by ${url.artist}`}
                                        onClick={(event) => this.handlePlaylist(index, event)}
                                        onKeyDown={(event) => this.playlistHandleKeyDown(index, event)}
                                        tabIndex={0}>
                                        <span>{url.name}</span>
                                        <span className='font transparent-normal'>{url.artist}</span>
                                    </section>
                                })}
                            </SimpleBar>
                        </div>
                        {/* Statistics Popout */}
                        <section id='musicplayer-statistics'
                            className='scrollable float center flex-center column only-align-items gap medium-gap'
                            onClick={() => this.handleButton('statistic')}>
                            <h3>Statistics</h3>
                            <div className='flex-center column gap align-items-left'>
                                <span>Played: {this.props.formatNumber(this.state.statistics.played, 2)}</span>
                                <span>Time: {this.formatTime()}</span>
                                <ul>
                                    {this.state.urls.map((url, index) => {
                                        return <li key={url.name}>
                                            <span>{index + 1}. {url.name}</span>
                                            <span>{this.props.formatNumber((url.timePlayed / url.duration), 2)}</span>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </section>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                            : <></>}
                    </div>
                </section>
            </Draggable>
        );
    };
};

export default memo(WidgetMusicPlayer);