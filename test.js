var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });

var kittySchema = mongoose.Schema({
    name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})

