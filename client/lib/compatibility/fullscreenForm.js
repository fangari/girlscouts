/**
 * fullscreenForm.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
(function(window) {

  'use strict';

  var pfx = ['webkit', 'moz', 'MS', 'o', ''];
  var PrefixedEvent = function(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) type = type.toLowerCase();
      element.addEventListener(pfx[p] + type, callback, false);
    }
  };

  /**
   * createElement function
   * creates an element with tag = tag, className = opt.cName,
   * innerHTML = opt.inner and appends it to opt.appendTo
   */
  function createElement(tag, opt) {
    var el = document.createElement(tag);
    if(opt) {
      if(opt.cName) {
        el.className = opt.cName;
      }
      if(opt.inner) {
        el.innerHTML = opt.inner;
      }
      if(opt.appendTo) {
        opt.appendTo.appendChild(el);
      }
    }
    return el;
  }

  /**
   * FForm function
   */
  function FForm(el, options) {
    this.el = el;
    this.options = _.extend({}, this.options);
    _.extend(this.options, options);
    this._init();
    this._initEvents();
  }

  /**
   * FForm options
   */
  FForm.prototype.options = {
    // show progress bar
    ctrlProgress : true,
    // show navigation dots
    ctrlNavDots : true,
    // show [current field]/[total fields] status
    ctrlNavPosition : true,
    // reached the review and submit step
    onReview : function() { return false; }
  };

  /**
   * init function
   * initialize and cache some vars
   */
  FForm.prototype._init = function() {
    // the form element
    this.formEl = this.formEl || this.el.querySelector( 'form' );

    // list of fields
    this.fieldsList = this.fieldsList || this.formEl.querySelector( 'ol.fs-fields' );

    // current field position
    this.current = 0;

    // all fields
    this.fields = this.fields || [].slice.call( this.fieldsList.children );

    // total fields
    this.fieldsCount = this.fieldsCount || this.fields.length;

    // show first field
    $(this.fields[this.current]).addClass('fs-current');

    // hide submit button
    $('.fs-submit').hide();

    // create/add controls
    this._addControls();

    // create/add messages
    this._addErrorMsg();

    // init events
    // this._initEvents();
  };

  /**
   * addControls function
   * create and insert the structure for the controls
   */
  FForm.prototype._addControls = function() {
    // main controls wrapper
    this.ctrls = this.ctrls || createElement('div',
                  { cName : 'fs-controls', appendTo : this.el });

                                             // continue button (jump to next field)
                                             this.ctrlContinue = this.ctrlContinue || createElement('button',
                                                                                                    { cName : 'fs-continue',
                                                                                                      inner : 'Continue',
                                                                                                      appendTo : this.ctrls });
                                                                                                      this._showCtrl( this.ctrlContinue );

                                                                                                      // navigation dots
                                                                                                      if( this.options.ctrlNavDots ) {
                                                                                                        this.ctrlNav = this.ctrlNav || createElement( 'nav',
                                                                                                                                                       { cName : 'fs-nav-dots',
                                                                                                                                                         appendTo : this.ctrls } );
                                                                                                                                                         if(this.ctrlNavDots === void(0)) {
                                                                                                                                                           var dots = '';
                                                                                                                                                           for( var i = 0; i < this.fieldsCount; ++i ) {
                                                                                                                                                             dots += i === this.current ?
                                                                                                                                                               '<button class="fs-dot-current"></button>' : '<button disabled></button>';
                                                                                                                                                           }
                                                                                                                                                           this.ctrlNav.innerHTML = dots;
                                                                                                                                                           this._showCtrl( this.ctrlNav );
                                                                                                                                                         }
                                                                                                                                                         this.ctrlNavDots = this.ctrlNavDots || [].slice.call( this.ctrlNav.children );
                                                                                                                                                         this._updateNav();
                                                                                                      }

                                                                                                      // field number status
                                                                                                      if( this.options.ctrlNavPosition ) {
                                                                                                        this.ctrlFldStatus = this.ctrlFldStatus || createElement( 'span',
                                                                                                                                                                     { cName : 'fs-numbers',
                                                                                                                                                                       appendTo : this.ctrls } );

                                                                                                                                                                       // current field placeholder
                                                                                                                                                                       this.ctrlFldStatusCurr = this.ctrlFldStatusCurr || createElement( 'span',
                                                                                                                                                                                                                                        { cName : 'fs-number-current',
                                                                                                                                                                                                                                          inner : Number( this.current + 1 ) } );
                                                                                                                                                                                                                                          this.ctrlFldStatus.appendChild( this.ctrlFldStatusCurr );

                                                                                                                                                                                                                                          // total fields placeholder
                                                                                                                                                                                                                                          this.ctrlFldStatusTotal = createElement( 'span',
                                                                                                                                                                                                                                                                                          { cName : 'fs-number-total',
                                                                                                                                                                                                                                                                                            inner : this.fieldsCount } );
                                                                                                                                                                                                                                                                                            this.ctrlFldStatus.appendChild( this.ctrlFldStatusTotal );
                                                                                                                                                                                                                                                                                            this._showCtrl( this.ctrlFldStatus );
                                                                                                      }

                                                                                                      // progress bar
                                                                                                      if( this.options.ctrlProgress ) {
                                                                                                        this.ctrlProgress = this.ctrlProgress || createElement( 'div',
                                                                                                                                                                    { cName : 'fs-progress',
                                                                                                                                                                      appendTo : this.ctrls } );
                                                                                                                                                                      this._showCtrl( this.ctrlProgress );
                                                                                                      }
  };

  /**
   * addErrorMsg function
   * create and insert the structure for the error message
   */
  FForm.prototype._addErrorMsg = function() {
    // error message
    this.msgError = createElement( 'span',
                                  { cName : 'fs-message-error',
                                    appendTo : this.el } );
  };

  /**
   * init events
   */
  FForm.prototype._initEvents = function() {
    var self = this;

    // show next field
    this.ctrlContinue.addEventListener( 'click', function() {
      self._nextField();
    } );
    var $_words = $('.fs-words');
    $_words.on('click', function(event){
      var limit = 5;
      var $checkbox = $(this).find('[type=checkbox]');
      $checkbox.prop("checked", !$checkbox.prop("checked"));
      var _checked = $_words.parent().find(':checked').length;
      if (_checked > limit) {
        self._showError('TOOMANY');
        $checkbox.prop("checked", !$checkbox.prop("checked"));
      }
      if(_checked <= limit) {
        self._clearError();
        $(this).toggleClass("fs-checked", $checkbox.prop("checked"));
      }
      event.stopImmediatePropagation();
    });


    // keyboard navigation events - jump to next field when pressing enter
    document.addEventListener( 'keydown', function( ev ) {
      var keyCode = ev.keyCode || ev.which;
      if (!self._isLastStep() && ev.target.tagName.toLowerCase() !== 'textarea') {
        if (keyCode === 13) {
          ev.preventDefault();
          self._nextField();
        }
      }
    } );
  };

  /**
   * nextField function
   * jumps to the next field
   */
  FForm.prototype._nextField = function(backto) {
    if( this.isLastStep || !this._validade() || this.isAnimating ) {
      return false;
    }
    this.isAnimating = true;

    // check if on last step
    this.isLastStep = this.current === this.fieldsCount - 1 &&
      backto === undefined ? true : false;

    // clear any previous error messages
    this._clearError();

    // current field
    var currentFld = this.fields[ this.current ];

    // save the navigation direction
    this.navdir = backto !== undefined ? backto < this.current ? 'prev' : 'next' : 'next';

    // update current field
    this.current = backto !== undefined ? backto : this.current + 1;

    if( backto === undefined ) {
      // update progress bar (unless we navigate backwards)
      this._progress();

      // save farthest position so far
      this.farthest = this.current;
    }

    // add class "fs-display-next" or "fs-display-prev" to the list of fields
    $(this.fieldsList).addClass('fs-display-' + this.navdir);

    // remove class "fs-current" from current field and add it to the next one
    // also add class "fs-show" to the next field and the class "fs-hide"
    // to the current one
    $(currentFld).removeClass('fs-current').addClass('fs-hide');

    if( !this.isLastStep ) {
      // update nav
      this._updateNav();

      // change the current field number/status
      this._updateFieldNumber();

      var nextField = this.fields[ this.current ];
      $(nextField).addClass('fs-current fs-show');
    }

    // after animation ends remove added classes from fields
    var self = this,
    onEndAnimationFn = function( ev ) {
      this.removeEventListener('animationend', onEndAnimationFn);
      this.removeEventListener('webkitAnimationEnd', onEndAnimationFn);

      $(self.fieldsList).removeClass('fs-display-'+self.navdir);
      $(currentFld).removeClass('fs-hide');

      if (self._isLastStep()) {
        self._hideCtrl( self.ctrlContinue );
        $('.fs-submit').fadeIn();
      }
      else {
        $(nextField).removeClass('fs-show');

        if( self.options.ctrlNavPosition ) {
          self.ctrlFldStatusCurr.innerHTML = self.ctrlFldStatusNew.innerHTML;
          self.ctrlFldStatus.removeChild( self.ctrlFldStatusNew );
          $(self.ctrlFldStatus).removeClass('fs-show-' + self.navdir);
        }
      }
      self.isAnimating = false;
    };

    if( this.navdir === 'next' ) {
      if( this._isLastStep()) {
        PrefixedEvent(
          currentFld.querySelector('.fs-anim-upper'),
          'AnimationEnd', onEndAnimationFn);
      }
      else {
        PrefixedEvent(
          nextField.querySelector('.fs-anim-lower'),
          'AnimationEnd', onEndAnimationFn );
      }
    }
    else {
      PrefixedEvent(
        nextField.querySelector('.fs-anim-upper'),
        'AnimationEnd', onEndAnimationFn);
    }
  };

  /**
   * showField function
   * jumps to the field at position pos
   */
  FForm.prototype._showField = function( pos ) {
    if( pos === this.current || pos < 0 || pos > this.fieldsCount - 1 ) {
      return false;
    }
    this._nextField( pos );
  };

  /**
   * updateFieldNumber function
   * changes the current field number
   */
  FForm.prototype._updateFieldNumber = function() {
    if( this.options.ctrlNavPosition ) {
      // first, create next field number placeholder
      this.ctrlFldStatusNew = document.createElement( 'span' );
      this.ctrlFldStatusNew.className = 'fs-number-new';
      this.ctrlFldStatusNew.innerHTML = Number( this.current + 1 );

      // insert it in the DOM
      this.ctrlFldStatus.appendChild( this.ctrlFldStatusNew );

      // add class "fs-show-next" or "fs-show-prev" depending on the navigation direction
      var self = this;
      setTimeout( function() {
        $(self.ctrlFldStatus).addClass(self.navdir === 'next' ? 'fs-show-next' : 'fs-show-prev');
      }, 25 );
    }
  };

  /**
   * progress function
   * updates the progress bar by setting its width
   */
  FForm.prototype._progress = function() {
    if( this.options.ctrlProgress ) {
      this.ctrlProgress.style.width = this.current * ( 100 / this.fieldsCount ) + '%';
    }
  };

  /**
   * updateNav function
   * updates the navigation dots
   */
  FForm.prototype._updateNav = function() {
    if( this.options.ctrlNavDots ) {
      $(this.ctrlNav).children('button.fs-dot-current').removeClass('fs-dot-current');
      $(this.ctrlNavDots[this.current]).addClass('fs-dot-current');
      this.ctrlNavDots[ this.current ].disabled = false;
    }
  };

  /**
   * showCtrl function
   * shows a control
   */
  FForm.prototype._showCtrl = function( ctrl ) {
    $(ctrl).addClass('fs-show');
  };

  /**
   * hideCtrl function
   * hides a control
   */
  FForm.prototype._hideCtrl = function( ctrl ) {
    $(ctrl).removeClass('fs-show');
  };

  // TODO: this is a very basic validation function. Only checks for required fields..
  FForm.prototype._validade = function() {
    var fld = this.fields[ this.current ],
    input = fld.querySelector( 'input[required]' )    ||
      fld.querySelector( 'textarea[required]' ) ||
      fld.querySelector( 'select[required]' ),
    error;

    if( !input ) return true;

    switch( input.tagName.toLowerCase() ) {
      case 'input' :
        if( input.type === 'radio' || input.type === 'checkbox' ) {
        var checked = 0;
        [].slice.call( fld.querySelectorAll( 'input[type="' + input.type + '"]' ) ).forEach( function( inp ) {
          if( inp.checked ) {
            ++checked;
          }
        } );
        if( !checked ) {
          error = 'NOVAL';
        }
      }
      else if( input.value === '' ) {
        error = 'NOVAL';
      }
      break;

      case 'select' :
        // assuming here '' or '-1' only
        if( input.value === '' || input.value === '-1' ) {
        error = 'NOVAL';
      }
      break;

      case 'textarea' :
        if( input.value === '' ) {
        error = 'NOVAL';
      }
      break;
    }

    if( error !== undefined ) {
      this._showError( error );
      return false;
    }

    return true;
  };

  // TODO
  FForm.prototype._showError = function( err ) {
    var message = '';
    switch( err ) {
      case 'NOVAL' :
        message = 'Please fill the field before continuing';
      break;
      case 'INVALIDEMAIL' :
        message = 'Please fill a valid email address';
      break;
      case 'TOOMANY' :
        message = 'Please choose maximum 5 words';
      break;
      // ...
    }
    this.msgError.innerHTML = message;
    this._showCtrl( this.msgError );
  };

  // clears/hides the current error message
  FForm.prototype._clearError = function() {
    this._hideCtrl( this.msgError );
  };

  // Checks if the field is the last field before submit
  FForm.prototype._isLastStep = function() {
    return this.current === this.fieldsCount - 1;
  };

  FForm.prototype.render = function() {
    var self = this;
    self._init();
    self._initEvents();
  };

  FForm.prototype.reset = function() {
    var self = this;
    $(this.fields).removeClass('fs-current fs-show');
    self._init();
  };
  // add to global namespace
  window.FForm = FForm;

})( window );
