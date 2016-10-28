// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder'); 

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function() 
{
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector
({ appId: '0b6b5b0d-a8c6-4759-ab0a-de2241bf04ac', appPassword: 'PN4xsTqsBBgCS1bLcmtA824' }); 
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialogs
var Hotels = require('./hotels');
var Flights = require ('./flights');
var Support = require ('./support');

bot.dialog('/flights', Flights.Dialog);
bot.dialog('/hotels', Hotels.Dailog);
bot.dialog('./support', Support.Dialog);

bot.dialog('/', new builder.IntentDialog()
    .matchesAny([/help/i, /support/i, /problem/i],[
        function(session){
            session.beginDialog('/support');
        },
        function(session, result){
            var ticketNumber = result.response;
            session.send('Thanks for contacting our support team. Your ticket number is %s',ticketNumber);
            session.endDialog();
        }
    ])
    .onDefault([
        function(session){
            builder.Prompts.choice(
                session, 
                'Are you looking for a flight or a hotel?',
                [Flights.label, Hotel.label],
                {
                    maxRetries : 3,
                    retryPrompt: 'Not a valid optionn'
                });
        },
        function(session, result){
            if (!result.response){
                session.send('Ooopgs! too many attempt');
                return session.endDialog();
            }
        
            session.on('error',function(err){
            session.send('Failed with messsage %s', err.message);
            session.endDialog();
            });

            var selection = result.response.entity;
            switch(selection){
                case Fiights.label: return session.beginDialog('/flights')
                case Hotels.Label: return session.beginDialog('/hotels')
            }
        }
    ]));
    
server.get('/', restify.serveStatic({
directory: __dirname,
default: '/index.html'
}));