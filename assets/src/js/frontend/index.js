/**
 * Frontend Script.
 * 
 * @package Kaluste
 */

(function ($) {
	class KALUSTE_Frontend {
		constructor() {
			this.config = fwpSiteConfig;
			var i18n = fwpSiteConfig?.i18n??{};
			this.ajaxUrl = fwpSiteConfig?.ajaxUrl??'';
			this.ajaxNonce = fwpSiteConfig?.ajax_nonce??'';
			this.i18n = {confirming: 'Confirming', ...i18n};
			this.setup_hooks();
		}
		setup_hooks() {
			window.thisClass = this;
			this.setup_events();
		}
		setup_events() {
			const thisClass = this;
			// document.body.addEventListener('load-overalies', (event) => {});
		}

	}
	new KALUSTE_Frontend();
})(jQuery);
