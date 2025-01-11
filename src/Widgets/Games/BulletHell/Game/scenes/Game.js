import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


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


const enemies = {
    yupina: {
        health: 10,
        defense: 0,
        speed: 1.5,
    },
    bread: {
        health: 10,
        defense: 0,
        speed: 1.5,
        healthXOffset: 6
    },
    cabbage: {
        health: 10,
        defense: 0,
        speed: 1.5,
    },
    cornbread: {
        health: 10,
        defense: 0,
        speed: 1.5,
    },
    onion: {
        health: 10,
        defense: 0,
        speed: 1.5,
        healthXOffset: 5
    },
    potatoe: {
        health: 10,
        defense: 0,
        speed: 1.5,
    },
    raspberry: {
        health: 10,
        defense: 0,
        speed: 1.5,
        healthXOffset: 5
    }
};
const boss = ["X3", "O3O", "-3-", "smug", "pleased"];
const patterns = [
    "touhouFangameRecollectionOfScriptersPast",
    "generation1_1"
];
const generation1_1Patterns = [
    "spiralColorfulSpeen",
    "arrowSparsedVomit",
    "icicleBloodAndIce",
    "spiralRadiantBloom",
    "spiralCosmicDance"
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
                this.boss.bulletPattern.length = 0;
                this.bossBullets.getMatching("active", true).forEach((bullet) => {
                    bullet.remove();
                });
                this.boss.kill();
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
        this.player = new Player(this, 'player-default', 300, 750)
            .setOffset(37, 60);
    };
    createEnemy(){
        this.enemies = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
        this.spawnEnemy();
        this.time.delayedCall(1000, this.spawnEnemy, [], this);
        this.time.delayedCall(2000, this.spawnEnemy, [], this);
    };
    createBoss(){
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
        let randomBoss = boss[Math.floor(Math.random() * boss.length)];
        this.boss = new Boss(
            1, 200, 1, this, randomBoss,
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
        this.player.abilitiesRaw = [...data.abilities];
        this.player.weapons.push(new DefaultBullet(this, this.player.dex, this.player.atk, this.player.str));
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
            if(player.active && player.hp.decrease(bullet.damage)){
                player.dead();
                this.clearScreen();
            };
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
                this.playerAbilitiesBullets.getBullet().fire({
                    x: ability.x, y: ability.y,
                    angle: -90,
                    damage: bullet.damage,
                    speed: 200 + this.player.str,
                    tracking: bullet.tracking,
                    texture: bullet.frame.name,
                    scaleSpeed: bullet.scaleSpeed,
                    target: (bullet.target === null) ? null : this.boss,
                    maxLife: bullet.maxLife,
                    alpha: 0.5
                });
            };
            if(!ability.attack){
                bullet.remove();
            };
        };    
    };
    enemyHitCallback(bullet, enemy){
        if(bullet.active === true && enemy.active === true){
            if(enemy.hp.decrease((bullet.attack)
                ? this.player.atk
                : (bullet.addition)
                    ? this.player.atk / 4
                    : bullet.damage
            )){
                enemy.kill();
                if(enemy?.key !== "boss"){
                    this.spawnEnemy();
                }else{
                    this.clearScreen();   
                };
            };
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
    constructor(scene, texture, x, y){
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setTexture(texture);
        this.setDrag(500, 500);
        this.setDepth(5);
        this.setSize(12, 12);
        this.displayWidth = 32;
        this.displayHeight = 50;
        this.speed = 300;
        this.weapons = [];
        this.weaponIndex = 0;
        this.abilities = {};
        this.abilitiesRaw = [];
        this.ability = null;
        this.abilityIndex = 0;
        this.abilityTimer = 0;
        this.abilityCooldown = 0;
        this.keyInitialized = false;
        this.mobileAbility = false;
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
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
        if(this.active && (this.weapons.length !== 0)){
            this.weapons[this.weaponIndex].fireBullet({
                sneak: (mouseMovement) ? false : this.keyShift?.isDown,
                player: this,
                ammo: this.scene.playerBullets,
                angle: -90
            });
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
    constructor(atk, atkSpd, atkRate, ...arg){
        super(...arg);
        this.setDepth(4);
        this.setSize(200, 200);
        this.setDisplaySize(256, 256);
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
    };
    preUpdate(){
        if(this.x !== this.hp.x || this.y !== this.hp.y){
            this.hp.move(this.x, this.y);
        };
        if(150 !== this.body.velocity.y){
            this.body.setVelocityY(150);
        };
        if(this.alive && this.ready){
            if(!this.pattern){
                this.pattern = patterns[Math.floor(Math.random() * patterns.length)];
            };
            this[this.pattern]();
            if(/\b0\b|\b5000\b|\b10000\b|\b15000\b|\b20000\b|\b25000\b|\b30000\b|\b35000\b|\b40000\b|\b45000\b/.test(this.phaseTimer.toString())
                && this.scene.player.active){
                this.spawnBomb(3);
            };
            this.phaseTimer++;
            if(this.phaseTimerOffset !== -1){
                this.phaseTimer = this.phaseTimerOffset;
                this.phaseTimerOffset = -1;
            };
            for(let pattern of this.bulletPattern){
                if(pattern.delay && (pattern.delayTimer !== 0) && (pattern.attackDurationTimer === pattern.atkDuration)){
                    pattern.delayTimer++;
                    if(pattern.delayTimer > pattern.delay){
                        pattern.delayTimer = 0;
                        pattern.attackDurationTimer = 0;
                    };
                }else{
                    pattern.attackTimer++;
                    if(pattern.attackTimer > pattern.atkRate + this.atkRateDebuff){
                        pattern.attackTimer = 0;
                        pattern.attackDurationTimer++;
                        if(pattern.attackDurationTimer === pattern.atkDuration){
                            pattern.delayTimer++;
                        };
                        this[pattern.attack]();
                    };
                };
            };
        };
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
                let bullet = this.scene.bossBullets.getBullet();
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
                        bullet = this.scene.bossBullets.getBullet();
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
        this.maxBullets = maxBullets;
        this.index = 0;
        this.bullets = this.createMultiple({
            classType: Bullet,
            key: ('bullet'),
            frameQuantity: maxBullets,
            active: false,
            visible: false,
            runChildUpdate: true
        });
    };
    getBullet(){
        const bullet = this.bullets[this.index];
        this.index = (this.index + 1) % this.maxBullets; // Move index in a circular manner
        return bullet;
    };
};

class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene){
        super(scene, 0, 0, "bullet-atlas");
        this.scene = scene;
    };
    fire({ x, y, angle = 0, damage = 1, speed, gx = 0, gy = 0, tracking = false, texture = 'circle-black', scaleSpeed = 0, target = null, maxLife = 4500, size = 1, alpha = 1 }){
        this.enableBody(true, x, y, true, true);   
        this.setFrame(texture);
        this.setScale(size);
        this.setAlpha(alpha);
        if(this.width !== this.height){
            let minValue = Math.min(this.width, this.height);
            this.setSize(minValue / 1.6, minValue / 1.6);
        }else{
            this.setSize(this.width / 1.6, this.height / 1.6);
        };
        this.angle = angle;
        this.damage = damage;
        this.maxLife = maxLife;
        this.tracking = tracking;
        this.scaleSpeed = scaleSpeed;
        this.target = target;
        this.born = 0;
        if(target){
            this.scene.physics.moveToObject(this, target, speed);
        }else{
            this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);    
        };
        this.body.gravity.set(gx, gy);
    };
    resetBullet(){
        this.angle = 0;
        this.damage = 1;
        this.maxLife = 4500;
        this.tracking = false;
        this.scaleSpeed = 0;
        this.target = null;
        this.born = 0;
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.born++;
        if(this.active && ((this.born > this.maxLife) || this.isOutOfBounds())){
            this.remove();
        };
        if(this.tracking){
            this.rotation = this.body.velocity.angle();
        };   
        if(this.scaleSpeed > 0){
            this.setScale(this.scaleX + this.scaleSpeed, this.scaleY + this.scaleSpeed);
        };
    };
    remove(){
        this.resetBullet();
        this.disableBody(true, true);
    };
    isOutOfBounds(){
        return this.x < -15 || this.x > 615 || this.y < -15 || this.y > 865;
    };
};

