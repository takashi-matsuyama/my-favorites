<?php
if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly.
}

if( ! class_exists( 'CCC_My_Favorite_Uninstall' ) ) {
  class CCC_My_Favorite_Uninstall {
    public static function delete_usermeta() {
      $meta_key = 'ccc_my_favorite_post_ids';
      delete_metadata( 'user', null, $meta_key, '', true );
    } //endfunction
  } //endclass
} //endif
