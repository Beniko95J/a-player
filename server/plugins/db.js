module.exports = app => {
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/vueplayer', {
    useUnifiedTopology: true ,
    useNewUrlParser: true,
    useFindAndModify: false
  });
}
