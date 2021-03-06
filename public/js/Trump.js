var
util29 = new Util29(),
Card;

// server code
try {
    Card = require("./Card").Card;
// client code
} catch(err) {
}

var T_DENOMS = ['2', '3', '4', '5'];
var T_SUITS = ['S', 'H', 'D', 'C'];

var Trump = function() {
    var
    trump = null,
    roundID = -1,
    is7thCard = false,
    _7thCard = null,
    // boolean array(2) to indicate whether each team played a trump or not
    _playedTrump = [false, false],
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

    var seventhCard = function() {
        is7thCard = true;
        return this;
    };

    var isSeventhCard = function() {
        return is7thCard;
    };

    var setSeventhCard = function(card_token) {
        _7thCard = genCard(card_token);
        return this;
    };

    var getSeventhCard = function() {
        return _7thCard;
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
        is7thCard = false;
        _7thCard = null;
        _playedTrump = [false, false];
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

    var shuffle = function() {
        var r_denom = Math.floor(Math.random() * 4);
        var r_suit = Math.floor(Math.random() * 4);
        var r_token = T_DENOMS[r_denom] + ":" + T_SUITS[r_suit];
        console.log("Trump shuffled to: " + r_token);
        trump = genCard(r_token);
    };

    var playedTrump = function(player_id) {
        var team_id = player_id % 2;
        _playedTrump[team_id] = true;
    };

    var hasPlayedTrump = function(team_id) {
        return _playedTrump[team_id];
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
        seventhCard: seventhCard,
        isSeventhCard: isSeventhCard,
        setSeventhCard: setSeventhCard,
        getSeventhCard: getSeventhCard,
        getDenom: getDenom,
        getSuit: getSuit,
        shuffle: shuffle,
        playedTrump: playedTrump,
        hasPlayedTrump: hasPlayedTrump,
        toString: toString
    };
};

// server code
try {
    exports.Trump = Trump;
// client code
} catch(err) {
}