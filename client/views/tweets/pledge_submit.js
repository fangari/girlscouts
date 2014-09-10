Template.pledgeSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var message = {
      id_str: Random.id(),
      created_at: moment().format(),
      name: $(event.target).find('[name=name]').val(),
      text: "#TakeActionHome: " +
        $(event.target).find('[name=message]').val() + ' #GSC14',
      origin: 'pledge',
      reviewed: false
    };

    //Method call or endpoint message stream

    $(event.target).find('[name=name]').val('');
    $(event.target).find('[name=message]').val('');
    console.log(message);
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
