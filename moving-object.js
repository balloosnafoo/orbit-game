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
    this.applyPullVectors();
    this.pos[0] += this.vel[0],
    this.pos[1] += this.vel[1]
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
    for (var i = 0; i < this.pullVectors.length; i++) {
      if (this.vel[0] < 7) {
        this.vel[0] += this.pullVectors[i][0];
      }
      if (this.vel[1] < 7) {
        this.vel[1] += this.pullVectors[i][1];
      }
    }
    this.pullVectors = [];
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var distance = Asteroids.Util.distance(this.pos, otherObject.pos);
    return distance < this.radius + otherObject.radius;
  };

})();
