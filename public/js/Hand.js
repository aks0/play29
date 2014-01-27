var
Card,
util29;

// server code
try {
    util29 = require("./Util29").Util29();
    Card = require("./Card").Card;
// client code
} catch(err) {
    util29 = new Util29();
}

var Hand = function() {
    var hand = new Array();

    var isEmpty = function() {
       return hand.length === 0;
    };

    var get = function(index) {
        if (index >= hand.length || index < 0) {
            return null;
        }
        return hand[index];
    };

    var remove = function(card) {
        for (var i = 0; i < hand.length; i++) {
            if (hand[i].equals(card)) {
            removeAt(i);
            return this;
            }
        }
        return this;
    }

    var removeAt = function(index) {
        if (index >= hand.length) {
            return null;
        }

        var card = hand.splice(index, 1);
        return card;
    };

    var length = function() {
        return hand.length;
    };

    var add = function(card) {
        hand.push(card);
        return this;
    };

    var clear = function() {
        hand = new Array();
        // wash out the cards on display
        document.getElementById("cards").innerHTML = "";
        return this;
    }

    var toString = function() {
        return util29.toString(hand);
    };

    var getPoints = function() {
        var points = 0;
        for (var i = 0; i < hand.length; i++) {
            points += hand[i].getPoints();
        }
        return points;
    };

    var hasAllJacks = function() {
        var count_jacks = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i].getDenom() === 'J') {
                count_jacks++;
            }
        }
        return count_jacks === 4;
    };

    return {
        isEmpty: isEmpty,
        get: get,
        remove: remove,
        removeAt: removeAt,
        length: length,
        toString: toString,
        clear: clear,
        getPoints: getPoints,
        hasAllJacks: hasAllJacks,
        add: add
    };
};

// server code
try {
    exports.Hand = Hand;
// client code
} catch(err) {
}