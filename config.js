var app = require('./server');

module.exports = function(app){
  switch(app.get('env')){
    case 'development':
      var constants = require('constants');
      return {
        'filesPath': '/files/',
        'mongodb': 'mongodb://localhost:27017/node-blog',
        'instagramClientId': constants.INSTAGRAM_CLIENT_ID,
        'instagramClientSecret': constants.INSTAGRAM_CLIENT_SECRET
      };

    case 'production':
      return {
        'filesPath': 'genejaelee-assets.s3-website-us-west-1.amazonaws.com/files/',
        'mongodb': process.env.MONGOLAB_URI,
        'instagramClientId': process.env.INSTAGRAM_CLIENT_ID,
        'instagramClientSecret': process.env.INSTAGRAM_CLIENT_SECRET
      };

    default:
      return {
        
      };
  }
};