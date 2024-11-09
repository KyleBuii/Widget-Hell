import React, { Component, createRef, memo } from 'react';


/// Variables
let points = [];
let flipNext = true;
let intervalLoop;


/// Mouse trail adapted from a jQuery Codepen by Bryan C (https://codepen.io/bryjch/pen/QEoXwA)
class Cursor extends Component{
    constructor(props){
        super(props);
        this.canvas = createRef();
        this.addPoint = this.addPoint.bind(this);
        this.setSize = this.setSize.bind(this);
    };
    /// Get the distance between a & b
    distance(a, b){
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    /// Get the mid point between a & b
    midPoint(a, b){
        const mx = a.x + (b.x - a.x) * 0.5;
        const my = a.y + (b.y - a.y) * 0.5;
        return new Point(mx, my);
    };
    /// Get the angle between a & b
    angle(a, b){
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.atan2(dy, dx);
    };
    addPoint({ clientX, clientY }){
        flipNext = !flipNext;
        const canvas = this.canvas.current;
        const point = new Point(clientX - canvas.offsetLeft, clientY - canvas.offsetTop, 0, flipNext);
        points.push(point);
    };
    animatePoints(){
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const duration = this.props.duration * 1000 / 60;
        for(let i = 0; i < points.length; i++){
            const point = points[i];
            let lastPoint;
            if(points[i - 1] !== undefined){
                lastPoint = points[i - 1];
            }else{
                lastPoint = point;
            };
            point.lifetime += 1;
            if(point.lifetime > duration){
                /// If the point dies, remove it
                points.shift();
            }else{
                /// Otherwise animate it:
                /// As the lifetime goes on, lifePercent goes from 0 to 1
                const lifePercent = point.lifetime / duration;
                const spreadRate = this.props.thickness * (1 - lifePercent);
                ctx.lineJoin = "round";
                ctx.lineWidth = spreadRate;
                /// As time increases decrease r and b, increase g to go from purple to green
                let red, green, blue;
                if(this.props.flat){
                    red = this.props.color[0];
                    green = this.props.color[1];
                    blue = this.props.color[2];
                }else{
                    red = Math.floor(this.props.color[0] - 190 * lifePercent);
                    green = this.props.color[1];
                    blue = Math.floor(this.props.color[2] + 210 * lifePercent);
                };
                let pointDistance = this.distance(lastPoint, point);
                let pointMidpoint = this.midPoint(lastPoint, point);
                let pointAngle = this.angle(lastPoint, point);            
                ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
                ctx.beginPath();
                switch(this.props.mode){
                    case "squiggly":
                        ctx.arc(
                            pointMidpoint.x,
                            pointMidpoint.y,
                            pointDistance / 2,
                            pointAngle,
                            (pointAngle + Math.PI),
                            point.flip
                        );
                        break;
                    case "circle":
                        ctx.arc(
                            pointMidpoint.x,
                            pointMidpoint.y,
                            pointDistance / 2,
                            0,
                            (Math.PI * 2)
                        );    
                        break;
                    default:
                        ctx.moveTo(lastPoint.x, lastPoint.y);
                        ctx.lineTo(point.x, point.y);    
                        break;
                };
                ctx.stroke();
                ctx.closePath();
            };
        };
    };
    setSize(){
        let elementCanvas = document.getElementById("cursor-canvas");
        elementCanvas.height = document.body.clientHeight;
        elementCanvas.width = document.body.clientWidth;
    };
    componentDidMount(){
        this.setSize();
        window.addEventListener("resize", this.setSize);
        document.addEventListener("mousemove", this.addPoint);
        /// If the device supports cursors, start animation
        if(matchMedia("(pointer:fine)").matches){
            intervalLoop = setInterval(() => {
                this.animatePoints();
            }, 1000 / 60);
        };
    };
    componentWillUnmount(){
        clearInterval(intervalLoop);
        window.removeEventListener("resize", this.setSize);
        document.removeEventListener("mousemove", this.addPoint);
    };
    render(){
        return(
            <canvas id="cursor-canvas"
                ref={this.canvas}
                style={{
                    zIndex: 8,
                    pointerEvents: "none"
                }}/>
        );
    };
};

class Point{
    constructor(x, y, lifetime, flip){
        this.x = x;
        this.y = y;
        this.lifetime = lifetime;
        this.flip = flip;
    };
};


export default memo(Cursor);