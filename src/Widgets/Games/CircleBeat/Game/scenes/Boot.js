import { Scene } from 'phaser';


export class Boot extends Scene{
    constructor(){
        super('Boot');
    };

    preload(){
        this.load.image('background', 'assets/derivativedomain/menu/menu-background.webp',);
    };
    
    create(){
        this.scene.start('Preloader');
    };
};