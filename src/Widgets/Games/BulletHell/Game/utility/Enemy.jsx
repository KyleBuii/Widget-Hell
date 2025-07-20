import Phaser from 'phaser';
import { HealthBar } from './HealthBar';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, x, y, health, defense, speed, healthXOffset = 7) {
        super(scene, x, y, "enemy-atlas");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setFrame(texture);
        this.setPosition(x, y);
        this.setDepth(1);
        this.setSize(this.width, this.height);
        this.health = health;
        this.hp = new HealthBar(scene, health, this.displayWidth / healthXOffset, 11);
        this.def = defense;
        this.spd = speed;
        this.alive = true;
    };

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (!this.alive) this.kill();
        if (this.x !== this.hp.x || this.y !== this.hp.y) {
            this.hp.move(this.x, this.y);
        };
        if ((this.spd * 100) !== this.body.velocity.y) {
            this.body.setVelocityY(this.spd * 100);
        };
        if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
            this.setPosition(Math.random() * 500 + 100, 0);
        };
    };

    kill() {
        this.hp.bar.destroy();
        this.alive = false;
        this.destroy();
    };
};