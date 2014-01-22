var
NUM_PLAYERS = 4,
// Socket connection
socket,
// this player's avatar
myAvatar;

var all_denoms = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
var all_suits = ['C','D','S','H'];
var positions = new Object();
positions[0] = 0;
positions[-1] = 1;
positions[1] = 3;
positions[-2] = 2;
positions[2] = 2;
positions[-3] = 3;
positions[3] = 1;

function initState() {
    console.log("initState: reseting everything.");
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

function checkPotWinner() {
    var pot = myAvatar.getPot();
    console.log("checking PotWinner, length = " + pot.size());
    console.log("trump is " + myAvatar.getTrump());
    if (pot.size() !== 4 || myAvatar.getTrump() === null) {
        return;
    }
    var winning_card = pot.getPotWinner(myAvatar.getTrump());
    console.log("Winning Card: " + winning_card.serialize());
    var winner_id = pot.cardPlayedBy(winning_card.serialize());
    console.log("Winner: " + winner_id);
    console.log("Pot Points: " + pot.getPoints());
    myAvatar.addPoints(winner_id, pot.getPoints());
    console.log("Player Points: " + myAvatar.getPoints());
    pot.clear();
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
    var new_name = document.getElementsByName("player_name")[0].value;
    console.log("Player New Name: " + new_name);
    var old_name = myAvatar.getName();
    myAvatar.renamePlayer(old_name, new_name);
    console.log("New Avatar Name: " + myAvatar.getName());
    socket.emit("broadcast", {event: "rename player",
        info: {old_name: old_name, new_name: new_name}
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
    myAvatar = new Player(data.id, data.id);
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
    console.log("Out of turn play. Turn of " +
        myAvatar.getPlayerAt(data.turnid));
}

function onRemotePlayCard(data) {
    var pot = myAvatar.getPot();
    console.log("Remote player " + myAvatar.getPlayerAt(data.turnid) +
        " played a card");
    pot.addCard(data.card, data.turnid);
    var pot_index = positions[myAvatar.getTurnID() - data.turnid];
    var arr = stripID(data.card);
    var card_code = cardHTML(arr[0], arr[1]);
    var zIndex = pot.size() - 1;
    card_code = addAttribute(card_code, "style", "z-index: " + zIndex + "; ");
    document.getElementById("pcard" + pot_index).innerHTML = card_code;

    checkPotWinner();
}

function onPlayCard(data) {
    var card = genCard(data.card);
    myAvatar.getHand().remove(card);

    var card_node = document.getElementById(data.card);
    var pot = myAvatar.getPot();
    pot.addCard(data.card, myAvatar.getTurnID());
    card_node.style.zIndex = pot.size() - 1;
    card_node.parentNode.removeChild(card_node);
    document.getElementById("pcard0").innerHTML = card_node.outerHTML;

    checkPotWinner();
}

function onPlayingCycle(data) {
    myAvatar.setAllPlayers(data);
    console.log("Turn ID = " + myAvatar.getTurnID());
}

function onReceiveHand(data) {
    var hand = myAvatar.getHand().clear();
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
    myAvatar.renamePlayer(data.info.old_name, data.info.new_name);
}

function onNewPlayer(data) {
    console.log("New player connected: " + data.name);
}

function onGetHandCommand(data) {
    socket.emit("get hand", data);
};