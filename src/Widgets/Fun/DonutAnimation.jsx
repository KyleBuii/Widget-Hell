import Slider from 'rc-slider';
import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { FaGripHorizontal, FaRandom } from 'react-icons/fa';


/// Variables
let A = 1;
let B = 1;

const WidgetDonutAnimation = ({ defaultProps }) => {
    const [state, setState] = useState({
        height: 25,
        width: 50,
        incrementA: 0.07,
        incrementB: 0.03
    });
    useEffect(() => {
        const intervalDraw = setInterval(drawAsciiFrame, 50);
        setMargin();
        return () => {
            clearInterval(intervalDraw);
        };
    }, [state]);
    useEffect(() => {
        setMargin();
    }, []);
    const handleSlider = (what, value) => {
        setState((prevState) => ({
            ...prevState,
            [what]: value
        }));
    };
    const drawAsciiFrame = () => {
        let b = []; /// Acii characters
        let z = []; /// Depth values
        A += state.incrementA; // Increament angle a
        B += state.incrementB; // Increament angle b
        /// Sin and Cosine of angles
        let cA = Math.cos(A),
            sA = Math.sin(A),
            cB = Math.cos(B),
            sB = Math.sin(B);
        /// Initialize arrays with default angles
        for (let k = 0; k < state.width * state.height; k++) {
            /// Set default ascii character
            b[k] = (k % state.width === state.width - 1) ? '\n' : ' ';
            /// Set default depth
            z[k] = 0;
        };
        /// Generate the ascii frame
        for (let j = 0; j < 6.28; j += 0.07) {
            let ct = Math.cos(j); /// Cosine of j
            let st = Math.sin(j); /// Sin of j
            for (let i = 0; i < 6.28; i += 0.02) {
                let sp = Math.sin(i); /// Sin of i
                let cp = Math.cos(i), /// Cosine of i
                    h = ct + 2, /// Height calculation
                    /// Distance calculation
                    D = 1 / (sp * h * sA + st * cA + 5),
                    /// Temporary variable
                    t = sp * h * cA - st * sA;
                /// Calculate cordinates of ascii character
                let x = Math.floor(state.width / 2 + (state.width / 1.6) * D * (cp * h * cB - t * sB));
                let y = Math.floor(state.height / 2 + (state.height / 1.6) * D * (cp * h * sB + t * cB));
                /// Calculate the index in the array
                let o = x + state.width * y;
                /// Calculate the ascii character index
                let N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
                /// Update ascii character and depth if conditions are met
                if (y < state.height && y >= 0 && x >= 0 && x < state.width && D > z[o]) {
                    z[o] = D;
                    /// Update ascii char based on the index
                    b[o] = '.,-~:;=!*#$@'[N > 0 ? N : 0];
                };
            };
        };
        /// Update html element with the ascii frame
        document.getElementById('donutanimation-donut').innerText = b.join('');
    };
    const randomValue = (what, min, max) => {
        let random = Math.random() * max + min;
        if (what === 'height' || what === 'width') random = Math.floor(random);
        setState((prevState) => ({
            ...prevState,
            [what]: random
        }));
    };
    const setMargin = () => {
        let elementDonut = document.getElementById('donutanimation-donut');
        elementDonut.style.marginBottom = `${state.height + 34}em`;
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('donutanimation')}
            onStop={(event, data) => {
                defaultProps.dragStop('donutanimation');
                defaultProps.updatePosition('donutanimation', 'fun', data.x, data.y);
            }}
            cancel='button, span, .slider'
            bounds='parent'>
            <div id='donutanimation-widget'
                className='widget'>
                <div id='donutanimation-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='donutanimation-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('donutanimation', 'fun')}
                    {/* Donut Container */}
                    <section className='flex-center column gap large-gap'>
                        {/* Donut */}
                        <pre id='donutanimation-donut'
                            className='text-animation no-highlight'></pre>
                        {/* Modifications Container */}
                        <div id='donutanimation-modifications'
                            className='aesthetic-scale scale-span flex-center column section-group group-medium font'>
                            <span className='leave-me-alone font medium bold line bellow'>Modifications</span>
                            {/* Height */}
                            <div className='element-ends'>
                                <span>Height</span>
                                <div>
                                    <button className='button-match inverse when-elements-are-not-straight'
                                        onClick={() => handleSlider('height', 25)}>
                                        <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                            <BsArrowCounterclockwise/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => randomValue('height', 1, 40)}>
                                        <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                            <FaRandom/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                            <Slider className='slider space-nicely space-top length-medium'
                                onChange={(value) => handleSlider('height', value)}
                                value={state.height}
                                min={1}
                                max={40}
                                marks={{
                                    25: {
                                        label: 25,
                                        style: {display: 'none' }
                                    }
                                }}
                                defaultValue={25}/>
                            {/* Width */}
                            <div className='element-ends'>
                                <span>Width</span>
                                <div>
                                    <button className='button-match inverse when-elements-are-not-straight'
                                        onClick={() => handleSlider('width', 50)}>
                                        <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                            <BsArrowCounterclockwise/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => randomValue('width', 1, 260)}>
                                        <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                            <FaRandom/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                            <Slider className='slider space-nicely space-top length-medium'
                                onChange={(value) => handleSlider('width', value)}
                                value={state.width}
                                min={1}
                                max={260}
                                marks={{
                                    50: {
                                        label: 50,
                                        style: {display: 'none' }
                                    }
                                }}
                                defaultValue={50}/>
                            {/* Increment A */}
                            <div className='element-ends'>
                                <span>A</span>
                                <div>
                                    <button className='button-match inverse when-elements-are-not-straight'
                                        onClick={() => handleSlider('incrementA', 0.07)}>
                                        <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                            <BsArrowCounterclockwise/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => randomValue('incrementA', 0, 1)}>
                                        <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                            <FaRandom/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                            <Slider className='slider space-nicely space-top length-medium'
                                onChange={(value) => handleSlider('incrementA', value)}
                                value={state.incrementA}
                                min={0}
                                max={1}
                                step={0.01}
                                marks={{
                                    0.07: {
                                        label: 0.07,
                                        style: {display: 'none' }
                                    }
                                }}
                                defaultValue={0.07}/>
                            {/* Increment B */}
                            <div className='element-ends'>
                                <span>B</span>
                                <div>
                                    <button className='button-match inverse when-elements-are-not-straight'
                                        onClick={() => handleSlider('incrementB', 0.03)}>
                                        <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                            <BsArrowCounterclockwise/>
                                        </IconContext.Provider>
                                    </button>
                                    <button className='button-match inverse'
                                        onClick={() => randomValue('incrementB', 0, 1)}>
                                        <IconContext.Provider value={{ size: '1em', className: 'global-class-name' }}>
                                            <FaRandom/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                            <Slider className='slider space-nicely space-top length-medium'
                                onChange={(value) => handleSlider('incrementB', value)}
                                value={state.incrementB}
                                min={0}
                                max={1}
                                step={0.01}
                                marks={{
                                    0.03: {
                                        label: 0.03,
                                        style: {display: 'none' }
                                    }
                                }}
                                defaultValue={0.03}/>
                        </div>
                    </section>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetDonutAnimation);