const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_REGION
});

const dynamodb = new AWS.DynamoDB();
exports.db = dynamodb;
