UI.registerHelper('moments', function(date) {
  return moment(date).format('HH:mm:ss');
});

UI.registerHelper('words', function() {
  return WordCloud.find({filler: false});
});
