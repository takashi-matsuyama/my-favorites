<?php
if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly.
}

if( ! class_exists( 'CCC_My_Favorite_ShortCode_List' ) ) {

  add_shortcode('ccc_my_favorite_list_menu', array('CCC_My_Favorite_ShortCode_List', 'menu') );
  add_shortcode('ccc_my_favorite_list_results', array('CCC_My_Favorite_ShortCode_List', 'results') );

  class CCC_My_Favorite_ShortCode_List {

    public static function menu($atts) {
      $atts = shortcode_atts(array(
        "slug" => '',
        "text" => ''
      ),$atts);
      if( $atts['slug'] ) {
        $slug = trim($atts['slug'], '/');
      } else {
        $slug = 'ccc-favorite';
      }
      if( $atts['text'] ) {
        $text = $atts['text'];
      } else {
        $text = __('Favorites', CCCMYFAVORITE_TEXT_DOMAIN);
      }
      $data = '<div class="ccc-favorite-post-count"><a href="'.esc_url( home_url() ).'/'.$slug.'/"><span class="num"></span><span class="text">'.$text.'</span></a></div>'; //<!-- /.ccc-favorite-post-count -->
      return $data;
    } //endfunction

    public static function results($atts) {
      $atts = shortcode_atts(array(
        "class" => '',
        "posts_per_page" => '',
      ),$atts);
      if( $atts['class'] ) {
        $class = 'class="'.$atts['class'].'"';
      } else {
        $class = null;
      }
      if( $atts['posts_per_page'] and ctype_digit($atts['posts_per_page']) ) {
        $posts_per_page = $atts['posts_per_page'];
      } else {
        $posts_per_page = 100;
      }
      $data = '<div id="ccc-my_favorite-list" data-ccc_my_favorite-posts_per_page="'.$posts_per_page.'" '.$class.'></div>'; //<!-- /#ccc-my_favorite-list -->
      return $data;
    } //endfunction

  } //endclass
} //endif
