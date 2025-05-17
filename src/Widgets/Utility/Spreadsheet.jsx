import React, { memo, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FcAddColumn, FcAddRow, FcDeleteColumn, FcDeleteRow } from "react-icons/fc";
import Spreadsheet from 'react-spreadsheet';
import SimpleBar from 'simplebar-react';


const WidgetSpreadsheet = ({ defaultProps, smallMedIcon }) => {
    const [state, setState] = useState({
        colLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        rowLabels: [1, 2, 3, 4, 5, 6, 7, 8],
        data: []
    });
    const refColLabels = useRef(state.colLabels);
    const refRowLabels = useRef(state.rowLabels);
    const refData = useRef(state.data);
    useEffect(() => {
        window.addEventListener('beforeunload', storeData);
        /// Load widget's data from local storage
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            let localStorageSpreadsheet = dataLocalStorage['utility']['spreadsheet'];
            if (localStorageSpreadsheet['data'] !== undefined) {
                setState((prevState) => ({
                    ...prevState,
                    colLabels: [...localStorageSpreadsheet['colLabels']],
                    rowLabels: [...localStorageSpreadsheet['rowLabels']],
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
            window.removeEventListener('beforeunload', storeData);
            storeData();
        };
    }, []);
    useEffect(() => {
        refColLabels.current = state.colLabels;
    }, [state.colLabels]);
    useEffect(() => {
        refRowLabels.current = state.rowLabels;
    }, [state.rowLabels]);
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
    const handleButton = (what) => {
        switch (what) {
            case 'addColumn': {
                let latestColLabelKeyCode = state.colLabels[state.colLabels.length - 1].charCodeAt(0);
                setState((prevState) => ({
                    ...prevState,
                    colLabels: [...prevState.colLabels, String.fromCharCode(getNextKeyCode(latestColLabelKeyCode))]
                }));
                break;
            };
            case 'addRow': {
                let latestRowLabel = state.rowLabels[state.rowLabels.length - 1];
                setState((prevState) => ({
                    ...prevState,
                    rowLabels: [...prevState.rowLabels, latestRowLabel + 1]
                }));
                break;
            };
            case 'removeColumn': {
                const newColLabels = [...state.colLabels];
                newColLabels.pop();
                setState((prevState) => ({
                    ...prevState,
                    colLabels: [...newColLabels]
                }));
                break;
            };
            case 'removeRow': {
                const newRowLabels = [...state.rowLabels];
                newRowLabels.pop();
                setState((prevState) => ({
                    ...prevState,
                    rowLabels: [...newRowLabels]
                }));
                break;
            };
            default: { break; };
        };
    };
    const getNextKeyCode = (keyCode) => {
        if (keyCode + 1 > 90) return 65;
        return keyCode + 1;
    };
    const storeData = () => {
        if (localStorage.getItem('widgets') !== null) {
            let dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['utility']['spreadsheet'] = {
                ...dataLocalStorage['utility']['spreadsheet'],
                colLabels: [...refColLabels.current],
                rowLabels: [...refRowLabels.current],
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
                    <section>
                        <button className='button-match inverse'
                            aria-label='Add column'
                            onClick={() => handleButton('addColumn')}>
                            <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                <FcAddColumn/>
                            </IconContext.Provider>
                        </button>
                        <button className='button-match inverse'
                            aria-label='Add row'
                            onClick={() => handleButton('addRow')}>
                            <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                <FcAddRow/>
                            </IconContext.Provider>
                        </button>
                        <button className='button-match inverse'
                            aria-label='Delete column'
                            onClick={() => handleButton('removeColumn')}>
                            <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                <FcDeleteColumn/>
                            </IconContext.Provider>
                        </button>
                        <button className='button-match inverse'
                            aria-label='Delete row'
                            onClick={() => handleButton('removeRow')}>
                            <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                <FcDeleteRow/>
                            </IconContext.Provider>
                        </button>
                    </section>
                    <SimpleBar id='spreadsheet-content'
                        autoHide={false}>
                        <Spreadsheet data={state.data}
                            columnLabels={state.colLabels}
                            rowLabels={state.rowLabels}
                            onChange={(val) => handleData(val)}/>
                    </SimpleBar>
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