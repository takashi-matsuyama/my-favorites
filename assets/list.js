/*
* Author: Takashi Matsuyama
* Author URI: https://profiles.wordpress.org/takashimatsuyama/
* Description: WordPressでお気に入りの投稿の一覧を表示
* Version: 1.4.0 or later
*/

/*
* /my-favorites/select.js：別途、読み込みが必要（サブネームスペースで共通の変数と共通の関数を定義しているため）
*/

/* グローバルネームスペース */
/* MYAPP = CCC */
var CCC = CCC || {};

(function($){

  var post_area_elm = $('#ccc-my_favorite-list');
  var list_post = 'list-ccc_favorite'; // 注意：動的要素のためオブジェクト変数に格納する事は出来ない
  var count_post = 'ccc-favorite-count'; // 注意：動的要素のためオブジェクト変数に格納する事は出来ない
  var loader = 'ccc-my_favorite-list-loader'; // 注意：動的要素のためオブジェクト変数に格納する事は出来ない
  var more_trigger = 'ccc-my_favorite_posts-load_more-trigger'; // 注意：クリックイベントで使用する時には動的要素に変わっているためオブジェクト変数に格納する事は出来ない

  var data_set = {}; // オブジェクトのキーに変数を使用：ES5までの書き方（IE11以下への対応のため）
  data_set['action'] = CCC_MY_FAVORITE_LIST.action;
  data_set['nonce'] = CCC_MY_FAVORITE_LIST.nonce;
  data_set[CCC.favorite.storage_key()] = localStorage.getItem(CCC.favorite.storage_key()); // ローカルストレージから指定したキー（CCC.favoriteのstorage_key関数を呼び出し）の値を取得;
  data_set['ccc-excerpt'] = post_area_elm.data('ccc_my_favorite-excerpt');
  data_set['ccc-posts_per_page'] = post_area_elm.data('ccc_my_favorite-posts_per_page');
  data_set['looplength'] = null;

  ccc_my_favorite_list_ajax(); // お気に入りの投稿をリスト表示するためのAjax関数を呼び出し

  /*** お気に入りの投稿をリスト表示するためのAjax関数 ***/
  function ccc_my_favorite_list_ajax() {
    $.ajax({
      type: 'POST',
      url: CCC_MY_FAVORITE_LIST.api,
      data: data_set
    }).fail( function() {
      /* 読み込み中のローディングを非表示 */
      $('#'+ loader).fadeOut();
      alert('error');
    }).done( function(response){
      post_area_elm.html(response);
      var post_count_val = $('.'+ list_post).length;
      $('#'+ count_post).children('.number').text(post_count_val);
      var found_posts_count_val = $('.ccc-favorite-post-count').find('.num').text();
      $('#'+ count_post).children('.found_posts').hide();
      if( Number( post_count_val ) < Number( found_posts_count_val ) ) {
        $('#'+ more_trigger).fadeIn();
        $('#'+ count_post).children('.found_posts').text(found_posts_count_val).fadeIn();
      } else {
        $('#'+ more_trigger).hide();
      } //endif
      if( Number( found_posts_count_val ) < 1 ) {
        $('.'+ CCC.favorite.delete_btn).hide();
        $('#'+ count_post).children('.found_posts').hide();
      } //endif
      /*** オプション：トグルボタンにクラスを追加（select.jsを使用） ***/
      //非ユーザーは登録アイコンの判定処理が先に動くため。またログインユーザーでもajaxの処理順によってはinitial関数が先に動いてしまうため
      $('.'+ CCC.favorite.toggle_btn).addClass(CCC.favorite.save_classname);
      /* 読み込み中のローディングを非表示 */
      $('#'+ loader).fadeOut();
    });
  } //endfunction


  /*** クリック（さらに読み込むトリガー）：保存されたお気に入りの投稿を表示する関数を呼び出し ***/
  $(document).on('click', '#'+ more_trigger, function(e) {
    e.preventDefault();
    /* 保存されたお気に入りの投稿を表示する関数を呼び出し */
    data_set[CCC.favorite.storage_key()] = localStorage.getItem(CCC.favorite.storage_key()); // ローカルストレージから指定したキーの値を再取得
    data_set['looplength'] = $('.'+ list_post).filter(':visible').length; // 再取得：現在表示中の投稿数を再取得（注意：動的要素のためオブジェクト変数に格納する事は出来ない）
    ccc_my_favorite_list_ajax(); // お気に入りの投稿をリスト表示するためのAjax関数を呼び出し
  });


  /*** 実行本体：お気に入りの投稿を削除する関数 ***/
  function my_favorite_delete(this_elm) {
    if ( this_elm.parent().data('ccc_favorite-delete_all') == true ) {
      var my_promise = $.when(
        $('.'+ list_post).fadeOut()
      );
    } else {
      var my_promise = $.when(
        this_elm.closest('.'+ list_post).fadeOut()
      );
    } //endif
    my_promise.done( function() {
      found_posts_count_val = $('.ccc-favorite-post-count').find('.num').text();
      $('#'+ count_post).children('.found_posts').text(found_posts_count_val);
      var list_post_num = $('.'+ list_post).filter(':visible').length;
      $('#'+ count_post).children('.number').text(list_post_num);
      if( Number( list_post_num ) < 1 ) {
        setTimeout( function() {
          /* 保存されたお気に入りの投稿を表示する関数を呼び出し */
          data_set[CCC.favorite.storage_key()] = localStorage.getItem(CCC.favorite.storage_key()); // ローカルストレージから指定したキーの値を再取得
          data_set['looplength'] = null;
          ccc_my_favorite_list_ajax(); // お気に入りの投稿をリスト表示するためのAjax関数を呼び出し
        },600);
      } //endif
    });
  } //endfunction

  /*** 削除ボタンの表示切り替え ***/
  $('.'+ CCC.favorite.delete_btn).hide();
  if( $('.'+ list_post).filter(':visible').length > 0 ) {
    $('.'+ CCC.favorite.delete_btn).fadeIn();
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

})(jQuery);
