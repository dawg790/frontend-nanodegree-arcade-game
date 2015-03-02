var gameBoardHeight = 606;
var gameBoardWidth = 505;
var diedCounterHolder = document.getElementById('died');
var scoreHolder = document.getElementById('score');
var messageWon = document.getElementById('message-won');
var messageLost = document.getElementById('message-lost');
var winningFlag = false;


// TODO: Set HTML elements dynamically for the Won/Lost messages
// TODO: Use proper multi line comment formatting

function scoring(score, loss) {
	player.score = player.score + score;
	player.died = player.died + loss;
	setHTMLscores();
}

function setHTMLscores() {
	scoreHolder.innerHTML = player.score;
	diedCounterHolder.innerHTML = player.died;
}

function playerStartPos() {
	player.x = 202;
	player.y = 386;
}

// Called in the click event for the Character Choice. Moves the player back to the start position
function gameLost() {
	messageLost.style.display = "block";
	player.score = 0;
	player.died = 3;
	setHTMLscores();
	setTimeout(function() {
		startingPosition();
		messageLost.style.display = "none";
	}, 1250);
}

// Player reaches water, message is displayed, score is incremented and player is reset to starting point
function gameWon() {
	if (winningFlag === true) {
		scoring(5, 0);
		messageWon.style.display = "block";
		winningFlag = false;
		setTimeout(function() {
			playerStartPos();
			messageWon.style.display = "none";
		}, 750);
	}
}

// Handles collision detection with a range for the enemy and player called in the enemy update method
function rangeOfEnemyX(enemyX, playerX) {
	enemyX = enemyX + 50;
	if (enemyX > playerX && enemyX < playerX + 100) {
		scoring(-5, -1);
		playerStartPos();
	}
}

var Enemy = function(y) {
    this.x = Math.random() * (300 - 50) + 50;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
}

// Sets the speed randomly using a prototype method
Enemy.prototype.speed = function() {
  var speed = Math.random() * (600 - 50) + 50;
  return speed.toFixed();
}

// Uses the randomly generated speed to move the enemies
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed() * dt;
    if (this.x > 505) {
    	this.x = Math.random() * (-300 + -100) + -100; // Randomly generate a starting point after exiting the screen
    }
    // Collision detection
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

var Player = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = spriteChoice;
	this.score = 0;
	this.died = 3;
}

Player.prototype.update = function() {
	this.x = this.x;
	this.y = this.y;
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(spriteChoice), this.x, this.y);
	gameWon();
}

Player.prototype.handleInput = function(keyed) {
	// Checks key code and moves the Player using update() accordingly
	// Used an object to store the 'actions' instead of using an else/if or switch
	var moveIt = {
		up: function() {
			player.y = player.y - 83;
			if (player.y === -29) {
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

	if (moveIt.hasOwnProperty(keyed)) {
		moveIt[keyed]();
	}

	// TODO: Someway to clean this up...Switch Statement?
	// Keeps the player on the screen, doesn't allow it to move off screen

	// if (player.y > 386) {
	// 	player.y = 386;
	// } else if (player.y === -29) {
	// 	winningFlag = true; // The player reached the top of the screen
	// 	player.y = -9;
	// }	else if (player.y < -29) {
	// 	player.y = -9;
	// } else if (player.x < 0) {
	// 	player.x = 0;
	// } else if (player.x > 404) {
	// 	player.x = 404;
	// }
}

// Creating a Gem SuperClass
var Gem = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = 'images/gem-orange.png';
}

Gem.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


var player = new Player(202, 386);

var allEnemies = [];
allEnemies[0] = new Enemy(54);
allEnemies[1] = new Enemy(137);
allEnemies[2] = new Enemy(220);
allEnemies[3] = new Enemy(137);

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
    console.log("Player x is: " + player.y);
});




// Added functionality to let gamer choose his player
// I edited the render function to draw the 'choice' variable from below
// I edited the Player class to pull the sprite property from the 'choice' variable
// Code for event listeners below found online

var characters = document.getElementById('sprites');
var spriteChoice = "images/char-boy.png";
var spriteNameHolder = document.getElementById('spriteName');
spriteNameHolder.innerHTML = "Choose a player above";

var spriteName;
// Click event for user to choose his/her character
characters.addEventListener('click', function(e) {
	if (e.target !== e.currentTarget) {
		var clickedItem = e.target.getAttribute('src');
		spriteChoice = clickedItem;
	}
	spriteNameHolder.innerHTML = "Go Dodge some Frogs, " + spriteName;
	playerStartPos();
});

// 'Hover' event to show characters name on mouseover
characters.addEventListener('mouseover', function(e) {
	if (e.target !== e.currentTarget) {
		spriteName = e.target.getAttribute('alt');
		spriteNameHolder.innerHTML = spriteName;
	}
});
