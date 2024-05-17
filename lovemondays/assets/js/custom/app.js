(function () {
	define(function (require) {
		'use strict';
		var _core = (function () {});
		var _prototype = _core.prototype;
		var _dependencies = {
			DOM: require('custom/DOM')
		};
		var _private = {
			CSS: {
				active: 'active'
			},
			slider: {
				items: [
					{
						DOM: _dependencies.DOM.slider,
						action: function (slider) {
							var root = this.root;
							var current = slider.settings.DOM.items.item(slider.current);
							var not = root.assert.not.bind(current);
							var siblings = root.utils.array(slider.settings.DOM.items).filter(not);
							var toogle = root.CSS.toggle.bind(root);
							toogle(current, _private.CSS.active, true);
							toogle(siblings, _private.CSS.active, false);
							return root;
						},
						interval: 5000
					}
				]
			},
			data: {
				slider: {
					items: []
				}
			}
		};
		var methods = {
			utils: {
				array: function (collection) {
					return Array.prototype.slice.call(collection);
				},

				noop: function () {
					return;
				},

				acumulate: function (action, stack, item) {
					return (stack + action(item));
				},
			},

			assert: {
				not: function (item) {
					return (this !== item);
				}
			},

			DOM: {
				computed: function (element) {
					return (element.currentStyle || window.getComputedStyle(element));
				},

				height: function (element) {
					var computed = this.DOM.computed(element);
					var margin = (parseInt(computed.marginTop, 10) + parseInt(computed.marginBottom, 10));
					var height = ((element.offsetHeight || 0) + margin);
					return height;
				},

				width: function (element) {
					var computed = this.DOM.computed(element);
					var margin = (parseInt(computed.marginLeft, 10) + parseInt(computed.marginRight, 10));
					var width = ((element.offsetWidth || 0) + margin);
					return width;
				}
			},

			CSS: {
				toggle: function (element, classname, status) {
					var collection = (Array.isArray(element) ? element : [element]);
					var action = (status ? 'add' : 'remove');
					var apply = this.CSS.apply.bind({action, classname, root: this});
					collection.forEach(apply);
					return this;
				},

				apply: function (element) {
					var action = this.action;
					var classname = this.classname;
					element.classList[action](classname);
					return this.root;
				}
			},

			document: {
				height: function () {
					return Math.max(
						document.body.scrollHeight,
						document.documentElement.scrollHeight,
						document.body.offsetHeight,
						document.documentElement.offsetHeight,
						document.body.clientHeight,
						document.documentElement.clientHeight
					);
				},

				width: function () {
					return Math.max(
						document.body.scrollWidth,
						document.documentElement.scrollWidth,
						document.body.offsetWidth,
						document.documentElement.offsetWidth,
						document.body.clientWidth,
						document.documentElement.clientWidth
					);
				}
			},

			slider: {
				items: {
					events: {
						click: function (control, index) {
							var root = this.root;
							control.addEventListener('click', root.slider.items.select.bind(this, index), false);
							return root;
						},

						mousemove: function (container) {
							var root = this.root;
							container.addEventListener('mousemove', root.slider.items.slide.bind(this), false);
							return root;
						}
					},

					height: function (element) {
						return element.offsetHeight;
					},

					width: function (element) {
						var width = this.utils.acumulate.bind(this, this.DOM.width.bind(this));
						return this.utils.array(element.children).reduce(width, 0);
					},

					left: function (element) {
						var computed = this.DOM.computed(element);
						var margin = parseInt(computed.marginLeft, 10);
						var offset = element.children.item(0).offsetLeft;
						return (offset - margin);
					},

					top: function (element) {
						return element.offsetTop;
					},

					slide: function (event) {
						var root = this.root;
						var element = event.currentTarget;
						var properties = {
							height: root.slider.items.height.call(root, element),
							width: root.slider.items.width.call(root, element),
							left: root.slider.items.left.call(root, element),
							top: root.slider.items.top.call(root, element)
						};
						var viewport = {
							x: {begin: properties.left, end: Math.min(root.document.width(), (properties.left + properties.width))},
							y: {begin: properties.top, end: Math.min(root.document.height(), (properties.top + properties.height))}
						};
						var available = {
							x: (viewport.x.end - viewport.x.begin),
							y: (viewport.y.end - viewport.y.begin)
						};
						var remaining = {
							x: (properties.width - available.x),
							y: (properties.height - available.y)
						};
						var position = {
							x: (event.clientX || 0),
							y: (document.documentElement.scrollTop + (event.clientY || 0))
						};
						var ellapsed = {
							x: Math.min(((Math.max((position.x - viewport.x.begin), 0) * 100) / available.x), 100),
							y: Math.min(((Math.max((position.y - viewport.y.begin), 0) * 100) / available.y), 100)
						};
						var scrolled = {
							x: -(remaining.x * (ellapsed.x / 100)),
							y: -(remaining.y * (ellapsed.y / 100))
						};
						element.style.marginLeft = [scrolled.x, 'px'].join('');
						return root;
					},

					schedule: function (position) {
						var root = this.root;
						var force = (position !== undefined);
						var index = this.index;
						var context = _private.data.slider.items[index];
						var target = (context.current + 1);
						var limit = (context.settings.DOM.items.length - 1);
						var current = (force ? position : ((target <= limit) ? target : 0));
						var schedule = root.slider.items.schedule.bind(this);
						var timeout = window.setTimeout(schedule, context.settings.interval);
						var executable = (typeof context.settings.action === 'function');
						var action = (executable ? context.settings.action : root.utils.noop);
						window.clearTimeout(context.timeout);
						Object.assign(context, {current: current, timeout: timeout});
						action.call(this, context);
						return root;
					},

					select: function (current, event) {
						var root = this.root;
						event.preventDefault();
						root.slider.items.schedule.call(this, current);
						return this;
					},

					bind: function () {
						var root = this.root;
						var index = this.index;
						var context = _private.data.slider.items[index];
						var container = context.settings.DOM.container;
						var controls = root.utils.array(context.settings.DOM.controls);
						root.slider.items.events.mousemove.call(this, container);
						controls.forEach(root.slider.items.events.click.bind(this));
						return root;
					},

					build: function (settings) {
						var timestamp = (new Date()).getTime();
						var index = _private.data.slider.items.length;
						var current = -1;
						var timeout = null;
						var data = {
							timestamp: timestamp,
							index: index,
							settings: settings,
							current: current,
							timeout: timeout
						};
						var context = {index: index, position: {x: 0, y: 0}, root: this};
						_private.data.slider.items.push(data);
						this.slider.items.bind.call(context);
						this.slider.items.schedule.call(context);
						return this;
					}
				},

				build: function () {
					var items = _private.slider.items;
					var build = this.slider.items.build.bind(this);
					items.forEach(build);
					return this;
				}
			},

			build: function () {
				this.slider.build.call(this);
				return this;
			},

			init: function () {
				this.build.call(this);
				return this;
			}
		};
		return Object.assign(_prototype, methods);
	});
}.call(this));