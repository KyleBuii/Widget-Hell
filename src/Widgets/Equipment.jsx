import DOMPurify from 'dompurify';
import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import SimpleBar from 'simplebar-react';


//#region Equipment Guide
/* Stats Guide
[Main Stats]   ->       [Side Stats]
   Health      ->         Vitality
    Mana       ->       Intelligence
   Attack      ->   Strength + Dexterity
   Defense     ->        Resilience
   Agility
    Luck
*/
/* Slots Guide
                              Headband -   Helmet   - Eyewear
                                          Necklace
                            Undershirt - Chestplate - Cape
          Right Bracelet - Right Wrist -    Belt    - Left Wrist - Left Bracelet
Main Item -  Right Glove - Right Ring  -  Legging   - Left Ring  - Left Glove - Offhand Item
       Right Hidden Item in Boot - Right Boot - Left Boot - Left Hidden Item in Boot
   Consumable 1 - Consumable 2 - Consumable 3 - Consumable 4 - Consumable 5 - Consumable 6
     [Health]   -    [Mana]    -   [Attack]   -  [Defense]   -  [Agility]   -    [Luck]
*/
//#endregion
const audioItemOpen = new Audio('/resources/audio/switch_006.wav');
const audioItemClose = new Audio('/resources/audio/switch_007.wav');
const audioItemUnequip = new Audio('/resources/audio/cloth.wav');

