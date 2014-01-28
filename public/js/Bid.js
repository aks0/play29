
var Bid = function() {
	var
	bid = null,
	double_factor = 1,
	redouble_factor = 1,
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

	var isEmpty = function() {
		return bid === null;
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

	// given the round points, find the corresponding game points to be given
	var getPoints = function(round_points) {
		var win_loss = round_points >= bid ? 1 : -1;
		var half_factor = round_points < Math.ceil(bid/2) ? 2 : 1;
		var _29_factor = round_points === 29 ? 2 : 1;

		if (bid <= 20) {
			factor = double_factor * redouble_factor * half_factor * _29_factor;
			return win_loss * Math.min(factor, 4);
		} else {
			factor = double_factor * 2 * half_factor * _29_factor;
			return win_loss * Math.min(factor, 4);
		}
	};

	var double = function() {
		double_factor = 2;
	};

	var isDouble = function() {
		return double_factor === 2;
	};

	var redouble = function() {
		redouble_factor = 2;
	};

	var clear = function() {
		bid = null;
		team = null;
		player = null;
		double_factor = 1;
		redouble_factor = 1;
		return this;
	};

	var shownKQPair = function(showing_player_id) {
		var showing_team = showing_player_id % 2;
		var factor = 1;
		if (showing_team !== team) {
			factor = -1;
		}
		bid = factor === 1 ? Math.max(17, bid - 4) : Math.min(bid + 4, 29);
		console.log("new bid = " + bid);
		return this;
	};

	return {
		get: get,
		set: set,
		isEmpty: isEmpty,
		getTeam: getTeam,
		setTeam: setTeam,
		getPlayer: getPlayer,
		setPlayer: setPlayer,
		getPoints: getPoints,
		double: double,
		isDouble: isDouble,
		redouble: redouble,
		shownKQPair: shownKQPair,
		clear: clear
	};
};

// server code
try {
    exports.Bid = Bid;
// client code
} catch(err) {
}