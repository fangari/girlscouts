var messageDisplay = {
  text: '',
  dep: new Tracker.Dependency(),
  get: function() {
    this.dep.depend();
    return this.text;
  },
  set: function(messageText) {
    if (this.text !== messageText) {
      this.text = messageText;
      this.dep.changed();
    }
    return this.text;
  }
};


Template.globeDisplay.message = function() {
    return messageDisplay.get();
};

Template.globeDisplay.rendered = function() {

  var displayQueue = new buckets.PriorityQueue(function (msgA, msgB) {
    if(msgA.viewCount > msgB.viewCount)
      return -1;
    if(msgA.viewCount < msgB.viewCount)
      return 1;
    return 0;
  });

  Tracker.autorun(function() {
    Messages.find().observeChanges({
      added: function(id, msg) {
        displayQueue.enqueue(msg);
      }
    });
  });

  var statsArray = Stats.find().fetch();
  var statsCount = Stats.find().count();
  var randomIndex = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  var getRandomStat = function() {
    return statsArray[randomIndex(0, statsCount)].text;
  };

  var undisplayedStat = true;
  var minPriority = 0;
  (function displayMsgs() {
    var msg;
    if (displayQueue.isEmpty()) {
      messageDisplay.set(getRandomStat());
    } else {
      if ( displayQueue.peek().viewCount < 1 ) {
        msg = displayQueue.dequeue();
        messageDisplay.set(msg.text);
        msg.viewCount = minPriority + 1;
        displayQueue.enqueue(msg);
        undisplayedStat = true;
      } else {
        if ( undisplayedStat ) {
          messageDisplay.set(getRandomStat());
          undisplayedStat = false;
        } else {
          msg = displayQueue.dequeue();
          if (msg.viewCount > minPriority)
            minPriority = msg.viewCount;
          messageDisplay.set(msg.text);
          undisplayedStat = true;
          msg.viewCount = minPriority + 1;
          displayQueue.enqueue(msg);
        }
      }
    }
    setTimeout(displayMsgs, 45000);
  })();
};
