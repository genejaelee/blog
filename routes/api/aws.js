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
        {"acl": "public-read"},
        ["starts-with", "$Content-Type", ""],
        ["starts-with", "$filename", ""],
        {"x-amz-meta-uuid": "14365123651274"},
        {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
        ["content-length-range", 0, 524288000]
      ]
    }
    var encodedPolicy = Buffer(JSON.stringify(policyJson)).toString('base64');
    // create HMAC-SHA256 hash
    var signature = generateHmac(encodedPolicy, awsSecret);
    
    res.json({
      'key': awsAccessKey,
      'policy': encodedPolicy,
      'signature': signature
    });
  });
}

function generateHmac (data, awsSecret, algorithm, encoding) {
  encoding = encoding || "base64";
  algorithm = algorithm || "sha256";
  return crypto.createHmac(algorithm, awsSecretKey).update(data).digest(encoding);
}

module.exports = awsApi;