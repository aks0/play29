var
util29 = new Util29();

var Hand = function() {
    var hand = new Array();

    var isEmpty = function() {
    return hand.length === 0;
    };

    var get = function(index) {
    if (index >= hand.length) {
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

    var toString = function() {
    return util29.toString(hand);
    };

    return {
    isEmpty: isEmpty,
    get: get,
    remove: remove,
    removeAt: removeAt,
    length: length,
    toString: toString,
    add: add
    };
};