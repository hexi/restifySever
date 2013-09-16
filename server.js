var restify = require('restify');
var Blog = require('./db/Blog');
var Comment = require('./db/Comment');
var server = restify.createServer({
  name:'YtxServer'
});
server.use(restify.bodyParser());
server.post('/blog', function create(req, res, next){
  Blog.create(req.params.title, req.params.content, req.params.author, {
    success: function(blog){
      res.end("create a blog success!");
    }
  })
});

server.get('/blogs', function(req, res, next){
  Blog.findAll({
    error: function(error){
      res.end(500,error);
    },
    success:function(blogs){
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(blogs));
    }
  })
});

server.get('/blog/:id', function(req, res, next){
  Blog.findById(req.params.id, {
    error: function(error){
      res.end(500,error);
    },
    success:function(blog){
      res.json(JSON.stringify(blog));
    }
  })
});

server.put('/blog/:id', function(req, res, next){
  Blog.update(req.params.id, req.params.title, req.params.content, {
    error: function(error){
      res.end(500,error);
    },
    success:function(blog){
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(blog));
    }
  });
});
server.del('/blog/:id', function(req, res, next){
  Blog.delete(req.params.id, {
    success: function(blog){
      res.end('success to delete the blog!');
    }
  });
});
server.del('/blogs', function(req, res, next){
  Blog.deleteAll({
    error: function(error){
      res.end('delete blogs faild：' + error);
    },
    success: function(){
      res.end('delete blogs success！');
    }
  });
});

server.post('/comment/:blogId', function(req, res, next){
  Comment.create(req.params.blogId, req.params.comment, req.params.author, {
    error: function(error){
      res.end(error.msg);
    },
    success: function(comment){
      res.json(JSON.stringify(comment));
    }
  })
});

server.get('/comments', function(req, res, next){
  Comment.findAll({
    success: function(comments){
      res.json(JSON.stringify(comments));
    }
  });
});

server.del('/comments', function(req, res, next){
  Comment.deleteAll({
    error: function(error){
      res.end('delete comments faild：' + error);
    },
    success: function(){
      res.end('delete comments success！');
    }
  });
});
server.listen(8083, function(){
  console.log('%s listening at %s', server.name, server.url);
})