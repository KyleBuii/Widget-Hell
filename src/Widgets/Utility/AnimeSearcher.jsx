import DOMPurify from 'dompurify';
import React, { Component, memo } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { classStack, decorationValue } from '../../data';
import { copyToClipboard, summarizeText } from '../../helpers';

const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi',
    'Fantasy', 'Horror', 'Mahou Shoujo', 'Mecha', 'Music',
    'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
    'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
];
const tags = [
    '4-koma', 'Achromatic', 'Achronological Order', 'Acrobatics',
    'Acting', 'Adoption', 'Advertisement', 'Afterlife', 'Age Gap',
    'Age Regression', 'Agender', 'Agriculture', 'Airsoft',
    'Alchemy', 'Aliens', 'Alternate Universe', 'American Football',
    'Amnesia', 'Anachronism', 'Ancient China', 'Angels', 'Animals',
    'Anthology', 'Anthropomorphism', 'Anti-Hero', 'Archery', 'Aromantic',
    'Arranged Marriage', 'Artificial Intelligence', 'Asexual', 'Assassins',
    'Astronomy', 'Athletics', 'Augmented Reality', 'Autobiographical',
    'Aviation', 'Badminton', 'Ballet', 'Band', 'Bar', 'Baseball', 'Basketball',
    'Battle Royale', 'Biographical', 'Bisexual', 'Blackmail', 'Board Game',
    'Boarding School', 'Body Horror', 'Body Image', 'Body Swapping', 'Bowling',
    'Boxing', "Boys' Love", 'Bullying', 'Butler', 'Calligraphy', 'Camping',
    'Cannibalism', 'Card Battle', 'Cars', 'Centaur', 'CGI', 'Cheerleading',
    'Chibi', 'Chimera', 'Chuunibyou', 'Circus', 'Class Struggle',
    'Classic Literature', 'Classical Music', 'Clone', 'Coastal', 'Cohabitation',
    'College', 'Coming of Age', 'Conspiracy', 'Cosmic Horror', 'Cosplay', 'Cowboys',
    'Creature Taming', 'Crime', 'Criminal Organization', 'Crossdressing', 'Crossover',
    'Cult', 'Cultivation', 'Curses', 'Cute Boys Doing Cute Things',
    'Cute Girls Doing Cute Things', 'Cyberpunk', 'Cyborg', 'Cycling', 'Dancing',
    'Death Game', 'Delinquents', 'Demons', 'Denpa', 'Desert', 'Detective', 'Dinosaurs',
    'Disability', 'Dissociative Identities', 'Dragons', 'Drawing', 'Drugs', 'Dullahan',
    'Dungeon', 'Dystopian', 'E-Sports', 'Eco-Horror', 'Economics', 'Educational',
    'Elderly Protagonist', 'Elf', 'Ensemble Cast', 'Environmental', 'Episodic', 'Ero Guro',
    'Espionage', 'Estranged Family', 'Exorcism', 'Fairy', 'Fairy Tale', 'Fake Relationship',
    'Family Life', 'Fashion', 'Female Harem', 'Female Protagonist', 'Femboy', 'Fencing',
    'Filmmaking', 'Firefighters', 'Fishing', 'Fitness', 'Flash', 'Food', 'Football',
    'Foreign', 'Found Family', 'Fugitive', 'Full CGI', 'Full Color', 'Gambling', 'Gangs',
    'Gender Bending', 'Ghost', 'Go', 'Goblin', 'Gods', 'Golf', 'Gore', 'Guns', 'Gyaru',
    'Handball', 'Henshin', 'Heterosexual', 'Hikikomori', 'Hip-hop Music', 'Historical',
    'Homeless', 'Horticulture', 'Ice Skating', 'Idol', 'Indigenous Cultures', 'Inn',
    'Isekai', 'Iyashikei', 'Jazz Music', 'Josei', 'Judo', 'Kabuki', 'Kaiju', 'Karuta',
    'Kemonomimi', 'Kids', 'Kingdom Management', 'Konbini', 'Kuudere', 'Lacrosse',
    'Language Barrier', 'LGBTQ+ Themes', 'Long Strip', 'Lost Civilization', 'Love Triangle',
    'Mafia', 'Magic', 'Mahjong', 'Maids', 'Makeup', 'Male Harem', 'Male Protagonist', 'Manzai',
    'Marriage', 'Martial Arts', 'Matchmaking', 'Matriarchy', 'Medicine', 'Medieval',
    'Memory Manipulation', 'Mermaid', 'Meta', 'Metal Music', 'Military', 'Mixed Gender Harem',
    'Mixed Media', 'Modeling', 'Monster Boy', 'Monster Girl', 'Mopeds', 'Motorcycles',
    'Mountaineering', 'Musical Theater', 'Mythology', 'Natural Disaster', 'Necromancy',
    'Nekomimi', 'Ninja', 'No Dialogue', 'Noir', 'Non-fiction', 'Nudity', 'Nun', 'Office',
    'Office Lady', 'Oiran', 'Ojou-sama', 'Orphan', 'Otaku Culture', 'Outdoor Activities',
    'Pandemic', 'Parenthood', 'Parkour', 'Parody', 'Philosophy', 'Photography', 'Pirates',
    'Poker', 'Police', 'Politics', 'Polyamorous', 'Post-Apocalyptic', 'POV', 'Pregnancy',
    'Primarily Adult Cast', 'Primarily Animal Cast', 'Primarily Child Cast', 'Primarily Female Cast',
    'Primarily Male Cast', 'Primarily Teen Cast', 'Prison', 'Proxy Battle', 'Psychosexual',
    'Puppetry', 'Rakugo', 'Real Robot', 'Rehabilitation', 'Reincarnation', 'Religion', 'Rescue',
    'Restaurant', 'Revenge', 'Robots', 'Rock Music', 'Rotoscoping', 'Royal Affairs', 'Rugby',
    'Rural', 'Samurai', 'Satire', 'School', 'School Club', 'Scuba Diving', 'Seinen', 'Shapeshifting',
    'Ships', 'Shogi', 'Shoujo', 'Shounen', 'Shrine Maiden', 'Skateboarding', 'Skeleton', 'Slapstick',
    'Slavery', 'Snowscape', 'Software Development', 'Space', 'Space Opera', 'Spearplay', 'Steampunk',
    'Stop Motion', 'Succubus', 'Suicide', 'Sumo', 'Super Power', 'Super Robot', 'Superhero', 'Surfing',
    'Surreal Comedy', 'Survival', 'Swimming', 'Swordplay', 'Table Tennis', 'Tanks', 'Tanned Skin', 'Teacher',
    "Teens' Love", 'Tennis', 'Terrorism', 'Time Loop', 'Time Manipulation', 'Time Skip', 'Tokusatsu', 'Tomboy',
    'Torture', 'Tragedy', 'Trains', 'Transgender', 'Travel', 'Triads', 'Tsundere', 'Twins', 'Unrequited Love',
    'Urban', 'Urban Fantasy', 'Vampire', 'Vertical Video', 'Veterinarian', 'Video Games', 'Vikings',
    'Villainess', 'Virtual World', 'Vocal Synth', 'Volleyball', 'VTuber', 'War', 'Werewolf',
    'Wilderness', 'Witch', 'Work', 'Wrestling', 'Writing', 'Wuxia', 'Yakuza', 'Yandere', 'Youkai',
    'Yuri', 'Zombie',
];
const queryGenres = [];
const queryTags = [];
const queries = {
    genre: queryGenres,
    tag: queryTags,
};
let filterType = '';

