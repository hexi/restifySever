var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error',function(){
  console.log('connection error');
});
db.on('open', function(){
  console.log('connection open');
})

var blogSchema = mongoose.Schema({
  title: String,
  content: String,
  author: String,
  comments: [{comment: String, author:String, date: Date}],
  createTime: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

exports.create = function(title, content, author, options){
  isNotBlank([
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
    handleQueryResult(error, blog, options);
  })
};

exports.findAll = function(options){
  Blog.find(function(error, blogs){
    handleQueryResult(error, blogs, options);
  });
};

exports.update = function(id, title, content, options){
  isNotBlank([{'content': id, 'message': 'id is empty!'}]);
  var updateObj ={};
  if(title && title !== ''){
    updateObj.title = title;
  }
  if(content && content !== ''){
    updateObj.content = content;
  }
  console.log('updateObj--->', updateObj);
  Blog.findByIdAndUpdate(id, updateObj, function(error, blog){
    handleQueryResult(error, blog, options);
  })
};

exports.delete = function(id, options){
  isNotBlank([{'content': id, 'message': 'id is empty!'}]);
  Blog.findByIdAndRemove(id, function(error, blog){
    handleQueryResult(error, blog, options);
  });
};

function isNotBlank(holder){
  var _temp;
  for (var i in holder) {
    _temp = holder[i];
    if(!_temp.content || _temp.content === ''){
      throw Error(_temp.message);
    }
  };
}

function handleQueryResult(error, result, options){
  if(error){
    console.log(error);
    if(options.error){
      options.error(error);
    }
  }else{
    options.success(result);
  }
}

exports.addComment = function(blogId, comment, author, options){
  isNotBlank([
    {'content': blogId, 'message': 'blogId is empty'},
    {'content': comment, 'message': 'comment is empty'},
    {'content': author, 'message': 'author is empty'}
  ]);
  var comment = {'comment': comment, 'author': author};
  Blog.update({_id: blogId}, { $push: { comments: comment } }, function(error, number){
    handleQueryResult(error, number, options);
  });
}