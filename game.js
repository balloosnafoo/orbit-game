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
    this.objectSize = 10;
    this.planets = [
      // new Asteroids.Planet({
      //   pos: [Math.floor(this.width / 2), Math.floor(this.height / 2)],
      //   image: this.images.earth
      // })
    ];
    this.cursor = new Asteroids.Cursor({game: this});
    this.createPos = null;
    this.dyingObjects = [];

    this.levelGenerator = new Asteroids.LevelGenerator({game: this});
    this.levelGenerator.generateLevel("initial");
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

      velocity[0] *= .025;
      velocity[1] *= .025;

      var newAsteroid = new Asteroids.Asteroid({
        pos: this.createPos,
        vel: velocity,
        image: this.images.moon,
        radius: this.objectSize
      });
      this.createPos = null;
      this.asteroids.push(newAsteroid);
    }
  };

  Game.prototype.objectFromOptions = function (options) {
    options.image = this.images.moon;
    this.asteroids.push(new Asteroids.Asteroid(options));
  };

  Game.prototype.createPlanet = function (options) {
    options.pos = options.pos || [this.cursor.pos[0], this.cursor.pos[1]];
    options.radius = options.radius || this.objectSize * 2;
    options.antigravity = options.antigravity || false;
    this.planets.push(
      new Asteroids.Planet({
        pos: options.pos,
        radius: options.radius,
        image: this.images[options.planetType],
        antigravity: options.antigravity
      })
    )
  }

  Game.prototype.allObjects = function () {
    return this.asteroids.concat( this.planets );
  };

  Game.prototype.moveObjects = function () {
    var objects = this.allObjects();
    for (var i = 0; i < objects.length; i++) {
      for (var j = 0; j < objects.length; j++) {
        if (i !== j) {
          this.calculateGravity(objects[i], objects[j]);
        }
      }
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
          this.asteroids[i].pos[1] > (this.height * 2) ||
          this.asteroids[i].pos[1] < 0 - (this.height * 2)) {
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

  Game.prototype.calculateGravity = function (object, otherObject) {
    var gravVec = Asteroids.Util.connectingVector(object.pos, otherObject.pos);
    var distance = Asteroids.Util.distance(object.pos, otherObject.pos);

    var objectMass      = (4 / 3) * Math.PI * Math.pow(object.radius, 3);
    var otherObjectMass = (4 / 3) * Math.PI * Math.pow(otherObject.radius, 3);

    var pull = .000001 * ( (otherObjectMass) / (distance * distance));
    if (otherObject.antigravity) { pull *= -1; }
    gravVec[0] *= pull;
    gravVec[1] *= pull;
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
  };

  Game.prototype.exportPlanetInfo = function () {
    this.planets.forEach( function (planet) {
      console.log("{ pos: [" + planet.pos + "] , radius:" + planet.radius + ", image: IMAGES['" + planet.image.id + "']},\n");
    });
  };

})();