class WidgetAnimeSearcher extends Component {
    constructor(props) {
        super(props);

        this.refMultipleSearches = React.createRef();

        this.state = {
            running: false,
            spoiler: false,
            maxAmount: 0,
            searched: 'what',
            linkEpisode: 0,
            linkDuration: '',
            linkSimilarity: 0,
            previousCharacterIndex: 0,
            characterIndex: 0,
            searchAmount: 1,
            media: [{
                bannerImage: '',
                dubbed: false,
                charactersRole: [{
                    role: ''
                }],
                characters: [{
                    age: '',
                    bloodType: null,
                    dateOfBirth: {year: null, month: null, day: null},
                    description: '',
                    favourites: 0,
                    gender: '',
                    image: {large: ''},
                    name: {full: '', alternative: [], alternativeSpoiler: []}
                }],
                coverImageColor: '',
                coverImageLink: '',
                description: '',
                duration: 0,
                startDate: '',
                endDate: '',
                episodes: 0,
                externalLinks: [],
                favorites: 0,
                format: '',
                genres: [],
                adult: false,
                meanScore: 0,
                popularity: 0,
                rankingsRated: 0,
                rankingsPopular: 0,
                recommendations: [],
                relations: [],
                season: '',
                seasonYear: 0,
                source: '',
                status: '',
                streamingEpisodes: [],
                studios: [],
                synonyms: [],
                tags: [],
                titleEnglish: '',
                titleNative: '',
                titleRomaji: '',
                volumes: 0,
                chapters: 0,
            }],
            currentMedia: 0,
        };
    };

    async fetchImage(link) {
        const urlTrace = `https://api.trace.moe/search?cutBorders&url=${encodeURIComponent(link)}`;
        try {
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
        } catch (err) {
            console.error(err);
        };
    };

