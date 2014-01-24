var
Pot,
GameScore,
util29,
Bid,
Hand;

// server code
try {
    Hand = require("./Hand").Hand;
    Pot = require("./Pot").Pot;
    util29 = require("./Util29").Util29();
    GameScore = require("./GameScore").GameScore;
    Bid = require("./Bid").Bid;
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
    pot = null,
    points = null,
    subRound = 0,
    teamID = -1,
    gameScores = new Array(),
    bid = new Bid(),
    isAlphaPartnerSet = false,
    isTrumpSet = false,
    isRoundStarted = false,
    trump = null;

    var getID = function() {
        return id;
    };

    var getName = function() {
        return name;
    };

    var toString = function() {
        return name;
    };

    var setName = function(to_name) {
        name = to_name;
        return this;
    };

    var equals = function(player) {
        return (name === player.getName()) && (id === player.getID());
    };

    var getTrump = function() {
        return this.trump;
    };

    var setTrump = function(trump) {
        if (isTrumpSet) {
            console.log("Trump is already set. You cannot set trump again.");
            return this;
        }
        if (!bid.isSet()) {
            console.log("You must first finish bidding.");
            return this;
        }
        this.trump = trump;
        console.log("Trump setting successful");
        isTrumpSet = true;
        return this;
    };

    var getIsTrumpSet = function() {
        return isTrumpSet;
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
        teamID = turnID % 2;
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
        if (pot === null) {
            pot = new Pot();
        }
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

    var getSubRound = function() {
        return subRound;
    };

    var incrSubRound = function() {
        subRound++;
        return this;
    };

    var reset = function() {
        subRound = 0;
        hand.clear();
        gameScores[0].resetRoundPoints();
        gameScores[1].resetRoundPoints();
        bid.clear();
        isTrumpSet = false;
        isRoundStarted = false;
        return this;
    };

    var getBid = function() {
        return bid;
    };

    var startRound = function() {
        if (getIsRoundStarted()) {
            console.log("Round has already started.");
            return this;
        } else if (!getIsAlphaPartnerSet()) {
            console.log("Please set alpha partner first.");
            return this;
        } else if (allPlayers.length != 4) {
            console.log("Not enough players to start the round.");
            return this;
        }
        isRoundStarted = true;
        return this;
    };

    var getIsRoundStarted = function() {
        return isRoundStarted;
    };

    return {
        getID: getID,
        equals: equals,
        toString: toString,
        setName: setName,
        getName: getName,
        getTurnID: getTurnID,
        setAlphaPartner: setAlphaPartner,
        getIsAlphaPartnerSet: getIsAlphaPartnerSet,
        getPlayerAt: getPlayerAt,
        setAllPlayers: setAllPlayers,
        renamePlayer: renamePlayer,
        getHand: getHand,
        getGameScores: getGameScores,
        addPoints: addPoints,
        getPoints: getPoints,
        getPot: getPot,
        getSubRound: getSubRound,
        incrSubRound: incrSubRound,
        reset: reset,
        startRound: startRound,
        getIsRoundStarted: getIsRoundStarted,
        getBid: getBid,
        getIsTrumpSet: getIsTrumpSet,
        getTrump: getTrump,
        setTrump: setTrump
    };
};

try {
    exports.Player = Player;
} catch (err) {
}