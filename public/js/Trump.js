var
Card;

// server code
try {
    Card = require("./Card").Card;
// client code
} catch(err) {
}

var Trump = function(denom, suit) {
    console.log("setting Trump: " + denom + ":" + suit);
    if (denom !== '2' && denom !== '3' && denom !== '4' && denom !== '5') {
        throw "Invalid trump is set!";
    }

    var
    trump = new Card(denom, suit),
    // by default trump is closed.
    isTrumpOpen = true;

    var isReverse = function() {
        if (trump.getDenom() === '3') {
            return true;
        }
        return false;
    };

    var isNoTrump = function() {
        if (trump.getDenom() === '2') {
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

    var clear = function() {
        
    };

    return {
        isReverse: isReverse,
        isOpen: isOpen,
        open: open,
        isNoTrump: isNoTrump,
        isSuitTrump: isSuitTrump,
        // card functions
        getDenom: trump.getDenom,
        getSuit: trump.getSuit,
        serialize: trump.serialize,
        toString: trump.toString
    };
};

// server code
try {
    exports.Trump = Trump;
// client code
} catch(err) {
}

/**
 * Factory method for creating a new Trump from String "denom:suit"
 */
function genTrump(str) {
    var arr = stripID(str);
    if (arr === null) {
        return null;
    }
    return new Trump(arr[0], arr[1]);
}