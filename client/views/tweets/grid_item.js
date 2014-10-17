Template.gridItem.events({
  'click img': function(event) {
    event.preventDefault();
    $(this).addClass('gridImg');
    Stories.update({_id: this._id}, {$inc: {selectedCount: 1 }});
  }
});
