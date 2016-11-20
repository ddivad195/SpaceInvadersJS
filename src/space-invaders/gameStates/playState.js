// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

var invaderRows = 0;

function PlayState(config, wave) {
    this.stateName = 'PlayState';
    this.wave = wave;
    this.config = config;
    this.invaders = [];
    this.bulletsFired = [];
    this.player = null;
    this.shotFired = false;
    this.lastFired = 0;
    this.invaderBullets = [];
    this.difficultyModifier = config.waveDifficultyMultiplier + wave;
    this.bgIndex = Math.round(Math.random() * (game.images.backgrounds.length-1));
    this.barrierPieces = [];
    this.hardRows = 1;
    this.mediumRows = wave == 1 ? 1:2;
}

// module.exports = PlayState;

PlayState.prototype.enter = function(game) {
    var options = game.constants;

    var potentialInvaderNum = (this.wave + options.startingInvaderRows) * options.invaderColumns; //work out total invaders that would be generated this wave
    //If total number is greater than the maximum number of invaders, use maximum number instead when determining how many rows of invaders there should be
    //Makes sure that if the player keeps progressing through waves, the invader rows don't keep growing above a max number
    invaderRows = potentialInvaderNum > options.maxInvaders ? options.maxInvaders / options.invaderColumns : potentialInvaderNum / options.invaderColumns;

    //Create invaders
    for(var i=0; i< game.constants.invaderColumns; i++) {
        for (var j=0; j < invaderRows; j++) {
            var invader = new Invader(i * 60 + 50, j * 45 + 20, j, i, 50 + (15 * this.difficultyModifier))
            //Red invaders
            if(j<this.hardRows) {
                invader.hitpoints = 3;
                invader.points = 20;
            }
            //Green invaders
            else if(j<this.mediumRows + this.hardRows){
                invader.hitpoints = 2;
                invader.points = 10;
            }
            //Blue invaders
            else {
                invader.hitpoints = 1;
                invader.points = 5;
            }
            this.invaders.push(invader);
        };
    }
    //Make player and barriers
    this.player = new Player(game.width / 2 - 30, game.height - 65);
    this.makeBarrier(150, 400);
    this.makeBarrier((game.width / 2),400);
    this.makeBarrier(650,400);
};

PlayState.prototype.update = function(game, delta) {
    var reverse = false;
    //check if invaders are at either screen edge
    for(var i=0; i<this.invaders.length; i++){
        var invader = this.invaders[i];
        if(invader.x >= game.width - invader.width - 5 || invader.x < 0 ){
            reverse = true;
            // break;
        }
        //Check for game over
        else if(invader.y >= this.player.y - this.player.height) game.changeState(new DeadState(game));
    }

    var canFire = [];
    //move invaders
    this.invaders.forEach(function(invader) {
        if(reverse){
            invader.dx = -invader.dx;
            invader.y += 20;
        }
        invader.x = invader.x +  invader.dx * delta;
        if(invader.row == this.invaderRows - 1) canFire.push(invader);
    });
    reverse = false;

    //Create invader bullets
    for(var i=0; i<canFire.length; i++) {
        var chance = 0.1 * delta + this.wave * delta * delta;
        if(chance > Math.random()) {
            var bomb = new Bullet(canFire[i].x + canFire[i].width / 2, canFire[i].y);
            bomb.dx = 250;
            this.invaderBullets.push(bomb);
        }
    }

    //Move bullets and check if off screen
    for(var i=0; i<this.invaderBullets.length; i++) {
        this.invaderBullets[i].y += delta * this.invaderBullets[i].dx;
        if(this.invaderBullets[i].y >= game.width) this.invaderBullets.splice(i--, 1);
    }

    for (var i=0; i<this.bulletsFired.length; i++) {
        var bullet = this.bulletsFired[i];

        bullet.y -= bullet.dx * delta;
        if(bullet.y < 0) this.bulletsFired.splice(i--, 1);
    }

    //Move player
    if(game.keysPressed[37]) {
        this.player.x -= 120 * delta;
    }
    if(game.keysPressed[39]) {
        this.player.x += 120 * delta;
    }
    //Stop player going off screen
    if(this.player.x <= 0) this.player.x = 0;
    else if(this.player.x + this.player.width>= game.width) this.player.x  = game.width - this.player.width;

    //Invader bullet and player collision
    for(var i=0; i<this.invaderBullets.length; i++) {
        var bomb = this.invaderBullets[i];
        if(checkCollisions(bomb, this.player)){
            this.invaderBullets.splice(i--, 1);
            game.lives--;
        }
    }

    //Detect other collisions
    detectCollisions(this.invaders,this.bulletsFired, true);
    detectCollisions(this.barrierPieces,this.bulletsFired, false);
    detectCollisions(this.barrierPieces,this.invaderBullets, false);

    //Check wave over
    if(this.invaders.length === 0) {
        game.score += this.wave * 50;
        game.changeState(new WaveTransitionState());
    }

    //Check game over
    if(game.lives === 0){
        if(game.score > game.topScore) game.topScore = game.score;
        game.changeState(new DeadState());
    }
}

