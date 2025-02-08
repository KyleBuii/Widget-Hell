import { HfInference } from '@huggingface/inference';
import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaDownload, FaGripHorizontal } from 'react-icons/fa';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import Select from 'react-select';


/// Variables
const hf = new HfInference(import.meta.env.VITE_AI_IMAGE_GENERATOR_ACCESS_TOKEN);
const optionsModel = [
    {
        label: "Models",
        options: [
            {label: "SD-XL 1.0-base", value: "stabilityai/stable-diffusion-xl-base-1.0"},
            {label: "Stable Diffusion v1-4", value: "CompVis/stable-diffusion-v1-4"},
            {label: "Openjourney v4", value: "prompthero/openjourney-v4"},
            {label: "Stable Diffusion 2-1 Realistic", value: "friedrichor/stable-diffusion-2-1-realistic"},
            {label: "RealVisXL V4.0", value: "SG161222/RealVisXL_V4.0"},
            {label: "Dream Shaper v7 LCM", value: "SimianLuo/LCM_Dreamshaper_v7"},
            {label: "Dream Shaper", value: "Lykon/DreamShaper"},
            {label: "ColoringBook-Redmond V2", value: "artificialguybr/ColoringBookRedmond-V2"},
            {label: "Animagine XL 3.1", value: "cagliostrolab/animagine-xl-3.1"},
            {label: "Latent Consistency Model (LCM) LoRA: SDXL", value: "latent-consistency/lcm-lora-sdxl"},
            {label: "CuteCartoon-Redmond V2", value: "artificialguybr/CuteCartoonRedmond-V2"},
            {label: "NSFW-gen-v2", value: "UnfilteredAI/NSFW-gen-v2"},
            {label: "Pixel Art XL", value: "nerijs/pixel-art-xl"},
        ]
    }
];

