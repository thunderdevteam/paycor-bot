var restify = require('restify');
var builder = require('botbuilder');
var timeOffRequestAPI = require('./api/timeOffRequest');
var inMemoryStorage = new builder.MemoryBotStorage();
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector, [
    // function (session) {
    //     session.send("Welcome to the dinner reservation.");
    //     builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    // },
    // function (session, results) {
    //     session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
    //     builder.Prompts.text(session, "How many people are in your party?");
    // },
    // function (session, results) {
    //     session.dialogData.partySize = results.response;
    //     builder.Prompts.text(session, "Whose name will this reservation be under?");
    // },
    // function (session, results) {
    //     session.dialogData.reservationName = results.response;

    //     // Process request and display reservation details
    //     session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
    //     session.endDialog();
    // }
    function (session) {
        session.send("Hi, Welcome to Paycor. Please click on below options that i can help with");
        session.beginDialog('getPayCorOptions');
        //builder.Prompts.time(session, "dfghdfh");
    },
    function (session, results) {
        session.dialogData.reservationDate = results.response;
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "Whose name will this reservation be under?");
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }

]).set('storage', inMemoryStorage);




var paycorOptions = {
    "Absence Management": {
        "My Balance": {
            balance: 56,
            taken: 25
        },
        "My Schedule Hours": {},
        "Create Time Off": {},
        "Time Off Details": {}
    },
    "Time Card": {
        units: 100,
        total: "$3,000"
    },
    "Holiday Details": {
        units: 300,
        total: "$9,000"
    }
};

var absenceManagementDetails = {
    "My Balance": {
        balance: 56,
        taken: 25
    },
    "Taken Hours": {},
    "Create Time Off": {},
    "Time Off Details": {}
};

bot.dialog('getPayCorOptions', [
    function (session) {
        builder.Prompts.choice(session, "Please select the app below.?", paycorOptions, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response) {
            var region = paycorOptions[results.response.entity];
            //builder.Prompts.choice(session, "Please select the option below.?", region, { listStyle: builder.ListStyle.button }); 
            session.beginDialog('getInsideOptions', region);
            //session.send(`You selected ${region.units} units for a total of ${region.total}.`); 
        } else {
            session.send("OK");
        }
    }
]);

bot.dialog('getInsideOptions', [
    function (session, region) {
        builder.Prompts.choice(session, "Please select the option below.?", absenceManagementDetails, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response) {
            timeOffRequestAPI.getData(function(data) {
                let balances = JSON.parse(data);
                if(results.response.entity === 'My Balance'){
                    for(let item of balances.balances){
                        builder.Prompts.text(session, item.benefitCode + ' - ' + item.availableBalance);
                    }
                }

                if(results.response.entity === 'Taken Hours'){
                    for(let item of balances.balances){
                        builder.Prompts.text(session, item.benefitCode + ' - ' + item.approvedHours);
                    }
                }
            });
        } else {
            session.send("OK");
        }
    }
]);


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
// var bot = new builder.UniversalBot(connector, [
//     function (session) {
//         session.send("You said: %s", session.message.text); 

//     }
// ]).set('storage', inMemoryStorage); // Register in-memory storage 

//  var options = {
//     host: "developer.api.autodesk.com",
//     path: "/oss/v1/buckets",
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer z7xO8X_35JBnxq26QWMoZwRckvewy-4ceSjdTBZk2JFSvmOt-V5g_YL9HD1fRQxZ3eAEfrab6xSAup4DZPMOG51gs1s47SVl6Tx3JCWmZ7nv_5c1R9V-oFoy-d6M4GeaR0-6TOXi3-lRFBPA_jyg-REmc62kr4Y6FdNsMeiqHdA_sdxs"
//     }
// };
//  var req = http.request(options, function (res) {
//     var responseString = "";

//     res.on("data", function (data) {
//         responseString += data;
//         // save all the data from response
//     });
//     res.on("end", function () {
//         console.log(responseString); 
//         // print to console when response ends
//     });
// });

/*
var salesData = {
    "west": {
        units: 200,
        total: "$6,000"
    },
    "central": {
        units: 100,
        total: "$3,000"
    },
    "east": {
        units: 300,
        total: "$9,000"
    }
};

bot.dialog('getSalesData', [
    function (session) {
        builder.Prompts.choice(session, "Which region would you like sales for?", salesData, { listStyle: builder.ListStyle.button }); 
    },
    function (session, results) {
        if (results.response) {
            var region = salesData[results.response.entity];
            session.send(`We sold ${region.units} units for a total of ${region.total}.`); 
        } else {
            session.send("OK");
        }
    }
]);
bot.dialog('help', function (session, args, next) {
    session.endDialog("This is a bot that can help you make a dinner reservation. <br/>Please say 'next' to continue");
})
.triggerAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the dialog stack 
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});
********************************************************************************************
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the dinner reservation.");
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "Whose name will this reservation be under?");
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]).set('storage', inMemoryStorage);

************************************************************************
var bot = new builder.UniversalBot(connector,     function (session) {
    session.beginDialog('greetings');
     }
).set('storage', inMemoryStorage); // Register in-memory storage

bot.dialog('greetings', [
    function (session) {
        session.beginDialog('askName');
    },
    function (session, results) {
        session.endDialog('Hello %s!', results.response);
    }
]);
bot.dialog('askName', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
********************************************************************************************
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the dinner reservation.");
        session.beginDialog('askForDateTime');
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        session.beginDialog('askForPartySize');
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        session.beginDialog('askForReserverName');
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]).set('storage', inMemoryStorage); // Register in-memory storage 

// Dialog to ask for a date and time
bot.dialog('askForDateTime', [
    function (session) {
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog to ask for number of people in the party
bot.dialog('askForPartySize', [
    function (session) {
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
       session.endDialogWithResult(results);
    }
])
.beginDialogAction('partySizeHelpAction', 'partySizeHelp', { matches: /^help$/i });

// Context Help dialog for party size
bot.dialog('partySizeHelp', function(session, args, next) {
    var msg = "Party size help: Our restaurant can support party sizes up to 150 members.";
    session.endDialog(msg);
})

// Dialog to ask for the reservation name.
bot.dialog('askForReserverName', [
    function (session) {
        builder.Prompts.text(session, "Who's name will this reservation be under?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
*/