import React, { Component, memo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaArrowDownLong } from 'react-icons/fa6';
import Select from 'react-select';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { classStack, decorationValue } from '../../data';
import { formatGroupLabel, menuListScrollbar, sortSelect } from '../../helpers';

const optionsTimzones = [
    {
        label: 'Timezones',
        options: [
            { value: 'ist', label: 'IST (UTC+5:30)' },
            { value: 'cet', label: 'CET (UTC+1)' },
            { value: 'eet', label: 'EET (UTC+2)' },
            { value: 'est', label: 'EST (UTC-5)' },
            { value: 'gmt', label: 'GMT (UTC+0)' },
            { value: 'hst', label: 'HST (UTC-10)' },
            { value: 'mst', label: 'MST (UTC-7)' },
            { value: 'nz',  label: 'NZST (UTC+12)' },
            { value: 'prc', label: 'CST (UTC+8)' },
            { value: 'rok', label: 'KST (UTC+9)' },
            { value: 'utc', label: 'UTC' }
        ]
    }
];

class WidgetTimeConversion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            month: 0,
            day: 0,
            year: 0,
            time: 0,
            timeformat: 'en',
            hour12: true,
            timezoneoriginal: '',
            timezone: {}
        };
    };

    handleChange(where, what) {
        switch (where) {
            case 'date':
                this.setState({
                    date: new Date(`${what.toLocaleString().slice(0, 9)} ${this.state.time}`)
                }, () => {
                    /// Update values in inputs
                    this.updateDate();
                });        
                break;
            case 'time':
                if (what !== null) {
                    this.setState({
                        date: new Date(`${this.state.date.toLocaleString().slice(0, 9)} ${what}`),
                        time: what
                    });
                } else {
                    this.setState({
                        time: '12:00'
                    });
                };
                break;
            default: break;
        };
    };

    handleButton(what) {
        switch (what) {
            case '12hr':
                this.setState({
                    timeformat: 'en',
                    hour12: true
                });
                break;
            case '24hr':
                this.setState({
                    timeformat: 'sv',
                    hour12: false
                }); 
                break;
            default: break;
        };
    };

    updateDate(event, what) {
        switch (what) {
            case 'month': {
                const inputMonth = document.getElementById('timeconversion-input-month');
                let tempMonth = 1;
                /// If number is < min, set to min
                if ((event.target.value !== '') && (Number(event.target.value) < inputMonth.min)) {
                    tempMonth = inputMonth.min;
                /// If number is > than 2 digits
                } else if (event.target.value.length >= 3) {
                    /// If number sliced to 2 digits is <= max, set to 2 digits
                    if (Number(event.target.value.slice(0, 2)) <= inputMonth.max) {
                        tempMonth = event.target.value.slice(0, 2);
                    /// Else set to max since 2 digits is > max
                    } else {
                        tempMonth = inputMonth.max;
                    };
                /// If number is 2 digits and is > max, set to max
                } else if ((event.target.value.length === 2) && (Number(event.target.value) > inputMonth.max)) {
                    tempMonth = inputMonth.max;
                /// Else set to value since it will be a 1 or 2 digit that is between min and max
                } else {
                    tempMonth = event.target.value;
                };
                this.setState({
                    date: new Date(`${this.state.year} ${tempMonth || 1} ${this.state.day} ${this.state.time}`),
                    month: tempMonth
                });
                break;
            };
            case 'day': {
                const inputDay = document.getElementById('timeconversion-input-day');
                let tempDay = 1;
                /// If number is < min, set to min
                if ((event.target.value !== '') && (Number(event.target.value) < inputDay.min)) {
                    tempDay = inputDay.min;
                /// If number is > than 2 digits
                } else if (event.target.value.length >= 3){
                    /// If number sliced to 2 digits is <= max, set to 2 digits
                    if (Number(event.target.value.slice(0, 2)) <= inputDay.max) {
                        tempDay = event.target.value.slice(0, 2);
                    /// Else set to max since 2 digits is > max
                    } else {
                        tempDay = inputDay.max;
                    };
                /// If number is 2 digits and is > max, set to max
                } else if ((event.target.value.length === 2) && (Number(event.target.value) > inputDay.max)) {
                    tempDay = inputDay.max;
                /// Else set to value since it will be a 1 or 2 digit that is between min and max
                } else {
                    tempDay = event.target.value;
                };
                this.setState({
                    date: new Date(`${this.state.year} ${this.state.month} ${tempDay || 1} ${this.state.time}`),
                    day: tempDay
                });
                break;
            };
            case 'year': {
                const inputYear = document.getElementById('timeconversion-input-year');
                let tempYear = 1;
                let validYear = 822;
                /// If number is > than 4 digits
                if (event.target.value.length >= 5) {
                    /// If number sliced to 4 digits is <= max, set to 4 digits
                    if (Number(event.target.value.slice(0, 4)) <= inputYear.max) {
                        tempYear = event.target.value.slice(0, 4);
                    /// Else set to max since 4 digits is > max
                    } else {
                        tempYear = inputYear.max;
                    };
                    validYear = tempYear;
                /// If number is 4 or 3 digits
                } else if ((event.target.value.length === 4) || (event.target.value.length === 3)) {
                    /// If number is > max, set to max
                    if (Number(event.target.value) > inputYear.max) {
                        tempYear = inputYear.max;
                    /// If number is < min, set to min
                    } else if (Number(event.target.value) < inputYear.min) {
                        tempYear = inputYear.min;
                    /// Else set to value since it is between min and max
                    } else {
                        tempYear = event.target.value;
                    };
                    validYear = tempYear;
                } else {
                    tempYear = event.target.value;
                };
                this.setState({
                    date: new Date(`${validYear || 822} ${this.state.month} ${this.state.day} ${this.state.time}`),
                    year: tempYear
                });
                break;
            };
            default: {
                const temp = this.state.date
                    .toLocaleString('en-US', {
                        hour12: false
                    })
                    .split(/\/|,/);
                this.setState({
                    month: temp[0],
                    day: temp[1],
                    year: temp[2],
                    time: this.state.time
                })
                break;
            };
        }
    };

    componentDidMount() {
        /// Default values
        /// Set current date and time as default
        const temp = this.state.date
            .toLocaleString('en-US', {
                hour12: false
            })
        .split(/\/|,/);
        this.setState({
            month: temp[0],
            day: temp[1],
            year: temp[2],
            time: temp[3]
        })

        if (sessionStorage.getItem('timeconversion') === null) {
            this.setState({
                timezone: { value: 'est', label: 'EST (UTC-5)' }
            });
        } else {
            let dataSessionStorage = JSON.parse(sessionStorage.getItem('timeconversion'));
            this.setState({
                timezone: dataSessionStorage.timezone
            });
        };

        sortSelect(optionsTimzones);

        this.props.defaultProps.incrementWidgetCounter();
    };

    componentWillUnmount() {
        let data = {
            'timezone': this.state.timezone
        };
        sessionStorage.setItem('timeconversion', JSON.stringify(data));
    };

    render() {
        return (
            <Draggable defaultPosition={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart('timeconversion')}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop('timeconversion');
                    this.props.defaultProps.updatePosition('timeconversion', 'utility', data.x, data.y);
                }}
                cancel='input, label, button, .select-match, .react-calendar, .react-time-picker, .react-clock'
                bounds='parent'>
                <section id='timeconversion-widget'
                    className='widget'
                    aria-labelledby='timeconversion-widget-heading'>
                    <h2 id='timeconversion-widget-heading'
                        className='screen-reader-only'>Time Conversion Widget</h2>
                    <div id='timeconversion-widget-animation'
                        className={`widget-animation ${classStack}`}>
                        <span id='timeconversion-widget-draggable'
                            className='draggable'>
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: 'global-class-name' }}>
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
                        {this.props.defaultProps.renderHotbar('timeconversion', 'utility')}
                        {/* Time Conversion Container */}
                        <div id='timeconversion-container'
                            className='flex-center row'>
                            <div className='flex-center column gap'>
                                {/* Original date and time */}
                                <div className='flex-center column gap'>
                                    {/* Inputs */}
                                    <div className='grid col-auto'>
                                        {/* <label htmlFor='timeconversion-select-timezone-original'
                                            className='font medium'>
                                            Zone:
                                        </label>
                                        <select id='timeconversion-select-timezone-original'
                                            className='select-match dropdown-arrow'
                                            onChange={(e) => this.setState({
                                                timezoneoriginal: e.target.value
                                            })
                                        }>
                                            <option value='default'>Default</option>
                                        </select> */}
                                        <label htmlFor='timeconversion-input-month'
                                            className='font medium'>
                                            Month: 
                                        </label>
                                        <input id='timeconversion-input-month'
                                            className='input-match'
                                            name='timeconversion-input-month'
                                            type='number'
                                            max='12'
                                            min='1'
                                            value={this.state.month}
                                            aria-describedby='timeconversion-input-month-aria-describedby'
                                            onChange={(event) => this.updateDate(event, 'month')}></input>
                                        <span id='timeconversion-input-month-aria-describedby'
                                            className='screen-reader-only'>
                                            Type the month in numeric form here.
                                        </span>
                                        <label htmlFor='timeconversion-input-day'
                                            className='font medium'>
                                            Day: 
                                        </label>
                                        <input id='timeconversion-input-day'
                                            className='input-match'
                                            name='timeconversion-input-day'
                                            type='number'
                                            max='31'
                                            min='1'
                                            value={this.state.day}
                                            aria-describedby='calculator-input-day-aria-describedby'
                                            onChange={(event) => this.updateDate(event, 'day')}></input>
                                        <span id='calculator-input-day-aria-describedby'
                                            className='screen-reader-only'>
                                            Type the day in numeric form here.
                                        </span>
                                        <label htmlFor='timeconversion-input-year'
                                            className='font medium'>
                                            Year: 
                                        </label>
                                        <input id='timeconversion-input-year'
                                            className='input-match'
                                            name='timeconversion-input-year'
                                            type='number'
                                            max='9999'
                                            min='100'
                                            value={this.state.year}
                                            aria-describedby='calculator-input-year-aria-describedby'
                                            onChange={(event) => this.updateDate(event, 'year')}></input>
                                        <span id='calculator-input-year-aria-describedby'
                                            className='screen-reader-only'>
                                            Type the year here.
                                        </span>
                                        <span className='font medium'>
                                            Time:
                                        </span>
                                        <TimePicker
                                            onChange={(val) => this.handleChange('time', val)}
                                            value={this.state.time}
                                            locale={this.state.timeformat}/>
                                    </div>
                                    <div className='grid col-50-50 fill-width'>
                                        <button id='time-conversion-button-twelvehr'
                                            className='button-match option'
                                            onClick={() => this.handleButton('12hr')}>12hr</button>
                                        <button id='time-conversion-button-twentyfourhr' 
                                            className='button-match option'
                                            onClick={() => this.handleButton('24hr')}>24hr</button>
                                    </div>
                                </div>
                                {/* Convert */}
                                <div className='flex-center row gap space-nicely space-all'>
                                    <IconContext.Provider value={{ size: '1.8em', className: 'global-class-name' }}>
                                        <FaArrowDownLong/>
                                    </IconContext.Provider>
                                    <Select id='timeconversion-select-timezone'
                                        className='select-match'
                                        value={this.state.timezone}
                                        defaultValue={optionsTimzones[0]['options'][0]}
                                        onChange={(e) => this.setState({
                                                timezone: e
                                            })
                                        }
                                        options={optionsTimzones}
                                        formatGroupLabel={formatGroupLabel}
                                        components={{
                                            MenuList: menuListScrollbar
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                ...this.props.parentRef.state.selectTheme
                                            }
                                        })}/>
                                </div>
                                {/* Converted date */}
                                <div className='flex-center column gap'>
                                    <span className='text-animation aesthetic-scale scale-self font medium'>
                                        {this.state.date.toLocaleString('en-US', {
                                            hour12: this.state.hour12,
                                            timeZone: this.state.timezone.value
                                        })}
                                    </span>
                                </div>
                            </div>
                            <Calendar id='timeconversion-calendar'
                                onChange={(val) => this.handleChange('date', val)}
                                value={this.state.date}/>
                        </div>
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                            : <></>}
                    </div>
                </section>
            </Draggable>
        );
    };
};

export default memo(WidgetTimeConversion);