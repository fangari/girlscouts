if (Meteor.users.find().count() === 0) {
  var accountsFile = {};
  accountsFile = JSON.parse(Assets.getText('accounts.json'));
  _.forEach(accountsFile.users, function(user){ Accounts.createUser(user); });
}

if (Stats.find().count() === 0) {
  var statsFile = {};
  statsFile = JSON.parse(Assets.getText('stats.json'));
  _.forEach(statsFile.stats, function(stat) { Stats.insert(stat); });
}

if(Stories.find().count() === 0) {
  var storiesFile = {};
  storiesFile = JSON.parse(Assets.getText('stories.json'));
  _.forEach(storiesFile.stories, function(story) { Stories.insert(story); });
}

if (WordCloud.find().count() === 0) {
  var wordsForCloud = {};
  wordsForCloud = JSON.parse(Assets.getText('words_for_cloud.json'));
  _.forEach(wordsForCloud.words, function(wordDocument) {
    WordCloud.insert(wordDocument);
  });
}
