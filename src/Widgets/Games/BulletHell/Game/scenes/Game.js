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
    // "touhouFangameRecollectionOfScriptersPast",
    // "spiral",
    "generation1_1"
];
let mouseMovement = false;


export class Game extends Scene{
    constructor(){
        super('Game');
        this.player = null;
        this.weaponIndex = 0;
        this.weapons = [];
        this.weaponName = null;
        this.boss = null;
    };
    create(){
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
                mouseMovement = !mouseMovement;
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
        this.weapons.push(new SingleBullet(this));
        this.weapons.push(new FrontAndBackBullet(this));
        this.weapons.push(new ThreeWayBullet(this));
        this.weapons.push(new EightWayBullet(this));
        this.weapons.push(new ScatterShotBullet(this));
        this.weapons.push(new BeamBullet(this));
        this.weapons.push(new SplitShotBullet(this));    
        this.weapons.push(new PatternBullet(this));
        this.weapons.push(new RocketsBullet(this));
        this.weapons.push(new ScaleBullet(this));  
        this.weapons.push(new Combo1Bullet(this));
        this.weapons.push(new Combo2Bullet(this));    
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
            1,
            200,
            1,
            this,
            `boss-${randomBoss}`,
            300, 0,
            1000,
            0,
            100)
        this.physics.add.collider(this.boss, this.player, (boss, player) => {
            if(player.hp.decrease(1)){
                player.dead();
                this.toggleMenu(false, true);
            };
        });
        this.physics.add.collider(this.boss, this.playerBullets, (boss, bullet) => {
            this.enemyHitCallback(bullet, boss);
        });
        this.physics.add.collider(this.boss, this.anchorBoss, (boss, anchor) => {
            this.boss.body.setVelocityY(0);
            this.boss.ready = true;
        });
    };
    setData(data){
        this.player.hp = new HealthBar(this, data.health, 10, 11);
        this.player.mana = data.mana;
        this.player.atk = data.attack;
        this.player.def = data.defense;
        this.player.str = data.strength;
        this.player.agi = data.agility;
        this.player.vit = data.vitality;
        this.player.res = data.resilience;
        this.player.int = data.intelligence;
        this.player.dex = data.dexterity;
        this.player.lck = data.luck;
    };
    playerHitCallback(bullet, player){
        if(bullet.active === true){
            bullet.remove(true);
            if(player.active && player.hp.decrease(bullet.damage)){
                player.dead();
                this.toggleMenu(false, true);
            };
        };
    };
    enemyHitCallback(bullet, enemy){
        if(bullet.active === true && enemy.active === true){
            bullet.remove(true);
            if(enemy.hp.decrease(this.player.atk)){
                enemy.kill();
                this.spawnEnemy();
            };
        };
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
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.hp.move(this.x, this.y);
        this.setVelocity(0);
        if(mouseMovement){
            let pointer = this.scene.input.activePointer;
            this.setPosition(pointer.x, pointer.y);
        };
        if(this.keyW?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityY(-100);
            }else{
                this.setVelocityY(-300);
            };
        };
        if(this.keyA?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityX(-100);
            }else{
                this.setVelocityX(-300);
            };
        };
        if(this.keyS?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityY(100);
            }else{
                this.setVelocityY(300);
            };
        };
        if(this.keyD?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityX(100);
            }else{
                this.setVelocityX(300);
            };
        };
        if(this.active){
            this.scene.weapons[this.scene.weaponIndex].fireLaser({
                player: this,
                ammo: this.scene.playerBullets,
                angle: -90,
                damage: this.atk + this.str,
                speed: this.dex * 50
            });
        };
    };
    dead(){
        this.active = false;
        this.hp.draw();
    };
    revive(){
        this.active = true;
        this.hp.reset();
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
        // if(this.phaseTimer === 0){
        //     this.bulletPattern = [
        //         {
        //             atkRate: 25,
        //             attackTimer: 0,
        //             attack: "colorWaveLasers"
        //         }
        //     ];
        // }
        // if(this.phaseTimer === 0){
        //     this.bulletPattern = [
        //         {
        //             atkRate: 30,
        //             attackTimer: 0,
        //             attack: "randomBurstArrows"
        //         }
        //     ];
        // }
    }
    colorWaveLasers(){
        if(!this.paramsColorWaveLasers){
            this.paramsColorWaveLasers = {
                laserAngle: 0,
                laserSpeed: 400,
                rotationSpeed: 8,
                colors: ["laser-red", "laser-blue", "laser-green", "laser-yellow"],
            };
        }
        const params = this.paramsColorWaveLasers;
        const lasers = 8;
        for(let i = 0; i < lasers; i++){
            const angle = Phaser.Math.DegToRad(params.laserAngle + (360 / lasers) * i);
            const texture = params.colors[i % params.colors.length];
            this.attack({
                x: this.x,
                y: this.y,
                speed: params.laserSpeed,
                angle: Phaser.Math.RadToDeg(angle),
                texture: texture,
                size: 3
            });
        }
        params.laserAngle += params.rotationSpeed;
    }
    randomBurstArrows(){
        if(!this.paramsRandomBurstArrows){
            this.paramsRandomBurstArrows = {
                burstCount: 10,  // Increased number of arrows in the burst
                burstSpeed: 450,  // Increased speed for harder dodging
                angleVariance: 15,  // Reduced variance for more precise dodging
                textures: ["arrow-red", "arrow-blue", "arrow-green", "arrow-yellow"]
            };
        }
        const params = this.paramsRandomBurstArrows;
        for(let b = 0; b < params.burstCount; b++){
            const angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
            const speed = Phaser.Math.Between(params.burstSpeed - 100, params.burstSpeed + 100);
            const texture = params.textures[Phaser.Math.Between(0, params.textures.length - 1)];
            this.attack({
                x: this.x,
                y: this.y,
                speed: speed,
                angle: Phaser.Math.RadToDeg(angle + Phaser.Math.Between(-params.angleVariance, params.angleVariance)),
                texture: texture,
                size: 4
            });
        }
    }
    spiral(){
        if(this.phaseTimer === 0){
            this.bulletPattern = [
                {
                    atkRate: 20,
                    attackTimer: 0,
                    attack: "spiralChaos"
                }
            ];
        };
        if(this.phaseTimer === 5000){
            this.bulletPattern = [
                {
                    atkRate: 40,
                    attackTimer: 0,
                    attack: "spiralRadiantBloomSymphony"
                }
            ];
        };
        if(this.phaseTimer === 10000){
            this.bulletPattern = [
                {
                    atkRate: 20,
                    attackTimer: 0,
                    attack: "spiralCosmicDance"
                }
            ];
        };
        if(this.phaseTimer === 15000){
            this.bulletPattern = [
                {
                    atkRate: 90,
                    attackTimer: 0,
                    attack: "spiralEtherealHarmony"
                }
            ];
        };
        if(this.phaseTimer === 20000){
            this.phaseTimerOffset = 0;
        };
    };
    spiralChaos(){
        if(!this.paramsSpiralChaos){
            this.paramsSpiralChaos = {
                angle: 0,
                radius: 100,
                speed: 200,
                rotationSpeed: 4,
                spiralSpeed: 10,
                burstDelay: 0,
            };
        };
        const params = this.paramsSpiralChaos;
        const numLayers = 4;
        const bulletsPerLayer = 36;
        const baseRadius = 100;
        const radiusIncrement = 10;
        const maxSpeed = 300;
        for(let layer = 0; layer < numLayers; layer++){
            const layerRadius = baseRadius + layer * radiusIncrement;
            const sizeMultiplier = 1.0 + layer * 0.2;
            for(let i = 0; i < bulletsPerLayer; i++){
                const angle = Phaser.Math.DegToRad(params.angle + (360 / bulletsPerLayer) * i);
                const x = this.x + layerRadius * Math.cos(angle);
                const y = this.y + layerRadius * Math.sin(angle);
                this.attack({
                    x: x,
                    y: y,
                    speed: params.speed + Phaser.Math.Between(-150, 150),
                    angle: Phaser.Math.RadToDeg(angle),
                    texture: "orb-red",
                    size: sizeMultiplier
                });
            };
        };
        params.angle += params.rotationSpeed;
        params.radius -= params.spiralSpeed / 300;
        params.burstDelay++;
        params.speed = Math.min(params.speed + 2, maxSpeed);
        params.rotationSpeed += 0.1;
    };
    spiralRadiantBloomSymphony(){
        if(!this.paramsSpiralRBS){
            this.paramsSpiralRBS = {
                layerCount: 5,
                bulletsPerLayer: 18,
                layerSpacing: 50,
                baseSpeed: 100,
                rotationSpeed: 2,
                layerColors: ["orb-red", "orb-orange", "orb-yellow", "orb-green", "orb-blue"],
                petalCount: 12,
                petalSpeed: 200,
                petalRotationSpeed: 1,
                petalTexture: "orb-pink",
            };
            this.paramsSpiralRBS.rotationAngle = 0;
            this.paramsSpiralRBS.petalAngle = 0;
        };
        const { 
            layerCount, 
            bulletsPerLayer, 
            layerSpacing, 
            baseSpeed, 
            rotationSpeed, 
            layerColors, 
            petalCount, 
            petalSpeed, 
            petalRotationSpeed, 
            petalTexture 
        } = this.paramsSpiralRBS;    
        for(let layer = 0; layer < layerCount; layer++){
            const radius = layer * layerSpacing;
            const speed = baseSpeed + layer * 20;
            const texture = layerColors[layer % layerColors.length];
            for(let i = 0; i < bulletsPerLayer; i++){
                const angle = Phaser.Math.DegToRad(
                    this.paramsSpiralRBS.rotationAngle + (360 / bulletsPerLayer) * i
                );
                this.attack({
                    x: this.x + Math.cos(angle) * radius,
                    y: this.y + Math.sin(angle) * radius,
                    speed: speed,
                    angle: Phaser.Math.RadToDeg(angle),
                    texture: texture,
                    size: 1
                });
            };
        };
        this.paramsSpiralRBS.rotationAngle += rotationSpeed;
        for(let i = 0; i < petalCount; i++){
            const angle = Phaser.Math.DegToRad(
                this.paramsSpiralRBS.petalAngle + (360 / petalCount) * i
            );
            this.attack({
                x: this.x, y: this.y,
                speed: petalSpeed,
                angle: Phaser.Math.RadToDeg(angle),
                texture: petalTexture,
                size: 1.5
            });
        };
        this.paramsSpiralRBS.petalAngle += petalRotationSpeed;
    };
    spiralCosmicDance(){
        if(!this.paramsSpiralCD){
            this.paramsSpiralCD = {
                bulletSpeed: 160,
                bulletCount: 30,
                spiralRotationSpeed: 2,
                spreadAngle: 180,
                waveCount: 5,
                timer: 0,
                phaseDuration: 80,
                bulletTexture: "star-blue",
                maxDistance: 250,
                angleOffset: 0,
                spiralGrowth: 10,
                oscillationSpeed: 0.2
            };
        };
        const {
            bulletSpeed,
            bulletCount,
            spiralRotationSpeed,
            spreadAngle,
            waveCount,
            phaseDuration,
            bulletTexture,
            maxDistance,
            angleOffset,
            spiralGrowth,
            oscillationSpeed
        } = this.paramsSpiralCD;
        if(this.paramsSpiralCD.timer <= 0){
            for(let wave = 0; wave < waveCount; wave++){
                const baseAngle = (360 / waveCount) * wave + angleOffset;
                for(let i = 0; i < bulletCount; i++){
                    const angle = baseAngle - (spreadAngle / 2) + (i * (spreadAngle / bulletCount));
                    const angleRad = Phaser.Math.DegToRad(angle);
                    const distance = Phaser.Math.FloatBetween(100, maxDistance);
                    this.attack({
                        x: this.x + Math.cos(angleRad) * distance,
                        y: this.y + Math.sin(angleRad) * distance,
                        speed: bulletSpeed,
                        angle: angle,
                        texture: bulletTexture,
                        size: 1
                    });
                };
            };
            this.paramsSpiralCD.timer = phaseDuration;
            this.paramsSpiralCD.angleOffset += spiralRotationSpeed;
            if(this.paramsSpiralCD.angleOffset > 360){
                this.paramsSpiralCD.angleOffset = 0;
            };
        }else{
            this.paramsSpiralCD.timer -= 16;
        };
        for(let i = 0; i < 20; i++){
            const angle = (i * 18) + this.paramsSpiralCD.angleOffset;
            const angleRad = Phaser.Math.DegToRad(angle);
            const distance = 50 + (Math.sin(i / 10) * spiralGrowth);
            const oscillation = Math.sin(i * oscillationSpeed);
            this.attack({
                x: this.x + Math.cos(angleRad) * distance + oscillation * 20,
                y: this.y + Math.sin(angleRad) * distance + oscillation * 20,
                speed: bulletSpeed,
                angle: angle,
                texture: "icicle-2-blue",
                size: 1.5
            });
        };
        for(let i = 0; i < 12; i++){
            const angle = (i * 30) + this.paramsSpiralCD.angleOffset;
            const angleRad = Phaser.Math.DegToRad(angle);
            this.attack({
                x: this.x + Math.cos(angleRad) * 100,
                y: this.y + Math.sin(angleRad) * 100,
                speed: bulletSpeed,
                angle: angle,
                texture: "orb-small-pink",
                size: 1.2
            });
        };
    };
    spiralEtherealHarmony(){
        if(!this.paramsSpiralEH){
            this.paramsSpiralEH = {
                spiralCount: 4,
                spiralBullets: 50,
                spiralSpeed: 100,
                spiralRotation: 8,
                waveCount: 3,
                waveBullets: 40,
                waveAmplitude: 100,
                waveSpeed: 90,
                textures: ["star-blue", "circle-red", "orb-small-white", "heart-red", "music-purple"],
                timer: 0
            };
        };
        const { spiralCount, spiralBullets, spiralSpeed, spiralRotation, waveCount, waveBullets, waveAmplitude, waveSpeed, textures, timer } = this.paramsSpiralEH;
        for(let s = 0; s < spiralCount; s++){
            const spiralBaseAngle = timer * spiralRotation + (360 / spiralCount) * s;
            for(let i = 0; i < spiralBullets; i++){
                const angle = spiralBaseAngle + (360 / spiralBullets) * i;
                this.attack({
                    x: this.x,
                    y: this.y,
                    speed: spiralSpeed,
                    angle: angle,
                    texture: textures[s % textures.length],
                    size: 1
                });
            };
        };
        for(let w = 0; w < waveCount; w++){
            const waveBaseAngle = (timer * 5 + w * (360 / waveCount)) % 360;
            for(let i = 0; i < waveBullets; i++){
                const angle = waveBaseAngle + (360 / waveBullets) * i;
                const offsetX = Math.sin((angle + timer) * Math.PI / 180) * waveAmplitude;
                const offsetY = Math.cos((angle + timer) * Math.PI / 180) * waveAmplitude;
                this.attack({
                    x: this.x + offsetX,
                    y: this.y + offsetY,
                    speed: waveSpeed,
                    angle: angle,
                    texture: textures[(i + w) % textures.length],
                    size: 0.8
                });
            };
        };
        this.paramsSpiralEH.timer += 1;
    };
    /// Inspired by https://www.bulletforge.org/u/ajs/p/recollection-of-scripters-past
    touhouFangameRecollectionOfScriptersPast(){
        if(this.phaseTimer === 0){
            this.createEllipse([
                { centerX: 300, centerY: 200, xRadius: 100, yRadius: 100, bulletCount: 25,  texture: "orb-pink", lifetime: 5000, size: 2 },
                { centerX: 300, centerY: 200, xRadius: 220, yRadius: 100, bulletCount: 50, texture: "orb-pink", lifetime: 5000, size: 2 }
            ]);
            this.bulletPattern = [
                {
                    atkRate: 50,
                    atkDuration: 3,
                    delay: 200,
                    attackTimer: 0,
                    attackDurationTimer: 0,
                    delayTimer: 0,
                    attack: "touhouFangameRecollectionOfScriptersPastEyeShotgun"
                },
                {
                    atkRate: 10,
                    attackTimer: 0,
                    attack: "touhouFangameRecollectionOfScriptersPastEyeRotate"
                },
                {
                    atkRate: 50,
                    atkDuration: 3,
                    delay: 500,
                    attackTimer: 0,
                    attackDurationTimer: 0,
                    delayTimer: 0,
                    attack: "touhouFangameRecollectionOfScriptersPastEyeBurst"
                }
            ];
        };
        /// North
        if(this.phaseTimer === 5000){
            this.bulletPattern = [{
                atkRate: 10,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastNorth"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.north);
        };
        /// East
        if(this.phaseTimer === 6000){
            this.bulletPattern = [{
                atkRate: 40,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastEast"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.east);
        };
        /// South
        if(this.phaseTimer === 7000){
            this.bulletPattern = [{
                atkRate: 10,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastSouth"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.south);
        };
        /// West
        if(this.phaseTimer === 8000){
            this.bulletPattern = [{
                atkRate: 4,
                attackTimer: 0,
                attack: "touhouFangameRecollectionOfScriptersPastWest"
            }];
            this.touhouFangameRecollectionOfScriptersPastCombine(this.paramsTouhouFangameRecollectionOfScriptersPast.combine.west);
        };
        /// Random direction
        if(this.phaseTimer === 9000){
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
                    this.phaseTimerOffset = 5000;
                    break;
                case 2:
                    this.paramsTouhouFangameRecollectionOfScriptersPast.combine.east = optionsEast[Math.floor(Math.random() * optionsEast.length)];
                    this.phaseTimerOffset = 6000;
                    break;
                case 3:
                    this.paramsTouhouFangameRecollectionOfScriptersPast.combine.south = optionsSouth[Math.floor(Math.random() * optionsSouth.length)];
                    this.phaseTimerOffset = 7000;
                    break;
                case 4:
                    this.paramsTouhouFangameRecollectionOfScriptersPast.combine.west = optionsWest[Math.floor(Math.random() * optionsWest.length)];
                    this.phaseTimerOffset = 8000;
                    break;
                default: break;
            };
        };
    };
    touhouFangameRecollectionOfScriptersPastEyeShotgun(){
        let calculateAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.scene.player.x, this.scene.player.y, this.x, this.y)) - 180;
        this.attack({
            amount: 3,
            angleChange: 10,
            x: this.x, y: this.y,
            speed: 400,
            angle: calculateAngle,
            texture: "orb-red"
        });
        this.attack({
            delay: 600,
            amount: 4,
            angleChange: 6.5,
            x: this.x, y: this.y,
            speed: 500,
            angle: calculateAngle,
            texture: "orb-blue"
        });
    };
    touhouFangameRecollectionOfScriptersPastEyeRotate(){
        this.attack({
            x: this.x, y: this.y,
            speed: 400,
            angle: 90 + (Math.floor(this.paramsTouhouFangameRecollectionOfScriptersPast.tempTimer / 6) * 15),
            texture: "orb-pink",
            gx: 150
        });
        this.paramsTouhouFangameRecollectionOfScriptersPast.tempTimer += 1;
        if(this.paramsTouhouFangameRecollectionOfScriptersPast.tempTimer === 144){
            this.paramsTouhouFangameRecollectionOfScriptersPast.tempTimer = 0;
        };
    };
    touhouFangameRecollectionOfScriptersPastEyeBurst(){
        this.createEllipse([
            { centerX: 300, centerY: 200, xRadius: 220, yRadius: 100, bulletCount: 100, texture: "arrow-pink", lifetime: 100000, speed: 200 }
        ]);
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
        if(this.randomY === -1){
            this.randomY = Math.random() * 420;
        };
        for(let i = 0; i < 8; i++){
            this.attack({
                x: 610, y: this.randomY + (60 * i),
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
    fire({ x, y, angle = 0, damage = 1, speed, gx = 0, gy = 0, tracking = false, texture = 'circle-black', scaleSpeed = 0, target = null, maxLife = 4500, size = 1 }){
        this.enableBody(true, x, y, true, true);   
        this.setFrame(texture);
        this.setScale(size);
        this.setSize(this.width / 1.6, this.height / 1.6);
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
        this.born += 1;
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