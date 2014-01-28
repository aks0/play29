var
Pot,
GameScore,
util29,
Bid,
Round,
Trump,
Hand;

// server code
try {
    Hand = require("./Hand").Hand;
    Pot = require("./Pot").Pot;
    util29 = require("./Util29").Util29();
    GameScore = require("./GameScore").GameScore;
    Bid = require("./Bid").Bid;
    Trump = require("./Trump").Trump;
    Round = require("./Round").Round;
// client code
} catch(err) {
    util29 = new Util29();
}

var Player = function(l_id, l_name) {
    var
    id = l_id,
    name = l_name,
    turnID = -1,
    // all players
    allPlayers = [],
    // hand that the player currently owns
    hand = new Hand(),
    // pot cards which the player can see
    pot = new Pot(),
    points = null,
    round = new Round(),
    team = -1,
    gameScores = new Array(),
    bid = new Bid(),
    isAlphaPartnerSet = false,
    trump = new Trump();

    var getID = function() {
        return id;
    };

    var getName = function() {
        return name;
    };

    var toString = function() {
        return name;
    };

    var equals = function(player) {
        return (name === player.getName()) && (id === player.getID());
    };

    var getTrump = function() {
        return trump;
    };

    var getTurnID = function() {
        if (turnID === -1) {
            computeTurnID();
        }
        return turnID;
    };

    var getPlayerAt = function(i) {
        if (allPlayers.length === 0 || i < 0 || allPlayers.length <= i) {
            throw "invalid index provided.";
        }
        return allPlayers[i];
    }

    var initGameScores = function() {
        gameScores.push(new GameScore(0));
        gameScores.push(new GameScore(1));
    };

    var computeTurnID = function() {
        for (var i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i] === name) {
                turnID = i;
            }
        }
        team = turnID % 2;
    }

    var setAlphaPartner = function(alpha_partner) {
        if (getIsAlphaPartnerSet()) {
            throw "alpha's partner is already set; cannot set again!";
        }

        console.log("allPlayers: " + util29.toString(allPlayers));
        var alpha_partner_index = -1;
        for (var i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i] === alpha_partner) {
                alpha_partner_index = i;
                break;
            }
        }

        if (alpha_partner_index === 1) {
            util29.swap(allPlayers, 1, 2);
        } else if (alpha_partner_index === 3) {
            util29.swap(allPlayers, 2, 3);
        } else if (alpha_partner_index !== 2) {
            throw "Invalid alpha's partner is chosen!";
        }
        computeTurnID();
        isAlphaPartnerSet = true;
    }

    var getIsAlphaPartnerSet = function() {
        return isAlphaPartnerSet;
    };

    var setAllPlayers = function(data) {
        if (allPlayers.length !== 0) {
            throw "display order is already computed.";
        }
        for (var i = 0; i < data.length; i++) {
            allPlayers.push(data[i].name);
        }
        computeTurnID();
        initGameScores();
        return this;
    };

    var getNumPlayers = function() {
        return allPlayers.length;
    };

    var renamePlayer = function(old_name, new_name) {
        for (var i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i] === old_name) {
                allPlayers[i] = new_name;
                break;
            }
        }
        if (name === old_name) {
            name = new_name;
        }
        return this;
    };

    var getHand = function() {
        return hand;
    };

    var getPot = function() {
        return pot;
    };

    var addPoints = function(player_turn_id, increment) {
        var team_id = player_turn_id % 2;
        gameScores[team_id].addRoundPoints(increment);
        return this;
    };

    var getPoints = function() {
        return {team0: gameScores[0].getRoundPoints(),
                team1: gameScores[1].getRoundPoints()};
    };

    var getGameScores = function() {
        return gameScores;
    };

    var getRound = function() {
        return round;
    };

    var reset = function() {
        round.clear();
        hand.clear();
        gameScores[0].resetRoundPoints();
        gameScores[1].resetRoundPoints();
        bid.clear();
        trump.clear();
        pot.clear();
        return this;
    };

    var getBid = function() {
        return bid;
    };

    var getTeam = function() {
        return team;
    };

    var getOrderID = function() {
        return (getTurnID() + 7 - getRound().getDealer()) % 4;
    };

    var isMyTurnToPlay = function() {
        return getPot().getCToken() === getTurnID();
    };

    var canOpenTrump = function() {
        if (pot.length === 0) {
            console.log("no cards in pot. cannot open trump.");
            return false;
        } else if (bid.getPlayer() === name && trump.isReverse()) {
            console.log("trump setter cannot open reverse trump");
            return false;
        }
        var base_suit = pot.get(0).getSuit();
        for (var i = 0; i < hand.length(); i++) {
            if (hand.get(i).getSuit() === base_suit) {
                console.log("you have a card of this suit.");
                return false;
            }
        }
        return true;
    };

    var hasPlayStarted = function() {
        return !(round.get() === 0 && pot.size() === 0); 
    }

    return {
        getID: getID,
        equals: equals,
        toString: toString,
        getName: getName,
        getTurnID: getTurnID,
        setAlphaPartner: setAlphaPartner,
        getIsAlphaPartnerSet: getIsAlphaPartnerSet,
        getPlayerAt: getPlayerAt,
        setAllPlayers: setAllPlayers,
        getNumPlayers: getNumPlayers,
        renamePlayer: renamePlayer,
        getHand: getHand,
        getGameScores: getGameScores,
        addPoints: addPoints,
        getPoints: getPoints,
        getPot: getPot,
        getRound: getRound,
        reset: reset,
        getBid: getBid,
        getTeam: getTeam,
        getOrderID: getOrderID,
        isMyTurnToPlay: isMyTurnToPlay,
        canOpenTrump: canOpenTrump,
        hasPlayStarted: hasPlayStarted,
        getTrump: getTrump
    };
};

try {
    exports.Player = Player;
} catch (err) {
}