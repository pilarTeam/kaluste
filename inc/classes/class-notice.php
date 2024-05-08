<?php
/**
 * Post request handler
 *
 * @package Kaluste
 */
namespace KALUSTE\inc;
use KALUSTE\inc\Traits\Singleton;

class Notice {
	use Singleton;
	protected function __construct() {
		$this->setup_hooks();
	}
	protected function setup_hooks() {
		add_action('admin_notices', [$this, 'admin_notices'], 10, 0);
	}
	public function admin_notices() {
		if (function_exists('WC')) {return;}
		$noticeClasses = ['notice', 'notice-error', 'is-dismissible'];
		$noticeMessage = __('Please activate WooCommerce to use flutterwave payment.', 'domain');
		printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr(implode(' ', $noticeClasses)), esc_html($noticeMessage));
	}
}
