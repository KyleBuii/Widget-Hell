import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class MainMenu extends Scene{
    logoTween;

    constructor() {
        super('MainMenu');
    };

    create() {
        this.add.image(425, 300, 'background');
        this.input.on('pointerdown', this.changeScene, this);
        EventBus.emit('current-scene-ready', this);
    };

    changeScene() {
        if(this.logoTween){
            this.logoTween.stop();
            this.logoTween = null;
        };
        this.scene.start('Game');
    };
};