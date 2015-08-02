(function() {
  if (Asteroids typeof === "undefined"){
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function (dim_x, dim_y) {
    this.DIM_X = dim_x;
    this.DIM_Y = dim_y;
    this.asteroids = this.addAsteroids();
    this.objects = this.asteroids.concat([]); //later the ship should go in the concat
  }

  Game.NUM_ASTEROIDS = 10;
  Game.BG_COLOR = "white";

  Game.addAsteroids = function () {
    var asteroids = [];
    for (var i = 0; i < Game.NUM_ASTEROIDS.length; i++) {
      asteroids.push(new Asteriods.Asteroid([]{
        pos: Game.randomPosition();
      }));
    }
    return asteroids;
  };

  Game.moveObjects = function () {
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i]
    }
  };

  Game.randomPosition = function () {
    return [
      Math.random() * Game.DIM_X;
      Math.random() * Game.DIM_y;
    ];
  };

  Game.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
  }

})();
