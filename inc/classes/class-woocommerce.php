<?php
/**
 * Internationalize bundle managment
 *
 * @link reference https://rudrastyh.com/woocommerce/woocommerce_form_field.html
 * 
 * @package Kaluste
 */
namespace KALUSTE\inc;
use KALUSTE\inc\Traits\Singleton;
class Woocommerce {
	use Singleton;
	private $settings = false;
	protected function __construct() {
		$this->setup_hooks();
	}
	protected function setup_hooks() {
		// add_filter('kaluste/wc/get/settings', [$this, 'get_settings'], 0, 2);
		add_action('woocommerce_loaded', [$this, 'load_include_custom_product']);
		add_filter('product_type_selector', [$this, 'add_custom_product_type']);
		add_filter('woocommerce_product_data_tabs', [$this, 'woocommerce_product_data_tabs']);
		add_action('woocommerce_product_data_panels', [$this, 'add_product_data_tab_content']);
		add_action('save_post_product', [$this, 'save_custom_product_fields'], 10, 3);
		add_action('woocommerce_customized_add_to_cart', [$this, 'display_add_to_cart_button_on_single'], 30);
		add_filter('woocommerce_product_add_to_cart_text', [$this, 'add_to_cart_text'], 10, 2);
		add_filter('woocommerce_product_class', [$this, 'woocommerce_product_class'], 10, 2);
		add_filter('woocommerce_product_options_general_product_data', [$this, 'woocommerce_product_options_general_product_data'], 10, 0);

		// add_filter('template_include', [$this, 'template_include'], 10, 1);
		// add_action('init', [$this, 'customize_rewrite_rules'], 10, 0);
		// add_action('template_redirect', [$this, 'customize_endpoint_content'], 10, 0);
		// add_filter('template_include', [$this, 'template_include'], 10, 1);
		

		
	}
	/**
	 * Get settings object form wooocommrers payment settings including api keys and sensitive informations.
	 * 
	 * @mahmudremal
	 * @param null $settings an array or settings by default pushed.
	 * @param string|object $key is an specific key to get specific settings.
	 */
	public function get_settings($settings, $key = false) {
		if (!$this->settings) {
			// $this->settings = get_option('', []);
			$gateways = WC()->payment_gateways->payment_gateways();
			$this->settings = ($gateways && isset($gateways['flutterwave']))?$gateways['flutterwave']->settings:[];
			$this->settings['public_key'] = ($this->settings['testmode'] == 'yes')?$this->settings['test_public_key']:$this->settings['live_public_key'];
			$this->settings['secret_key'] = ($this->settings['testmode'] == 'yes')?$this->settings['test_secret_key']:$this->settings['live_secret_key'];
		}
		if ($key !== false) {
			return isset($this->settings[$key])?$this->settings[$key]:$settings;
		}
		return $this->settings;
		return [$settings, ...$this->settings];
	}
	/**
	 * Load Customized product.
	 */
	public function load_include_custom_product() {
		require_once KALUSTE_DIR_PATH . '/inc/widgets/class-wc-product-customized.php';
	}
	/**
	 * Customized product type.
	 *
	 * @param array $types Product types.
	 *
	 * @return void
	 */
	public function add_custom_product_type($types) {
		$types['customized'] = esc_html__('Customized product', 'kaluste');
		return $types;
	}
	/**
	 * Modify product data tabs.
	 *
	 * @param array $tabs List of product data tabs.
	 *
	 * @return array $tabs Product data tabs.
	 */
	public function woocommerce_product_data_tabs($tabs) {
		if ('product' === get_post_type()) {
			?>
				<script type='text/javascript'>
					document.addEventListener('DOMContentLoaded', () => {
					let optionGroupPricing = document.querySelector('.options_group.pricing');
					!!optionGroupPricing && optionGroupPricing.classList.add('show_if_customized');
					let stockManagement = document.querySelector('._manage_stock_field');
					!!stockManagement && stockManagement.classList.add('show_if_customized');
					let soldIndividuallyDiv = document.querySelector('.inventory_sold_individually');
					let soldIndividually = document.querySelector('._sold_individually_field');
					!!soldIndividuallyDiv && soldIndividuallyDiv.classList.add('show_if_customized');
					!!soldIndividually && soldIndividually.classList.add('show_if_customized');
					<?php if ('yes' === get_option('woocommerce_calc_taxes')) { ?>
						let generalProductData = document.querySelectorAll('#general_product_data > .options_group');
						let taxDiv = !!generalProductData && Array.from(generalProductData).at(-1);
						!!taxDiv && taxDiv.classList.add('show_if_customized');
					<?php } ?>
					});
				</script>
			<?php
		}
		foreach ($tabs as $key => $val) {
			$product_tabs = ['general', 'inventory'];
			if (! in_array($key, $product_tabs)) {
				$tabs[ $key ]['class'][] = 'hide_if_customized';
			} else {
				$tabs['inventory']['class'][] = 'show_if_customized';
			}
		}
		// Add your Customized product data tabs.
		$custom_tab = [
			'customized' => [
				'label'    => __('Customization', 'kaluste'),
				'target'   => 'customized_data_html',
				'class'    => ['show_if_customized'],
				'priority' => 0, // 21
			]
		];
		return array_merge($tabs, $custom_tab);
	}
	/**
	 * Customized tab general input fields
	 * 
	 * @return array $fields with all general fields data.
	 */
	protected function get_product_data_fields() {
		$fields = [
			// '_customized_title'	=> [
			// 	'default'     => '',
			// 	// 'required'	  => true,
			// 	'type'				=> 'text',
			// 	'label'				=> esc_html__('Customization title', 'kaluste'),
			// 	'description'		=> esc_html__('Enter customization panel title here', 'kaluste'),
			// 	'placeholder'		=> esc_html__('Customization', 'kaluste'),
			// 	'wrapper_class'		=> 'show_customizedple',
			// 	'desc_tip'			=> esc_html__('Enter customization screen title that will apear obove the customization screen.', 'kaluste')
			// ],
			// '_customized_desc'	=> [
			// 	'default'     => '',
			// 	// 'required'	  => true,
			// 	'type'				=> 'text',
			// 	'label'				=> esc_html__('Customization Description', 'kaluste'),
			// 	'description'		=> esc_html__('Enter customization panel description here', 'kaluste'),
			// 	'placeholder'		=> esc_html__('Description goes here...', 'kaluste'),
			// 	// 'wrapper_class'		=> 'show_if_customized',
			// 	// 'desc_tip'			=> esc_html__('Enter customization screen description that will apear obove the customization screen.', 'kaluste')
			// ],
			// '_customized_desc'	=> [
			// 	'default'			=> '',
			// 	// 'required'		=> true,
			// 	'type'				=> 'text',
			// 	'label'				=> esc_html__('Customization Description', 'kaluste'),
			// 	'description'		=> esc_html__('Enter customization panel description here', 'kaluste'),
			// 	'placeholder'		=> esc_html__('Description goes here...', 'kaluste'),
			// 	// 'wrapper_class'		=> 'show_if_customized',
			// 	// 'desc_tip'			=> esc_html__('Enter customization screen description that will apear obove the customization screen.', 'kaluste')
			// ],
			// '_customized_preload'	=> [
			// 	'default'			=> '',
			// 	// 'required'	  	=> true,
			// 	'type'				=> 'checkbox',
			// 	'label'				=> esc_html__('Preloader', 'kaluste'),
			// 	'description'		=> esc_html__('Select a preloader type', 'kaluste'),
			// 	// 'placeholder'		=> esc_html__('Description goes here...', 'kaluste'),
			// 	// 'wrapper_class'		=> 'show_if_customized',
			// 	// 'desc_tip'			=> esc_html__('Enter customization screen description that will apear obove the customization screen.', 'kaluste'),
			// 	'options'			=> [
			// 		'option1'	=> 'option1',
			// 		'option2'	=> 'option2',
			// 		'option3'	=> 'option3',
			// 		'option4'	=> 'option4',
			// 		// ['key' => 'Option 1', 'value' => '1']
			// 	]
			// ],
		];
		return $fields;
	}
	/**
	 * Add product data tab content.
	 *
	 * @return void
	 */
	public function add_product_data_tab_content() {
		global $product_object;
		?>
		<div id="customized_data_html" class="panel woocommerce_options_panel">
			<div class="options_group">
				<?php
				foreach ((array) $this->get_product_data_fields() as $_id => $_row) {
					woocommerce_form_field(
						$_id,
						$_row,
						$product_object->get_meta($_id, true)
					);
				}
				?>
			</div>
			<div class="customizer">
				<div class="customizer__container">
					<div class="customizer__wrapper">
						<div class="customizer__header">
							<div class="customizer__header__title"></div>
							<div class="customizer__header__actions">
								<button type="button" class="btn button" data-action="update">
									<span><?php echo esc_html(__('Update', 'kaluste')); ?></span>
									<div class="spinner-material"></div>
								</button>
								<button type="button" class="btn button" data-action="expand">
									<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#000000"></path></g></svg>
								</button>
							</div>
						</div>
						<div class="customizer__body">
							<div class="customizer__wrap">
								<div id="customizer_root" data-product_id="<?php echo esc_attr(get_the_ID()); ?>">
									<!-- root area -->
								</div>
							</div>
						</div>
						<div class="customizer__footer">
							<div class="customizer__footer__title"></div>
							<div class="customizer__footer__actions">
								<button type="button" class="btn button" data-action="newtab">
									<span><?php echo esc_html(__('Add new Tab', 'kaluste')); ?></span>
									<div class="spinner-material"></div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- <script src="https://unpkg.com/react/umd/react.development.js"></script>
		<script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script> -->
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" />
		<?php
	}
	/**
	 * Save Customized product fields function.
	 *
	 * @param int $post_id Post id.
	 * @param WP_Post $post Wordpress custom post (product).
	 * @param bool $update Whether it is create new or update existing.
	 *
	 * @return void
	 */
	public function save_custom_product_fields(int $post_id, \WP_Post $post, bool $update) {
		$product = wc_get_product($post_id);global $post_data;
		// No need to verify nonce. because a nonce verificateion already executed before.
		// if (empty($_POST['_meta_box_kalauste_nonce']) || !wp_verify_nonce(sanitize_text_field($_POST['_meta_box_kalauste_nonce']), '_meta_box_kalauste')) {
		// 	wp_die(__('Something went wrong!', 'kaluste'), __('Are you cheating!', 'kaluste'));
		// }
		$post_data = ! empty($_POST['customized_data'])?wc_clean($_POST['customized_data']):[];
		if (!empty($_POST['product-type']) && 'customized' === $_POST['product-type']) {
			update_post_meta($post_id, '_customized_enable', isset($_POST['customized_data'])?'yes':false);
			
			foreach ((array) $this->get_product_data_fields() as $_id => $_row) {
				$_data = false;
				switch ($_row['type']) {
					case 'textarea':
						$_data = sanitize_textarea_field($_POST[$_id]);
						break;
					case 'checkbox':
						$_data = isset($_POST[$_id])?'on':'off';
						break;
					default:
						$_data = sanitize_text_field($_POST[$_id]);
						break;
				}
				if (isset($_POST[$_id]) || $_data) {update_post_meta($post_id, $_id, $_data);}
			}
			// if (isset($_POST['_customized_meta'])) {update_post_meta($post_id, '_customized_meta', maybe_serialize($_POST['_customized_meta']));}
		}
	}
	/**
	 * Display add to cart button on single product page.
	 *
	 * @return void
	 */
	public function display_add_to_cart_button_on_single() {
		wc_get_template('single-product/add-to-cart/simple.php');
	}
	/**
	 * Add to cart text on the gift card product.
	 *
	 * @param string $text Text on add to cart button.
	 * @param object $product Product data.
	 *
	 * @return string $text Text on add to cart button.
	 */
	public function add_to_cart_text($text, $product) {
		if ('customized' === $product->get_type()) {
			$text = $product->is_purchasable() && $product->is_in_stock() ? __('Add to cart', 'kaluste') : $text;
		}
		return $text;
	}
	/**
	 * Add custom class on frontend body tag.
	 * 
	 * @param string $classname Class name accoding to product type
	 * @param string $product_type Profuct type of cusrrent product
	 * 
	 * @return string $classname Classname text string.
	 */
	public function woocommerce_product_class($classname, $product_type) {
		if ($product_type == 'customized') {
			$classname = 'WC_Product_Customized';
		}
		return $classname;
	}
	/**
	 * Ajax load product type selects if cusrrent product type is customized.
	 * 
	 * @return void
	 */
	public function woocommerce_product_options_general_product_data() {
		global $product_object;
		if ($product_object && 'customized' === $product_object->get_type()) {
			wc_enqueue_js("
				$('.product_data_tabs .general_tab').addClass('show_if_customized').show();
				$('.pricing').addClass('show_if_customized').show();
			");
		}
	}
	/**
	 * 
	 */
	// public function customize_rewrite_rules() {
	// 	add_rewrite_endpoint('customize', EP_PAGES );
	// }
	// public function customize_endpoint_content() {
	// 	global $wp_query;
	// 	if ( isset( $wp_query->query_vars['customize'] ) ) {
	// 		include KALUSTE_DIR_PATH . '/templates/customizer/screen.php';
	// 		exit;
	// 	}
	// }
	// public function template_include($template = '') {
	// 	global $wp_query;
		
	// 	if (
	// 		// is_singular('product') && 
	// 		// is_single() && is_product() &&
	// 		isset($wp_query->query_vars['name']) && $wp_query->query_vars['name'] === 'customize'
	// 	) {
	// 		kaluste_print([$wp_query]);
	// 		$template = KALUSTE_DIR_PATH . '/templates/customizer/screen.php';
	// 	}
	// 	return $template;
	// }

}
