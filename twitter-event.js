//Setting up local varaibles
var config = null;
var twit = null;
var errorLog = null;
var infoLog = null;

//Receive all data
var init = function (infos) {
    config = infos.config;
    twit = infos.twit;
    errorLog = infos.errorLog;
    infoLog = infos.infoLog;
};

//When you are identified in a tweet
var identified = function (event) {
    var replyto = event.in_reply_to_screen_name;
    var from = event.user.screen_name;

    if(replyto === config.data.user){
        likeTweet(event.id_str, from);
    }
};

//When you are followed by someone
var followed = function (event) {
    var sourceName = event.source.name;
    var screenName = event.source.screen_name;
    if(screenName !== config.data.user){
        infoLog.info(sourceName + ' a commencé à vous suivre : @' + screenName);
        tweetText('@' + screenName + ' merci du follow! #Subscribe');
    }
};

//When one of your tweet is quoted
var quoted = function (event) {
    var replyto = event.source.screen_name;

    if(replyto !== config.data.user){
        likeTweet(event.target_object.id_str, event.target_object.user.screen_name);
    }
};

//To Tweet some text
var tweetText = function (text) {
    var params = {
        status : text
    };

    function logData(err){
        if(err){
            errorLog.error('An error occured : ' + err);
        }else{
            infoLog.info('Votre Tweet à bien été envoyé : ' + text);
        }
    }

    twit.post('statuses/update', params, logData)
};

//Define Welcome Message in Direct Messages
var setWelcomeMessage = function () {
    var params = {
        "welcome_message": {
            "message_data": {
                "text": config.messages.welcome_message
            }
        }
    };

    twit.post('direct_messages/welcome_messages/new', params, sended);

    function sended(err){
        if(err){
            errorLog.error('An error occured : ' + err);
        }else{
            infoLog.info('Le message d\'accueil a bien été définis : ' + params.welcome_message.message_data.text);
        }
    }
};

//Like someone's tweet
var likeTweet = function (tweetID, authorName) {
    var params = {
        id : tweetID
    };

    twit.post('favorites/create', params, liked);

    function liked(err){
        if(err){
            errorLog.error('An error occured : ' + err);
        }else{
            infoLog.info('Le Tweet de @' + authorName + ' a bien été liké!');
        }
    }
};

//Delete one of your tweets
var deleteTweet = function (tweetID) {
    var params = {
        id: tweetID
    };
    twit.post('statuses/destroy', params, deleted);

    function deleted(err) {
        if (err) {
            errorLog.error('An error occured : ' + err);
        } else {
            infoLog.info('Le Tweet à bien été supprimé');
        }
    }
};

//When you receive a direct message
var receiveMessage = function (event) {
    var to = event.direct_message.recipient.screen_name;
    var splited = event.direct_message.text.toLowerCase().split(' ');
    if (to === config.data.user) {
        if (splited.indexOf('bot') !== -1) {
            //Contient bot
        }
    }
};

//Get ID of one of your tweets with the following text
var getTweetID = function (text) {
    var params = {
        q: text + ' from:' + config.data.user
    };
    twit.get('search/tweets', params, receiveTweet);

    function receiveTweet(err, data) {

        var tweetID;
        if (err) {
            errorLog.error('An error occured : ' + err);
            tweetID = null;
        } else {
            console.log(data);
            if (data.statuses.length === 0) {
                tweetID = null;
            } else {
                console.log(data.statuses.length);
                tweetID = data.statuses[0].id_str;
            }
        }
        return tweetID;
    }
};

//export all functions to the main module (bot.js)
module.exports = {
    init:               init,
    setWelcomeMessage:  setWelcomeMessage,
    quoted:             quoted,
    identified:         identified,
    followed:           followed,
    receiveMessage:     receiveMessage
};

