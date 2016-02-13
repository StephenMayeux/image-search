var mongoose = require('mongoose');

//schema
var ImageSchema = mongoose.Schema({
  term: String,
  when: String
});

var Image = module.exports = mongoose.model('Image', ImageSchema);

module.exports.saveImage = function(newImage, callback) {
  newImage.save(callback);
};

module.exports.findAll = function(query, callback) {
  Image.find(query, callback);
};
