import { Scene } from 'phaser';


export class Preloader extends Scene{
    constructor(){
        super('Preloader');
    };
    init(){
        /// We loaded this image in our Boot Scene, so we can display it here
        this.add.image(450, 325, 'background');
        /// A simple progress bar. This is the outline of the bar.
        this.add.rectangle(450, 325, 468, 32).setStrokeStyle(1, 0xffffff);
        /// This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);
        /// Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {
            /// Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    };
    preload(){
        this.load.setPath('assets/');
        this.load.image('logo', 'logo.png');
        /// Map
        this.load.image('tiles', 'map/tiles/tiles.png');
        this.load.tilemapTiledJSON('grind', 'map/grind.json');
        this.load.spritesheet('tiles-spritesheet', 'map/tiles/tiles.png',
            { frameHeight: 16, frameWidth: 16 }
        );
        this.load.atlas('chest-atlas', 'map/tiles/tiles.png', 'map/chest.json');
        /// Player
        this.load.spritesheet('player', 'player/player.png',
            { frameHeight: 16, frameWidth: 16 }
        );
        this.load.atlas('player-atlas', 'player/player.png', 'player/player.json');
        this.load.image('target', 'player/reticle.png');
        /// Enemy
        this.load.spritesheet('birb', 'enemies/armed-enemy.png',
            { frameWidth: 66, frameHeight: 60 }
        );
        /// Attacks
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