Template.gridItem.events({
  'dblclick img': function(event) {
    event.preventDefault();
    Stories.update({_id: this._id}, {$inc: {selectedCount: 1 }});
  }
});
