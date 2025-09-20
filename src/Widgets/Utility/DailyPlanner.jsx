import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import Select from 'react-select';


const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let maxLength = 9;
let isPopoutOpen = false;
let isPopoutFutureOpen = false;
let clickedCellIndex, clickedPlanIndex;

const WidgetDailyPlanner = ({ defaultProps, formatGroupLabel, menuListScrollbar, selectTheme }) => {
    const [month, setMonth] = useState('January');
    const [cells, setCells] = useState([]);
    const [inputPlan, setInputPlan] = useState('');
    const [inputAbbr, setInputAbbr] = useState('');
    const [planAbbr, setPlanAbbr] = useState('');
    const [planDesc, setPlanDesc] = useState('');
    const [futurePlanMonth, setFuturePlanMonth] = useState(null);
    const [futurePlanDay, setFuturePlanDay] = useState(0);
    const [futurePlanAbbr, setFuturePlanAbbr] = useState('');
    const [futurePlanDesc, setFuturePlanDesc] = useState('');
    const [inputFuturePlanMonth, setInputFuturePlanMonth] = useState(null);
    const [inputFuturePlanDay, setInputFuturePlanDay] = useState(1);
    const [inputFuturePlanAbbr, setInputFuturePlanAbbr] = useState('');
    const [inputFuturePlanDesc, setInputFuturePlanDesc] = useState('');
    const [futurePlans, setFuturePlans] = useState({});
    const [optionsMonth, setOptionsMonth] = useState([
        {
            label: 'Months',
            options: []
        }
    ]);

    const refCells = useRef(cells);
    const refElementCells = useRef([]);
    const refIsHolding = useRef(false);
    const refSidePanel = useRef(null);
    const refSelectMonth = useRef(null);
    const refFuturePlan = useRef(null);
    const refFuturePlans = useRef(futurePlans);
    const refInputFuturePlanDay = useRef(null);
    const refInputFuturePlanAbbr = useRef(null);
    const refInputFuturePlanDesc = useRef(null);

    refCells.current = cells;
    refFuturePlans.current = futurePlans;

    useEffect(() => {
        window.addEventListener('beforeunload', storeData);

        const now = new Date();
        const nowMonth = now.getMonth();

        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let dataDailyPlanner = dataLocalStorage['utility']['dailyplanner'];
            let dailyPlannerCells = dataDailyPlanner?.['cells'];
            let dailyPlannerMonth = dataDailyPlanner?.['month'];

            if (dailyPlannerMonth !== nowMonth
                || !dailyPlannerCells
                || dailyPlannerCells.length === 0) {
                createNewCells(now);
            } else {
                setCells(dailyPlannerCells);
                setMonth(monthLabels[dailyPlannerMonth]);
            };

            if (dataDailyPlanner['futurePlans']) {
                setFuturePlans(dataDailyPlanner['futurePlans']);
            };
        };

        populateSelect(nowMonth);

        setInputFuturePlanMonth(optionsMonth[0]['options'][nowMonth + 1]);

        return () => {
            window.removeEventListener('beforeunload', storeData);

            storeData();
        };
    }, []);

    const createNewCells = (date) => {
        const monthName = date.toLocaleString('en-US', { month: 'long' });

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
        setMonth(monthName);

        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['utility']['dailyplanner'] = {
                ...dataLocalStorage['utility']['dailyplanner'],
                month: date.getMonth(),
            };

            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };

    const populateSelect = (currentMonth) => {
        const copyOptions = [...optionsMonth];
        const selectOptions = copyOptions[0]['options'];

        for (let monthIndex in monthLabels) {
            selectOptions.push({
                label: monthLabels[monthIndex],
                value: monthIndex,
                isDisabled: (monthIndex <= currentMonth) ? true : false,
            });
        };

        setOptionsMonth(copyOptions);
    };

    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['utility']['dailyplanner'] = {
                ...dataLocalStorage['utility']['dailyplanner'],
                cells: [...refCells.current],
                futurePlans: {...refFuturePlans.current},
            };

            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };

    const handlePlanClick = (event, cellIndex, planIndex) => {
        event.stopPropagation();

        if (refIsHolding.current) {
            refIsHolding.current = false;
            return;
        };

        if ((clickedPlanIndex === planIndex) && (clickedCellIndex === cellIndex)) {
            isPopoutOpen = !isPopoutOpen;
        } else {
            clickedPlanIndex = planIndex;
            clickedCellIndex = cellIndex;
            isPopoutOpen = true;

            const clickedPlan = cells[cellIndex].plans[planIndex];
            setPlanAbbr(clickedPlan.abbr);
            setPlanDesc(clickedPlan.plan);
        };

        handlePopout(
            'view',
            isPopoutOpen ? 'visible' : 'hidden',
            cellIndex,
            planIndex
        );
    };

    const handleCellClick = (cellIndex) => {
        if ((clickedCellIndex === cellIndex) && (clickedPlanIndex === null)) {
            isPopoutOpen = !isPopoutOpen;
        } else {
            clickedCellIndex = cellIndex;
            clickedPlanIndex = null;
            isPopoutOpen = true;
        };

        handlePopout(
            'add',
            isPopoutOpen ? 'visible' : 'hidden',
            cellIndex
        );
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
            close: () => {
                handlePopout(type, 'hidden');
                isPopoutOpen = !isPopoutOpen;
            },
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

    const markPlan = (event, isCompleted = true) => {
        const plan = event.currentTarget;

        const onAnimationEnd = () => {
            plan.classList.remove('holding');
            plan.classList.toggle('completed');
            plan.removeEventListener('animationend', onAnimationEnd);
            refIsHolding.current = true;
        };

        if (isCompleted) {
            plan.classList.add('holding');
            plan.addEventListener('animationend', onAnimationEnd);
        } else {
            plan.classList.remove('holding');
            plan.removeEventListener('animationend', onAnimationEnd);
        };
    };

    const handleButtonFuturePlan = (event) => {
        const elementSidePanel = refSidePanel.current;
        const elementButton = event.currentTarget;
        const elementPopout = refFuturePlan.current;

        if (elementSidePanel.checkVisibility()) {
            elementPopout.style.visibility = 'hidden';
            isPopoutFutureOpen = false;
        };

        elementButton.classList.toggle('show');
        elementSidePanel.classList.toggle('show');
    };
    
    const handleFuturePlanClick = (event, abbr, plan, month, day) => {
        if (isPopoutFutureOpen && (futurePlanAbbr === abbr) && (futurePlanDesc === plan) && (futurePlanMonth === month) && (futurePlanDay === day)) {
            refFuturePlan.current.style.visibility = 'hidden';
            isPopoutFutureOpen = false;
            return;
        };

        refFuturePlan.current.style.visibility = 'visible';

        isPopoutFutureOpen = true;

        setFuturePlanAbbr(abbr);
        setFuturePlanDesc(plan);
        setFuturePlanMonth(month);
        setFuturePlanDay(day);

        const elementPlan = event.currentTarget.getBoundingClientRect();
        const elementCalendar = document.getElementById('dailyplanner-widget-animation').getBoundingClientRect();

        const x = elementPlan.left + (elementPlan.width / 2) - elementCalendar.left;
        let y = elementPlan.bottom - elementCalendar.top + 20;

        refFuturePlan.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, 0)`;
    };

    const handleButtonsFuturePlan = (what) => {
        const actions = {
            show: () => {
                const elementSidePanelButtons = document.querySelector('.dailyplanner-side-panel-buttons');
                elementSidePanelButtons.classList.toggle('show');
            },
            add: () => {
                const elementInputDay = refInputFuturePlanDay.current;
                const elementInputDesc = refInputFuturePlanDesc.current;
                const elementInputAbbr = refInputFuturePlanAbbr.current;

                if (!inputFuturePlanDay
                    || !inputFuturePlanDesc
                    || !inputFuturePlanAbbr
                ) {
                    if (!inputFuturePlanDay || inputFuturePlanDay < 1) elementInputDay.classList.add('input-incorrect');
                    if (!inputFuturePlanDesc) elementInputDesc.classList.add('input-incorrect');
                    if (!inputFuturePlanAbbr) elementInputAbbr.classList.add('input-incorrect');
                    return;
                };

                const newFuturePlans = {
                    ...futurePlans
                };
                const monthLabel = monthLabels[inputFuturePlanMonth.value];

                newFuturePlans[monthLabel] = [
                    ...(newFuturePlans[monthLabel] || []),
                    {
                        plan: inputFuturePlanDesc,
                        abbr: inputFuturePlanAbbr,
                        month: inputFuturePlanMonth,
                        day: inputFuturePlanDay,   
                    }
                ];

                setFuturePlans(newFuturePlans);
            },
            close: () => {
                refFuturePlan.current.style.visibility = 'hidden';
                isPopoutFutureOpen = false;
            },
            delete: () => {},
        };

        actions[what]?.();
    };

    const handleInputFuturePlan = (event, what) => {
        const value = event.target.value;
        const setter = {
            day: setInputFuturePlanDay,
            desc: setInputFuturePlanDesc,
            abbr: setInputFuturePlanAbbr,
        };

        setter[what]?.(value);
    };

    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('dailyplanner')}
            onStop={(event, data) => {
                defaultProps.dragStop('dailyplanner');
                defaultProps.updatePosition('dailyplanner', 'utility', data.x, data.y);
            }}
            cancel='button, input, .popout, .calendar-cell, .select-match, .dailyplanner-side-panel, .dailyplanner-side-panel-button'
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
                    <div className='flex-center row'
                        style={{ alignItems: 'flex-end' }}>
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
                                                onMouseDown={(event) => markPlan(event)}
                                                onMouseUp={(event) => markPlan(event, false)}
                                                key={`plan ${planIndex} ${plan.abbr}`}
                                                tabIndex={0}>
                                                <span>{plan.abbr}</span>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            })}
                        </div>
                        {/* Side Panel */}
                        <span className='dailyplanner-side-panel-button'
                            role='button'
                            onClick={(event) => handleButtonFuturePlan(event)}>Future Plans</span>
                        <div ref={refSidePanel}
                            className='dailyplanner-side-panel'>
                            <div className='dailyplanner-side-panel-plans'>
                                {Object.entries(futurePlans).map((month) => {
                                    return <div className='fill-width'
                                        key={month[0]}>
                                        <span className='font transparent-bold'>{month[0]}</span>
                                        <div className='flex-center column gap'
                                            style={{ marginTop: '0.2rem' }}>
                                            {month[1].map((plan, planIndex) => {
                                                return <div className='calendar-plan'
                                                    onClick={(event) => handleFuturePlanClick(event, plan.abbr, plan.plan, plan.month, plan.day)}
                                                    role='button'
                                                    key={`${plan.plan} ${plan.month} ${plan.day} ${planIndex}`}
                                                    tabIndex={0}>
                                                    <span>{plan.abbr}</span>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div className='flex-center column gap'>
                                <div className='dailyplanner-side-panel-buttons'>
                                    <div className='grid col-50-50'>
                                        <Select ref={refSelectMonth}
                                            className='select-match'
                                            value={inputFuturePlanMonth}
                                            options={optionsMonth}
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
                                            })}
                                            onChange={setInputFuturePlanMonth}/>
                                        <input ref={refInputFuturePlanDay}
                                            className='input-match'
                                            style={{ maxWidth: '6.3rem' }}
                                            value={inputFuturePlanDay}
                                            type='number'
                                            min={1}
                                            max={20}
                                            placeholder='Day'
                                            onChange={(event) => handleInputFuturePlan(event, 'day')}/>
                                    </div>
                                    <input ref={refInputFuturePlanDesc}
                                        className='input-match fill-width'
                                        type='text'
                                        value={inputFuturePlanDesc}
                                        placeholder='Plan'
                                        onChange={(event) => handleInputFuturePlan(event, 'desc')}/>
                                    <input ref={refInputFuturePlanAbbr}
                                        className='input-match fill-width'
                                        type='text'
                                        value={inputFuturePlanAbbr}
                                        maxLength={maxLength}
                                        placeholder='Abbreviation'
                                        onChange={(event) => handleInputFuturePlan(event, 'abbr')}/>
                                    <button className='button-match fill-width'
                                        onClick={() => handleButtonsFuturePlan('add')}>Add</button>
                                </div>
                                <div className='fill-width'
                                    style={{ paddingTop: '1rem' }}>
                                    <button className='button-match fill-width'
                                        onClick={() => handleButtonsFuturePlan('show')}>Add Plan</button>
                                </div>
                            </div>
                        </div>
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
                    {/* View Future Plan Popout */}
                    <div ref={refFuturePlan}
                        className='popout'>
                        <div className='popout-animation dialogue dailyplanner-view-future-popout'>
                            <div className='font small transparent-bold flex-center row only-align-items'>
                                <span contentEditable
                                    suppressContentEditableWarning
                                    onBeforeInput={(event) => handleEditInput('abbr', event)}
                                    onBlur={(event) => handleEdit('abbr', event)}>{futurePlanMonth?.value}</span>
                                <span>&nbsp;/&nbsp;</span>
                                <span contentEditable
                                    suppressContentEditableWarning
                                    onBeforeInput={(event) => handleEditInput('abbr', event)}
                                    onBlur={(event) => handleEdit('abbr', event)}>{futurePlanDay}</span>
                            </div>
                            <span className='font bold large'
                                contentEditable
                                suppressContentEditableWarning
                                onBeforeInput={(event) => handleEditInput('abbr', event)}
                                onBlur={(event) => handleEdit('abbr', event)}>{futurePlanAbbr}</span>
                            <span contentEditable
                                suppressContentEditableWarning
                                onBeforeInput={(event) => handleEditInput('plan', event)}
                                onBlur={(event) => handleEdit('plan', event)}>{futurePlanDesc}</span>
                            <div className='grid col-50-50'
                                style={{ marginTop: '0.6rem' }}>
                                <button className='button-match'
                                    onClick={() => handleButtonsFuturePlan('close')}>Close</button>
                                <button className='button-match'
                                    onClick={() => handleButtonsFuturePlan('delete')}>Delete</button>
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