(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function (options) {
    this.game = options.game;
    this.ctx = options.ctx;
    this.images = options.images;
    this.start();
  };

  GameView.prototype.start = function () {
    setInterval(
      function(){
        this.game.moveObjects();
        this.game.checkCollisions();
        this.game.deleteLostObjects();
        this.game.deleteLostParticles();
        this.game.draw(this.ctx);

        // var scoreInfo = this.game.getScoreInfo();
        // this.updateScoreboard(scoreInfo);
      }.bind(this),
      20
    );
  };

  // GameView.prototype.updateScoreboard = function (scoreInfo) {
  //   this.scoreboard.html("");
  //   for (var i = 0; i < scoreInfo.length; i++) {
  //     var showStability = scoreInfo[i].rotations > 10 ? " (stable)" : ""
  //     this.scoreboard.append(
  //       "<li>Asteroid #" + scoreInfo[i].id + ": " + scoreInfo[i].rotations + showStability + "</li>"
  //     );
  //   }
  // };
})();
