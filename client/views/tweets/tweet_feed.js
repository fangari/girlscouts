TweetStream = new Meteor.Stream('tweets');

TweetStream.on('tweet', function(tweet) {
  tweet.created_at = moment(tweet.created_at).toDate();
  console.log(tweet);
  Tweets.insert(tweet);
});

Template.tweetFeed.helpers({
  tweets: function() {
    return Tweets.find({}, {
      sort: { created_at: -1 }
    });
  },
  tags: "#javascript, #ruby"
});
