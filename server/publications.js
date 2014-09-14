Meteor.publish('messages', function(options) {
  return Messages.find({}, options);
});
