/**
 * Created by Doge on 10/24/2016.
 */
"use strict";

var map;
var layer0;
var hashtag;
var currEmoteType = "Emotion Tone";
var emotionData = {
    "California": {
        'Emotion Tone': {
            'Anger': 0.126024,
            'Disgust': 0.064759,
            'Fear': 0.05291,
            'Joy': 0.551253,
            'Sadness': 0.248985
        },
        'Language Tone': {'Analytical': 1, 'Confident': .2, 'Tentative': .4},
        'Social Tone': {
            'Openness': 0.382079,
            'Conscientiousness': 0.271994,
            'Extraversion': 0.538118,
            'Agreeableness': 0.593281,
            'Emotional Range': 0.280439
        }
    },
    "New York": {
        'Emotion Tone': {
            'Anger': 0.76024,
            'Disgust': 0.064759,
            'Fear': 0.55291,
            'Joy': 0.921253,
            'Sadness': 0.048985
        },
        'Language Tone': {'Analytical': .3, 'Confident': 0, 'Tentative': 0},
        'Social Tone': {
            'Openness': 0.382079,
            'Conscientiousness': 0.271994,
            'Extraversion': 0.538118,
            'Agreeableness': 0.593281,
            'Emotional Range': 0.280439
        }
    }
};
var colorMapping = {
    'Emotion Tone': {
        'Anger': [255, 0, 0],
        'Disgust': [255, 255, 0],
        'Fear': [0, 255, 255],
        'Joy': [0, 255, 0],
        'Sadness': [0, 0, 255]
    },
    'Language Tone': {
        'Analytical': [255, 0, 0],
        'Confident': [0, 255, 0], 'Tentative': [0, 0, 255]
    },
    'Social Tone': {
        'Openness': [255, 0, 0],
        'Conscientiousness': [255, 255, 0],
        'Extraversion': [0, 255, 255],
        'Agreeableness': [0, 255, 0],
        'Emotional Range': [0, 0, 255]
    }
};

function setHashtag(ht) {
    hashtag = ht;
}

$(document).ready(function () {
    console.log("READY");
    //for everything
    $("header").load("/info/header.html", null, loadSearch);
    $("footer").load("/info/footer.html");
    map = $K.map("#kartomap1", 800, 600);
    map.loadMap('/mapsrc/usa.svg', onMapLoad);
    $(".preventEnterSubmit").each(function (i, x) {
        $(x).keypress(function (e) {
            if (e.keyCode == "13") {
                e.preventDefault();
            }
        });
    });

    $("#submit").click(function(event) {
        var hashtag = $("input:first").val();
        console.log(hashtag);
        // TODO: format request to "/search?hashtag"
        // send request to server (https://twitterwatson.herokuapp.com/)
        // receive response, which will be in the following format:
        // {
        //   tweets: [
        //     {
        //        text: "Donald Trump is blah",
        //        coordinates: [ 34.2398, -122.293 ]
        //     }
        //     ...
        //   ]  
        // }
    })
});

function onMapLoad() {
    hashtag = window.location.pathname.split("/").pop();
    $.get("/getData/" + hashtag, null, function (emotData) {
        emotionData = emotData;
        showToneMap(null, "Emotion");
    });
    map.addLayer('layer0', {
        styles: {
            stroke: '#aaa',
            fill: '#808080'
        },
        mouseenter: function (d, path) {
            console.log(path);
            tooltipInfo(d.label);
            $("#tooltip").css({display: 'block'});
            path.toFront();
            //$(path)[0][0].style.transformOrigin ="initial";
            //$(path)[0][0].style.transform ="scale(1.5)";
            //$(path)[0][0].style.zIndex ="5";
            //$(path)[0][0].style.zIndex ="5";
            //path.animate({size: 1.5*path.attr("width")}, 1000);
        },
        mouseleave: function (d, path) {
            $("#tooltip").css({display: 'none'});
            //$(path)[0][0].style.transform ="scale(1.0)";
            //$(path)[0][0].style.zIndex ="1";
            //path.animate({fill: getStateFill(d)}, 1000);
        }
    });
    layer0 = map.getLayer('layer0');

    $(".kartograph svg").css("position", "static");
}
$(document).mousemove(function (e) {
    $("#tooltip").css({left: e.pageX, top: e.pageY});
});

