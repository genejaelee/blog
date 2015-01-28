var ig = require('instagram-node').instagram();
var fs = require('fs');
var request = require('request');
var AWS = require('aws-sdk');

var instagramApi = function(app, db) {
  var config = app.config;
  
  // CONFIG S3
  AWS.config.update({
    "accessKeyId": config.awsAccessKeyId,
    "secretAccessKey": config.awsSecretAccessKey
  });
  var s3 = new AWS.S3();
  var bucketName = 'genejaelee-assets';

  // CONFIG INSTAGRAM
  var igCreds = function(added_token){
    return {
      client_id: config.instagramClientId,
      client_secret: config.instagramClientSecret,
      access_token: added_token
    }
  }
  ig.use(igCreds());
  var redirect_uri = "http://lvh.me:3000/api/instagram/handleauth"; 
  
  // ROUTES
  app.get('/instagram', function(req, res, next) {
    // check if signed in
    if (req.param("signin")) { var notification = "Successfully signed in." };
    res.render('./instagram/show.jade', {
      'title': "Instagram Page",
      'notification': notification,
      'images': []
    });
  });
  
  app.get('/api/instagram/auth', function(req, res, next) {
    res.redirect(ig.get_authorization_url(redirect_uri, { 
      scope: ['likes', 'comments', 'relationships'], state: 'state'}
    ));
  });
  
  app.get('/api/instagram/handleauth', function(req, res, next) {
    ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
      ig.use(igCreds(result.access_token));
      // AUTHORIZE USER
      if (err) { res.send("failed") }
      else {
        // GET MEDIA
        ig.user_self_media_recent({count:10}, function(err, medias, pagination, remaining, limit) {
          console.log('getting media');
          if (err) { res.send(err) }
          else {
            // REDIRECT AND PASS IMAGE LINKS
            var urlArray = [];
            getUrls(urlArray, medias, function(array){
              urlArray = array;
              res.render('instagram/show.jade', {
                'images': array
              });
            });
            
            /*
            // CHECK IF BUCKET EXISTS AND POST
            s3.headBucket({ 'Bucket': bucketName }, function(err, data) {
              console.log('posting to s3');
              if (err) {
                console.log(err);
                s3.createBucket({ 'Bucket': bucketName });
              }
              else {
                // LOOP THROUGH AND UPLOAD MEDIAS
                console.log('looping through media');
                for (i = 0; i < medias.length; i++) {
                  var media = medias[i]
                  var filepath = media.id + ".jpg"
                  console.log(media.images);
                  // DOWNLOAD AND WRITE THIS FILE
                  download(media.images.standard_resolution.url, filepath, function(err){
                    if (err) console.log(err);
                    else {
                      // BUFFER FILE
                      fs.readFile(filepath, function(err, buffer) {
                        var params = {
                          Bucket: bucketName,
                          Key: "instagram/" + media.id,
                          Body: buffer,
                        };
                        // UPLOAD STREAM
                        s3.upload(params, function(s3err, results){
                          if (s3err) res.send(s3err);
                          else {
                            console.log(results);
                            fs.unlink(filepath, function(){
                              console.log('file deleted');
                            });
                          }
                        });
                      });
                    }
                  });
                }
              }
            });
            */
            var igCollection = db.collection('instagram');
          }
        });
        
      }
    });
  });
  
  // FUNCTIONS
  function getUrls(array, medias, callback) {
    for (i = 0; i < medias.length; i++) {
      var media = medias[i];
      var url = media.images.standard_resolution.url;
      array.push(url);
      if (i == (medias.length - 1)) {
        callback(array);
      }
    }
  }
}

module.exports = instagramApi;