Template.pledgeSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var message = {
      id_str: Random.id(),
      name: $(event.target).find('[name=name]').val(),
      text: "#TakeActionHome: " +
        $(event.target).find('[name=message]').val() + ' #GSC14',
      origin: 'pledge',
      reviewed: false
    };

    //Method call or endpoint message stream
    Meteor.call('submitMessage', message, function(error, id) {
      if (error)
        return alert(error.reason);
      $(event.target).find('[name=name]').val('');
      $(event.target).find('[name=message]').val('');
      // Router.go('pledgeSubmit');
    });
  }
});

Template.pledgeSubmit.rendered = function() {
  var area = this.find('textarea');
  var counterSpan = this.find('.char-count-js');
  function callback(counter) {
    if (counter.all < 117) {
      counterSpan.style.color = 'green';
    } else {
      counterSpan.style.color = 'red';
    }
    counterSpan.innerHTML = 116 - counter.all;
  }
    Countable.live(area, callback);
};
