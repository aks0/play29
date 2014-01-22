
var Player = function(l_id, l_name) {
    var
    id = l_id,
    name = l_name,
    trump = null;

    var getID = function() {
        return this.id;
    };

    var getName = function() {
        return this.name;
    };

    var toString = function() {
        return this.name;
    };

    var setName = function(to_name) {
        this.name = to_name;
        return this;
    };

    var equals = function(player) {
        return (this.name === player.getName()) && (this.id === player.getID());
    };

    var getTrump = function() {
        return this.trump;
    };

    var setTrump = function(trump) {
        this.trump = trump;
        return this;
    };

    return {
        getID: getID,
        equals: equals,
        toString: toString,
        setName: setName,
        getName: getName,
        getTrump: getTrump,
        setTrump: setTrump
    };
};

try {
    exports.Player = Player;
} catch (err) {
}