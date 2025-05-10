/* eslint-disable no-undef */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

const WIDTH = 600;
const HEIGHT = 850;
const bgColor = 0x01b5f8;
const discPositions = [
    [750, 160],
    [610, 310],
    [530, 525],
    [610, 750],
    [750, 900],
];

export class SongSelect extends Scene {
    constructor() {
        super('SongSelect');
        this.middleDiscIndex = 2;
        this.discs = [];
        this.discName = 'N/A';
        this.discAuthor = 'N/A';
        this.discTime = '00:00';
        this.discBPM = '0';
        this.scores = [{
            grade: 'E',
            score: 0,
            date: 'January 0, 0000'
        }];
    };
    create() {
        this.add.image(WIDTH / 2, HEIGHT / 2, 'background');
        this.currentDepth = 1;

        this.createDiscAdd(180, 850);
        this.createContainers();
        this.createPlayButton();

        EventBus.once('discs', (discs) => this.createDiscs(discs));
        EventBus.once('add song', (song) => this.addSong(song));
        EventBus.once('new score', (score) => this.discs[this.middleDiscIndex].addScore(score));

        EventBus.emit('song select ready');
    };
    createDiscs(discs) {
        discs.forEach((disc, index) => {
            const videoID = disc.url.match(/watch\?v=(.*)/)[1];
            this.load.image(`disc_image_${index + 1}`, `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`);
        });

        this.load.once('complete', () => {
            discs.forEach((disc, index) => {
                this.discs.push(
                    new Disc(
                        this,
                        index,
                        disc.url,
                        `disc_image_${index + 1}`,
                        disc.name,
                        disc.author,
                        disc.duration,
                        disc.bpm,
                        disc?.score,
                    )
                );
            });
            
            for (let i = 0; i < 5; i++) {
                const [x, y] = discPositions[i];
                this.discs[i].moveDisc(x, y);
            };

            this.children.bringToTop(this.discs[2].disc);
            this.children.moveBelow(this.discs[4].disc, this.discs[3].disc);

            this.discName = this.discs[2].name;
            this.discAuthor = this.discs[2].author;
            this.discTime = this.discs[2].time;
            this.discBPM = this.discs[2].BPM;
            this.scores = this.discs[2].scores;

            this.createDiscInfo();
            this.createDiscScore();
        });

        this.load.start();
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
            const textScore = this.add.text(WIDTH / 4.3, 295 + (60 * i), `${currentScore.grade} ${currentScore.score}\n${currentScore.date}`, {
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
                    time: this.discTime,
                    index: this.middleDiscIndex,
                    name: this.discName,
                    author: this.discAuthor,
                });
            });
        this.add.text(WIDTH / 4.3, 670, 'Play', {
            color: 0xffffff,
            fontSize: 20,
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);
    };
    addSong(song) {
        const newDiscIndex = this.discs.length;
        const imageKey = `disc_image_${newDiscIndex + 1}`;
        if (!this.textures.exists(imageKey)) {
            const videoID = song.url.match(/watch\?v=(.*)/)[1];
            this.load.image(imageKey, `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`);
            this.load.once('complete', () => {
                this.createAndPlaceDisc(song, newDiscIndex, imageKey);
            });
            this.load.start();
        } else {
            this.createAndPlaceDisc(song, newDiscIndex, imageKey);
        };
    };
    createAndPlaceDisc(song, index, image) {
        this.discs.push(
            new Disc(
                this,
                index,
                song.url,
                image,
                song.name,
                song.author,
                song.duration,
                song.bpm,
            )
        );

        this.middleDiscIndex = index;

        const total = this.discs.length;
        const newIndices = [];
        for (let i = -2; i <= 2; i++) {
            newIndices.push((index + i + total) % total);
        };
    
        for (let i = 0; i < newIndices.length; i++) {
            const disc = this.discs[newIndices[i]];
            const [x, y] = discPositions[i];
            disc.moveDisc(x, y);
        };
    
        this.children.bringToTop(this.discs[index].disc);
        this.children.moveBelow(this.discs[newIndices[0]].disc, this.discs[newIndices[1]].disc);
        this.children.moveBelow(this.discs[newIndices[4]].disc, this.discs[newIndices[3]].disc);

        const middleDisc = this.discs[this.middleDiscIndex];
        this.discName = middleDisc.name;
        this.discAuthor = middleDisc.author;
        this.discTime = middleDisc.time;
        this.discBPM = middleDisc.BPM;
        this.scores = middleDisc.scores;
        this.createDiscInfo();
        this.createDiscScore();
    };
    truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return `${text.substring(0, maxLength - 3)}...`;
        };
        return text;
    };
    getAllScores() {
        return this.discs.map((disc, index) => ({
            index,
            scores: disc.scores || []
        }));
    };
};

class Disc {
    constructor(scene, number, URL, image, name, author, time, BPM, scores = []) {
        this.scene = scene;
        this.x = -100;
        this.y = -100;
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
        const disc = this.scene.add.container(this.x, this.y);
        disc.add(this.scene.add.circle(this.x, this.y, WIDTH / 4, 0x000000));
        disc.add(this.scene.add.rexCircleMaskImage(this.x, this.y, this.image).setScale(0.79)
            .setInteractive()
            .on('pointerdown', () => this.handleDiscClick())
        );
        disc.add(this.scene.add.circle(this.x, this.y, 50, 0x000000));
        disc.add(this.scene.add.circle(this.x, this.y, 44, bgColor));
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
        const visibleIndices = [];
            for (let i = -2; i <= 2; i++) {
            visibleIndices.push((this.number + i + total) % total);
        };
        for (let i = 0; i < visibleIndices.length; i++) {
            const disc = this.scene.discs[visibleIndices[i]];
            const [x, y] = discPositions[i];
            disc.moveDisc(x, y);
        };

        this.scene.middleDiscIndex = this.number;
        this.scene.children.bringToTop(this.scene.discs[this.scene.middleDiscIndex].disc);
        this.scene.children.moveBelow(this.scene.discs[visibleIndices[0]].disc, this.scene.discs[visibleIndices[1]].disc);
        this.scene.children.moveBelow(this.scene.discs[visibleIndices[4]].disc, this.scene.discs[visibleIndices[3]].disc);
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
        this.scene.createDiscScore();
    };
};