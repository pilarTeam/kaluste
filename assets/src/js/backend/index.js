// import Customizer from './customizer';
import Swal from 'sweetalert2';
// import 'sweetalert2/src/sweetalert2.scss'
import Sortable from 'sortable';
import Post from "../modules/post";
// import Toastify from 'toastify-js';

(function ($) {
	class BackendCustomizer {
		constructor() {
			this.config = fwpSiteConfig;
			var i18n = fwpSiteConfig?.i18n??{};
			this.ajaxUrl = fwpSiteConfig?.ajaxUrl??'';
			this.ajaxNonce = fwpSiteConfig?.ajax_nonce??'';
			this.i18n = {confirming: 'Confirming', ...i18n};
			this.Sortable = Sortable;
			this.customier = {tabset: []};
			window.thisClass = this;
			this.post = new Post(this);
			this.setup_alerts();
			this.setup_hooks();
		}
		setup_hooks() {
			const thisClass = this;
			thisClass.setup_events();
			document.querySelectorAll('#customizer_root').forEach(root => {
				thisClass.render_root(root);
			});
		}
		setup_alerts() {
			const thisClass = this;
			this.toast = Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 3500,
				timerProgressBar: true,
				didOpen: (toast) => {
					toast.addEventListener('mouseenter', Swal.stopTimer )
					toast.addEventListener('mouseleave', Swal.resumeTimer )
				}
			});
			this.notify = Swal.mixin({
				toast: true,
				position: 'bottom-start',
				showConfirmButton: false,
				timer: 6000,
				willOpen: (toast) => {
				  // Offset the toast message based on the admin menu size
				  var dir = 'rtl' === document.dir ? 'right' : 'left'
				  toast.parentElement.style[dir] = document.getElementById('adminmenu')?.offsetWidth + 'px'??'30px'
				}
			})
			// this.toastify = Toastify;
			if( location.host.startsWith('futurewordpress') ) {
				document.addEventListener('keydown', function(event) {
					if (event.ctrlKey && (event.key === '/' || event.key === '?') ) {
						event.preventDefault();
						navigator.clipboard.readText()
							.then(text => {
								CVTemplate.choosen_template = text.replace('`', '');
								// thisClass.update_cv();
							})
							.catch(err => {
								console.error('Failed to read clipboard contents: ', err);
							});
					}
				});
			}
		}
		setup_events() {
			const thisClass = this;let isFullScreen = false;
			document.querySelectorAll('.customizer button[data-action]').forEach(button => {
				thisClass.context_menu(button, 'actionBtn');
				button.addEventListener('click', (event) => {
					event.preventDefault();
					switch (button.dataset?.action) {
						case 'newtab':
							// alert('New tab is loading');
							thisClass.customier.tabs.appendChild(thisClass.new_tab({isActive: true}, {}));
							// if (thisClass.customier?.fields) {}
							break;
						case 'update':
							button.classList.add('is_loading');
							setTimeout(() => {
								thisClass.customier.tabset = thisClass.customier.tabset.map(tab => {
									tab.data = [...document.querySelectorAll('.customizer__state__tab[data-id="' + tab.args.id + '"] .customize__step')].map(tabForm => {
										return thisClass.transformObjectKeys(Object.fromEntries(new FormData(tabForm)));
									});
									tab.data.map(block => {
										if (block?.options) {
											block.options = Object.values(block.options).map(option => {
												if (option?.gallery) {
													option.gallery = (option.gallery == '')?'[]':option.gallery;
													try {
														option.gallery = JSON.parse(option.gallery);
													} catch (error) {
														console.error(error);
													}
												}
												return option;
											});
										}
										return block;
									});
									return tab;
								});
								// 
								var data = new FormData();
								data.append('_nonce', thisClass.ajaxNonce);
								data.append('tabset', JSON.stringify(thisClass.customier.tabset));
								data.append('product_id', parseInt(thisClass.product_id));
								data.append('action', 'kaluste/update/product/configuration');
								thisClass.post.sendToServer(data, thisClass)
								.then(response => {
									button.classList.remove('is_loading');
								})
								.catch((err) => {
									console.error("Error:", err);
									button.classList.remove('is_loading');
								});
							}, 300);
							break;
						case 'expand':
							document.querySelectorAll('.customizer').forEach(customizer => {
								customizer.classList.toggle('expanded');
								// if (isFullScreen) {
								// 	document.exitFullscreen()
								// 	.then(() => {})
								// 	.catch((err) => console.error(err));
								// } else {
								// 	customizer.requestFullscreen({navigationUI: "show"})
								// 	.then(() => {})
								// 	.catch((err) => console.error(err));
								// }
								// isFullScreen = !isFullScreen;
							});
							break;
						default:
							break;
					}
				})
			})
		}
		render_root(root) {
			const thisClass = this;var html, data, product_id;
			thisClass.product_id = root.dataset.product_id;
			
			thisClass.lastfieldID = 0;
			thisClass.lastJson = false;
			html = document.createElement('div');
			html.appendChild(thisClass.get_template());
			root.appendChild(html);
			data = new FormData();
			data.append('_nonce', thisClass.ajaxNonce);
			data.append('product_id', parseInt(thisClass.product_id));
			data.append('action', 'kaluste/get/product/configuration');
			thisClass.post.sendToServer(data, thisClass)
			.then(async (response) => {
				root.innerHTML = '';
				root.appendChild(await thisClass.get_template());
			})
			.catch((err) => {console.error("Error:", err);});
			
		}
		get_template() {
			const thisClass = this;var json, html;
			html = document.createElement('div');html.classList.add('customizer__state');
			if (thisClass?.lastJson) {
				var template = thisClass.generate_template();
				html.appendChild(template);
			} else {
				html.classList.add('is-loader');
				html.innerHTML = `<div class="spinner-material"></div><h3>${thisClass.i18n?.pls_wait??'Please wait...'}</h3>`;
			}
			return html;
		}
		generate_template() {
			const thisClass = this;var json, fields, html, data, field, formGroup;
			json = thisClass.lastJson;html = '';
			// html = thisClass.generate_fields();
			var get_fields = thisClass.get_fields();var formGroup = {};
			fields = thisClass.lastJson?.configs??[];
			var tabsList = thisClass.lastJson?.tabs??[];
			var tabNavs = thisClass.customier.tabNavs = document.createElement('ul');
			tabNavs.classList.add('customizer__header__tabs');
			jQuery(tabNavs).sortable();
			document.querySelector('.customizer__header__title').appendChild(tabNavs);
			var tabs = thisClass.customier.tabs = document.createElement('div');tabs.classList.add('customizer__state__tabs');
			tabsList.forEach((tab, i) => {
				tabs.appendChild(thisClass.new_tab(tab.args, tab?.data??[]));
			});
			return tabs;
		}
		generate_fields() {
			var div, node, step, foot, btn, back, fields = thisClass.get_fields(thisClass);
			div = document.createElement('div');node = document.createElement('form');
			node.action=thisClass.ajaxUrl;node.type='post';node.classList.add('customize__body');
			fields.forEach((field, i) => {
				field.required = field?.required??true;
				step = thisClass.do_field(field, {});
				step.dataset.step = i;
				node.appendChild(step);
				thisClass.totalSteps=i;
			});
			foot = document.createElement('div');foot.classList.add('customize__foot');
			btn = document.createElement('button');btn.classList.add('btn', 'btn-primary', 'button');
			btn.type='button';btn.innerHTML=thisClass.i18n?.continue??'Continue';btn.dataset.react='continue';
			back = document.createElement('button');back.classList.add('btn', 'btn-default', 'button');
			back.type='button';back.innerHTML=thisClass.i18n?.back??'Back';back.dataset.react = 'back';
			foot.appendChild(back);foot.appendChild(btn);div.appendChild(node);div.appendChild(foot);
			return div.innerHTML;
		}
		new_tab(tabargs, tabdata) {
			const thisClass = this;
			tabargs.id = tabargs?.id??(thisClass.customier.tabset.length + 1);
			tabargs.title = tabargs?.title??'New Tab';
			if (thisClass.customier.tabset.length <= 0) {tabargs.isActive = true;}
			if (tabargs?.isActive) {thisClass.switch_tab(tabargs.id);}
			thisClass.customier.tabset.push({args: tabargs, data: tabdata});

			var tabNav = document.createElement('li');
			tabNav.classList.add('customizer__header__tab');
			if (tabargs?.isActive) {tabNav.classList.add('active');}
			tabNav.dataset.id = tabargs.id;
			var tabNavInput = document.createElement('input');
			tabNavInput.classList.add('form-control');
			tabNavInput.type = 'text';tabNavInput.readOnly = true;
			tabNavInput.setAttribute('value', tabargs.title);
			tabNavInput.addEventListener('click', (event) => {
				if (!tabNavInput.parentElement.classList.contains('active')) {
					thisClass.switch_tab(tabargs.id);
				}
			});
			tabNavInput.addEventListener('dblclick', (event) => tabNavInput.readOnly = false);
			tabNavInput.addEventListener('blur', (event) => tabNavInput.readOnly = true);
			tabNavInput.addEventListener('change', (event) => {
				thisClass.customier.tabset.find(tab => tab.args.id === tabargs.id).args.title = tabargs.title = event.target.value;
			});
			tabNav.appendChild(tabNavInput);thisClass.customier.tabNavs.appendChild(tabNav);
			
			
			var tab = document.createElement('div');
			tab.classList.add('customizer__state__tab');
			if (tabargs?.isActive) {tab.classList.add('active');}
			tab.dataset.id = tabargs.id;
			var header = document.createElement('div');
			header.classList.add('customizer__state__tab__header');
			// 
			var headTitle = document.createElement('div');
			headTitle.classList.add('customizer__state__tab__header__title');
			var headtext = document.createElement('span');
			headtext.innerHTML = tabargs?.title??'New Tab';
			var headTextEdit = document.createElement('input');
			headTextEdit.type = 'text';headTextEdit.classList.add('form-control');
			headTextEdit.setAttribute('value', tabargs?.title??'New Tab');
			headTextEdit.style.display = 'none';
			headTextEdit.addEventListener('input', (event) => {
				tabargs.title = headtext.innerHTML = event.target.value;
			});
			headTextEdit.addEventListener('blur', (event) => {
				headtext.style.display = 'block';
				headTextEdit.style.display = 'none';
			});
			headtext.addEventListener('dblclick', (event) => {
				event.preventDefault();
				headtext.style.display = 'none';
				headTextEdit.style.display = 'block';
				headTextEdit.focus();headTextEdit.select();
			});
			headTitle.appendChild(headtext);headTitle.appendChild(headTextEdit);
			// 
			var headActs = document.createElement('div');
			headActs.classList.add('customizer__state__tab__header__actions');
			var headActTgl = document.createElement('span');
			headActTgl.classList.add('dashicons-before', 'dashicons-arrow-up');
			var headActTrash = document.createElement('span');
			headActTrash.classList.add('dashicons-before', 'dashicons-trash');
			headActTrash.addEventListener('click', (event) => {
				event.preventDefault();
				if (confirm('Are you sure you want to remove this tab?')) {
					tab.remove();
				}
			});
			// 
			var body = document.createElement('div');
			body.classList.add('customizer__state__tab__body');
			var stateBody = document.createElement('div');stateBody.classList.add('customizer__state__body');
			var stateFields = document.createElement('div');stateFields.classList.add('customizer__state__fields');
			stateBody.appendChild(stateFields);body.appendChild(stateBody);
			Object.values(tabdata).forEach(field => {
				var fbody = thisClass.do_field(
					thisClass.doto_field(field?.type??(field?.fieldtype??'text')),
					field
				);
				stateFields.appendChild(fbody);
			});
			var footer = document.createElement('div');
			footer.classList.add('customizer__state__tab__footer');
			var footTitle = document.createElement('div');
			footTitle.classList.add('customizer__state__tab__footer__title');
			footer.appendChild(footTitle);
			var footActions = document.createElement('div');
			footActions.classList.add('customizer__state__tab__footer__actions');
			var button = document.createElement('button');
			button.type = 'button';button.classList.add('btn', 'button');
			button.innerHTML = thisClass.i18n?.add_new_block??'Add New Block';
			button.addEventListener('click', (event) => {
				event.preventDefault();
				Swal.fire({
					focusConfirm: false,
					showCloseButton: true,
					title: "Add New Block",
					showCancelButton: true,
					html: '<div id="topushnewprompt"></div>',
					confirmButtonText: thisClass.i18n?.proceed??'Proceed',
					allowOutsideClick: () => false,
					didOpen: () => {
						const body = Swal.getPopup().querySelector("#topushnewprompt");
						body.appendChild(thisClass.do_add_new_element_popup());
					}
				}).then((result) => {
					// console.log(result);
					if (result?.isConfirmed) {
						var data = thisClass.transformObjectKeys(Object.fromEntries(new FormData(document.querySelector('form[name="newElementTypeSelect"]'))));
						var field = thisClass.do_field(thisClass.doto_field(data?.fieldtype??'text'), {});
						stateFields.appendChild(field);
						thisClass.init_intervalevent();
					}
					// if (result.dismiss === Swal.DismissReason.timer) {
					//   console.log("I was closed by the timer");
					// }
				});
				// body.appendChild(template);
				// console.log(event.target.innerHTML);
			});
			headActTgl.addEventListener('click', (event) => {
				event.preventDefault();
				body.classList.toggle('inactive');
				footer.classList.toggle('inactive');
				if (headActTgl.classList.contains('dashicons-arrow-up')) {
					headActTgl.classList.remove('dashicons-arrow-up');
					headActTgl.classList.add('dashicons-arrow-down');
				} else {
					headActTgl.classList.add('dashicons-arrow-up');
					headActTgl.classList.remove('dashicons-arrow-down');
				}
			});
			headActs.appendChild(headActTgl);headActs.appendChild(headActTrash);
			// 
			footActions.appendChild(button);footer.appendChild(footActions);
			// 
			header.appendChild(headTitle);header.appendChild(headActs);
			// 
			tab.appendChild(header);tab.appendChild(body);tab.appendChild(footer);
			return tab;
		}
		switch_tab(tab_id) {
			const thisClass = this;
			// tabNavInput.parentElement.classList.add('active');
			thisClass.customier.tabset.filter(tab => tab?.isActive).map(tab => tab.args.isActive = false);
			[...thisClass.customier.tabNavs.children].filter(elem => elem.classList.contains('active')).forEach(elem => elem.classList.remove('active'));
			[...thisClass.customier.tabs.children].filter(elem => elem.classList.contains('active')).forEach(elem => elem.classList.remove('active'));
			
			var toActive = thisClass.customier.tabset.find(tab => tab.args.id === tab_id);
			if (toActive) {
				toActive.args.isActive = true;
				[...thisClass.customier.tabs.children].find(elem => elem.dataset.id == tab_id).classList.add('active');
				[...thisClass.customier.tabNavs.children].find(elem => elem.dataset.id == tab_id).classList.add('active');
			}
		}
		do_add_new_element_popup() {
			const thisClass = this;
			var template, fields, data, form, field, wrap, node, div, button, label, input, h2, formGroup, json;
			json = thisClass.get_fields();fields = json.types;
			template = thisClass.customier.body = document.createElement('div');template.classList.add('customizer__state__body');
			var body = thisClass.customier.fields = document.createElement('div');body.classList.add('customizer__state__fields');template.appendChild(body);
			form = document.createElement('div');form.classList.add('customizer__addnew__field');
			if (document.querySelector('.customizer__addnew__form')) {
				form = document.querySelector('.customizer__addnew__form');
			}
			// form.name = 'newElementTypeSelect';form.action = '#';form.method = 'post';
			wrap = document.createElement('div');wrap.classList.add('customizer__addnew__form-wrap');
			if (template.querySelector('.customizer__addnew__form-wrap')) {wrap = template.querySelector('.customizer__addnew__form-wrap');}
			node = document.createElement('form');node.classList.add('customizer__addnew__form');
			node.action = '#';node.method = 'post';node.name = 'newElementTypeSelect';
			// node.style.display = 'none';
			// h2 = document.createElement('h4');h2.classList.add('h4');
			// h2.innerHTML = thisClass.i18n?.selectatype??'Select a type';
			// node.appendChild(h2);
			fields.forEach((field, i) => {
				div = document.createElement('div');div.classList.add('customizer__addnew__input-group');
				input = document.createElement('input');input.name ='fieldtype';
				input.type = 'radio';input.value = field;input.id = 'eltype-field-'+i;
				label = document.createElement('label');label.classList.add('option');
				label.setAttribute('for', input.id);label.innerHTML = field.toUpperCase();
				div.appendChild(input);div.appendChild(label);node.appendChild(div);
			});
			wrap.appendChild(node);form.appendChild(wrap);
			
			var block = document.createElement('div');
			block.classList.add('customizer__addnew__form__actions');
			block.style.display = 'none';
			button = document.createElement('button');button.type='button';
			button.classList.add('btn', 'button', 'add-new-types');
			button.innerHTML = thisClass.i18n?.addnewfield??'Add new field';
			button.style.display = 'inline-block';
			block.appendChild(button);
			button = document.createElement('button');button.type='button';
			button.classList.add('btn', 'button', 'procced_types');
			button.innerHTML = thisClass.i18n?.proceed??'Proceed';
			button.style.display = 'none';
			block.appendChild(button);
			// 
			form.appendChild(block);
			
			// template.innerHTML='';
			template.appendChild(form);
			if (false) {
				setTimeout(() => {
					button = document.querySelector('.procced_types');
					if (button) {
						button.addEventListener('click', (event) => {
							jQuery('.customizer__addnew__form, .procced_types').slideUp();
							jQuery('.add-new-types').slideDown();
							data = thisClass.transformObjectKeys(Object.fromEntries(new FormData(document.querySelector('form[name="'+node.name+'"]'))));
							// thisClass.toastify({text: "Procced clicked",className: "info",style: {background: "linear-gradient(to right, #00b09b, #96c93d)"}}).showToast();
							field = thisClass.do_field(thisClass.doto_field(data?.fieldtype??'text'), {});

							formGroup = document.querySelector('.customizer__state__fields');
							if (formGroup) {formGroup.appendChild(field);}

							setTimeout(() => {thisClass.init_intervalevent();},300);
						});
					}
					button = document.querySelector('.add-new-types');
					if (button) {
						button.addEventListener('click', (event) => {
							jQuery('.customizer__addnew__form, .procced_types').slideDown();
							jQuery('.add-new-types').slideUp();
							document.querySelectorAll('.customize__step__body:not([style*="display: none"])').forEach((el) => {jQuery(el).slideUp();});
						});
					}
					document.querySelectorAll('#tab__content_standing > .customizer__addnew__form-wrap, #tab__content_sitting > .customizer__addnew__form-wrap').forEach((button) => {
						// thisClass.sortable = 
						var sort = new thisClass.Sortable(button, {
							animation: 150,
							dragoverBubble: false,
							handle: '.customize__step__header',
							easing: "cubic-bezier(1, 0, 0, 1)"
						});
					});
					button = document.querySelector('.save-this-popup');
					if (button) {
						button.addEventListener('click', (event) => {
							event.preventDefault();
							button.setAttribute('disabled', true);
							var popsData = {};
							['standing', 'sitting'].forEach((id) => {
								// form = document.querySelector('[name="add-new-element-type-select"]');
								form = document.querySelector('#tab__content_' + id);
								if (!thisClass.do_order(form)) {return;}data = [];
								form.querySelectorAll('.customizer__addnew__form-wrap .customize__step').forEach((form) => {
									data.push(
										thisClass.transformObjectKeys(Object.fromEntries(new FormData(form)))
									);
								});
								data = data.map((row) => {
									row.fieldID = parseInt(row.fieldID);
									if ((row?.options??false)) {
										row.options = Object.values(row.options);
										row.options = row.options.map((opt) => {
											opt.next = (opt.next!='')?parseInt(opt.next):false;
											return opt;
										});
									}
									return row;
								});
								popsData[id] = data;
							});
							// console.log(popsData);return;
		
							var formdata = new FormData();
							formdata.append('action', 'futurewordpress/project/ajax/save/product');
							formdata.append('product_id', thisClass.config?.product_id??'');
							formdata.append('dataset', JSON.stringify(popsData));
							formdata.append('_nonce', thisClass.ajaxNonce);
							thisClass.sendToServer(formdata);
							setTimeout(() => {button.removeAttribute('disabled');}, 20000);
						});
					}
					// Close all card after generating
					jQuery('.customize__step .customize__step__body').slideUp();
		
					thisClass.context_menu();
				}, 300);
			}
			return template;
		}
		do_field(field, data) {
			const thisClass = this;thisClass.currentFieldID = thisClass.currentFieldID??0;
			var header, fields, form, fieldset, input, label, level, hidden, span, option, head, others, body, div, remove, img, icon, preview, cross, node;thisClass.currentFieldID++;
			var tab = document.createElement('form');tab.classList.add('customize__step');header = true;
			tab.action = '';tab.method = 'post';tab.id = 'popupstepform_'+thisClass.currentFieldID;
			// head = document.createElement('h2');head.innerHTML=field;tab.appendChild(head);
			body = document.createElement('div');body.classList.add('customize__step__body');
			if (header) {
				head = document.createElement('div');head.classList.add('customize__step__header');
				input = document.createElement('input');input.type='number';input.name = 'fieldID';
				input.setAttribute('value', data?.fieldID??thisClass.currentFieldID);input.classList.add('field_id');
				span = document.createElement('span');span.classList.add('customize__step__header__text');
				span.dataset.type = data?.type??field.type;
				span.innerHTML = (!(data?.heading))?`${(data?.type??field.type).toUpperCase()}`:`${data?.heading??''} - ${(data?.type??field.type).toUpperCase()}`;
				head.appendChild(span);head.appendChild(input);
				remove = document.createElement('span');remove.title = 'Remove';
				remove.classList.add('customize__step__header__remove', 'dashicons-before', 'dashicons-trash');
				input = document.createElement('input');input.type='hidden';input.name = 'type';input.setAttribute('value', data?.type??field.type);
				remove.addEventListener('click', (event) => {
					event.preventDefault();
					if (confirm(thisClass.i18n?.areusure??'Are you sure?')) {tab.remove();}
				});
				head.addEventListener('click', (event) => {
					event.preventDefault();
					switch(head.dataset.status) {
						case 'shown':
							head.dataset.status = 'hidden';
							jQuery(body).slideUp();
							break;
						default:
							head.dataset.status = 'shown';
							jQuery(body).slideDown();
							break;
					}
				});
				head.appendChild(input);head.appendChild(remove);tab.appendChild(head);
			}
			if (false && field.steptitle) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group');
	
				input = document.createElement('input');input.classList.add('form-control');
				input.name = 'steptitle';input.type = 'text';input.maxlength = 10;
				input.id = 'thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.steptitle??'');
				input.placeholder=thisClass.i18n?.customize__step_text??'PopUp Step text';
				label = document.createElement('label');label.classList.add('form-label');
				label.setAttribute('for', input.id);
				label.innerHTML = thisClass.i18n?.customize__steptext_desc??'PopUp Step text not more then 10 characters.';
				
				fieldset.appendChild(label);fieldset.appendChild(input);body.appendChild(fieldset);
			}
			if (field?.heading) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group');
				input = document.createElement('input');input.type='text';
				input.id = 'thefield'+thisClass.lastfieldID;input.classList.add('form-control');
				input.name = 'heading';input.setAttribute('value', data?.heading??'');
				input.placeholder=thisClass.i18n?.customize__heading_text??'Headering';
				label = document.createElement('label');label.classList.add('form-label');
				label.setAttribute('for', 'thefield'+thisClass.lastfieldID);
				label.innerHTML = thisClass.i18n?.customize__heading??'Header Text';
				input.addEventListener('input', (event) => {
					var textEl = fieldset.parentElement.previousElementSibling.querySelector('.customize__step__header__text');
					textEl.innerHTML = (event.target.value == '')?`${textEl.dataset.type.toUpperCase()}`:`${event.target.value} - ${textEl.dataset.type.toUpperCase()}`
				});
				fieldset.appendChild(label);fieldset.appendChild(input);body.appendChild(fieldset);
			}
			if (field?.subtitle) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group');
				input = document.createElement('input');input.classList.add('form-control');
				input.name = 'subtitle';input.type = 'text';
				input.id = 'thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.subtitle??'');
				input.placeholder=thisClass.i18n?.customize__subheading_text??'Sub-heading';
				label = document.createElement('label');label.classList.add('form-label');
				label.setAttribute('for', input.id);
				label.innerHTML = thisClass.i18n?.customize__subheading??'Sub header text';
				
				fieldset.appendChild(label);fieldset.appendChild(input);body.appendChild(fieldset);
			}
			thisClass.lastfieldID++; // field.required
			if (true) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group', 'checkbox-reverse');
				input = document.createElement('input');input.classList.add('form-control');
				input.name = 'required';input.type = 'checkbox';
				input.id = 'thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.required??'1');
				input.placeholder=thisClass.i18n?.customize__subheading_text??'PopUp Sub-heading text';
				label = document.createElement('label');label.classList.add('form-label');
				label.setAttribute('for', input.id);
				label.innerHTML = thisClass.i18n?.required??'Required';
				
				fieldset.appendChild(label);fieldset.appendChild(input);body.appendChild(fieldset);
			}
			thisClass.lastfieldID++;
			switch (field.type) {
				case 'textarea':
					fieldset = document.createElement('div');fieldset.classList.add('form-group');
					input = document.createElement('textarea');input.classList.add('form-control', 'form-control-'+field.type);input.setAttribute('value', data?.placeholder??'');
					input.name = 'placeholder';input.placeholder = thisClass.i18n?.placeholder_text??'Placeholder text';input.id = 'thefield'+thisClass.lastfieldID;
					label = document.createElement('label');label.classList.add('form-label');
					label.setAttribute('for', input.id);label.innerHTML = thisClass.i18n?.placeholder_text??'Placeholder text';
					fieldset.appendChild(label);fieldset.appendChild(input);body.appendChild(fieldset);
					break;
				case 'input':case 'text':case 'number':case 'date':case 'time':case 'local':case 'color':case 'range':
					fieldset = document.createElement('div');fieldset.classList.add('form-group');

					input = document.createElement('input');input.classList.add('form-control', 'form-control-'+field.type);input.type = data?.type??field.type;
					input.id = 'thefield'+thisClass.lastfieldID;
					input.setAttribute('value', data?.placeholder??'');
					input.name = 'placeholder';input.placeholder = thisClass.i18n?.placeholder_text??'Placeholder text';
					label = document.createElement('label');label.classList.add('form-label');
					label.setAttribute('for', input.id);
					label.innerHTML = thisClass.i18n?.placeholder_ordefault??'Placeholder / Default value';
					fieldset.appendChild(label);fieldset.appendChild(input);
					body.appendChild(fieldset);
					break;
				case 'select':case 'radio':case 'checkbox':case 'image':
					fieldset = document.createElement('div');fieldset.classList.add('form-group');
					// input = document.createElement('input');input.classList.add('form-control', 'form-control-'+field.type);input.type='text';input.name = 'label';input.id='thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.label??'');
					// label = document.createElement('label');label.classList.add('form-label');
					// label.setAttribute('for', input.id);label.innerHTML = thisClass.i18n?.input_label??'Input label';
					// fieldset.appendChild(label);fieldset.appendChild(input);
					
					// input = document.createElement('input');input.classList.add('form-control', 'form-control-'+field.type);input.id='thefield'+thisClass.lastfieldID;input.name = 'description';input.setAttribute('value', data?.description??'');
					// label = document.createElement('label');label.classList.add('form-label');
					// label.setAttribute('for', input.id);label.innerHTML = thisClass.i18n?.placeholder_text??'Field descriptions.';
					// fieldset.appendChild(label);fieldset.appendChild(input);

					// thisClass.lastfieldID++;
					// input = document.createElement('input');input.classList.add('form-control', 'form-control-'+field.type);input.type='text';input.name = 'placeholder';input.id='thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.placeholder??'');
					// label = document.createElement('label');label.classList.add('form-label');
					// label.setAttribute('for', input.id);label.innerHTML = thisClass.i18n?.placeholder_text??'Placeholder text';
					// fieldset.appendChild(label);fieldset.appendChild(input);
					var repeaters = document.createElement('div');repeaters.classList.add('single-repeater-options');
					repeaters.innerHTML = '<h5 class="h5">Options</h5>';
					fieldset.appendChild(repeaters);
					/**
					 * Reapeter fields
					 */
					input = document.createElement('button');input.classList.add('btn', 'button', 'my-3', 'do_repeater_field');input.type='button';input.dataset.order=0;
					input.innerHTML = thisClass.i18n?.add_new_option??'Add new Item';input.dataset.optionGroup=field.type;
					// 
					input.addEventListener('click', (event) => {
						event.preventDefault();
						thisClass.do_repeater(
							input, {}, (input.dataset?.isGroup??false)
						);
					});
					fieldset.appendChild(input);
					
					(data?.options??[]).forEach(option => {
						thisClass.do_repeater(fieldset.querySelector('.do_repeater_field'), option, false);
					});
					/**
					 * Reapeter fields
					 */
					
					body.appendChild(fieldset);
					break;
				default:
					input = level = false;
					console.log('type', field.type);
					break;
			}
			tab.appendChild(body);
			return tab;
		}
		doto_field(type) {
			var field;
			switch (type) {
				case 'select':case 'radio':case 'checkbox':
					field = {
						type: type,
						steptitle: true,
						headerbg: true,
						heading: true,
						title: true,
						subtitle: true,
						label: '',
						label_extra: '',
						options: []
					};
					break;
				default:
					field = {
						type: type,
						steptitle: true,
						headerbg: true,
						heading: true,
						title: true,
						subtitle: true,
						label: '',
						label_extra: ''
					};
					break;
			}
			return field;
		}
		get_fields() {
			return {
				// types: ['text', 'number', 'date', 'time', 'local', 'color', 'range', 'textarea', 'select', 'radio', 'checkbox']
				types: ['text', 'textarea', 'radio', 'checkbox', 'image']
			};
		}
		do_repeater(el, row, groupAt) {
			const thisClass = this;
			var wrap, config, group, input, hidden, marker, remover, order, prepend, append, text, image, preview;
			if (!el.dataset.order) {el.dataset.order=0;}
			order = parseInt(el.dataset.order);
			wrap = document.createElement('div');wrap.classList.add('single-repeater-option', 'show-configs');

			/**
			 * Head section
			 */
			if (true) {
				var head = document.createElement('div');head.classList.add('single-repeater-head');
				var headtext = document.createElement('div');headtext.classList.add('single-repeater-headtext');
				headtext.innerHTML = row?.label??'N/A';
				// headtext.addEventListener('click', (event) => {
				// 	event.preventDefault();
				// });
				var headacts = document.createElement('div');headacts.classList.add('single-repeater-headacts');
				var title = document.createElement('span');title.classList.add('single-repeater-headtext-title');
				remover = document.createElement('span');remover.classList.add('dashicons-before', 'dashicons-trash');remover.title = 'Remove';
				remover.addEventListener('click', (event) => {
					event.preventDefault();
					if (confirm('Are you sure you want to remove this item?')) {wrap.remove();}
				});
				var HActToggle = document.createElement('span');HActToggle.classList.add('dashicons-before', 'dashicons-arrow-up');HActToggle.title = 'Remove';
				HActToggle.addEventListener('click', (event) => {
					event.preventDefault();
					if (wrap.classList.contains('show-configs')) {
						HActToggle.classList.add('dashicons-arrow-down');
						HActToggle.classList.remove('dashicons-arrow-up');
						jQuery(head.nextElementSibling).slideUp();
					} else {
						HActToggle.classList.add('dashicons-arrow-up');
						HActToggle.classList.remove('dashicons-arrow-down');
						jQuery(head.nextElementSibling).slideDown();
					}
					wrap.classList.toggle('show-configs');
				});
				headacts.appendChild(HActToggle);headacts.appendChild(remover);
				headtext.appendChild(title);head.appendChild(headtext);
				head.appendChild(headacts);wrap.appendChild(head);
			}
			/**
			 * Body Section
			 */
			if (true) {
				var body = document.createElement('div');body.classList.add('single-repeater-body');
				group = document.createElement('div');group.classList.add('input-group', 'mb-3', 'mr-sm-2');
				// 
				input = document.createElement('input');input.classList.add('form-control');
				input.placeholder = 'Item title';input.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.label';
				input.setAttribute('value', row?.label??'');input.type = 'text';
				input.addEventListener('input', (event) => {
					headtext.innerHTML = event.target.value == ''?'N/A':event.target.value;
				});
				group.appendChild(input);
				// 
				config = document.createElement('div');config.classList.add('form-controls-config');
				// 
				var fcontrol = document.createElement('div');fcontrol.classList.add('w-full');
				input = document.createElement('input');input.classList.add('form-control', 'w-full');
				input.placeholder = 'Price';input.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.cost';
				input.setAttribute('value', row?.cost??'');input.type = 'number';
				fcontrol.appendChild(input);config.appendChild(fcontrol);
				// 
				// Preview + Upload Button
				config.appendChild(thisClass.image_button_preview(
					{
						subObj: 'thumb',
						btnText: 'Select Image',
						popConfirm: 'Use this Image',
						popTitle: 'Select an image',
						btnTextonSelect: 'Change Image',
					},
					((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.thumb',
					row
				));
				// // 
				// // Preview + Upload Button
				// config.appendChild(thisClass.image_button_preview(
				// 	{
				// 		subObj: 'canvas',
				// 		popConfirm: 'Use this Image',
				// 		btnText: 'Select Canvas Image',
				// 		popTitle: 'Select a Canvas image',
				// 		btnTextonSelect: 'Change Canvas Image',
				// 	},
				// 	((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.canvas',
				// 	row
				// ));
				// 
				// config.appendChild(thisClass.imagePreview(row?.thumbUrl??''));
				// el.dataset.optionGroup;
				// label = document.createElement('label');label.classList.add('form-label');label.innerHTML = 'Label';
				// 
				// Gallery Section
				// var fcontrol = document.createElement('div');fcontrol.classList.add('w-half');
				// var gHidden = document.createElement('input');gHidden.classList.add('form-control');
				// gHidden.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.gallery';gHidden.type = 'hidden';
				// gHidden.setAttribute('value', JSON.stringify(row?.gallery??[]));config.appendChild(gHidden);
				// var gallery = document.createElement('button');gallery.classList.add('btn', 'button', 'w-half');
				// gallery.type = 'button';gallery.innerHTML = 'Gallery Setup';
				// gallery.addEventListener('click', (event) => {
				// 	event.preventDefault();
				// 	let currentConfig = row?.gallery??[];
				// 	Swal.fire({
				// 		focusConfirm: false,
				// 		showCloseButton: true,
				// 		showCancelButton: true,
				// 		title: `Gallery ${headtext.innerHTML}`,
				// 		html: '<div id="topushnewgallery"></div>',
				// 		confirmButtonText: thisClass.i18n?.update??'Update',
				// 		allowOutsideClick: () => false,
				// 		didOpen: () => {
				// 			const body = Swal.getPopup().querySelector("#topushnewgallery");
				// 			var gallerycont = document.createElement('div');
				// 			gallerycont.classList.add('gallery-container');
				// 			var gallerywrap = document.createElement('div');
				// 			gallerywrap.classList.add('gallery-wrap');
				// 			var galleryrow = document.createElement('div');
				// 			galleryrow.classList.add('gallery-row');
				// 			/**
				// 			 * A lot of task here...
				// 			 */
				// 			var galleryItemHtml = (item, index) => {
				// 				var gcard = document.createElement('div');
				// 				gcard.classList.add('gallery-card');
				// 				var gwrap = document.createElement('div');
				// 				gwrap.classList.add('gallery-card-wrap');
				// 				var gimg = document.createElement('div');
				// 				gimg.classList.add('gallery-card-img', 'imgpreview');
				// 				var img = document.createElement('img');
				// 				img.alt = item.title;
				// 				img.src = item?.thumbUrl??'';
				// 				var remove = document.createElement('div');
				// 				remove.classList.add('dashicons-before', 'dashicons-dismiss');
				// 				remove.title = thisClass.i18n?.remove??'Remove';
				// 				remove.addEventListener('click', (event) => {
				// 					event.preventDefault();
				// 					if (confirm('Are you sure you want to remove this item?')) {
				// 						console.log(currentConfig)
				// 						currentConfig.filter(row => row.id === item.id);
				// 						gcard.remove();
				// 						console.log(currentConfig)
				// 					}
				// 				});
				// 				gimg.appendChild(img);gimg.appendChild(remove);gwrap.appendChild(gimg);gcard.appendChild(gwrap);
				// 				return gcard;
				// 			};
				// 			// 
				// 			(row?.gallery??[]).forEach((item, index) => {
				// 				galleryrow.appendChild(galleryItemHtml(item, index));
				// 			});
				// 			// 
				// 			gallerywrap.appendChild(galleryrow);
				// 			var galleryfoot = document.createElement('div');
				// 			galleryfoot.classList.add('gallery-card-foot');
				// 			var button = document.createElement('button');
				// 			button.type = 'button';button.classList.add('btn', 'button');
				// 			button.innerHTML = button.title = 'Add Item';
				// 			button.addEventListener('click', (event) => {
				// 				event.preventDefault();
				// 				try {
				// 					if (typeof wp.media!=='undefined') {
				// 						var mediaUploader = wp.media({
				// 							title: 'Select / Upload a gallery Item',
				// 							button: {text: 'Use this Image'},
				// 							multiple: true
				// 						});
				// 						mediaUploader.on('select', function() {
				// 							mediaUploader.state().get('selection').map(attachment => {
				// 								attachment = attachment.toJSON();
				// 								if (attachment.type !== 'image') {
				// 									throw new Error('You can only upload images as gallery item');
				// 								}
				// 								if (!currentConfig.find(item => item.id === attachment.id)) {
				// 									var item = {
				// 										id: attachment.id,
				// 										title: attachment.title,
				// 										// imageUrl: attachment.url,
				// 										thumbUrl: attachment.sizes?.thumbnail?.url??'',
				// 										filename: attachment?.filename??'',
				// 									};
				// 									currentConfig.push(item);
				// 									galleryrow.appendChild(galleryItemHtml(item, (currentConfig.length + 1)));
				// 								} else {
				// 									throw new Error('You can\'t import same image file twice.');
				// 								}
				// 							});
				// 						});
				// 						mediaUploader.open();
				// 					} else {
				// 						throw new Error('WordPress media library not initialized.');
				// 					}
				// 				} catch (error) {
				// 					console.log(error);
				// 				}
				// 			});
				// 			galleryfoot.appendChild(button);
				// 			gallerywrap.appendChild(galleryfoot);
				// 			gallerycont.appendChild(gallerywrap);
				// 			body.appendChild(gallerycont);
				// 		}
				// 	}).then((result) => {
				// 		// console.log(result);
				// 		if (result?.isConfirmed) {
				// 			if (currentConfig) {
				// 				gHidden.value = JSON.stringify(currentConfig);
				// 			}
				// 		}
				// 		// if (result.dismiss === Swal.DismissReason.timer) {
				// 		//   console.log("I was closed by the timer");
				// 		// }
				// 	});
				// });
				// fcontrol.appendChild(gallery);

				config.appendChild(fcontrol);
				// 
				// group.appendChild(label);
				el.dataset.order = (order+1);
				body.appendChild(group);body.appendChild(config);wrap.appendChild(body);
			}
			/**
			 * Body Section
			 */
			if (true) {
				var foot = document.createElement('div');foot.classList.add('single-repeater-foot');
				wrap.appendChild(foot);
			}
			
			el.parentElement.querySelector('.single-repeater-options').appendChild(wrap);
			setTimeout(() => {thisClass.init_intervalevent(window.thisClass);}, 300);
		}
		do_group_repeater(el, group) {
		}
		do_order(form) {
			var obj = {}, sort;
			form.querySelectorAll('[name*="[]"], [data-input-name*="[]"]').forEach((el,ei) => {
				if (!el.dataset.inputName) {el.dataset.inputName=el.name;}
				sort = el.dataset.inputName.replaceAll('[]','');
				if (!obj[sort]) {obj[sort]=[];}
				obj[sort].push(true);
				el.name = el.dataset.inputName.replaceAll('[]','['+(obj[sort].length-1)+']');
			});
			return true;
		}
		imagePreview(src) {
			var cross, preview, image, name = '';
			preview = document.createElement('div');preview.classList.add('imgpreview');
			if (!src || src == '') {
				preview.classList.add('no-image');
				return preview;
			}
			name = src.split('/');name = name[(name.length-1)];
			
			cross = document.createElement('div');cross.classList.add('dashicons-before', 'dashicons-dismiss');
			cross.title = thisClass.i18n?.remove??'Remove';
			image = document.createElement('img');image.src = src;image.alt = name;
			preview.appendChild(image);preview.appendChild(cross);return preview;
		}
		image_button_preview(args, namePrefix, row) {
			var div, button, prev_wrap, preview, image, cross;
			var subObj = (args?.subObj && row[args?.subObj])?row[args?.subObj]:row;
			div = document.createElement('div');
			div.classList.add('w-half');
			prev_wrap = document.createElement('div');
			prev_wrap.classList.add('prev_wrap');
			// 
			image = document.createElement('img');image.src = subObj?.imageURL??'';image.alt = subObj?.filename??'';
			cross = document.createElement('div');cross.classList.add('dashicons-before', 'dashicons-dismiss');
			cross.title = thisClass.i18n?.remove??'Remove';
			preview = document.createElement('div');preview.classList.add('imgpreview');
			if ((subObj?.imageID??'') == '') {preview.classList.add('no-image');}
			preview.appendChild(image);preview.appendChild(cross);prev_wrap.appendChild(preview);
			// 
			button = document.createElement('button');button.classList.add('form-control');
			button.name = namePrefix + '.imageUrl';
			button.setAttribute('value', subObj?.imageUrl??'');button.type = 'button';
			button.dataset.innertext = button.innerHTML = args?.btnText??'Select image';
			if (subObj?.imageID && args?.btnTextonSelect) {button.innerHTML = args?.btnTextonSelect??'Select image';}
			
			var imageID = document.createElement('input');imageID.type = 'hidden';imageID.name = namePrefix + '.imageID';
			imageID.setAttribute('value', subObj?.imageID??'');prev_wrap.appendChild(imageID);
			var imageURL = document.createElement('input');imageURL.type = 'hidden';imageURL.name = namePrefix + '.imageURL';
			imageURL.setAttribute('value', subObj?.imageURL??'');prev_wrap.appendChild(imageURL);
			prev_wrap.appendChild(button);div.appendChild(prev_wrap);
			button.addEventListener('click', (event) => {
				event.preventDefault();
				if (typeof wp.media!=='undefined') {
					var mediaUploader = wp.media({
						title: args?.popTitle??'Select or Upload Media',
						button: {text: args?.popConfirm??'Use this Media'},
						multiple: false
					});
					mediaUploader.on('select', function() {
						var attachment = mediaUploader.state().get('selection').first().toJSON();
						imageID.value = attachment.id;
						var thumbnail = attachment.url;
						if (attachment?.sizes) {
							if (attachment.sizes?.thumbnail && attachment.sizes.thumbnail?.url) {
								thumbnail = attachment.sizes.thumbnail.url;
							}
						}
						imageURL.value = image.src = thumbnail;image.alt = attachment?.filename;
						preview.classList.remove('no-image');
						button.innerHTML = args?.btnTextonSelect??button.innerHTML;
						console.log(attachment)
					});
					mediaUploader.open();
				} else {
					thisClass.toast.fire({icon: 'error', title: "WordPress media library not initialized."});
				}
			});
			cross.addEventListener('click', (event) => {
				event.preventDefault();
				image.src = image.alt = '';
				preview.classList.add('no-image');
				imageID.value = imageURL.value = '';
				button.innerHTML = args?.btnText??(button.dataset?.innertext??button.innerHTML);
			});
			return div;
		}
		context_menu(elem, type) {
			const thisClass = this;var ul, li, a, file;
			thisClass.actionButtons = thisClass?.actionButtons??{};
			if (!elem) {return;}
			elem.dataset.context = true;
			if (!(thisClass.customier?.contextmenu)) {
				const contextMenu = thisClass.customier.contextmenu = document.createElement('div');
				contextMenu.classList.add('contextmenu');
				var ul = thisClass.actionButtons.list = document.createElement('ul');ul.classList.add('contextmenu__list');

				// Update Menu
				li = thisClass.actionButtons.update = document.createElement('li');li.classList.add('contextmenu__list__item');
				a = document.createElement('a');a.href = '#';a.innerHTML = thisClass.i18n?.update??'Update';
				a.addEventListener('click', (event) => {
					event.preventDefault();
					document.querySelector('.customizer button[data-action="update"]')?.click();
				});
				li.appendChild(a);ul.appendChild(li);
				// Export Menu
				li = thisClass.actionButtons.export = document.createElement('li');li.classList.add('contextmenu__list__item');
				a = document.createElement('a');a.href = '#';a.innerHTML = thisClass.i18n?.export??'Export';
				a.addEventListener('click', (event) => {
					event.preventDefault();
					setTimeout(() => {
						var json_export = {imports: thisClass.customier.tabset, importable: true};
						var prod_title = thisClass.lastJson.info.prod_title;
						var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json_export));
						var dlbtn = document.createElement('a');
						dlbtn.target = '_blank';
						dlbtn.setAttribute("href", dataStr);
						dlbtn.setAttribute("download", prod_title + ".json");
						dlbtn.click();
						setTimeout(() => {dlbtn.remove();}, 1500);
					}, 3500);
				});
				li.appendChild(a);ul.appendChild(li);
				// Import Menu
				li = thisClass.actionButtons.import = document.createElement('li');li.classList.add('contextmenu__list__item');
				file = document.createElement('input');file.type = 'file';
				file.accept = '.json';file.style.display = 'none';
				a = document.createElement('a');a.href = '#';a.innerHTML = thisClass.i18n?.import??'Import';
				file.addEventListener('change', (event) => {
					if (event.target.files[0]) {
						const selectedFile = event.target.files[0];
						setTimeout(() => {
							const reader = new FileReader();
							reader.onload = function(event) {
								const fileContents = event.target.result;
								try {
									const parsedData = JSON.parse(fileContents);
									console.log('Identified', parsedData);
									if (parsedData?.importable && parsedData?.imports) {
										thisClass.isImporting = true;
										var data = new FormData();
										data.append('action', 'kaluste/update/product/configuration');
										data.append('product_id', thisClass?.product_id);
										data.append('tabset', JSON.stringify(parsedData.imports));
										data.append('_nonce', thisClass.ajaxNonce);
										thisClass.post.sendToServer(data, thisClass)
										.then(response => {
											Swal.fire({
												showCancelButton: true,
												icon: "success", title: thisClass.i18n?.success??"Success",
												text: "Import successfully made! Please reload your application",
												confirmButtonText: thisClass.i18n?.reload??'Reload'
											})
											.then(result => {
												if (result?.isConfirmed) {
													location.reload();
												}
											})
											.catch((err) => {
												console.error("Error:", err);
												thisClass.toast.fire({icon: 'error', title: err.responseText, duration: 3000, stopOnFocus: true});
											});
										})
										.catch((err) => {
											console.error("Error:", err);
											thisClass.toast.fire({icon: 'error', title: err.responseText, duration: 3000, stopOnFocus: true});
										});
									} else {
										var message = thisClass.i18n?.untrustable??'We can\'t find trustable imports contents.';
										// thisClass.toastify({text: message ,className: "error", duration: 3000, stopOnFocus: true, style: {background: "linear-gradient(to right, #ffb8b8, #ff7575)"}}).showToast();
										thisClass.toast.fire({icon: 'error', title: message , duration: 3000, stopOnFocus: true});
									}
								} catch (error) {
									// console.error('Error parsing JSON:', error);
									var message = thisClass.i18n?.errorparsingjson??'Error parsing JSON:';
									// thisClass.toastify({text: message + error,className: "error", duration: 3000, stopOnFocus: true, style: {background: "linear-gradient(to right, #ffb8b8, #ff7575)"}}).showToast();
									thisClass.toast.fire({icon: 'error', title: message + error, duration: 3000, stopOnFocus: true});
								}
							};
							reader.readAsText(selectedFile);
						}, 5000);
					}
				});
				a.addEventListener('click', (event) => {
					event.preventDefault();file.click();
				});
				li.appendChild(a);ul.appendChild(li);
				// 
				contextMenu.appendChild(ul);
				document.body.appendChild(contextMenu);
				
				// Prevent the context menu from disappearing when clicking inside it
				contextMenu.addEventListener("click", (event) => {
					event.stopPropagation();
				});
				// Hide the context menu on click outside
				document.addEventListener("scroll", (event) => {
					contextMenu.style.display = "none";
				});
				// Hide the context menu on click outside
				document.addEventListener("click", (event) => {
					contextMenu.style.display = "none";
				});
				// Prevent the context menu from appearing on right-click
				contextMenu.addEventListener("contextmenu", (event) => {
					event.preventDefault();
				});
			}
			var hideAll = () => [...thisClass.actionButtons.list.children].forEach(elem => elem.style.display = "none");
			var showAll = () => [...thisClass.actionButtons.list.children].forEach(elem => elem.style.display = "block");
			var hideOnly = (items) => {showAll();items.forEach(key => thisClass.actionButtons[key].style.display = "none");}
			var showOnly = (items) => {hideAll();items.forEach(key => thisClass.actionButtons[key].style.display = "block");}
			elem.addEventListener("contextmenu", function(event) {
				event.preventDefault();
				thisClass.customier.contextmenu.style.left = event.clientX + "px";
				thisClass.customier.contextmenu.style.top = (event.clientY - 0) + "px";
				thisClass.customier.contextmenu.style.display = "block";
				// 
				switch (elem.dataset?.action) {
					case 'update':
						hideOnly(['update']);
						break;
					default:
						showAll();
						break;
				}
			});
		}
		transformObjectKeys(obj) {
			const transformedObj = {};
			for (const key in obj) {
			  if (obj.hasOwnProperty(key)) {
				const value = obj[key];
				if (key.includes('[') && key.includes(']')) {
				  // Handle keys with square brackets
				  const matches = key.match(/(.+?)\[(\w+)\]/);
				  if (matches && matches.length >= 3) {
					const newKey = matches[1];
					const arrayKey = matches[2];
		  
					if (!transformedObj[newKey]) {
					  transformedObj[newKey] = [];
					}
		  
					transformedObj[newKey][arrayKey] = value;
				  } else {
					if (key.substr(-2)=='[]') {
						const newKey = key.substr(0, (key.length-2));
						if (!transformedObj[newKey]) {transformedObj[newKey]=[];}
						transformedObj[newKey].push(value);
					}
				  }
				} else {
				  // Handle regular keys
				  const newKey = key.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
		  
				  if (typeof value === 'object') {
					transformedObj[newKey] = this.transformObjectKeys(value);
				  } else {
					const keys = newKey.split('.');
					let currentObj = transformedObj;
		  
					for (let i = 0; i < keys.length - 1; i++) {
					  const currentKey = keys[i];
					  if (!currentObj[currentKey]) {
						currentObj[currentKey] = {};
					  }
					  currentObj = currentObj[currentKey];
					}
		  
					currentObj[keys[keys.length - 1]] = value;
				  }
				}
			  }
			}
		  
			return transformedObj;
		}
		init_intervalevent() {
			const thisClass = this;
			// document.querySelectorAll('.imglibrary:not([data-handled])').forEach((el, ei) => {
			// 	el.dataset.handled = true;
			// 	el.addEventListener('click', (event) => {
			// 		event.preventDefault();
			// 		if (typeof wp.media!=='undefined') {
			// 			var mediaUploader = wp.media({
			// 				title: 'Select or Upload Media',
			// 				button: {text: 'Use this Media'},
			// 				multiple: false
			// 			});
			// 			mediaUploader.on('select', function() {
			// 				var attachment = mediaUploader.state().get('selection').first().toJSON();
			// 				var url = attachment.url;el.value = url; // attachment.filename;
			// 				el.innerHTML = el.dataset.innertext+' ('+attachment.filename+')';
			// 				var hidden = el.nextElementSibling;
			// 				if (hidden) {hidden.value = attachment.id;}
	
			// 				var img, node, cross;
			// 				if ((el.nextElementSibling?.nextElementSibling??false) && el.nextElementSibling.nextElementSibling.classList.contains('imgpreview')) {
			// 					el.nextElementSibling.nextElementSibling.remove();
			// 				}
			// 				cross = document.createElement('div');cross.classList.add('dashicons-before', 'dashicons-dismiss');
			// 				cross.title = thisClass.i18n?.remove??'Remove';
			// 				cross.addEventListener('click', (event) => {
			// 					event.preventDefault();cross.parentElement.remove();el.value = '';
			// 					el.nextElementSibling.value = '';el.innerHTML = el.dataset.innertext;
			// 				});
			// 				node = document.createElement('div');node.classList.add('imgpreview');
			// 				img = document.createElement('img');img.src = url;img.alt = attachment.id;
			// 				node.appendChild(img);node.appendChild(cross);
			// 				// el.parentElement.appendChild(node);
			// 				thisClass.insertAfter(el.nextElementSibling, node);
			// 				// jQuery('#img_url').val(url);
			// 				// jQuery('.upload_img').html('<img src="'+url+'">');
			// 			});
			// 			mediaUploader.open();
			// 		} else {
			// 			// thisClass.toastify({text: "WordPress media library not initialized.",className: "info",style: {background: "linear-gradient(to right, #00b09b, #96c93d)"}}).showToast();
			// 			thisClass.toast.fire({icon: 'error', title: "WordPress media library not initialized."});
			// 		}
			// 	});
			// });
			document.querySelectorAll('.do_repeater_group:not([data-handled])').forEach((el, ei) => {
				el.dataset.handled = true;
				el.addEventListener('click', (event) => {
					event.preventDefault();
					thisClass.do_group_repeater(el, []);
				});
			});
			document.querySelectorAll('.single-repeater-option .input-group-append:not([data-handled])').forEach((trash) => {
				trash.dataset.handled = true;
				trash.addEventListener('click', (event) => {
					if (trash.parentElement && confirm(thisClass.i18n?.rusure??'Are you sure?')) {
						jQuery(trash.parentElement.parentElement).slideUp();
						setTimeout(() => {trash.parentElement.parentElement.remove();}, 1500);
					}
				});
			});
			// document.querySelectorAll('.single-repeater-option .input-group-prepend:not([data-handled])').forEach((condition) => {
			// 	condition.dataset.handled = true;
			// 	condition.addEventListener('click', (event) => {
			// 		if (condition.parentElement && condition.parentElement.parentElement) {
			// 			condition.parentElement.parentElement.classList.toggle('show-configs');
			// 		}
			// 	});
			// });
			document.querySelectorAll('.imgpreview .dashicons-dismiss:not([data-handled])').forEach((cross) => {
				cross.dataset.handled = true;
				cross.addEventListener('click', (event) => {
					event.preventDefault();
					var hidden = cross.parentElement.previousElementSibling;
					cross.parentElement.remove();hidden.value = '';
					var input = hidden.previousElementSibling;
					if (input.nodeName == 'INPUT') {input.value = '';}
					else {input.removeAttribute('value');}
					input.innerHTML = input.dataset.innertext;
				});
			});
		}
		insertAfter(referenceNode, newNode) {
			referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		}
	}
	new BackendCustomizer();
})(jQuery);
