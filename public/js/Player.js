
var Player = function(l_id, l_name) {
    var
    id = l_id,
    name = l_name,
    turnID = -1,
    // remote players also playing the game
    remotePlayers = [];
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

    var setTurnID = function(turnID) {
        this.turnID = turnID;
        return this;
    };

    var getRemotePlayers = function() {
        return remotePlayers;
    };

    var addRemotePlayer = function(player) {
        for (var i = 0; i < remotePlayers.length; i++) {
            if (remotePlayers[i].equals(player)) {
                return this;
            }
        }
        remotePlayers.push(player);
        return this;
    };

    return {
        getID: getID,
        equals: equals,
        toString: toString,
        setName: setName,
        getName: getName,
        getTurnID: getTurnID,
        setTurnID: setTurnID,
        getRemotePlayers: getRemotePlayers,
        addRemotePlayer: addRemotePlayer,
        getTrump: getTrump,
        setTrump: setTrump
    };
};

try {
    exports.Player = Player;
} catch (err) {
}