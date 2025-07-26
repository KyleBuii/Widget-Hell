import React, { memo, useEffect } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';

const WidgetGuide = ({ defaultProps }) => {
    useEffect(() => {
        const pages = document.getElementsByClassName('page');

        document.documentElement.style.setProperty('--bookmarkIndex', pages.length - 1);

        for(var i = 0; i < pages.length; i++) {
            let page = pages[i];

            if (i % 2 === 0) {
                page.style.zIndex = (pages.length - i);
            };

            pages[i].pageNum = i + 1;
            pages[i].onclick = (element) => {
                const page = element.currentTarget;

                if (page.pageNum % 2 === 0) {
                    page.classList.remove('flipped');
                    page.previousElementSibling.classList.remove('flipped');
                } else {
                    page.classList.add('flipped');
                    page.nextElementSibling.classList.add('flipped');
                };
            };
        };
    }, []);

    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('guide')}
            onStop={(event, data) => {
                defaultProps.dragStop('guide');
                defaultProps.updatePosition('guide', 'utility', data.x, data.y);
            }}
            cancel='button, .pages'
            bounds='parent'>
            <section id='guide-widget'
                className='widget'
                aria-labelledby='guide-widget-heading'>
                <h2 id='guide-widget-heading'
                    className='screen-reader-only'>Guide Widget</h2>
                <div id='guide-widget-animation'
                    className='widget-animation custom-shape book'>
                    {/* Drag Handle */}
                    <span id='guide-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-className-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {/* Hotbar */}
                    {defaultProps.renderHotbar('guide', 'utility')}
                    <div className='bookmark'>
                        {[...'BOOKMARK'].map((letter, index) => {
                            return <span key={`${letter} ${index}`}>{letter}</span>
                        })}
                    </div>
                    <div className='pages'>
                        <div className='page'>
                            {/* Author */}
                            {(defaultProps.values.authorNames)
                                ? <span className='font smaller transparent-normal author-name'>Created by [AUTHOR NAME]</span>
                                : <></>}
                        </div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                        <div className='page'></div>
                    </div>
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetGuide);