var verify = require('../util/verify');
var DBUtil = require('../util/DBUtil');
var mongoose = require('./connection');
var Blog = require('./Blog');

var Schema = mongoose.Schema;

var commentSchema = Schema({
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
    'comment': comment,
    'author': author
  });
  comment.save(function(error, comment){
    Blog.model.update({_id: blogId}, { $push: { comments: comment } }, function(error, number){
        if(number == 0){
          comment.remove(function(error){
            if(!error){
              options.error({msg: 'create comment fail: the speciall blog not exists'})
            }
          });
        }else{
          DBUtil.handleQueryResult(error, comment, options);
        }
    });
  })
};

exports.findAll = function(options){
  Comment.find().exec(function(error, comments){
    DBUtil.handleQueryResult(error, comments, options);
    console.log('comments-->',comments);
  });
}

exports.deleteAll = function(options){
  Comment.remove({}, function(error){
    DBUtil.handleQueryResult(error, null, options);
  });
}