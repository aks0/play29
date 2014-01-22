var
Card,
TrumpCard;

// server code
try {
    Card = require("./Card").Card;
    TrumpCard = require("./TrumpCard").TrumpCard;
// client code
} catch(err) {
}

var Pot = function() {
    var
    pot = new Array(),
    cardtokenToTurnIDMap = new Object();

    var isEmpty = function() {
        if (pot === null || pot.length === 0) {
            return true;
        }
        return false;
    };

    // token of cards in the pot
    var addCard = function(card_token, turnID) {
        if (pot.length === 4) {
            throw "Pot full with 4 cards. No space for " + card_token;
        }
        var card = genCard(card_token);
        pot.push(card);
        cardtokenToTurnIDMap[card_token] = turnID;
    };

    var clear = function() {
        pot = new Array();
    };

    var size = function() {
        return pot.length;
    };

    var handleNoTrumpWinner = function(trump) {
        var winning_card_index = 0;
        var base_suit = pot[winning_card_index].getSuit();
        for (var i = 1; i < pot.length; i++) {
            if (pot[i].getSuit() !== base_suit) {
                continue;
            } else if (trump.isReverse()) {
                if (pot[i].getRank() < pot[winning_card_index].getRank()) {
                    winning_card_index = i;
                }
            } else if (pot[i].getRank() > pot[winning_card_index].getRank()) {
                winning_card_index = i;
            }
        }
        return pot[winning_card_index];
    };

    var handleTrumpWinner = function(trump) {
        // find if somebody played a trump
        var trump_played_index = -1;
        for (var i = 0; i < pot.length; i++) {
            if (pot[i].getSuit() === trump.getSuit()) {
                trump_played_index = i;
                break;
            }
        }

        // nobody played a trump
        if (trump_played_index == -1) {
            return this.handleNoTrumpWinner(trump);
        }
        
        // somebody played a trump
        var winning_card_index = trump_played_index;
        for (var i = trump_played_index + 1; i < pot.length; i++) {
            if (pot[i].getSuit() !== trump.getSuit()) {
                continue;
            } else if (pot[i].getRank() > pot[winning_card_index].getRank()) {
                winning_card_index = i;
            }
        }
        return pot[winning_card_index];
    };

    var getPotWinner = function(trump) {
        if (!trump.isOpen() || !trump.isSuitTrump()) {
            return handleNoTrumpWinner(trump);
        } else {
            return handleTrumpWinner(trump);
        }
    };

    var cardPlayedBy = function(card_token) {
        return cardtokenToTurnIDMap[card_token];
    };

    var getPoints = function() {
        var points = 0;
        for (var i = 0; i < pot.length; i++) {
            points += pot[i].getPoints();
        }
        return points;
    };

    return {
        isEmpty: isEmpty,
        addCard: addCard,
        size: size,
        getPotWinner: getPotWinner,
        getPoints: getPoints,
        cardPlayedBy: cardPlayedBy,
        clear: clear
    };
};

// server code
try {
    exports.Pot = Pot;
// client code
} catch(err) {
}