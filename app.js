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
    "My Balance": {},
    "My Schedule Hours": {},
    "Create Time Off": {},
    "Time Off Details": {}
};
var timeCardOptions = {
    "My Time Card details": {},
    "Exception Details": {}
};
// Listen for messages from users 
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Hi, Welcome to Paycor Bot.");
        session.beginDialog('getPayCorOptions');
    },
    function (session, results) {
        session.dialogData.PayCorOption = results.response.entity;
        session.send(`you have selected: ${session.dialogData.PayCorOption}`);
        if(session.dialogData.PayCorOption=="Absence Management")
        {
            session.beginDialog('getAbsenceManagementOptions');
        }
        if(session.dialogData.PayCorOption=="Time Card")
        {
            session.beginDialog('getTimeCardOptions');
        }
        if(session.dialogData.PayCorOption=="Holiday Details")
        {
            session.beginDialog('getHolidayDetailsOptions');
        }
    },
    function (session, results) {
        session.dialogData.PayCorSubOption = results.response.entity;

        session.send(`you have selected: ${session.dialogData.PayCorSubOption}`);
        if(session.dialogData.PayCorSubOption=="My Balance")
        {
            session.beginDialog('getMyBalanceOptions');
        }
        if(session.dialogData.PayCorSubOption=="My Schedule Hours")
        {
            session.beginDialog('getMyScheduleHoursOptions');
        }
        if(session.dialogData.PayCorSubOption=="Time Off Details")
        {
            session.beginDialog('getTimeOffDetailsOptions');
        }
        if(session.dialogData.PayCorSubOption=="My Time Card details")
        {
            session.beginDialog('getMyTimeCardDetailsOptions');
        }
        if(session.dialogData.PayCorSubOption=="Exception Details")
        {
            session.beginDialog('getMyExceptionDetailsOptions');
        }
        // timeOffRequestAPI.getData(function(data) {
        //     let balances = JSON.parse(data);
        //     for(let item of balances.balances){
        //         session.send(item.benefitCode + ' - ' + item.availableBalance);
        //     }
        // });
        // session.endDialog();
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
        builder.Prompts.choice(session, "Please select the app below.?", absenceManagementOptions, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('getTimeCardOptions', [
    function (session) {
        builder.Prompts.choice(session, "Please select the app below.?", timeCardOptions, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('getHolidayDetailsOptions', [
    function (session) {
        builder.Prompts.time(session, "Please provide date(e.g.: June 6th)?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('getMyBalanceOptions', [
    function (session) {
        session.send("getMyBalanceOptions called!!");
        timeOffRequestAPI.getData(function(data) {
            let balances = JSON.parse(data);
            for(let item of balances.balances){
                session.send(item.benefitCode + ' - ' + item.availableBalance);
            }
        });
        session.endConversation();
    }
]);
bot.dialog('getMyScheduleHoursOptions', [
    function (session) {
        session.send("getMyScheduleHoursOptions called!!");
        timeOffRequestAPI.getData(function(data) {
            let balances = JSON.parse(data);
            for(let item of balances.balances){
                session.send(item.benefitCode + ' - ' + item.availableBalance);
            }
        });
        session.endConversation();
    }
]);
bot.dialog('getTimeOffDetailsOptions', [
    function (session) {
        session.send("getTimeOffDetailsOptions called!!");
        timeOffRequestAPI.getData(function(data) {
            let balances = JSON.parse(data);
            for(let item of balances.balances){
                session.send(item.benefitCode + ' - ' + item.availableBalance);
            }
        });
        session.endConversation();
    }
]);
bot.dialog('getMyTimeCardDetailsOptions', [
    function (session) {
        session.send("getMyTimeCardDetailsOptions called!!");
        timeOffRequestAPI.getData(function(data) {
            let balances = JSON.parse(data);
            for(let item of balances.balances){
                session.send(item.benefitCode + ' - ' + item.availableBalance);
            }
        });
        session.endConversation();
    }
]);
bot.dialog('getMyExceptionDetailsOptions', [
    function (session) {
        session.send("getMyExceptionDetailsOptions called!!");
        timeOffRequestAPI.getData(function(data) {
            let balances = JSON.parse(data);
            for(let item of balances.balances){
                session.send(item.benefitCode + ' - ' + item.availableBalance);
            }
        });
        session.endConversation();
    }
]);
// bot.dialog('getInsideOptions', [
//     function (session, region) {

//         timeOffRequestAPI.getData(function(data) {
//             let balances = JSON.parse(data);
//             for(let item of balances.balances){
//                 builder.Prompts.text(session, item.benefitCode + ' - ' + item.availableBalance);
//             }
//         });

        
//         builder.Prompts.choice(session, "Please select the option below.?", absenceManagementDetails, { listStyle: builder.ListStyle.button });
//     },
//     function (session, results) {
//         if (results.response) {
//             var region1 = absenceManagementDetails[results.response.entity];
//             session.send(`You have ${region1.balance} Hours, and you taken ${region1.taken} Hours.`);
//         } else {
//             session.send("OK");
//         }
//     }
// ]);
