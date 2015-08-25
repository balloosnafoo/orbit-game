(function() {
  if (typeof Asteroids === "undefined"){
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function (options) {
    this.images = options.images;
    this.asteroids = []; // this.addAsteroids();
    this.width = options.width;
    this.height = options.height;
    this.images = options.images;
    this.planet = new Asteroids.Planet({
      pos: [Math.floor(this.width / 2), Math.floor(this.height / 2)],
      image: this.images.earth
    });
    this.cursor = new Asteroids.Cursor({game: this});
    this.createPos = null;
    this.dyingObjects = [];
  }

  // Game.DIM_X = 750;
  // Game.DIM_Y = 750;
  Game.BG_COLOR = "#000000";

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
        vel: velocity,
        image: this.images.moon
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
      if (this.asteroids[i].pos[0] > (this.width * 2) ||
          this.asteroids[i].pos[0] < 0 - (this.width * 2) ||
          this.asteroids[i].pos[1] > (this.height) ||
          this.asteroids[i].pos[1] < 0 - (this.height)) {
        exclusionArr.push(i);
      }
    }
    this.separateObjects(exclusionArr);
  };

  // Helper method used for deleting orphaned and post-collision objects.
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
      (Math.random() * this.width),
      (Math.random() * this.height)
    ];
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, this.width, this.height);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });

    this.cursor.draw(ctx);
  };

  Game.prototype.calculateGravity = function (object) {
    var gravVec = Asteroids.Util.connectingVector(object.pos, this.planet.pos);
    var distance = Asteroids.Util.distance(object.pos, this.planet.pos);
    gravVec[0] *= 3 * ( 1 / (distance * distance));
    gravVec[1] *= 3 * ( 1 / (distance * distance));
    object.receivePull(gravVec)
  };

  Game.prototype.getScoreInfo = function () {
    var info = [];
    for (var i = 0; i < this.asteroids.length; i++) {
      info = info.concat({
        id: i,
        rotations: this.asteroids[i].rotations
      });
    }
    return info;
  }

})();
