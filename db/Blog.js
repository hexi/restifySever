var verify = require('../util/verify');
var DBUtil = require('../util/DBUtil');
var mongoose = require('./connection')

var Schema = mongoose.Schema;

var blogSchema = Schema({
  title: String,
  content: String,
  author: String,
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  createTime: {type: Date, default: Date.now}
});

blogSchema.pre('remove', function(next){
  console.log('before remove blog');
  console.log(this.id);
  console.log(this.comments);
  next();
});
blogSchema.post('remove', function (doc) {
  console.log('remove blog');
  console.log('%s has been removed', doc._id);
});
var Blog = mongoose.model('Blog', blogSchema);

exports.create = function(title, content, author, options){
  verify.isNotBlank([
    {'content':title, 'message':'title is empty!'},
    {'content':content, 'message':'content is empty!'},
    {'content':author, 'message':'author is empty!'}
  ]);
  var blog = new Blog(
    {
      'title': title,
      'content': content,
      'author': author
    }
  )
  blog.save(function(error,blog){
    DBUtil.handleQueryResult(error, blog, options);
  })
};

exports.findAll = function(options){
  Blog.find().populate('comments').exec(function(error, blogs){
    DBUtil.handleQueryResult(error, blogs, options);
  });
};

exports.update = function(id, title, content, options){
  verify.isNotBlank([{'content': id, 'message': 'id is empty!'}]);
  var updateObj ={};
  if(title && title !== ''){
    updateObj.title = title;
  }
  if(content && content !== ''){
    updateObj.content = content;
  }
  console.log('updateObj--->', updateObj);
  Blog.findByIdAndUpdate(id, updateObj, function(error, blog){
    DBUtil.handleQueryResult(error, blog, options);
  })
};

exports.delete = function(id, options){
  verify.isNotBlank([{'content': id, 'message': 'id is empty!'}]);
  Blog.findByIdAndRemove(id, function(error, blog){
    DBUtil.handleQueryResult(error, blog, options);
  });
};

exports.findById = function(id, options){
  verify.isNotBlank([{'content': id, 'message': 'id is empty!'}]);
  Blog.findById(id).populate('comments').exec(function(error, blog){
    DBUtil.handleQueryResult(error, blog, options);
  });
};

exports.deleteAll = function(options){
  Blog.remove({}, function(error){
    DBUtil.handleQueryResult(error, null, options);
  });
}

exports.model = Blog;