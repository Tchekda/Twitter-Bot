var data = { //Define all data for Twitter API "https://apps.twitter.com"
    consumer_key:           '',
    consumer_secret:        '',
    access_token:           '',
    access_token_secret:    '',
    timeout_ms:             60 * 1000,
    username:               '', //Your @username
    userID:                 '', //Your Owner ID
    retweetWords: [] //Keywords to retweet
}

var log = { //Define all Data for the Logger
    logDir:             'log/',
    logInfoFile:        'info.log',
    logErrorFile:       'error.log'
}

var messages = { //Define custom messages
    welcome_message:        'Welcome in my DM\'s',
    new_follower:           '@%username% has just followed me!'
}

var console = {
    start:                  'Bot Loading...',
    stop:                   'Bot Shutting Down',
    new_follower:           '%name% has just followed you! @%username%',
    tweeted:                'The Tweet has been successfully sent : %text%',
    welcome_message_defined:'Your DM\'s welcome message has been successfully updated : %text%',
    liked:                  '@%username%\'s Tweet has been successfully liked',
    deleted:                'The Tweet has been successfully deleted',
    retweeted:              '@%username%\'s tweet has been successfully retweeted'    
}

//Export all data to the main module (bot.js)
module.exports={data:data,log:log,messages:messages,console:console}
