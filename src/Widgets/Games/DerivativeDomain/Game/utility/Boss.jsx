import Phaser from 'phaser';
import { Danmaku } from './Danmaku';
import { Enemy } from './Enemy';
import { HealthBar } from './HealthBar';

const patterns = [
    // "touhouFangameRecollectionOfScriptersPast",
    "generation1_1"
];
const generation1_1Patterns = [
    // "spiralColorfulSpeen",
    // "arrowSparsedVomit",
    // "icicleBloodAndIce",
    // "spiralRadiantBloom",
    // "spiralCosmicDance"
    "sparse"
];

export class Boss extends Enemy {
    constructor(atk, atkSpd, atkRate, bullets, ...arg) {
        super(...arg);
        this.setDepth(4);
        this.setSize(200, 200);
        this.setDisplaySize(256, 256);
        this.body.setVelocityY(150);
        this.key = "boss";
        this.phaseTimer = 0;
        this.phaseTimerOffset = -1,
        this.hp = new HealthBar(this.scene, this.health, 6, 80);
        this.atk = atk;
        this.atkSpd = atkSpd;
        this.atkRate = atkRate;
        this.atkDebuff = 0;
        this.atkSpdDebuff = 0;
        this.atkRateDebuff = 0;
        this.attackTimer = 0;
        this.ready = false;
        this.pattern = null;
        this.bulletPattern = [];
        this.paramsTouhouFangameRecollectionOfScriptersPast = {
            randomY: -1,
            decideRotation: -1,
            combine: {
                north: -1,
                east: -1,
                south: -1,
                west: -1
            },
            tempTimer: 0
        };
        this.danmaku = new Danmaku(this.scene, bullets, {});
        this.danmakuPatterns = [];
        this.createDanmakuPatterns();
    };

    preUpdate() {
        if (this.x !== this.hp.x || this.y !== this.hp.y) {
            this.hp.move(this.x, this.y);
        };
        if (this.alive && this.ready) {
            // if (!this.pattern) {
            //     this.pattern = patterns[Math.floor(Math.random() * patterns.length)];
            // };
            // this[this.pattern]();
            if (/\b0\b|\b5000\b|\b10000\b|\b15000\b|\b20000\b|\b25000\b|\b30000\b|\b35000\b|\b40000\b|\b45000\b/.test(this.phaseTimer.toString())
                && this.scene.player.active) {
                this.spawnBomb(3);
            };
            this.phaseTimer++;
            // if (this.phaseTimer === 12000) {
            //     this.phaseTimer = 0;
            //     this.nextDanmakuPattern();
            // };
            // if (this.phaseTimerOffset !== -1) {
            //     this.phaseTimer = this.phaseTimerOffset;
            //     this.phaseTimerOffset = -1;
            // };
            // for (let pattern of this.bulletPattern){
            //     if (pattern.delay && (pattern.delayTimer !== 0) && (pattern.attackDurationTimer === pattern.atkDuration)){
            //         pattern.delayTimer++;
            //         if (pattern.delayTimer > pattern.delay){
            //             pattern.delayTimer = 0;
            //             pattern.attackDurationTimer = 0;
            //         };
            //     } else {
            //         pattern.attackTimer++;
            //         if (pattern.attackTimer > pattern.atkRate + this.atkRateDebuff){
            //             pattern.attackTimer = 0;
            //             pattern.attackDurationTimer++;
            //             if (pattern.attackDurationTimer === pattern.atkDuration){
            //                 pattern.delayTimer++;
            //             };
            //             this[pattern.attack]();
            //         };
            //     };
            // };
        };
    };

    createDanmakuPatterns() {
        this.danmakuPatterns.push({
            name: "RANDOM ANGLE RANDOM SPEED",
            danmakuConfig: {
                countA: 1,
            },
            cannonConfig: {
                speed: 100,
                fireRate: 10, 
            },
            bulletConfig: {
                class: "NORMAL", 
                bearing: "r",
                damage: 1,
                speed: "r100",
                texture: "bullet-atlas",
                frame: "circle-blue",
            }
        });
    };

