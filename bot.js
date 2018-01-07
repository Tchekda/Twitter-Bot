//Initialisation of all variables needed in the bot
var config = require('./config.js'),                //Load configuration
    Twit = require('twit'),                         //Load Twitter API
    eventModule = require('./twitter-event.js'),    //Load functions on Twitter API
    twit = new Twit(config.data),                   //Initializing the Twitter API
    stream = twit.stream('user', null),             //Starting Stream flux on user key of Twittr API
    stdin = process.openStdin(),                    //Listen console commands
    fs = require('fs'),                             //Load file gestionnary
    SimpleNodeLogger = require("simple-node-logger"),// Load logger
    optsInfo = {logFilePath: config.log.logDir + config.log.logInfoFile, timestampFormat: "YYYY-MM-DD HH:mm:ss"}, //Options of Info Logger
    optsError = {logFilePath: config.log.logDir + config.log.logErrorFile, timestampFormat: "YYYY-MM-DD HH:mm:ss"}, //options of Error Logger
    logInfo = SimpleNodeLogger.createSimpleLogger(optsInfo), //Define Info Logger
    logError = SimpleNodeLogger.createSimpleLogger(optsError); //Define Error Logger
// Creation of logging files and directory
if (!fs.existsSync(config.log.logDir)) { //If log Directory does not exist
    try {
        fs.mkdirSync(config.log.logDir); //Create It
    } catch (exception) {
        console.log('Can\'t create the following directory : ' + config.log.logDir);
        process.exit(); // Quit to prevent crash
    }
    createFiles(); //So create log files
} else if (!fs.existsSync(config.log.logDir + config.log.logInfoFile) || !fs.existsSync(config.log.logDir + config.log.logErrorFile)) { //If one of the log files doesn't exist
    createFiles(); //Create them
}

function createFiles() {
    fs.writeFile(config.log.logDir + config.log.logInfoFile, "", function (o) { //Create info Log file
        if (o) {
            console.log('Can\'t create the following file : ' + config.log.logDir + config.log.logInfoFile);
            throw o;
        }
        logInfo.info(config.log.logInfoFile + " has been created")
    });
    fs.writeFile(config.log.logDir + config.log.logErrorFile, "", function (o) { //Create Error Log file
        if (o) {
            console.log('Can\'t create the following file : ' + config.log.logDir + config.log.logErrorFile);
            throw o;
        }
        logInfo.info(config.log.logErrorFile + " has been created")
    });
}

var infos = { //Define data for twitter-event.js
    config: config,
    twit: twit,
    errorLog: logError,
    infoLog: logInfo
};
eventModule.init(infos); //Sending data to twitter-event.js

logInfo.info(config.messages.start); //Log init bot = All seems good


//Setting up all streams
stream.on('tweet', eventModule.identified);
stream.on('follow', eventModule.followed);
stream.on('quoted_tweet', eventModule.quoted);
stream.on('direct_message', eventModule.receiveMessage);

//Define listener of console commands
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

eventModule.setWelcomeMessage(); //Define Welcome Message on the account = All good
