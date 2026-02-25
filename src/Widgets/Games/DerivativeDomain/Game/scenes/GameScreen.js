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
5 - Hit effects
6 - Health
7 - Boss bullets
8 - Bomb
9 - Abilities / Abilities additions
10 - Current Ability Text / Pause Button
11 - Player
*/
//#endregion

const WIDTH = 850;
const HEIGHT = 600;
const dataStats = {
    attack       : 'atk',
    defense      : 'def',
    strength     : 'str',
    agility      : 'agi',
    vitality     : 'vit',
    resilience   : 'res',
    intelligence : 'int',
    dexterity    : 'dex',
    luck         : 'lck'
};
const dataMenuEnemies = {
    yupina: {
        health: 10,
        attack: 1,
        defense: 0,
        speed: 1.5,
    },
};
const dataEnemies = {
    slime: {
        exp: 1,
        health: 5,
        attack: 1,
        defense: 0,
        speed: 0.5,
    },
};
const dataLevelUp = {
    'Enemy Multiplier': {
        description: 'Multiplies enemy spawn by x.',
        value: 2,
        addedValue: 0,
        addedMultiplier: 1,
        level: 1,
    },
    'Enemy Speed': {
        description: 'Increases enemy speed by 1.',
        value: 1,
        addedValue: 0,
        addedMultiplier: 1,
        level: 1,
    },
    'Fire Rate': {
        description: 'Increases fire rate by 1.',
        value: 1,
        addedValue: 0,
        addedMultiplier: 1,
        level: 1,
    },
    'Health': {
        description: 'Increases health by 1.',
        value: 1,
        addedValue: 0,
        addedMultiplier: 1,
        level: 1,
    },
    'Multi': {
        description: 'Increases all projectiles by 1.',
        value: 0,
        addedValue: 0,
        addedMultiplier: 1,
        level: 1,
    },
    'Speed': {
        description: 'Increases speed by 1.',
        value: 1,
        addedValue: 0,
        addedMultiplier: 1,
        level: 1,
    }
};
let enemyBase = 20;
let enemyScaling = 1.5;

export class GameScreen extends Scene {
    constructor() {
        super('Game');
        this.isGameStarted = false;
        this.isGameOver = false;
        this.isLeveledUp = false;
        this.isPaused = false;
        this.mouseMovement = false;
        this.isMobile = false;
        this.isInvulnerable = false;
        this.isBossSpawned = false;

        this.player = null;
        this.boss = null;
        
        this.debuffs = [];
        this.menuTimers = [];
        
        this.gameTimer = null;
        this.invulnTimer = null;

        this.elapsedSeconds = 0;
        this.invulnSeconds = 0;
        
        this.levelUpOptions = [];
    };

