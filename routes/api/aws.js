var crypto = require('crypto');

var awsApi = function(app, db) {
  console.log('included aws api');
  
  app.get('/api/aws/credentials', function(req, res, next) {
    var awsSecret = process.env.AWS_SECRET_ACCESS_KEY;
    var awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
    var policyJson = {
      "expiration": "2020-01-01T00:00:00Z",
      "conditions": [ 
        {"bucket": "genejaelee-assets"}, 
        ["starts-with", "$key", ""],
        {"acl": "private"},
        ["starts-with", "$Content-Type", ""],
        ["starts-with", "$filename", ""],
        ["content-length-range", 0, 524288000]
      ]
    }
    var encodedPolicy = Buffer(JSON.stringify(policyJson)).toString('base64');
    console.log('aws secret is ' + awsSecret);
    console.log('aws access key is ' + awsAccessKey);
    console.log('aws encoded policy is ' + encodedPolicy);
    
    // create HMAC-SHA1
    var signature = crypto.createHmac('sha1', awsSecret).update(encodedPolicy).digest('hex');
    
    res.json({
      'key': awsAccessKey,
      'policy': encodedPolicy,
      'signature': signature
    });
  });
}

module.exports = awsApi;