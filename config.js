var constants = require('./constants');

var config = function(app){
  switch(app.get('env')){
    case 'development':
      return {
        'filesPath': '/files/',
        'mongodb': 'mongodb://localhost:27017/node-blog',
        'instagramClientId': constants.INSTAGRAM_CLIENT_ID,
        'instagramClientSecret': constants.INSTAGRAM_CLIENT_SECRET,
        'instagramRedirectURI': constants.INSTAGRAM_REDIRECT_URI,
        'awsAccessKeyId': constants.AWS_ACCESS_KEY_ID,
        'awsSecretAccessKey': constants.AWS_SECRET_ACCESS_KEY,
        's3BucketName': constants.S3_BUCKET_NAME
      };

    case 'production':
      return {
        'filesPath': 'genejaelee-assets.s3-website-us-west-1.amazonaws.com/files/',
        'mongodb': process.env.MONGOLAB_URI,
        'instagramClientId': process.env.INSTAGRAM_CLIENT_ID,
        'instagramClientSecret': process.env.INSTAGRAM_CLIENT_SECRET,
        'instagramRedirectURI': process.env.INSTAGRAM_REDIRECT_URI,
        'awsAccessKeyId': process.env.AWS_ACCESS_KEY_ID,
        'awsSecretAccessKey': process.env.AWS_SECRET_ACCESS_KEY,
        's3BucketName': process.env.S3_BUCKET_NAME
      };

    default:
      return {
        
      };
  }
}

module.exports = config;