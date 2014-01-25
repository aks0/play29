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
CARDS_TO_DRAW = 4,
socket, // Socket controller
deck,   // global deck for the game for each round
hands = new Object(), // hands which are to be given to players in order
pseudonames = ['phi', 'gamma', 'beta', 'alpha'],
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

function updatePlayersInfo(client) {
    var new_player = new Player(client.id, pseudonames.pop());
    client.emit("receive avatar",
        {id: new_player.getID(), name: new_player.getName()});

    // Broadcast new player to connected socket clients
    client.broadcast.emit("new player", {id: new_player.getID(),
                       name: new_player.getName()});

    // Send existing players to the new player
    for (var i = 0; i < players.length; i++) {
        var existing_player = players[i];
        client.emit("new player", {id: existing_player.getID(),
                     name: existing_player.getName()});
    };

    // add new player to the players array
    players.push(new_player);
    util.log("Players: " + util29.toString(players));

    if (players.length === MAX_PLAYERS) {
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

    // reassign turn-token to the winning player
    client.on("change turn token to", onChangeTurnToken);

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
    if (data.turnid !== ctoken) {
        this.emit("out of turn", {turnid: ctoken});
        return;
    }

    this.broadcast.emit("remote played card",
            {turnid: data.turnid, card: data.card});
    this.emit("play card", {card: data.card});
    ctoken = (ctoken + 1) % MAX_PLAYERS;
}

function onChangeTurnToken(data) {
    util.log("Turn Token changed to " + data.turnid);
    ctoken = data.turnid;
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
        sr[i] = hand[i].serialize();
    }
    return sr;
}

function onGetHandRequest(data) {
    util.log("Player " + this.id + " is asking for " + data.num_cards +
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