import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import Spreadsheet from 'react-spreadsheet';


const WidgetSpreadsheet = ({ defaultProps }) => {
    const [state, setState] = useState({
        colLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        rowLabels: [1, 2, 3, 4, 5, 6, 7, 8],
        data: []
    });
    const refData = useRef(state.data);
    useEffect(() => {
        /// Load widget's data from local storage
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let localStorageSpreadsheet = dataLocalStorage['utility']['spreadsheet'];
            if (localStorageSpreadsheet['data'] !== undefined) {
                setState((prevState) => ({
                    ...prevState,
                    data: localStorageSpreadsheet['data']
                }));    
            } else {
                let temp = [];
                for (let i = 0; i < 8; i++) {
                    temp[i] = [];
                    for (let j = 0; j < 8; j++) {
                        temp[i].push({});
                    };
                };
                setState((prevState) => ({
                    ...prevState,
                    data: temp
                }));    
            };
        } else {
            let temp = [];
            for (let i = 0; i < 8; i++) {
                temp[i] = [];
                for (let j = 0; j < 8; j++) {
                    temp[i].push({});
                };
            };
            setState((prevState) => ({
                ...prevState,
                data: temp
            }));
        };
        return () => {
            storeData();
        };
    }, []);
    useEffect(() => {
        refData.current = state.data;
    }, [state.data]);
    const handleData = (what) => {
        if (JSON.stringify(state.data) !== JSON.stringify(what)) {
            setState((prevState) => ({
                ...prevState,
                data: what
            }));
        };
    };
    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['utility']['spreadsheet'] = {
                ...dataLocalStorage['utility']['spreadsheet'],
                data: refData.current
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('spreadsheet')}
            onStop={(event, data) => {
                defaultProps.dragStop('spreadsheet');
                defaultProps.updatePosition('spreadsheet', 'utility', data.x, data.y);
            }}
            cancel='.Spreadsheet, button, .select-match, input, label'
            bounds='parent'>
            <div id='spreadsheet-widget'
                className='widget'>
                <div id='spreadsheet-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='spreadsheet-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('spreadsheet', 'utility')}
                    <Spreadsheet 
                        data={state.data}
                        columnLabels={state.colLabels}
                        rowLabels={state.rowLabels}
                        onChange={(val) => handleData(val)}/>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetSpreadsheet);