//#region enemy

var Enemy = function () {

    //variables for placing sprite on canvas 
    this.currentImage = new Image();
    this.currentSX = 0;
    this.currentSY = 0;
    this.currentSWidth = 18;
    this.currentSHeight = 17;
    this.currentDX = 0;
    this.currentDY = 184;
    this.currentDWidth = 18;
    this.currentDHeight = 17;
    this.bkgdPos = 0;
    this.type = "goomba";
    this.rightDirection = false; //is facing left or right
    this.currentFrame = 1;
    this.collisions = [false, false, false, false];
    this.destroyed = false;
    this.active = false;
    this.dying = false;

    this.update = function () {
        var z = this;
        z.checkCollisions();
        var collisions = z.collisions,
        curDY = z.currentDY,
        curDX = z.currentDX,
        rd = z.rightDirection;

        if (!collisions[2]) {
            z.currentDY = curDY + 3;
        }
        if (collisions[1] && rd) {
            z.rightDirection = false;
        }
        else if (collisions[3] && !rd) {
            z.rightDirection = true;
        }
        if (z.rightDirection) {
            z.currentDX = curDX + 0.3;
        } else {
            z.currentDX = curDX - 0.3;
        }
    }

    this.checkCollisions = function () {
        var z = this,
        eright = z.currentDX + z.currentDWidth,
        eleft = z.currentDX,
        etop = z.currentDY,
        ebottom = z.currentDY + z.currentDHeight,
        edirection = z.direction,
        newCollisions = [false, false, false, false];

        for (var k = 0; k < level.activeObjects.length; k++) {
            var cur = level.activeObjects[k];
            if (cur.active) {

                if (etop > cur.currentDY && etop < cur.currentDY + cur.currentDHeight && eleft + 2 < cur.currentDX + cur.currentDWidth && eright - 2 > cur.currentDX) { newCollisions[0] = true; }
                if (eright > cur.currentDX && eright < cur.currentDX + cur.currentDWidth && etop < cur.currentDY + cur.currentDHeight && ebottom - 2 > cur.currentDY) { newCollisions[1] = true; }
                if (ebottom > cur.currentDY && ebottom < cur.currentDY + cur.currentDHeight && eleft + 2 < cur.currentDX + cur.currentDWidth && eright - 2 > cur.currentDX) { newCollisions[2] = true; }
                if (eleft > cur.currentDX && eleft < cur.currentDX + cur.currentDWidth && etop < cur.currentDY + cur.currentDHeight && ebottom - 2 > cur.currentDY) { newCollisions[3] = true; }
            }
        }
        for (var k = 0; k < level.floors.length; k++) {
            var cur = level.floors[k];
            if (eright > cur.x && eright < cur.x + cur.w && etop < cur.y + cur.h && ebottom - 2 > cur.y) { newCollisions[1] = true; }
            if (ebottom > cur.y && ebottom < cur.y + cur.h && eleft + 2 < cur.x + cur.w && eright - 2 > cur.x) { newCollisions[2] = true; }
            if (eleft > cur.x && eleft < cur.x + cur.w && etop < cur.y + cur.h && ebottom - 2 > cur.y) { newCollisions[3] = true; }

        }

        z.collisions = newCollisions;
    };
    this.draw = function () {
        var z = this;
        level.enemyLevel.drawImage(z.currentImage, z.currentSX, z.currentSY, z.currentSWidth, z.currentSHeight, z.currentDX, z.currentDY, z.currentDWidth, z.currentDHeight);
    };

    this.hit = function () {
        this.destroyed = true;
        this.active = false;
    };

    this.init = function () {
        var z = this;
        z.currentImage.src = "/Images/Mario/enemies.png";

    };
    this.init();


}

//#endregion enemy

//#region Goomba
var Goomba = function () {
    Enemy.apply(this, arguments)
    this.currentFrame = 1;
    this.LEFT = 0;
    this.RIGHT = 16;
    this.DEAD = 32;
}
Goomba.prototype.update = function () {
    var z = this;
    if (!z.get('dying')) {
        enemy.prototype.update.apply(this);
        var collisions = z.get('collisions');

        var csx = z.LEFT;
        if (z.currentFrame > 6) {
            csx = z.RIGHT;
        }
        z.set({ currentSX: csx });

        if (z.currentFrame == 12) { z.currentFrame = 1; }
        else { z.currentFrame++; }
    } else { //if dying
        if (z.currentFrame <= 15) {
            z.currentFrame++;
        } else {
            z.destroyed = true;
        }
    }
};

Goomba.prototype.hit = function () {
    var z = this;
    z.set({ 'currentSX': z.DEAD, 'active': false, 'dying': true });
    z.currentFrame = 1;
}

Goomba.prototype = Enemy.prototype;
Goomba.prototype.constructor = Goomba;


var goomba = new Goomba();

//#endregion Goomba


