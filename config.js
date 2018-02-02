var data = { //Define all data for Twitter API "https://apps.twitter.com"
    consumer_key:           '',
    consumer_secret:        '',
    access_token:           '',
    access_token_secret:    '',
    timeout_ms:             60 * 1000,
    user:                   '', //Your @username
    retweetWords: [] //Keywords to retweet
};

var log = { //Define all Data for the Logger
    logDir:             'log/',
    logInfoFile:        'info.log',
    logErrorFile:       'error.log'
};

var messages = { //Define custom messages
    start:                  'Bot Loading...',
    stop:                   'Bot Shutting Down',
    welcome_message:        'Welcome in my DM\'s'
};

//Export all data to the main module (bot.js)
module.exports={data:data,log:log,messages:messages};
