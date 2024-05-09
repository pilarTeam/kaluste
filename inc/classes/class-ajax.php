<?php
/**
 * Ajax request handler
 *
 * @package Kaluste
 */
namespace KALUSTE\inc;
use KALUSTE\inc\Traits\Singleton;

class Ajax {
	use Singleton;
	protected function __construct() {
		$this->setup_hooks();
	}
	protected function setup_hooks() {
		add_action('wp_ajax_nopriv_kaluste/get/product/configuration', [$this, 'get_product_configuration'], 10, 0);
		add_action('wp_ajax_kaluste/get/product/configuration', [$this, 'get_product_configuration'], 10, 0);
	}
	public function get_product_configuration() {
		$response = [];
		if (isset($_POST['product_id']) && !empty($_POST['product_id'])) {
			try {
				$config = get_post_meta((int) $_POST['product_id'], '_customized_configuration', true);
				if ($config && !empty($config)) {
					$response = (array) $config;
				} else {
					$response = []; // '_new' => true
				}
				wp_send_json_success($response);
			} catch (\Exception $th) {
				//throw $th;
			}
		}
		wp_send_json_error($response, 500);
	}
}
