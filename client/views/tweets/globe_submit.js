Template.globeSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var initials = $.parseHTML("&mdash;")[0].textContent +
      $(event.target).find('[name=name]').val() +
      $(event.target).find('[name=last_name]').val()[0];
    var message = {
      name: $(event.target).find('[name=name]').val(),
      last_name: $(event.target).find('[name=last_name]').val(),
      text: $(event.target).find('[name=message]').val() + ' ' + initials + ' #GSC14',
      origin: 'globe',
      reviewed: false
    };

    //Method call or endpoint message stream
    Meteor.call('submitMessage', message, function(error, id) {
      if (error)
        return alert(error.reason);
      $(event.target).find('[name=name]').val('');
      $(event.target).find('[name=last_name]').val('');
      $(event.target).find('[name=message]').val('');
      $(event.target).find('.char-count-js').text('129');
    });
  }
});

Template.globeSubmit.rendered = function() {
  var msgLength = 130;
  var area = this.find('textarea');
  var counterSpan = this.find('.char-count-js');
  $("input[name='name']").on('keyup', function(e) {
    msgLength = 130 - this.value.length;
    counterSpan.innerHTML = msgLength - area.value.length;
  });
  function callback(counter) {
    if (counter.all < msgLength + 1) {
      counterSpan.style.color = 'green';
    } else {
      counterSpan.style.color = 'red';
    }
    counterSpan.innerHTML = msgLength - counter.all;
  }
  Countable.live(area, callback);
};
