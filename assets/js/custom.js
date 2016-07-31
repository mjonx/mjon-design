// Map style
var mapStyle = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#0C0D10"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#0C0D10"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#0C0D10"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#0C0D10"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#0C0D10"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0C0D10"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#0C0D10"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0C0D10"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#0C0D10"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#0C0D10"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#0C0D10"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0C0D10"},{"lightness":17}]}];





// Browser Conditions
function browsersCondition(){
	if( (!$.browser.mobile || !('ontouchstart' in window)) && (window.browser.isFirefox || window.browser.isChrome ) ) {
		window.browserCon = 'conFull';
	} else if( (!$.browser.mobile || !('ontouchstart' in window)) && (window.browser.isOpera || window.browser.isSafari || window.browser.isIE ) ) {
		window.browserCon = 'conHalf';
	} else {
		window.browserCon = 'conNone';
	}
}

browsersCondition();




// add page classes to body
function addBodyCurrentPageClass(currentIndex, items) {

	var classes = '';

	for (var i = 1; i <= items; i++) {
		classes += 'parallax-page-'+i+' ';
	}

	var bodyClass = 'parallax-page-'+(currentIndex+1);

	$('body').removeClass(classes).addClass(bodyClass);

}



// on scroll banner animations
function scrollFun(e) {

	var elem = e.data.elem,
		scrollTop = e.currentTarget.scrollTop;


	if ( browserCon === 'conFull' ) {

		if ( !elemImage.hasClass('inScroll') ) {
			elemImage.addClass('inScroll');
		}

		if ( !elemColor.hasClass('inScroll') ) {
			elemColor.addClass('inScroll');
		}

	} else if( browserCon === 'conHalf' ) {

		if ( !elemColor.hasClass('inScroll') ) {
			elemColor.addClass('inScroll');
		}

	}



	if ( scrollTop <= (winHeight - 50) ) {

		// remove the body scroll class
		$('body').removeClass('bottom-section');

		if ( !$.browser.mobile ) {
			var opaciryVal = (1-(scrollTop/winHeight*1.3)),
			cOpaciryVal = (1-(scrollTop/winHeight)),
			backgroundPos = (scrollTop/8),
			transformPos = (scrollTop/1.3);

			if ( browserCon === 'conFull' ) {

				elemContent.css({
					'opacity': opaciryVal
				});

				elemImage.css({
					'transform': 'translateY(-'+backgroundPos+'px)'
				});


				elemContentWrapper.css({
					'transform': 'translateY('+transformPos+'px)'
				});

				elemColor.css({
					'opacity': cOpaciryVal
				});

			} else if( browserCon === 'conHalf' ) {

				elemColor.css({
					'opacity': cOpaciryVal
				});

			}

		}

		if ( winWidth < 992 ) {
			var transformPos2 = (scrollTop*1.2);

			elemMenu.css({
				'margin-top': ('-'+transformPos2+'px')
			});
		}

	} else {

		// add the body scroll class
		$('body').addClass('bottom-section');

	}

}



// function for call the smooth scroll and banner animation
function layoutAnimation(elem, callbackMode) {

	if ( callbackMode === 'init' || callbackMode === 'afterMove' ) {
		window.winHeight = $(window).height();
		window.winWidth = $(window).width();
		window.elemMenu = $('.right-menu');


		if ( browserCon === 'conHalf' ) {

			window.elemColor = elem.current.find('.bg-color');

		} else if( browserCon === 'conFull' ) {

			window.elemContent = elem.current.find('.page-content-section-area');
			window.elemImage = elem.current.find('.bg-image');
			window.elemContentWrapper = elem.current.find('.page-content-section-area .page-content-wrapper');
			window.elemColor = elem.current.find('.bg-color');

		}


		if ( callbackMode === 'afterMove' ) {

			if ( browserCon === 'conFull' ) {

				elem.prev.find('.bg-color').removeClass('inScroll').removeStyle('opacity');
				elem.prev.find('.bg-image').css({
					'transform' : 'translateY(0px)'
				});

				elem.prev.find('.page-content-section-area').removeStyle('opacity');

				elem.prev.find('.page-content-section-area .page-content-wrapper').css({
					'transform' : 'translateY(0px)'
				});

			} else if ( browserCon === 'conHalf' ) {

				elem.prev.find('.bg-color').removeClass('inScroll').removeStyle('opacity');

			}

			elemMenu.css({
				'margin-top' : '0px'
			});



			if ( (browserCon === 'conFull') && (!platform.isMac) ) {

				elem.prev.find('.page-content-section').unbind("mousewheel DOMMouseScroll", {elem: elem}, mouseWheelFun);

			}

			elem.prev.find('.page-content-section').unbind('scroll', scrollFun);

		}

		if ( (browserCon === 'conFull') && (!platform.isMac) ) {

			elem.current.find('.page-content-section').bind("mousewheel DOMMouseScroll", {elem: elem}, mouseWheelFun);

		}

		elem.current.find('.page-content-section').bind('scroll', {elem: elem, callbackMode : callbackMode}, scrollFun);
	}

	if ( callbackMode === 'beforeMove' ) {
		if ( browserCon === 'conFull' ) {
			elem.current.find('.bg-image').removeClass('inScroll');
			elem.current.find('.bg-color').removeClass('inScroll');
		} else if ( browserCon === 'conHalf' ) {
			elem.current.find('.bg-color').removeClass('inScroll');
		}
	}
}


// smooth animation on textarea and iframe
if ( (browserCon === 'conFull') && (!platform.isMac) ) {
	$('textarea, iframe').on('mousewheel DOMMouseScroll', function(e){
		$(this).bind("mousewheel DOMMouseScroll", mouseWheelFun);
	});
}


// textarea max width
function contactSecsHeightFix(){
	var contactSecs = $('.contact-form, .contact-info-wrapper');
	var contactSecsMaxHeight = contactSecs.getMaxHeight();
	contactSecs.height(contactSecsMaxHeight);
}





// Callback after window load
$(window).load(function(){


	// Hide the loader and Show the Pages
	$('#loader').fadeOut(500, function() {

		// Parallax Slider Functionality
		var pages = $('#pages'), menuLinks = $('.on-page-menu li');



		// ============================ Start Parallax Slider Callbacks ===============================

		// Callback after parallax slider init
		pages.on('parallaxSlider.init', function(e, elem) {


			// initial banner animation and trigger the current menu link
			elem.current.addClass('active').siblings().removeClass('active');
			menuLinks.eq(elem.currentIndex).addClass('active').siblings('li').removeClass('active');

			var handler = setTimeout(function(){
				elem.current.find('.js-animated').addClass('animate');
				clearTimeout(handler);
			}, 1300);


			// adding body class
			addBodyCurrentPageClass(elem.currentIndex, elem.slides);


			// smooth scroll and banner animation init
			layoutAnimation(elem, 'init');


			// Count up statistics
			$('.statistic-section').waypoint({
				handler: function() {
					var $countNumbs = $('.js-count-numb');
					if ( $countNumbs.length > 0 ) {
						$countNumbs.counterUp();
					}
				},
				context: '.page-content-section',
				offset: '100%',
				triggerOnce: true
			});



			// Skills Animation
			$('.skill-lists').waypoint({
				handler: function() {
					var items = $(this).find('.bar-inner');
					if ( items.length >= 0 ) {
						var delay = 0;
						items.each(function(){
							var $this = $(this);
							var animationWidth = $this.data('width')+'%';

							$this.delay(delay).animate({
								'width' : animationWidth
							}, 1200, 'easeInOutQuad');

							delay+=130;
						});
					}
				},
				context: '.page-content-section',
				offset: '80%',
				triggerOnce: true
			});



			// fix contact section max height
			contactSecsHeightFix();



			// call to portfolio isotop to relayout
			$('#protfolio-msnry').isotope('layout');



			/*===================================================================
			=====================================================================

					WRITE YOUR SCRIPTS : PLACE 01

			=====================================================================
			===================================================================*/

		});

		// Callback after parallax slider reinit ( after window resize )
		pages.on('parallaxSlider.reInit', function(e, elem) {

			// call to portfolio isotop to relayout
			$('#protfolio-msnry').isotope('layout');


			// fix contact section max height
			contactSecsHeightFix();

		});

		// Callback before parallax slider move
		pages.on('parallaxSlider.beforeMove', function(e, elem) {

			// update the right menu current link
			menuLinks.eq(elem.nextIndex).addClass('active').siblings('li').removeClass('active');


			// update the parallax menu current link
			var item = $('.menu.parallax-menu').children('.lavalamp-item').eq(elem.nextIndex);
			$('.menu.parallax-menu').data('active', item).lavalamp('update');
			item.addClass('active').siblings().removeClass('active');


			// smooth scroll and banner animation update
			layoutAnimation(elem, 'beforeMove');

		});

		// Callback after parallax slider move
		pages.on('parallaxSlider.afterMove', function(e, elem) {

			// update the parallax page classes
			elem.current.addClass('active').find('.js-animated').addClass('animate');
			elem.current.siblings().removeClass('active').find('.js-animated').removeClass('animate');


			// smooth scroll and banner animation update
			layoutAnimation(elem, 'afterMove');


			// adding body class
			addBodyCurrentPageClass(elem.currentIndex, elem.slides);


			// remove the body scroll class
			$('body').removeClass('bottom-section');

		});

		// ============================ End Parallax Slider Callbacks ===============================



		// call to the parallax slider plugin

		pages.parallaxSlider({
			speed : 1200
		});



		// Make the parallax slider data Global
		window.sliderData = pages.data('ParallaxSlider');



		// Left menu
		menuLinks.find('a').click(function(e){
			e.preventDefault();
			sliderData.goToSlide( $(this).parent('li').index() );
		});

	});

});




// Callback after document ready
$(document).ready(function(){


	// Resume Page section navigation
	(function(){

		var leftBar = $('.resume-left-area').first(),
			resumeSections = $('.resume-sec'),
			firstHeading = $('.resume-sec-title-wrapper').first();

		$('.resume .page-content-section').scroll(function(e){
			var leftBarWidth = leftBar.outerWidth(true),
				headingPosTop = firstHeading.position().top;

			resumeSections.each(function(){
				var $this = $(this),
					heading = $this.find('.resume-sec-title-wrapper'),
					posTop = heading.parent().position().top,
					offsetTop = heading.parent().offset().top;

				if ( $this.offset().top <= 0 ) {

					if ($(window).width() >= 991) {

						if ( offsetTop <= posTop ) {
							heading.css({
								'position' : 'fixed',
								'top' : headingPosTop+'px',
								'left' : '0px',
								'width' : leftBarWidth+'px'
							});
						}

					} else {

						offsetTop = heading.offset().top;

						if ( offsetTop <= 0 ) {
							heading.css({
								'position' : 'fixed',
								'top' : '0px',
								'left' : '0px',
								'width' : leftBarWidth+'px'
							});
						}

						if ( $this.offset().top > (-(heading.parent().height()-heading.height()/2)) && offsetTop === 0) {
							heading.css({
								'position' : 'relative',
								'top' : '0px',
								'left' : '0px',
								'width' : 'auto'
							});
						}

					}

				} else {

					heading.css({
						'position' : 'relative',
						'top' : '0px',
						'left' : '0px',
						'width' : 'auto'
					});
				}

			});
		});

	}());



	// Testimonial Slider
	(function(){

		var testimonial_slider_obj = {},
			thumbLists = $('#testimonial-thumb-ctrl li');

		testimonial_slider_obj.beforeMoveCallback = function(){
			var currentIndex = this.currentItem;
			thumbLists.removeClass('active').eq(currentIndex).addClass('active');
		};

		var $testimonial_slider = $('#testimonial');

		if ( $testimonial_slider.length > 0 ) {

			$testimonial_slider.owlCarousel({

			    stopOnHover : true,
				slideSpeed : 800,
				singleItem : true,
				pagination : false,
				afterMove : testimonial_slider_obj.beforeMoveCallback

			});

			testimonial_slider_obj.slider = $testimonial_slider.data('owlCarousel');

			$('#testimonial-thumb-ctrl li a').on('click', function(e){

				e.preventDefault();
				var userSlide = $(this).parent().index();
				testimonial_slider_obj.slider.goTo(userSlide);

			});
		}

	}());



	// Work Slider
	(function(){

		var work_style_slider_obj = {},
			currentSlide = $('.current-counter'),
			slidesCount = $('.total-slides'),
			nextBtn = $('.why-best-slider-controller .next-slide-btn');

		work_style_slider_obj.beforeMoveCallback = function(){
			var slider = this;
			currentSlide.text(slider.currentItem+1);
		};

		work_style_slider_obj.afterInitCallback = function(){

			var slider = this;
			slidesCount.text(slider.itemsAmount);

		};

		var $working_styles_slider = $('#why-best-slider');

		if ( $working_styles_slider.length > 0 ) {

			$working_styles_slider.owlCarousel({

				slideSpeed : 1000,
				singleItem : true,
				pagination : false,
				beforeMove : work_style_slider_obj.beforeMoveCallback,
				afterInit : work_style_slider_obj.afterInitCallback

			});

			work_style_slider_obj.slider = $working_styles_slider.data('owlCarousel');

			nextBtn.on('click', function(e){

				e.preventDefault();
				work_style_slider_obj.slider.next();

			});
		}

	}());




	// pages parallax init
	var pagesWrapper = document.getElementById('wrapper');
	parallax = new Parallax(pagesWrapper);



	// Menu page functions
	menu.init();

	$('#menu-open').click(function(e){
		e.preventDefault();
		menu.showMenu();
	});

	$('#menu-close').click(function(e){
		e.preventDefault();
		menu.hideMenu();
	});

	$('.parallax-menu').lavalamp({

		duration: 400,
		updateTime: 10,
		activeObj: '.active'

	}).find('li a').on('click', function(e){
		var $this = $(this);

		e.preventDefault();

		menu.hideMenu();

		setTimeout(function(){
			sliderData.jumbToSlide( $this.parent().index()-1 );
		}, 0);
	});



	// Make Stars and Menu page stars parallax init
	starsBG.init().creteStars();



	// portfolio Mesonary
	if ( $('#protfolio-msnry').length > 0 ) {

		// Call to mesonary plugin
		var portfolioMsnry = $('#protfolio-msnry').isotope({
			itemSelector: '.single-port-item',
			layoutMode: 'fitRows',
			transitionDuration: '.6s',
			hiddenStyle: {
				opacity: 0,
				transform: "scale(.85)"
			},
			visibleStyle: {
				opacity: 1,
				transform: "scale(1)"
			}
		});


		// Filtering the portfolio items
		$('#portfolio-msnry-sort a').on( 'click', function(e) {

			e.preventDefault();

			var $this = $(this);

			if ( $this.parent('li').hasClass('active') ) {
				return false;
			} else {
				$this.parent('li').addClass('active').siblings('li').removeClass('active');
			}

			var filterValue = $this.data('target');

			portfolioMsnry.isotope({ filter: filterValue });
			return $this;

		});


		// Portfolio details Popup modals
		$('#portfolioModal').on('show.bs.modal', function (event) {

			var button = $(event.relatedTarget),
			title = button.data('title'),
			description = button.data('description'),
			imageSrc = button.data('image'),
			link = button.data('link'),
			modal = $(this);

			if ( title ) {
				modal.find('.modal-title').text(title);
			}

			if ( description ) {
				modal.find('.modal-body .description').html("<p>"+description+"</p>");
			}

			if ( imageSrc ) {
				modal.find('.modal-body .portfolio-image').attr('src', imageSrc);
			}

			if ( link ) {
				modal.find('.js-portfolio-link').show().attr('href', link);
			} else {
				modal.find('.js-portfolio-link').hide();
			}


		});

	}



	// Google Map

	// Edit this place as you need
	var gMap = {
		lat : 23.79473005386213, // latitude
		lng : 90.41430473327637, // longitude
		icon : 'img/marker-icon.png', // Map Icon
		content : '<p>Coder Pixel Ltd, Dhaka, Bangladesh</p>' // Map Content
	};

	var $mapWrapper = $('#map'), draggableOp = ( jQuery.browser.mobile === true ) ? false : true;

	if ( $mapWrapper.length > 0 ) {

		if ( typeof GMaps !== "undefined" ) {
			var map = new GMaps({
				div: '#map',
				lat : gMap.lat,
				lng : gMap.lng,
				scrollwheel: false,
				draggable: draggableOp,
				zoom: 17,
				disableDefaultUI: true,
				styles : mapStyle
			});

			map.addMarker({
				lat : gMap.lat,
				lng : gMap.lng,
				icon: gMap.icon,
				infoWindow: {
					content: gMap.content
				}
			});
		}
	}




	// Sectino page link
	$('.page-link').on('click', function(e){
		e.preventDefault();
		var pageLink = parseInt($(this).data('page'), 10);
		if ( pageLink ) {
			sliderData.goToSlide(pageLink);
			return $(this);
		} else {
			return false;
		}
	});



	// Contact form
	$('#contact-form').on('submit', function(e){

		e.preventDefault();

		var $this = $(this),

			data = $(this).serialize(),

			name = $this.find('#contact-name'),
			email = $this.find('#contact-email'),
			message = $this.find('#contact-message'),
			loader = $this.find('.form-loader-area'),

			submitBtn = $this.find('button[type="submit"]'),
			submitBtnText = $this.find('button[type="submit"] span').text();

		submitBtn.attr('disabled', 'disabled').find('span').text("Sending..");

		function success(response) {

			swal("Thanks!", "Your message has been sent successfully!", "success");
			$this.find("input, textarea").val("");
			$this.find('.input-group.success, .input-group.error').removeClass('success error');

		}


		function error(response) {

			$this.find('.input-group.success, .input-group.error').removeClass('success error');

			if ( response.name ) {
				name.closest('.input-group').removeClass('success').addClass('error');
			} else {
				name.closest('.input-group').removeClass('error').addClass('success');
			}

			if ( response.email ) {
				email.closest('.input-group').removeClass('success').addClass('error');
			} else {
				email.closest('.input-group').removeClass('error').addClass('success');
			}

			if ( response.message ) {
				message.closest('.input-group').removeClass('success').addClass('error');
			} else {
				message.closest('.input-group').removeClass('error').addClass('success');
			}

		}


		$.ajax({

			type: "POST",
			url: "inc/sendEmail.php",
			data: data

		}).done(function(res){

			var response = JSON.parse(res);

			if ( response.OK ) {
				success(response);
			} else {
				error(response);
			}

			var hand = setTimeout(function(){
				loader.hide();
				submitBtn.removeAttr('disabled').find('span').text(submitBtnText);
				clearTimeout(hand);
			}, 1000);


		}).fail(function(){

			sweetAlert("Oops...", "Something went wrong, Try again later!", "error");

			var hand = setTimeout(function(){
				loader.hide();
				submitBtn.removeAttr('disabled').find('span').text(submitBtnText);
				clearTimeout(hand);
			}, 1000);

		});
	});



	// Banner Mouse scroll button click
	$('.mouse-scroll').click(function(e){
		e.preventDefault();
		var $this = $(this);
		var page = $this.closest('.page-content-section');
		var bottomPage = page.find('.page-content-section-bottom');
		page.animate({
			'scrollTop' : bottomPage.offset().top
		}, 800, 'easeInOutQuad');
	});


	/*===================================================================
	=====================================================================

			WRITE YOUR SCRIPTS : PLACE 02

	=====================================================================
	===================================================================*/

});


// Callback after window resize
$(window).resize(function(){
	starsBG.updateStars();
	window.winHeight = $(window).height();
	window.winWidth = $(window).width();
});
