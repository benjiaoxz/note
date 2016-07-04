//noteForm
var noteForm = function() {
	this.dom = {
		title: $('#title'),
		book: $('#book'),
		content: $('#content')
	};
	this.data = {
		titleVal: $.trim(this.dom.title.val()),
		bookVal: $.trim(this.dom.book.val()),
		contentVal: this.dom.content.html()
	};
};

//noteForm-same
noteForm.prototype.same = function(oldNote, callback) {
	if(this.data.titleVal == oldNote.title && this.data.bookVal == oldNote.book && this.data.contentVal == oldNote.content) {
		callback(true);
	} else {
		callback(false);
	}
};

//noteForm-verify
noteForm.prototype.verify = function(callback) {
	if(this.data.titleVal == '') {
		alert('标题不能为空');
		this.dom.title.focus();
		return false;
	}

	if(this.data.bookVal == '') {
		alert('笔记本不能为空，请点击选择');
		return false;
	}

	if(this.data.contentVal == '') {
		alert('内容不能为空');
		return false;
	}

	var newNote = {
		title: this.data.titleVal,
		book: this.data.bookVal,
		content: this.data.contentVal
	}
	callback(newNote);
};

//noteForm-empty
noteForm.prototype.empty = function(callback) {
	if(this.data.titleVal == '' && this.data.bookVal == '' && this.data.contentVal == '') {
		return callback(true);
	}

	callback(false);
};


//noteForm-confirm
noteForm.confirm = function(info, sucUrl) {
	if(confirm(info)) {
		window.location.href = sucUrl;
	}
};

$(function() {
	/*slider*/
	$('[data-toggle="slider"]').on('click', function() {
		var expanded = $(this).prop('aria-expanded');
		var controls = $(this).attr('aria-controls');

		if(!expanded) {
			var $controls = $('#' + controls);
			$controls.show(0, function() {
				$(this).addClass('in').removeClass('fade');
			});

			$(this).prop('aria-expanded', true);
		}
	});
	$('#collapseSlider').on('click', function(e) {
		if($(e.target).hasClass('navbar-slider')) {
			var $this = $(this);
			$this.addClass('fade').removeClass('in');
			setTimeout(function() {
				$this.hide();
			}, 300);
			
			$('[aria-controls="collapseSlider"]').prop('aria-expanded', false);
		}
	});
});