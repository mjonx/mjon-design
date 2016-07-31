
// Parallax Page Slider Plugin
(function($){
	"use strict";

	// Defaults
	var defaults = {
		itemSelector 		: '.single-page',
		speed 				: 1500,
		easign 				: 'easeInOutCubic',
		activeClass			: 'active',
		leftItemsClass		: 'left-items',
		rightItemsClass		: 'right-items',
		initItem			: 0,
		baseWidthWrapper	: $(window),
		onInit				: function(e){},
		beforeMove			: function(e){},
		afterMove			: function(e){}
	};

	function ParallaxSlider($elem, opts){

		var _this = this;

		_this.config = $.extend({}, defaults, opts);

		_this.getSecond = function(mili) {
			return ( mili / 1000 )+'s';
		};

		_this.infoOpts = {
			element 		: $elem,
			slides 			: $elem.find( _this.config.itemSelector ),
			current 		: _this.config.initItem,
			slideTime		: _this.getSecond( _this.config.speed ),
			slidesWidth		: _this.config.baseWidthWrapper.width()
		};

		_this.infoOpts.transitioning = false;

		if ( _this.infoOpts.slides.length < 1 ) {
			return false;
		}


		_this.publicFuns = {
			nextSlide : function(){
				if ( _this.infoOpts.transitioning === true ) { return false; }
				var oldSlideNumber = _this.infoOpts.current;
				++_this.infoOpts.current;
				var newSlideNumber = _this.infoOpts.current;
				_this.animate(oldSlideNumber, newSlideNumber, false);
				return _this.publicFuns;
			},

			prevSlide : function(){
				if ( _this.infoOpts.transitioning === true ) { return false; }
				var oldSlideNumber = _this.infoOpts.current;
				--_this.infoOpts.current;
				var newSlideNumber = _this.infoOpts.current;
				_this.animate(oldSlideNumber, newSlideNumber, false);
				return _this.publicFuns;
			},

			goToSlide : function( slideNumber ){
				if ( _this.infoOpts.transitioning === true ) { return false; }
				var oldSlideNumber = _this.infoOpts.current, newSlideNumber = slideNumber;
				_this.animate(oldSlideNumber, newSlideNumber, false);
				return _this.publicFuns;
			},

			jumbToSlide : function( slideNumber ){
				if ( _this.infoOpts.transitioning === true ) { return false; }
				var oldSlideNumber = _this.infoOpts.current, newSlideNumber = slideNumber;
				_this.animate(oldSlideNumber, newSlideNumber, true);
				return _this.publicFuns;
			},

			slides : _this.infoOpts.slides.length
		};

		_this.infoOpts.element.bind('sliderResize', function(e){
			_this.infoOpts.slidesWidth = _this.config.baseWidthWrapper.width();
		});

		$(window).bind('resize', function(e) {
			window.resizeEvt;
			$(window).resize(function(){
				clearTimeout(window.resizeEvt);
				window.resizeEvt = setTimeout(function() {
					_this.infoOpts.element.trigger('sliderResize');
				}, 150);
			});
		});

		_this.coreFuns( _this.infoOpts, _this.config ).init();

		_this.infoOpts.element.bind('sliderResize', function(e){
			_this.coreFuns( _this.infoOpts, _this.config ).init(true);
		});


		return _this.publicFuns;
	}

	ParallaxSlider.prototype.coreFuns = function( infoOpts, config ){
		var _this = this, current = 0;

		_this.validateCurrent = function( current ) {
			current = ( current % infoOpts.slides.length );
			if ( current < 0 ) {
				current = ( infoOpts.slides.length-1 );
			}

			infoOpts.current = current;

			return infoOpts.current;
		};

		_this.getPos = function( itemNumber ){
			return '-'+(itemNumber * infoOpts.slidesWidth)+'px';
		};

		_this.getParallaxPos = function(item){
			var pos = '';

			if ( item.index() > infoOpts.current ) {

				pos = '-'+( ( item.index() - infoOpts.current ) * (infoOpts.slidesWidth / 2) )+'px';
				
			} else if ( item.index() < infoOpts.current ) {

				pos = ( (  infoOpts.current - item.index() ) * (infoOpts.slidesWidth / 2) )+'px';

			} else {
				pos = '0px';
			}

			return pos;
		};

		_this.setSlider = function(){
			var pos = this.getPos( infoOpts.current );
			infoOpts.element.css('left' , pos);
		};

		_this.init = function(reInit){

			infoOpts.element.addClass('p-slider').width( infoOpts.slidesWidth * infoOpts.slides.length );

			infoOpts.slides.each(function(){
				var className = 'p-slider-item p-slider-item-' + $(this).index();
				$(this).addClass( className ).width( infoOpts.slidesWidth );
			});


			infoOpts.slides.each(function(){

				var pos = _this.getParallaxPos($(this));

				$(this).find('.bg-image').css('left', pos);

			});

			_this.setSlider();

			if ( reInit ) {
				infoOpts.element.css('transition', 'all 0s').trigger('parallaxSlider.reInit', {
					'current' : infoOpts.slides.eq( infoOpts.current ),
					'currentIndex' : infoOpts.current,
					'slides' : infoOpts.slides.length
				});
			} else {
				infoOpts.element.trigger('parallaxSlider.init', {
					'current' : infoOpts.slides.eq( infoOpts.current ),
					'currentIndex' : infoOpts.current,
					'slides' : infoOpts.slides.length
				});
			}


			return this;
		};

		_this.animate = function( oldSlideNumber, newSlideNumber, quick ){

			var slideTime = infoOpts.slideTime;
			var speed = config.speed;

			if ( quick ) {
				slideTime = '0s';
				speed = 0;
			}

			
			var slideNumber = _this.validateCurrent(newSlideNumber), pos = _this.getPos( slideNumber ), callback = true;

			_this.infoOpts.transitioning = true;

			infoOpts.element.trigger('parallaxSlider.beforeMove', {
				'current' : infoOpts.slides.eq(oldSlideNumber),
				'currentIndex' : oldSlideNumber,
				'next' : infoOpts.slides.eq(slideNumber),
				'nextIndex' : slideNumber,
				'slides' : infoOpts.slides.length
			}).animate({
				'left' : pos
			}, speed);

			var handler = setTimeout(function(){

				_this.infoOpts.transitioning = false;


				infoOpts.slides.eq(oldSlideNumber).find('.page-content-section').scrollTop(0);


				infoOpts.element.trigger('parallaxSlider.afterMove', {
					'current' : infoOpts.slides.eq(slideNumber),
					'currentIndex' : slideNumber,
					'prev' : infoOpts.slides.eq(oldSlideNumber),
					'prevIndex' : oldSlideNumber,
					'slides' : infoOpts.slides.length
				});

				clearTimeout(handler);

			}, speed );


			infoOpts.slides.each(function(){

				var pos = _this.getParallaxPos($(this));
				
				$(this).find('.bg-image').animate({
					'left' : pos
				}, speed);

			});
		};

		return _this;
	};


	$.fn.parallaxSlider = function(opts){
		var $elem = $(this).first();
		var parallaxSliderInits  = new ParallaxSlider($elem, opts);
		$(this).data('ParallaxSlider', parallaxSliderInits);
		return $(this).first();
	};

}(jQuery));