    nextDanmakuPattern() {
        this.danmaku.resetDanmaku(this.scene);
        this.danmaku.setProperties(this.scene, this.danmakuPatterns[Math.floor(Math.random() * this.danmakuPatterns.length)]);
        this.danmaku.startUpDanmaku(this.scene);
    };

    generation1_1() {
        if (this.phaseTimer === 0) {
            let randomPatternIndex = Phaser.Math.Between(0, generation1_1Patterns.length - 1);
            let randomPattern = generation1_1Patterns[randomPatternIndex];
            this[randomPattern]();
        };
        if (this.phaseTimer === 5000) {
            this.bulletPattern.length = 0;
            this.phaseTimerOffset = 0;
        };
    };

    spiralColorfulSpeen() {
        if (this.bulletPattern.length === 0) {
            this.bulletPattern = [
                {
                    atkRate: 25,
                    attackTimer: 0,
                    attack: "spiralColorfulSpeen"
                }
            ];
        };
        if (!this.paramsSpiralColorSpeen) {
            this.paramsSpiralColorSpeen = {
                lasers: 8,
                laserAngle: 0,
                laserSpeed: 400,
                rotationSpeed: 8,
                textures: ["laser-red", "laser-blue", "laser-green", "laser-yellow"],
            };
        };
        const params = this.paramsSpiralColorSpeen;
        for (let i = 0; i < params.lasers; i++) {
            const angle = params.laserAngle + (360 / params.lasers) * i;
            const texture = params.textures[i % params.textures.length];
            this.attack({
                x: this.x, y: this.y,
                speed: params.laserSpeed,
                angle: angle,
                texture: texture,
                size: 3
            });
        };
        params.laserAngle += params.rotationSpeed;
    };

    arrowSparsedVomit() {
        if (this.bulletPattern.length === 0) {
            this.bulletPattern = [
                {
                    atkRate: 30,
                    attackTimer: 0,
                    attack: "arrowSparsedVomit"
                }
            ];
        };
        if (!this.paramsArrowSparsedVomit) {
            this.paramsArrowSparsedVomit = {
                burstCount: 10,
                burstSpeed: 450,
                angleVariance: 15,
                textures: ["arrow-red", "arrow-blue", "arrow-green", "arrow-yellow"]
            };
        };
        const params = this.paramsArrowSparsedVomit;
        for (let i = 0; i < params.burstCount; i++) {
            const angle = Phaser.Math.Between(0, 360);
            const speed = Phaser.Math.Between(params.burstSpeed - 100, params.burstSpeed + 100);
            const texture = params.textures[Phaser.Math.Between(0, params.textures.length - 1)];
            this.attack({
                x: this.x, y: this.y,
                speed: speed,
                angle: angle + Phaser.Math.Between(-params.angleVariance, params.angleVariance),
                texture: texture,
                size: 4
            });
        };
    };

    icicleBloodAndIce() {
        if (this.bulletPattern.length === 0) {
            this.bulletPattern = [
                {
                    atkRate: 25,
                    attackTimer: 0,
                    attack: "icicleBloodAndIce"
                }
            ];
        };
        if (!this.paramsIcicleBloodAndIce) {
            this.paramsIcicleBloodAndIce = {
                speed: 350,
                textures: ["icicle-3-blue", "icicle-red"],
            };
        };
        const params = this.paramsIcicleBloodAndIce;
        for (let i = 0; i < 4; i++) {
            const xOffset = Phaser.Math.Between(-300, 300);
            const texture = params.textures[Phaser.Math.Between(0, params.textures.length - 1)];
            this.attack({
                x: this.x + xOffset,
                y: 0,
                speed: params.speed,
                angle: 90,
                texture: texture,
                size: 4
            });
        };
    };

