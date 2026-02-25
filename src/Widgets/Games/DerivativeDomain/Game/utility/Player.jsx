import Phaser from 'phaser';
import { Ability } from './Ability.jsx';
import { Danmaku } from './Danmaku.jsx';

const dataItems = {
    'Redirects every attack against the user back to the attacker' : {
        name: 'Code of Hammurabi',
        cooldown: 60,
    },
    'Places a grass block' : {
        name: 'Grass Block',
        cooldown: 60,
    },
    'Slashes in a large radius' : {
        name: 'Rest In Peace',
        cooldown: 1,
    },
    'Fires a wave' : {
        name: 'Oceanic Terror',
        cooldown: 1,
    },
};
const abilityDistance = 50;
let isMobile = false;
let velocityX = 0;
let velocityY = 0;

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, x, y, bullets, bulletsAbilities) {
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setTexture(texture);
        this.setDrag(500, 500);
        this.setDepth(5);
        this.setSize(13, 13);

        this.displayWidth = 32;
        this.displayHeight = 50;

        this.layers = {};

        this.exp = 0;
        this.level = 1;
        this.neededExp = this.calculateNeededExp();

        this.speed = 300;

        this.fireRate = 300;
        this.addedFireRate = 0;

        this.projectileRadians = this.generateRadians(16);
        this.projectiles = 1;

        this.weapons = [];

        this.abilities = {};
        this.abilitiesRaw = [];
        this.ability = null;
        this.abilityIndex = 0;
        this.abilityTimer = 0;
        this.abilityCooldown = 0;

        this.keyInitialized = false;
        this.sneakInitialized = false;
        this.mobileAbility = false;
        this.isGamePaused = false;

        this.danmaku = new Danmaku(scene, bullets, {});
        this.danmakuAbilities = new Danmaku(scene, bulletsAbilities, {});
        this.bulletLastFired = 0;
        this.direction = new Phaser.Math.Vector2(0, -1);
    };

    preUpdate(time, delta) {
        if (this.isGamePaused) return;

        super.preUpdate(time, delta);
        this.updateLayers();

        if (this.x !== this.danmaku.x || this.y !== this.danmaku.y) {
            this.danmaku.follow(this);
        };
        if (this.x !== this.hp.x || this.y !== this.hp.y) {
            this.hp.move(this.x, this.y);
        };

        velocityX = 0; velocityY = 0;

        if (!this.keyInitialized) {
            this.keyW = this.scene.input.keyboard.addKey('W');
            this.keyA = this.scene.input.keyboard.addKey('A');
            this.keyS = this.scene.input.keyboard.addKey('S');
            this.keyD = this.scene.input.keyboard.addKey('D');
            this.keyUp    = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.keyLeft  = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.keyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.keyDown  = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this.keyShift         = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
            this.keyAbility       = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.keyAbilitySwitch = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);   

            if (isMobile) {
                this.scene.input.on('pointerdown', (pointer) => {
                    if (this.active && (this.x !== pointer.x || this.y !== pointer.y)) {
                        this.setPosition(pointer.x, pointer.y);
                    };
                });
                this.scene.input.on('pointermove', (pointer) => {
                    if (this.active && (this.x !== pointer.x || this.y !== pointer.y)) {
                        this.setPosition(pointer.x, pointer.y);
                    };
                });
            };

            this.keyInitialized = true;
        };

        if (this.scene.mouseMovement) {
            let pointer = this.scene.input.activePointer;
            if (this.x !== pointer.x || this.y !== pointer.y) {
                this.setPosition(pointer.x, pointer.y);
            };
        };

        if (this.keyW?.isDown || this.keyUp?.isDown) {
            velocityY = (this.keyShift?.isDown)
                ? -this.speed / 3
                : -this.speed;
        };
        if (this.keyA?.isDown || this.keyLeft?.isDown) {
            velocityX = (this.keyShift?.isDown)
                ? -this.speed / 3
                : -this.speed;
        };
        if (this.keyS?.isDown || this.keyRight?.isDown) {
            velocityY = (this.keyShift?.isDown)
                ? this.speed / 3
                : this.speed;
        };
        if (this.keyD?.isDown || this.keyDown?.isDown) {
            velocityX = (this.keyShift?.isDown)
                ? this.speed / 3
                : this.speed;
        };

        if (velocityX !== this.body.velocity.x) {
            this.setVelocityX(velocityX);
        };
        if (velocityY !== this.body.velocity.y) {
            this.setVelocityY(velocityY);
        };

        if (velocityX !== 0 || velocityY !== 0) {
            this.direction.set(velocityX, velocityY).normalize();
        };

        if (this.active) {
            if (this.keyShift?.isDown && !this.sneakInitialized) {
                this.sneakInitialized = true;
                this.danmaku.resetDanmaku(this.scene);
                this.danmaku.setProperties(this.scene, this.weapons[1]);
                this.danmaku.startUpDanmaku(this.scene);
            } else if (!this.keyShift?.isDown && this.sneakInitialized) {
                this.sneakInitialized = false;
                this.danmaku.resetDanmaku(this.scene);
                this.danmaku.setProperties(this.scene, this.weapons[0]);
                this.danmaku.startUpDanmaku(this.scene);
            };

            const calcFireRate = this.fireRate - ((this.dex * 10) + this.addedFireRate);
            if (time > this.bulletLastFired + calcFireRate) {
                this.bulletLastFired = time;

                const aimAngle = Phaser.Math.Angle.Between(0, 0, this.direction.x, this.direction.y);

                for (let i = 0; i < this.projectiles; i++) {
                    let calcRadians = this.projectileRadians[i];
                    this.danmaku.setRotation(aimAngle + calcRadians);

                    this.danmaku.fireDanmaku(this.scene);
                };
            };
        };
        
        if (Object.keys(this.abilities).length !== 0) {
            for (let abilityName in this.abilities) {
                let abilityData = this.abilities[abilityName];

                if (abilityData.timer === abilityData.cooldown) continue;
                
                abilityData.timer += delta / 1000;
                if (abilityData.timer > abilityData.cooldown) abilityData.timer = abilityData.cooldown;
            };

            const abilityData = this.abilities[this.ability];

            if (
                (this.keyAbility?.isDown || this.mobileAbility)
                && abilityData
                && abilityData.timer >= abilityData.cooldown
            ) {
                if (!this.ability) return;

                const abilityFunction = this.ability.replace(/^./, (char) => char.toLowerCase())
                                                    .replace(/\s(.)/g, (_, char) => char.toUpperCase());

                this[abilityFunction]?.(this.projectiles);
                abilityData.timer = 0;
            };

            if (Phaser.Input.Keyboard.JustDown(this.keyAbilitySwitch)
                && Object.keys(this.abilities).length > 0) {
                let keysAbilities = Object.keys(this.abilities);
                this.abilityIndex++;

                if (this.abilityIndex >= keysAbilities.length) {
                    this.abilityIndex = 0;
                };

                this.ability = keysAbilities[this.abilityIndex];
                this.scene.textCurrentAbility.setText(this.ability);
            };
        };
    };

    equip(slot, texture) {
        let layer = this.layers[slot];

        if (layer) {
            layer.setTexture(texture);
        } else {
            layer = this.scene.add.sprite(this.x, this.y, texture);
            layer.setDisplaySize(this.displayWidth, this.displayHeight);
            this.layers[slot] = layer;
        };

        layer.setDepth(this.depth + 1);
        layer.setVisible(true);
    };

    unequip(slot) {
        const layer = this.layers[slot];

        if (!layer) return;

        layer.setVisible(false);
    };

    updateLayers() {
        for (const layer of Object.values(this.layers)) {
            if (!layer) continue;

            layer.setPosition(this.x, this.y);
            layer.setDepth(this.depth + 1);
        };
    };

    generateRadians(count) {
        const result = [];
        const full = 2 * Math.PI;
        const bits = Math.ceil(Math.log2(count));

        for (let i = 0; i < count; i++) {
            let reversed = 0;

            for (let b = 0; b < bits; b++) {
                if (i & (1 << b)) {
                    reversed |= 1 << (bits - 1 - b);
                };
            };

            result.push((reversed / count) * full);
        };

        return result;
    };

    updateStat(stat, amount) {
        switch (stat) {
            case 'fire rate':
                this.addedFireRate += amount * 10;
                break;
            case 'health':
                this.hp.updateGameValue(amount);
                break;
            case 'multi':
                this.projectiles += amount;
                break;
            case 'speed':
                this.speed += amount * 10;
                break;
            default:
                break;
        };
    };

    addExp(amount) {
        this.exp += amount;

        let levelUpCount = 0;
        while (this.exp >= this.neededExp) {
            this.exp -= this.neededExp;
            this.level++;
            this.neededExp = this.calculateNeededExp();
            
            levelUpCount++;
        };
        return levelUpCount;
    };

    calculateNeededExp() {
        return Math.floor(
            20                                /// Base increase
            + (this.level * 6)                /// Linear scaling
            + ((this.level * this.level) * 3) /// Quadratic scaling
        );
    };

    setAbilities() {
        this.abilities = {};

        for (let ability of this.abilitiesRaw) {
            switch (ability) {
                case 'Places a grass block':
                case 'Redirects every attack against the user back to the attacker':
                case 'Slashes in a large radius':
                case 'Fires a wave': {
                    const abilityData = dataItems[ability];
                    this.ability = abilityData.name;
                    this.abilityCooldown = abilityData.cooldown;
                    break;
                };
                case 'Decreases the enemy morale': {
                    this.scene.debuffs.push('morale');
                    break;
                };
                default: { break; };
            };

            if (this.abilities[this.ability] === undefined) {
                const calcCooldown = this.abilityCooldown - (0.1 * Math.pow(1.5, this.int));

                this.abilities[this.ability] = {
                    cooldown: calcCooldown,
                    timer: calcCooldown
                };
            };
        };

        this.abilityIndex = Object.keys(this.abilities).length;
        this.abilitiesRaw.length = 0;

        this.scene.textCurrentAbility.setText(this.ability);
    };

    dead() {
        this.active = false;

        if (this.body) {
            this.body.enable = false;
        };

        this.hp.draw();
    };

    revive() {
        this.active = true;
        this.body.enable = true;

        this.hp.reset();

        this.abilityTimer = this.abilityCooldown;

        this.exp = 0;
        this.level = 1;
        this.neededExp = this.calculateNeededExp();

        this.addedFireRate = 0;
        this.projectiles = 1;
        this.speed = 300;
    };

    stopMoving() {
        this.isGamePaused = true;
        this.setVelocity(0);
    };

    startMoving() {
        this.isGamePaused = false;
    };

    getAbilityVelocity(speed) {
        return {
            x: this.direction.x * speed,
            y: this.direction.y * speed
        };
    };

    applyDirectionToAbility(ability, {
        speed = 0,
        rotationOffset = 0,
        applyVelocity = true,
    } = {}) {
        const directionCloned = this.direction.clone();

        if (directionCloned.lengthSq() === 0) {
            directionCloned.set(0, -1);
        };

        const angle = Phaser.Math.Angle.Between(0, 0, directionCloned.x, directionCloned.y);

        ability.setRotation(angle + rotationOffset);

        if (applyVelocity) {
            ability.setVelocity(directionCloned.x * speed, directionCloned.y * speed);
        };
    };

    grassBlock(amount) {
        const radians = this.projectileRadians;
        const baseAngle = Phaser.Math.Angle.Between(0., 0, this.direction.x, this.direction.y);

        for (let i = 0; i < amount; i++) {
            let block = this.scene.playerAbilities.getChildren().find(
                (ability) => (ability.name === 'grassBlock') && !ability.active
            );

            if (block) {
                block.enableBody(true, this.x, this.y - this.height / 2, true, true);
            } else {
                block = new Ability(this.scene, 'grassBlock', 'grass-block', this.x, this.y - this.height / 2, {
                    healthXOffset: 4.5,
                    sponge: true
                });
                this.scene.playerAbilities.add(block);
            };

            const angle = (i === 0) ? baseAngle : baseAngle + radians[i % radians.length];
            const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();

            block.setPosition(this.x + direction.x * abilityDistance, this.y + direction.y * abilityDistance);
        };
    };

    codeOfHammurabi(amount) {
        const radians = this.projectileRadians;
        const baseAngle = Phaser.Math.Angle.Between(0., 0, this.direction.x, this.direction.y);

        for (let i = 0; i < amount; i++) {
            let ability = this.scene.playerAbilities.getChildren().find(
                (ability) => (ability.name === 'codeOfHammurabi') && !ability.active
            );

            if (ability) {
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);
            } else {
                ability = new Ability(this.scene, 'codeOfHammurabi', 'code-of-hammurabi', this.x, this.y - this.height / 2, {
                    healthXOffset: 3,
                    sponge: true,
                    reflect: true
                });
                this.scene.playerAbilities.add(ability);
            };

            const angle = (i === 0) ? baseAngle : baseAngle + radians[i % radians.length];
            const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();

            ability.setPosition(this.x + direction.x * abilityDistance, this.y + direction.y * abilityDistance);
        };
    };

    restInPeace(amount) {
        const radians = this.projectileRadians;
        const baseAngle = Phaser.Math.Angle.Between(0., 0, this.direction.x, this.direction.y);

        for (let i = 0; i < amount; i++) {
            let slash = this.scene.playerAbilities.getChildren().find(
                (ability) => (ability.name === 'restInPeace') && this.scene.tweens.isTweening(ability)
            );

            if (slash) {
                slash.enableBody(true, this.x, this.y - this.height / 2, true, true);
                slash.anims.play('rest-in-peace', true);
            } else {
                slash = new Ability(this.scene, 'restInPeace', 'rest-in-peace-0', this.x, this.y - this.height / 2, {
                    attack: true
                });

                slash.anims.create({
                    key: 'rest-in-peace',
                    frames: this.anims.generateFrameNames('abilities-atlas', {
                        prefix: 'rest-in-peace-',
                        end: 4
                    }),
                    frameRate: 12
                });

                slash.on('animationcomplete', () => {
                    this.scene.tweens.add({
                        targets: slash,
                        alpha: 0,
                        duration: 200,
                        onComplete: () => {
                            slash.setAlpha(1);
                            slash.kill();
                        },
                    });
                });

                this.scene.playerAbilities.add(slash);
                slash.anims.play('rest-in-peace', true);
            };

            const angle = (i === 0) ? baseAngle : baseAngle + radians[i % radians.length];
            const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();

            const slashX = this.x + direction.x * abilityDistance;
            const slashY = this.y + direction.y * abilityDistance;
            slash.setPosition(slashX, slashY);

            const prevDirection = this.direction.clone();
            this.direction = direction;
            this.applyDirectionToAbility(slash, {
                applyVelocity: false,
                rotationOffset: Math.PI / 2
            });
            this.direction = prevDirection;

            const handsNeeded = 7;
            const abilityAdditions = this.scene.playerAbilitiesAdditions.getChildren();
            const slashCenter = slash.getCenter();

            for (let j = 1; j < handsNeeded; j++) {
                let hand = abilityAdditions.find(
                    (ability) => (ability.name === 'restInPeaceHand') && !ability.active
                );

                if (hand) {
                    hand.setActive(true)
                        .setVisible(true);
                } else {
                    hand = this.scene.add.sprite(0, 0, 'abilities-atlas', 'rest-in-peace-hand')
                        .setActive(true)
                        .setVisible(true)
                        .setName('restInPeaceHand')
                        .setDepth(9);
                    hand.addition = true;
                    this.scene.playerAbilitiesAdditions.add(hand);
                };

                const handDistance = 100 * j;

                const perp = new Phaser.Math.Vector2(-direction.y, direction.x);
                const offset = Phaser.Math.Between(-40, 40);

                hand.x = slashCenter.x + direction.x * handDistance + perp.x * offset;
                hand.y = slashCenter.y + direction.y * handDistance + perp.y * offset;

                this.scene.tweens.add({
                    targets: hand,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        hand.setAlpha(1);
                        hand.setActive(false);
                        hand.setVisible(false);
                    }
                });
            };
        };
    };

    oceanicTerror(amount) {
        const radians = this.projectileRadians;
        const baseAngle = Phaser.Math.Angle.Between(0., 0, this.direction.x, this.direction.y);

        for (let i = 0; i < amount; i++) {
            let wave = this.scene.playerAbilities.getChildren().find(
                (ability) => ability.name === 'oceanicTerror' && !ability.active
            );

            if (wave) {
                wave.enableBody(true, this.x, this.y - this.height / 2, true, true);
            } else {
                wave = new Ability(this.scene, 'oceanicTerror', 'oceanic-terror-wave', this.x, this.y - this.height / 2, {
                    attack: true
                });
                this.scene.playerAbilities.add(wave);

                const timeEvent = this.scene.time.addEvent({
                    delay: 500,
                    loop: true,
                    callback: this.oceanicTerrorSpawnSeaCritter,
                    callbackScope: this,
                    args: [wave, this.scene.playerAbilitiesTimeEvents.length]
                });
                this.scene.playerAbilitiesTimeEvents.push(timeEvent);    
            };

            const angle = (i === 0) ? baseAngle : baseAngle + radians[i % radians.length];
            const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();

            const waveX = this.x + direction.x * abilityDistance;
            const waveY = this.y + direction.y * abilityDistance;
            wave.setPosition(waveX, waveY);

            const prevDirection = this.direction.clone();
            this.direction = direction;

            this.applyDirectionToAbility(wave, {
                speed: 300,
                rotationOffset: Math.PI / 2
            });

            this.direction = prevDirection;
        };
    };
    oceanicTerrorSpawnSeaCritter(wave, timeEventIndex) {
        if (wave.y < 0) {
            this.scene.playerAbilitiesTimeEvents[timeEventIndex].paused = true;
            return;
        };

        const chiocesSeaCritters = ['fish', 'shark', 'tentacle'];
        const randomSeaCritter = chiocesSeaCritters[Math.floor(Math.random() * chiocesSeaCritters.length)];
        const nameSeaCritter = `oceanicTerrorSeaCritter${randomSeaCritter.replace(/^./, (char) => char.toUpperCase())}`;

        let seaCritter = this.scene.playerAbilitiesAdditions.getChildren().find(
            ability => (ability.name === nameSeaCritter) && !ability.active
        );

        const wavePositionLeft = wave.getTopLeft();
        const wavePositionRight = wave.getTopRight();
        const randomX = Phaser.Math.Between(wavePositionLeft.x, wavePositionRight.x);

        if (seaCritter) {
            seaCritter.setActive(true)
                      .setVisible(true)
                      .setPosition(randomX, wave.y);
        } else {
            seaCritter = this.scene.add.sprite(randomX, wave.y, 'abilities-atlas', `oceanic-terror-${randomSeaCritter}`)
                .setName(nameSeaCritter);
            seaCritter.addition = true;
            this.scene.playerAbilitiesAdditions.add(seaCritter);
        };

        this.scene.tweens.add({
            targets: seaCritter,
            scale: 0,
            duration: 5000,
            onComplete: () => {
                seaCritter.setScale(1);
                seaCritter.setActive(false);
                seaCritter.setVisible(false);
            }
        });
    };
};