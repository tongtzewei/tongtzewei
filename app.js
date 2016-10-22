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
bot.dialog('/', function (session) {
    session.send("Hello World");
});

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));