Messages = new Meteor.Collection('messages');

Meteor.methods({
  submitMessage: function(messageAttributes) {

    if (! messageAttributes.name)
      throw new Meteor.Error(422, 'Please fill in your name');
    if (! messageAttributes.text)
      throw new Meteor.Error(422, 'Please fill in a message');
    if (messageAttributes.text.length > 140)
      throw new Meteor.Error(422, 'Message is too long, please revise');

    var message = _.extend(_.pick(messageAttributes, 'id_str', 'name',
                           'text', 'origin', 'reviewed'), {
                             created_at: new Date().getTime()
                           });

    var messageId = Messages.insert(message);

    return messageId;
  },
  accept: function(messageId) {
  },
  reject: function(messageId) {
  }
});
