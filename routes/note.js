var Book = require('../modules/book');
var Note = require('../modules/note');

exports.showAddNote = function(req, res, next) {
	var _id = req.session.user._id;

	Book.get(_id, function(err, book) {
		if(err) {
			req.flash('error', '获取book出错');
		}

		res.render('post', {
			book: book,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
};

exports.addNote = function(req, res, next) {
	var newNote = {
		title: req.body.title,
		bookid: req.body.book,
		content: req.body.content
	};

	Book.getOne({book: newNote.bookid}, function(err, book) {
		if(err) {
			var data = {
				status: 0,
				err: 'mongodb is error'
			};
			res.send(data);
			return false;
		} else {
			newNote.bookid = book._id;

			new Note(newNote).save(function(err, note) {
				if(err) {
					var data = {
						status: 0,
						err: 'mongodb is error'
					};
					res.send(data);
					return false;
				}

				var data = {
					status: 1,
					content: '添加成功'
				}

				res.send(data);
			});
		}
	});
};

exports.showEditNote = function(req, res, next) {
	var noteid = req.query.noteid;
	var _id = req.session.user._id;

	Book.get(_id, function(err, books) {
		if(err) {
			req.flash('error', '获取books出错');
		}

		Note.getOne(noteid, function(err, notes) {
			if(err) {
				req.flash('error', '获取note出错');
			}

			Book.getOne({_id: notes.bookid}, function(err, book) {
				if(err) {
					req.flash('error', '获取book出错');
				}

				notes = JSON.parse(JSON.stringify(notes));
				notes.book = book.book;

				var oldNote = {
					book: notes.book,
					title: notes.title,
					content: notes.content
				};

				res.render('edit', {
					books: books,
					notes: notes,
					oldNote: oldNote,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});
			});
		});
	});
};

exports.editNote = function(req, res, next) {
	var newNote = {
		title: req.body.title,
		book: req.body.book,
		content: req.body.content
	};

	Book.getOne({book: newNote.book}, function(err, book) {
		if(err) {
			var data = {
				status: 0,
				err: 'mongodb is error'
			};
			res.send(data);
			return false;
		}
		newNote.bookid = book._id;

		var noteid = req.body.noteid;
		Note.update(noteid, newNote, function(err) {
			if(err) {
				var data = {
					status: 0,
					err: 'mongodb is error'
				};
				res.send(data);
				return false;
			}

			var data = {
				status: 1,
				content: '修改成功'
			}

			res.send(data);
		});
	});
};