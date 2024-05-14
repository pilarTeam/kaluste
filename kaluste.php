<?php
/**
 * This plugin ordered by a client and done by Remal Mahmud (github.com/pilarTeam). Authority dedicated to that cient.
 *
 * @wordpress-plugin
 * Plugin Name:       Kaluste Customized Furniture
 * Plugin URI:        https://github.com/pilarTeam/noste/
 * Description:       Customized furniture builder specialy build for kaluste comes with customizing option for furniture builder to order completed process.
 * Version:           1.0.0
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * Author:            pilarTeam
 * Author URI:        https://github.com/pilarTeam/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       kaluste
 * Domain Path:       /languages
 * 
 * @package Kaluste
 * @author  Remal Mahmud (https://github.com/pilarTeam)
 * @version 1.0.2
 * @link https://github.com/pilarTeam/noste/
 * @category	WordPress Plugin
 * @copyright	Copyright (c) 2024-26
 * 
 */
/**
 * Bootstrap the plugin.
 */

defined('KALUSTE_FILE__') || define('KALUSTE_FILE__', untrailingslashit(__FILE__));
defined('KALUSTE_DIR_PATH') || define('KALUSTE_DIR_PATH', untrailingslashit(plugin_dir_path(KALUSTE_FILE__)));
defined('KALUSTE_DIR_URI') || define('KALUSTE_DIR_URI', untrailingslashit(plugin_dir_url(KALUSTE_FILE__)));
defined('KALUSTE_BUILD_URI') || define('KALUSTE_BUILD_URI', untrailingslashit(KALUSTE_DIR_URI) . '/assets/build');
defined('KALUSTE_BUILD_PATH') || define('KALUSTE_BUILD_PATH', untrailingslashit(KALUSTE_DIR_PATH) . '/assets/build');
defined('KALUSTE_BUILD_JS_URI') || define('KALUSTE_BUILD_JS_URI', untrailingslashit(KALUSTE_DIR_URI) . '/assets/build/js');
defined('KALUSTE_BUILD_JS_DIR_PATH') || define('KALUSTE_BUILD_JS_DIR_PATH', untrailingslashit(KALUSTE_DIR_PATH) . '/assets/build/js');
defined('KALUSTE_BUILD_IMG_URI') || define('KALUSTE_BUILD_IMG_URI', untrailingslashit(KALUSTE_DIR_URI) . '/assets/build/src/img');
defined('KALUSTE_BUILD_CSS_URI') || define('KALUSTE_BUILD_CSS_URI', untrailingslashit(KALUSTE_DIR_URI) . '/assets/build/css');
defined('KALUSTE_BUILD_CSS_DIR_PATH') || define('KALUSTE_BUILD_CSS_DIR_PATH', untrailingslashit(KALUSTE_DIR_PATH) . '/assets/build/css');
defined('KALUSTE_BUILD_LIB_URI') || define('KALUSTE_BUILD_LIB_URI', untrailingslashit(KALUSTE_DIR_URI) . '/assets/build/library');
defined('KALUSTE_OPTIONS') || define('KALUSTE_OPTIONS', get_option('kaluste'));

require_once KALUSTE_DIR_PATH . '/inc/helpers/autoloader.php';
// require_once KALUSTE_DIR_PATH . '/inc/helpers/template-tags.php';
function kaluste_print($args = []) {
	echo '<pre>';print_r($args);wp_die('Remal Mahmud (mahmudremal@yahoo.com)');echo '</pre>';
}

try {
	if (!function_exists('kaluste_furniture_instance')) {
		function kaluste_furniture_instance() {\KALUSTE\inc\Project::get_instance();}
		kaluste_furniture_instance();
	}
} catch (\Exception $e) {
	wp_die($e->getMessage(), 'Exception');
} catch (\Error $e) {
	wp_die($e->getMessage(), 'Error');
} finally {
	// Optional code that always runs
	// echo "Finally block executed.";
}

