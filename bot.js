//Module Loaders
let Twit =                  require('twit'),
    dotenv =                require('dotenv').config(),
    fs =                    require('fs'),
    simpleNodeLogger =      require("simple-node-logger")

if (dotenv.error) throw result.error
      
//Load Custom Modules
let eventModule =           require('./twitter-event.js') 

//Configure Log System
let logDir = process.env.LOG_DIR
    optsInfo = { logFilePath: logDir + process.env.LOG_INFO_FILE, timestampFormat: "YYYY-MM-DD HH:mm:ss" }, //Options of Info Logger
    optsError = { logFilePath: logDir + process.env.LOG_ERROR_FILE, timestampFormat: "YYYY-MM-DD HH:mm:ss" }, //options of Error Logger
    logInfo = simpleNodeLogger.createSimpleLogger(optsInfo), //Define Info Logger
    logError = simpleNodeLogger.createSimpleLogger(optsError) //Define Error Logger
    
checkLogFiles(logDir) // Creation of logging files and directory
logInfo.info(process.env.START) //Bot is Starting = All seems good

//Init Constructors
let twit = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
    timeout_ms:           process.env.TIMEOUT_MS,  // optional HTTP request timeout to apply to all requests.
    }),
    stdin = process.openStdin() 
    
eventModule.init({ 
    twit: twit,
    errorLog: logError,
    infoLog: logInfo
})


//Setting up all streams
let userStream = twit.stream('user', null),
    publicStream = twit.stream('statuses/filter', {track: process.env.RETWEETKEYWORDS})

userStream.on('tweet', eventModule.identified)
userStream.on('follow', eventModule.followed)
userStream.on('quoted_tweet', eventModule.quoted)
userStream.on('direct_message', eventModule.receiveMessage)
publicStream.on('tweet', eventModule.retweetKeyWords)

//Define listener of console commands
stdin.addListener("data", function (d) {
    let inputString = d.toString().trim(),
        command = inputString.split(' ')[0],
        args = inputString.split(' ').shift()
    switch (command) {
        case 'stop':
            logInfo.info(config.console.stop)
            setTimeout(function () { process.exit() }, 0.001) //Otherwise the log hasn't the time to be written
            break
        case 'clear':
            process.stdout.write("\u001b[2J\u001b[00H")
            console.log('Cleared!')
            break
        default:
            logError.error('Unknown Command : ' + command)
    }
})

eventModule.setWelcomeMessage() //Define Welcome Message on the account = All good


function checkLogFiles(logDir) {
    if (!fs.existsSync(logDir)) { //If log Directory does not exist
        try {
            fs.mkdirSync(logDir) //Create It
        } catch (exception) {
            console.log('Can\'t create the following directory : ' + logDir)
            process.exit() // Quit to prevent crash
        }
        createFiles() //So create log files
    } else if (!fs.existsSync(logDir + process.env.LOG_INFO_FILE) || !fs.existsSync(logDir + process.env.LOG_ERROR_FILE)) { //If one of the log files doesn't exist
        createFiles() //Create them
    }
    
    function createFiles() {
        fs.writeFile(logDir + process.env.LOG_INFO_FILE, "", function (o) { //Create info Log file
            if (o) {
                console.log('Can\'t create the following file : ' + logDir + process.env.LOG_INFO_FILE)
                throw o
            }
            logInfo.info(process.env.LOG_INFO_FILE + " has been created")
        })
        fs.writeFile(logDir + process.env.LOG_ERROR_FILE, "", function (o) { //Create Error Log file
            if (o) {
                console.log('Can\'t create the following file : ' + logDir + process.env.LOG_ERROR_FILE)
                throw o
            }
            logInfo.info(process.env.LOG_ERROR_FILE + " has been created")
        })
    }
}