var gameObject = function (i, sx, sy, sw, sh, dx, dy, dw, dh, ig) {

    var z = this;
    z.currentImage = new Image();
    z.currentImage.src = i,
    z.currentSX = sx,
    z.currentSY = sy,
    z.currentSWidth = sw,
    z.currentSHeight = sh,
    z.currentDX = dx,
    z.currentDY = dy,
    z.currentDWidth = dw,
    z.currentDHeight = dh,
    z.active = false,
    z.destroyed = false,
    z.ignore = ig;



    z.draw = function () {
        var z = this;
        level.objectLevel.drawImage(z.currentImage, z.currentSX, z.currentSY, z.currentSWidth, z.currentSHeight, z.currentDX, z.currentDY, z.currentDWidth, z.currentDHeight);
    }

    z.die = function () {
        //console.log(this.destroyed);
        this.destroyed = true;
    }

    z.hit = function () {
        console.log("object");
    }
}

var gameItem = function (i, sx, sy, sw, sh, dx, dy, dw, dh, ig) {
    gameObject.apply(this, i, sx, sy, sw, sh, dx, dy, dw, dh, ig);
    var z = this;
    z.collisions = [false, false, false, false];
    z.draw = function () {
        level.itemLevel.drawImage(z.currentImage, z.currentSX, z.currentSY, z.currentSWidth, z.currentSHeight, z.currentDX, z.currentDY, z.currentDWidth, z.currentDHeight);
    }
    z.die = function () {
        this.destroyed = true;
        level.items.splice(level.items.indexOf(z), 1);
    }
}

gameItem.prototype = gameObject.prototype;
gameItem.prototype.constructor = gameItem;


var coin = function (i, sx, sy, sw, sh, dx, dy, dw, dh, ig) {
    gameItem.call(this, i, sx, sy, sw, sh, dx, dy, dw, dh, ig);
    var z = this;
    z.y = 0;

    z.update = function () {
        if (z.y < z.currentDHeight) {
            z.currentDY--;
            z.y++;
        } else {
            z.die();
        }
    }
}
coin.prototype = gameItem.prototype;
gameItem.prototype.constructor = coin;


var mushroom = function (i, sx, sy, sw, sh, dx, dy, dw, dh, ig) {
    gameItem.call(this, i, sx, sy, sw, sh, dx, dy, dw, dh, ig);
    var z = this;
    z.y = 0,
    z.rightDirection = true
    z.ready = false;

    z.update = function () {
        if (z.y < z.currentDHeight) {
            z.currentDY--;
            z.y++;
        } else {
            if (!z.ready) { z.ready = true; }
            if (!z.collisions[2]) {
                z.currentDY += 2;
            }
            if (z.collisions[1] && z.rightDirection) {
                z.rightDirection = false;
            }
            else if (z.collisions[3] && !z.rightDirection) {
                z.rightDirection = true;
            }
            if (z.rightDirection) {
                z.currentDX += 0.75;
            } else {
                z.currentDX -= 0.75;
            }

        }

        if (z.currentDY > 224 || z.currentDX > 224 || z.currentDX < 0) {
            z.die();
        }
    }

    z.hit = function () {
        level.mario.setSize("big");
        z.die();
    }
};
mushroom.prototype = gameItem.prototype;
gameItem.prototype.constructor = mushroom;

var brick = function (i, sx, sy, sw, sh, dx, dy, dw, dh, ig) {
    //gameObject.call(this);
    gameObject.call(this, i, sx, sy, sw, sh, dx, dy, dw, dh, ig);
    var z = this;
    z.MAXBUMPHEIGHT = 8,
    z.bump = 0,
    z.isBumped = false;

    z.hit = function () {
        z.isBumped = true;
    }

    z.update = function () {
        if (z.isBumped) {
            if (z.bump <= z.MAXBUMPHEIGHT / 2) {
                z.currentDY--;
            } else {
                z.currentDY++;
            }

            if (z.bump <= z.MAXBUMPHEIGHT) {
                z.bump++;
            } else {
                z.bump = 0;
                z.isBumped = false;
            }
        }
    }
}
brick.prototype = gameItem.prototype;
brick.prototype.constructor = brick;

var questionmark = function (i, sx, sy, sw, sh, dx, dy, dw, dh, ig, reward) {
    //gameObject.call(this);
    gameObject.call(this, i, sx, sy, sw, sh, dx, dy, dw, dh, ig);
    var z = this;
    z.MAXBUMPHEIGHT = 8,
    z.bump = 0,
    z.isBumped = false,
    z.isAlive = true;

    z.hit = function () {
        if (z.isAlive && !z.isBumped) {
            z.isBumped = true;
            if (reward == "mushroom") {
                level.items.push(new mushroom(z.currentImage.src, 104, 0, 16, 16, z.currentDX, z.currentDY, 16, 16));
            } else {
                level.items.push(new coin(z.currentImage.src, 88, 0, 14, 16, z.currentDX, z.currentDY, 14, 16));
            }
            //console.log(level.items);
        }
    }

    z.die = function () {
        z.currentSX = 54,
        z.isAlive = false;
    }

    z.update = function () {
        if (z.isBumped) {
            if (z.bump <= z.MAXBUMPHEIGHT / 2) {
                z.currentDY--;
            } else {
                if (z.isAlive) z.die();
                z.currentDY++;
            }

            if (z.bump <= z.MAXBUMPHEIGHT) {
                z.bump++;
            } else {
                z.bump = 0;
                z.isBumped = false;
            }
        }
    }
}
questionmark.prototype = gameItem.prototype;
questionmark.prototype.constructor = questionmark;




