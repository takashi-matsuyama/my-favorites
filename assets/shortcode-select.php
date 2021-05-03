<?php
if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly.
}

if( ! class_exists( 'CCC_My_Favorite_ShortCode_Select' ) ) {

  add_shortcode('ccc_my_favorite_select_button', array('CCC_My_Favorite_ShortCode_Select', 'button') );

  class CCC_My_Favorite_ShortCode_Select {

    public static function button($atts) {
      $atts = shortcode_atts(array(
        "post_id" => '',
        "text" => ''
      ),$atts);
      if( $atts['post_id'] ) {
        $post_id = intval($atts['post_id']);
      } else {
        global $post;
        $post_id = $post->ID; // 投稿オブジェクトから投稿IDを取得
      }
      if( $atts['text'] ) {
        $text = $atts['text'];
      } else {
        $text = __('Favorite', CCCMYFAVORITE_TEXT_DOMAIN);
      }
      $data = '<div class="ccc-favorite-post-toggle"><a href="#" class="ccc-favorite-post-toggle-button" data-post_id-ccc_favorite="'.$post_id.'"><span class="text">'.$text.'</span></a></div>'; //<!-- /.ccc-favorite-post-toggle -->
      return $data;
    } //endfunction

  } //endclass
} //endif
