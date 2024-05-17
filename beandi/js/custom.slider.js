window.slider = window.slider || {
	Constants: {
		Caches: {
			'prefix-name': 'cache-item-'
		},

		Intervals: {
			'interval': 4000
		},

		'namespace': 'window.slider',
		'items': [],
		'current': 0
	},

	Definitions: {
	},

	Views: {
		Caches: {
			createImage: function(source){
				return $('<img />').attr('src', source +'?'+ (new Date()).getTime());
			},

			getIndex: function(object, range){
				return $.inArray(object, range);
			}
		},
		
		exists: function(index){
			var current = window.slider.Definitions.items[index];
			return ($(current.selector).length) ? true : false;
		},

		start: function(index){
			var current = window.slider.Definitions.items[index];
			var $current = $(current.selector);
			var current_slide = $current.find('div#current-slide');
			var current_slide_image = current_slide.find('div.image');
			var last_slide = $current.find('div#last-slide');
			var last_slide_image = last_slide.find('div.image');

			if($.browser.msie && $.browser.version == '6.0'){
				current_slide_image.css({
					'background': 'transparent',
					'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+ current.data[current.current]['image_src'] +'", sizingMethod="image", enabled="true")'
				});
			}
			else{
				current_slide_image.css({
					'background-image': 'url('+ current.data[current.current]['image_src'] +')'
				});
			}

			current_slide.stop().animate(
				{
					'opacity': 1
				},
				window.slider.Definitions.Intervals.interval / 2,
				function(){
					if($.browser.msie && $.browser.version == '6.0'){
						last_slide_image.css({
							'background': 'transparent',
							'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+ current.data[current.current]['image_src'] +'", sizingMethod="image", enabled="true")'
						});
					}
					else{
						last_slide_image.css({
							'background-image': 'url('+ current.data[current.current]['image_src'] +')'
						});
					}

					current_slide.css({
						'opacity': 0
					});

					window.slider.Actions.Intervals.create(
						index,
						'window.slider.Actions.slideshow(\''+ index +'\')'
					);
				}
			);
		},

		goTo: function(index, target){
			var current = window.slider.Definitions.items[index];
			var $current = $(current.selector);
			var current_slide = $current.find('div#current-slide');
			var current_slide_image = current_slide.find('div.image');
			var last_slide = $current.find('div#last-slide');
			var last_slide_image = last_slide.find('div.image');

			if($.browser.msie && $.browser.version == '6.0'){
				current_slide_image.css({
					'background': 'transparent',
					'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+ current.data[current.current]['image_src'] +'", sizingMethod="image", enabled="true")'
				});
			}
			else{
				current_slide_image.css({
					'background-image': 'url('+ current.data[current.current]['image_src'] +')'
				});
			}

			last_slide.stop().animate(
				{
					'opacity': 0
				},
				window.slider.Definitions.Intervals.interval * .75,
				function(){
				}
			);

			current_slide.stop().animate(
				{
					'opacity': 1
				},
				window.slider.Definitions.Intervals.interval * .75,
				function(){
					if($.browser.msie && $.browser.version == '6.0'){
						last_slide_image.css({
							'background': 'transparent',
							'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+ current.data[current.current]['image_src'] +'", sizingMethod="image", enabled="true")'
						});
					}
					else{
						last_slide_image.css({
							'background-image': 'url('+ current.data[current.current]['image_src'] +')'
						});
					}

					current_slide.css({
						'opacity': 0
					});

					last_slide.css({
						'opacity': 1
					});
				}
			);
		}
	},

	Actions: {
		Caches: {
			enqueue: function(object){
				if(typeof(object.data.length) != 'undefined'){
					for(index in object.data){
						var item = object.data[index];
						for(property in item){
							var $property = item[property];
							if(typeof($property) == 'string'){
								if($images = $property.match(/\S+(\.png|\.jpg|\.jpeg|\.gif)/g)){
									for(var i = 0; i < $images.length; i++){
										var new_dom_element_name = window.slider.Definitions.Caches['prefix-name'] + object.cache.length;
										var new_dom_element = window.slider.Views.Caches.createImage($.trim($images[i]));
										object.cache.push({
											'name': new_dom_element_name,
											'element': new_dom_element
										});
										window.slider.Binds.Caches.load(new_dom_element, new_dom_element_name, object);
									}
								}
							}
						}
					}
				}
			},

			dequeue: function(name, object){
				object.cache.splice(window.slider.Actions.Caches.getIndexByName(name, object), 1);
				if(object.cache.length <= 0) window.slider.Actions.ready(object.index);
			},

			getIndexByName: function(name, object){
				if(object.cache && object.cache.length){
					for(var i = 0; i < object.cache.length; i++){
						var current = object.cache[i];
						if(current.name == name){
							return window.slider.Views.Caches.getIndex(current, object.cache);
							break;
						}
					}
				}
				return false;
			}
		},

		Intervals: {
			create: function(index, action){
				var current = window.slider.Definitions.items[index];
				current.intervals.push({
					'id': current.name,
					'interval': window.setInterval(action, window.slider.Definitions.Intervals.interval)
				});
			},

			getAllAndDestroy: function(index){
				var current = window.slider.Definitions.items[index];
				var intervals = current.intervals;
				if(intervals && intervals.length){
					for(var i = 0; i < intervals.length; intervals++){
						clearInterval(intervals[i].interval);
						intervals.splice(i, 1);
					}
				}
			}
		},

		load: function(){
			if(window.slider.Definitions.items && window.slider.Definitions.items.length){
				for(var i = 0; i < window.slider.Definitions.items.length; i++){
					if(window.slider.Views.exists(i)){
						var current = window.slider.Definitions.items[i];
						current.index = i;
						current.data = current.data();
						current.cache = [];
						current.intervals = [];
						current.timeouts = [];
						current.current = window.slider.Definitions.current;
						window.slider.Actions.Caches.enqueue(current);

						if(current.cache.length == 0){
							current.timeouts.push(window.setTimeout(
								'window.slider.Actions.ready('+ current.index +')',
								0
							));
						}
					}
				};
			}
		},

		ready: function(index){
			var current = window.slider.Definitions.items[index];
			window.slider.Actions.start(index);
			window.slider.Actions.Intervals.getAllAndDestroy(index);
		},

		slideshow: function(index){
			var current = window.slider.Definitions.items[index];
			var target = ((current.current + 1) < current.data.length) ? (current.current + 1) : 0;
			window.slider.Actions.goTo(index, target);
		},

		start: function(index){
			window.slider.Views.start(index);
		},
		
		goTo: function(index, target){
			var current = window.slider.Definitions.items[index];
			current.current = target;
			window.slider.Views.goTo(index, target);
			window.slider.Actions.Intervals.getAllAndDestroy(index);
			window.slider.Actions.Intervals.create(
				index,
				'window.slider.Actions.slideshow(\''+ index +'\')'
			);
		},


		init: function(){
			window.slider.Actions.load();
		}
	},

	Binds: {
		Caches: {
			load: function(element, name, object){
				element.unbind('load.'+ window.slider.Definitions.namespace).bind('load.'+ window.slider.Definitions.namespace, function(){
					window.slider.Actions.Caches.dequeue(name, object);
				});
			}
		},

		init: function(){
		}
	},

	init: function(settings){
		window.slider.Definitions = $.extend(
			window.slider.Definitions,
			window.slider.Constants,
			settings
		);

		window.slider.Actions.init();
		window.slider.Binds.init();
	}
};