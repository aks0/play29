var
util29,
Card;

// server code
try {
    util29 = require("./Util29").Util29();
    Card = require("./Card").Card;
// client code
} catch(err) {
    util29 = new Util29();
}

var Deck = function() {
    var deck = null;

    var isEmpty = function() {
    if (deck === null || deck.length === 0) {
        return true;
    }
    return false;
    }

    /**
     * Reinitializes the deck
     */
    var init = function() {
    computeDeck();
    return this;
    }

    var computeDeck = function() {
    var
    v_denoms = ['7','8','Q','K','10','A','9','J'],
    v_suits = ['C','D','S','H'];

    deck = new Array();
    for(var i = 0; i < v_denoms.length; i++) {
        for(var j = 0; j < v_suits.length; j++) {
        deck.push(new Card(v_denoms[i], v_suits[j]));
        }
    }
    return this;
    };

    /**
     * Fisher-yaes shuffle algorithm
     * http://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm
     */
    var shuffle = function() {
    if (isEmpty()) {
        return;
    }
    for (var i = deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = deck[i];
            deck[i] = deck[j];
            deck[j] = tmp;
    }
    return this;
    };

    /**
     * Draws a card from the deck. Returns null if deck is empty
     */
    var drawCard = function() {
    if (isEmpty()) {
        return null;
    }
    return deck.pop();
    }

    /**
     * Draws upto n cards from the deck. If less than n cards are present in
     * the deck, returns those many cards.
     */
    var drawSomeCards = function(n) {
    var cards = new Array();
    for (var i = 0; i < n; i++) {
        if (isEmpty()) {
        return cards;
        }
        cards.push(drawCard());
    }
    return cards;
    }

    var toString = function() {
    var str = "";
    if (isEmpty()) {
        return str;
    }
    return util29.toString(deck);
    }

    return {
    init: init,
    shuffle: shuffle,
    drawCard: drawCard,
    drawSomeCards: drawSomeCards,
    isEmpty: isEmpty,
    toString: toString
    };
};


// server code
try {
    exports.Deck = Deck;
// client code
} catch(err) {
}