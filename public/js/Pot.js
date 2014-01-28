var
Card,
Trump;

// server code
try {
    Card = require("./Card").Card;
    Trump = require("./Trump").Trump;
// client code
} catch(err) {
}

var Pot = function() {
    var
    pot = new Array(),
    lastHand = null,
    // chance token being passed around
    cToken = -1,
    cardtokenToTurnIDMap = new Object();

    var isEmpty = function() {
        if (pot === null || pot.length === 0) {
            return true;
        }
        return false;
    };

    var get = function(index) {
        if (index >= pot.length || index < 0) {
            return null;
        }
        return pot[index];
    };

    // token of cards in the pot
    var addCard = function(card_token, turnID) {
        if (pot.length === 4) {
            for (var i = 0; i < pot.length; i++) {
                console.log(pot[i].toString());
            }
            throw "Pot full with 4 cards. No space for " + card_token;
        }
        var card = genCard(card_token);
        pot.push(card);
        cardtokenToTurnIDMap[card_token] = turnID;
        cToken = (cToken + 1) % 4;
        console.log("CToken: " + getCToken());
    };

    var clear = function() {
        lastHand = pot;
        setTimeout(
            function(){
                for (var i = 0; i < 4; i++) {
                    document.getElementById("pcard" + i).innerHTML = "";
                }
                pot = new Array();
            },
            100
        );
        cToken = -1;
    };

    var size = function() {
        return pot.length;
    };

    var handleNoTrumpWinner = function(trump, current_round_id) {
        var winning_card_index = 0;
        var base_suit = pot[winning_card_index].getSuit();
        for (var i = 1; i < pot.length; i++) {
            if (pot[i].getSuit() !== base_suit) {
                continue;
            } else if (trump.isOpen() &&
                trump.isReverse() &&
                // reverse trump is activated in the next hand play only
                trump.openedInRound() < current_round_id) {
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
            return handleNoTrumpWinner(trump);
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

        var winning_card = pot[winning_card_index];
        trump.playedTrump(cardtokenToTurnIDMap[winning_card.getToken()]);
        return winning_card;
    };

    var getPotWinner = function(trump, current_round_id) {
        // neither open nor a suit trump
        if (!trump.isOpen() || !trump.isSuitTrump()) {
            return handleNoTrumpWinner(trump, current_round_id);
        // open and a suit trump
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

    var getLastHand = function() {
        return lastHand;
    };

    var getCToken = function() {
        return cToken;
    };

    var setCToken = function(arg) {
        cToken = arg;
        return this;
    };

    return {
        get: get,
        isEmpty: isEmpty,
        addCard: addCard,
        size: size,
        getPotWinner: getPotWinner,
        getPoints: getPoints,
        cardPlayedBy: cardPlayedBy,
        getLastHand: getLastHand,
        getCToken: getCToken,
        setCToken: setCToken,
        clear: clear
    };
};

// server code
try {
    exports.Pot = Pot;
// client code
} catch(err) {
}