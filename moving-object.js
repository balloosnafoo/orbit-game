(function () {

  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.color = options.color || MovingObject.COLOR;
    this.image = options.image;
    this.radius = options.radius || MovingObject.RADIUS;
    this.pullVectors = [];
    this.antigravity = options.antigravity || false

    this.rotations = 0;
    this.startingQuadrant = this.currentQuadrant();
    this.leftStartingQuadrant = false;
  };

  MovingObject.RADIUS = 20;
  MovingObject.COLOR = "#fff";

  MovingObject.prototype.move = function () {
    this.applyPullVectors();
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.incrementRotations();
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.height,
      this.image.height,
      this.pos[0] - this.radius,
      this.pos[1] - this.radius,
      this.radius * 2,
      this.radius * 2
    );
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

  MovingObject.prototype.currentQuadrant = function () {
    if (this.pos[0] < 375) {
      if (this.pos[1] < 375) {
        return 2;
      } else {
        return 3;
      }
    } else {
      if (this.pos[1] < 375) {
        return 1;
      } else {
        return 4;
      }
    }
  };

  MovingObject.prototype.incrementRotations = function () {
    if (
      this.currentQuadrant() === this.startingQuadrant &&
      this.leftStartingQuadrant
    ) {
      this.rotations += 1;
      this.leftStartingQuadrant = false;
    } else if (this.currentQuadrant() !== this.startingQuadrant) {
      this.leftStartingQuadrant = true;
    }
  };

})();
