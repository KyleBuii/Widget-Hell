/* eslint-disable no-undef */
import { Scene } from 'phaser';

const WIDTH = 850;
const HEIGHT = 600;
const waves = {
    0: {
        count: 3,
        increment: 1000,
    },
};

export class GameScreen extends Scene {
    constructor() {
        super('Game');

        this.isGameover = false;
        this.ducksToSpawn = 0;
        this.duckCounter = 0;
    };

    create() {
        this.createEnvironment();
        this.createAnimals();
        this.createStoppers();
        this.createCollider();
    };

    update() {
        if (this.isGameover) return;

        this.turtle.x = Phaser.Math.Clamp(
            this.input.activePointer.x
            , this.grassLeft.getBounds().right + this.turtle.width / 2
            , this.grassRight.getBounds().left - this.turtle.width / 2
        );

        if (this.duckCounter === this.ducksToSpawn) {
            this.duckCounter = 0;
            this.spawnWave(0);
        };
    };

    createEnvironment() {
        this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(WIDTH, HEIGHT + 10);

        this.buttonRestart = this.add.container(WIDTH / 2, HEIGHT / 2);
        const bgRestart = this.add.rectangle(0, 0, 100, 50, 0x000000, 0.5)
            .setInteractive()
            .on('pointerdown', () => this.restart());
        const textRestart = this.add.text(0, 0, 'Restart', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.buttonRestart.add([bgRestart, textRestart])
            .setVisible(false);

        this.grassLeft = this.add.rectangle(-150, HEIGHT, 300, 300, 0x4F7942).setOrigin(0, 0.5);
        this.grassRight = this.add.rectangle(WIDTH + 150, HEIGHT, 300, 300, 0x4F7942).setOrigin(1, 0.5);
        this.water = this.add.rectangle(WIDTH / 2, HEIGHT, WIDTH - 300, 100, 0x6495ED);

        this.physics.add.existing(this.grassLeft, true);
        this.physics.add.existing(this.grassRight, true);
    };

    createAnimals() {
        this.ducks = this.physics.add.group();
        this.turtle = this.physics.add.sprite(WIDTH / 2, HEIGHT - 50, 'turtle')
            .setScale(1.5)
            .setImmovable(true)
            .setSize(this.width, 1)
            .setOffset(0, 0);
    };

    createStoppers() {
        const boundsGrassLeft = this.grassLeft.getBounds();
        const boundsGrassRight = this.grassRight.getBounds();

        this.stopperBounce = this.add.rectangle(boundsGrassLeft.right - 25, boundsGrassLeft.top - 5, 10, 10);
        this.stopperRight = this.add.rectangle(boundsGrassRight.left + 220, boundsGrassRight.top - 5, 10, 10);
        this.stopperBottom = this.add.rectangle(WIDTH / 2, HEIGHT + 55, WIDTH, 0);

        this.stoppers = [this.stopperBounce, this.stopperRight, this.stopperBottom];

        this.stoppers.forEach((stopper) => this.physics.add.existing(stopper, true));
    };

    createCollider() {
        this.collidersTurtle = [
            this.physics.add.collider(this.turtle, this.grassLeft),
            this.physics.add.collider(this.turtle, this.grassRight),
        ];

        this.collidersDuck = [
            this.physics.add.collider(this.ducks, this.turtle, (turtle, duck) => {
                duck.setVelocityY(-400);
            }),
            this.physics.add.collider(this.ducks, this.grassLeft),
            this.physics.add.collider(this.ducks, this.grassRight, (grass, duck) => {
                duck.setVelocityY(0);
            }),
        ];

        this.collidersStopper = [
            this.physics.add.collider(this.stopperBounce, this.ducks, (stopper, duck) => {
                duck.setVelocityY(-400);
                duck.setVelocityX(100);
            }),
            this.physics.add.collider(this.stopperRight, this.ducks, (stopper, duck) => {
                this.deactivateDuck(duck);
                this.duckCounter++;
            }),
            this.physics.add.collider(this.stopperBottom, this.ducks, (stopper, duck) => {
                this.deactivateDuck(duck);
                this.gameover();
                this.buttonRestart.setVisible(true);
            }),
        ];
    };

    spawnWave(number) {
        this.ducksToSpawn = waves[number].count;

        for (let i = 0; i < this.ducksToSpawn; i++) {
            this.time.delayedCall(i * waves[number].increment, () => this.spawnDuck());
        };
    };

    spawnDuck() {
        const duck = this.ducks.getFirstDead();

        if (duck) {
            this.activateDuck(duck);
        } else {
            const newDuck = this.physics.add.sprite(-40, this.grassLeft.getBounds().top - 30, 'duck');

            this.ducks.add(newDuck);

            newDuck.setOrigin(0.5, 0.5)
                   .setGravityY(500)
                   .setBounce(0.6)
                   .setVelocityX(100);
        };
    };

    deactivateDuck(duck) {
        duck.setVelocity(0);
        duck.setVisible(false);
        duck.setActive(false);
        duck.body.enable = false;
    };

    activateDuck(duck) {
        duck.setPosition(-40, this.grassLeft.getBounds().top - 30);
        duck.setVelocityX(100);
        duck.setVisible(true);
        duck.setActive(true);
        duck.body.enable = true;
    };

    restart() {
        this.isGameover = false;
        this.ducks.children.entries.forEach((duck) => {
            this.deactivateDuck(duck);
        });
        this.buttonRestart.setVisible(false);
    };

    gameover() {
        this.isGameover = true;
        this.ducksToSpawn = 0;
        this.duckCounter = 0;

        this.ducks.children.entries.forEach((duck) => {
            duck.body.enable = false;
        });
    };
};