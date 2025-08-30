import React, { memo, useEffect, useRef, useState } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


const weekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let clickedCellIndex;

const WidgetDailyPlanner = ({ defaultProps }) => {
    const [month, setMonth] = useState('January');
    const [cells, setCells] = useState([]);
    const [inputPlan, setInputPlan] = useState('');
    const [inputAbbr, setInputAbbr] = useState('');

    const refCells = useRef(cells);
    const refElementCells = useRef([]);

    refCells.current = cells;

    useEffect(() => {
        window.addEventListener('beforeunload', storeData);

        const now = new Date();
        const monthName = now.toLocaleString('en-US', { month: 'long' });

        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let dataDailyPlanner = dataLocalStorage['utility']['dailyplanner'];
            let dailyPlannerCells = dataDailyPlanner?.['cells'];

            if (now.getDay() === 1
                || !dailyPlannerCells
                || dailyPlannerCells.length === 0) {
                createNewCells(now);
            } else {
                setCells(dailyPlannerCells);
            };

            setMonth(monthName);
        };

        return () => {
            window.removeEventListener('beforeunload', storeData);

            storeData();
        };
    }, []);

    const createNewCells = (date) => {
        const year = date.getFullYear();
        const monthIndex = date.getMonth();

        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDay = new Date(year, monthIndex, 1).getDay();
        const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

        const prevDays = Array.from({ length: firstDay }, (_, i) => ({
            day: daysInPrevMonth - firstDay + i + 1,
            classes: 'dimmed',
        }));

        const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
        }));

        const nextDays = Array.from(
            { length: 42 - (firstDay + daysInMonth) },
            (_, i) => ({
                day: i + 1,
                classes: 'dimmed',
            })
        );

        const newCells = [...prevDays, ...currentDays, ...nextDays];

        refElementCells.current = newCells.map((_, index) => refElementCells.current[index] || null);

        setCells(newCells);
    };

    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['utility']['dailyplanner'] = {
                ...dataLocalStorage['utility']['dailyplanner'],
                cells: [...refCells.current],
            };

            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };

    const handleCellClick = (cellIndex) => {
        handlePopout('visible');

        clickedCellIndex = cellIndex;

        const elementCell = refElementCells.current[cellIndex];
        const elementPopout = document.getElementById('dailyplanner-add-popout');
        const rectElementCell = elementCell.getBoundingClientRect();
        const elementCalendar = document.getElementById('dailyplanner-widget-animation').getBoundingClientRect();

        const x = rectElementCell.left + (rectElementCell.width / 2) - elementCalendar.left;
        const y = rectElementCell.bottom - elementCalendar.top;

        elementPopout.style.transform = `translate(${x}px, ${y}px) translate(-50%, 0)`;

        document.querySelector('#dailyplanner-input-plan input').focus();
    };

    const handleCellKeyDown = (event, cellIndex) => {
        if (event.code.match(/Space|Enter/)) {
            event.preventDefault();
            handleCellClick(cellIndex);
        };
    };
    
    const handleButtonAdd = () => {
        const elementInputPlan = document.getElementById('dailyplanner-input-plan');
        const elementInputAbbr = document.getElementById('dailyplanner-input-abbr');

        if (!inputPlan || !inputAbbr) {
            if (!inputPlan) elementInputPlan.classList.add('input-incorrect');
            if (!inputAbbr) elementInputAbbr.classList.add('input-incorrect');
            return;
        };

        handlePopout('hidden');

        const cell = cells[clickedCellIndex];
        const newPlan = {
            plan: inputPlan,
            abbr: inputAbbr,
        };
        cell.plans = [...(cell.plans || []), newPlan];

        setInputPlan('');
        setInputAbbr('');
    };

    const handleSideButton = (type) => {
        const elementFocused = document.activeElement.name;

        if ((type !== 'close') && !elementFocused) return;

        const setter = (elementFocused === 'plan') ? setInputPlan : setInputAbbr;
        const actions = {
            close: () => handlePopout('hidden'),
            clear: () => setter(''),
            caps:  () => setter(inputPlan.toUpperCase()),
            lower: () => setter(inputPlan.toLowerCase()),
        };

        actions[type]?.();
    };

    const handlePopout = (type) => {
        const popoutAddPlan = document.getElementById('dailyplanner-add-popout');
        popoutAddPlan.style.visibility = type;
    };

    const handleInput = (value, type) => {
        const map = {
            plan: { set: setInputPlan, id: 'dailyplanner-input-plan' },
            abbr: { set: setInputAbbr, id: 'dailyplanner-input-abbr' }
        };

        if (!map[type]) return;

        map[type].set(value);
        document.getElementById(map[type].id).classList.remove('input-incorrect');
    };

    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('dailyplanner')}
            onStop={(event, data) => {
                defaultProps.dragStop('dailyplanner');
                defaultProps.updatePosition('dailyplanner', 'utility', data.x, data.y);
            }}
            cancel='button, .popout, .calendar-cell'
            bounds='parent'>
            <section id='dailyplanner-widget'
                className='widget'
                aria-labelledby='dailyplanner-widget-heading'>
                <h2 id='dailyplanner-widget-heading'
                    className='screen-reader-only'>dailyplanner Widget</h2>
                <div id='dailyplanner-widget-animation'
                    className='widget-animation custom-shape'>
                    {/* Drag Handle */}
                    <span id='dailyplanner-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    <div className='calendar'>
                        <span className='calendar-month'>{month}</span>
                        {weekLabels.map((week) => {
                            return <span className='calendar-label'
                                key={week}>{week}</span>
                        })}
                        {cells.map((cell, cellIndex) => {
                            return <div ref={(element) => refElementCells.current[cellIndex] = element}
                                className={`calendar-cell ${cell.classes} flex-center column only-justify-content`}
                                role='button'
                                onClick={() => handleCellClick(cellIndex)}
                                onKeyDown={(event) => handleCellKeyDown(event, cellIndex)}
                                key={`cell ${cellIndex}`}
                                tabIndex={0}>
                                <span>{cell.day}</span>
                                <div className='scrollable flex-center column only-align-items gap'
                                    style={{ margin: '0.3rem' }}>
                                    {cell.plans?.map((plan, planIndex) => {
                                        return <div className='calendar-plan'
                                            key={`plan ${planIndex} ${plan.abbr}`}>
                                            <span>{plan.abbr}</span>
                                        </div>
                                    })}
                                </div>
                            </div>
                        })}
                    </div>
                    <div className='popout'>
                        <div id='dailyplanner-add-popout'
                            className='dialogue popout-animation flex-center row gap medium-gap'>
                            <div className='flex-center column gap medium-gap'>
                                <fieldset id='dailyplanner-input-plan'
                                    className='input-fieldset'>
                                    <legend>Plan</legend>
                                    <input value={inputPlan}
                                        name='plan'
                                        type='text'
                                        onChange={(event) => handleInput(event.target.value, 'plan')}/>
                                </fieldset>
                                <fieldset id='dailyplanner-input-abbr'
                                    className='input-fieldset'>
                                    <legend>Abbreviation</legend>
                                    <input value={inputAbbr}
                                        name='abbr'
                                        type='text'
                                        maxLength={9}
                                        onChange={(event) => handleInput(event.target.value, 'abbr')}/>
                                </fieldset>
                                <button className='button-match fill-width'
                                    type='button'
                                    onClick={handleButtonAdd}>Add</button>
                            </div>
                            <div className='flex-center column'
                                style={{ gap: '0.5rem' }}>
                                <button className='button-match fill-width'
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSideButton('close')}>Close</button>
                                <button className='button-match fill-width'
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSideButton('clear')}>Clear</button>
                                <button className='button-match fill-width'
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSideButton('caps')}>Caps</button>
                                <button className='button-match fill-width'
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSideButton('lower')}>Lower</button>
                            </div>
                        </div>
                    </div>
                    {/* Hotbar */}
                    {defaultProps.renderHotbar('dailyplanner', 'utility')}
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetDailyPlanner);