/* eslint-disable no-undef */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

const WIDTH = 600;
const HEIGHT = 850;
const bgColor = 0x01b5f8;
const discPositions = [
    [650, 60],
    [510, 210],
    [430, 425],
    [510, 650],
    [650, 800],
];

export class SongSelect extends Scene {
    constructor() {
        super('SongSelect');
        this.middleDiscIndex = 2;
        this.discs = [];
        this.discName = 'N/A';
        this.discAuthor = 'N/A';
        this.discTime = '00:00:00';
        this.discBPM = '0';
        this.scores = [{
            scoreRank: 'E',
            score: 0,
            date: 'January 0 0000'
        }];
    };
    create() {
        this.add.image(WIDTH / 2, HEIGHT / 2, 'background');
        this.currentDepth = 1;
        this.createDiscs();
        this.createDiscAdd(180, 850);
        this.createContainers();
        this.createDiscInfo();
        this.createDiscScore();
        this.createPlayButton();
    };
    createDiscs() {
        this.discs = [
            new Disc(
                this,
                0,
                'https://www.youtube.com/watch?v=T1VAYTEWWgM',
                'disc_image_one',
                'Hate Me',
                'blueberry',
                '2:13',
                230,
            ),
            new Disc(
                this,
                1,
                'https://www.youtube.com/watch?v=NWnFhu0JbU0',
                'disc_image_two',
                'LOUCA ENCUBADA',
                'DJ SAMIR',
                '1:59',
                130,
            ),
            new Disc(
                this,
                2,
                'https://www.youtube.com/watch?v=JyVCWlSPp0g',
                'disc_image_three',
                'back to you',
                'bad narrator',
                '2:39',
                126,
            ),
            new Disc(
                this,
                3,
                'https://www.youtube.com/watch?v=8_-iOvzH65A',
                'disc_image_four',
                '怪物 / ‘Monster’',
                'Saya Velleth',
                '3:07',
                150,
            ),
            new Disc(
                this,
                4,
                'https://www.youtube.com/watch?v=5ta148UdiCI',
                'disc_image_five',
                'DANÇA DO VERÃO',
                'NXGHT!, SH3RWIN, Scythermane',
                '1:13',
                135,
            ),
        ];
        this.discs.forEach((disc, index) => {
            const [x, y] = discPositions[index];
            disc.moveDisc(x, y);
        });
        this.children.bringToTop(this.discs[2].disc);
        this.children.moveBelow(this.discs[4].disc, this.discs[3].disc);

        this.discName = this.discs[2].name;
        this.discAuthor = this.discs[2].author;
        this.discTime = this.discs[2].time;
        this.discBPM = this.discs[2].BPM;
        this.scores = this.discs[2].scores;
    };
    createDiscAdd(x, y) {
        const disc = this.add.container(x, y);
        disc.add(this.add.circle(0, 0, WIDTH / 4, 0x000000));
        disc.add(this.add.circle(0, 0, WIDTH / 4.2, 0xffffff)
            .setInteractive()
            .on('pointerdown', () => {
                EventBus.emit('clicked disc add');
                this.discInfo.setVisible(false);
                this.discContainerScore.destroy(true);    
            })
        );
        disc.add(this.add.image(0, 0, 'disc_add_song'));
        disc.add(this.add.circle(0, 0, 50, 0x000000));
        disc.add(this.add.circle(0, 0, 44, bgColor));
    };
    createContainers() {
        /// Info
        this.add.rectangle(WIDTH / 4.3, 150, WIDTH / 2.4, HEIGHT / 5, 0x000000);
        this.add.rectangle(WIDTH / 4.3, 150, WIDTH / 2.55, HEIGHT / 5.4, 0xffffff);
        /// Score
        this.add.rectangle(WIDTH / 4.3, 445, WIDTH / 2.4, 385, 0x000000);
        this.add.rectangle(WIDTH / 4.3, 445, WIDTH / 2.55, 370, 0xffffff);
    };
    createDiscInfo() {
        if (this.discInfo) {
            this.discInfo.destroy(true);
        };
        this.discInfo = this.add.text(WIDTH / 4.3, 150, `${this.truncateText(this.discName, 17)}\n${this.truncateText(this.discAuthor, 17)}\n${this.discTime}\n${this.discBPM} BPM`, {
            color: 0xffffff,
            fontSize: 20,
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5, 0.5);
    };
    createDiscScore() {
        if (this.discContainerScore) {
            this.discContainerScore.destroy(true);
        };
        this.discContainerScore = this.add.container(0, 0);
        for (let i in this.scores) {
            if (i == 6) break;
            let currentScore = this.scores[i];
            const textScore = this.add.text(WIDTH / 4.3, 295 + (60 * i), `${currentScore.scoreRank} ${currentScore.score}\n${currentScore.date}`, {
                color: 0xffffff,
                fontSize: 20,
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5);
            this.discContainerScore.add(textScore);
        };
    };
    createPlayButton() {
        this.add.rectangle(WIDTH / 4.3, 670, WIDTH / 2.4, 35, 0x000000);
        this.add.rectangle(WIDTH / 4.3, 670, WIDTH / 2.55, 20, 0xffffff)
            .setInteractive()
            .on('pointerdown', () => {
                this.game.scene.sleep('SongSelect');
                if (!this.game.scene.isActive('Game')) {
                    this.game.scene.start('Game');
                } else {
                    this.game.scene.wake('Game');   
                };
                EventBus.emit('play information', {
                    bpm: this.discBPM,
                    time: this.discTime
                });
            });
        this.add.text(WIDTH / 4.3, 670, 'Play', {
            color: 0xffffff,
            fontSize: 20,
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);
    };
    truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return `${text.substring(0, maxLength - 3)}...`;
        };
        return text;
    };
};

class Disc {
    constructor(scene, number, URL, image, name, author, time, BPM, scores = []) {
        this.scene = scene;
        this.x = 0;
        this.y = 0;
        this.number = number;
        this.url = URL;
        this.image = image;
        this.name = name;
        this.author = author;
        this.time = time;
        this.BPM = BPM;
        this.scores = scores;
        this.disc = this.createDisc();
    };
    createDisc() {
        if (this.disc) {
            this.disc.destroy(true);
        };
        const disc = this.scene.add.container(0, 0);
        disc.add(this.scene.add.circle(0, 0, WIDTH / 4, 0x000000));
        disc.add(this.scene.add.rexCircleMaskImage(0, 0, this.image).setScale(0.79)
            .setInteractive()
            .on('pointerdown', () => this.handleDiscClick())
        );
        disc.add(this.scene.add.circle(0, 0, 50, 0x000000));
        disc.add(this.scene.add.circle(0, 0, 44, bgColor));
        return disc;
    };
    handleDiscClick() {
        this.scene.discName = this.name;
        this.scene.discAuthor = this.author;
        this.scene.discTime = this.time;
        this.scene.discBPM = this.BPM;
        this.scene.scores = this.scores;
        this.scene.createDiscInfo();
        this.scene.createDiscScore();
        EventBus.emit('clicked disc', this.url);

        if (this.number === this.scene.middleDiscIndex) return;

        const total = this.scene.discs.length;
        const middle = this.scene.middleDiscIndex;
        const ccw = (middle - 1 + total) % total;
        const cw = (middle + 1) % total;

        let newMiddle;
        if (this.number === ccw) {
            newMiddle = ccw;
        } else if (this.number === cw) {
            newMiddle = cw;
        } else {
            return;
        };
        this.scene.middleDiscIndex = newMiddle;

        const newIndices = [];
        for (let i = -2; i <= 2; i++) {
            newIndices.push((newMiddle + i + total) % total);
        };
        for (let i = 0; i < newIndices.length; i++) {
            const disc = this.scene.discs[newIndices[i]];
            const [x, y] = discPositions[i];
            disc.moveDisc(x, y);
        };

        this.scene.children.bringToTop(this.scene.discs[newMiddle].disc);
        this.scene.children.moveBelow(this.scene.discs[newIndices[0]].disc, this.scene.discs[newIndices[1]].disc);
        this.scene.children.moveBelow(this.scene.discs[newIndices[4]].disc, this.scene.discs[newIndices[3]].disc);
    };
    changeDiscInformation(number, URL, image, name, author, time, BPM, scores) {
        this.number = number;
        this.url = URL;
        this.image = image;
        this.name = name;
        this.author = author;
        this.time = time;
        this.BPM = BPM;
        this.scores = scores;
        this.disc = this.createDisc();
    };
    moveDisc(x, y) {
        this.x = x;
        this.y = y;
        this.disc.setPosition(x, y);
    };
    addScore(newScore) {
        this.scores.push(newScore);
    };
};