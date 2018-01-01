var data = {
    consumer_key:           'jOsVyauB3XM4AvlJzF3JbdbRx',
    consumer_secret:        'AcDkRg0uos0JBJ8RWLbtBP2lBFDqAayK2sObpJMsTUHxoYUKGt',
    access_token:           '883737566381473792-Gr2ejQgcFxaJH5sLWHNpl3HwoxVb7Qc',
    access_token_secret:    'nx2WX80mWKed2J6r7GBEIthUEWXC9IPMgJDsfAyyp5ydn',
    timeout_ms:             60 * 1000,
    user:                   'Tchekda'
};

var log = {
    logDir:             '/var/log/twitter/',
    logInfoFile:        'info.log',
    logErrorFile:       'error.log'
};

var messages = {
    start:                  'Chargement du bot',
    stop:                   'Extiction du bot!',
    welcome_message:        'Bienvenue sur le compte de @Tchekda'
};
module.exports={data:data,log:log,messages:messages};
