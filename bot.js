var config = require('./config.js'),
    Twit = require('twit'),
    eventModule = require('./twitter-event.js'),
    twit = new Twit(config.data),
    stream = twit.stream('user'),
    stdin = process.openStdin(),
    fs = require('fs'),
    logInfoFile = config.log.logDir + config.log.logInfoFile,
    logErrorFile = config.log.logDir + config.log.logErrorFile,
    SimpleNodeLogger = require("simple-node-logger"),
    optsInfo = {logFilePath: logInfoFile, timestampFormat: "YYYY-MM-DD HH:mm:ss"},
    optsError = {logFilePath: logErrorFile, timestampFormat: "YYYY-MM-DD HH:mm:ss"},
    logInfo = SimpleNodeLogger.createSimpleLogger(optsInfo), logError = SimpleNodeLogger.createSimpleLogger(optsError);

fs.existsSync(config.log.logDir) ? fs.existsSync(logInfoFile) && fs.existsSync(logErrorFile) || createFiles() : (fs.mkdirSync(config.log.logDir), createFiles());

function createFiles(){fs.writeFile(logInfoFile,"",function(o){if(o)throw o;console.log(config.log.logInfoFile+" has been created")}),fs.writeFile(logErrorFile,"",function(o){if(o)throw o;console.log(config.log.logErrorFile+" has been created")})}

eventModule.init(config, twit);

logInfo.info(config.messages.start);
eventModule.setWelcomeMessage();

stream.on('tweet', eventModule.identified);
stream.on('follow', eventModule.followed);
stream.on('quoted_tweet', eventModule.quoted);
stream.on('direct_message', eventModule.receiveMessage);


stdin.addListener("data", function (d) {
    var input = d.toString().trim();
    switch (input.split(' ')[0]) {
        case 'stop':
            console.log(config.log.stop);
            process.exit();
            break;
        case 'clear':
            process.stdout.write("\u001b[2J\u001b[0;0H");
            console.log('Cleared!');
            break;
        default:
            console.log('Commande inconnue!');
    }
});


