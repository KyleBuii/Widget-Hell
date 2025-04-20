import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class MainMenu extends Scene{
    logoTween;
    constructor(){
        super('MainMenu');
    };
    create(){
        this.add.image(300, 425, 'background');
        this.logo = this.add.text(55, 200, 'Circle Beat', {
            fontFamily: 'Arial Black', fontSize: 80, color: '#01B5F8',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100);
        this.add.text(300, 350, 'Inspired by BeatTube', {
            fontFamily: 'Arial Black', fontSize: 12, color: '#01B5F8',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        this.add.text(300, 550, 'Click to start', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        this.moveLogo();
        this.input.on('pointerdown', this.changeScene, this);
        EventBus.emit('current-scene-ready', this);
    };
    changeScene(){
        if(this.logoTween){
            this.logoTween.stop();
            this.logoTween = null;
        };
        // this.scene.start('SongSelect');
        this.scene.start('Game');
    };
    moveLogo(reactCallback){
        if(this.logoTween){
            if(this.logoTween.isPlaying()){
                this.logoTween.pause();
            }else{
                this.logoTween.play();
            };
        }else{
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 50, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 220, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback)
                    {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        };
    };
};