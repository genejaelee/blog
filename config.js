var app = require('./server');

module.exports = function(app){
  switch(app.get('env')){
    case 'development':
      return {
        'filesPath': '/files/',
        'mongodb': 'mongodb://localhost:27017/node-blog'
      };

    case 'production':
      return {
        'filesPath': 'genejaelee-assets.s3-website-us-west-1.amazonaws.com/files/',
        'mongodb': process.env.MONGOLAB_URI 
      };

    default:
      return {
        
      };
  }
};