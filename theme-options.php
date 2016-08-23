<?php
/**
 * Main Themify class
 *
 * @package themify
 * @since 1.0.0
 */

class Themify {
	/** Default sidebar layout
	 *
	 * @var string
	 */
	public $layout;
	/** Default posts layout
	 *
	 * @var string
	 */
	public $post_layout;
	public $post_layout_type = 'default';
	public $hide_title;
	public $hide_meta;
	public $hide_meta_author;
	public $hide_meta_category;
	public $hide_meta_comment;
	public $hide_meta_tag;
	public $hide_date;
	public $inline_date;
	public $hide_image;
	public $media_position;

	public $unlink_title;
	public $unlink_image;

	public $display_content = '';
	public $auto_featured_image;

	public $post_image_width = '';
	public $post_image_height = '';

	public $width = '';
	public $height = '';

	public $avatar_size = 96;
	public $page_navigation;
	public $posts_per_page;

	public $image_align = '';
	public $image_setting = '';

	public $page_id = '';
	public $page_image_width = 978;
	public $query_category = '';
	public $query_post_type = '';
	public $query_taxonomy = '';
	public $paged = '';

	public $google_fonts;

	/////////////////////////////////////////////
	// Set Default Image Sizes 					
	/////////////////////////////////////////////

	// Default Index Layout
	static $content_width = 978;
	static $sidebar1_content_width = 714;

	// Default Single Post Layout
	static $single_content_width = 978;
	static $single_sidebar1_content_width = 670;

	// Default Single Image Size
	static $single_image_width = 1024;
	static $single_image_height = 585;

	// List Post
	static $list_post_width = 1160;
	static $list_post_height = 665;

	// Grid4
	static $grid4_width = 260;
	static $grid4_height = 150;

	// Grid3
	static $grid3_width = 360;
	static $grid3_height = 205;

	// Grid2
	static $grid2_width = 561;
	static $grid2_height = 321;

	// List Large
	static $list_large_image_width = 800;
	static $list_large_image_height = 460;

	// List Thumb
	static $list_thumb_image_width = 260;
	static $list_thumb_image_height = 150;

	// List Grid2 Thumb
	static $grid2_thumb_width = 160;
	static $grid2_thumb_height = 95;

	// Use dimensions defined in custom post type panel
	public $use_original_dimensions = 'no';

	// Sorting Parameters
	public $order = 'DESC';
	public $orderby = 'date';

	// Check whether object in shortcode loop
	public $is_shortcode = false;

	function __construct() {

		///////////////////////////////////////////
		//Global options setup
		///////////////////////////////////////////
		$this->layout = themify_get( 'setting-default_layout' );
		if ( $this->layout == '' ) {
			$this->layout = 'sidebar1';
		}

		$this->post_layout = themify_get( 'setting-default_post_layout' );
		if ( $this->post_layout == '' ) {
			$this->post_layout = 'list-post';
		}

		$this->page_title = themify_get( 'setting-hide_page_title' );
		$this->hide_title = themify_get( 'setting-default_post_title' );
		$this->unlink_title = themify_get( 'setting-default_unlink_post_title' );
		$this->media_position = themify_check( 'setting-default_media_position' ) ? themify_get( 'setting-default_media_position' ) : 'above';
		$this->hide_image = themify_get( 'setting-default_post_image' );
		$this->unlink_image = themify_get( 'setting-default_unlink_post_image' );
		$this->auto_featured_image = ! themify_check( 'setting-auto_featured_image' ) ? 'field_name=post_image, image, wp_thumb&' : '';
		$this->hide_page_image = themify_get( 'setting-hide_page_image' ) == 'yes' ? 'yes' : 'no';

		$this->hide_meta = themify_get( 'setting-default_post_meta' );
		$this->hide_meta_author = themify_get( 'setting-default_post_meta_author' );
		$this->hide_meta_category = themify_get( 'setting-default_post_meta_category' );
		$this->hide_meta_comment = themify_get( 'setting-default_post_meta_comment' );
		$this->hide_meta_tag = themify_get( 'setting-default_post_meta_tag' );

		$this->hide_date = themify_get( 'setting-default_post_date' );
                $this->inline_date = $this->hide_date=='yes'?false:themify_get( 'setting-default_display_date_inline' );

		// Set Order & Order By parameters for post sorting
		$this->order = themify_check( 'setting-index_order' ) ? themify_get( 'setting-index_order' ) : 'DESC';
		$this->orderby = themify_check( 'setting-index_orderby' ) ? themify_get( 'setting-index_orderby' ) : 'date';

		$this->display_content = themify_get( 'setting-default_layout_display' );
		$this->avatar_size = apply_filters( 'themify_author_box_avatar_size', $this->avatar_size );

		$this->posts_per_page = get_option( 'posts_per_page' );

		add_action( 'template_redirect', array( $this, 'template_redirect' ) );
	}

