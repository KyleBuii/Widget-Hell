import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class GameOver extends Scene{
    constructor(){
        super('GameOver');
    };
    create(){
        this.cameras.main.setBackgroundColor(0xff0000);
        this.add.image(400, 300, 'background').setAlpha(0.5);
        this.add.text(400, 300, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        this.input.on('pointerdown', this.changeScene, this);
        EventBus.emit('current-scene-ready', this);
    };
    changeScene(){
        this.scene.start('GameScreen');
    };
};