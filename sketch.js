var micro;
      function setup() {
        micro = new p5.AudioIn();
        micro.start();
        draw();
      }
      function draw() {
        var vol = micro.getLevel();
        console.log(vol);
      }