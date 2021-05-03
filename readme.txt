=== My Favorites ===
Contributors: takashimatsuyama
Donate link:
Tags: favorites, likes, accessibility, favorite posts
Requires at least: 4.8
Tested up to: 5.6
Requires PHP: 5.4.0
Stable tag: 1.1.0
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

For pages with a shortcode for list view ([ccc_my_favorite_list_results]), set the slug to "favorites" or the page template file name to "ccc-favorite.php".

== Installation ==

1. Upload `my-favorites` to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Use shortcodes to display the favorite posts list and an icon for save and a menu for link to list.

== Screenshots ==



== Changelog ==

= 1.1.0 =
Add shortcode attribute (`style=""`) and modify CSS.

= 1.0.1 =
Modify default slug of shortcode (`[ccc_my_favorite_list_menu slug=""]`) to "favorites" from "ccc-favorite" and modify readme.txt, description.

= 1.0.0 =
Initial release.