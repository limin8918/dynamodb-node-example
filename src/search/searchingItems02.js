var AWS = require("aws-sdk");

AWS.config.update({
    region : "local",
    endpoint: "http://localhost:8000"
})

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Movies";

var params = {
    TableName: table,    
    KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
    ExpressionAttributeNames:{
        "#yr": "year"
    },
    ExpressionAttributeValues: {
        ":yyyy": 2013,
        ":letter1": 'R',
        ":letter2": 'T'
    }
};

console.log("Querying for movies from 2013 - titles R-L, with genres and lead actor");

docClient.query(params, function(err, data) {
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item.year + ": " + item.title
            + " ... " + item.info.genres
            + " ... " + item.info.actors[0]);
        });
    }
});