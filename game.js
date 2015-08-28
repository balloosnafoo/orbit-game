(function() {
  if (typeof Asteroids === "undefined"){
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function (options) {
    this.images = options.images;
    this.width = options.width;
    this.height = options.height;
    this.images = options.images;
    this.objectSize = 30;
    this.asteroids = []; // this.addAsteroids();
    this.planets = [];
    this.particles = [];
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
      if (this.startingZone) {
        if (
          this.cursor.pos[0] < this.startingZone.topLeft[0] ||
          this.cursor.pos[0] > this.startingZone.bottomRight[0] ||
          this.cursor.pos[1] < this.startingZone.topLeft[1] ||
          this.cursor.pos[1] > this.startingZone.bottomRight[1]
        ) { return; }
      }
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
    debugger;
    if (!options.alreadyScaled) {
      options.image = this.images.moon;
      var x = this.width * (options.pos[0] / 1700);
      var y = this.height * (options.pos[1] / 900);
      var velX = this.width * (options.vel[0] / 1700);
      var velY = this.height * (options.vel[1] / 900);
      var radius = this.width * (options.radius / 1700);

      options.pos = [x, y];
      options.vel = [velX, velY];
      options.radius = radius;
      options.alreadyScaled = true;
    }

    this.asteroids.push(new Asteroids.Asteroid(options));
  };

  Game.prototype.objectFromClick = function (pos) {
    var velocity = Asteroids.Util.connectingVector(
      this.clickOrigin,
      pos
    );

    velocity[0] *= .025;
    velocity[1] *= .025;

    var newAsteroid = new Asteroids.Asteroid({
      pos: this.clickOrigin,
      vel: velocity,
      image: this.images.moon,
      radius: this.objectSize
    });

    this.asteroids.push(newAsteroid);
  };

  Game.prototype.setObjectOrigin = function (pos) {
    this.clickOrigin = pos;
  }

  Game.prototype.createPlanet = function (options) {
    // Reject any planets made in game or earth mode
    if (!this.sandbox) { return; }

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
    );
  };

  Game.prototype.planetFromOptions = function (options) {
    if (!options.alreadyScaled) {
      var x = this.width * (options.pos[0] / 1700);
      var y = this.height * (options.pos[1] / 900);
      options.pos = [x, y];

      options.radius = this.width * (options.radius / 1700);
      options.alreadyScaled = true;
    }

    this.planets.push(
      new Asteroids.Planet({
        pos: options.pos,
        radius: options.radius,
        image: this.images[options.planetType],
        antigravity: options.antigravity
      })
    );
  };

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

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].move();
    }
  };

  Game.prototype.checkCollisions = function () {
    var dyingObjectArr = [];
    var beatLevel = false;
    for (var i = 0; i < this.asteroids.length; i++) {
      for (var j = 0; j < this.allObjects().length; j++) {
        if (i === j) continue;
        if (this.asteroids[i].isCollidedWith(this.allObjects()[j])) {
          if (this.allObjects()[j].image.id === "green" && !this.sandbox){
            beatLevel = true;
          }
          dyingObjectArr.push(i);
          this.createExplosion(this.asteroids[i], this.allObjects()[j]);
        }
      }
    }
    this.dyingObjects = this.separateObjects(dyingObjectArr, "asteroids");
    if (beatLevel) { this.nextLevel(); }
  };

  Game.prototype.nextLevel = function () {
    this.removeAll();
    this.levelGenerator.nextLevel();
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
    this.separateObjects(exclusionArr, "asteroids");
  };

  Game.prototype.deleteLostParticles = function () {
    var exclusionArr = [];
    for (var i = 0; i < this.particles.length; i++) {
      if (this.particles[i].scale <= 0) {
        exclusionArr.push(i)
      }
    }

    this.separateObjects(exclusionArr, "particles");
  };

  // Helper method used for deleting orphaned and post-collision objects.
  Game.prototype.separateObjects = function (exclusionArr, type) {
    var remainingObjects = [];
    var otherObjects = [];
    var arr = type === "asteroids" ? this.asteroids : this.particles;
    for (var i = 0; i < arr.length; i++) {
      if (exclusionArr.indexOf(i) === -1){
        remainingObjects.push(arr[i]);
      } else {
        otherObjects.push(arr[i]);
      }
    }
    if (type === "asteroids") {
      this.asteroids = remainingObjects.slice();
    } else if (type === "particles") {
      this.particles = remainingObjects.slice();
    }
    return otherObjects;
  };

  Game.prototype.randomPosition = function () {
    return [
      (Math.random() * this.width),
      (Math.random() * this.height)
    ];
  };

  Game.prototype.draw = function (ctx) {
    // Draws the background
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draws the starting zone
    if (this.startingZone) {
      this.startingZone.draw(ctx);
    }

    // Draws the planets and moons
    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });

    this.particles.forEach(function (object) { object.draw (ctx); });

    // Draws the cursor
    this.cursor.draw(ctx);
  };

  Game.prototype.calculateGravity = function (object, otherObject) {
    var gravVec = Asteroids.Util.connectingVector(object.pos, otherObject.pos);
    var distance = Asteroids.Util.distance(object.pos, otherObject.pos);
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

  Game.prototype.zoneFromOptions = function (options) {
    this.startingZone = new Asteroids.StartingZone({
      topLeft: options.topLeft,
      bottomRight: options.bottomRight
    });
  };

  Game.prototype.exportPlanetInfo = function () {
    this.planets.forEach( function (planet) {
      console.log("{objectType: planet, pos: [" + planet.pos + "] , radius:" + planet.radius + ", planetType: '" + planet.image.id + "'},\n");
    });
  };

  Game.prototype.removeAll = function () {
    this.startingZone = false;
    this.asteroids = [];
    this.planets = [];
  };

  // Game.prototype.createExplosion = function (x, y, color, object1, object2) {
  Game.prototype.createExplosion = function (object, otherObject) {
    var minSize = 10;
    var maxSize = object.radius;
    var count = 10;
    var minSpeed = 1.0;
    var maxSpeed = 5.0;
    var minScaleSpeed = .01;
    var maxScaleSpeed = .05;
    var maybeReflectionX = object.radius > (otherObject.radius / 3) ? 1 : -.2;
    var maybeReflectionY = object.radius > (otherObject.radius / 3) ? 1 : -.2;
    if (Math.abs(object.vel[0]) > Math.abs(object.vel[1])) {
      maybeReflectionX = 1;
    } else {
      maybeReflectionY = 1;
    }

    var x1 = object.pos[0] + object.vel[0];
    var y1 = object.pos[1] + object.vel[1];
    var vectorLength = Asteroids.Util.distance(object.pos, [x1, y1]);
    var toOtherObject = Asteroids.Util.distance(object.pos, otherObject.pos);
    debugger
    var angle = Math.acos(
      (x1*otherObject.pos[0])+(y1*otherObject.pos[1]) /
      (vectorLength * toOtherObject)
    );
    console.log(angle);

    for (var angle=0; angle<360; angle += Math.round(360/count)) {
      var radius = Asteroids.Util.randomFloat(minSize, maxSize);
      var speed = Asteroids.Util.randomFloat(minSpeed, maxSpeed);
      var velX = speed * Math.cos(angle * Math.PI / 180.0);
      var velY = speed * Math.sin(angle * Math.PI / 180.0);
      var color = Math.random() > .5 ? "rgb(184, 39, 19)" : "rgb(205, 116, 29)"

      if (Math.random() > -1) {
        // 70% chance of being a particle
        var particle = new Asteroids.Particle({
          color: color,
          pos: [object.pos[0], object.pos[1]],
          scaleSpeed: Asteroids.Util.randomFloat(minScaleSpeed, maxScaleSpeed),
          vel: [
            velX + (object.vel[0] * maybeReflectionX),
            velY + (object.vel[1] * maybeReflectionY)
          ],
          radius: radius
        });

        this.particles.push(particle);
      } else {
        // 30% chance it makes a new, smaller asteroid
        var asteroid = new Asteroids.Asteroid({
          pos: object.pos,
          vel: [velX, velY],
          image: this.images.moon
        });

        this.asteroids.push(asteroid);
      }
    }
  };

})();
