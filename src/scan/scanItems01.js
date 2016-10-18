var AWS = require("aws-sdk");

AWS.config.update({
    region : "local",
    endpoint: "http://localhost:8000"
})

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Movies";

var params = {
    TableName: table,
    // ProjectionExpression代表scan结果中需要输出的非index的字段, search时不需要
    ProjectionExpression: "#yr, title, info.directors",     
    KeyConditionExpression: "#yr = :yyyy",
    FilterExpression: "#yr between :start_yr and :end_yr",
    ExpressionAttributeNames: {
        "#yr": "year",
    },
    ExpressionAttributeValues: {
         ":start_yr": 2010,
         ":end_yr": 2020 
    }
};

console.log("Scanning Movies table.")

docClient.scan(params, function(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(movie) {
           console.log(
                movie.year + ": ",
                movie.title, "- directors:", movie.info.directors);
        });

        // continue scanning if we have more movies
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
});