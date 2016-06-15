var settings = require('../settings');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://' + settings.host + ':' + settings.port + '/' + settings.db);

module.exports = db;