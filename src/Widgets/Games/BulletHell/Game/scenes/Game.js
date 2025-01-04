import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


//#region z-index guide
/*
1 - Enemy
2 - Menu
3 - Player bullets
4 - Boss
5 - Player
6 - Health
7 - Boss bullets
8 - Bomb
9 - Abilities
*/
//#endregion


const enemies = {
    yupina: {
        health: 10,
        defense: 0,
        speed: 1.5,
    }
};
const boss = ["-3-", "030", "pleased", "smug", "X3"];
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


export class Game extends Scene{
    constructor(){
        super('Game');
        this.player = null;
        this.boss = null;
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
                this.toggleMenu(false);
                this.player.revive();
                this.playerAbilities.getChildren().forEach((ability) => {
                    ability.destroy();
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
    };
    toggleMenu(isHide, isGameover = false){
        if(isHide){
            this.buttonContainer.setVisible(false);
            this.buttonPlay.setVisible(false);
            this.textPlay.setVisible(false);
            this.buttonMouseMovement.setVisible(false);
            this.textMouseMovement.setVisible(false);
            this.enemies.children.entries.forEach((enemy) => {
                enemy.kill(); 
            });
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
        this.playerAbilities = this.physics.add.group({ classType: Phaser.GameObjects.Sprite })
            .setDepth(9);
        this.player = new Player(this, 'player-default', 300, 750)
            .setOffset(37, 60);
    };
    createEnemy(){
        this.enemies = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
        this.spawnEnemy();
    };
    createBoss(){
        this.bossBullets = new Bullets(this, 5000)
            .setDepth(7);
        this.bossBombs = this.physics.add.group({ classType: Phaser.GameObjects.Sprite })
            .setDepth(8);
    };
    createColliders(){
        this.anchorBoss = this.physics.add.sprite(300, 280)
            .setPushable(false);
        this.physics.add.collider(this.player, this.enemyBullets, (player, bullet) => {
            this.playerHitCallback(bullet, player);
        });
        this.physics.add.collider(this.player, this.bossBullets, (player, bullet) => {
            this.playerHitCallback(bullet, player);
        });
        this.physics.add.collider(this.enemies, this.playerBullets, (enemy, bullet) => {
            this.enemyHitCallback(bullet, enemy);
        });
    };
    spawnEnemy(){
        let enemiesKeys = Object.keys(enemies);
        let randomEnemy = enemiesKeys[Math.floor(Math.random() * enemiesKeys.length)];
        let randomX = Math.random() * 500 + 100;
        this.enemies.add(
            new Enemy(
                this,
                randomEnemy,
                randomX, 0,
                enemies[randomEnemy].health,
                enemies[randomEnemy].defense,
                enemies[randomEnemy].speed)
        );
    };
    spawnBoss(){
        let randomBoss = boss[Math.floor(Math.random() * boss.length)];
        this.boss = new Boss(
            1, 200, 1, this, `boss-${randomBoss}`,
            300, 0, 1000, 0, 100
        );
        this.physics.add.collider(this.boss, this.player, (boss, player) => {
            if(player.hp.decrease(1)){
                player.dead();
                this.clearScreen();
            };
        });
        this.physics.add.collider(this.boss, this.playerBullets, (boss, bullet) => {
            this.enemyHitCallback(bullet, boss);
        });
        this.physics.add.collider(this.boss, this.anchorBoss, (boss, anchor) => {
            this.boss.body.setVelocityY(0);
            this.boss.ready = true;
        });
        this.physics.add.collider(this.bossBombs, this.player, (player, bomb) => {
            bomb.destroy();
            if(((3 * Math.floor((this.bossBombs.getLength()) / 3)) === this.bossBombs.getLength())
                && this.boss.hp.decrease(100)){
                this.boss.kill();
            };
        });
    };
    setData(data){
        this.player.hp = new HealthBar(this, data.stats.health, 10, 11);
        this.player.mana = data.stats.mana;
        this.player.atk = data.stats.attack;
        this.player.def = data.stats.defense;
        this.player.str = data.stats.strength;
        this.player.agi = data.stats.agility;
        this.player.vit = data.stats.vitality;
        this.player.res = data.stats.resilience;
        this.player.int = data.stats.intelligence;
        this.player.dex = data.stats.dexterity;
        this.player.lck = data.stats.luck;
        this.player.abilities = [...data.abilities];
        this.player.setAbilities();
    };
    playerHitCallback(bullet, player){
        if(bullet.active === true){
            bullet.remove();
            if(player.active && player.hp.decrease(bullet.damage)){
                player.dead();
                this.clearScreen();
            };
        };
    };
    enemyHitCallback(bullet, enemy){
        if(bullet.active === true && enemy.active === true){
            bullet.remove();
            if(enemy.hp.decrease(this.player.atk)){
                enemy.kill();
                if(enemy?.key !== "boss"){
                    this.spawnEnemy();
                }else{
                    this.clearScreen();   
                };
            };
        };
    };
    clearScreen(){
        this.toggleMenu(false, true);
        this.bossBombs.clear(true, true);
    };
};

class HealthBar{
    constructor(scene, health, offsetX, offsetY){
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setDepth(6);
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
        this.setPushable(false);
        this.setTexture(texture);
        this.setDrag(500, 500);
        this.setDepth(5);
        this.setSize(12, 12);
        this.displayWidth = 32;
        this.displayHeight = 50;
        this.weapons = [];
        this.weaponIndex = 0;
        this.weapons.push(new DefaultBullet(scene));
        this.ability = null;
        this.abilityTimer = 0;
        this.abilityCooldown = 0;
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
        this.scene.input.on('pointerdown', (pointer) => {
            if(isMobile){
                this.setPosition(pointer.x, pointer.y);
            };
        });    
        this.scene.input.on('pointermove', (pointer) => {
            if(isMobile){
                this.setPosition(pointer.x, pointer.y);
            };
        });    
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.hp.move(this.x, this.y);
        this.setVelocity(0);
        if(mouseMovement){
            let pointer = this.scene.input.activePointer;
            this.setPosition(pointer.x, pointer.y);
        };
        if(this.keyW?.isDown || this.keyUp?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityY(-100);
            }else{
                this.setVelocityY(-300);
            };
        };
        if(this.keyA?.isDown || this.keyLeft?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityX(-100);
            }else{
                this.setVelocityX(-300);
            };
        };
        if(this.keyS?.isDown || this.keyRight?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityY(100);
            }else{
                this.setVelocityY(300);
            };
        };
        if(this.keyD?.isDown || this.keyDown?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityX(100);
            }else{
                this.setVelocityX(300);
            };
        };
        if(this.active){
            this.weapons[this.weaponIndex].fireBullet({
                sneak: this.keyShift?.isDown,
                player: this,
                ammo: this.scene.playerBullets,
                angle: -90,
                damage: this.atk + this.str,
                speed: this.dex * 50
            });
        };
        if(this.ability !== null){
            if(this.abilityTimer < this.abilityCooldown){
                this.abilityTimer += delta / 1000;
            };
            if(this.keyAbility?.isDown && this.abilityTimer >= this.abilityCooldown){
                this[this.ability]();
                this.abilityTimer = 0;
            };
        };
    };
    setAbilities(){
        for(let ability of this.abilities){
            switch(ability){
                case "Places a grass block":
                    this.ability = "grassBlock";
                    this.abilityCooldown = 60;
                    break;
                default: break;
            };
        };
        this.abilityTimer = this.abilityCooldown;
    };
    dead(){
        this.active = false;
        this.hp.draw();
    };
    revive(){
        this.active = true;
        this.hp.reset();
    };
    grassBlock(){
        let grassBlock = this.scene.physics.add.sprite(this.x, this.y - this.height / 2, "abilities-grass-block")
            .setDepth(9);
        this.scene.playerAbilities.add(grassBlock);
    };
};

