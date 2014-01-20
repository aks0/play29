var
NUM_PLAYERS = 4,
// Socket connection
socket,
// this player's avatar
myAvatar,
// hand of cards
hand,
// my turn id [0, 1, 2, 3]
myTurnID,
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

function init() {
    players = null;
    displayOrder = null;
    myTurnID = -1;
    remotePlayers = [];
    hand = null;
    pot = null;

    // Initialise socket connection
    socket = io.connect("http://localhost", {port: 8070,
					     transports: ["websocket"]});
    setEventHandlers();
};

var setEventHandlers = function() {
    socket.on("connect", onSocketConnected);
};

function onSocketConnected() {
    console.log("Connected to socket server");

    socket.on("new player", onNewPlayer);

    socket.on("receive hand", onReceiveHand);

    socket.on("playing cycle", onPlayingCycle);

    socket.on("play card", onPlayCard);

    socket.on("remote played card", onRemotePlayCard);

    socket.on("out of turn", onOutOfTurnPlay);
};

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

// adds a new attribute to the given card code
function addAttribute(card_html, attr, value) {
    var new_code = card_html.replace(
	'marker_tag=""',
	attr + '=\"' + value + '\"' + ' marker_tag=""'
    );
    return new_code;
}

function onPlayCard(data) {
    var card = genCard(data.card);
    hand.remove(card);

    var card_node = document.getElementById(data.card);
    pot.addCard(data.card);
    card_node.style.zIndex = pot.size() - 1;
    card_node.parentNode.removeChild(card_node);
    document.getElementById("pcard0").innerHTML = card_node.outerHTML;
}

function onPlayingCycle(data) {
    players = new Array();
    displayOrder = new Array();
    pot = new Pot();

    for (var i = 0; i < data.length; i++) {
	var player = new Player(data[i].id, data[i].name);
	players.push(player);
	if (player.getName() === myAvatar.getName()) {
	    myTurnID = i;
	}
    }

    displayOrder[myTurnID] = 0;
    var turn = 1;
    for (var i = (myTurnID + 1) % data.length;
	 turn < data.length;
	 i = (i + 1) % data.length, turn++) {
	displayOrder[i] = turn;
    }

    console.log("Playing order: " + (new Util29().toString(players)));
    console.log("Display Order: " + displayOrder);
    console.log("Turn ID = " + myTurnID);
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

function registerPlayer() {
    var player_name = document.getElementsByName("player_name")[0].value;
    console.log("Player registered: " + player_name);
    myAvatar = new Player(0, player_name);
    socket.emit("new player", {name: player_name});
}

function onNewPlayer(data) {
    var player = new Player(data.id, data.name);
    console.log("New player connected: " + player.toString());
    remotePlayers.push(player);
    console.log("All Remote Player: " + (new Util29().toString(remotePlayers)));
}

function getNewHand() {
    socket.emit("get hand", {num_cards:8});
};

function cardClicked(item){
    console.log("User clicked card " + $(item).attr("id"));
    var id_token = $(item).attr("id");

    // the pot cards are un-clickable
    if ($(item.parentNode).attr("id").indexOf("pcard") !== -1) {
	console.log("No use clicking a pot card");
	return;
    }

    socket.emit("select card to play", {turnid: myTurnID, card: id_token});
}

function isValidCard(denom, suit) {
    switch(suit) {
    case 'C':
    case 'D':
    case 'S':
    case 'H':break;
    default: return false;
    }

    switch(denom) {
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '10':
    case 'J':
    case 'Q':
    case 'K':
    case 'A': break;
    default: return false;
    }
    return true;
};

function suitToCode(suit) {
    switch(suit) {
    case 'C': return "&#9827;";
    case 'D': return "&#9830;";
    case 'S': return "&#9824;";
    case 'H': return "&#9829;";
    default: return "";
    }
}

function suitToName(suit) {
    switch(suit) {
    case 'C': return "club";
    case 'S': return "spade";
    case 'D': return "diamond";
    case 'H': return "heart";
    default: return "";
    }
}

function denomToName(denom) {
    switch(denom) {
    case '2': return 'two';
    case '3': return 'three';
    case '4': return 'four';
    case '5': return 'five';
    case '6': return 'six';
    case '7': return 'seven';
    case '8': return 'eight';
    case '9': return 'nine';
    case '10': return 'ten';
    case 'J': return 'jack';
    case 'Q': return 'queen';
    case 'K': return 'king';
    case 'A': return 'ace';
    default: return '';
    }
}

function getSpanTag(suit, direction) {
    var tag = "<span class=\"suit " + direction + "\">" +
	suitToCode(suit) + "</span>";
    return tag;
}

function matchAny(denom, suit, denoms, direction) {
    var data = "";
    for(var i = 0; i < denoms.length; i++) {
	if (denom == denoms[i]) {
	    data += getSpanTag(suit, direction);
	}
    }
    return data;
}

function computeSuitPoints(denom, suit) {
    var data = "";
    var dirs = ["top_left", "top_center", "top_right",
		"middle_top_left", "middle_top_center", "middle_top_right",
		"middle_left", "middle_center", "middle_right",
		"middle_bottom_left", "middle_bottom_center",
		"middle_bottom_right", "bottom_left", "bottom_center",
		"bottom_right"];

    data += matchAny(denom, suit, ['4', '5', '6', '7', '8', '9','10'], dirs[0]);
    data += matchAny(denom, suit, ['2', '3'], dirs[1]);
    data += matchAny(denom, suit, ['4', '5', '6', '7', '8', '9','10'], dirs[2]);
    data += matchAny(denom, suit, ['9', '10'], dirs[3]);
    data += matchAny(denom, suit, ['7', '8', '10'], dirs[4]);
    data += matchAny(denom, suit, ['9', '10'], dirs[5]);
    data += matchAny(denom, suit, ['6', '7', '8'], dirs[6]);
    data += matchAny(denom, suit, ['3', '5', '9', 'A'], dirs[7]);
    data += matchAny(denom, suit, ['6', '7', '8'], dirs[8]);
    data += matchAny(denom, suit, ['9', '10'], dirs[9]);
    data += matchAny(denom, suit, ['8', '10'], dirs[10]);
    data += matchAny(denom, suit, ['9', '10'], dirs[11]);
    data += matchAny(denom, suit, ['4', '5', '6', '7', '8','9','10'], dirs[12]);
    data += matchAny(denom, suit, ['2', '3'], dirs[13]);
    data += matchAny(denom, suit, ['4', '5', '6', '7', '8','9','10'], dirs[14]);
    return data;
}

function isFaceCard(denom) {
    if (denom == "J" || denom == "Q" || denom == "K") {
	return true;
    }
    return false;
}

function cardHTML(denom, suit) {
    if (!isValidCard(denom, suit)) {
	throw "not a valid card: " + denom + " " + suit;
    }

    var card = "";

    // <div id="9D" class="card diamond nine" onclick="cardClicked(this)">
    card += "<div id=\"" + denom + ":" + suit + "\" class=\"card " +
	suitToName(suit) + " " + denomToName(denom) + "\"" +
	" marker_tag=\"\"" +
	" onclick=\"cardClicked(this)\">";

    // <div class="corner top">
    card += "<div class=\"corner top\">";

    // <span class="number">9</span>
    card += "<span class=\"number\">" + denom + "</span>"

    // <span>&#9827;</span>
    card += "<span>" + suitToCode(suit) + "</span>";

    // </div>
    card += "</div>";

    if (isFaceCard(denom)) {
	// <div class="container">
	card += "<div class=\"container\">";

	// <img src="./faces/face-queen-diamond.png" class="image_container"/>
	card += "<img src=\"./faces/face-" + denomToName(denom) +
	    "-" + suitToName(suit) + ".png\" class=\"image_container\"/>";

	// </div>
	card += "</div>";
    } else {
	// middle suit spots
	card += computeSuitPoints(denom, suit);
    }

    // <div class="corner bottom">
    card += "<div class=\"corner bottom\">";

    // <span class="number">9</span>
    card += "<span class=\"number\">" + denom + "</span>"

    // <span>&#9827;</span>
    card += "<span>" + suitToCode(suit) + "</span>";

    // </div>
    card += "</div>";

    // </div>
    card += "</div>";

    return card;
}
