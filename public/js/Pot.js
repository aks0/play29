
var Pot = function() {
    var pot = new Array();

    var isEmpty = function() {
	if (pot === null || pot.length === 0) {
	    return true;
	}
	return false;
    };

    // token of cards in the pot
    var addCard = function(card_token) {
	if (pot.length === 4) {
	    throw "Pot full with 4 cards. No space for " + card_token;
	}
	pot.push(card_token);
    };

    var clear = function() {
	pot = new Array();
    };

    var size = function() {
	return pot.length;
    };

    return {
	isEmpty: isEmpty,
	addCard: addCard,
	size: size,
	clear: clear
    };
};
