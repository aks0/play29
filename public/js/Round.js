
var Round = function() {
	var
	dealer = -1,
	id = -1;

	var get = function() {
		return id;
	};

	var start = function() {
		id = 0;
		return this;
	};

	var hasStarted = function() {
		return id !== -1;
	};

	var next = function() {
		id++;
		return this;
	};

	var hasFinished = function() {
		return id === 7;
	};

	var clear = function() {
		id = -1;
		dealer = (dealer + 1) % 4;
		console.log("new dealer is " + dealer);
		return this;
	};

	var getDealer = function() {
		return dealer;
	};

	var setDealer = function(arg) {
		console.log("setting dealer: " + arg);
		dealer = arg;
	};

	return {
		get: get,
		start: start,
		hasStarted: hasStarted,
		hasFinished: hasFinished,
		next: next,
		getDealer: getDealer,
		setDealer: setDealer,
		clear: clear
	};
};

// server code
try {
    exports.Round = Round;
// client code
} catch(err) {
}