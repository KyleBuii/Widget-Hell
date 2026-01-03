import { Scene } from 'phaser';


export class Preloader extends Scene{
    constructor() {
        super('Preloader');
    };

    init() {
        this.add.image(425, 300, 'background');
        this.add.rectangle(425, 300, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(425-230, 300, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (462 * progress);
        });
    };

    preload() {
        this.load.setPath('resources/derivativedomain/');
        /// Menu
        this.load.image('box', 'menu/menu-box.webp');
        this.load.image('button', 'menu/menu-button.webp');
        /// Player
        this.load.image('player-default', 'player/player-default.webp');
        /// Enemy
        this.load.atlas('enemy-atlas', 'enemy/enemy.webp', 'enemy/enemy.json');
        /// Addition
        this.load.image('bomb', 'addition/bomb.webp');
        /// Abilities
        this.load.atlas('abilities-atlas', 'abilities/abilities.webp', 'abilities/abilities.json');
        /// Bullet
        this.load.atlas('bullet-atlas', 'bullet/bullet.webp', 'bullet/bullet.json');
        this.load.setPath('resources/');
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
    
    create() {
        this.scene.start('MainMenu');
    };
};