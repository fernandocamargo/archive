(function () {
	define(function () {
		var viewport = document.getElementsByClassName('viewport').item(0);
		var company = viewport.getElementsByClassName('company').item(0);
		var media = company.getElementsByClassName('media').item(0);
		var container = {
			media: media.getElementsByClassName('quote').item(0)
		};
		var items = {
			media: container.media.getElementsByClassName('item')
		};
		var controls = {
			media: container.media.getElementsByClassName('anchor')
		};
		return {
			slider: {
				container: container.media,
				items: items.media,
				controls: controls.media
			}
		};
	});
}.call(this));