Meteor.startup(function() {
  var Twitter = Meteor.npmRequire('twitter');
  var conf = JSON.parse(Assets.getText('twitter_credentials.json'));
  twit = new Twitter({
    consumer_key: conf.consumer.key,
    consumer_secret: conf.consumer.secret,
    access_token_key: conf.access_token.key,
    access_token_secret: conf.access_token.secret
  });
});

var TweetStream = new Meteor.Stream('tweets');
var subscriptionClientsMap = {};
TweetStream.on('clientId', function(clientId) {
  var subscriptionId = this.subscriptionId;
  subscriptionClientsMap[subscriptionId] = clientId;

  this.onDisconnect = function() {
    subscriptionClientsMap[subscriptionId] = undefined;
  };
});

TweetStream.permissions.read(function(eventName) {
  var isAllowed = subscriptionClientsMap[this.subscriptionId] === 'tweetFeed';
  return isAllowed;
}, false);
