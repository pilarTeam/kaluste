<?php
/**
 * Internationalize bundle managment
 *
 * @package Kaluste
 */
namespace KALUSTE\inc;
use KALUSTE\inc\Traits\Singleton;
class Shortcodes {
	use Singleton;
	private $translations = [];
	protected function __construct() {
		$this->setup_hooks();
	}
	protected function setup_hooks() {
		// add_shortcode('KALUSTE_status', [$this, 'KALUSTE_status']);
	}
	public function KALUSTE_status($args) {
		$args = wp_parse_args($args, []);
		// 
	}
}
