(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Cursor = Asteroids.Cursor = function (options) {
    this.pos = [
      Math.floor(Asteroids.Game.DIM_X / 2),
      Math.floor(Asteroids.Game.DIM_Y * .75)
    ];
    this.game = options.game;
    this.bindKeys();
  };

  Cursor.STEP_VECTORS = {
    "up":    [ 0,-5],
    "left":  [-5, 0],
    "down":  [ 0, 5],
    "right": [ 5, 0]
  }

  Cursor.prototype.move = function (dir) {
    this.pos[0] += Cursor.STEP_VECTORS[dir][0];
    this.pos[1] += Cursor.STEP_VECTORS[dir][1];
  };

  Cursor.prototype.bindKeys = function () {
    key('w', function(){ this.move("up"   ) }.bind(this));
    key('a', function(){ this.move("left" ) }.bind(this));
    key('s', function(){ this.move("down" ) }.bind(this));
    key('d', function(){ this.move("right") }.bind(this));

    key('enter', this.game.createObject.bind(this.game));
  };

  Cursor.prototype.draw = function (ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      this.pos[0],
      this.pos[1],
      3, //radius
      0,
      2 * Math.PI,
      true
    );
    ctx.fill();
  }

})();
