(function () {

  if (Asteroids typeof === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.color = options.color || MovingObject.COLOR;
    this.radius = options.radius || MovingObject.RADIUS;
  };

  MovingObject.RADIUS = 10;
  MovingObject.COLOR = "black";

  MovingObject.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  };

  MovingObject.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.centerX,
      this.centerY,
      this.radius,
      0,
      2 * Math.PI,
      false
    );
  };

})();
