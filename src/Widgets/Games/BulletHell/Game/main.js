import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';


const config = {
    type: Phaser.CANVAS,
    width: 600,
    height: 850,
    parent: 'bullethell-game',
    backgroundColor: '#016EC6',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
        Game
    ]
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;