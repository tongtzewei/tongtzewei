var builder = require('botbuilder');

var restify = require('restify');

var weatherClient = require('./wunderground-client');

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

var model = 'https://api.projectoxford.ai/luis/v1/application?id=c413b2ef-382c-45bd-8ff0-f76d60e2a821&subscription-key=038f05bb382d430da46ee166432e0432&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });


// Setup dialogs

bot.dialog('/', dialog);

dialog.matches('builtin.intent.weather.check_weather', [
    function (session, args, next) {
        var locationEntity = builder.EntityRecognizer.findEntity(args.entities, 'builtin.weather.absolute_location');
 //       if (locationEntity) {
 //           return next({ response: locationEntity.entity });
 //       } else {
 //           builder.Prompts.text(session, 'What location?');
 //       }

        if (!locationEntity) {
            builder.Prompts.text(sesson, "what is the location?")
        } else {
            next ()
        }


    },
    function (session, results) {
        weatherClient.getCurrentWeather(results.response, (responseString) => {
            session.send(responseString);
        });
    }
]);

dialog.onDefault(builder.DialogAction.send("I don't understand."));