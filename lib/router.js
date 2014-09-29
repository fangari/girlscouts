Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

MessagesController = RouteController.extend({
  template: 'unreviewedList',
  increment: 10,
  limit: function() {
    return parseInt(this.params.messagesLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.limit()};
  },
  onBeforeAction: function() {
    this.messagesSub = Meteor.subscribe('messages', this.findOptions());
  },
  messages: function() {
    return Messages.find({reviewed: false}, this.findOptions());
  },
  data: function() {
    var hasMore = this.messages().count() === this.limit();
    return {
      messages: this.messages(),
      ready: this.messagesSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

UnreviewedMessagesController = MessagesController.extend({
  sort: {created_at: -1, _id: -1},
  nextPath: function() {
    return Router.routes.unreviewedList.path({
      messagesList: this.limit() + this.increment
    });
  }
});

PledgeWallController = MessagesController.extend({
  template: 'pledgeWall',
  messages: function() {
    return Messages.find({reviewed: true, origin: 'pledge'}, this.findOptions());
  },
  nextPath: function() {
    return Router.routes.pledgeWall.path({
      messagesList: this.limit() + this.increment
    });
  }
});

AcceptedMessagesController = MessagesController.extend({
  template: 'acceptedList',
  sort: {created_at: -1, _id: -1},
  messages: function() {
    return Messages.find({reviewed: true}, this.findOptions());
  },
  nextPath: function() {
    return Router.routes.acceptedList.path({
      messagesList: this.limit() + this.increment
    });
  }
});

Router.map(function() {
  this.route('tweetFeed', {
    path: '/tweets'
  });

  this.route('globeSubmit', {
    path: '/globe/new',
    disableProgress: true
  });

  this.route('pledgeSubmit', {
    path: '/pledges/new',
    disableProgress: true
  });

  this.route('acceptedList', {
    path: '/accepted/:messagesLimit?',
    controller: AcceptedMessagesController
  });

  this.route('pledgeWall', {
    path: '/pledges/:messagesLimit?',
    controller: PledgeWallController
  });

  this.route('wordcloud', {
    path: '/wordcloud',
    waitOn: function() {
      return Meteor.subscribe('wordcloud');
    }
  });

  this.route('globeDisplay', {
    path: '/globe',
    waitOn: function() {
      return [Meteor.subscribe('globe-messages'), Meteor.subscribe('stats')];
    }
  });

  this.route('grid', {
    path: '/grid',
    waitOn: function() {
      return Meteor.subscribe('stories');
    }
  });

  this.route('story', {
    path: '/story',
    waitOn: function() {
      return Meteor.subscribe('stories');
    }
  });

  this.route('unreviewedList', {
    path: '/:messagesLimit?',
    controller: UnreviewedMessagesController
  });

});

Router.onBeforeAction('loading');
// Router.onBeforeAction(function() { clearErrors(); });
