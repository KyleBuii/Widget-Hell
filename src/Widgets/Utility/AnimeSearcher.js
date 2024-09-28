import { React, Component, memo } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';
import { FaExpand, Fa0 } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';
import sanitizeHtml from 'sanitize-html';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';


class WidgetAnimeSearcher extends Component{
    constructor(props){
        super(props);
        this.state = {
            running: false,
            spoiler: false,
            maxAmount: 0,
            searched: "what",
            linkEpisode: 0,
            linkDuration: "",
            linkSimilarity: 0,
            bannerImage: "",
            dubbed: false,
            charactersRole: [{
                role: ""
            }],
            characters: [{
                age: "",
                bloodType: null,
                dateOfBirth: {year: null, month: null, day: null},
                description: "",
                favourites: 0,
                gender: "",
                image: {large: ""},
                name: {full: "", alternative: [], alternativeSpoiler: []}
            }],
            previousCharacterIndex: 0,
            characterIndex: 0,
            coverImageColor: "",
            coverImageLink: "",
            description: "",
            duration: 0,
            startDate: "",
            endDate: "",
            episodes: 0,
            externalLinks: [],
            favorites: 0,
            format: "",
            genres: [],
            adult: false,
            meanScore: 0,
            popularity: 0,
            rankingsRated: 0,
            rankingsPopular: 0,
            recommendations: [],
            relations: [],
            season: "",
            seasonYear: 0,
            source: "",
            status: "",
            streamingEpisodes: [],
            studios: [],
            synonyms: [],
            tags: [],
            titleEnglish: "",
            titleNative: "",
            titleRomaji: "",
            volumes: 0,
            chapters: 0,
        };
    };
    handleKeyDown(event){
        if(event.key === "Enter"){
            this.handleSearch();
        };
    };
    handleSearch(){
        const inputSearch = document.getElementById("animesearcher-input-search");
        const elementImageUploaded = document.getElementById("animesearcher-image-uploaded");
        if((inputSearch.value !== "")
            && (inputSearch.value !== this.state.searched)){
            this.setState({
                searched: inputSearch.value
            }, () => {
                /// Link
                if(/(^https)?:\/\/.*\.(jpe?g|gif|png|tiff?|webp|bmp$)/i.test(this.state.searched)){
                    elementImageUploaded.innerHTML = "";
                    let elementImage = document.createElement("img");
                    elementImage.src = this.state.searched;
                    elementImage.alt = "linked image";
                    elementImage.draggable = false;
                    elementImageUploaded.appendChild(elementImage);
                    this.fetchImage(this.state.searched);
                /// ID
                }else if(/^[0-9]+/.test(this.state.searched)){
                    this.fetchMedia(null, this.state.searched);
                /// Name
                }else{
                    this.fetchMedia(this.state.searched, null);
                };
            });
        }else if(inputSearch.value !== this.state.searched){
            this.setState({
                searched: " "
            });
            this.fetchMedia();
        };
        inputSearch.value = "";
    };
    handleButtonSpoiler(){
        this.setState({
            spoiler: !this.state.spoiler
        });
        document.getElementById("animesearcher-button-spoiler")
            .classList.toggle("disabled");
    };
    async fetchImage(link){
        const urlTrace = `https://api.trace.moe/search?cutBorders&url=${encodeURIComponent(link)}`;
        try{
            const responseTrace = await fetch(urlTrace);
            const dataTrace = await responseTrace.json();
            this.setState({
                linkEpisode: dataTrace.result[0].episode,
                linkDuration: `
                    ${new Date(1000 * dataTrace.result[0].from)
                        .toISOString()
                        .substring(11, 19)}
                    -
                    ${new Date(1000 * dataTrace.result[0].to)
                        .toISOString()
                        .substring(11, 19)}
                `,
                linkSimilarity: Math.round((dataTrace.result[0].similarity + Number.EPSILON) * 100) / 100
            }, () => {
                this.fetchMedia(null, dataTrace.result[0].anilist, true);
            });
        }catch(err){
            console.error(err);
        };
    };
    async fetchMedia(name = null, id = null, image = false){
        /// Clear existing animations
        if(this.state.characters.length !== 0){
            const elementCharacter = document.getElementById(`animesearcher-character-${this.state.characterIndex}`);
            const elementCharacterInformation = document.getElementById("animesearcher-character-information");
            elementCharacter.classList.remove("animation-image-character");
            elementCharacterInformation.classList.remove("animation-animesearcher-character-information");
        };
        /// Clear existing uploaded image
        if(!image){
            document.getElementById("animesearcher-image-uploaded")
                .innerHTML = "";
        };
        const queryRandom = `
            query($page: Int){ # Define which variables will be used in the query
                Page(page: $page, perPage: 1){
                    media{
                        title{
                            romaji
                            english
                            native
                        }
                        format
                        status
                        description(asHtml: true)
                        startDate{
                            year
                            month
                            day
                        }
                        endDate{
                            year
                            month
                            day
                        }
                        season
                        seasonYear
                        episodes
                        duration
                        chapters
                        volumes
                        source
                        coverImage{
                            extraLarge
                            color
                        }
                        bannerImage
                        genres
                        synonyms
                        meanScore
                        popularity
                        favourites
                        tags{
                            name
                            rank
                            isGeneralSpoiler
                            isMediaSpoiler
                        }
                        relations{
                            nodes{
                                id
                                type
                                coverImage{
                                    extraLarge
                                }
                            }
                        }
                        characters(sort: ROLE){
                            edges{
                                role
                                voiceActors(language: ENGLISH){
                                    id
                                }
                            }
                            nodes{
                                name{
                                    full
                                    alternative
                                    alternativeSpoiler
                                }
                                image{
                                    large
                                }
                                description(asHtml: true)
                                gender
                                dateOfBirth{
                                    year
                                    month
                                    day
                                }
                                age
                                bloodType
                                favourites
                            }
                        }
                        studios{
                            nodes{
                                name
                            }
                        }
                        isAdult
                        externalLinks{
                            url
                            site
                            icon
                        }
                        streamingEpisodes{
                            title
                            thumbnail
                            url
                        }
                        rankings{
                            rank
                            type
                            allTime
                        }
                        recommendations(sort: RATING_DESC){
                            nodes{
                                mediaRecommendation{
                                    id
                                    type
                                    coverImage{
                                        extraLarge
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;
        const query = `
            query($id: Int, $search: String){ # Define which variables will be used in the query
                Media(id: $id, search: $search){ # Insert our variables into the query arguments (type: ANIME is hard-coded in the query)
                    title{
                        romaji
                        english
                        native
                    }
                    format
                    status
                    description(asHtml: true)
                    startDate{
                        year
                        month
                        day
                    }
                    endDate{
                        year
                        month
                        day
                    }
                    season
                    seasonYear
                    episodes
                    duration
                    chapters
                    volumes
                    source
                    coverImage{
                        extraLarge
                        color
                    }
                    bannerImage
                    genres
                    synonyms
                    meanScore
                    popularity
                    favourites
                    tags{
                        name
                        rank
                        isGeneralSpoiler
                        isMediaSpoiler
                    }
                    relations{
                        nodes{
                            id
                            type
                            coverImage{
                                extraLarge
                            }
                        }
                    }
                    characters(sort: ROLE){
                        edges{
                            role
                            voiceActors(language: ENGLISH){
                                id
                            }
                            node{
                                id
                            }
                        }
                        nodes{
                            name{
                                full
                                alternative
                                alternativeSpoiler
                            }
                            image{
                                large
                            }
                            description(asHtml: true)
                            gender
                            dateOfBirth{
                                year
                                month
                                day
                            }
                            age
                            bloodType
                            favourites
                        }
                    }
                    studios{
                        nodes{
                            name
                        }
                    }
                    isAdult
                    externalLinks{
                        url
                        site
                        icon
                    }
                    streamingEpisodes{
                        title
                        thumbnail
                        url
                    }
                    rankings{
                        rank
                        type
                        allTime
                    }
                    recommendations(sort: RATING_DESC){
                        nodes{
                            mediaRecommendation{
                                id
                                type
                                coverImage{
                                    extraLarge
                                }
                            }
                        }
                    }
                }
            }
        `;
        const variables = {};
        (id !== null)
            ? variables["id"] = id
            : (name !== null)
                ? variables["search"] = name
                : variables["page"] = Math.ceil(Math.random() * this.state.maxAmount);
        const url = "https://graphql.anilist.co";
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: ((name === null) && (id === null))
                    ? queryRandom
                    : query,
                variables: variables
            })
        };
        try{
            this.setState({
                running: true,
                linkEpisode: (image) ? this.state.linkEpisode : 0
            });
            const response = await fetch(url, options);
            const data = await response.json();
            const dataMedia = ((name === null) && (id === null))
                ? data.data.Page.media[0]
                : data.data.Media;
            let mediaStartDate = (new Date(`${dataMedia.startDate.month || ""} ${dataMedia.startDate.day || ""} ${dataMedia.startDate.year || ""}`)
                .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
            }));
            let mediaEndDate = (new Date(`${dataMedia.endDate.month || ""} ${dataMedia.endDate.day || ""} ${dataMedia.endDate.year || ""}`)
                .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
            }));
            /// Check if an english voice actor exist
            let checkDubbed = false;
            if(dataMedia.characters.edges.length !== 0){
                if(dataMedia.characters.edges[0].voiceActors !== null){
                    checkDubbed = ((dataMedia.format !== "MANGA")
                        && (dataMedia.characters.edges[0].voiceActors.length !== 0));
                };
            };
            this.setState({
                bannerImage: dataMedia.bannerImage,
                dubbed: checkDubbed,
                charactersRole: dataMedia.characters.edges,
                characters: dataMedia.characters.nodes,
                coverImageColor: dataMedia.coverImage.color,
                coverImageLink: dataMedia.coverImage.extraLarge,
                description: dataMedia.description,
                duration: dataMedia.duration,
                startDate: (mediaStartDate !== "Invalid Date")
                    ? mediaStartDate
                    : "?",
                endDate: (mediaEndDate !== "Invalid Date")
                    ? mediaEndDate
                    : "?",
                episodes: dataMedia.episodes,
                externalLinks: dataMedia.externalLinks,
                favorites: dataMedia.favourites,
                format: dataMedia.format,
                genres: dataMedia.genres,
                adult: dataMedia.isAdult,
                meanScore: dataMedia.meanScore,
                popularity: dataMedia.popularity,
                rankingsRated: ((dataMedia.rankings.length !== 0)
                    && (dataMedia.rankings[0].allTime))
                    ? dataMedia.rankings[0].rank
                    : 0,
                rankingsPopular: ((dataMedia.rankings.length > 1)
                    && (dataMedia.rankings[1].allTime))
                    ? dataMedia.rankings[1].rank
                    : 0,
                recommendations: dataMedia.recommendations.nodes,
                relations: dataMedia.relations.nodes,
                season: dataMedia.season,
                seasonYear: dataMedia.seasonYear,
                source: dataMedia.source,
                status: dataMedia.status,
                streamingEpisodes: dataMedia.streamingEpisodes,
                studios: dataMedia.studios.nodes,
                synonyms: dataMedia.synonyms,
                tags: dataMedia.tags,
                titleEnglish: dataMedia.title.english,
                titleNative: dataMedia.title.native,
                titleRomaji: dataMedia.title.romaji,
                volumes: dataMedia.volumes,
                chapters: dataMedia.chapters
            });
        }catch(err){
            console.error(err);
        }finally{
            this.setState({
                running: false
            });
        };
    };
    async fetchMaxMedia(){
        const query = `
            query{
                SiteStatistics{
                    anime(sort: COUNT_DESC){
                        nodes{
                            count
                        }
                    }
                }
            }
        `;
        const url = "https://graphql.anilist.co";
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: query
            })
        };
        try{
            const response = await fetch(url, options);
            const data = await response.json();
            this.setState({
                maxAmount: data.data.SiteStatistics.anime.nodes[0].count
            }, () => {
                this.storeData();
                this.fetchMedia();
            });
        }catch(err){
            console.error(err);
        };
    };
    characterClick(index){
        const elementCharacter = document.getElementById(`animesearcher-character-${(index !== undefined) ? index : this.state.characterIndex}`);
        const elementCharacterInformation = document.getElementById("animesearcher-character-information");
        if(index !== undefined){
            let previousIndex = this.state.characterIndex;
            this.setState({
                previousCharacterIndex: previousIndex,
                characterIndex: index
            });
            const elementPreviousCharacter = document.getElementById(`animesearcher-character-${previousIndex}`);
            if(elementCharacterInformation.classList.contains("animation-animesearcher-character-information")){
                elementPreviousCharacter.classList.toggle("animation-image-character");
                elementCharacterInformation.classList.toggle("animation-animesearcher-character-information");
            };
        };
        elementCharacterInformation.classList.toggle("animation-animesearcher-character-information");
        elementCharacter.classList.toggle("animation-image-character");
    };
    storeData(){
        sessionStorage.setItem("animesearcher", this.state.maxAmount);
    };
    componentDidMount(){
        const dateLocalStorage = JSON.parse(localStorage.getItem("date"));
        const currentDate = new Date().getDate();
        if((sessionStorage.getItem("animesearcher") !== null)
            && (dateLocalStorage["animesearcher"] === currentDate)){
            this.setState({
                maxAmount: sessionStorage.getItem("animesearcher")
            }, () => {
                this.fetchMedia();
            });
        }else{
            this.fetchMaxMedia();
            localStorage.setItem("date", JSON.stringify({
                ...dateLocalStorage,
                "animesearcher": currentDate
            }));
        };
    };
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("animesearcher")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("animesearcher");
                    this.props.defaultProps.updatePosition("animesearcher", "utility", data.x, data.y);
                }}
                cancel="input, button, span, a, img, .popout, .simplebar-track, #animesearcher-characters, #animesearcher-recommendations, #animesearcher-relations, #animesearcher-staff, #animesearcher-streaming-episodes"
                bounds="parent">
                <div id="animesearcher-widget"
                    className="widget">
                    <div id="animesearcher-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="animesearcher-widget-draggable"
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
                                    onClick={() => this.props.defaultProps.handleHotbar("animesearcher", "resetPosition", "utility")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("animesearcher", "fullscreen", "utility")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("animesearcher", "close", "utility")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
                        <section className="flex-center row gap">
                            <div className="flex-center column gap">
                                {/* Search bar */}
                                <div className="flex-center row gap fill-width">
                                    <div className="input-with-button-inside fill-width">
                                        <input id="animesearcher-input-search"
                                            className="input-match fill-width"
                                            name="animesearcher-link"
                                            onKeyDown={(event) => this.handleKeyDown(event)}
                                            type="url"
                                            placeholder="Anilist ID / Name / Image"
                                            disabled={this.state.running}/>
                                        <button id="animesearcher-button-spoiler"
                                            className="disabled-active font bold button-match inverse disabled"
                                            onClick={() => this.handleButtonSpoiler()}>SPOILER</button>
                                    </div>
                                    <button className="button-match"
                                        onClick={() => this.handleSearch()}>Search</button>
                                </div>
                                {/* Media Information */}
                                <SimpleBar id="animesearcher-information"
                                    className="font">
                                    <div className="character">
                                        {/* Uploaded Image */}
                                        <div id="animesearcher-image-uploaded"
                                            className="flex-center"></div>
                                        {/* Uploaded Image Information */}
                                        {(this.state.linkEpisode)
                                            ? <div className="text-boxed flex-center row gap large-gap">
                                                <span>Episode {this.state.linkEpisode}</span>
                                                |
                                                <span>{this.state.linkDuration}</span>
                                                |
                                                <span>{this.state.linkSimilarity}%</span>
                                            </div>
                                            : <></>}
                                    </div>
                                    {/* Banner Image */}
                                    <img id="animesearcher-image-banner"
                                        style={{
                                            boxShadow: `0px 0px 10px ${this.state.coverImageColor}`
                                        }}
                                        src={this.state.bannerImage || "/images/singles/animebackground.jpg"}
                                        draggable="false"
                                        alt="banner"/>
                                    <div className="flex-center row gap medium-gap only-justify-content">
                                        {/* Information Container */}
                                        <div id="animesearcher-container-information"
                                            className="flex-center column gap small-gap only-align-items">
                                            {/* Cover Image */}
                                            <img id="animesearcher-image-cover"
                                                className="image-cover"
                                                style={{
                                                    boxShadow: `0px 0px 6px ${this.state.coverImageColor}`
                                                }}
                                                onClick={() => {
                                                    document.getElementById("animesearcher-image-cover")
                                                        .classList.toggle("animation-image-cover");
                                                }}
                                                src={this.state.coverImageLink}
                                                draggable="false"
                                                alt="cover"/>
                                            <div id="animesearcher-container-information-sidebar"
                                                className="text-animation aesthetic-scale scale-span alternating-text-color fade-color flex-center column gap small-gap align-items-left box dimmed-border">
                                                {/* Type */}
                                                <div className="flex-center column only-justify-content gap">
                                                    <span>Type</span>
                                                    <span>
                                                        {(this.state.format === "TV")
                                                            ? "TV"
                                                            : this.state.format.charAt(0) + this.state.format.substring(1).toLowerCase()
                                                                .replace(/_(.)/, (char) => " " + char.charAt(1).toUpperCase())}
                                                    </span>
                                                </div>
                                                {/* Episodes / Volumes */}
                                                <div className="flex-center column only-justify-content gap">
                                                    <span>{(this.state.episodes) ? "Episodes" : "Volumes"}</span>
                                                    <span>{(this.state.episodes) ? this.state.episodes : this.state.volumes}</span>
                                                </div>
                                                {/* Duration / Chapters */}
                                                <div className="flex-center column only-justify-content gap">
                                                    <span>{(this.state.duration) ? "Duration" : "Chapters"}</span>
                                                    <span>{(this.state.duration) ? `${this.state.duration} mins` : this.state.chapters || "?"}</span>
                                                </div>
                                                {/* Status */}
                                                <div className="flex-center column only-justify-content gap">
                                                    <span>Status</span>
                                                    <span>{this.state.status.charAt(0) + this.state.status.substring(1).toLowerCase()}</span>
                                                </div>
                                                {/* Aired */}
                                                <div className="flex-center column only-justify-content gap">
                                                    <span>Aired</span>
                                                    <span>{this.state.startDate} to {this.state.endDate}</span>
                                                </div>
                                                {/* Season */}
                                                {(this.state.season)
                                                    ? <div className="flex-center column only-justify-content gap">
                                                        <span>Season</span>
                                                        <span>{this.state.season.charAt(0) + this.state.season.substring(1).toLowerCase()} {this.state.seasonYear}</span>
                                                    </div>
                                                    : <></>}
                                                {/* Studios */}
                                                {(this.state.studios.length !== 0)
                                                    ? <div className="flex-center column only-justify-content gap">
                                                        <span>Studios</span>
                                                        <div className="font transparent-normal flex-center column gap only-justify-content">
                                                            {this.state.studios.map((studio) => {
                                                                return <span key={studio.name}
                                                                    className="no-alternating-text-color">
                                                                    {studio.name}
                                                                </span>;
                                                            })}
                                                        </div>
                                                    </div>
                                                    : <></>}
                                                {/* Source */}
                                                {(this.state.source)
                                                    ? <div className="flex-center column only-justify-content gap">
                                                        <span>Source</span>
                                                        <span>{this.state.source.charAt(0) + this.state.source.substring(1).toLowerCase()
                                                            .replace(/_(.)/, (char) => " " + char.charAt(1).toUpperCase())}</span>
                                                    </div>
                                                    : <></>}
                                                {/* Genres */}
                                                {(this.state.genres.length !== 0)
                                                    ? <div className="flex-center column only-justify-content gap">
                                                        <span>Genres</span>
                                                        <div className="font transparent-normal flex-center column gap only-justify-content">
                                                            {this.state.genres.map((genre) => {
                                                                return <span key={genre}
                                                                    className="no-alternating-text-color">
                                                                    {genre}
                                                                </span>;
                                                            })}
                                                        </div>
                                                    </div>
                                                    : <></>}
                                                {/* Tags */}
                                                {(this.state.tags.length !== 0)
                                                    ? <div className="flex-center column only-justify-content gap">
                                                        <span>Tags</span>
                                                        <div id="animesearcher-tags"
                                                            className="font transparent-normal flex-center column gap only-justify-content">
                                                            {this.state.tags.map((tag) => {
                                                                if(((tag.isGeneralSpoiler === false) && (tag.isMediaSpoiler === false))
                                                                    || (this.state.spoiler && (tag.isGeneralSpoiler || tag.isMediaSpoiler))){
                                                                    return <div className="element-ends"
                                                                        key={tag.name}>
                                                                        <span className={`${(tag.isGeneralSpoiler || tag.isMediaSpoiler) ? "font spoiler" : ""} no-alternating-text-color`}>
                                                                            {tag.name}
                                                                        </span>
                                                                        <span className={`${(tag.isGeneralSpoiler || tag.isMediaSpoiler) ? "font spoiler" : ""} no-alternating-text-color`}>
                                                                            {tag.rank}%
                                                                        </span>
                                                                    </div>
                                                                };
                                                                return "";
                                                            })}
                                                        </div>
                                                    </div>
                                                    : <></>}
                                                {/* External Sources */}
                                                {(this.state.externalLinks.length !== 0)
                                                    ? <div className="flex-center column only-justify-content gap">
                                                        <span>Resources</span>
                                                        <div id="animesearcher-external-sources">
                                                            {this.state.externalLinks.map((link, index) => {
                                                                return <button className="button-match"
                                                                    key={`button-${link.site}-${index}`}
                                                                    onClick={() => {
                                                                        window.open(link.url);
                                                                    }}>
                                                                    <img className="image-site"
                                                                        src={link.icon || "/images/singles/page.png"}
                                                                        alt={link.site}/>
                                                                </button>
                                                            })}
                                                        </div>
                                                    </div>
                                                    : <></>}
                                            </div>
                                        </div>
                                        {/* Description Container */}
                                        <div id="animesearcher-container-description"
                                            className="flex-center column gap small-gap only-align-items align-items-left space-nicely space-top not-bottom">
                                            {/* Title */}
                                            <div className="element-ends">
                                                <div className="text-animation flex-center column gap align-items-left">
                                                    <span className="aesthetic-scale scale-self origin-left flex-center row gap font bold medium">
                                                        <span onClick={() => {
                                                            this.props.copyToClipboard(this.state.titleEnglish || this.state.titleRomaji);
                                                        }}>
                                                            {this.state.titleEnglish || this.state.titleRomaji}
                                                        </span>
                                                        {(this.state.adult)
                                                            ? <span className="text-tag adult-tag">R18</span>
                                                            : <></>}
                                                        {(this.state.dubbed)
                                                            ? <span className="text-tag">DUB</span>
                                                            : <></>}
                                                    </span>
                                                    <span className="aesthetic-scale scale-self origin-left font transparent-bold small">
                                                        {((this.state.titleEnglish !== null) && (this.state.titleNative !== null))
                                                            ? `${this.state.titleRomaji}, ${this.state.titleNative}`
                                                            : this.state.titleRomaji}
                                                    </span>
                                                </div>
                                                <span className="text-animation font large bold">{this.state.meanScore}%</span>
                                            </div>
                                            {/* Statistics */}
                                            <div className="aesthetic-scale scale-span element-ends">
                                                <div className="text-animation flex-center column gap align-items-left">
                                                    <span>Ranked</span>
                                                    <span>{(this.state.rankingsRated === 0) ? "N/A" : `#${this.state.rankingsRated}`}</span>
                                                </div>
                                                <div className="text-animation flex-center column gap align-items-left">
                                                    <span>Popularity</span>
                                                    <span>{(this.state.rankingsPopular === 0) ? "N/A" : `#${this.state.rankingsPopular}`}</span>
                                                </div>
                                                <div className="text-animation flex-center column gap align-items-left">
                                                    <span>Members</span>
                                                    <span>{this.state.popularity}</span>
                                                </div>
                                                <div className="text-animation flex-center column gap align-items-left">
                                                    <span>Favorites</span>
                                                    <span>{this.state.favorites}</span>
                                                </div>
                                            </div>
                                            {/* Description */}
                                            <span className="text-animation"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeHtml(this.state.description, {
                                                        allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'br' ],
                                                        allowedAttributes: {
                                                            'a': [ 'href' ]
                                                        },
                                                        allowedIframeHostnames: []
                                                    })
                                                }}></span>
                                            {/* Relations */}
                                            {(this.state.relations.length !== 0)
                                                ? <span className="font bold small">Relations</span>
                                                : <></>}
                                            {(this.state.relations.length !== 0)
                                                ? <SimpleBar id="animesearcher-relations">
                                                    {this.state.relations.map((relation, index) => {
                                                        return <div className="character flex-center column"
                                                            key={`relation-${index}`}> 
                                                            <img id={`animesearcher-relation-${index}`}
                                                                className="image-character"
                                                                onClick={() => {
                                                                    this.fetchMedia(null, relation.id);
                                                                }}
                                                                src={relation.coverImage.extraLarge}
                                                                alt={`relation ${index}`}
                                                                draggable="false"/>
                                                            <span className="font small text-boxed anime-searcher-normal">
                                                                {relation.type.charAt(0) + relation.type.substring(1).toLowerCase()}
                                                            </span>
                                                        </div>
                                                    })}
                                                </SimpleBar>
                                                : <></>}
                                            {/* Characters */}
                                            {(this.state.characters.length !== 0)
                                                ? <span className="font bold small">Characters</span>
                                                : <></>}
                                            {(this.state.characters.length !== 0)
                                                ? <SimpleBar id="animesearcher-characters">
                                                    {this.state.characters.map((character, index) => {
                                                        return <div className="character flex-center column"
                                                            key={`character-${index}`}>
                                                            <img id={`animesearcher-character-${index}`}
                                                                className="image-character"
                                                                onClick={() => this.characterClick(index)}
                                                                src={character.image.large}
                                                                alt={`character ${character.name.full}`}
                                                                draggable="false"/>
                                                            <span className="font small text-boxed anime-searcher-normal">
                                                                {this.state.charactersRole[index].role.charAt(0) + this.state.charactersRole[index].role.substring(1).toLowerCase()}
                                                            </span>
                                                        </div>
                                                    })}
                                                </SimpleBar>
                                                : <></>}
                                            {/* Character Information */}
                                            {(this.state.characters.length !== 0)
                                                ? <SimpleBar id="animesearcher-character-information"
                                                    className="popout box dimmed no-highlight"
                                                    onClick={() => {
                                                        this.characterClick();
                                                    }}>
                                                    {/* Image */}
                                                    <img className="image-character large-image"
                                                        src={this.state.characters[this.state.characterIndex]?.image.large}
                                                        alt={`character ${this.state.characters[this.state.characterIndex].name?.full}`}/>
                                                    {/* Information */}
                                                    <div className="flex-center column gap align-items-left">
                                                        {/* Name */}
                                                        <div className="flex-center column gap only-justify-content">
                                                            <span className="link-match font bold medium"
                                                                onClick={() => {
                                                                    this.props.copyToClipboard(this.state.characters[this.state.characterIndex].name.full);
                                                                }}>{this.state.characters[this.state.characterIndex].name.full}</span>
                                                            {(this.state.characters[this.state.characterIndex].name.alternative.length !== 0)
                                                                ? <div className="flex-center row gap only-align-items font transparent-bold small">
                                                                    {this.state.characters[this.state.characterIndex].name.alternative.map((name, index) => {
                                                                        if(index !== (this.state.characters[this.state.characterIndex].name.alternative.length - 1)){
                                                                            return `${name}, `;
                                                                        }else{
                                                                            return `${name}`;
                                                                        };
                                                                    })}
                                                                </div>
                                                                : <></>}
                                                            {(this.state.spoiler)
                                                                ? <div className="flex-center row gap only-align-items font spoiler bold small">
                                                                    {this.state.characters[this.state.characterIndex].name.alternativeSpoiler.map((name, index) => {
                                                                        if(index !== (this.state.characters[this.state.characterIndex].name.alternativeSpoiler.length - 1)){
                                                                            return `${name}, `;
                                                                        }else{
                                                                            return `${name}`;
                                                                        };
                                                                    })}
                                                                </div>
                                                                : <></>}
                                                        </div>
                                                        {/* Gender */}
                                                        {(this.state.characters[this.state.characterIndex].gender)
                                                            ? <div className="flex-center row gap">
                                                                <span>Gender:</span>
                                                                <span>{this.state.characters[this.state.characterIndex].gender}</span>
                                                            </div>
                                                            : <></>}
                                                        {/* Age */}
                                                        {(this.state.characters[this.state.characterIndex].age)
                                                            ? <div className="flex-center row gap">
                                                                <span>Age:</span>
                                                                <span>{this.state.characters[this.state.characterIndex].age}</span>
                                                            </div>
                                                            : <></>}
                                                        {/* Date of Birth */}
                                                        {(this.state.characters[this.state.characterIndex].dateOfBirth.year || this.state.characters[this.state.characterIndex].dateOfBirth.month || this.state.characters[this.state.characterIndex].dateOfBirth.day)
                                                            ? <div className="flex-center row gap">
                                                                <span>Date of Birth:</span>
                                                                <span>{(new Date(`${this.state.characters[this.state.characterIndex].dateOfBirth.year} ${this.state.characters[this.state.characterIndex].dateOfBirth.month} ${this.state.characters[this.state.characterIndex].dateOfBirth.day}`))
                                                                    .toLocaleDateString("en-US", {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric"
                                                                    })}</span>
                                                            </div>
                                                            : <></>}
                                                        {/* Blood Type */}
                                                        {(this.state.characters[this.state.characterIndex].bloodType)
                                                            ? <div className="flex-center row gap">
                                                                <span>Blood Type:</span>
                                                                <span>{this.state.characters[this.state.characterIndex].bloodType}</span>
                                                            </div>
                                                            : <></>}
                                                        {/* Description */}
                                                        {(this.state.characters[this.state.characterIndex].description)
                                                            ? <span dangerouslySetInnerHTML={{
                                                                __html: sanitizeHtml(this.state.characters[this.state.characterIndex].description, {
                                                                    allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'br' ],
                                                                    allowedAttributes: {
                                                                        'a': [ 'href' ]
                                                                    },
                                                                    allowedIframeHostnames: []
                                                                })
                                                            }}></span>
                                                            : "N/A"}
                                                        {/* Favorites */}
                                                        {(this.state.characters[this.state.characterIndex].favourites)
                                                            ? <div className="flex-center row gap">
                                                                <span>Favorites:</span>
                                                                <span>{this.state.characters[this.state.characterIndex].favourites}</span>
                                                            </div>
                                                            : <></>}
                                                    </div>
                                                </SimpleBar>
                                                : <></>}
                                            {/* Streaming Episodes */}
                                            {(this.state.streamingEpisodes.length !== 0)
                                                ? <span className="font bold small">Episode Videos</span>
                                                : <></>}
                                            {(this.state.streamingEpisodes.length !== 0)
                                                ? <SimpleBar id="animesearcher-streaming-episodes">
                                                    {this.state.streamingEpisodes.map((episode, index) => {
                                                        return <div className="character flex-center column"
                                                            key={`episode-${index}`}>
                                                            <img id={`animesearcher-streaming-episodes-${index}`}
                                                                className="image-character"
                                                                onClick={() => {
                                                                    window.open(episode.url);
                                                                }}
                                                                src={episode.thumbnail}
                                                                alt={`episode ${index}`}
                                                                draggable="false"/>
                                                            <span className="font small text-boxed anime-searcher-wide">
                                                                {episode.title}
                                                            </span>
                                                        </div>
                                                    })}
                                                </SimpleBar>
                                                : <></>}
                                            {/* Recommendations */}
                                            {(this.state.recommendations.length !== 0)
                                                ? <span className="font bold small">Recommendations</span>
                                                : <></>}
                                            {(this.state.recommendations.length !== 0)
                                                ? <SimpleBar id="animesearcher-recommendations">
                                                    {this.state.recommendations.map((recommendation, index) => {
                                                        return <div className="character flex-center column"
                                                            key={`recommendation-${index}`}>
                                                            <img id={`animesearcher-recommendation-${index}`}
                                                                className="image-character"
                                                                onClick={() => {
                                                                    this.fetchMedia(null, recommendation.mediaRecommendation.id);
                                                                }}
                                                                src={recommendation.mediaRecommendation.coverImage?.extraLarge || ""}
                                                                alt={`recommendation ${index}`}
                                                                draggable="false"/>
                                                            <span className="font small text-boxed anime-searcher-normal">
                                                                {recommendation.mediaRecommendation.type.charAt(0) + recommendation.mediaRecommendation.type.substring(1).toLowerCase()}
                                                            </span>
                                                        </div>
                                                    })}
                                                </SimpleBar>
                                                : <></>}
                                        </div>
                                    </div>
                                </SimpleBar>
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

export default memo(WidgetAnimeSearcher);