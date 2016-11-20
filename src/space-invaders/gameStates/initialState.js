// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

// var PlayState = require('./playState.js');

function InitialState() {
    this.stateName = 'InitialState';
    this.invaders = [];
}

// module.exports = InitialState;

InitialState.prototype.draw = function(game, delta, context) {
    context.clearRect(0,0,game.width,game.height);
    context.drawImage(game.images.backgrounds[0],0,0,game.width,game.height);
    game.drawText("Space Invaders", "#ffffff", game.height/6, 'large');
    game.drawText("Press '\Enter\' to begin","#ffffff", game.height/6 + 50, 'medium');

    //Draw invader images
    if(game.framesDrawn % 100 > 50) {
        context.drawImage(game.images.invaders[0], game.width/2-200, game.height/2+50, 60, 40);
        context.drawImage(game.images.invaders[2], game.width/2-200, game.height/2, 60, 40);
        context.drawImage(game.images.invaders[4], game.width/2-200, game.height/2-50, 60, 40);
    }
    else {
        context.drawImage(game.images.invaders[1], game.width/2-200, game.height/2+50, 60, 40);
        context.drawImage(game.images.invaders[3], game.width/2-200, game.height/2, 60, 40);
        context.drawImage(game.images.invaders[5], game.width/2-200, game.height/2 - 50, 60, 40);
    }

    //Draw points and HP for each invader type
    game.drawText(" = 20 PTS, 3 HP", "#f90909", game.height/2 + 80, 'medium');
    game.drawText(" = 10 PTS, 2 HP", "#58f918", game.height/2 + 30,'medium');
    game.drawText(" = 5 PTS, 1 HP", "#18f9e7", game.height/2 - 20, 'medium');

    if(game.score > 0) game.drawText("Top Score: " + game.topScore,"#ffffff", game.height - 120, "medium");
    game.drawText("Move using the arrow keys and shoot using ^ or \'Space\'", '#ffffff', game.height-50, 'small');
    game.drawText("The game can be paused at any time by pressing '\P\'", '#ffffff', game.height-25, 'small');
};

InitialState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 13) {
        game.wave = 1;
        game.score = 0;
        game.lives = 3;
        game.changeState(new PlayState(game.constants, game.wave));
    }
};
