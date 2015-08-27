(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Cursor = Asteroids.Cursor = function (options) {
    this.pos = [
      Math.floor(options.game.width / 2),
      Math.floor(options.game.height * .75)
    ];
    this.game = options.game;
    this.editing = true;
    this.bindKeys();
    this.stepSpeed = 1;
  };

  Cursor.STEP_VECTORS = {
    "up":    [ 0,-10],
    "left":  [-10, 0],
    "down":  [ 0, 10],
    "right": [ 10, 0]
  }

  Cursor.prototype.move = function (dir) {
    this.pos[0] += Cursor.STEP_VECTORS[dir][0] * this.stepSpeed;
    this.pos[1] += Cursor.STEP_VECTORS[dir][1] * this.stepSpeed;
  };

  Cursor.prototype.resizeObject = function (change) {
    if (change === "sizeUp") {
      this.game.objectSize += 1;
    } else {
      this.game.objectSize -= 1;
    }
  };

  Cursor.prototype.shiftSpeed = function (dir) {
    if ( dir === "up" ) {
      this.stepSpeed += 1;
    } else {
      this.stepSpeed -= 1;
    }
  }

  Cursor.prototype.bindKeys = function () {
    // Cursor movement keys
    key('w', function(){ this.move("up"   ) }.bind(this));
    key('a', function(){ this.move("left" ) }.bind(this));
    key('s', function(){ this.move("down" ) }.bind(this));
    key('d', function(){ this.move("right") }.bind(this));
    key('c', function(){ this.shiftSpeed("up")   }.bind(this));
    key('v', function(){ this.shiftSpeed("down") }.bind(this));

    if (this.editing) {
      // Enlarge and shrink objects
      key(']', function(){ this.resizeObject("sizeUp")   }.bind(this));
      key('[', function(){ this.resizeObject("sizeDown") }.bind(this));

      // Moon and Planet creation keys
      key('enter', this.game.createObject.bind(this.game));
      key('p', function() { this.game.createPlanet({planetType: "earth",  antigravity: false}) }.bind(this));
      key('o', function() { this.game.createPlanet({planetType: "green",  antigravity: false}) }.bind(this));
      key('i', function() { this.game.createPlanet({planetType: "red",    antigravity: false}) }.bind(this));
      key('u', function() { this.game.createPlanet({planetType: "purple", antigravity: true }) }.bind(this));
      key('k', function() { this.game.removeAll() }.bind(this));

      // Export key, used for level creation
      key('/',     this.game.exportPlanetInfo.bind(this.game));
    }
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
