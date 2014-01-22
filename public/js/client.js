var
NUM_PLAYERS = 4,
// Socket connection
socket,
// this player's avatar
myAvatar,
// hand of cards
hand,
// display order with playing cycle order
displayOrder,
// all players
players,
// pot with the played cards
pot,
// remote players also playing this game
remotePlayers;

var all_denoms = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
var all_suits = ['C','D','S','H'];

function initState() {
    console.log("initState: reseting everything.");
    players = null;
    displayOrder = null;
    remotePlayers = [];
    hand = null;
    pot = null;
    myAvatar = null;
}

function init() {
    initState();

    // Initialise socket connection
    socket = io.connect("http://localhost", {port: 8070,
                         transports: ["websocket"]});
    setEventHandlers();
};

var setEventHandlers = function() {
    socket.on("connect", onSocketConnected);
};

// adds a new attribute to the given card code
function addAttribute(card_html, attr, value) {
    var new_code = card_html.replace(
    'marker_tag=""',
    attr + '=\"' + value + '\"' + ' marker_tag=""'
    );
    return new_code;
}

function checkPotWinner() {
    console.log("checking PotWinner, length = " + pot.size());
    console.log("trump is " + myAvatar.getTrump());
    if (pot.size() !== 4 || myAvatar.getTrump() === null) {
        return;
    }
    var winning_card = pot.getPotWinner(myAvatar.getTrump());
    console.log("Winning Card: " + winning_card.serialize());
}

/******************************************************************************/
// Input from the index.html form page
function trumpEntered() {
    var trump_token = document.getElementsByName("trump")[0].value;
    console.log("Trump Token: " + trump_token);
    var trump = genTrumpCard(trump_token);
    myAvatar.setTrump(trump);
    socket.emit("broadcast", {event: "trump received", info: trump_token});
}

function changePlayerName() {
    var player_name = document.getElementsByName("player_name")[0].value;
    console.log("Player New Name: " + player_name);
    var old_name = myAvatar.getName();
    myAvatar.setName(player_name);
    console.log("New Avatar Name: " + myAvatar.getName());
    socket.emit("broadcast", {event: "rename player",
        info: {old_name: old_name, new_name: player_name}
    });
}

function startGame() {
    socket.emit("start game");
};

function cardClicked(item){
    console.log("User clicked card " + $(item).attr("id"));
    var id_token = $(item).attr("id");

    // the pot cards are un-clickable
    if ($(item.parentNode).attr("id").indexOf("pcard") !== -1) {
        console.log("No use clicking a pot card");
        return;
    }

    socket.emit("select card to play",
        {turnid: myAvatar.getTurnID(), card: id_token});
}

/******************************************************************************/
// Event-handlers for events triggered from server or other clients 
function onSocketConnected() {
    console.log("Connected to socket server");

    socket.on("reset state", onResetState);

    socket.on("new player", onNewPlayer);

    socket.on("receive hand", onReceiveHand);

    socket.on("rename player", onRenamePlayer);

    socket.on("receive socket id", onReceiveSocketID);

    socket.on("playing cycle", onPlayingCycle);

    socket.on("play card", onPlayCard);

    socket.on("remote played card", onRemotePlayCard);

    socket.on("trump received", onTrumpReceived);

    socket.on("out of turn", onOutOfTurnPlay);

    socket.on("request hand", onGetHandCommand);

    socket.on("debug msg", onDebugMsg);
};

function onResetState() {
    initState();
}

function onReceiveSocketID(data) {
    myAvatar = new Player(0, data.id);
}

function onTrumpReceived(data) {
    console.log("trump card received: " + data.info);
    var trump = genTrumpCard(data.info);
    myAvatar.setTrump(trump);
}

// adds debugging information to the console which is received from the server.
function onDebugMsg(data) {
    console.log("DEBUG: " + data.info);
}

function onOutOfTurnPlay(data) {
    console.log("Out of turn play. Turn of " + players[data.turnid].getName());
}

function onRemotePlayCard(data) {
    pot.addCard(data.card);
    var pot_index = displayOrder[data.turnid];
    var arr = stripID(data.card);
    var card_code = cardHTML(arr[0], arr[1]);
    var zIndex = pot.size() - 1;
    card_code = addAttribute(card_code, "style", "z-index: " + zIndex + "; ");
    document.getElementById("pcard" + pot_index).innerHTML = card_code;
}

function onPlayCard(data) {
    var card = genCard(data.card);
    hand.remove(card);

    var card_node = document.getElementById(data.card);
    pot.addCard(data.card);
    card_node.style.zIndex = pot.size() - 1;
    card_node.parentNode.removeChild(card_node);
    document.getElementById("pcard0").innerHTML = card_node.outerHTML;

    checkPotWinner();
}

function onPlayingCycle(data) {
    players = new Array();
    displayOrder = new Array();
    pot = new Pot();

    for (var i = 0; i < data.length; i++) {
        var player = new Player(data[i].id, data[i].name);
        players.push(player);
        if (player.getName() === myAvatar.getName()) {
            myAvatar.setTurnID(i);
        }
    }

    displayOrder[myAvatar.getTurnID()] = 0;
    var turn = 1;
    for (var i = (myAvatar.getTurnID() + 1) % data.length;
         turn < data.length;
         i = (i + 1) % data.length, turn++) {
        displayOrder[i] = turn;
    }

    console.log("Playing order: " + (new Util29().toString(players)));
    console.log("Display Order: " + displayOrder);
    console.log("Turn ID = " + myAvatar.getTurnID());
}

function onReceiveHand(data) {
    hand = new Hand();
    for (var i = 0; i < data.length; i++) {
    hand.add(genCard(data[i]));
    }
    console.log("Hand: " + hand.toString());

    var hand_cards = "";
    for(var i = 0; i < hand.length(); i++) {
    hand_cards += cardHTML(hand.get(i).getDenom(), hand.get(i).getSuit());
    }
    document.getElementById("cards").innerHTML = hand_cards;
}

function onRenamePlayer(data) {
    console.log("Rename of Player requested: " + data.info.old_name + " -> " +
        data.info.new_name);

    if (players !== null) {

        for (var i = 0; i < players.length; i++) {
            if (players[i].getName() === data.info.old_name) {
                players[i].setName(data.info.new_name);
                break;
            }
        }
    }

    for (var i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].getName() === data.info.old_name) {
            remotePlayers[i].setName(data.info.new_name);
            break;
        }
    }
    console.log("Players: " + (new Util29().toString(players)));
    console.log("RemotePlayers: " + (new Util29().toString(remotePlayers)));
}

function onNewPlayer(data) {
    var player = new Player(data.id, data.name);
    for (var i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].equals(player)) {
            return;
        }
    }
    console.log("New player connected: " + player.toString());
    remotePlayers.push(player);
    console.log("All Remote Player: " + (new Util29().toString(remotePlayers)));
}

function onGetHandCommand(data) {
    socket.emit("get hand", data);
};