var user = require('./user');
var book = require('./book');
var note = require('./note');

module.exports = function(app) {
	app.get('/', function(req, res) {
		var Book = require('../modules/book');
		var Note = require('../modules/note');

		if(req.session.user) {
			var user = req.session.user;
			var userid = req.session.user._id;
			var notes = [];
			Book.get(userid, function(err, book) {
				if(err) {
					req.flash('error', err);
				} else {
					if(book.length == 0) {
						req.flash('error', '没有查找到相关笔记');
						renderNow(user, notes);
					} else {
						var len = book.length;
						var count = 0;
						book.forEach(function(books) {
							var bookarr = [];
							bookarr.push(books);

							var bookid = books._id;
							Note.get(bookid, function(err, note) {
								if(err) {
									req.flash('error', err);
								} else {
									bookarr.push(note);
									notes.push(bookarr);
								}
								count++;
								if(count == len) {
									renderNow(user, notes);
								}
							});
						});
					}
				}
			});
		} else {
			var user = null;
			var notes = null;
			renderNow(user, notes);
		}
		
		function renderNow(user, notes) {
			res.render('index', {
				user: user,
				notes: notes,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		}
	});

	app.get('/user', checkLogin);
	app.get('/user', user.showUser);	//进入个人中心

	app.get('/reg', checkNotLogin);
	app.get('/reg', user.showReg);		//进入注册页

	app.post('/reg', checkNotLogin);
	app.post('/reg', user.reg);			//提交注册信息

	app.get('/login', checkNotLogin);
	app.get('/login', user.showLogin);	//进入登录页

	app.post('/login', checkNotLogin);
	app.post('/login', user.login);		//提交登录信息

	app.get('/logout', checkLogin);
	app.get('/logout', user.logout);	//退出登录

	app.get('/book', checkLogin);
	app.get('/book', book.showBook);	//进入笔记本页

	app.post('/book', checkLogin);
	app.post('/book', book.book);		//笔记本操作

	app.get('/list', checkLogin);
	app.get('/list', book.showList);	//进入笔记本详情页

	app.get('/post', checkLogin);
	app.get('/post', note.showAddNote);	//新增笔记

	app.post('/post', checkLogin);
	app.post('/post', note.addNote);	//提交新增笔记信息

	app.get('/edit', checkLogin);
	app.get('/edit', note.showEditNote);	//进入编辑笔记页

	app.post('/edit', checkLogin);
	app.post('/edit', note.editNote);	//更新笔记

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
