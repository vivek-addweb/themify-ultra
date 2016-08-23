/* Themify Theme Scripts - http://themify.me/ */

// Declar object literals and variables
var FixedHeader = {}, LayoutAndFilter = {}, themifyScript, ThemifySlider, ThemifyMediaElement, qp_max_pages;

// throttledresize
!function($){var e=$.event,t,n={_:0},r=0,s,i;t=e.special.throttledresize={setup:function(){$(this).on("resize",t.handler)},teardown:function(){$(this).off("resize",t.handler)},handler:function(h,o){var a=this,l=arguments;s=!0,i||(setInterval(function(){r++,(r>t.threshold&&s||o)&&(h.type="throttledresize",e.dispatch.apply(a,l),s=!1,r=0),r>9&&($(n).stop(),i=!1,r=0)},30),i=!0)},threshold:0}}(jQuery);

// debouncedresize event
(function($){var $event=$.event,$special,resizeTimeout;$special=$event.special.debouncedresize={setup:function(){$(this).on("resize",$special.handler);},teardown:function(){$(this).off("resize",$special.handler);},handler:function(event,execAsap){var context=this,args=arguments,dispatch=function(){event.type="debouncedresize";$event.dispatch.apply(context,args);};if(resizeTimeout){clearTimeout(resizeTimeout);}execAsap?dispatch():resizeTimeout=setTimeout(dispatch,$special.threshold);},threshold:150};})(jQuery);

(function($){
	
	var $sections = $('.type-section'),
		isFullPageScroll = ('undefined' !== typeof $.fn.fullpage) && (themifyScript.fullPageScroll ? true : false) && ($sections.length > 0),
		usesRows = $sections.length === 0,
		sectionClass = '.section-post',
		sectionsWrapper = '#loops-wrapper',
		wowInit2;

// Setup variables if it uses Builder rows instead of section post type
	if (usesRows) {
		isFullPageScroll = ('undefined' !== typeof $.fn.fullpage) && (themifyScript.fullPageScroll ? true : false) && ($('.themify_builder').length > 0) && $('body').hasClass('full-section-scrolling');
		sectionClass = '.themify_builder_row';
		sectionsWrapper = '.themify_builder_content';
	}
// Fixed Header /////////////////////////
FixedHeader = {
	headerHeight: 0,
	hasHeaderSlider: false,
	headerSlider: false,
	init: function() {
		FixedHeader.calculateHeaderHeight();
		if( '' !== themifyScript.fixedHeader ) {
			if(isFullPageScroll){
				$('body').on('themify_onepage_afterload',function (event, $section, section_id){
					var $is_scroll = $(sectionClass + '.active', $(sectionsWrapper)).index()>0
					FixedHeader.activate($is_scroll);
					if($is_scroll){
						var $height =  FixedHeader.headerHeight;
						FixedHeader.calculateHeaderHeight();
						if($height !=FixedHeader.headerHeight){
							$('#pagewrap').css('paddingTop', Math.floor( FixedHeader.headerHeight ));
						}
					}
				});
			}
			else{
				FixedHeader.activate(false);
				$(window).on('scroll touchstart.touchScroll touchmove.touchScroll', function(e){
					FixedHeader.activate(false);
				});
			}
		}
		$(window).on( 'debouncedresize', function(e) {
			if(!e.isTrigger){
				FixedHeader.calculateHeaderHeight();
				$('#pagewrap').css('paddingTop', Math.floor( FixedHeader.headerHeight ));
			}
		});
		if( $( '#gallery-controller' ).length > 0 ) {
			FixedHeader.hasHeaderSlider = true;
		}

		$( window ).load( function(){
			var $fixed =  '' !== themifyScript.fixedHeader && $('#headerwrap').hasClass('fixed-header');
			if($fixed){
					$('#headerwrap').removeClass('fixed-header');
			}
			FixedHeader.calculateHeaderHeight();
			$('#pagewrap').css('paddingTop', Math.floor( FixedHeader.headerHeight ));
			if($fixed){
				$('#headerwrap').addClass('fixed-header');
			}
		});
		$( 'body' ).on( 'announcement_bar_position', FixedHeader.calculateHeaderHeight );
		$( 'body' ).on( 'announcement_bar_scroll_on_after', FixedHeader.calculateHeaderHeight );
	},
	activate: function($hard) {
		var $window = $(window),
			scrollTop = $window.scrollTop(),
			$headerWrap = $('#headerwrap');
		$('#pagewrap').css('paddingTop', Math.floor( FixedHeader.headerHeight ));
		if($hard || (scrollTop >= FixedHeader.headerHeight )) {
			if ( ! $headerWrap.hasClass( 'fixed-header' ) ) {
				FixedHeader.scrollEnabled();
			}
		} else if ( $headerWrap.hasClass( 'fixed-header' ) ) {
			FixedHeader.scrollDisabled();
		}
	},
	scrollDisabled: function() {
		$('#pagewrap').css('paddingTop', Math.floor( FixedHeader.headerHeight ));
		$('#headerwrap').removeClass('fixed-header');
		$('#header').removeClass('header-on-scroll');
		$('body').removeClass('fixed-header-on');
		if ( FixedHeader.hasHeaderSlider && 'object' === typeof $('#headerwrap').data('backstretch') ) {
			$('#headerwrap').data('backstretch').resize();
			$('#gallery-controller .slides').trigger( 'next' );
		}
	},
	scrollEnabled: function() {
		$('#headerwrap').addClass('fixed-header');
		$('#header').addClass('header-on-scroll');
		$('body').addClass('fixed-header-on');
		if ( FixedHeader.hasHeaderSlider && 'object' === typeof $('#headerwrap').data('backstretch') ) {
			$('#headerwrap').data('backstretch').resize();
			$('#gallery-controller .slides').trigger( 'next' );
		}
	},
	calculateHeaderHeight : function(){
				FixedHeader.headerHeight = $('#headerwrap').outerHeight(true);
	}
};
FixedHeader.init();

// Initialize carousels //////////////////////////////
ThemifySlider = {
	recalcHeight: function(items, $obj) {
		var heights = [], height;
		$.each( items, function() {
			heights.push( $(this).outerHeight(true) );
		});
		height = Math.max.apply( Math, heights );
		$obj.closest('.carousel-wrap').find( '.caroufredsel_wrapper, .slideshow' ).each(function(){
			$(this).outerHeight( height );
		});
	},
	didResize: false,

	createCarousel: function(obj) {
		var self = this;
		obj.each(function() {
			var $this = $(this);
			$this.carouFredSel({
				responsive: true,
				prev: '#' + $this.data('id') + ' .carousel-prev',
				next: '#' + $this.data('id') + ' .carousel-next',
				pagination: {
					container: '#' + $this.data('id') + ' .carousel-pager'
				},
				circular: true,
				infinite: true,
				swipe: true,
				scroll: {
					items: $this.data('scroll'),
					fx: 'scroll',
					duration: parseInt($this.data('speed'))
				},
				auto: {
					play: ('off' !== $this.data('autoplay')),
					timeoutDuration: 'off' !== $this.data('autoplay') ? parseInt($this.data('autoplay')) : 0
				},
				items: {
					visible: {
						min: 1,
						max: $this.data('visible') ? parseInt($this.data('visible')) : 1
					},
					width: 222
				},
				onCreate: function( items ) {
					var $slideWrap = $this.closest( '.slideshow-wrap' );
					$slideWrap.css({
						'visibility': 'visible',
						'height': 'auto'
					});
					
					
					$(window).on( 'throttledresize', function() {
						self.recalcHeight(items.items, $this);	
					});
					$(window).resize();

					setTimeout( function(){
						$slideWrap.find( '.carousel-nav-wrap' ).css( 'width', ( parseInt( $slideWrap.find( '.carousel-pager' ).find( 'a' ).length ) * 18 ) + 'px' );
					}, 200 );
				}
			});
		});
	}
};

// Test if this is a touch device /////////
function is_touch_device() {
	return $('body').hasClass('touch');
}

// Scroll to Element //////////////////////////////
function themeScrollTo(offset) {
	$('body,html').animate({ scrollTop: offset }, 800);
}
// Get builder rows anchor class to ID //////////////////////////////
function getClassToId($section) {
	var classes = $section.prop('class').split(' '),
			expr = new RegExp('^tb_section-', 'i'),
			spanClass = null;
	for (var i = 0; i < classes.length; i++) {
		if (expr.test(classes[i])) {
			spanClass = classes[i];
		}
	}

	if (spanClass == null)
		return '';

	return spanClass.replace('tb_section-', '');
}
// Create fullpage scrolling //////////////////////////////
function createFullScrolling() {
	var $body = $('body'),
		sectionSelector = usesRows ? sectionsWrapper + ' > ' + sectionClass : sectionClass,
		autoScrolling = !usesRows && '' != themifyScript.hash.replace('#', '') ? false : true;
	$(sectionsWrapper).fullpage({
		resize: false,
		sectionSelector: sectionSelector,
		paddingBottom: '78px',
		scrollOverflow: true,
		navigation: true,
		lockAnchors: true,
		autoScrolling: autoScrolling,
		afterRender: function () {
			if (!autoScrolling) { // hack deep linking not working when use section row
				$.fn.fullpage.setAutoScrolling(true);
			}

			var $section = $(sectionClass + '.active', $(sectionsWrapper)),
					section_id = usesRows && $section.is('[class*="tb_section-"]') ? getClassToId($section) : $section.prop('id'),
					$aSectionHref = $('#main-nav').find('a[href$="#' + section_id + '"]');

			setTimeout(function () {
				$('.section_loader').hide();
				
				if ('undefined' !== typeof Themify && 'undefined' !== typeof wowInit2) {
					wowInit2();
				}
			}, 1000);

			if (usesRows) {
				var extraEmptyRow = $('#fp-nav').find('li').get($('.themify_builder_row').length);
				if ('undefined' !== typeof extraEmptyRow) {
					extraEmptyRow.hide();
				}
			}

			if ($aSectionHref.length > 0) {
				$aSectionHref.closest('li').addClass('current_page_item').siblings().removeClass('current_page_item current-menu-item');
			}

			if (history.pushState) {
				history.pushState(null, null, '#' + section_id);
			}

			$body.trigger('themify_onepage_after_render', [$section, section_id]);
		},
		afterLoad: function () {
			var $section = $(sectionClass + '.active', $(sectionsWrapper)),
					section_id = usesRows && $section.is('[class*="tb_section-"]') ? getClassToId($section) : $section.prop('id'),
					$aSectionHref = $('#main-nav').find('a[href$="#' + section_id + '"]');

			if ($aSectionHref.length > 0) {
				$aSectionHref.closest('li').addClass('current_page_item').siblings().removeClass('current_page_item current-menu-item');
			}

			if (history.pushState) {
				history.pushState(null, null, '#' + section_id);
			}

			$body.trigger('themify_onepage_afterload', [$section, section_id]);
		},
		onLeave: function (index, nextIndex, direction) {

			// when lightbox is active, prevent scrolling the page
			if ($body.find('> .mfp-wrap').length > 0) {
				return false;
			}

			var $rows = usesRows ? $(sectionsWrapper).children(sectionClass) : $(sectionsWrapper).find(sectionClass);
			if ($rows.length > 0) {

				if (index > 0 && nextIndex > 0) {
					var sectionIndex = index;
					if ('up' === direction) {
						for (sectionIndex = index; sectionIndex >= nextIndex; sectionIndex--) {
							$rows.eq(sectionIndex - 1).css('visibility', 'visible');
						}
					} else {
						for (sectionIndex = index; sectionIndex <= nextIndex; sectionIndex++) {
							$rows.eq(sectionIndex - 1).css('visibility', 'visible');
						}
					}

				}
			}
		}
	});
}



// Infinite Scroll ///////////////////////////////
function doInfinite( $container, selector ) {

	if ( 'undefined' !== typeof $.fn.infinitescroll ) {

		// Get max pages for regular category pages and home
		var scrollMaxPages = parseInt(themifyScript.maxPages);

		// Get max pages for Query Category pages
		if ( typeof qp_max_pages !== 'undefined') {
			scrollMaxPages = qp_max_pages;
		}

		// infinite scroll
		$container.infinitescroll({
			navSelector  : '#load-more a:last', 		// selector for the paged navigation
			nextSelector : '#load-more a:last', 		// selector for the NEXT link (to page 2)
			itemSelector : selector, 	// selector for all items you'll retrieve
			loadingText  : '',
			donetext     : '',
			loading 	 : { img: themifyScript.loadingImg },
			maxPage      : scrollMaxPages,
			behavior	 : 'auto' !== themifyScript.autoInfinite? 'twitter' : '',
			pathParse 	 : function ( path ) {
				return path.match(/^(.*?)\b2\b(?!.*\b2\b)(.*?$)/).slice(1);
			},
			bufferPx: 50,
			pixelsFromNavToBottom: $('#footerwrap').height()
		}, function(newElements) {
			// call Isotope for new elements
			var $newElems = $(newElements);

			// Mark new items: remove newItems from already loaded items and add it to loaded items
			$('.newItems').removeClass('newItems');
			$newElems.addClass('newItems');

			if ( 'reset' === themifyScript.resetFilterOnLoad ) {
				// Make filtered elements visible again
				LayoutAndFilter.reset();
			}

			$newElems.hide().imagesLoaded(function(){

				$newElems.fadeIn();

				$('.wp-audio-shortcode, .wp-video-shortcode').not('div').each(function() {
					var $self = $(this);
					if ( $self.closest('.mejs-audio').length === 0 ) {
						ThemifyMediaElement.init($self);
					}
				});

				// Apply lightbox/fullscreen gallery to new items
				Themify.InitGallery();
				if ( 'object' === typeof $container.data('isotope') ) {
					$container.isotope('appended', $newElems );
				}

				if ( LayoutAndFilter.filterActive ) {
					// If new elements with new categories were added enable them in filter bar
					LayoutAndFilter.enableFilters();

					if ( 'scroll' === themifyScript.scrollToNewOnLoad ) {
						LayoutAndFilter.restore();
					}
				}

				$('#infscr-loading').fadeOut('normal');
				if( 1 === scrollMaxPages ){
					$('#load-more, #infscr-loading').remove();
				}

				/**
			     * Fires event after the elements and its images are loaded.
			     *
			     * @event infiniteloaded.themify
			     * @param {object} $newElems The elements that were loaded.
			     */
				$('body').trigger( 'infiniteloaded.themify', [$newElems] );

				$(window).trigger( 'resize' );
			});

			scrollMaxPages = scrollMaxPages - 1;
			if( 1 < scrollMaxPages && 'auto' !== themifyScript.autoInfinite) {
				$('.load-more-button').show();
			}
		});

		// disable auto infinite scroll based on user selection
		if( 'auto' === themifyScript.autoInfinite ){
			$('#load-more, #load-more a').hide();
		}
	}
}

// Entry Filter /////////////////////////
LayoutAndFilter = {
	filterActive: false,
	init: function() {
		themifyScript.disableMasonry = $('body').hasClass('masonry-enabled') ? '' : 'disable-masonry';
		if ( 'disable-masonry' !== themifyScript.disableMasonry ) {
			$('.post-filter + .portfolio.list-post,.loops-wrapper.grid4,.loops-wrapper.grid3,.loops-wrapper.grid2,.loops-wrapper.portfolio.grid4,.loops-wrapper.portfolio.grid3,.loops-wrapper.portfolio.grid2').not('.builder-posts-wrap').prepend('<div class="grid-sizer">').prepend('<div class="gutter-sizer">');
			this.enableFilters();
			this.filter();
			this.filterActive = true;
		}
	},
	enableFilters: function() {
		var $filter = $('.post-filter');
		if ( $filter.find('a').length > 0 && 'undefined' !== typeof $.fn.isotope ) {
			$filter.find('li').each(function(){
				var $li = $(this),
					$entries = $li.parent().next(),
					cat = $li.attr('class').replace(/(current-cat)|(cat-item)|(-)|(active)/g, '').replace(' ', '');
				if ( $entries.find('.portfolio-post.cat-' + cat).length <= 0 ) {
					$li.hide();
				} else {
					$li.show();
				}
			});
		}
	},
	filter: function() {
		var $filter = $('.post-filter');
		if ( $filter.find('a').length > 0 && 'undefined' !== typeof $.fn.isotope ) {
			$filter.addClass('filter-visible').on('click', 'a', function( e ) {
				e.preventDefault();
				var $li = $(this).parent(),
					$entries = $li.parent().next();
				if ( $li.hasClass('active') ) {
					$li.removeClass('active');
					$entries.isotope({
						masonry: {
							columnWidth: '.grid-sizer',
							gutter: '.gutter-sizer'
						},
						filter: '.portfolio-post',
						isOriginLeft : ! $( 'body' ).hasClass( 'rtl' )
					});
				} else {
					$li.siblings('.active').removeClass('active');
					$li.addClass('active');
					$entries.isotope({
						filter: '.cat-' + $li.attr('class').replace(/(current-cat)|(cat-item)|(-)|(active)/g, '').replace(' ', ''),
						isOriginLeft : ! $( 'body' ).hasClass( 'rtl' )
					});
				}
			});
		}
	},
	scrolling: false,
	reset: function() {
		$('.post-filter').find('li.active').find('a').addClass('previous-active').trigger('click');
		this.scrolling = true;
	},
	restore: function() {
		//$('.previous-active').removeClass('previous-active').trigger('click');
		var $first = $('.newItems').first(),
			self = this,
			to = $first.offset().top - ( $first.outerHeight(true)/2 ),
			speed = 800;

		if ( to >= 800 ) {
			speed = 800 + Math.abs( ( to/1000 ) * 100 );
		}
		$('html,body').stop().animate({
			scrollTop: to
		}, speed, function() {
			self.scrolling = false;
		});
	},
	layout: function() {
		if ( 'disable-masonry' !== themifyScript.disableMasonry ) {
			$('.post-filter + .portfolio.list-post,.loops-wrapper.portfolio.grid4,.loops-wrapper.portfolio.grid3,.loops-wrapper.portfolio.grid2,.loops-wrapper.portfolio-taxonomy').not('.builder-posts-wrap').isotope({
				masonry: {
					columnWidth: '.grid-sizer',
					gutter: '.gutter-sizer'
				},
				itemSelector : '.portfolio-post',
				isOriginLeft : ! $( 'body' ).hasClass( 'rtl' )
			}).addClass('masonry-done');

			

			$('.loops-wrapper.grid4,.loops-wrapper.grid3,.loops-wrapper.grid2').not('.portfolio-taxonomy,.portfolio,.builder-posts-wrap')
				.isotope({
					masonry: {
						columnWidth: '.grid-sizer',
						gutter: '.gutter-sizer'
					},
					itemSelector: '.loops-wrapper > article',
					isOriginLeft : ! $( 'body' ).hasClass( 'rtl' )
				})
				.addClass('masonry-done')
				.isotope( 'once', 'layoutComplete', function() {
					$(window).trigger('resize');
				});

			var $products = $('.woocommerce.archive').find('#content').find('ul.products');
			if ( $products.length ) {
				$products.imagesLoaded(function(){
					$products.isotope({
						layoutMode: 'packery',
						itemSelector : '.product',
						isOriginLeft : ! $( 'body' ).hasClass( 'rtl' )
					}).addClass('masonry-done');
				});
			}
		}
		var $gallery = $('.gallery-wrapper.packery-gallery');
		if ( $gallery.length > 0 ) {
					$gallery.imagesLoaded(function(){
						$gallery.isotope({
							layoutMode: 'packery',
							itemSelector: '.item'
						});
					});
		}
	},
	reLayout: function() {
		$('.loops-wrapper').each(function(){
			var $loopsWrapper = $(this);
			if ( 'object' === typeof $loopsWrapper.data('isotope') ) {
				$loopsWrapper.isotope('layout');
			}
		});
		var $gallery = $('.gallery-wrapper.packery-gallery');
		if ( $gallery.length > 0 && 'object' === typeof $gallery.data('isotope') ) {
			$gallery.isotope('layout');
		}
		var $products = $('.woocommerce.archive').find('#content').find('ul.products');
		if ( $products.length && 'object' === typeof $products.data('isotope') ) {
			$products.isotope('layout');
		}
	}
};

// DOCUMENT READY
$(document).ready(function() {

	var $body = $('body'), $header = $('#header');

	/////////////////////////////////////////////
	// Scroll to row when a menu item is clicked.
	/////////////////////////////////////////////
	if ( 'undefined' !== typeof $.fn.themifyScrollHighlight ) {
		$body.themifyScrollHighlight();
	}
	
	/////////////////////////////////////////////
	// Initialize Packery Layout and Filter
	/////////////////////////////////////////////
	LayoutAndFilter.init();
	LayoutAndFilter.layout();
	
	/////////////////////////////////////////////
	// Scroll to top
	/////////////////////////////////////////////
	$('.back-top a').on('click', function(e){
		e.preventDefault();
		themeScrollTo(0);
	});
	
	if ($body.hasClass('full-section-scrolling')) {
		$(".back-top a").off(themeScrollTo(0));
	}
	// Scroll to top or expand footer.
	$('.back-top a').on('click', function (e) {
		e.preventDefault();
		if ($body.hasClass('full-section-scrolling')) {
			$('.full-section-scrolling #footerwrap').toggleClass('expanded');
		}
	});
	
	/////////////////////////////////////////////
	// Toggle main nav on mobile
	/////////////////////////////////////////////
	if( $( 'body' ).hasClass( 'touch' ) && typeof jQuery.fn.themifyDropdown != 'function' ) {
		Themify.LoadAsync(themify_vars.url + '/js/themify.dropdown.js', function(){
			$( '#main-nav' ).themifyDropdown();
		});
	}

	if ( $body.hasClass( 'header-minbar' ) || $body.hasClass( 'header-leftpane' ) ) {
		/////////////////////////////////////////////
		// Side Menu for header-minbar and header-leftpane
		/////////////////////////////////////////////
		$('#menu-icon').themifySideMenu({
			close: '#menu-icon-close',
			side: 'left'
		});
		/////////////////////////////////////////////
		// NiceScroll only for header-minbar and header-leftpane
		/////////////////////////////////////////////
		if ( 'undefined' !== typeof $.fn.niceScroll && ! is_touch_device() ) {
			var $niceScrollTarget = $header;
			if ( $body.hasClass( 'header-minbar' ) ) {
				$niceScrollTarget = $('#mobile-menu');
			}
			$niceScrollTarget.niceScroll();
			$body.on( 'sidemenushow.themify', function(){
				setTimeout(function(){
					$niceScrollTarget.getNiceScroll().resize();
				}, 200);
			} );
		}
	} 
	else if ( $body.hasClass( 'header-slide-out' ) || $body.hasClass( 'header-rightpane' ) ){
		$('#menu-icon').themifySideMenu({
			close: '#menu-icon-close',
			side: 'right'
		});
		if ( 'undefined' !== typeof $.fn.niceScroll && ! is_touch_device() ) {
			var $niceScrollTarget = $header;
			if ( $body.hasClass( 'header-slide-out' ) ) {
				$niceScrollTarget = $('#mobile-menu');
			}
			$niceScrollTarget.niceScroll();
			$body.on( 'sidemenushow.themify', function(){
				setTimeout(function(){
					$niceScrollTarget.getNiceScroll().resize();
				}, 200);
			} );
		}
	}
	else {
		/////////////////////////////////////////////
		// Side Menu for all other header designs
		/////////////////////////////////////////////
		$('#menu-icon').themifySideMenu({
			close: '#menu-icon-close'
		});
				
		var $overlay = $( '<div class="body-overlay">' );
		$body.append( $overlay ).on( 'sidemenushow.themify', function () {
			$overlay.addClass( 'body-overlay-on' );
		} ).on( 'sidemenuhide.themify', function () {
			$overlay.removeClass( 'body-overlay-on' );
		} ).on( 'click.themify touchend.themify', '.body-overlay', function () {
			$( '#menu-icon' ).themifySideMenu( 'hide' );
		} ); 
		
		$(window).resize(function(){
			if( $( '#menu-icon' ).is(':visible') && $('#mobile-menu').hasClass('sidemenu-on')){
				$overlay.addClass( 'body-overlay-on' );
			}
			else{
				 $overlay.removeClass( 'body-overlay-on' );
			}
		});
	}

	if ( $body.hasClass( 'header-leftpane' ) || $body.hasClass( 'header-rightpane' ) || $body.hasClass( 'header-minbar' ) || $body.hasClass( 'header-slide-out' ) ){
		$("#main-nav li.menu-item-has-children > a, #main-nav li.page_item_has_children > a").after(
			"<span class='child-arrow'></span>"
		);
		$('#main-nav li.menu-item-has-children > .child-arrow, #main-nav li.page_item_has_children > a').click(function(){
			$(this).toggleClass('toggle-on');
			return true;
		});
	}
		
	
	/////////////////////////////////////////////
	// Add class "first" to first elements
	/////////////////////////////////////////////
	$('.highlight-post:odd').addClass('odd');

	if ( 'undefined' !== typeof $.fn.niceScroll && ! is_touch_device() ) {
		// NiceScroll Initialized Default
		var viewport = $(window).width();
		if (viewport > 1000) {
			jQuery(".header-horizontal .header-widget, .header-top-bar .header-widget, .boxed-compact .header-widget, .header-stripe .header-widget").niceScroll();
		}
	}
	
	var $headerWidgets = $('.header-horizontal, .header-top-bar, .boxed-compact, .header-stripe').find('.header-widget');
	if ( $headerWidgets.length > 0 ) {
		// Header Horizontal, Header Topbar, Boxed Compact Add pull down wrapper
		$( '.header-horizontal #header, .header-top-bar #header, .boxed-compact #header, .header-stripe #header' ).append( $( '<a href="#" class="pull-down">' ) );
		
		// Pull Down onclick Header Horizontal, Header Topbar, Boxed Compact Only
		$('.pull-down').on('click', function(e){
			if ( 'undefined' !== typeof $.fn.niceScroll && ! is_touch_device() ) {
				$headerWidgets.getNiceScroll().resize();
			}
			$('#header').toggleClass('pull-down-close');
			$headerWidgets.slideToggle( 'fast', function() {
				$('#pagewrap').css('paddingTop', $('#headerwrap').outerHeight(true));
			});
			e.preventDefault();
		});
	}
	
	// Reset NiceScroll Resize
	$(window).resize(function(){
		var viewport = $(window).width();
		if (viewport < 1000) {
			if ( 'undefined' !== typeof $.fn.niceScroll && ! is_touch_device() ) {
				jQuery(".header-horizontal .header-widget, .header-top-bar .header-widget, .boxed-compact .header-widget, .header-stripe .header-widget").getNiceScroll().remove();
			}
			jQuery(".header-horizontal .header-widget, .header-top-bar .header-widget, .boxed-compact .header-widget, .header-stripe .header-widget").attr("style","");
		}
	});

	/////////////////////////////////////////////
	// Make overlay clickable
	/////////////////////////////////////////////
	$( 'body' ).on( 'click', '.loops-wrapper.grid4.polaroid .post-image + .post-content, .loops-wrapper.grid3.polaroid .post-image + .post-content, .loops-wrapper.grid2.polaroid .post-image + .post-content, .loops-wrapper.grid4.overlay .post-image + .post-content, .loops-wrapper.grid3.overlay .post-image + .post-content, .loops-wrapper.grid2.overlay .post-image + .post-content', function(){
		var $link = $( this ).closest( '.post' ).find( 'a[data-post-permalink]' );
		if($link.attr( 'href' ) && ! $link.hasClass( 'themify_lightbox' ) ) {
			window.location = $link.attr( 'href' );
		}
	});

	/////////////////////////////////////////////
	// Carousel initialization
	/////////////////////////////////////////////

	if ( $('.loops-wrapper.slider').length > 0 ) {
		var elID = 0;
		$('.loops-wrapper.slider').each(function(){
			elID++;
			var $self = $(this);

			if ( 'undefined' === typeof $self.attr( 'id' ) ) {
					// If this doesn't have an id, set dummy id
					$self.attr( 'id', 'loops-wrapper-' + elID );
			}
			var dataID = $self.attr( 'id' );

			$self.addClass( 'slideshow-wrap' );

			if ( $self.find( '.slideshow' ).length === 0 ) {
					$self.wrapInner( '<div class="slideshow" data-id="' + dataID + '" data-autoplay="off" data-speed="1000" data-effect="scroll" data-visible="3" />' );
			} else {
					$self.find( '.slideshow' ).attr( 'data-id', dataID );
			}
		});
	}
	if($('.slideshow').length>0){
		if(!$.fn.carouFredSel){
			Themify.LoadAsync(themify_vars.url+'/js/carousel.js',function(){
				ThemifySlider.createCarousel($('.slideshow'));
			});
		}
		else{
			ThemifySlider.createCarousel( $( '.slideshow' ) );
		}
	}

	$( 'body' ).on( 'announcement_bar_position announcement_bar_scroll_on_after', function( e, el ){
		$('#pagewrap').css( 'paddingTop', Math.floor( $('#headerwrap').outerHeight(true) ) );
	});

	var $headerwrap = $( '#headerwrap' );
	$( 'body' ).on( 'announcement_bar_position', function( e, el ){
		if( $( this ).hasClass( 'header-minbar' ) ) {
			el.css( 'left', $headerwrap.width() - Math.abs( parseInt( $headerwrap.css( 'left' ), 10 ) ) );
		} else if( $( this ).hasClass( 'header-leftpane' ) ) {
			// el.css( 'left', $headerwrap.width() );
		}
	} );
	$( 'body' ).on( 'announcement_bar_position', function( e, el ){
		if( $( this ).hasClass( 'header-minbar' ) ) {
			el.css( 'right', $headerwrap.width() - Math.abs( parseInt( $headerwrap.css( 'right' ), 10 ) ) );
		}
	} );

	/////////////////////////////////////////////
	// Mega menu width
	/////////////////////////////////////////////
	$(window).resize(function(){
		var $megamenuwidth = $('#header').width();		 
		var vviewport = $(window).width();
		
		/* Adjust for scroll bar width */
		if (vviewport > 983) {
			if( $( 'body' ).hasClass( 'header-top-bar' ) || $body.hasClass( 'header-horizontal' ) || $body.hasClass( 'boxed-compact' ) || $body.hasClass( 'header-stripe' ) ) {
				$('#main-nav li.has-mega-column > ul, #main-nav li.has-mega-sub-menu > .mega-sub-menu').css(
					'width', $megamenuwidth
				);
			}
		} else {
			if( $( 'body' ).hasClass( 'header-top-bar' ) || $body.hasClass( 'header-horizontal' ) || $body.hasClass( 'boxed-compact' ) || $body.hasClass( 'header-stripe' ) ) {
				$('#main-nav li.has-mega-column > ul').removeAttr("style");
				$('#main-nav li.has-mega-sub-menu > .mega-sub-menu').removeAttr("style"); 
			}
			
		}
	});
	
	/////////////////////////////////////////////
	// Header Overlay toggle-able dropdown
	/////////////////////////////////////////////
	// Set Dropdown Arrow
	$(".header-overlay #main-nav li.menu-item-has-children > a").after(
		"<span class='child-arrow'></span>"
	);	
	$('.header-overlay #main-nav li.menu-item-has-children > .child-arrow').click(function(){
		$(this).toggleClass('toggle-on');
		$(this).next('div, ul').toggle('fast'); 
		return true;
	});

	if ( 'undefined' !== typeof $.fn.niceScroll && ! is_touch_device() ) {
		if ( $body.hasClass( 'header-overlay' ) ) {
			
			var $niceScrollTarget = $('#mobile-menu');
			$niceScrollTarget.niceScroll();
			$body.on('sidemenushow.themify', function(){
				setTimeout(function(){
					$niceScrollTarget.getNiceScroll().resize();
				}, 200);
			});
		
		}
	}
	/////////////////////////////////////////////
	// One Page Scroll
	/////////////////////////////////////////////
	if (isFullPageScroll && $body.hasClass('query-section')) {
		 themifyScript.hash = window.location.hash.replace('#', '').replace('!/', '');
		if ('undefined' !== typeof $.fn.themifyScrollHighlight) {
			$body.on('scrollhighlight.themify', function (e, section) {
				if ('undefined' != typeof section && '' != section) {
					$('#fp-nav').find('li').eq($('.tb_section-' + section.replace('#', '')).index()).find('a').trigger('click');
				}
			});
			$(window).trigger('scroll');
		};
		// Get rid of wow js animation since animation is managed with fullpage js
		var callbackTimer = setInterval(function () {
			if ('undefined' !== typeof Themify) {
				clearInterval(callbackTimer);
				wowInit2 = Themify.wowInit;
				Themify.wowInit = function () {};
			}
		}, 100);

		createFullScrolling();
		$body.on('builder_toggle_frontend', function (event, is_edit) {
			if (typeof $.fn.fullpage !== 'undefined') {
				if (is_edit) {
					$.fn.fullpage.destroy('all');
					$('html,body').css('overflowY','auto');
				} else {
					createFullScrolling();
				}
			}
		});
		$body.on('themify_onepage_afterload', function (e, $panel) {
			// Trigger wow display for elements in this panel
			if (tbLocalScript && tbLocalScript.animationInviewSelectors && typeof Themify.wow !== 'undefined' && Themify.wow) {
				$(tbLocalScript.animationInviewSelectors).each(function (i, selector) {
					$(selector, $panel).each(function () {
						Themify.wow.show(this);
					});
				});
			}
		});
		$body.on('themify_onepage_afterload themify_onepage_after_render', function (event, $section, section_id) {
			if ($.fn.waypoint) {
				Waypoint.refreshAll();
			}
			if ('undefined' !== typeof Themify && Themify.wow !== null && typeof Themify.wow.scrollHandler() === 'boolean') {
				Themify.wow.scrollHandler();
			}

		});
	}
	else {
		$('.section_loader').hide();
	}
	if(isFullPageScroll){
		// anchor scrollTo
	   // exclude lightbox links from scrolling
		$body.on('click', 'a[href*="#"]:not(.themify_lightbox)', function (e) {
			var url = $(this).prop('href'),
				 idx = url.indexOf('#'),
				 hash = idx != -1 ? url.substring(idx + 1) : '',
				 offset = 0,
				 $sectionEl = $('.tb_section-' + hash);
			if (hash.length > 1 && $sectionEl.length > 0  && hash !== 'header') {
				 offset = $sectionEl.offset().top;
				 // If header is set to fixed, calculate this
				 if ($('.fixed-header').length > 0) {
					 offset += $('#headerwrap').outerHeight(true);
				 }
				$.fn.fullpage.moveTo($sectionEl.index(sectionClass) + 1);
				e.preventDefault();
			}
		});
	}

	//Fix overlay style regardless the featured image position above/below post title
    jQuery(".loops-wrapper.overlay .post").each(function () {
  		jQuery(this).find('.post-image').insertBefore(jQuery(this).find('.post-content'));        
    });
	
	// Restaurant skin related script 
	if( $( 'body' ).hasClass( 'skin-restaurant' ) ) { 
		// H1 Border and Fork icon generated markups
		$( "h1" ).has( "i, em, b, strong" ).addClass('fancy-heading').prepend('<span class="maketable"></span>').append('<span class="bottomBorder"></span>');
		$( "h1 .maketable").wrapInner('<span class="fork-icon"></span>').prepend('<span class="addBorder"></span>').append('<span class="addBorder"></span>');

		// H2 Border and Fork icon generated markups
		$( "h2" ).has( "em, i, b, strong" ).addClass('fancy-heading').append('<span class="fork-icon"></span>');
		$( "h2 em, h2 i, h2 .fork-icon" ).wrap('<span class="maketable"></span>').before('<span class="addBorder"></span>').after('<span class="addBorder"></span>');		
		$( "h2" ).has( "b, strong" ).prepend('<span class="bottomBorder"></span>');
		
		// working on post-title styling.  It should be in this bottom position only
		$( ".page-title, .loops-wrapper.list-post .post-title, .single-post .post-title.entry-title" ).addClass('fancy-heading').prepend('<span class="maketable"></span>').append('<span class="bottomBorder"></span>');
		$( ".page-title .maketable, .loops-wrapper.list-post .post-title .maketable, .single-post .post-title.entry-title .maketable").wrapInner('<span class="fork-icon"></span>').prepend('<span class="addBorder"></span>').append('<span class="addBorder"></span>'); 
	}
	
});

// WINDOW RESIZE
$(window).resize(function() {
	
	/////////////////////////////////////////////
	// Swapping logo with Window Resize Function in Header Split Menu Layout
	/////////////////////////////////////////////
	var $body = $('body');
	if ( $body.hasClass( 'header-menu-split' ) ){
		if ($('#menu-icon').is(':visible')) {
			var $insideMenuLogo = $('.header-bar').find('#site-logo');
			if ($insideMenuLogo.length == 0) {
				$('#site-logo').prependTo( '.header-bar' );
			}
		} else {
			var $insideMenuLogo = $('.themify-logo-menu-item').find('#site-logo');
			if ($insideMenuLogo.length == 0) {
				var $insideHeaderBarLogo = $('.header-bar').find('#site-logo');
				$('.themify-logo-menu-item').append($insideHeaderBarLogo);
			}
		}
	}
});

// WINDOW LOAD
$(window).load(function() {

	var $body = $('body');

	///////////////////////////////////////////
	// Initialize infinite scroll
	///////////////////////////////////////////
	if ( $body.hasClass( 'woocommerce' ) && $body.hasClass( 'archive' ) ) {
		doInfinite( $( '#content ul.products' ), '#content .product' );
	} else {
		doInfinite( $( '#loops-wrapper' ), '.post' );
	}

	///////////////////////////////////////////
	// Header Video
	///////////////////////////////////////////
	function ThemifyBideo(){
		 var $videos = $('[data-fullwidthvideo]').not('.themify_builder_row'),
			fwvideos = [],
			$header = $('#headerwrap'),
			$fixed = $header.hasClass('fixed-header');
	
		$.each($videos, function (i, elm) {
			if ($fixed){
				$header.removeClass('fixed-header');
			}
			fwvideos[i] = new $.BigVideo({
			useFlashForFirefox: false,
				container: $(elm),
				id: i
			});
			fwvideos[i].init();
			fwvideos[i].show($(elm).data('fullwidthvideo'), {
				doLoop : true
			});
			if ($fixed){
				fwvideos[i].getPlayer().on('loadedmetadata', function(){
					$header.addClass('fixed-header');
				});
			}
		});
	}
	if ($('[data-fullwidthvideo]').not('.themify_builder_row').length>0 && !is_touch_device()) {
		if(typeof $.BigVideo == 'undefined'){
			 Themify.LoadAsync(themify_vars.url+'/js/video.js',function(){
				 Themify.LoadAsync(themify_vars.url+'/js/bigvideo.js',ThemifyBideo);
			 });
		}
		else{
		   ThemifyBideo();
		}
	}

	/////////////////////////////////////////////
	// Entry Filter Layout
	/////////////////////////////////////////////
	$body.imagesLoaded(function(){
		$(window).resize();
		LayoutAndFilter.reLayout();
	});
	
	// EDGE MENU //
	jQuery(function ($) {
		$("#main-nav li").on('mouseenter mouseleave dropdown_open', function (e) {
			if ($('ul', this).length) {
				var elm = $('ul:first', this);
				var off = elm.offset();
				var l = off.left;
				var w = elm.width();
				var docW = $(window).width();
				var isEntirelyVisible = (l + w <= docW);

				if (!isEntirelyVisible) {
					$(this).addClass('edge');
				} else {
					$(this).removeClass('edge');
				}

			}
		});
	});	
	if (isFullPageScroll && $body.hasClass('query-section')) {
		 // Hack Chrome browser doesn't autoplay the video background
		$body.on('themify_onepage_after_render', function () {
			if ('undefined' !== typeof ThemifyBuilderModuleJs && ThemifyBuilderModuleJs.fwvideos.length > 0) {
				$.each(ThemifyBuilderModuleJs.fwvideos, function (i, video) {
					video.getPlayer().play();
				});
			}
			$.each(tbLocalScript.animationInviewSelectors, function (index, selector) {
				$(selector).css('visibility', 'hidden');
			});

			// Section deep linking
			if (window.location.hash) {
				setTimeout(function () {
					var hashSection = themifyScript.hash;
					if ('' != hashSection && '#' != hashSection) {
						var $sectionEl = usesRows ? $('.tb_section-' + hashSection) : $('#' + hashSection);
						if ($sectionEl.length > 0) {
							$.fn.fullpage.moveTo($sectionEl.index() + 1);
							$(tbLocalScript.animationInviewSelectors).each(function (i, selector) {
								$(selector, $sectionEl).addBack().each(function () {
									Themify.wow.show(this);
								});
							});
						}
					}
				}, 1500);
			}
		});
		// Make row backgrounds visible.
		$('.themify_builder_row').css('visibility', 'visible');
	}

});
})(jQuery);