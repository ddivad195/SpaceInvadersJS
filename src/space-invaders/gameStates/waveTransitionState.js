// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

// var InitialState = require('./initialState.js');
// var PlayState = require('./playState.js')

function WaveTransitionState() {
    this.stateName = 'WaveTransitionState';
}

// module.exports = WaveTransitionState;

WaveTransitionState.prototype.draw = function(game, delta, context) {
    // context.clearRect(0,0, game.width, game.height);
    context.drawImage(game.images.menu[0], 0, 0, game.width, game.height);
    game.drawText("Wave " + game.wave + " Complete", "#ffffff", game.height/6 - 30, "medium");
    game.drawText("Score + " + game.wave * 50, "#ffffff", game.height / 6, "small");

    context.save();
    if(game.framesDrawn % 70 > 40) context.globalAlpha = 1;
    else if(game.framesDrawn % 70 > 30) context.globalAlpha = 0.8;
    else if(game.framesDrawn % 70 > 20) context.globalAlpha = 0.6
    else context.globalAlpha = 0.4;
    game.drawText("To begin new wave press \'Enter\'", "#ffffff", game.height/6 * 5 + 20, "medium");
    game.drawText("(or to quit, press \'Q\')", '#ffffff', game.height/6*5 + 50, "small");

    context.restore();
    game.drawHUD(true, false, true);
};

WaveTransitionState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 13) {
        game.wave++;
        game.changeState(new PlayState(game.constants, game.wave));
    }
    if(keyCode == 81) { // Q key for quit
        if(game.score > game.topScore) game.topScore = game.score;
        game.changeState(new InitialState());
    }
};
