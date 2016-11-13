/**
 * Created by Doge on 11/12/2016.
 */

var creds = require("./creds.js");
var toner = require("./getTone.js");
var http = require('https');
module.exports = {};

function getState(jsonDat) {
    if (jsonDat["results"].length == 0) { return; }
    var adrComp = jsonDat["results"][0]["address_components"];
    for (var iii = 0; iii < adrComp.length; iii++) {
        if (adrComp[iii]["types"].indexOf("administrative_area_level_1") > -1) { //state
            return (adrComp[iii]["long_name"]);
        }
    }
}

function appendTweetToDict(lat, long, tweet, dic, callback) {
    var options = {
        host: 'maps.googleapis.com',
        path: `/maps/api/geocode/json?latlng=${lat},${long}&key=${creds.googleKey}`
    };
    http.request(options, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            var jsonLocData = JSON.parse(str);
            var state = getState(jsonLocData);
            if (state == null) { return; }
            if (!dic.hasOwnProperty(state)) {
                dic[state] = [];
            }
            toner.getToneOfText(tweet, dic[state], callback);
        });
    }).end();
}
var count = 0;
var legitCount = 0;
function appendTweetToDictGenLoc(loc, tweet, dic, callback) {
    loc = loc.replace(/[^a-zA-Z0-9]/g, "");
    var options = {
        host: 'maps.googleapis.com',
        path: `/maps/api/geocode/json?address=${loc}&key=${creds.googleKey}`
    };
    http.request(options, function (response) {
        count++;
        console.log(count);
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            var jsonLocData = JSON.parse(str);
            var state = getState(jsonLocData);
            if (states_hash.hasOwnProperty(state)) {
                legitCount += 1;
                console.log(loc,"||",legitCount, state);
                if (!dic.hasOwnProperty(state)) {
                    dic[state] = [];
                }
                toner.getToneOfText(tweet, dic[state], callback);
            } else if (callback != null) {
                callback();
            }
        });
    }).end();
}

module.exports.appendTweetEmoteDataToDict = appendTweetToDict;
module.exports.appendGeneralLoc = appendTweetToDictGenLoc;
module.exports.getState = getState;




var states_hash =
{
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District Of Columbia': 'DC',
    'Federated States Of Micronesia': 'FM',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Marshall Islands': 'MH',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Palau': 'PW',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
};