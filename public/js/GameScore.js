
var GameScore = function(team_id) { // later change it to team
	var
	teamID = team_id,
	// current round points which are accumulating
	roundPoints = 0,
	// TO DO: display game points in terms of cards
	// current points in terms of the 6-cards [-6, 6]
	gamePoints = 0,
	// number of red sets on this team due to the other team
	redSets = 0,
	// number of black sets on this team
	blackSets = 0;

	// always call this function on the team calling the bid
	var updateScores = function(other_score, bid) {
		var penalty = 0;
		if (roundPoints >= bid) {
			if (bid >= 21) {
				penalty += 2;
			} else {
				penalty += 1;
			}
		} else {
			if (bid >= 21) {
				penalty -= 2;
			} else {
				penalty -= 1;
			}
		}
		gamePoints += penalty;
		if (gamePoints <= -6) {
			incrBlackSets();
			reset();
			other_score.reset();
		} else if (gamePoints >= 6) {
			other_score.incrRedSets();
			reset();
			other_score.reset();
		}
		return this;
	};

	var addRoundPoints = function(increment) {
		roundPoints += increment;
		return this;
	};

	var getRoundPoints = function() {
		return roundPoints;
	};

	var getGamePoints = function() {
		return gamePoints;
	};

	var reset = function() {
		gamePoints = 0;
		resetRoundPoints();
		return this;
	};

	var resetRoundPoints = function() {
		roundPoints = 0;
		return this;
	};

	var incrRedSets = function() {
		redSets++;
		return this;
	};

	var incrBlackSets = function() {
		blackSets++;
		return this;
	};

	var toString = function() {
		return "RoundPoints: " + roundPoints +
			" GamePoints: " + gamePoints + 
			" #RedSets: " + redSets +
			" #BlackSets: " + blackSets;
	}

	return {
		updateScores: updateScores,
		reset: reset,
		addRoundPoints: addRoundPoints,
		getRoundPoints: getRoundPoints,
		resetRoundPoints: resetRoundPoints,
		getGamePoints: getGamePoints,
		incrBlackSets: incrBlackSets,
		incrRedSets: incrRedSets,
		toString: toString
	};
};

// server code
try {
    exports.GameScore = GameScore;
// client code
} catch(err) {
}