    spiralRadiantBloom() {
        if (this.bulletPattern.length === 0) {
            this.bulletPattern = [
                {
                    atkRate: 40,
                    attackTimer: 0,
                    attack: "spiralRadiantBloom"
                }
            ];
        };
        if (!this.paramsSpiralRBS) {
            this.paramsSpiralRBS = {
                layerCount: 5,
                bulletsPerLayer: 18,
                layerSpacing: 50,
                baseSpeed: 100,
                rotationSpeed: 3,
                textures: ["orb-red", "orb-orange", "orb-yellow", "orb-green", "orb-blue"],
                petalCount: 12,
                petalSpeed: 200,
                petalRotationSpeed: 1,
                petalTexture: "orb-pink",
                rotationAngle: 0,
                petalAngle: 0
            };
        };
        const params = this.paramsSpiralRBS;    
        for (let layer = 0; layer < params.layerCount; layer++) {
            const radius = layer * params.layerSpacing;
            const speed = params.baseSpeed + layer * 20;
            const texture = params.textures[layer % params.textures.length];
            for (let i = 0; i < params.bulletsPerLayer; i++) {
                const angle = params.rotationAngle + (360 / params.bulletsPerLayer) * i;
                const angleRad = Phaser.Math.DegToRad(angle);
                this.attack({
                    x: this.x + Math.cos(angleRad) * radius,
                    y: this.y + Math.sin(angleRad) * radius,
                    speed: speed,
                    angle: angle,
                    texture: texture,
                    size: 1
                });
            };
        };
        params.rotationAngle += params.rotationSpeed;
        for (let i = 0; i < params.petalCount; i++) {
            const angle = params.petalAngle + (360 / params.petalCount) * i;
            this.attack({
                x: this.x, y: this.y,
                speed: params.petalSpeed,
                angle: angle,
                texture: params.petalTexture,
                size: 1.5
            });
        };
        params.petalAngle += params.petalRotationSpeed;
    };

    spiralCosmicDance() {
        if (this.bulletPattern.length === 0) {
            this.bulletPattern = [
                {
                    atkRate: 20,
                    attackTimer: 0,
                    attack: "spiralCosmicDance"
                }
            ];
        };
        if (!this.paramsSpiralCD) {
            this.paramsSpiralCD = {
                bulletSpeed: 160,
                bulletCount: 30,
                spiralRotationSpeed: 2,
                spreadAngle: 180,
                waveCount: 5,
                timer: 0,
                phaseDuration: 80,
                maxDistance: 250,
                angleOffset: 0,
                spiralGrowth: 10,
                oscillationSpeed: 0.2
            };
        };
        const params = this.paramsSpiralCD;
        if (params.timer <= 0) {
            for (let wave = 0; wave < params.waveCount; wave++) {
                const baseAngle = (360 / params.waveCount) * wave + params.angleOffset;
                for (let i = 0; i < params.bulletCount; i++) {
                    const angle = baseAngle - (params.spreadAngle / 2) + (i * (params.spreadAngle / params.bulletCount));
                    const angleRad = Phaser.Math.DegToRad(angle);
                    const distance = Phaser.Math.FloatBetween(100, params.maxDistance);
                    this.attack({
                        x: this.x + Math.cos(angleRad) * distance,
                        y: this.y + Math.sin(angleRad) * distance,
                        speed: params.bulletSpeed,
                        angle: angle,
                        texture: "star-blue",
                        size: 1
                    });
                };
            };
            params.timer = params.phaseDuration;
            params.angleOffset += params.spiralRotationSpeed;
            if (params.angleOffset > 360) {
                params.angleOffset = 0;
            };
        } else {
            params.timer -= 16;
        };
        for (let i = 0; i < 20; i++) {
            const angle = (i * 18) + params.angleOffset;
            const angleRad = Phaser.Math.DegToRad(angle);
            const distance = 50 + (Math.sin(i / 10) * params.spiralGrowth);
            const oscillation = Math.sin(i * params.oscillationSpeed);
            this.attack({
                x: this.x + Math.cos(angleRad) * distance + oscillation * 20,
                y: this.y + Math.sin(angleRad) * distance + oscillation * 20,
                speed: params.bulletSpeed,
                angle: angle,
                texture: "icicle-2-blue",
                size: 1.5
            });
        };
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) + params.angleOffset;
            const angleRad = Phaser.Math.DegToRad(angle);
            this.attack({
                x: this.x + Math.cos(angleRad) * 100,
                y: this.y + Math.sin(angleRad) * 100,
                speed: params.bulletSpeed,
                angle: angle,
                texture: "orb-small-pink",
                size: 1.2
            });
        };
    };

    /// Inspired by https://www.bulletforge.org/u/ajs/p/recollection-of-scripters-past
    touhouFangameRecollectionOfScriptersPast() {
        /// North
        if (this.phaseTimer === 0) {
            this.bulletPattern = [{
                atkRate: 10,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastNorth"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.north);
        };
        /// East
        if (this.phaseTimer === 1000) {
            this.bulletPattern = [{
                atkRate: 40,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastEast"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.east);
        };
        /// South
        if (this.phaseTimer === 2000) {
            this.bulletPattern = [{
                atkRate: 10,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastSouth"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.south);
        };
        /// West
        if (this.phaseTimer === 3000) {
            this.bulletPattern = [{
                atkRate: 4,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastWest"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.west);
        };
        /// Random direction
        if (this.phaseTimer === 4000) {
            this.paramsTouhouFangameRecollectionOfScriptersPast.randomY = -1;
            this.paramsTouhouFangameRecollectionOfScriptersPast.decideRotation = -1;
            let decideSide = Math.floor(Math.random() * 4 + 1);
            let optionsNorth = [3, 4];
            let optionsEast = [1, 3, 4];
            let optionsSouth = [1, 4];
            let optionsWest = [1, 3];
            switch (decideSide) {
                case 1:
                    this.paramsTouhouFangameRecollectionOfScriptersPast.combine.north = optionsNorth[Math.floor(Math.random() * optionsNorth.length)];
                    this.phaseTimerOffset = 0;
                    break;
                case 2:
                    this.paramsTouhouFangameRecollectionOfScriptersPast.combine.east = optionsEast[Math.floor(Math.random() * optionsEast.length)];
                    this.phaseTimerOffset = 1000;
                    break;
                case 3:
                    this.paramsTouhouFangameRecollectionOfScriptersPast.combine.south = optionsSouth[Math.floor(Math.random() * optionsSouth.length)];
                    this.phaseTimerOffset = 2000;
                    break;
                case 4:
                    this.paramsTouhouFangameRecollectionOfScriptersPast.combine.west = optionsWest[Math.floor(Math.random() * optionsWest.length)];
                    this.phaseTimerOffset = 3000;
                    break;
                default: break;
            };
        };
    };
    touhouFangameRecollectionOfScriptersPastNorth() {
        let randomX = Math.random() * 590 + 10;
        let calculateAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.scene.player.x, this.scene.player.y, randomX, 0)) - 180;
        this.attack({
            x: randomX, y: 0,
            speed: 300,
            texture: "arrow-pink",
            angle: calculateAngle,
            target: this.scene.player
        });
    };
    touhouFangameRecollectionOfScriptersPastEast() {
        if (this.paramsTouhouFangameRecollectionOfScriptersPast.randomY === -1) {
            this.paramsTouhouFangameRecollectionOfScriptersPast.randomY = Math.random() * 420;
        };
        for (let i = 0; i < 8; i++) {
            this.attack({
                x: 610, y: this.paramsTouhouFangameRecollectionOfScriptersPast.randomY + (60 * i),
                speed: 200,
                texture: "butterfly-green",
                angle: 180,
            });
        };
    };
    touhouFangameRecollectionOfScriptersPastSouth() {
        if (this.paramsTouhouFangameRecollectionOfScriptersPast.decideRotation === -1) {
            this.paramsTouhouFangameRecollectionOfScriptersPast.decideRotation = (Math.random() < 0.5)
                ? 20
                : -20;
        };
        let randomX = Math.random() * 590 + 10;
        this.attack({
            x: randomX, y: 860,
            speed: Math.random() * 200 + 150,
            texture: "card-blue",
            angle: -90 - this.paramsTouhouFangameRecollectionOfScriptersPast.decideRotation
        });
    };
    touhouFangameRecollectionOfScriptersPastWest() {
        let randomY = Math.random() * 840 + 10;
        this.attack({
            x: -10, y: randomY,
            speed: 200,
            texture: "sword-yellow"
        });
    };
    touhouFangameRecollectionOfScriptersPastCombine(side) {
        switch (side) {
            case 1:
                this.bulletPattern.push({
                    atkRate: 10,
                    attackTimer: 0,
                    attack: "touhouFangameRecollectionOfScriptersPastNorth"
                });
                break;
            case 2:
                this.bulletPattern.push({
                    atkRate: 40,
                    attackTimer: 0,
                    attack: "touhouFangameRecollectionOfScriptersPastEast"
                });
                break;
            case 3:
                this.bulletPattern.push({
                    atkRate: 10,
                    attackTimer: 0,
                    attack: "touhouFangameRecollectionOfScriptersPastSouth"
                });
                break;
            case 4:
                this.bulletPattern.push({
                    atkRate: 4,
                    attackTimer: 0,
                    attack: "touhouFangameRecollectionOfScriptersPastWest"
                });
                break;
            default: break;
        };
    };

    attack({
        delay = 0,
        amount = 1,
        angleChange = 0,
        x = this.x, y = this.y,
        angle = 0,
        damage = this.atk + this.atkDebuff,
        speed = this.atkSpd + this.atkSpdDebuff,
        gx = 0, gy = 0,
        tracking = false,
        texture = 'circle-black',
        scaleSpeed = 0,
        target = null,
        maxLife = 4500,
        size = 1
    }) {
        this.scene.time.delayedCall(delay, () => {
            for (let i = 0; i < amount / 2; i++){
                if (!this.alive) return;
                let count = (amount % 2 === 0) ? i + 1 : i;
                let bullet = this.scene.bossBullets.getFirstDead(false);
                if (bullet){
                    bullet.fire({
                        x: x, y: y,
                        angle: angle + (angleChange * count),
                        damage: damage,
                        speed: speed,
                        gx: gx, gy: gy,
                        tracking: tracking,
                        texture: texture,
                        scaleSpeed: scaleSpeed,
                        target: target,
                        maxLife: maxLife,
                        size: size
                    });
                    if (angleChange !== 0){
                        bullet = this.scene.bossBullets.getFirstDead(false);
                        bullet.fire({
                            x: x, y: y,
                            angle: angle + (-angleChange * count),
                            damage: damage,
                            speed: speed,
                            gx: gx, gy: gy,
                            tracking: tracking,
                            texture: texture,
                            scaleSpeed: scaleSpeed,
                            target: target,
                            maxLife: maxLife,
                            size: size
                        });
                    };
                };
            };
        });
    };

    createEllipse(ellipses) {
        ellipses.forEach(({ centerX, centerY, xRadius, yRadius, bulletCount, lifetime = Infinity, texture, speed = 0, size = 1 }) => {
            for (let i = 0; i < bulletCount; i++){
                const angle = (i / bulletCount) * Math.PI * 2;
                this.attack({
                    x: centerX + xRadius * Math.cos(angle),
                    y: centerY + yRadius * Math.sin(angle),
                    speed: speed,
                    angle: Phaser.Math.RadToDeg(angle),
                    maxLife: lifetime,
                    texture: texture,
                    size: size
                }); 
            };
        });
    };

    spawnBomb(amount) {
        let randomX, randomY;
        let bounds = this.getBounds();
        let xMin = bounds.x;
        let xMax = bounds.x + bounds.width;
        let yMin = bounds.y;
        let yMax = bounds.y + bounds.height;
        for (let i = 0; i < amount; i++) {
            do {
                randomX = Math.random() * 825 + 25;
            } while ((randomX < xMin) && (randomX > xMax));
            do {
                randomY = Math.random() * 530 + 30;
            } while ((randomY < yMin) && (randomY > yMax));
            this.createHollowCircle(randomX, randomY);
        };
    };

    createHollowCircle(x, y) {
        const bomb = this.scene.physics.add.sprite(x, y, "bomb")
            .setSize(18, 18)
            .setDisplaySize(64, 64)
            .setPushable(false)
            .setDepth(8);
        this.scene.bossBombs.add(bomb);
    };

    debuff(what) {
        switch (what) {
            case "morale":
                this.atkRateDebuff = 10;
                break;
            default: break;
        };
    };

    kill() {
        super.kill();
    };
};