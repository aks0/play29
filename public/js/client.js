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

var
CARDS_TO_DRAW = 4;

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

function subRoundCompleted(winner_id) {
    console.log("SubRound #" + myAvatar.getSubRound() + " is completed.");
    myAvatar.getPot().clear();
    // last match for the round
    if (myAvatar.getSubRound() === 7) {
        var game_scores = myAvatar.getGameScores();
        var bid = myAvatar.getBid();
        game_scores[bid.getTeam()].updateScores(
            game_scores[bid.getTeam() ^ 1],
            bid
        );
        
        console.log("GamePoints# Team0: " + game_scores[0]);
        console.log("GamePoints# Team1: " + game_scores[1]);
        myAvatar.reset();
    } else {
        myAvatar.incrSubRound();
        if (myAvatar.getTurnID() === winner_id) {
            socket.emit("change turn token to", {turnid: winner_id});
        }
    }
}

function checkPotWinner() {
    var pot = myAvatar.getPot();
    console.log("checking PotWinner, length = " + pot.size());
    console.log("trump is " + myAvatar.getTrump().toString());
    if (pot.size() !== 4 || myAvatar.getTrump().isEmpty()) {
        return;
    }
    var winning_card = pot.getPotWinner(myAvatar.getTrump());
    console.log("Winning Card: " + winning_card.serialize());
    var winner_id = pot.cardPlayedBy(winning_card.serialize());
    console.log("Winner: " + winner_id);
    console.log("Winner Player: " + myAvatar.getPlayerAt(winner_id));
    console.log("Pot Points: " + pot.getPoints());
    myAvatar.addPoints(winner_id, pot.getPoints());
    var team_points = myAvatar.getPoints();
    console.log("Team 0: " + team_points.team0 + "\tTeam 1: " +
        team_points.team1);
    subRoundCompleted(winner_id);
}

/******************************************************************************/
// Input from the index.html form page
function trumpEntered() {
    if (myAvatar.getName() !== myAvatar.getBid().getPlayer()) {
        console.log("Only the bid winner " + myAvatar.getBid().getPlayer() +
            " can set the trump.");
        return;
    }
    var trump_token = document.getElementsByName("trump")[0].value;
    console.log("Trump Token: " + trump_token);
    var denom = stripID(trump_token)[0];
    if (denom !== '2' && denom !== '3' && denom !== '4' && denom !== '5') {
        console.log("Invalid trump is set!");
        return;
    }
    socket.emit("broadcast", {event: "trump received",
        info: {trump_token: trump_token}
    });
}

function changePlayerName() {
    var new_name = document.getElementsByName("player_name")[0].value;
    console.log("Player New Name: " + new_name);
    var old_name = myAvatar.getName();
    socket.emit("broadcast", {event: "rename player",
        info: {old_name: old_name, new_name: new_name}
    });
}

function startRound() {
    myAvatar.startRound();
    if (myAvatar.getIsRoundStarted()) {
        console.log("sending start round request to server.");
        socket.emit("start round");
    }
};

function cardClicked(item){
    console.log("User clicked card " + $(item).attr("id"));
    var id_token = $(item).attr("id");

    // the pot cards are un-clickable
    if ($(item.parentNode).attr("id").indexOf("pcard") !== -1) {
        console.log("No use clicking a pot card");
        return;
    }

    if (myAvatar.getTrump().isEmpty()) {
        console.log("The trump is not yet set. Poke the bidder!");
        return;
    }

    socket.emit("select card to play",
        {turnid: myAvatar.getTurnID(), card: id_token});
}

function enterBid() {
    var bid_value = parseInt(document.getElementsByName("bid")[0].value);
    console.log("Bid Entered: " + bid_value);
    var bid = myAvatar.getBid();
    if (!myAvatar.getIsRoundStarted()) {
        console.log("Please start the round first.");
        return;
    } else if (!bid.isEmpty()) {
        console.log("bid is already set, you cannot reset bid.");
        return;
    } else if (bid_value < 17 || bid_value > 29) {
        console.log( "Invalid bid value, bid \in [17, 29].");
        return;
    }

    socket.emit("broadcast", {event:"bid",
        info: {bid: bid_value, player: myAvatar.getName()}
    });
}

