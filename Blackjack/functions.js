var Blackjack = (function() {
    class Card {
        constructor(value, suit) {
            this.value = value;
            this.suit = suit;
            this.rank = this.getRank();
            this.faceUp = true;
        }

        view() {
            var suitsHTML = {
                'heart' : '&hearts;',
                'diamond' : '&diams;',
                'club' : '&clubs;',
                'spade' : '&spades;'
            }
            if(!this.faceUp) {
                return `
                    <div class = "card">
                        <div class="back"></div>
                    </div>
                `;
            }
            return `
                <div class = "card">
                    <div class = "top rank">` + this.rank + `</div>
                    <div class = "`+ this.suit + `" >` + suitsHTML[this.suit] + `</div>
                    <div class = "bottom rank">` + this.rank + `</div>
                </div>
            `;
        }

        getRank() {
            let res = "";
            if (this.value == 1) {
                res += "A";
            }
            else if(this.value == 11 || this.value == 12 || this.value == 13) {
                res += "10";
            }
            else {
                res += this.value.toString();
            }
            return res;
        }

        getValue() {
            if(this.value == 11 || this.value == 12 || this.value == 13) {
                return 10;
            }
            return this.value;
        }

    }

    class Deck {
        constructor(decksCount) {
            this.deck = new Array();
            this.usedCards = new Array();
            this.initialCount = 52 * decksCount;
            for(let i = 0; i < decksCount; i++) {
                for(let j = 1; j < 14; j++) {
                    this.deck.push(new Card(j, "diamond"));
                    this.deck.push(new Card(j, "club"));
                    this.deck.push(new Card(j, "heart"));
                    this.deck.push(new Card(j, "spade"));
                }
            }
        }

        draw() {
            let drawnCard = this.deck.pop();
            this.usedCards.push(drawnCard);
            return drawnCard;
        }

        shuffle() {
            for(let i = this.deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i);
                const temp = this.deck[i];
                this.deck[i] = this.deck[j];
                this.deck[j] = temp;
            }
        }

        init() {
            if(this.deck.length >= parseInt(.8 * +this.initialCount)) {
                this.resetDeck();
            }
            this.shuffle();
            this.shuffle();
            this.shuffle();
        }

        resetDeck() {
            for(let i = 0; i < this.usedCards.length; i++) {
                let card = this.usedCards.pop();
                card.faceUp = true;
                this.deck.push(card);
            }
        }
    }

    class Dealer {
        constructor() {
            this.hand = new Hand();
        }
        getHand() {
            return this.hand.hand;
        }
    }

    class Player {
        constructor() {
            this.balance = 100;
            this.hands = new Array();
            this.hands.push(new Hand());
            this.activeHand = 0;
        }
        getHand() {
            return this.hands[this.activeHand].hand;
        }
        nextHand() {
            this.activeHand += 1;
        }
    }

    class Hand {
        constructor() {
            this.hand = new Array();
            this.total = 0;
            this.bet = 0;
            this.prevTotals = [];
            this.complete = false;
            this.options = new Map();
            this.options.set("hit", false);
            this.options.set("stay", false);
            this.options.set("double", false);
            this.options.set("split", false);
        }

        add(card) {
            this.hand.push(card);
            this.refresh();
        }

        setBet(bet) {
            this.bet = bet;
        }

        splittable() {
            if(this.hand.length == 2) {
                return this.hand[0].getValue() == this.hand[1].getValue();
            }
            return false;
        }

        printHand() {
            var ret = "";
            for(let i = 0; i < this.hand.length; i++) {
                ret += "[" + this.hand[i].rank +"] "
            }
            return ret;
        }

        getTotal() {
            let totals = new Array();
            totals.push([0]);
            for(let i = 0; i < this.hand.length; i++) {
                const value = this.hand[i].getValue();
                if(value != 1) {
                    for(let j = 0; j < totals.length; j++) {
                        totals[j] = parseInt(totals[j] + value);
                    }
                }
                else {
                    let newTotals = new Array();
                    for(let j = 0; j < totals.length; j++) {
                        newTotals.push(parseInt(totals[j] + 1));
                        newTotals.push(parseInt(totals[j] + 11));
                    }
                    totals = newTotals;
                }
            }
            let mi = Number.MAX_VALUE;
            let ma = Number.MIN_VALUE;
            for(let i = 0; i < totals.length; i++) {
                let curTotal = totals[i];
                if(curTotal == 21) {
                    return 21;
                }
                else {
                    if(curTotal < 21 && curTotal < mi) {
                        mi = curTotal;
                    }
                    if(curTotal < 21 && curTotal > ma) {
                        ma = curTotal;
                    }
                    if(curTotal > 21) {
                        return Math.max(Math.min(curTotal, ma), Math.min(curTotal, mi));
                    }
                }
            }
            if(ma < 21 || mi < 21) {
                return ma;
            }
        }

        refresh() {
            this.total = this.getTotal();
            this.prevTotals.push(this.total);
            if(this.total >= 21) {
                this.options.set("hit", false);
                this.options.set("stay", false);
                this.options.set("double", false);
                this.options.set("split", false);
            }
            else {
                if(this.splittable()) {
                    this.options.set("split", true);
                }
                else {
                    this.options.set("split", false);
                }
                if(this.hand.length == 2) {
                    this.options.set("double", true);
                }
                else {
                    this.options.set("double", false);
                }
                this.options.set("hit", true);
                this.options.set("stay", true);
            }
        }
    }

    var Round = new function() {
        this.dealButtonHandler = function() {
            this.currentRound += 1;
            //Dealer score is hidden 
            this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
            this.dealerScore.innerHTML = "(Hidden)";
            //Hide bet slider/deal bttn
            this.dealButton.style.display = "none";
            this.betSlider.style.display = "none";
            //Set up the bet and update player balance
            this.player.hands[0].bet = this.betSlider.value;
            this.player.balance -= this.betSlider.value;
            //Shuffle deck
            this.deck.init();
            //Deal cards
            if(this.dealer.getHand().length < 2) {
                let card = this.deck.draw();
                card.faceUp = false; //Dealer has one face down card
                this.dealer.hand.add(card);
            }
            let playerCard = this.deck.draw();
            playerCard.faceUp = true;
            this.player.hands[0].add(playerCard);
            if(this.dealer.getHand().length < 2) {
                this.dealer.hand.add(this.deck.draw());
            }
            playerCard = this.deck.draw();
            playerCard.faceUp = true;
            this.player.hands[0].add(playerCard);

            this.dealerIdx = 1;
            //If dealer gets blackjack
            if(this.dealer.hand.total == 21) {
                this.finalTotals.push(this.player.hands[this.player.activeHand].total); //Finalize player's hand
                this.refreshCards(); //Show cards
                this.endTurn(); //Adjust balances
            }
            else { //Dealer total < 21, proceed with normal round
                this.refreshCards(); //Show cards
                this.refreshOptions(); //Display player's options with current hand
            }
        }

        this.refreshCards = function() {
            let dealerCards = ""; 
            let playerCards = "";
            for(let i = 0; i < this.dealer.getHand().length; i++) {
                dealerCards += this.dealer.getHand()[i].view(); //Add dealer's cards to output
            }
            for(let i = 0; i < this.player.getHand().length; i++) {
                playerCards += this.player.getHand()[i].view(); //Add player's active hand to output
            }
            this.playerCards.innerHTML = playerCards;
            this.dealerCards.innerHTML = dealerCards;
        }

        this.refreshOptions = function() {
            if(this.player.hands.length > 1) { //If a split was made, tell the user which active hand is in play
                this.gameStatus.innerHTML = "<span style='color:yellow'>Hand " + parseInt(this.player.activeHand + 1) + " of " + this.player.hands.length + "</span>";
            }
            else {
                this.gameStatus.innerHTML = ""; //Single hand, no need to label active hand
            }
            this.options = this.player.hands[this.player.activeHand].options; //Get options map for player's active hand
            if(!this.options.get("hit") && !this.options.get("stay") && !this.options.get("double") && !this.options.get("split")) {
                this.endActiveHand(); //End active hand if total >= 21
            }
            if(this.options.get("hit")) {
                this.hitButton.style.display = "";
            }
            else {
                this.hitButton.style.display = "none";
            }
            if(this.options.get("stay")) {
                this.stayButton.style.display = "";
            }
            else {
                this.stayButton.style.display = "none";
            }
            if(this.options.get("split") && this.player.hands[this.player.activeHand].bet <= this.player.balance) { 
                this.splitButton.style.display = "";
            }
            else {
                this.splitButton.style.display = "none";
            }
            if(this.options.get("double") && this.player.hands[this.player.activeHand].bet <= this.player.balance) {
                this.doubleButton.style.display = ""; //Show double option only if it is the 1st turn for the active hand and player has enough money
            }
            else {
                this.doubleButton.style.display = "none";
            }
            this.refreshTotals(); //Update player total on GUI
        }

        this.refreshTotals = function() {
            this.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];
            this.playerScore.innerHTML = this.player.hands[this.player.activeHand].total;
        }

        this.refreshEnd = function(i) {
            this.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];
            this.playerScore.innerHTML = this.player.hands[i].total;
            this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
            this.dealerScore.innerHTML = this.dealer.hand.total;
        }

        this.refreshDealerScore = function() {
            this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
            this.dealerScore.innerHTML =  this.dealer.hand.total;
        }

        this.endActiveHand = function() {
            this.finalTotals.push(this.player.hands[this.player.activeHand].total); //Finalize player's active hand total
            this.refreshTotals(); //Update GUI
            this.refreshCards();
            if(this.player.activeHand == this.player.hands.length-1) { //Last active hand
                this.gameStatus.innerHTML = ""; 
                this.endTurn();
            }
            else {//A split was done and there are still more active hands left to process
                this.refreshCards(); //Update GUI
                this.nexthandButton.style.display = ""; //Button that is pressed to proceed to next hand
                this.hitButton.style.display = "none"; //Disable options
                this.stayButton.style.display = "none";
                this.doubleButton.style.display = "none";
                this.splitButton.style.display = "none";
            }
        }

        this.nexthandButtonHandler = function() {
            this.nexthandButton.style.display = "none"; //Hide button after click
            this.player.nextHand(); //Active hand index + 1
            this.refreshCards(); //Update GUI
            this.refreshOptions();
        }

        this.refreshDealerCards = function() {
            this.dealerIdx += 1;
            this.dealerCards.innerHTML += this.dealer.getHand()[this.dealerIdx].view(); //Update dealer's cards on GUI
        }

        this.refreshAllDealerCards = function() {
            let dealerCards = "";
            for(let i = 0; i < this.dealer.getHand().length; i++) {
               dealerCards += this.dealer.getHand()[i].view(); //Update dealer's cards on GUI
            }
            this.dealerCards.innerHTML = dealerCards;
        }

        this.sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }

        this.endTurn = function() {
            //Hide options
            this.bust = false;
            this.hitButton.style.display = "none";
            this.stayButton.style.display = "none";
            this.doubleButton.style.display = "none";
            this.splitButton.style.display = "none";
            this.dealingStatus.innerHTML = "<p style = 'font-size:21px; color:#ffffff;text-decoration: underline;padding-bottom:5px;padding-top:5px;'>Dealer must stand soft 17</p>";
            if(this.player.hands.length == 1 && this.player.hands[0].total > 21) {
                this.gameStatus.innerHTML = "Your hand is over 21. Bust! (<span style='color:#ff0000'> -$" + parseInt(+this.player.hands[0].bet) +" </span>)";
                this.refreshBalance(); 
                this.betStatus.innerHTML = "";
                this.continueButton.style.display = "";
                this.bust = true;
            }
            else {
                this.dealer.getHand()[0].faceUp = true; //Turn dealer's first card faceUp
                this.refreshAllDealerCards();
                let delay = 1000;
                while(this.dealer.hand.total < 17) { 
                    this.dealer.hand.add(this.deck.draw());//Dealer has to hit until total is >= 17
                    this.sleep(delay).then(() => {
                        this.refreshDealerCards();
                    });
                    delay += 1000;
                }      

                this.sleep(delay).then(() => { 
                    if(this.player.hands.length == 1) { //Single hand => update dealer and player scores
                        this.refreshEnd(0);
                    }
                    else { //Multiple hands (split)
                        this.playerScore.innerHTML = "--";
                        this.gameStatus.innerHTML = "";
                    }
                    this.sleep(delay * .2).then(() => {
                        this.displayResult(); //Resolve win/loss and balance changes for the player
                        this.sleep(delay * .3).then(() => {
                            this.refreshBalance(); //Update balance on GUI
                            //Continue button (a pause for player to review their last bet/hands)
                            this.continueButton.style.display = "";
                        });
                    });
                });
            }
        }
    
        this.continueButtonHandler = function() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0
            document.body.style.overflow = "hidden";
            var tableRows = document.getElementById('logTable');
            if(!this.bust) {
                for(let i = 0; i < this.player.hands.length; i++) {
                    var hand = this.player.hands[i];
                    tableRows.innerHTML += "<tr><td>"+this.currentRound+" </td><td> " + hand.printHand() + " </td><td> " + hand.getTotal() + " </td><td> " + this.dealer.hand.printHand() + 
                    " </td><td>"+this.dealer.hand.getTotal()+"</td><td> $"+ hand.bet+" </td><td> No </td><td> "+this.player.balance+" </td></tr>";
                }
            }
            else {
                for(let i = 0; i < this.player.hands.length; i++) {
                    var hand = this.player.hands[i];
                    tableRows.innerHTML += "<tr><td>"+this.currentRound+" </td><td> " + hand.printHand() + " </td><td> " + hand.getTotal() + " </td><td> " + this.dealer.hand.printHand() + 
                    " </td><td>"+this.dealer.hand.getTotal()+"</td><td> $"+ hand.bet+" </td><td> Yes </td><td> "+this.player.balance+" </td></tr>";
                }
            }
            this.gameStatus.innerHTML = ""; //reset game status output
            //Reset player/dealer hands 
            this.dealer.hand = new Hand(); 
            this.player.hands = new Array();
            this.player.hands.push(new Hand());
            this.player.activeHand = 0;
            this.finalTotals = new Array();
            this.continueButton.style.display = "none"; //hide pressed button
            //Reset cards on screen
            this.dealerCards.innerHTML = "";
            this.playerCards.innerHTML = "";
            //Reset scores on screen
            this.dealerScore.innerHTML = "(Hidden)";
            this.playerScore.innerHTML = "0";

            this.dealingStatus.innerHTML = "";

            if(this.player.balance > 0) { //Player still has money
                this.dealButton.style.display = ""; //Show buttons/sliders that allow betting/dealing
                this.betSlider.style.display = "";
                this.refreshBalanceBets();
            }
            else { //Player has $0
                this.gameOver();
            }
        }

        this.displayResult = function() {
            let dealerTotal = this.dealer.hand.total;
            this.dealerScore.innerHTML = dealerTotal;
            if(this.finalTotals.length > 1) {
                document.body.style.overflow = "visible";
            }

            for(let i = 0; i < this.finalTotals.length; i++) {
                let playerHand = this.player.hands[i];
                let playerTotal = this.finalTotals[i];
                if(playerTotal > dealerTotal && playerTotal < 21) {
                    if(this.finalTotals.length > 1) {
                        this.gameStatus.innerHTML += "<span style='color:yellow'>Hand " + parseInt(i+1) + ":</span> Your total is higher. You won! (<span style='color:#32CD32'> +$" + parseInt(+playerHand.bet) +"</span> )<br />";
                    }
                    else {
                        this.gameStatus.innerHTML = "Your total is higher. You won! (<span style='color:#32CD32'> +$" + parseInt(+playerHand.bet) +" </span>)";
                    }
                    this.player.balance = parseInt(+this.player.balance + +playerHand.bet * 2);
                }
                else if(playerTotal == dealerTotal && playerTotal <= 21) {
                    if(this.finalTotals.length > 1) {
                        this.gameStatus.innerHTML += "<span style='color:yellow'>Hand " + parseInt(i+1) + ":</span> Push! (<span style='color:#32CD32'> +$0</span> )<br />";
                    }
                    else {
                        this.gameStatus.innerHTML = "Push! (<span style='color:#32CD32'> +$0</span> )";
                    }
                    this.player.balance = parseInt(+this.player.balance + +playerHand.bet);
                }
                else if(playerTotal > 21) {
                    if(this.finalTotals.length > 1) {
                        this.gameStatus.innerHTML += "<span style='color:yellow'>Hand " + parseInt(i+1) + ":</span> Your total is over 21. You bust! (<span style='color:#ff0000'> -$" + playerHand.bet + "</span> )<br />";
                    }
                    else {
                        this.gameStatus.innerHTML = "Your total is over 21. You bust! (<span style='color:#ff0000'> -$"+ playerHand.bet + "</span> )";
                    }
                }
                else if(playerTotal == 21) {
                    if(this.finalTotals.length > 1) {
                        this.gameStatus.innerHTML += "<span style='color:yellow'>Hand " + parseInt(i+1) + ":</span> Blackjack! (<span style='color:#32CD32'> +$"+ parseInt(+playerHand.bet * 1.5) +"</span> )<br />";
                    }
                    else {
                        this.gameStatus.innerHTML = "Blackjack! (<span style='color:#32CD32'> +$"+ parseInt(+playerHand.bet * 1.5) +"</span> )";
                    }
                    this.player.balance = parseInt(+this.player.balance + +playerHand.bet * 2.5); //Blackjack pays 1.5 to 1
                }
                else {
                    if(dealerTotal > 21 && playerTotal <= 21) {
                        if(this.finalTotals.length > 1) {
                            this.gameStatus.innerHTML += "<span style='color:yellow'>Hand " + parseInt(i+1) + ":</span> Dealer went over 21. Dealer busts! (<span style='color:#32CD32'> +$"+ (+playerHand.bet) +"</span> )<br />";
                        }
                        else {
                            this.gameStatus.innerHTML = "Dealer went over 21. Dealer busts! (<span style='color:#32CD32'> +$"+ (+playerHand.bet) +" </span>)";
                        }
                        this.player.balance = parseInt(+this.player.balance + +playerHand.bet * 2);
                    }
                    else {
                        if(dealerTotal == 21) {
                            if(this.finalTotals.length > 1) {
                                this.gameStatus.innerHTML += "<span style='color:yellow'>Hand " + parseInt(i+1) + ":</span> Dealer has blackjack.. (<span style='color:#ff0000'> -$"+ (+playerHand.bet) +"</span> )<br />";
                            }
                            else {
                                this.gameStatus.innerHTML = "Dealer has blackjack.. (<span style='color:red'>- $"+ (+playerHand.bet) +"</span>)";
                            }
                        }
                        else {
                            if(this.finalTotals.length > 1) {
                                this.gameStatus.innerHTML += "<span style='color:yellow'>Hand " + parseInt(i+1) + ":</span> Dealer high. You lost! (<span style='color:#ff0000'> -$"+ (+playerHand.bet) +"</span> )<br />";
                            }
                            else {
                                this.gameStatus.innerHTML = "Dealer high. You lost! (<span style='color:#ff0000'> -$"+ (+playerHand.bet) +"</span> )";
                            }
                        }
                    }
                }
            }
            this.betStatus.innerHTML = "";
        }

        this.hitButtonHandler = function() {
            this.player.hands[this.player.activeHand].add(this.deck.draw());
            this.refreshCards();
            this.refreshOptions();
        }

        this.doubleButtonHandler = function() {
            this.player.balance -= this.player.hands[this.player.activeHand].bet;
            this.player.hands[this.player.activeHand].bet *= 2;
            this.player.hands[this.player.activeHand].add(this.deck.draw());
            this.refreshCards();
            this.endActiveHand();
        }

        this.stayButtonHandler = function() {
            this.endActiveHand();
        }
        
        this.splitButtonHandler = function() {
            let newHand = new Hand();
            let splitCard = this.player.getHand().pop();
            this.player.hands[this.player.activeHand].add(this.deck.draw());
            newHand.add(splitCard);
            newHand.add(this.deck.draw());
            newHand.bet = this.player.hands[this.player.activeHand].bet;
            this.player.balance -= newHand.bet;
            this.player.hands.push(newHand);
            this.refreshCards();
            this.refreshOptions();
        }

        this.gameOver = function() {
            this.gameStatus.innerHTML = "Game over! You ran out of $$.";
            this.balanceStatus.style.display = "none";
            this.betSlider.style.display = "none";
            this.betStatus.style.display = "none";
            this.resetButton.style.display = "";

        }

        this.resetButtonHandler = function() {
            this.dealer = new Dealer();
            this.player = new Player();
            this.deck = new Deck(5);
            this.finalTotals = new Array();
            this.refreshBalanceBets();
            this.hitButton.style.display = "none";
            this.doubleButton.style.display = "none";
            this.stayButton.style.display = "none";
            this.splitButton.style.display = "none";
            this.continueButton.style.display = "none";
            this.nexthandButton.style.display = "none";
            this.resetButton.style.display = "none";
            this.gameStatus.innerHTML = "";
        }


        this.refreshBalanceBets = function() {
            this.balanceStatus.style.display = "";
            this.betSlider.style.display = "";
            this.betStatus.style.display = "";
            this.dealButton.style.display = "";
            this.betSlider.max = this.player.balance;
            this.betSlider.value = parseInt(this.player.balance * .1);
            if(this.player.balance <= 10 && this.player.balance > 0) {
                this.betSlider.value = 1;
            }
            var playerBalance = this.player.balance;
            this.balanceStatus.innerHTML = "Your Balance: <span style='color:#32CD32'>$" + (playerBalance) + "</span>";
            this.betStatus.innerHTML = "Bet: <span style='color:#32CD32'>$" + this.betSlider.value + "</span>";
            this.betSlider.oninput = function() {
                if(this.value > 0) {
                    document.getElementById('deal').disabled = false
                }
                else {
                    document.getElementById('deal').disabled = true;
                }
                document.getElementById('bet').innerHTML = "Bet: <span style='color:#32CD32'>$" + this.value + "</span>";
            }
        }

        this.refreshBalance = function() {
            this.balanceStatus.innerHTML = "Your Balance: <span style='color:#32CD32'>$" + this.player.balance + "</span>";
        }

        this.logButtonHandler = function() { 
            if(document.getElementById('overlay').style.display == "none") {
                document.getElementById('overlay').style.display = "block";
            }
        }

        this.logStatusHandler = function() {
            document.getElementById('overlay').style.display = "none";
        }

        this.init = function() { //Init variables
            this.currentRound = 0;
            this.dealer = new Dealer(); //Dealer
            this.player = new Player(); //Player
            this.deck = new Deck(5); //Deck
            this.finalTotals = new Array(); //Final totals of player's hands

            //Buttons
            this.dealButton = document.getElementById('deal');
            this.hitButton = document.getElementById('hit');
            this.doubleButton = document.getElementById('double');
            this.stayButton = document.getElementById('stay');
            this.splitButton = document.getElementById('split');
            this.continueButton = document.getElementById('continue');
            this.nexthandButton = document.getElementById('nexthand');
            this.resetButton = document.getElementById('reset');
            this.logButton = document.getElementById('log');
            //Card outputs
            this.playerCards = document.getElementById('player');
            this.dealerCards = document.getElementById('dealer');
            //Text outputs
            this.gameStatus = document.getElementById('status');
            this.balanceStatus = document.getElementById('balance');
            this.betStatus = document.getElementById('bet');
            this.dealingStatus = document.getElementById('dealing');
            this.logStatus = document.getElementById('overlay');
            //Bet slider
            this.betSlider = document.getElementById('betSlider');
            
            //Bet slider changes balance/bet outputs
            this.refreshBalanceBets();

            //Buttons <-> functions
			this.dealButton.addEventListener('click', this.dealButtonHandler.bind(this));
            this.hitButton.addEventListener('click', this.hitButtonHandler.bind(this));
            this.doubleButton.addEventListener('click', this.doubleButtonHandler.bind(this));
            this.stayButton.addEventListener('click', this.stayButtonHandler.bind(this));
            this.splitButton.addEventListener('click', this.splitButtonHandler.bind(this));
            this.continueButton.addEventListener('click', this.continueButtonHandler.bind(this));
            this.nexthandButton.addEventListener('click', this.nexthandButtonHandler.bind(this));
            this.resetButton.addEventListener('click', this.resetButtonHandler.bind(this));
            this.logButton.addEventListener('click', this.logButtonHandler.bind(this));
            this.logStatus.addEventListener('click', this.logStatusHandler.bind(this));

            //Hide unused buttons for betting phase
            this.hitButton.style.display = "none";
            this.doubleButton.style.display = "none";
            this.stayButton.style.display = "none";
            this.splitButton.style.display = "none";
            this.continueButton.style.display = "none";
            this.nexthandButton.style.display = "none";
            this.resetButton.style.display = "none";
        }
    } 

    return {
        init: Round.init.bind(Round)
    }
})