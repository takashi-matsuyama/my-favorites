<?php

/**
 * Plugin Name: My Favorites
 * Plugin URI: https://wordpress.org/plugins/my-favorites/
 * Description: Save user's favorite posts and list them.
 * Version: 1.4.3
 * Requires at least: 4.8
 * Requires PHP: 5.4.0
 * Author: Takashi Matsuyama
 * Author URI: https://profiles.wordpress.org/takashimatsuyama/
 * Text Domain: my-favorites
 */

if (! defined('ABSPATH')) {
  exit; // Exit if accessed directly.
}

$this_plugin_info = get_file_data(__FILE__, array(
  'name' => 'Plugin Name',
  'version' => 'Version',
  'text_domain' => 'Text Domain',
  'minimum_php' => 'Requires PHP',
));

define('CCCMYFAVORITE_PLUGIN_PATH', rtrim(plugin_dir_path(__FILE__), '/'));
define('CCCMYFAVORITE_PLUGIN_URL', rtrim(plugin_dir_url(__FILE__), '/'));
define('CCCMYFAVORITE_PLUGIN_SLUG', trim(dirname(plugin_basename(__FILE__)), '/'));
define('CCCMYFAVORITE_PLUGIN_NAME', $this_plugin_info['name']);
define('CCCMYFAVORITE_PLUGIN_VERSION', $this_plugin_info['version']);
define('CCCMYFAVORITE_TEXT_DOMAIN', $this_plugin_info['text_domain']);

load_plugin_textdomain(CCCMYFAVORITE_TEXT_DOMAIN, false, basename(dirname(__FILE__)) . '/languages');

/*** Require PHP Version Check ***/
if (version_compare(phpversion(), $this_plugin_info['minimum_php'], '<')) {
  $plugin_notice = sprintf(__('Oops, this plugin will soon require PHP %s or higher.', CCCMYFAVORITE_TEXT_DOMAIN), $this_plugin_info['minimum_php']);
  register_activation_hook(__FILE__, create_function('', "deactivate_plugins('" . plugin_basename(__FILE__) . "'); wp_die('{$plugin_notice}');"));
}

if (! class_exists('CCC_My_Favorite')) {
  require(CCCMYFAVORITE_PLUGIN_PATH . '/function.php');
  /****** CCC_My_Favorite Initialize ******/
  function ccc_my_favorite_initialize()
  {
    global $ccc_my_favorite;
    /* Instantiate only once. */
    if (! isset($ccc_my_favorite)) {
      $ccc_my_favorite = new CCC_My_Favorite();
    }
    return $ccc_my_favorite;
  }
  /*** Instantiate ****/
  ccc_my_favorite_initialize();

  /*** How to use this Shortcode ***/
  /*
  * [ccc_my_favorite_select_button post_id="int" text="string" style="string"]
  * [ccc_my_favorite_list_menu slug="string" text="string" style="string"]
  * [ccc_my_favorite_list_results class="string" style="string" posts_per_page="int" excerpt="int"]
  */
  require(CCCMYFAVORITE_PLUGIN_PATH . '/assets/shortcode-select.php');
  require(CCCMYFAVORITE_PLUGIN_PATH . '/assets/shortcode-list.php');

  /****** Uninstall ******/
  require(CCCMYFAVORITE_PLUGIN_PATH . '/assets/uninstall.php');
  register_uninstall_hook(__FILE__, array('CCC_My_Favorite_Uninstall', 'delete_usermeta'));
} else {
  $plugin_notice = __('Oops, PHP Class Name Conflict.', CCCMYFAVORITE_TEXT_DOMAIN);
  wp_die($plugin_notice);
}
