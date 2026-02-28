import DOMPurify from 'dompurify';
import React, { memo, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal } from 'react-icons/fa';
import { classStack, dataLoaded, decorationValue, getData } from '../data';

//#region Equipment Guide
/* Stats Guide
[Main Stats]   =>       [Side Stats]
   Health      =>         Vitality
    Mana       =>       Intelligence
   Attack      =>   Strength + Dexterity
   Defense     =>        Resilience
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
const allStats = ['health', 'mana', 'attack', 'defense', 'strength', 'agility', 'vitality', 'resilience', 'intelligence', 'dexterity', 'luck'];
let slotsMapping = {};
let items = {};

const WidgetEquipment = ({ defaultProps, gameProps, parentRef }) => {
    const [state, setState] = useState({
        item: { name: 'Creampuff', rarity: 'rare', slot: 'hidden' },
        abilities: []
    });
    const [equipmentSlots, setEquipmentSlots] = useState({
        armour: {
            head: {
                headband: '',
                helmet: '',
                eyewear: '',
            },
            neck: {
                necklace: '',
            },
            body: {
                undershirt: '',
                chestplate: '',
                cape: '',
            },
            waist: {
                braceletRight: '',
                wristRight: '',
                belt: '',
                wristLeft: '',
                braceletLeft: '',
            },
            leg: {
                main: '',
                gloveRight: '',
                ringRight: '',
                legging: '',
                ringLeft: '',
                gloveLeft: '',
                offhand: '',
            },
            feet: {
                hiddenRight: '',
                bootRight: '',
                bootLeft: '',
                hiddenLeft: '',
            },
        },
        consumable: {
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
        },
    });

    const { updateGameValue, useStatPoint } = parentRef;
    const { abilities, equipment, stats, statPoints } = parentRef.state;

    useEffect(() => {
        audioItemOpen.volume = 0.5;
        audioItemClose.volume = 0.5;

        window.addEventListener('equip item', updateEquipment);

        Object.keys(equipmentSlots.armour).forEach((slot) => {
            Object.keys(equipmentSlots.armour[slot]).forEach((subSlot) => {
                const cleaned = subSlot.replace(/(Left|Right)/, '');

                if (!slotsMapping[cleaned]) {
                    slotsMapping[cleaned] = slot;
                };
            });
        });

        dataLoaded.then(() => {
            items = getData('items');

            /// Fill equipment slots with image of equipped item
            const newEquipmentSlots = { ...equipmentSlots };
            for (let i in equipment) {
                if (equipment[i].name !== '') {
                    /// Equipped items with no left and right
                    if (equipment[i].name !== undefined) {
                        const isConsumable = /consumable/.test(i);

                        if (isConsumable) {
                            newEquipmentSlots.consumable[i.slice(-1)] = items?.[equipment[i].rarity][equipment[i].name].image;
                        } else {
                            newEquipmentSlots.armour[slotsMapping[i]][i] = items?.[equipment[i].rarity][equipment[i].name].image;
                        };
                    } else {
                        if (equipment[i].left.name !== '') {
                            newEquipmentSlots.armour[slotsMapping[i]][`${i}Left`] = items?.[equipment[i].left.rarity][equipment[i].left.name].image;
                        };

                        if (equipment[i].right.name !== '') {
                            newEquipmentSlots.armour[slotsMapping[i]][`${i}Right`] = items?.[equipment[i].right.rarity][equipment[i].right.name].image;
                        };
                    };
                };
            };

            setEquipmentSlots(newEquipmentSlots);
            updateAbilities();
        });

        defaultProps.incrementWidgetCounter();

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

        const newEquipmentSlots = { ...equipmentSlots };
        let newEquipment;

        if (/consumable/.test(state.item.slot)) {
            const formattedName = state.item.name.replace(' ', '').toLowerCase();
            const consumableValues = Object.values(newEquipmentSlots.consumable);
            const indexOfItem = consumableValues.indexOf(`/resources/items/${formattedName}.webp`);

            newEquipmentSlots.consumable[indexOfItem + 1] = '';
            newEquipment = {
                ...equipment,
                [`${state.item.slot}${indexOfItem + 1}`]: {
                    name: '',
                    rarity: ''
                }
            };

            window.dispatchEvent(new CustomEvent('unequip item', {
                'detail': {
                    'slot': `${state.item.slot}${indexOfItem + 1}`
                }
            }));
        } else if (state.item.side) {
            const removedRightLeft = state.item.slot.replace(/Right|Left/, '');

            newEquipmentSlots.armour[slotsMapping[removedRightLeft]][state.item.slot] = '';
            newEquipment = {
                ...equipment,
                [removedRightLeft]: {
                    ...equipment[removedRightLeft],
                    [state.item.side]: {
                        name: '',
                        rarity: ''
                    }
                }
            };

            window.dispatchEvent(new CustomEvent('unequip item', {
                'detail': {
                    'slot': removedRightLeft,
                    'side': state.item.side
                }
            }));
        } else {
            newEquipmentSlots.armour[slotsMapping[state.item.slot]][state.item.slot] = '';
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

        setEquipmentSlots(newEquipmentSlots);
        updateGameValue('equipment', newEquipment);
        removeStats(state.item);

        document.getElementById('equipment-popout-view-item').style.visibility = 'hidden';
    };

    const updateEquipment = (event) => {
        const itemData = {
            name: event.detail.name,
            rarity: event.detail.rarity
        };
        const newEquipmentSlots = { ...equipmentSlots };

        if (/consumable/.test(event.detail.slot)) {
            newEquipmentSlots.consumable[event.detail.slot.slice(-1)] = items?.[itemData.rarity][itemData.name].image;
        } else if (event.detail.side) {
            const formattedItemSlot = `${event.detail.slot}${event.detail.side.replace(/^./, (char) => char.toUpperCase())}`;
            newEquipmentSlots.armour[slotsMapping[event.detail.slot]][formattedItemSlot] = items?.[itemData.rarity][itemData.name].image;
        } else {
            newEquipmentSlots.armour[slotsMapping[event.detail.slot]][event.detail.slot] = items?.[itemData.rarity][itemData.name].image;
        };

        setEquipmentSlots(newEquipmentSlots);
    };

    const removeStats = (itemData) => {
        let item = items?.[itemData.rarity][itemData.name];
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
                let currentStat = item.stats[itemStats[i]];

                newStats[itemStats[i]] = [
                    stats[itemStats[i]][0],
                    stats[itemStats[i]][1] - currentStat
                ];
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

    const handleUseStatPoint = (stat, amount = 1) => {
        useStatPoint(stat, amount);
    };
    
    return (
        <Draggable defaultPosition={{ x: defaultProps.position.x, y: defaultProps.position.y }}
            disabled={defaultProps.dragDisabled}
            onStart={() => defaultProps.dragStart('equipment')}
            onStop={(event, data) => {
                defaultProps.dragStop('equipment');
                defaultProps.updatePosition('equipment', 'utility', data.x, data.y);
            }}
            cancel='table, button, span, #equipment-popout-view-item'
            bounds='parent'>
            <section id='equipment-widget'
                className='widget'
                aria-labelledby='equipment-widget-heading'>
                <h2 id='equipment-widget-heading'
                    className='screen-reader-only'>Equipment Widget</h2>
                <div id='equipment-widget-animation'
                    className={`widget-animation ${classStack}`}>
                    <span id='equipment-widget-draggable'
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
                    {defaultProps.renderHotbar('equipment', 'utility')}
                    {/* Equipment Container */}
                    <div className='scrollable'
                        style={{ maxHeight: '36em' }}
                        role='region'
                        aria-label='Equipment panel'>
                        <div className='flex-center column gap medium-gap'>
                            {/* Slots and Stats */}
                            <div id='equipment-slot-and-stat'
                                className='flex-center row gap medium-gap'>
                                {/* Slots */}
                                <div className='flex-center column gap medium-gap'>
                                    {/* Level */}
                                    <div className='aesthetic-scale scale-span flex-center column'>
                                        <span className='font medium bold'>Level {stats.level}</span>
                                        <span className='font micro transparent-normal'>EXP: {stats.exp} / {gameProps.formatNumber(stats.maxExp, 2)}</span>
                                    </div>
                                    {/* Armor Slots */}
                                    <div id='equipment-slots-armor'
                                        className='aesthetic-scale scale-button slot flex-center column gap'>
                                        {Object.keys(equipmentSlots.armour).map((type) => {
                                            return <div className='flex-center row gap'
                                                key={`${type} container`}>
                                                {Object.keys(equipmentSlots.armour[type]).map((subtype) => {
                                                    const formattedSubtype = subtype.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                                                    const removedRightLeft = formattedSubtype.replace(/-(right|left)/, '');

                                                    const currentSlot = equipmentSlots.armour[type][subtype];
                                                    const isSlotEmpty = currentSlot === '';
                                                    const subtypeImage = isSlotEmpty
                                                        ? `/resources/inventory/${removedRightLeft}.webp`
                                                        : currentSlot;

                                                    const isLeft = /left/.test(formattedSubtype);
                                                    const isRight = /right/.test(formattedSubtype);

                                                    let subtypeStyle = {};

                                                    switch (formattedSubtype) {
                                                        case 'wrist-right'    :
                                                        case 'wrist-left'     :
                                                        case 'ring-left'      : subtypeStyle = { backgroundSize: '20px' }; break;
                                                        case 'glove-right'    : subtypeStyle = { backgroundSize: '22px' }; break;
                                                        case 'eyewear'        :
                                                        case 'necklace'       :
                                                        case 'bracelet-left'  : subtypeStyle = { backgroundSize: '25px' }; break;
                                                        case 'offhand'        :
                                                        case 'boot-right'     : subtypeStyle = { backgroundSize: '40px' }; break;
                                                        case 'ring-right'     : subtypeStyle = { backgroundSize: '20px' }; break;
                                                        case 'glove-left'     : subtypeStyle = { backgroundSize: '22px' }; break;
                                                        case 'bracelet-right' : subtypeStyle = { backgroundSize: '25px' }; break;
                                                        case 'boot-left'      : subtypeStyle = { backgroundSize: '40px' }; break;
                                                        default: break;
                                                    };

                                                    return <button id={`equipment-slot-${formattedSubtype}`}
                                                        key={`${subtype} container`}
                                                        aria-label={`Slot ${formattedSubtype}`}
                                                        style={{
                                                            ...subtypeStyle,
                                                            ...(isLeft ? { transform: 'scaleX(-1)' } : {}),
                                                            backgroundImage: `url(${subtypeImage})`,
                                                            opacity: isSlotEmpty ? 0.5 : 1
                                                        }}
                                                        onClick={() => {
                                                            if (isSlotEmpty) return;

                                                            const equipmentSide = isLeft ? 'left'
                                                                : isRight ? 'right'
                                                                : undefined;
                                                            viewItem({
                                                                ...equipment[removedRightLeft][equipmentSide] || equipment[subtype],
                                                                ...(equipmentSide && { side: equipmentSide }),
                                                                slot: subtype
                                                            });
                                                        }}></button>
                                                })}
                                            </div>
                                        })}
                                    </div>
                                    {/* Consumable Slots */}
                                    <div id='equipment-slots-consumable' 
                                        className='slot flex-center row gap'>
                                        {Object.keys(equipmentSlots.consumable).map((consume) => {
                                            const currentSlot = equipmentSlots.consumable[consume];
                                            const isSlotEmpty = currentSlot === '';
                                            const consumableImage = (currentSlot === '')
                                                ? '/resources/inventory/consumable.webp'
                                                : currentSlot;

                                            return <button id={`equipment-slot-consumable${consume}`}
                                                key={`consumable ${consume}`}
                                                aria-label={`Slot consumable ${consume}`}
                                                style={{
                                                    backgroundImage: `url(${consumableImage})`,
                                                    opacity: isSlotEmpty ? 0.5 : 1
                                                }}
                                                onClick={() => {
                                                    if (isSlotEmpty) return;

                                                    viewItem({
                                                        ...equipment[`consumable${consume}`],
                                                        slot: 'consumable'
                                                    });
                                                }}></button>
                                        })}
                                    </div>
                                </div>
                                {/* Stats */}
                                <table id='equipment-table-stats'
                                    aria-label='Stats'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Stat</th>
                                            <th scope='col'>Value</th>
                                            {(statPoints > 0)
                                                && <th className='table-no-style'
                                                    style={{ paddingLeft: '0.35rem' }}
                                                    scope='col'>{statPoints} SP</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allStats.map((stat) => {
                                            return <tr key={stat}>
                                                <td>{stat.replace(/^./, (char) => char.toUpperCase())}:</td>
                                                <td>{stats[stat][0] + stats[stat][1]} {(stats[stat][1] !== 0) && `+${stats[stat][1]}`}</td>
                                                {(statPoints > 0)
                                                    && <td className='table-no-style leave-me-alone'>
                                                        <button className='button-match inverse'
                                                            onClick={() => handleUseStatPoint(stat)}>+</button>
                                                    </td>
                                                }
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* Abilities */}
                            <div className='scrollable fill-width font'
                                style={{ maxHeight: '14.3em' }}>
                                <table className='table'
                                    aria-label='Abilities'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Abilities</th>
                                        </tr>
                                    </thead>
                                    <tbody id='equipment-abilities'></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* View Item Popout */}
                    <div id='equipment-popout-view-item'
                        onClick={() => {
                            defaultProps.playAudio(audioItemClose);
                            document.getElementById('equipment-popout-view-item').style.visibility = 'hidden';
                        }}>
                        <span className='item-name'>{state.item.name}</span>
                        <div className='flex-center row gap medium-gap'>
                            <img src={items?.[state.item.rarity]?.[state.item.name].image}
                                alt='viewed inventory item'
                                loading='lazy'
                                decoding='async'/>
                            <div className='flex-center column align-items-left'>
                                <span className={`item-rarity item-${state.item.rarity}`}>{state.item.rarity.replace(/^./, (char) => char.toUpperCase())}</span>
                                <span>{state.item.slot
                                    .replace(/^./, (char) => char.toUpperCase())
                                    .replace(/[0-9]/, '')}</span>
                                <div className='scrollable'
                                    style={{ height: '5rem' }}>
                                    {(/stat|both/.test(items?.[state.item.rarity]?.[state.item.name].type))
                                        ? Object.keys(items?.[state.item.rarity]?.[state.item.name].stats)
                                            .map((value, index) => {
                                                return <div key={`row-stat-${index}`}>
                                                    <span className={value}>
                                                        {(Math.sign(items?.[state.item.rarity]?.[state.item.name].stats[value]) === -1)
                                                            ? ''
                                                            : '+'}
                                                        {items?.[state.item.rarity]?.[state.item.name].stats[value]}
                                                    </span>
                                                    <span className={value}> {value.replace(/^./, (char) => char.toUpperCase())}</span>
                                                </div>
                                            })
                                        : <></>}
                                    {(/ability|both/.test(items?.[state.item.rarity]?.[state.item.name].type))
                                        ? <span>{items?.[state.item.rarity]?.[state.item.name].information}</span>
                                        : <></>}
                                </div>
                            </div>
                        </div>
                        <span dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(items?.[state.item.rarity]?.[state.item.name].description)
                        }}></span>
                        {(items?.[state.item.rarity]?.[state.item.name].requirement)
                            ? <span className='font micro'
                                style={{
                                    color: 'red',
                                    opacity: '0.5'
                                }}>Requirement: {items?.[state.item.rarity]?.[state.item.name].requirement}</span>
                            : <></>}
                        <span className='font micro transparent-normal'>Source: {items?.[state.item.rarity]?.[state.item.name].source}</span>
                        <button className='button-match space-nicely space-top not-bottom fill-width'
                            onClick={(event) => unequipItem(event)}>Unequip</button>
                    </div>
                    {(defaultProps.values.authorNames)
                        ? <span className='font smaller transparent-normal author-name'>Created by Me</span>
                        : <></>}
                </div>
            </section>
        </Draggable>
    );
};

export default memo(WidgetEquipment);