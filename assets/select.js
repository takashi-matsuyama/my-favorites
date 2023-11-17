/*
* Author: Takashi Matsuyama
* Author URI: https://profiles.wordpress.org/takashimatsuyama/
* Description: WordPressでお気に入りの投稿をローカルストレージとMySQLのユーザーメタに保存（クリックで保存と削除を切替/一括削除）
* Version: 1.0.0 or later
*/

/* グローバルネームスペース */
/* MYAPP = CCC */
var CCC = CCC || {};

(function($){
  /* サブネームスペース */
  CCC.favorite = {

    /* 初期設定（グローバル変数を設定） */
    toggle_btn : 'ccc-favorite-post-toggle-button',
    toggle_btn_elm : $('.ccc-favorite-post-toggle-button'),
    delete_btn : 'ccc-favorite-post-delete-button',
    count_elm : $('.ccc-favorite-post-count'),
    num_elm : $('.num'),
    save_classname : 'save',
    active_classname : 'active',
    data_key : 'post_id-ccc_favorite',

    storage_key : function() {
      var key = 'ccc-my_favorite_post'; // お気に入りの投稿を保存するストレージキーの名前を指定
      return key;
    }, // メンバのメソッドを定義

    initial : function(favorite_value) {
      /* ロード：お気に入りの投稿の保存数とアイコンを分別 */
      if (favorite_value !== null) {
        var favorite_value_array = favorite_value.split(','); // カンマで分割して配列にする
        /* 配列から「null」や「undefined」、「"" 空文字」が入った要素を削除する */
        favorite_value_array = favorite_value_array.filter(function(v){
          return !(v === null || v === undefined || v === ""); // 0は除くためfilter(Boolean)は使わない
        });
        //console.log(favorite_value_array);
        CCC.favorite.count_elm.find(CCC.favorite.num_elm).text(favorite_value_array.length);
        /* お気に入りの投稿の保存数のアイコンを分別 */
        if ( favorite_value_array.length > 0 ) {
          CCC.favorite.count_elm.addClass(CCC.favorite.active_classname);
        } else {
          CCC.favorite.count_elm.removeClass(CCC.favorite.active_classname);
        }
        /* お気に入りの投稿のアイコンを分別 */
        // 注意：eachする要素はお気に入り一覧（my_favorite-list.php）側ではajaxで動的に生成するためjQueryオブジェクトの変数は使用できない
        $('.'+ CCC.favorite.toggle_btn).each( function() {
          var post_id = $(this).data(CCC.favorite.data_key);
          var value_index = favorite_value_array.indexOf(String(post_id)); // ストレージの値は文字列に変換しているので、indexOfの指定も数値を文字列に変換する必要がある
          if (value_index === -1) {
            $(this).removeClass(CCC.favorite.save_classname); // お気に入りのローカルストレージの値に投稿IDが無い場合（戻り値：-1）
          } else {
            $(this).addClass(CCC.favorite.save_classname); // お気に入りのローカルストレージの値に投稿IDが有る場合（戻り値：0以上）
          }
        });
      }
    },

    action : function(favorite_key, favorite_value) {

      /*** 実行本体：お気に入りの投稿の選択を切替える関数 ***/
      function my_favorite_toggle(this_elm){
        var post_id = this_elm.data(CCC.favorite.data_key);
        //console.log(post_id);
        this_elm.toggleClass(CCC.favorite.save_classname); // お気に入りの投稿のアイコンを切替

        /* 選択：お気に入りの投稿を切り替え */
        if (favorite_value === null) {
          var favorite_value_array = []; // 新たに配列を作成
          favorite_value_array.unshift(String(post_id)); // 配列の最初に1つ以上の要素を追加し、新しい配列の長さを返す
        } else {
          var favorite_value_array = favorite_value.split(','); // カンマで分割して配列にする
          favorite_value_array = favorite_value_array.map(function (item) {
            return String(item).trim();
          })
          favorite_value_array = favorite_value_array.filter(function onlyUnique(value, index, array) {
            return array.indexOf(value) === index;
          });
          var value_index = favorite_value_array.indexOf(String(post_id)); // ストレージの値は文字列に変換しているので、indexOfの指定も数値を文字列に変換する必要がある
          if (value_index === -1) {
            favorite_value_array.unshift(String(post_id)); // 配列の最初に1つ以上の要素を追加し、新しい配列の長さを返す
          } else {
            //console.log("重複している投稿ID："+ post_id);
            favorite_value_array.splice(value_index, 1); // インデックスn番目から、1つの要素を削除（重複してたら、それを削除）
          }
        }
        /* 配列から「null」や「undefined」、「"" 空文字」が入った要素を削除する */
        favorite_value_array = favorite_value_array.filter(function(v) {
          return !(v === null || v === undefined || v === ""); // 0は除くためfilter(Boolean)は使わない
        });
        /* 保存する投稿の数を制限：配列の数がX個以上ある場合、Y個に減らす */
        if( favorite_value_array.length > 300 ) {
          favorite_value_array = favorite_value_array.slice( 0, 300 ); /* 開始位置と終了位置を指定（開始位置は0から数えて終了位置の値は含まない） */
        }
        favorite_value_array_str = favorite_value_array.join(','); // 配列要素の連結・結合：配列を連結して1つの文字列に変換
        /* ログインユーザーでは無い場合 */
        if( CCC_MY_FAVORITE_UPDATE.user_logged_in == false ) {
          localStorage.setItem(favorite_key, favorite_value_array_str); // 指定したキーのローカルストレージにお気に入りの投稿の文字列データを保存
        }
        /* お気に入りの投稿の保存数を更新 */
        CCC.favorite.count_elm.find(CCC.favorite.num_elm).text(favorite_value_array.length);
        if ( favorite_value_array.length > 0 ) {
          CCC.favorite.count_elm.addClass(CCC.favorite.active_classname);
        } else {
          CCC.favorite.count_elm.removeClass(CCC.favorite.active_classname);
        }
      }

      /*** 実行本体：お気に入りの投稿をMySQLのユーザーメタ（wp_usermeta）に保存する関数 ****/
      function my_favorite_update_ajax(value){
        $.ajax({
          url : CCC_MY_FAVORITE_UPDATE.api, // admin-ajax.phpのパスをローカライズ（wp_localize_script関数）
          type : 'POST',
          data : {
            action : CCC_MY_FAVORITE_UPDATE.action, // wp_ajax_フックのサフィックス
            nonce : CCC_MY_FAVORITE_UPDATE.nonce, // wp nonce
            post_ids : value
          },
        }).fail( function(){
          console.log('ccc_my_favorite_update : ajax error');
        }).done( function(response){
          //console.log(response);
        });
      }

      /*** クリック：お気に入りの投稿を保存 ***/
      $(document).on('click', '.'+ CCC.favorite.toggle_btn, function(e) {
        e.preventDefault();
        var this_elm = $(this);
        /* ログインユーザーでは無い場合 */
        if( CCC_MY_FAVORITE_UPDATE.user_logged_in == false ) {
          favorite_value = localStorage.getItem(favorite_key); // クリックする度にローカルストレージから指定したキーの値を再取得
          my_favorite_toggle(this_elm); // 実行本体：お気に入りの投稿の選択を切替える関数を呼び出し
          //console.log(localStorage);
        } else {
          $.ajax({
            url : CCC_MY_FAVORITE_GET.api, // admin-ajax.phpのパスをローカライズ（wp_localize_script関数）
            type : 'POST',
            data : {
              action : CCC_MY_FAVORITE_GET.action, // wp_ajax_フックのサフィックス
              nonce : CCC_MY_FAVORITE_GET.nonce // wp nonce
            },
          }).fail( function(){
            console.log('ccc_my_favorite_get : ajax error');
          }).done( function(response){
            favorite_value = response; // ログインユーザー用のお気に入りの投稿のキー名を指定
            //console.log(favorite_value);
            my_favorite_toggle(this_elm); // 実行本体：お気に入りの投稿の選択を切替える関数を呼び出し
            my_favorite_update_ajax(favorite_value_array_str); // お気に入りの投稿をユーザーメタ（wp_usermeta）に保存する関数を呼び出し
          });
        }
      });

      /*** クリア：お気に入りの投稿を全て削除 ***/
      $(document).on('click', '.'+ CCC.favorite.delete_btn, function(e) {
        e.preventDefault();
        /* ログインユーザーでは無い場合 */
        if( CCC_MY_FAVORITE_UPDATE.user_logged_in == false ) {
          localStorage.removeItem(favorite_key); // ローカルストレージから指定したデータ（キーと値）を削除
          //console.log(localStorage);
        } else {
          my_favorite_update_ajax(''); // お気に入りの投稿をMySQLのユーザーメタ（wp_usermeta）に保存する関数を呼び出し：ユーザーメタの値を削除
        }
        CCC.favorite.count_elm.find(CCC.favorite.num_elm).text(0); // お気に入りの投稿の保存数をクリア
        CCC.favorite.count_elm.removeClass(CCC.favorite.active_classname); // お気に入りの投稿の保存数のアイコンをクリア
        CCC.favorite.toggle_btn_elm.removeClass(CCC.favorite.save_classname); // お気に入りの投稿のアイコンをクリア
      });

    }, // メンバのメソッドを定義
  }; // サブネームスペース




  /* ログインユーザーでは無い場合 */
  if( CCC_MY_FAVORITE_UPDATE.user_logged_in == false ) {
    var favorite_key = CCC.favorite.storage_key(); // お気に入りの投稿のストレージキーの名前を変数に格納（CCC.favoriteのstorage_key関数を呼び出し）
    var favorite_value = localStorage.getItem(favorite_key); // ローカルストレージから指定したキーの値を取得
    CCC.favorite.initial(favorite_value); // CCC.favoriteのinitial関数を呼び出し
    CCC.favorite.action(favorite_key, favorite_value); // CCC.favoriteのaction関数を呼び出し
  } else {
    $.ajax({
      url : CCC_MY_FAVORITE_GET.api, // admin-ajax.phpのパスをローカライズ（wp_localize_script関数）
      type : 'POST',
      data : {
        action : CCC_MY_FAVORITE_GET.action, // wp_ajax_フックのサフィックス
        nonce : CCC_MY_FAVORITE_GET.nonce // wp nonce
      },
    }).fail( function(){
      console.log('my_favorite_get : ajax error');
    }).done( function(response){
      var favorite_key = ''; // ログインユーザーはローカルストレージを使用しないのでストレージキーは不要
      var favorite_value = response; // MySQLのユーザーメタ（wp_usermeta）からお気に入りの投稿の値を取得
      //console.log(favorite_value);
      CCC.favorite.initial(favorite_value); // CCC.favoriteのinitial関数を呼び出し
      CCC.favorite.action(favorite_key, favorite_value); // CCC.favoriteのaction関数を呼び出し
    });
  }




})(jQuery);
