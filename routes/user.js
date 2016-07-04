var crypto = require('crypto');
var User = require('../modules/user');

exports.showUser = function(req, res, next) {
	var user = {
		username: req.query.username
	};
	res.render('user', {
		user: user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
};

exports.showReg = function(req, res, next) {
	res.render('register',{
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
};

exports.reg = function(req, res, next) {
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
};

exports.showLogin = function(req, res, next) {
	res.render('login', {
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
};

exports.login = function(req, res) {
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
};

exports.logout = function(req, res, next) {
	req.session.user = null;
	req.flash('success', '登出成功！');
	res.redirect('/');
};