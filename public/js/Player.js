
var Player = function(l_id, l_name) {
    var
    id = l_id,
    name = l_name;

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

    return {
        getID: getID,
        equals: equals,
        toString: toString,
        setName: setName,
        getName: getName
    };
};

try {
    exports.Player = Player;
} catch (err) {
}