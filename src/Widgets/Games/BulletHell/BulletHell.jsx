import React, { memo, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { classStack, decorationValue } from '../../../data';
import { EventBus } from './Game/EventBus';
import { PhaserGame } from './Game/PhaserGame';


const WidgetBulletHell = ({ defaultProps, gameProps }) => {
    const phaserRef = useRef(null);

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    const handleKeydown = (event) => {
        if (/87|65|83|68|37|38|39|40|16|17|32/.test(event.keyCode)) event.preventDefault();
    };

    const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.changeScene();
        };
    };

    const currentScene = (scene) => {
        if (scene.scene.key === 'Game') {
            EventBus.emit('data', {
                stats: gameProps.stats,
                abilities: gameProps.abilities
            });
        };
    };
    
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('bullethell')}
            onStop={(event, data) => {
                defaultProps.dragStop('bullethell');
                defaultProps.updatePosition('bullethell', 'games', data.x, data.y);
            }}
            cancel='button, #bullethell-game'
            bounds='parent'>
            <section id='bullethell-widget'
                className='widget'
                aria-labelledby='bullethell-widget-heading'>
                <h2 id='bullethell-widget-heading'
                    className='screen-reader-only'>Bullet Hell Widget</h2>
                <div id='bullethell-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='bullethell-widget-draggable'
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
                    {defaultProps.renderHotbar('bullethell', 'games')}
                    <PhaserGame ref={phaserRef}
                        currentActiveScene={currentScene}/>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetBulletHell);