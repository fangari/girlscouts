Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

UnreviewedMessagesController = RouteController.extend({
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
    var nextPath = this.route.path({
      messagesLimit: this.limit() + this.increment
    });
    return {
      messages: this.messages(),
      ready: this.messagesSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});

Router.map(function() {
  this.route('tweetFeed', {
    path: '/'
  });

  this.route('globeSubmit', {
    path: '/globe/new',
    disableProgress: true
  });

  this.route('pledgeSubmit', {
    path: '/pledge/new',
    disableProgress: true
  });

  this.route('unreviewedList', {
    path: '/unreviewed/:messagesLimit?',
    sort: {created_at: -1},
    controller: UnreviewedMessagesController
  });
});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.logginIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');

    pause();
  }
};

Router.onBeforeAction('loading');
// Router.onBeforeAction(requireLogin, {only: ['unreviewedList', 'tweetFeed']});
// Router.onBeforeAction(function() { clearErrors(); }
