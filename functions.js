var FiveDrawPoker = (function() {
    class Card {
        constructor(rank, suit) {
            this.suit = suit;
            this.rank = rank;
            this.hold = false;
        }

        view() {
            var suitsHTML = {
                'heart' : '&hearts;',
                'diamond' : '&diams;',
                'club' : '&clubs;',
                'spade' : '&spades;'
            }
            return `
                <div class = 'top rank'>` + this.rank + `</div>
                <div class = '`+ this.suit + ` suit' >` + suitsHTML[this.suit] + `</div>
                <div class = 'bottom rank'>` + this.rank + `</div>
            `;
        }
    }

    class Deck {
        constructor() {
            this.deck = new Array();
            this.usedCards = new Array();
            for(let j = 1; j < 14; j++) {
                let rank = j.toString();
                if(j == 1) { rank = "A";}
                if(j == 11) { rank = "J";}
                if(j == 12) { rank = "Q";}
                if(j == 13) { rank = "K";}
                this.deck.push(new Card(rank, "diamond"));
                this.deck.push(new Card(rank, "club"));
                this.deck.push(new Card(rank, "heart"));
                this.deck.push(new Card(rank, "spade"));
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
            for(let i = 0; i < this.usedCards.length; i++) {
                this.deck.push(this.usedCards.pop());
            }
            this.shuffle();
            this.shuffle();
            this.shuffle();
        }

    }

    class Player {
        constructor(cardsView) {
            this.balance = 20;
            this.roundNumber = 0;
            this.initialView = cardsView;
            this.hand = new Hand(cardsView);
        }
        reset() {
            this.hand = new Hand(this.initialView);
        }
    }

    class Hand {
        constructor(cardsView) {
            this.cards = [null, null, null, null, null];
            this.holds = [false, false, false, false, false];
            this.cardsView = cardsView;
            this.ranksMap = new Map([
                ['A', 0], ['2', 0], ['3', 0], ['4', 0], ['5', 0],
                ['6', 0], ['7', 0], ['8', 0], ['9', 0], ['10', 0], 
                ['J', 0], ['Q', 0], ['K', 0]
            ]);
            this.suitsMap = new Map([
                ['heart', 0], ['diamond', 0], ['club', 0], ['spade', 0]
            ]);
        }

        changeCards(deck) {
            for(let i = 0; i < this.holds.length; i++) {
                if(this.holds[i] == false) {
                    let drawnCard = deck.draw();
                    this.ranksMap.set(drawnCard.rank, this.ranksMap.get(drawnCard.rank) + 1);
                    this.suitsMap.set(drawnCard.suit, this.suitsMap.get(drawnCard.suit) + 1);
                    if(this.cards[i] != null) {
                        this.ranksMap.set(this.cards[i].rank, this.ranksMap.get(this.cards[i].rank) - 1);
                        this.suitsMap.set(this.cards[i].suit, this.suitsMap.get(this.cards[i].suit) - 1);
                    }
                    this.cards[i] = drawnCard;
                    this.cardsView[i].innerHTML = drawnCard.view();
                }
            }
        }
        changeHold(cardNumber) {
            this.holds[cardNumber-1] = !this.holds[cardNumber-1];
        }
    }

    var Round = new function() {
        this.sleep = (milliseconds) => { //this.sleep(delay).then(() => {     });
             return new Promise(resolve => setTimeout(resolve, milliseconds));
        }
        this.setHoldButtons = function() {
            this.holdButton1.addEventListener('click', this.hold1Handler.bind(this));
            this.holdButton2.addEventListener('click', this.hold2Handler.bind(this));
            this.holdButton3.addEventListener('click', this.hold3Handler.bind(this));
            this.holdButton4.addEventListener('click', this.hold4Handler.bind(this));
            this.holdButton5.addEventListener('click', this.hold5Handler.bind(this));
        }
        this.hold1Handler = function() {
            this.player.hand.changeHold(1); 
            if(this.card1[1].innerHTML.trim() == "") { 
                this.card1[1].innerHTML = "<div class='hold'></div>";
            } else { 
                this.card1[1].innerHTML = ""; 
            }
        }        
        this.hold2Handler = function() {
            this.player.hand.changeHold(2); 
            if(this.card2[1].innerHTML.trim() == "") { 
                this.card2[1].innerHTML = "<div class='hold'></div>"; 
            } else { 
                this.card2[1].innerHTML = ""; 
            }
        }
        this.hold3Handler = function() {
            this.player.hand.changeHold(3); 
            if(this.card3[1].innerHTML.trim() == "") { 
                this.card3[1].innerHTML = "<div class='hold'></div>"; 
            } else { 
                this.card3[1].innerHTML = ""; 
            }
        }
        this.hold4Handler = function() {
            this.player.hand.changeHold(4); 
            if(this.card4[1].innerHTML.trim() == "") { 
                this.card4[1].innerHTML = "<div class='hold'></div>"; 
            } else { 
                this.card4[1].innerHTML = ""; 
            }
        }
        this.hold5Handler = function() {
            this.player.hand.changeHold(5); 
            if(this.card5[1].innerHTML.trim() == "") { 
                this.card5[1].innerHTML = "<div class='hold'></div>"; 
            } else { 
                this.card5[1].innerHTML = ""; 
            }
        }
        this.resetHolds = function() {
            this.player.reset();
            this.card1[1].innerHTML = ""; 
            this.card2[1].innerHTML = ""; 
            this.card3[1].innerHTML = ""; 
            this.card4[1].innerHTML = ""; 
            this.card5[1].innerHTML = ""; 
        }
        this.enableHoldButtons = function(){
            this.holdButton1.disabled = false;
            this.holdButton2.disabled = false;
            this.holdButton3.disabled = false;
            this.holdButton4.disabled = false;
            this.holdButton5.disabled = false;
            this.holdButton1.style.display = "";
            this.holdButton2.style.display = "";
            this.holdButton3.style.display = "";
            this.holdButton4.style.display = "";
            this.holdButton5.style.display = "";
        }
        this.disableHoldButtons = function(){
            this.holdButton1.style.display = "none";
            this.holdButton2.style.display = "none";
            this.holdButton3.style.display = "none";
            this.holdButton4.style.display = "none";
            this.holdButton5.style.display = "none";
            this.holdButton1.disabled = true;
            this.holdButton2.disabled = true;
            this.holdButton3.disabled = true;
            this.holdButton4.disabled = true;
            this.holdButton5.disabled = true;
        }
        this.cardsBeforeStart = function() {
            this.card1[0].innerHTML = "<div class='spade'>?</div>";
            this.card2[0].innerHTML = "<div class='spade'>?</div>";
            this.card3[0].innerHTML = "<div class='spade'>?</div>";
            this.card4[0].innerHTML = "<div class='spade'>?</div>";
            this.card5[0].innerHTML = "<div class='spade'>?</div>";
        }
        this.bettingIO = function() {
            this.balanceStatus.style.display = "";
            this.patternStatus.innerHTML = "";
            this.betSlider.style.display = "";
            this.betSlider.disabled = false;
            this.multiSlider.style.display = "";
            this.multiSlider.disabled = false;
            this.multiSlider.max = 5;
            this.dealButton.style.display = "";
            this.dealButton.disabled = false;
            document.getElementById('betColumn').style = "column-count: 2;";
            document.getElementById('multiColumn').style = "column-count: 2;";
            this.multiStatus.innerHTML = "MULTIPLIER: <span style='margin-left: 20px; color:yellow;'>1X</span>";
            let playerBalance = this.player.balance;
            if(this.player.balance == 0) {
                this.hideBettingIO();
                document.getElementById('status').innerHTML = "RAN OUT OF MONEY!";
                this.betStatus.style.display = "none";
                this.multiStatus.style.display = "none";
                this.resetButton.style.display = "";
            }
            this.betSlider.max = playerBalance / this.multiSlider.value;
            if(this.player.balance < 5) {
                this.multiSlider.max = this.player.balance;
                this.multiSlider.value = 1;
            }
            this.betSlider.value = parseInt(((+this.player.balance * .1)/ +this.multiSlider.value));
            if(this.betSlider.value == 0) {
                this.dealButton.disabled = true;
            }
            //Initial status
            this.balanceStatus.getElementsByTagName('span')[0].innerHTML = '$' + (+playerBalance);
            this.betStatus.getElementsByTagName('span')[0].innerHTML = '$' + this.betSlider.value;
            this.multiStatus.getElementsByTagName('span')[0].innerHTML = this.multiSlider.value + 'X';
            let multiplier = this.multiSlider.value;
            for(let i = 0; i < 10; i++) {
                document.getElementById('payoutTable').getElementsByTagName('tr')[i].getElementsByTagName('th')[this.lastMultiplier-1].style = "background-color: #cc1800";
            }
            //Changing status with input
            this.dealButton.innerHTML = "BET $" + this.betSlider.value * this.multiSlider.value;
            this.betSlider.oninput = function() { 
                document.getElementById('bet').getElementsByTagName('span')[0].innerHTML = '$' + this.value;
                if(this.value == 0) {
                    document.getElementById('deal').disabled = true;
                }
                else {
                    document.getElementById('deal').disabled = false;
                }
                document.getElementById('deal').innerHTML = "BET $" + (+this.value * +document.getElementById('multiSlider').value)
            }
            this.multiSlider.oninput = function() {
                document.getElementById('betSlider').max = playerBalance / this.value;
                document.getElementById('bet').getElementsByTagName('span')[0].innerHTML = '$' + document.getElementById('betSlider').value; 
                document.getElementById('multiplier').getElementsByTagName('span')[0].innerHTML = this.value + 'X';
                multiplier = this.value;
                for(let i = 0; i < 10; i++) {
                    for(let j = 0; j < 5; j++) {
                        if(j == multiplier - 1) {
                            document.getElementById('payoutTable').getElementsByTagName('tr')[i].getElementsByTagName('th')[j].style = "background-color: #cc1800";
                        }
                        else {
                            document.getElementById('payoutTable').getElementsByTagName('tr')[i].getElementsByTagName('th')[j].style = "";
                        }
                    }
                }
                document.getElementById('deal').innerHTML = "BET $" + (+this.value * +document.getElementById('betSlider').value)
            }
        }
        this.highlightRowCol = function(row, col) {
            document.getElementById('payoutTable').getElementsByTagName('tr')[row].getElementsByTagName('th')[col].style = "background-color: #cc1800";
            document.getElementById('payoutTable').getElementsByTagName('tr')[row].getElementsByTagName('td')[0].style = "background-color: #cc1800";
            return parseInt(document.getElementById('payoutTable').getElementsByTagName('tr')[row].getElementsByTagName('th')[col].innerHTML);
        }
        this.clearHighlight = function() {
            for(let i = 0; i < 10; i++) {
                for(let j = 0; j < 5; j++) {
                    document.getElementById('payoutTable').getElementsByTagName('tr')[i].getElementsByTagName('th')[j].style = "";
                }
                document.getElementById('payoutTable').getElementsByTagName('tr')[i].getElementsByTagName('td')[0].style = "";
            }
        }
        this.hideBettingIO = function() {
            this.multiSlider.disabled = true;
            this.multiSlider.style.display = "none";
            this.betSlider.disabled = true;
            this.betSlider.style.display = "none";
            document.getElementById('betColumn').style = "column-count: 1;";
            document.getElementById('multiColumn').style = "column-count: 1;";
            this.balanceStatus.style.display = "none";
            this.dealButton.style.display = "none";
        }
        this.dealButtonHandler = function() {
            this.lastMultiplier = this.multiSlider.value;
            this.player.balance -= parseInt(+this.multiSlider.value * +this.betSlider.value);
            this.enableHoldButtons();
            this.hideBettingIO();
            this.deck.init();
            this.player.hand.changeCards(this.deck);
            this.player.roundNumber += 1;
            this.confirmholdsButton.disabled = false;
            this.confirmholdsButton.style.display = "";
            document.getElementById('status').innerHTML = "SELECT WHICH CARDS TO HOLD";
            this.identifyPatterns(false);
        }
        this.confirmholdsButtonHandler = function() {
            document.getElementById('status').innerHTML = "";
            this.player.hand.changeCards(this.deck);
            this.player.roundNumber += 1;
            if(this.player.roundNumber == 2) {
                this.identifyPatterns(true);    
            }
        }
        this.identifyPatterns = function(isFinal) {
            if(isFinal) {
                this.confirmholdsButton.disabled = true;
                this.confirmholdsButton.style.display = "none";
                this.disableHoldButtons();
            }
            if(this.player.hand.suitsMap.get('diamond') == 5
            || this.player.hand.suitsMap.get('club') == 5
            || this.player.hand.suitsMap.get('heart') == 5
            || this.player.hand.suitsMap.get('spade') == 5){
                if(this.player.hand.ranksMap.get('10') == 1
                && this.player.hand.ranksMap.get('J') == 1
                && this.player.hand.ranksMap.get('Q') == 1
                && this.player.hand.ranksMap.get('K') == 1
                && this.player.hand.ranksMap.get('A') == 1){
                    //5 of 1 suit and 10, J, Q, K, A
                    this.patternStatus.innerHTML = "ROYAL FLUSH!";
                    if(isFinal) {
                        this.resolveBalances(1, this.multiSlider.value-1);
                    }
                    return;
                }
                else {
                    let consecutive = 0;
                    for(var i of this.player.hand.ranksMap.values()) {
                        if(i == 1 && consecutive >= 0) {
                            consecutive += 1;
                            if(consecutive == 5) {
                                //5 of 1 suit, and 5 consecutive ranks
                                
                                this.patternStatus.innerHTML = "STRAIGHT FLUSH!";
                                if(isFinal) {
                                    this.resolveBalances(2, this.multiSlider.value-1);
                                }
                                return;
                            }
                        }
                        else {
                            consecutive = 0;
                        }
                    }
                    for(var i of this.player.hand.ranksMap.values()) {
                        if(i == 4) {
                            //5 of 1 suit, and 4 of 1 rank
                            
                            this.patternStatus.innerHTML = "FOUR OF A KIND";
                            if(isFinal) {
                                this.resolveBalances(3, this.multiSlider.value-1);
                            }
                            return;
                        }
                    }
                    this.patternStatus.innerHTML = "FLUSH";
                    if(isFinal) {
                        //5 of 1 suit, NO 4 of 1 rank, NO 5 Consecutive rank
                        this.resolveBalances(5, this.multiSlider.value-1);
                    }
                    return;
                }
            }
            else { //Not 5 of 1 suit
                for(var i of this.player.hand.ranksMap.values()) {
                    if(i == 4) {
                        //NOT 5 of 1 suit, and 4 of 1 rank
                        this.patternStatus.innerHTML = "FOUR OF A KIND";
                        if(isFinal) {
                            this.resolveBalances(3, this.multiSlider.value - 1);
                        }
                        return;
                    }
                }
                let tempMap = new Map([['2', 0], ['3', 0]]);
                for(var i of this.player.hand.ranksMap.values()) {
                    if(i == 2) {
                        tempMap.set('2', tempMap.get('2') + 1);
                    }
                    if(i == 3) {
                        tempMap.set('3', tempMap.get('3') + 1);
                    }
                }
                if(tempMap.get('3') == 1 && tempMap.get('2') == 1) {
                    //NOT 5 of 1 suit, 3 of 1 rank, 2 of 1 rank, 3 of 1 suit, 2 of 1 suit
                    this.patternStatus.innerHTML = "FULL HOUSE";
                    if(isFinal) {
                        this.resolveBalances(4, this.multiSlider.value - 1);
                    }
                    return;
                }
                let consecutive = 0;
                for(var i of this.player.hand.ranksMap.values()) {
                    if(i == 1 && consecutive >= 0) {
                        consecutive += 1;
                        if(consecutive == 5) {
                            //NOT 5 of 1 suit, and 5 consecutive ranks
                            this.patternStatus.innerHTML = "STRAIGHT!";
                            if(isFinal) {
                                this.resolveBalances(6, this.multiSlider.value - 1);
                            }
                            return;
                        }
                    }
                    else {
                        consecutive = 0;
                    }
                }
                let pairsCount = 0;
                for(var i of this.player.hand.ranksMap.values()) {
                    if(i == 3) {
                        //NOT 5 of 1 suit, and 3 of 1 rank
                        this.patternStatus.innerHTML = "THREE OF A KIND";
                        if(isFinal) {
                            this.resolveBalances(7, this.multiSlider.value - 1);
                        }
                        return;
                    }
                    if(i == 2) {
                        pairsCount += 1;
                    }
                }
                if(pairsCount == 2) {
                    //NOT 5 of 1 SUIT, 2 of (2 of 1 rank)
                    this.patternStatus.innerHTML = "TWO PAIR";
                    if(isFinal) {
                        this.resolveBalances(8, this.multiSlider.value - 1);
                    }
                    return;
                }
                if(this.player.hand.ranksMap.get('J') == 2
                || this.player.hand.ranksMap.get('Q') == 2
                || this.player.hand.ranksMap.get('K') == 2
                || this.player.hand.ranksMap.get('A') == 2) {
                    //PAIR OF J, Q, K, or A
                    this.patternStatus.innerHTML = "JACKS OR BETTER (PAIR)";
                    if(isFinal) {
                        this.resolveBalances(9, this.multiSlider.value - 1);
                    }
                    return;
                }
            }
            this.patternStatus.innerHTML = "NO PATTERN";
            if(isFinal) {
                this.resolveBalances(0, 0);
            }
            return;
            
        }
        this.resolveBalances = function(row, col) {
            if(row > 0) {
                this.clearHighlight();
                let winMultiplier = this.highlightRowCol(row, col);
                let winAmt = parseInt(+winMultiplier * +this.betSlider.value);
                this.player.balance += winAmt;
                this.multiStatus.innerHTML += "<br />WINNINGS PAYS <span style='color: #fffef5'>" + winMultiplier + 
                                                "X BASE BET</span><br />YOU WON <span style='font-size: 40px; color:rgb(43, 236, 37)'>$" + winAmt + "</span>";
            }
            else {
                this.multiStatus.innerHTML += "<br />LOST <span style='font-size: 40px; color:rgb(255, 59, 59)'>$" + parseInt(+this.betSlider.value * +this.multiSlider.value) + "</span>";
            }
            this.continueButton.style.display = "";
        }

        this.continueButtonHandler = function() {
            this.continueButton.style.display = "none";
            this.resetHolds();
            this.cardsBeforeStart();
            this.clearHighlight();
            this.bettingIO();
            this.disableHoldButtons();
            this.player.roundNumber = 0;
        }
        this.resetButtonHandler = function() {
            document.getElementById('status').innerHTML = "";
            this.resetButton.style.display = "none";
            this.cardsView = [this.card1[0], this.card2[0], this.card3[0], this.card4[0], this.card5[0]];
            this.player = new Player(this.cardsView);
            this.betStatus.style.display = "";
            this.multiStatus.style.display = "";
            this.resetHolds();
            this.cardsBeforeStart();
            this.clearHighlight();
            this.bettingIO();
            this.disableHoldButtons();
            this.player.roundNumber = 0;
        }

        this.init = function() { //Init variable
            //Cards 1-5
            this.card1 = document.getElementById('card1').getElementsByTagName('span');
            this.card2 = document.getElementById('card2').getElementsByTagName('span');
            this.card3 = document.getElementById('card3').getElementsByTagName('span');
            this.card4 = document.getElementById('card4').getElementsByTagName('span');
            this.card5 = document.getElementById('card5').getElementsByTagName('span');
            this.cardsView = [this.card1[0], this.card2[0], this.card3[0], this.card4[0], this.card5[0]];
            this.card1[1].innerHTML == "";
            this.card2[1].innerHTML == "";
            this.card3[1].innerHTML == "";
            this.card4[1].innerHTML == "";
            this.card5[1].innerHTML == "";
            this.player = new Player(this.cardsView); //Player
            this.deck = new Deck();
            //Cards 1-5 Hold Buttons
            this.holdButton1 = document.getElementById('hold1');
            this.holdButton2 = document.getElementById('hold2');
            this.holdButton3 = document.getElementById('hold3');
            this.holdButton4 = document.getElementById('hold4');
            this.holdButton5 = document.getElementById('hold5');
            this.setHoldButtons();
            //Buttons
            this.dealButton = document.getElementById('deal');
            this.continueButton = document.getElementById('continue');
            this.confirmholdsButton = document.getElementById('confirmholds');
            this.resetButton = document.getElementById('reset');
            //Text outputs
            this.patternStatus = document.getElementById('patternStatus');
            this.balanceStatus = document.getElementById('balance');
            this.betStatus = document.getElementById('bet');
            this.multiStatus = document.getElementById('multiplier');
            this.lastMultiplier = 1;
            //Bet slider
            this.betSlider = document.getElementById('betSlider');
            this.multiSlider = document.getElementById('multiSlider');

            this.bettingIO();
            this.disableHoldButtons();
            this.cardsBeforeStart();
            
            //Buttons <-> functions
			this.dealButton.addEventListener('click', this.dealButtonHandler.bind(this));
            this.continueButton.addEventListener('click', this.continueButtonHandler.bind(this));
            this.confirmholdsButton.addEventListener('click', this.confirmholdsButtonHandler.bind(this));
            this.resetButton.addEventListener('click', this.resetButtonHandler.bind(this));

            //Hide unused buttons for betting phase
            this.continueButton.style.display = "none";
            this.confirmholdsButton.style.display = "none";
            this.resetButton.style.display = "none";
        }
    } 

    return {
        init: Round.init.bind(Round)
    }
})