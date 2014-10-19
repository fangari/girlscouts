var pledgeFSForm;
Template.pledgeSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var initials = $.parseHTML("&mdash;")[0].textContent +
      $(event.target).find('[name=name]').val() + ' ' +
      $(event.target).find('[name=last_name]').val()[0];
    var message = {
      name: $(event.target).find('[name=name]').val(),
      last_name: $(event.target).find('[name=last_name]').val(),
      text: 'I pledge to ' + $(event.target).find('[name=message]').val() +
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
      pledgeFSForm.reset();
    });

    Meteor.call('submitToWordCloud', wordArray, function(error, id) {
      if (error)
        return alert(error.reason);
      $(event.target).find('[name=words]').prop("checked", false);
    });
  }
});

Template.pledgeSubmit.rendered = function() {
  pledgeFSForm = new FForm(this.find('#fs-form-wrap'),
                           {ctrlNavPosition: false});
                           pledgeFSForm.render();
                           var nameLength;
                           var msgLength = 140 - 'I pledge to  - I #GSC14'.length;
                           var area = this.find('textarea');
                           var counterSpan = this.find('.char-count-js');
                           var $firstName = this.$("input[name='name']");
                           $firstName.on('keyup', function(e) {
                             nameLength = this.value.length;
                             counterSpan.innerHTML = msgLength - nameLength - area.value.length;
                           });
                           $firstName.on('blur', function() {
                             msgLength = msgLength - this.value.length;
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
