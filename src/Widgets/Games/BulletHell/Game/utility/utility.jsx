export function readSpeed(cannon, inst) {
    switch (typeof(inst)) {
        case "undefined": return cannon;
        case "number": return inst;
        case "string":
            switch (inst[0]) {
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

export function readAngle(cannon, inst) {
    switch (typeof(inst)) {
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
                    if (Math.abs(cannon) > Math.PI / 2){
                        return cannon - Phaser.Math.DegToRad(parseFloat(inst.substring(1)));
                    } else if (Math.abs(cannon) < Math.PI / 2){
                        return cannon + Phaser.Math.DegToRad(parseFloat(inst.substring(1)));
                    } else {
                        return cannon; 
                    };
                case "*": return cannon * parseFloat(inst.substring(1));          
                default: break;
            };
            break;
        default: break;
    };
};

export function readParam(param, count) {
    if (Array.isArray(param))
        return param[count % param.length];
    else
        return param;
};

export function DegToRad(param) {
    if (typeof(param) === "number") {
        return Phaser.Math.DegToRad(param);
    } else {
        const workArray = [];
        param.forEach((item) => {
            workArray.push(DegToRad(item));
        });
        return workArray;
    };
};

export function danmakuSpokes({
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
}) {  
    let directions = []; /// This is the working array to hold the cannon angles --> pushed to spokesArray at end of this function
    function getAngles(centreAngle, range, points) {
        let tempArray = [];
        switch (points) {
            case 1:
                tempArray.push(centreAngle)
                break;
            default:
                switch (range) {
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
    switch (danmakuType) {
        case "PARALLEL": {
            const line = createLine(0, width); 
            directions.forEach((angle, i) => {
                const shift = new Phaser.Math.Vector2(vOffset, hOffset).rotate(angle);
                for (let j = 0; j < readParam(numberOfPoints, i); j++) {
                    const point = line.getPoint(j / (readParam(numberOfPoints, i) - 1))
                        .rotate(angle)
                        .add(shift);
                    originsArray.push(point);
                    spokesArray.push(angle);
                };
            });
            break; 
        };       
        case "BI_DIRECTIONAL": {
            spokesArray.push(...directions, ...directions.map(x => -x));
            spokesArray.forEach((angle) => {
                const shift = new Phaser.Math.Vector2(vOffset, hOffset).rotate(angle);
                if (vOffset !==0 || hOffset !==0) originsArray.push(new Phaser.Math.Vector2(0,0).add(shift));
            });
            break;
        };
        default: {
            directions.forEach((angle) => {
                const shift = new Phaser.Math.Vector2(vOffset, hOffset).rotate(angle);
                if (vOffset !==0 || hOffset !==0) originsArray.push(new Phaser.Math.Vector2(0,0).add(shift));
                spokesArray.push(angle);
            });
            break;
        };
    };
};

export function setUpCannons({
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
}) { 
    anglesArray.push(...spokesArray);
    pointsArray.push(...originsArray.reduce((acc,p) => [...acc, p.add(centre)], []));
    switch (shotType) {
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

export function paintCannons({
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
}) {
    const speeds = [];
    const textLine = picture[counter];
    const count = textLine.length;
    const line = createLine(0, pWidth);
    spokesArray.forEach((angle,j) => {
        const realOrigin = (originsArray.length === 0)
            ? centre
            : originsArray[j].add(centre); 
        Array.from(textLine).forEach((char, i) => {
            if (char !== " ") {
                switch (keepShape) {
                    case true: {
                        const point = line.getPoint(i / (count - 1))
                            .rotate(angle)
                            .add(realOrigin);
                        pointsArray.push(point);
                        anglesArray.push(angle);
                        break;
                    };
                    default: {
                        anglesArray.push(angle + pAngleRange * (0.5 - i / (count - 1)));
                        break;
                    };
                };
                speeds.push(bulletSpeed);
            };
        });
    });
    speedArray.push(speeds);
};

export function createLine(offset = 0, width) {
    const aa = new Phaser.Math.Vector2(offset, width / 2);
    const bb = new Phaser.Math.Vector2(offset, -width / 2);
    return new Phaser.Curves.Line(aa, bb);
};

export function drawCannons({
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
}) {
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
        for (let i = 0; i < numberOfPoints; i++) {
            const point = curve.getPoint(i / (numberOfPoints - 1 * open))
                .rotate(Math.PI / 2 + (pRotation === undefined ? angle : pRotation)); 
            if (keepShape) {
                switch (emerge) {
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
            } else {
                switch (emerge) {
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

export function createArc(aspectRatio = 1, angleRange) {
    angleRange = isNaN(angleRange) ? 360 : angleRange;
    const startAngle = (angleRange === undefined) ? 0 : -90 - angleRange / 2;
    const endAngle = (angleRange === undefined) ? 360 : -90 + angleRange / 2;
    const ellipse = new Phaser.Curves.Ellipse(0, 0, 1, aspectRatio, startAngle, endAngle);
    return ellipse;
};