$(function() {
	/*slider*/
	$('[data-toggle="slider"]').on('click', function() {
		var expanded = $(this).prop('aria-expanded');
		var controls = $(this).attr('aria-controls');

		if(!expanded) {
			var $controls = $('#' + controls);
			/*$controls.show().animate({opacity: 1}, 100, function() {
				$controls.find('.dialog').animate({left: 0, right: '50px'}, 300);
			});*/
			$controls.show(0, function() {
				$(this).addClass('in');
			});

			$(this).prop('aria-expanded', true);
		}
	});
	$('#collapseSlider').on('click', function(e) {
		if($(e.target).hasClass('navbar-slider')) {
			var $this = $(this);
			/*$this.find('.dialog').animate({left: '-150%', right: '100%'}, 300, function() {
				$this.animate({opacity: 0}, function() {
					$this.hide();
				});
			});*/
			$this.removeClass('in');
			setTimeout(function() {
				$this.hide();
			}, 300);
			
			$('[aria-controls="collapseSlider"]').prop('aria-expanded', false);
		}
	});
});