import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';


const WidgetFacts = ({ defaultProps }) => {
    const [state, setState] = useState({
        cat: []
    });

    useEffect(() => {
        const dateLocalStorage = JSON.parse(localStorage.getItem('date'));
        const currentDate = new Date().getDate();
        if ((sessionStorage.getItem('facts') !== null)
            && (dateLocalStorage['facts'] === currentDate)) {
            setState((prevState) => ({
                ...prevState,
                ...JSON.parse(sessionStorage.getItem('facts'))
            }));
        } else {
            fetchFacts();
            localStorage.setItem('date', JSON.stringify({
                ...dateLocalStorage,
                facts: currentDate
            }));
        };
    }, []);

    useEffect(() => {
        storeData();
    }, [state.cat]);

    const fetchFacts = async () => {
        try {
            const urlCat = 'https://cat-fact.herokuapp.com/facts';
            const responseCat = await fetch(urlCat);
            const dataCat = await responseCat.json();
            let catFacts = [];
            for (let i of dataCat) {
                catFacts.push(i.text);
            };
            setState((prevState) => ({
                ...prevState,
                cat: [...catFacts]
            }));
        } catch(err) {
            console.error(err);
        };
    };

    const storeData = () => {
        let data = {};
        let keysFacts = Object.keys(state);
        for (let i of keysFacts) {
            /// Default is a string
            switch (i) {
                case "cat":
                    data[i] = [...state[i]];
                    break;
                default:
                    data[i] = state[i];
                    break;
            };
        };
        sessionStorage.setItem('facts', JSON.stringify(data));
    };
    
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('facts')}
            onStop={(event, data) => {
                defaultProps.dragStop('facts');
                defaultProps.updatePosition('facts', 'fun', data.x, data.y);
            }}
            cancel='span'
            bounds='parent'>
            <section id='facts-widget'
                className='widget'
                aria-labelledby='facts-widget-heading'>
                <h2 id='facts-widget-heading'
                    className='screen-reader-only'>Facts Widget</h2>
                <div id='facts-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='facts-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('facts', 'fun')}
                    {/* Facts */}
                    <div className='aesthetic-scale scale-span flex-center column gap only-justify-content'>
                        {/* Cat */}
                        <span className='font bold'>&#128008; Cat Facts</span>
                        <div className='alternating-text-color flex-center column gap'>
                            {(state.cat.length !== 0)
                                ? state.cat.map((text, index) => {
                                    return <span className='text-animation'
                                        key={`facts-cat-${index}`}>{text}</span>
                                })
                                : <span>No facts</span>}
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

export default memo(WidgetFacts);