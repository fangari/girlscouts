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

  var storiesQueue = new buckets.Queue();

  var flipit = function(card) {
    card.children('.faces').toggleClass('flipped');
  };

  var animateStory = function() {
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

  var animateCallToAction = function() {
    var $callAnimation = $('.call-animation-js');
    $callAnimation.text('Come and see what the Girl Scouts have offered thousands like you.');
    $callAnimation.slideDown(2000);
    $callAnimation.delay(5500).slideUp(2000);
  };

  Stories.find().observeChanges({
    changed: function(id, fields) {
      storiesQueue.add(id);
    }
  });

  Meteor.setInterval(function() {
    if(!storiesQueue.isEmpty()) {
      storyAnimation.set(storiesQueue.dequeue());
      animateStory();
    } else {
      animateCallToAction();
    }
  }, 11500);
};
