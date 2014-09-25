WordCloud = new Meteor.Collection('wordcloud');

WordCloud.allow({
  update: function() {return true;}
});

Meteor.methods({

  submitToWordCloud: function(wordArray) {
    if (wordArray.length === 0)
      throw new Meteor.Error(422, 'Please choose a least one word');
    _.forEach(wordArray, function(word) {
      var result = WordCloud.upsert({word: word}, {$inc: {frequency: 1}});
    });
  }
});
