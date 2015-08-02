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

  MovingObject.RADIUS = 20;
  MovingObject.COLOR = "#fff";

  MovingObject.prototype.move = function () {
    var newPos = [
      this.pos[0] + this.vel[0],
      this.pos[1] + this.vel[1]
    ];

    // This Logic assumes that the window is a square
    for (var i = 0; i < newPos.length; i++) {
      if (newPos[i] < 0) {
        this.pos[i] = newPos[i] + Asteroids.Game.DIM_X;
      } else {
        this.pos[i] = newPos[i] % Asteroids.Game.DIM_X;
      }
    };
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
