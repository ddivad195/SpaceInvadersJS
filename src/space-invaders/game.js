// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

// var InitialState = require('./gameStates/initialState.js')
// var ImageLoader = require('./imageLoader.js')

function Game(constants) {
    this.constants = constants;
    this.score = 0;
    this.topScore = 0;
    this.states = [];
    this.keysPressed = {};
    this.canvas = document.getElementById('game-canvas');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    var imageLoader = new ImageLoader();
    this.images = imageLoader.loadImages(constants.images);
    this.framesDrawn = 0;
};

// module.exports = Game;

//Changes game state and removes the previous state from the states array
Game.prototype.changeState = function(state) {
    if(this.getCurrentState() && this.getCurrentState().leave) {
        this.getCurrentState().leave(game);
        this.states.pop();
    }

    if(state.enter) {
        state.enter(game);
    }

    this.states.pop();
    this.states.push(state);
};

//Adds a new state to the game states array without removing the previous one.
//Used in certain situations where the previous one should not get removed, eg: pause and play state combo
Game.prototype.addState = function(state) {
    if(state.enter) {
        state.enter(game);
    }
    this.states.push(state);
};

//Removes state from the games state array without the need to add a new one first.
//Used in certain situations where the previous one should not get removed, eg: pause and play state combo
Game.prototype.removeState = function(state){
    if(this.getCurrentState()) {
        if(this.getCurrentState().leave) {
            this.getCurrentState().leave(game);
        }

        this.states.pop();
    }
};

//Returns the current game state
Game.prototype.getCurrentState = function() {
    if(this.states.length) {
        return this.states[this.states.length-1]
    }
    else return null;
};

//Starts the game by starting the gameloop
Game.prototype.start = function() {
    this.addState(new InitialState());
    var game = this;

    // Start gameloop and set FPS to 60
    this.intervalId = setInterval(function() {
        GameLoop(game);
    }, 1000 / 60)
};

//Records keys pressed in the game
Game.prototype.keyDown = function(keyCode) {
    this.keysPressed[keyCode] = true;

    if(this.getCurrentState() && this.getCurrentState().keyDown) {
        this.getCurrentState().keyDown(this, keyCode);
    }
};

//Records keys released in the game
Game.prototype.keyUp = function(keyCode) {
    //Remove keyCode from the keysPressed array
    delete this.keysPressed[keyCode];

    if(this.getCurrentState() && this.getCurrentState().keyUp) {
        this.getCurrentState().keyUp(this, keyCode);
    }
};

//Draw the game stats on the canvas.
//Configurable to allow the option to show/hide each stat
Game.prototype.drawHUD = function(wave, lives, score) {
    var context = this.canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.font="15px Lucida Console";
    if(score) context.fillText("Score: " + this.score, 690,game.height - 10);
    if(wave) context.fillText("Wave: " + this.wave, 15, game.height - 10);
    if(lives) context.fillText("Lives: " + this.lives, game.width/2 - context.measureText("Lives: ").width/2, game.height - 10);
}

//Draw text on the canvas.
//Centers the text on screen and has different sizes and options for text rendering
Game.prototype.drawText = function(text, color, y,size) {
    var context = this.canvas.getContext("2d");
    if(size){
        if(size=='large')context.font="60px Lucida Console";
        if(size=='medium')context.font="30px Lucida Console";
        if(size=='small')context.font="15px Lucida Console";
    }
    else context.font="30px Lucida Console";
    context.fillStyle = color;
    context.fillText(text, (this.width / 2) - context.measureText(text).width / 2, y);
}

//GameLoop function. Calls draw and update functions from the current gamestate if they are defined
function GameLoop(game) {
    var currentState = game.getCurrentState();

    if(currentState) {
        var delta = 1 / 60;
        var context = game.canvas.getContext("2d");

        if(currentState.update) {
            currentState.update(game, delta);
        }
        if(currentState.draw) {
            currentState.draw(game, delta, context);
        }
    }
    game.framesDrawn++
}

//Player constructor
function Player(xpos, ypos) {
    this.x = xpos;
    this.y = ypos;
    this.dx = 0;
    this.width = 60;
    this.height = 40;
}

//Invader constructor
function Invader(xpos, ypos, row, column, speed) {
    this.x = xpos;
    this.y = ypos;
    this.width = 50;
    this.height = 32;
    this.row = row;
    this.column = column;
    this.dx = speed;
    this.hitpoints;
}

//Bullet constructor
function Bullet(xpos, ypos) {
    this.x = xpos;
    this.y = ypos;
    this.dx = 400;
    this.width = 5;
    this.height = 5;
}

//Barrier constructor
function BarrierPiece(xpos, ypos) {
    this.x = xpos;
    this.y = ypos;
    this.width = 30;
    this.height = 5;
    this.hitpoints = 3;
}
