import Phaser from 'phaser';
import { danmakuSpokes, DegToRad, drawCannons, paintCannons, readAngle, readParam, readSpeed, setUpCannons } from './utility';

export class Danmaku extends Phaser.Physics.Arcade.Image {
    constructor(
        scene,
        munitions,
        {
            x = 0, y = 0,
            danmakuTexture = null,
            danmakuFrame = null
        } = {}) {
            super(scene, x, y, danmakuTexture, danmakuFrame);
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.active = false;
            this.visible = false;
            this.munitions = munitions;
            this.danmakuPosition = new Phaser.Math.Vector2(this.x, this.y);
    };

    resetDanmaku(scene) {
        if (this.washerTween) this.washerTween.remove();
        if (this.repeatShotsTimer !== undefined) scene.time.removeEvent(this.repeatShotsTimer);
        if (this.intervalTimer !== undefined) scene.time.removeEvent(this.intervalTimer);
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
        }) {
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
            if (Array.isArray(danmakuConfig.aOffset))
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
            if (this.danmakuWasher !== undefined) this.setWasher(scene);
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
            if (Array.isArray(cannonConfig.angleRange)) {
                this.cannonAngleRangeStart = cannonConfig.angleRange.map(x => Phaser.Math.DegToRad(x));
                this.cannonAngleRangeRef = this.cannonAngleRangeStart[0];
            } else {
                switch (typeof(cannonConfig.angleRange)) {
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
                if (!this.cannonAngleRangeEnd) this.cannonAngleRangeEnd = (this.cannonAngleRangeStep > 0) ? (2 * Math.PI) : 0;
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
            if (this.bulletTransform !== undefined)
                this.transformTimer = this.bulletTransform.stage1Time;
            else
                this.transformTimer = undefined;
            this.perTurnConstraint = Phaser.Math.DegToRad(bulletConfig.perTurnConstraint);
            if (this.cannonClass === "PAINT") {
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
            if (this.numberOfShots !== 1) this.repeatShotsTimer = new Phaser.Time.TimerEvent(this.repeatShotsConfig);
            this.intervalConfig = {
                delay: this.timeBetweenShots * (this.numberOfShots) + this.stopShotsTime,
                callback: this.fireDanmaku,
                args: [scene],
                callbackScope: this,
                repeat: -1
            };
            if (this.stopShotsTime > 0) this.intervalTimer = new Phaser.Time.TimerEvent(this.intervalConfig);
            this.cannonPositions;
            this.cannonAngles;
            this.cannonShotSpeeds;
    };

    startUpDanmaku(scene) {
        switch (this.numberOfShots) {
            case 1:
                this.fireShot(scene);
                break;
            default:
                scene.time.addEvent(this.repeatShotsTimer);
                if (this.stopShotsTime) scene.time.addEvent(this.intervalTimer);
                break;
        };
    };

    fireDanmaku(scene) {
        switch (this.numberOfShots) {
            case 1:
                this.fireShot(scene);
                break;
            default:
                this.repeatShotsTimer.reset(this.repeatShotsConfig);
                scene.time.addEvent(this.repeatShotsTimer);
                break;
        };
    };

    fireShot(scene) {
        this.danmakuCounter++;
        if (this.repeatShotsTimer) this.repeatShotsCount = this.repeatShotsTimer.getRepeatCount()
        if (this.danmakuTarget) this.aimAt(this.danmakuTarget);
        switch (this.danmakuAngleLock) {
            case true:
                if (this.repeatShotsCount === this.shotsCount) this.referenceAngle = this.rotation;
                break;
            default:
                this.referenceAngle = this.rotation;
                break;
        };
        if (Array.isArray(this.cannonAngleRangeStart)) {
            this.cannonAngleRangeRef = readParam(this.cannonAngleRangeStart, this.danmakuCounter);
        } else {
            /// This switch determines how frequently the cannons angle range is "adjusted"
            switch (this.cannonAngleRangeLock) {
                case false:
                    this.cannonStepThruAngleRange();
                    break;
                default:
                    if ((this.cannonAngleRangeStep !== 0) && (this.repeatShotsCount === this.shotsCount))
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
        switch (this.cannonClass) {
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
        for (let i = 0; i < this.spreadCount; i++) {
            if (this.cannonShotSFX) this.cannonShotSFX.play();
            for (let j = 0; j < this.cannonShotSpeeds[i].length; j++) {
                const shotAngle = this.cannonAngles[j];
                const origin = (this.cannonPositions.length === 0)
                    ? this.danmakuPosition
                    : this.cannonPositions[j];
                const bullet = this.munitions.getFirstDead(false);
                if (bullet) {
                    if (this.transformTimer !== undefined)
                        this.bulletTransform.stage1Time = readParam(this.transformTimer, this.danmakuCounter);
                    if (this.flyAwayOption >0) this.bulletTransform.bearing = flyAwayAngles[j];
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

    cannonStepThruAngleRange() {
        this.cannonAngleRangeRef += this.cannonAngleRangeStep;
        switch (Math.sign(this.cannonAngleRangeStep)) {
            case 1:
                if (this.cannonAngleRangeRef >= Math.min(Math.PI * 2, this.cannonAngleRangeEnd)) {
                    if (!this.cannonAngleRangeYoYo) {
                        this.cannonAngleRangeRef = this.cannonAngleRangeStart;
                    } else {
                        this.cannonAngleRangeRef = Math.min(Math.PI * 2, this.cannonAngleRangeEnd);
                        this.cannonAngleRangeStep *= -1;
                        [this.cannonAngleRangeStart, this.cannonAngleRangeEnd] = [this.cannonAngleRangeEnd, this.cannonAngleRangeStart];
                    };
                };
                break;
            default:
                if (this.cannonAngleRangeRef <= Math.max(0, this.cannonAngleRangeEnd)) {
                    if (!this.cannonAngleRangeYoYo) {
                        this.cannonAngleRangeRef = this.cannonAngleRangeStart;
                    } else {
                        this.cannonAngleRangeRef = Math.max(0, this.cannonAngleRangeEnd);
                        this.cannonAngleRangeStep *= -1;
                        [this.cannonAngleRangeStart,this.cannonAngleRangeEnd] = [this.cannonAngleRangeEnd,this.cannonAngleRangeStart];
                    };
                };
                break;
        };
    };

    setWasher(scene) {
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

    follow(object) {
        this.x = object.x;
        this.y = object.y;
        this.danmakuPosition.x = this.x;
        this.danmakuPosition.y = this.y;
    };
    
    aimAt(target) {
        const targetAngle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );
        this.setRotation(targetAngle);
    };
};