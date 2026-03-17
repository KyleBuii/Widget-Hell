import Phaser from 'phaser';
import { HealthBar } from './HealthBar';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, x, y, key, exp, health, attack, defense, speed, healthXOffset = 7, target = null) {
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

        this.exp = exp;

        this.health = health;
        this.hp = new HealthBar(scene, health, this.displayWidth / healthXOffset, 11);

        this.atk = attack;
        this.def = defense;
        this.spd = speed;

        this.alive = true;
        this.isGamePaused = false;

        this.velocity = { x: 0, y: 0 };
    };

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.isGamePaused || !this.alive) return;

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

    revive(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);

        this.alive = true;
        this.hp.reset();

        if (this.body) {
            this.body.enable = true;
        };
    };

    kill() {
        this.setActive(false);
        this.setVisible(false);

        this.alive = false;
        this.hp.hide();

        if (this.body) {
            this.body.enable = false;
        };
    };

    stopMoving() {
        this.isGamePaused = true;
        this.setVelocity(0);
    };

    startMoving() {
        this.isGamePaused = false;
    };

    destroy(scene) {
        super.destroy(scene);

        if (this.hp?.bar) {
            this.hp.bar.destroy();
            this.hp.bar = null;
        };
    };
};