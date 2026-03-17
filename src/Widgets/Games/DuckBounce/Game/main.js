import { Game, Scale, WEBGL } from 'phaser';
import { GameScreen } from './scenes/GameScreen';
import { Preloader } from './scenes/Preloader';

const config = {
    type: WEBGL,
    width: 850,
    height: 600,
    parent: 'duckbounce-game',
    backgroundColor: '#7eb6e5',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
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
        Preloader,
        GameScreen,
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;