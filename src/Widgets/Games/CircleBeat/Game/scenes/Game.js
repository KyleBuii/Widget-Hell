/* eslint-disable no-undef */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

const WIDTH = 600;
const HEIGHT = 850;
const barYPosition = 700;
const noteSize = 20;
const noteColor = '0x00ff00';
const bpm = 130;
const scrollSpeed = 1;
const songStartTime = 0;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.gameStarted = false;
        this.nextNoteTime = 0;
        this.noteInterval = (60 / bpm) * 1000;
    };
    create() {
        this.createAnims();
        this.createBar();
        this.noteSpeed = 200 * scrollSpeed;
        this.notes = new Notes(this, 20);
        this.createOutOfBoundsBar();
        EventBus.emit('current-scene-ready', this);
        EventBus.emit('play', this);
        this.time.delayedCall(songStartTime * 1000, () => {
            this.gameStarted = true;
        });
    };
    update(time, delta) {
        if (!this.gameStarted) return;
        this.nextNoteTime += delta;
        if (this.nextNoteTime >= this.noteInterval) {
            const randomX = Phaser.Math.Between(noteSize, WIDTH - noteSize);
            this.notes.spawn(randomX, -noteSize, this.noteSpeed);
            this.nextNoteTime = 0;
        };
    };
    createBar() {
        this.bar = this.add.rectangle(300, barYPosition, WIDTH, 10, 0xff0000);
        this.hitArea = this.add.rectangle(300, barYPosition, WIDTH, 30)
            .setInteractive()
            .on('pointerdown', (pointer) => this.createHit(pointer));
    };
    createOutOfBoundsBar() {
        this.outOfBoundsBar = this.add.rectangle(300, HEIGHT + noteSize, WIDTH, 1)
            .setVisible(false);
        this.physics.add.existing(this.outOfBoundsBar);
        this.physics.add.overlap(this.outOfBoundsBar, this.notes, (bodyBar, bodyNote) => {
            if (bodyNote.active) {
                bodyNote.hide();
            };
        });
    };
    createHit({ x, y }) {
        const hit = this.add.sprite(x, y, 'hit-atlas', 0)
            .setScale(2);
        this.physics.add.existing(hit);
        hit.body.setSize(hit.width / 10, hit.height / 10);
        hit.anims.play('hit');
        this.sound.play('hit-sound');
        const hitSubeffect = this.add.sprite(x, HEIGHT - 100, 'hit_subeffect-atlas', 0)
            .setScale(4);
        this.physics.add.existing(hitSubeffect);
        hitSubeffect.anims.play('hit_subeffect');
        const overlap = this.physics.add.overlap(this.notes, hit, (bodyHit, bodyNote) => {
            if (!bodyNote.active) return;
            bodyNote.hide();
            hit.body.enable = false;
        });
        hit.on('animationcomplete', () => {
            this.physics.world.removeCollider(overlap);
            hit.destroy();
        });
    };
    createAnims() {
        this.anims.create({
            key: 'hit',
            frames: this.anims.generateFrameNames('hit-atlas', {
                prefix: 'hit_',
                end: 35
            }),
            frameRate: 70,
        });
        this.anims.create({
            key: 'hit_subeffect',
            frames: this.anims.generateFrameNames('hit_subeffect-atlas', {
                prefix: 'hit_subeffect_',
                end: 48
            }),
            frameRate: 96,
        });
    };
};

class Notes extends Phaser.Physics.Arcade.Group {
    constructor(scene, maxNotes) {
        super(scene);
        for (let i = 0; i < maxNotes; i++) {
            const note = new Note(scene, -100, -100);
            this.add(note);
        };
    };
    spawn(x, y, velocity) {
        const note = this.getFirstDead(false);
        if (note) {
            note.drop(x, y, velocity);
        }
    };
};

class Note extends Phaser.GameObjects.Ellipse {
    constructor(scene, x, y, color = noteColor, radius = noteSize) {
        super(scene, x, y, radius * 2, radius * 2, color);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
        this.body.setVelocityY(0);
        this.body.setAllowGravity(false);
    };
    drop(x, y, velocity) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.setVelocityY(velocity);
    };
    hide() {
        this.setPosition(-100, -100);
        this.setActive(false);
        this.setVisible(false);
        this.body.setVelocityY(0);
    };
};