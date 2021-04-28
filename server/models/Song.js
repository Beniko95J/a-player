const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: {type: mongoose.SchemaTypes.Number},
  name: {type: String},
  singer: {type: String},
  album: {type: String},
  imageId: {type: mongoose.SchemaTypes.Number},
  duration: {type: mongoose.SchemaTypes.Number},
  url: {type: String}
})

module.exports = mongoose.model('Song', schema);
