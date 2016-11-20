// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

// var InitialState = require("./initialState.js")

function PauseState() {
    this.stateName = 'PauseState';
    this.flash = false;
}

// module.exports = PauseState;

PauseState.prototype.draw = function(game, delta, context) {
    context.save(); //Save context state

    //animate text by changing transparency of canvas
    if(game.framesDrawn % 70 > 40) context.globalAlpha = 1;
    else if(game.framesDrawn % 70 > 30) context.globalAlpha = 0.8;
    else if(game.framesDrawn % 70 > 20) context.globalAlpha = 0.6
    else context.globalAlpha = 0.4;

    context.fillStyle="#333333";
    context.fillRect(game.width/2 - 225, game.height/2 - 40, 450, 100);

    game.drawText("Game Paused", "#beed23", game.height/2, "medium");
    game.drawText("Press \'P\' to resume or \'Q\' to quit", "#beed23", game.height/2 + 40, "small");
    context.restore(); //Restore canvas state
}

PauseState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 80) { //P key for pause
        game.removeState();
    }
    if(keyCode == 81) { // Q key for quit
        game.changeState(new InitialState());
    }
}

PauseState.prototype.leave = function(game) {
    //Reset canvas transparency when state is left
    game.canvas.getContext("2d").globalAlpha = 1;
}
