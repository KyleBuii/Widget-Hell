import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import ReactPlayer from 'react-player';


let playedIndexs = [];

const WidgetMotivation = ({ defaultProps, motivationVideos }) => {
    const [videoIndex, setVideoIndex] = useState(0);

    useEffect(() => {
        playedIndexs = [...Array(motivationVideos.length).keys()];
        getRandomIndex();
    }, []);

    const getRandomIndex = () => {
        if (playedIndexs.length === 0) playedIndexs = [...Array(motivationVideos.length).keys()];

        const index = playedIndexs.splice(Math.floor(Math.random() * playedIndexs.length), 1)[0];
        setVideoIndex(index);
    };

    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('motivation')}
            onStop={(event, data) => {
                defaultProps.dragStop('motivation');
                defaultProps.updatePosition('motivation', 'utility', data.x, data.y);
            }}
            cancel='button, #motivation-player'
            bounds='parent'>
            <section id='motivation-widget'
                className='widget'
                aria-labelledby='motivation-widget-heading'>
                <h2 id='motivation-widget-heading'
                    className='screen-reader-only'>motivation Widget</h2>
                <div id='motivation-widget-animation'
                    className='widget-animation custom-shape'>
                    {/* Drag Handle */}
                    <span id='motivation-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {/* Hotbar */}
                    {defaultProps.renderHotbar('motivation', 'utility')}
                    <img src='/resources/singles/theatre.webp'
                        alt='theatre'
                        draggable={false}/>
                    <ReactPlayer id='motivation-player'
                        url={`www.youtube.com/watch?v=${motivationVideos[videoIndex]}`}
                        height={'46%'}
                        width={'62%'}
                        playing={true}
                        onEnded={getRandomIndex}
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
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetMotivation);