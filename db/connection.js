var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{server: {poolSize: 5}});
var db = mongoose.connection;
db.on('error',function(){
  console.log('connection error');
});
db.on('open', function(){
  console.log('connection open');
})

module.exports = mongoose;