<?php
if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly.
}

if( ! class_exists( 'CCC_Post_Thumbnail' ) ) {
  class CCC_Post_Thumbnail {
    /*** 投稿本文の中から1枚目の画像のURLを取得 ***/
    public static function get_first_image_url( $post=null ) {
      $first_img = rtrim( plugin_dir_url( __FILE__ ), '/').'/no-image.jpg'; // 投稿内で画像がなかったときのためのデフォルト画像を指定
      if( empty($post) ) {
        global $post;
      } // endif
      $post_content = $post->post_content;
      if( $post_content ) {
        ob_start();
        ob_end_clean();
        preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post_content, $matches);
        if( isset($matches[1][0]) ) {
          $first_img = $matches[1][0]; //投稿本文の中から1枚目の画像のURLを取得
        }
      } // endif
      return esc_url( $first_img );
    } // endfunction
  } // endclass
}  // endif
