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
		add_action('wp_ajax_kaluste/update/product/configuration', [$this, 'update_product_configuration'], 10, 0);
	}
	public function get_product_configuration() {
		$response = [];
		if (isset($_POST['product_id']) && !empty($_POST['product_id'])) {
			try {
				$config = get_post_meta((int) $_POST['product_id'], '_customized_configuration', true);
				if ($config && !empty($config)) {
					$response = [
						'tabs'		=> (array) $config
					];
				} else {
					$response = ['tabs'	=> []]; // '_new' => true
				}
				$response['info'] = [
					'prod_title' => get_the_title((int) $_POST['product_id']),
				];
				wp_send_json_success($response);
			} catch (\Exception $th) {
				//throw $th;
			}
		}
		wp_send_json_error($response, 500);
	}
	public function update_product_configuration() {
		$_tabset = json_decode(preg_replace('/[\x00-\x1F\x80-\xFF]/', '', stripslashes(html_entity_decode(isset($_POST['tabset'])?$_POST['tabset']:'{}'))), true);
		$is_updated = update_post_meta((int) $_POST['product_id'], '_customized_configuration', $_tabset);
		wp_send_json_success(true);
	}
}
