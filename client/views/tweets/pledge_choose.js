Template.pledgeChoose.events({
  'click .js-children': function() {
    Router.go('pledgeSubmitChildren');
  },
  'click .js-adults': function() {
    Router.go('pledgeSubmit');
  }
});
