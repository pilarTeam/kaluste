// import Customizer from './customizer';
import Post from "../modules/post";

(function ($) {
	class FWPListivoBackendJS {
		constructor() {
			this.config = fwpSiteConfig;
			var i18n = fwpSiteConfig?.i18n??{};
			this.ajaxUrl = fwpSiteConfig?.ajaxUrl??'';
			this.ajaxNonce = fwpSiteConfig?.ajax_nonce??'';
			this.i18n = {confirming: 'Confirming', ...i18n};
			// this.Sortable = Sortable;
			this.customier = {};
			this.post = new Post(this);
			
			this.setup_hooks();
		}
		setup_hooks() {
			window.thisClass = this;const thisClass = this;
				thisClass.setup_events();
			document.querySelectorAll('#customizer_root').forEach(root => {
				thisClass.render_root(root);
			});
		}
		setup_events() {
			const thisClass = this;
			document.querySelectorAll('.customizer__header__actions button').forEach(button => {
				button.addEventListener('click', (event) => {
					event.preventDefault();
					switch (button.dataset?.action) {
						case 'newTab':
							if (thisClass.customier?.fields) {
								// 
							}
							break;
						default:
							break;
					}
				})
			})
		}
		render_root(root) {
			const thisClass = this;var html, data, product_id;
			product_id = root.dataset.product_id;
			
			thisClass.lastfieldID = 0;
			thisClass.lastJson = false;
			html = document.createElement('div');
			html.appendChild(thisClass.get_template());
			root.appendChild(html);
			data = new FormData();
			data.append('_nonce', thisClass.ajaxNonce);
			data.append('product_id', parseInt(product_id));
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
			if(thisClass?.lastJson) {
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
			fields = (thisClass.lastJson?.configs??false)?thisClass.lastJson.configs:[];
			Object.values(fields).forEach((row, i) => {
				var id = Object.keys(fields)[i];
				formGroup[id] = html = document.createElement('div');
				row.forEach((data) => {
					field = thisClass.do_field(thisClass.doto_field(data?.type??(data?.fieldtype??'text')), data);
					formGroup[id].appendChild(field);
				});
			});
			if(fields.length >= 1) {
				html = document.createElement('div');html.classList.add('customizer__addnew__type__select');
				html.appendChild(tabs);
				setTimeout(() => {
					['standing', 'sitting'].forEach((id) => {
						var area = document.querySelector('#tab__content_' + id);
						formGroup[id].classList.add('customizer__addnew__form-wrap');
						if(area) {area.appendChild(formGroup[id])}
					});
				}, 500);
				return html;
			} else {
				var addNew = document.createElement('button');
				addNew.type = 'button';addNew.name = 'repeater__tab';
				addNew.classList.add('customizer__repeater__tab');
				// 
				return thisClass.do_fetch();
			}
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
		do_fetch() {
			const thisClass = this;
			var template, fields, data, form, field, wrap, node, div, button, label, input, h2, formGroup, json;
			json = thisClass.get_fields();fields = json.types;
			template = thisClass.customier.body = document.createElement('div');template.classList.add('customizer__state__body');
			var body = thisClass.customier.fields = document.createElement('div');body.classList.add('customizer__state__fields');
			// 
			template.appendChild(body);
			form = document.createElement('div');form.classList.add('customizer__addnew__field');
			if(document.querySelector('.customizer__addnew__form')) {
				form = document.querySelector('.customizer__addnew__form');
			}
			// form.name = 'add-new-element-type-select';form.action = '#';form.method = 'post';
			wrap = document.createElement('div');wrap.classList.add('customizer__addnew__form-wrap');
			if(template.querySelector('.customizer__addnew__form-wrap')) {wrap = template.querySelector('.customizer__addnew__form-wrap');}
			node = document.createElement('form');node.classList.add('customizer__addnew__form');
			node.action = '#';node.method = 'post';node.name = 'add-new-element-type-select';
			node.style.display = 'none';
			h2 = document.createElement('h4');h2.classList.add('h4');
			h2.innerHTML = thisClass.i18n?.selectatype??'Select a type';
			node.appendChild(h2);
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
			setTimeout(() => {
				button = document.querySelector('.procced_types');
				if(button) {
					button.addEventListener('click', (event) => {
						jQuery('.customizer__addnew__form, .procced_types').slideUp();
						jQuery('.add-new-types').slideDown();
						data = thisClass.transformObjectKeys(Object.fromEntries(new FormData(document.querySelector('form[name="'+node.name+'"]'))));
						// thisClass.toastify({text: "Procced clicked",className: "info",style: {background: "linear-gradient(to right, #00b09b, #96c93d)"}}).showToast();
						field = thisClass.do_field(thisClass.doto_field(data?.fieldtype??'text'), {});

						formGroup = document.querySelector('.customizer__state__fields');
						if(formGroup) {formGroup.appendChild(field);}

						setTimeout(() => {thisClass.init_intervalevent();},300);
					});
				}
				button = document.querySelector('.add-new-types');
				if(button) {
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
				if(button) {
					button.addEventListener('click', (event) => {
						event.preventDefault();
						button.setAttribute('disabled', true);
						var popsData = {};
						['standing', 'sitting'].forEach((id) => {
							// form = document.querySelector('[name="add-new-element-type-select"]');
							form = document.querySelector('#tab__content_' + id);
							if(!thisClass.do_order(form)) {return;}data = [];
							form.querySelectorAll('.customizer__addnew__form-wrap .customize__step').forEach((form) => {
								data.push(
									thisClass.transformObjectKeys(Object.fromEntries(new FormData(form)))
								);
							});
							data = data.map((row) => {
								row.fieldID = parseInt(row.fieldID);
								if((row?.options??false)) {
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
			return template;
		}
		do_field(field, data) {
			const thisClass = this;thisClass.currentFieldID = thisClass.currentFieldID??0;
			var header, fields, form, fieldset, input, label, level, hidden, span, option, head, others, body, div, remove, img, icon, preview, cross, node;thisClass.currentFieldID++;
			div = document.createElement('form');div.classList.add('customize__step');header = true;
			div.action = '';div.method = 'post';div.id = 'popupstepform_'+thisClass.currentFieldID;
			// head = document.createElement('h2');head.innerHTML=field;div.appendChild(head);
			if(header) {
				head = document.createElement('div');head.classList.add('customize__step__header');
				input = document.createElement('input');input.type='number';input.name = 'fieldID';
				input.setAttribute('value', data?.fieldID??thisClass.currentFieldID);input.classList.add('field_id');
				span = document.createElement('span');span.classList.add('customize__step__header__text');
				span.innerHTML = (data?.type??field.type).toUpperCase();span.dataset.type = data?.type??field.type;
				head.appendChild(span);head.appendChild(input);
				remove = document.createElement('span');remove.title = 'Remove';
				remove.classList.add('customize__step__header__remove', 'dashicons-before', 'dashicons-trash');
				input = document.createElement('input');input.type='hidden';input.name = 'type';input.setAttribute('value', data?.type??field.type);
				head.appendChild(input);head.appendChild(remove);div.appendChild(head);
				body = div;div = document.createElement('div');div.classList.add('customize__step__body');
			}
			if(false && field.steptitle) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group');
	
				input = document.createElement('input');input.classList.add('form-control');
				input.name = 'steptitle';input.type = 'text';input.maxlength = 10;
				input.id = 'thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.steptitle??'');
				input.placeholder=thisClass.i18n?.customize__step_text??'PopUp Step text';
				label = document.createElement('label');label.classList.add('form-label');
				label.setAttribute('for', input.id);
				label.innerHTML = thisClass.i18n?.customize__steptext_desc??'PopUp Step text not more then 10 characters.';
				
				fieldset.appendChild(label);fieldset.appendChild(input);div.appendChild(fieldset);
			}
			if(false && field.headerbg) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group');
				input = document.createElement('button');input.classList.add('btn', 'button', 'imglibrary');
				
				input.type='button';input.innerHTML = thisClass.i18n?.select_image??'Select image';
				input.innerHTML = ((data?.headerbgurl??'')=='')?input.innerHTML:input.innerHTML+' ('+(data?.headerbgurl??'').split(/[\\/]/).pop()+')';
				input.placeholder=thisClass.i18n?.customize__subheading_text??'PopUp Sub-heading text';
				input.name = 'headerbgurl';input.setAttribute('value', data?.headerbgurl??'');
				input.dataset.innertext = thisClass.i18n?.select_image??'Select image';
				label = document.createElement('p');label.classList.add('text-muted');
				label.setAttribute('for', 'thefield'+thisClass.lastfieldID);input.id = 'thefield'+thisClass.lastfieldID;
				label.innerHTML = thisClass.i18n?.select_image_desc??'Select an image for popup header. It should be less weight, vertical and optimized.';
				hidden = document.createElement('input');hidden.type='hidden';hidden.name ='headerbg';hidden.setAttribute('value', data?.headerbg??'');
				
				fieldset.appendChild(label);fieldset.appendChild(input);fieldset.appendChild(hidden);fieldset.appendChild(thisClass.imagePreview(data?.headerbgurl??''));
				div.appendChild(fieldset);
			}
			if(field.heading) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group');
				input = document.createElement('input');input.type='text';
				input.id = 'thefield'+thisClass.lastfieldID;input.classList.add('form-control');
				input.name = 'heading';input.setAttribute('value', data?.heading??'');
				input.placeholder=thisClass.i18n?.customize__heading_text??'Headering';
				label = document.createElement('label');label.classList.add('form-label');
				label.setAttribute('for', 'thefield'+thisClass.lastfieldID);
				label.innerHTML = thisClass.i18n?.customize__heading??'Header Text';
				
				fieldset.appendChild(label);fieldset.appendChild(input);div.appendChild(fieldset);
			}
			if(field.subtitle) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group');
				input = document.createElement('input');input.classList.add('form-control');
				input.name = 'subtitle';input.type = 'text';
				input.id = 'thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.subtitle??'');
				input.placeholder=thisClass.i18n?.customize__subheading_text??'Sub-heading';
				label = document.createElement('label');label.classList.add('form-label');
				label.setAttribute('for', input.id);
				label.innerHTML = thisClass.i18n?.customize__subheading??'Sub header text';
				
				fieldset.appendChild(label);fieldset.appendChild(input);div.appendChild(fieldset);
			}
			thisClass.lastfieldID++; // field.required
			if(true) {
				thisClass.lastfieldID++;
				fieldset = document.createElement('div');fieldset.classList.add('form-group', 'checkbox-reverse');
				input = document.createElement('input');input.classList.add('form-control');
				input.name = 'required';input.type = 'checkbox';
				input.id = 'thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.required??'1');
				input.placeholder=thisClass.i18n?.customize__subheading_text??'PopUp Sub-heading text';
				label = document.createElement('label');label.classList.add('form-label');
				label.setAttribute('for', input.id);
				label.innerHTML = thisClass.i18n?.required??'Required';
				
				fieldset.appendChild(label);fieldset.appendChild(input);div.appendChild(fieldset);
			}
			thisClass.lastfieldID++;
			switch (field.type) {
				case 'textarea':
					fieldset = document.createElement('div');fieldset.classList.add('form-group');
					input = document.createElement('textarea');input.classList.add('form-control', 'form-control-'+field.type);input.setAttribute('value', data?.placeholder??'');
					input.name = 'placeholder';input.placeholder = thisClass.i18n?.placeholder_text??'Placeholder text';input.id = 'thefield'+thisClass.lastfieldID;
					label = document.createElement('label');label.classList.add('form-label');
					label.setAttribute('for', input.id);label.innerHTML = thisClass.i18n?.placeholder_text??'Placeholder text';
					fieldset.appendChild(label);fieldset.appendChild(input);div.appendChild(fieldset);
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
					fieldset.appendChild(label);fieldset.appendChild(input);div.appendChild(fieldset);
					break;
				case 'select':case 'radio':case 'checkbox':
					fieldset = document.createElement('div');fieldset.classList.add('form-group');
					input = document.createElement('input');input.classList.add('form-control', 'form-control-'+field.type);input.type='text';input.name = 'label';input.id='thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.label??'');
					label = document.createElement('label');label.classList.add('form-label');
					label.setAttribute('for', input.id);label.innerHTML = thisClass.i18n?.input_label??'Input label';
					fieldset.appendChild(label);fieldset.appendChild(input);
					
					input = document.createElement('input');input.classList.add('form-control', 'form-control-'+field.type);input.id='thefield'+thisClass.lastfieldID;input.name = 'description';input.setAttribute('value', data?.description??'');
					label = document.createElement('label');label.classList.add('form-label');
					label.setAttribute('for', input.id);label.innerHTML = thisClass.i18n?.placeholder_text??'Field descriptions.';
					fieldset.appendChild(label);fieldset.appendChild(input);

					// thisClass.lastfieldID++;
					// input = document.createElement('input');input.classList.add('form-control', 'form-control-'+field.type);input.type='text';input.name = 'placeholder';input.id='thefield'+thisClass.lastfieldID;input.setAttribute('value', data?.placeholder??'');
					// label = document.createElement('label');label.classList.add('form-label');
					// label.setAttribute('for', input.id);label.innerHTML = thisClass.i18n?.placeholder_text??'Placeholder text';
					// fieldset.appendChild(label);fieldset.appendChild(input);
					/**
					 * Reapeter fields
					 */
					input = document.createElement('button');input.classList.add('btn', 'button', 'my-3', 'do_repeater_field');input.type='button';input.dataset.order=0;
					input.innerHTML = thisClass.i18n?.add_new_option??'Add new option';input.dataset.optionGroup=field.type;
					fieldset.appendChild(input);
					
					(data?.options??[]).forEach(option => {
						thisClass.do_repeater(fieldset.querySelector('.do_repeater_field'), option, false);
					});
					/**
					 * Reapeter fields
					 */
					
					div.appendChild(fieldset);
					break;
				default:
					input = level = false;
					console.log('type', field.type);
					break;
			}
			if(header) {
				body.appendChild(div);div = body;
			}
			return div;
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
				types: ['text', 'number', 'date', 'time', 'local', 'color', 'range', 'textarea', 'select', 'radio', 'checkbox']
			};
		}
		do_repeater(el, row, groupAt) {
			const thisClass = this;
			var wrap, config, group, input, hidden, marker, remover, order, prepend, append, text, image, preview;
			if(!el.dataset.order) {el.dataset.order=0;}
			order = parseInt(el.dataset.order);
			wrap = document.createElement('div');wrap.classList.add('single-repeater-option');
			group = document.createElement('div');group.classList.add('input-group', 'mb-2', 'mr-sm-2');
			prepend = document.createElement('div');prepend.classList.add('input-group-prepend');
			text = document.createElement('div');text.classList.add('input-group-text');
			marker = document.createElement('span');marker.classList.add('dashicons-before', 'dashicons-edit');marker.title = 'Condition';text.appendChild(marker);
			prepend.appendChild(text);group.appendChild(prepend);
	
			input = document.createElement('input');input.classList.add('form-control');
			input.placeholder = 'Item title';input.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.label';
			input.setAttribute('value', row?.label??'');input.type = 'text';
			group.appendChild(input);
	
			append = document.createElement('div');append.classList.add('input-group-append');
			text = document.createElement('div');text.classList.add('input-group-text');
			remover = document.createElement('span');remover.classList.add('dashicons-before', 'dashicons-trash');remover.title = 'Remove';text.appendChild(remover);
			append.appendChild(text);group.appendChild(append);
	
			config = document.createElement('div');config.classList.add('form-controls-config');
			
			// hidden = document.createElement('input');hidden.classList.add('form-control', 'w-half');
			// hidden.placeholder = 'Next step ID';hidden.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.next';
			// hidden.setAttribute('value', row?.next??'');hidden.type = 'number';
			// config.appendChild(hidden);
	
			hidden = document.createElement('input');hidden.classList.add('form-control', 'w-half');
			hidden.placeholder = 'Price';hidden.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.cost';
			hidden.setAttribute('value', row?.cost??'');hidden.type = 'number';
			config.appendChild(hidden);
	
			image = document.createElement('button');image.classList.add('form-control', 'w-half', 'imglibrary');
			image.placeholder = 'Image';image.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.imageUrl';
			image.setAttribute('value', row?.imageUrl??'Select Image');image.type = 'button';
			image.dataset.innertext = image.innerHTML = thisClass.i18n?.select_image??'Select image';
			image.innerHTML = ((row?.imageUrl??'')=='')?image.innerHTML:image.innerHTML+' ('+(row?.imageUrl??'').split(/[\\/]/).pop()+')';
			config.appendChild(image);
			
			hidden = document.createElement('input');hidden.classList.add('form-control');
			hidden.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.image';hidden.type = 'hidden';
			hidden.setAttribute('value', row?.image??'');config.appendChild(hidden);
	
			// Preview
			config.appendChild(thisClass.imagePreview((row?.imageUrl??''), thisClass));
	
			image = document.createElement('button');image.classList.add('form-control', 'w-half', 'imglibrary');
			image.placeholder = 'Thumbnail';image.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.thumbUrl';
			image.setAttribute('value', row?.thumbUrl??'Select a thumbnail');image.type = 'button';
			image.dataset.innertext = image.innerHTML = thisClass.i18n?.select_thumbnail??'Select thumbnail';
			image.innerHTML = ((row?.thumbUrl??'')=='')?image.innerHTML:image.innerHTML+' ('+(row?.thumbUrl??'').split(/[\\/]/).pop()+')';
			config.appendChild(image);
			
			hidden = document.createElement('input');hidden.classList.add('form-control');
			hidden.name = ((groupAt !== false)?'groups.'+groupAt+'.options.':'options.')+order+'.thumb';hidden.type = 'hidden';
			hidden.setAttribute('value', row?.thumb??'');config.appendChild(hidden);
	
			config.appendChild(thisClass.imagePreview((row?.thumbUrl??''), thisClass));
			// el.dataset.optionGroup;
			// label = document.createElement('label');label.classList.add('form-label');label.innerHTML = 'Label';
			
			// group.appendChild(label);
			el.dataset.order = (order+1);
			wrap.appendChild(group);wrap.appendChild(config);
			el.parentElement.insertBefore(wrap, el);
			setTimeout(() => {thisClass.init_intervalevent(window.thisClass);}, 300);
		}
		do_group_repeater(el, group) {
		}
		do_order(form) {
			var obj = {}, sort;
			form.querySelectorAll('[name*="[]"], [data-input-name*="[]"]').forEach((el,ei) => {
				if(!el.dataset.inputName) {el.dataset.inputName=el.name;}
				sort = el.dataset.inputName.replaceAll('[]','');
				if(!obj[sort]) {obj[sort]=[];}
				obj[sort].push(true);
				el.name = el.dataset.inputName.replaceAll('[]','['+(obj[sort].length-1)+']');
			});
			return true;
		}
		imagePreview(src) {
			var cross, preview, image, name = '';
			preview = document.createElement('div');preview.classList.add('imgpreview');
			if(!src || src == '') {
				preview.classList.add('imgpreview', 'no-image');
				return preview;
			}
			name = src.split('/');name = name[(name.length-1)];
			
			cross = document.createElement('div');cross.classList.add('dashicons-before', 'dashicons-dismiss');
			cross.title = thisClass.i18n?.remove??'Remove';
			image = document.createElement('img');image.src = src;image.alt = name;
			preview.appendChild(image);preview.appendChild(cross);return preview;
		}
		context_menu() {
			const thisClass = this;var ul, li, a, file;
			const button = document.querySelector(".save-this-popup:not([data-context])");
			if(!button) {return;}
			button.dataset.context = true;
			const contextMenu = document.createElement('div');
			contextMenu.classList.add('contextmenu');
			var ul = document.createElement('ul');ul.classList.add('contextmenu__list');

			// Update Menu
			li = document.createElement('li');li.classList.add('contextmenu__list__item');
			a = document.createElement('a');a.href = '#';a.innerHTML = thisClass.i18n?.update??'Update';
			a.addEventListener('click', (event) => {
				event.preventDefault();
				document.querySelector('.save-this-popup')?.click();
			});
			li.appendChild(a);ul.appendChild(li);
			// Export Menu
			li = document.createElement('li');li.classList.add('contextmenu__list__item');
			a = document.createElement('a');a.href = '#';a.innerHTML = thisClass.i18n?.export??'Export';
			a.addEventListener('click', (event) => {
				event.preventDefault();
				document.querySelector('.swal2-html-container')?.classList.add('loading-exim');
				setTimeout(() => {
					var json_export = {imports: thisClass.lastJson.product, importable: true};
					var prod_title = thisClass.lastJson.info.prod_title;
					var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json_export));
					var dlAnchorElem = document.createElement('a');
					dlAnchorElem.target = '_blank';
					dlAnchorElem.setAttribute("href", dataStr);
					dlAnchorElem.setAttribute("download", prod_title + ".json");
					dlAnchorElem.click();
					setTimeout(() => {dlAnchorElem.remove();}, 1500);
					document.querySelector('.swal2-html-container')?.classList.remove('loading-exim');
				}, 3500);
			});
			li.appendChild(a);ul.appendChild(li);
			// Import Menu
			li = document.createElement('li');li.classList.add('contextmenu__list__item');
			file = document.createElement('input');file.type = 'file';
			file.accept = '.json';file.style.display = 'none';
			a = document.createElement('a');a.href = '#';a.innerHTML = thisClass.i18n?.import??'Import';
			file.addEventListener('change', (event) => {
				if(event.target.files[0]) {
					const selectedFile = event.target.files[0];
					document.querySelector('.swal2-html-container')?.classList.add('loading-exim');
					setTimeout(() => {
						// console.log('You selected ' + event.target.files[0].name);

						const reader = new FileReader();
						reader.onload = function(event) {
							const fileContents = event.target.result;
							try {
								const parsedData = JSON.parse(fileContents);
								console.log('Identified', parsedData);
								if(parsedData?.importable && parsedData?.imports) {
									thisClass.isImporting = true;
									var formdata = new FormData();
									formdata.append('action', 'futurewordpress/project/ajax/save/product');
									formdata.append('product_id', thisClass.config?.product_id??'');
									formdata.append('dataset', JSON.stringify(parsedData.imports));
									formdata.append('_nonce', thisClass.ajaxNonce);
									thisClass.sendToServer(formdata);
									setTimeout(() => {
										document.querySelector('.swal2-html-container')?.classList.remove('loading-exim');
									}, 20000);
								} else {
									document.querySelector('.swal2-html-container')?.classList.remove('loading-exim');
									var message = thisClass.i18n?.untrustable??'We can\'t find trustable imports contents.';
									thisClass.toastify({text: message ,className: "error", duration: 3000, stopOnFocus: true, style: {background: "linear-gradient(to right, #ffb8b8, #ff7575)"}}).showToast();
								}
							} catch (error) {
								// console.error('Error parsing JSON:', error);
								var message = thisClass.i18n?.errorparsingjson??'Error parsing JSON:';
								thisClass.toastify({text: message + error,className: "error", duration: 3000, stopOnFocus: true, style: {background: "linear-gradient(to right, #ffb8b8, #ff7575)"}}).showToast();
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
			
			contextMenu.appendChild(ul);
			document.querySelector('.swal2-html-container')?.appendChild(contextMenu);
			
			button.addEventListener("contextmenu", function(event) {
				event.preventDefault();
				contextMenu.style.left = event.clientX + "px";
				contextMenu.style.top = (event.clientY - 0) + "px";
				contextMenu.style.display = "block";
			});
			// Prevent the context menu from disappearing when clicking inside it
			contextMenu.addEventListener("click", function(event) {
				event.stopPropagation();
			});
			// Hide the context menu on click outside
			document.addEventListener("click", function(event) {
				contextMenu.style.display = "none";
			});
			// Prevent the context menu from appearing on right-click
			contextMenu.addEventListener("contextmenu", function(event) {
				event.preventDefault();
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
					if(key.substr(-2)=='[]') {
						const newKey = key.substr(0, (key.length-2));
						if(!transformedObj[newKey]) {transformedObj[newKey]=[];}
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
			document.querySelectorAll('.imglibrary:not([data-handled])').forEach((el, ei) => {
				el.dataset.handled = true;
				el.addEventListener('click', (event) => {
					event.preventDefault();
					if(typeof wp.media!=='undefined') {
						var mediaUploader = wp.media({
							title: 'Select or Upload Media',
							button: {text: 'Use this Media'},
							multiple: false
						});
						mediaUploader.on('select', function() {
							var attachment = mediaUploader.state().get('selection').first().toJSON();
							var url = attachment.url;el.value = url; // attachment.filename;
							el.innerHTML = el.dataset.innertext+' ('+attachment.filename+')';
							var hidden = el.nextElementSibling;
							if(hidden) {hidden.value = attachment.id;}
	
							var img, node, cross;
							if((el.nextElementSibling?.nextElementSibling??false) && el.nextElementSibling.nextElementSibling.classList.contains('imgpreview')) {
								el.nextElementSibling.nextElementSibling.remove();
							}
							cross = document.createElement('div');cross.classList.add('dashicons-before', 'dashicons-dismiss');
							cross.title = thisClass.i18n?.remove??'Remove';
							cross.addEventListener('click', (event) => {
								event.preventDefault();cross.parentElement.remove();el.value = '';
								el.nextElementSibling.value = '';el.innerHTML = el.dataset.innertext;
							});
							node = document.createElement('div');node.classList.add('imgpreview');
							img = document.createElement('img');img.src = url;img.alt = attachment.id;
							node.appendChild(img);node.appendChild(cross);
							// el.parentElement.appendChild(node);
							thisClass.insertAfter(el.nextElementSibling, node);
							// jQuery('#img_url').val(url);
							// jQuery('.upload_img').html('<img src="'+url+'">');
						});
						mediaUploader.open();
					} else {
						thisClass.toastify({text: "WordPress media library not initialized.",className: "info",style: {background: "linear-gradient(to right, #00b09b, #96c93d)"}}).showToast();
					}
				});
			});
			document.querySelectorAll('.customize__step__header:not([data-handled])').forEach((el, ei) => {
				el.dataset.handled = true;
				el.addEventListener('click', (event) => {
					event.preventDefault();
					if(el.nextElementSibling) {
						switch(el.dataset.status) {
							case 'shown':
								el.dataset.status = 'hidden';
								jQuery(el.nextElementSibling).slideUp();
								break;
							default:
								el.dataset.status = 'shown';
								jQuery(el.nextElementSibling).slideDown();
								break;
						}
					}
				});
			});
			document.querySelectorAll('.customize__step__header__remove:not([data-handled])').forEach((el, ei) => {
				el.dataset.handled = true;
				el.addEventListener('click', (event) => {
					event.preventDefault();
					if(confirm(thisClass.i18n?.areusure??'Are you sure?')) {
						if(el.parentElement&&el.parentElement.parentElement) {
							el.parentElement.parentElement.remove();
						} else {
							thisClass.toastify({text: "Operation falied!",className: "error",style: {background: "linear-gradient(to right, #ffb8b8, #ff7575)"}}).showToast();
						}
					}
				});
			});
			document.querySelectorAll('.do_repeater_field:not([data-handled])').forEach((el, ei) => {
				el.dataset.handled = true;
				el.addEventListener('click', (event) => {
					event.preventDefault();
					thisClass.do_repeater(el, {}, (el.dataset?.isGroup??false));
				});
			});
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
					if(trash.parentElement && confirm(thisClass.i18n?.rusure??'Are you sure?')) {
						jQuery(trash.parentElement.parentElement).slideUp();
						setTimeout(() => {trash.parentElement.parentElement.remove();}, 1500);
					}
				});
			});
			// .form-control-outfit + .single-repeater-group, .form-control-radio + .single-repeater-group, .form-control-checkbox + .single-repeater-group
			// document.querySelectorAll('.single-repeater-group').forEach((group) => {
				document.querySelectorAll('.single-repeater-option .form-control[type=text]:not([data-autocomplete-handled])').forEach((input) => {
					input.dataset.autocompleteHandled = true;
					input.dataset.name = input.name;
					const hidden = document.createElement('input');hidden.type = 'hidden';
					hidden.value = input.value;hidden.name = input.name;input.name = '';
					input.parentElement.insertBefore(hidden, input);
					if(!isNaN(input.value)) {
						var row = thisClass.lastJson.accessories.find((row) => row.ID == input.value);
						if(row?.title) {input.value = thisClass.he.decode(row.title);}
					}
					const autocomplete = new thisClass.Awesomplete(input, {
						list: thisClass.lastJson.accessories.map((row) => {
							return {label: row.title, value: row.ID, thumbnail: row.thumbnail};
						}),
						item: function(text, input) {
							var listItem = thisClass.Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
							if(!listItem.querySelector('img')) {
								var row = thisClass.lastJson.accessories.find((row) => row.ID == text?.value);
								if(row?.thumbnail) {
									var img = document.createElement("img");
									img.src = row.thumbnail;
									listItem.appendChild(img);
								}
							}
							return listItem;
						},
						replace: function(suggestion) {
							this.input.value = suggestion.label;
							hidden.value = suggestion.value;
						}
					});
					input.addEventListener('input', function(event) {
						hidden.value = input.value;
					});
					// console.log(autocomplete);
				});
			// });
			document.querySelectorAll('.single-repeater-option .input-group-prepend:not([data-handled])').forEach((condition) => {
				condition.dataset.handled = true;
				condition.addEventListener('click', (event) => {
					if(condition.parentElement && condition.parentElement.parentElement) {
						condition.parentElement.parentElement.classList.toggle('show-configs');
					}
					// input = condition.parentElement.nextElementSibling;
					// input.setAttribute('type', (input.getAttribute('type')=='number')?'hidden':'number');
					// if(input) {input.type = 'number';}
				});
			});
			document.querySelectorAll('.imgpreview .dashicons-dismiss:not([data-handled])').forEach((cross) => {
				cross.dataset.handled = true;
				cross.addEventListener('click', (event) => {
					event.preventDefault();
					var hidden = cross.parentElement.previousElementSibling;
					cross.parentElement.remove();hidden.value = '';
					var input = hidden.previousElementSibling;
					if(input.nodeName == 'INPUT') {input.value = '';}
					else {input.removeAttribute('value');}
					input.innerHTML = input.dataset.innertext;
				});
			});
		}
		insertAfter(referenceNode, newNode) {
			referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		}

	}
	new FWPListivoBackendJS();
})(jQuery);
