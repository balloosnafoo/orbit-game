(function() {
  if (typeof Asteroids === "undefined"){
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function () {
    this.asteroids = this.addAsteroids();
    this.planet = new Asteroids.Planet({
      pos: [Math.floor(Game.DIM_X / 2), Math.floor(Game.DIM_Y / 2)]
    });
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

  Game.prototype.allObjects = function () {
    return this.asteroids.concat(
      [this.planet]
    );
  }

  Game.prototype.moveObjects = function () {
    var objects = this.allObjects();
    for (var i = 0; i < objects.length; i++) {
      this.calculateGravity(objects[i]);
      objects[i].move();
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
  }

  Game.prototype.calculateGravity = function (object) {
    var gravVec = Asteroids.Util.connectingVector(object.pos, this.planet.pos);
    var distance = Asteroids.Util.distance(object.pos, this.planet.pos);
    gravVec[0] *= .001 - (distance * .000001);
    gravVec[1] *= .001 - (distance * .000001);
    object.receivePull(gravVec)
  };

})();
