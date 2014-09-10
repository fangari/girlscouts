Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {
  this.route('tweetFeed', {
    path: '/'
  });

  this.route('globeSubmit', {
    path: '/globeSubmit'
  });

  this.route('pledgeSubmit', {
    path: '/pledgeSubmit'
  });
});
