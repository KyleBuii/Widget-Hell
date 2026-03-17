import { memo, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { classStack, decorationValue } from '../../../data';
import { PhaserGame } from './Game/PhaserGame';

const WidgetDuckBounce = ({ defaultProps }) => {
    const phaserRef = useRef(null);

    useEffect(() => {
        defaultProps.incrementWidgetCounter();
    }, []);

    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('duckbounce')}
            onStop={(event, data) => {
                defaultProps.dragStop('duckbounce');
                defaultProps.updatePosition('duckbounce', 'games', data.x, data.y);
            }}
            cancel='button, #duckbounce-game'
            bounds='parent'>
            <section id='duckbounce-widget'
                className='widget'
                aria-labelledby='duckbounce-widget-heading'>
                <h2 id='duckbounce-widget-heading'
                    className='screen-reader-only'>Duck Bounce Widget</h2>
                <div id='duckbounce-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='duckbounce-widget-draggable'
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
                    {defaultProps.renderHotbar('duckbounce', 'games')}
                    <PhaserGame ref={phaserRef}/>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetDuckBounce);