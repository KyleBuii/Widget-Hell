import Phaser from 'phaser';
import { Ability } from './Ability.jsx';
import { Danmaku } from './Danmaku.jsx';

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

        this.exp = 0;
        this.level = 1;
        this.neededExp = this.calculateNeededExp();

        this.speed = 300;

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
            this.keyUp = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.keyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.keyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.keyDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
            this.keyAbility = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
            if (time > this.bulletLastFired + (300 - (this.dex * 10))) {
                this.bulletLastFired = time;

                const aimAngle = Phaser.Math.Angle.Between(0, 0, this.direction.x, this.direction.y);
                this.danmaku.setRotation(aimAngle);
                this.danmaku.fireDanmaku(this.scene);
            };
        };
        
        if (Object.keys(this.abilities).length !== 0) {
            if (this.abilityTimer < this.abilityCooldown) {
                this.abilityTimer += delta / 1000;
            };
            if ((this.keyAbility?.isDown || this.mobileAbility) && this.abilityTimer >= this.abilityCooldown) {
                if (!this.ability) return;

                this[this.ability]();
                this.abilityTimer = 0;
            };
            if (Phaser.Input.Keyboard.JustDown(this.keyAbilitySwitch)
                && Object.keys(this.abilities).length > 0) {
                let keysAbilities = Object.keys(this.abilities);
                this.abilityIndex++;
                if (this.abilityIndex >= keysAbilities.length) {
                    this.abilityIndex = 0;
                };
                this.ability = keysAbilities[this.abilityIndex];
                this.abilityCooldown = this.abilities[keysAbilities[this.abilityIndex]];
                this.scene.textCurrentAbility.setText(
                    this.ability.replace(/^./, (char) => char.toUpperCase())
                        .replace(/([A-Z])/g, " $1").trim()
                );
            };
        };
    };

    updateStat(stat, amount = 1) {
        const formattedStat = stat.toLowerCase().replace(' ', '-');
        switch (formattedStat) {
            case 'health':
                // this.hp.updateGameValue(amount);
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
        for (let ability of this.abilitiesRaw) {
            switch (ability) {
                case "Places a grass block":
                    this.ability = "grassBlock";
                    this.abilityCooldown = 60;
                    break;
                case "Redirects every attack against the user back to the attacker":
                    this.ability = "codeOfHammurabi";
                    this.abilityCooldown = 60;
                    break;
                case "Decreases the enemy morale":
                    this.scene.debuffs.push("morale");
                    break;
                case "Slashes in a large radius":
                    this.ability = "restInPeace";
                    this.abilityCooldown = 1;
                    break;
                case "Fires a wave":
                    this.ability = "oceanicTerror";
                    this.abilityCooldown = 1;
                    break;
                default: break;
            };

            if (Object.keys(this.abilities).find((ability) => ability === this.ability) === undefined) {
                this.abilities[this.ability] = this.abilityCooldown;
                this.abilityCooldown = this.abilityCooldown - (0.1 * Math.pow(1.5, this.int));
                this.abilityTimer = this.abilityCooldown;
            };
        };

        this.abilityIndex = Object.keys(this.abilities).length;
        this.abilitiesRaw.length = 0;
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

    grassBlock() {
        if (this.scene.playerAbilities.getChildren().find((ability) => {
            if (ability.name === "grassBlock") {
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);
                return true;
            };
        }) === undefined) {
            this.scene.playerAbilities.add(
                new Ability(this.scene, "grassBlock", "grass-block", this.x, this.y - this.height / 2, {
                    healthXOffset: 4.5,
                    sponge: true
                })
            );
        };
    };

    codeOfHammurabi() {
        if (this.scene.playerAbilities.getChildren().find((ability) => {
            if (ability.name === "codeOfHammurabi") {
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);
                return true;
            };
        }) === undefined) {
            this.scene.playerAbilities.add(
                new Ability(this.scene, "codeOfHammurabi", "code-of-hammurabi", this.x, this.y - this.height / 2, {
                    healthXOffset: 3,
                    sponge: true,
                    reflect: true
                })
            );
        };
    };

    restInPeace() {
        if (this.scene.playerAbilities.getChildren().find((ability) => {
            if ((ability.name === "restInPeace") && (this.scene.tweens.isTweening(ability))) {
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);
                ability.anims.play("rest-in-peace", true);
                let abilityAdditions = this.scene.playerAbilitiesAdditions.getChildren();
                this.applyDirectionToAbility(ability, {
                    applyVelocity: false,
                    rotationOffset: Math.PI / 2
                });

                let count = 1;
                loop: for (let i = 0; i < abilityAdditions.length; i++) {
                    if (abilityAdditions[i].name === "restInPeaceHand") {
                        if (count > 7) break loop;
                        let abilityPositionLeft = ability.getTopLeft();
                        let abilityPositionRight = ability.getTopRight();
                        let randomX = Phaser.Math.Between(abilityPositionLeft.x, abilityPositionRight.x);
                        abilityAdditions[i]
                            .setVisible(true)
                            .setActive(true);
                        abilityAdditions[i].x = randomX;
                        abilityAdditions[i].y = abilityPositionLeft.y - (100 * count);
                        if (abilityAdditions[i].y < -100) break loop;
                        count++;
                        this.scene.tweens.add({
                            targets: abilityAdditions[i],
                            alpha: 0,
                            duration: 1000,
                            onComplete: () => {
                                abilityAdditions[i].setAlpha(1);
                                abilityAdditions[i].setActive(false);
                                abilityAdditions[i].setVisible(false);
                            }
                        });        
                    };
                };
                return true;
            };
        }) === undefined) {
            let slash = new Ability(this.scene, "restInPeace", "rest-in-peace-0", this.x, this.y - this.height / 2, {
                attack: true
            });

            this.applyDirectionToAbility(slash, {
                applyVelocity: false,
                rotationOffset: Math.PI / 2
            });

            slash.anims.create({
                key: 'rest-in-peace',
                frames: this.anims.generateFrameNames('abilities-atlas', {
                    prefix: 'rest-in-peace-',
                    end: 4
                }),
                frameRate: 12
            });

            slash.on("animationcomplete", () => {
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

            slash.anims.play("rest-in-peace", true);
            this.scene.playerAbilities.add(slash);

            for (let i = 1; i <= 14; i++) {
                const hand = this.scene.add.sprite(0, 0, "abilities-atlas", "rest-in-peace-hand")
                    .setActive(true)
                    .setVisible(true)
                    .setName("restInPeaceHand")
                    .setDepth(9);

                hand.addition = true;
                this.scene.playerAbilitiesAdditions.add(hand);

                if (i <= 7) {
                    const directionCloned = this.direction.clone();
                    if (directionCloned.lengthSq() === 0) directionCloned.set(0, -1);

                    const isVertical = Math.abs(directionCloned.y) >= Math.abs(directionCloned.x);

                    let slashPositionLeft = slash.getTopLeft();
                    let slashPositionRight = slash.getTopRight();

                    let randomX = 0;
                    let randomY = 0;
                    if (isVertical) {
                        randomX = Phaser.Math.Between(slashPositionLeft.x, slashPositionRight.x);
                        
                        hand.x = randomX;
                        hand.y = slashPositionLeft.y + (directionCloned.y * 100 * i);
                    } else {
                        randomY = Phaser.Math.Between(slash.y - slash.displayHeight / 2, slash.y + slash.displayHeight / 2);

                        hand.x = slash.x + (directionCloned.x * 100 * i);
                        hand.y = randomY;
                    };

                    if (hand.y < -100 || hand.x < -100) {
                        hand.setActive(false).setVisible(false);
                    } else {
                        this.scene.tweens.add({
                            targets: hand,
                            alpha: 0,
                            duration: 1000,
                            onComplete: () => {
                                hand.setActive(false);
                                hand.setVisible(false);
                                hand.setAlpha(1);
                            }
                        });
                    };
                } else {
                    hand.setActive(false).setVisible(false);
                };
            };
        };
    };

    oceanicTerror() {
        if (this.scene.playerAbilities.getChildren().find((ability) => {
            if ((ability.name === "oceanicTerror" && !ability.active)) {
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);

                this.applyDirectionToAbility(ability, {
                    speed: 300,
                    rotationOffset: Math.PI / 2
                });

                if (this.scene.playerAbilitiesTimeEvents.find((timeEvent, index) => {
                    if ((timeEvent.callback.name === "oceanicTerrorSpawnSeaCritter")
                        && timeEvent.paused) {
                        timeEvent.args = [
                            ability,
                            index
                        ];
                        timeEvent.paused = false;
                        return true;
                    };
                }));
                return true;
            };
        }) === undefined) {
            for (let i = 0; i < 4; i++) {
                let wave = new Ability(this.scene, "oceanicTerror", "oceanic-terror-wave", this.x, this.y - this.height / 2, {
                    attack: true
                });
                this.scene.playerAbilities.add(wave);
                let timeEvent = this.scene.time.addEvent({
                    delay: 500,
                    loop: true,
                    callback: this.oceanicTerrorSpawnSeaCritter,
                    callbackScope: this,
                    args: [wave, this.scene.playerAbilitiesTimeEvents.length]
                });
                this.scene.playerAbilitiesTimeEvents.push(timeEvent);    
                if (i === 0) {
                    timeEvent.paused = false;
                    this.applyDirectionToAbility(wave, {
                        speed: 300,
                        rotationOffset: Math.PI / 2
                    });
                } else {
                    wave.kill();
                    timeEvent.paused = true;  
                };;
            };
        };
    };
    oceanicTerrorSpawnSeaCritter(wave, timeEventIndex) {
        if (wave.y < 0) {
            this.scene.playerAbilitiesTimeEvents[timeEventIndex].paused = true;
        };
        let chiocesSeaCritters = ["fish", "shark", "tentacle"];
        let randomSeaCritter = chiocesSeaCritters[Math.floor(Math.random() * chiocesSeaCritters.length)];
        if (this.scene.playerAbilitiesAdditions.getChildren().find((ability) => {
            if ((ability.name === `oceanicTerrorSeaCritter${randomSeaCritter.replace(/^./, (char) => char.toUpperCase())}`) && !ability.active) {
                let wavePositionLeft = wave.getTopLeft();
                let wavePositionRight = wave.getTopRight();
                let randomX = Phaser.Math.Between(wavePositionLeft.x, wavePositionRight.x);
                ability.setActive(true)
                    .setVisible(true)
                    .setPosition(randomX, wave.y);
                this.scene.tweens.add({
                    targets: ability,
                    scale: 0,
                    duration: 5000,
                    onComplete: () => {
                        ability.setScale(1);
                        ability.setActive(false);
                        ability.setVisible(false);
                    }
                });        
                return true;
            };
        }) === undefined) {
            let wavePositionLeft = wave.getTopLeft();
            let wavePositionRight = wave.getTopRight();
            let randomX = Phaser.Math.Between(wavePositionLeft.x, wavePositionRight.x);
            let seaCritter = this.scene.add.sprite(randomX, wave.y, "abilities-atlas", `oceanic-terror-${randomSeaCritter}`)
                .setName(`oceanicTerrorSeaCritter${randomSeaCritter.replace(/^./, (char) => char.toUpperCase())}`);
            seaCritter.addition = true;
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
            this.scene.playerAbilitiesAdditions.add(seaCritter);

        };
    };
};