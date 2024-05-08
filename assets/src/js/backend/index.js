// import React from "react";
// import ReactDOM from "react-dom";
import Customizer from './customizer';

(function ($) {
	class FWPListivoBackendJS {
		constructor() {
			this.config = fwpSiteConfig;
			var i18n = fwpSiteConfig?.i18n??{};
			this.ajaxUrl = fwpSiteConfig?.ajaxUrl??'';
			this.ajaxNonce = fwpSiteConfig?.ajax_nonce??'';
			this.i18n = {confirming: 'Confirming', ...i18n};
			// this.Sortable = Sortable;
			
			this.setup_hooks();
		}
		setup_hooks() {
			window.thisClass = this;
			document.querySelectorAll('#customizer_root').forEach(root => {
				this.render_root(root);
			});
		}
		render_root(root) {
			ReactDOM.render(<Customizer product_id={root.dataset?.product_id??false}/>, root);
		}

	}
	new FWPListivoBackendJS();
})(jQuery);
