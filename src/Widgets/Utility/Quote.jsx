import Slider from 'rc-slider';
import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaRegPaste, FaVolumeHigh } from 'react-icons/fa6';
import { MdNumbers } from 'react-icons/md';
import { classStack, decorationValue, fetchedData } from '../../data';
import { copyToClipboard } from '../../helpers';

let timeoutCopy;
let timeoutThinking;
let timeoutNextQuote;
let intervalLoop;

class WidgetQuote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentQuote: '',
            currentAuthor: '',
            falling: [],
            total: 8,
            touhoued: false,
            isThinking: true,
        };
        this.handleNewQuote = this.handleNewQuote.bind(this);
        this.storeData = this.storeData.bind(this);
    };

    handleNewQuote() {
        const randQuoteIndex = Math.floor(Math.random() * fetchedData.quotes.length);
        const randQuote = fetchedData.quotes[randQuoteIndex].quote;
        const randQuoteAuthor = (fetchedData.quotes[randQuoteIndex].author === '')
            ? 'Anon'
            : fetchedData.quotes[randQuoteIndex].author;

        if (this.state.touhoued) {
            this.createTimeout(randQuote, randQuoteAuthor);
            return;
        };

        this.setState({
            currentQuote: randQuote,
            currentAuthor: randQuoteAuthor
        });

        this.animateQuote();
    };

    createTimeout(quote, author) {
        clearTimeout(timeoutThinking);
        clearTimeout(timeoutNextQuote);

        this.setState({
            isThinking: true
        });

        const quoteText = document.getElementById('quote-container');
        const quoteAuthor = document.getElementById('author-container');

        if (!quoteText || !quoteAuthor) return;

        quoteText.style.visibility = 'hidden';
        quoteAuthor.style.visibility = 'hidden';

        const totalWords = quote.split(/\s/g).length;
        timeoutThinking = setTimeout(() => {
            this.setState({
                currentQuote: quote,
                currentAuthor: author,
                isThinking: false
            });

            quoteText.style.visibility = 'visible';
            quoteAuthor.style.visibility = 'visible';

            this.animateQuote();

            timeoutNextQuote = setTimeout(() => {
                this.handleNewQuote();
            }, (totalWords * 1.5) * 1000);
        }, (totalWords / 5) * 1000);
    };

    animateQuote() {
        const quoteText = document.getElementById('quote-container');
        const quoteAuthor = document.getElementById('author-container');

        if (!quoteText || !quoteAuthor) return;

        quoteText.style.animation = 'none';
        quoteAuthor.style.animation = 'none';
        
        window.requestAnimationFrame(() => {
            quoteText.style.animation = 'fadeIn 2s';
            quoteAuthor.style.animation = 'fadeIn 2s';
        });
        
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };

    handleButton(what) {
        switch (what) {
            case 'copy': {
                copyToClipboard(this.state.currentQuote);
                let elementQuote = document.getElementById('quote-text');
                elementQuote.style.textShadow = '0px 0px 10px var(--randColorLight)';
                timeoutCopy = setTimeout(() => {
                    elementQuote.style.textShadow = 'unset';
                }, 400);        
                break;
            };
            case 'talk': {
                this.props.parentRef.talk(this.state.currentQuote);
                break;
            };
            case 'total': {
                let elementSliderTotal = document.getElementById('quote-slider-total');
                if (elementSliderTotal.checkVisibility({ visibilityProperty: true })) {
                    elementSliderTotal.classList.remove('animation-quote-slider-total');          
                    elementSliderTotal.blur();
                } else {
                    elementSliderTotal.classList.add('animation-quote-slider-total');
                };
                break;
            };
            default: { break; };
        };
    };

    handleSlider(value) {
        this.setState({
            total: value
        });
    };

    handleSliderBlur() {
        let elementSliderTotal = document.getElementById('quote-slider-total');
        elementSliderTotal.classList.remove('animation-quote-slider-total');          
        if (this.state.total !== this.state.falling.length) {
            this.loadFallingImage();
        };
    };

    loadFallingImage() {
        if (this.state.total !== 0) {
            let fallingImage = new Image();
            fallingImage.src = '/resources/singles/petal.webp';
            let images = [];
            for (let i = 0; i < this.state.total; i++) {
                images.push(new Falling(fallingImage));
            };
            this.setState({
                falling: [...images]
            });
            clearInterval(intervalLoop);
            intervalLoop = setInterval(() => {
                this.loop();
            }, 1000 / 60);
        } else {
            this.clear();
            clearInterval(intervalLoop);   
        };
    };

    loop() {
        this.clear();
        this.state.falling.forEach((falling) => falling.animate());
    };

    clear() {
        const canvas = document.getElementById('quote-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    touhouify() {
        this.setState({
            touhoued: !this.state.touhoued
        }, () => {
            this.handleNewQuote();
        });

        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        };
    };

    storeData() {
        if (localStorage.getItem('widgets') === null) return;

        const dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
        dataLocalStorage.utility.quote = {
            ...dataLocalStorage.utility.quote,
            touhoued: this.state.touhoued
        };
        localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
    };

    componentDidMount() {
        if (localStorage.getItem('widgets') !== null) {
            const dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            const dataQuote = dataLocalStorage.utility.quote;
            if (dataQuote.touhoued !== undefined) {
                this.setState({
                    touhoued: dataQuote.touhoued,
                    isThinking: dataQuote.touhoued
                });
            };
        };

        window.addEventListener('beforeunload', this.storeData);
        this.handleNewQuote();
        this.loadFallingImage();
    };
    
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.storeData);

        clearTimeout(timeoutCopy);
        clearTimeout(timeoutThinking);
        clearTimeout(timeoutNextQuote);
        clearInterval(intervalLoop);

        this.storeData();
    };
    
    render() {
        return (
            <Draggable defaultPosition={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart('quote')}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop('quote');
                    this.props.defaultProps.updatePosition('quote', 'utility', data.x, data.y);
                }}
                cancel='button, span, p'
                bounds='parent'>
                <section id='quote-widget' 
                    className='widget'
                    aria-labelledby='quote-widget-heading'>
                    <h2 id='quote-widget-heading'
                        className='screen-reader-only'>Quote Widget</h2>
                    <div id='quote-widget-animation'
                        className={`widget-animation ${this.state.touhoued ? 'speech-bubble' : ''} ${classStack}`}>
                        <span id='quote-widget-draggable'
                            className='draggable'>
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: 'global-class-name' }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        <img className={`decoration ${decorationValue}`}
                            src={`/resources/decoration/${decorationValue}.webp`}
                            alt={decorationValue}
                            key={decorationValue}
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                            loading='lazy'
                            decoding='async'/>
                        {this.props.defaultProps.renderHotbar('quote', 'utility')}
                        {/* Falling Images */}
                        <canvas id='quote-canvas'
                            className='float center'></canvas>
                        {/* Background Image */}
                        <div id='quote-image'
                            className='float center'></div>
                        <button className='touhouify'
                            onClick={() => this.touhouify()}
                            type='button'>
                            <img src='/favicon-32x32.png'
                                alt='widget hell icon'/>
                        </button>
                        {this.state.touhoued
                            && <img className='quote-reimu'
                                src={`/resources/quote/reimu-${this.state.isThinking ? 'thinking' : 'talking'}.webp`}
                                alt='reimu talking'
                                draggable={false}/>}
                        {this.state.isThinking
                            && <span className='quote-reimu-thinking'>...</span>}
                        {/* Quote */}
                        <div id='quote-container'
                            className='aesthetic-scale scale-self'>
                            <span className='font-quote large'>"</span>
                            <span id='quote-text'
                                className='text-animation font large normal'>{this.state.currentQuote}</span>
                            <span className='font-quote large'>"</span>
                        </div>
                        <p id='author-container'
                            className='text-animation aesthetic-scale scale-self font-author'>- {this.state.currentAuthor}</p>
                        {/* Bottom Bar */}
                        <div className='element-ends'>
                            <div className='flex-center row space-nicely space-left'>
                                {/* Clipboard */}
                                <button className='button-match inverse'
                                    aria-label='Copy'
                                    onClick={() => this.handleButton('copy')}>
                                    <IconContext.Provider value={{ className: 'global-class-name' }}>
                                        <FaRegPaste/>
                                    </IconContext.Provider>
                                </button>
                                {/* Talk */}
                                <button className='button-match inverse'
                                    aria-label='Read'
                                    onClick={() => this.handleButton('talk')}>
                                    <IconContext.Provider value={{ className: 'global-class-name' }}>
                                        <FaVolumeHigh/>
                                    </IconContext.Provider>
                                </button>
                                {/* Total */}
                                <button className='button-match inverse'
                                    aria-label='Total petals'
                                    onClick={() => this.handleButton('total')}>
                                    <IconContext.Provider value={{ className: 'global-class-name' }}>
                                        <MdNumbers/>
                                    </IconContext.Provider>
                                </button>
                                <span id='quote-slider-total'>
                                    <Slider className='slider'
                                        onChange={(value) => this.handleSlider(value)}
                                        onBlur={() => this.handleSliderBlur()}
                                        min={0}
                                        max={100}
                                        step={1}
                                        marks={{
                                            8: {
                                                label: 8,
                                                style: {display: 'none' }
                                            }
                                        }}
                                        value={this.state.total}/>
                                </span>
                            </div>
                            {/* New Quote */}
                            {!this.state.touhoued
                                && <button className='button-match'
                                    onClick={this.handleNewQuote}>New Quote</button>}
                        </div>
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                            : <></>}
                    </div>
                </section>
            </Draggable>
        );
    };
};