const WidgetEquipment = ({ defaultProps, gameProps, updateGameValue, equipment, items, stats, abilities }) => {
    const [state, setState] = useState({
        item: { name: 'Creampuff', rarity: 'rare', slot: 'hidden' },
        abilities: []
    });
    useEffect(() => {
        audioItemOpen.volume = 0.5;
        audioItemClose.volume = 0.5;
        window.addEventListener('equip item', updateEquipment);
        let itemSlot;
        /// Fill equipment slots with image of equipped item
        for (let i in equipment) {
            if (equipment[i].name !== '') {
                /// Equipped items with no left and right
                if (equipment[i].name !== undefined) {
                    itemSlot = document.getElementById(`equipment-slot-${i}`);
                    itemSlot.style.backgroundImage = `url(${items[equipment[i].rarity][equipment[i].name].image})`;
                    itemSlot.style.opacity = '1';
                    itemSlot.onclick = () => {
                        viewItem({
                            ...equipment[i],
                            'slot': i
                        });
                    };
                } else {
                    /// Left equipped item
                    if (equipment[i].left.name !== '') {
                        itemSlot = document.getElementById(`equipment-slot-${i}-left`);
                        itemSlot.style.backgroundImage = `url(${items[equipment[i].left.rarity][equipment[i].left.name].image})`;
                        itemSlot.style.transform = 'scaleX(-1)';
                        itemSlot.style.opacity = '1';
                        itemSlot.onclick = () => {
                            viewItem({
                                ...equipment[i].left,
                                'slot': i,
                                'side': 'left'
                            });
                        };  
                    };
                    /// Right equipped item
                    if (equipment[i].right.name !== '') {
                        itemSlot = document.getElementById(`equipment-slot-${i}-right`);
                        itemSlot.style.backgroundImage = `url(${items[equipment[i].right.rarity][equipment[i].right.name].image})`;
                        itemSlot.style.transform = 'scaleX(1)';
                        itemSlot.style.opacity = '1';
                        itemSlot.onclick = () => {
                            viewItem({
                                ...equipment[i].right,
                                'slot': i,
                                'side': 'right'
                            });
                        };         
                    };
                };
            };
        };
        updateAbilities();
        return () => {
            window.removeEventListener('equip item', updateEquipment);
        };
    }, []);
    useEffect(() => {
        updateAbilities();
    }, [abilities]);
    const viewItem = (item) => {
        defaultProps.playAudio(audioItemOpen);
        document.getElementById('equipment-popout-view-item').style.visibility = 'visible';
        setState((prevState) => ({
            ...prevState,
            item: item
        }));
    };
    const unequipItem = (event) => {
        event.stopPropagation();
        defaultProps.playAudio(audioItemUnequip);
        let itemSlot;
        let newEquipment;
        if (state.item.side) {
            itemSlot = document.getElementById(`equipment-slot-${state.item.slot}-${state.item.side}`);
            newEquipment = {
                ...equipment,
                [state.item.slot]: {
                    ...equipment[state.item.slot],
                    [state.item.side]: {
                        name: '',
                        rarity: ''
                    }
                }
            };
            window.dispatchEvent(new CustomEvent('unequip item', {
                'detail': {
                    'slot': state.item.slot,
                    'side': state.item.side
                }
            }));
        } else {
            itemSlot = document.getElementById(`equipment-slot-${state.item.slot}`);
            newEquipment = {
                ...equipment,
                [state.item.slot]: {
                    name: '',
                    rarity: ''
                }
            };
            window.dispatchEvent(new CustomEvent('unequip item', {
                'detail': {
                    'slot': state.item.slot
                }
            }));
        };
        if (/consumable/.test(state.item.slot)) {
            itemSlot.style.backgroundImage = `url(/resources/inventory/consumable.webp)`;
        } else {
            itemSlot.style.backgroundImage = `url(/resources/inventory/${state.item.slot}.webp)`;
        };
        itemSlot.style.opacity = '0.5';
        itemSlot.onclick = null;
        updateGameValue('equipment', newEquipment);
        removeStats(state.item);
        document.getElementById('equipment-popout-view-item').style.visibility = 'hidden';
    };
    const updateEquipment = (event) => {
        const itemData = {
            'name': event.detail.name,
            'rarity': event.detail.rarity
        };
        let itemSlot;
        if (event.detail.side) {
            if (equipment[event.detail.slot][event.detail.side].name !== event.detail.name
                && equipment[event.detail.slot][event.detail.side].name === '') {
                itemSlot = document.getElementById(`equipment-slot-${event.detail.slot}-${event.detail.side}`);
                itemSlot.style.backgroundImage = `url(${items[itemData.rarity][itemData.name].image})`;
                if (event.detail.side === 'left') {
                    itemSlot.style.transform = 'scaleX(-1)';
                } else {
                    itemSlot.style.transform = 'scaleX(1)';
                };
                itemSlot.style.opacity = '1';
                itemSlot.onclick = () => {
                    viewItem({
                        ...itemData,
                        'slot': event.detail.slot,
                        'side': event.detail.side
                    });
                };
            };
        } else {
            if (equipment[event.detail.slot].name !== event.detail.name
                && equipment[event.detail.slot].name === '') {
                itemSlot = document.getElementById(`equipment-slot-${event.detail.slot}`);
                itemSlot.style.backgroundImage = `url(${items[itemData.rarity][itemData.name].image})`;
                itemSlot.style.opacity = '1';
                itemSlot.onclick = () => {
                    viewItem({
                        ...itemData,
                        'slot': event.detail.slot
                    });
                };
            };
        };
    };
    const removeStats = (itemData) => {
        let item = items[itemData.rarity][itemData.name];
        let newAbilities;
        if (item.type === 'ability' || item.type === 'both') {
            let indexRemove = abilities.indexOf(item.information);
            if (indexRemove === 0) {
                newAbilities = [...abilities.slice(1)];
            } else {
                newAbilities = [...abilities.slice(0, indexRemove), ...abilities.slice(indexRemove + 1)];
            };
            updateGameValue('abilities', newAbilities);
        };
        if (item.type === 'stat' || item.type === 'both') {
            let itemStats = Object.keys(item.stats);
            let newStats = {};
            for (let i in itemStats) {
                newStats[itemStats[i]] = stats[itemStats[i]] - item.stats[itemStats[i]];
            };
            updateGameValue('stats', newStats);
        };
    };
    const updateAbilities = () => {
        let elementAbilities = document.getElementById('equipment-abilities');
        if (abilities.length === 0) {
            elementAbilities.innerHTML = `
                <tr>
                    <td>Nothing here...</td>
                </tr>
            `;
        } else {
            let abilityCounts = {};
            elementAbilities.innerHTML = '';
            abilities.forEach((value) => {
                abilityCounts[value] = (abilityCounts[value] || 0) + 1;
            });
            let abilityKeys = Object.keys(abilityCounts);
            for (let i in abilityKeys) {
                let abilityRow = document.createElement('tr');
                let ability = document.createElement('td');
                ability.innerText = `${abilityKeys[i].replace(/\S(?!\S)/, (char) => (char === 's') ? '' : char)} ${(abilityCounts[abilityKeys[i]] === 1) ? '' : `x${abilityCounts[abilityKeys[i]]}`}`;
                abilityRow.appendChild(ability);
                elementAbilities.appendChild(abilityRow);
            };
        };
    };
    return (
        <Draggable position={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('equipment')}
            onStop={(event, data) => {
                defaultProps.dragStop('equipment');
                defaultProps.updatePosition('equipment', 'utility', data.x, data.y);
            }}
            cancel='table, button, span, #equipment-popout-view-item'
            bounds='parent'>
            <div id='equipment-widget'
                className='widget'>
                <div id='equipment-widget-animation'
                    className='widget-animation'>
                    {/* Drag Handle */}
                    <span id='equipment-widget-draggable'
                        className='draggable'>
                        <IconContext.Provider value={{ size: defaultProps.largeIcon, className: 'global-class-name' }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    {defaultProps.renderHotbar('equipment', 'utility')}
                    {/* Equipment Container */}
                    <SimpleBar style={{ maxHeight: '36em' }}>
                    <section className='flex-center column gap medium-gap'>
                        {/* Slots and Stats */}
                        <section className='flex-center row gap medium-gap'>
                            {/* Slots */}
                            <section className='flex-center column gap medium-gap'>
                                {/* Level */}
                                <div className='aesthetic-scale scale-span flex-center column'>
                                    <span className='font medium bold'>Level {stats.level}</span>
                                    <span className='font micro transparent-normal'>EXP: {stats.exp} / {gameProps.formatNumber(stats.maxExp, 2)}</span>
                                </div>
                                {/* Armor Slots */}
                                <div id='equipment-slots-armor'
                                    className='aesthetic-scale scale-button slot flex-center column gap'>
                                    {/* Helmet Container */}
                                    <div className='flex-center row gap'>
                                        {/* Headband */}
                                        <button id='equipment-slot-headband'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/headband.webp)`
                                            }}></button>
                                        {/* Helmet */}
                                        <button id='equipment-slot-helmet'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/helmet.webp)`
                                            }}></button>
                                        {/* Eyewear */}
                                        <button id='equipment-slot-eyewear'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/eyewear.webp)`,
                                                backgroundSize: '25px'
                                            }}></button>
                                    </div>
                                    {/* Necklace Container */}
                                    <div className='flex-center row gap'>
                                        {/* Necklace */}
                                        <button id='equipment-slot-necklace'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/necklace.webp)`,
                                                backgroundSize: '25px'
                                            }}></button>
                                    </div>
                                    {/* Chestplate Container */}
                                    <div className='flex-center row gap'>
                                        {/* Undershirt */}
                                        <button id='equipment-slot-undershirt'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/undershirt.webp)`
                                            }}></button>
                                        {/* Chestplate */}
                                        <button id='equipment-slot-chestplate'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/chestplate.webp)`
                                            }}></button>
                                        {/* Cape */}
                                        <button id='equipment-slot-cape'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/cape.webp)`
                                            }}></button>
                                    </div>
                                    {/* Belt Container */}
                                    <div className='flex-center row gap'>
                                        {/* Right Bracelet */}
                                        <button id='equipment-slot-bracelet-right'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/bracelet.webp)`,
                                                backgroundSize: '25px',
                                                transform: 'scaleX(-1)'
                                            }}></button>
                                        {/* Right Wrist */}
                                        <button id='equipment-slot-wrist-right'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/wrist.webp)`,
                                                backgroundSize: '20px'
                                            }}></button>
                                        {/* Belt */}
                                        <button id='equipment-slot-belt'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/belt.webp)`
                                            }}></button>
                                        {/* Left Wrist */}
                                        <button id='equipment-slot-wrist-left'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/wrist.webp)`,
                                                backgroundSize: '20px'
                                            }}></button>
                                        {/* Left Bracelet */}
                                        <button id='equipment-slot-bracelet-left'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/bracelet.webp)`,
                                                backgroundSize: '25px'
                                            }}></button>
                                    </div>
                                    {/* Legging Container */}
                                    <div className='flex-center row gap'>
                                        {/* Main Item */}
                                        <button id='equipment-slot-main'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/main.webp)`
                                            }}></button>
                                        {/* Right Glove */}
                                        <button id='equipment-slot-glove-right'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/glove.webp)`,
                                                backgroundSize: '22px'
                                            }}></button>
                                        {/* Right Ring */}
                                        <button id='equipment-slot-ring-right'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/ring.webp)`,
                                                backgroundSize: '20px',
                                                transform: 'scaleX(-1)'
                                            }}></button>
                                        {/* Legging */}
                                        <button id='equipment-slot-legging'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/legging.webp)`
                                            }}></button>
                                        {/* Left Ring */}
                                        <button id='equipment-slot-ring-left'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/ring.webp)`,
                                                backgroundSize: '20px'
                                            }}></button>
                                        {/* Left Glove */}
                                        <button id='equipment-slot-glove-left'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/glove.webp)`,
                                                backgroundSize: '22px',
                                                transform: 'scaleX(-1)'
                                            }}></button>
                                        {/* Offhand Item */}
                                        <button id='equipment-slot-offhand'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/offhand.webp)`,
                                                backgroundSize: '40px'
                                            }}></button>
                                    </div>
                                    {/* Boot Container */}
                                    <div className='flex-center row gap'>
                                        {/* Right Hidden Item in Boot */}
                                        <button id='equipment-slot-hidden-right'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/hidden.webp)`
                                            }}></button>
                                        {/* Right Boot */}
                                        <button id='equipment-slot-boot-right'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/boot.webp)`,
                                                backgroundSize: '40px'
                                            }}></button>
                                        {/* Left Boot */}
                                        <button id='equipment-slot-boot-left'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/boot.webp)`,
                                                backgroundSize: '40px',
                                                transform: 'scaleX(-1)'
                                            }}></button>
                                        {/* Left Hidden Item in Boot */}
                                        <button id='equipment-slot-hidden-left'
                                            style={{
                                                backgroundImage: `url(/resources/inventory/hidden.webp)`
                                            }}></button>
                                    </div>
                                </div>
                                {/* Consumable Slots */}
                                <div id='equipment-slots-consumable' 
                                    className='slot flex-center row gap'>
                                    <button id='equipment-slot-consumable1'
                                        style={{
                                            backgroundImage: `url(/resources/inventory/consumable.webp)`
                                        }}></button>
                                    <button id='equipment-slot-consumable2'
                                        style={{
                                            backgroundImage: `url(/resources/inventory/consumable.webp)`
                                        }}></button>
                                    <button id='equipment-slot-consumable3'
                                        style={{
                                            backgroundImage: `url(/resources/inventory/consumable.webp)`
                                        }}></button>
                                    <button id='equipment-slot-consumable4'
                                        style={{
                                            backgroundImage: `url(/resources/inventory/consumable.webp)`
                                        }}></button>
                                    <button id='equipment-slot-consumable5'
                                        style={{
                                            backgroundImage: `url(/resources/inventory/consumable.webp)`
                                        }}></button>
                                    <button id='equipment-slot-consumable6'
                                        style={{
                                            backgroundImage: `url(/resources/inventory/consumable.webp)`
                                        }}></button>
                                </div>
                            </section>
                            {/* Stats */}
                            <table id='equipment-table-stats' 
                                className='aesthetic-scale scale-table table font'
                                style={{ width: 'unset' }}>
                                <thead>
                                    <tr>
                                        <th scope='col'>Stat</th>
                                        <th scope='col'>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Health:</td>
                                        <td>{stats.health}</td>
                                    </tr>
                                    <tr>
                                        <td>Mana:</td>
                                        <td>{stats.mana}</td>
                                    </tr>
                                    <tr>
                                        <td>Attack:</td>
                                        <td>{stats.attack}</td>
                                    </tr>
                                    <tr>
                                        <td>Defense:</td>
                                        <td>{stats.defense}</td>
                                    </tr>
                                    <tr>
                                        <td>Strength:</td>
                                        <td>{stats.strength}</td>
                                    </tr>
                                    <tr>
                                        <td>Agility:</td>
                                        <td>{stats.agility}</td>
                                    </tr>
                                    <tr>
                                        <td>Vitality:</td>
                                        <td>{stats.vitality}</td>
                                    </tr>
                                    <tr>
                                        <td>Resilience:</td>
                                        <td>{stats.resilience}</td>
                                    </tr>
                                    <tr>
                                        <td>Intelligence:</td>
                                        <td>{stats.intelligence}</td>
                                    </tr>
                                    <tr>
                                        <td>Dexterity:</td>
                                        <td>{stats.dexterity}</td>
                                    </tr>
                                    <tr>
                                        <td>Luck:</td>
                                        <td>{stats.luck}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                        {/* Abilities */}
                        <SimpleBar className='fill-width font'
                            style={{
                                maxHeight: '14.7em'
                            }}>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Abilities</th>
                                    </tr>
                                </thead>
                                <tbody id='equipment-abilities'></tbody>
                            </table>
                        </SimpleBar>
                    </section>
                    </SimpleBar>
                    {/* View Item Popout */}
                    <section id='equipment-popout-view-item'
                        className='flex-center column gap font no-highlight'
                        onClick={() => {
                            defaultProps.playAudio(audioItemClose);
                            document.getElementById('equipment-popout-view-item').style.visibility = 'hidden';
                        }}>
                        <span className='font bold large-medium'>{state.item.name}</span>
                        <div className='flex-center row gap medium-gap space-nicely space-all'>
                            <img src={items[state.item.rarity][state.item.name].image}
                                alt='viewed inventory item'
                                loading='lazy'
                                decoding='async'/>
                            <SimpleBar style={{
                                maxHeight: 160,
                                width: 150
                            }}>
                                <table className='flex-center column font small'>
                                    <tbody>
                                        <tr>
                                            <td scope='row'>Rarity:</td>
                                            <td>{state.item.rarity.replace(/^./, (char) => char.toUpperCase())}</td>
                                        </tr>
                                        <tr>
                                            <td scope='row'>Slot:</td>
                                            <td>{state.item.slot
                                                .replace(/^./, (char) => char.toUpperCase())
                                                .replace(/[0-9]/, '')}</td>
                                        </tr>
                                        {(/stat|both/.test(items[state.item.rarity][state.item.name].type))
                                            ? Object.keys(items[state.item.rarity][state.item.name].stats)
                                                .map((value, index) => {
                                                    return <tr key={`row-stat-${index}`}>
                                                        <td scope='row'>{value.replace(/^./, (char) => char.toUpperCase())}:</td>
                                                        <td>
                                                            {(Math.sign(items[state.item.rarity][state.item.name].stats[value]) === -1)
                                                                ? ''
                                                                : '+'}
                                                            {items[state.item.rarity][state.item.name].stats[value]}
                                                        </td>
                                                    </tr>
                                                })
                                            : <></>}
                                        {(/ability|both/.test(items[state.item.rarity][state.item.name].type))
                                            ? <tr>
                                                <td colSpan={2}>{items[state.item.rarity][state.item.name].information}</td>
                                            </tr>
                                            : <></>}
                                    </tbody>
                                </table>
                            </SimpleBar>
                        </div>
                        <span dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(items[state.item.rarity][state.item.name].description)
                        }}></span>
                        {(items[state.item.rarity][state.item.name].requirement)
                            ? <span className='font micro'
                                style={{
                                    color: 'red',
                                    opacity: '0.5'
                                }}>Requirement: {items[state.item.rarity][state.item.name].requirement}</span>
                            : <></>}
                        <span className='font micro transparent-normal'>Source: {items[state.item.rarity][state.item.name].source}</span>
                        <button className='button-match space-nicely space-top not-bottom'
                            onClick={(event) => unequipItem(event)}>Unequip</button>
                    </section>
                    {/* Author */}
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </div>
        </Draggable>
    );
};

export default memo(WidgetEquipment);