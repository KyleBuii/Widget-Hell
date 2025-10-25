import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';

const information = {
    special: [
        { name: 'Inventory',
            description: [
                'Widget for viewing inventory',
            ],
        },
        { name: 'Equipment',
            description: [
                'Widget for viewing equipment',
            ],
        },
        { name: 'Character',
            description: [
                'Widget for viewing character',
            ],
        },
        { name: 'Guide',
            description: [
                'Widget for viewing guide',
                'This is the guide',
            ],

        },
    ],
    utility: [
        { name: 'Anime Searcher',
            description: [
                'Widget for searching an anime or manga using an Anilist ID, name, or an image URL',
                'Providing an image URl will perform a reverse search to find the most related anime or manga that matches it',
                'Provides a SPOILER button to show/hide potential information that could spoil the searched media',
                'Pressing the search button with no input will provide a random media',
                'Pressing the filter button will display filters',
                'Pressing the title of the media will copy it to the clipboard',
                'Pressing an item under relations or recommendations if applicable, will provide information to the clicked item, overriding the currently searched media',
                'Pressing an item under characters will provide a popup of information for that character',
                'By default, NSFW media is enabled',
            ],
        },
        { name: 'Battery',
            description: [
                'Widget for showing the current life of the device',
            ],
        },
        { name: 'Calculator',
            description: [
                'Widget for calculating calculations',
                'Pressing the input field will allow typing',
                'Provides a memory section for ease of access to calculate',
                'Provides an expandable input field to easily display a long calculation',
            ],
        },
        { name: 'Currency Converter',
            description: [
                'Widget for converting currency',
            ],
        },
        { name: 'Daily Planner',
            description: [
                'Widget for planning',
                'Pressing the same cell or plan will close it',
            ],
        },
        { name: 'Google Translator',
            description: [
                'Widget for translating one language to another',
                'Pressing the text field for the colors will copy it to the clipboard',
                'Pressing the color field will change the background to the color',
            ],
        },
        { name: 'Image Color Picker',
            description: [
                'Widget for getting a desired color in an image',
            ],
        },
        { name: 'Motivation',
            description: [
                'Widget for getting motivated',
            ],
        },
        { name: 'Music Player',
            description: [
                'Widget for playing music in the form of a youtube or soundcloud URL',
                'Pressing the video player will expand it up to 2 times',
                'Hovering over the title will slide the rest of the name in view',
                'Pressing the title or author will copy it to the clipboard',
                'Dragging or pressing the progress bar will jump to the desired position',
                'Hovering near the bottom of the widget will extend a popout',
            ],
        },
        { name: 'QR Code',
            description: [
                'Widget for generating a QR code based on the text inputted',
            ],
        },
        { name: 'Quote',
            description: [
                'Widget for reading quotes',
            ],
        },
        { name: 'Spreadsheet',
            description: [
                'Widget for using a spreadsheet',
            ],
        },
        { name: 'Time Conversion',
            description: [
                'Widget for converting time',
            ],
        },
        { name: 'Translator',
            description: [
                'Widget for translating one language to another',
                'Pressing a section under a select will collapse it',
            ],
        },
        { name: 'Weather',
            description: [
                'Widget for viewing the weather',
            ],
        },
    ],
    games: [
        { name: 'Breakout',
            description: [
                'Widget for playing breakout',
                'Goal is to destroy all the bricks',
                'Clearing all the bricks will generate a new set of bricks',
            ],
            controls: [
                {
                    control: 'Left and Right Arrow Keys/Mouse',
                    action: 'Move',
                },
            ],
            exp: 'Equal to bricks broken',
            restriction: 'Every 100 bricks destroyed',
            stats: {
                health: 'Allows the ball to bounce off the bottom for every 10',
            },
        },
        { name: 'Bullet Hell',
            description: [
                'Widget for playing bullet hell',
                'Goal is to dodge the bullets and eliminate the boss',
            ],
            controls: [
                {
                    control: 'WASD/Arrow Keys/Mouse',
                    action: 'Move',
                },
                {
                    control: 'Shift',
                    action: 'Slow move',
                },
                {
                    control: 'Spacebar',
                    action: 'Ability',
                },
                {
                    control: 'Ctrl',
                    action: 'Switch ability',
                },
            ],
            stats: {
                health: 'Gives extra life for every 10',
                mana: 'Increases ability hit points for every 10',
                attack: 'Increases bullet damage relative to value',
                strength: 'Increases bullet speed',
                intelligence: 'Reduces ability cooldown by 0.1 * (1.5)x for every 10',
                dexterity: 'Increases attack rate',
            },
            items: {
                'code of hammurabi': {
                    type: 'active',
                    information: 'Creates a stone that reflects bullets',
                },
                'grass block': {
                    type: 'active',
                    information: 'Creates a grass block that blocks bullets',
                },
                'rest in peace': {
                    type: 'active',
                    information: 'Slashes multiple times, sending tremors through the ground and awakening skeleton hands that rise from the earth',
                },
                'door knocker': {
                    type: 'passive',
                    information: 'Debuffs the enemy with decreased morale',
                },
            },
        },
        { name: 'Chess',
            description: [
                'Widget for playing chess',
                'Goal is to capture the opposing king',
            ],
            exp: 'Equal to pieces captured',
            restriction: 'Every 5 pieces captured',
        },
        { name: 'Circle Beat',
            description: [
                'Widget for playing circle beat',
                'Goal is to press as many circles at the perfect time',
            ],
        },
        { name: 'Color Memory',
            description: [
                'Widget for playing color memory',
                'Goal is to remember as many colors',
            ],
            exp: 'Equal to correct guesses',
            restriction: 'Every 10 correct guesses',
        },
        { name: 'Grindshot',
            description: [
                'Widget for playing grindshot',
            ],
        },
        { name: 'Minesweeper',
            description: [
                'Widget for playing minesweeper',
                'Goal is to click every block that is not a mine',
            ],
            controls: [
                {
                    control: 'Left Click',
                    action: 'Reveal a cell',
                },
                {
                    control: 'Right Click',
                    action: 'Flag/Unflag',
                },
            ],
            exp: 'Equal to mines on complete',
            restriction: 'Every 10 mines',
            stats: {
                health: 'Allows tanking a mine for every 10',
            },
        },
        { name: 'Rock Paper Scissor',
            description: [
                'Widget for playing rock paper scissor',
                'Goal is to play a shape that will beat the opposing shape',
            ],
            exp: 'Equal to correct guesses',
            restriction: 'Every 2 correct guesses',
        },
        { name: 'Simon Game',
            description: [
                'Widget for playing simon game',
                'Goal is to press as many colors in the correct order',
            ],
            exp: 'Equal to correct guesses',
            restriction: 'Every 7 guesses',
            stats: {
                health: 'Allows surviving an incorrect guess for every 10',
            },
        },
        { name: 'Snake',
            description: [
                'Widget for playing snake',
                'Goal is to create the longest snake',
            ],
            controls: [
                {
                    control: 'WASD/Arrow Keys',
                    action: 'Move',
                },
                {
                    control: 'Shift',
                    action: 'Dash',
                },
            ],
            exp: 'Equal to food eaten',
            restriction: 'Every 10 food eaten',
            stats: {
                health: 'Allows tanking the wall for every 10',
            },
        },
        { name: 'Tetris',
            description: [
                'Widget for playing tetris',
                'Goal is to prevent the blocks from reaching the top',
            ],
            controls: [
                {
                    control: 'AD/Left and Right Arrow Keys',
                    action: 'Move',
                },
                {
                    control: 'W/Up Arrow Key',
                    action: 'Rotate clockwise',
                },
                {
                    control: 'S/Down Arrow Key',
                    action: 'Soft drop',
                },
                {
                    control: 'Spacebar',
                    action: 'Hard drop',
                },
                {
                    control: 'F',
                    action: 'Reset/Start game',
                },
                {
                    control: 'Shift',
                    action: 'Hold piece',
                },
            ],
            exp: 'Equal to 1 gold for every 1000 score',
            restriction: 'Every 5000 score',
        },
        { name: 'Trivia',
            description: [
                'Widget for playing trivia',
                'Goal is to get every question correct',
            ],
            exp: 'Equal to correct guesses',
            restriction: 'Every 5 correct answers',
            stats: {
                health: 'Allows a wrong guess for every 10',
            },
        },
        { name: '2048',
            description: [
                'Widget for playing 2048',
                'Goal is to reach 2048',
            ],
            controls: [
                {
                    control: 'WASD/Arrow Keys',
                    action: 'Move',
                },
            ],
            exp: 'Equal to 1/4 of score',
            restriction: 'On getting 2048',
        },
        { name: 'Typing Test',
            description: [
                'Widget for playing typing test',
                'Goal is to type the text fast',
            ],
            exp: 'Equal to half of WPM',
            restriction: 'Every 40 wpm',
        },
    ],
    fun: [
        { name: 'Ai Image Generator',
            description: [
                'Widget for generating an AI image',
            ],
        },
        { name: 'Donut Animation',
            description: [
                'Widget for viewing a donut animation',
            ],
        },
        { name: 'Facts',
            description: [
                'Widget for viewing facts',
            ],
        },
        { name: 'Iceberg',
            description: [
                'Widget for viewing an iceberg meme',
                'Getting Rickrolled means there are multiple sources',
            ],
        },
        { name: 'Picker Wheel',
            description: [
                'Widget for picking a random choice',
            ],
        },
        { name: 'Pokemon Search',
            description: [
                'Widget for searching a pokemon',
            ],
        },
        { name: 'Sticker',
            description: [
                'Widget for sticking a sticker',
            ],
        },
    ],
};

const PageConstructor = memo(({ children, pageNum, pageIndex, pageClick, className = '', }) => {
    return <div className={`page ${className}`}
        style={{ zIndex: pageIndex }}
        data-page-num={pageNum}
        onClick={pageClick}>
        {children}
    </div>
});
PageConstructor.displayName = 'Page Constructor';
const Page = ({
    pageNum, pageIndex, pageClick,
    type, title,
    toc, flipped, propValues,
    firstSection, sectionName, widgetName, widgetDescription,
    stats, items,
}) => {
    switch (type) {
        case 'cover':
            return <PageConstructor className='page-cover'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <span>GUIDE</span>
                <img src='/favicon-96x96.png'
                    srcSet='
                        /favicon-16x16.png 16w,
                        /favicon-32x32.png 32w,
                        /favicon-96x96.png 96w,
                    '
                    sizes='96px'
                    alt='Cover art'/>
                    {(propValues.authorNames)
                        ? <span>KYLE BUI</span>
                        : <></>}
            </PageConstructor>
        case 'title':
            return <PageConstructor className='page-title'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                {title}
            </PageConstructor>
        case 'toc':
            return <PageConstructor pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                {(toc.length !== 0)
                    && toc.map((entry, entryIndex) => {
                        return <div className='dots-between-text'
                            key={`${entry.title} ${entryIndex}`}>
                            <span>{entry.title.toUpperCase()}</span>
                            <span></span>
                            <span>{entry.page}</span>
                        </div>
                    }
                )}
            </PageConstructor>
        case 'description':
            return <PageConstructor className='page-description'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <div></div>
                <div>
                    <span>Web application featuring a versatile array of draggable widgets! EX: Randomly generate quotes, translate or modify text, calculate computations, check the weather, play games, and more! You can display what widgets you want and move them however you will!</span>
                    <div>
                        <span className='font bold'>Features</span>
                        <ul>
                            <li>30+ widgets</li>
                            <li>Customizable design</li>
                            <li>...and more</li>
                        </ul>
                    </div>
                </div>
            </PageConstructor>
        case 'bookmark':
            return <PageConstructor className='page-invisible'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <div className={`bookmark ${flipped && 'flipped'}`}>
                    {[...'BOOKMARK'].map((letter, index) => {
                        return <span key={`${letter} ${index}`}>{letter}</span>
                    })}
                </div>
            </PageConstructor>
        case 'widget-info':
            return <PageConstructor className='page-information'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                {firstSection && <span className='font large bold'>{sectionName.replace(/^./, (char) => char.toUpperCase())}</span>}
                <span className='font medium bold'>{widgetName}</span>
                <div>
                    {widgetDescription.map((descr, descrIndex) => (
                        <span key={`${widgetName} descr ${descrIndex}`}>{descr}</span>
                    ))}
                </div>
            </PageConstructor>
        case 'controls':
            return <PageConstructor className='page-table'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <table className='table'
                    aria-label='Controls'>
                    <thead>
                        <tr>
                            <th scope='col'>Game</th>
                            <th scope='col'>Control</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(information.games).map((game) => {
                            if (game.controls === undefined)
                                return <tr key={game.name}>
                                    <td>{game.name}</td>
                                    <td></td>
                                    <td></td>
                                </tr>

                            return game.controls.map((control, controlIndex) => {
                                return <tr key={control.control}>
                                    <td>{(controlIndex === 0) && game.name}</td>
                                    <td>{control.control}</td>
                                    <td>{control.action}</td>
                                </tr>
                            });
                        })}
                    </tbody>
                </table>
            </PageConstructor>
        case 'gold-exp':
            return <PageConstructor className='page-table'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <table className='table'
                    aria-label='Gold and EXP'>
                    <thead>
                        <tr>
                            <th scope='col'>Game</th>
                            <th scope='col'>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(information.games).map((game) => {
                            return <tr key={game.name}>
                                <td>{game.name}</td>
                                <td>{game.exp}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </PageConstructor>
        case 'drop-rates':
            return <PageConstructor className='page-table'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <table className='table'
                    aria-label='Drop Rates'>
                    <thead>
                        <tr>
                            <th scope='col'>Rarity</th>
                            <th scope='col'>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Common</td>
                            <td>80%</td>
                        </tr>
                        <tr>
                            <td>Rare</td>
                            <td>15%</td>
                        </tr>
                        <tr>
                            <td>Exotic</td>
                            <td>4%</td>
                        </tr>
                        <tr>
                            <td>Meme</td>
                            <td>1%</td>
                        </tr>
                    </tbody>
                </table>
            </PageConstructor>
        case 'restrictions':
            return <PageConstructor className='page-table'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <table className='table'
                    aria-label='Restrictions'>
                    <thead>
                        <tr>
                            <th scope='col'>Game</th>
                            <th scope='col'>Requirement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(information.games).map((game) => {
                            return <tr key={game.name}>
                                <td>{game.name}</td>
                                <td>{game.restriction}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </PageConstructor>
        case 'stats-info':
            return <PageConstructor className='page-table'
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <table className='table'
                    aria-label='Stats'>
                    <thead>
                        <tr>
                            <th scope='col'>Heart</th>
                            <th scope='col'>Hits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((number) => (
                            <tr key={number}>
                                <td>
                                    <img src={`/resources/hearts/heart${number}.webp`}
                                        alt={`heart ${number}`}/>
                                </td>
                                <td>{number * 5}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PageConstructor>
        case 'stats':
            return <PageConstructor className={`page-table ${flipped && 'page-flipped'}`}
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <span className='font medium bold'
                    style={{ padding: '0.5rem' }}>{widgetName}</span>
                <table className='table'>
                    <thead>
                        <tr>
                            <td>Stat</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {['Health', 'Mana', 'Attack', 'Defense', 'Strength', 'Agility', 'Vitality', 'Resilience', 'Intelligence', 'Dexterity', 'Luck'].map((stat) => {
                            return <tr key={`${widgetName} ${stat}`}>
                                <td>{stat}</td>
                                <td>{stats?.[stat.toLowerCase()]}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </PageConstructor>
        case 'items':
            return <PageConstructor className={`page-table ${flipped && 'page-flipped'}`}
                pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <span className='font medium bold'
                    style={{ padding: '0.5rem' }}>{widgetName}</span>
                <table className='table'>
                    <thead>
                        <tr>
                            <td>Item</td>
                            <td>Type</td>
                            <td>Information</td>
                        </tr>
                    </thead>
                    <tbody>
                        {(Object.entries(items).length !== 0)
                            ? Object.entries(items).map(([itemName, itemData]) => {
                                return <tr key={itemName}>
                                <td>{itemName.replace(/\b\w/g, (char) => char.toUpperCase())}</td>
                                    <td>{itemData.type.replace(/^./, (char) => char.toUpperCase())}</td>
                                    <td>{itemData.information}</td>
                                </tr>
                            })
                            : <tr key={`${widgetName} no items`}>
                                <td style={{ opacity: 0.5, textAlign: 'center' }}
                                    colSpan={3}>
                                    No items
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </PageConstructor>
        case 'spacer':
            return <PageConstructor pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
            </PageConstructor>
        default:
            return <PageConstructor pageNum={pageNum}
                pageIndex={pageIndex}
                pageClick={pageClick}>
                <div>Unknown page type: {type}</div>
            </PageConstructor>
    };
};

const WidgetGuide = ({ defaultProps }) => {
    const [elementPages, setElementPages] = useState([]);

    useEffect(() => {
        let tempPages = [];

        //#region Pages
        tempPages.push({ type: 'cover', propValues: defaultProps.values, });
        tempPages.push({ type: 'title',  title: 'TABLE OF CONTENTS', });
        tempPages.push({ type: 'toc', toc: [], });
        tempPages.push({ type: 'title',  title: 'DESCRIPTION', });
        tempPages.push({ type: 'bookmark', });
        tempPages.push({ type: 'bookmark', flipped: true, });
        tempPages.push({ type: 'description', });
        tempPages.push({ type: 'title',  title: 'WIDGETS', });
        Object.entries(information).forEach((info) => {
            info[1].forEach((widget, widgetIndex) => {
                tempPages.push({
                    type: 'widget-info',
                    firstSection: (widgetIndex === 0),
                    sectionName: info[0],
                    widgetName: widget.name,
                    widgetDescription: widget.description,
                });
            })
        });
        if ((Object.values(information).reduce((total, value) => value.length + total, 0)) % 2 === 0)
            tempPages.push({ type: 'spacer', });
        tempPages.push({ type: 'title',  title: 'CONTROLS', });
        tempPages.push({ type: 'controls', });
        tempPages.push({ type: 'title',  title: 'GOLD AND EXP', });
        tempPages.push({ type: 'gold-exp', });
        tempPages.push({ type: 'title',  title: 'DROP RATES', });
        tempPages.push({ type: 'drop-rates', });
        tempPages.push({ type: 'title',  title: 'RESTRICTIONS', });
        tempPages.push({ type: 'restrictions', });
        tempPages.push({ type: 'title',  title: 'STATS', });
        tempPages.push({ type: 'stats-info', });
        Object.values(information.games).forEach((game, gameIndex) => {
            tempPages.push({
                type: 'stats',
                flipped: (gameIndex % 2 === 0),
                widgetName: game.name,
                stats: { ...game.stats },
            });
        });
        if (Object.keys(information.games).length % 2 !== 0)
            tempPages.push({ type: 'spacer', });
        tempPages.push({ type: 'title',  title: 'ITEMS', });
        Object.values(information.games).forEach((game, gameIndex) => {
            tempPages.push({
                type: 'items',
                flipped: (gameIndex % 2 !== 0),
                widgetName: game.name,
                items: { ...game.items },
            });
        });
        (Object.keys(information.games).length % 2 === 0)
            tempPages.push({ type: 'spacer', });
        tempPages.push({ type: 'spacer', });

        for (let pageIndex = 0; pageIndex < tempPages.length; pageIndex++) {
            const currentPage = tempPages[pageIndex];
            if (currentPage.title === undefined) continue;
            tempPages[2].toc.push({ title: currentPage.title || currentPage.type, page: pageIndex, });
        };
        //#endregion

        setElementPages([ ...tempPages ]);
    }, []);

    const handlePageClick = (event) => {
        if (event.target.closest('.bookmark')) return;
        
        const page = event.currentTarget;

        if (page.dataset.pageNum % 2 === 0) {
            page.classList.add('flipped');
            page.nextElementSibling.classList.add('flipped');
        } else {
            page.classList.remove('flipped');
            page.previousElementSibling.classList.remove('flipped');
        };

        if (page.classList.contains('page-invisible')) {
            const nextPage = event.currentTarget.nextElementSibling.nextElementSibling;
            const previousPage = event.currentTarget.previousElementSibling.previousElementSibling;

            const pageTimeout = setTimeout(() => {
                if (nextPage.dataset.pageNum % 2 === 0) {
                    nextPage.classList.add('flipped');
                    nextPage.nextElementSibling.classList.add('flipped');
                } else {
                    previousPage.classList.remove('flipped');
                    previousPage.previousElementSibling.classList.remove('flipped');
                };
                
                clearTimeout(pageTimeout);
            }, 200);
        };
    };

    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('guide')}
            onStop={(event, data) => {
                defaultProps.dragStop('guide');
                defaultProps.updatePosition('guide', 'utility', data.x, data.y);
            }}
            cancel='button'
            handle='.bookmark'
            bounds='parent'>
            <section id='guide-widget'
                className='widget'
                aria-labelledby='guide-widget-heading'>
                <h2 id='guide-widget-heading'
                    className='screen-reader-only'>Guide Widget</h2>
                <div id='guide-widget-animation'
                    className='widget-animation custom-shape book'>
                    {/* Drag Handle */}
                    <span id='guide-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-className-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {/* Hotbar */}
                    {defaultProps.renderHotbar('guide', 'utility')}
                    <div className='pages'>
                        {Object.values(elementPages).map((page, pageIndex) => {
                            return <Page key={`page ${pageIndex}`}
                                {...page}
                                pageNum={pageIndex}
                                pageIndex={(pageIndex % 2 === 0) && elementPages.length - pageIndex}
                                pageClick={handlePageClick}>
                            </Page>
                        })}
                    </div>
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetGuide);