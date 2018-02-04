//Setting up local varaibles
var config = null,
    twit = null,
    errorLog = null,
    infoLog = null;

//Receive all data
var init = function (infos) {
    config = infos.config;
    twit = infos.twit;
    errorLog = infos.errorLog;
    infoLog = infos.infoLog;
}

//When you are identified in a tweet
var identified = function (event) {
    if (event.user.id != config.data.userID){
        for (var i = 0, len = event.entities.user_mentions.length; i < len; i++) {
            if(event.entities.user_mentions[i].id == config.data.userID){
                likeTweet(event.id_str, event.user)
                break
            }
        }
    }
}

//When you are followed by someone
var followed = function (event) {
    if(event.source.id !== config.data.userID){
        infoLog.info(replaceAll(config.console.new_follower, event.source.screen_name, event.source.name))
        tweetText(replaceAll(config.messages.new_follower, event.source.screen_name, event.source.name))
    }
}

//When one of your tweet is quoted
var quoted = function (event) {
    if(event.source.id !== config.data.userID){
        likeTweet(event.target_object.id_str, event.target_object.user)
    }
}

//To Tweet some text
var tweetText = function (text) {
    var params = {
        status : text
    }
    twit.post('statuses/update', params, logData)
    function logData(err){
        if(err){
            errorLog.error('An error occured : ' + err)
        }else{
            infoLog.info(config.console.tweeted.replace('/%text%/gi', text))
        }
    }
}

//Define Welcome Message in Direct Messages
var setWelcomeMessage = function () {
    var params = {
        "welcome_message": {
            "message_data": {
                "text": config.messages.welcome_message
            }
        }
    }

    twit.post('direct_messages/welcome_messages/new', params, sended)

    function sended(err){
        if(err){
            errorLog.error('An error occured : ' + err)
        }else{
            infoLog.info(config.console.welcome_message_defined.replace(/%text%/gi, params.welcome_message.message_data.text))
        }
    }
}

//Like someone's tweet
var likeTweet = function (tweetID, author) {
    var params = {
        id : tweetID
    }

    twit.post('favorites/create', params, liked)

    function liked(err){
        if(err){
            errorLog.error('An error occured : ' + err)
        }else{
            infoLog.info(replaceAll(config.console.liked, author.screen_name, author.name))
        }
    }
}

//Delete one of your tweets
var deleteTweet = function (tweetID) {
    var params = {
        id: tweetID
    }
    twit.post('statuses/destroy', params, deleted)

    function deleted(err) {
        if (err) {
            errorLog.error('An error occured : ' + err)
        } else {
            infoLog.info(config.console.tweet_deleted)
        }
    }
}

//When you receive a direct message
var receiveMessage = function (event) {
    var to = event.direct_message.recipient.screen_name,
        splited = event.direct_message.text.toLowerCase().split(' ');
    if (event.direct_message.recipient.id === config.data.userID) {
        if (splited.indexOf('bot') !== -1) {
            //In developpement
        }
    }
}

//Get ID of one of your tweets with the following text
var getTweetID = function (text) {
    var params = {
        q: text + ' from:' + config.data.user
    }

    twit.get('search/tweets', params, tweets)

    function tweets(err, data) {
        var tweetID = null
        if (err) {
            errorLog.error('An error occured : ' + err)
        } else {
            if (data.statuses.length === 0) {
                tweetID = null
            } else {
                tweetID = data.statuses[0].id_str
            }
        }
        return tweetID
    }
}

var retweetKeyWord = function (tweet) {
    //In developpement
}

var retweetTweetID = function (id) {
    twit.post('statuses/retweet/:id', { id: id }, callback)
    function callback(err, data){
        if (err){
            errorLog.error('An Error Occured while trying to retweet ' + err)
        }else{
            infoLog.log(replaceAll(config.console.retweeted, data.user.screen_name, data.user.name))
        }
    }
}

var regexAll = function(text, username = null, name = null) {
    if (username)
        text.replace(/%username%/gi, username)
    if (name)
        text.replace(/%name%/gi, name)
    return text
}

//export all functions to the main module (bot.js)
module.exports = {
    init:               init,
    setWelcomeMessage:  setWelcomeMessage,
    quoted:             quoted,
    identified:         identified,
    followed:           followed,
    receiveMessage:     receiveMessage,
    retweetKeyWords:    retweetKeyWord
}

