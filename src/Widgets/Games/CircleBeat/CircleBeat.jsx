import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { classStack, decorationValue } from '../../../data';
import { EventBus } from './Game/EventBus';
import { PhaserGame } from './Game/PhaserGame';

let discs = [
    {
        url: 'https://www.youtube.com/watch?v=T1VAYTEWWgM',
        name: 'Hate Me',
        author: 'blueberry',
        duration: '2:13',
        bpm: 230,
    },
    {
        url: 'https://www.youtube.com/watch?v=NWnFhu0JbU0',
        name: 'LOUCA ENCUBADA',
        author: 'DJ SAMIR',
        duration: '1:59',
        bpm: 130,
    },
    {
        url: 'https://www.youtube.com/watch?v=JyVCWlSPp0g',
        name: 'back to you',
        author: 'bad narrator',
        duration: '2:39',
        bpm: 126,
    },
    {
        url: 'https://www.youtube.com/watch?v=8_-iOvzH65A',
        name: '怪物 / ‘Monster’',
        author: 'Saya Velleth',
        duration: '3:07',
        bpm: 150,
    },
    {
        url: 'https://www.youtube.com/watch?v=5ta148UdiCI',
        name: 'DANÇA DO VERÃO',
        author: 'NXGHT!, SH3RWIN, Scythermane',
        duration: '1:13',
        bpm: 135,
    },
];

const WidgetCircleBeat = ({ defaultProps }) => {
    const [url, setUrl] = useState('https://www.youtube.com/watch?v=JyVCWlSPp0g');
    const [playing, setPlaying] = useState(false);
    const [pendingUrl, setPendingUrl] = useState(false);
    
    const phaserRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        window.addEventListener('beforeunload', storeData);

        const dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
        const dataCircleBeat = dataLocalStorage['games']['circlebeat'];
        if (dataCircleBeat['discs'] !== undefined) {
            discs = [...dataCircleBeat['discs']];
        };

        EventBus.on('song select ready', () => {
            EventBus.emit('discs', discs);
        });
        EventBus.on('play', () => handlePlay());
        EventBus.on('clicked disc add', () => {
            const addPopout = document.getElementById('circlebeat-add');
            addPopout.style.display = 'flex';
        });
        EventBus.on('clicked disc', (disc) => handleDiscClick(disc));

        defaultProps.incrementWidgetCounter();

        return () => {
            window.removeEventListener('beforeunload', storeData);
            EventBus.removeAllListeners();

            storeData();
        };
    }, []);

    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            const dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));

            const game = phaserRef.current?.game; // Assuming `PhaserGame` attaches the Phaser.Game instance to `this.game`
            const songSelectScene = game?.scene?.keys?.['SongSelect'];
            if (songSelectScene?.getAllScores) {
                const allScores = songSelectScene.getAllScores();
                for (const { index, scores } of allScores) {
                    discs[index].scores = scores;
                };
            };

            dataLocalStorage['games']['circlebeat'] = {
                ...dataLocalStorage['games']['circlebeat'],
                discs: [...discs],
            };

            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };

    const handlePlay = () => {
        playerRef.current.seekTo(0);
        setPlaying(true);
    };

    const handleDiscClick = (disc) => {
        const addPopout = document.getElementById('circlebeat-add');
        addPopout.style.display = 'none';
        setUrl(disc);
        setPlaying(true);
    };

    const handlePlayerReady = () => {
        playerRef.current.seekTo(30);
    };

    const handlePlayerEnd = () => {
        EventBus.emit('play end');
        setPlaying(false);
    };

    const handleAdd = (event) => {
        event.preventDefault();
        const userInputs = document.getElementsByClassName('input-game');
        if ((/(?:https:\/\/)?(?:www\.)?(youtu(be)?|soundcloud)\.(com|be)/.test(userInputs[0].value))) {
            setPendingUrl(true);
            setUrl(userInputs[0].value);
        };
    };

    const handlePlayerDuration = (duration) => {
        if (pendingUrl) {
            const userInputs = document.getElementsByClassName('input-game');
            fetchURLData(userInputs[0].value, duration, userInputs[1].value);
            userInputs[0].value = '';
            userInputs[1].value = '';
            setPendingUrl(false);

            const addPopout = document.getElementById('circlebeat-add');
            addPopout.style.display = 'none';    
        };
    };

    const fetchURLData = async (URL, duration, BPM) => {
        try {
            const url = `https://noembed.com/embed?dataType=json&url=${URL}`;
            const result = await fetch(url);
            const data = await result.json();
            const newDisc = {
                url: URL,
                name: data.title,
                author: data.author_name,
                duration: formatTime(duration),
                bpm: BPM,
            };
            discs.push(newDisc);
            EventBus.emit('add song',
                {
                    ...newDisc,
                    image: data.thumbnail_url,
                }
            );
        } catch (err) {
            console.error(err);
        };
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;    
    };
    
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('circlebeat')}
            onStop={(event, data) => {
                defaultProps.dragStop('circlebeat');
                defaultProps.updatePosition('circlebeat', 'games', data.x, data.y);
            }}
            cancel='button, input, #circlebeat-game'
            bounds='parent'>
            <section id='circlebeat-widget'
                className='widget'
                aria-labelledby='circlebeat-widget-heading'>
                <h2 id='circlebeat-widget-heading'
                    className='screen-reader-only'>Circle Beat Widget</h2>
                <div id='circlebeat-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='circlebeat-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    <img className={`decoration ${decorationValue}`}
                        src={`/resources/decoration/${decorationValue}.webp`}
                        alt={decorationValue}
                        key={decorationValue}
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                        loading='lazy'
                        decoding='async'/>
                    {defaultProps.renderHotbar('circlebeat', 'games')}
                    <ReactPlayer id='circlebeat-video'
                        ref={playerRef}
                        style={{ padding: '1.9rem 1.7rem', boxSizing: 'border-box' }}
                        width={'100%'}
                        height={'100%'}
                        url={url}
                        playing={playing}
                        onReady={() => handlePlayerReady()}
                        onDuration={(event) => handlePlayerDuration(event)}
                        onEnded={() => handlePlayerEnd()}
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
                    <PhaserGame ref={phaserRef}/>
                    <form id='circlebeat-add'
                        onSubmit={(event) => handleAdd(event)}>
                        <div className='flex-center row gap'>
                            <input className='input-game'
                                placeholder='Link'
                                required/>
                            <input className='input-game'
                                placeholder='BPM'
                                required/>
                        </div>
                        <button className='button-game'
                            type='submit'>Add</button>
                    </form>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetCircleBeat);