var
Pot,
GameScore,
Hand;

// server code
try {
    Hand = require("./Hand").Hand;
    Pot = require("./Pot").Pot;
    GameScore = require("./GameScore").GameScore;
// client code
} catch(err) {
}

var Player = function(l_id, l_name) {
    var
    id = l_id,
    name = l_name,
    turnID = -1,
    // all players
    allPlayers = [],
    // hand that the player currently owns
    hand = null,
    // pot cards which the player can see
    pot = null,
    points = null,
    subRound = 0,
    teamID = -1,
    gameScores = new Array(),
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
        this.trump = trump;
        return this;
    };

    var getTurnID = function() {
        return this.turnID;
    };

    var getPlayerAt = function(i) {
        if (allPlayers.length === 0 || i < 0 || allPlayers.length <= i) {
            throw "invalid index provided.";
        }
        return allPlayers[i];
    }

    var setAllPlayers = function(data) {
        if (allPlayers.length !== 0) {
            throw "display order is already computed.";
        }

        for (var i = 0; i < data.length; i++) {
            allPlayers.push(data[i].name);
            if (data[i].name === name) {
                this.turnID = i;
            }
        }
        // teamID is set only once
        if (teamID === -1) {
            teamID = this.turnID % 2;
        }
        gameScores.push(new GameScore(0));
        gameScores.push(new GameScore(1));
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
        if (hand === null) {
            hand = new Hand();
        }
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

    return {
        getID: getID,
        equals: equals,
        toString: toString,
        setName: setName,
        getName: getName,
        getTurnID: getTurnID,
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
        getTrump: getTrump,
        setTrump: setTrump
    };
};

try {
    exports.Player = Player;
} catch (err) {
}