    create() {
        if (this.onNewStats) EventBus.off('new stats', this.onNewStats);
        if (this.onNewAbilities) EventBus.off('new abilities', this.onNewAbilities);

        if ('maxTouchPoints' in navigator) {
            this.isMobile = navigator.maxTouchPoints > 0;
        };

        this.createUI();
        this.createPlayer();
        this.createUIEnemy();
        this.createEnemy();
        this.createBoss();
        this.createColliders();

        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.handleTimer,
            callbackScope: this,
            loop: true,
        });
        this.gameTimer.paused = true;

        const pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        pauseKey.on('down', () => {
            if (!this.isGameStarted || this.isGameOver) return;

            this.isPaused = !this.isPaused;

            (this.isPaused) ? this.pauseScreen() : this.unpauseScreen();
        });

        const levelUpKeys = [
            Phaser.Input.Keyboard.KeyCodes.ONE,
            Phaser.Input.Keyboard.KeyCodes.TWO,
            Phaser.Input.Keyboard.KeyCodes.THREE,
        ];

        levelUpKeys.forEach((key, keyIndex) => {
            this.input.keyboard.addKey(key).on('down', () => {
                if (!this.isLeveledUp) return;
                this.handleLevelUpOption(this.levelUpOptions[keyIndex]);
            });
        });
        
        this.onNewStats = (stats) => this.setPlayerStats(stats.data);
        this.onNewAbilities = (abilities) => this.setPlayerAbilities(abilities.data);

        EventBus.on('new stats', this.onNewStats);
        EventBus.on('new abilities', this.onNewAbilities);
        EventBus.once('data', (data) => {
            this.setPlayerStats(data.stats);
            this.setPlayerAbilities(data.abilities);
            this.setPlayerWeapons();
        });
        EventBus.emit('current-scene-ready', this);
    };

    handleTimer() {
        this.elapsedSeconds++;
        this.updateTimerText();

        if (!this.isBossSpawned && (this.elapsedSeconds % 60) === 0) {
            this.isBossSpawned = true;
            this.spawnBoss();
        };

        if (this.isBossSpawned) return;
        this.updateSpawning();
    };

    updateTimerText() {
        const minutes = Math.floor(this.elapsedSeconds / 60);
        const seconds = this.elapsedSeconds % 60;
        
        this.textTimer.setText(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    updateSpawning() {
        const targetEnemyCount = this.getTargetEnemyCount();
        const currentEnemyCount = this.enemies.getLength();

        if (currentEnemyCount < targetEnemyCount) {
            const missing = targetEnemyCount - currentEnemyCount;
            this.spawnEnemies(Math.min(missing, 10));
        };
    };

    getTargetEnemyCount() {
        const dataMultiplier = dataLevelUp['Enemy Multiplier'];
        const calcMultiplier = dataMultiplier.value + dataMultiplier.addedValue;
        const calcBase = enemyBase * calcMultiplier * dataMultiplier.addedMultiplier;
        const calcScale = enemyScaling * calcMultiplier * dataMultiplier.addedMultiplier;

        return Math.floor(calcBase + this.elapsedSeconds * calcScale);
    };

    createUI() {
        this.buttonContainer = this.add.image(95, 65, "box")
            .setDepth(2)
            .setDisplaySize(165, 105)
            .setAlpha(0.8);

        this.buttonPlay = this.add.image(95, 43, "button")
            .setDepth(2)
            .setDisplaySize(140, 40)
            .setInteractive()
            .on('pointerdown', () => this.handleButton('play'));
        this.textPlay = this.add.text(this.buttonPlay.x, this.buttonPlay.y, 'Play')
            .setDepth(2)
            .setOrigin(0.5);

        this.buttonMouseMovement = this.add.image(95, 88, "button")
            .setDepth(2)
            .setDisplaySize(140, 40)
            .setInteractive()
            .on('pointerdown', () => this.handleButton('mouse'));
        this.textMouseMovement = this.add.text(this.buttonMouseMovement.x, this.buttonMouseMovement.y, 'Mouse')
            .setDepth(2)
            .setOrigin(0.5);

        this.buttonReturn = this.add.image(95, 88, "button")
            .setVisible(false)
            .setDepth(2)
            .setDisplaySize(140, 40)
            .setInteractive()
            .on('pointerdown', () => this.handleButton('return'));
        this.textReturn = this.add.text(this.buttonReturn.x, this.buttonReturn.y, 'Return')
            .setVisible(false)
            .setDepth(2)
            .setOrigin(0.5);

        this.buttonTryAgain = this.add.image(95, 43, "button")
            .setVisible(false)
            .setDepth(2)
            .setDisplaySize(140, 40)
            .setInteractive()
            .on('pointerdown', () => this.handleButton('try again'));
        this.textTryAgain = this.add.text(this.buttonTryAgain.x, this.buttonTryAgain.y, 'Try Again')
            .setVisible(false)
            .setDepth(2)
            .setOrigin(0.5);

        this.expBarBackground = this.add.rectangle(0, 0, WIDTH, 8, 0x1a1a1a)
            .setVisible(false)
            .setDepth(2)
            .setOrigin(0, 0);
        this.expBarFill = this.add.rectangle(0, 0, 0, 8, 0x3cff00)
            .setVisible(false)
            .setDepth(2)
            .setOrigin(0, 0);

        this.levelUpContainers = this.add.container(0, 0)
            .setVisible(false)
            .setDepth(7);
        this.levelUpSkillTexts = [];
        this.levelUpDescTexts = [];
        for (let i = 0; i < 3; i++) {
            this[`levelUpOptionContainer${i}`] = this.add.container(WIDTH / 2 + (i - 1) * 200, HEIGHT / 2)
                .setSize(185, 125)
                .setInteractive()
                .setDepth(2);

            const bg = this.add.image(0, 0, 'box')
                .setDisplaySize(185, 125)
                .setAlpha(0.8);
            const skillText = this.add.text(0, -30, 'Test (Lvl. 1)', {
                fontSize: '16px',
                color: '#fff',
                align: 'center'
            }).setOrigin(0.5);
            const descText = this.add.text(0, 15, 'Test.', {
                fontSize: '12px',
                color: '#fff',
                align: 'center',
                wordWrap: { width: 150 }
            }).setOrigin(0.5);

            this.levelUpSkillTexts.push(skillText);
            this.levelUpDescTexts.push(descText);

            this[`levelUpOptionContainer${i}`].add([bg, skillText, descText]);
            this.levelUpContainers.add(this[`levelUpOptionContainer${i}`]);
        };

        this.textTimer = this.add.text(WIDTH / 2, 25, '00:00')
            .setVisible(false)
            .setDepth(2)
            .setOrigin(0.5, 0);
        this.textCurrentAbility = this.add.text(WIDTH - 15, HEIGHT - 15, '')
            .setDepth(10)
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

    updateExpBar() {
        this.expBarFill.width = this.expBarBackground.width * (this.player.exp / this.player.neededExp);
    };

    handleButton(type) {
        switch (type) {
            case 'play':
                this.stopMenuSpawns();
                this.clearEnemies(this.menuEnemies);

                this.hideMenu();

                this.elapsedSeconds = 0;
                this.gameTimer.paused = false;
                this.isGameStarted = true;
                this.isBossSpawned = false;

                this.textTimer.setVisible(true);
                this.expBarBackground.setVisible(true);
                this.expBarFill.setVisible(true);
                break;
            case 'return':
                this.isGameStarted = false;
                this.isGameOver = false;

                this.clearEnemies(this.enemies);
                this.resetBoss();

                this.showMenu('home');
                this.menuTimers = [
                    this.time.delayedCall(0   , this.spawnMenuEnemies, [], this),
                    this.time.delayedCall(1000, this.spawnMenuEnemies, [], this),
                    this.time.delayedCall(2000, this.spawnMenuEnemies, [], this),
                ];

                this.player.revive();
                this.playerAbilities.getChildren().forEach((ability) => {
                    ability.kill();
                });

                this.gameTimer.paused = true;
                this.elapsedSeconds = 0;
                this.updateTimerText();

                this.textTimer.setVisible(false);
                this.expBarBackground.setVisible(false);
                this.expBarFill.setVisible(false);
                this.expBarFill.width = 0;
                break;
            case 'mouse':
                if (this.isMobile) return;
                this.mouseMovement = !this.mouseMovement;
                break;
            case 'try again':
                this.isGameOver = false;

                this.clearEnemies(this.enemies);
                this.resetBoss();

                this.hideMenu();

                this.elapsedSeconds = 0;
                this.updateTimerText();
                this.gameTimer.paused = false;

                this.expBarFill.width = 0;

                this.player.revive();
                this.playerAbilities.getChildren().forEach((ability) => {
                    ability.kill();
                });
                break;
            default: break;
        };
    };

    showMenu(type) {
        this.hideMenu();
        this.buttonContainer.setVisible(true);
        switch (type) {
            case 'home':
                this.buttonPlay.setVisible(true);
                this.textPlay.setVisible(true);
                
                this.buttonMouseMovement.setVisible(true);
                this.textMouseMovement.setVisible(true);
                break;
            case 'game':
                this.buttonReturn.setVisible(true);
                this.textReturn.setVisible(true);
                
                this.buttonTryAgain.setVisible(true);
                this.textTryAgain.setVisible(true);
                break;
            default: break;
        };
    };

    hideMenu() {
        this.buttonContainer.setVisible(false);

        this.buttonPlay.setVisible(false);
        this.textPlay.setVisible(false);
        
        this.buttonMouseMovement.setVisible(false);
        this.textMouseMovement.setVisible(false);

        this.buttonReturn.setVisible(false);
        this.textReturn.setVisible(false);
        
        this.buttonTryAgain.setVisible(false);
        this.textTryAgain.setVisible(false);

        this.levelUpContainers.setVisible(false);
    };

    resetBoss() {
        if (!this.boss) return;

        this.isBossSpawned = false;

        this.boss.danmaku.resetDanmaku(this);
        this.bossBullets.getMatching("active", true).forEach((bullet) => {
            bullet.remove();
        });

        this.bossBulletsEmitter.stop();
        this.bossBulletsEmitter.forEachAlive((particle) => {
            particle.kill();
        });

        this.boss.kill(true);

        this.bossBombs.clear(true, true);
    };

    stopMenuSpawns() {
        this.menuTimers.forEach((timer) => timer.remove());
        this.menuTimers = [];
    };

    clearEnemies(group) {
        if (!group) return;
        group.getChildren().forEach((enemy) => {
            enemy.kill();
        });
        group.clear(false, true);
    };

    createPlayer() {
        this.playerBullets = new Bullets(this, 100)
            .setDepth(3);
        this.playerAbilities = this.physics.add.group({ classType: Phaser.GameObjects.Sprite }).setDepth(9);
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
            .setOffset(37, 60)
            .setDepth(11);
    };

    createEnemy() {
        this.enemies = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
    };

    createUIEnemy() {
        this.menuEnemies = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
        this.menuTimers = [
            this.time.delayedCall(0   , this.spawnMenuEnemies, [], this),
            this.time.delayedCall(1000, this.spawnMenuEnemies, [], this),
            this.time.delayedCall(2000, this.spawnMenuEnemies, [], this),
        ];
    };

    createBoss() {
        const bossBulletsCollider = {
            contains: (x, y) => this.bossBulletHitCallback(x, y)
        };

        this.bossBulletsEmitter = this.add.particles(0, 0, "bullet-atlas", {
            x: WIDTH / 2,
            y: 200,
            frame: 'circle-blue',
            lifespan: Infinity,
            speed: { min: 100, max: 300 },
            quantity: 20,
            frequency: 100,
            deathZone: [
                {
                    type: 'onEnter',
                    source: bossBulletsCollider
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

    bossBulletHitCallback(x, y) {
        if (!this.player.active) return false;

        let hit = false;

        if (this.player.body.hitTest(x, y)) {
            hit = true;
            this.damagePlayer(this.player, 1);
        };

        this.playerAbilities.children.each((ability) => {
            if (!ability.active || !ability.body) return;

            if (ability.body.hitTest(x, y)) {
                hit = true;
                this.abilityHitCallback(ability, 1);
            };
        });

        return hit;
    };

    abilityHitCallback(ability, damage) {
        if (ability.sponge) {
            if (ability.active && ability.hp.updateValue(-damage)) {
                ability.kill();
            };
        };

        if (ability.reflect) {
            this.player.danmakuAbilities.resetDanmaku(this);
            this.player.danmakuAbilities.setProperties(this,
                { name: 'REFLECT',
                    danmakuConfig: {
                        type: 'PARALLEL', countB: 1, 
                        angle: -90, 
                    },
                    cannonConfig: {
                        numberOfShots: 1,
                    },
                    bulletConfig: {
                        class: 'NORMAL',
                        damage: damage,
                        speed: 200 + (this.player.str * 10),
                        frame: this.bossBulletsEmitter.frame,
                        alpha: 0.5
                    }
                }
            );
            this.player.danmakuAbilities.follow(ability);
            this.player.danmakuAbilities.fireDanmaku(this);
        };
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

        this.physics.add.overlap(this.menuEnemies, this.playerBullets, (enemy, bullet) => {
            this.enemyHitCallback(bullet, enemy);
        });
        this.physics.add.overlap(this.menuEnemies, this.playerAbilitiesBullets, (enemy, bullet) => {
            this.enemyHitCallback(bullet, enemy);
        });
        this.physics.add.overlap(this.menuEnemies, this.playerAbilities, (enemy, ability) => {
            this.enemyHitCallback(ability, enemy);
        });
        this.physics.add.overlap(this.menuEnemies, this.playerAbilitiesAdditions, (enemy, addition) => {
            this.enemyHitCallback(addition, enemy);
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
        this.physics.add.overlap(this.enemies, this.player, (enemy, player) => {
            this.playerEnemyHitCallback(player, enemy);
        });
    };

    spawnEnemies(amount) {
        let enemiesKeys = Object.keys(dataEnemies);

        for(let enemyCount = 0; enemyCount < amount; enemyCount++) {
            const randomEnemy = enemiesKeys[Math.floor(Math.random() * enemiesKeys.length)];
            let randomSide = Math.random();
            let randomX, randomY;

            if (randomSide >= 0.50) {
                /// Top / Bottom
                randomX = Math.random() * WIDTH;
                randomY = (randomSide >= 0.75) ? 0 : HEIGHT;
            } else {
                /// Right / Left
                randomX = (randomSide >= 0.25) ? WIDTH : 0;
                randomY = Math.random() * HEIGHT;
            };

            let enemy = new Enemy(
                this,
                randomEnemy,
                randomX, randomY,
                'enemy',
                dataEnemies[randomEnemy].exp,
                dataEnemies[randomEnemy].health,
                dataEnemies[randomEnemy].attack,
                dataEnemies[randomEnemy].defense,
                dataEnemies[randomEnemy].speed + (0.1 * dataLevelUp.Speed.level * dataLevelUp.Speed.addedMultiplier),
                dataEnemies[randomEnemy]?.healthXOffset,
                this.player
            );

            this.enemies.add(enemy);
        };
    };

    spawnMenuEnemies() {
        let enemiesKeys = Object.keys(dataMenuEnemies);
        let randomEnemy = enemiesKeys[Math.floor(Math.random() * enemiesKeys.length)];
        let randomX = Math.random() * 500 + 100;
        let enemy = new Enemy(
            this,
            randomEnemy,
            randomX, 0,
            'menu',
            dataMenuEnemies[randomEnemy].exp,
            dataMenuEnemies[randomEnemy].health,
            dataMenuEnemies[randomEnemy].attack,
            dataMenuEnemies[randomEnemy].defense,
            dataMenuEnemies[randomEnemy].speed,
            dataMenuEnemies[randomEnemy]?.healthXOffset
        );
        this.menuEnemies.add(enemy);
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
            if (player.hp.updateValue(-1)) {
                player.dead();
                this.showMenu('game');
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
                && this.boss.hp.updateValue(-50)) {
                this.boss.kill();
            };
        });
    };

    setPlayerStats(data) {
        const totalHealth = data.health[0] + data.health[1];
        const calculateHealth = (totalHealth < 10) ? 1 : Math.floor(data.health / 10);

        this.player.maxHp = calculateHealth;
        if (!this.player.hp) {
            this.player.hp = new HealthBar(this, calculateHealth, 10, 11);
        } else {
            this.player.hp.setMaxValue(calculateHealth);
            this.player.hp.reset();
        };

        const totalMana = data.mana[0] + data.mana[1];
        const calculateMana = (totalMana < 10) ? 1 : Math.floor(totalMana / 10);

        this.player.maxMana = calculateMana;
        this.player.mana = calculateMana;

        for (const [name, abbr] of Object.entries(dataStats)) {
            const capalizedAbbr = abbr.replace(/^./, (char) => char.toUpperCase());
            const totalStats = data[name][0] + data[name][1];

            this.player[`max${capalizedAbbr}`] = totalStats;
            this.player[abbr] = totalStats;
        };
    };

    setPlayerAbilities(data) {
        this.player.abilitiesRaw = [...data];
        this.player.setAbilities();
    };

    setPlayerWeapons() {
        this.player.weapons.push(
            { name: 'DEFAULT',
                danmakuConfig: {
                    type: 'PARALLEL', countB: 1, 
                    angle: -90, 
                },
                cannonConfig: {
                    numberOfShots: 1,
                },
                bulletConfig: {
                    class: 'NORMAL',
                    damage: this.player.atk,
                    speed: 300 + (this.player.str * 10),
                    frame: 'circle-black',
                    alpha: 0.5
                }
            },
            { name: 'SNEAK',
                danmakuConfig: {
                    type: 'PARALLEL', countB: 1, 
                    angle: -90, 
                },
                cannonConfig: {   
                    numberOfShots: 1,
                },
                bulletConfig: {
                    class: 'NORMAL',
                    damage: this.player.atk / 3,
                    speed: 300 + (this.player.str * 10),
                    frame: 'circle-black',
                    alpha: 0.5
                }
            }
        );
        this.player.danmaku.setProperties(this.scene, this.player.weapons[0]);
    };

    playerEnemyHitCallback(enemy, player) {
        if (player.active === false) return;
        this.damagePlayer(player, enemy.atk);
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
                case 'restInPeace':
                case 'restInPeaceHand':
                    hit = this.playerAbilitiesHits.get(enemy.x, enemy.y, 'abilities-atlas')
                        ?.setFrame('rest-in-peace-hit')
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
                case 'oceanicTerror':
                    hit = this.playerAbilitiesHits.get(enemy.x, enemy.y, 'abilities-atlas')
                        ?.setFrame('oceanic-terror-hit')
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
        if (this.isInvulnerable) return;

        this.isInvulnerable = true;
        this.invulnTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.isInvulnerable = false;
            },
            callbackScope: this,
            loop: false,
        });

        if (player.active && player.hp.updateValue(-damage)) this.gameOver();
    };
    
    damageEnemy(enemy, damage) {
        if (enemy.hp.updateValue(-damage)) {
            enemy.kill();

            switch (enemy?.key) {
                case 'menu': {
                    this.spawnMenuEnemies();
                    break;
                };
                case 'enemy': {
                    this.rewardExp(enemy.exp);
                    break;
                };
                case 'boss': {
                    this.isBossSpawned = false;

                    this.resetBoss();
                    this.rewardExp(50);
                    break;
                };
                default: { break; };
            };
        };
    };

    rewardExp(amount) {
        this.updateExpBar();
        const timesLeveled = this.player.addExp(amount);

        if (timesLeveled === 0) return;
        this.showLevelUpOptions();
        this.isLeveledUp = true;
    };

    showLevelUpOptions() {
        this.pauseScreen();
        this.levelUpContainers.setVisible(true);
        this.levelUpOptions.length = 0;

        for (let i = 0; i < 3; i++) {
            const keyLevelUpOptions = Object.keys(dataLevelUp);
            const randomLevelUpOption = keyLevelUpOptions[Math.floor(Math.random() * (keyLevelUpOptions.length - 1))];

            this[`levelUpOptionContainer${i}`].on('pointerdown', () => this.handleLevelUpOption(randomLevelUpOption));
            this.levelUpSkillTexts[i].setText(randomLevelUpOption);
            this.levelUpDescTexts[i].setText(dataLevelUp[randomLevelUpOption].description);

            this.levelUpOptions.push(randomLevelUpOption);
        };
    };

    handleLevelUpOption(option) {
        const lowerCaseOption = option.toLowerCase();
        const dataOption = dataLevelUp[option];

        switch (lowerCaseOption) {
            case 'enemy multiplier':
            case 'enemy speed': {
                dataLevelUp[option].level += 1;
                break;
            };
            case 'fire rate':
            case 'health':
            case 'multi':
            case 'speed': {
                const calcOption = (dataOption.value + dataOption.addedValue + dataOption.level) * dataOption.addedMultiplier;
                this.player.updateStat(lowerCaseOption, calcOption);
                break;
            };
            default: { break; };
        };

        this.levelUpContainers.setVisible(false);
        this.unpauseScreen();
        this.isLeveledUp = false;
    };

    pauseScreen() {
        this.bossBulletsEmitter.stop();
        this.bossBulletsEmitter.forEachAlive((particle) => {
            particle.kill();
        });

        this.enemies.children.each((enemy) => {
            enemy.stopMoving();
        });
        this.player.stopMoving();
        this.gameTimer.paused = true;
    };

    unpauseScreen() {
        this.enemies.children.each((enemy) => {
            enemy.startMoving();
        });
        this.player.startMoving();
        this.gameTimer.paused = false;
    };

    gameOver() {
        this.isGameOver = true;

        this.player.dead();
        this.showMenu('game');

        this.gameTimer.paused = true;
    };
};