    async fetchMedia(name = null, id = null, image = false) {
        this.refMultipleSearches.current.style.display = (this.state.searchAmount === 1 || id || name) ? 'none' : 'flex';

        /// Clear existing animations
        if (this.state.media[this.state.currentMedia].characters.length !== 0) {
            const elementCharacter = document.getElementById(`animesearcher-character-${this.state.characterIndex}`);
            const elementCharacterInformation = document.getElementById('animesearcher-character-information');
            elementCharacter.classList.remove('animation-image-character');
            elementCharacterInformation.classList.remove('animation-animesearcher-character-information');
        };
        /// Clear existing uploaded image
        if (!image) {
            document.getElementById('animesearcher-image-uploaded').innerHTML = '';
        };

        const queryMinimal = `
            query(
                $page: Int,
                $type: MediaType,
                $genres: [String],
                $tags: [String],
            ) {
                Page(
                    page: $page,
                    perPage: 1
                ) {
                    pageInfo{
                        lastPage
                        total
                        perPage
                        currentPage
                        hasNextPage
                    }
                    media(
                        type: $type,
                        genre_in: $genres,
                        tag_in: $tags,
                    ) {
                        id
                        title{
                            romaji
                            english
                        }
                        genres
                        tags{
                            name
                        }
                    }
                }
            }
        `;
        const queryRandom = `
            query(
                $page: Int,
                $type: MediaType,
                $genres: [String],
                $tags: [String],
            ){ # Define which variables will be used in the query
                Page(
                    page: $page,
                    perPage: 1,
                ){
                    media(
                        type: $type,
                        genre_in: $genres,
                        tag_in: $tags,
                    ){
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
            }
        `;
        const query = `
            query(
                $id: Int,
                $search: String,
            ){ # Define which variables will be used in the query
                Media(
                    id: $id,
                    search: $search,
                ){ # Insert our variables into the query arguments (type: ANIME is hard-coded in the query)
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

        const normalize = (arr) => (Array.isArray(arr) && arr.length) ? arr : undefined;
        const normalizeType = (type) => {
            if (!type) return undefined;
            const uppercaseType = type.toUpperCase();
            return (/\bANIME\b|\bMANGA\b/.test(uppercaseType)) ? uppercaseType : undefined;
        };
        const variables = {
            genres: normalize(queryGenres),
            tags: normalize(queryTags),
        };

        if (id) variables['id'] = id;
        if (name) variables['search'] = name;
        if (filterType) variables['type'] = normalizeType(filterType);

        const hasAnyFilter = Boolean(
            variables.type || variables.genres || variables.tags
        );
        
        try {
            this.setState({
                running: true,
                linkEpisode: image ? this.state.linkEpisode : 0
            });

            let dataMedia;
            let newMedia = [];

            for (let searches = 0; searches < this.state.searchAmount; searches++) {
                if (id || name) {
                    const responseQuery = await this.runQuery(query, variables);
                    dataMedia = responseQuery.data.Media;
                } else if (hasAnyFilter) {
                    const firstPage = await this.runQuery(queryMinimal, { ...variables, page: 1 });
                    const lastPage = firstPage.data.Page.pageInfo.lastPage || 1;
                    const randomPage = Math.ceil(Math.random() * lastPage);
                    const responseMinimal = await this.runQuery(queryRandom, { ...variables, page: randomPage });
                    dataMedia = responseMinimal.data.Page.media[0];
                } else {
                    const randomPage = Math.ceil(Math.random() * this.state.maxAmount);
                    const responseRandom = await this.runQuery(queryRandom, { page: randomPage });
                    dataMedia = responseRandom.data.Page.media[0];
                };

                let mediaStartDate = (new Date(`${dataMedia.startDate.month || ''} ${dataMedia.startDate.day || ''} ${dataMedia.startDate.year || ''}`)
                    .toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                }));
                let mediaEndDate = (new Date(`${dataMedia.endDate.month || ''} ${dataMedia.endDate.day || ''} ${dataMedia.endDate.year || ''}`)
                    .toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                }));

                let checkDubbed = false;
                if (dataMedia.characters.edges.length !== 0) {
                    if (dataMedia.characters.edges[0].voiceActors !== null) {
                        checkDubbed = ((dataMedia.format !== 'MANGA')
                            && (dataMedia.characters.edges[0].voiceActors.length !== 0));
                    };
                };

                newMedia.push({
                    bannerImage: dataMedia.bannerImage,
                    dubbed: checkDubbed,
                    charactersRole: dataMedia.characters.edges,
                    characters: dataMedia.characters.nodes,
                    coverImageColor: dataMedia.coverImage.color,
                    coverImageLink: dataMedia.coverImage.extraLarge,
                    description: dataMedia.description,
                    duration: dataMedia.duration,
                    startDate: (mediaStartDate !== 'Invalid Date')
                        ? mediaStartDate
                        : '?',
                    endDate: (mediaEndDate !== 'Invalid Date')
                        ? mediaEndDate
                        : '?',
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

                if (id || name) break;
            };

            if (id || name) {
                let tempMedia = [...this.state.media];
                tempMedia[this.state.currentMedia] = newMedia[0];
                newMedia = [...tempMedia];
            };

            this.setState({
                media: [...newMedia]
            });
        } catch (err) {
            console.error(err);
        } finally {
            this.setState({
                running: false
            });
        };
    };

    async runQuery(query, variables) {
        const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });
        return res.json();
    };

    async fetchMaxMedia() {
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
        const url = 'https://graphql.anilist.co';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: query
            })
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            this.setState({
                maxAmount: data.data.SiteStatistics.anime.nodes[0].count
            }, () => {
                this.storeData();
                this.fetchMedia();
            });
        } catch (err) {
            console.error(err);
        };
    };

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.handleSearch();
        };
    };

    handleSearch() {
        const inputSearch = document.getElementById('animesearcher-input-search');
        const elementImageUploaded = document.getElementById('animesearcher-image-uploaded');
        if ((inputSearch.value !== '')
            && (inputSearch.value !== this.state.searched)){
            this.setState({
                searched: inputSearch.value
            }, () => {
                /// Link
                if (/(^https)?:\/\/.*\.(jpe?g|gif|png|tiff?|webp|bmp$)/i.test(this.state.searched)) {
                    elementImageUploaded.innerHTML = '';
                    let elementImage = document.createElement('img');
                    elementImage.src = this.state.searched;
                    elementImage.alt = 'linked image';
                    elementImage.draggable = false;
                    elementImage.loading = 'lazy';
                    elementImage.decoding = 'async';
                    elementImageUploaded.appendChild(elementImage);
                    this.fetchImage(this.state.searched);
                /// ID
                } else if (/^[0-9]+/.test(this.state.searched)) {
                    this.fetchMedia(null, this.state.searched);
                /// Name
                } else {
                    this.fetchMedia(this.state.searched, null);
                };
            });
        } else if (inputSearch.value !== this.state.searched) {
            this.setState({
                searched: ' '
            });
            this.fetchMedia();
        };
        inputSearch.value = '';
    };

    handleButtonSpoiler() {
        this.setState({
            spoiler: !this.state.spoiler
        });
        document.getElementById('animesearcher-button-spoiler').classList.toggle('disabled');
    };

    characterClick(index) {
        const elementCharacter = document.getElementById(`animesearcher-character-${(index !== undefined) ? index : this.state.characterIndex}`);
        const elementCharacterInformation = document.getElementById('animesearcher-character-information');
        if (index !== undefined) {
            let previousIndex = this.state.characterIndex;
            this.setState({
                previousCharacterIndex: previousIndex,
                characterIndex: index
            });
            const elementPreviousCharacter = document.getElementById(`animesearcher-character-${previousIndex}`);
            if (elementCharacterInformation.classList.contains('animation-animesearcher-character-information')) {
                elementPreviousCharacter.classList.toggle('animation-image-character');
                elementCharacterInformation.classList.toggle('animation-animesearcher-character-information');
            };
        };
        elementCharacterInformation.classList.toggle('animation-animesearcher-character-information');
        elementCharacter.classList.toggle('animation-image-character');
    };

    handleFilterButton() {
        const filterButton = document.getElementById('animesearcher-widget-filters');
        filterButton.classList.toggle('show');
    };

    handleFilter(event, type) {
        if (type === 'type') {
            filterType = event.target.value;
            return;
        };

        const elementButton = event.target;
        const elementText = elementButton.textContent;
        const queryType = queries[type];

        elementButton.classList.toggle('disabled-option');

        if (elementButton.classList.contains('disabled-option')) {
            queryType.splice(queryType.indexOf(elementText), 1);
        } else if (!queryType.includes(elementText)) {
            queryType.push(elementText);
        };
    };

    handleAmountButton() {
        this.setState({
            searchAmount: (this.state.searchAmount % 3) + 1
        });
    };

    handleSearchClick(index) {
        this.refMultipleSearches.current.style.display = 'none';

        this.setState({
            currentMedia: index
        });
    };

    toggleSearches() {
        this.refMultipleSearches.current.style.display = (this.refMultipleSearches.current.checkVisibility()) ? 'none' : 'flex';
    };

    storeData() {
        sessionStorage.setItem('animesearcher', this.state.maxAmount);
    };

    componentDidMount() {
        const dateLocalStorage = JSON.parse(localStorage.getItem('date'));
        const currentDate = new Date().getDate();

        if ((sessionStorage.getItem('animesearcher') !== null)
            && (dateLocalStorage['animesearcher'] === currentDate)) {
            this.setState({
                maxAmount: sessionStorage.getItem('animesearcher')
            }, () => {
                this.fetchMedia();
            });
        } else {
            this.fetchMaxMedia();
            localStorage.setItem('date', JSON.stringify({
                ...dateLocalStorage,
                'animesearcher': currentDate
            }));
        };

        this.refMultipleSearches.current.style.display = 'none';
    };
    
    render() {
        const currentItem = this.state.media[this.state.currentMedia];
        const summary = summarizeText(currentItem.description);

        return (
            <Draggable defaultPosition={{ x: this.props.defaultProps.position.x, y: this.props.defaultProps.position.y }}
                disabled={this.props.defaultProps.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart('animesearcher')}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop('animesearcher');
                    this.props.defaultProps.updatePosition('animesearcher', 'utility', data.x, data.y);
                }}
                cancel='input, button, span, a, img, .popout, .simplebar-track, .radio-match, #animesearcher-information'
                bounds='parent'>
                <section id='animesearcher-widget'
                    className='widget'
                    aria-labelledby='animesearcher-widget-heading'>
                    <h2 id='animesearcher-widget-heading'
                        className='screen-reader-only'>Anime Searcher Widget</h2>
                    <div id='animesearcher-widget-animation'
                        className={`widget-animation ${classStack}`}>
                        <span id='animesearcher-widget-draggable'
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
                        {this.props.defaultProps.renderHotbar('animesearcher', 'utility')}
                        <div className='flex-center row gap'>
                            <div className='flex-center column gap'>
                                {/* Search bar */}
                                <div className='flex-center row gap fill-width'>
                                    <div className='input-with-button-inside fill-width'>
                                        <input id='animesearcher-input-search'
                                            className='input-match fill-width'
                                            name='animesearcher-link'
                                            onKeyDown={(event) => this.handleKeyDown(event)}
                                            type='url'
                                            placeholder='Anilist ID / Name / Image URL'
                                            aria-labelledby='animesearcher-input-search-aria-describedby'
                                            disabled={this.state.running}/>
                                        <span id='animesearcher-input-search-aria-describedby'
                                            className='screen-reader-only'>
                                            Type an Anilist ID, name, or image url here.
                                        </span>
                                        <button id='animesearcher-button-spoiler'
                                            className='disabled-active font bold button-match inverse disabled'
                                            onClick={() => this.handleButtonSpoiler()}
                                            disabled={this.state.running}>SPOILER</button>
                                    </div>
                                    <button className='button-match'
                                        onClick={() => this.handleAmountButton()}>{this.state.searchAmount}x</button>
                                    <button className='button-match'
                                        type='button'
                                        onClick={() => this.handleSearch()}>Search</button>
                                </div>
                                <button className='button-match fill-width'
                                    onClick={this.handleFilterButton}>Filter</button>
                                <div id='animesearcher-widget-filters'
                                    className='collapsible flex-center column gap align-items-left fill-width'>
                                    <div className='flex-center wrap row gap only-align-items fill-width'>
                                        <div className='radio-match'>
                                            <input id='animesearcher-button-any'
                                                type='radio'
                                                name='groupType'
                                                value='ANY'
                                                onClick={(event) => this.handleFilter(event, 'type')}/>
                                            <label htmlFor='animesearcher-button-any'>Any</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='animesearcher-button-anime'
                                                type='radio'
                                                name='groupType'
                                                value='ANIME'
                                                onClick={(event) => this.handleFilter(event, 'type')}/>
                                            <label htmlFor='animesearcher-button-anime'>Anime</label>
                                        </div>
                                        <div className='radio-match'>
                                            <input id='animesearcher-button-manga'
                                                type='radio'
                                                name='groupType'
                                                value='MANGA'
                                                onClick={(event) => this.handleFilter(event, 'type')}/>
                                            <label htmlFor='animesearcher-button-manga'>Manga</label>
                                        </div>
                                    </div>
                                    <div className='fill-width'>
                                        {genres.map((genre) => {
                                            return <button className='button-match option disabled-option'
                                                key={genre}
                                                type='button'
                                                onClick={(event) => this.handleFilter(event, 'genre')}>
                                                {genre}
                                            </button>
                                        })}
                                    </div>
                                    <div className='fill-width'>
                                        {tags.map((tag) => {
                                            return <button className='button-match option disabled-option'
                                                key={tag}
                                                type='button'
                                                onClick={(event) => this.handleFilter(event, 'tag')}>
                                                {tag}
                                            </button>
                                        })}
                                    </div>
                                </div>
                                <button className='button-match fill-width'
                                    onClick={() => this.toggleSearches()}>Show Searches</button>
                                {/* Media Information */}
                                <SimpleBar id='animesearcher-information'
                                    className='font'
                                    style={{ maxHeight: '34em' }}>
                                    <section className='character'
                                        aria-labelledby='animesearcher-uploaded-image-heading'>
                                        <h2 id='animesearcher-uploaded-image-heading'
                                            className='screen-reader-only'>Anime Searcher Uploaded Image</h2>
                                        {/* Uploaded Image */}
                                        <div id='animesearcher-image-uploaded'
                                            className='flex-center'></div>
                                        {/* Uploaded Image Information */}
                                        {(this.state.linkEpisode)
                                            ? <div className='text-boxed flex-center row gap large-gap'>
                                                <span>Episode {this.state.linkEpisode}</span>
                                                |
                                                <span>{this.state.linkDuration}</span>
                                                |
                                                <span>{this.state.linkSimilarity}%</span>
                                            </div>
                                            : <></>}
                                    </section>
                                    {/* Banner Image */}
                                    <img id='animesearcher-image-banner'
                                        style={{
                                            boxShadow: `0px 0px 10px ${currentItem?.coverImageColor}`
                                        }}
                                        src={currentItem.bannerImage || '/resources/singles/animebackground.webp'}
                                        draggable='false'
                                        alt='banner'
                                        loading='lazy'
                                        decoding='async'/>
                                    <div className='flex-center row gap medium-gap only-justify-content'>
                                        {/* Information Container */}
                                        <div id='animesearcher-container-information'
                                            className='flex-center column gap small-gap only-align-items'>
                                            {/* Cover Image */}
                                            <img id='animesearcher-image-cover'
                                                className='image-cover'
                                                style={{
                                                    boxShadow: `0px 0px 6px ${currentItem.coverImageColor}`
                                                }}
                                                onClick={() => {
                                                    document.getElementById('animesearcher-image-cover')
                                                        .classList.toggle('animation-image-cover');
                                                }}
                                                src={currentItem.coverImageLink}
                                                draggable='false'
                                                alt='cover'
                                                loading='lazy'
                                                decoding='async'/>
                                            <section id='animesearcher-container-information-sidebar'
                                                className='text-animation aesthetic-scale scale-span alternating-text-color fade-color flex-center column gap small-gap align-items-left box dimmed-border'
                                                aria-labelledby='anime-information-sidebar-heading'>
                                                <h2 id='anime-information-sidebar-heading'
                                                    className='screen-reader-only'>Anime Information Sidebar</h2>
                                                {/* Type */}
                                                <div className='flex-center column only-justify-content gap'>
                                                    <span>Type</span>
                                                    <span>
                                                        {(currentItem.format === 'TV')
                                                            ? 'TV'
                                                            : currentItem.format.charAt(0) + currentItem.format.substring(1).toLowerCase()
                                                                .replace(/_(.)/, (char) => ' ' + char.charAt(1).toUpperCase())}
                                                    </span>
                                                </div>
                                                {/* Episodes / Volumes */}
                                                <div className='flex-center column only-justify-content gap'>
                                                    <span>{(currentItem.episodes) ? 'Episodes' : 'Volumes'}</span>
                                                    <span>{(currentItem.episodes) ? currentItem.episodes : currentItem.volumes}</span>
                                                </div>
                                                {/* Duration / Chapters */}
                                                <div className='flex-center column only-justify-content gap'>
                                                    <span>{(currentItem.duration) ? 'Duration' : 'Chapters'}</span>
                                                    <span>{(currentItem.duration) ? `${currentItem.duration} mins` : currentItem.chapters || '?'}</span>
                                                </div>
                                                {/* Status */}
                                                <div className='flex-center column only-justify-content gap'>
                                                    <span>Status</span>
                                                    <span>{currentItem.status.charAt(0) + currentItem.status.substring(1).toLowerCase()}</span>
                                                </div>
                                                {/* Aired */}
                                                <div className='flex-center column only-justify-content gap'>
                                                    <span>Aired</span>
                                                    <span>{currentItem.startDate} to {currentItem.endDate}</span>
                                                </div>
                                                {/* Season */}
                                                {(currentItem.season)
                                                    ? <div className='flex-center column only-justify-content gap'>
                                                        <span>Season</span>
                                                        <span>{currentItem.season.charAt(0) + currentItem.season.substring(1).toLowerCase()} {currentItem.seasonYear}</span>
                                                    </div>
                                                    : <></>}
                                                {/* Studios */}
                                                {(currentItem.studios.length !== 0)
                                                    ? <div className='flex-center column only-justify-content gap'>
                                                        <span>Studios</span>
                                                        <div className='font transparent-normal flex-center column gap only-justify-content'>
                                                            {currentItem.studios.map((studio, studioIndex) => {
                                                                return <span key={`${studioIndex} ${studio.name}`}
                                                                    className='no-alternating-text-color'>
                                                                    {studio.name}
                                                                </span>;
                                                            })}
                                                        </div>
                                                    </div>
                                                    : <></>}
                                                {/* Source */}
                                                {(currentItem.source)
                                                    ? <div className='flex-center column only-justify-content gap'>
                                                        <span>Source</span>
                                                        <span>{currentItem.source.charAt(0) + currentItem.source.substring(1).toLowerCase()
                                                            .replace(/_(.)/, (char) => ' ' + char.charAt(1).toUpperCase())}</span>
                                                    </div>
                                                    : <></>}
                                                {/* Genres */}
                                                {(currentItem.genres.length !== 0)
                                                    ? <div className='flex-center column only-justify-content gap'>
                                                        <span>Genres</span>
                                                        <div className='font transparent-normal flex-center column gap only-justify-content'>
                                                            {currentItem.genres.map((genre, genreIndex) => {
                                                                return <span key={`${genreIndex} ${genre}`}
                                                                    className='no-alternating-text-color'>
                                                                    {genre}
                                                                </span>;
                                                            })}
                                                        </div>
                                                    </div>
                                                    : <></>}
                                                {/* Tags */}
                                                {(currentItem.tags.length !== 0)
                                                    ? <div className='flex-center column only-justify-content gap'>
                                                        <span>Tags</span>
                                                        <div id='animesearcher-tags'
                                                            className='font transparent-normal flex-center column gap only-justify-content'>
                                                            {currentItem.tags.map((tag, tagIndex) => {
                                                                if (((tag.isGeneralSpoiler === false) && (tag.isMediaSpoiler === false))
                                                                    || (this.state.spoiler && (tag.isGeneralSpoiler || tag.isMediaSpoiler))){
                                                                    return <div className='element-ends'
                                                                        key={`${tagIndex} ${tag.name}`}>
                                                                        <span className={`${(tag.isGeneralSpoiler || tag.isMediaSpoiler) ? 'font spoiler' : ''} no-alternating-text-color`}>
                                                                            {tag.name}
                                                                        </span>
                                                                        <span className={`${(tag.isGeneralSpoiler || tag.isMediaSpoiler) ? 'font spoiler' : ''} no-alternating-text-color`}>
                                                                            {tag.rank}%
                                                                        </span>
                                                                    </div>
                                                                };
                                                                return '';
                                                            })}
                                                        </div>
                                                    </div>
                                                    : <></>}
                                                {/* External Sources */}
                                                {(currentItem.externalLinks.length !== 0)
                                                    ? <div className='flex-center column only-justify-content gap'>
                                                        <span>Resources</span>
                                                        <div id='animesearcher-external-sources'>
                                                            {currentItem.externalLinks.map((link, index) => {
                                                                return <button className='button-match'
                                                                    key={`button-${link.site}-${index}`}
                                                                    onClick={() => {
                                                                        window.open(link.url);
                                                                    }}>
                                                                    <img className='image-site'
                                                                        src={link.icon || '/resources/singles/page.webp'}
                                                                        alt={link.site}
                                                                        loading='lazy'
                                                                        decoding='async'/>
                                                                </button>
                                                            })}
                                                        </div>
                                                    </div>
                                                    : <></>}
                                            </section>
                                        </div>
                                        {/* Description Container */}
                                        <section id='animesearcher-container-description'
                                            className='flex-center column gap small-gap only-align-items align-items-left space-nicely space-top not-bottom'
                                            aria-labelledby='anime-description-heading'>
                                            <h2 id='anime-description-heading'
                                                className='screen-reader-only'>Anime Description</h2>
                                            {/* Title */}
                                            <div className='element-ends'>
                                                <div className='text-animation flex-center column gap align-items-left'>
                                                    <span className='aesthetic-scale scale-self origin-left flex-center row gap font bold medium'>
                                                        <span style={{ cursor: 'pointer' }}
                                                            onClick={() => {
                                                                copyToClipboard(currentItem.titleEnglish || currentItem.titleRomaji);
                                                            }}>
                                                            {currentItem.titleEnglish || currentItem.titleRomaji}
                                                        </span>
                                                        {(currentItem.adult)
                                                            ? <span className='text-tag adult-tag'>R18</span>
                                                            : <></>}
                                                        {(currentItem.dubbed)
                                                            ? <span className='text-tag'>DUB</span>
                                                            : <></>}
                                                    </span>
                                                    <span className='aesthetic-scale scale-self origin-left font transparent-bold small'>
                                                        {((currentItem.titleEnglish !== null) && (currentItem.titleNative !== null))
                                                            ? `${currentItem.titleRomaji}, ${currentItem.titleNative}`
                                                            : currentItem.titleRomaji}
                                                    </span>
                                                </div>
                                                <span className='text-animation font large bold'>{currentItem.meanScore}%</span>
                                            </div>
                                            {/* Statistics */}
                                            <div className='aesthetic-scale scale-span element-ends'>
                                                <div className='text-animation flex-center column gap align-items-left'>
                                                    <span>Ranked</span>
                                                    <span>{(currentItem.rankingsRated === 0) ? 'N/A' : `#${currentItem.rankingsRated}`}</span>
                                                </div>
                                                <div className='text-animation flex-center column gap align-items-left'>
                                                    <span>Popularity</span>
                                                    <span>{(currentItem.rankingsPopular === 0) ? 'N/A' : `#${currentItem.rankingsPopular}`}</span>
                                                </div>
                                                <div className='text-animation flex-center column gap align-items-left'>
                                                    <span>Members</span>
                                                    <span>{currentItem.popularity}</span>
                                                </div>
                                                <div className='text-animation flex-center column gap align-items-left'>
                                                    <span>Favorites</span>
                                                    <span>{currentItem.favorites}</span>
                                                </div>
                                            </div>
                                            {/* Description */}
                                            {summary && <span>Simple Summary: {summary}</span>}
                                            <span className='text-animation'
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(currentItem.description)
                                                }}></span>
                                            {/* Relations */}
                                            {(currentItem.relations.length !== 0)
                                                ? <span className='font bold small'>Relations</span>
                                                : <></>}
                                            {(currentItem.relations.length !== 0)
                                                ? <SimpleBar id='animesearcher-relations'
                                                    role='list'
                                                    aria-label='Related Media'>
                                                    {currentItem.relations.map((relation, index) => {
                                                        return <div className='character flex-center column'
                                                            key={`relation-${index}`}
                                                            role='listitem'> 
                                                            <img id={`animesearcher-relation-${index}`}
                                                                className='image-character'
                                                                onClick={() => {
                                                                    this.fetchMedia(null, relation.id);
                                                                }}
                                                                src={relation.coverImage.extraLarge}
                                                                alt={`relation ${index}`}
                                                                draggable='false'
                                                                loading='lazy'
                                                                decoding='async'/>
                                                            <span className='font small text-boxed anime-searcher-normal'>
                                                                {relation.type.charAt(0) + relation.type.substring(1).toLowerCase()}
                                                            </span>
                                                        </div>
                                                    })}
                                                </SimpleBar>
                                                : <></>}
                                            {/* Characters */}
                                            {(currentItem.characters.length !== 0)
                                                ? <span className='font bold small'>Characters</span>
                                                : <></>}
                                            {(currentItem.characters.length !== 0)
                                                ? <SimpleBar id='animesearcher-characters'
                                                    role='list'
                                                    aria-label='Character List'>
                                                    {currentItem.characters.map((character, index) => {
                                                        return <div className='character flex-center column'
                                                            key={`character-${index}`}
                                                            role='listitem'>
                                                            <img id={`animesearcher-character-${index}`}
                                                                className='image-character'
                                                                onClick={() => this.characterClick(index)}
                                                                src={character.image.large}
                                                                alt={`character ${character.name.full}`}
                                                                draggable='false'
                                                                loading='lazy'
                                                                decoding='async'/>
                                                            <span className='font small text-boxed anime-searcher-normal'>
                                                                {currentItem.charactersRole[index].role.charAt(0) + currentItem.charactersRole[index].role.substring(1).toLowerCase()}
                                                            </span>
                                                        </div>
                                                    })}
                                                </SimpleBar>
                                                : <></>}
                                            {/* Character Information */}
                                            {(currentItem.characters.length !== 0)
                                                ? <SimpleBar id='animesearcher-character-information'
                                                    className='popout box dimmed no-highlight'
                                                    onClick={() => {
                                                        this.characterClick();
                                                    }}
                                                    role='region'
                                                    aria-label='Character information panel'>
                                                    {/* Image */}
                                                    <img className='image-character large-image'
                                                        src={currentItem.characters[this.state.characterIndex]?.image.large}
                                                        alt={`character ${currentItem.characters[this.state.characterIndex]?.name?.full}`}
                                                        loading='lazy'
                                                        decoding='async'/>
                                                    {/* Information */}
                                                    <div className='flex-center column gap align-items-left'>
                                                        {/* Name */}
                                                        <div className='flex-center column gap only-justify-content'>
                                                            <span className='link-match font bold medium'
                                                                onClick={() => {
                                                                    copyToClipboard(currentItem.characters[this.state.characterIndex].name.full);
                                                                }}>{currentItem.characters[this.state.characterIndex].name.full}</span>
                                                            {(currentItem.characters[this.state.characterIndex].name.alternative.length !== 0)
                                                                ? <div className='flex-center row gap only-align-items font transparent-bold small'>
                                                                    {currentItem.characters[this.state.characterIndex].name.alternative.map((name, index) => {
                                                                        if (index !== (currentItem.characters[this.state.characterIndex].name.alternative.length - 1)){
                                                                            return `${name}, `;
                                                                        } else {
                                                                            return `${name}`;
                                                                        };
                                                                    })}
                                                                </div>
                                                                : <></>}
                                                            {(currentItem.spoiler && (currentItem.characters[this.state.characterIndex].name.alternativeSpoiler.length !== 0))
                                                                ? <div className='flex-center row gap only-align-items font spoiler bold small'>
                                                                    {currentItem.characters[this.state.characterIndex].name.alternativeSpoiler.map((name, index) => {
                                                                        if (index !== (currentItem.characters[this.state.characterIndex].name.alternativeSpoiler.length - 1)){
                                                                            return `${name}, `;
                                                                        } else {
                                                                            return `${name}`;
                                                                        };
                                                                    })}
                                                                </div>
                                                                : <></>}
                                                        </div>
                                                        {/* Gender */}
                                                        {(currentItem.characters[this.state.characterIndex].gender)
                                                            ? <div className='flex-center row gap'>
                                                                <span>Gender:</span>
                                                                <span>{currentItem.characters[this.state.characterIndex].gender}</span>
                                                            </div>
                                                            : <></>}
                                                        {/* Age */}
                                                        {(currentItem.characters[this.state.characterIndex].age)
                                                            ? <div className='flex-center row gap'>
                                                                <span>Age:</span>
                                                                <span>{currentItem.characters[this.state.characterIndex].age}</span>
                                                            </div>
                                                            : <></>}
                                                        {/* Date of Birth */}
                                                        {(currentItem.characters[this.state.characterIndex].dateOfBirth.year || currentItem.characters[this.state.characterIndex].dateOfBirth.month || currentItem.characters[this.state.characterIndex].dateOfBirth.day)
                                                            ? <div className='flex-center row gap'>
                                                                <span>Date of Birth:</span>
                                                                <span>{(new Date(`${currentItem.characters[this.state.characterIndex].dateOfBirth.year} ${currentItem.characters[this.state.characterIndex].dateOfBirth.month} ${currentItem.characters[this.state.characterIndex].dateOfBirth.day}`))
                                                                    .toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}</span>
                                                            </div>
                                                            : <></>}
                                                        {/* Blood Type */}
                                                        {(currentItem.characters[this.state.characterIndex].bloodType)
                                                            ? <div className='flex-center row gap'>
                                                                <span>Blood Type:</span>
                                                                <span>{currentItem.characters[this.state.characterIndex].bloodType}</span>
                                                            </div>
                                                            : <></>}
                                                        {/* Description */}
                                                        {(currentItem.characters[this.state.characterIndex].description)
                                                            ? <span dangerouslySetInnerHTML={{
                                                                __html: DOMPurify.sanitize(currentItem.characters[this.state.characterIndex].description)
                                                            }}></span>
                                                            : 'N/A'}
                                                        {/* Favorites */}
                                                        {(currentItem.characters[this.state.characterIndex].favourites)
                                                            ? <div className='flex-center row gap'>
                                                                <span>Favorites:</span>
                                                                <span>{currentItem.characters[this.state.characterIndex].favourites}</span>
                                                            </div>
                                                            : <></>}
                                                    </div>
                                                </SimpleBar>
                                                : <></>}
                                            {/* Streaming Episodes */}
                                            {(currentItem.streamingEpisodes.length !== 0)
                                                ? <span className='font bold small'>Episode Videos</span>
                                                : <></>}
                                            {(currentItem.streamingEpisodes.length !== 0)
                                                ? <SimpleBar id='animesearcher-streaming-episodes'
                                                    role='list'
                                                    aria-label='Streaming Episodes'>
                                                    {currentItem.streamingEpisodes.map((episode, index) => {
                                                        return <div className='character flex-center column'
                                                            key={`episode-${index}`}
                                                            role='listitem'>
                                                            <img id={`animesearcher-streaming-episodes-${index}`}
                                                                className='image-character'
                                                                onClick={() => {
                                                                    window.open(episode.url);
                                                                }}
                                                                src={episode.thumbnail}
                                                                alt={`episode ${index}`}
                                                                draggable='false'
                                                                loading='lazy'
                                                                decoding='async'/>
                                                            <span className='font small text-boxed anime-searcher-wide'>
                                                                {episode.title}
                                                            </span>
                                                        </div>
                                                    })}
                                                </SimpleBar>
                                                : <></>}
                                            {/* Recommendations */}
                                            {(currentItem.recommendations.length !== 0)
                                                ? <span className='font bold small'>Recommendations</span>
                                                : <></>}
                                            {(currentItem.recommendations.length !== 0)
                                                ? <SimpleBar id='animesearcher-recommendations'
                                                    role='list'
                                                    aria-label='Recommended Media'>
                                                    {currentItem.recommendations.map((recommendation, index) => {
                                                        return <div className='character flex-center column'
                                                            key={`recommendation-${index}`}
                                                            role='listitem'>
                                                            <img id={`animesearcher-recommendation-${index}`}
                                                                className='image-character'
                                                                onClick={() => {
                                                                    this.fetchMedia(null, recommendation.mediaRecommendation.id);
                                                                }}
                                                                src={recommendation.mediaRecommendation?.coverImage.extraLarge || ''}
                                                                alt={`recommendation ${index}`}
                                                                draggable='false'
                                                                loading='lazy'
                                                                decoding='async'/>
                                                            <span className='font small text-boxed anime-searcher-normal'>
                                                                {recommendation.mediaRecommendation?.type.charAt(0) + recommendation.mediaRecommendation?.type.substring(1).toLowerCase() || ''}
                                                            </span>
                                                        </div>
                                                    })}
                                                </SimpleBar>
                                                : <></>}
                                        </section>
                                    </div>
                                </SimpleBar>
                                {/* Searches Information */}
                                <div ref={this.refMultipleSearches}
                                    className='animesearcher-searches'>
                                    {this.state.media.map((data, dataIndex) => {
                                        const searchesSummary = summarizeText(data.description);

                                        return <div className='animesearcher-search'
                                            style={{ '--animeSearcherCoverColor': data.coverImageColor || 'var(--randColorLight)' }}
                                            key={data.id ?? dataIndex}>
                                            <img src={data.coverImageLink}
                                                draggable='false'
                                                alt='cover'
                                                loading='lazy'
                                                decoding='async'
                                                onClick={() => this.handleSearchClick(dataIndex)}/>
                                            <div>
                                                <div className='flex-center row gap'>
                                                    <span className='text-tag'>
                                                        {(data.format === 'TV')
                                                            ? 'TV'
                                                            : data.format.charAt(0) + data.format.substring(1).toLowerCase()
                                                                .replace(/_(.)/, (char) => ' ' + char.charAt(1).toUpperCase())}
                                                    </span>
                                                    {(data.adult)
                                                        ? <span className='text-tag adult-tag'>R18</span>
                                                        : <></>}
                                                    {(data.dubbed)
                                                        ? <span className='text-tag'>DUB</span>
                                                        : <></>}
                                                </div>
                                                <span className='aesthetic-scale scale-self origin-left flex-center row gap font bold medium'
                                                    style={{ cursor: 'pointer', textAlign: 'center' }}>
                                                    <span onClick={() => {
                                                        copyToClipboard(data.titleEnglish || data.titleRomaji);
                                                    }}>
                                                        {data.titleEnglish || data.titleRomaji}
                                                    </span>
                                                </span>
                                                <span className='aesthetic-scale scale-self origin-left font transparent-bold small'>
                                                    {((data.titleEnglish !== null) && (data.titleNative !== null))
                                                        ? `${data.titleRomaji}, ${data.titleNative}`
                                                        : data.titleRomaji}
                                                </span>
                                                <div style={{ width: '100%' }}>
                                                    {searchesSummary && <span>Simple Summary: {searchesSummary}</span>}
                                                    <span className='text-animation'
                                                        dangerouslySetInnerHTML={{
                                                            __html: DOMPurify.sanitize(data.description)
                                                        }}></span>
                                                    <div className='flex-center column only-justify-content gap medium-gap'>
                                                        {/* Genres */}
                                                        {(data.genres.length !== 0)
                                                            ? <div className='flex-center column only-justify-content gap'>
                                                                <span>Genres</span>
                                                                <div className='font transparent-normal flex-center column gap only-justify-content'>
                                                                    {data.genres.map((genre) => {
                                                                        return <span key={`${dataIndex} ${genre}`}
                                                                            className='no-alternating-text-color'>
                                                                            {genre}
                                                                        </span>;
                                                                    })}
                                                                </div>
                                                            </div>
                                                            : <></>}
                                                        {/* Tags */}
                                                        {(data.tags.length !== 0)
                                                            ? <div className='flex-center column only-justify-content gap'>
                                                                <span>Tags</span>
                                                                <div id='animesearcher-tags'
                                                                    className='font transparent-normal flex-center column gap only-justify-content'>
                                                                    {data.tags.map((tag) => {
                                                                        if (((tag.isGeneralSpoiler === false) && (tag.isMediaSpoiler === false))
                                                                            || (data.spoiler && (tag.isGeneralSpoiler || tag.isMediaSpoiler))){
                                                                            return <div className='element-ends'
                                                                                key={`${dataIndex} ${tag.name}`}>
                                                                                <span className={`${(tag.isGeneralSpoiler || tag.isMediaSpoiler) ? 'font spoiler' : ''} no-alternating-text-color`}>
                                                                                    {tag.name}
                                                                                </span>
                                                                                <span className={`${(tag.isGeneralSpoiler || tag.isMediaSpoiler) ? 'font spoiler' : ''} no-alternating-text-color`}>
                                                                                    {tag.rank}%
                                                                                </span>
                                                                            </div>
                                                                        };
                                                                        return '';
                                                                    })}
                                                                </div>
                                                            </div>
                                                            : <></>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
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

export default memo(WidgetAnimeSearcher);