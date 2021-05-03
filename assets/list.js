/*
* Author: Takashi Matsuyama
* Author URI: https://profiles.wordpress.org/takashimatsuyama/
* Description: WordPressでお気に入りの投稿の一覧を表示
* Version: 1.0.0 or later
*/

/*
* /my-favorites/select.js：別途、読み込みが必要（サブネームスペースで共通の変数と共通の関数を定義しているため）
*/

/* グローバルネームスペース */
/* MYAPP = CCC */
var CCC = CCC || {};

(function($){

  var favorite_key = CCC.favorite.storage_key(); // お気に入りの投稿を保存するストレージキーの名前を変数に格納（CCC.favoriteのstorage_key関数を呼び出し）
  var favorite_value = localStorage.getItem(favorite_key); // ローカルストレージから指定したキーの値を取得
  var data_set = {}; // オブジェクトのキーに変数を使用：ES5までの書き方（IE11以下への対応のため）
  var post_area_elm = $('#ccc-my_favorite-list');
  var posts_per_page_value = post_area_elm.data('ccc_my_favorite-posts_per_page');

  data_set['action'] = CCC_MY_FAVORITE_LIST.action;
  data_set['nonce'] = CCC_MY_FAVORITE_LIST.nonce;
  data_set[favorite_key] = favorite_value;
  data_set['ccc-posts_per_page'] = posts_per_page_value;

  $.ajax({
    type: 'POST',
    url: CCC_MY_FAVORITE_LIST.api,
    data: data_set
  }).fail( function(){
    alert('error');
  }).done( function(response){
    post_area_elm.html(response);

    var delete_btn = $('.ccc-favorite-post-delete');
    var list_post = $('.list-ccc_favorite');
    var count_post = $('#ccc-favorite-count');

    /*** 実行本体：お気に入りの投稿を削除する関数 ***/
    function my_favorite_delete(this_elm) {
      if ( this_elm.parent().data('ccc_favorite-delete_all') == true ) {
        var my_promise = $.when(
          list_post.fadeOut()
        );
      } else {
        var my_promise = $.when(
          this_elm.closest(list_post).fadeOut()
        );
      }
      my_promise.done( function() {
        var list_post_num = list_post.filter(':visible').length;
        count_post.children('.number').text(list_post_num);
        if( list_post_num === 0 ) {
          delete_btn.fadeOut();
        }
      });
    }
    /*** 削除ボタンの表示切り替え ***/
    delete_btn.hide();
    if( list_post.filter(':visible').length > 0 ) {
      delete_btn.fadeIn();
    }
    /*** クリック：選択したお気に入りの投稿を削除する ***/
    $(document).on('click', '.'+ CCC.favorite.toggle_btn, function(e) {
      e.preventDefault();
      var this_elm = $(this);
      my_favorite_delete(this_elm); // お気に入りの投稿を削除する関数を呼び出し
    });
    /*** クリック：お気に入りの投稿を全て削除する ***/
    $(document).on('click', '.'+ CCC.favorite.delete_btn, function(e) {
      e.preventDefault();
      var this_elm = $(this);
      my_favorite_delete(this_elm); // お気に入りの投稿を削除する関数を呼び出し
    });

    /*** オプション：トグルボタンにクラスを追加（select.jsを使用） ***/
    //非ユーザーは登録アイコンの判定処理が先に動くため。またログインユーザーでもajaxの処理順によってはinitial関数が先に動いてしまうため
    $('.'+ CCC.favorite.toggle_btn).addClass(CCC.favorite.save_classname);

  });

})(jQuery);
