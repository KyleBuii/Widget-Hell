import { React, Component } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import Select from "react-select";
import { BsArrowLeftRight } from 'react-icons/bs';


/// Variables
const optionsMoneyConversion = [
    {
        label: "Currency",
        options: []
    }
];


class WidgetCurrencyConverter extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: 1,
            from: {value: "US", label: "USD"},
            to: {value: "US", label: "USD"},
            rate: "?",
            result: "?"
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSwap = this.handleSwap.bind(this);
        this.fetchExchangeRate = this.fetchExchangeRate.bind(this);
    };
    handleInput(event){
        if(event.target.value !== "e"){
            this.setState({
                input: event.target.value,
                rate: (this.state.rate !== "?") ? "?" : this.state.rate,
                result: (this.state.result !== "?") ? "?" : this.state.result
            });
        };
    };
    handleSwap(){
        if(this.state.from.value !== this.state.to.value){
            this.props.randColor();
            const prev = this.state.from;
            this.setState(prevState => ({
                from: prevState.to,
                to: prev,
                rate: (this.state.rate !== "?") ? "?" : this.state.rate,
                result: (this.state.result !== "?") ? "?" : this.state.result
            }));
        };
    };
    handleSelect(what, event){
        this.setState({
            [what]: event,
            rate: (this.state.rate !== "?") ? "?" : this.state.rate,
            result: (this.state.result !== "?") ? "?" : this.state.result
        });
    };
    async fetchExchangeRate(){
        if(this.state.from.value !== this.state.to.value
            && /^\d*\.?\d*$/.test(this.state.input)){
            const url = `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_CURRENCY_CONVERTER_API_KEY}/latest/${this.state.from.label}`;
            try{
                const response = await fetch(url);
                const result = await response.json();
                const exchangeRate = result.conversion_rates[this.state.to.label];
                const calculateExchangeRate = (this.state.input * exchangeRate).toFixed(2);
                this.setState({
                    result: calculateExchangeRate,
                    rate: exchangeRate
                });
            }catch(err){
                this.setState({
                    result: "?",
                    rate: "?"
                });
            };
        }else{
            this.setState({
                result: this.state.input,
                rate: this.state.input
            });
        };
    };
    componentDidMount(){
        if(sessionStorage.getItem("currencyconverter") !== null){
            let dataSessionStorage = JSON.parse(sessionStorage.getItem("currencyconverter"));
            this.setState({
                from: dataSessionStorage.from,
                to: dataSessionStorage.to
            });
        };
        /// Populate options
        for(let i = 0; i < this.props.moneyConversions.length; i+=2){
            optionsMoneyConversion[0]["options"].push({value: this.props.moneyConversions[i + 1], label: this.props.moneyConversions[i]});
        };
    };
    componentWillUnmount(){
        sessionStorage.setItem("currencyconverter", JSON.stringify({
            from: this.state.from,
            to: this.state.to
        }));
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("currencyconverter")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("currencyconverter");
                    this.props.defaultProps.updatePosition("currencyconverter", "utility", data.x, data.y);
                }}
                cancel="button, input, span, .select-match"
                bounds="parent">
                <div id="currencyconverter-widget"
                    className="widget">
                    <div id="currencyconverter-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="currencyconverter-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("currencyconverter", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("currencyconverter", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                        </section>
                        {/* Currency Converter Container */}
                        <section id="currencyconverter-container"
                            className="flex-center column gap small">
                            <div id="currencyconverter-result"
                                className="aesthetic-scale scale-span flex-center column fill-width">
                                <span className="font large">{this.state.input} {this.state.from.label} = {this.state.result} {this.state.to.label}</span>
                                <span className="font micro transparent-normal">1 {this.state.from.label} = {this.state.rate} {this.state.to.label}</span>
                            </div>
                            <input className="input-match fill-width"
                                type="number"
                                name="currencyconverter-input"
                                onChange={this.handleInput}
                                value={this.state.input}/>
                            <div className="flex-center row gap">
                                <Select id="currencyconverter-select-from"
                                    className="select-match"
                                    value={this.state.from}
                                    defaultValue={optionsMoneyConversion[0]["options"][0]}
                                    options={optionsMoneyConversion}
                                    onChange={(event) => this.handleSelect("from", event)}
                                    formatGroupLabel={this.props.formatGroupLabel}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            ...this.props.selectTheme
                                        }
                                    })}/>
                                <button className="button-match inverse"
                                    onClick={this.handleSwap}>
                                    <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                        <BsArrowLeftRight/>
                                    </IconContext.Provider>
                                </button>
                                <Select id="currencyconverter-select-to"
                                    className="select-match"
                                    value={this.state.to}
                                    defaultValue={optionsMoneyConversion[0]["options"][0]}
                                    options={optionsMoneyConversion}
                                    onChange={(event) => this.handleSelect("to", event)}
                                    formatGroupLabel={this.props.formatGroupLabel}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            ...this.props.selectTheme
                                        }
                                    })}/>
                            </div>
                            <button className="button-match fill-width"
                                type="button"
                                onClick={() => this.fetchExchangeRate()}>Exchange</button>
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

export default WidgetCurrencyConverter;