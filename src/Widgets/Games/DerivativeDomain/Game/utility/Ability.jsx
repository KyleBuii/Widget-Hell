import Phaser from 'phaser';
import { HealthBar } from './HealthBar.jsx';

export class Ability extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, name, texture, x, y, {
        pushable = false,
        healthXOffset = 1,
        sponge = false,
        reflect = false,
        attack = false
    }) {
        super(scene, 0, 0, "abilities-atlas");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setPushable(pushable);
        this.setFrame(texture);
        this.setPosition(x, y);
        this.setDepth(9);
        this.setSize(this.width, this.height);
        if (sponge) {
            this.health = this.scene.player.mana;
            this.hp = new HealthBar(scene, this.health, this.width / healthXOffset, 11, 10);
        };
        this.name = name;
        this.sponge = sponge;
        this.reflect = reflect;
        this.attack = attack;
    };
    
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.sponge && (this.x !== this.hp.x || this.y !== this.hp.y)) {
            this.hp.move(this.x, this.y);
        };
    };

    kill() {
        if (this.hp?.bar) {
            this.hp.bar.destroy();
            this.hp.bar = null;
        };

        if (this.body) {
            this.disableBody(true, true);
        } else {
            this.setActive(false);
            this.setVisible(false);
        };
    };
};