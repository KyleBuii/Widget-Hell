/*  Template Guide
IN THIS FILE
1. [WIDGET NAME UPPER] => Widget name in title case
   Example: AnimeSearcher
2. [WIDGET SCREEN READER] => Widget name with spaces between words
   Example: Anime Searcher
3. [WIDGET ANIME LOWER] => Widget name in lower case
   Example: animesearcher
4. [WIDGET TYPE] => Widget's type
   Example: utility, games, fun
5. [AUTHOR NAME] => Author's name
   Example: Kyle Bui (that's me!)

NOT IN THIS FILE
1. Open data.jsx.
*/

import React, { memo } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';

const Widget[WIDGET NAME UPPER] = ({ defaultProps }) => {
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('[WIDGET NAME LOWER]')}
            onStop={(event, data) => {
                defaultProps.dragStop('[WIDGET NAME LOWER]');
                defaultProps.updatePosition('[WIDGET NAME LOWER]', '[WIDGET TYPE]', data.x, data.y);
            }}
            cancel='button'
            bounds='parent'>
            <section id='[WIDGET NAME LOWER]-widget'
                className='widget'
                aria-labelledby='[WIDGET NAME LOWER]-widget-heading'>
                <h2 id='[WIDGET NAME LOWER]-widget-heading'
                    className='screen-reader-only'>[WIDGET SCREEN READER] Widget</h2>
                <div id='[WIDGET NAME LOWER]-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    {/* Drag Handle */}
                    <span id='[WIDGET NAME LOWER]-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {/* Decoration */}
                    <img className={`decoration ${decorationValue}`}
                        src={`/resources/decoration/${decorationValue}.webp`}
                        alt={decorationValue}
                        key={decorationValue}
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                        loading='lazy'
                        decoding='async'/>
                    {defaultProps.renderHotbar('[WIDGET NAME LOWER]', '[WIDGET TYPE]')}
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by [AUTHOR NAME]</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(Widget[WIDGET NAME UPPER]);