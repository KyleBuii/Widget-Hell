import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0, FaBold, FaSuperscript, FaSubscript, FaListOl, FaListUl, FaRotateLeft, FaRotateRight, FaLink, FaLinkSlash, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaIndent, FaOutdent } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import Spreadsheet from 'react-spreadsheet';


class WidgetSpreadsheet extends Component{
    constructor(props){
        super(props);
        this.state = {
            colLabels: ["A", "B", "C", "D", "E", "F", "G", "H"],
            rowLabels: [1, 2, 3, 4, 5, 6, 7, 8],
            data: []
        };
        this.handleData = this.handleData.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    handleData(what){
        if(JSON.stringify(this.state.data) !== JSON.stringify(what)){
            this.setState({
                data: what
            });
        };
    };
    storeData(){
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["utility"]["spreadsheet"] = {
                ...dataLocalStorage["utility"]["spreadsheet"],
                data: this.state.data
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    componentDidMount(){
        /// Load widget's data from local storage
        if(localStorage.getItem("widgets") !== null){
            let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            let localStorageSpreadsheet = dataLocalStorage["utility"]["spreadsheet"];
            if(localStorageSpreadsheet["data"] !== undefined){
                this.setState({
                    data: localStorageSpreadsheet["data"]
                });
            }else{
                let temp = [];
                for(let i = 0; i < 8; i++){
                    temp[i] = [];
                    for(let j = 0; j < 8; j++){
                        temp[i].push({});
                    };
                };
                this.setState({
                    data: temp
                });   
            };
        }else{
            let temp = [];
            for(let i = 0; i < 8; i++){
                temp[i] = [];
                for(let j = 0; j < 8; j++){
                    temp[i].push({});
                };
            };
            this.setState({
                data: temp
            });       
        };
    };
    componentWillUnmount(){
        this.storeData();
    };
    render(){
        return(
            <Draggable 
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("spreadsheet")}
                onStop={() => this.props.defaultProps.dragStop("spreadsheet")}
                onDrag={(event, data) => this.props.defaultProps.updatePosition("spreadsheet", "utility", data.x, data.y)}
                cancel=".Spreadsheet, button, .select-match, input, label"
                bounds="parent">
                <div id="spreadsheet-widget"
                    className="widget">
                    <div id="spreadsheet-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="spreadsheet-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("spreadsheet", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="btn-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("spreadsheet", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        <Spreadsheet 
                            data={this.state.data}
                            columnLabels={this.state.colLabels}
                            rowLabels={this.state.rowLabels}
                            onChange={(val) => this.handleData(val)}/>
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

export default WidgetSpreadsheet;