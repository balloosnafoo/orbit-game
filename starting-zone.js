(function() {
  if (typeof Asteroids === "undefined"){
    window.Asteroids = {};
  }

  var StartingZone = Asteroids.StartingZone = function (options) {
    this.topLeft = options.topLeft;
    this.bottomRight = options.bottomRight;
  };

  StartingZone.prototype.draw = function (ctx) {
    ctx.fillStyle = "rgba(92, 204, 57, 0.2)";
    ctx.fillRect(
      this.topLeft[0],
      this.topLeft[1],
      this.bottomRight[0],
      this.bottomRight[1]
    );
  }

})();