class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, texture, x, y, health, defense, speed){
        super(scene, x);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setPushable(false);
        this.setTexture(texture);
        this.setPosition(x, y);
        this.setDepth(1);
        this.setSize(128, 128);
        this.setDisplaySize(96, 96);
        this.health = health;
        this.hp = new HealthBar(scene, health, this.displayWidth / 8, 11);
        this.def = defense;
        this.spd = speed;
        this.alive = true;
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.hp.move(this.x, this.y);
        this.body.setVelocityY(this.spd * 100);
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
        this.setPushable(false);
        this.key = "boss";
        this.phaseTimer = 0;
        this.phaseTimerOffset = -1,
        this.hp = new HealthBar(this.scene, this.health, 6, 80);
        this.atk = atk;
        this.atkSpd = atkSpd;
        this.atkRate = atkRate;
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
        this.hp.move(this.x, this.y);
        this.body.setVelocityY(150);
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
                    if(pattern.attackTimer > pattern.atkRate){
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
    attack({ delay = 0, amount = 1, angleChange = 0, x = this.x, y = this.y, angle = 0, damage = this.atk, speed = this.atkSpd, gx = 0, gy = 0, tracking = false, texture = 'circle-black', scaleSpeed = 0, target = null, maxLife = 4500, size = 1 }){
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
    constructor(scene){
        this.scene = scene;
        this.name = 'Default';
        this.nextFire = 0;   
        this.fireRate = 200;
        this.bulletSpeed = 200;
        this.bulletTexture = 'circle-black'
    };
    fireBullet({ sneak = false, texture, player, ammo, angle, target, damage, speed }){  
        if(this.scene.time.now < this.nextFire) { return; };
        ammo.getBullet().fire({
            x: player.x,
            y: player.y,
            angle: angle,
            damage: damage + 1,
            speed: this.bulletSpeed + speed,
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
                    damage: (damage + 1) / 2,
                    speed: this.bulletSpeed + speed,
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