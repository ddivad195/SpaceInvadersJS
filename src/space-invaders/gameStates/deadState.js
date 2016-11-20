// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

// var InitialState = require('./initialState.js');

function DeadState() {
    this.stateName = 'DeadState';
    this.bullets = [];
    this.invaders = [];
}

// module.exports = DeadState;

//Create invaders
DeadState.prototype.enter = function() {
    this.invaders.push(new Invader(game.width/3, game.height/2, 60, 40));
    this.invaders.push(new Invader(game.width/3 * 2 - 60, game.height/2, 60, 40));
    this.invaders.push(new Invader(game.width/2 - 30, game.height/2, 60, 40));
}

DeadState.prototype.draw = function(game, delta, context) {
    //Draw background and text
    context.drawImage(game.images.backgrounds[0], 0, 0, game.width, game.height);
    game.drawText("Game Over", "#f9181c", game.height/4 - 50, "large");
    game.drawText("You reached Wave " + game.wave, "#ffffff", game.height/4+45, "medium");
    game.drawText("and Scored " + game.score, "#ffffff", game.height/4 + 80, "medium");

    //Draw + animate invaders on the Game Over screen
    this.invaders.forEach(function(invader) {
        if(game.framesDrawn % 100 > 50) context.drawImage(game.images.invaders[0], invader.x,invader.y, 60, 40);
        else context.drawImage(game.images.invaders[1], invader.x, invader.y, 60, 40);
    })

    game.drawText("Press \'Enter\' to Play Again", "#ffffff", game.height / 2 + 200, "medium");
    context.fillStyle = '#f77770';
    this.bullets.forEach(function(bullet){
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
};

DeadState.prototype.update = function(game, delta) {
    var state = this;
    //Create bullets
    this.invaders.forEach(function(invader) {
        var chance = 0.5 * delta + 4 * delta * delta;
        if(chance > Math.random()) {
            var bomb = new Bullet(invader.x + invader.width / 2, invader.y + invader.height);
            bomb.dx = 250;
            state.bullets.push(bomb);
        }
    });

    //Update bullets
    for(var i=0; i < this.bullets.length; i++) {
        var bullet = this.bullets[i];
        bullet.y += delta * bullet.dx;
        if(bullet.y > game.height / 2 + 170) this.bullets.splice(i, 1);
    }
}

DeadState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 13) {
        game.changeState(new InitialState());
    }
}
