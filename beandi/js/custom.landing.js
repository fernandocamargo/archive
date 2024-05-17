window.landing = window.landing || {
	Constants: {
		Menu: {
			'selector': 'div#intro ul li'
		},

		'namespace': 'window.landing'
	},

	Definitions: {
	},

	Views: {
		Menu: {
			focus: function(element){
				$(window.landing.Definitions.Menu['selector']).not(element).addClass('disabled');
			},

			blur: function(){
				$(window.landing.Definitions.Menu['selector']).removeClass('disabled');
			}
		}
	},

	Actions: {
		Menu: {
			focus: function(element){
				window.landing.Actions.Menu.blur();
				window.landing.Views.Menu.focus(element);
			},

			blur: function(){
				window.landing.Views.Menu.blur();
			}
		},

		init: function(){
		}
	},

	Binds: {
		Menu: {
			build: function(){
				$(window.landing.Definitions.Menu['selector']).unbind('mouseover.'+ window.landing.Definitions.namespace).bind('mouseover.'+ window.landing.Definitions.namespace, function(){
					window.landing.Actions.Menu.focus($(this));
				});

				$(window.landing.Definitions.Menu['selector']).unbind('mouseout.'+ window.landing.Definitions.namespace).bind('mouseout.'+ window.landing.Definitions.namespace, function(){
					window.landing.Actions.Menu.blur();
				});
			},

			init: function(){
				window.landing.Binds.Menu.build();
			}
		},

		init: function(){
			window.landing.Binds.Menu.init();
		}
	},

	init: function(settings){
		window.landing.Definitions = $.extend(
			window.landing.Definitions,
			window.landing.Constants,
			settings
		);

		window.landing.Actions.init();
		window.landing.Binds.init();
	}
};