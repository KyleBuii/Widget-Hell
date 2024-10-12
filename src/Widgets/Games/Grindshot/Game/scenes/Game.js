import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


/// Variables
const enemies = {
    birb: {
        name: 'Birb',
        stats: {
            health: 10,
            radius: {
                close: 100,
                far: 150
            },
            attack: {
                damage: 1,
                speed: 100,
                rate: 1000
            },
            defense: 1,
            speed: 0,
            dash: {
                speed: 0,
                duration: 0,
                delay: 0
            }
        },
        attacks: {
            close: {
                flutter: {
                    texture: 'bullet4',
                    color: '',
                    width: 0,
                    height: 0
                }
            },
            far: {
                caw: {
                    texture: 'bullet9',
                    color: '',
                    width: 0,
                    height: 0
                }
            },
        },
    }
};


export class Game extends Scene{
    constructor(){
        super('Game');
        this.player = null;
        this.weaponIndex = 0;
        this.weapons = [];
        this.weaponName = null;
        this.enemiesKilled = 0;
        this.difficulty = 0;
    };
    create(){
        this.createAnimations();
        this.createMap();
        this.createPlayer();
        this.createEnemy();
        this.createCamera();
        this.createStructure();
        this.createColliders();
        EventBus.once('data', (data) => {
            this.setData(data);
        });
        EventBus.emit('current-scene-ready', this);
    };
    createAnimations(){
        //#region Player
        this.anims.create({
            key: 'player-run-up',
            frames: this.anims.generateFrameNames('player-atlas', {
                prefix: 'run-up-',
                end: 3
            }),
            frameRate: 8
        });
        this.anims.create({
            key: 'player-run-right',
            frames: this.anims.generateFrameNames('player-atlas', {
                prefix: 'run-right-',
                end: 3
            }),
            frameRate: 8
        });
        this.anims.create({
            key: 'player-run-down',
            frames: this.anims.generateFrameNames('player-atlas', {
                prefix: 'run-down-',
                end: 3
            }),
            frameRate: 8
        });
        //#endregion
        //#region Map
        this.anims.create({
            key: 'chest-open',
            frames: this.anims.generateFrameNames('chest-atlas', {
                prefix: 'open-',
                end: 2
            }),
            frameRate: 3
        });
        //#endregion
    };
    createMap(){
        this.map = this.make.tilemap({ key: 'grind' });
        this.tileset = this.map.addTilesetImage('tiles', 'tiles', 16, 16);
        this.grass = this.map.createLayer('Tiles', this.tileset, 0, 0);
        this.obstacles = this.map.createLayer('Obstacles', this.tileset, 0, 0);
        this.obstacles.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    };
    createPlayer(){
        this.playerBullets = new Bullets(this, 100);
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
        this.player = new Player(this, 'player', this.map.widthInPixels / 2, this.map.heightInPixels - 200)
            .setOrigin(0.5, 0.5)
            .setSize(3, 3)
            .setOffset(6, 10);
    };
    createEnemy(){
        this.enemyBullets = new Bullets(this, 100);
        this.enemies = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
        this.enemiesPoints = this.map.filterObjects('Enemies', (obj) => obj.name === 'Enemy');
        this.enemiesPoints.map((enemyPoint) => {
            this.spawnEnemy(enemyPoint);
        });
    };
    createCamera(){
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(2.5);      
    };
    createStructure(){
        const structurePoints = this.map.filterObjects('Structures', obj => obj.name === 'Structure');
        this.structures = structurePoints.map((structurePoint) =>
            this.physics.add.sprite(structurePoint.x, structurePoint.y, 'tiles-spritesheet', 72)
        );
        this.structures.forEach((structure) => {
            this.physics.add.overlap(this.player, structure, (obj1, obj2) => {
                obj2.anims.play('chest-open', true);
                obj2.on('animationcomplete', (animation, frame, chest) => {
                    chest.destroy();
                }, this);
                this.weaponIndex = Math.floor(Math.random() * 12);
            });
        });
    };
    createColliders(){
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.enemies, this.obstacles);
        this.physics.add.collider(this.player, this.enemyBullets, (player, bullet) => {
            this.playerHitCallback(bullet, player);
        });
        this.physics.add.collider(this.enemies, this.playerBullets, (enemy, bullet) => {
            this.enemyHitCallback(bullet, enemy);
        });
        this.physics.add.collider(this.enemyBullets, this.obstacles, (bullet, obstacle) => {
            this.obstacleHitCallback(bullet, obstacle);   
        });
        this.physics.add.collider(this.playerBullets, this.obstacles, (bullet, obstacle) => {
            this.obstacleHitCallback(bullet, obstacle);
        });
    };
    spawnEnemy(point){
        let enemiesKeys = Object.keys(enemies);
        let randomEnemy = enemiesKeys[Math.floor(Math.random() * enemiesKeys.length)];
        let randomX = Math.random() * 100;
        let randomY = Math.random() * 100;
        this.enemies.add(
            new Enemy(
                this,
                randomEnemy,
                point.x + randomX, point.y + randomY,
                enemies[randomEnemy].stats.health,
                enemies[randomEnemy].stats.radius.close,
                enemies[randomEnemy].stats.radius.far,
                enemies[randomEnemy].stats.attack.damage,
                enemies[randomEnemy].stats.attack.speed,
                enemies[randomEnemy].stats.attack.rate,
                enemies[randomEnemy].stats.defense,
                enemies[randomEnemy].stats.speed,
                this.player,
                'normal')
            .setName(point.id.toString())
            .setDisplaySize(32, 32)
        );
    };
    setData(data){
        this.player.hp = new HealthBar(this, this.player.x, this.player.y, data.health);
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
        if(bullet.active === true && player.active === true){
            bullet.disableBody(true, true);
            if(player.hp.decrease(bullet.damage)){
                this.changeScene();
            };
        };
    };
    enemyHitCallback(bullet, enemy){
        if(bullet.active === true && enemy.active === true){
            bullet.disableBody(true, true);
            if(enemy.hp.decrease(1)){
                enemy.hp.bar.destroy();
                enemy.alive = false;
                enemy.destroy();
                let randomPoint = Math.floor(Math.random() * this.enemiesPoints.length);
                this.spawnEnemy(this.enemiesPoints[randomPoint]);
                this.enemiesKilled++;
                this.difficulty++;
            };    
        };
    };
    obstacleHitCallback(bullet, obstacle){
        bullet.disableBody(true, true);
    };
    changeScene(){
        this.scene.start('GameOver');
    };
};

