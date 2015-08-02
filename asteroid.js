(function() {
  if (Asteroids typeof === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (options) {
    options.pos = options.pos || options.game.randomPosition();
    options.vel = options.vel || Asteroids.Util.randomVec();
    options.color = options.color || Asteroid.COLOR;
    options.radius = options.radius || Asteroid.RADIUS;

    Asteroids.MovingObject.call(this, options);
  };

  Asteroid.COLOR = "black";
  Asteroid.RADIUS = 10;

})();
