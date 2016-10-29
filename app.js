var builder = require('botbuilder');

var restify = require('restify');



// Setup Restify Server

var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {

    console.log('%s listening to %s', server.name, server.url);

});



// Create chat bot

var connector = new builder.ChatConnector({

    appId: '0b6b5b0d-a8c6-4759-ab0a-de2241bf04ac',

    appPassword: 'PN4xsTqsBBgCS1bLcmtA824'

});

var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());



// Dialogs

var Hotels = require('./hotels');

var Flights = require('./flights');

var Support = require('./support');



// Setup dialogs

bot.dialog('/flights', Flights.Dialog);

bot.dialog('/hotels', Hotels.Dialog);

bot.dialog('/support', Support.Dialog);



// Root dialog

bot.dialog('/', new builder.IntentDialog()

    .matchesAny([/help/i, /support/i, /problem/i], [

        function (session) {

            session.beginDialog('/support');

        },

        function (session, result) {

            var tickerNumber = result.response;

            session.send('Thanks for contacting our support team. Your ticket number is %s.', tickerNumber);

            session.endDialog();

        }

    ])

    .onDefault([

        function (session) {

            // prompt for search option

            builder.Prompts.choice(

                session,

                'Are you looking for a flight or a hotel?',

                [Flights.Label, Hotels.Label],

                {

                    maxRetries: 3,

                    retryPrompt: 'Not a valid option'

                });

        },

        function (session, result) {

            if (!result.response) {

                // exhausted attemps and no selection, start over

                session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');

                return session.endDialog();

            }



            // on error, start over

            session.on('error', function (err) {

                session.send('Failed with message: %s', err.message);

                session.endDialog();

            });



            // continue on proper dialog

            var selection = result.response.entity;

            switch (selection) {

                case Flights.Label:

                    return session.beginDialog('/flights')

                case Hotels.Label:

                    return session.beginDialog('/hotels')

            }

        }

    ]));