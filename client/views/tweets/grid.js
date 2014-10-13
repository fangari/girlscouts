Template.grid.helpers({
  stories: function() {
    return Stories.find();
  }
});

Template.grid.rendered = function() {

  $.fn.isOnScreen = function() {
    var win = $(window);
    var viewport = {
      top: win.scrollTop(),
      left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left ||
              viewport.left > bounds.right ||
              viewport.bottom < bounds.top ||
              viewport.top > bounds.bottom));
  };

  var pfx = ['webkit', 'moz', 'MS', 'o', ''];
  var PrefixedEvent = function(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) type = type.toLowerCase();
      element.addEventListener(pfx[p]+type, callback, false);
    }
  };

  var inViewport = function($element, h) {
        return $element.isOnScreen();
  };

  var GridItem = function(el) {
    this.el     = $(el);
    this.anchor = this.el.children('a');
    this.image  = this.el.find('img');
    this.desc   = this.el.find('h3');
  };

  GridItem.prototype.addCurtain = function() {
    if (!this.image[0]) return;
    var colors = ['#00AE58', '#FAA519', '#00ADEF', '#000000'];
    this.curtain = $(document.createElement('div'));
    this.curtain.addClass('curtain');
    this.curtain.css('background', colors[~~(Math.random() * 3)]);
    this.anchor.append(this.curtain);
  };

  GridItem.prototype.changeAnimationDelay = function(time) {
    if (this.curtain.length !== 0 ) {
      this.curtain.css('-webkit-animation-delay', time+'ms');
      this.curtain.css('animation-delay', time+'ms');
    }
    if (this.image.length !== 0) {
      this.image.css('-webkit-animation-delay', time+'ms');
      this.image.css('animation-delay', time+'ms');
    }
    if (this.desc.length !== 0) {
      this.desc.css('-webkit-animation-delay', time+'ms');
      this.desc.css('animation-delay', time+'ms');
    }
  };

  var GridScrollFx = function($el, options) {
    this.$container = $el;
    this.items = [];
    this.options = _.extend({}, this.options);
    _.extend(this.options, options);
    // this._init();
  };

  GridScrollFx.prototype.options = {
    // Min and Max delay of the animation (random value)
    minDelay: 0,
    maxDelay: 500,
    viewportFactor: 0
  };

  GridScrollFx.prototype._init = function() {
    var self = this, items = [];

    _.forEach(this.$container.children(), function(element) {
      var item = new GridItem(element);
      items.push(item);
    });

    this.items = items;
    this.didScroll = false;

    self.$container.imagesLoaded().always(function(instance) {
      // show grid
      self.$container.addClass('loaded');

      // initialize mansonry
      self.$container.masonry({
        itemSelector: 'li',
        isFitWidth: true,
        transitionDuration: 0
      });

      // add curtain effect to all items
      _.forEach(self.items, function(item) {
        if (!item.image[0]) return;
        if(inViewport(item.el))
          item.el.addClass('shown');
        item.addCurtain();
        item.changeAnimationDelay(Math.random() * (self.options.maxDelay -
                                                   self.options.minDelay) +
                                                   self.options.minDelay);
      });

      // Define what to do when the user scrolls the page
      var onScrollFn = function() {
        if (!self.didScroll) {
          self.didScroll = true;
          setTimeout( function() { self._scrollPage(); }, 200 );
        }
      };

      // animate the items inside the viewport (on scroll)
      window.addEventListener('scroll', onScrollFn, false);

      // Check if new items are in viewport after resize
      window.addEventListener('resize', function() { self._resizeHandler(); },
                             false);
    })
    .done(function(instance) {console.log("all images successfully loaded");})
    .fail(function(instance) {console.log("all images loaded, at least one is broken");})
    .progress(function(instance, image) {
      var result = image.isLoaded ? 'loaded' : 'broken';
      console.log('image is ' + result + ' for ' + image.img.src);
    });
  };

  GridScrollFx.prototype._scrollPage = function() {
    var self = this;
    _.forEach(this.items, function(item) {
      var $element = item.el;
      if(!$element.hasClass('shown') && !$element.hasClass('animate') &&
         inViewport($element, self.options.viewportFactor)) {
        if (!item.curtain) {
          $element.addClass('shown');
          return;
        }

        if (item.image[0])
          $element.addClass('animate');

        var onEndAnimationFn = function(ev) {
          this.removeEventListener('animationend', onEndAnimationFn);
          $element.removeClass('animate');
          $element.addClass('shown');
        };

        PrefixedEvent(item.curtain[0], 'AnimationEnd', onEndAnimationFn);
      }
      if (!inViewport($element, self.options.viewportFactor) && $element.hasClass('shown'))
        $element.removeClass('shown');
    });
    this.didScroll = false;
  };

  GridScrollFx.prototype._resizeHandler = function() {
    var self= this;
    var delayed = function() {
      self._scrollPage();
      self.resizeTimeout = null;
    };

    if (this.resizeTimeout)
      clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(delayed, 1000);
  };

  var gridScroller = new GridScrollFx($('#grid'), {viewportFactor: 0.4});
  gridScroller._init();
};
