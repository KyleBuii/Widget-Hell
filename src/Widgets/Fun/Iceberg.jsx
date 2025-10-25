import React, { memo, useEffect, useMemo, useState } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import Select from 'react-select';


const WidgetIceberg = ({ defaultProps, icebergData, formatGroupLabel, selectTheme, menuListScrollbar }) => {
    const [optionsIceberg, setOptionsIceberg] = useState([
        {
            label: 'Icebergs',
            options: []
        }
    ]);
    const [selectedIceberg, setSelectedIceberg] = useState({ label: '', value: 0 });
    const [selectedLevel, setSelectedLevel] = useState(0);
    const [selectedItem, setSelectedItem] = useState(0);

    const selectedEntry = useMemo(() => {
        const iceberg = Object.values(icebergData)[selectedIceberg.value];
        const level = iceberg[selectedLevel];
        const entries = Object.entries(level).filter(([key]) => key !== '_comment');
        return entries[selectedItem];
    }, [icebergData, selectedIceberg, selectedLevel, selectedItem]);

    const [title, data] = selectedEntry;

    useEffect(() => {
        const dataKeys = Object.keys(icebergData).filter((key) => key !== '_comment');
        const newOptions = [...optionsIceberg];

        for (let keyIndex = 0; keyIndex < dataKeys.length; keyIndex++) {
            newOptions[0].options.push({
                label: dataKeys[keyIndex].replace(/\b\w/g, (letter) => letter.toUpperCase()),
                value: keyIndex
            });
        };

        setOptionsIceberg(newOptions);

        const randomIceberg = newOptions[0].options[Math.floor(Math.random() * newOptions[0].options.length)];
        setSelectedIceberg(randomIceberg);
    }, []);

    const handleButton = (levelIndex, itemIndex) => {
        setSelectedLevel(levelIndex);
        setSelectedItem(itemIndex);
    };

    const handleSelect = (event) => {
        setSelectedIceberg(event);
    };

    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('iceberg')}
            onStop={(event, data) => {
                defaultProps.dragStop('iceberg');
                defaultProps.updatePosition('iceberg', 'fun', data.x, data.y);
            }}
            cancel='button, .popout, .select-match'
            bounds='parent'>
            <section id='iceberg-widget'
                className='widget'
                aria-labelledby='iceberg-widget-heading'>
                <h2 id='iceberg-widget-heading'
                    className='screen-reader-only'>Iceberg Widget</h2>
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
                    <Select className='select-match'
                        defaultValue={optionsIceberg[0]['options'][0]}
                        value={selectedIceberg}
                        options={optionsIceberg}
                        onChange={(event) => handleSelect(event)}
                        formatGroupLabel={formatGroupLabel}
                        components={{
                            MenuList: menuListScrollbar
                        }}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                ...selectTheme
                            }
                        })}/>
                    <div className='iceberg-template'>
                        <img src={'/resources/singles/iceberg.webp'}
                            alt='iceberg template'
                            draggable={false}
                            loading='lazy'
                            decoding='async'/>
                        <div className='iceberg-levels'>
                            {icebergData[Object.keys(icebergData)[selectedIceberg.value]].map((level, levelIndex) => {
                                return <div className='iceberg-level'
                                    key={`level ${levelIndex}`}>
                                    {Object.keys(level)
                                        .filter((item) => item !== '_comment')
                                        .map((item, itemIndex) => {
                                            return <button className='button-match'
                                                onClick={() => handleButton(levelIndex, itemIndex)}
                                                key={`${item} ${itemIndex}`}>
                                                {item}
                                            </button>
                                        })}
                                </div>
                            })}
                        </div>
                    </div>
                    <Draggable cancel='a'
                        position={{
                            x: defaultProps.popouts.viewItem.position.x,
                            y: defaultProps.popouts.viewItem.position.y
                        }}
                        onStop={(event, data) => defaultProps.updatePosition('iceberg', 'fun', data.x, data.y, 'popout', 'viewItem')}
                        bounds={defaultProps.calculateBounds('iceberg-widget', 'iceberg-view-item-popout')}>
                        <div id='iceberg-view-item-popout'
                            className='popout'>
                            <div className='popout-animation iceberg-view-item-popout-animation'>
                                {(data.image !== '')
                                    && <img src={`/resources/iceberg/${data.image}`}
                                        alt={title}
                                        draggable={false}
                                        loading='lazy'
                                        decoding='async'/>}
                                <span className='font bold large'>{title}</span>
                                {(data.information)
                                    && <ul className='font'>
                                        {data.information.map((item, itemIndex) => {
                                            return <li key={`information ${itemIndex}`}>
                                                {item}
                                            </li>
                                        })}
                                    </ul>}
                                <div className='flex-center row gap small-gap flex-wrap'>
                                    {Object.entries(data.source).map(([sourceName, sourceLink], sourceIndex) => {
                                        return <a className='link-match'
                                            href={sourceLink || 'https://www.youtube.com/watch?v=xvFZjo5PgG0'}
                                            referrerPolicy='no-referrer'
                                            key={`source ${sourceIndex}`}>{sourceName || 'N/A'}</a>
                                    })}
                                </div>
                            </div>
                        </div>
                    </Draggable>
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