import React, { memo, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import QRCode from 'react-qr-code';
import Select from 'react-select';
import { classStack, decorationValue, smallMedIcon } from '../../data';
import { formatGroupLabel } from '../../helpers';

const optionsSize= [
    {
        label: 'Sizes',
        options: [
            { value: 32,  label: '32x32' },
            { value: 64,  label: '64x64' },
            { value: 128, label: '128x128' },
            { value: 256, label: '256x256' },
            { value: 512, label: '512x512' }
        ]
    }
];

const WidgetQRCode = ({ defaultProps, parentRef }) => {
    const [state, setState] = useState({
        input: '',
        size: 256,
        backgroundColor: 'white',
        foregroundColor: 'black'
    });

    const handleChange = (what, where) => {
        setState((prevState) => ({
            ...prevState,
            [where]: what
        }));
    };

    const handleColorPicker = (event, where) => {
        setState((prevState) => ({
            ...prevState,
            [`${where}Color`]: event.target.value
        }));
    };
    
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('qrcode')}
            onStop={(event, data) => {
                defaultProps.dragStop('qrcode');
                defaultProps.updatePosition('qrcode', 'utility', data.x, data.y);
            }}
            cancel='input, .select-match, button, #qrcode'
            bounds='parent'>
            <section id='qrcode-widget'
                className='widget'
                aria-labelledby='qrcode-widget-heading'>
                <h2 id='qrcode-widget-heading'
                    className='screen-reader-only'>QR Code Widget</h2>
                <div id='qrcode-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='qrcode-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
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
                    {defaultProps.renderHotbar('qrcode', 'utility')}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                    {/* Input Container */}
                    <div className='flex-center row gap small-gap'>
                        <input className='input-match'
                            type='text'
                            name='qrcode-input-text'
                            placeholder='Enter QR Text'
                            aria-labelledby='qrcode-input-aria-describedby'
                            value={state.input}
                            onChange={(event) => handleChange(event.target.value, 'input')}></input>
                        <span id='qrcode-input-aria-describedby'
                            className='screen-reader-only'>
                            Type text here to turn it into a QR code.
                        </span>
                        {/* Dimension */}
                        <Select className='select-match'
                            defaultValue={optionsSize[0]['options'][3]}
                            options={optionsSize}
                            onChange={(event) => handleChange(event.value, 'size')}
                            formatGroupLabel={formatGroupLabel}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    ...parentRef.state.selectTheme
                                }
                            })}/>
                    </div>
                    {/* QR Code Container */}
                    <div className='box dimmed space-nicely space-top'>
                        <div className='flex-center'>
                            <QRCode id='qrcode'
                                className='aesthetic-scale scale-self'
                                value={state.input}
                                size={state.size}
                                bgColor={state.backgroundColor}
                                fgColor={state.foregroundColor}/>
                        </div>
                        {/* Bottom Bar */}
                        <div className='element-ends space-nicely space-top length-medium not-bottom'>
                            {/* Color Chosers */}
                            <div className='flex-center row gap'>
                                <input className='color-input-match'
                                    type='color'
                                    defaultValue={'#ffffff'}
                                    onBlur={(event) => handleColorPicker(event, 'background')}></input>
                                <input className='color-input-match'
                                    type='color'
                                    defaultValue={'#0000000'}
                                    onBlur={(event) => handleColorPicker(event, 'foreground')}></input>
                            </div>
                            {/* Download Button */}
                            <button className='button-match inverse'
                                aria-label='Download'
                                onClick={() => {
                                    let svg = document.getElementById('qrcode');
                                    let svgData = new XMLSerializer().serializeToString(svg);
                                    let canvas = document.createElement('canvas');
                                    let ctx = canvas.getContext('2d');
                                    let image = new Image();
                                    image.onload = () => {
                                        canvas.width = image.width;
                                        canvas.height = image.height;
                                        ctx.drawImage(image, 0, 0);
                                        let pngFile = canvas.toDataURL('image/png');
                                        let downloadLink = document.createElement('a');
                                        downloadLink.download = 'QRCode';
                                        downloadLink.href = pngFile;
                                        downloadLink.click();
                                    };
                                    image.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
                                }}>
                                <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                    <FaDownload/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetQRCode);