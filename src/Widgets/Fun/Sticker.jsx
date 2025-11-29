import React, { memo, useEffect } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { classStack, decorationValue } from '../../data';

const WidgetSticker = ({ defaultProps, parentRef }) => {
    useEffect(() => {
        const refStickers = parentRef.state.stickers;

        if (refStickers.length !== 0){
            for (let i = 0; i < refStickers.length; i+=2) {
                createPositionEditor(refStickers[i], refStickers[i + 1]);
            };
        };
    }, []);

    const handleFile = () => {
        const elementInput = document.getElementById('sticker-file');
        if (elementInput.files.length !== 0) {
            const reader = new FileReader();
            reader.onload = () => {
                const elementWidgetContainer = document.getElementById('widget-container');
                let elementImage = document.createElement('img');
                elementImage.src = reader.result;
                elementImage.alt = `uploaded image ${reader.fileName}`;
                elementImage.draggable = false;
                elementImage.loading = 'lazy';
                elementImage.decoding = 'async';
                elementImage.style.position = 'absolute';
                elementImage.style.top = '0';
                elementImage.style.left = '0';
                elementImage.style.zIndex = '1';
                elementWidgetContainer.appendChild(elementImage);
                createPositionEditor(reader.fileName, elementImage);
                parentRef.updateStickers('add', reader.fileName
                    .substring(0, 50)
                    .replace(/^./, (char) => char.toUpperCase())
                    .replace(/(.(jpe?g|gif|png|tiff?|webp|bmp))$/, ''),
                    elementImage);
            };
            reader.readAsDataURL(elementInput.files[0]);
            reader.fileName = elementInput.files[0].name;
        };
    };

    const handleFileKeyDown = (event) => {
        if (event.code.match(/Space|Enter/)) {
            event.preventDefault();
            document.getElementById('sticker-file').click();
        };
    };

    const handlePosition = (childIndex, coordinate, event) => {
        const elementWidgetContainer = document.getElementById('widget-container');
        let maxSize = elementWidgetContainer.getBoundingClientRect();
        if (event.target.value !== '') {
            const elementWidgetContainer = document.getElementById('widget-container');
            let sticker = elementWidgetContainer.children[childIndex];
            if (coordinate === 'x') {
                if (event.target.value < maxSize.width) {
                    sticker.style.left = `${event.target.value}px`;
                } else {
                    sticker.style.left = `${maxSize.width - 1}px`;
                };
            };
            if (coordinate === 'y') {
                if (event.target.value < maxSize.height) {
                    sticker.style.top = `${event.target.value}px`;
                } else {
                    sticker.style.top = `${maxSize.height - 1}px`;
                };
            };
        };
    };

    const createPositionEditor = (fileName, image) => {
        const elementWidgetContainer = document.getElementById('widget-container');
        const elementStickersContainer = document.getElementById('sticker-stickers');
        let maxSize = elementWidgetContainer.getBoundingClientRect();
        /// Name
        let elementName = document.createElement('span');
        let pretierName = fileName
            .substring(0, 50)
            .replace(/^./, (char) => char.toUpperCase())
            .replace(/(.(jpe?g|gif|png|tiff?|webp|bmp))$/, '');
        elementName.innerText = pretierName;
        /// Input: x
        let elementInputX = document.createElement('input');
        elementInputX.className = 'input-match';
        elementInputX.type = 'number';
        elementInputX.max = maxSize.width;
        elementInputX.name = `sticker-stickers-x-${fileName}`;
        elementInputX.oninput = (event) => {
            handlePosition(
                Array.from(elementWidgetContainer.children).indexOf(image),
                'x',
                event);
        };
        elementInputX.placeholder = 'x';
        /// Input: y
        let elementInputY = document.createElement('input');
        elementInputY.className = 'input-match';
        elementInputY.type = 'number';
        elementInputY.max = maxSize.height;
        elementInputY.name = `sticker-stickers-y-${fileName}`;
        elementInputY.oninput = (event) => {
            handlePosition(
                Array.from(elementWidgetContainer.children).indexOf(image),
                'y',
                event);
        };
        elementInputY.placeholder = 'y';
        /// Delete button
        let elementDelete = document.createElement('button');
        elementDelete.className = 'button-match';
        elementDelete.innerText = 'X';
        elementDelete.onclick = () => {
            elementWidgetContainer.removeChild(image);
            elementStickersContainer.removeChild(elementName);
            elementStickersContainer.removeChild(elementInputX);
            elementStickersContainer.removeChild(elementInputY);
            elementStickersContainer.removeChild(elementDelete);
            parentRef.updateStickers('remove', pretierName);
        };
        elementStickersContainer.append(elementName, elementInputX, elementInputY, elementDelete);
    };
    
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('sticker')}
            onStop={(event, data) => {
                defaultProps.dragStop('sticker');
                defaultProps.updatePosition('sticker', 'fun', data.x, data.y);
            }}
            cancel='label, input, button, span'
            bounds='parent'>
            <section id='sticker-widget'
                className='widget'
                aria-labelledby='sticker-widget-heading'>
                <h2 id='sticker-widget-heading'
                    className='screen-reader-only'>Sticker Widget</h2>
                <div id='sticker-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='sticker-widget-draggable'
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
                    {defaultProps.renderHotbar('sticker', 'fun')}
                    <div className='flex-center column gap small-gap'>
                        {/* File Upload Button */}
                        <div className='file-input-match fill-width'>
                            <input id='sticker-file'
                                type='file'
                                name='sticker-file'
                                onChange={handleFile}
                                onClick={(event) => {event.target.value = null}}/>
                            <label htmlFor='sticker-file'
                                onKeyDown={(event) => handleFileKeyDown(event)}
                                tabIndex={0}>Upload image</label>
                        </div>
                        {/* Stickers */}
                        <div id='sticker-stickers'
                            className='font'></div>
                    </div>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetSticker);