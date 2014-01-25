
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

	// if the argument is true, it returns the points for the keeping the bid
	var getPoints = function(isWinner) {
		var factor = isWinner ? 1 : -1;
		if (bid <= 20) {
			return factor * double_factor * redouble_factor;
		} else {
			return (factor * 2) * double_factor;
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
		clear: clear
	};
};

// server code
try {
    exports.Bid = Bid;
// client code
} catch(err) {
}