Messages = new Meteor.Collection('messages');

Messages.allow({
  update: function() {return true;},
  remove: function() {return true;}
});

Messages.deny({
  update: function(userID, message, fieldNames) {
    return (_.without(fieldNames, 'reviewed', 'viewCount').length > 0);
  }
});

Meteor.methods({
  submitMessage: function(messageAttributes) {

    if (! messageAttributes.name)
      throw new Meteor.Error(422, 'Please fill in your name');
    if (! messageAttributes.text)
      throw new Meteor.Error(422, 'Please fill in a message');
    if (messageAttributes.text.length > 140)
      throw new Meteor.Error(422, 'Message is too long, please revise');

    var message = _.extend(_.pick(messageAttributes, 'name', 'last_name',
                           'text', 'origin', 'reviewed'), {
                             created_at: new Date().getTime(),
                             viewCount: 0
                           });

    var messageId = Messages.insert(message);

    return messageId;
  },
  tweetMessage: function(messageAttributes) {
    twit.updateStatus(messageAttributes.text, function(data) {
      console.log(data.id_str);
      if (data.errors)
        console.log("This error prevented tweeting:",data.errors.message);
    });
  },
});
