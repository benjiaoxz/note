var mongoose = require('./index');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
}, {
	collection: 'users'
});

var userModel = mongoose.model('User', UserSchema);

function User(user) {
	this.username = user.username;
	this.password = user.password;
};

User.prototype.save = function(callback) {
	var user = {
		username: this.username,
		password: this.password
	};

	var newUser = new userModel(user);

	newUser.save(function(err, user) {
		if(err) {
			return callback(err);
		}
		callback(null, user);
	});
};

User.get = function(username, callback) {
	userModel.findOne({username: username}, function(err, user) {
		if(err) {
			return callback(err);
		}
		callback(null, user);
	});
};

module.exports = User;