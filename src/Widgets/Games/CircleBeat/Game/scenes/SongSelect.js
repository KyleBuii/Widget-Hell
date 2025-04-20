/* eslint-disable no-undef */
import { Scene } from 'phaser';

const WIDTH = 600;
const HEIGHT = 850;
const bgColor = 0x01b5f8;

export class SongSelect extends Scene {
    constructor() {
        super('SongSelect');
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
        this.discOne = this.createDisc(WIDTH - (WIDTH / 7), HEIGHT / 4, 'One', (this.discName === 'N/A') ? '' : 'add');
        this.discTwo = this.createDisc(WIDTH - (WIDTH / 7), HEIGHT / 1.3, 'Two', (this.discName === 'N/A') ? 'add' : '');
        this.discThree = this.createDisc(WIDTH - (WIDTH / 4) - 20, HEIGHT / 2, 'Three');
        this.discMiddle = 'Three';
        this.createDiscInfo();
        this.createDiscScore();
    };
    createDisc(x, y, number, type = 'regular') {
        const disc = this.add.container(x, y);
        disc.add(this.add.circle(0, 0, WIDTH / 4, 0x000000));
        disc.add(this.add.circle(0, 0, WIDTH / 4.2, 0xffffff)
            .setInteractive()
            .on('pointerdown', () => this.handleDiscClick(number))
        );
        switch (type) {
            case 'add':
                disc.add(this.add.image(0, 0, 'disc_add_song'));
                break;
            default: break;
        };
        disc.add(this.add.circle(0, 0, 50, 0x000000));
        disc.add(this.add.circle(0, 0, 45, bgColor));
        return disc;
    };
    handleDiscClick(number) {
        if (this.discMiddle === number) return;
        const clickedDisc = this[`disc${number}`];
        const middleDisc = this[`disc${this.discMiddle}`];
        const tempX = middleDisc.x;
        const tempY = middleDisc.y;
        middleDisc.setPosition(clickedDisc.x, clickedDisc.y);
        clickedDisc.setPosition(tempX, tempY);
        this.discMiddle = number;
        this.children.bringToTop(clickedDisc);
    };
    createDiscInfo() {
        this.add.rectangle(WIDTH / 4.3, 150, WIDTH / 2.4, HEIGHT / 5, 0x000000);
        this.add.rectangle(WIDTH / 4.3, 150, WIDTH / 2.55, HEIGHT / 5.4, 0xffffff);
        this.add.text(WIDTH / 4.3, 150, `${this.truncateText(this.discName, 17)}\n${this.truncateText(this.discAuthor, 17)}\n${this.discTime}\n${this.discBPM} BPM`, {
            color: 0xffffff,
            fontSize: 20,
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5, 0.5);
    };
    createDiscScore() {
        this.add.rectangle(WIDTH / 4.3, 550, WIDTH / 2.4, HEIGHT / 1.48, 0x000000);
        this.add.rectangle(WIDTH / 4.3, 550, WIDTH / 2.55, HEIGHT / 1.52, 0xffffff);
        for (let i in this.scores) {
            if (i == 9) break;
            let currentScore = this.scores[i];
            this.add.text(WIDTH / 4.3, 310 + (60 * i), `${currentScore.scoreRank} ${currentScore.score}\n${currentScore.date}`, {
                color: 0xffffff,
                fontSize: 20,
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5);
        };
    };
    truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return `${text.substring(0, maxLength - 3)}...`;
        };
        return text;
    };
};