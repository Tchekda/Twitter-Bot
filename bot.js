var config = require('./config.js');
var Twit = require('twit');
var eventModule = require('./twitter-event.js');
var twit = new Twit(config);
var stream = twit.stream('user');
var stdin = process.openStdin();

eventModule.init(config, twit);

console.log(config.start);
setWelcome();

stream.on('tweet', identified);
stream.on('follow', followed);
stream.on('quoted_tweet', quoted);
stream.on('direct_message', receiveMessage);


stdin.addListener("data", function (d) {
    var input = d.toString().trim();
    switch (input.split(' ')[0]) {
        case 'stop':
            console.log(config.stop);
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
function identified(e){eventModule.identified(e)}function followed(e){eventModule.followed(e)}function quoted(e){eventModule.quoted(e)}function receiveMessage(e){eventModule.receiveMessage(e)}function tweetIt(e){eventModule.tweetText(e)}function setWelcome(){eventModule.setWelcomeMessage()}
