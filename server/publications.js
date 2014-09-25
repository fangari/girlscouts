Meteor.publish('messages', function(options) {
  return Messages.find({}, options);
});

Meteor.publish('globe-messages', function() {
  return Messages.find({reviewed: true, origin: 'globe'},
                       {sort: {created_at: -1, _id: -1, viewCount: -1}});
});

Meteor.publish('stats', function() {
  return Stats.find({}, {sort: {_id: -1}});
});

Meteor.publish('wordcloud', function() {
  return WordCloud.find();
});

Meteor.publish('stories', function() {
  return Stories.find();
});
