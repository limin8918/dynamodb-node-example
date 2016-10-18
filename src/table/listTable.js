var AWS = require('aws-sdk');

AWS.config.update({
    region : "local",
    endpoint: "http://localhost:8000"
})

var dynamodb = new AWS.DynamoDB();

dynamodb.listTables(function (err, data) { 
    console.log('listTables',err,data);
});