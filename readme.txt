=== My Favorites ===
Contributors: takashimatsuyama
Donate link:
Tags: favorites, likes, accessibility, favorite posts
Requires at least: 4.8
Tested up to: 5.7
Requires PHP: 5.4.0
Stable tag: 1.3.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Save user's favorite posts and list them.

== Description ==

Save user's favorite posts and list them.
This plugin is simple. You can save the user's favorite posts just a install and display them anywhere you want with just a shortcode.
The logged-in user's data is saved in the user meta. Other user's data is saved to Web Storage (localStorage).

== Usage ==

* **Shortcode:** `[ccc_my_favorite_select_button post_id="" style=""]`
* **Shortcode:** `[ccc_my_favorite_list_menu slug="" text="" style=""]`
* **Shortcode:** `[ccc_my_favorite_list_results class="" style=""]`

For pages with a shortcode for list view ([ccc_my_favorite_list_results]).

If you want, you can change the code for list view yourself.

* **Shortcode:** `[ccc_my_favorite_list_custom_template style=""]`

For pages with a shortcode for custom list view ([ccc_my_favorite_list_custom_template]).
Add the function (`function ccc_my_favorite_list_custom_template( $my_favorite_post_id ) { }`) for your list view to `your-theme/functions.php`.
`$my_favorite_post_id` is array.

Detailed usage is under preparation.

== Discover More ==

This plugin is [developed on GitHub](https://github.com/takashi-matsuyama/my-favorites)

== Installation ==

1. Upload `my-favorites` to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Use shortcodes to display the favorite posts list and an icon for save and a menu for link to list.

== Changelog ==

See the [release notes on GitHub](https://github.com/takashi-matsuyama/my-favorites/releases).
