var restify = require('restify');
var Blog = require('./db/Blog');
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

server.post('/comment/:blogId', function(req, res, next){
  Blog.addComment(req.params.blogId, req.params.comment, req.params.author, {
    success: function(blog){
      console.log(blog);
      res.json(JSON.stringify(blog));
    }
  })
});
server.listen(8083, function(){
  console.log('%s listening at %s', server.name, server.url);
})