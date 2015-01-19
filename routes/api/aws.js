var crypto = require('crypto');
var moment = require('moment');

var awsApi = function(app, db) {
  console.log('included aws api');
  
  app.get('/api/aws/credentials', function(req, res, next) {
    var awsSecret = process.env.AWS_SECRET_ACCESS_KEY;
    var awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
    var date = moment(Date.now()).format('YYYYMMDD');
    var region = "us-west-1";
    var credential = awsAccessKey + "%2F" + date + "%2F" + "us-west-1%2Fs3%2Faws4_request"
    var policyJson = {
      "expiration": "2020-01-01T00:00:00Z",
      "conditions": [ 
        {"bucket": "genejaelee-assets"}, 
        ["starts-with", "$key", ""],
        {"acl": "public-read"},
        ["starts-with", "$Content-Type", ""],
        ["starts-with", "$filename", ""],
        {"x-amz-credential": credential },
        {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
        {"x-amz-date": date}
      ]
    }
    var encodedPolicy = Buffer(JSON.stringify(policyJson)).toString('base64');
    // create HMAC-SHA256 hash
    var signature = generateHmac(awsSecret, date, region, "s3", encodedPolicy);
    
    res.json({
      'key': awsAccessKey,
      'policy': encodedPolicy,
      'signature': signature,
      'date': date,
      'credential': credential
    });
  });
}

function generateHmac (awsSecret, date, region, service, encodedPolicy, algorithm, encoding) {
  encoding = encoding || "base64";
  algorithm = algorithm || "sha256";
  var hash1 = crypto.createHmac(algorithm, "AWS4" + awsSecret).update(date).digest('binary');
  var hash2 = crypto.createHmac(algorithm, hash1).update(region).digest('binary');
  var hash3 = crypto.createHmac(algorithm, hash2).update(service).digest('binary');
  var hash4 = crypto.createHmac(algorithm, hash3).update("aws4_request").digest('binary');
  return crypto.createHmac(algorithm, hash4).update(encodedPolicy).digest(encoding);
}

module.exports = awsApi;