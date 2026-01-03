/* eslint-disable no-undef */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Boss } from '../utility/Boss.jsx';
import { Bullets } from '../utility/Bullets.jsx';
import { Enemy } from '../utility/Enemy.jsx';
import { HealthBar } from '../utility/HealthBar.jsx';
import { Player } from '../utility/Player.jsx';

//#region z-index guide
/*
1 - Enemy
2 - Menu
3 - Player bullets / Ability bullets
4 - Boss
5 - Player / Hit effects
6 - Health
7 - Boss bullets
8 - Bomb
9 - Abilities / Abilities additions
*/
//#endregion

const WIDTH = 850;
const HEIGHT = 600;
const enemies = {
    yupina: {
        health: 10,
        defense: 0,
        speed: 1.5,
    }
};

export class GameScreen extends Scene {
    constructor() {
        super('Game');
        this.mouseMovement = false;
        this.isMobile = false;
        this.player = null;
        this.boss = null;
        this.debuffs = [];
    };

    create() {
        if ('maxTouchPoints' in navigator) {
            this.isMobile = navigator.maxTouchPoints > 0;
        };
        this.createMenu();
        this.createPlayer();
        this.createEnemy();
        this.createBoss();
        this.createColliders();
        EventBus.once('data', (data) => {
            this.setData(data);
        });
        EventBus.emit('current-scene-ready', this);
    };

    createMenu() {
        this.buttonContainer = this.add.image(95, 72, "box")
            .setDepth(2)
            .setDisplaySize(165, 105)
            .setAlpha(0.8);
        this.buttonPlay = this.add.image(95, 50, "button")
            .setDepth(2)
            .setDisplaySize(140, 40)
            .setInteractive()
            .on('pointerdown', () => {
                this.toggleMenu(true);
                this.spawnBoss();
            });
        this.textPlay = this.add.text(this.buttonPlay.x, this.buttonPlay.y, 'Play')
            .setDepth(2)
            .setOrigin(0.5);
        this.buttonReturn = this.add.image(95, 50, "button")
            .setVisible(false)
            .setDepth(2)
            .setDisplaySize(140, 40)
            .setInteractive()
            .on('pointerdown', () => {
                this.boss.danmaku.resetDanmaku(this);
                this.bossBullets.getMatching("active", true).forEach((bullet) => {
                    bullet.remove();
                });
                this.bossBulletsEmitter.stop();
                this.bossBulletsEmitter.forEachAlive((particle) => {
                    particle.kill();
                });
                this.boss.kill(true);
                this.spawnEnemy();
                this.time.delayedCall(1000, this.spawnEnemy, [], this);
                this.time.delayedCall(2000, this.spawnEnemy, [], this);        
                this.toggleMenu(false);
                this.player.revive();
                this.playerAbilities.getChildren().forEach((ability) => {
                    ability.kill();
                });
            });
        this.textReturn = this.add.text(this.buttonPlay.x, this.buttonPlay.y, 'Return')
            .setVisible(false)
            .setDepth(2)
            .setOrigin(0.5);
        this.buttonMouseMovement = this.add.image(95, 95, "button")
            .setDepth(2)
            .setDisplaySize(140, 40)
            .setInteractive()
            .on('pointerdown', () => {
                if (!this.isMobile) {
                    this.mouseMovement = !this.mouseMovement;
                };
            });
        this.textMouseMovement = this.add.text(this.buttonMouseMovement.x, this.buttonMouseMovement.y, 'Mouse')
            .setDepth(2)
            .setOrigin(0.5);
        this.textCurrentAbility = this.add.text(580, 830, "")
            .setDepth(2)
            .setOrigin(1);
        if (this.isMobile) {
            this.buttonAbility = this.add.image(60, 810, "button")
                .setDepth(2)
                .setDisplaySize(85, 40)
                .setInteractive()
                .on('pointerdown', () => {
                    this.player.mobileAbility = true;
                })
                .on('pointerup', () => {
                    this.player.mobileAbility = false;
                });
            this.textAbility = this.add.text(this.buttonAbility.x, this.buttonAbility.y, 'Ability')
                .setDepth(2)
                .setOrigin(0.5);
            this.buttonAbilitySwitch = this.add.image(60, 760, "button")
                .setDepth(2)
                .setDisplaySize(85, 40)
                .setInteractive()
                .on('pointerdown', () => {
                    this.player.mobileAbility = true;
                })
                .on('pointerup', () => {
                    this.player.mobileAbility = false;
                });
            this.textAbilitySwitch = this.add.text(this.buttonAbilitySwitch.x, this.buttonAbilitySwitch.y, 'Switch')
                .setDepth(2)
                .setOrigin(0.5);
        };
    };

