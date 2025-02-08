import { Scene } from 'phaser';
import { EventBus } from '../EventBus';


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


const HEIGHT = 850;
const WIDTH = 600;
const enemies = {
    yupina: {
        health: 10,
        defense: 0,
        speed: 1.5,
    }
};
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
let mouseMovement = false;
let isMobile = false;
let velocityX = 0;
let velocityY = 0;


export class Game extends Scene{
    constructor(){
        super('Game');
        this.player = null;
        this.boss = null;
        this.debuffs = [];
    };
    create(){
        if("maxTouchPoints" in navigator){
            isMobile = navigator.maxTouchPoints > 0;
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
    createMenu(){
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
                if(!isMobile){
                    mouseMovement = !mouseMovement;
                };
            });
        this.textMouseMovement = this.add.text(this.buttonMouseMovement.x, this.buttonMouseMovement.y, 'Mouse')
            .setDepth(2)
            .setOrigin(0.5);
        this.textCurrentAbility = this.add.text(580, 830, "")
            .setDepth(2)
            .setOrigin(1);
        if(isMobile){
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
    toggleMenu(isHide, isGameover = false){
        if(isHide){
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
        }else{
            if(isGameover){
                this.buttonReturn.setVisible(true);
                this.textReturn.setVisible(true);
            }else{
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
    createPlayer(){
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
        this.player = new Player(this, 'player-default', 300, 750, this.playerBullets, this.playerAbilitiesBullets)
            .setOffset(37, 60);
    };
    createEnemy(){
        this.enemies = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
        this.spawnEnemy();
        this.time.delayedCall(1000, this.spawnEnemy, [], this);
        this.time.delayedCall(2000, this.spawnEnemy, [], this);
    };
    createBoss(){
        const playerCollider = {
            contains: (x, y) => {
                let hit = false;
                if(this.player.body.hitTest(x, y)){
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
    createColliders(){
        this.anchorOutside = this.physics.add.sprite(300, -100)
            .setSize(600, 1)
            .setPushable(false);
        this.anchorBoss = this.physics.add.sprite(300, 280)
            .setPushable(false);
        this.physics.add.collider(this.playerAbilities, this.anchorOutside, (anchor, ability) => {
            switch(ability.name){
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
    spawnEnemy(){
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
    spawnBoss(){
        let randomBoss = Math.floor(Math.random() * 15 + 1);
        this.boss = new Boss(
            1, 200, 1, this.bossBullets, this, `boss-${randomBoss}`,
            300, 0, 1000, 0, 100
        );
        if(this.debuffs.length !== 0){
            this.debuffs.forEach((debuff) => {
                this.boss.debuff(debuff);
            });
        };
        this.physics.add.overlap(this.boss, this.player, (boss, player) => {
            if(player.hp.decrease(1)){
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
            // boss.danmaku.startUpDanmaku(this);
            boss.danmaku.follow(boss);
            this.bossBulletsEmitter.start();
            boss.ready = true;
        });
        this.physics.add.overlap(this.bossBombs, this.player, (player, bomb) => {
            bomb.destroy();
            if(((3 * Math.floor((this.bossBombs.getLength()) / 3)) === this.bossBombs.getLength())
                && this.boss.hp.decrease(100)){
                this.boss.kill();
            };
        });
    };
    setData(data){
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
    playerHitCallback(bullet, player){
        if(bullet.active === true){
            this.damagePlayer(player, bullet.damage);
            bullet.remove();
        };
    };
    abilityHitCallback(bullet, ability){
        if(bullet.active === true){
            if(ability.sponge){
                if(ability.active && ability.hp.decrease(bullet.damage)){
                    ability.kill();
                };
            };
            if(ability.reflect){
                this.player.danmakuAbilities.resetDanmaku(this);
                this.player.danmakuAbilities.setProperties(this,
                    {
                        name: "REFLECT",
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
            if(!ability.attack){
                bullet.remove();
            };
        };    
    };
    enemyHitCallback(bullet, enemy){
        if(bullet.active === true && enemy.active === true){
            this.damageEnemy(enemy, (bullet.attack)
                ? this.player.atk
                : (bullet.addition)
                    ? this.player.atk / 4
                    : (bullet.damage || 0)
            );
            if(!bullet.attack && !bullet.sponge && !bullet.addition){
                bullet.remove();
            };
            let hit;
            switch(bullet.name){
                case "restInPeace":
                case "restInPeaceHand":
                    hit = this.playerAbilitiesHits.get(enemy.x, enemy.y, "abilities-atlas", "rest-in-peace-hit")
                        ?.setDepth(5);
                    if(hit){
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
                    if(hit){
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
    damagePlayer(player, damage){
        if(player.active && player.hp.decrease(damage)){
            player.dead();
            this.clearScreen();
        };
    };
    damageEnemy(enemy, damage){
        if(enemy.hp.decrease(damage)){
            enemy.kill();
            if(enemy?.key !== "boss"){
                this.spawnEnemy();
            }else{
                this.clearScreen();   
            };
        };
    };
    clearScreen(){
        this.toggleMenu(false, true);
        this.bossBombs.clear(true, true);
    };
};

class HealthBar{
    constructor(scene, health, offsetX, offsetY, depth = 6){
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setDepth(depth);
        scene.add.existing(this.bar);
        this.value = health;
        this.maxValue = health;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.p = 19 / health;
        this.draw();
    };
    move(x, y){
        this.x = x - this.offsetX;
        this.y = y + this.offsetY;
        this.draw();
    };
    decrease(amount){
        this.value -= amount;
        if(this.value < 0){
            this.value = 0;
        };
        return(this.value === 0);
    };
    draw(){
        this.bar.clear();
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 23, 7);
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 19, 3);
        if(this.value < (this.maxValue / 2)){
            this.bar.fillStyle(0xff0000);
        }else{
            this.bar.fillStyle(0x00ff00);
        };
        let d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 3);
    };
    reset(){
        this.value = this.maxValue;
    };
};

class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, texture, x, y, bullets, bulletsAbilities){
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
        this.danmaku = new Danmaku(scene, bullets, {});
        this.danmakuAbilities = new Danmaku(scene, bulletsAbilities, {});
        this.bulletLastFired = 0;
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        if(this.x !== this.danmaku.x || this.y !== this.danmaku.y){
            this.danmaku.follow(this);
        };
        if(this.x !== this.hp.x || this.y !== this.hp.y){
            this.hp.move(this.x, this.y);
        };
        velocityX = 0; velocityY = 0;
        if(!this.keyInitialized){
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
            if(isMobile){
                this.scene.input.on('pointerdown', (pointer) => {
                    if(this.x !== pointer.x || this.y !== pointer.y){
                        this.setPosition(pointer.x, pointer.y);
                    };
                });
                this.scene.input.on('pointermove', (pointer) => {
                    if(this.x !== pointer.x || this.y !== pointer.y){
                        this.setPosition(pointer.x, pointer.y);
                    };
                });
            };
            this.keyInitialized = true;
        };
        if(mouseMovement){
            let pointer = this.scene.input.activePointer;
            if(this.x !== pointer.x || this.y !== pointer.y){
                this.setPosition(pointer.x, pointer.y);
            };
        };
        if(this.keyW?.isDown || this.keyUp?.isDown){
            velocityY = (this.keyShift?.isDown)
                ? -this.speed / 3
                : -this.speed;
        };
        if(this.keyA?.isDown || this.keyLeft?.isDown){
            velocityX = (this.keyShift?.isDown)
                ? -this.speed / 3
                : -this.speed;
        };
        if(this.keyS?.isDown || this.keyRight?.isDown){
            velocityY = (this.keyShift?.isDown)
                ? this.speed / 3
                : this.speed;
        };
        if(this.keyD?.isDown || this.keyDown?.isDown){
            velocityX = (this.keyShift?.isDown)
                ? this.speed / 3
                : this.speed;
        };
        if(velocityX !== this.body.velocity.x){
            this.setVelocityX(velocityX);
        };
        if(velocityY !== this.body.velocity.y){
            this.setVelocityY(velocityY);
        };
        if(this.active){
            if(this.keyShift?.isDown && !this.sneakInitialized){
                this.sneakInitialized = true;
                this.danmaku.resetDanmaku(this.scene);
                this.danmaku.setProperties(this.scene, this.weapons[1]);
                this.danmaku.startUpDanmaku(this.scene);
            }else if(!this.keyShift?.isDown && this.sneakInitialized){
                this.sneakInitialized = false;
                this.danmaku.resetDanmaku(this.scene);
                this.danmaku.setProperties(this.scene, this.weapons[0]);
                this.danmaku.startUpDanmaku(this.scene);
            };
            if(time > this.bulletLastFired + (300 - (this.dex * 10))){
                this.bulletLastFired = time;
                this.danmaku.fireDanmaku(this.scene);
            };
        };
        if(Object.keys(this.abilities).length !== 0){
            if(this.abilityTimer < this.abilityCooldown){
                this.abilityTimer += delta / 1000;
            };
            if((this.keyAbility?.isDown || this.mobileAbility) && this.abilityTimer >= this.abilityCooldown){
                this[this.ability]();
                this.abilityTimer = 0;
            };
            if(Phaser.Input.Keyboard.JustDown(this.keyAbilitySwitch)
                && Object.keys(this.abilities).length > 0){
                let keysAbilities = Object.keys(this.abilities);
                this.abilityIndex++;
                if(this.abilityIndex >= keysAbilities.length){
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
    setAbilities(){
        for(let ability of this.abilitiesRaw){
            switch(ability){
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
            if(Object.keys(this.abilities).find((ability) => ability === this.ability) === undefined){
                this.abilities[this.ability] = this.abilityCooldown;
                this.abilityCooldown = this.abilityCooldown - (0.1 * Math.pow(1.5, this.int));
                this.abilityTimer = this.abilityCooldown;
            };
        };
        this.abilityIndex = Object.keys(this.abilities).length;
        this.abilitiesRaw.length = 0;
    };
    dead(){
        this.active = false;
        this.hp.draw();
    };
    revive(){
        this.active = true;
        this.hp.reset();
        this.abilityTimer = this.abilityCooldown;
    };
    grassBlock(){
        if(this.scene.playerAbilities.getChildren().find((ability) => {
            if(ability.name === "grassBlock"){
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);
                return true;
            };
        }) === undefined){
            this.scene.playerAbilities.add(
                new Ability(this.scene, "grassBlock", "grass-block", this.x, this.y - this.height / 2, {
                    healthXOffset: 4.5,
                    sponge: true
                })
            );
        };
    };
    codeOfHammurabi(){
        if(this.scene.playerAbilities.getChildren().find((ability) => {
            if(ability.name === "codeOfHammurabi"){
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);
                return true;
            };
        }) === undefined){
            this.scene.playerAbilities.add(
                new Ability(this.scene, "codeOfHammurabi", "code-of-hammurabi", this.x, this.y - this.height / 2, {
                    healthXOffset: 3,
                    sponge: true,
                    reflect: true
                })
            );
        };
    };
    restInPeace(){
        if(this.scene.playerAbilities.getChildren().find((ability) => {
            if((ability.name === "restInPeace") && (this.scene.tweens.isTweening(ability))){
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);
                ability.anims.play("rest-in-peace", true);
                let abilityAdditions = this.scene.playerAbilitiesAdditions.getChildren();
                let count = 1;
                loop: for(let i = 0; i < abilityAdditions.length; i++){
                    if(abilityAdditions[i].name = "restInPeaceHand"){
                        if(count > 7) break loop;
                        let abilityPositionLeft = ability.getTopLeft();
                        let abilityPositionRight = ability.getTopRight();
                        let randomX = Phaser.Math.Between(abilityPositionLeft.x, abilityPositionRight.x);
                        abilityAdditions[i]
                            .setVisible(true)
                            .setActive(true);
                        abilityAdditions[i].x = randomX;
                        abilityAdditions[i].y = abilityPositionLeft.y - (100 * count);
                        if(abilityAdditions[i].y < -100) break loop;
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
        }) === undefined){
            let slash = new Ability(this.scene, "restInPeace", "rest-in-peace-0", this.x, this.y - this.height / 2, {
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
            for(let i = 1; i <= 14; i++){
                let hand = this.scene.add.sprite(0, 0, "abilities-atlas", "rest-in-peace-hand")
                    .setActive(true)
                    .setVisible(true)
                    .setName("restInPeaceHand")
                    .setDepth(9);
                hand.addition = true;
                this.scene.playerAbilitiesAdditions.add(hand);
                if(i <= 7){
                    let slashPositionLeft = slash.getTopLeft();
                    let slashPositionRight = slash.getTopRight();
                    let randomX = Phaser.Math.Between(slashPositionLeft.x, slashPositionRight.x);
                    hand.x = randomX;
                    hand.y = slashPositionLeft.y - (100 * i);
                    if(hand.y < -100){
                        hand.setActive(false)
                            .setVisible(false);
                    }else{
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
                }else{
                    hand.setActive(false)
                        .setVisible(false);
                };
            };
        };
    };
    oceanicTerror(){
        if(this.scene.playerAbilities.getChildren().find((ability) => {
            if((ability.name === "oceanicTerror" && !ability.active)){
                ability.enableBody(true, this.x, this.y - this.height / 2, true, true);
                ability.setVelocityY(-300);
                if(this.scene.playerAbilitiesTimeEvents.find((timeEvent, index) => {
                    if((timeEvent.callback.name === "oceanicTerrorSpawnSeaCritter")
                        && timeEvent.paused){
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
        }) === undefined){
            for(let i = 0; i < 4; i++){
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
                if(i === 0){
                    timeEvent.paused = false;
                    wave.setVelocityY(-300);
                }else{
                    wave.kill();
                    timeEvent.paused = true;  
                };;
            };
        };
    };
    oceanicTerrorSpawnSeaCritter(wave, timeEventIndex){
        if(wave.y < 0){
            this.scene.playerAbilitiesTimeEvents[timeEventIndex].paused = true;
        };
        let chiocesSeaCritters = ["fish", "shark", "tentacle"];
        let randomSeaCritter = chiocesSeaCritters[Math.floor(Math.random() * chiocesSeaCritters.length)];
        if(this.scene.playerAbilitiesAdditions.getChildren().find((ability) => {
            if((ability.name === `oceanicTerrorSeaCritter${randomSeaCritter.replace(/^./, (char) => char.toUpperCase())}`) && !ability.active){
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
        }) === undefined){
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

class Ability extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, name, texture, x, y, {
        pushable = false,
        healthXOffset = 1,
        sponge = false,
        reflect = false,
        attack = false
    }){
        super(scene, 0, 0, "abilities-atlas");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setPushable(pushable);
        this.setFrame(texture);
        this.setPosition(x, y);
        this.setDepth(9);
        this.setSize(this.width, this.height);
        if(sponge){
            this.health = this.scene.player.mana;
            this.hp = new HealthBar(scene, this.health, this.width / healthXOffset, 11, 10);
        };
        this.name = name;
        this.sponge = sponge;
        this.reflect = reflect;
        this.attack = attack;
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        if(this.sponge && (this.x !== this.hp.x || this.y !== this.hp.y)){
            this.hp.move(this.x, this.y);
        };
    };
    kill(){
        this.hp?.bar.destroy();
        this.disableBody(true, true);
    };
};

class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, texture, x, y, health, defense, speed, healthXOffset = 7){
        super(scene, x, y, "enemy-atlas");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setFrame(texture);
        this.setPosition(x, y);
        this.setDepth(1);
        this.setSize(this.width, this.height);
        this.health = health;
        this.hp = new HealthBar(scene, health, this.displayWidth / healthXOffset, 11);
        this.def = defense;
        this.spd = speed;
        this.alive = true;
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        if(!this.alive) this.kill();
        if(this.x !== this.hp.x || this.y !== this.hp.y){
            this.hp.move(this.x, this.y);
        };
        if((this.spd * 100) !== this.body.velocity.y){
            this.body.setVelocityY(this.spd * 100);
        };
        if(!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())){
            this.setPosition(Math.random() * 500 + 100, 0);
        };
    };
    kill(){
        this.hp.bar.destroy();
        this.alive = false;
        this.destroy();
    };
};

class Boss extends Enemy{
    constructor(atk, atkSpd, atkRate, bullets, ...arg){
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
    preUpdate(){
        if(this.x !== this.hp.x || this.y !== this.hp.y){
            this.hp.move(this.x, this.y);
        };
        if(this.alive && this.ready){
            // if(!this.pattern){
            //     this.pattern = patterns[Math.floor(Math.random() * patterns.length)];
            // };
            // this[this.pattern]();
            if(/\b0\b|\b5000\b|\b10000\b|\b15000\b|\b20000\b|\b25000\b|\b30000\b|\b35000\b|\b40000\b|\b45000\b/.test(this.phaseTimer.toString())
                && this.scene.player.active){
                this.spawnBomb(3);
            };
            this.phaseTimer++;
            // if(this.phaseTimer === 12000){
            //     this.phaseTimer = 0;
            //     this.nextDanmakuPattern();
            // };
            // if(this.phaseTimerOffset !== -1){
            //     this.phaseTimer = this.phaseTimerOffset;
            //     this.phaseTimerOffset = -1;
            // };
            // for(let pattern of this.bulletPattern){
            //     if(pattern.delay && (pattern.delayTimer !== 0) && (pattern.attackDurationTimer === pattern.atkDuration)){
            //         pattern.delayTimer++;
            //         if(pattern.delayTimer > pattern.delay){
            //             pattern.delayTimer = 0;
            //             pattern.attackDurationTimer = 0;
            //         };
            //     }else{
            //         pattern.attackTimer++;
            //         if(pattern.attackTimer > pattern.atkRate + this.atkRateDebuff){
            //             pattern.attackTimer = 0;
            //             pattern.attackDurationTimer++;
            //             if(pattern.attackDurationTimer === pattern.atkDuration){
            //                 pattern.delayTimer++;
            //             };
            //             this[pattern.attack]();
            //         };
            //     };
            // };
        };
    };
    createDanmakuPatterns(){
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
    nextDanmakuPattern(){
        this.danmaku.resetDanmaku(this.scene);
        this.danmaku.setProperties(this.scene, this.danmakuPatterns[Math.floor(Math.random() * this.danmakuPatterns.length)]);
        this.danmaku.startUpDanmaku(this.scene);
    };
    generation1_1(){
        if(this.phaseTimer === 0){
            let randomPatternIndex = Phaser.Math.Between(0, generation1_1Patterns.length - 1);
            let randomPattern = generation1_1Patterns[randomPatternIndex];
            this[randomPattern]();
        };
        if(this.phaseTimer === 5000){
            this.bulletPattern.length = 0;
            this.phaseTimerOffset = 0;
        };
    };
    spiralColorfulSpeen(){
        if(this.bulletPattern.length === 0){
            this.bulletPattern = [
                {
                    atkRate: 25,
                    attackTimer: 0,
                    attack: "spiralColorfulSpeen"
                }
            ];
        };
        if(!this.paramsSpiralColorSpeen){
            this.paramsSpiralColorSpeen = {
                lasers: 8,
                laserAngle: 0,
                laserSpeed: 400,
                rotationSpeed: 8,
                textures: ["laser-red", "laser-blue", "laser-green", "laser-yellow"],
            };
        };
        const params = this.paramsSpiralColorSpeen;
        for(let i = 0; i < params.lasers; i++){
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
    arrowSparsedVomit(){
        if(this.bulletPattern.length === 0){
            this.bulletPattern = [
                {
                    atkRate: 30,
                    attackTimer: 0,
                    attack: "arrowSparsedVomit"
                }
            ];
        };
        if(!this.paramsArrowSparsedVomit){
            this.paramsArrowSparsedVomit = {
                burstCount: 10,
                burstSpeed: 450,
                angleVariance: 15,
                textures: ["arrow-red", "arrow-blue", "arrow-green", "arrow-yellow"]
            };
        };
        const params = this.paramsArrowSparsedVomit;
        for(let i = 0; i < params.burstCount; i++){
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
    icicleBloodAndIce(){
        if(this.bulletPattern.length === 0){
            this.bulletPattern = [
                {
                    atkRate: 25,
                    attackTimer: 0,
                    attack: "icicleBloodAndIce"
                }
            ];
        };
        if(!this.paramsIcicleBloodAndIce){
            this.paramsIcicleBloodAndIce = {
                speed: 350,
                textures: ["icicle-3-blue", "icicle-red"],
            };
        };
        const params = this.paramsIcicleBloodAndIce;
        for(let i = 0; i < 4; i++){
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
    spiralRadiantBloom(){
        if(this.bulletPattern.length === 0){
            this.bulletPattern = [
                {
                    atkRate: 40,
                    attackTimer: 0,
                    attack: "spiralRadiantBloom"
                }
            ];
        };
        if(!this.paramsSpiralRBS){
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
        for(let layer = 0; layer < params.layerCount; layer++){
            const radius = layer * params.layerSpacing;
            const speed = params.baseSpeed + layer * 20;
            const texture = params.textures[layer % params.textures.length];
            for(let i = 0; i < params.bulletsPerLayer; i++){
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
        for(let i = 0; i < params.petalCount; i++){
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
    spiralCosmicDance(){
        if(this.bulletPattern.length === 0){
            this.bulletPattern = [
                {
                    atkRate: 20,
                    attackTimer: 0,
                    attack: "spiralCosmicDance"
                }
            ];
        };
        if(!this.paramsSpiralCD){
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
        if(params.timer <= 0){
            for(let wave = 0; wave < params.waveCount; wave++){
                const baseAngle = (360 / params.waveCount) * wave + params.angleOffset;
                for(let i = 0; i < params.bulletCount; i++){
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
            if(params.angleOffset > 360){
                params.angleOffset = 0;
            };
        }else{
            params.timer -= 16;
        };
        for(let i = 0; i < 20; i++){
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
        for(let i = 0; i < 12; i++){
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
    touhouFangameRecollectionOfScriptersPast(){
        /// North
        if(this.phaseTimer === 0){
            this.bulletPattern = [{
                atkRate: 10,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastNorth"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.north);
        };
        /// East
        if(this.phaseTimer === 1000){
            this.bulletPattern = [{
                atkRate: 40,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastEast"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.east);
        };
        /// South
        if(this.phaseTimer === 2000){
            this.bulletPattern = [{
                atkRate: 10,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastSouth"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.south);
        };
        /// West
        if(this.phaseTimer === 3000){
            this.bulletPattern = [{
                atkRate: 4,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastWest"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.west);
        };
        /// Random direction
        if(this.phaseTimer === 4000){
            this.paramsTouhouFangameRecollectionOfScriptersPast.randomY = -1;
            this.paramsTouhouFangameRecollectionOfScriptersPast.decideRotation = -1;
            let decideSide = Math.floor(Math.random() * 4 + 1);
            let optionsNorth = [3, 4];
            let optionsEast = [1, 3, 4];
            let optionsSouth = [1, 4];
            let optionsWest = [1, 3];
            switch(decideSide){
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
    touhouFangameRecollectionOfScriptersPastNorth(){
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
    touhouFangameRecollectionOfScriptersPastEast(){
        if(this.paramsTouhouFangameRecollectionOfScriptersPast.randomY === -1){
            this.paramsTouhouFangameRecollectionOfScriptersPast.randomY = Math.random() * 420;
        };
        for(let i = 0; i < 8; i++){
            this.attack({
                x: 610, y: this.paramsTouhouFangameRecollectionOfScriptersPast.randomY + (60 * i),
                speed: 200,
                texture: "butterfly-green",
                angle: 180,
            });
        };
    };
    touhouFangameRecollectionOfScriptersPastSouth(){
        if(this.paramsTouhouFangameRecollectionOfScriptersPast.decideRotation === -1){
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
    touhouFangameRecollectionOfScriptersPastWest(){
        let randomY = Math.random() * 840 + 10;
        this.attack({
            x: -10, y: randomY,
            speed: 200,
            texture: "sword-yellow"
        });
    };
    touhouFangameRecollectionOfScriptersPastCombine(side){
        switch(side){
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
    }){
        this.scene.time.delayedCall(delay, () => {
            for(let i = 0; i < amount / 2; i++){
                if(!this.alive) return;
                let count = (amount % 2 === 0) ? i + 1 : i;
                let bullet = this.scene.bossBullets.getFirstDead(false);
                if(bullet){
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
                    if(angleChange !== 0){
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
    createEllipse(ellipses){
        ellipses.forEach(({ centerX, centerY, xRadius, yRadius, bulletCount, lifetime = Infinity, texture, speed = 0, size = 1 }) => {
            for(let i = 0; i < bulletCount; i++){
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
    spawnBomb(amount){
        let randomX, randomY;
        let bounds = this.getBounds();
        let xMin = bounds.x;
        let xMax = bounds.x + bounds.width;
        let yMin = bounds.y;
        let yMax = bounds.y + bounds.height;
        for(let i = 0; i < amount; i++){
            do{
                randomX = Math.random() * 530 + 30;
            }while((randomX < xMin) && (randomX > xMax));
            do{
                randomY = Math.random() * 825 + 25;
            }while((randomY < yMin) && (randomY > yMax));
            this.createHollowCircle(randomX, randomY);
        };
    };
    createHollowCircle(x, y){
        const bomb = this.scene.physics.add.sprite(x, y, "bomb")
            .setSize(18, 18)
            .setDisplaySize(64, 64)
            .setPushable(false)
            .setDepth(8);
        this.scene.bossBombs.add(bomb);
    };
    debuff(what){
        switch(what){
            case "morale":
                this.atkRateDebuff = 10;
                break;
            default: break;
        };
    };
    kill(){
        super.kill();
    };
};

class Bullets extends Phaser.Physics.Arcade.Group{
    constructor(scene, maxBullets){
        super(scene.physics.world, scene, { enable: false });
        this.bullets = this.createMultiple({
            classType: Bullet,
            key: ('bullet'),
            frameQuantity: maxBullets,
            active: false,
            visible: false
        });
    };
};

class Bullet extends Phaser.Physics.Arcade.Sprite{
    fire(
        scene,
        {
            parent,
            x = 0, y = 0,
            bulletClass = "NORMAL",
            cannonAngle = 0, /// The angle of the primary cannon is passed onto bullet, for use by certain bullet types, eg STOP&GO
            bulletFrame = null,
            bulletBearing = 0, /// Direction in which the bullet is fired, in radians
            bulletBearingDelta = 0,
            bulletBearingVelocity = null, /// "angular velocity" of bullet Bearing, received in radians
            bulletSwingDelta = Math.PI/2,
            bulletDamage = 0,
            bulletSpeed = 0,
            bulletMaxSpeed = -1,
            bulletAcceleration = 0,
            bulletAngle = 0, // This is the angle of the bullet image, in radians
            bulletAngularVelocity = 0, // This is the angular velocity of the bullet image, in degrees
            bulletCycleLength = 0,
            bulletBounceX = 0,
            bulletBounceY = 0,
            bulletGravityX = 0,
            bulletGravityY = 0,
            bulletVRandom = 0,
            bulletLife = -1, // Lifepan of bullet in ms. if set to -1, infinite
            bulletLifeAlpha = false,
            bulletTransform = { class: "NONE" }, 
            perTurnConstraint = 0,
            bulletTarget = null,
            bulletOffScreen = false,
            bulletOrbitSpeed = 0,
            bulletSatellite,
            bulletAlpha
        }){
        this.damage = bulletDamage;
        this.parent = parent;
        this.enableBody(true, x, y, true, true);
        this.blendMode = "ADD";
        /// This is the beginning of the fire function
        this.bulletClass = bulletClass;
        this.cannonAngle = cannonAngle; //the angle of the primary cannon is passed onto bullet, for use by certain bullet types, eg STOP&GO
        this.orbitAngle = Phaser.Math.Angle.Between(this.parent.x, this.parent.y,this.x,this.y);
        this.orbitSpeed = bulletOrbitSpeed;
        this.orbitRadius = Phaser.Math.Distance.Between(this.parent.x, this.parent.y,this.x,this.y);
        /// Set some basic properties of body and game object when first fired
        this.bulletTexture = "bullet-atlas"; /// Assign to a variable, since used for Transform
        this.bulletFrame = bulletFrame; /// Assign to a variable, since used for Transform
        this.bulletMaxSpeed = bulletMaxSpeed;
        this.bulletBearing = bulletBearing; 
        this.bulletBearingDelta = bulletBearingDelta;
        this.referenceBearing = this.bulletBearing; /// Keep record of the original shoot angle - this.bulletBearing is adjusted based on this for curving bullets
        this.bulletBearingVelocity = bulletBearingVelocity;
        this.bulletSwingDelta = bulletSwingDelta,
        this.bulletAngle = bulletAngle;
        this.bulletAngularVelocity = bulletAngularVelocity;
        this.bulletCycleLength = bulletCycleLength;
        this.bulletBounceX = bulletBounceX;
        this.bulletBounceY = bulletBounceY;
        this.bulletVRandom = bulletVRandom;
        this.bulletGravityX = bulletGravityX;
        this.bulletGravityX = bulletGravityY;
        this.bulletLife = bulletLife;
        this.bulletLifeAlpha = bulletLifeAlpha;
        this.bulletSpeed = bulletSpeed;
        this.bulletAcceleration = bulletAcceleration;
        this.perTurnConstraint = perTurnConstraint; 
        this.bulletTarget = bulletTarget;
        this.bulletOffScreen = bulletOffScreen; 
        this.bulletAlpha = bulletAlpha;
        /// Set up variables relating to bulletTransform option
        this.bulletTransformCopy = Phaser.Utils.Objects.DeepCopy(bulletTransform);
        this.bulletTransformClass = bulletTransform.class;
        this.bulletTransformType = bulletTransform.type; 
        this.bulletTransformSize = bulletTransform.size;
        this.bulletStage1Time = bulletTransform.stage1Time;
        this.bulletStage2Time = bulletTransform.stage2Time;
        this.newBulletClass = bulletTransform.bulletClass || this.bulletClass;
        this.newBulletSpeed = bulletTransform.speed || this.bulletSpeed;
        this.newBulletFlag = bulletTransform.flag || false;
        this.newBulletAcceleration = bulletTransform.acceleration;
        if(bulletTransform.bearingLock){
            this.newBulletBearing = this.cannonAngle;
        }else{
            this.newBulletBearing = bulletTransform.bearing;
        };
        this.newBulletBearingVelocity = (bulletTransform.bearingVelocity === undefined)
            ? this.bulletBearingVelocity
            : Phaser.Math.DegToRad(bulletTransform.bearingVelocity);
        this.newBulletAngularVelocity = bulletTransform.angularVelocity || 0;
        this.newBulletCycleLength = bulletTransform.cycleLength;
        this.newBulletAngleRange = Phaser.Math.DegToRad(bulletTransform.angleRange) || Math.PI*2;
        this.newBulletBearingDelta = Phaser.Math.DegToRad(bulletTransform.bearingDelta) || 0;
        this.newBulletTexture = bulletTransform.texture
        this.newBulletFrame = bulletTransform.frame
        this.newBulletCount = bulletTransform.count || 1;
        this.newBulletSeek = bulletTransform.seek || false;
        this.newBulletBounceX = bulletTransform.bounceX;
        this.newBulletBounceY = bulletTransform.bounceY;
        this.newBulletGravityX = bulletTransform.gravityX;
        this.newBulletGravityY = bulletTransform.gravityY;
        this.newBulletVRandom = bulletTransform.vRandom || 0;
        this.newBulletLife = bulletTransform.lifeSpan;
        this.newBulletLifeAlpha = bulletTransform.lifeAlpha; 
        this.spawnSpeed = bulletTransform.spawnSpeed || this.bulletSpeed;
        this.spawnBearing = bulletTransform.spawnBearing;
        this.spawnTexture = bulletTransform.spawnTexture || this.bulletTexture;
        this.spawnCount = bulletTransform.spawnCount || 1;
        this.spawnFrame = (bulletTransform.spawnFrame === undefined)
            ? this.bulletFrame
            : bulletTransform.spawnFrame;
        this.spawnRepeat = (bulletTransform.repeat === undefined)
            ? 0
            : bulletTransform.repeat;
        this.spawnRepeatCount = 0;
        this.transformed = false;
        this.bulletToggle = -1; /// Used for ZIGZAG bullet
        this.bulletConfig = null;
        this.bulletTimer = 0;
        this.lifeTimer = 0;
        this.stage1Count = 0;
        this.fragmentAngles = [];
        this.fragmentSpeeds = [];
        this.fragmentPositions = [];
        if(this.bulletTransformClass === "DELAY"){
            this.newBulletSpeed = this.bulletSpeed;
            this.bulletSpeed = 0;
            this.bulletTransformClass = "CHANGE";
        };
        this.bulletSatellite = bulletSatellite;        
        this.setBulletConfig();
        this.setMotion();
        if(this.bulletSatellite !== undefined) this.createSatellites(this);
    };
    preUpdate(time, delta){
        if((this.bulletClass === "ORBIT") && !this.parent.body.enable) this.remove();
        this.bulletTimer += delta;
        this.lifeTimer += delta;
        switch(this.bulletLife){
            case -1: break;
            default:
                if(this.bulletLifeAlpha){
                    const alphaValue = (this.bulletLife - this.lifeTimer) / this.bulletLife;
                    this.setAlpha((alphaValue >=0) ? alphaValue : 0);
                };
                if(this.lifeTimer > this.bulletLife){
                    this.remove();
                };
                break;
        };
        /// "BOUNCE!": reverse direction if hit left or right of screen
        if((this.bulletBounceX > 0) && this.hitEdgeX(this)){
            if(this.x <= (this.displayWidth / 2)){
                this.setX(this.displayWidth / 2 + 1);
            }else if(this.x >= WIDTH - this.displayWidth / 2){
                this.setX(WIDTH - this.displayWidth / 2 - 1);
            };
            this.setVelocityX(-this.body.velocity.x * this.bulletBounceX);
            this.bounceOffWall();
        };
        /// "BOUNCE!": reverse direction if hit bottom or top of screen
        if((this.bulletBounceY > 0) && this.hitEdgeY(this)){
            if(this.y <= (this.displayHeight / 2)){
                this.setY(this.displayHeight / 2 + 1);
            }else if(this.y >= HEIGHT - this.displayHeight / 2){
                this.setY(HEIGHT - this.displayHeight / 2 - 1);
            };
            this.setVelocityY(-this.body.velocity.y * this.bulletBounceY);
            this.bounceOffWall();
        };
        if((!this.bulletOffScreen) && (this.outOfScreenX() || this.outOfScreenY())){
            this.remove();
        };
        /// If there is bearing velocity set, then adjust the bearing angle of the velocity
        if(this.body.speed !==0 && this.bulletBearingVelocity !== 0){
            this.bulletBearing = this.referenceBearing + this.bearingChange.getValue();
            /// If the bullet is not rotating type, set the angle of bullet image in line with the bullet bearing
            if(this.bulletAngularVelocity === 0){
                this.setRotation(this.bulletBearing);
            };
            this.adjustVelocity(this.bulletBearing, this.body.speed, this.bulletAcceleration);
        };
        switch(this.bulletClass){
            case "ORBIT":
                this.setPosition(this.parent.x, this.parent.y);
                Phaser.Math.RotateAroundDistance(this, this.parent.x, this.parent.y, this.orbitAngle, this.orbitRadius);
                this.orbitAngle = Phaser.Math.Angle.Wrap(this.orbitAngle + this.orbitSpeed);
                break;
            case "ZIGZAG":
                if(this.bulletTimer > this.bulletCycleLength){
                    this.bulletTimer = 0;
                    this.bulletToggle *= -1;
                    const newDirection = this.bulletBearing + this.bulletBearingDelta * this.bulletToggle;
                    this.setRotation(newDirection);
                    this.adjustVelocity(newDirection, this.bulletSpeed, this.bulletAcceleration);  
                };
                break;
            case "HOMING":
                this.seek();
                this.adjustVelocity(this.bulletBearing, this.bulletSpeed, this.bulletAcceleration);
                break;
            case "SWING":
                const targetAngle = this.bulletBearing + this.swing.getValue();
                this.setRotation(targetAngle);
                this.adjustVelocity(targetAngle, this.body.speed, this.bulletAcceleration);
                break;
            default: break;
        };
        if((this.bulletTransformClass !== "NORMAL") && (this.bulletTimer > this.readStage())){
            this.stage1Count++;
            if(this.bulletClass === "ORBIT"){
                this.bulletBearing = Phaser.Math.Angle.Between(this.parent.x, this.parent.y,this.x,this.y);
            };
            switch(this.bulletTransformClass){
                case "CHANGE":
                    this.oldToNew(); /// Copy the newbullet parameters to existing bullet config
                    this.setBulletConfig(); /// Activate the new properties
                    this.setMotion();
                    if(this.maturity()){
                        this.spawnRepeatCount++;
                        if(this.spawnRepeatCount >= this.spawnRepeat){
                            this.bulletTransformClass = "NORMAL";
                        }else{
                            this.bulletTimer = 0;
                            this.stage1Count = 0;
                        };
                    };
                    break;
                case "EXPLODE":
                    this.bulletConfig = this.setBaseConfig();
                    this.explode(this);
                    this.handleMaturity();
                    break;
                case "SPAWN":
                    this.bulletConfig = this.setBaseConfig();
                    this.spawn(this);
                    this.handleMaturity();
                    break;
                case "STOP&GO":
                    this.bulletConfig = this.setBaseConfig(true);
                    this.stopAndGo(this);
                    this.remove();
                    break;    
                default: break;
            };
        };
    };
    createSatellites(scene){
        for(let i= 0; i < this.bulletSatellite.count; i++){
            const angle = i * ((Math.PI * 2) / this.bulletSatellite.count);
            const orbit = new Phaser.Math.Vector2().setToPolar(angle, this.bulletSatellite.radius);
            const bullet = this.parent.munitions.getFirstDead(false);
            if(bullet){
                bullet.fire(scene, {
                    parent: this,
                    x: this.x + orbit.x,
                    y: this.y + orbit.y,
                    bulletClass: "ORBIT",
                    bulletSpeed: 0,
                    bulletTexture: "bullet-atlas",
                    bulletFrame: this.bulletSatellite.frame,
                    bulletOrbitSpeed: this.bulletSatellite.orbitSpeed
                });
            };
        };
    };
    handleMaturity(){
        /// At the end of executing one "cycle" of bulletTransform, take appropriate action
        if(this.maturity()){
            switch(this.spawnRepeat){
                case 0:
                    this.remove();
                    break;
                default:
                    this.spawnRepeatCount++;
                    if(this.spawnRepeatCount >= this.spawnRepeat){
                        this.bulletTransformClass = "NORMAL";
                    }else{
                        this.bulletTimer = 0;
                        this.stage1Count = 0;                  
                    };
                    break;
            };
        };
    };
    maturity(){
        if(typeof(this.bulletStage1Time) === "number")
            return true;
        else if(this.stage1Count >= this.bulletStage1Time?.length)
            return true;
    };
    explode(scene){
        this.fragmentAngles = [];
        this.fragmentSpeeds = [];
        this.fragmentPositions = [];
        this.bulletConfig.bulletTexture = this.spawnTexture;
        this.bulletConfig.bulletFrame = this.spawnFrame;
        if(this.bulletTransformType === undefined) this.bulletTransformType = "arc";
        let cannonIndex = [];
        let cannonOrigin = [];
        danmakuSpokes({
            heading: readAngle(this.bulletBearing, this.spawnBearing),
            cannonsInNway: 1,
            spokesArray: cannonIndex,
            originsArray: cannonOrigin
        });
        drawCannons({
            ///  curve: (type === "arc") ? createArc(1, Phaser.Math.RadToDeg(angleRange)) : album.pages[type].drawing,
            shapes: this.bulletTransformType,
            pRatio: 1,
            angleRange: this.newBulletAngleRange,
            angleIndex: cannonIndex,
            originIndex: cannonOrigin,
            centre: new Phaser.Math.Vector2(this.x, this.y),
            numberOfPoints: this.newBulletCount,
            speed: this.spawnSpeed,
            open: this.newBulletFlag,
            anglesArray: this.fragmentAngles,
            speedArray: this.fragmentSpeeds,
            cannonPositions: this.fragmentPositions
        });
        for(let i = 0; i < this.fragmentAngles.length; i++){
            const direction = this.fragmentAngles[i];
            const bullet = this.scene.bossBullets.getFirstDead(false);
            if(bullet){
                this.bulletConfig.bulletBearing = direction;
                this.bulletConfig.bulletAngle = direction;
                this.bulletConfig.bulletSpeed = this.fragmentSpeeds[0][i];
                bullet.fire(scene, this.bulletConfig);
            };
        };
    };
    spawn(scene){
        for(let angle = 0; angle <= Math.PI * 2 * (this.spawnCount - 1) / this.spawnCount; angle += Math.PI * 2 / this.spawnCount){
            this.bulletConfig.bulletBearing = readAngle(this.bulletBearing+angle, this.spawnBearing);
            this.bulletConfig.bulletTexture = this.spawnTexture;
            this.bulletConfig.bulletFrame = this.spawnFrame;
            if(Array.isArray(this.spawnSpeed)){
                for(let i = 0; i < this.spawnSpeed.length; i++){
                    const bullet = enemyBullets.getFirstDead(false);
                    if(bullet){
                        this.bulletConfig.bulletSpeed = this.spawnSpeed[i];
                        bullet.fire(scene, this.bulletConfig);
                    };
                };
            }else{
                const bullet = enemyBullets.getFirstDead(false);
                if(bullet){ 
                    this.bulletConfig.bulletSpeed = this.spawnSpeed;
                    bullet.fire(scene, this.bulletConfig);
                };
            };
        };
    };
    oldToNew(){
        this.bulletSpeed = this.newBulletSpeed || this.bulletSpeed;   
        this.bulletBearing = (this.newBulletSeek === true)
            ? Phaser.Math.Angle.Between(this.x, this.y, this.bulletTarget.x, this.bulletTarget.y)
            : this.bulletBearing = readAngle(this.bulletBearing, readParam(this.newBulletBearing, this.stage1Count - 1));        
        this.bulletTexture = this.newBulletTexture || this.bulletTexture;
        this.bulletFrame = (this.newBulletFrame === undefined) ? this.bulletFrame : this.newBulletFrame;
        this.bulletAcceleration = (this.newBulletAcceleration === undefined) ? this.bulletAcceleration : this.newBulletAcceleration;
        this.bulletMaxSpeed = (this.newBulletMaxSpeed === undefined) ? this.bulletMaxSpeed : this.newBulletMaxSpeed;
        this.bulletGravityX = (this.newBulletGravityX === undefined) ? this.bulletGravityX : this.newBulletGravityX;   
        this.bulletGravityY = (this.newBulletGravityY === undefined) ? this.bulletGravityY : this.newBulletGravityY;  
        this.bulletBounceX = (this.newBulletBounceX === undefined) ? this.bulletBounceX : this.newBulletBounceX;   
        this.bulletBounceY = (this.newBulletBounceY === undefined) ? this.bulletBounceY : this.newBulletBounceY; 
        this.bulletLife = (this.newBulletLife === undefined) ? this.bulletLife : this.newBulletLife;
        this.bulletLifeAlpha = (this.newBulletLifeAlpha === undefined) ? this.bulletLifeAlpha : this.newBulletLifeAlpha;
    };
    stopAndGo(scene){
        const bullet = enemyBullets.getFirstDead(false);
        if(bullet){ 
            this.bulletConfig.bulletSpeed = 0;
            this.bulletConfig.bulletAcceleration = 0;
            this.bulletConfig.bulletTransform.class = "CHANGE";
            this.bulletConfig.bulletTransform.stage1Time = this.bulletStage2Time;
            bullet.fire(scene, this.bulletConfig);
        };
    };
    setBulletConfig(){
        this.setTexture(this.bulletTexture, this.bulletFrame);
        this.setAlpha(this.bulletAlpha || 1);
        this.setSize(this.height / 1.5, this.width / 1.5);
        this.body.speed = this.bulletSpeed; /// It's necessary to manually set speed of body otherwise sometimes pre-update sets the velocity to zero, before the bullet gets going
        this.body.setMaxSpeed(this.bulletMaxSpeed);
    };
    setMotion(){
        const bearing = this.bulletBearing + this.bulletBearingDelta * this.bulletToggle;
        const adjustedSpeed = this.bulletSpeed + this.randomSpeed(this.bulletVRandom);
        this.adjustVelocity(bearing, adjustedSpeed, this.bulletAcceleration);
        /// If bulletBearingVelocity is set, it means the bullet should fly along curve - so set up tween to adjust direction
        if(this.bulletBearingVelocity !== 0){
            this.bearingChange = this.scene.tweens.addCounter({
                from: 0,
                to: Math.sign(this.bulletBearingVelocity) * 2 * Math.PI,
                duration: ((2 * Math.PI) / Math.abs(this.bulletBearingVelocity)) * 1000,
                repeat: -1
            });
        };
        /// If SWING type, then set up tween to adjust the bulletBearing
        if(this.bulletClass === "SWING"){
            this.swing = this.scene.tweens.addCounter({
                from: -this.bulletSwingDelta,
                to: this.bulletSwingDelta,
                duration: this.bulletCycleLength,
                repeat: -1,
                yoyo: true
            });
        };
        this.body.setAngularVelocity(this.bulletAngularVelocity);
    };
    adjustVelocity(targetAngle, speed, acceleration){
        this.scene.physics.velocityFromRotation(
            targetAngle,
            speed,
            this.body.velocity
        );
        this.scene.physics.velocityFromRotation(
            targetAngle,
            acceleration,
            this.body.acceleration
        );
        if(this.bulletAngularVelocity === 0){
            this.setRotation(targetAngle);
        };
    };
    readStage(){
        if(typeof(this.bulletStage1Time) === "number")
            return this.bulletStage1Time;
        else if(Array.isArray(this.bulletStage1Time))
            return this.bulletStage1Time[this.stage1Count];
    };
    bounceOffWall(){
        this.setRotation(Phaser.Math.Angle.Wrap(this.body.velocity.angle()));
        this.referenceBearing = this.rotation;
        this.bulletBearing = this.rotation;
        if(this.swing) this.swing.restart();
        if(this.bearingChange) this.bearingChange.restart();
    };
    randomSpeed(randomness){
        const randomFactor = Phaser.Math.Between(-randomness / 2, randomness / 2);
        return randomFactor;
    };
    setBaseConfig(current = false){
        switch(current){
            case false:
                return{
                    parent: this,
                    x: this.x, y: this.y,
                    bulletType: "NORMAL",
                    bulletBearing: readAngle(this.bulletBearing, this.newBulletBearing),
                    bulletBearingVelocity: this.newBulletBearingVelocity,
                    bulletAngle: readAngle(this.bulletBearing, this.newBulletBearing),
                    bulletAngularVelocity: this.newBulletAngularVelocity,
                    bulletCycleLength: this.newBulletCycleLength,
                    bulletSpeed: this.newBulletSpeed,
                    bulletAcceleration: this.newBulletAcceleration,
                    bulletTexture: (this.newBulletTexture === undefined) ? this.bulletTexture : this.newBulletTexture,
                    bulletFrame: (this.newBulletFrame === undefined) ? this.bulletFrame : this.newBulletFrame,
                    bulletTarget: this.newBulletTarget,
                    bulletBounceX: this.newBulletBounceX,
                    bulletBounceY: this.newBulletBounceY,
                    bulletGravityX: this.newBulletGravityX,
                    bulletGravityY: this.newBulletGravityY,
                    bulletSeek: this.newBulletSeek,
                    bulletTarget: this.bulletTarget,
                    bulletVRandom: this.newBulletVRandom,
                    bulletLife: this.newBulletLife,
                    bulletLifeAlpha: this.newBulletLifeAlpha
                };
                break;
            default:
                return{
                    parent: this,
                    x: this.x, y: this.y,
                    bulletType: "NORMAL",
                    bulletBearing: this.bulletBearing,
                    bulletBearingVelocity: this.bulletBearingVelocity,
                    bulletAngle: this.bulletBearing,
                    bulletAngularVelocity: this.bulletAngularVelocity,
                    bulletCycleLength: this.bulletCycleLength,
                    bulletSpeed: this.bulletSpeed,
                    bulletAcceleration: this.bulletAcceleration,
                    bulletTexture: this.bulletTexture,
                    bulletFrame: this.bulletFrame,
                    bulletTarget: this.bulletTarget,
                    bulletBounceX: this.bulletBounceX,
                    bulletBounceY: this.bulletBounceY,
                    bulletGravityX: this.bulletGravityX,
                    bulletGravityY: this.bulletGravityY,
                    bulletSeek: this.bulletSeek,
                    bulletTarget: this.bulletTarget,
                    bulletVRandom: this.bulletVRandom,
                    bulletLife: this.nbulletLife,
                    bulletLifeAlpha: this.bulletLifeAlpha,
                    bulletTransform: this.bulletTransformCopy
                };
                break;
        };
    };
    delayedMove(scene){
        const bullet = enemyBullets.getFirstDead(false);
        if(bullet){
            if(this.newBulletSeek){
                /// This returns the angle between 2 points in radians
                this.bulletConfig.bulletBearing = Phaser.Math.Angle.Between(this.x, this.y, this.bulletTarget.x, this.bulletTarget.y);
                this.bulletConfig.bulletAngle = this.newBulletBearing;
            };
            bullet.fire(scene, this.bulletConfig);
        };
    };
    remove(){
        if(this.swing) this.swing.remove();
        if(this.bearingChange) this.bearingChange.remove();
        this.disableBody(true, true);
    };
    seek(){
        /// This returns the angle between 2 points in radians
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.bulletTarget.x, this.bulletTarget.y);
        let diff = Phaser.Math.Angle.Wrap(targetAngle - this.bulletBearing);
        /// To to targetAngle if less than degrees per turn
        if(Math.abs(diff) < this.perTurnConstraint){
            this.bulletBearing = targetAngle;
        }else{
            let angle = this.bulletBearing;
            if(diff > 0)
                angle += this.perTurnConstraint;
            else
                angle -= this.perTurnConstraint;
            this.bulletBearing = angle;
        }; 
    };
    outOfScreenY(){
        return(
            this.y + (this.displayHeight / 2) <= 0 || this.y >= HEIGHT + (this.displayHeight / 2)
        );
    };
    outOfScreenX(){
        return(
            this.x + (this.displayWidth / 2) <= 0 || this.x >= WIDTH + (this.displayWidth / 2)
        );
    };
    hitEdgeY(bullet){
        return(
            bullet.y <= (bullet.displayHeight / 2) || bullet.y >= HEIGHT - (bullet.displayHeight / 2)
        );
    };
    hitEdgeX(bullet){
        return(
            bullet.x <= (bullet.displayWidth / 2) || bullet.x >= WIDTH - (bullet.displayWidth / 2)
        );
    };
};

class Danmaku extends Phaser.Physics.Arcade.Image{
    constructor(
        scene,
        munitions,
        {
            x = 0, y = 0,
            danmakuTexture = null,
            danmakuFrame = null
        } = {}){
            super(scene, x, y, danmakuTexture, danmakuFrame);
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.active = false;
            this.visible = false;
            this.munitions = munitions;
            this.danmakuPosition = new Phaser.Math.Vector2(this.x, this.y);
    };
    resetDanmaku(scene){
        if(this.washerTween) this.washerTween.remove();
        if(this.repeatShotsTimer !== undefined) scene.time.removeEvent(this.repeatShotsTimer);
        if(this.intervalTimer !== undefined) scene.time.removeEvent(this.intervalTimer);
        this.disableBody(true, true);
    };
    setProperties(
        scene,
        {
            name = "",
            x = this.x, y = this.y,
            danmakuConfig = { class: "NWAY" },
            cannonConfig = { numberOfShots: -1 },
            bulletConfig = { class: "NORMAL" }, /// "NORMAL", "BEND" and "HOMING"
            /// randomBulletDelay = false,
            washer = null,
            bulletTransform,
            /// perTurnConstraint = 0
        }){
            this.enableBody(true, x, y, true, false);
            this.name = name;
            this.danmakuClass = danmakuConfig.class;
            this.danmakuType = danmakuConfig.type;
            this.danmakuCountA = danmakuConfig.countA || 1;
            this.danmakuCountB = danmakuConfig.countB || 1;
            this.danmakuParamA = danmakuConfig.paramA;
            this.danmakuParamB = danmakuConfig.paramB;
            this.danmakuWidth = danmakuConfig.width;
            this.danmakuHeight = danmakuConfig.height; 
            this.danmakuMultiple = danmakuConfig.multiple || 1;
            this.danmakuSize = danmakuConfig.size;
            this.danmakuSwitch = danmakuConfig.switch;
            this.danmakuFlag = danmakuConfig.flag;
            this.danmakuOption = danmakuConfig.option;
            if(Array.isArray(danmakuConfig.aOffset))
                this.danmakuAOffset = danmakuConfig.aOffset.map(x=>Phaser.Math.DegToRad(x));
            else
                this.danmakuAOffset = Phaser.Math.DegToRad(danmakuConfig.aOffset) || 0;
            this.danmakuVOffset = danmakuConfig.vOffset || 0;
            this.danmakuHOffset = danmakuConfig.hOffset || 0;
            this.danmakuKeepShape = danmakuConfig.keepShape;
            this.danmakuPicture = danmakuConfig.picture;    
            this.danmakuAngle = (danmakuConfig.angle === undefined)
                ? Math.PI / 2
                : Phaser.Math.DegToRad(danmakuConfig.angle);
            this.setRotation(this.danmakuAngle);
            this.referenceAngle = this.danmakuAngle;
            this.danmakuAngularVelocity = danmakuConfig.angularVelocity || 0; 
            this.body.setAngularVelocity(this.danmakuAngularVelocity);
            this.danmakuAngularAcceleration = danmakuConfig.angularAcceleration || 0;
            this.body.setAngularAcceleration(this.danmakuAngularAcceleration);
            this.danmakuAngleLock = danmakuConfig.angleLock || false;    
            this.danmakuAngleRange = (danmakuConfig.angleRange === undefined)
                ? Math.PI * 2
                : Phaser.Math.DegToRad(danmakuConfig.angleRange);
            this.danmakuWasher = danmakuConfig.washer;
            if(this.danmakuWasher !== undefined) this.setWasher(scene);
            this.danmakuTarget = danmakuConfig.target;
            this.cannonClass = cannonConfig.class || "NORMAL"; 
            this.cannonType = cannonConfig.type;
            this.shotType = cannonConfig.shotType || "NORMAL"; /// "NORMAL", "SPREAD", "OVERTAKE"
            this.shotSpeed = cannonConfig.speed;
            this.cannonRatio = cannonConfig.ratio || 1;
            this.cannonSize = cannonConfig.size;
            this.cannonWidth = cannonConfig.width;
            this.cannonHeight = cannonConfig.height; 
            this.numberOfShots = cannonConfig.numberOfShots || -1;
            this.timeBetweenShots = cannonConfig.fireRate;
            this.shotsCount = (this.numberOfShots === -1)
                ? -1
                : this.numberOfShots - 1;
            this.stopShotsTime = cannonConfig.stopShotsTime;
            if(Array.isArray(cannonConfig.angleRange)){
                this.cannonAngleRangeStart = cannonConfig.angleRange.map(x => Phaser.Math.DegToRad(x));
                this.cannonAngleRangeRef = this.cannonAngleRangeStart[0];
            }else{
                switch(typeof(cannonConfig.angleRange)){
                    case "number":
                        this.cannonAngleRangeStart = Phaser.Math.DegToRad(cannonConfig.angleRange);
                        this.cannonAngleRangeStep = 0;
                        break;
                    case "object":
                        this.cannonAngleRangeStart = Phaser.Math.DegToRad(cannonConfig.angleRange.start);
                        this.cannonAngleRangeStep = Phaser.Math.DegToRad(cannonConfig.angleRange.step);
                        this.cannonAngleRangeEnd = Phaser.Math.DegToRad(cannonConfig.angleRange.end);
                        this.cannonAngleRangeLock = cannonConfig.angleRange.lock;
                        this.cannonAngleRangeYoYo = cannonConfig.angleRange.yoyo;
                        break;
                    case "undefined":
                        this.cannonAngleRangeStart = Math.PI * 2;
                        this.cannonAngleRangeStep = 0;
                        break;
                };
                this.cannonAngleRangeRef = this.cannonAngleRangeStart;
                if(!this.cannonAngleRangeEnd) this.cannonAngleRangeEnd = (this.cannonAngleRangeStep > 0) ? (2 * Math.PI) : 0;
            };
            this.cannonShotSFX = cannonConfig.sound;
            this.cannonPRotation = (cannonConfig.pRotation === undefined)
                ? cannonConfig.pRotation
                : Phaser.Math.DegToRad(cannonConfig.pRotation);
            this.cannonPAngleRange = (cannonConfig.pAngleRange === undefined)
                ? cannonConfig.pAngleRange
                : Phaser.Math.DegToRad(cannonConfig.pAngleRange);
            this.spreadCount = cannonConfig.spreadCount || 1;
            this.cannonCount = cannonConfig.count || 1;
            this.shotAcceleration = cannonConfig.acceleration || 0;
            this.flyAwayOption = cannonConfig.flyAwayOption || 0;
            this.bulletClass = bulletConfig.class || "NORMAL";
            this.bulletBearing = bulletConfig.bearing;
            this.bulletBearingDelta = Phaser.Math.DegToRad(bulletConfig.bearingDelta) || 0; /// For "ZIGZAG"
            this.bulletBearingVelocity = (bulletConfig.bearingVelocity === undefined)
                ? 0
                : DegToRad(bulletConfig.bearingVelocity);
            this.bulletSwingDelta = (bulletConfig.swingDelta === undefined)
                ? Math.PI / 2
                : DegToRad(bulletConfig.swingDelta);
            this.bulletAngle = this.danmakuAngle;
            this.bulletAngularVelocity = bulletConfig.angularVelocity || 0;
            this.bulletDamage = bulletConfig.damage;
            this.bulletSpeed = bulletConfig.speed;
            this.bulletMaxSpeed = bulletConfig.maxSpeed || -1;
            this.bulletAcceleration = bulletConfig.acceleration || 0;
            this.bulletCycleLength = bulletConfig.cycleLength;
            this.bulletOffScreen = bulletConfig.offScreen || false;
            this.bulletBounceX = bulletConfig.bounceX || 0;
            this.bulletBounceY = bulletConfig.bounceY || 0;
            this.bulletGravityX = bulletConfig.gravityX || 0;
            this.bulletGravityY = bulletConfig.gravityY || 0;
            this.bulletVRandom = bulletConfig.vRandom || 0;
            this.bulletTexture = "bullet-atlas";
            this.bulletFrame = bulletConfig.frame;
            this.bulletLife = bulletConfig.lifeSpan || -1;
            this.bulletLifeAlpha = bulletConfig.lifeAlpha || false;
            this.bulletTarget = bulletConfig.target || null;
            this.bulletOrbitSpeed = bulletConfig.orbitSpeed;
            this.bulletSatellite = bulletConfig.satellite;
            this.bulletAlpha = bulletConfig.alpha;
            this.bulletTransform = Phaser.Utils.Objects.DeepCopy(bulletTransform);
            if(this.bulletTransform !== undefined)
                this.transformTimer = this.bulletTransform.stage1Time;
            else
                this.transformTimer = undefined;
            this.perTurnConstraint = Phaser.Math.DegToRad(bulletConfig.perTurnConstraint);
            if(this.cannonClass === "PAINT"){
                this.numberOfShots = this.danmakuPicture.length;
                this.shotsCount = this.numberOfShots - 1;
            };
            this.repeatShotsCount;
            this.danmakuCounter = -1;
            this.repeatShotsConfig = {
                delay: this.timeBetweenShots,
                callback: this.fireShot,
                callbackScope: this,
                repeat: this.shotsCount
            };
            if(this.numberOfShots !== 1) this.repeatShotsTimer = new Phaser.Time.TimerEvent(this.repeatShotsConfig);
            this.intervalConfig = {
                delay: this.timeBetweenShots * (this.numberOfShots) + this.stopShotsTime,
                callback: this.fireDanmaku,
                args: [scene],
                callbackScope: this,
                repeat: -1
            };
            if(this.stopShotsTime > 0) this.intervalTimer = new Phaser.Time.TimerEvent(this.intervalConfig);
            this.cannonPositions;
            this.cannonAngles;
            this.cannonShotSpeeds;
    };
    startUpDanmaku(scene){
        switch(this.numberOfShots){
            case 1:
                this.fireShot(scene);
                break;
            default:
                scene.time.addEvent(this.repeatShotsTimer);
                if(this.stopShotsTime) scene.time.addEvent(this.intervalTimer);
                break;
        };
    };
    fireDanmaku(scene){
        switch(this.numberOfShots){
            case 1:
                this.fireShot(scene);
                break;
            default:
                this.repeatShotsTimer.reset(this.repeatShotsConfig);
                scene.time.addEvent(this.repeatShotsTimer);
                break;
        };
    };
    fireShot(scene){
        this.danmakuCounter++;
        if(this.repeatShotsTimer) this.repeatShotsCount = this.repeatShotsTimer.getRepeatCount()
        if(this.danmakuTarget) this.aimAt(this.danmakuTarget);
        switch(this.danmakuAngleLock){
            case true:
                if(this.repeatShotsCount === this.shotsCount) this.referenceAngle = this.rotation;
                break;
            default:
                this.referenceAngle = this.rotation;
                break;
        };
        if(Array.isArray(this.cannonAngleRangeStart)){
            this.cannonAngleRangeRef = readParam(this.cannonAngleRangeStart, this.danmakuCounter);
        }else{
            /// This switch determines how frequently the cannons angle range is "adjusted"
            switch(this.cannonAngleRangeLock){
                case false:
                    this.cannonStepThruAngleRange();
                    break;
                default:
                    if((this.cannonAngleRangeStep !== 0) && (this.repeatShotsCount === this.shotsCount))
                        this.cannonStepThruAngleRange();
                    break;
            };
        };
        this.cannonPositions = [];
        this.cannonAngles = [];
        this.cannonShotSpeeds = [];
        let cannonIndex = [];
        let cannonOrigin = [];
        let flyAwayAngles = [];
        danmakuSpokes({
            danmakuType: this.danmakuType,
            heading: this.referenceAngle,
            vOffset: readParam(this.danmakuVOffset, this.danmakuCounter),
            hOffset: readParam(this.danmakuHOffset, this.danmakuCounter),
            cannonsInNway: readParam(this.danmakuCountA,this.danmakuCounter),
            nwayRange: this.cannonAngleRangeRef,
            numberOfPoints: this.danmakuCountB, /// Number of cannons in PARALLEL      
            nways: this.danmakuMultiple, totalRange: this.danmakuAngleRange,
            offset: readParam(this.danmakuAOffset,this.danmakuCounter),
            width: readParam(this.danmakuWidth, this.danmakuCounter),
            spokesArray: cannonIndex,
            originsArray: cannonOrigin
        });
        switch(this.cannonClass){
            case "PAINT":
                paintCannons({
                    spokesArray: cannonIndex, 
                    originsArray: cannonOrigin,
                    centre: this.danmakuPosition,
                    bulletSpeed: readSpeed(this.shotSpeed, this.bulletSpeed),
                    counter: this.repeatShotsCount,
                    picture: this.danmakuPicture,
                    pAngleRange: this.cannonPAngleRange,
                    pWidth: this.cannonWidth,
                    keepShape: this.danmakuKeepShape,
                    anglesArray: this.cannonAngles, 
                    pointsArray: this.cannonPositions,
                    speedArray: this.cannonShotSpeeds
                });
                break;
            case "DRAW":
                drawCannons({
                    shapes: this.cannonType,
                    pRatio: this.cannonRatio,
                    angleRange: this.cannonPAngleRange,
                    angleIndex: cannonIndex, 
                    originIndex: cannonOrigin,
                    size: this.cannonSize,
                    centre: this.danmakuPosition, /// This is the "centre" of polygon from which the cannonshot speeds will be calibrated
                    numberOfPoints: this.cannonCount, /// Number of bullets to create polygon
                    speed: readSpeed(this.shotSpeed, this.bulletSpeed),
                    bearingOption: this.danmakuOption,
                    keepShape: this.danmakuKeepShape,
                    pRotation: this.cannonPRotation,
                    emerge: this.danmakuSwitch,
                    open: this.danmakuFlag,
                    anglesArray: this.cannonAngles, /// This is the array to hold the cannon angles - pass by reference
                    speedArray: this.cannonShotSpeeds, /// This is the array to hold the cannon shoot speeds - pass by reference
                    cannonPositions: this.cannonPositions,
                    flyAwayOption: this.flyAwayOption,
                    flyAwayAngles: flyAwayAngles,
                });   
                break;    
            default:     
                /// Based on the "spokes", set up the relevant arrays for "NORMAL", "OVERTAKE", "SPREAD" shots
                setUpCannons({
                    shotType: this.shotType,
                    spokesArray: cannonIndex, 
                    originsArray: cannonOrigin,
                    centre: this.danmakuPosition,
                    shotsCount: this.shotsCount,
                    spreadCount: this.spreadCount, /// This is to define the number of shots in each "SPREAD" shot
                    /// bulletSpeed: readParam(readSpeed(this.shotSpeed, this.bulletSpeed),this.danmakuCounter),
                    shotSpeed: readParam(this.shotSpeed, this.danmakuCounter),
                    bulletSpeed: readParam(this.bulletSpeed, this.danmakuCounter),
                    counter: this.repeatShotsCount,
                    shotAcceleration: this.shotAcceleration, /// Used for spreadshot and overtaking shots
                    anglesArray: this.cannonAngles, 
                    pointsArray: this.cannonPositions,
                    speedArray: this.cannonShotSpeeds
                });
                break;
        };
        const bulletImage = { texture: "bullet-atlas", frame: readParam(this.bulletFrame,this.danmakuCounter) };
        for(let i = 0; i < this.spreadCount; i++){
            if(this.cannonShotSFX) this.cannonShotSFX.play();
            for(let j = 0; j < this.cannonShotSpeeds[i].length; j++){
                const shotAngle = this.cannonAngles[j];
                const origin = (this.cannonPositions.length === 0)
                    ? this.danmakuPosition
                    : this.cannonPositions[j];
                const bullet = this.munitions.getFirstDead(false);
                if(bullet){
                    if(this.transformTimer !== undefined)
                        this.bulletTransform.stage1Time = readParam(this.transformTimer, this.danmakuCounter);
                    if(this.flyAwayOption >0) this.bulletTransform.bearing = flyAwayAngles[j];
                    bullet.fire(scene, {
                        parent: this,
                        x: origin.x, y: origin.y,
                        bulletClass: this.bulletClass,
                        cannonAngle: this.referenceAngle,
                        bulletBearing: readAngle(shotAngle, readParam(readParam(this.bulletBearing, this.danmakuCounter), j)), 
                        bulletBearingDelta: this.bulletBearingDelta,
                        bulletBearingVelocity: readParam(readParam(this.bulletBearingVelocity, this.danmakuCounter), j),
                        bulletSwingDelta: readParam(readParam(this.bulletSwingDelta,this.danmakuCounter), j),
                        bulletDamage: this.bulletDamage,
                        bulletSpeed: this.cannonShotSpeeds[i][j],
                        bulletAcceleration: readParam(readParam(this.bulletAcceleration, this.danmakuCounter), j),
                        bulletAngle: readAngle(shotAngle, this.bulletBearing), /// Angle of the bullet image - make it equal to cannon direction
                        bulletAngularVelocity: readParam(readParam(this.bulletAngularVelocity, this.danmakuCounter), j), /// Rotating bullet image
                        bulletTexture: "bullet-atlas",
                        bulletFrame: readParam(bulletImage.frame, j),
                        bulletCycleLength: this.bulletCycleLength,
                        bulletBounceX: this.bulletBounceX,
                        bulletBounceY: this.bulletBounceY,
                        bulletGravityX: readParam(readParam(this.bulletGravityX, this.danmakuCounter), j),
                        bulletGravityY: readParam(readParam(this.bulletGravityY, this.danmakuCounter), j),
                        bulletVRandom: this.bulletVRandom,
                        bulletLife: this.bulletLife,
                        bulletLifeAlpha: this.bulletLifeAlpha,
                        bulletTransform: this.bulletTransform,
                        perTurnConstraint: this.perTurnConstraint,
                        bulletTarget: this.bulletTarget,
                        bulletOffScreen: this.bulletOffScreen,
                        bulletOrbitSpeed: this.bulletOrbitSpeed,
                        bulletSatellite: this.bulletSatellite,
                        bulletAlpha: this.bulletAlpha
                    });
                };
            };
        };
    };
    cannonStepThruAngleRange(){
        this.cannonAngleRangeRef += this.cannonAngleRangeStep;
        switch(Math.sign(this.cannonAngleRangeStep)){
            case 1:
                if(this.cannonAngleRangeRef >= Math.min(Math.PI * 2, this.cannonAngleRangeEnd)){
                    if(!this.cannonAngleRangeYoYo){
                        this.cannonAngleRangeRef = this.cannonAngleRangeStart;
                    }else{
                        this.cannonAngleRangeRef = Math.min(Math.PI * 2, this.cannonAngleRangeEnd);
                        this.cannonAngleRangeStep *= -1;
                        [this.cannonAngleRangeStart, this.cannonAngleRangeEnd] = [this.cannonAngleRangeEnd, this.cannonAngleRangeStart];
                    };
                };
                break;
            default:
                if(this.cannonAngleRangeRef <= Math.max(0, this.cannonAngleRangeEnd)){
                    if(!this.cannonAngleRangeYoYo){
                        this.cannonAngleRangeRef = this.cannonAngleRangeStart;
                    }else{
                        this.cannonAngleRangeRef = Math.max(0, this.cannonAngleRangeEnd);
                        this.cannonAngleRangeStep *= -1;
                        [this.cannonAngleRangeStart,this.cannonAngleRangeEnd] = [this.cannonAngleRangeEnd,this.cannonAngleRangeStart];
                    };
                };
                break;
        };
    };
    setWasher(scene){
        this.setAngle(this.danmakuAngle)
        this.body.setAngularVelocity(0); /// If swing type, cannon angle velocity must be zero
        this.washerTween = this.scene.tweens.add({
            targets: this,
            rotation: {
                from: this.danmakuAngle - Phaser.Math.DegToRad(this.danmakuWasher.swingRange / 2),
                to: this.danmakuAngle + Phaser.Math.DegToRad(this.danmakuWasher.swingRange / 2)
            },
            duration: this.danmakuWasher.cycleLength,
            ease: this.danmakuWasher.swingType,
            repeat: -1,
            yoyo: true
        });
    };
    follow(object){
        this.x = object.x;
        this.y = object.y;
        this.danmakuPosition.x = this.x;
        this.danmakuPosition.y = this.y;
    };
    aimAt(target){
        const targetAngle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );
        this.setRotation(targetAngle);
    };
};

function readSpeed(cannon, inst){
    switch(typeof(inst)){
        case "undefined": return cannon;
        case "number": return inst;
        case "string":
            switch(inst[0]){
                case "n": /// Any string starting with "n" like "null", "none"
                    return cannon
                case "f": /// "flip" the speed (ie: negate it)
                   return cannon * -1;
                case "r": /// Random angle within range given, centered around cannon shotSpeed 
                    const range = parseFloat(inst.substring(1));
                    return cannon + range * (Math.random() - 0.5);
                case "+":
                case "-":
                    return cannon + parseFloat(inst);
                default: break;
            }
            break;
        default: break;
    };
};

function readAngle(cannon, inst){
    switch(typeof(inst)){
        case "undefined": return cannon;
        case "number": return Phaser.Math.DegToRad(inst);
        case "string":
            switch (inst[0]) {
                case "n": /// Any string starting with "n" like "null", "none"
                    return cannon
                case "f": /// "flip" the angle (ie subtrace from 360 degrees)
                    return cannon * -1;
                case "r": /// Random angle within range given, centered around cannon
                    const range = (inst.length === 1)
                        ? Math.PI * 2
                        : Phaser.Math.DegToRad(parseFloat(inst.substring(1)));
                    return cannon + range * (Math.random() - 0.5);
                case "+":
                case "-":
                    return cannon + Phaser.Math.DegToRad(parseFloat(inst));
                case "s": /// Symmetry
                    if(Math.abs(cannon) > Math.PI / 2){
                        return cannon - Phaser.Math.DegToRad(parseFloat(inst.substring(1)));
                    }else if(Math.abs(cannon) < Math.PI / 2){
                        return cannon + Phaser.Math.DegToRad(parseFloat(inst.substring(1)));
                    }else{
                        return cannon; 
                    };
                case "*": return cannon * parseFloat(inst.substring(1));          
                default: break;
            };
        default: break;
    };
};

function readParam(param, count){
    if(Array.isArray(param))
        return param[count % param.length];
    else
        return param;
};

function DegToRad(param){
    if(typeof(param) === "number"){
        return Phaser.Math.DegToRad(param);
    }else{
        const workArray = [];
        param.forEach((item) => {
            workArray.push(DegToRad(item));
        });
        return workArray;
    };
};

function danmakuSpokes({
    danmakuType = "NWAY",
    heading, 
    vOffset = 0,
    hOffset = 0,
    numberOfPoints = 1,
    cannonsInNway=1, nwayRange = Math.PI*2, 
    nways = 1, totalRange = Math.PI*2,
    offset = 0,
    width,
    spokesArray, /// Output array to hold cannon angles
    originsArray /// Output array to hold cannon positions
}){  
    let directions = []; /// This is the working array to hold the cannon angles --> pushed to spokesArray at end of this function
    function getAngles(centreAngle, range, points){
        let tempArray = [];
        switch(points){
            case 1:
                tempArray.push(centreAngle)
                break;
            default:
                switch(range){
                    case Math.PI * 2:
                        tempArray = new Array(points).fill(centreAngle).map((item,index) => Phaser.Math.Angle.Wrap(item + (index * Math.PI * 2) / points))
                        break;
                    default:
                        tempArray = new Array(points).fill(centreAngle).map((item,index) => Phaser.Math.Angle.Wrap(item + (index / (points - 1) - 0.5) * range));
                        break;
                };
                break;     
        };
        return tempArray;
    };
    directions = getAngles(heading + offset, totalRange, nways)
        .reduce((acc,j) => [...acc, ...getAngles(j, nwayRange,cannonsInNway)], []);
    /// Do a bit more processing for PARALLEL and BI-DIRECTIONAL danmaku
    switch(danmakuType){
        case "PARALLEL":
            const line = createLine(0, width); 
            directions.forEach((angle, i) => {
                const shift = new Phaser.Math.Vector2(vOffset, hOffset).rotate(angle);
                for (let j = 0; j < readParam(numberOfPoints, i); j++){
                    const point = line.getPoint(j / (readParam(numberOfPoints, i) - 1))
                        .rotate(angle)
                        .add(shift);
                    originsArray.push(point);
                    spokesArray.push(angle);
                };
            });
            break;        
        case "BI_DIRECTIONAL":
            spokesArray.push(...directions, ...directions.map(x => -x));
            spokesArray.forEach((angle) => {
                const shift = new Phaser.Math.Vector2(vOffset, hOffset).rotate(angle);
                if(vOffset !==0 || hOffset !==0) originsArray.push(new Phaser.Math.Vector2(0,0).add(shift));
            });
            break;
        default:
            directions.forEach((angle) => {
                const shift = new Phaser.Math.Vector2(vOffset, hOffset).rotate(angle);
                if(vOffset !==0 || hOffset !==0) originsArray.push(new Phaser.Math.Vector2(0,0).add(shift));
                spokesArray.push(angle);
            });
            break;
    };
};

function setUpCannons({
    shotType, 
    spokesArray,
    originsArray,
    centre,
    shotsCount, 
    spreadCount,
    shotSpeed,
    bulletSpeed, 
    counter, 
    shotAcceleration,
    anglesArray,
    pointsArray,
    speedArray
}){ 
    anglesArray.push(...spokesArray);
    pointsArray.push(...originsArray.reduce((acc,p) => [...acc, p.add(centre)], []));
    switch(shotType){
        case "OVERTAKE":
            speedArray.push(new Array(anglesArray.length).fill(bulletSpeed + (shotsCount - counter) * shotAcceleration));
            break;
        case "SPREAD":
            speedArray.push(...new Array(spreadCount)
                .fill(bulletSpeed)
                .map((item, i) => new Array(anglesArray.length).fill(item + shotAcceleration * i)));
            break;    
        default: /// "NORMAL"
            speedArray.push(new Array(anglesArray.length)
                .fill(1)
                .map((x, i) => readSpeed(readParam(shotSpeed, i), readParam(bulletSpeed, i))));
            break;  
    };
};

function paintCannons({
    spokesArray,
    originsArray,
    centre,
    bulletSpeed, 
    counter, 
    picture,
    pAngle,
    pAngleRange,
    pWidth = 100,
    keepShape = false,
    anglesArray,
    pointsArray,
    speedArray
}){
    const speeds = [];
    const textLine = picture[counter];
    const count = textLine.length;
    const line = createLine(0, pWidth);
    spokesArray.forEach((angle,j) => {
        const realOrigin = (originsArray.length === 0)
            ? centre
            : originsArray[j].add(centre); 
        Array.from(textLine).forEach((char, i) => {
            if(char !== " "){
                switch(keepShape){
                    case true:
                        const point = line.getPoint(i / (count - 1))
                            .rotate(angle)
                            .add(realOrigin);
                        pointsArray.push(point);
                        anglesArray.push(angle);
                        break;
                    default:
                        anglesArray.push(angle + pAngleRange * (0.5 - i / (count - 1)));
                        break;
                };
                speeds.push(bulletSpeed);
            };
        });
    });
    speedArray.push(speeds);
};

function createLine(offset = 0, width){
    const aa = new Phaser.Math.Vector2(offset, width / 2);
    const bb = new Phaser.Math.Vector2(offset, -width / 2);
    return new Phaser.Curves.Line(aa, bb);
};

function drawCannons({
    shapes,
    pRatio = 1,
    angleRange,
    angleIndex,
    originIndex,
    size = 0,
    centre,
    numberOfPoints,
    speed,
    bearingOption = 1,
    pRotation,
    keepShape = true,  
    emerge = 1, /// 1: explode, -1: implode
    open = false, 
    anglesArray,
    speedArray,
    cannonPositions,
    flyAwayOption = 0,
    flyAwayAngles = []
}){
    const curve = (shapes === "arc")
        ? createArc(pRatio, Phaser.Math.RadToDeg(angleRange))
        : album.pages[shapes].drawing;
    const aspectRatio = new Phaser.Math.Vector2(size / 2, size / 2);
    const speeds = []; 
    angleIndex.forEach((angle, j) => {
        const realOrigin = (originIndex.length === 0)
            ? centre
            : originIndex[j].add(centre); 
        let angleT = 0;
        for(let i = 0; i < numberOfPoints; i++){
            const point = curve.getPoint(i / (numberOfPoints - 1 * open))
                .rotate(Math.PI / 2 + (pRotation === undefined ? angle : pRotation)); 
            if(keepShape){
                switch(emerge){
                    case 0:
                        anglesArray.push(angle);
                        speeds.push(speed)
                        break;
                    default:
                        anglesArray.push((emerge === 1)
                            ? Phaser.Math.Angle.BetweenPoints(Phaser.Math.Vector2.ZERO, point)
                            : Phaser.Math.Angle.BetweenPoints(point, Phaser.Math.Vector2.ZERO));
                        speeds.push(Phaser.Math.Distance.BetweenPoints(Phaser.Math.Vector2.ZERO, point) * speed);
                        break;
                };
            }else{
                switch(emerge){
                    case 0:
                        anglesArray.push(angle);
                        speeds.push(Phaser.Math.Distance.BetweenPoints(Phaser.Math.Vector2.ZERO, point) * speed);
                        break;
                    default:
                        anglesArray.push((emerge === 1)
                            ? Phaser.Math.Angle.BetweenPoints(Phaser.Math.Vector2.ZERO, point) + angleT * bearingOption
                            : Phaser.Math.Angle.BetweenPoints(point, Phaser.Math.Vector2.ZERO) -+ angleT * bearingOption);
                        speeds.push(speed);
                        break;
                };
            };
            cannonPositions.push(point.multiply(aspectRatio).add(realOrigin));
            flyAwayAngles.push(Phaser.Math.RadToDeg(angleT * flyAwayOption));
            /// flyAwayAngles.push(Phaser.Math.RadToDeg((angle + angleT) * flyAwayOption));
            angleT += Math.PI * 2 / numberOfPoints;
        };
    });
    speedArray.push(speeds);
};

function createArc(aspectRatio = 1, angleRange){
    angleRange = isNaN(angleRange) ? 360 : angleRange;
    const startAngle = (angleRange === undefined) ? 0 : -90 - angleRange / 2;
    const endAngle = (angleRange === undefined) ? 360 : -90 + angleRange / 2;
    const ellipse = new Phaser.Curves.Ellipse(0, 0, 1, aspectRatio, startAngle, endAngle);
    return ellipse;
};