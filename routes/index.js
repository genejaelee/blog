var fs = require('fs');
var zlib = require('zlib');

var routes = function(app, db){
  // init APIs
  var awsApi = require('./api/aws')(app, db);
  
  app.get('/instagram', function(req, res, next) {
    console.log('ROUTING TO instagram page');
    res.render('./instagram/show.jade');
  });
  
  app.get('/posts/new', function(req, res, next) {
    console.log('ROUTING TO posts/new');
    console.log(req.url);
    req.collection = db.collection('posts');
  	res.render('./posts/new.jade', {
  		title: "New Post"
  	});
    console.log('about to include uploader js');
    app.uploader.initUploader(app);
  });
  
  app.post('/posts/create', function(req, res, next) {
    postsCollection = db.collection('posts');
    imagesCollection = db.collection('images');
    
    // init POST JSON
    var post = {
      'title': req.body.title,
      'body': req.body.body,
      'images': {
        "$ref": "images", // set mongodb collection
        "$id": "" // set ID after we create image doc
      },
      'created_at': Date.now()
    }
    
    // make array of images
    function getArrayOfImagesForPostWithId(files, post_id, callback) {
      var imagesArray = [];
      if (Array.isArray(files)) {
        for (i = 0; i < files.length; i++) {
          console.log('evaluating for loops')
          var image = {
            'post_id': post_id,
            'name': files[i].name,
            'filepath': files[i].path,
            'created_at': Date.now()
          }
          console.log('pushed image ' + image);
          imagesArray.push(image);
          if (i == (files.length - 1)) {
            callback(imagesArray);
          }
        }
      } else {
        callback({
            'post_id': post_id,
            'name': files.name,
            'filepath': files.path,
            'created_at': Date.now()
          });
      }
    }
    
    // POST image with post ID
    function postImagesForPostWithId(id, callback) {
      console.log('posting images ' + JSON.stringify(req.files.images));
      getArrayOfImagesForPostWithId(req.files.images, id, function(images){
        // now post to DB
        console.log('inserting image..');
        imagesCollection.insert(images, {}, function(err, results) {
          console.log('result of image insert: ' + JSON.stringify(results));
          callback(results);
        });
      });
    }
    
    // update 'one' to have ref of 'many' object
    function updateRefIdsOfParent(parentId, children, callback) {
      console.log('updating ref ids of parent with id ' 
        + parentId + 'for children ' + JSON.stringify(children));
      var childIds = [];
      for (i = 0; i < children.length; i++) {
        var child = children[i];
        childIds.push(child._id);
      };
      console.log('about to update..');
      postsCollection.update(
        { _id: parentId },
        { 
          $set: {
            'images': {
              '$ref': 'images',
              '$id': childIds
            }
          }
        }, function(err, results) {
          console.log('callback');
          if (err) console.log(err);
          callback();
        }
      );
    }
    
    // show page after post
    function showPageForPostWithId(id, images, callback) {
      console.log('showing page');
    	postsCollection.findById(id, function(err, result){
    		if(err) return next(err);
    		else {
    			res.render('./posts/show.jade', {
    				'post': result,
            'images': images
    			});
          callback();
    		}
    	});
    }
    
    // POST post and return ID
    var postId = '';
  	postsCollection.insert(post, {}, function(err, results) {
  		if (err) return next(err);
      else {
        postId = results[0]._id;
        console.log("POST ID IS : " + postId);
        postImagesForPostWithId(postId, function(images){
          console.log("callback images " + JSON.stringify(images));
          updateRefIdsOfParent(postId, images, function(){
            showPageForPostWithId(postId, images, function(){
              console.log('done');
            });
          });
        });
      }
  	});
    
    //end
  });
  
  app.post('/posts/save_image', function(req, res) {
    console.log('saving image :');
    console.log(JSON.stringify(req.body));
    
    /*
    var fstream;
    req.pipe(req.busboy);
    console.log('about to call event handler');
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log('Uploading: ' + filename);
      fstream = fs.createWriteStream('/public/files/' + filename);
      file.pipe(fstream);
      fstream.on('close', function() {
        res.redirect('back');
      });
    }); */
  });
  
  app.get('/posts/:id', function(req, res, next) {
  	db.collection('posts').findById(req.params.id, function(err, results){
      getImagesForPost(results, function(imagesArray){
    		res.render('./posts/show.jade', {
    			'title': results.title,
    			'post': results,
          'images': imagesArray,
          'imageJSON': JSON.stringify(imagesArray)
    		});
      });
  	});
  });

  app.put('/posts/:id', function(req, res, next) {
    req.collection = db.collection('posts');
  	req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false},
  	function(err, result){
  		if(err) return next(err);
  		res.send((result===1)?{msg:'success'}:{msg:'error'});
  	});
  });

  app.delete('/posts/:id', function(req, res, next) {
    req.collection = db.collection('posts');
  	req.collection.remove({_id: req.collection.id(req.params.id)}, function(err, result){
  		if(err) return next(err);
  		res.send((result===1)?{msg:'success'}:{msg:'error'});
  	});
  });

  app.get('/posts', function(req, res, next) {
    console.log('ROUTING TO ')
    req.collection = db.collection('posts');
  	req.collection.find({}, {limit: 10, sort: [['_id', -1]]}).toArray(function(err, results){
  		if (err) return next(err);
  		res.send(results);
  	});
  });
  
  app.get('/', function(req, res) {
    console.log('getting home page');
  	db.collection('posts').find().toArray(function(err, results){
      // could potentially run this alongside res.render, 
      // and async GET the images after page loads.
      // 2 way binding update
      if (results.length > 0) {
        getImagesForPosts(results, function(imagesArray){
          console.log('callback with image array');
      		res.render('./index.jade', {
      			title: "Video and Image Processing",
      			'posts': results,
            'images': imagesArray
      		});
        });
      } else {
        res.send('emptiness...');
      }
  	});
  });
  ///////////////////////////////////
  //////////// FUNCTIONS ////////////
  ///////////////////////////////////
  function getImagesByIds(refIds, imagesArray, callback){
    var images = [];
    if (refIds.length === 0) {
      console.log('refids are undefined');
      imagesArray.push([{
        "filepath": "/images/default.png",
        "name": "default.png"
    }]);
      callback(imagesArray);
    } else {
      
      for(j = 0; j < refIds.length; j++) {
      
        (function(j) {
          db.collection('images').findById(refIds[j], function(err, result) {
            console.log('contacted db');
            images.push(result);
            console.log("j is " + j);
            console.log("refIDs length is " + refIds.length);
            if (j == (refIds.length - 1)) {
              imagesArray.push(images);
              console.log('calling backkk');
              callback(imagesArray);
            }
          });
        })(j);
      
      }
    }
  }
  
  function getImagesForPost(post, callback){
    var imagesArray = [];
    var refIds = post.images.oid; //array of image ids
    // get image and callback once done with array
    getImagesByIds(refIds, imagesArray, function(imagesArray){
      // images array done
      callback(imagesArray);
    });
  }
  
  function getImagesForPosts(posts, callback){
    console.log('getting images');
    var imagesArray = [];
    for(i = 0; i < posts.length; i++) {
      var refIds = posts[i].images.oid; //array of image ids
      // get image and callback once done with array
      getImagesByIds(refIds, imagesArray, function(imagesArray){
        console.log('imagesarray length is ' + imagesArray.length);
        console.log('imagesarray contents are ' + JSON.stringify(imagesArray));
        console.log('posts length is ' + posts.length);
        if (imagesArray.length == posts.length) {
          // images array done
          console.log("images array done");
          callback(imagesArray);
        }
      });
    }
  }
}

module.exports = routes;