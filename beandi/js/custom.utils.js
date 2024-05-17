window.utils = window.utils || {
	Constants: {
		UserAgents: {
			'selector': 'body',
			'operating-system': '',
			'navigator': '',
			'version': '',
			'class': ''
		},

		'namespace': 'window.utils'
	},

	Definitions: {
	},

	Views: {
		UserAgents: {
			identify: function(selector, classname){
				$(selector).addClass(classname);
			}
		}
	},

	Actions: {
		UserAgents: {
			parse: function(){
				var $_os, $_nav, $_ver, $_nav, $match;

				if($match = navigator.userAgent.match(/MSIE\ (.*)\;/)){
					$_nav = 'ie';
				}
				else if($match = navigator.userAgent.match(/Firefox\/(.*)/)){
					$_nav = 'ff';
				}
				else if($match = navigator.userAgent.match(/(iPhone)*.Version\/(.*)\sM/)){
					$_nav = 'iph';
					$match[1] = $match[2];
				}
				else if($match = navigator.userAgent.match(/AppleWebKit\/(.*)\s/)){
					if(navigator.userAgent.match(/Chrome\/(.*)\s/)){
						$_nav = 'wk-chr';
					}
					else{
						$_nav = 'wk-saf';
					}
				}
				else if($match = navigator.userAgent.match(/Opera\/(.*)\s/)){
					$_nav = 'op';
				}
				else{
					return $return;
				}

				$_ver = $match[1].split(/\./);
				$_os = '';

				if($_os = navigator.userAgent.match(/(Windows|Macintosh|Linux|iPod|FreeBSD|NetBSD|OpenBSD|SunOS|Amiga|BeOS|IRIX|OS\/2|Warp)/)){
					$_os = $_os[1].substr(0, 3).toLowerCase();
				}

				$_class = 'ua-'+ $_nav +' ua-'+ $_nav + $_ver[0].substr(0, 1) +' ua-'+ $_os; //eg. ua-ff ua-ff3 ua-mac

				window.utils.Actions.UserAgents.setOperatingSystem($_os);
				window.utils.Actions.UserAgents.setNavigator($_nav);
				window.utils.Actions.UserAgents.setVersion($_ver);
				window.utils.Actions.UserAgents.setClass($_class);
			},

			setSelector: function(value){
				return window.utils.Definitions.UserAgents['selector'] = value;
			},

			getSelector: function(){
				return window.utils.Definitions.UserAgents['selector'];
			},

			setOperatingSystem: function(value){
				window.utils.Definitions.UserAgents['operating-system'] = value;
			},

			getOperatingSystem: function(){
				return window.utils.Definitions.UserAgents['operating-system'];
			},

			setNavigator: function(value){
				window.utils.Definitions.UserAgents['navigator'] = value;
			},

			getNavigator: function(value){
				return window.utils.Definitions.UserAgents['navigator'];
			},

			setVersion: function(value){
				window.utils.Definitions.UserAgents['version'] = value;
			},

			getVersion: function(value){
				return window.utils.Definitions.UserAgents['version'];
			},

			setClass: function(value){
				window.utils.Definitions.UserAgents['class'] = value;
			},

			getClass: function(value){
				return window.utils.Definitions.UserAgents['class'];
			},

			identify: function(){
				window.utils.Views.UserAgents.identify(window.utils.Actions.UserAgents.getSelector(), window.utils.Actions.UserAgents.getClass());
			},

			init: function(){
				window.utils.Actions.UserAgents.parse();
				window.utils.Actions.UserAgents.identify();
			}
		},

		init: function(){
			window.utils.Actions.UserAgents.init();
		}
	},

	Binds: {
		init: function(){
		}
	},

	init: function(settings){
		window.utils.Definitions = $.extend(
			window.utils.Definitions,
			window.utils.Constants,
			settings
		);

		window.utils.Actions.init();
		window.utils.Binds.init();
	}
};