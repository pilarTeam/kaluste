<?php
/**
 * Metaboxes scripts for wooocommerce product edit screen.
 *
 * @package Kaluste
 */
namespace KALUSTE\inc;
use KALUSTE\inc\Traits\Singleton;

class Meta_Boxes {
	use Singleton;
	protected function __construct() {
		$this->setup_hooks();
	}
	protected function setup_hooks() {
		add_action('add_meta_boxes', [$this, 'add_custom_meta_box']);
	}
	/**
	 * Add custom meta box.
	 *
	 * @return void
	 */
	public function add_custom_meta_box() {
		$screens = ['product'];
		foreach ($screens as $screen) {
			add_meta_box(
				'payment_details_metabox',								// Unique ID
				__('Payment Details', 'esignbinding'),					// Box title
				[$this, 'custom_meta_box_html'],						// Content callback, must be of type callable
				$screen,                   								// Post type
				'advanced',                   							// context
				'high'													// priority
			);
		}
	}
	/**
	 * Custom meta box HTML(for form)
	 *
	 * @param object $post Post.
	 *
	 * @return void
	 */
	public function custom_meta_box_html($post) {
		$product = wc_get_product($post->ID);
		?>
		<pre><?php print_r($product); ?></pre>
		<?php
		
	}
	/**
	 * Save post meta into database
	 * when the post is saved.
	 *
	 * @param integer $post_id Post id.
	 *
	 * @return void
	 */
	public function save_post_meta_data($post_id) {
		/**
		 * When the post is saved or updated we get $_POST available
		 * Check if the current user is authorized
		 */
		if (! current_user_can('edit_post', $post_id)) {
			return;
		}
		/**
		 * Check if the nonce value we received is the same we created.
		 */
		if (! isset($_POST['hide_title_meta_box_nonce_name']) ||
		     ! wp_verify_nonce($_POST['hide_title_meta_box_nonce_name'], plugin_basename(__FILE__))
		) {
			return;
		}
		if (array_key_exists('aquila_hide_title_field', $_POST)) {
			update_post_meta(
				$post_id,
				'_hide_page_title',
				$_POST['aquila_hide_title_field']
			);
		}
	}
}
