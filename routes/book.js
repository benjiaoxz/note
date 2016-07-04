var Book = require('../modules/book');
var Note = require('../modules/note');

exports.showBook = function(req, res, next) {
	var user = req.session.user;
	var userid = req.session.user._id;
	Book.get(userid, function(err, book) {
		if(err) {
			req.flash('error', err);
		}

		if(book.length == 0) {
			req.flash('error', '没有查找到相关笔记本');
			renderNow(user, []);
		} else {
			var len = book.length;
			var count = 0;

			var arr = JSON.parse(JSON.stringify(book));
			arr.forEach(function(arg) {
				Note.get(arg._id, function(err, note) {
					if(err) {
						req.flash('error', 'mongodb is error');
					}
					
					arg.noteLength = note.length;
					count++;
					if(count == len) {
						renderNow(user, arr);
					}
				});
			});
		}
	});

	function renderNow(user, books) {
		res.render('book', {
			user: user,
			books: books,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	}
};

exports.book = function(req, res, next) {
	var book = req.body.book;
	var newBook = {
		book: book
	}

	Book.getOne(newBook, function(err, book) {
		if(err) {
			var data = {
				status: 0,
				err: 'mongodb is error'
			};
			res.send(data);
		} else {
			if(book) {
				var data = {
					status: 1,
					err: '笔记本名已存在'
				};
				res.send(data);
			} else {
				var userid = req.session.user._id;
				newBook.userid = userid;
				new Book(newBook).save(function(err, book) {
					if(err) {
						var data = {
							status: 0,
							err: 'mongodb is error'
						};
						res.send(data);
						return false;
					}

					var data = {
						status: 2,
						content: '添加成功',
						data: book
					}

					res.send(data);
				});
			}
		}
	});
};

 exports.showList = function(req, res, next) {
	var books = {
		book: req.query.book,
		noteLength: req.query.noteLength
	};
	var bookid = req.query.bookid;

	Note.get(bookid, function(err, notes) {
		if(err) {
			req.flash('error', err);
		}

		res.render('list', {
			books: books,
			notes: notes,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
};