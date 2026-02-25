import Phaser from 'phaser';

export class HealthBar {
    constructor(scene, health, offsetX, offsetY, depth = 6) {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setDepth(depth);

        scene.add.existing(this.bar);

        this.value = health;
        this.maxValue = health;
        this.gameMaxValue = health;

        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.p = 19 / health;

        this.draw();
    };
    
    move(x, y) {
        this.x = x - this.offsetX;
        this.y = y + this.offsetY;

        this.draw();
    };

    setMaxValue(amount) {
        this.maxValue = amount;
        this.reset();
    };

    updateValue(amount) {
        this.value += amount;
        return (this.value <= 0);
    };

    updateGameValue(amount) {
        this.value += amount;
        this.gameMaxValue += amount;
        this.p = 19 / this.value;
    };

    draw() {
        this.bar.clear();
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 23, 7);
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 19, 3);

        if (this.value < (this.gameMaxValue / 2)) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        };

        let d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 3);
    };

    reset() {
        this.value = this.maxValue;
        this.gameMaxValue = this.maxValue;
        this.p = 19 / this.maxValue;
    };
};