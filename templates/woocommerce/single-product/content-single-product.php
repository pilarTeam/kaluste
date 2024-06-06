<?php
/**
 * The template for displaying product content in the single-product.php template
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-single-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 3.6.0
 */

defined( 'ABSPATH' ) || exit;

global $product;

/**
 * Hook: woocommerce_before_single_product.
 *
 * @hooked woocommerce_output_all_notices - 10
 */
// do_action( 'woocommerce_before_single_product' );

if ( post_password_required() ) {
	echo get_the_password_form(); // WPCS: XSS ok.
	return;
}

$tabset = (array) $product->get_meta('_customized_configuration');
// kprint($tabset);
?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300..800&display=swap" rel="stylesheet">
<!-- Normalize Css -->
<link rel="stylesheet" href="https://kaluste.local/wp-content/plugins/kaluste/assets/html/lib/normalize-css/normalize.css">
<!-- Milligram Css-->
<link rel="stylesheet" href="https://kaluste.local/wp-content/plugins/kaluste/assets/html/lib/milligram/milligram.min.css">
<!-- Main Css-->
<link rel="stylesheet" href="https://kaluste.local/wp-content/plugins/kaluste/assets/html/assets/css/style.css">





<div id="product-<?php the_ID(); ?>" <?php wc_product_class( '', $product ); ?>>
	<!-- Start Customized screen body -->
	    <!-- Header -->
		<header class="pilar_header">
			<div class="container">
				<div class="row">
					<div class="column column-0">
						<a class="pilar_logo" href="#">
							<img src="https://kaluste.local/wp-content/plugins/kaluste/assets/html/assets/images/logo.png" alt="logo image">
						</a>
					</div>
					<div class="column">
						<div class="flex">
							<ul class="breadcrumbs">
								<?php foreach ($tabset as $tabIndex => $tab) :
								$tab = (object) wp_parse_args($tab, ['args' => ['title' => '']]); ?>
								<li class="inline-flex <?php echo esc_attr($tabIndex == 0 ? 'active':''); ?>">
									<span class="pilar_indicator">
										<span class="number">1</span>
										<span class="check_mark">
											<svg xmlns="http://www.w3.org/2000/svg" width="10.955" height="7.955" viewBox="0 0 10.955 7.955"><path id="check" d="M1.727-5.25l.864-.886,3,2.955,6.2-6.182.886.886L5.591-1.409Z" transform="translate(-1.727 9.364)" fill="#44b678"/></svg>
										</span>
									</span>
									<?php echo esc_html($tab->args['title']); ?>
								</li>
								<?php endforeach; ?>
							</ul>
						</div>
					</div>
					<div class="column column-0">
						<button class="button button-outline">Ostoskoriin</button>
					</div>
				</div>
			</div>
		</header><!-- Header -->

		<!-- Main -->
		<main class="pilar_main_wrapper">
			<div class="container">
				<div class="row">
					<!-- Left Column -->
					<div class="column column-50">
						<form action="#" class="pilar_product_card">

							<?php foreach ($tabset as $tabIndex => $tab) :
							$tab = (object) wp_parse_args($tab, ['args' => ['title' => ''], 'data' => []]); ?>
							<!-- Step <?php echo esc_html($tabIndex); ?> -->
							<div class="pilar_step" id="step<?php echo esc_html(($tabIndex + 1)); ?>">

								<!-- Card Header -->
								<div class="pilar_card_header modal">
									<div class="pilar_modal flex justify-start">
										<a class="pilar_modal_opener" href="javascript:void(0)">
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
												<defs>
												<clipPath>
													<rect id="Rectangle_100" data-name="Rectangle 100" width="24" height="24" transform="translate(64 221)" fill="#0a152f"/>
												</clipPath>
												</defs>
												<g id="information" transform="translate(-64 -221)">
												<g id="information_1_" data-name="information (1)" transform="translate(64 221)">
													<g id="Group_84" data-name="Group 84">
													<g id="Group_83" data-name="Group 83">
														<path id="Path_28" data-name="Path 28" d="M12.047,0A12.027,12.027,0,0,0,0,11.953,12.112,12.112,0,0,0,12.047,24a12,12,0,0,0,0-24Zm0,22.6A10.6,10.6,0,1,1,22.6,11.953,10.669,10.669,0,0,1,12.047,22.6Z" fill="#0a152f"/>
													</g>
													</g>
													<g id="Group_86" data-name="Group 86">
													<g id="Group_85" data-name="Group 85" transform="translate(9.938 9.844)">
														<path id="Path_29" data-name="Path 29" d="M11.6,9.844a1.927,1.927,0,0,0-1.658,2.109v5.719A1.927,1.927,0,0,0,11.6,19.781a1.927,1.927,0,0,0,1.658-2.109V11.953A1.927,1.927,0,0,0,11.6,9.844Z" transform="translate(-9.938 -9.844)" fill="#0a152f"/>
													</g>
													</g>
													<g id="Group_88" data-name="Group 88" transform="translate(0 0.903)">
													<g id="Group_87" data-name="Group 87" transform="translate(9.938 4.219)">
														<path id="Path_30" data-name="Path 30" d="M11.6,4.219a1.658,1.658,0,1,0,1.658,1.658A1.66,1.66,0,0,0,11.6,4.219Z" transform="translate(-9.938 -4.219)" fill="#0a152f"/>
													</g>
													</g>
												</g>
												</g>
											</svg>
										</a>
										<h2 class="pilar_title"><?php echo esc_html($tab->args['title']); ?></h2>
									</div>

									<?php if (!empty($tab->args['overview'])) : ?><p class="pilar_header_content"><?php echo esc_html($tab->args['overview']); ?></p><?php endif; ?>
									<hr>

									<!-- Modal Box -->
									<div class="pilar_modal_box">
										<!-- Modal Header -->
										<div class="pilar_modal_header flex justify-start">
											<a class="pilar_modal_hide" href="javascript:void(0)">
												<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43">
													<defs>
													<clipPath>
														<rect id="Rectangle_103" data-name="Rectangle 103" width="43" height="43" transform="translate(0)" fill="#0a152f"/>
													</clipPath>
													</defs>
													<g id="back-arrow" transform="translate(0)">
													<path id="XMLID_27_" d="M41.045,19.136H6.673l6.436,6.436a1.954,1.954,0,1,1-2.764,2.764L.572,18.564a1.954,1.954,0,0,1,0-2.764l9.773-9.773a1.955,1.955,0,0,1,2.764,2.764L6.673,15.227H41.045a1.955,1.955,0,0,1,0,3.909Z" transform="translate(0 4.318)" fill="#0a152f"/>
													</g>
												</svg>
											</a>
											<h2 class="pilar_title"><?php echo esc_html($tab->args['title']); ?></h2>
										</div><!-- Modal Header -->

										<!-- Modal Body -->
										<div class="pilar_modal_body">
											<?php echo wp_kses_post($tab->args['description']??__('Nothing here :(', 'kaluste')); ?>
										</div><!-- Modal Body -->
									</div><!-- Modal Box -->

								</div><!-- Card Header -->

								<!-- Card Body -->
								<div class="pilar_card_body">
									<h3 class="pilar_main_point"><span class="pilar_point">01.</span>Kylpyhuonekaapin mitat millimetreissä</h3>

									<?php foreach( (array) $tab->data as $rowIndex => $row) :
									$row = (object) wp_parse_args($row, ['fieldID' => $rowIndex, 'type' => false, 'heading' => '', 'subtitle' => '', 'options' => []]); ?>
									<div class="pilar_input" data-index="<?php echo esc_attr($row->fieldID); ?>">
										<h5><?php echo esc_html($row->heading); ?></h5>

										<?php
										switch ($row->type) {
											case 'image':
												?>
												<div class="row pilar_input_group image">
													<?php foreach ($row->options as $optionIndex => $option) :
														$option = (object) wp_parse_args($option, ['label' => '', 'thumb' => [], 'cost' => '', 'text' => '', 'gallery' => []]);
														$option->cost = ($option->cost == '')?0.00:(float) $option->cost;
														?>
														<!-- Input Column -->
														<div class="column column-33 modal">
															<label class="pilar_image_input" for="image-1-1">
																<input type="radio" id="image-1-1" name="image-1-1" value="image-1-1" />
																<img class="pilar_variation_image" src="<?php echo esc_attr($option->thumb['imageURL']??'https://kaluste.local/wp-content/plugins/kaluste/assets/html/assets/images/levy-587.png'); ?>" alt="<?php echo esc_attr($option->label); ?>">

																<div class="row">
																	<div class="column column-80">
																		<h4 class="pilar_image_title"><?php echo esc_html($option->label); ?></h4>
																		<p class="pilar_image_content"><?php echo esc_html($option->text); ?></p>
																	</div>

																	<div class="column">
																		<button class="button button-settings pilar_modal_opener">
																			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
																				<g id="gallery" transform="translate(-1063 -290)">
																				<g id="gallery-2" data-name="gallery" transform="translate(1063 290)">
																					<path id="Path_31" data-name="Path 31" d="M1.641,17.344V4.6A2.113,2.113,0,0,0,0,6.656V20.344a2.112,2.112,0,0,0,2.109,2.109H18.844a2.113,2.113,0,0,0,2.046-1.594H5.156A3.52,3.52,0,0,1,1.641,17.344Z" fill="#424242"/>
																					<circle id="Ellipse_2" data-name="Ellipse 2" cx="1.172" cy="1.172" r="1.172" transform="translate(10.828 4.828)" fill="#424242"/>
																					<path id="Path_32" data-name="Path 32" d="M12.463,13.654a.7.7,0,0,1-.926,0L8.974,11.411l-5.927,4.61v1.323a2.112,2.112,0,0,0,2.109,2.109H21.891A2.112,2.112,0,0,0,24,17.344V13.79L18.011,8.8Z" fill="#424242"/>
																					<path id="Path_33" data-name="Path 33" d="M21.891,1.547H5.156A2.112,2.112,0,0,0,3.047,3.656V14.239L8.568,9.945a.7.7,0,0,1,.895.026L12,12.191l5.537-4.845a.7.7,0,0,1,.913-.011L24,11.96v-8.3a2.112,2.112,0,0,0-2.109-2.109ZM12,8.578A2.578,2.578,0,1,1,14.578,6,2.581,2.581,0,0,1,12,8.578Z" fill="#424242"/>
																				</g>
																				</g>
																			</svg> 
																		</button>
																	</div>
																</div>
															</label>
															
															<!-- Modal Box -->
															<div class="pilar_modal_box">
																<!-- Modal Header -->
																<div class="pilar_modal_header flex justify-start">
																	<a class="pilar_modal_hide" href="javascript:void(0)">
																		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43">
																			<defs>
																			<clipPath>
																				<rect id="Rectangle_103" data-name="Rectangle 103" width="43" height="43" transform="translate(0)" fill="#0a152f"/>
																			</clipPath>
																			</defs>
																			<g id="back-arrow" transform="translate(0)">
																			<path id="XMLID_27_" d="M41.045,19.136H6.673l6.436,6.436a1.954,1.954,0,1,1-2.764,2.764L.572,18.564a1.954,1.954,0,0,1,0-2.764l9.773-9.773a1.955,1.955,0,0,1,2.764,2.764L6.673,15.227H41.045a1.955,1.955,0,0,1,0,3.909Z" transform="translate(0 4.318)" fill="#0a152f"/>
																			</g>
																		</svg>
																	</a>
																	<h2 class="pilar_title"><?php echo esc_html($option->label); ?></h2>
																</div><!-- Modal Header -->

																<!-- Modal Body -->
																<div class="pilar_modal_body">
																	<div class="pilar_preview_image">
																		<img src="#" alt="Screen Preview">
																	</div>

																	<div class="pilar_replicate">
																		<ul class="row">
																			<?php foreach ((array) $option->gallery as $galleryIndex => $galleryItem) : ?>
																				<li class="column column-10">
																					<a href="javascript:void(0)">
																						<img src="<?php echo esc_html($galleryItem['thumbUrl']??''); ?>" alt="Replicate Image">
																					</a>
																				</li>
																			<?php endforeach; ?>
																		</ul>
																	</div>
																</div><!-- Modal Body -->
															</div><!-- Modal Box -->
															
														</div><!-- Input Column -->
													<?php endforeach; ?>
												</div>
												<?php
												break;
											case 'radio':case 'checkbox':
												?>
												<div class="flex justify-start pilar_input_group_radio">
													<?php foreach ($row->options as $optionIndex => $option) :
														$option = (object) wp_parse_args($option, ['label' => '', 'thumb' => [], 'cost' => '']);
														$option->cost = ($option->cost == '')?0.00:(float) $option->cost;
														?>
														<label for="option-<?php echo esc_attr($tabIndex); ?>-<?php echo esc_attr($optionIndex); ?>">
															<input type="radio" id="option-<?php echo esc_attr($tabIndex); ?>-<?php echo esc_attr($optionIndex); ?>" name="height" value="<?php echo esc_attr($option->label); ?>-<?php echo esc_attr($optionIndex); ?>" data-path="<?php echo esc_attr($tabIndex . '-' . $rowIndex . '-' . $optionIndex); ?>" />
															<?php echo esc_html($option->label); ?>
														</label>
													<?php endforeach; ?>
												</div>
												<?php
												break;
											default:
												?>
												<div class="row pilar_input_group">
													<div class="column column-50">
														<input id="pilar_length" name="pilar_length" type="text">
													</div>
												</div>
												<?php
												break;
										}
										?>
									</div>
									<?php endforeach; ?>

								</div><!-- Card Body -->

							</div><!-- Step <?php echo esc_html($tabIndex); ?> -->
							<?php endforeach; ?>

							<!-- Step 6 -->
							<div class="pilar_step" id="step6">
								<!-- Card Header -->
								<div class="pilar_card_header modal">
									<div class="pilar_modal flex justify-start">
										<a class="pilar_modal_opener" href="javascript:void(0)">
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
												<defs>
												<clipPath>
													<rect id="Rectangle_100" data-name="Rectangle 100" width="24" height="24" transform="translate(64 221)" fill="#0a152f"/>
												</clipPath>
												</defs>
												<g id="information" transform="translate(-64 -221)">
												<g id="information_1_" data-name="information (1)" transform="translate(64 221)">
													<g id="Group_84" data-name="Group 84">
													<g id="Group_83" data-name="Group 83">
														<path id="Path_28" data-name="Path 28" d="M12.047,0A12.027,12.027,0,0,0,0,11.953,12.112,12.112,0,0,0,12.047,24a12,12,0,0,0,0-24Zm0,22.6A10.6,10.6,0,1,1,22.6,11.953,10.669,10.669,0,0,1,12.047,22.6Z" fill="#0a152f"/>
													</g>
													</g>
													<g id="Group_86" data-name="Group 86">
													<g id="Group_85" data-name="Group 85" transform="translate(9.938 9.844)">
														<path id="Path_29" data-name="Path 29" d="M11.6,9.844a1.927,1.927,0,0,0-1.658,2.109v5.719A1.927,1.927,0,0,0,11.6,19.781a1.927,1.927,0,0,0,1.658-2.109V11.953A1.927,1.927,0,0,0,11.6,9.844Z" transform="translate(-9.938 -9.844)" fill="#0a152f"/>
													</g>
													</g>
													<g id="Group_88" data-name="Group 88" transform="translate(0 0.903)">
													<g id="Group_87" data-name="Group 87" transform="translate(9.938 4.219)">
														<path id="Path_30" data-name="Path 30" d="M11.6,4.219a1.658,1.658,0,1,0,1.658,1.658A1.66,1.66,0,0,0,11.6,4.219Z" transform="translate(-9.938 -4.219)" fill="#0a152f"/>
													</g>
													</g>
												</g>
												</g>
											</svg>
										</a>
										<h2 class="pilar_title">Suunnitelman yhteenveto</h2>
									</div>

									<p class="pilar_header_content">Tuote, jonka suunnittelit, on tallennettu. Voit lisätä uuden tuotteen tähän suunnitelmaan.</p>
									<hr>

									<!-- Modal Box -->
									<div class="pilar_modal_box">
										<!-- Modal Header -->
										<div class="pilar_modal_header flex justify-start">
											<a class="pilar_modal_hide" href="javascript:void(0)">
												<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43">
													<defs>
													<clipPath>
														<rect id="Rectangle_103" data-name="Rectangle 103" width="43" height="43" transform="translate(0)" fill="#0a152f"/>
													</clipPath>
													</defs>
													<g id="back-arrow" transform="translate(0)">
													<path id="XMLID_27_" d="M41.045,19.136H6.673l6.436,6.436a1.954,1.954,0,1,1-2.764,2.764L.572,18.564a1.954,1.954,0,0,1,0-2.764l9.773-9.773a1.955,1.955,0,0,1,2.764,2.764L6.673,15.227H41.045a1.955,1.955,0,0,1,0,3.909Z" transform="translate(0 4.318)" fill="#0a152f"/>
													</g>
												</svg>
											</a>
											<h2 class="pilar_title">Quisque volutpat mattis eudat</h2>
										</div><!-- Modal Header -->

										<!-- Modal Body -->
										<div class="pilar_modal_body">
											<h3>Consectetuer adipiscing</h3>
											<p>Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis.<br><br> Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, fermentum et, dapibus sed, urna.<br><br> Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a ullamcorper laoreet, lectus arcu pulvinar risus, vitae facilisis libero dolor a purus. Sed vel lacus. Mauris nibh felis, adipiscing varius, adipiscing in, lacinia vel, tellus. Suspendisse ac urna. Etiam pellentesque mauris ut lectus. Nunc tellus ante, mattis eget, gravida vitae, ultricies ac, leo. Integer leo pede, ornare a, lacinia eu, vulputate vel, nisl.</p>
											<h3>Nulla sed leo</h3>
											<p>Ut convallis, sem sit amet interdum consectetuer, odio augue aliquam leo, nec dapibus tortor nibh sed augue. Integer eu magna sit amet metus fermentum posuere. Morbi sit amet nulla sed dolor elementum imperdiet. Quisque fermentum. Cum sociis natoque penatibus et magnis xdis parturient montes, nascetur ridiculus mus. Pellentesque adipiscing eros ut libero.<br><br> Ut condimentum mi vel tellus. Suspendisse laoreet. Fusce ut est sed dolor gravida convallis. Morbi vitae ante. Vivamus ultrices luctus nunc. Suspendisse et dolor. Etiam dignissim. Proin malesuada adipiscing lacus. Donec metus.</p>
										</div><!-- Modal Body -->
									</div><!-- Modal Box -->

								</div><!-- Card Header -->

								<!-- Card Body -->
								<div class="pilar_card_body pilar_invoice">
									<div class="row inline-flex">
										<div class="column">
											<h3 class="pilar_main_point pilar_download_title">Kylpyhuoneen kaappi #45621643</h3>
										</div>
										<div class="column">
											<div class="pilar_print_item">
												<button class="button button-previous button-print">
													<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
														<g id="download" transform="translate(-975 -257)">
														<g id="Download-2" data-name="Download" transform="translate(972.333 254.333)">
															<path id="Path_63" data-name="Path 63" d="M18.667,16V13.333a.667.667,0,0,0-1.333,0V16a.667.667,0,0,1-.667.667h-12A.667.667,0,0,1,4,16V13.333a.667.667,0,0,0-1.333,0V16a2,2,0,0,0,2,2h12A2,2,0,0,0,18.667,16Zm-4.253-3.48L11.08,15.187a.667.667,0,0,1-.827,0L6.92,12.52a.667.667,0,0,1,.827-1.04L10,13.28V4a.667.667,0,1,1,1.333,0v9.28l2.253-1.8a.667.667,0,1,1,.827,1.04Z" fill="#0ba5ec"/>
														</g>
														</g>
													</svg>  
													Tallenna PDF-tiedostona
												</button>
												
												<button class="button button-settings button-delete">
													<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
														<g id="trash" transform="translate(-927 -257)">
														<g id="trash-2" data-name="trash" transform="translate(927 257)">
															<path id="Path_59" data-name="Path 59" d="M13.25,2H10.5V1.5A1.5,1.5,0,0,0,9,0H7A1.5,1.5,0,0,0,5.5,1.5V2H2.75A1.251,1.251,0,0,0,1.5,3.25V5a.5.5,0,0,0,.5.5h.273l.432,9.071A1.5,1.5,0,0,0,4.2,16H11.8a1.5,1.5,0,0,0,1.5-1.429L13.727,5.5H14a.5.5,0,0,0,.5-.5V3.25A1.251,1.251,0,0,0,13.25,2ZM6.5,1.5A.5.5,0,0,1,7,1H9a.5.5,0,0,1,.5.5V2h-3Zm-4,1.75A.25.25,0,0,1,2.75,3h10.5a.25.25,0,0,1,.25.25V4.5H2.5Zm9.8,11.274a.5.5,0,0,1-.5.476H4.2a.5.5,0,0,1-.5-.476L3.274,5.5h9.451Z" fill="#f04438"/>
															<path id="Path_60" data-name="Path 60" d="M8,14a.5.5,0,0,0,.5-.5V7a.5.5,0,0,0-1,0v6.5A.5.5,0,0,0,8,14Z" fill="#f04438"/>
															<path id="Path_61" data-name="Path 61" d="M10.5,14a.5.5,0,0,0,.5-.5V7a.5.5,0,0,0-1,0v6.5A.5.5,0,0,0,10.5,14Z" fill="#f04438"/>
															<path id="Path_62" data-name="Path 62" d="M5.5,14a.5.5,0,0,0,.5-.5V7A.5.5,0,0,0,5,7v6.5A.5.5,0,0,0,5.5,14Z" fill="#f04438"/>
														</g>
														</g>
													</svg>  
												</button>
											</div>
										</div>
									</div>

									<div class="pilar_item_description">
										<p>Dimensions: 60x600x200 (L x P x K); Materiaali: Premium Decor Cream (R023);</p>
										<p>Lokeroita: 2; Ovet: 2 (vasen & oikea); Sisäpuoli: Musta mattapaneeli; Erityispyyntö:</p>
										<p>Lorem ipsum dolor sit amet eudat vestibulum cras.</p>
									</div>

									<a href="javascript:void(0)" id="reloadPage">Lisää uusi tuote</a>
								</div><!-- Card Body -->
							</div><!-- Step 6 -->

							<!-- Next Previous Button In Next Card Footer -->
							<div class="pillar_product_footer">
								<div class="row">
									<div class="column">
										<button class="button button-previous" id="prevBtn">
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14" viewBox="0 0 14 14">
												<defs>
												<clipPath>
													<rect id="Rectangle_99" data-name="Rectangle 99" width="14" height="14" fill="#424242"/>
												</clipPath>
												</defs>
												<g id="chevion-previous">
												<g id="layer1" transform="translate(2.604 0.181)">
													<path id="path9429" d="M19.443,1726.66a.97.97,0,0,1,.638,1.718l-5.935,5.085,5.935,5.083a.97.97,0,1,1-1.26,1.468l-6.8-5.814a.97.97,0,0,1,0-1.476l6.8-5.82a.969.969,0,0,1,.621-.245Z" transform="translate(-11.686 -1726.66)" fill="#424242"/>
												</g>
												</g>
											</svg>
											Takaisin
										</button>
									</div>
									<div class="column">
										<button class="button button-next float-right" id="nextBtn">
											Seuraava
											<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14" viewBox="0 0 14 14">
												<defs>
													<clipPath>
													<rect id="Rectangle_99" data-name="Rectangle 99" width="14" height="14" transform="translate(872.819 813.819)" fill="#f0f5f3"/>
													</clipPath>
												</defs>
												<g id="chevion-next" transform="translate(-872.819 -813.819)">
													<g id="layer1" transform="translate(875.423 814)">
													<path id="path9429" d="M12.72,1726.66a.97.97,0,0,0-.638,1.718l5.935,5.085-5.935,5.083a.97.97,0,1,0,1.26,1.468l6.8-5.814a.97.97,0,0,0,0-1.476l-6.8-5.82a.969.969,0,0,0-.621-.245Z" transform="translate(-11.686 -1726.66)" fill="#f0f5f3"/>
													</g>
												</g>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</form>
					</div><!-- Left Column -->
					
					<!-- Right Column -->
					<div class="column column-50">
						<div class="row">
							<!-- Product Settings Col -->
							<div class="column">
								<div class="pilar_bookmark">
									<button class="button button-settings active">
										<svg class="pilar_save" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
											<g id="save" transform="translate(-1063 -104)">
											<g id="bookmark" transform="translate(1063 104)">
												<path id="Path_25" data-name="Path 25" d="M18.781,24a2.534,2.534,0,0,1-1.359-.4l-5.187-3.293a.445.445,0,0,0-.471,0L6.577,23.6a2.6,2.6,0,0,1-3.123-.311,2.514,2.514,0,0,1-.781-1.835V2.541A2.546,2.546,0,0,1,5.216,0h13.57a2.544,2.544,0,0,1,2.541,2.541V21.456A2.547,2.547,0,0,1,18.781,24ZM12,18.139a2.534,2.534,0,0,1,1.363.4l5.187,3.292a.426.426,0,0,0,.232.07.445.445,0,0,0,.443-.441V2.541a.442.442,0,0,0-.44-.439H5.216a.44.44,0,0,0-.439.439V21.456a.416.416,0,0,0,.131.314.44.44,0,0,0,.544.057l5.187-3.293a2.536,2.536,0,0,1,1.362-.4Z" fill="#0a152f"/>
											</g>
											</g>
										</svg>
										
										<svg class="pilar_saved" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
											<g id="saved" transform="translate(-1063 -104)">
											<g id="bookmark" transform="translate(1063 104)">
												<path id="Path_25" data-name="Path 25" d="M18.781,24a2.534,2.534,0,0,1-1.359-.4l-5.187-3.293a.445.445,0,0,0-.471,0L6.577,23.6a2.6,2.6,0,0,1-3.123-.311,2.514,2.514,0,0,1-.781-1.835V2.541A2.546,2.546,0,0,1,5.216,0h13.57a2.544,2.544,0,0,1,2.541,2.541V21.456A2.547,2.547,0,0,1,18.781,24ZM12,18.139a2.534,2.534,0,0,1,1.363.4l5.187,3.292a.426.426,0,0,0,.232.07.445.445,0,0,0,.443-.441V2.541a.442.442,0,0,0-.44-.439H5.216a.44.44,0,0,0-.439.439V21.456a.416.416,0,0,0,.131.314.44.44,0,0,0,.544.057l5.187-3.293a2.536,2.536,0,0,1,1.362-.4Z" fill="#0a152f"/>
											</g>
											<path id="Path_26" data-name="Path 26" d="M1066.892,105.612c.292-.1,16.194,0,16.194,0v19.879l-.485.873-.339.291h-.873l-1.406-.582-4.606-3.006h-.97l-6.3,3.588h-.63l-.582-.291Z" fill="#0a152f"/>
											</g>
										</svg>  
									</button>
								</div>
								<div class="pilar_size_view">
									<button class="button button-settings">
										<svg id="grid" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
											<g id="Mask_Group_35" data-name="Mask Group 35">
											<g id="grid-2" data-name="grid" transform="translate(2.719 2.719)">
												<path id="Path_52" data-name="Path 52" d="M23.3,18.281H6.422a.7.7,0,0,1-.7-.7V.7a.7.7,0,0,1,.7-.7H23.3a.7.7,0,0,1,.7.7V17.578A.7.7,0,0,1,23.3,18.281ZM18.375,9.844H15.563v2.813h2.813Zm1.406,2.813h2.813V9.844H19.781Zm-4.219,1.406v2.813h2.813V14.063Zm-1.406,0H11.344v2.813h2.813Zm0-1.406V9.844H11.344v2.813ZM9.938,9.844H7.125v2.813H9.938ZM7.125,8.438H9.938V5.625H7.125Zm4.219,0h2.813V5.625H11.344Zm2.813-4.219V1.406H11.344V4.219Zm1.406,0h2.813V1.406H15.563Zm0,1.406V8.438h2.813V5.625Zm4.219,2.813h2.813V5.625H19.781Zm2.813,5.625H19.781v2.813h2.813ZM9.938,16.875V14.063H7.125v2.813ZM7.125,4.219H9.938V1.406H7.125ZM19.781,1.406V4.219h2.813V1.406Z" transform="translate(-5.719)" fill="#0a152f"/>
											</g>
											</g>
										</svg>
									</button>
									<button class="button button-settings">                                      
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
											<g id="grid-measurements">
											<g id="grid">
												<path id="Path_64" data-name="Path 64" d="M23.3,0H6.422a.7.7,0,0,0-.7.7V17.578a.7.7,0,0,0,.7.7H23.3a.7.7,0,0,0,.7-.7V.7A.7.7,0,0,0,23.3,0ZM18.375,8.438H15.563V5.625h2.813Zm1.406-2.812h2.813V8.438H19.781ZM15.563,4.219V1.406h2.813V4.219Zm-1.406,0H11.344V1.406h2.813Zm0,1.406V8.438H11.344V5.625ZM9.938,8.438H7.125V5.625H9.938ZM7.125,9.844H9.938v2.813H7.125Zm4.219,0h2.813v2.813H11.344Zm2.813,4.219v2.813H11.344V14.063Zm1.406,0h2.813v2.813H15.563Zm0-1.406V9.844h2.813v2.813Zm4.219-2.812h2.813v2.813H19.781Zm2.813-5.625H19.781V1.406h2.813ZM9.938,1.406V4.219H7.125V1.406ZM7.125,14.063H9.938v2.813H7.125Zm12.656,2.813V14.063h2.813v2.813Z" fill="#0a152f"/>
												<path id="Path_65" data-name="Path 65" d="M23.3,19.781H20.484a.7.7,0,0,0-.7.7v.7H4.219v-.7a.7.7,0,0,0-.7-.7h-.7V4.219h.7a.7.7,0,0,0,.7-.7V.7a.7.7,0,0,0-.7-.7H.7A.7.7,0,0,0,0,.7V3.516a.7.7,0,0,0,.7.7h.7V19.781H.7a.7.7,0,0,0-.7.7V23.3a.7.7,0,0,0,.7.7H3.516a.7.7,0,0,0,.7-.7v-.7H19.781v.7a.7.7,0,0,0,.7.7H23.3a.7.7,0,0,0,.7-.7V20.484A.7.7,0,0,0,23.3,19.781Z" fill="#0a152f"/>
											</g>
											</g>
										</svg>
									</button>
								</div>
								
								<div class="pilar_form_Reset">
									<button class="button button-settings"> 
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
											<g id="restart" transform="translate(-1057 -104)" clip-path="url(#clip-path)">
											<path id="XMLID_6_" d="M23.121,4.427l-6.3-1.254a1.091,1.091,0,0,0-1.283.857l-1.254,6.3a1.091,1.091,0,1,0,2.14.426L17.2,6.843A8,8,0,1,1,4.52,5.015,1.091,1.091,0,1,0,2.977,3.472,10.177,10.177,0,1,0,19.156,5.863l3.54.7a1.091,1.091,0,1,0,.426-2.14Z" transform="translate(1057 104)" fill="#0a152f"/>
											</g>
										</svg>  
									</button>
								</div>
							</div><!-- Product Settings Col -->

							<!-- Product Details Col -->
							<div class="column column-90">
								<div class="pilar_product_card">
									<!-- Product Image -->
									<div class="pilar_product_image">
										<img src="https://kaluste.local/wp-content/plugins/kaluste/assets/html/assets/images/m4.png" alt="Product Image">
									</div><!-- Product Image -->

									<!-- Right Card Footer -->
									<div class="pillar_product_footer pilar_price_section">
										<div class="row flex">
											<!-- Price Col -->
											<div class="column">
												<h2 class="pilar_product_price">829 EUR</h2>
												<p class="pilar_price_content"><span class="text-primary">Donec consectetuer.</span> Dolores 5-7 eudat.</p>
												<p class="pilar_price_vat">dlrs. VAT</p>
											</div><!-- Price Col -->

											<!-- Cart Button -->
											<div class="column">
												<button class="button button-cart float-right disabled" id="cartBtn" onclick="location.href = 'https://kaluste.local/wp-content/plugins/kaluste/assets/html/cart.html'">
													<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
														<defs>
														<clipPath>
															<rect id="Rectangle_79" data-name="Rectangle 79" width="24" height="24" transform="translate(712 812)" fill="#fff"/>
														</clipPath>
														</defs>
														<g id="shopping-bag" transform="translate(-712 -812)">
														<g id="cart" transform="translate(712 812)">
															<g id="Group_55" data-name="Group 55">
															<g id="Group_54" data-name="Group 54">
																<path id="Path_18" data-name="Path 18" d="M23.848,3.491a.692.692,0,0,0-.541-.26H4.882L4.367,1A.692.692,0,0,0,3.692.462h-3a.692.692,0,0,0,0,1.385H3.142L6.639,17a.692.692,0,0,0,.675.537H21.185a.692.692,0,1,0,0-1.385H7.864l-.532-2.308h13.9a.692.692,0,0,0,.675-.54l2.077-9.231A.692.692,0,0,0,23.848,3.491Z" fill="#fff"/>
															</g>
															</g>
															<g id="Group_57" data-name="Group 57">
															<g id="Group_56" data-name="Group 56">
																<path id="Path_19" data-name="Path 19" d="M10.154,18.462A2.538,2.538,0,1,0,12.692,21,2.541,2.541,0,0,0,10.154,18.462Z" fill="#fff"/>
															</g>
															</g>
															<g id="Group_59" data-name="Group 59">
															<g id="Group_58" data-name="Group 58">
																<path id="Path_20" data-name="Path 20" d="M18.462,18.462A2.538,2.538,0,1,0,21,21,2.541,2.541,0,0,0,18.462,18.462Z" fill="#fff"/>
															</g>
															</g>
														</g>
														</g>
													</svg>
													Lisää Ostoskoriin
												</button>
											</div><!-- Cart Button -->

										</div>
									</div><!-- Right Card Footer -->

								</div>
							</div><!-- Product Details Col -->

						</div>
					</div><!-- Right Column -->
				</div>
			</div>
		</main><!-- Main -->

	<!-- End Customized screen body -->
</div>
<style>.wp-block-group.has-global-padding.is-layout-constrained.wp-block-group-is-layout-constrained {display: none;}</style>

<script src="https://kaluste.local/wp-content/plugins/kaluste/assets/html/assets/js/script.js"></script>