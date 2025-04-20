import { Scene } from 'phaser';


export class Preloader extends Scene{
    constructor(){
        super('Preloader');
    };
    init(){
        this.add.image(300, 425, 'background');
        this.add.rectangle(300, 425, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(299-230, 425, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (462 * progress);
        });
    };
    preload(){
        this.load.setPath('resources/circlebeat/');
        this.load.atlas('hit-atlas', 'hit.webp', 'hit.json');
        this.load.atlas('hit_subeffect-atlas', 'hit_subeffect.webp', 'hit_subeffect.json');
        this.load.audio('hit-sound', 'hit.mp3');
        this.load.image('disc_add_song', 'disc_add_song.webp');
    };
    create(){
        this.scene.start('MainMenu');
    };
};