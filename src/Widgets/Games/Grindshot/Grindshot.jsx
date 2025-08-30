import React, { memo, useRef } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { EventBus } from './Game/EventBus';
import { PhaserGame } from './Game/PhaserGame';

const WidgetGrindshot = ({ defaultProps, gameProps }) => {
    const phaserRef = useRef(null);

    const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.changeScene();
        }; 
    };

    const currentScene = (scene) => {
        if (scene.scene.key === 'Game') {
            EventBus.emit('data', gameProps.stats);
        };
    };
    
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('grindshot')}
            onStop={(event, data) => {
                defaultProps.dragStop('grindshot');
                defaultProps.updatePosition('grindshot', 'games', data.x, data.y);
            }}
            cancel='button, #grindshot-game'
            bounds='parent'>
            <section id='grindshot-widget'
                className='widget'
                aria-labelledby='grindshot-widget-heading'>
                <h2 id='grindshot-widget-heading'
                    className='screen-reader-only'>Grindshot Widget</h2>
                <div id='grindshot-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='grindshot-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('grindshot', 'games')}
                    <PhaserGame ref={phaserRef}
                        currentActiveScene={currentScene}/>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetGrindshot);