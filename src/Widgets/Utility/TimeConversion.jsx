import { DateTime } from 'luxon';
import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { classStack, decorationValue } from '../../data';

const optionTimeZones = [
    { value: 'America/Denver'    , label: 'MST'  },
    { value: 'America/New_York'  , label: 'EST'  },
    { value: 'Asia/Kolkata'      , label: 'IST'  },
    { value: 'Asia/Seoul'        , label: 'KST'  },
    { value: 'Asia/Shanghai'     , label: 'CST'  },
    { value: 'Europe/Bucharest'  , label: 'EET'  },
    { value: 'Europe/Paris'      , label: 'CET'  },
    { value: 'GMT'               , label: 'GMT'  },
    { value: 'Pacific/Auckland'  , label: 'NZST' },
    { value: 'Pacific/Honolulu'  , label: 'HST'  },
    { value: 'UTC'               , label: 'UTC'  }
];

const WidgetTimeConversion = ({ defaultProps }) => {
    const [timeZoneFrom, setTimeZoneFrom] = useState('est');
    const [timeZoneTo, setTimeZoneTo] = useState('gmt');
    const [dateFrom, setDateFrom] = useState({
        month: '',
        day: '',
        year: '',
        hour: '',
        minute: '',
    });
    const [dateTo, setDateTo] = useState({
        month: '',
        day: '',
        year: '',
        hour: '',
        minute: '',
    });
    const [fromClass, setFromClass] = useState('');
    const [toClass, setToClass] = useState('');

    const refTimeZones = useRef({});
    const refElementDateFrom = useRef([]);
    const refElementDateTo = useRef([]);

    useEffect(() => {
        if (sessionStorage.getItem('timeconversion') !== null) {
            let dataSessionStorage = JSON.parse(sessionStorage.getItem('timeconversion'));

            setTimeZoneFrom(dataSessionStorage.from);
            setTimeZoneTo(dataSessionStorage.to);
        };

        const currentDate = new Date();
        const newDateFrom = [
            currentDate.getMonth() + 1,
            currentDate.getDate(),
            currentDate.getFullYear(),
            String(currentDate.getHours()).padStart(2, '0'),
            String(currentDate.getMinutes()).padStart(2, '0'),
        ];

        setDateFrom({
            month: newDateFrom[0],
            day: newDateFrom[1],
            year: newDateFrom[2],
            hour: newDateFrom[3],
            minute: newDateFrom[4],
        });

        for (let i = 0; i < newDateFrom.length; i++) {
            const currentInput = refElementDateFrom.current[i];
            currentInput.style.width = `${(String(newDateFrom[i]).length || 1)}ch`;
        };

        defaultProps.incrementWidgetCounter();

        return () => {
            sessionStorage.setItem('timeconversion', JSON.stringify(refTimeZones.current));
        };
    }, []);

    useEffect(() => {
        convertTimeZone();
    }, [timeZoneFrom, timeZoneTo, dateFrom]);

    useEffect(() => {
        refTimeZones.current = { from: timeZoneFrom, to: timeZoneTo };
    }, [timeZoneFrom, timeZoneTo]);

    const handleInput = (event, origin, type) => {
        const originMap = {
            from: setDateFrom,
            to: setDateTo
        };
        const currentElement = event.currentTarget;

        if (currentElement.value === '') {
            originMap[origin]((prev) => ({
                ...prev,
                [type]: ''
            }));

            currentElement.style.width = '1ch';
            return;
        };

        const value = Number(currentElement.value);
        const min = Number(currentElement.min);
        const max = Number(currentElement.max);
        let calcValue =
            (value < min)
            ? min : (value > max)
            ? max : value;

        originMap[origin]((prev) => {
            return {
                ...prev,
                [type]: calcValue
            }
        });

        const displayValue = (type === 'hour' || type === 'minute')
            ? String(calcValue).padStart(2, '0')
            : calcValue;

        currentElement.value = displayValue;
        currentElement.style.width = `${String(displayValue).length}ch`;
    };

    const handleSelect = (value, origin) => {
        const originMap = {
            from: setTimeZoneFrom,
            to: setTimeZoneTo
        };

        originMap[origin](value);
    };

    const convertTimeZone = () => {
        const { year, month, day, hour, minute } = dateFrom;

        if (!year || !timeZoneFrom) return;

        const fromDateTime = DateTime.fromObject(
            {
                year: Number(year),
                month: Number(month),
                day: Number(day),
                hour: Number(hour),
                minute: Number(minute)
            },
            { zone: timeZoneFrom }
        );

        const toDateTime = fromDateTime.setZone(timeZoneTo);

        const tMonth = toDateTime.month;
        const tDay = toDateTime.day;
        const tYear = toDateTime.year;
        const tHour = toDateTime.hour;
        const tMinute = toDateTime.minute;

        const allParts = [
            tMonth, tDay, tYear,
            String(tHour).padStart(2, '0'), String(tMinute).padStart(2, '0')
        ];

        setDateTo({
            month: allParts[0],
            day: allParts[1],
            year: allParts[2],
            hour: allParts[3],
            minute: allParts[4]
        });

        refElementDateTo.current.forEach((input, i) => {
            if (!input) return;
            input.value = allParts[i];
            input.style.width = `${String(allParts[i]).length}ch`;
        });

        setToClass(getTimeClass(tHour, tMinute));
        setFromClass(getTimeClass(Number(hour), Number(minute)));
    };

    const getTimeClass = (hour, minute) => {
        const totalMinutes = hour * 60 + minute;

        if (totalMinutes < 120) return 'bright moon';    /// 00:00–02:00
        if (totalMinutes < 210) return 'strong moon';    /// 02:00–03:30
        if (totalMinutes < 285) return 'moderate moon';  /// 03:30–04:45
        if (totalMinutes < 330) return 'weak moon';      /// 04:45–05:30
        if (totalMinutes < 360) return 'dim moon';       /// 05:30–06:00
        if (totalMinutes < 390) return 'faint moon';     /// 06:00–06:30
        if (totalMinutes < 420) return 'faint sun';      /// 06:30–07:00
        if (totalMinutes < 480) return 'weak sun';       /// 07:00–08:00
        if (totalMinutes < 570) return 'dim sun';        /// 08:00–09:30
        if (totalMinutes < 660) return 'moderate sun';   /// 09:30–11:00
        if (totalMinutes < 840) return 'bright sun';     /// 11:00–14:00
        if (totalMinutes < 930) return 'strong sun';     /// 14:00–15:30
        if (totalMinutes < 1020) return 'moderate sun';  /// 15:30–17:00
        if (totalMinutes < 1080) return 'dim sun';       /// 17:00–18:00
        if (totalMinutes < 1110) return 'weak sun';      /// 18:00–18:30
        if (totalMinutes < 1140) return 'faint sun';     /// 18:30–19:00
        if (totalMinutes < 1170) return 'faint moon';    /// 19:00–19:30
        if (totalMinutes < 1230) return 'dim moon';      /// 19:30–20:30
        if (totalMinutes < 1290) return 'weak moon';     /// 20:30–21:30
        if (totalMinutes < 1380) return 'moderate moon'; /// 21:30–23:00
        return 'strong moon';                            /// 23:00–24:00
    };

    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('timeconversion')}
            onStop={(event, data) => {
                defaultProps.dragStop('timeconversion');
                defaultProps.updatePosition('timeconversion', 'utility', data.x, data.y);
            }}
            cancel='button, input, select, .space'
            bounds='parent'>
            <section id='timeconversion-widget'
                className='widget'
                aria-labelledby='timeconversion-widget-heading'>
                <h2 id='timeconversion-widget-heading'
                    className='screen-reader-only'>Time Conversion Widget</h2>
                <div id='timeconversion-widget-animation'
                    className={`widget-animation custom-shape ${classStack}`}>
                    <span id='timeconversion-widget-draggable'
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
                    <div className='flex-center column'>
                        {defaultProps.renderHotbar('timeconversion', 'utility')}
                        <div className='flex-center row'
                            style={{ zIndex: 1 }}>
                            <div className={`sun-moon left-side ${fromClass}`}>
                                <div className='flex-center column'>
                                    <label className='screen-reader-only'
                                        htmlFor='timeconversion-select-timezone-from'>Select starting timezone</label>
                                    <select id='timeconversion-select-timezone-from'
                                        className='select-invisible'
                                        value={timeZoneFrom}
                                        onChange={(event) => handleSelect(event.target.value, 'from')}>
                                        {optionTimeZones.map((option) => {
                                            return <option value={option.value}
                                                key={option.value}>
                                                {option.label}
                                            </option>
                                        })}
                                    </select>
                                    <div className='flex-center row'>
                                        <input ref={(element) => refElementDateFrom.current[0] = element}
                                            className='input-invisible'
                                            type='number'
                                            name='input-month-from'
                                            value={dateFrom.month}
                                            onChange={(event) => handleInput(event, 'from', 'month')}
                                            min={1}
                                            max={12}/>/
                                        <input ref={(element) => refElementDateFrom.current[1] = element}
                                            className='input-invisible'
                                            type='number'
                                            name='input-day-from'
                                            value={dateFrom.day}
                                            onChange={(event) => handleInput(event, 'from', 'day')}
                                            min={1}
                                            max={31}/>/
                                        <input ref={(element) => refElementDateFrom.current[2] = element}
                                            className='input-invisible'
                                            type='number'
                                            name='input-year-from'
                                            value={dateFrom.year}
                                            onChange={(event) => handleInput(event, 'from', 'year')}
                                            min={1}
                                            max={9999}/>
                                    </div>
                                    <div className='flex-center row'>
                                        <input ref={(element) => refElementDateFrom.current[3] = element}
                                            className='input-invisible'
                                            type='number'
                                            name='input-hour-from'
                                            value={dateFrom.hour}
                                            onChange={(event) => handleInput(event, 'from', 'hour')}
                                            min={0}
                                            max={23}/>:
                                        <input ref={(element) => refElementDateFrom.current[4] = element}
                                            className='input-invisible'
                                            type='number'
                                            name='input-minute-from'
                                            value={dateFrom.minute}
                                            onChange={(event) => handleInput(event, 'from', 'minute')}
                                            min={0}
                                            max={59}/>
                                    </div>
                                </div>
                            </div>
                            <div className={`sun-moon right-side ${toClass}`}>
                                <div className='flex-center column'>
                                    <label className='screen-reader-only'
                                        htmlFor='timeconversion-select-timezone-to'>Select ending timezone</label>
                                    <select id='timeconversion-select-timezone-to'
                                        className='select-invisible'
                                        value={timeZoneTo}
                                        onChange={(event) => handleSelect(event.target.value, 'to')}>
                                        {optionTimeZones.map((option) => {
                                            return <option value={option.value}
                                                key={option.value}>
                                                {option.label}
                                            </option>
                                        })}
                                    </select>
                                    <div className='flex-center row'>
                                        <span ref={(element) => refElementDateTo.current[0] = element}>
                                            {dateTo.month}
                                        </span>/
                                        <span ref={(element) => refElementDateTo.current[1] = element}>
                                            {dateTo.day}
                                        </span>/
                                        <span ref={(element) => refElementDateTo.current[2] = element}>
                                            {dateTo.year}
                                        </span>
                                    </div>
                                    <div className='flex-center row'>
                                        <span ref={(element) => refElementDateTo.current[3] = element}>
                                            {dateTo.hour}
                                        </span>:
                                        <span ref={(element) => refElementDateTo.current[4] = element}>
                                            {dateTo.minute}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='space'>
                                <div className='stars'></div>
                                <div className='cluster one'>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i}></span>
                                    ))}
                                </div>
                                <div className='cluster two'>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i}></span>
                                    ))}
                                </div>
                                <div className='comet one'></div>
                                <div className='comet two'></div>
                                <div className='comet three'></div>
                                <div className='ufo one'>
                                    <div className='top'></div>
                                    <div className='mid'></div>
                                    <div className='bot'></div>
                                </div>
                                <div className='ufo two'>
                                    <div className='top'></div>
                                    <div className='mid'></div>
                                    <div className='bot'></div>
                                </div>
                                <div className='ufo three'>
                                    <div className='top'></div>
                                    <div className='mid'></div>
                                    <div className='bot'></div>
                                </div>
                                <div className='solar-system'>
                                    <div className='orbit mercury'>
                                        <div className='planet'></div>
                                    </div>
                                    <div className='orbit venus'>
                                        <div className='planet'></div>
                                    </div>
                                    <div className='orbit earth'>
                                        <div className='planet'>
                                            <div className='moon-orbit'>
                                                <div className='moon-space'></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='orbit mars'>
                                        <div className='planet'></div>
                                    </div>
                                    <div className='asteroid-belt'></div>
                                    <div className='orbit jupiter'>
                                        <div className='planet'></div>
                                    </div>
                                    <div className='orbit saturn'>
                                        <div className='planet'>
                                            <div className='ring'></div>
                                        </div>
                                    </div>
                                    <div className='orbit uranus'>
                                        <div className='planet'></div>
                                    </div>
                                    <div className='orbit neptune'>
                                        <div className='planet'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetTimeConversion);