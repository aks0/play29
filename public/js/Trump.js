var
Card;

// server code
try {
    Card = require("./Card").Card;
// client code
} catch(err) {
}

var Trump = function() {
    var
    trump = null,
    // by default trump should be closed.
    isTrumpOpen = false;

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
        console.log("Trump is " + toString());
        return this;
    };

    var isOpen = function() {
        return isTrumpOpen;
    };

    var clear = function() {
        trump = null;
        isTrumpOpen = false;
    };

    var isEmpty = function() {
        return trump === null;
    };

    var set = function(trump_token) {
        trump = genCard(trump_token);
    };

    var getDenom = function() {
        return trump.getDenom();
    };

    var getSuit = function() {
        return trump.getSuit();
    };

    var toString = function() {
        return trump.toString();
    };

    return {
        isReverse: isReverse,
        isOpen: isOpen,
        open: open,
        isNoTrump: isNoTrump,
        isSuitTrump: isSuitTrump,
        clear: clear,
        isEmpty: isEmpty,
        set: set,
        getDenom: getDenom,
        getSuit: getSuit,
        toString: toString
    };
};

// server code
try {
    exports.Trump = Trump;
// client code
} catch(err) {
}