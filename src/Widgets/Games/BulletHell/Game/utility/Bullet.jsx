import Phaser from 'phaser';
import { danmakuSpokes, drawCannons, readAngle, readParam } from './utility';

const WIDTH = 600;
const HEIGHT = 850;

export class Bullet extends Phaser.Physics.Arcade.Sprite {
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
        }) {
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
        if (bulletTransform.bearingLock) {
            this.newBulletBearing = this.cannonAngle;
        } else {
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
        if (this.bulletTransformClass === "DELAY") {
            this.newBulletSpeed = this.bulletSpeed;
            this.bulletSpeed = 0;
            this.bulletTransformClass = "CHANGE";
        };
        this.bulletSatellite = bulletSatellite;        
        this.setBulletConfig();
        this.setMotion();
        if (this.bulletSatellite !== undefined) this.createSatellites(this);
    };

    preUpdate(time, delta) {
        if ((this.bulletClass === "ORBIT") && !this.parent.body.enable) this.remove();
        this.bulletTimer += delta;
        this.lifeTimer += delta;
        switch (this.bulletLife) {
            case -1: break;
            default:
                if (this.bulletLifeAlpha) {
                    const alphaValue = (this.bulletLife - this.lifeTimer) / this.bulletLife;
                    this.setAlpha((alphaValue >=0) ? alphaValue : 0);
                };
                if (this.lifeTimer > this.bulletLife) {
                    this.remove();
                };
                break;
        };
        /// "BOUNCE!": reverse direction if hit left or right of screen
        if ((this.bulletBounceX > 0) && this.hitEdgeX(this)) {
            if (this.x <= (this.displayWidth / 2)) {
                this.setX(this.displayWidth / 2 + 1);
            } else if (this.x >= WIDTH - this.displayWidth / 2) {
                this.setX(WIDTH - this.displayWidth / 2 - 1);
            };
            this.setVelocityX(-this.body.velocity.x * this.bulletBounceX);
            this.bounceOffWall();
        };
        /// "BOUNCE!": reverse direction if hit bottom or top of screen
        if ((this.bulletBounceY > 0) && this.hitEdgeY(this)) {
            if (this.y <= (this.displayHeight / 2)) {
                this.setY(this.displayHeight / 2 + 1);
            } else if (this.y >= HEIGHT - this.displayHeight / 2) {
                this.setY(HEIGHT - this.displayHeight / 2 - 1);
            };
            this.setVelocityY(-this.body.velocity.y * this.bulletBounceY);
            this.bounceOffWall();
        };
        if ((!this.bulletOffScreen) && (this.outOfScreenX() || this.outOfScreenY())) {
            this.remove();
        };
        /// If there is bearing velocity set, then adjust the bearing angle of the velocity
        if (this.body.speed !==0 && this.bulletBearingVelocity !== 0) {
            this.bulletBearing = this.referenceBearing + this.bearingChange.getValue();
            /// If the bullet is not rotating type, set the angle of bullet image in line with the bullet bearing
            if (this.bulletAngularVelocity === 0) {
                this.setRotation(this.bulletBearing);
            };
            this.adjustVelocity(this.bulletBearing, this.body.speed, this.bulletAcceleration);
        };
        switch (this.bulletClass) {
            case "ORBIT": {
                this.setPosition(this.parent.x, this.parent.y);
                Phaser.Math.RotateAroundDistance(this, this.parent.x, this.parent.y, this.orbitAngle, this.orbitRadius);
                this.orbitAngle = Phaser.Math.Angle.Wrap(this.orbitAngle + this.orbitSpeed);
                break;
            };
            case "ZIGZAG": {
                if (this.bulletTimer > this.bulletCycleLength) {
                    this.bulletTimer = 0;
                    this.bulletToggle *= -1;
                    const newDirection = this.bulletBearing + this.bulletBearingDelta * this.bulletToggle;
                    this.setRotation(newDirection);
                    this.adjustVelocity(newDirection, this.bulletSpeed, this.bulletAcceleration);  
                };
                break;
            };
            case "HOMING": {
                this.seek();
                this.adjustVelocity(this.bulletBearing, this.bulletSpeed, this.bulletAcceleration);
                break;
            };
            case "SWING": {
                const targetAngle = this.bulletBearing + this.swing.getValue();
                this.setRotation(targetAngle);
                this.adjustVelocity(targetAngle, this.body.speed, this.bulletAcceleration);
                break;
            };
            default: { break; };
        };
        if ((this.bulletTransformClass !== "NORMAL") && (this.bulletTimer > this.readStage())) {
            this.stage1Count++;
            if (this.bulletClass === "ORBIT") {
                this.bulletBearing = Phaser.Math.Angle.Between(this.parent.x, this.parent.y,this.x,this.y);
            };
            switch (this.bulletTransformClass) {
                case "CHANGE":
                    this.oldToNew(); /// Copy the newbullet parameters to existing bullet config
                    this.setBulletConfig(); /// Activate the new properties
                    this.setMotion();
                    if (this.maturity()) {
                        this.spawnRepeatCount++;
                        if (this.spawnRepeatCount >= this.spawnRepeat) {
                            this.bulletTransformClass = "NORMAL";
                        } else {
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

    createSatellites(scene) {
        for (let i= 0; i < this.bulletSatellite.count; i++) {
            const angle = i * ((Math.PI * 2) / this.bulletSatellite.count);
            const orbit = new Phaser.Math.Vector2().setToPolar(angle, this.bulletSatellite.radius);
            const bullet = this.parent.munitions.getFirstDead(false);
            if (bullet) {
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

    handleMaturity() {
        /// At the end of executing one "cycle" of bulletTransform, take appropriate action
        if (this.maturity()) {
            switch (this.spawnRepeat) {
                case 0:
                    this.remove();
                    break;
                default:
                    this.spawnRepeatCount++;
                    if (this.spawnRepeatCount >= this.spawnRepeat) {
                        this.bulletTransformClass = "NORMAL";
                    } else {
                        this.bulletTimer = 0;
                        this.stage1Count = 0;                  
                    };
                    break;
            };
        };
    };

    maturity() {
        if (typeof(this.bulletStage1Time) === "number")
            return true;
        else if (this.stage1Count >= this.bulletStage1Time?.length)
            return true;
    };

    explode(scene) {
        this.fragmentAngles = [];
        this.fragmentSpeeds = [];
        this.fragmentPositions = [];
        this.bulletConfig.bulletTexture = this.spawnTexture;
        this.bulletConfig.bulletFrame = this.spawnFrame;
        if (this.bulletTransformType === undefined) this.bulletTransformType = "arc";
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
        for (let i = 0; i < this.fragmentAngles.length; i++) {
            const direction = this.fragmentAngles[i];
            const bullet = this.scene.bossBullets.getFirstDead(false);
            if (bullet) {
                this.bulletConfig.bulletBearing = direction;
                this.bulletConfig.bulletAngle = direction;
                this.bulletConfig.bulletSpeed = this.fragmentSpeeds[0][i];
                bullet.fire(scene, this.bulletConfig);
            };
        };
    };

    spawn(scene) {
        for (let angle = 0; angle <= Math.PI * 2 * (this.spawnCount - 1) / this.spawnCount; angle += Math.PI * 2 / this.spawnCount) {
            this.bulletConfig.bulletBearing = readAngle(this.bulletBearing+angle, this.spawnBearing);
            this.bulletConfig.bulletTexture = this.spawnTexture;
            this.bulletConfig.bulletFrame = this.spawnFrame;
            if (Array.isArray(this.spawnSpeed)) {
                for (let i = 0; i < this.spawnSpeed.length; i++) {
                    const bullet = this.scene.enemyBullets.getFirstDead(false);
                    if (bullet) {
                        this.bulletConfig.bulletSpeed = this.spawnSpeed[i];
                        bullet.fire(scene, this.bulletConfig);
                    };
                };
            } else {
                const bullet = this.scene.enemyBullets.getFirstDead(false);
                if (bullet) {
                    this.bulletConfig.bulletSpeed = this.spawnSpeed;
                    bullet.fire(scene, this.bulletConfig);
                };
            };
        };
    };

    oldToNew() {
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

    stopAndGo(scene) {
        const bullet = this.scene.enemyBullets.getFirstDead(false);
        if (bullet) {
            this.bulletConfig.bulletSpeed = 0;
            this.bulletConfig.bulletAcceleration = 0;
            this.bulletConfig.bulletTransform.class = "CHANGE";
            this.bulletConfig.bulletTransform.stage1Time = this.bulletStage2Time;
            bullet.fire(scene, this.bulletConfig);
        };
    };

    setBulletConfig() {
        this.setTexture(this.bulletTexture, this.bulletFrame);
        this.setAlpha(this.bulletAlpha || 1);
        this.setSize(this.height / 1.5, this.width / 1.5);
        this.body.speed = this.bulletSpeed; /// It's necessary to manually set speed of body otherwise sometimes pre-update sets the velocity to zero, before the bullet gets going
        this.body.setMaxSpeed(this.bulletMaxSpeed);
    };

    setMotion() {
        const bearing = this.bulletBearing + this.bulletBearingDelta * this.bulletToggle;
        const adjustedSpeed = this.bulletSpeed + this.randomSpeed(this.bulletVRandom);
        this.adjustVelocity(bearing, adjustedSpeed, this.bulletAcceleration);
        /// If bulletBearingVelocity is set, it means the bullet should fly along curve - so set up tween to adjust direction
        if (this.bulletBearingVelocity !== 0) {
            this.bearingChange = this.scene.tweens.addCounter({
                from: 0,
                to: Math.sign(this.bulletBearingVelocity) * 2 * Math.PI,
                duration: ((2 * Math.PI) / Math.abs(this.bulletBearingVelocity)) * 1000,
                repeat: -1
            });
        };
        /// If SWING type, then set up tween to adjust the bulletBearing
        if (this.bulletClass === "SWING") {
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

    adjustVelocity(targetAngle, speed, acceleration) {
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
        if (this.bulletAngularVelocity === 0) {
            this.setRotation(targetAngle);
        };
    };

    readStage() {
        if (typeof(this.bulletStage1Time) === "number")
            return this.bulletStage1Time;
        else if (Array.isArray(this.bulletStage1Time))
            return this.bulletStage1Time[this.stage1Count];
    };

    bounceOffWall() {
        this.setRotation(Phaser.Math.Angle.Wrap(this.body.velocity.angle()));
        this.referenceBearing = this.rotation;
        this.bulletBearing = this.rotation;
        if (this.swing) this.swing.restart();
        if (this.bearingChange) this.bearingChange.restart();
    };

    randomSpeed(randomness) {
        const randomFactor = Phaser.Math.Between(-randomness / 2, randomness / 2);
        return randomFactor;
    };

    setBaseConfig(current = false) {
        switch (current) {
            case false:
                return {
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
            default:
                return {
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
        };
    };

    delayedMove(scene) {
        const bullet = this.scene.enemyBullets.getFirstDead(false);
        if (bullet) {
            if (this.newBulletSeek) {
                /// This returns the angle between 2 points in radians
                this.bulletConfig.bulletBearing = Phaser.Math.Angle.Between(this.x, this.y, this.bulletTarget.x, this.bulletTarget.y);
                this.bulletConfig.bulletAngle = this.newBulletBearing;
            };
            bullet.fire(scene, this.bulletConfig);
        };
    };

    remove() {
        if (this.swing) this.swing.remove();
        if (this.bearingChange) this.bearingChange.remove();
        this.disableBody(true, true);
    };

    seek() {
        /// This returns the angle between 2 points in radians
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.bulletTarget.x, this.bulletTarget.y);
        let diff = Phaser.Math.Angle.Wrap(targetAngle - this.bulletBearing);
        /// To to targetAngle if less than degrees per turn
        if (Math.abs(diff) < this.perTurnConstraint) {
            this.bulletBearing = targetAngle;
        } else {
            let angle = this.bulletBearing;
            if (diff > 0)
                angle += this.perTurnConstraint;
            else
                angle -= this.perTurnConstraint;
            this.bulletBearing = angle;
        }; 
    };

    outOfScreenY() {
        return (
            this.y + (this.displayHeight / 2) <= 0 || this.y >= HEIGHT + (this.displayHeight / 2)
        );
    };

    outOfScreenX() {
        return (
            this.x + (this.displayWidth / 2) <= 0 || this.x >= WIDTH + (this.displayWidth / 2)
        );
    };

    hitEdgeY(bullet) {
        return (
            bullet.y <= (bullet.displayHeight / 2) || bullet.y >= HEIGHT - (bullet.displayHeight / 2)
        );
    };

    hitEdgeX(bullet) {
        return (
            bullet.x <= (bullet.displayWidth / 2) || bullet.x >= WIDTH - (bullet.displayWidth / 2)
        );
    };
};