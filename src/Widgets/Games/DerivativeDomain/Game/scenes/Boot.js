import { Scene } from 'phaser';


export class Boot extends Scene{
    constructor() {
        super('Boot');
    };

    preload() {
        this.load.image('background', 'resources/derivativedomain/main-menu.webp',);
    };
    
    create() {
        this.scene.start('Preloader');
    };
};