    toggleMenu(isHide, isGameover = false) {
        if (isHide) {
            this.enemies.getChildren().forEach((enemy) => {
                enemy.kill();
                this.time.removeAllEvents();
            });
            this.enemies.getChildren().forEach((enemy) => {
                enemy.kill();
                this.time.removeAllEvents();
            });
            this.buttonContainer.setVisible(false);
            this.buttonPlay.setVisible(false);
            this.textPlay.setVisible(false);
            this.buttonMouseMovement.setVisible(false);
            this.textMouseMovement.setVisible(false);
        } else {
            if (isGameover) {
                this.buttonReturn.setVisible(true);
                this.textReturn.setVisible(true);
            } else {
                this.buttonReturn.setVisible(false);
                this.textReturn.setVisible(false);  
            };
            this.buttonContainer.setVisible(true);
            this.buttonPlay.setVisible(true);
            this.textPlay.setVisible(true);
            this.buttonMouseMovement.setVisible(true);
            this.textMouseMovement.setVisible(true);
        };
    };

    createPlayer() {
        this.playerBullets = new Bullets(this, 100)
            .setDepth(3);
        this.playerAbilities = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
        }).setDepth(9);
        this.playerAbilitiesBullets = new Bullets(this, 100)
            .setDepth(3);
        this.playerAbilitiesHits = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 10,
            setDepth: 5
        });
        this.playerAbilitiesAdditions = this.physics.add.group({ classType: Phaser.GameObjects.Sprite })
            .setDepth(9);
        this.playerAbilitiesTimeEvents = [];
        this.player = new Player(this, 'player-default', WIDTH / 2, HEIGHT - 100, this.playerBullets, this.playerAbilitiesBullets)
            .setOffset(37, 60);
    };

    createEnemy() {
        this.enemies = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
        this.spawnEnemy();
        this.time.delayedCall(1000, this.spawnEnemy, [], this);
        this.time.delayedCall(2000, this.spawnEnemy, [], this);
    };

    createBoss() {
        const playerCollider = {
            contains: (x, y) => {
                let hit = false;
                if (this.player.body.hitTest(x, y)) {
                    hit = true;
                    this.damagePlayer(this.player, 1);
                };
                return hit;
            }
        };
        this.bossBulletsEmitter = this.add.particles(0, 0, "bullet-atlas", {
            x: WIDTH / 2,
            y: 200,
            frame: "circle-blue",
            lifespan: Infinity,
            speed: { min: 100, max: 300 },
            quantity: 20,
            frequency: 100,
            deathZone: [
                {
                    type: 'onEnter',
                    source: playerCollider
                },
                {
                    type: 'onLeave',
                    source: new Phaser.Geom.Rectangle(0, 0, WIDTH, HEIGHT)
                }
            ]
        }).setDepth(7);
        this.bossBulletsEmitter.stop();
        this.bossBullets = new Bullets(this, 5000)
            .setDepth(7);
        this.bossBombs = this.physics.add.group({ classType: Phaser.GameObjects.Sprite })
            .setDepth(8);
    };

    createColliders() {
        this.anchorOutside = this.physics.add.sprite(WIDTH / 2, -100)
            .setSize(WIDTH, 1)
            .setPushable(false);
        this.anchorBoss = this.physics.add.sprite(WIDTH / 2, 280)
            .setPushable(false);
        this.physics.add.collider(this.playerAbilities, this.anchorOutside, (anchor, ability) => {
            switch (ability.name) {
                case "oceanicTerror":
                    ability.kill();
                    break;
                default: break;
            };
        });
        this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
            this.playerHitCallback(bullet, player);
        });
        this.physics.add.overlap(this.player, this.bossBullets, (player, bullet) => {
            this.playerHitCallback(bullet, player);
        });
        this.physics.add.overlap(this.enemies, this.playerBullets, (enemy, bullet) => {
            this.enemyHitCallback(bullet, enemy);
        });
        this.physics.add.overlap(this.enemies, this.playerAbilitiesBullets, (enemy, bullet) => {
            this.enemyHitCallback(bullet, enemy);
        });
        this.physics.add.overlap(this.enemies, this.playerAbilities, (enemy, ability) => {
            this.enemyHitCallback(ability, enemy);
        });
        this.physics.add.overlap(this.enemies, this.playerAbilitiesAdditions, (enemy, addition) => {
            this.enemyHitCallback(addition, enemy);
        });
        this.physics.add.overlap(this.playerAbilities, this.bossBullets, (ability, bullet) => {
            this.abilityHitCallback(bullet, ability);
        });
    };

    spawnEnemy() {
        let enemiesKeys = Object.keys(enemies);
        let randomEnemy = enemiesKeys[Math.floor(Math.random() * enemiesKeys.length)];
        let randomX = Math.random() * 500 + 100;
        let enemy = new Enemy(
            this,
            randomEnemy,
            randomX, 0,
            enemies[randomEnemy].health,
            enemies[randomEnemy].defense,
            enemies[randomEnemy].speed,
            enemies[randomEnemy]?.healthXOffset
        );
        this.enemies.add(enemy);
    };

    spawnBoss() {
        let randomBoss = Math.floor(Math.random() * 15 + 1);
        this.boss = new Boss(
            1, 200, 1, this.bossBullets, this, `boss-${randomBoss}`,
            WIDTH / 2, 0, 1000, 0, 100
        );
        if (this.debuffs.length !== 0) {
            this.debuffs.forEach((debuff) => {
                this.boss.debuff(debuff);
            });
        };
        this.physics.add.overlap(this.boss, this.player, (boss, player) => {
            if (player.hp.decrease(1)) {
                player.dead();
                this.clearScreen();
            };
        });
        this.physics.add.overlap(this.boss, this.playerBullets, (boss, bullet) => {
            this.enemyHitCallback(bullet, boss);
        });
        this.physics.add.overlap(this.boss, this.playerAbilitiesBullets, (boss, bullet) => {
            this.enemyHitCallback(bullet, boss);
        });
        this.physics.add.overlap(this.boss, this.playerAbilities, (boss, ability) => {
            this.enemyHitCallback(ability, boss);
        });
        this.physics.add.overlap(this.boss, this.playerAbilitiesAdditions, (boss, addition) => {
            this.enemyHitCallback(addition, boss);
        });
        this.physics.add.collider(this.boss, this.anchorBoss, (boss, anchor) => {
            boss.body.setVelocityY(0);
            boss.danmaku.setProperties(this, boss.danmakuPatterns[0]);
            boss.danmaku.follow(boss);
            this.bossBulletsEmitter.start();
            boss.ready = true;
        });
        this.physics.add.overlap(this.bossBombs, this.player, (player, bomb) => {
            bomb.destroy();
            if (((3 * Math.floor((this.bossBombs.getLength()) / 3)) === this.bossBombs.getLength())
                && this.boss.hp.decrease(100)) {
                this.boss.kill();
            };
        });
    };

    setData(data) {
        this.player.hp = new HealthBar(
            this,
            (data.stats.health < 10)
                ? 1
                : Math.floor(data.stats.health / 10),
            10, 11
        );
        this.player.mana = (data.stats.mana < 10) ? 1 : Math.floor(data.stats.mana / 10);
        this.player.atk = data.stats.attack;
        this.player.def = data.stats.defense;
        this.player.str = data.stats.strength;
        this.player.agi = data.stats.agility;
        this.player.vit = data.stats.vitality;
        this.player.res = data.stats.resilience;
        this.player.int = data.stats.intelligence;
        this.player.dex = data.stats.dexterity;
        this.player.lck = data.stats.luck;
        this.player.weapons.push(
            { name: "DEFAULT",
                danmakuConfig: {
                    type: "PARALLEL", countB: 1, 
                    angle: -90, 
                },
                cannonConfig: {
                    numberOfShots: 1,
                },
                bulletConfig: {
                    class: "NORMAL",
                    damage: this.player.atk,
                    speed: 300 + (this.player.str * 10),
                    frame: "circle-black",
                    alpha: 0.5
                }
            },
            { name: "SNEAK",
                danmakuConfig: {
                    type: "PARALLEL", countB: 1, 
                    angle: -90, 
                },
                cannonConfig: {   
                    numberOfShots: 1,
                },
                bulletConfig: {
                    class: "NORMAL",
                    damage: this.player.atk / 3,
                    speed: 300 + (this.player.str * 10),
                    frame: "circle-black",
                    alpha: 0.5
                }
            }
        );
        this.player.danmaku.setProperties(this.scene, this.player.weapons[0]);
        this.player.abilitiesRaw = [...data.abilities];
        this.player.setAbilities();
        this.textCurrentAbility.setText(
            (this.player.ability !== null)
                ? this.player.ability.replace(/^./, (char) => char.toUpperCase())
                    .replace(/([A-Z])/g, " $1").trim()
                : ""
        );
    };

    playerHitCallback(bullet, player) {
        if (bullet.active === true) {
            this.damagePlayer(player, bullet.damage);
            bullet.remove();
        };
    };
    
    abilityHitCallback(bullet, ability) {
        if (bullet.active === true) {
            if (ability.sponge) {
                if (ability.active && ability.hp.decrease(bullet.damage)) {
                    ability.kill();
                };
            };
            if (ability.reflect) {
                this.player.danmakuAbilities.resetDanmaku(this);
                this.player.danmakuAbilities.setProperties(this,
                    { name: "REFLECT",
                        danmakuConfig: {
                            type: "PARALLEL", countB: 1, 
                            angle: -90, 
                        },
                        cannonConfig: {
                            numberOfShots: 1,
                        },
                        bulletConfig: {
                            class: "NORMAL",
                            damage: bullet.damage,
                            speed: 200 + (this.player.str * 10),
                            frame: bullet.frame.name,
                            alpha: 0.5
                        }
                    }
                );
                this.player.danmakuAbilities.follow(ability);
                this.player.danmakuAbilities.fireDanmaku(this);
            };
            if (!ability.attack) {
                bullet.remove();
            };
        };    
    };

    enemyHitCallback(bullet, enemy) {
        if (bullet.active === true && enemy.active === true) {
            this.damageEnemy(enemy, (bullet.attack)
                ? this.player.atk
                : (bullet.addition)
                    ? this.player.atk / 4
                    : (bullet.damage || 0)
            );
            if (!bullet.attack && !bullet.sponge && !bullet.addition) {
                bullet.remove();
            };
            let hit;
            switch (bullet.name) {
                case "restInPeace":
                case "restInPeaceHand":
                    hit = this.playerAbilitiesHits.get(enemy.x, enemy.y, "abilities-atlas", "rest-in-peace-hit")
                        ?.setDepth(5);
                    if (hit) {
                        hit.setActive(true);
                        hit.setVisible(true);
                        this.tweens.add({
                            targets: hit,
                            alpha: 0,
                            duration: 100,
                            onComplete: () => {
                                hit.setAlpha(1);
                                hit.setActive(false);
                                hit.setVisible(false);
                            },
                        });
                    };   
                    break;
                case "oceanicTerror":
                    hit = this.playerAbilitiesHits.get(enemy.x, enemy.y, "abilities-atlas", "oceanic-terror-hit")
                        ?.setDepth(5);
                    if (hit) {
                        hit.setActive(true);
                        hit.setVisible(true);
                        this.tweens.add({
                            targets: hit,
                            alpha: 0,
                            duration: 100,
                            onComplete: () => {
                                hit.setAlpha(1);
                                hit.setActive(false);
                                hit.setVisible(false);
                            },
                        });
                    };   
                    break;
                default: break;
            };
        };
    };

    damagePlayer(player, damage) {
        if (player.active && player.hp.decrease(damage)) {
            player.dead();
            this.clearScreen();
        };
    };
    
    damageEnemy(enemy, damage) {
        if (enemy.hp.decrease(damage)) {
            enemy.kill();
            if (enemy?.key !== "boss") {
                this.spawnEnemy();
            } else {
                this.clearScreen();   
            };
        };
    };

    clearScreen() {
        this.toggleMenu(false, true);
        this.bossBombs.clear(true, true);
    };
};