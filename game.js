(function() {
  if (typeof Asteroids === "undefined"){
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function () {
    this.asteroids = []; // this.addAsteroids();
    this.planet = new Asteroids.Planet({
      pos: [Math.floor(Game.DIM_X / 2), Math.floor(Game.DIM_Y / 2)]
    });
    this.cursor = new Asteroids.Cursor({game: this});
    this.createPos = null;
  }

  Game.DIM_X = 750;
  Game.DIM_Y = 750;
  Game.NUM_ASTEROIDS = 10;
  Game.BG_COLOR = "#000000";

  Game.prototype.addAsteroids = function () {
    var asteroids = [];
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      asteroids.push(new Asteroids.Asteroid({
        pos: this.randomPosition()
      }));
    }
    return asteroids;
  };

  Game.prototype.createObject = function () {
    if (!this.createPos) {
      this.createPos = this.cursor.pos.slice();
    } else {
      var velocity = Asteroids.Util.connectingVector(
        this.createPos,
        this.cursor.pos
      );

      velocity[0] *= .01;
      velocity[1] *= .01;

      var newAsteroid = new Asteroids.Asteroid({
        pos: this.createPos,
        vel: velocity
      });
      this.createPos = null;
      this.asteroids.push(newAsteroid);
    }
  };

  Game.prototype.allObjects = function () {
    return this.asteroids.concat(
      [this.planet]
    );
  };

  Game.prototype.moveObjects = function () {
    var objects = this.allObjects();
    for (var i = 0; i < objects.length; i++) {
      this.calculateGravity(objects[i]);
      objects[i].move();
    }
  };

  // UNFINISHED, UNINTEGRATED
  Game.prototype.checkCollisions = function () {
    for (var i = 0; i < this.asteroids.length; i++) {
      for (var j = 0; j < this.allObjects().length; j++) {
        if (i === j) continue;
        if (this.asteroids[i].isCollidedWith(this.allObjects()[j])) {
          // alert("collision!");
        }
      }
    }
  };

  Game.prototype.randomPosition = function () {
    return [
      (Math.random() * Game.DIM_X),
      (Math.random() * Game.DIM_Y)
    ];
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });

    this.cursor.draw(ctx);
  };

  Game.prototype.calculateGravity = function (object) {
    var gravVec = Asteroids.Util.connectingVector(object.pos, this.planet.pos);
    var distance = Asteroids.Util.distance(object.pos, this.planet.pos);
    gravVec[0] *= .001 - (distance * .000001);
    gravVec[1] *= .001 - (distance * .000001);
    object.receivePull(gravVec)
  };

})();
