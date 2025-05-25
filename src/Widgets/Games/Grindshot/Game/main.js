import { AUTO, Game } from 'phaser';
import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { GameScreen } from './scenes/GameScreen';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';


/// The main game entry point. This contains the game configuration and start the game.
const config = {
    type: AUTO,
    width: 900,
    height: 650,
    parent: 'grindshot-game',
    backgroundColor: '#016EC6',
    physics: {
        default: 'arcade',
        arcade: {
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
        GameOver
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;