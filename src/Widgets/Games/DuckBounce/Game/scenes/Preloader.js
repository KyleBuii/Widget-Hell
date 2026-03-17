import { Scene } from 'phaser';

export class Preloader extends Scene{
    constructor() {
        super('Preloader');
    };

    init() {
        this.add.rectangle(425, 300, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(425-230, 300, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (462 * progress);
        });
    };

    preload() {
        this.load.setPath('resources/duckbounce/');
        this.load.image('background', 'background.webp');
        this.load.image('duck', 'duck.webp');
        this.load.image('turtle', 'turtle.webp');
    };
    
    create() {
        this.scene.start('Game');
    };
};