var instagram = require('instagram-node').instagram();

var instagramApi = function(app, db) {
  var config = app.config;
  console.log('included instagram api');
  
  console.log(config.instagramClientId)
  instagram.use({
    client_id: config.instagramClientId,
    client_secret: config.instagramClientSecret
  });
  
  var host = req.headers.host;
  var redirect_uri = host + "/api/instagram/handleauth";
  
  app.get('/api/instagram/auth', function(req, res, next) {
    res.redirect(instagram.get_authorization_url(redirect_uri, { 
      scope: ['likes', 'comments', 'relationships'], state: 'state'}
    ));
  });
  
  app.get('/api/instagram/handleauth', function(req, res, next) {
    instagram.authorize_user(req.query.code, redirect_uri, function(err, result) {
      if (err) {
        console.log(err.body);
        res.send("failed");
      } else {
        console.log('Yay! Access token is ' + result.access_token);
        res.send('You made it!');
      }
    })
  });
  
}

module.exports = instagramApi;