class HealthBar{
    constructor(scene, x, y, health){
        this.bar = new Phaser.GameObjects.Graphics(scene);
        scene.add.existing(this.bar);
        this.x = x - 50;
        this.y = y + 50;
        this.value = health;
        this.maxValue = health;
        this.p = 19 / health;
        this.draw();
    };
    move(x, y){
        this.x = x - 11.5;
        this.y = y + 11.5;
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
        /// BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 23, 7);
        /// HEALTH
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 19, 3);
        if(this.value < (this.maxValue / 2)){
            this.bar.fillStyle(0xff0000);
        }else{
            this.bar.fillStyle(0x00ff00);
        };
        var d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 3);
    };
};

class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, texture, x, y){
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDrag(500, 500);
        this.setTexture(texture);
        this.reticle = scene.physics.add.sprite(0, 0, 'target');
        this.reticle.setOrigin(0.5, 0.5).setDisplaySize(8, 8).setCollideWorldBounds(true);
        this.scene.input.on('pointermove', (pointer) => {
            this.reticle.x = pointer.worldX;
            this.reticle.y = pointer.worldY;
        });
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.hp.move(this.x, this.y);
        this.setVelocity(0);
        if(this.keyW?.isDown){
            this.setVelocityY(-110);
            this.anims.play('player-run-up', true);
        };
        if(this.keyA?.isDown){
            this.setVelocityX(-110);
            this.setFlipX(true);
            this.anims.play('player-run-right', true);
        };
        if(this.keyS?.isDown){
            this.setVelocityY(110);
            this.anims.play('player-run-down', true);
        };
        if(this.keyD?.isDown){
            this.setVelocityX(110);
            this.setFlipX(false);
            this.anims.play('player-run-right', true);
        };
        /// Move reticle with player
        this.reticle.body.velocity.x = this.body.velocity.x;
        this.reticle.body.velocity.y = this.body.velocity.y;
        if(this.scene.game.input.activePointer.isDown){
            if(this.active === false){ return; };
            const angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, this.reticle.x, this.reticle.y));
            this.scene.weapons[this.scene.weaponIndex].fireLaser(this, this.scene.playerBullets, angle, this.reticle);
        };
    };
};

