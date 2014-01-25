
var Round = function() {
	var
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
		return this;
	};

	return {
		get: get,
		start: start,
		hasStarted: hasStarted,
		hasFinished: hasFinished,
		next: next,
		clear: clear
	};
};

// server code
try {
    exports.Round = Round;
// client code
} catch(err) {
}