import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { RiBattery2ChargeLine } from "react-icons/ri";


class WidgetBattery extends Component{
    constructor(props){
        super(props);
        this.state = {
            percentage: 0,
            charging: false
        };
    };
    updateBattery(){
        let batteryLiquid = document.getElementById("battery-liquid");
        navigator.getBattery().then((batteryInformation) => {
            let level = Math.floor(batteryInformation.level * 100);
            this.setState({
                percentage: level
            });
            batteryLiquid.style.height = `${parseInt(level)}%`;
            if(level === 100){
                batteryLiquid.style.height = "103%";
            };
            if(level <= 20){
                batteryLiquid.classList.add("gradient-color-red");
                batteryLiquid.classList.remove("gradient-color-green", "gradient-color-orange", "gradient-color-yellow");
            }else if(level <= 48){
                batteryLiquid.classList.add("gradient-color-orange");
                batteryLiquid.classList.remove("gradient-color-green", "gradient-color-red", "gradient-color-yellow");
            }else if(level <= 80){
                batteryLiquid.classList.add("gradient-color-yellow");
                batteryLiquid.classList.remove("gradient-color-green", "gradient-color-orange", "gradient-color-red");
            }else{
                batteryLiquid.classList.add("gradient-color-green");
                batteryLiquid.classList.remove("gradient-color-red", "gradient-color-orange", "gradient-color-yellow");
            };
        });
    };
    updateCharging(){
        navigator.getBattery().then((batteryInformation) => {
            this.setState({
                charging: batteryInformation.charging
            });
        });
    };
    componentDidMount(){
        this.updateBattery();
        navigator.getBattery().then((batteryInformation) => {
            batteryInformation.addEventListener("chargingchange", this.updateCharging());
            batteryInformation.addEventListener("levelchange", this.updateBattery());
        });
    };
    render(){
        return(
            <Draggable position={{ x: this.props.position.x, y: this.props.position.y }}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("battery")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("battery");
                    this.props.defaultProps.updatePosition("battery", "utility", data.x, data.y);
                }}
                cancel="button"
                bounds="parent">
                <div id="battery-widget"
                    className="widget">
                    <div id="battery-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="battery-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("battery", "utility")}
                        {/* Battery Image */}
                        <div id="battery-pill">
                            <div id="battery-level">
                                <div id="battery-liquid"></div>
                            </div>
                        </div>
                        {/* Battery Information */}
                        <div id="battery-information"
                            className="flex-center column float middle">
                            {(this.state.charging)
                                ? <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}><RiBattery2ChargeLine/></IconContext.Provider>
                                : <></>}
                            <p id="battery-percentage"
                                className="text-animation font bold black">{this.state.percentage}%</p>
                        </div>
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

export default memo(WidgetBattery);