<?php
/**
 * Customized Product
 *
 * Customized products cannot be purchased - they are wrappers for other products.
 *
 * @package WooCommerce\Classes\Products
 * @version 3.0.0
 */

defined('ABSPATH') || exit;

/**
 * Product customized class.
 */
class WC_Product_Customized extends \WC_Product {
	/**
	 * Stores product data.
	 *
	 * @var array
	 */
	protected $extra_data = [
		'children' => []
	];
	/**
	 * Initialize simple product.
	 *
	 * @param WC_Product|int $product Product instance or ID.
	 */
	public function __construct($product = 0) {
		// $this->supports[] = 'ajax_add_to_cart';
		parent::__construct($product);
	}
	/**
	 * Get internal type.
	 *
	 * @return string
	 */
	public function get_type() {
		return 'customized';
	}
	/**
	 * Get the add to url used mainly in loops.
	 *
	 * @return string
	 */
	public function add_to_cart_url() {
		$url = $this->is_purchasable() && $this->is_in_stock() ? remove_query_arg(
			'added-to-cart',
			add_query_arg(
				[
					'add-to-cart' => $this->get_id()
				],
				(function_exists('is_feed') && is_feed()) || (function_exists('is_404') && is_404()) ? $this->get_permalink() : ''
			)
		) : $this->get_permalink();
		$url = trailingslashit($this->get_permalink()) . 'customize/';
		return apply_filters('woocommerce_product_add_to_cart_url', $url, $this);
	}
	/**
	 * Get the add to cart button text.
	 *
	 * @return string
	 */
	public function add_to_cart_text() {
		$text = $this->is_purchasable() && $this->is_in_stock() ? __('Customize', 'kaluste') : __('Read more', 'kaluste');
		// 
		return $text;
		return apply_filters('woocommerce_product_add_to_cart_text', $text, $this);
	}
	/**
	 * Get the add to cart button text description - used in aria tags.
	 *
	 * @since 3.3.0
	 * @return string
	 */
	public function add_to_cart_description() {
		/* translators: %s: Product title */
		$text = $this->is_purchasable() && $this->is_in_stock() ? __('Customize: &ldquo;%s&rdquo;', 'kaluste') : __('Read more about &ldquo;%s&rdquo;', 'kaluste');
		return apply_filters('woocommerce_product_add_to_cart_description', sprintf($text, $this->get_name()), $this);
	}
	/**
	 * Returns false if the product cannot be bought.
	 *
	 * @return bool
	 */
	public function is_purchasable() {
		return apply_filters('woocommerce_is_purchasable', true, $this);
	}
}
