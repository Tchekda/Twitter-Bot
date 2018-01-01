var config = require('./config.js');
var Twit = require('twit');
var T = new Twit(config);
var stream = T.stream('user');
var stdin = process.openStdin();
var tweetID;

console.log(config.start);
setWelcome();

stream.on('tweet', tweeted);
stream.on('follow', followed);
stream.on('quoted_tweet', quoted);
stream.on('direct_message', messaged);


stdin.addListener("data", function(d) {
    var input = d.toString().trim();
    switch(input.split(' ')[0]){
        case 'stop':
            console.log(config.stop);
            process.exit();
            break;
        case 'clear':
            process.stdout.write("\u001b[2J\u001b[0;0H");
            console.log('Cleared!')
            break
        default:
            console.log('Commande inconnue!');
    }
  });

function tweeted(event){
    var replyto = event.in_reply_to_screen_name;
    var from = event.user.screen_name;

    if(replyto === config.user){
        likeIt(event.id_str, from);
    }
}

function followed(event){
    var sourceName = event.source.name;
    var screenName = event.source.screen_name;
    console.log(event);
    if(screenName != config.user){
        console.log(sourceName + ' a commencé à vous suivre : @' + screenName);
        tweetIt('@' + screenName + ' merci du follow! #Subscribe');
    }
}

function quoted(event){
    var replyto = event.source.screen_name;
    var from = event.target_object.user.screen_name;

    if(replyto != config.user){
        likeIt(event.target_object.id_str, event.target_object.user.screen_name);
    }
}

function messaged(event){
    var to = event.direct_message.recipient.screen_name;
    var splited = event.direct_message.text.toLowerCase().split(' ');
    if(to === config.user){
        if(splited.indexOf('bot') != -1){
            //Contient bot
        }
    }}

function tweetIt(text){
    var params = {
        status : text
    }

    function logData(err, data, response){
        if(err){
            console.log('Une erreure est survenue : ' + err)
        }else{
           console.log('Votre Tweet à bien été envoyé : ' + text);
        }
    }

    T.post('statuses/update', params, logData)
}

function replaceTweet(text){
    getTweetId(text, function(tweetId){
        if(tweetId === null){
            tweetIt(config.start);
        }else{
            deleteTweet(tweetId);
        }
    });

}

function getTweetId(text, fonction){
    var params = {
        q : text + ' from:' + config.user
    }
    T.get('search/tweets', params, receiveTweet);
    function receiveTweet(err, data, response){

        if(err){
            console.log('Une erreure est survenue : ' + err)
        }else{
            console.log(data);
            if(data.statuses.length === 0){
                tweetID = null;
            }else{
                console.log(data.statuses.length)
                tweetID = data.statuses[0].id_str;
            }
            fonction(tweetID);
        }
    }

}

function deleteTweet(tweetId){
        var params = {
            id : tweetId
        }
        T.post('statuses/destroy', params, deleted);
        function deleted(err, data, response){
            if(err){
                console.log('Une erreure est survenue : ' + err)
            }else{
                tweetIt(config.start);
            }
        }
    }

function likeIt(tweetId, name){
    var params = {
        id : tweetId
    }

    T.post('favorites/create', params, liked);

    function liked(err, data, response){
        if(err){
            console.log('Une erreure est survenue : ' + err)
        }else{
           console.log('Le Tweet de @' + name + ' a bien été liké!');
        }
    }
}

function sendIt(name, msg){
    var params = {
        id : tweetId
    }

    T.post('favorites/create', params, liked);

    function liked(err, data, response){
        if(err){
            console.log('Une erreure est survenue : ' + err)
        }else{
           console.log('Le Tweet de @' + name + ' a bien été liké!');
        }
    }
}
function setWelcome(){
    var params = {
      "welcome_message": {
        "message_data": {
          "text": config.welcome_message,
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
    }

    T.post('direct_messages/welcome_messages/new', params, sended);

    function sended(err, data, response){
        if(err){
            console.log('Une erreure est survenue : ' + err)
        }else{
           console.log('Le message d\'accueil a bien été définis : ' + params.welcome_message.message_data.text);
        }
    }
}
