import React, { memo, useEffect } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';


const WidgetCharacter = ({ defaultProps, punctuation, equipment }) => {
    useEffect(() => {
        window.addEventListener('equip item', addItem);
        window.addEventListener('unequip item', removeItem);
        for (let i in equipment) {
            if (equipment[i].name !== '') {
                /// Equipped items with no left and right
                if (equipment[i].name !== undefined) {
                    addItem({
                        'detail': {
                            'name': equipment[i].name,
                            'slot': i
                        }
                    });
                } else {
                    /// Left equipped item
                    if (equipment[i].left.name !== '') {
                        addItem({
                            'detail': {
                                'name': equipment[i].left.name,
                                'slot': i,
                                'side': 'left'
                            }
                        });
                    };
                    /// Right equipped item
                    if (equipment[i].right.name !== '') {
                        addItem({
                            'detail': {
                                'name': equipment[i].right.name,
                                'slot': i,
                                'side': 'right'
                            }
                        });
                    };
                };
            };
        };
        return () => {
            window.removeEventListener('equip item', addItem);
            window.removeEventListener('unequip item', removeItem);    
        };
    }, []);
    const addItem = (event) => {
        let lowerCaseRegex = new RegExp(`\\s|[${punctuation}]`, 'g');
        let modifiedName = event.detail.name.toLowerCase().replaceAll(lowerCaseRegex, '');
        let equipmentElement;
        let equipmentImage = document.createElement('img');
        equipmentImage.alt = modifiedName;
        equipmentImage.loading = 'lazy';
        equipmentImage.decoding = 'async';
        if (event.detail.side) {
            equipmentElement = document.getElementById(`character-${event.detail.slot}-${event.detail.side}`);
            equipmentImage.src = `/resources/character/character-${modifiedName}-${event.detail.side}.webp`;
        } else {
            equipmentElement = document.getElementById(`character-${event.detail.slot}`);
            equipmentImage.src = `/resources/character/character-${modifiedName}.webp`;
        };
        if (equipmentElement.hasChildNodes()) {
            equipmentElement.innerHTML = '';
        };
        equipmentImage.draggable = false;
        equipmentElement.appendChild(equipmentImage);
    };
    const removeItem = (event) => {
        let equipmentElement;
        if (event.detail.side) {
            equipmentElement = document.getElementById(`character-${event.detail.slot}-${event.detail.side}`);
        } else {
            equipmentElement = document.getElementById(`character-${event.detail.slot}`);
        };
        equipmentElement.innerHTML = '';
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('character')}
            onStop={(event, data) => {
                defaultProps.dragStop('character');
                defaultProps.updatePosition('character', 'utility', data.x, data.y);
            }}
            cancel='button'
            bounds='parent'>
            <section id='character-widget'
                className='widget'
                aria-labelledby='character-widget-heading'>
                <h2 id='character-widget-heading'
                    className='screen-reader-only'>Character Widget</h2>
                <div id='character-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='character-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('character', 'utility')}
                    {/* Character */}
                    <div id='character-container'>
                        <img id='character-image'
                            className='no-highlight'
                            src={'/resources/character/character-default.webp'}
                            alt='character'
                            draggable='false'
                            loading='lazy'
                            decoding='async'/>
                        <img id='character-image-clothes'
                            className='no-highlight'
                            src={'/resources/character/character-default-clothes.webp'}
                            alt='character clothes'
                            draggable='false'
                            loading='lazy'
                            decoding='async'/>
                        <img id='character-image-front-hair'
                            className='no-highlight'
                            src={'/resources/character/character-default-front-hair.webp'}
                            alt='character front hair'
                            draggable='false'
                            loading='lazy'
                            decoding='async'/>
                        <img id='character-image-front-hand'
                            className='no-highlight'
                            src={'/resources/character/character-default-front-hand.webp'}
                            alt='character front hand'
                            draggable='false'
                            loading='lazy'
                            decoding='async'/>
                        <div id='character-headband'></div>
                        <div id='character-eyewear'></div>
                        <div id='character-helmet'></div>
                        <div id='character-undershirt'></div>
                        <div id='character-chestplate'></div>
                        <div id='character-cape'></div>
                        <div id='character-bracelet-left'></div>
                        <div id='character-bracelet-right'></div>
                        <div id='character-wrist-left'></div>
                        <div id='character-wrist-right'></div>
                        <div id='character-belt'></div>
                        <div id='character-main'></div>
                        <div id='character-glove-left'></div>
                        <div id='character-glove-right'></div>
                        <div id='character-ring-left'></div>
                        <div id='character-ring-right'></div>
                        <div id='character-legging'></div>
                        <div id='character-offhand'></div>
                        <div id='character-hidden-left'></div>
                        <div id='character-hidden-right'></div>
                        <div id='character-boot-left'></div>
                        <div id='character-boot-right'></div>
                        <div id='character-consumable1'></div>
                        <div id='character-consumable2'></div>
                        <div id='character-consumable3'></div>
                        <div id='character-consumable4'></div>
                        <div id='character-consumable5'></div>
                        <div id='character-consumable6'></div>
                    </div>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetCharacter);