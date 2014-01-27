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
    roundID = -1,
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

    var open = function(round_id) {
        if (round_id === undefined) {
            throw "You must define the round_id in order to open trump";
        }
        isTrumpOpen = true;
        roundID =  round_id;
        console.log("Trump is " + toString());
        return this;
    };

    var isOpen = function() {
        return isTrumpOpen;
    };

    var openedInRound = function() {
        return roundID;
    };

    var clear = function() {
        trump = null;
        isTrumpOpen = false;
        roundID = -1;
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
        openedInRound: openedInRound,
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