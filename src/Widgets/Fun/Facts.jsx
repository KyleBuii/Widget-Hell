import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';


class WidgetFacts extends Component{
    constructor(props){
        super(props);
        this.state = {
            facts: {
                cat: []
            }
        };
    };
    async fetchFacts(){
        try{
            /// Cat
            const urlCat = "https://cat-fact.herokuapp.com/facts";
            const responseCat = await fetch(urlCat);
            const dataCat = await responseCat.json();
            let catFacts = [];
            for(let i of dataCat){
                catFacts.push(i.text);
            };
            this.setState({
                facts: {
                    ...this.state.facts,
                    cat: [...catFacts]
                }
            }, () => {
                this.storeData();    
            });
        }catch(err){
            console.error(err);
        };
    };
    storeData(){
        let data = {};
        let keysFacts = Object.keys(this.state.facts);
        for(let i of keysFacts){
            /// Default is a string
            switch(i){
                case "cat":
                    data[i] = [...this.state.facts[i]];
                    break;
                default:
                    data[i] = this.state.facts[i];
                    break;
            };
        };
        sessionStorage.setItem("facts", JSON.stringify(data));
    };
    componentDidMount(){
        const dateLocalStorage = JSON.parse(localStorage.getItem("date"));
        const currentDate = new Date().getDate();
        if((sessionStorage.getItem("facts") !== null)
            && (dateLocalStorage["facts"] === currentDate)){
            this.setState({
                facts: {...JSON.parse(sessionStorage.getItem("facts"))}
            });
        }else{
            this.fetchFacts();
            localStorage.setItem("date", JSON.stringify({
                ...dateLocalStorage,
                "facts": currentDate
            }));
        };
    };
    render(){
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("facts")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("facts");
                    this.props.defaultProps.updatePosition("facts", "fun", data.x, data.y);
                }}
                cancel="span"
                bounds="parent">
                <div id="facts-widget"
                    className="widget">
                    <div id="facts-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="facts-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("facts", "fun")}
                        {/* Facts */}
                        <section className="aesthetic-scale scale-span flex-center column gap only-justify-content">
                            {/* Cat */}
                            <span className="font bold">&#128008; Cat Facts</span>
                            <div className="alternating-text-color flex-center column gap">
                                {(this.state.facts.cat.length !== 0)
                                    ? this.state.facts.cat.map((text, index) => {
                                        return <span className="text-animation"
                                            key={`facts-cat-${index}`}>{text}</span>
                                    })
                                    : <span>No facts</span>}
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

export default memo(WidgetFacts);