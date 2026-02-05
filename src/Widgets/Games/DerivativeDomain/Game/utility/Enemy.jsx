import Phaser from 'phaser';
import { HealthBar } from './HealthBar';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, x, y, key, health, attack, defense, speed, healthXOffset = 7, target = null) {
        super(scene, x, y, 'enemy-atlas');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setFrame(texture);
        this.setPosition(x, y);
        this.setDepth(1);

        const scale = 64 / this.frame.width;
        this.setScale(scale);

        this.body.setSize(
            this.frame.width * scale,
            this.frame.height * scale,
            true
        );

        this.key = key;
        this.target = target;

        this.health = health;
        this.hp = new HealthBar(scene, health, this.displayWidth / healthXOffset, 11);

        this.atk = attack;
        this.def = defense;
        this.spd = speed;

        this.alive = true;
        this.velocity = { x: 0, y: 0 };
    };

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (!this.alive) this.kill();

        if (this.x !== this.hp.x || this.y !== this.hp.y) {
            this.hp.move(this.x, this.y);
        };

        if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
            this.setPosition(Math.random() * 500 + 100, 0);
        };

        if (this.target) {
            this.scene.physics.moveToObject(this, this.target, this.spd * 100);
        } else {
            this.body.setVelocityY(this.spd * 100);
        };
    };

    destroy(scene) {
        if (this.hp?.bar) {
            this.hp.bar.destroy();
            this.hp.bar = null;
        };
        super.destroy(scene);
    };

    kill() {
        this.alive = false;

        if (this.body) {
            this.body.enable = false;
        };

        this.destroy();
    };
};