// Counting Plugin
(function($){
	"use strict";

	// Defaults
	var defaults = {
		'time': 1500,
		'delay': 20
	};

	var CounterUp = function($elem, opts) {
		
		var config = $.extend(defaults, opts);

		$elem.each(function(){

		    // Store the object
		    var $this = $(this),
	        	nums = [],
	        	divisions = config.time / config.delay,
	        	num = $this.text(),
	        	isComma = /[0-9]+,[0-9]+/.test(num);

	        num = num.replace(/,/g, '');

	        var isInt = /^[0-9]+$/.test(num),
	        	isFloat = /^[0-9]+\.[0-9]+$/.test(num),
	        	decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0;

	        // Generate list of incremental numbers to display
	        for (var i = divisions; i >= 1; i--) {

	            // Preserve as int if input was int
	            var newNum = parseInt(num / divisions * i, 10);

	            // Preserve float if input was float
	            if (isFloat) {
	                newNum = parseFloat(num / divisions * i).toFixed(decimalPlaces);
	            }

	            // Preserve commas if input had commas
	            if (isComma) {
	                while (/(\d+)(\d{3})/.test(newNum.toString())) {
	                    newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	                }
	            }

	            nums.unshift(newNum);
	        }

	        $this.data('countUpNumbs', nums);
	        $this.text('0');

	        // Updates the number until we're done
	        var f = function() {
	            $this.text($this.data('countUpNumbs').shift());
	            if ($this.data('countUpNumbs').length) {
	                setTimeout($this.data('countUpFuns'), config.delay);
	            } else {
	                delete $this.data('countUpNumbs');
	                $this.data('countUpNumbs', null);
	                $this.data('countUpFuns', null);
	            }
	        };
	        $this.data('countUpFuns', f);

	        // Start the count up
	        setTimeout($this.data('countUpFuns'), config.delay);
		});
		
	};


	$.fn.counterUp = function( opts ) {
		var $elem = $(this);
		new CounterUp($elem, opts);
		return $elem;
	};

}(jQuery));




// for get max height
(function($){

	$.fn.getMaxHeight = function() {

		var _array = [];

		$(this).each(function(){

			_array.push( $(this).height() );

		});

		return Math.max.apply(Math,_array);

	};

}(jQuery));




