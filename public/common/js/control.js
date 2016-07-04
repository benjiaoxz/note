$(function() {

	//show-tool
	$('.navbar-options').on('click', function() {
		$('.control').show(0, function() {
			$(this).addClass('in').removeClass('fade');
		});
	});

	//hide-tool
	$('.control').on('click', function(e) {
		if($(e.target).hasClass('control')) {
			var $this = $(this);
			$this.addClass('fade').removeClass('in');
			setTimeout(function() {
				$this.hide();
			}, 300);
		}
	});

	//select
	$('#select').on('click', function() {
		$('.notes .item').addClass('sel').data('toggle', false);
		$('.control').click();

		var count = 0;
		var oldOperateHtml = $('.navbar-right').html();
		var OperateHtml = '<div class="navbar-tool operate">' +
			'<span class="btn confirm">删除(' + count + ')</span>' +
			'<span class="btn cancel">取消</span>' +
          '</div>';
		$('.navbar-right').html(OperateHtml);

		//confirm
		$('.navbar-right .confirm').on('click', function() {
			//TO DO
		});

		//cancel
		$('.navbar-right .cancel').on('click', function() {
			$('.navbar-right').html(oldOperateHtml);
			$('.notes .item').removeClass('sel active').data('toggle', false);
		});
		
		//select-toggle
		$('.sel').on('click', function() {
			if(!$(this).data('toggle')) {
				$(this).addClass('active').data('toggle', true);
				count++;
			} else {
				$(this).removeClass('active').data('toggle', false);
				count--;
			}		
		});
	});

	

});