Stories = new Meteor.Collection("stories");

Stories.allow({
  update: function() {return true;}
});

Stories.deny({
  update: function(userID, story, fieldNames) {
    return(_.without(fieldNames, 'selectedCount').length > 0);
  }
});

Meteor.methods({
  totalSelected: function() {
    return _.reduce(Stories.find().fetch(), function(memo, story) {
      return memo + story.selectedCount;
    }, 0);
  }
});
