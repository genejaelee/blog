var crypto = require('crypto');
var moment = require('moment');

var awsApi = function(app, db) {
  console.log('included aws api');
  
  app.get('/api/aws/credentials', function(req, res, next) {
    var awsSecret = process.env.AWS_SECRET_ACCESS_KEY;
    var awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
    var date = moment(Date.now()).format('YYYYMMDD');
    var region = "us-west-1";
    var credential = awsAccessKey + "/" + date + "/" + "us-west-1/s3/aws4_request"
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
  var hash1 = crypto.createHmac(algorithm, "AWS4" + awsSecret);
  hash1.write(date);
  hash1.end();
  var hash2 = crypto.createHmac(algorithm, hash1.read());
  hash2.write(region);
  hash2.end();
  var hash3 = crypto.createHmac(algorithm, hash2.read());
  hash3.write(service);
  hash3.end();
  var hash4 = crypto.createHmac(algorithm, hash3.read());
  hash4.write( 'aws4_request' );
  hash4.end();
  var hash5 = crypto.createHmac(algorithm, hash4.read());
  hash5.write( new Buffer( encodedPolicy, 'utf-8'));
  hash5.end();
  var signature = hash5.read().toString('hex');
  console.log(signature);
  return signature;
}

module.exports = awsApi;