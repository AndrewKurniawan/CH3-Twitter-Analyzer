/**
 * Created by Doge on 11/12/2016.
 */

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var creds = require("./creds.js");
module.exports = {};

class toneObj {
    constructor(emotDict) {
        this.tones = emotDict;
    }

    toString() {
        var toRet = "";
        for (var toneCat in this.tones) {
            if (this.tones.hasOwnProperty(toneCat)) {
                toRet += `${toneCat}\n`;
                for (var oneTone in this.tones[toneCat]) {
                    if (this.tones[toneCat].hasOwnProperty(oneTone)) {
                        toRet += `\t${oneTone} : ${this.tones[toneCat][oneTone]}\n`;
                    }
                }
            }
        }
        return toRet
    }
}
function consolidateToneObjs(listObjs) {
    var base = {
        "Emotion Tone": {
            "Anger": 0,
            "Disgust": 0,
            "Fear": 0,
            "Joy": 0,
            "Sadness": 0
        },
        "Language Tone": {
            "Analytical": 0,
            "Confident": 0,
            "Tentative": 0
        },
        "Social Tone": {
            "Openness": 0,
            "Conscientiousness": 0,
            "Extraversion": 0,
            "Agreeableness": 0,
            "Emotional Range": 0
        }
    };
    for (var iii = 0; iii < listObjs.length; iii++) {
        var listObj = listObjs[iii];
        for (var toneCat in listObj.tones) {
            if (listObj.tones.hasOwnProperty(toneCat)) {
                var tonesInCat = listObj.tones[toneCat];
                for (var tone in tonesInCat) {
                    if (tonesInCat.hasOwnProperty(tone)) {
                        base[toneCat][tone] += tonesInCat[tone] / listObjs.length;
                    }
                }
            }
        }
    }
    return base;
    //TODO
}

module.exports.toneObj = toneObj;
module.exports.consolidateTones = consolidateToneObjs;

function getToneObj(emD) {
    var emotDict = {};
    var toneCatList = emD["document_tone"]["tone_categories"];
    for (var iii = 0; iii < toneCatList.length; iii++) {
        var toneCategory = toneCatList[iii];
        emotDict[toneCategory["category_name"]] = {};
        for (var jjj = 0; jjj < toneCategory["tones"].length; jjj++) {
            tone = toneCategory["tones"][jjj];
            emotDict[toneCategory["category_name"]][tone["tone_name"]] = tone["score"];
        }
    }
    return new toneObj(emotDict);
}
var tA = new ToneAnalyzerV3({
    username: creds.CREDENTIALS["username"],
    password: creds.CREDENTIALS["password"],
    version_date: '2016-05-19'
});
/*
 tA.tone({text: 'Greetings from Watson Developer Cloud!'},
 function (err, tone) {
 if (err)
 console.log(err);
 else
 console.log(getToneObj(tone).toString());
 });*/

function getToneOfText(str, addTo, callback) {
    tA.tone({text: str},
        function (err, tone) {
            if (err || addTo == null)
                return;
            else
                addTo.push(getToneObj(tone));
            if (callback != null) {
                callback();
            }
        });
}
module.exports.getToneOfText = getToneOfText;

//testing below
/*
 var arr = [];

 getToneOfText("Hello, my name is Bob", arr, function() {
 console.log(arr[0]);
 });*/