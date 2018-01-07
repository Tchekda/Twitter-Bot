var config = require('./config.js'),
    Twit = require('twit'),
    eventModule = require('./twitter-event.js'),
    twit = new Twit(config.data),
    stream = twit.stream('user', null),
    stdin = process.openStdin(),
    fs = require('fs'),
    SimpleNodeLogger = require("simple-node-logger"),
    optsInfo = {logFilePath: config.log.logDir + config.log.logInfoFile, timestampFormat: "YYYY-MM-DD HH:mm:ss"},
    optsError = {logFilePath: config.log.logDir + config.log.logErrorFile, timestampFormat: "YYYY-MM-DD HH:mm:ss"},
    logInfo = SimpleNodeLogger.createSimpleLogger(optsInfo), logError = SimpleNodeLogger.createSimpleLogger(optsError);

if(!fs.existsSync(config.log.logDir)){fs.mkdirSync(config.log.logDir);createFiles();}else if (!fs.existsSync(config.log.logDir + config.log.logInfoFile) && !fs.existsSync(config.log.logDir + config.log.logErrorFile)) {createFiles();}

function createFiles(){fs.writeFile(config.log.logDir + config.log.logInfoFile,"",function(o){if(o)throw o;logInfo.info(config.log.logInfoFile+" has been created")}),fs.writeFile(config.log.logDir + config.log.logErrorFile,"",function(o){if(o)throw o;logInfo.info(config.log.logErrorFile+" has been created")})}

var infos = {
    config: config,
    twit:   twit,
    errorLog:   logError,
    infoLog:    logInfo
}
eventModule.init(infos);

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


