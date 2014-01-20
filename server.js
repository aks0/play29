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
Card = require("./public/js/Card").Card,
// chance token for the round
ctoken,
// Player class
Player = require("./public/js/Player").Player;

var
PORT = 8070,
MAX_PLAYERS = 4, // maximum number of players that can play
socket,  //Socket controller
deck,    // global deck for the game for each round
players; // Array of connected players

function init() {
    players = new Array();
    deck = new Deck();
    ctoken = -1;

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

// New socket connection
function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);

    // client is asking for a new hand from the server
    client.on("get hand", onGetHandRequest);

    // listen for new player addition message
    client.on("new player", onNewPlayer);

    // client selected a card to play
    client.on("select card to play", onCardToPlay);

    // one of the clients has indicated to start the game
    client.on("start game", onStartGame);
};

function onStartGame() {
    util.log("StartGame request received. Number of players = "
        + players.length);
    if (players.length != 4) {
        broadcastToAll(this, "debug msg", {info: "# players != 4"});
    } else {
        broadcastToAll(this, "request hand", {num_cards:8});
    }
}

// broadcasts the event and data to all the connected clients
function broadcastToAll(client, event, data) {
    client.broadcast.emit(event, data);
    client.emit(event, data);
}

function onCardToPlay(data) {
    util.log("Chance Token: " + ctoken + " data: " + data.turnid);
    if (data.turnid !== ctoken) {
        this.emit("out of turn", {turnid: ctoken});
        return;
    }

    this.broadcast.emit("remote played card",
            {turnid: data.turnid, card: data.card});
    this.emit("play card", {card: data.card});
    ctoken = (ctoken + 1) % MAX_PLAYERS;
}

function onNewPlayer(data) {
    var new_player = new Player(this.id, data.name);
    console.log("New Player: " + data.name + " from: " + this.id);

    // Broadcast new player to connected socket clients
    this.broadcast.emit("new player", {id: new_player.getID(),
                       name: new_player.getName()});

    // Send existing players to the new player
    for (var i = 0; i < players.length; i++) {
        var existing_player = players[i];
        this.emit("new player", {id: existing_player.getID(),
                     name: existing_player.getName()});
    };

    // add new player to the players array
    players.push(new_player);
    util.log("Players: " + util29.toString(players));

    if (players.length === MAX_PLAYERS) {
        broadcastToAll(this, "playing cycle", serializePlayers(players));
        ctoken = Math.floor(Math.random() * MAX_PLAYERS);
        util.log("Chance Token = " + ctoken);
    }
}

function serializePlayer(player) {
    var sr = new Object();
    sr.id = player.getID();
    sr.name = player.getName();
    return sr;
}

function serializePlayers(players) {
    var sr = new Object();
    sr.length = players.length;
    for (var i = 0; i < players.length; i++) {
        sr[i] = serializePlayer(players[i]);
    }
    return sr;
}

function serializeHand(hand) {
    var sr = new Object();
    sr.length = hand.length;
    for (var i = 0; i < hand.length; i++) {
        sr[i] = hand[i].getDenom() + ":" + hand[i].getSuit();
    }
    return sr;
}

function onGetHandRequest(data) {
    util.log("Player " + this.id + " is asking for " + data.num_cards +
         " cards");
    if (deck.isEmpty()) {
        deck.init().shuffle();
    }

    var hand = deck.drawSomeCards(data.num_cards);
    this.emit("receive hand", serializeHand(hand));
};

init();