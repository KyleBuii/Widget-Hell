import Slider from 'rc-slider';
import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { FaGripHorizontal, FaRandom } from 'react-icons/fa';


/// Variables
let intervalDraw;
let A = 1;
let B = 1;


class WidgetDonutAnimation extends Component{
    constructor(props){
        super(props);
        this.state = {
            height: 25,
            width: 50,
            incrementA: 0.07,
            incrementB: 0.03
        };
        this.drawAsciiFrame = this.drawAsciiFrame.bind(this);
    };
    handleSlider(what, value){
        this.setState({
            [what]: value
        }, () => {
            if(what === "height" || what === "width"){
                this.setMargin();
            };
        });
    };
    randomValue(what, min, max){
        let random = Math.random() * max + min;
        this.setState({
            [what]: random
        }, () => {
            this.setMargin();    
        });
    };
    setMargin(){
        let elementDonut = document.getElementById("donutanimation-donut");
        elementDonut.style.marginBottom = `${this.state.height + 34}em`;
    };
    drawAsciiFrame(){
        let b = []; /// Acii characters
        let z = []; /// Depth values
        A += this.state.incrementA; // Increament angle a
        B += this.state.incrementB; // Increament angle b
        /// Sin and Cosine of angles
        let cA = Math.cos(A),
            sA = Math.sin(A),
            cB = Math.cos(B),
            sB = Math.sin(B);
        /// Initialize arrays with default angles
        for(let k = 0; k < this.state.width * this.state.height; k++){
            /// Set default ascii character
            b[k] = (k % this.state.width === this.state.width - 1) ? '\n' : ' ';
            /// Set default depth
            z[k] = 0;
        };
        /// Generate the ascii frame
        for(let j = 0; j < 6.28; j += 0.07){
            let ct = Math.cos(j); /// Cosine of j
            let st = Math.sin(j); /// Sin of j
            for(let i = 0; i < 6.28; i += 0.02){
                let sp = Math.sin(i); /// Sin of i
                let cp = Math.cos(i), /// Cosine of i
                    h = ct + 2, /// Height calculation
                    /// Distance calculation
                    D = 1 / (sp * h * sA + st * cA + 5),
                    /// Temporary variable
                    t = sp * h * cA - st * sA;
                /// Calculate cordinates of ascii character
                let x = Math.floor(this.state.width / 2 + (this.state.width / 1.6) * D * (cp * h * cB - t * sB));
                let y = Math.floor(this.state.height / 2 + (this.state.height / 1.6) * D * (cp * h * sB + t * cB));
                /// Calculate the index in the array
                let o = x + this.state.width * y;
                /// Calculate the ascii character index
                let N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
                /// Update ascii character and depth if conditions are met
                if(y < this.state.height && y >= 0 && x >= 0 && x < this.state.width && D > z[o]){
                    z[o] = D;
                    /// Update ascii char based on the index
                    b[o] = '.,-~:;=!*#$@'[N > 0 ? N : 0];
                };
            };
        };
        /// Update html element with the ascii frame
        document.getElementById("donutanimation-donut").innerText = b.join('');
    };
    componentDidMount(){
        intervalDraw = setInterval(this.drawAsciiFrame, 50);
        this.setMargin();
    };
    componentWillUnmount(){
        clearInterval(intervalDraw);
    };
    render(){
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("donutanimation")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("donutanimation");
                    this.props.defaultProps.updatePosition("donutanimation", "fun", data.x, data.y);
                }}
                cancel="button, span, .slider"
                bounds="parent">
                <div id="donutanimation-widget"
                    className="widget">
                    <div id="donutanimation-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="donutanimation-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("donutanimation", "fun")}
                        {/* Donut Container */}
                        <section className="flex-center column gap large-gap">
                            {/* Donut */}
                            <pre id="donutanimation-donut"
                                className="text-animation no-highlight"></pre>
                            {/* Modifications Container */}
                            <div id="donutanimation-modifications"
                                className="aesthetic-scale scale-span flex-center column section-group group-medium font">
                                <span className="leave-me-alone font medium bold line bellow">Modifications</span>
                                {/* Height */}
                                <div className="element-ends">
                                    <span>Height</span>
                                    <div>
                                        <button className="button-match inverse when-elements-are-not-straight"
                                            onClick={() => this.handleSlider("height", 25)}>
                                            <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                                <BsArrowCounterclockwise/>
                                            </IconContext.Provider>
                                        </button>
                                        <button className="button-match inverse"
                                            onClick={() => this.randomValue("height", 1, 200)}>
                                            <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                <FaRandom/>
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                </div>
                                <Slider className="slider space-nicely space-top length-medium"
                                    onChange={(value) => this.handleSlider("height", value)}
                                    value={this.state.height}
                                    min={1}
                                    max={40}
                                    marks={{
                                        25: {
                                            label: 25,
                                            style: {display: "none" }
                                        }
                                    }}
                                    defaultValue={25}/>
                                {/* Width */}
                                <div className="element-ends">
                                    <span>Width</span>
                                    <div>
                                        <button className="button-match inverse when-elements-are-not-straight"
                                            onClick={() => this.handleSlider("width", 50)}>
                                            <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                                <BsArrowCounterclockwise/>
                                            </IconContext.Provider>
                                        </button>
                                        <button className="button-match inverse"
                                            onClick={() => this.randomValue("width", 1, 200)}>
                                            <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                <FaRandom/>
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                </div>
                                <Slider className="slider space-nicely space-top length-medium"
                                    onChange={(value) => this.handleSlider("width", value)}
                                    value={this.state.width}
                                    min={1}
                                    max={260}
                                    marks={{
                                        50: {
                                            label: 50,
                                            style: {display: "none" }
                                        }
                                    }}
                                    defaultValue={50}/>
                                {/* Increment A */}
                                <div className="element-ends">
                                    <span>A</span>
                                    <div>
                                        <button className="button-match inverse when-elements-are-not-straight"
                                            onClick={() => this.handleSlider("incrementA", 0.07)}>
                                            <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                                <BsArrowCounterclockwise/>
                                            </IconContext.Provider>
                                        </button>
                                        <button className="button-match inverse"
                                            onClick={() => this.randomValue("incrementA", 0, 1)}>
                                            <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                <FaRandom/>
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                </div>
                                <Slider className="slider space-nicely space-top length-medium"
                                    onChange={(value) => this.handleSlider("incrementA", value)}
                                    value={this.state.incrementA}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    marks={{
                                        0.07: {
                                            label: 0.07,
                                            style: {display: "none" }
                                        }
                                    }}
                                    defaultValue={0.07}/>
                                {/* Increment B */}
                                <div className="element-ends">
                                    <span>B</span>
                                    <div>
                                        <button className="button-match inverse when-elements-are-not-straight"
                                            onClick={() => this.handleSlider("incrementB", 0.03)}>
                                            <IconContext.Provider value={{ size: "1em", className: "global-class-name" }}>
                                                <BsArrowCounterclockwise/>
                                            </IconContext.Provider>
                                        </button>
                                        <button className="button-match inverse"
                                            onClick={() => this.randomValue("incrementB", 0, 1)}>
                                            <IconContext.Provider value={{ size: this.props.microIcon, className: "global-class-name" }}>
                                                <FaRandom/>
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                </div>
                                <Slider className="slider space-nicely space-top length-medium"
                                    onChange={(value) => this.handleSlider("incrementB", value)}
                                    value={this.state.incrementB}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    marks={{
                                        0.03: {
                                            label: 0.03,
                                            style: {display: "none" }
                                        }
                                    }}
                                    defaultValue={0.03}/>
                            </div>
                        </section>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">Created by Me</span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

export default memo(WidgetDonutAnimation);