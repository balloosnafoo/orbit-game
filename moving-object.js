(function () {

  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.color = options.color || MovingObject.COLOR;
    this.radius = options.radius || MovingObject.RADIUS;
  };

  MovingObject.RADIUS = 10;
  MovingObject.COLOR = "#fff";

  MovingObject.prototype.move = function () {
    this.pos[0] = Math.abs((this.pos[0] += this.vel[0]) % Asteroids.Game.DIM_X);
    this.pos[1] = Math.abs((this.pos[1] += this.vel[1]) % Asteroids.Game.DIM_Y);
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      true
    );
    ctx.fill();
  };

})();