var shortEmoteMap = {
    'Conscientiousness': 'Conscient.',
    'Agreeableness': 'Agreeable',
    'Emotional Range': 'Range',
    'Extraversion': 'Extravert.'
};

function tooltipInfo(state) {
    $("#tooltipTitle").html(state);
    var toRet = "";
    if (emotionData.hasOwnProperty(state)) {
        var emoteList = emotionData[state][currEmoteType];
        for (var emotion in emoteList) {
            if (emoteList.hasOwnProperty(emotion)) {
                var shortemotion = emotion;
                if (shortEmoteMap.hasOwnProperty(emotion)) {
                    shortemotion = shortEmoteMap[emotion];
                }
                var spanWidth = 85 * emoteList[emotion];
                var altSpanWidth = 85 - spanWidth;
                toRet += '<div class="ttValFlex"><span class="ttValName">' + shortemotion + '</span>' +
                    '<span class="ttbar" style="width:' + altSpanWidth + 'px"></span>' +
                    '<span class="ttbar" style="width:' + spanWidth + 'px; background-color:' + chroma(colorMapping[currEmoteType][emotion]).hex() + '">' /*+ emoteList[emotion].toFixed(3) */ + '</span>' +
                    '</div>'
            }
        }
    } else {
        toRet = "No data";
    }
    $("#tooltipVals").html(toRet);
}

function getStateFill(stateObj) {
    return (stateObj.label < "MMM") ? "#cccccc" : "#cccccc";
}

function getStateFillEmotionTone(stateObj) {
    return getStateFillByTone(stateObj, "Emotion Tone");
}
function getStateFillLanguageTone(stateObj) {
    return getStateFillByTone(stateObj, "Language Tone");
}
function getStateFillSocialTone(stateObj) {
    return getStateFillByTone(stateObj, "Social Tone");
}
function getStateFillByTone(stateObj, toneCat) {
    if (emotionData.hasOwnProperty(stateObj.label)) {
        var bcolor = [0, 0, 0];
        for (var emotion in emotionData[stateObj.label][toneCat]) {
            if (emotionData[stateObj.label][toneCat].hasOwnProperty(emotion)) {
                var emotValue = emotionData[stateObj.label][toneCat][emotion];
                var emotColor = colorMapping[toneCat][emotion];
                var addColor = [emotColor[0] * emotValue,
                    emotColor[1] * emotValue,
                    emotColor[2] * emotValue];
                bcolor = [bcolor[0] + addColor[0],
                    bcolor[1] + addColor[1],
                    bcolor[2] + addColor[2]];
            }
        }
        return chroma(bcolor).hex();
    } else {
        return getStateFill(stateObj);
    }
}

function legendObjects(dict) {
    console.log("Legending:", dict);
    var toRet = "";
    for (var colorMap in dict) {
        if (dict.hasOwnProperty(colorMap)) {
            toRet += '<div class="spaceBwCenterFlex">' + colorMap +
                '<div class="block" style="background-color:' + chroma(dict[colorMap]).hex() + '"></div>' +
                '</div>'
        }
    }
    $("#legenditems").html(toRet);
    /*
     <div class="spaceBwCenterFlex">Anger
     <div class="block"></div>
     </div>
     */
}

function showToneMap(evt, toneType) {
    $("#EmotionToneButton").removeClass("curr");
    $("#LanguageToneButton").removeClass("curr");
    $("#SocialToneButton").removeClass("curr");
    $("#" + toneType + "ToneButton").addClass("curr");
    currEmoteType = toneType + " Tone";
    $("#legendtitle").html(currEmoteType);
    legendObjects(colorMapping[currEmoteType]);
    if (toneType == "Emotion") {
        map.getLayer("layer0").style('fill', function (data) {
            return getStateFillEmotionTone(data);
        });
    } else if (toneType == "Language") {
        map.getLayer("layer0").style('fill', function (data) {
            return getStateFillLanguageTone(data);
        });
    } else {
        map.getLayer("layer0").style('fill', function (data) {
            return getStateFillSocialTone(data);
        });
    }
}

function loadSearch() {
    /*
     $.get("/cardsFullList", null, function (arr) {
     $("#cardsearch").autocomplete({
     source: arr,
     appendTo: $("#suggestions"),
     delay: 100,
     minLength: 2
     });
     });

     $("#cardsearchForm").on("submit", goToCard);*/
}

//# sourceMappingURL=universalLoader.js.map