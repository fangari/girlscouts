var storyAnimation = {
  storyId: '',
  dep: new Tracker.Dependency(),
  get: function() {
    this.dep.depend();
    return Stories.findOne({_id: this.storyId});
  },
  set: function(selectedStoryId) {
    this.storyId = selectedStoryId;
    this.dep.changed();
  }
};

Template.story.helpers({
  story: function() {
    return storyAnimation.get();
  }
});

Template.story.rendered = function() {

  var callToActionAnimationId;
  var storiesQueue = new buckets.Queue();

  Stories.find().observeChanges({
    changed: function(id, fields) {
      storiesQueue.add(id);
    }
  });

  /*
   * Flip card Animation
   */
  var flipit = function(card) {
    card.children('.faces').toggleClass('flipped');
  };

  var animateStory = function(window, time) {
    var $card = $(".story-card");
    $card.fadeIn(2000);
    Meteor.setTimeout(function() {
      flipit($card);
    }, 3000);
    Meteor.setTimeout(function() {
      flipit($card);
    }, 9000);
    $card.delay(6000).fadeOut(2000);
  };

  var animateCallToAction = function(win, time) {
    var canvas,
        context,
        box,
        animationTimeout,
        self = win,
        animationDiv = $('.call-animation-js'),
        particles = [],
        dirtyRegions = [],
        minForce = 0,
        maxForce = 500,
        colors = ['rgb(255, 255, 255)', 'rgb(255, 255, 0)',
                  'rgb(0, 255, 0)'],
        lastWord = time, FPS = 60;

    canvas = animationDiv.children('canvas')[0];
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    box = animationDiv.children('.text-box')[0];
    box.style.width = innerWidth + 'px';
    box.style.margin = '-35px 0 0 -' + innerWidth / 2  + 'px';

      var init = function() {
        animationDiv.show();
        // Browser supports canvas?
        if(!!(capable)) {
          context = canvas.getContext('2d');
          window.onresize = onResize;
          createParticles();
        }
        else {
          console.error("Sorry, your browser doesn't support canvas.");
        }
      };

      /*
       * Check if browser supports canvas element.
       */
      var capable = function() {
        return canvas.getContext && canvas.getContext('2d');
      };

      /*
       * On resize window event.
       */
      var onResize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        box.style.margin = '-35px 0 0 -' + innerWidth / 2  + 'px';
      };

      /*
       * Create particles.
       */
      var createParticles = function() {
        for(var quantity = 0, len = 100; quantity < len; quantity++) {
          var x, y, radius;
          x = 10 + (innerWidth || canvas.width) / len * quantity;
          y = (innerHeight || canvas.height) / 2;
          radius = ~~(Math.random() * 15);
          particles.push({
            x: x,
            y: y,
            goalX: x,
            goalY: y,
            top: 4 + Math.random() * - 8,
            bottom: - 15 + Math.random() * - 20,
            left: - 15 + Math.random() * - 20,
            right: - 5 + Math.random() * - 10,
            radius: radius,
            color: colors[~~(Math.random() * colors.length)]
          });
          dirtyRegions.push({
            x: x,
            y: y,
            radius: radius
          });
        }
        pulse();
      };

      /*
       * Loop logic.
       */
      var pulse = function() {
        var word = 'Girl Scouts: Then &amp; now.';
        if(Date.now() - lastWord > 2875 &&
           Date.now() - lastWord < 5750)
          word = 'Double click the grid';
        if(Date.now() - lastWord > 5750 &&
           Date.now() - lastWord < 8625)
          word = 'To see where Girl Scouts';
        if(Date.now() - lastWord > 8625)
          word = 'Took these ladies.';
        box.innerHTML = '<p>' + word + '</p>';
        clear();
        update();
        callToActionAnimationId = requestAnimFrame(pulse);
        render();
      };

      /*
       * Check if particle is out of screen bounds.
       */
      var checkBounds = function () {
        [].forEach.call(particles, function(particle, index) {
          // Bounds right
          if(particle.x > canvas.width + particle.radius * 2) {
            particle.goalX = -particle.radius;
            particle.x = -particle.radius;
          }

          // Bounds bottom
          if(particle.y > canvas.height + particle.radius * 2){
            particle.goalY = -particle.radius;
            particle.y = -particle.radius;
          }

          // Bounds left
          if(particle.x < -particle.radius * 2) {
            particle.radius *= 4;
            particle.goalX = canvas.width + particle.radius;
            particle.x = canvas.width + particle.radius;
          }

          // Bounds top
          if(particle.y < -particle.radius * 2) {
            particle.radius *= 4;
            particle.goalY = canvas.height + particle.radius;
            particle.y = canvas.height + particle.radius;
          }
        });
      };

      /*
       * Clear only dirty regions.
       */
      var clear = function() {
        [].forEach.call(dirtyRegions, function(dirty, index) {
          var x, y, width, height;
          width = (2 * dirty.radius) + 4;
          height = width;
          x = dirty.x - (width / 2);
          y = dirty.y - (height / 2);
          context.clearRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
        });
      };

      /*
       * Update the particles.
       */
      var update = function() {
        particles.forEach(function(particle, index) {
          var angle, steps, center = {};
          angle = Math.atan2(particle.y, particle.x);
          steps = Math.PI * 2 * index / particles.length;
          center.x = (innerWidth || canvas.width) * 0.5;
          center.y = (innerHeight || canvas.height) * 0.5;

          // Inverse polar system
          particle.x += Math.cos(angle) +
            (particle.goalX - particle.x) * 0.08;
          particle.y += Math.sin(angle) +
            (particle.goalY - particle.y) * 0.08;

          // Pulsar radius, with friction
          particle.radius *= 0.96;
          if(particle.radius <= 2)
            particle.radius = ~~(Math.random() * 15);

          // Heart - http://mathworld.wolfram.com/HeartCurve.html
          if(Date.now() - time > 1275 &&
             Date.now() - time < 2550) {
            particle.goalX = center.x + 180 * Math.pow(Math.sin(index), 3);
          particle.goalY = center.y + 10 * ( - (15 * Math.cos(index) -
                                                5 * Math.cos(2 * index) -
                                                2 * Math.cos(3 * index) -
                                                Math.cos(4 * index)));
          }

          // Random
          if(Date.now() - time > 2550 &&
             Date.now() - time < 3825) {
            maxForce = 3000;
          // Increase speed
          particle.goalX += particle.top;
          particle.goalY += particle.bottom;
          checkBounds();
          }

          // Circle
          if(Date.now() - time > 3825 &&
             Date.now() - time < 5100) {
            maxForce = 500;
          var radius = 200;
          particle.goalX = (center.x + radius * Math.cos(steps));
          particle.goalY = (center.y + radius * Math.sin(steps));
          }

          // Spiral
          if(Date.now() - time > 5100 &&
             Date.now() - time < 6375) {
            var angle = index * 0.2;
            var radius = 15;
            particle.goalX = (center.x + (angle * radius) * Math.cos(angle));
            particle.goalY = (center.y + (angle * radius) * Math.sin(angle));
          }

          // Random
          if(Date.now() - time > 6375 &&
             Date.now() - time < 7650) {
            maxForce = 3000;
          particle.goalX += particle.left;
          particle.goalY += particle.right;
          checkBounds();
          }

          // Hip
          if(Date.now() - time > 7650 &&
             Date.now() - time < 8925) {
            maxForce = 500;
          var radius = 200;
          particle.goalX = (center.x + radius * Math.cos(steps));
          particle.goalY = (center.y + radius * Math.tan(steps));
          }

          // Horizontal
          if(Date.now() - time > 8925 &&
             Date.now() - time < 10200) {
            particle.goalX = 10 + canvas.width / 100 * index;
          particle.goalY = canvas.height / 2;
          }

          // Reset 'em all
          if(Date.now() - time > 10200)
            time = Date.now();
        });
      };

      /*
       * Render the particles.
       */
      var render = function() {
        [].forEach.call(particles, function(particle, index) {
          context.save();
          context.globalCompositeOperation = 'lighter';
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.closePath();
          context.fill();
          context.restore();

          // Dirty regions
          dirtyRegions[index].x = particle.x;
          dirtyRegions[index].y = particle.y;
          dirtyRegions[index].radius = particle.radius;
        });
      };

      /*
       * Distance between two points.
       */
      var distanceTo = function(pointA, pointB) {
        var dx = Math.abs(pointA.x - pointB.x);
        var dy = Math.abs(pointA.y - pointB.y);
        return (minForce + maxForce) / Math.sqrt(dx * dx + dy * dy);
      };

      /*
       * Request new frame by Paul Irish.
       * 60 FPS.
       */
      window.requestAnimFrame = (function() {
        return  window.requestAnimationFrame   ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback) {
            animationTimeout = window.setTimeout(callback, 1000 / FPS);
          };
      })();

      init();
  };

  Meteor.setInterval(function() {
    var animationDiv = $('.call-animation-js');
    if(!storiesQueue.isEmpty()) {
      cancelAnimationFrame(callToActionAnimationId);
      animationDiv.fadeOut(100);
      storyAnimation.set(storiesQueue.dequeue());
      animateStory();
    } else {
      cancelAnimationFrame(callToActionAnimationId);
      if(animationDiv.css('display') === 'none')
        animationDiv.fadeIn(100);
      animateCallToAction(window, Date.now());
    }
  }, 11500);
};
