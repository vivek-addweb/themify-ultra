<?php
/**
 * Custom functions specific to the Restaurant skin
 *
 * @package Themify Ultra
 */

/**
 * Load Google web fonts required for the Restaurant skin
 *
 * @since 1.4.9
 * @return array
 */
function themify_theme_restaurant_google_fonts( $fonts ) {
	$fonts = array();
	/* translators: If there are characters in your language that are not supported by Cabin, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Cabin font: on or off', 'themify' ) ) {
		$fonts['cabin'] = 'Cabin:400,400italic';
	}
	/* translators: If there are characters in your language that are not supported by Source Sans, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Source Sans font: on or off', 'themify' ) ) {
		$fonts['source-sans'] = 'Source+Sans+Pro:400,700,900';
	}
	/* translators: If there are characters in your language that are not supported by Playfair Display, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Playfair Display font: on or off', 'themify' ) ) {
		$fonts['playfair-display'] = 'Playfair+Display:400,400italic,700,700italic,900,900italic';
	}

	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_restaurant_google_fonts' );