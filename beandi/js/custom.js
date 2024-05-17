$(document).bind('ready', function(){
	if(window.utils) window.utils.init();
	if(window.landing) window.landing.init();
	if(window.slider) window.slider.init({
		'items': [
			{
				'name': 'highlights',
				'selector': 'div#highlights',
				'data': function(){
					var $return = [];
					var items = $('div#highlights:eq(0) div.index:eq(0)').find('dl');
					if(items && items.length){
						for(var i = 0; i < items.length; i++){
							var temp = {};
							var $this = $(items[i]);

							//index
							temp['index'] = i.toString();

							//image
							var image = $this.find('dt.image:eq(0) img:eq(0)');
							temp['image_src'] = image.attr('src') || '';
							temp['image_height'] = image.attr('height') || '';
							temp['image_width'] = image.attr('width') || '';

							$return.push(temp);
							if((i + 1) == items.length){
								$this.parent().remove();
							}
							else{
								$this.remove();
							}
						}
					}
					return $return;
				}
			}
		]
	});

	document.title = $('body').attr('class') +' | '+ document.title;
});