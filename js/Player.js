
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

    return {
	getID: getID,
	toString: toString,
	getName: getName
    };
};

try {
    exports.Player = Player;
} catch (err) {
}