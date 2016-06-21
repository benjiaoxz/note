var crypto = require('crypto');
var User = require('../modules/user');
var Book = require('../modules/book');
var Note = require('../modules/note');

var moment = require('moment');

module.exports = function(app) {
	app.get('/', function(req, res) {
		var userid = req.session.user._id;
		var notes = [];
		Book.get(userid, function(err, book) {
			if(err) {
				req.flash('error', err);
			} else {
				if(!book) {
					req.flash('error', '没有查找到相关笔记');
				} else {
					var len = book.length;
					var count = 0;
					book.forEach(function(books) {
						var bookid = books._id;
						Note.get(bookid, function(err, note) {
							if(err) {
								req.flash('error', err);
							} else {
								notes.push(note);
							}
							count++;
							if(count == len) {
								renderNow(notes);
							}
						});
					});
				}
			}
		});

		function renderNow(notes) {
			res.render('index', {
				user: req.session.user,
				notes: notes,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		}
	});

	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res) {
		res.render('register');
	});

	app.post('/reg', checkNotLogin);
	app.post('/reg', function(req, res) {
		var username = req.body.username;
		var password = req.body.password;

		var newUser = {username: username, password: password};

		User.get(newUser.username, function(err, user) {
			if(err) {
				var data = {
					status: 0,
					err: 'mongodb is error'
				};
				res.send(data);
			} else {
				if(user) {
					var data = {
						status: 1,
						err: '用户名已存在'
					};
					res.send(data);
				} else {
					var md5 = crypto.createHash('md5');
					newUser.password = md5.update(newUser.password).digest('hex');
					new User(newUser).save(function(err, user) {
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
							content: '注册成功'
						}

						req.session.user = user;
						res.send(data);
					});
				}
			}
		});
	});

	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res) {
		res.render('login', {
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
		var username = req.body.username;
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('hex');

		User.get(username, function(err, user) {
			if(err) {
				var data = {
					status: 0,
					err: 'mongodb is error'
				};
				res.send(data);
			} else {
				if(!user) {
					var data = {
						status: 1,
						err: '用户名不存在'
					};
					res.send(data);
				} else if(user.password != password) {
					var data = {
						status: 2,
						err: '密码错误'
					};
					res.send(data);
				} else {
					var data = {
						status: 3,
						content: '登录成功'
					};
					req.session.user = user;
					res.send(data);
				}
			}
		});
	});

	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash('success', '登出成功！');
		res.redirect('/');
	});

	app.post('/book', checkLogin);
	app.post('/book', function(req, res) {
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
	});

	app.get('/post', checkLogin);
	app.get('/post', function(req, res) {
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
	});

	app.post('/post', checkLogin);
	app.post('/post', function(req, res) {
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
	});

	function checkLogin(req, res, next) {
		if(!req.session.user) {
			req.flash('error', '未登录');
			res.redirect('/login');
		}

		next();
	}

	function checkNotLogin(req, res, next) {
		if(req.session.user) {
			req.flash('error', '已登录');
			res.redirect('back');
		}

		next();
	}
};
