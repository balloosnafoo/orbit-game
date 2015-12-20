# Orbit Game

I made this game because after asteroids I was curious about the possibility
of making a gravity mechanic. One of my favorite variants on asteroids is one
of the subgames on geometry wars, in which the sprites slowly gravitate towards
the player's ship.

Moons are created by clicking and dragging. The origin of the new object is
determined specified by the mousedown event and the speed and direction are
determined by the vector that connects the origin with the point of mouseup.

## Gravity

Gravity vectors are generated in the game by the following code:

```
var gravVec = Asteroids.Util.connectingVector(object.pos, otherObject.pos);
var distance = Asteroids.Util.distance(object.pos, otherObject.pos);
var otherObjectMass = (4 / 3) * Math.PI * Math.pow(otherObject.radius, 3);

var pull = .000001 * ( (otherObjectMass) / (distance * distance));
if (otherObject.antigravity) { pull *= -1; }
gravVec[0] *= pull;
gravVec[1] *= pull;
object.receivePull(gravVec)
```

This is applied to each object in relation to each other object in the space.
Therefore it is affected by the spherical volume of both bodies, and their
distance from one another, and it follows the law of inverse squares.

## Game Modes

### Earth Mode

There is a single planet and a moon already in orbit. The intention is that
users will check out this map and get a feel for the game mechanics.

### Level Mode

This presents players with a series of levels in which the current goal is to
throw a moon from the starting area and collide with the green planet. Obstacles
are red planets, which behave normally, and purple planets, which have
antigravity fields (accomplished by simply negating both parts of the gravity
vector).

### Sandbox Mode

This allows users to create levels using red, green, purple, and earth planets.
One of my goals here is to set up something so that users can save the levels
that they've created and make them available to anyone who plays the game.
Currently, the / key logs the planets information to the console, and invites
the user to send me the output.

### Multiplayer Mode (Under Development)

[Live Demo](https://orbit-multi.herokuapp.com/)

Multiplayer game built from this code base deployed on Heroku using node/express
as a backend and socket.io to allow players to create objects in the same space.
Check out the [repo](https://github.com/balloosnafoo/orbit-multi) for more info.

## Other features

References to objects that reach a certain distance from the edge of the canvas
are deleted in order to prevent the browser from getting bogged down by needing
to move irrelevant objects. Particles are also deleted when they reach a radius
of zero.
