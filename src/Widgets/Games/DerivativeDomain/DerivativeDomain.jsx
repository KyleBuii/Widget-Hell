import React, { memo, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { classStack, decorationValue } from '../../../data';
import { EventBus } from './Game/EventBus';
import { PhaserGame } from './Game/PhaserGame';


const WidgetDerivativeDomain = ({ defaultProps, gameProps, parentRef }) => {
    const phaserRef = useRef(null);
    const { stats, abilities } = parentRef.state;

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        defaultProps.incrementWidgetCounter();

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    useEffect(() => {
        EventBus.emit('new stats', {
            data: stats
        });
    }, [stats]);

    useEffect(() => {
        EventBus.emit('new abilities', {
            data: abilities
        });
    }, [abilities]);

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
            onStart={() => defaultProps.dragStart('derivativedomain')}
            onStop={(event, data) => {
                defaultProps.dragStop('derivativedomain');
                defaultProps.updatePosition('derivativedomain', 'games', data.x, data.y);
            }}
            cancel='button, #derivativedomain-game'
            bounds='parent'>
            <section id='derivativedomain-widget'
                className='widget'
                aria-labelledby='derivativedomain-widget-heading'>
                <h2 id='derivativedomain-widget-heading'
                    className='screen-reader-only'>Derivative Domain Widget</h2>
                <div id='derivativedomain-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='derivativedomain-widget-draggable'
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
                    {defaultProps.renderHotbar('derivativedomain', 'games')}
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

export default memo(WidgetDerivativeDomain);