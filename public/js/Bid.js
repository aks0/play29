
var Bid = function() {
	var
	bid = null,
	team = null,
	player = null;

	var get = function() {
		return bid;
	};

	/**
	 * bid >= 17 and <= 29
	 */
	var set = function(arg) {
		bid = arg;
		return this;
	};

	var isSet = function() {
		return bid !== null;
	};

	var getTeam = function() {
		return team;
	};

	var setTeam = function(arg) {
		team = arg;
		return this;
	};

	var getPlayer = function() {
		return player;
	};

	var setPlayer = function(arg) {
		player = arg;
		return this;
	};

	var clear = function() {
		bid = null;
		team = null;
		player = null;
		return this;
	};

	return {
		get: get,
		set: set,
		isSet: isSet,
		getTeam: getTeam,
		setTeam: setTeam,
		getPlayer: getPlayer,
		setPlayer: setPlayer,
		clear: clear
	};
};

// server code
try {
    exports.Bid = Bid;
// client code
} catch(err) {
}