PlayState.prototype.draw = function(game, delta, context) {
    context.drawImage(game.images.backgrounds[this.bgIndex], 0, 0, game.width, game.height); //Draw background
    //Draw invaders
    context.save(); //Save context state
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i], imageIndex = 0;
        if(invader.row < this.hardRows) imageIndex = 0;
        else if(invader.row < this.hardRows + this.mediumRows) imageIndex = 2;
        else imageIndex = 4;

        //Make invaders fade as they are hit by changing canvas transparency
        if(invader.hitpoints == 3) context.globalAlpha = 1;
        else if(invader.hitpoints == 2) context.globalAlpha = 0.8;
        else context.globalAlpha = 0.6;

        //animate invader movement
        if(game.framesDrawn % 100 > 50)context.drawImage(game.images.invaders[imageIndex], invader.x, invader.y, 60,40);
        else context.drawImage(game.images.invaders[imageIndex+1], invader.x, invader.y,60,40);
    }
    context.restore(); //Restore canvas state

    //Draw player and invader bullets
    context.fillStyle = '#59f442';
    this.bulletsFired.forEach(function (bullet) {
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    context.fillStyle = '#f77770';
    this.invaderBullets.forEach(function(bomb) {
        context.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);
    })

    //Draw player
    context.fillStyle = '#333333';
    context.drawImage(game.images.player[0], this.player.x, this.player.y);

    //Draw barriers
    context.fillStyle="#43c103";
    context.save(); //Save canvas state
    this.barrierPieces.forEach(function(barrierPiece) {
        //Make barrierPieces transparent as they get hit
        context.globalAlpha = barrierPiece.hitpoints /3
        context.fillRect(barrierPiece.x, barrierPiece.y, barrierPiece.width, barrierPiece.height);
    });
    context.restore(); //Restore canvas state

    game.drawHUD(context, true, true, true);
}

PlayState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32 || keyCode == 38) {
        if(!this.shotFired && (new Date()).valueOf() - this.lastFired > 300){
            this.shotFired = true;
            this.bulletsFired.push(new Bullet(this.player.x + this.player.width / 2 - 2.5, this.player.y));
            this.lastFired = new Date().valueOf();
        }
    }
    if(keyCode == 80) { //P key - push pause state
        game.addState(new PauseState());
    }
};

PlayState.prototype.keyUp = function(game, keyCode) {
    if(keyCode == 37 || keyCode == 39) { //Left or right key - stop player movement on keyUp
        this.player.dx = 0;
    }
    if(keyCode == 32 || keyCode == 38) { //Space or up key - reset shotFired on keyUp
        this.shotFired = false;
    }
};

//Make barriers
PlayState.prototype.makeBarrier = function (x, y) {
    for(var i=-60, j=-20; i<=60,j<=20; i+=15, j+=5){
        var b = new BarrierPiece(x+i-15,y+Math.abs(j));
        this.barrierPieces.push(b);
    }
}

// Check for collisions between 2 objects
function checkCollisions(object1, object2) {
    return (object1.x < object2.x + object2.width && object1.x + object1.width > object2.x &&
                 object1.y < object2.y + object2.width && object1.y + object1.height > object2.y)
}

function detectCollisions(array1, array2, updateScore) {
    for(var i=0; i<array1.length; i++) {
        var object1 = array1[i];
        for(var j=0; j<array2.length; j++) {
            var object2 = array2[j]
            if(checkCollisions(object1, object2)) {
                array2.splice(j,1);
                object1.hitpoints-=1;
            }
        }
        if(object1.hitpoints === 0) {
            array1.splice(i, 1);
            if(updateScore) game.score+=object1.points;
        }
    }
}
