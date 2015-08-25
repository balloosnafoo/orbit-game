(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function (game, ctx, scoreboard) {
    this.game = game;
    this.ctx = ctx;
    this.start();
    this.scoreboard = scoreboard;
  };

  GameView.prototype.start = function () {
    setInterval(
      function(){
        this.game.moveObjects();
        this.game.checkCollisions();
        this.game.deleteLostObjects();
        this.game.draw(this.ctx);

        var scoreInfo = this.game.getScoreInfo();
        this.updateScoreboard(scoreInfo);
      }.bind(this),
      20
    );
  };

  GameView.prototype.updateScoreboard = function (scoreInfo) {
    this.scoreboard.html("");
    for (var i = 0; i < scoreInfo.length; i++) {
      this.scoreboard.append(
        "<li>Asteroid #" + scoreInfo[i].id + ": " + scoreInfo[i].rotations
      );
    }
  };
})();
