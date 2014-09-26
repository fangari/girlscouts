Template.story.rendered = function() {
  Stories.find().observeChanges({
    changed: function(id, fields) {
      animateStory(Stories.findOne({_id: id}));
    }
  });

  var animateStory = function(story) {
    console.log("The selected story is", story);
  };

};
