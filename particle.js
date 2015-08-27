(function() {
  if (typeof Asteroids === "undefined"){
    window.Asteroids = {};
  }

  var Particle = Asteroids.Particle = function (options) {
    this.scale = 1.0;
    this.radius = options.radius;
    this.color = options.color;
    this.pos = options.pos;
    this.vel = options.vel;
    this.scaleSpeed = options.scaleSpeed;
  };

  Particle.prototype.move = function() {
    // shrinking
    this.scale -= this.scaleSpeed;

    if (this.scale <= 0) {
      this.scale = 0;
    }

    // moving away from explosion center
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  };

  Particle.prototype.draw = function(ctx) {
    // drawing a filled circle in the particle's local space
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1],
      this.radius * this.scale,
      0,
      Math.PI*2,
      true
    );
    ctx.fillStyle = this.color;
    ctx.fill();
  };
})();
