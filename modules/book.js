var mongoose = require('./index');

var BookSchema = new mongoose.Schema({
	book: String,
	userid: String
}, {
	collection: 'books'
});

var bookModel = mongoose.model('Book', BookSchema);

function Book(book) {
	this.book = book.book;
	this.userid = book.userid;
};

Book.prototype.save = function(callback) {
	var book = {
		book: this.book,
		userid: this.userid
	};

	var newBook = new bookModel(book);

	newBook.save(function(err, book) {
		if(err) {
			return callback(err);
		}
		callback(null, book);
	});
};

Book.get = function(userid, callback) {
	bookModel.find({userid: userid}, function(err, book) {
		if(err) {
			return callback(err);
		}
		callback(null, book);
	});
};

Book.getOne = function(obj, callback) {
	bookModel.findOne(obj, function(err, book) {
		if(err) {
			return callback(err);
		}
		callback(null, book);
	});
};

module.exports = Book;