const WidgetAiImageGenerator = ({ defaultProps, formatGroupLabel, selectTheme, menuListScrollbar, smallIcon, smallMedIcon }) => {
    const [state, setState] = useState({
        prompt: '',
        negative: '',
        model: { label: 'SD-XL 1.0-base', value: 'stabilityai/stable-diffusion-xl-base-1.0' },
        size: 400,
        image: '',
        running: false
    });
    useEffect(() => {
        window.addEventListener('beforeunload', storeData);
        if (localStorage.getItem('widgets') !== null) {
            const dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            const dataAiImageGenerator = dataLocalStorage['fun']['aiimagegenerator'];
            if (dataAiImageGenerator['prompt'] !== undefined) {
                setState((prevState) => ({
                    ...prevState,
                    prompt: dataAiImageGenerator.prompt,
                    negative: dataAiImageGenerator.negative,
                    model: dataAiImageGenerator.model
                }));
            };
        };
        document.getElementById('aiimagegenerator-button-download').style.visibility = 'hidden';
    }, []);
    useEffect(() => {
        return () => {
            window.removeEventListener('beforeunload', storeData);
            storeData();    
        };
    }, [state.prompt, state.negative, state.model]);
    const generateImage = async () => {
        if (!state.running) {
            try {
                setState((prevState) => ({
                    ...prevState,
                    running: true
                }));
                const randomNumber = Math.floor(Math.random() * 10000 + 1);
                const result = await hf.textToImage({
                    inputs: `${state.prompt} ${randomNumber}`,
                    model: state.model.value,
                    parameters: {
                        negative_prompt: state.negative
                    }
                });
                const imageURL = URL.createObjectURL(result);
                const elementImage = document.createElement('img');
                const elementImagesContainer = document.getElementById('aiimagegenerator-images');
                elementImagesContainer.innerHTML = '';
                elementImage.src = imageURL;
                elementImage.alt = 'generated art';
                elementImage.loading = 'lazy';
                elementImage.decoding = 'async';
                elementImage.draggable = false;
                elementImage.style.height = `${state.size}px`;
                elementImage.style.width = `${state.size}px"`;
                elementImagesContainer.appendChild(elementImage);
                setState((prevState) => ({
                    ...prevState,
                    image: imageURL
                }));
                document.getElementById('aiimagegenerator-button-download').style.visibility = 'visible';
            } catch(err) {
                console.error(err)
                setState((prevState) => ({
                    ...prevState,
                    running: false
                }));
            } finally {
                setState((prevState) => ({
                    ...prevState,
                    running: false
                }))
            };
        };
    };
    const handleButtonHelp = () => {
        let popoutAnimation = document.getElementById('aiimagegenerator-popout-animation-help');
        defaultProps.showHidePopout(popoutAnimation, !popoutAnimation.checkVisibility({ visibilityProperty: true })); 
    };
    const handleInput = (what, event) => {
        setState((prevState) => ({
            ...prevState,
            [what]: event.target.value
        }));
    };
    const handleSelect = (event) => {
        setState((prevState) => ({
            ...prevState,
            model: event
        }));
    };
    const downloadImage = () => {
        const elementA = document.createElement('a');
        elementA.href = state.image;
        elementA.download = 'Image.jpg';
        elementA.click();
    };
    const storeData = () => {
        if ((state.prompt !== '' || state.negative !== '')
            && localStorage.getItem('widgets') !== null) {
            const dataLocalStorage = JSON.parse(localStorage.getItem('widgets'));
            dataLocalStorage['fun']['aiimagegenerator'] = {
                prompt: state.prompt,
                negative: state.negative,
                model: state.model
            };
            localStorage.setItem('widgets', JSON.stringify(dataLocalStorage));
        };
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('aiimagegenerator')}
            onStop={(event, data) => {
                defaultProps.dragStop('aiimagegenerator');
                defaultProps.updatePosition('aiimagegenerator', 'fun', data.x, data.y);
            }}
            cancel='span, textarea, button, .popout, .select-match'
            bounds='parent'>
            <div id='aiimagegenerator-widget'
                className='widget'>
                <div id='aiimagegenerator-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='aiimagegenerator-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: "global-class-name" }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('aiimagegenerator', 'fun')}
                    <section className='flex-center column gap small-gap'>
                        {/* Inputs */}
                        <div id='aiimagegenerator-inputs'
                            className='aesthetic-scale scale-span flex-center only-justify-content column gap font bold'>
                            <div className='element-ends'>
                                <span className='origin-left'>Prompt</span>
                                <button className='when-elements-are-not-straight button-match inverse'
                                    onClick={() => handleButtonHelp()}>
                                    <IconContext.Provider value={{ size: smallIcon, className: 'global-class-name' }}>
                                        <FaRegCircleQuestion/>
                                    </IconContext.Provider>
                                </button>
                            </div>
                            <textarea className='textarea-match'
                                value={state.prompt}
                                name='textarea-prompt'
                                placeholder='Write your prompt here.'
                                onChange={(event) => handleInput('prompt', event)}></textarea>
                            <span className='origin-left'>Undesired Content</span>
                            <textarea className='textarea-match'
                                value={state.negative}
                                name='textarea-undesired-content'
                                placeholder='Write what you want removed here.'
                                onChange={(event) => handleInput('negative', event)}></textarea>
                        </div>
                        {/* Model Select */}
                        <Select className='select-match'
                            defaultValue={optionsModel[0]['options'][0]}
                            value={state.model}
                            options={optionsModel}
                            onChange={(event) => handleSelect(event)}
                            isDisabled={state.running}
                            formatGroupLabel={formatGroupLabel}
                            components={{
                                MenuList: menuListScrollbar
                            }}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    ...selectTheme
                                }
                            })}/>
                        {/* Generate Button */}
                        <button className='button-match fill-width'
                            onClick={() => generateImage()}
                            disabled={state.running}>{(state.running) ? 'Generating...' : 'Generate'}</button>
                        {/* Image */}
                        <div id='aiimagegenerator-images'
                            className='aesthetic-scale scale-self grid col-auto'></div>
                        {/* Download Button */}
                        <button id='aiimagegenerator-button-download'
                            className='button-match inverse disabled circular float bottom-right'
                            onClick={() => downloadImage()}>
                            <IconContext.Provider value={{ size: smallMedIcon, className: 'global-class-name' }}>
                                <FaDownload/>
                            </IconContext.Provider>
                        </button>
                    </section>
                    {/* Prompt Help Popout */}
                    <Draggable cancel='li'
                        position={{
                            x: defaultProps.popouts.prompthelp.position.x,
                            y: defaultProps.popouts.prompthelp.position.y
                        }}
                        onStop={(event, data) => defaultProps.updatePosition('aiimagegenerator', 'fun', data.x, data.y, 'popout', 'prompthelp')}
                        bounds={defaultProps.calculateBounds('aiimagegenerator-widget', 'aiimagegenerator-popout-help')}>
                        <section id='aiimagegenerator-popout-help'
                            className='popout'>
                            <section id='aiimagegenerator-popout-animation-help'
                                className='popout-animation'>
                                <ul className='aesthetic-scale scale-li font medium'>
                                    <li>[ ] - De-emphasizes a tag</li>
                                    <li>&#123; &#125; - Emphasizes a tag</li>
                                </ul>
                            </section>
                        </section>
                    </Draggable>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetAiImageGenerator);