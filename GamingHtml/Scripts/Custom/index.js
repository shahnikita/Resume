
function floorObject(x, y, w, h) {
    var z = this;
    z.x = x,
    z.y = y,
    z.w = w,
    z.h = h;
}

$(function () {



    //#region mario
    var mario = {
        //Constants for showing correct sprite
        RIGHT: 0,
        LEFT: 30,
        STAND: 0,
        WALK1: 18,
        WALK2: 37,
        TURN: 56,
        JUMP: 74,
        FACE: 93,
        RUN: 111,
        RUN1: 132,
        RUN2: 152,

        MAXTOP: 70,
        MAXRIGHT: 175,
        XVELOCITY: 1,
        YVELOCITY: 2,

        //defaults: {
        //variables for placing sprite on canvas 
        currentImage: new Image(),
        currentSX: 0,
        currentSY: 0,
        currentSWidth: 18,
        currentSHeight: 17,
        currentDX: 0,
        currentDY: 184,
        currentDWidth: 18,
        currentDHeight: 17,
        bkgdPos: 0,

        size: 'small',
        direction: 0, //is facing left or right
        currentHeight: 0, //tracks jump height
        jumpDirection: 'UP',
        isJumping: false,
        isBouncing: false,
        currentFrame: 1,
        invincible: 0
        //}
        ,

        moveRight: function () {
            var z = this;

            if (z.direction == z.LEFT && !z.isJumping) {
                z.direction = z.RIGHT;
                z.currentSX = z.TURN;
                z.currentSY = z.RIGHT;

            } else {
                if (z.currentDX < z.MAXRIGHT && !level.collisions[1]) { //move the sprite right


                    z.currentDX = z.currentDX + z.XVELOCITY;
                    z.bkgdPos = z.bkgdPos + z.XVELOCITY;

                } else if (!level.collisions[1]) { //move the world right
                    level.moveWorldRight();
                    z.bkgdPos = z.bkgdPos + z.XVELOCITY;

                }

                var cf = z.currentFrame;
                if (!level.collisions[2]) { //we have not hit a floor so we are falling
                    z.currentSX = z.JUMP;
                    z.currentDY = z.currentDY + z.YVELOCITY;
                    z.currentHeight = z.currentHeight - z.YVELOCITY;
                    z.jumpDirection = "DOWN";


                } else { //we are walking

                    z.isJumping = false;
                    if (cf < 6) {
                        z.currentSX = z.WALK2

                    } else {
                        z.currentSX = z.WALK1

                    }
                    //z.isJumping = false;
                }
                /*
if(cf == 10){ z.set({currentFrame : 1}); }
				else {z.set({currentFrame:cf+1}); }
*/
            }
        },

        moveLeft: function () {
            var z = this,
			curDX = z.currentDX;

            if (z.direction == z.RIGHT && !z.isJumping) {
                z.direction = z.LEFT;
                z.currentSX = z.TURN;
                z.currentSY = z.LEFT;



            } else {
                if (curDX <= 35 && parseInt($("#items").css("background-position")) < 0 && !level.collisions[3]) {
                    level.moveWorldLeft();
                    z.bkgdPos = z.bkgdPos - z.XVELOCITY;
                } else if (curDX > 0 && !level.collisions[3]) {
                    z.currentDX = curDX - z.XVELOCITY
                    z.bkgdPos = z.bkgdPos - z.XVELOCITY

                }

                var csx,
					cf = z.currentFrame;
                if (!level.collisions[2]) {

                    z.currentSX = z.JUMP;
                    z.jumpDirection = "DOWN";
                    z.currentDY = z.currentDY + z.YVELOCITY;
                    z.currentHeight = z.currentHeight - z.YVELOCITY;


                } else {
                    if (cf < 6) {
                        csx = z.WALK2;
                    } else {
                        csx = z.WALK1;
                    }
                    z.isJumping = false;
                    z.currentSX = csx;

                }
                /*
if(cf == 10){z.set({currentFrame : 1});}
				else{z.set({currentFrame:cf+1});}
*/
            }
        },

        jump: function () {
            var z = this,
			curH = z.currentHeight,
			curDY = z.currentDY,
			curDX = z.currentDX,
			curBP = z.bkgdPos;

            z.currentSX = z.JUMP;
            z.isJumping = true;


            //console.log(curH, z.MAXTOP);
            if (z.jumpDirection === "UP") {
                if (curH < z.MAXTOP && !level.collisions[0]) {
                    z.currentDY = curDY - z.YVELOCITY;
                    z.currentHeight = curH + z.YVELOCITY;

                } else {
                    z.jumpDirection = "DOWN"
                }
            } else {
                if (!level.collisions[2]) {
                    z.currentDY = curDY + z.YVELOCITY;
                    z.currentHeight = curH - z.YVELOCITY;
                    z.jumpDirection = "DOWN";
                } else {
                    z.jumpDirection = "UP";
                    z.isJumping = false;
                    z.currentHeight = 0;

                }
            }
            if (level.rightDown && !level.collisions[1]) {
                if (curDX < z.MAXRIGHT) {
                    z.currentDX = curDX + z.XVELOCITY;
                    z.bkgdPos = curBP + z.XVELOCITY;

                } else {
                    level.moveWorldRight();
                    z.bkgdPos = curBP + z.XVELOCITY;

                }

            } else if (level.leftDown && !level.collisions[3]) {
                if (curDX <= 35 && parseInt($("#items").css("background-position")) < 0) {
                    level.moveWorldLeft();
                    z.bkgdPos = curBP - z.XVELOCITY;
                } else if (curDX > 0) {
                    z.currentDX = curDX - z.XVELOCITY;
                    z.bkgdPos = curBP - z.XVELOCITY;
                }

            }

        },
        bounce: function () {
            var z = this;
            z.jumpDirection = "UP";
        },
        stand: function () {
            var z = this,
			curDY = z.currentDY,
			curH = z.currentHeight;

            if (!level.collisions[2]) {
                z.currentDY = curDY + z.YVELOCITY;
                z.currentHeight = curH - z.YVELOCITY;
                z.jumpDirection = "DOWN";

            } else if (z.isJumping) {
                z.currentHeight = 0;
                z.jumpDirection = "UP";
                z.isJumping = false;

            } else if (!level.rightDown && !level.leftDown) {

                z.currentSX = z.STAND;
                z.currentHeight = 0;
                z.isJumping = false;

            }

        },

        initialize: function () {
            var z = this,
			ci = z.currentImage;
            ci.src = "../Images/Mario/mario.png";

            $(ci).load(function () {
                z.draw();
                z.currentImage = ci;
            });

        },

        draw: function () {
            var z = this,
			sizeOffset = 71;
            if (z.size == "big") {
                sizeOffset = 0;
            }
            var inv = z.invincible,
			cf = z.currentFrame;
            //console.log(cf);
            if (inv > 0) {
                if (cf < 6) { level.marioLevel.globalAlpha = 0.5; }
                else { level.marioLevel.globalAlpha = 1; }
                if (inv < 60) {
                    inv++;
                } else { inv = 0; }
            }
            if (cf == 10) {
                cf = 1;
            } else { cf++; }

            z.currentFrame = cf;
            z.invincible = inv;
            level.marioLevel.drawImage(z.currentImage
                , z.currentSX
                , z.currentSY + sizeOffset
                , z.currentSWidth
                , z.currentSHeight
                , z.currentDX
                , z.currentDY
                , z.currentDWidth
                , z.currentDHeight);
        },

        setSize: function (size) {
            var z = this;
            if (size == "big") {
                var dy = z.currentDY;
                z.size = "big";
                z.currentSHeight = 28;
                z.currentDY = dy - 11;
                z.currentDHeight = 28;

            } else if (size == "small") {
                var dy = z.currentDY;
                z.size = "small";
                z.currentSHeight = 17;
                z.currentDY = dy + 11;
                z.currentDHeight = 17

            }
        },

        hit: function () {
            var z = this,
			curSize = z.size,
			inv = z.invincible;
            if (inv == 0) {
                if (curSize == "big") {
                    z.setSize("small");
                    z.invincible = 1;
                } else {
                    z.die();
                }
            }
        },

        die: function () {
            var z = this;

         window.location.reload();
        }
    };
    //#endregion mario

    //#region level
    var level = {

        rightDown: false,
        leftDown: false,
        upDown: false,
        shiftDown: false,
        mario: {},
        objects: [],
        activeObjects: [],
        items: [],
        floors: [],
        enemies: [],
        activeEnemies: [],
        objectLevel: document.getElementById("level").getContext("2d"),
        enemyLevel: document.getElementById("enemies").getContext("2d"),
        marioLevel: document.getElementById("mario").getContext("2d"),
        itemLevel: document.getElementById("items").getContext("2d"),
        collisions: [false, false, false, false], //top,right,bottom,left

        update: function () {
            var z = this;
            z.checkCollisions();

            if (z.upDown) {
                z.mario.jump();
            } else if (z.rightDown) {
                z.mario.moveRight();
            } else if (z.leftDown) {
                z.mario.moveLeft();
            } else {
                z.mario.stand();
            }
            z.clear()
            z.mario.draw();

            for (var e = 0; e < z.enemies.length; e++) {
                var enemy = z.enemies[e],
                edx = enemy.currentDX,
                esw = enemy.currentSWidth,
                active = enemy.active;
                //console.log(edx);
                if (!enemy.active && !enemy.destroyed && edx > (0 - esw) && edx <= 225 + esw) {
                    z.enemies[e].update();
                    z.enemies[e].draw();
                    z.enemies[e].active = true;
                    z.activeEnemies.push(enemy);
                   
                } else if (active) {
                    enemy.active = false;
                    z.activeEnemies.splice(z.activeEnemies.indexOf(enemy), 1);
                }
            }

            for (var k = 0; k < z.objects.length; k++) {
                var cur = z.objects[k];
                if (!cur.destroyed && cur.currentDX > (0 - cur.currentSWidth) && cur.currentDX <= 225 + cur.currentSWidth) {
                    cur.update();
                    cur.draw();
                    cur.active = true;
                    if (!cur.ignore) {
                        z.activeObjects.push(cur);
                    }
                } else if (cur.active) {
                    cur.active = false;
                    z.activeObjects.splice(z.objects.indexOf(cur), 1);
                }
            }
            for (var l = 0; l < z.items.length; l++) {
                var cur = z.items[l];
                if (!cur.destroyed && cur.currentDX > (0 - cur.currentSWidth) && cur.currentDX <= 225 + cur.currentSWidth) {
                    cur.update();
                    cur.draw();
                    cur.active = true;
                } else if (cur.active) {
                    cur.active = false;
                }
            }

            if (z.mario.currentDY > 224) {
                z.mario.die();
            } else {
                setTimeout(function () { z.update(); }, 1000 / 60);
            }
        },

        checkCollisions: function () {
            var z = this,
			mright = z.mario.currentDX + z.mario.currentDWidth,
			mleft = z.mario.currentDX,
			mtop = z.mario.currentDY,
			mbottom = z.mario.currentDY + z.mario.currentDHeight,
			mdirection = z.mario.direction;
            z.collisions = [false, false, false, false];

            for (var i = 0; i < z.items.length; i++) {
                var item = z.items[i],
				itop = item.currentDY,
				ileft = item.currentDX,
				ibottom = item.currentDY + item.currentDHeight,
				iright = item.currentDX + item.currentDWidth;
                z.items[i].collisions = [false, false, false, false];
                if (item.ready && mright > ileft && mleft < iright && mbottom > itop && mtop < ibottom) {
                    item.hit();
                }
            }

            for (var k = 0; k < z.activeObjects.length; k++) {
                var cur = z.activeObjects[k];
                if (cur.active) {
                    if (mtop > cur.currentDY && mtop < cur.currentDY + cur.currentDHeight && mleft + 2 < cur.currentDX + cur.currentDWidth && mright - 2 > cur.currentDX) {
                        z.collisions[0] = true;
                        var m = mright - 8;// Math.abs((mleft+ mright)/2 - (cur.currentDX + cur.currentDX + cur.currentDWidth) / 2);

                        if (m < cur.currentDX + cur.currentDWidth && m > cur.currentDX) {
                            
                            cur.hit();
                        }
                    }
                    if (mright > cur.currentDX && mright < cur.currentDX + cur.currentDWidth && mtop < cur.currentDY + cur.currentDHeight && mbottom - 2 > cur.currentDY) { z.collisions[1] = true; }
                    if (mbottom > cur.currentDY && mbottom < cur.currentDY + cur.currentDHeight && mleft + 2 < cur.currentDX + cur.currentDWidth && mright - 2 > cur.currentDX) { z.collisions[2] = true; }
                    if (mleft > cur.currentDX && mleft < cur.currentDX + cur.currentDWidth && mtop < cur.currentDY + cur.currentDHeight && mbottom - 2 > cur.currentDY) { z.collisions[3] = true; }

                    for (var i = 0; i < z.items.length; i++) {
                        var item = z.items[i],
						itop = item.currentDY,
						ileft = item.currentDX,
						ibottom = item.currentDY + item.currentDHeight,
						iright = item.currentDX + item.currentDWidth;

                        if (itop > cur.currentDY && itop < cur.currentDY + cur.currentDHeight && ileft + 2 < cur.currentDX + cur.currentDWidth && iright - 2 > cur.currentDX) { z.items[i].collisions[0] = true; }
                        if (iright > cur.currentDX && iright < cur.currentDX + cur.currentDWidth && itop < cur.currentDY + cur.currentDHeight && ibottom - 2 > cur.currentDY) { z.items[i].collisions[1] = true; }
                        if (ibottom > cur.currentDY && ibottom < cur.currentDY + cur.currentDHeight && ileft + 2 < cur.currentDX + cur.currentDWidth && iright - 2 > cur.currentDX) { z.items[i].collisions[2] = true; }
                        if (ileft > cur.currentDX && ileft < cur.currentDX + cur.currentDWidth && itop < cur.currentDY + cur.currentDHeight && ibottom - 2 > cur.currentDY) { z.items[i].collisions[3] = true; }
                    }

                }
            }

            for (var e = 0; e < z.activeEnemies.length; e++) {
                var enemy = z.activeEnemies[e],
				etop = enemy.currentDY,
				eleft = enemy.currentDX,
				ebottom = etop + enemy.currentDHeight,
				eright = eleft + enemy.currentDWidth,
				isDying = enemy.dying;

                if (!isDying) {
                    if (mbottom > etop && mbottom < etop + 5 && ((mright < eright && mright > eleft) || (mleft > eleft && mleft < eright))) {
                        debugger;
                        z.activeEnemies[e].hit();
                        z.mario.bounce();
                    }
                    else if ((mright > eleft && mright < eleft + 5 || mleft < eright && mleft > eright - 5) && mtop < ebottom && mbottom > etop) {
                        
                        z.mario.hit();
                    }
                }

            }

            mright = z.mario.bkgdPos + z.mario.currentDWidth;
            mleft = z.mario.bkgdPos;
            for (var k = 0; k < z.floors.length; k++) {
                var cur = z.floors[k];
                if (mright > cur.x && mright < cur.x + cur.w && mtop < cur.y + cur.h && mbottom - 2 > cur.y) { z.collisions[1] = true; }
                if (mbottom > cur.y && mbottom < cur.y + cur.h && mleft + 2 < cur.x + cur.w && mright - 2 > cur.x) { z.collisions[2] = true; }
                if (mleft > cur.x && mleft < cur.x + cur.w && mtop < cur.y + cur.h && mbottom - 2 > cur.y) { z.collisions[3] = true; }
                for (var i = 0; i < z.items.length; i++) {
                    var item = z.items[i],
					ileft = item.currentDX,
					ibottom = item.currentDY + item.currentDHeight,
					iright = item.currentDX + item.currentDWidth;

                    if (ibottom > cur.y && ibottom < cur.y + cur.h && ileft + 2 < cur.x + cur.w && iright - 2 > cur.x) { z.items[i].collisions[2] = true; }
                }
            }



        },

        moveWorldLeft: function () {
            var z = this;
            for (var k = 0; k < z.objects.length; k++) {
                z.objects[k].currentDX += 1;
            }
            for (var i = 0; i < z.items.length; i++) {
                z.items[i].currentDX += 1;
            }
            for (var e = 0; e < z.enemies.length; e++) {
                var dx = z.enemies[e].currentDX;
                dx += 1;
                z.enemies[e].currentDX = dx;
            }
            $("#items").css({ "background-position": "+=1px 0px" });
        },

        moveWorldRight: function () {
            var z = this;
            for (var k = 0; k < z.objects.length; k++) {
                z.objects[k].currentDX -= 1;
            }
            for (var i = 0; i < z.items.length; i++) {
                z.items[i].currentDX -= 1;
            }
            for (var e = 0; e < z.enemies.length; e++) {
                var dx = z.enemies[e].currentDX;
                dx -= 1;
                z.enemies[e].currentDX = dx;
            }
            $("#items").css({ "background-position": "-=1px 0px" });
        },

        clear: function () {
            this.objectLevel.clearRect(0, 0, 240, 224);
            this.marioLevel.clearRect(0, 0, 240, 224);
            this.itemLevel.clearRect(0, 0, 240, 224);
            this.enemyLevel.clearRect(0, 0, 240, 224);
        },

        init: function () {
            console.log("START");
            var z = this;
            z.mario = mario;
            z.mario.initialize();


            z.floors.push(new floorObject(0, 200, 1104, 24));
            //z.floors.push(new floorObject(1136, 200, 240, 24));
            //z.floors.push(new floorObject(1424, 200, 1024, 24));
            //z.floors.push(new floorObject(2480, 200, 904, 24));


            $('body').keydown(function (e) {
                var key = e.which;
                //console.log(key);
                if (key == 38) {
                    z.upDown = true;
                }
                else if (key == 39) {
                    z.rightDown = true;
                }
                else if (key == 37) {
                    z.leftDown = true;
                }
                /*else if(key == 16){
					z.shiftDown = true;
				}*/
            });

            $('body').keyup(function (e) {
                var key = e.which;
                if (key == 39) {
                    z.rightDown = false;
                }
                else if (key == 37) {
                    z.leftDown = false;
                }
                else if (key == 38) {
                    z.upDown = false;
                }
                else if (key == 16) {
                    z.shiftDown = false;
                }

                z.update();
            });

            
        }
    };
    //#endregion level

    


  

    level.init();

});