// For remove html inline single style
(function($){

    $.fn.removeStyle = function(style) {
        var search = new RegExp(style + '[^;]+;?', 'g');

        if ( search ) {
	        return this.each(function() {
	            $(this).attr('style', function(i, style) {
	            	if ( style ) {
	                	return style.replace(search, '');
	            	}
	            });
	        });
        }

    };
}(jQuery));




// For Browser detect
(function(win){
	win.browser = {};
	win.browser.isOpera = !!win.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	win.browser.isFirefox = typeof InstallTrigger !== 'undefined';
	win.browser.isSafari = Object.prototype.toString.call(win.HTMLElement).indexOf('Constructor') > 0;
	win.browser.isChrome = !!win.chrome && !win.browser.isOpera;
	win.browser.isIE = /*@cc_on!@*/false || !!document.documentMode;
	win.platform = {};
	win.platform.isMac = navigator.userAgent.indexOf('Mac') > -1;
}(window));





// For Parallax Star BG
var starsBG = {

	init: function() {
		var widget = this;
		widget.opts = {
			wrapperIDSelector : 'skyBG',
			starSelectorClass : "layer",
			classes : [
				{
					className: 'star1',
					dataDepth: '0.40'
				},
				{
					className: 'star2',
					dataDepth: '0.32'
				},
				{
					className: 'star3',
					dataDepth: '0.20'
				},
				{
					className: 'star4',
					dataDepth: '0.32'
				}
			]
		};

		widget.opts.wrapper =  $('#'+widget.opts.wrapperIDSelector);
		widget.opts.wrpWidth =  widget.opts.wrapper.width();
		widget.opts.wrpHeight =  widget.opts.wrapper.height();

		return widget;
	},

	creteStars: function() {
		var widget = this;
		for (var i = 0; i < 200; i++) {
		    var posx = (Math.random() * widget.opts.wrpWidth ).toFixed();
		    var posy = (Math.random() * widget.opts.wrpHeight ).toFixed();
		    var classNumb = Math.floor(Math.random() * widget.opts.classes.length );

			$('<div class="' + widget.opts.starSelectorClass + '" data-depth="' + widget.opts.classes[classNumb].dataDepth + '"><div class="star ' + widget.opts.classes[classNumb].className + '"></div></div>').css({
		        'position':'absolute',
		        'margin-left':posx+'px',
		        'margin-top':posy+'px'
			}).appendTo('#'+widget.opts.wrapperIDSelector);
		}

		var skyBG = document.getElementById(widget.opts.wrapperIDSelector);
		window.skyBG = new Parallax(skyBG);

		return widget;
	},

	updateStars: function() {
		var widget = this;

		widget.opts.wrpWidth =  widget.opts.wrapper.width();
		widget.opts.wrpHeight =  widget.opts.wrapper.height();

		var layers = widget.opts.wrapper.find('.'+widget.opts.starSelectorClass);

		for (var i = 0; i < 200; i++) {
		    var posx = (Math.random() * widget.opts.wrpWidth ).toFixed();
		    var posy = (Math.random() * widget.opts.wrpHeight ).toFixed();
		    var classNumb = Math.floor(Math.random() * widget.opts.classes.length );

		   layers.eq(i).css({
		        'margin-left':posx+'px',
		        'margin-top':posy+'px'
			});
		}
		
		return this;

	}
};





// For Smooth scroll
var scrollDistance = 50,
	finalScroll = 0,
	scrollTime = 400,
	totalDelta = 0;

function mouseWheelFun(e) {
	var $this = $(this);
	e.preventDefault();
	e.stopImmediatePropagation();
	var scrollTop = $this.scrollTop();
	var delta = e.originalEvent.wheelDelta/120 || -e.originalEvent.detail/3;
	totalDelta++;

	if ( delta > 0 ) {
		finalScroll = (scrollTop - ( scrollDistance * totalDelta) );
	} else {
		finalScroll = (scrollTop + ( scrollDistance * totalDelta) );
	}


	if ( totalDelta > 7 ) {
		totalDelta = 7;
	}

	var totalScrollTime = scrollTime*totalDelta;

	if ( totalScrollTime > 750 ) {
		totalScrollTime = 750;
	}


	$this.stop().animate({
		'scrollTop' : finalScroll+'px'
	}, totalScrollTime, 'easeOutQuart', function(){
		totalDelta = 0;
	});
}





// menu functionality
var menu = {

	init : function(){
		this.opts = {
			container : $('body'),
			menuSection : $('.menu-page')
		};
	},

	showMenu : function(){
		var menu = this;

		menu.opts.container.removeClass('menu-close').addClass('menu-open');
		menu.opts.menuSection.addClass('show-menu-contents');
	},

	hideMenu : function(){
		var menu = this;

		menu.opts.menuSection.removeClass('show-menu-contents');
		var handler = setTimeout(function(){
			menu.opts.container.removeClass('menu-open').addClass('menu-close');
			clearTimeout(handler);
		}, 180);
	}
};