Template.messageItem.events({
  'click .reject': function(event) {
    event.preventDefault();
    if (confirm('Reject this message?')) {
      var currentMessageId = this._id;
      Messages.remove(currentMessageId);
    }
  },
  'click .accept': function(event) {
    event.preventDefault();
    var currentMessageId = this._id;
    Messages.update({_id: this._id}, {$set: {reviewed: true}});
    Meteor.call('tweetMessage', Messages.findOne({_id: this._id}),
                function(error, id) {
                  if(error) return alert(error.reason);
                 });
  }
});

Template.messageItem.isAccepted = function() {
  return Router.current().path === '/accepted';
};
