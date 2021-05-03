<?php
if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly.
}

if( ! class_exists( 'CCC_My_Favorite_List' ) ) {
  class CCC_My_Favorite_List {

    public static function action() {
      /*** お気に入りの投稿のデータ（カンマ連結文字列）を取得 ***/
      if ( is_user_logged_in() == false ) {
        /* ログインユーザーでは無い場合 */
        $ccc_my_favorite_post = sanitize_text_field( $_POST['ccc-my_favorite_post'] );
        $my_favorite_post_ids = explode(',', $ccc_my_favorite_post); // 指定した値で分割した文字列の配列を返す
      } else {
        /* MySQLのユーザーメタ（usermeta）からユーザーが選んだ投稿IDを取得 */
        $user_favorite_post_ids = get_user_meta( wp_get_current_user()->ID, CCC_My_Favorite::CCC_MY_FAVORITE_POST_IDS, true );
        //var_dump($favorite_post_user);
        $my_favorite_post_ids = explode(',', $user_favorite_post_ids);
      }
      $my_favorite_post_ids = array_map('htmlspecialchars', $my_favorite_post_ids); // 配列データを一括でサニタイズする

      /*** 表示数の定義（指定が無ければ管理画面の表示設定（表示する最大投稿数）の値を取得） ***/
      $ccc_posts_per_page = absint( $_POST['ccc-posts_per_page'] ); //負ではない整数に変換
      if( $ccc_posts_per_page ) {
        $posts_per_page = $ccc_posts_per_page;
      } else {
        $posts_per_page = get_option('posts_per_page');
      }

      $args= array(
        'post_type' => 'any', // リビジョンと 'exclude_from_search' が true にセットされたものを除き、すべてのタイプを含める
        'posts_per_page' => $posts_per_page,
        'post__in' => $my_favorite_post_ids,
        'orderby' => 'post__in',
      );
      $the_query = new WP_Query($args);
?>

<div class="header-ccc_favorite clearfix">
  <p id="ccc-favorite-count"><span class="name"><?php printf( _n( 'Favorite item', 'Favorite items', $the_query->post_count, CCCMYFAVORITE_TEXT_DOMAIN ), $the_query->post_count ); ?></span><span class="number"><?php echo $the_query->post_count; ?></span><span class="unit"></span></p><!-- /#ccc-favorite-count -->
  <div class="ccc-favorite-post-delete" data-ccc_favorite-delete_all=true><a href="#" class="ccc-favorite-post-delete-button"><span class="text"><?php _e('Delete all', CCCMYFAVORITE_TEXT_DOMAIN); ?></span></a></div><!-- /.ccc-favorite-post-delate -->
</div><!-- /.header-ccc_favorite -->
<?php if( $the_query->have_posts() ) { ?>
<div class="post-ccc_favorite">
  <?php
        $count = 0;
        while( $the_query->have_posts() ) {
          $the_query->the_post();
          $count++;
  ?>
  <div class="list-ccc_favorite clearfix">
    <div class="img-post">
      <a href="<?php the_permalink(); ?>">
        <?php
          if( has_post_thumbnail() ) {
            echo '<div class="img-post-thumbnail" style="background-image: url('.get_the_post_thumbnail_url($the_query->post->ID, 'large').');"></div>';
          } else {
            echo '<div class="img-post-thumbnail" style="background-image: url('.CCC_Post_Thumbnail::get_first_image_url($the_query->post).');"></div>';
          }
        ?>
      </a>
    </div><!-- /.img-post -->
    <h3 class="title-post"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><!-- /.title-post -->
    <div class="ccc-favorite-post-toggle"><a href="#" class="ccc-favorite-post-toggle-button" data-post_id-ccc_favorite="<?php echo $the_query->post->ID; ?>"><span class="text"><?php _e('Favorite', CCCMYFAVORITE_TEXT_DOMAIN); ?></span></a></div><!-- /.ccc-favorite-post-toggle -->
  </div><!-- /.list-ccc_favorite -->
  <?php } //endwhile ?>
</div><!-- /.post-ccc_favorite -->
<?php
        wp_reset_postdata(); //オリジナルの投稿データを復元
      } else {
?>
<div class="no-post">
  <p><?php _e('There are no favorite items.', CCCMYFAVORITE_TEXT_DOMAIN); ?></p>
</div><!-- /.no-post -->
<?php
             } //endif
    } //endfunction
  }//endclass
}//endif


