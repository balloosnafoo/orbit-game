(function () {

  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.color = options.color || MovingObject.COLOR;
    this.radius = options.radius || MovingObject.RADIUS;
    this.pullVectors = [];
  };

  MovingObject.RADIUS = 20;
  MovingObject.COLOR = "#fff";

  MovingObject.prototype.move = function () {
    // var vel = this.applyPullVectors();
    this.applyPullVectors();
    var newPos = [
      this.pos[0] + this.vel[0],
      this.pos[1] + this.vel[1]
    ];
    var diameter = this.radius * 2

    // This Logic assumes that the window is a square
    // I was also trying to avoid having things pop up already half way
    // on screen, but it doesn't seem to be working.
    for (var i = 0; i < newPos.length; i++) {
      if (newPos[i] + diameter < 0) {
        this.pos[i] = newPos[i] + Asteroids.Game.DIM_X + diameter;
      } else if (newPos[i] > Asteroids.Game.DIM_X + diameter) {
        // I think this is causing some modulo problems
        this.pos[i] = (newPos[i] % Asteroids.Game.DIM_X) - diameter;
      } else {
        this.pos[i] = newPos[i];
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

  MovingObject.prototype.applyPullVectors = function () {
    // var newVector = this.vel.slice();
    for (var i = 0; i < this.pullVectors.length; i++) {
      if (this.vel[0] < 7) {
        this.vel[0] += this.pullVectors[i][0];
      }
      if (this.vel[1] < 7) {
        this.vel[1] += this.pullVectors[i][1];
      }
    }
    this.pullVectors = [];
    // return newVector;
  };

})();
