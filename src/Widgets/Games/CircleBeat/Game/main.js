import { CANVAS, Game, Scale } from 'phaser';
import CircleMaskImagePlugin from 'phaser3-rex-plugins/plugins/circlemaskimage-plugin.js';
import { Boot } from './scenes/Boot';
import { GameScreen } from './scenes/GameScreen';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Score } from './scenes/Score';
import { SongSelect } from './scenes/SongSelect';


const config = {
    type: CANVAS,
    width: 600,
    height: 850,
    parent: 'circlebeat-game',
    transparent: true,
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    plugins: {
        global: [
            {
                key: 'rexCircleMaskImagePlugin',
                plugin: CircleMaskImagePlugin,
                start: true
            },
        ]
    },
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        SongSelect,
        GameScreen,
        Score,
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;