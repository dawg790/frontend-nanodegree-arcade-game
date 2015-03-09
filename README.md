frontend-nanodegree-arcade-game
===============================

Students should use this rubric: https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797

for self-checking their submission.


Instructions for playing the game:
- Open Index.html in your browser and have fun!
- Move the player with the up, down, left, right arrow keys
- Do not get hit by the bugs - you only get 3 lives to begin with. The game is over if you lose all 3 lives.
- Reach the water to gain points.
- User can select Game Characters to play with.
- There is some very basic Gem collection and heart collection (to increase lives if <= 1)

NOTE: The Rock and Key items have not been added to the game yet. And the Gem and Heart usage is very basic at this stage.

Additional notes
1: The Enemy bugs had to be instantiated from the Enemy class and added to the allEnemies array.
2: The Player Class had to be created and the player instantiated.
3: The player instance had to be rendered on the canvas.

Steps taken to play the game:
1: Code added to keep the player on the screen, and not allow user to move 'off' screen
2: The enemy bugs are moved off screen and then reset to give illusion of constantly moving across the screen
3: Collision detection put in place based on x and y coordinates of enemy and player.
4: If collision, than the gameLost function is run and a life is subtracted from the lives left and score is detracted.
5: If the player reaches water, than the score is increased
6: Player is able to choose a new player from the different characters.
