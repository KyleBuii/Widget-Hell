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
        this.buttonContainer = this.add.image(95, 50, "box")
            .setDepth(2)
            .setDisplaySize(165, 65)
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
    };
    toggleMenu(isHide){
        if(isHide){
            this.buttonContainer.setVisible(false);
            this.buttonPlay.setVisible(false);
            this.textPlay.setVisible(false);
            this.textPlay.setText("Return");
            this.enemies.children.entries.forEach((enemy) => {
                enemy.kill(); 
            });
        }else{
            this.buttonContainer.setVisible(true);
            this.buttonPlay.setVisible(true);
            this.textPlay.setVisible(true);
            this.textPlay.setText("Play");
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
        this.physics.add.collider(this.boss, this.playerBullets, (boss, bullet) => {
            this.enemyHitCallback(bullet, boss);
        });
        this.physics.add.collider(this.boss, this.anchorBoss, (boss, anchor) => {
            this.boss.body.setVelocityY(0);
            this.boss.ready = true;
        });
    };
    setData(data){
        this.player.hp = new HealthBar(this, 5000, 10, 11);
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
                enemy.kill();
                this.spawnEnemy();
            };
        };
    };
    changeScene(){
        this.scene.start('GameOver');
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
        if(this.keyW?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityY(-100);
            }else{
                this.setVelocityY(-250);
            };
        };
        if(this.keyA?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityX(-100);
            }else{
                this.setVelocityX(-250);
            };
        };
        if(this.keyS?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityY(100);
            }else{
                this.setVelocityY(250);
            };
        };
        if(this.keyD?.isDown){
            if(this.keyShift?.isDown){
                this.setVelocityX(100);
            }else{
                this.setVelocityX(250);
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
        this.displayWidth = 96;
        this.displayHeight = 96;
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
            this.x = Math.random() * 500 + 100;
            this.y = 0;
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
        this.displayWidth = 256;
        this.displayHeight = 256;
        this.phaseTimer = 0;
        this.hp = new HealthBar(this.scene, this.health, 6, 80);
        this.atk = atk;
        this.atkSpd = atkSpd;
        this.atkRate = atkRate;
        this.attackTimer = 0;
        this.ready = false;
        /// Variables for bullet patterns
        this.randomY = -1;
        this.decideRotation = -1;
        this.combineNorth = -1;
        this.combineEast = -1;
        this.combineSouth = -1;
        this.combineWest = -1;
        this.phaseTimerOffset = -1;
    };
    preUpdate(){
        this.hp.move(this.x, this.y);
        this.body.setVelocityY(150);
        if(this.alive && this.ready){
            this.phaseTimer += 1;
            if(this.phaseTimerOffset !== -1){
                this.phaseTimer = this.phaseTimerOffset;
                this.phaseTimerOffset = -1;
            };
            this.attackTimer += 1;
            if(this.attackTimer > this.atkRate){
                this.attackTimer = 0;
                this.touhouFangameRecollectionOfScriptersPast();
            };
        };
    };
    /// Inspired by https://www.bulletforge.org/u/ajs/p/recollection-of-scripters-past
    touhouFangameRecollectionOfScriptersPast(){
        /// North
        if(this.phaseTimer >= 0 && this.phaseTimer < 1000){
            this.touhouFangameRecollectionOfScriptersPastNorth();
            this.touhouFangameRecollectionOfScriptersPastCombine(this.combineNorth);
        };
        /// East
        if(this.phaseTimer > 1000 && this.phaseTimer < 2000){
            this.touhouFangameRecollectionOfScriptersPastEast();
            this.touhouFangameRecollectionOfScriptersPastCombine(this.combineEast);
        };
        /// South
        if(this.phaseTimer > 2000 && this.phaseTimer < 3000){
            this.touhouFangameRecollectionOfScriptersPastSouth();
            this.touhouFangameRecollectionOfScriptersPastCombine(this.combineSouth);
        };
        /// West
        if(this.phaseTimer > 3000 && this.phaseTimer < 4000){
            this.touhouFangameRecollectionOfScriptersPastWest();
            this.touhouFangameRecollectionOfScriptersPastCombine(this.combineWest);
        };
        /// Random direction
        if(this.phaseTimer > 4000 && this.phaseTimer < 5000){
            this.healthCheck();
            this.randomY = -1;
            this.decideRotation = -1;
            let decideSide = Math.floor(Math.random() * 4 + 1);
            let optionsNorth = [3, 4];
            let optionsEast = [1, 3, 4];
            let optionsSouth = [1, 4];
            let optionsWest = [1, 3];
            switch(decideSide){
                case 1:
                    this.combineNorth = optionsNorth[Math.floor(Math.random() * optionsNorth.length)];
                    this.phaseTimerOffset = 0;
                    break;
                case 2:
                    this.combineEast = optionsEast[Math.floor(Math.random() * optionsEast.length)];
                    this.phaseTimerOffset = 1000;
                    break;
                case 3:
                    this.combineSouth = optionsSouth[Math.floor(Math.random() * optionsSouth.length)];
                    this.phaseTimerOffset = 2000;
                    break;
                case 4:
                    this.combineWest = optionsWest[Math.floor(Math.random() * optionsWest.length)];
                    this.phaseTimerOffset = 3000;
                    break;
                default: break;
            };
        };
    };
    touhouFangameRecollectionOfScriptersPastNorth(){
        this.atkRate = 10;
        let randomX = Math.random() * 590 + 10;
        let calculateAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.scene.player.x, this.scene.player.y, randomX, 0)) - 180;
        this.attack({
            x: randomX, y: 0,
            speed: 300,
            texture: "bullet-arrow-pink",
            angle: calculateAngle,
            target: this.scene.player
        });
    };
    touhouFangameRecollectionOfScriptersPastEast(){
        this.atkRate = 40;
        if(this.randomY === -1){
            this.randomY = Math.random() * 420;
        };
        for(let i = 0; i < 8; i++){
            this.attack({
                x: 610, y: this.randomY + (60 * i),
                speed: 200,
                texture: "bullet-butterfly-green",
                angle: 180,
            });
        };
    };
    touhouFangameRecollectionOfScriptersPastSouth(){
        this.atkRate = 10;
        if(this.decideRotation === -1){
            this.decideRotation = (Math.random() < 0.5)
                ? 20
                : -20;
        };
        let randomX = Math.random() * 590 + 10;
        this.attack({
            x: randomX, y: 860,
            speed: Math.random() * 200 + 150,
            texture: "bullet-card-blue",
            angle: -90 - this.decideRotation
        });
    };
    touhouFangameRecollectionOfScriptersPastWest(){
        this.atkRate = 4;
        let randomY = Math.random() * 840 + 10;
        this.attack({
            x: -10, y: randomY,
            speed: 200,
            texture: "bullet-sword-yellow"
        });
    };
    touhouFangameRecollectionOfScriptersPastCombine(side){
        switch(side){
            case 1:
                this.touhouFangameRecollectionOfScriptersPastNorth();
                break;
            case 2:
                this.touhouFangameRecollectionOfScriptersPastEast();
                break;
            case 3:
                this.touhouFangameRecollectionOfScriptersPastSouth();
                break;
            case 4:
                this.touhouFangameRecollectionOfScriptersPastWest();
                break;
            default: break;
        };
    };
    attack({ amount = 1, x = this.x, y = this.y, angle = 0, damage = this.atk, speed = this.atkSpd, gx = 0, gy = 0, tracking = false, texture = 'bullet5', scaleSpeed = 0, target = null, maxLife = 4500 }){
        let bullet = this.scene.bossBullets.getFirstDead(false);
        if(this.alive && bullet){
            for(let i = 0; i < amount; i++){
                bullet = this.scene.bossBullets.getFirstDead(false);
                if(bullet){
                    bullet.fire({
                        x: x, y: y,
                        angle: angle,
                        damage: damage,
                        speed: speed,
                        gx: gx, gy: gy,
                        tracking: tracking,
                        texture: texture,
                        scaleSpeed: scaleSpeed,
                        target: target,
                        maxLife: maxLife
                    });
                };
            };
        };
    };
    rage(){

    };
    lastStand(){

    };
    healthCheck(){
        if(this.hp.value < this.health / 4){
            lastStand();
        }else if(this.hp.value < this.health / 2){
            rage();
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
        this.maxLife = 4500;
    };
    fire({ x, y, angle = 0, damage = 1, speed, gx = 0, gy = 0, tracking = false, texture = 'bullet5', scaleSpeed = 0, target = null, maxLife = 4500 }){
        this.enableBody(true, x, y, true, true);   
        this.setTexture(texture);
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
        this.fireRate = 700;
        this.bulletSpeed = 200;
        this.bulletTexture = 'bullet5'
    };
    fireLaser({ texture, player, ammo, angle, target, damage, speed }){  
        if(this.scene.time.now < this.nextFire) { return; };
        ammo.getFirstDead(false)?.fire({
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