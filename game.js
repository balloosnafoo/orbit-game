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
    this.dyingObjects = [];
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

      velocity[0] *= .1;
      velocity[1] *= .1;

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
    var dyingObjectArr = [];
    for (var i = 0; i < this.asteroids.length; i++) {
      for (var j = 0; j < this.allObjects().length; j++) {
        if (i === j) continue;
        if (this.asteroids[i].isCollidedWith(this.allObjects()[j])) {
          dyingObjectArr.push(i);
        }
      }
    }
    this.dyingObjects = this.separateObjects(dyingObjectArr);
  };

  // Finds all lost asteroids, makes new array excluding those and updates
  // this.asteroids. Ensures that game is not slowed by orphaned objects flying
  // into the depths of space.
  Game.prototype.deleteLostObjects = function () {
    var exclusionArr = [];
    for (var i = 0; i < this.asteroids.length; i++) {
      if (this.asteroids[i].pos[0] > (Game.DIM_X * 1.5) ||
          this.asteroids[i].pos[0] < 0 - (Game.DIM_X * .5) ||
          this.asteroids[i].pos[1] > (Game.DIM_Y * 1.5) ||
          this.asteroids[i].pos[1] < 0 - (Game.DIM_Y * .5)) {
        exclusionArr.push(i);
      }
    }
    this.separateObjects(exclusionArr);
  };

  Game.prototype.separateObjects = function (exclusionArr) {
    var remainingObjects = [];
    var otherObjects = [];
    for (var i = 0; i < this.asteroids.length; i++) {
      if (exclusionArr.indexOf(i) === -1){
        remainingObjects.push(this.asteroids[i]);
      } else {
        otherObjects.push(this.asteroids[i]);
      }
    }
    this.asteroids = remainingObjects.slice();
    return otherObjects;
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
