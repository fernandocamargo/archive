window.preloader = window.preloader || {
	Constants: {
		'namespace': 'window.preloader',
		'items': [],
		'total': 0,
		'interval': 500,
		'prefix-name': 'cache-item-'
	},

	Definitions: {
	},

	Views: {
		Utils: {
			getTimeStamp: function(){
				var time = new Date().getTime();
				while(time == new Date().getTime());
				return new Date().getTime();
			}
		},

		Cookies: {
			isCached: function(){
				var $cached = $.cookie(window.preloader.Definitions['namespace'] +'.cached') || 0;
				return (parseInt($cached) == 1) ? false : false;
				//return (parseInt($cached) == 1) ? true : false;
			},

			setAsCached: function(){
				$.cookie(window.preloader.Definitions['namespace'] +'.cached', 1);
			}
		},

		load: function(){
			$('body').addClass('loading');
			$('div#overlay').show().stop().animate(
				{
					'height': ($(document).height() +'px'),
					'opacity': 1,
					'width': ($(document).width() +'px')
				},
				0,
				function(){
					$(this).find('span.counter').css(
						{
							'top': ((($(document).height() / 2) - 10) +'px')
						}
					);

					$('div#container').css(
						{
							'opacity': 0
						}
					);

				}
			);
		},

		update: function(){
			var $total = window.preloader.Definitions['total'];
			var $items = window.preloader.Definitions['items'];
			var $percentage = Math.abs(100 - (($items.length * 100) / $total)).toFixed(0);
			$('div#overlay span.counter').text($percentage +'%');
		},

		ready: function(){
			$('div#overlay').stop().animate(
				{
					'opacity': 0
				},
				window.preloader.Definitions['interval'],
				function(){
					$('div#container').animate(
						{
							'opacity': 1
						},
						window.preloader.Definitions['interval'],
						function(){
							$('body').removeClass('loading');
						}
					);
				}
			).hide();
		},

		createImage: function(source){
			return $('<img />').attr('src', source +'?'+ window.preloader.Views.Utils.getTimeStamp());
		}
	},

	Actions: {
		Parsers: {
			CSS: function(){
				var $return = [];
				var $sheets = document.styleSheets;
				var $sheets_total = $sheets.length;

				for(var i = 0; i < $sheets_total; i++){
					var $rules = [];
					if(document.styleSheets[i].cssRules){
						var $_rules = document.styleSheets[i].cssRules;
						var $_rules_total = $_rules.length;
						for(var j = 0; j < $_rules_total; j++){
							$rules.push($_rules[j].cssText);
						}
					}
					else{
						$rules.push(document.styleSheets[i].cssText);
					}

					var $matched_images = $rules.join('').match(/[^\("]+\.(gif|jpg|jpeg|png)/g);
					if($matched_images){
						$.each($matched_images, function(index, value){
							$return.push(value);
						});
					}
				};

				return $return;
			},

			HTML: function(){
				var $return = [];
				var $target = $('img');
				if($target){
					$target.each(function(index, value){
						$return.push($(this).attr('src'));
					});
				}
				return $return;
			}
		},

		enqueue: function(path){
			var new_dom_element_name = window.preloader.Definitions['prefix-name'] + window.preloader.Views.Utils.getTimeStamp();
			var new_dom_element = window.preloader.Views.createImage(path);
			window.preloader.Definitions['items'].push(
				{
					'name': new_dom_element_name,
					'element': new_dom_element
				}
			);
			window.preloader.Binds.build(new_dom_element, new_dom_element_name);
			window.preloader.Definitions['total']++;
		},

		dequeueByName: function(name){
			var $items = [];
			$.each(window.preloader.Definitions['items'], function(index, value){
				if(value.name != name){
					$items.push(value);
				}
			});
			window.preloader.Definitions['items'] = $items;
			window.preloader.Actions.update();
			if($items.length <= 0) window.preloader.Actions.ready();
		},

		load: function(){
			window.preloader.Views.load();

			if(!window.preloader.Views.Cookies.isCached()){
				var $_css = $.unique(window.preloader.Actions.Parsers.CSS());
				if($_css.length){
					$.each($_css, function(index, value){
						window.preloader.Actions.enqueue(value);
					});
				}

				var $_html = $.unique(window.preloader.Actions.Parsers.HTML());
				if($_html.length){
					$.each($_html, function(index, value){
						window.preloader.Actions.enqueue(value);
					});
				}
			}
			else{
				window.preloader.Actions.ready();
			}
		},

		update: function(){
			window.preloader.Views.update();
		},

		ready: function(){
			window.preloader.Views.ready();
			window.preloader.Views.Cookies.setAsCached();
		},

		init: function(){
			window.preloader.Actions.load();
		}
	},

	Binds: {
		build: function(element, name){
			element.unbind(
				'load.'+ window.preloader.Definitions['namespace']
			).bind(
				'load.'+ window.preloader.Definitions['namespace'],
				function(){
					window.preloader.Actions.dequeueByName(name);
				}
			).unbind(
				'error.'+ window.preloader.Definitions['namespace']
			).bind(
				'error.'+ window.preloader.Definitions['namespace'],
				function(){
					window.preloader.Actions.dequeueByName(name);
				}
			);
		},

		init: function(){
		}
	},

	init: function(settings){
		window.preloader.Definitions = $.extend(
			window.preloader.Definitions,
			window.preloader.Constants,
			settings
		);

		window.preloader.Actions.init();
		window.preloader.Binds.init();
	}
};