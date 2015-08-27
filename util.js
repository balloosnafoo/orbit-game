(function() {

  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  };

  var Util = Asteroids.Util = {};

  Util.inherits = function (ChildClass, ParentClass) {
    var Surrogate = function () {};
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate;
    ChildClass.constructor = ChildClass;
  };

  Util.randomVec = function (length) {
    var degree = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(degree), Math.cos(degree)], length);
  };

  Util.scale = function (vec, m) {
    return [vec[0] * m, vec[1] * m];
  };

  Util.distance = function (pos1, pos2) {
    return Math.sqrt(
      Math.pow((pos1[0] - pos2[0]), 2) +
      Math.pow((pos1[1] - pos2[1]), 2)
    );
  };

  Util.connectingVector = function (fromPos, toPos) {
    return [
      toPos[0] - fromPos[0],
      toPos[1] - fromPos[1]
    ];
  };

  Util.randomFloat = function (min, max) {
    return min + Math.random()*(max-min);
  };

})();
