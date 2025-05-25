/* eslint-disable no-undef */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

const WIDTH = 600;
const HEIGHT = 850;
const barYPosition = 700;
const noteSize = 20;
const noteColor = '0x00ff00';
const scrollSpeed = 1;
const songStartTime = 0;
const patterns = ['normal', 'half', 'quarter', 'burst'];
const noteScores = {
    perfect: {
        threshold: 10,
        score: 100,
        color: '#00ffff',
    },
    good: {
        threshold: 25,
        score: 80,
        color: '#00ff00',
    },
    fine: {
        threshold: 40,
        score: 50,
        color: '#ffff00',
    },
    bad: {
        threshold: 60,
        score: 20,
        color: '#ff8800',
    },
};
let bpm, time, score, index, name, author;
let noteCount = { perfect: 0, good: 0, fine: 0, bad: 0, miss: 0, };

export class GameScreen extends Scene {
    constructor() {
        super('Game');
        this.gameStarted = false;
        this.stopSpawning = false;
        this.nextNoteTime = 0;
    };
    create() {
        this.createAnims();
        this.createBar();

        this.noteSpeed = 200 * scrollSpeed;
        this.notes = new Notes(this, 100);
        this.pattern = 'normal';
        score = 0;
        noteCount = { perfect: 0, good: 0, fine: 0, bad: 0, miss: 0, };

        this.createOutOfBoundsBar();

        EventBus.emit('current-scene-ready', this);
        EventBus.once('play information', (information) => {
            this.stopSpawning = false;
            bpm = information.bpm;
            time = information.time;
            index = information.index;
            name = information.name;
            author = information.author;
            this.noteInterval = (60 / bpm) * 1000;
            const travelTime = (barYPosition - (-noteSize)) / this.noteSpeed * 1000;
            const lastNoteSpawnTime = this.convertTime(information.time) - travelTime;
            this.time.delayedCall(lastNoteSpawnTime, () => {
                this.stopSpawning = true;
            });
            EventBus.emit('play', this);
        });
        EventBus.once('play end', () => {
            this.time.delayedCall(2000, () => {
                this.notes.clear(true, true);

                this.game.scene.sleep('Game');
                if (!this.game.scene.isActive('Score')) {
                    this.game.scene.start('Score');
                } else {
                    this.game.scene.wake('Score');
                };

                EventBus.emit('score', {
                    score: score,
                    noteCount: noteCount,
                    index: index,
                    name: name,
                    author: author,
                    time: time,
                    bpm: bpm,
                });
            });
        });

        this.time.delayedCall(songStartTime * 1000, () => {
            this.gameStarted = true;
        });

        this.randomPattern();
        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: this.randomPattern,
            callbackScope: this,
        });
    };
    update(time, delta) {
        if (!this.gameStarted || this.stopSpawning) return;

        let intervalMultiplier = 1;
        switch (this.pattern) {
            case 'half': intervalMultiplier = 0.5; break;
            case 'quarter': intervalMultiplier = 0.25; break;
            default: intervalMultiplier = 1; break;
        };
        const interval = this.noteInterval * intervalMultiplier;

        this.nextNoteTime += delta;
        if (this.nextNoteTime >= interval) {
            this.nextNoteTime = 0;

            const spawnNote = () => {
                const randomX = Phaser.Math.Between(noteSize, WIDTH - noteSize);
                this.notes.spawn(randomX, -noteSize, this.noteSpeed);
            };
    
            if (this.pattern === 'burst') {
                const count = Phaser.Math.Between(2, 5);
                for (let i = 0; i < count; i++) {
                    this.time.delayedCall(i * 60, spawnNote);
                };
            } else {
                spawnNote();
                if (Phaser.Math.FloatBetween(0, 1) < 0.15) {
                    spawnNote();
                };
            };
        };
    };
    convertTime(time) {
        let minutesAndSeconds = time.split(':');
        let totalMilliseconds = (minutesAndSeconds[0] * 60000) + (minutesAndSeconds[1] * 1000);
        return totalMilliseconds;
    };
    randomPattern() {
        this.pattern = Phaser.Utils.Array.GetRandom(patterns);
    };
    createBar() {
        this.bar = this.add.rectangle(300, barYPosition, WIDTH, 20, 0xff0000);
        this.hitArea = this.add.rectangle(300, barYPosition, WIDTH, 40)
            .setInteractive()
            .on('pointerdown', (pointer) => this.createHit(pointer));
    };
    createOutOfBoundsBar() {
        this.outOfBoundsBar = this.add.rectangle(300, HEIGHT + (noteSize * 2), WIDTH, 1)
            .setVisible(true);
        this.physics.add.existing(this.outOfBoundsBar);
        this.physics.add.overlap(this.outOfBoundsBar, this.notes, (bodyBar, bodyNote) => {
            if (bodyNote.active) {
                bodyNote.hide();
                noteCount.miss++;
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

            const noteY = bodyNote.y;
            const distance = Math.abs(noteY - barYPosition);
            let judgment = null;
            if (distance <= noteScores.perfect.threshold) {
                judgment = 'Perfect';
                noteCount.perfect++;
            } else if (distance <= noteScores.good.threshold) {
                judgment = 'Good';
                noteCount.good++;
            } else if (distance <= noteScores.fine.threshold) {
                judgment = 'Fine';
                noteCount.fine++;
            } else if (distance <= noteScores.bad.threshold) {
                judgment = 'Bad';
                noteCount.bad++;
            } else {
                return;
            };
            score += noteScores[judgment.toLowerCase()].score;

            const feedbackText = this.add.text(bodyNote.x, bodyNote.y, judgment, {
                fontSize: '32px',
                color: noteScores[judgment.toLowerCase()].color || '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                fontFamily: 'Arial',
            }).setOrigin(0.5, 0.5);
            this.tweens.add({
                targets: feedbackText,
                y: feedbackText.y - 50,
                alpha: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    feedbackText.destroy();
                }
            });

            bodyNote.hide();
            hit.body.enable = false;
        });

        hit.on('animationcomplete', () => {
            this.physics.world.removeCollider(overlap);
            hit.destroy();
        });
        hitSubeffect.on('animationcomplete', () => {
            hitSubeffect.destroy();
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
        this.scene = scene;
        for (let i = 0; i < maxNotes; i++) {
            this.newNote();
        };
    };
    spawn(x, y, velocity) {
        let note = this.getFirstDead(false);
        if (!note) {
            note = this.newNote();
        };
        note.drop(x, y, velocity);
    };
    newNote() {
        const note = new Note(this.scene, -100, -100);
        this.add(note);
        return note;
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