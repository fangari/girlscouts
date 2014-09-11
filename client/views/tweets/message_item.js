Template.messageItem.events({
  'click .reject': function(event) {
    event.preventDefault();
    if (confirm('Reject this message?')) {
      var currentMessageId = this._id;
      console.log('moderator clicked to reject message:\n');
      console.log(this._id);
    }
  },
  'click .accept': function(event) {
    event.preventDefault();
    var currentMessageId = this._id;
    console.log('moderator clicked to accept message:\n');
    console.log(this._id);
  }
});
