var verify = require('../util/verify');
var DBUtil = require('../util/DBUtil');
var mongoose = require('./connection')

var Schema = mongoose.Schema;

var commentSchema = Schema({
  blog: {type: Schema.Types.ObjectId, ref: 'Blog'},
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
    'blog': blogId,
    'comment': comment,
    'author': author
  });
  comment.save(function(error, comment){
    DBUtil.handleQueryResult(error, comment, options);
  })
};

exports.findAll = function(options){
  Comment.find().populate('blog').exec(function(error, comments){
    DBUtil.handleQueryResult(error, comments, options);
    console.log('comments-->',comments);
  });
}