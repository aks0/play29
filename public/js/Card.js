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