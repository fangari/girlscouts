var elems = $('#poll input[type="checkbox"]');

elems.on('change', function () {
    var limit = 5,
        _check = elems.filter(':checked').length;
    if (_check > limit) {
        alert("You can only select a maximum of " + limit + " checkboxes")
        this.checked = false;
    }
});