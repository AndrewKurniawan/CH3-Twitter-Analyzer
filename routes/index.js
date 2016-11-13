var express = require('express');
var locatorToner = require('../getStateAndTone.js');
var toner = require('../getTone.js');
var creds = require("../creds.js");
var googlemaps = require('@google/maps');
var twitter = require('twitter');

/*var client = twitter({
    consumer_key: 'KAU4xzG1J287IsbJxNGkrhzrU',
    consumer_secret: 'pBSJKcqHi1RKGWPRXW43OfEaXLg4Kk5QleM8cwSpeNyHDW0Q6E',
    access_token_key: '2907759110-ArQG3f52WnVauZGays3ABz6XhWMWEzHxXj6iyYD',
    access_token_secret: 'CT8MaLw0NqYsRd26sdkM5QjBQoKDpld9nTCMO1UnsRCqf'
});*/
var client = twitter(creds.twitterKeys);

var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/map/:hashtag', function (req, res, next) {
    res.render('map', {hashtag: "#" + req.params['hashtag']});
});


router.get('/getData/:hashtag', function (req, res, next) {
    // [{lat, long, tweet}, {lat, long, tweet}...]
    var hashtag = req.params['hashtag'];
    console.log("entering");
    /*getTweets(hashtag, function(listOf) {
     console.log(listOf);
     });*/
    var numGeocodesLeft = geocodes.length;
    for (var aaa = 0; aaa < geocodes.length; aaa++) {
        numGeocodesLeft--;
        var geocodex = geocodes[aaa];
        var geolocatedTweets = [];
        var stateEmotionDict = {};
        var numTweetsLeft = 0;
        client.get('search/tweets.json',
            {
                q: '#' + hashtag,
                count: 10,
                geocode: geocodex + ",30mi"
            },
            function (error, tweets, response) {
                //console.log(response);
                //console.log("Entered", tweets.statuses.length);
                for (var i = 0; i < tweets.statuses.length; i++) {
                    if (tweets.statuses[i].user.location) {
                        geolocatedTweets.push({
                            "genloc": tweets.statuses[i].user.location,
                            "tweet": tweets.statuses[i].text
                        });
                    }
                }

                function finishAndConsolidateIfReady() {
                    numTweetsLeft -= 1;
                    if (numTweetsLeft == 0 && numGeocodesLeft == 0) {
                        for (var state in stateEmotionDict) {
                            if (stateEmotionDict.hasOwnProperty(state)) {
                                stateEmotionDict[state] = toner.consolidateTones(stateEmotionDict[state]);
                            }
                        }
                        res.send(stateEmotionDict);
                    }
                }

                for (var jjj = 0; jjj < geolocatedTweets.length; jjj++) {
                    numTweetsLeft += 1;
                    /*locatorToner.appendTweetEmoteDataToDict(geolocatedTweets[jjj]["latitude"], geolocatedTweets[jjj]["longitude"],
                     geolocatedTweets[jjj]["tweet"], stateEmotionDict, finishAndConsolidateIfReady);*/
                    locatorToner.appendGeneralLoc(geolocatedTweets[jjj]["genloc"],
                        geolocatedTweets[jjj]["tweet"], stateEmotionDict, finishAndConsolidateIfReady)
                }
            }
        );

    }
});

module.exports = router;


var geocodes = [
    "61.3850,-152.2683",
    "32.7990,-86.8073",
    "34.9513,-92.3809",
    "33.7712,-111.3877",
    "36.1700,-119.7462",
    "39.0646,-105.3272",
    "41.5834,-72.7622",
    "38.8964,-77.0262",
    "39.3498,-75.5148",
    "27.8333,-81.7170"];
/*,
 "32.9866,-83.6487",
 "21.1098,-157.5311",
 "42.0046,-93.2140",
 "44.2394,-114.5103",
 "40.3363,-89.0022",
 "39.8647,-86.2604",
 "38.5111,-96.8005",
 "37.6690,-84.6514",
 "31.1801,-91.8749",
 "42.2373,-71.5314",
 "39.0724,-76.7902",
 "44.6074,-69.3977",
 "43.3504,-84.5603",
 "45.7326,-93.9196",
 "38.4623,-92.3020",
 "32.7673,-89.6812",
 "46.9048,-110.3261",
 "35.6411,-79.8431",
 "47.5362,-99.7930",
 "41.1289,-98.2883",
 "43.4108,-71.5653",
 "40.3140,-74.5089",
 "34.8375,-106.2371",
 "38.4199,-117.1219",
 "42.1497,-74.9384",
 "40.3736,-82.7755",
 "35.5376,-96.9247",
 "44.5672,-122.1269",
 "40.5773,-77.2640",
 "41.6772,-71.5101",
 "33.8191,-80.9066",
 "44.2853,-99.4632",
 "35.7449,-86.7489",
 "31.1060,-97.6475",
 "40.1135,-111.8535",
 "37.7680,-78.2057",
 "44.0407,-72.7093",
 "47.3917,-121.5708",
 "44.2563,-89.6385",
 "38.4680,-80.9696",
 "42.7475,-107.2085"
 ];*/
