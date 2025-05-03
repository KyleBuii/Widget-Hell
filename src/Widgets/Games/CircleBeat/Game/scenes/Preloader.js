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
        this.load.image('disc_image_one', 'https://i.ytimg.com/vi/T1VAYTEWWgM/hqdefault.jpg');
        this.load.image('disc_image_two', 'https://i.ytimg.com/vi/NWnFhu0JbU0/hqdefault.jpg');
        this.load.image('disc_image_three', 'https://i.ytimg.com/vi/JyVCWlSPp0g/hqdefault.jpg');
        this.load.image('disc_image_four', 'https://i.ytimg.com/vi/8_-iOvzH65A/hqdefault.jpg');
        this.load.image('disc_image_five', 'https://i.ytimg.com/vi/5ta148UdiCI/hqdefault.jpg');

        this.load.plugin('rexcirclemaskimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcirclemaskimageplugin.min.js', true);
    };
    create(){
        this.scene.start('MainMenu');
    };
};