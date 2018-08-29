//require('dotenv').config();

var request = require('request');
var querystring = require('querystring');

// Analyze text
//
// utterance = user's text
//
function getLuisIntent(utterance) {

    // endpoint URL=https://westus.api.cognitive.microsoft.com/luis/v2.0
    var endpoint ="https://westus.api.cognitive.microsoft.com/luis/v2.0/";

    // Set the LUIS_APP_ID environment variable 
    // to df67dcdb-c37d-46af-88e1-8b97951ca1c2, which is the ID
    // of a public sample application.    
    var luisAppId = process.env.LUIS_APP_ID;

    // Read LUIS key from environment file ".env"
    // You can use the authoring key instead of the endpoint key. 
	// The authoring key allows 1000 endpoint queries a month.
    var endpointKey = '45902d9d571a48f8aa626f7e33c11c81';//process.env.LUIS_ENDPOINT_KEY;

    // Create query string 
    var queryParams = {
        "verbose":  true,
        "q": utterance,
        "subscription-key": endpointKey
    }

    // append query string to endpoint URL
    //var luisRequest = endpoint + luisAppId +'?' + querystring.stringify(queryParams);
    var luisRequest = endpoint +'?' + querystring.stringify(queryParams);

    // HTTP Request
    request(luisRequest,
        function (err,
            response, body) {

            // HTTP Response
            if (err)
                console.log(err);
            else {
                var data = JSON.parse(body);

                console.log(`Query: ${data.query}`);
                //console.log(`Top Intent: ${data.topScoringIntent.intent}`);
                console.log('Intents:');
                console.log(data.intents);
            }
        });
}

// Pass an utterance to the sample LUIS app
getLuisIntent('turn on the left light');