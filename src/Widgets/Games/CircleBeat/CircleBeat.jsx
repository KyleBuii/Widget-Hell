import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { EventBus } from './Game/EventBus';
import { PhaserGame } from './Game/PhaserGame';

const WidgetCircleBeat = ({ defaultProps }) => {
    const [songs, setSongs] = useState([]);
    const [url, setUrl] = useState('');
    const [playing, setPlaying] = useState(false);
    const phaserRef = useRef(null);
    useEffect(() => {
        EventBus.on('play', () => {
            setPlaying(true);
        });
        EventBus.on('clicked disc add', () => {
            const inputGame = document.getElementsByClassName('input-game');
            inputGame[0].style.display = 'flex';    
        });
        return () => {
            EventBus.removeAllListeners();
        };
    }, []);
    const handleAdd = () => {
        const enteredURL = document.getElementsByClassName('input-game');
        if ((/(?:https:\/\/)?(?:www\.)?(youtu(be)?|soundcloud)\.(com|be)/.test(enteredURL[0].value))) {
            setUrl(enteredURL[0].value);
            enteredURL[0].value = '';
            setSongs((prevSongs) => ([
                ...prevSongs,
                {
                    url: enteredURL,
                }
            ]));
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
                        style={{ padding: '1.9rem 1.7rem', boxSizing: 'border-box' }}
                        width={'100%'}
                        height={'100%'}
                        url={'https://youtu.be/T1VAYTEWWgM'}
                        playing={playing}
                        onReady={() => {}}
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