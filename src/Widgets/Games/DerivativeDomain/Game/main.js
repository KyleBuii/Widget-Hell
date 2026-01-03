import { Game, Scale, WEBGL } from 'phaser';
import { Boot } from './scenes/Boot';
import { GameScreen } from './scenes/GameScreen';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

const config = {
    type: WEBGL,
    width: 850,
    height: 600,
    parent: 'derivativedomain-game',
    backgroundColor: '#016EC6',
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
        Boot,
        Preloader,
        MainMenu,
        GameScreen,
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;