(function() {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (options) {
    options.pos = options.pos || options.game.randomPosition();
    options.vel = options.vel || Asteroids.Util.randomVec(5);
    options.color = options.color || Asteroid.COLOR;
    options.radius = options.radius || Asteroid.randomSize();

    Asteroids.MovingObject.call(this, options);
  };

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.COLOR = "#fff";

  Asteroid.randomSize = function () {
    return Math.floor( ((Math.random() * 4) + 2) * 10 );
  }

})();
