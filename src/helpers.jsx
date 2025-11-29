import DOMPurify from 'dompurify';
import React, { Suspense, useEffect, useRef } from 'react';
import { components } from 'react-select';
import SimpleBar from 'simplebar-react';
import { healthDisplay, lootDisplay } from '.';
import { fetchedData, heartValues, itemRates, zIndexDefault, zIndexDrag } from './data';

export async function copyToClipboard(what) {
    if (what !== '') {
        try {
            let dump = document.getElementById('clipboard-dump');
            dump.innerHTML = DOMPurify.sanitize(what);

            await navigator.clipboard.writeText(dump.innerText);

            createPopup('Copied!');

            dump.innerHTML = '';

            return 'success';
        } catch (err) {
            return 'fail';
        };
    };

    return 'empty';
};

export const
    dragStart = (what) => {
        switch (what) {
            case 'settings':
                document.getElementById(what + '-widget-draggable').style.visibility = 'visible';
                document.getElementById(what + '-widget').style.opacity = '0.5';
                break;
            default:
                document.getElementById(what + '-widget-draggable').style.visibility = 'visible';
                document.getElementById(what + '-widget').style.opacity = '0.5';
                document.getElementById(what + '-widget').style.zIndex = zIndexDrag;
                break;
        };
    },
    dragStop = (what) => {
        switch (what) {
            case 'settings':
                document.getElementById(what + '-widget-draggable').style.visibility = 'hidden';
                document.getElementById(what + '-widget').style.opacity = '1';
                break;
            default:
                document.getElementById(what + '-widget-draggable').style.visibility = 'hidden';
                document.getElementById(what + '-widget').style.opacity = '1';
                document.getElementById(what + '-widget').style.zIndex = zIndexDefault;
                break;
        };
    },

    sortSelect = (what) => {
        what.forEach((value) => {
            value.options.sort((a, b) => {
                return ['Default', 'Auto', 'Any'].indexOf(b.label) - ['Default', 'Auto', 'Any'].indexOf(a.label)
                    || a.label.localeCompare(b.label);
            });
        });
    },

    mergePunctuation = (arr) => {
        if (arr.length <= 1) {
            return arr;
        };

        for (let i = 1; i < arr.length; i++) {
            if (/^[^\w('$]+/.test(arr[i])) {
                arr[i-1] += arr[i];
                arr.splice(i, 1);
            } else if (/^[($]+/.test(arr[i])) {
                arr[i] += arr[i+1];
                arr.splice(i+1, 1);
            };
        };

        return arr;
    },

    grep = (arr, filter) => {
        let result = [];

        if (arr.length <= 1) {
            return arr;
        };

        for (let i = 0; i < arr.length; i++) {
            const e = arr[i]||'';

            if (filter ? filter(e) : e) {
                result.push(e);
            };
        };

        return result;
    },

    randSentence = () => {
        return fetchedData.sentences[Math.floor(Math.random() * fetchedData.sentences.length)];
    },

    createPopup = (text, type = 'normal', randomPosition = false) => {
        let widgetContainer = document.getElementById('widget-container');

        let popup = document.createElement('div');
        popup.className = 'popup flex-center';

        let elementText = document.createElement('span');
        elementText.className = 'font medium bold white flex-center column';
    
        switch (type) {
            case 'gold': {
                let elementAmount = document.createElement('span');
                
                popup.className += ' gold';

                elementAmount.innerHTML = `&#x1F4B0;+${text}`;
                elementText.innerText = 'Gold bag found!';
                
                elementText.appendChild(elementAmount);
                break;
            };
            case 'item': {
                switch (lootDisplay.value) {
                    case 'destiny2':
                    case 'rotmg': {
                        popup = document.createElement('img');
                        popup.className = `popup-image flex-center ${text.rarity}`;
                        popup.src = `/resources/loot/${lootDisplay.value}/${lootDisplay.value}-${text.rarity}.webp`;
                        popup.alt = `${lootDisplay.value} ${text.rarity}`;
                        popup.loading = 'lazy';
                        popup.encoding = 'aync';
                        break;
                    };
                    default: {
                        let itemImage = document.createElement('img');
                        
                        popup.className += ` ${text.rarity}`;
                        itemImage.src = fetchedData.items[text.rarity][text.name].image;
                        itemImage.alt = text.name;
                        itemImage.loading = 'lazy';
                        itemImage.encoding = 'async';

                        elementText.innerText = 'Item acquired!';
                        elementText.appendChild(itemImage);        
                        break;
                    };
                };
                break;
            };
            default: {
                elementText.innerText = text;
                break;
            };
        };

        if (randomPosition) {
            popup.style.left = `${Math.random() * (document.body.clientWidth - 100) + 100}px`;
            popup.style.top = `${Math.random() * (document.body.clientHeight - 100) + 100}px`;
        } else {
            popup.style.left = `${window.mouse.x - 50}px`;
            popup.style.top = `${window.mouse.y + 10}px`;
        };

        popup.appendChild(elementText);
        widgetContainer.append(popup);

        let timeoutAnimation, timeoutRemove;

        window.requestAnimationFrame(() => {
            popup.style.animation = 'fadeIn 1s';
        });

        timeoutAnimation = setTimeout(() => {
            window.requestAnimationFrame(() => {
                popup.style.animation = 'fadeOut 1s';
            });

            timeoutRemove = setTimeout(() => {
                widgetContainer.removeChild(popup);
                clearTimeout(timeoutAnimation);
                clearTimeout(timeoutRemove);
            }, 900);
        }, 1000);

        popup.onclick = () => {
            clearTimeout(timeoutAnimation);
            clearTimeout(timeoutRemove);

            widgetContainer.removeChild(popup);
        };
    },

    formatNumber = (number, digits, shouldRound = false) => {
        const lookup = [
            { value: 1,    symbol: ''  },
            { value: 1e3,  symbol: 'K' },
            { value: 1e6,  symbol: 'M' },
            { value: 1e9,  symbol: 'G' },
            { value: 1e12, symbol: 'T' },
            { value: 1e15, symbol: 'P' },
            { value: 1e18, symbol: 'E' }
        ];
        const regexDecimals = new RegExp(`^-?\\d+(?:\\.\\d{0,${digits}})?`);
        const regex = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
        const item = lookup.findLast(item => number >= item.value);
        
        if (shouldRound) {
            return (item)
                ? (number / item.value)
                    .toFixed(digits)
                    .replace(regex, '')
                    .concat(item.symbol)
                : '0';
        } else {
            return (item)
                ? (number / item.value)
                    .toString()
                    .match(regexDecimals)[0]
                    .replace(regex, '')
                    .concat(item.symbol)
                : '0';
        };
    },

    randomItem = (amount = 1, rarity) => {
        let item, itemKeys, itemRarity, randomItem, randomRarity;
        let totalGold = 0;
        let allItems = [];

        for (let i = 0; i < amount; i++) {
            randomRarity = Math.random();

            if (rarity) {
                itemKeys = Object.keys(fetchedData.items[rarity]);
                itemRarity = rarity;
            } else {
                if (randomRarity < itemRates.common.rate) {
                    itemKeys = Object.keys(fetchedData.items.common);
                    itemRarity = 'common';
                } else if (randomRarity < (itemRates.common.rate + itemRates.rare.rate)) {
                    itemKeys = Object.keys(fetchedData.items.rare);
                    itemRarity = 'rare';
                } else if (randomRarity < (itemRates.common.rate + itemRates.rare.rate + itemRates.exotic.rate)) {
                    itemKeys = Object.keys(fetchedData.items.exotic);
                    itemRarity = 'exotic';
                } else if (randomRarity < (itemRates.common.rate + itemRates.rare.rate + itemRates.exotic.rate + itemRates.meme.rate)) {
                    itemKeys = Object.keys(fetchedData.items.meme);
                    itemRarity = 'meme';
                };
            };

            randomItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            
            if (randomItem !== 'nothing') {
                item = {
                    name: randomItem,
                    rarity: itemRarity
                };

                if (randomItem === 'gold') {
                    item.amount = Math.floor(Math.random() * 20 + 1);
                    totalGold += item.amount;
                    createPopup(item.amount, 'gold', true);
                } else {
                    allItems.push(item);
                    createPopup(item, 'item', true);
                };
            };
        };

        if (totalGold !== 0) {
            window.dispatchEvent(new CustomEvent('gold bag', {
                'detail': totalGold
            }));
        };

        if (allItems.length !== 0) {
            window.dispatchEvent(new CustomEvent('new item', {
                'detail': allItems
            }));
        };
    },

    renderHearts = (health) => {
        let elementHearts = [];

        if (healthDisplay.value !== 'none') {
            let currentHealth = health;
            let calculateHearts = [];
            let heartKeys = Object.keys(heartValues);
            let heartIndex = heartKeys.length;
            let currentHeartValue = heartValues[heartKeys[heartIndex - 1]];
            let amount;

            calculating: while (Math.floor(currentHealth) > 0) {
                if (Math.max(currentHealth, currentHeartValue) === currentHealth) {
                    switch (healthDisplay.value) {
                        case 'limit5':
                            amount = Math.floor(currentHealth / currentHeartValue);
                            currentHealth -= (amount * currentHeartValue);
                            
                            if (calculateHearts.length === 5) {
                                break calculating;
                            };
                        
                            if (amount > 5 && calculateHearts.length === 0) {
                                amount = 5;
                            } else if (amount > 5) {
                                amount = 5 - calculateHearts.length;
                            };

                            for (let i = amount; i > 0; i--) {
                                calculateHearts.push(heartIndex);
                            };
                            break;
                        default:
                            amount = Math.floor(currentHealth / currentHeartValue);
                            currentHealth -= (amount * currentHeartValue);
                            
                            for (let i = amount; i > 0; i--) {
                                calculateHearts.push(heartIndex);
                            };
                            break;        
                    };
                };

                heartIndex--;
                currentHeartValue = heartValues[heartKeys[heartIndex - 1]];
            };

            for (let i = 0; i < calculateHearts.length; i++) {
                if ((calculateHearts[i] === 1) && (healthDisplay.value === 'noredheart')) break; 
                
                elementHearts.push(<img src={`/resources/hearts/heart${calculateHearts[i]}.webp`}
                    alt={`heart${calculateHearts[i]} ${i + 1}`}
                    key={`heart${calculateHearts[i]} ${i + 1}`}
                    draggable={false}
                    loading='lazy'
                    decoding='async'/>);
            };
        };

        return elementHearts;
    },

    hexToRgb = (hex) => {
        /// Input Format: #000000
        /// Return Format: [0, 0, 0]
        return hex.replace(
                /^#?([a-f\d])([a-f\d])([a-f\d])$/i
                , (m, r, g, b) => '#' + r + r + g + g + b + b
            ).substring(1)
            .match(/.{2}/g)
            .map(x => parseInt(x, 16));
    },
    rgbToHex = (rgb) => {
        /// Input Format: [0, 0, 0]
        /// Return Format: #00000
        if (rgb === undefined) return '#000000';

        return '#' + rgb.map((x) => {
            const hex = x.toString(16);
            return (hex.length === 1) ? '0' + hex : hex;
        }).join('');
    },

    calculateBounds = (parent, popout) => {
        let bounds = {};
        
        if (document.getElementById(parent) !== null) {
            let sizeParent = document.getElementById(parent).getBoundingClientRect();
            let sizePopout = document.getElementById(popout).getBoundingClientRect();
            
            bounds = {
                top: -sizePopout.height,
                right: (sizePopout.width < sizeParent.width)
                    ? sizeParent.width
                    : sizePopout.width - Math.abs(sizeParent.width - sizePopout.width),
                bottom: (sizePopout.height < sizeParent.height)
                    ? sizeParent.height
                    : sizePopout.height - Math.abs(sizeParent.height - sizePopout.height),
                left: -sizePopout.width
            };
        };
        
        return bounds;
    };

export const
    formatGroupLabel = (data) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'}}>
            <span className='aesthetic-scale scale-self font transparent-bold'>{data.label}</span>
            <span style={{
                backgroundColor: `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--randColorOpacity')}, 0.3)`,
                borderRadius: '2em',
                color: getComputedStyle(document.documentElement).getPropertyValue('--randColor'),
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 'normal',
                lineHeight: '1',
                minWidth: 1,
                padding: '0.16666666666667em 0.5em',
                textAlign: 'center'}}>
                {data.options.length}
            </span>
        </div>
    ),
    selectStyleSmall = {
        control: (base) => ({
            ...base,
            minHeight: 'initial',
        }),
        valueContainer: (base) => ({
            ...base,
            height: `-1px`,
            padding: '0 8px',
        }),
        clearIndicator: (base) => ({
            ...base,
            padding: `0px`,
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: `0px`,
        })
    },
    selectHideGroupHeading = (props) => {
        return (
            <div className='collapse-group-heading'
                onClick={() => {
                    document.querySelector(`#${props.id}`)
                        .parentElement
                        .parentElement
                        .classList
                        .toggle('collapse-group');
                }}>
                <components.GroupHeading {...props}/>
            </div>
        );
    },
    selectHideGroupMenuList = (props) => {
        return <SimpleBar style={{ maxHeight: 210 }}>{props.children}</SimpleBar>;    
    },
    menuListScrollbar = (props) => {
        const { innerRef, innerProps, children } = props;

        const refSimpleBar = useRef(null);

        useEffect(() => {
            return () => {
                if (refSimpleBar.current) refSimpleBar.current.unMount();
            };
        }, []);

        return (
            <SimpleBar ref={refSimpleBar}
                style={{ maxHeight: 210 }}
                scrollableNodeProps={{
                    ...innerProps,
                    ref: innerRef,
                }}>
                {children}
            </SimpleBar>
        );
    };

export const LazyWidget = ({ Component, ...props }) => {
    return <Suspense fallback={
            <div className='float center'>
                <img src='/resources/singles/fumo_speen.gif'
                    alt='Fumo spining'/>
                <span className='font bold'>Loading...</span>
            </div>
        }>
        <Component {...props}/>
    </Suspense>
};