/// Created by Evan Jin (진경성) https://codepen.io/rudtjd2548
class Falling {
    constructor(image) {
        const canvas = document.getElementById('quote-canvas');
        this.fallingImage = image;
        this.x = -Math.random() * canvas.width;
        this.y = -(Math.random() * canvas.height * 2) - canvas.height;
        this.w = 25 + Math.random() * 15;
        this.h = 20 + Math.random() * 10;
        this.opacity = (this.w / 40) - 0.4;
        this.flip = Math.random();
        this.xSpeed = 1.5 + Math.random() * 2;
        this.ySpeed = 1 + Math.random() * 1;
        this.flipSpeed = Math.random() * 0.03;
    };

    draw() {
        const canvas = document.getElementById('quote-canvas');
        const ctx = canvas.getContext('2d');
        if (this.y > canvas.height || this.x > canvas.width) {
            this.x = -this.fallingImage.width;
            this.y = (Math.random() * canvas.height * 2) - canvas.height;
            this.xSpeed = 1.5 + Math.random() * 2;
            this.ySpeed = 1 + Math.random() * 1;
            this.flip = Math.random();
        };
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
            this.fallingImage, 
            this.x, 
            this.y, 
            this.w * (0.6 + (Math.abs(Math.cos(this.flip)) / 3)), 
            this.h * (0.8 + (Math.abs(Math.sin(this.flip)) / 5))
        );
    };

    animate() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.flip += this.flipSpeed;
        this.draw();
    };
};

export default memo(WidgetQuote);