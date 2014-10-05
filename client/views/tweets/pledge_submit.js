Template.pledgeSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var initials = $.parseHTML("&mdash;")[0].textContent +
      $(event.target).find('[name=name]').val()[0] +
      $(event.target).find('[name=last_name]').val()[0];
    var message = {
      name: $(event.target).find('[name=name]').val(),
      last_name: $(event.target).find('[name=last_name]').val(),
      text: $(event.target).find('[name=message]').val() +
        ' ' + initials + ' #GSC14',
      origin: 'pledge',
      reviewed: false
    };

    var wordArray = _.map($("input:checked"), function(word) {
      return word.value;
    });

    //Method call or endpoint message stream
    Meteor.call('submitMessage', message, function(error, id) {
      if (error)
        return alert(error.reason);
      $(event.target).find('[name=name]').val('');
      $(event.target).find('[name=last_name]').val('');
      $(event.target).find('[name=message]').val('');
      $(event.target).find('.char-count-js').text('129');
    });

    Meteor.call('submitToWordCloud', wordArray, function(error, id) {
      if (error)
        return alert(error.reason);
      $(event.target).find('[name=words]').prop("checked", false);
    });
  }
});

Template.pledgeSubmit.rendered = function() {
  var area = this.find('textarea');
  var counterSpan = this.find('.char-count-js');
  function callback(counter) {
    if (counter.all < 130) {
      counterSpan.style.color = 'green';
    } else {
      counterSpan.style.color = 'red';
    }
    counterSpan.innerHTML = 129 - counter.all;
  }
    Countable.live(area, callback);
};

Template.pledgeSubmit.helpers({
  words: function() {
    return WordCloud.find({filler: false});
  }
});
