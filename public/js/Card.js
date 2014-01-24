var
util29;

// server code
try {
    util29 = require("./Util29").Util29();
// client code
} catch(err) {
    util29 = new Util29();
}

var Card = function(denom, suit) {
    var
    denom = denom,
    suit = suit;

    var getDenomName = function() {
        switch(denom) {
        case '2': return 'two';
        case '3': return 'three';
        case '4': return 'four';
        case '5': return 'five';
        case '6': return 'six';
        case '7': return 'seven';
        case '8': return 'eight';
        case '9': return 'nine';
        case '10': return 'ten';
        case 'J': return 'jack';
        case 'Q': return 'queen';
        case 'K': return 'king';
        case 'A': return 'ace';
        default: return '';
        }
    };

    var getSuitName = function() {
        switch(suit) {
        case 'C': return "club";
        case 'S': return "spade";
        case 'D': return "diamond";
        case 'H': return "heart";
        default: return "";
        }
    }

    var getDenom = function() {
        return denom;
    }

    var getSuit = function() {
        return suit;
    }

    var getRank = function() {
        switch(denom) {
            case '7': return 0;
            case '8': return 1;
            case 'Q': return 2;
            case 'K': return 3;
            case '10': return 4;
            case 'A': return 5;
            case '9': return 6;
            case 'J': return 7;
            default: return -1;
        }
    };

    var getPoints = function() {
        switch(denom) {
            case '7': 
            case '8': 
            case 'Q': 
            case 'K': return 0;
            case '10': 
            case 'A': return 1;
            case '9': return 2;
            case 'J': return 3;
            default: return -1;
        }
    };

    var equals = function(ocard) {
        if (ocard === null) {
            return false;
        }
        if (ocard.getDenom() === this.getDenom() &&
            ocard.getSuit() === this.getSuit()) {
            return true;
        }
        return false;
    };

    var toString = function() {
        var
        s_denom = util29.toProperNoun(getDenomName()),
        s_suit = util29.toProperNoun(getSuitName());
        return s_denom + " of " + s_suit;
    };

    var serialize = function() {
        return denom + ":" + suit;
    };

    return {
        getDenomName: getDenomName,
        getSuitName: getSuitName,
        getDenom: getDenom,
        getSuit: getSuit,
        getRank: getRank,
        getPoints: getPoints,
        equals: equals,
        serialize: serialize,
        toString: toString
    };
};

// server code
try {
    exports.Card = Card;
// client code
} catch(err) {
}

/**
 * Strips denom and suit from "denom:suit"
 * Returns array with [0] = denom and [1] = suit
 */
function stripID(str) {
    if (str.indexOf(':') === -1) {
        return null;
    }
    var arr = str.split(":");
    return arr;
}

/**
 * Factory method for creating a new Card from String "denom:suit"
 */
function genCard(str) {
    var arr = stripID(str);
    if (arr === null) {
        return null;
    }
    return new Card(arr[0], arr[1]);
}
/******************************************************************************/
// Card construction code

// adds a new attribute to the given card code
function addAttribute(card_html, attr, value) {
    var new_code = card_html.replace(
    'marker_tag=""',
    attr + '=\"' + value + '\"' + ' marker_tag=""'
    );
    return new_code;
}

function isValidCard(denom, suit) {
    switch(suit) {
    case 'C':
    case 'D':
    case 'S':
    case 'H':break;
    default: return false;
    }

    switch(denom) {
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '10':
    case 'J':
    case 'Q':
    case 'K':
    case 'A': break;
    default: return false;
    }
    return true;
};

function suitToCode(suit) {
    switch(suit) {
    case 'C': return "&#9827;";
    case 'D': return "&#9830;";
    case 'S': return "&#9824;";
    case 'H': return "&#9829;";
    default: return "";
    }
}

function suitToName(suit) {
    switch(suit) {
    case 'C': return "club";
    case 'S': return "spade";
    case 'D': return "diamond";
    case 'H': return "heart";
    default: return "";
    }
}

function denomToName(denom) {
    switch(denom) {
    case '2': return 'two';
    case '3': return 'three';
    case '4': return 'four';
    case '5': return 'five';
    case '6': return 'six';
    case '7': return 'seven';
    case '8': return 'eight';
    case '9': return 'nine';
    case '10': return 'ten';
    case 'J': return 'jack';
    case 'Q': return 'queen';
    case 'K': return 'king';
    case 'A': return 'ace';
    default: return '';
    }
}

function getSpanTag(suit, direction) {
    var tag = "<span class=\"suit " + direction + "\">" +
    suitToCode(suit) + "</span>";
    return tag;
}

function matchAny(denom, suit, denoms, direction) {
    var data = "";
    for(var i = 0; i < denoms.length; i++) {
    if (denom == denoms[i]) {
        data += getSpanTag(suit, direction);
    }
    }
    return data;
}

function computeSuitPoints(denom, suit) {
    var data = "";
    var dirs = ["top_left", "top_center", "top_right",
        "middle_top_left", "middle_top_center", "middle_top_right",
        "middle_left", "middle_center", "middle_right",
        "middle_bottom_left", "middle_bottom_center",
        "middle_bottom_right", "bottom_left", "bottom_center",
        "bottom_right"];

    data += matchAny(denom, suit, ['4', '5', '6', '7', '8', '9','10'], dirs[0]);
    data += matchAny(denom, suit, ['2', '3'], dirs[1]);
    data += matchAny(denom, suit, ['4', '5', '6', '7', '8', '9','10'], dirs[2]);
    data += matchAny(denom, suit, ['9', '10'], dirs[3]);
    data += matchAny(denom, suit, ['7', '8', '10'], dirs[4]);
    data += matchAny(denom, suit, ['9', '10'], dirs[5]);
    data += matchAny(denom, suit, ['6', '7', '8'], dirs[6]);
    data += matchAny(denom, suit, ['3', '5', '9', 'A'], dirs[7]);
    data += matchAny(denom, suit, ['6', '7', '8'], dirs[8]);
    data += matchAny(denom, suit, ['9', '10'], dirs[9]);
    data += matchAny(denom, suit, ['8', '10'], dirs[10]);
    data += matchAny(denom, suit, ['9', '10'], dirs[11]);
    data += matchAny(denom, suit, ['4', '5', '6', '7', '8','9','10'], dirs[12]);
    data += matchAny(denom, suit, ['2', '3'], dirs[13]);
    data += matchAny(denom, suit, ['4', '5', '6', '7', '8','9','10'], dirs[14]);
    return data;
}

function isFaceCard(denom) {
    if (denom == "J" || denom == "Q" || denom == "K") {
       return true;
    }
    return false;
}

function cardHTML(denom, suit) {
    if (!isValidCard(denom, suit)) {
        throw "not a valid card: " + denom + " " + suit;
    }

    var card = "";

    // <div id="9D" class="card diamond nine" onclick="cardClicked(this)">
    card += "<div id=\"" + denom + ":" + suit + "\" class=\"card " +
    suitToName(suit) + " " + denomToName(denom) + "\"" +
    " marker_tag=\"\"" +
    " onclick=\"cardClicked(this)\">";

    // <div class="corner top">
    card += "<div class=\"corner top\">";

    // <span class="number">9</span>
    card += "<span class=\"number\">" + denom + "</span>"

    // <span>&#9827;</span>
    card += "<span>" + suitToCode(suit) + "</span>";

    // </div>
    card += "</div>";

    if (isFaceCard(denom)) {
        // <div class="container">
        card += "<div class=\"container\">";

        // <img src="./faces/face-queen-diamond.png" class="image_container"/>
        card += "<img src=\"./faces/face-" + denomToName(denom) +
            "-" + suitToName(suit) + ".png\" class=\"image_container\"/>";

        // </div>
        card += "</div>";
    } else {
        // middle suit spots
        card += computeSuitPoints(denom, suit);
    }

    // <div class="corner bottom">
    card += "<div class=\"corner bottom\">";

    // <span class="number">9</span>
    card += "<span class=\"number\">" + denom + "</span>"

    // <span>&#9827;</span>
    card += "<span>" + suitToCode(suit) + "</span>";

    // </div>
    card += "</div>";

    // </div>
    card += "</div>";

    return card;
}