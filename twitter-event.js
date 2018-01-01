var config = null;
var twit = null;

var init = function (configuration, twitter) {
    config = configuration;
    twit = twitter;
};

var identified = function (event) {
    var replyto = event.in_reply_to_screen_name;
    var from = event.user.screen_name;

    if(replyto === config.data.user){
        likeTweet(event.id_str, from);
    }
};

var followed = function (event) {
    var sourceName = event.source.name;
    var screenName = event.source.screen_name;
    if(screenName !== config.data.user){
        console.log(sourceName + ' a commencé à vous suivre : @' + screenName);
        tweetText('@' + screenName + ' merci du follow! #Subscribe');
    }
};

var quoted = function (event) {
    var replyto = event.source.screen_name;

    if(replyto !== config.data.user){
        likeTweet(event.target_object.id_str, event.target_object.user.screen_name);
    }
};

var tweetText = function (text) {
    var params = {
        status : text
    };

    function logData(err){
        if(err){
            console.log('Une erreure est survenue : ' + err)
        }else{
            console.log('Votre Tweet à bien été envoyé : ' + text);
        }
    }

    twit.post('statuses/update', params, logData)
};

var setWelcomeMessage = function () {
    var params = {
        "welcome_message": {
            "message_data": {
                "text": config.log.welcome_message,
                "ctas": [
                    {
                        "type": "web_url",
                        "label": "Ma chaine YouTube",
                        "url": "https://www.youtube.com/channel/UCx5CZE6SSovbUK1dvlylJkA"
                    },
                    {
                        "type": "web_url",
                        "label": "Mon site web",
                        "url": "https://www.codeschool.fr"
                    },
                    {
                        "type": "web_url",
                        "label": "Abonner",
                        "url": "https://twitter.com/intent/follow?screen_name=tchekda"
                    }
                ]
            }
        }
    };

    twit.post('direct_messages/welcome_messages/new', params, sended);

    function sended(err){
        if(err){
            console.log('Une erreure est survenue : ' + err)
        }else{
            console.log('Le message d\'accueil a bien été définis : ' + params.welcome_message.message_data.text);
        }
    }
};

var likeTweet = function (tweetID, authorName) {
    var params = {
        id : tweetID
    };

    twit.post('favorites/create', params, liked);

    function liked(err){
        if(err){
            console.log('Une erreure est survenue : ' + err)
        }else{
            console.log('Le Tweet de @' + authorName + ' a bien été liké!');
        }
    }
};

var deleteTweet = function (tweetID) {
    var params = {
        id: tweetID
    };
    twit.post('statuses/destroy', params, deleted);

    function deleted(err) {
        if (err) {
            console.log('Une erreure est survenue : ' + err)
        } else {
            console.log('Le Tweet à bien été supprimé');
        }
    }
};

var receiveMessage = function (event) {
    var to = event.direct_message.recipient.screen_name;
    var splited = event.direct_message.text.toLowerCase().split(' ');
    if (to === config.data.user) {
        if (splited.indexOf('bot') !== -1) {
            //Contient bot
        }
    }
};

var getTweetID = function (text) {
    var params = {
        q: text + ' from:' + config.data.user
    };
    twit.get('search/tweets', params, receiveTweet);

    function receiveTweet(err, data) {

        var tweetID;
        if (err) {
            console.log('Une erreure est survenue : ' + err);
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

module.exports = {
    init:               init,
    setWelcomeMessage:  setWelcomeMessage,
    tweetText:          tweetText,
    quoted:             quoted,
    identified:         identified,
    followed:           followed,
    receiveMessage:     receiveMessage
};

