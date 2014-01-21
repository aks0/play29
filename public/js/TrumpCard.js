var
Card;

// server code
try {
    Card = require("./Card").Card;
// client code
} catch(err) {
}

var TrumpCard = function(denom, suit) {
    console.log("setting TrumpCard: " + denom + ":" + suit);
    if (denom !== '2' && denom !== '3' && denom !== '4' && denom !== '5') {
        throw "Invalid trump is set!";
    }

    var
    trumpCard = new Card(denom, suit),
    // by default trump is closed.
    isTrumpOpen = true;

    var isReverse = function() {
        if (trumpCard.getDenom() === '3') {
            return true;
        }
        return false;
    };

    var isNoTrump = function() {
        if (trumpCard.getDenom() === '2') {
            return true;
        }
        return false;
    };

    var isSuitTrump = function() {
        return !(isReverse() || isNoTrump());
    };

    var open = function() {
        isTrumpOpen = true;
        return this;
    };

    var isOpen = function() {
        return isTrumpOpen;
    };

    return {
        isReverse: isReverse,
        isOpen: isOpen,
        open: open,
        isNoTrump: isNoTrump,
        isSuitTrump: isSuitTrump,
        // card functions
        getDenom: trumpCard.getDenom,
        getSuit: trumpCard.getSuit,
        serialize: trumpCard.serialize,
        toString: trumpCard.toString
    };
};

// server code
try {
    exports.TrumpCard = TrumpCard;
// client code
} catch(err) {
}

/**
 * Factory method for creating a new TrumpCard from String "denom:suit"
 */
function genTrumpCard(str) {
    var arr = stripID(str);
    if (arr === null) {
        return null;
    }
    return new TrumpCard(arr[0], arr[1]);
}