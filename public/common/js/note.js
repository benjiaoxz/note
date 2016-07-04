$(function() {

	//href
	$('[data-href]').on('click', function() {
		var url = $(this).data('href');
		window.location.href = url;
	});

});