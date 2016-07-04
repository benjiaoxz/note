var mongoose = require('./index');
var moment = require('moment');

var NoteSchema = new mongoose.Schema({
	title: String,
	content: String,
	updated: String,
	bookid: String
}, {
	collection: 'notes'
});

var noteModel = mongoose.model('Note', NoteSchema);

function Note(note) {
	this.bookid = note.bookid;
	this.title = note.title;
	this.content = note.content;
};

Note.prototype.save = function(callback) {
	var note = {
		bookid: this.bookid,
		title: this.title,
		content: this.content,
		updated: moment().format('YYYY-MM-DD HH:mm')
	};

	var newNote = new noteModel(note);

	newNote.save(function(err, note) {
		if(err) {
			return callback(err);
		}
		callback(null, note);
	});
};

Note.getOne = function(_id, callback) {
	noteModel.findOne({_id: _id}, function(err, note) {
		if(err) {
			return callback(err);
		}
		callback(null, note);
	});
};

Note.get = function(bookid, callback) {
	noteModel.find({bookid: bookid}, function(err, note) {
		if(err) {
			return callback(err);
		}
		callback(null, note);
	});
};

Note.update = function(noteid, newNote, callback) {
	noteModel.findById(noteid, function(err, person){
		if(err) {
			return callback(err);
		}
		
		var _id = person._id;
		delete person._id;
		newNote.updated = moment().format('YYYY-MM-DD HH:mm');
		person = newNote;
		noteModel.update({_id: _id}, person, function(err){
			if(err) {
				return callback(err);
			}
			callback(null);
		});
    });
};

module.exports = Note;