import { HfInference } from '@huggingface/inference';
import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaDownload, FaGripHorizontal } from 'react-icons/fa';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import Select from 'react-select';


/// Variables
const hf = new HfInference(import.meta.env.VITE_AI_IMAGE_GENERATOR_ACCESS_TOKEN);
const optionsModel= [
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


class WidgetAiImageGenerator extends Component{
    constructor(props){
        super(props);
        this.state = {
            prompt: "",
            negative: "",
            model: {label: "SD-XL 1.0-base", value: "stabilityai/stable-diffusion-xl-base-1.0"},
            size: 400,
            image: "",
            running: false
        };
        this.generateImage = this.generateImage.bind(this);
        this.downloadImage = this.downloadImage.bind(this);
        this.storeData = this.storeData.bind(this);
    };
    handleInput(what, event){
        this.setState({
            [what]: event.target.value
        });
    };
    handleSelect(event){
        this.setState({
            model: event
        });
    };
    handleButtonHelp(){
        let popoutAnimation = document.getElementById("aiimagegenerator-popout-animation-help");
        this.props.defaultProps.showHidePopout(popoutAnimation, !popoutAnimation.checkVisibility({visibilityProperty: true}));
    };
    async generateImage(){
        if(this.state.input !== "" && !this.state.running){
            try{
                this.setState({
                    running: true
                });
                const randomNumber = Math.floor(Math.random() * 10000 + 1);
                const result = await hf.textToImage({
                    inputs: `${this.state.prompt} ${randomNumber}`,
                    model: this.state.model.value,
                    parameters: {
                        negative_prompt: this.state.negative
                    }
                });
                const imageURL = URL.createObjectURL(result);
                const elementImage = document.createElement("img");
                const elementImagesContainer = document.getElementById("aiimagegenerator-images");
                elementImagesContainer.innerHTML = "";
                elementImage.src = imageURL;
                elementImage.alt = `generated art`;
                elementImage.draggable = false;
                elementImage.style.height = `${this.state.size}px`;
                elementImage.style.width = `${this.state.size}px"`;
                elementImagesContainer.appendChild(elementImage);
                this.setState({
                    image: imageURL
                });
                document.getElementById("aiimagegenerator-button-download")
                    .style
                    .visibility = "visible";
            }catch(err){
                console.error(err)
                this.setState({
                    running: false
                });
            }finally{
                this.setState({
                    running: false
                });
            };
        };
    };
    downloadImage(){
        const elementA = document.createElement("a");
        elementA.href = this.state.image;
        elementA.download = "Image.jpg";
        elementA.click();
    };
    storeData(){
        if((this.state.prompt !== "" || this.state.negative !== "")
            && localStorage.getItem("widgets") !== null){
            const dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            dataLocalStorage["fun"]["aiimagegenerator"] = {
                prompt: this.state.prompt,
                negative: this.state.negative,
                model: this.state.model
            };
            localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
        };
    };
    componentDidMount(){
        window.addEventListener("beforeunload", this.storeData);
        if(localStorage.getItem("widgets") !== null){
            const dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
            const dataAiImageGenerator = dataLocalStorage["fun"]["aiimagegenerator"];
            if(dataAiImageGenerator["prompt"] !== undefined){
                this.setState({
                    prompt: dataAiImageGenerator.prompt,
                    negative: dataAiImageGenerator.negative,
                    model: dataAiImageGenerator.model
                });
            };
        };
        document.getElementById("aiimagegenerator-button-download")
            .style
            .visibility = "hidden";
    };
    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.storeData);
        this.storeData();
    };
    render(){
        return(
            <Draggable position={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("aiimagegenerator")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("aiimagegenerator");
                    this.props.defaultProps.updatePosition("aiimagegenerator", "fun", data.x, data.y);
                }}
                cancel="span, textarea, button, .popout, .select-match"
                bounds="parent">
                <div id="aiimagegenerator-widget"
                    className="widget">
                    <div id="aiimagegenerator-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="aiimagegenerator-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.defaultProps.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {this.props.defaultProps.renderHotbar("aiimagegenerator", "fun")}
                        <section className="flex-center column gap small-gap">
                            {/* Inputs */}
                            <div id="aiimagegenerator-inputs"
                                className="aesthetic-scale scale-span flex-center only-justify-content column gap font bold">
                                <div className="element-ends">
                                    <span className="origin-left">Prompt</span>
                                    <button className="when-elements-are-not-straight button-match inverse"
                                        onClick={() => this.handleButtonHelp()}>
                                        <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                            <FaRegCircleQuestion/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                                <textarea className="textarea-match"
                                    value={this.state.prompt}
                                    name="textarea-prompt"
                                    placeholder="Write your prompt here."
                                    onChange={(event) => this.handleInput("prompt", event)}></textarea>
                                <span className="origin-left">Undesired Content</span>
                                <textarea className="textarea-match"
                                    value={this.state.negative}
                                    name="textarea-undesired-content"
                                    placeholder="Write what you want removed here."
                                    onChange={(event) => this.handleInput("negative", event)}></textarea>
                            </div>
                            {/* Model Select */}
                            <Select className="select-match"
                                defaultValue={optionsModel[0]["options"][0]}
                                value={this.state.model}
                                options={optionsModel}
                                onChange={(event) => this.handleSelect(event)}
                                isDisabled={this.state.running}
                                formatGroupLabel={this.props.formatGroupLabel}
                                components={{
                                    MenuList: this.props.menuListScrollbar
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        ...this.props.selectTheme
                                    }
                                })}/>
                            {/* Generate Button */}
                            <button className="button-match fill-width"
                                onClick={() => this.generateImage()}
                                disabled={this.state.running}>{(this.state.running) ? "Generating..." : "Generate"}</button>
                            {/* Image */}
                            <div id="aiimagegenerator-images"
                                className="aesthetic-scale scale-self grid col-auto"></div>
                            {/* Download Button */}
                            <button id="aiimagegenerator-button-download"
                                className="button-match inverse disabled circular float bottom-right"
                                onClick={() => this.downloadImage()}>
                                <IconContext.Provider value={{ size: this.props.smallMedIcon, className: "global-class-name" }}>
                                    <FaDownload/>
                                </IconContext.Provider>
                            </button>
                        </section>
                        {/* Prompt Help Popout */}
                        <Draggable cancel="li"
                            position={{
                                x: this.props.defaultProps.popouts.prompthelp.position.x,
                                y: this.props.defaultProps.popouts.prompthelp.position.y
                            }}
                            onStop={(event, data) => this.props.defaultProps.updatePosition("aiimagegenerator", "fun", data.x, data.y, "popout", "prompthelp")}
                            bounds={this.props.defaultProps.calculateBounds("aiimagegenerator-widget", "aiimagegenerator-popout-help")}>
                            <section id="aiimagegenerator-popout-help"
                                className="popout">
                                <section id="aiimagegenerator-popout-animation-help"
                                    className="popout-animation">
                                    <ul className="aesthetic-scale scale-li font medium">
                                        <li>[ ] - De-emphasizes a tag</li>
                                        <li>&#123; &#125; - Emphasizes a tag</li>
                                    </ul>
                                </section>
                            </section>
                        </Draggable>
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

export default memo(WidgetAiImageGenerator);