class DefaultBullet{
    constructor(scene, fireRate = 0, bulletDamage = 1, bulletSpeed = 0){
        this.scene = scene;
        this.name = 'default';
        this.nextFire = 0;
        this.fireRate = -fireRate + 200;
        this.bulletDamage = bulletDamage;
        this.bulletSpeed = bulletSpeed + 200;
        this.bulletTexture = 'circle-black';
    };
    fireBullet({ sneak = false, texture, player, ammo, angle, target }){  
        if(this.scene.time.now < this.nextFire) { return; };
        ammo.getBullet().fire({
            x: player.x,
            y: player.y,
            angle: angle,
            damage: this.bulletDamage,
            speed: this.bulletSpeed,
            target: target,
            texture: (texture) ? texture : this.bulletTexture,
            alpha: 0.5
        });
        if(sneak){
            const offsets = [-5, 5];
            for(let i of offsets){
                ammo.getBullet().fire({
                    x: player.x, y: player.y,
                    angle: angle + i,
                    damage: this.bulletDamage / 2,
                    speed: this.bulletSpeed,
                    target: target,
                    texture: (texture) ? texture : this.bulletTexture,
                    alpha: 0.5
                });
            };
        };
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class SingleBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Single';
        this.nextFire = 0;   
        this.fireRate = 200;
        this.bulletSpeed = 200;
        this.bulletTexture = 'circle-black'
    };
    fireLaser({ texture, player, ammo, angle, target, damage, speed }){  
        if(this.scene.time.now < this.nextFire) { return; };
        ammo.getBullet().fire({
            x: player.x,
            y: player.y,
            angle: angle,
            damage: damage + 1,
            speed: this.bulletSpeed + speed,
            target: target,
            texture: (texture) ? texture : this.bulletTexture
        });
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class FrontAndBackBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Front And Back';
        this.nextFire = 0;
        this.fireRate = 600;
        this.bulletSpeed = 100;
        this.bulletTexture = 'bullet5';
    };
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, target: target, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 180, speed: this.bulletSpeed, texture: this.bulletTexture});
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class ThreeWayBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Three Way'
        this.nextFire = 0;
        this.fireRate = 600;
        this.bulletSpeed = 100;
        this.bulletTexture = 'bullet7';
    };
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 270, speed: this.bulletSpeed, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, texture: this.bulletTexture, target: target});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 90, speed: this.bulletSpeed, texture: this.bulletTexture});
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class EightWayBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Eight Way'
        this.nextFire = 0;
        this.fireRate = 600;
        this.bulletSpeed = 100;
        this.maxLife = 500;
        this.bulletTexture = 'bullet5';
    };
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, target: target, maxLife: this.maxLife, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 45, speed: this.bulletSpeed, maxLife: this.maxLife, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 90, speed: this.bulletSpeed, maxLife: this.maxLife, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 135, speed: this.bulletSpeed, maxLife: this.maxLife, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 180, speed: this.bulletSpeed, maxLife: this.maxLife, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 225, speed: this.bulletSpeed, maxLife: this.maxLife, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 270, speed: this.bulletSpeed, maxLife: this.maxLife, texture: this.bulletTexture});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle + 315, speed: this.bulletSpeed, maxLife: this.maxLife, texture: this.bulletTexture});
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class ScatterShotBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Scatter Shot'
        this.nextFire = 0;    
        this.fireRate = 560;
        this.bulletSpeed = 140;
        this.bulletTexture = 'bullet5';
    };
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };
        const y = (player.y + player.height / 2) + Phaser.Math.Between(-10, 10);
        ammo.getFirstDead(false)?.fire({x: player.x, y: y, angle: angle, speed: this.bulletSpeed, texture: this.bulletTexture});
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class BeamBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Beam';
        this.nextFire = 0;
        this.fireRate = 300;
        this.bulletSpeed = 200;
        this.maxLife = 500;
        this.bulletTexture = 'bullet11';
    };
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, texture: this.bulletTexture, target: target, maxLife: this.maxLife});
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class SplitShotBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Split Shot'    
        this.nextFire = 0;
        this.fireRate = 600;
        this.bulletSpeed = 100;
        this.maxLife = 500;
        this.bulletTexture = 'bullet8';
    };    
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, gx: 0, gy: -500, texture: this.bulletTexture, target: target, maxLife: this.maxLife});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, gx: 0, gy: 0, texture: this.bulletTexture, target: target, maxLife: this.maxLife});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, gx: 0, gy: 500, texture: this.bulletTexture, target: target, maxLife: this.maxLife});
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class PatternBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Pattern';
        this.nextFire = 0;
        this.fireRate = 300;
        this.bulletSpeed = 100;
        this.pattern = Phaser.Utils.Array.NumberArrayStep(-800, 800, 200);
        this.pattern = this.pattern.concat(Phaser.Utils.Array.NumberArrayStep(800, -800, -200));
        this.patternIndex = 0;
        this.bulletTexture = 'bullet4';
    }; 
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, gx: 0, gy: this.pattern[this.patternIndex], texture: this.bulletTexture, target: target});
        this.patternIndex++;
        if(this.patternIndex === this.pattern.length){
            this.patternIndex = 0;
        };
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class RocketsBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Rockets';
        this.nextFire = 0;
        this.fireRate = 600;
        this.bulletSpeed = 100;
        this.bulletTexture = 'bullet10';
    };
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, gx: 0, gy: -700, tracking: true, texture: this.bulletTexture, target: target});
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, gx: 0, gy: 700, tracking: true, texture: this.bulletTexture, target: target});
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class ScaleBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Scale Bullet';
        this.nextFire = 0;
        this.fireRate = 600;
        this.bulletSpeed = 100;
        this.bulletTexture = 'bullet9';
    };
    fireLaser(player, ammo, angle, target){
        if(this.scene.time.now < this.nextFire){ return; };    
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, texture: this.bulletTexture, scaleSpeed: 0.006, target: target});  
        this.nextFire = this.scene.time.now + this.fireRate;
    };
};

class Combo1Bullet{
    constructor(scene){
        this.scene = scene;
        this.name = "Combo One";
        this.weapon1 = new SingleBullet(scene);
        this.weapon2 = new RocketsBullet(scene);
    };
    fireLaser(player, ammo, angle, target){
        this.weapon1.fireLaser(player, ammo, angle, target);
        this.weapon2.fireLaser(player, ammo, angle, target);  
    };
};

class Combo2Bullet{
    constructor(scene){
        this.scene = scene;
        this.name = "Combo Two";
        this.weapon1 = new PatternBullet(scene);
        this.weapon2 = new ThreeWayBullet(scene);
        this.weapon3 = new RocketsBullet(scene);
    };
    fireLaser(player, ammo, angle, target){ 
        this.weapon1.fireLaser(player, ammo, angle, target);
        this.weapon2.fireLaser(player, ammo, angle, target);
        this.weapon3.fireLaser(player, ammo, angle, target);  
    };
};