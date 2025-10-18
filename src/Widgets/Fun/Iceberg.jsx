import React, { memo } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';

const WidgetIceberg = ({ defaultProps, icebergData }) => {
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('iceberg')}
            onStop={(event, data) => {
                defaultProps.dragStop('iceberg');
                defaultProps.updatePosition('iceberg', 'fun', data.x, data.y);
            }}
            cancel='button'
            bounds='parent'>
            <section id='iceberg-widget'
                className='widget'
                aria-labelledby='iceberg-widget-heading'>
                <h2 id='iceberg-widget-heading'
                    className='screen-reader-only'>iceberg Widget</h2>
                <div id='iceberg-widget-animation'
                    className='widget-animation custom-shape'>
                    {/* Drag Handle */}
                    <span id='iceberg-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {/* Hotbar */}
                    {defaultProps.renderHotbar('iceberg', 'fun')}
                    <div className='iceberg-template'>
                        <img src='/resources/singles/iceberg.webp'
                            alt='iceberg template'
                            draggable={false}
                            loading='lazy'
                            decoding='async'/>
                            <div className='iceberg-levels'>
                                {[...Array(19).keys()].map((key) => {
                                    return <div key={key}>
                                        Level {key + 1}
                                    </div>
                                })}
                            </div>
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

export default memo(WidgetIceberg);