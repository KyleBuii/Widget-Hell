import Phaser from 'phaser';
import { Bullet } from './Bullet';

export class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene, maxBullets) {
        super(scene.physics.world, scene, { enable: false });
        this.bullets = this.createMultiple({
            classType: Bullet,
            key: ('bullet'),
            frameQuantity: maxBullets,
            active: false,
            visible: false
        });
    };
};