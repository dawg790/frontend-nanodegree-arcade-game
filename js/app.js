// Declare Global variables below

// Game Board specs
var gameBoardHeight = 606;
var gameBoardWidth = 505;
var spriteWidth = gameBoardWidth / 5;
// Character choices and names
var characters = document.getElementById('sprites');
var characterChoice = "images/char-boy.png";
var characterNameHolder = document.getElementById('characterName');
characterNameHolder.innerHTML = "Choose a player above";
var characterName;
// Player lives count and score elements
var diedCounterHolder = document.getElementById('died');
var scoreHolder = document.getElementById('score');
// Game Over and You Won messages and elements
var messageWon = document.getElementById('message-won');
messageWon.innerHTML = "YOU WON!";
var messageLost = document.getElementById('message-lost');
messageLost.innerHTML = "GAME OVER";
// Flag used to enable 'winning state'
var winningFlag = false;

// Incrememts or decrements the score and player lives count, then calls setHTMLscores
function scoring(score, loss) {
	player.score = player.score + score;
	player.died = player.died + loss;
	setHTMLscores();
}

// TODO: Use Canvas fillText for won/lost messages instead of innerHTML
// Dynamically set the score and player lives count using innerHTML
function setHTMLscores() {
	scoreHolder.innerHTML = player.score;
	diedCounterHolder.innerHTML = player.died;
}

// This 'resets' the player starting position on the board
function playerStartPos() {
	// TODO: use a function to generate random y positions
	player.x = (gameBoardWidth / 2) - (spriteWidth / 2);
	player.y = 386;
}

/* Displays a Game Over message on screen and resets score and player lives count.
 * Called only when the lives count is equal to 0. Temporarily 'disables' the movePlayer
 * listener.
 */
function gameLost() {
	messageLost.style.display = "block";
	player.score = 0;
	player.died = 3;
	setHTMLscores();
	document.removeEventListener('keyup', movePlayer, false);
	setTimeout(function() {
		playerStartPos();
		messageLost.style.display = "none";
		document.addEventListener('keyup', movePlayer, false);
	}, 1250);
}

/* Displays a You Won message on screen, increments the score, deactivates the movePlayer
 * listener, then player is reset to starting point and movePlayer listener is added.
 * Called when the player is rendered.
 */
function gameWon() {
	if (winningFlag === true) {
		scoring(5, 0);
		messageWon.style.display = "block";
		winningFlag = false;
		playerStartPos();
		document.removeEventListener('keyup', movePlayer, false);
		setTimeout(function() {
			messageWon.style.display = "none";
			document.addEventListener('keyup', movePlayer, false);
		}, 750);
	}
}

/* Handles collision detection with a range for the enemy and player x positions.
 * Function is called in the enemy update method.
 */
function rangeOfEnemyX(enemyX, playerX) {
	enemyX = enemyX + 50;
	if (enemyX > playerX && enemyX < playerX + 100) {
		scoring(-5, -1);
		playerStartPos();
	}
}

// Enemy Class
var Enemy = function(y) {
    this.x = Math.random() * (300 - 50) + 50;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
}

// This sets the enemy vehicle speed randomly.
Enemy.prototype.speed = function() {
  var speed = Math.random() * (600 - 50) + 50;
  return speed.toFixed();
}

// Uses the randomly generated speed to move the enemies across the game board
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed() * dt;
    if (this.x > 505) {
    	// Randomly generate a starting point after exiting the screen
    	this.x = Math.random() * (-300 + -100) + -100;
    }
    // Collision detection - first checks that y axis is equal, than calls rangeOfEnemyX
    if (this.y === player.y) {
			rangeOfEnemyX(this.x, player.x);
		}
		if (player.died === 0) {
			gameLost();
		}
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player Class
var Player = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = characterChoice;
	this.score = 0;
	this.died = 3;
}

Player.prototype.update = function() {
	// noop
}

Player.prototype.render = function() {
	/* Uses the characterChoice variable (initially defaulted to char-boy.png) to draw the
	 * sprite. If the user chooses another character, the characterChoice variable will update
	 * and so will the player rendering.
	 */
	ctx.drawImage(Resources.get(characterChoice), this.x, this.y);
	gameWon();
}

Player.prototype.handleInput = function(keyed) {
	/* The moveIt object stores the 'actions' (or key presses) instead of using an
	 * if/else or switch statement, and each function also handles if the player moves
	 * off screen.
	 */
	var moveIt = {
		up: function() {
			player.y = player.y - 83;
			if (player.y === -29) {
				// Set the flag variable to increment the score and pause the player before reset
				winningFlag = true;
				player.y = -9;
			} else if (player.y < -29) {
				player.y = -9;
			}
		},
		down: function() {
			player.y = player.y + 83;
			if (player.y > 386) {
				player.y = 386;
			}
		},
		left: function() {
			player.x = player.x - 101;
			if (player.x < 0) {
				player.x = 0;
			}
		},
		right: function() {
			player.x = player.x + 101;
			if (player.x > 404) {
				player.x = 404;
			}
		}
	}

	// Check if the moveIt object has a matching 'keyed' property. If so, call it.
	if (moveIt.hasOwnProperty(keyed)) {
		moveIt[keyed]();
	}
}

// Gem Class
var Gem = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = 'images/gem-blue.png';
}

Gem.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Gem.prototype.update = function() {
	/* TODO: timeout below could be used to display a Gem for only a set period of time
	 * setTimeout(function() {
	 * 	gem.x = -100;
	 * }, 3000);
	 *
	 * Run basic checks to see if player and gem are in same coordinates. If so, move the
	 * gem off screen, and incrememt the player score.
	 */
	if (player.y === this.y) {
		if (player.x === this.x) {
			scoring(5, 0);
			this.x = -100;
		}
	}
}

var gem = new Gem(303, 137);

// Heart Class
var Heart = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = 'images/Heart.png';
}

Heart.prototype.render = function() {
	if (player.died <= 1) {
		this.x = 101;
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

Heart.prototype.update = function() {
	/* Run basic checks to see if player and heart are in same coordinates. If so, move the
	 * heart off screen, and incrememt the player lives count back to 3.
	 */
	if (player.y === this.y) {
		if (player.x === this.x) {
			player.died = 3;
			this.x = -100;
		}
	}
}

// Instantiate the Key
var heart = new Heart(101, 54);

// Instantiate the Player
var player = new Player(202, 386);

// Instantiate the Enemies and add them to the allEnemies array
var allEnemies = [];
allEnemies[0] = new Enemy(54);
allEnemies[1] = new Enemy(137);
allEnemies[2] = new Enemy(220);
allEnemies[3] = new Enemy(137);


function movePlayer(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
}
document.addEventListener('keyup', movePlayer, false);

/* Let gamer choose their player
 * player.render function uses characterChoice variable to draw the character
 * The Player class sets the sprite property from the 'characterChoice' variable
 * Code for targeting clicked element (clickedItem) below was found online
 */
characters.addEventListener('click', function(e) {
	if (e.target !== e.currentTarget) {
		var clickedItem = e.target.getAttribute('src');
		characterChoice = clickedItem;
	}
	characterNameHolder.innerHTML = "Go Dodge some Bugs, " + characterName;
	playerStartPos();
});

// 'Hover' event to show characters name on mouseover
characters.addEventListener('mouseover', function(e) {
	if (e.target !== e.currentTarget) {
		characterName = e.target.getAttribute('alt');
		characterNameHolder.innerHTML = characterName;
	}
});
