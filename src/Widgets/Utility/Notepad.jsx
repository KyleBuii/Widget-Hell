import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaBold, FaHighlighter, FaIndent, FaLink, FaLinkSlash, FaListOl, FaListUl, FaOutdent, FaRotateLeft, FaRotateRight, FaSubscript, FaSuperscript } from 'react-icons/fa6';
import { MdFormatColorText } from 'react-icons/md';


const WidgetNotepad = ({ defaultProps }) => {
    const [text, setText] = useState('');

    const refText = useRef(text);

    refText.current = text;

    useEffect(() => {
        /// Populate font size section
        let sectionFontSize = document.getElementById('notepad-section-font-size');
        for (let i = 1; i <= 7; i++) {
            let button = document.createElement('button');
            let span = document.createElement('span');
            button.className = 'button-match inverse';
            button.onclick = () => {
                handleText('fontSize', i);
            };
            span.className = 'font bold';
            span.innerText = i;
            button.appendChild(span);
            sectionFontSize.appendChild(button);
        };
        /// Load widget's data from local storage
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let localStorageSpreadsheet = dataLocalStorage['utility']['notepad'];
            if (localStorageSpreadsheet['text'] !== undefined) {
                setText(localStorageSpreadsheet['text']);
            };
        };
        return () => {
            storeData();
        };
    }, []);

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleButton = (where, what = null) => {
        let element = document.getElementById(`notepad-button-${where}`);
        if (where === 'superscript') {
            if (element.classList.contains('inversed-active')) {
                element.checked = false;
            };
        };
        if (where === 'subscript') {
            if (element.classList.contains('inversed-active')) {
                element.checked = false;
            };
        };
        element.classList.toggle('inversed-active');
        handleText(where, what);
    };

    const handleText = (where, what = null) => {
        document.execCommand(where, false, what);
    };

    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['utility']['notepad'] = {
                ...dataLocalStorage['utility']['notepad'],
                text: refText.current
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };
    
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('notepad')}
            onStop={(event, data) => {
                defaultProps.dragStop('notepad');
                defaultProps.updatePosition('notepad', 'utility', data.x, data.y);
            }}
            cancel='button, .select-match, input, label, p'
            bounds='parent'>
            <div id='notepad-widget'
                className='widget'>
                <div id='notepad-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='notepad-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('notepad', 'utility')}
                    {/* Utility Bar */}
                    <div className='flex-center row gap small-gap space-nicely space-bottom'>
                        {/* Buttons */}
                        <div className='flex-center column'>
                            {/* General */}
                            <div className='flex-center row'>
                                <button id='notepad-button-bold' 
                                    className='button-match fadded inversed'
                                    onClick={() => handleButton('bold')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaBold/>
                                    </IconContext.Provider>
                                </button>
                                <div className='radio-match inverse'>
                                    <input id='notepad-button-superscript'
                                        type='radio'
                                        name='groupScript'
                                        value='superscript'
                                        onClick={(event) => handleButton(event.target.value)}/>
                                    <label htmlFor='notepad-button-superscript'>
                                        <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                            <FaSuperscript/>
                                        </IconContext.Provider>
                                    </label>
                                </div>
                                <div className='radio-match inverse'>
                                    <input id='notepad-button-subscript'
                                        type='radio'
                                        name='groupScript'
                                        value='subscript'
                                        onClick={(event) => handleButton(event.target.value)}/>
                                    <label htmlFor='notepad-button-subscript'>
                                        <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                            <FaSubscript/>
                                        </IconContext.Provider>
                                    </label>
                                </div>
                                <button className='button-match inverse'
                                    onClick={() => handleText('insertOrderedList')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaListOl/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('insertUnorderedList')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaListUl/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('undo')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaRotateLeft/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('redo')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaRotateRight/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => {
                                        let link = prompt('Enter a URL');
                                        if(!/http/i.test(link)){
                                            link = `http://${link}`;    
                                        };
                                        handleText('createLink', `<a href='${link}'></a>`);
                                    }}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaLink/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('unlink')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaLinkSlash/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('justifyLeft')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaAlignLeft/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('justifyCenter')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaAlignCenter/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('justifyRight')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaAlignRight/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('justifyFull')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaAlignJustify/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('indent')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaIndent/>
                                    </IconContext.Provider>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('outdent')}>
                                    <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                        <FaOutdent/>
                                    </IconContext.Provider>
                                </button>
                                {/* Font Color */}
                                <div className='color-input-button'>
                                    <button className='button-match inverse'>
                                        <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                            <MdFormatColorText/>
                                        </IconContext.Provider>
                                    </button>
                                    <input type='color'
                                        onBlur={(event) => handleText('foreColor', event.target.value)}></input>
                                </div>
                                {/* Highlight Color */}
                                <div className='color-input-button'>
                                    <button className='button-match inverse'>
                                        <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                            <FaHighlighter/>
                                        </IconContext.Provider>
                                    </button>
                                    <input type='color'
                                        onBlur={(event) => handleText('backColor', event.target.value)}></input>
                                </div>
                            </div>
                            {/* Font Name */}
                            <div className='flex-center row'>
                                <button className='button-match inverse'
                                    onClick={() => handleText('fontName', 'Arial')}>
                                    <span className='font bold'>Arial</span>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('fontName', 'Verdana')}>
                                    <span className='font bold'>Verdana</span>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('fontName', 'Times New Roman')}>
                                    <span className='font bold'>Times New Roman</span>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('fontName', 'Garamond')}>
                                    <span className='font bold'>Garamond</span>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('fontName', 'Georgia')}>
                                    <span className='font bold'>Georgia</span>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('fontName', 'Courier New')}>
                                    <span className='font bold'>Courier New</span>
                                </button>
                                <button className='button-match inverse'
                                    onClick={() => handleText('fontName', 'Cursive')}>
                                    <span className='font bold'>Cursive</span>
                                </button>
                            </div>
                            {/* Headers and Font Size */}
                            <div id='notepad-section-header-and-font-size' 
                                className='flex-center row gap small-gap'>
                                <div>
                                    <button className='button-match inverse'
                                        onClick={() => handleText('formatBlock', 'H1')}>
                                        <span className='font bold'>H1</span>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => handleText('formatBlock', 'H2')}>
                                        <span className='font bold'>H2</span>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => handleText('formatBlock', 'H3')}>
                                        <span className='font bold'>H3</span>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => handleText('formatBlock', 'H4')}>
                                        <span className='font bold'>H4</span>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => handleText('formatBlock', 'H5')}>
                                        <span className='font bold'>H5</span>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => handleText('formatBlock', 'H6')}>
                                        <span className='font bold'>H6</span>
                                    </button>
                                </div>
                                <div id='notepad-section-font-size'></section>
                            </div>
                        </div>
                    </div>
                    {/* Textarea */}
                    <div className='cut-scrollbar-corner-part-1 p area-large'>
                        <p className='cut-scrollbar-corner-part-2 p area-large'
                            name='notepad-textarea-text'
                            onChange={handleChange}
                            value={state.text}
                            contentEditable='true'></p>
                    </div>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetNotepad);