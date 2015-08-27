(function() {
  if (typeof Asteroids === "undefined"){
    window.Asteroids = {};
  }

  var LevelGenerator = Asteroids.LevelGenerator = function (options) {
    this.game = options.game
  }

  LevelGenerator.LEVEL_OBJECTS = {
    "initial": [
      {objectType: "asteroid", pos: [870, 840], vel: [4, 0], image: "moon"},
      {objectType: "planet", pos: [850,465] , radius:154, planetType: 'earth'}
    ]
  }

  LevelGenerator.prototype.generateLevel = function (levelName) {
    LevelGenerator.LEVEL_OBJECTS[levelName].forEach(function (object) {
      if (object.objectType === "asteroid") {
        this.game.objectFromOptions(object);
      } else if (object.objectType === "planet") {
        this.game.createPlanet(object);
      }
    }.bind(this));
  }

})();
