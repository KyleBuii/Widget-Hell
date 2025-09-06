import React, { memo, useEffect, useRef, useState } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


const weekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let maxLength = 9;
let clickedCellIndex, clickedPlanIndex;

const WidgetDailyPlanner = ({ defaultProps }) => {
    const [month, setMonth] = useState('January');
    const [cells, setCells] = useState([]);
    const [inputPlan, setInputPlan] = useState('');
    const [inputAbbr, setInputAbbr] = useState('');
    const [planAbbr, setPlanAbbr] = useState('');
    const [planDesc, setPlanDesc] = useState('');

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

    const handlePlanClick = (event, cellIndex, planIndex) => {
        event.stopPropagation();

        clickedCellIndex = cellIndex;
        clickedPlanIndex = planIndex;

        const clickedPlan = cells[cellIndex].plans[planIndex];

        setPlanAbbr(clickedPlan.abbr);
        setPlanDesc(clickedPlan.plan);

        handlePopout('view', 'visible', cellIndex, planIndex);
    };

    const handleCellClick = (cellIndex) => {
        handlePopout('add', 'visible', cellIndex);

        clickedCellIndex = cellIndex;
    };

    const handlePopout = (type, value, cellIndex = 0, planIndex = 0) => {
        const elementPopout = document.querySelector(`.dailyplanner-${type}-popout`);
        elementPopout.style.visibility = value;

        if (value === 'hidden') return;

        const otherPopout = document.querySelector(`.dailyplanner-${(type === 'add') ? 'view' : 'add'}-popout`);
        if (otherPopout.checkVisibility()) otherPopout.style.visibility = 'hidden';

        const elementCell = refElementCells.current[cellIndex];
        const elementPlan = elementCell.querySelector('div').children[planIndex];
        const rectElement = ((type === 'add') ? elementCell : elementPlan).getBoundingClientRect();
        const elementCalendar = document.getElementById('dailyplanner-widget-animation').getBoundingClientRect();

        const x = rectElement.left + (rectElement.width / 2) - elementCalendar.left;
        let y = rectElement.bottom - elementCalendar.top;

        if (type === 'add') {
            document.querySelector('#dailyplanner-input-plan input').focus();
        } else {
            y += 25;
        };

        elementPopout.style.transform = `translate(${x}px, ${y}px) translate(-50%, 0)`;
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

        handlePopout('add', 'hidden');

        const newCells = [...refCells.current];
        const cell = newCells[clickedCellIndex];
        const newPlan = {
            plan: inputPlan,
            abbr: inputAbbr,
        };
        cell.plans = [...(cell.plans || []), newPlan];

        setCells(newCells);
        setInputPlan('');
        setInputAbbr('');
    };

    const handleButton = (type, value) => {
        const elementFocused = document.activeElement.name;

        if ((type === 'add') && (value !== 'close') && !elementFocused) return;

        const setter = (elementFocused === 'plan') ? setInputPlan : setInputAbbr;
        const currentValue = (elementFocused === 'plan') ? inputPlan : inputAbbr;
        const actions = {
            close: () => handlePopout(type, 'hidden'),
            clear: () => setter(''),
            caps:  () => setter(currentValue.toUpperCase()),
            lower: () => setter(currentValue.toLowerCase()),

            delete: () => {
                const newCells = [...cells];
                newCells[clickedCellIndex]['plans'].splice(clickedPlanIndex, 1);

                setCells(newCells);

                document.querySelector('.dailyplanner-view-popout').style.visibility = 'hidden';
            },
        };

        actions[value]?.();
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

    const handleEdit = (type, event) => {
        const newCells = [...cells];
        newCells[clickedCellIndex]['plans'][clickedPlanIndex][type] = event.currentTarget.innerText;

        setCells(newCells);
    };

    const handleEditInput = (type, event) => {
        const text = event.currentTarget.innerText;
        const selection = window.getSelection();
        const rangeLength = selection.toString().length;

        if ((type === 'abbr')
            && (text.length >= maxLength)
            && (rangeLength === 0)
        ) {
            event.preventDefault();
        };
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
                                className={`calendar-cell ${cell?.classes || ''} flex-center column only-justify-content`}
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
                                            role='button'
                                            onClick={(event) => handlePlanClick(event, cellIndex, planIndex)}
                                            key={`plan ${planIndex} ${plan.abbr}`}
                                            tabIndex={0}>
                                            <span>{plan.abbr}</span>
                                        </div>
                                    })}
                                </div>
                            </div>
                        })}
                    </div>
                    {/* Add Plan Popout */}
                    <div className='popout'>
                        <div className='popout-animation dialogue dailyplanner-add-popout'>
                            <fieldset id='dailyplanner-input-plan'
                                className='input-fieldset'>
                                <legend>Plan</legend>
                                <input value={inputPlan}
                                    name='plan'
                                    type='text'
                                    autoComplete='off'
                                    onChange={(event) => handleInput(event.target.value, 'plan')}/>
                            </fieldset>
                            <fieldset id='dailyplanner-input-abbr'
                                className='input-fieldset'>
                                <legend>Abbreviation</legend>
                                <input value={inputAbbr}
                                    name='abbr'
                                    type='text'
                                    maxLength={maxLength}
                                    autoComplete='off'
                                    onChange={(event) => handleInput(event.target.value, 'abbr')}/>
                            </fieldset>
                            <div className='flex-center row'
                                style={{ gap: '0.5rem' }}>
                                <button className='button-match fill-width'
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleButton('add', 'close')}>Close</button>
                                <button className='button-match fill-width'
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleButton('add', 'caps')}>Caps</button>
                                <button className='button-match fill-width'
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleButton('add', 'lower')}>Lower</button>
                                <button className='button-match fill-width'
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleButton('add', 'clear')}>Clear</button>
                            </div>
                            <button className='button-match fill-width'
                                type='button'
                                onClick={handleButtonAdd}>Add</button>
                        </div>
                    </div>
                    {/* View Plan Popout */}
                    <div className='popout'>
                        <div className='popout-animation dialogue dailyplanner-view-popout'>
                            <span className='font bold large'
                                contentEditable
                                suppressContentEditableWarning
                                onBeforeInput={(event) => handleEditInput('abbr', event)}
                                onBlur={(event) => handleEdit('abbr', event)}>{planAbbr}</span>
                            <span contentEditable
                                suppressContentEditableWarning
                                onBeforeInput={(event) => handleEditInput('plan', event)}
                                onBlur={(event) => handleEdit('plan', event)}>{planDesc}</span>
                            <div className='grid col-50-50'
                                style={{ marginTop: '0.6rem' }}>
                                <button className='button-match'
                                    onClick={() => handleButton('view', 'close')}>Close</button>
                                <button className='button-match'
                                    onClick={() => handleButton('view', 'delete')}>Delete</button>
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