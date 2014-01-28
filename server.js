var
// Utility resources (logging, object inspection, etc)
util = require("util"),
// Socket.IO
io = require("C:\\Users\\hissar\\node_modules\\socket.io\\lib\\socket.io"),
// util(29) library for this game
util29 = require("./public/js/Util29").Util29(),
// playing cards deck class
Deck = require("./public/js/Deck").Deck,
// card class
Card = require("./public/js/Card").Card;

var
PORT = 8070,
MAX_PLAYERS = 4, // maximum number of players that can play
CARDS_TO_DRAW = 4,
socket, // Socket controller
deck,   // global deck for the game for each round
hands = new Object(), // hands which are to be given to players in order
pseudonames = ['phi', 'gamma', 'beta', 'alpha'],
players; // Map of connected players: id -> name

function init() {
    players = new Object();
    deck = new Deck();

    // set up socket to listen on port PORT
    socket = io.listen(PORT);
    util.log("Server listening on port: " + PORT);

    // Configure Socket.IO
    socket.configure(function() {
        // Only use WebSockets
        socket.set("transports", ["websocket"]);

        // Restrict log output
        socket.set("log level", 2);
    });

    // Start listening for events
    setEventHandlers();
};

var setEventHandlers = function () {
    // Socket.IO
    socket.sockets.on("connection", onSocketConnection);
};

function updatePlayersInfo(client) {
    var id = client.id;
    var name = pseudonames.pop();
    client.emit("receive avatar", {id: id, name: name});

    // Broadcast new player to connected socket clients
    client.broadcast.emit("new player", {id: id, name: name});

    // Send existing players to the new player
    var keys = Object.keys(players);
    for (var i = 0; i < keys.length; i++) {
        client.emit("new player", {id: keys[i], name: players[keys[i]]});
    };

    // add new player to the players array
    players[id] = name;
    util.log("Players: " + Object.keys(players));

    if (Object.keys(players).length === MAX_PLAYERS) {
        broadcastToAll(client, "playing cycle", serializePlayers(players));
    }
}

// New socket connection
function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);
    client.emit("reset state");
    updatePlayersInfo(client);

    // client is asking for a new hand from the server
    client.on("get hand", onGetHandRequest);

    // client selected a card to play
    client.on("select card to play", onCardToPlay);

    // if one client wants to send some information to all clients
    // including itself
    client.on("broadcast", onBroadcast);

    // clear state except the connected players
    client.on("clear", onClear);
};

// clears the current state of the server so that new round can be started
function onClear() {
    util.log("clearing server state");
    hands = new Object();
    deck.init().shuffle();
}

// broadcasts to all the clients
function onBroadcast(data) {
    console.log("broadcast: event#" + data.event + " info#" + data.info);
    this.broadcast.emit(data.event, data.info);
    this.emit(data.event, data.info);
}

// broadcasts the event and data to all the connected clients
function broadcastToAll(client, event, data) {
    client.broadcast.emit(event, data);
    client.emit(event, data);
}

function onCardToPlay(data) {
    this.broadcast.emit("remote played card",
            {turnid: data.turnid, card: data.card});
    this.emit("play card", {card: data.card});
}

function serializePlayers(players) {
    var sr = new Object();
    var keys = Object.keys(players);
    sr.length = keys.length;
    for (var i = 0; i < keys.length; i++) {
        sr[i] = new Object();
        sr[i].name = players[keys[i]];
    }
    return sr;
}

function serializeHand(hand) {
    var sr = new Object();
    sr.length = hand.length;
    for (var i = 0; i < hand.length; i++) {
        sr[i] = hand[i].serialize();
    }
    return sr;
}

function onGetHandRequest(data) {
    util.log("Player " + players[this.id] + " is asking for " + data.num_cards +
         " cards,order_id: " + data.order_id);
    if (Object.keys(hands).length === 0) {
        if (deck.isEmpty()) {
            deck.init().shuffle();
        }
        for (var i = 0; i < 4; i++) {
            hands[i] = deck.drawSomeCards(data.num_cards);
        };
    }    
    var hand = hands[data.order_id];
    delete hands[data.order_id];
    this.emit("receive hand", serializeHand(hand));
};

init();