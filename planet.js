(function(){
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Planet = Asteroids.Planet = function (options) {
    options.color = options.color || "green";
    options.vel = [0, 0];
    options.radius = options.radius || 70;
    options.antigravity = options.antigravity ? true : false;
    Asteroids.MovingObject.call(this, options);
  }

  Asteroids.Util.inherits(Planet, Asteroids.MovingObject);

  // Dummy function because planets don't gravitate in this game
  // consider changing planet to not inherit from MovingObject
  // (since planets aren't actually moving objects in this).
  Planet.prototype.receivePull = function () {};

})();
