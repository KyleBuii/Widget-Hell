import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { EventBus } from './Game/EventBus';
import { PhaserGame } from './Game/PhaserGame';

const WidgetCircleBeat = ({ defaultProps }) => {
    const [url, setUrl] = useState('');
    const [playing, setPlaying] = useState(false);
    const phaserRef = useRef(null);
    const playerRef = useRef(null);
    useEffect(() => {
        EventBus.on('play', () => handlePlay());
        EventBus.on('clicked disc add', () => {
            const addPopout = document.getElementById('circlebeat-add');
            addPopout.style.display = 'flex';
        });
        EventBus.on('clicked disc', (disc) => handleDiscClick(disc));
        return () => {
            EventBus.removeAllListeners();
        };
    }, []);
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
    const handleAdd = () => {
        const enteredURL = document.getElementsByClassName('input-game');
        if ((/(?:https:\/\/)?(?:www\.)?(youtu(be)?|soundcloud)\.(com|be)/.test(enteredURL[0].value))) {
            setUrl(enteredURL[0].value);
            fetchURLData(enteredURL[0].value);
            enteredURL[0].value = '';
        };
    };
    const fetchURLData = async (URL) => {
        try {
            const url = `https://noembed.com/embed?dataType=json&url=${URL}`;
            const result = await fetch(url);
            const data = await result.json();
            EventBus.emit('add song',
                {
                    url: URL,
                    name: data.title,
                    artist: data.author_name,
                    image: data.thumbnail_url,
                }
            );
        } catch (err) {
            console.error(err);
        };
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('circlebeat')}
            onStop={(event, data) => {
                defaultProps.dragStop('circlebeat');
                defaultProps.updatePosition('circlebeat', 'games', data.x, data.y);
            }}
            cancel='button, input, #circlebeat-game'
            bounds='parent'>
            <div id='circlebeat-widget'
                className='widget'>
                <div id='circlebeat-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='circlebeat-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('circlebeat', 'games')}
                    <ReactPlayer id='circlebeat-video'
                        ref={playerRef}
                        style={{ padding: '1.9rem 1.7rem', boxSizing: 'border-box' }}
                        width={'100%'}
                        height={'100%'}
                        url={url}
                        playing={playing}
                        onReady={() => handlePlayerReady()}
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
                    <section id='circlebeat-add'>
                        <input className='input-game'/>
                        <button className='button-game'
                            onClick={() => handleAdd()}>Add</button>
                    </section>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetCircleBeat);