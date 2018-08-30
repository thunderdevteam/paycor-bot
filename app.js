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

var paycorOptions = {
    "Absence Management": {},
    "Time Card": {},
    "Holiday Details": {}
};

var absenceManagementOptions = {
    "PTO Balance": {},
    "Schedule Hours": {},
    "Create Time Off": {},
    "Time Off Details": {}
};
var timeCardOptions = {
    "Time Card details": {},
    "Exception Details": {}
};
var clientId;
var employeeId;
// Listen for messages from users 
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.text(session, "Hi, Welcome to Paycor Bot.<br />Please provide ClientId, EmployeeId... ");
    },
    function (session, results) {
        var resp = results.response.split(',');
        clientId = resp[0];
        employeeId = resp[1];
        session.beginDialog('getPayCorOptions');
    },
    function (session, results) {
        session.dialogData.PayCorOption = results.response.entity;
        if (session.dialogData.PayCorOption == "Absence Management") {
            session.beginDialog('getAbsenceManagementOptions');
        }
        if (session.dialogData.PayCorOption == "Time Card") {
            session.beginDialog('getTimeCardOptions');
        }
        if (session.dialogData.PayCorOption == "Holiday Details") {
            session.beginDialog('getHolidayDetailsOptions');
        }
    },
    function (session, results) {
        session.dialogData.PayCorSubOption = results.response.entity;
        if (session.dialogData.PayCorSubOption == "PTO Balance") {
            session.beginDialog('getMyBalanceOptions');
        }
        if (session.dialogData.PayCorSubOption == "Create Time Off") {
            session.endConversation(`Please click on below link Record Absence:<br\>[Record Absence](http://localhost/absencemanagement/managetimeoff.html?screen=accrualactivity&clientId=${clientId}&empid=${employeeId})`)
        }

        if (session.dialogData.PayCorSubOption == "Schedule Hours") {
            session.beginDialog('getMyScheduleHoursOptions');
        }
        if (session.dialogData.PayCorSubOption == "Time Off Details") {
            session.beginDialog('getTimeOffDetailsOptions');
        }
        if (session.dialogData.PayCorSubOption == "Time Card details") {
            session.beginDialog('getMyTimeCardDetailsOptions');
        }
        if (session.dialogData.PayCorSubOption == "Exception Details") {
            session.beginDialog('getMyExceptionDetailsOptions');
        }
    }

]).set('storage', inMemoryStorage);
/** Global help*  */
bot.dialog('help', function (session, args, next) {
    session.endConversation("Please say 'next' to go to Main Options..");
})
    .triggerAction({
        matches: /^help$/i,
        // onSelectAction: (session, args, next) => {
        //     // Add the help dialog to the dialog stack 
        //     // (override the default behavior of replacing the stack)
        //     session.beginDialog(args.action, args);
        // }
    });
/********* */

bot.dialog('getPayCorOptions', [
    function (session) {
        builder.Prompts.choice(session, "I can help you on below options!! Please select any...", paycorOptions, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('getAbsenceManagementOptions', [
    function (session) {
        builder.Prompts.choice(session, "Please select ....", absenceManagementOptions, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('getTimeCardOptions', [
    function (session) {
        builder.Prompts.choice(session, "Please select ....", timeCardOptions, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('getHolidayDetailsOptions', [
    function (session) {
        timeOffRequestAPI.getHolidays(clientId, employeeId, '07/01/2018', '09/01/2018', function (data) {
            let scheduleHours = JSON.parse(data);
            console.log(scheduleHours);
            var msg = "Below are your Holiday Details:<br \>";
            let maxCount = 5;
            for (let item of scheduleHours) {
                if (maxCount == 0)
                    break;
                msg = msg + "Date:" + item.DisplayDate + ",  Total Hours:8.00<br \>";
                maxCount = maxCount - 1;
            }
            session.send(msg);
        });
        session.endConversation();
    }
]);
bot.dialog('getMyBalanceOptions', [
    function (session) {
        timeOffRequestAPI.getData(clientId, employeeId, function (data) {
            let balances = JSON.parse(data);
            var msg = "Below are your balacnce:<br \>";
            for (let item of balances.balances) {
                msg = msg + item.benefitCode + ' - ' + item.availableBalance + "<br \>";
            }
            session.send(msg);
        });
        session.endConversation();
    }
]);
bot.dialog('getMyScheduleHoursOptions', [
    function (session) {
        timeOffRequestAPI.getHolidays(clientId, employeeId, '07/01/2018', '09/01/2018', function (data) {
            let scheduleHours = JSON.parse(data);
            console.log(scheduleHours);
            var msg = "Below are your Schedule Hours:<br \>";
            let maxCount = 5;
            for (let item of scheduleHours) {
                if (maxCount == 0)
                    break;
                msg = msg + "Date:" + item.DisplayDate + ",  Total Hours:7.56<br \>";
                maxCount = maxCount - 1;
            }
            session.send(msg);
        });
        session.endConversation();
    }
]);
bot.dialog('getTimeOffDetailsOptions', [
    function (session) {
        timeOffRequestAPI.getTimeOffDetails(clientId, employeeId, '07/01/2018', '09/01/2018', function (data) {
            let TimeOffDetails = JSON.parse(data);
            var msg = "Below are your Time Off Details:<br \>";
            let maxCount = 5;
            for (let item of TimeOffDetails) {
                if (maxCount == 0)
                    break;
                msg = msg + "Time Off From:" + item.fromDate + " To: " + item.toDate + ",  Total Hours:" + item.totalHours + ", benefitCode:" + item.benefitCode + "<br \>";
                maxCount = maxCount - 1;
            }
            session.send(msg);
        });
        session.endConversation();
    }
]);
bot.dialog('getMyTimeCardDetailsOptions', [
    function (session) {
        timeOffRequestAPI.getTimeCardDetails(clientId, employeeId, '08/29/2018', function (data) {

            console.log(data);
            let timeCardDetails = JSON.parse(data);
            var msg = "Below are your Time Card Details:<br \>";
            let maxCount = 5;
            let timeCardDays=timeCardDetails.TimeCardDays;
            console.log(timeCardDays);
            for (let item of timeCardDays) {
                 if (item.DisplayDate == '08/29/2018') {
                     let punchPairList=item.PunchPairList[0];
                    if (maxCount == 0)
                        break;
                    msg = msg + "Display Date:" + item.DisplayDate + ", InPunch : " + punchPairList.InPunchDateTime + ",  OutPunch:" + punchPairList.OutPunchDateTime + ", Total Hours:" + punchPairList.Hours[0].TotalString + "<br \>";
                    maxCount = maxCount - 1;
                }
            }
            session.send(msg);
        });
        session.endConversation();
    }
]);
bot.dialog('getMyExceptionDetailsOptions', [
    function (session) {
        session.send("Good you dont have any exceptions!!");
        timeOffRequestAPI.getExecptions(clientId, employeeId, null, function (data) {
            //let balances = JSON.parse(data);
            console.log(data);

        });
        session.endConversation();
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