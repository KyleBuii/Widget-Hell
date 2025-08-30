import { Scene } from "phaser";
import { EventBus } from "../EventBus";

const WIDTH = 600;
const HEIGHT = 850;
const scoreColor = {
    Perfect: '#00ffff',
    Good: '#00ff00',
    Fine: '#ffff00',
    Bad: '#ff8800',
    Miss: '#b8002b',
};
const gradeColor = {
    SSS: '#FFD700',
    SS:  '#C0C0C0',
    S:   '#CD7F32',
    A:   '#4CAF50',
    B:   '#2196F3',
    C:   '#9C27B0',
    D:   '#FF9800',
    E:   '#F44336',
    F:   '#212121',
};

export class Score extends Scene {
    constructor() {
        super('Score');
        this.objects = [];
        this.noteCount = {
            perfect: 0,
            good: 0,
            fine: 0,
            bad: 0,
            miss: 0,
        };
        this.score = 0;
        this.index = 1;
    };

    create() {
        if (this.objects.length !== 0) {
            this.objects.forEach((object) => object.destroy());
        };

        EventBus.once('score', (scores) => {
            this.noteCount = scores.noteCount;
            this.score = scores.score;
            this.index = scores.index;
            this.name = scores.name;
            this.author = scores.author;
            this.time = scores.time;
            this.bpm = scores.bpm;
            this.objects = [
                ...this.objects,
                this.add.image(WIDTH / 2, 250, `disc_image_${this.index + 1}`).setScale(2),
                this.add.image(WIDTH / 2, HEIGHT + 40, 'background'),
            ];

            this.add.image(WIDTH - 25, 30, 'backarrow')
                .setInteractive()
                .on('pointerdown', () => {
                    this.game.scene.sleep('Score');
                    this.game.scene.wake('SongSelect');
                }
            );

            this.createContainers();
            this.createSongDetail();
            this.createScoreBoard();
        });
    };

    createContainers() {
        this.add.rectangle(WIDTH / 3, 660, 314, 274, 0x000000);
        this.add.rectangle(WIDTH / 3, 660, 300, 260, 0xffffff);
    };

    createSongDetail() {
        this.objects = [
            ...this.objects,
            this.add.text(20, 20, `${this.name}`, {
                fontSize: '32px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                fontFamily: 'Arial',
            }).setOrigin(0),
            this.add.text(22, 60, `${this.author}\n${this.time} - ${this.bpm} BPM`, {
                fontSize: '16px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                fontFamily: 'Arial',
            }).setOrigin(0),
        ];
    };

    createScoreBoard() {
        const grade = this.calculateGrade(this.score);
        this.objects = [
            ...this.objects,
            this.add.text(45, 465, `Score ${this.score}`, {
                fontSize: '32px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                fontFamily: 'Arial',
            }).setOrigin(0),
            this.add.text(WIDTH / 1.25, 670, grade, {
                fontSize: '256px',
                color: gradeColor[grade] || '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                fontFamily: 'Arial',
            }).setOrigin(0.5),    
        ];

        let colors = Object.keys(scoreColor);
        for (let i = 0; i < colors.length; i++) {
            let color = colors[i];
            this.objects = [
                ...this.objects,
                this.add.text(WIDTH / 3.2, 600 + (40 * i), color, {
                    fontSize: '32px',
                    color: scoreColor[color] || '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3,
                    fontFamily: 'Arial',
                }).setOrigin(1),
                this.add.text(WIDTH / 3 + 80, 600 + (40 * i), this.noteCount[color.toLowerCase()], {
                    fontSize: '32px',
                    color: scoreColor[color] || '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3,
                    fontFamily: 'Arial',
                }).setOrigin(0.5, 1),
            ];
        };

        EventBus.emit('new score', {
            grade: grade,
            score: this.score,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        });
    };

    calculateGrade(score) {
        const maxScore = this.calculateTotalNotes() * 100;
        const percent = (score / maxScore) * 100;
        if (percent === 100) return 'SSS';
        else if (percent >= 98) return 'SS';
        else if (percent >= 95) return 'S';
        else if (percent >= 90) return 'A';
        else if (percent >= 80) return 'B';
        else if (percent >= 70) return 'C';
        else if (percent >= 60) return 'D';
        else if (percent >= 50) return 'E';
        else return 'F';
    };

    calculateTotalNotes() {
        return Object.values(this.noteCount).reduce((sum, value) => sum + value, 0);
    };
};