function connectAlpha() {
    var alpha_parter = document.getElementsByName("alpha_parter")[0].value;
    console.log("alpha_parter: " + alpha_parter);
    socket.emit("broadcast", {event: "alpha partner",
        info: {alpha_partner: alpha_parter}
    });
}

/******************************************************************************/
// Event-handlers for events triggered from server or other clients 
function onSocketConnected() {
    console.log("Connected to socket server");

    socket.on("reset state", onResetState);

    socket.on("new player", onNewPlayer);

    socket.on("receive hand", onReceiveHand);

    socket.on("rename player", onRenamePlayer);

    socket.on("receive avatar", onReceiveAvatar);

    socket.on("playing cycle", onPlayingCycle);

    socket.on("play card", onPlayCard);

    socket.on("remote played card", onRemotePlayCard);

    socket.on("trump received", onTrumpReceived);

    socket.on("out of turn", onOutOfTurnPlay);

    socket.on("request hand", onGetHandCommand);

    socket.on("debug msg", onDebugMsg);

    socket.on("bid", onBid);

    socket.on("alpha partner", onAlphaPartner);

    socket.on("start round", onStartRound);
};

function onStartRound() {
    console.log("starting round.");
    myAvatar.startRound();
}

function onAlphaPartner(data) {
    console.log("alpha_partner received: " + data.alpha_partner);
    myAvatar.setAlphaPartner(data.alpha_partner.trim());
}

function onBid(data) {
    console.log("Bid: " + data.bid + " Bidding-Player: " + data.player);
    var bid = myAvatar.getBid();
    bid.set(data.bid);
    for (var i = 0; i < 4; i++) {
        if (myAvatar.getPlayerAt(i) === data.player) {
            bid.setTeam(i % 2);
            bid.setPlayer(data.player);
            break;
        }
    }
    // the bid-winner must set the trump next before seeing the remaining cards
    if (myAvatar.getName() === data.player) {
        socket.emit("change turn token to", {turnid: myAvatar.getTurnID()});
    // rest players can see their remaining cards
    } else {
        socket.emit("get hand", {num_cards: CARDS_TO_DRAW});
    }
}

function onResetState() {
    initState();
}

function onReceiveAvatar(data) {
    myAvatar = new Player(data.id, data.name);
    console.log("Hi " + myAvatar.getName() + "!");
}

function onTrumpReceived(data) {
    console.log("trump card received: " + data.trump_token);
    if (!myAvatar.getTrump().isEmpty()) {
        console.log("Trump is already set. You cannot set trump again.");
        return;
    }
    myAvatar.getTrump().set(data.trump_token);
    if (myAvatar.getName() === myAvatar.getBid().getPlayer()) {
        socket.emit("get hand", {num_cards: CARDS_TO_DRAW});
    }
}

// adds debugging information to the console which is received from the server.
function onDebugMsg(data) {
    console.log("DEBUG: " + data.msg);
}

function onOutOfTurnPlay(data) {
    console.log("Out of turn play. Turn of " +
        myAvatar.getPlayerAt(data.turnid));
}

function onRemotePlayCard(data) {
    var pot = myAvatar.getPot();
    console.log("Remote player: " + myAvatar.getPlayerAt(data.turnid) +
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
    var hand = myAvatar.getHand();
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
    console.log("Rename of Player requested: " + data.old_name + " -> " +
        data.new_name);
    myAvatar.renamePlayer(data.old_name, data.new_name);
}

function onNewPlayer(data) {
    console.log("New player connected: " + data.name);
}

function onGetHandCommand(data) {
    socket.emit("get hand", data);
};