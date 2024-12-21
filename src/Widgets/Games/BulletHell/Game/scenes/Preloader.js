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
        this.load.setPath('assets/bullethell/');
        /// Menu
        this.load.image('title', 'menu/menu-title.webp');
        this.load.image('box', 'menu/menu-box.webp');
        this.load.image('button', 'menu/menu-button.webp');
        /// Player
        this.load.image('player-default', 'player/player-default.webp');
        /// Enemy
        this.load.image('yupina', 'enemy/yupina.webp');
        /// Boss
        this.load.image('boss--3-', 'boss/boss--3-.webp');
        this.load.image('boss-030', 'boss/boss-030.webp');
        this.load.image('boss-pleased', 'boss/boss-pleased.webp');
        this.load.image('boss-smug', 'boss/boss-smug.webp');
        this.load.image('boss-X3', 'boss/boss-X3.webp');
        /// Bullet
        this.load.image('bullet-arrow-pink', 'bullet/arrow-pink.webp');
        this.load.image('bullet-butterfly-green', 'bullet/butterfly-green.webp');
        this.load.image('bullet-card-blue', 'bullet/card-blue.webp');
        this.load.image('bullet-icicle-blue', 'bullet/icicle-blue.webp');
        this.load.image('bullet-icicle-pink', 'bullet/icicle-pink.webp');
        this.load.image('bullet-sword-yellow', 'bullet/sword-yellow.webp');

        this.load.setPath('assets/');
        this.load.image('bullet1', 'attacks/bullet1.png');
        this.load.image('bullet2', 'attacks/bullet2.png');
        this.load.image('bullet3', 'attacks/bullet3.png');
        this.load.image('bullet4', 'attacks/bullet4.png');
        this.load.image('bullet5', 'attacks/bullet5.png');
        this.load.image('bullet6', 'attacks/bullet6.png');
        this.load.image('bullet7', 'attacks/bullet7.png');
        this.load.image('bullet8', 'attacks/bullet8.png');
        this.load.image('bullet9', 'attacks/bullet9.png');
        this.load.image('bullet10', 'attacks/bullet10.png');
        this.load.image('bullet11', 'attacks/bullet11.png');
    };
    create(){
        this.scene.start('MainMenu');
    };
};