class Enemy extends Phaser.GameObjects.Sprite{
    constructor(scene, texture, x, y, health, radiusClose, radiusFar = 0, attack, attackSpeed, attackRate, defense, speed, target, difficulty){
        super(scene, x, y);
        scene.add.existing(this);
        // this.play(this.color + 'Idle');
        this.on('animationcomplete', this.animComplete, this);
        this.setTexture(texture);
        this.setPosition(x, y);
        this.hp = new HealthBar(scene, x, y, health);
        this.radiusClose = radiusClose;
        this.radiusFar = radiusFar;
        this.atk = attack;
        this.atkSpd = attackSpeed;
        this.atkRate = attackRate;
        this.def = defense;
        this.spd = speed;
        this.target = target;
        this.difficulty = difficulty;
        this.alive = true;
        this.attackTimerClose = 0;
        this.attackTimerFar = 0;
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.hp.move(this.x, this.y);
        let distanceFromTarget = (Phaser.Math.Distance.BetweenPoints(
            { x: this.x, y: this.y },
            { x: this.target.x, y: this.target.y },
        ));
        if(this.alive && (distanceFromTarget < this.radiusClose)){
            this.body.setVelocityX(this.target.x - this.x);
            this.body.setVelocityY(this.target.y - this.y);
            this.attackTimerClose += delta;
            if(this.attackTimerClose > this.atkRate){
                this.attackTimerClose = 0;
                this.attackClose();
            };
            if(this.target.x > this.x){
                this.setFlipX(false);
            }else{
                this.setFlipX(true);
            };
        }else if(distanceFromTarget < this.radiusFar){
            this.body.setVelocity(0);
            this.attackTimerFar += delta;
            if(this.attackTimerFar > this.atkRate){
                this.attackTimerFar = 0;
                this.attackFar();
            };
            if(this.target.x > this.x){
                this.setFlipX(false);
            }else{
                this.setFlipX(true);
            };
        }else{
            this.body.setVelocity(0);
        };
    };
    animComplete(animation){
        // if(animation.key === this.color + 'Attack'){
        //     this.play(this.color + 'Idle');
        // };
    };
    attackClose(){
        const bullet = this.scene.enemyBullets.getFirstDead(false);
        const angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.target.x, this.target.y, this.x, this.y)) - 180;
        if(this.alive && bullet){
            // this.play(this.color + 'Attack');
            bullet.fire({x: this.x, y: this.y, angle: angle, damage: this.atk, speed: this.atkSpd, target: this.target});
        };   
    };
    attackFar(){
        const bullet = this.scene.enemyBullets.getFirstDead(false);
        const angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.target.x, this.target.y, this.x, this.y)) - 180;
        if(this.alive && bullet){
            // this.play(this.color + 'Attack');
            bullet.fire({x: this.x, y: this.y, angle: angle, damage: this.atk, speed: this.atkSpd, target: this.target});
        };   
    };
};

class Bullets extends Phaser.Physics.Arcade.Group{
    constructor(scene, maxBullets){
        super(scene.physics.world, scene, { enable: false });
        this.createMultiple({
            classType: Bullet,
            key: ('bullet'),
            frameQuantity: maxBullets,
            active: false,
            visible: false
        });
    };
};

class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene){
        super(scene);
        this.scene = scene;
        this.tracking; 
        this.scaleSpeed;
        this.born = 0;
        this.maxLife = 1000;
    };
    fire({x, y, angle = 0, damage = 1, speed, gx = 0, gy = 0, tracking = false, texture = 'bullet5', scaleSpeed = 0, target = null, maxLife = 1000}){
        // this.scene.shootSFX.play();
        this.enableBody(true, x, y, true, true);   
        this.setTexture(texture);
        /// If the texture is not even
        if(this.width !== this.height){
            /// Gravity and Tracking
            if((gx !== 0) || (gy !== 0) || tracking){
                this.setSize(Math.min(this.width, this.height));
            /// Top and Bottom
            }else if((angle > -100 && angle < -75) || (angle > 75 && angle < 100)){
                this.setSize(this.height, this.width);
            /// Right and Left
            }else if((angle > -15 && angle < 15) || (angle > 165 && angle < 180) || (angle > -180 && angle < -170)){
                this.setSize(this.width, this.height);
            /// Diagonal
            }else{
                this.setSize(Math.min(this.width, this.height));
            };
        }else{
            this.setSize(this.width, this.height);
        };
        this.angle = angle;
        this.damage = damage;
        this.maxLife = maxLife;
        this.tracking = tracking;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleSpeed = scaleSpeed;
        if(target){
            this.scene.physics.moveToObject(this, target, speed);
        }else{
            this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);    
        };
        /// Apply gravity to the physics body
        this.body.gravity.set(gx, gy);
        this.born = 0;
    };
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.born += delta;
        if(this.born > this.maxLife){
            this.remove();
        };
        if(this.tracking){
            this.rotation = this.body.velocity.angle();
        };   
        if(this.scaleSpeed > 0){
            this.scaleX += this.scaleSpeed;
            this.scaleY += this.scaleSpeed;
        };
    };
    remove(){
        this.disableBody(true, true);
    };
};

class SingleBullet{
    constructor(scene){
        this.scene = scene;
        this.name = 'Single';
        this.nextFire = 0;   
        this.fireRate = 600;
        this.bulletSpeed = 100;
        this.bulletTexture = 'bullet5'
    };
    fireLaser(player, ammo, angle, target){  
        if(this.scene.time.now < this.nextFire) { return; };
        ammo.getFirstDead(false)?.fire({x: player.x, y: player.y, angle: angle, speed: this.bulletSpeed, target: target, texture: this.bulletTexture});
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