	function template_redirect() {

		$post_image_width = $post_image_height = '';
		if (is_page()) {
			if(post_password_required()){
				return;
			}
			$this->page_id = get_the_ID();
			$this->post_layout = (themify_get('layout') != "default" && themify_check('layout')) ?
								themify_get('layout') : themify_get('setting-default_post_layout');
			// set default post layout
			if($this->post_layout == ''){
				$this->post_layout = 'list-post';
			}
			$post_image_width = themify_get('image_width');
			$post_image_height = themify_get('image_height');
		}
		if(!isset($post_image_width) || $post_image_width===''){
			$post_image_width = themify_get('setting-image_post_width');
		}
		if(!isset($post_image_height) || $post_image_height===''){
			$post_image_height = themify_get('setting-image_post_height');
		}


		if( is_singular() ) {
			$this->display_content = 'content';
		}
		
		if($post_image_width==='' || $post_image_height===''){
			///////////////////////////////////////////
			// Setting image width, height
			///////////////////////////////////////////
			switch ($this->post_layout){
				case 'grid4':
					$this->width = self::$grid4_width;
					$this->height = self::$grid4_height;
				break;
				case 'grid3':
					$this->width = self::$grid3_width;
					$this->height = self::$grid3_height;
				break;
				case 'grid2':
					$this->width = self::$grid2_width;
					$this->height = self::$grid2_height;
				break;
				case 'list-large-image':
					$this->width = self::$list_large_image_width;
					$this->height = self::$list_large_image_height;
				break;
				case 'list-thumb-image':
					$this->width = self::$list_thumb_image_width;
					$this->height = self::$list_thumb_image_height;
				break;
				case 'grid2-thumb':
					$this->width = self::$grid2_thumb_width;
					$this->height = self::$grid2_thumb_height;
				break;
				default :
					$this->width = self::$list_post_width;
					$this->height = self::$list_post_height;
				break;
			}
		}
		if ($post_image_width>=0) {
			$this->width = $post_image_width;
		}
		if($post_image_height>=0){
			$this->height = $post_image_height;
		}
		if ( is_page() ) {
			// Set Page Number for Pagination
			if ( get_query_var( 'paged' ) ) {
				$this->paged = get_query_var( 'paged' );
			} elseif ( get_query_var( 'page' ) ) {
				$this->paged = get_query_var( 'page' );
			} else {
				$this->paged = 1;
			}
			global $paged;
			$paged = $this->paged;

			// Set Sidebar Layout
			if ( themify_get( 'page_layout' ) != 'default' && themify_check( 'page_layout' ) ) {
				$this->layout = themify_get( 'page_layout' );
			} elseif ( themify_check( 'setting-default_page_layout' ) ) {
				$this->layout = themify_get( 'setting-default_page_layout' );
			} else {
				$this->layout = 'sidebar1';
			}

			// Set Page Title
			if ( themify_get( 'hide_page_title' ) != 'default' && themify_check( 'hide_page_title' ) ) {
				$this->page_title = themify_get( 'hide_page_title' );
			} elseif ( themify_check( 'setting-hide_page_title' ) ) {
				$this->page_title = themify_get( 'setting-hide_page_title' );
			} else {
				$this->page_title = 'no';
			}

			// Post Meta Values ///////////////////////
			$post_meta_keys = array(
				'_author'   => 'post_meta_author',
				'_category' => 'post_meta_category',
				'_comment'  => 'post_meta_comment',
				'_tag'      => 'post_meta_tag'
			);
			$post_meta_key = 'setting-default_';
			$this->hide_meta = themify_check( 'hide_meta_all' ) ? themify_get( 'hide_meta_all' ) : themify_get( $post_meta_key . 'post_meta' );
			foreach ( $post_meta_keys as $k => $v ) {
				$this->{'hide_meta' . $k} = themify_check( 'hide_meta' . $k ) ? themify_get( 'hide_meta' . $k ) : themify_get( $post_meta_key . $v );
			}

			// Post query query ///////////////////
			$post_query_category = themify_get( 'query_category' );
			$portfolio_query_category = themify_get('portfolio_query_category');

			if ( '' != $portfolio_query_category ) {

				// GENERAL QUERY POST TYPES
				if ( '' != $portfolio_query_category ) {
					$this->query_category = $portfolio_query_category;
					$this->query_post_type = 'portfolio';
				}
				$this->query_taxonomy = $this->query_post_type . '-category';

				$this->post_layout = themify_get( $this->query_post_type . '_layout' ) ? themify_get( $this->query_post_type . '_layout' ) : 'list-post';

				if('default' != themify_get('portfolio_hide_meta_all')){
					$this->hide_meta = themify_get('portfolio_hide_meta_all');
				} else {
					$this->hide_meta = themify_check('setting-default_portfolio_index_post_meta_category')?
					themify_get('setting-default_portfolio_index_post_meta_category') : 'no';
				}

				$this->hide_title = 'default' == themify_get('portfolio_hide_title') ? themify_check( 'setting-default_portfolio_index_title' ) ? themify_get( 'setting-default_portfolio_index_title' ) : 'no' : themify_get( 'portfolio_hide_title' );

				$this->unlink_title = 'default' == themify_get('portfolio_unlink_title') ? themify_check( 'setting-default_portfolio_index_unlink_post_title' ) ? themify_get( 'setting-default_portfolio_index_unlink_post_title' ) : 'no' : themify_get('portfolio_unlink_title');

				$this->unlink_image = 'default' == themify_get('portfolio_unlink_image') ? themify_check( 'setting-default_portfolio_index_unlink_post_image' ) ? themify_get( 'setting-default_portfolio_index_unlink_post_image' ) : 'no' : themify_get('portfolio_unlink_image');

				$this->hide_image = 'default' == themify_get( 'portfolio_hide_image' ) ? themify_check( 'setting-default_portfolio_index_post_image' ) ? themify_get( 'setting-default_portfolio_index_post_image' ) : 'no' : themify_get( 'portfolio_hide_image' );

				$this->hide_image = 'default' == themify_get( 'portfolio_hide_image' ) ? themify_check( 'setting-default_portfolio_index_post_image' ) ? themify_get( 'setting-default_portfolio_index_post_image' ) : 'no' : themify_get( 'portfolio_hide_image' );

				$this->page_navigation = 'default' != themify_get( $this->query_post_type . '_hide_navigation' ) ? themify_get( $this->query_post_type . '_hide_navigation' ) : 'no';

				$this->display_content = themify_get( $this->query_post_type . '_display_content' );
				$this->posts_per_page = themify_get( $this->query_post_type . '_posts_per_page' );
				$this->order = themify_get( $this->query_post_type . '_order' );
				$this->orderby = themify_get( $this->query_post_type . '_orderby' );
				$this->use_original_dimensions = 'no';

				if ( '' != $portfolio_query_category ) {
					if('' != themify_get('portfolio_image_width')){
						$this->width = themify_get('portfolio_image_width');
					} else {
						if ( themify_check('setting-default_portfolio_index_image_post_width') ) {
							$this->width = themify_get('setting-default_portfolio_index_image_post_width');
						}
					}
					if('' != themify_get('portfolio_image_height')){
						$this->height = themify_get('portfolio_image_height');
					} else {
						if ( themify_check('setting-default_portfolio_index_image_post_height') ) {
							$this->height = themify_get('setting-default_portfolio_index_image_post_height');
						}
					}
				} else {
					if ( '' != themify_get( $this->query_post_type . '_image_width' ) ) {
						$this->width = themify_get( $this->query_post_type . '_image_width' );
					}
					if ( '' != themify_get( $this->query_post_type . '_image_height' ) ) {
						$this->height = themify_get( $this->query_post_type . '_image_height' );
					}
				}

			} else {

				// GENERAL QUERY POSTS
				$this->query_category = $post_query_category;
				$this->query_taxonomy = 'category';
				$this->query_post_type = 'post';

				$this->hide_title = themify_get( 'hide_title' );
				$this->unlink_title = themify_get( 'unlink_title' );
				$this->hide_image = themify_get( 'hide_image' );
				$this->unlink_image = themify_get( 'unlink_image' );
				if ( 'default' != themify_get( 'hide_date' ) ) {
					$this->hide_date = themify_get( 'hide_date' );
				} else {
					$this->hide_date = themify_check( 'setting-default_post_date' ) ?
						themify_get( 'setting-default_post_date' ) : 'no';
				}
				$this->display_content = themify_check( 'display_content' ) ? themify_get( 'display_content' ) : 'excerpt';
				$this->post_image_width = themify_get( 'image_width' );
				$this->post_image_height = themify_get( 'image_height' );
				$this->page_navigation = themify_get( 'hide_navigation' );
				$this->posts_per_page = themify_get( 'posts_per_page' );

				$this->order = ( themify_get( 'order' ) && '' != themify_get( 'order' ) ) ? themify_get( 'order' ) : ( themify_check( 'setting-index_order' ) ? themify_get( 'setting-index_order' ) : 'DESC' );
				$this->orderby = ( themify_get( 'orderby' ) && '' != themify_get( 'orderby' ) ) ? themify_get( 'orderby' ) : ( themify_check( 'setting-index_orderby' ) ? themify_get( 'setting-index_orderby' ) : 'date' );

			}
		}
		elseif (is_tax('portfolio-category')) {
			$this->post_layout = themify_check('setting-default_portfolio_index_post_layout')? themify_get('setting-default_portfolio_index_post_layout') : 'grid3';

			switch ( $this->post_layout ) {
				case 'grid4':
					$this->width = self::$grid4_width;
					$this->height = self::$grid4_height;
					break;
				case 'grid3':
					$this->width = self::$grid3_width;
					$this->height = self::$grid3_height;
					break;
				case 'grid2':
					$this->width = self::$grid2_width;
					$this->height = self::$grid2_height;
					break;
				case 'list-large-image':
					$this->width = self::$list_large_image_width;
					$this->height = self::$list_large_image_height;
					break;
				case 'list-thumb-image':
					$this->width = self::$list_thumb_image_width;
					$this->height = self::$list_thumb_image_height;
					break;
				case 'grid2-thumb':
					$this->width = self::$grid2_thumb_width;
					$this->height = self::$grid2_thumb_height;
					break;
				case 'list-post':
					$this->width = self::$list_post_width;
					$this->height = self::$list_post_height;
					break;
				default:
					$this->width = self::$list_post_width;
					$this->height = self::$list_post_height;
					break;
			}

			$this->layout = themify_check('setting-default_portfolio_index_layout')? themify_get('setting-default_portfolio_index_layout') : 'sidebar-none';

			$this->display_content = themify_check('setting-default_portfolio_index_display') ?
										themify_get('setting-default_portfolio_index_display'): 'none';

			$this->hide_title = themify_check('setting-default_portfolio_index_title')? themify_get('setting-default_portfolio_index_title'): 'no';

			$this->unlink_title = themify_check('setting-default_portfolio_index_unlink_post_title')? themify_get('setting-default_portfolio_index_unlink_post_title'): 'no';

			$this->hide_meta = themify_check('setting-default_portfolio_index_post_meta_category')?
					themify_get('setting-default_portfolio_index_post_meta_category') : 'yes';

			$this->hide_date = themify_check('setting-default_portfolio_index_post_date')?
					themify_get('setting-default_portfolio_index_post_date') : 'yes';

			if ( themify_check('setting-default_portfolio_index_image_post_width') ) {
				$this->width = themify_get('setting-default_portfolio_index_image_post_width');
			}
			if ( themify_check('setting-default_portfolio_index_image_post_height') ) {
				$this->height = themify_get('setting-default_portfolio_index_image_post_height');
			}
		}
		elseif ( is_single() ) {
			$is_portfolio = is_singular('portfolio');
			$this->post_layout_type = themify_get('post_layout');
			if (!$this->post_layout_type || $this->post_layout_type === 'default') {
				$this->post_layout_type = $is_portfolio ? themify_get('setting-default_portfolio_single_portfolio_layout_type') : themify_get('setting-default_page_post_layout_type');
			}
			$this->hide_title = ( themify_get( 'hide_post_title' ) != 'default' && themify_check( 'hide_post_title' ) ) ? themify_get( 'hide_post_title' ) : themify_get( 'setting-default_page_post_title' );
			$this->unlink_title = ( themify_get( 'unlink_post_title' ) != 'default' && themify_check( 'unlink_post_title' ) ) ? themify_get( 'unlink_post_title' ) : themify_get( 'setting-default_page_unlink_post_title' );
			$this->hide_date = ( themify_get( 'hide_post_date' ) != 'default' && themify_check( 'hide_post_date' ) ) ? themify_get( 'hide_post_date' ) : themify_get( 'setting-default_page_post_date' );
			if($this->hide_date!='yes'){
				$this->inline_date = themify_get( 'setting-default_page_display_date_inline' );
			}
			$this->hide_image = ( themify_get( 'hide_post_image' ) != 'default' && themify_check( 'hide_post_image' ) ) ? themify_get( 'hide_post_image' ) : themify_get( 'setting-default_page_post_image' );
			$this->unlink_image = ( themify_get( 'unlink_post_image' ) != 'default' && themify_check( 'unlink_post_image' ) ) ? themify_get( 'unlink_post_image' ) : themify_get( 'setting-default_page_unlink_post_image' );
			$this->media_position = 'above';

			// Post Meta Values ///////////////////////
			$post_meta_keys = array(
				'_author'   => 'post_meta_author',
				'_category' => 'post_meta_category',
				'_comment'  => 'post_meta_comment',
				'_tag'      => 'post_meta_tag'
			);

			$post_meta_key = 'setting-default_page_';
			$this->hide_meta = themify_check( 'hide_meta_all' ) ? themify_get( 'hide_meta_all' ) : themify_get( $post_meta_key . 'post_meta' );
			foreach ( $post_meta_keys as $k => $v ) {
				$this->{'hide_meta' . $k} = themify_check( 'hide_meta' . $k ) ? themify_get( 'hide_meta' . $k ) : themify_get( $post_meta_key . $v );
			}
			if($this->post_layout_type !== 'split'){
				$this->layout = ( themify_get( 'layout' ) == 'sidebar-none' || themify_get( 'layout' ) == 'sidebar1' || themify_get( 'layout' ) == 'sidebar1 sidebar-left' || themify_get( 'layout' ) == 'sidebar2' ) ? themify_get( 'layout' ) : themify_get( 'setting-default_page_post_layout' );
				// set default layout
				if ( $this->layout == '' ) {
					$this->layout = 'sidebar1';
				}
			}

			$this->display_content = '';

			if ( $is_portfolio ) {
				if ( themify_check( 'hide_post_meta' ) && 'default' != themify_get( 'hide_post_meta' ) ) {
					$this->hide_meta = themify_get( 'hide_post_meta' );
				} else {
					$this->hide_meta = themify_check( 'setting-default_portfolio_single_post_meta_category' ) ? themify_get( 'setting-default_portfolio_single_post_meta_category' ) : 'no';
				}
				if($this->post_layout_type !== 'split'){
					if ( themify_get('layout') != 'default' && themify_get('layout') != '' ) {
						$this->layout = themify_get('layout');
					} elseif( themify_check('setting-default_portfolio_single_layout') ) {
						$this->layout = themify_get('setting-default_portfolio_single_layout');
					} else {
						$this->layout = 'sidebar-none';
					}
				}

				$this->hide_title = (themify_get('hide_post_title') != 'default' && themify_check('hide_post_title')) ? themify_get('hide_post_title') : themify_get('setting-default_portfolio_single_title');
				$this->unlink_title = (themify_get('unlink_post_title') != 'default' && themify_check('unlink_post_title')) ? themify_get('unlink_post_title') : themify_get('setting-default_portfolio_single_unlink_post_title');
				$this->unlink_image = (themify_get('unlink_post_image') != 'default' && themify_check('unlink_post_image')) ? themify_get('unlink_post_image') : themify_get('setting-default_portfolio_single_unlink_post_image');
								$post_image_width = themify_get('setting-default_portfolio_single_image_post_width');
				$post_image_height = themify_get('setting-default_portfolio_single_image_post_height');
			}
			else{
				$post_image_width = themify_get('setting-image_post_single_width');
				$post_image_height = themify_get('setting-image_post_single_height');
			}
			if ($this->post_layout_type === 'split') {
				$this->layout = 'sidebar-none';
			}

			// Set Default Image Sizes for Single
			self::$content_width = self::$single_content_width;
			self::$sidebar1_content_width = self::$single_sidebar1_content_width;

			// Set Default Image Sizes for Single
			$this->width =$post_image_width>=0?$post_image_width:($is_portfolio?self::$single_portfolio_image_width:self::$single_image_width);
			$this->height = $post_image_height>=0?$post_image_height:($is_portfolio ?self::$single_portfolio_image_height:self::$single_image_height);
		}

		if ( ( is_tax() && !is_tax( 'portfolio-category' ) ) || ( '' == $this->width || '' == $this->height ) ) {
			$this->width = self::$list_post_width;
                        if($this->height!=='0'){
                            $this->height = self::$list_post_height;
                        }
		}

		if ( ! is_singular( 'portfolio' ) ) {
			if ( empty($this->width) &&  empty($this->height) && $this->height!=='0'  && ($this->layout === 'sidebar1' || $this->layout === 'sidebar1 sidebar-left') ) {
				$ratio = $this->width / self::$content_width;
				$aspect = $this->width == 0 ? 0 : $this->height / $this->width;
				$this->width = round( $ratio * self::$sidebar1_content_width );

				if ( $this->height>0 && $this->width>0 ){
					$this->height = round( $this->width * $aspect );
				}
			}
		}

		if ( is_single() && $this->hide_image != 'yes' ) {
			$this->image_align = '';
			$this->image_setting = 'setting=image_post_single&';
		} elseif ( $this->query_category != '' && $this->hide_image != 'yes' ) {
			$this->image_align = '';
			$this->image_setting = '';
		} else {
			$this->image_align = themify_get( 'setting-image_post_align' );
			$this->image_setting = 'setting=image_post&';
		}
	}
}

/**
 * Initializes Themify class
 *
 * @since 1.0.0
 */
function themify_global_options() {
	global $themify;
	$themify = new Themify();
}

add_action( 'after_setup_theme', 'themify_global_options' );
