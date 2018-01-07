var data = { //Define all data for Twitter API
    consumer_key:           'jOsVyauB3XM4AvlJzF3JbdbRx',
    consumer_secret:        'AcDkRg0uos0JBJ8RWLbtBP2lBFDqAayK2sObpJMsTUHxoYUKGt',
    access_token:           '883737566381473792-Gr2ejQgcFxaJH5sLWHNpl3HwoxVb7Qc',
    access_token_secret:    'nx2WX80mWKed2J6r7GBEIthUEWXC9IPMgJDsfAyyp5ydn',
    timeout_ms:             60 * 1000,
    user:                   'Tchekda'
};

var log = { //Define all Data for the Logger
    logDir:             '/var/log/twitter/',
    logInfoFile:        'info.log',
    logErrorFile:       'error.log'
};

var messages = { //Define custom messages
    start:                  'Bot Loading...',
    stop:                   'Bot Shutting Down',
    welcome_message:        'Bienvenue sur le compte de @Tchekda'
};

//Export all data to the main module (bot.js)
module.exports={data:data,log:log,messages:messages};
