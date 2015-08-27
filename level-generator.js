(function() {
  if (typeof Asteroids === "undefined"){
    window.Asteroids = {};
  }

  var LevelGenerator = Asteroids.LevelGenerator = function (options) {
    this.game = options.game
  }

  LevelGenerator.LEVEL_OBJECTS = {
    initial: [
      {objectType: "asteroid", pos: [870, 840], vel: [4, 0], image: "moon"},
      {objectType: "planet", pos: [850,465] , radius:154, planetType: 'earth'}
    ],

    level1: [
      {objectType: "planet", pos: [850,755], radius:92, planetType: 'red'},
      {objectType: "planet", pos: [850,135], radius:92, planetType: 'red'},
      {objectType: "planet", pos: [1040,285], radius:92, planetType: 'red'},
      {objectType: "planet", pos: [1040,600], radius:92, planetType: 'red'},
      {objectType: "planet", pos: [1330,655], radius:92, planetType: 'green'},
      {objectType: "zone", topLeft: [0, 0], bottomRight: [300, 900], zoneType: 'starting'}
    ],

    level2: [
      {objectType: "planet", pos: [860,465] , radius:156, planetType: 'red'},
      {objectType: "planet", pos: [1420,465] , radius:118, planetType: 'green'},
      {objectType: "zone", topLeft: [0, 0], bottomRight: [300, 900], zoneType: 'starting'}
    ],

    level3: [
      {objectType: "planet", pos: [150,835] , radius:84, planetType: 'purple'},
      {objectType: "planet", pos: [150,595] , radius:84, planetType: 'purple'},
      {objectType: "planet", pos: [150,355] , radius:84, planetType: 'purple'},
      {objectType: "planet", pos: [150,115] , radius:84, planetType: 'purple'},
      {objectType: "planet", pos: [710,475] , radius:84, planetType: 'red'},
      {objectType: "planet", pos: [920,475] , radius:84, planetType: 'red'},
      {objectType: "planet", pos: [1130,475] , radius:84, planetType: 'red'},
      {objectType: "planet", pos: [1340,475] , radius:84, planetType: 'red'},
      {objectType: "planet", pos: [1550,475] , radius:84, planetType: 'red'},
      {objectType: "planet", pos: [1550,265] , radius:84, planetType: 'green'},
      {objectType: "zone", topLeft: [1300, 560], bottomRight: [1700, 900], zoneType: 'starting'}
    ]
  };

  LevelGenerator.NEXT_LEVELS = {
    level1: "level2",
    level2: "level3",
    level3: "end"
  };

  LevelGenerator.prototype.generateLevel = function (levelName) {
    this.currentLevel = levelName;

    if (levelName === "end") { this.endGame(); }

    LevelGenerator.LEVEL_OBJECTS[levelName].forEach(function (object) {
      if (object.objectType === "asteroid") {
        this.game.objectFromOptions(object);
      } else if (object.objectType === "planet") {
        this.game.planetFromOptions(object);
      } else if (object.objectType === "zone") {
        this.game.zoneFromOptions(object);
      }
    }.bind(this));
  };

  LevelGenerator.prototype.nextLevel = function () {
    this.generateLevel(LevelGenerator.NEXT_LEVELS[this.currentLevel])
  };

  LevelGenerator.prototype.endGame = function () {
    $('body').append( $('#win-modal').html() );

    $(".m-background").click( function () {
      $('.m-background').remove();
      $('.m-content').remove();
    });
  };

})();
