var verify = require('../util/verify');
var DBUtil = require('../util/DBUtil');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error',function(){
  console.log('connection error');
});
db.on('open', function(){
  console.log('connection open');
})

var commentSchema = mongoose.Schema({
  blogId: String,
  comment: String,
  author: String,
  createTime: {type: Date, default: Date.now}
});
var Comment = mongoose.model('Comment', commentSchema);

exports.create = function(blogId, comment, author, options){
  verify.isNotBlank([
    {'content': blogId, 'message': 'blogId is empty'},
    {'content': comment, 'message': 'comment is empty'},
    {'content': author, 'message': 'author is empty'}
  ]);
  var comment = new Comment({
    'blogId': blogId,
    'comment': comment,
    'author': author
  });
  comment.save(function(error, comment){
    DBUtil.handleQueryResult(error, comment, options);
  })
}