var CardSorter = (function() {

    class Deck {
        constructor(decks) {
            this.deck = []
            for(let i = 0; i < decks; i++) {
                for(let j = 0; j < 52; j++) {
                    this.deck.push(j);
                }
            }
        }
        shuffle() {
            for(let i = 0; i < this.deck.length; i++) {
                const j = Math.floor(Math.random() * i);
                const temp = this.deck[i];
                this.deck[i] = this.deck[j];
                this.deck[j] = temp;
            }
        }
        printContents(id, eles) {
            let print_content = "";
            for(let i = 0; i < eles; i++) {
                 print_content += this.deck[i].toString() + " ";
            }
            document.getElementById(id).innerHTML = print_content;
        }
    }


    var CardSorter = new function() {
        this.cardSliderHandler = function(deck) {
            let generateEmptyCards = this.generateEmptyCards;
            this.cardSlider.oninput = function() {
                generateEmptyCards(this.value);
                deck.printContents('test', this.value);
            }
        }
        this.generateEmptyCards = function(rows) { //Function makes x rows of empty cards (17 cards per row)
            let cards_html = "";
            let cardNumber = 0;
            for(let i = 0; i < rows; i++) {
                cards_html += "<tr>";
                for(let j = 0; j < 17; j++) {
                    cards_html += "<td><div id='rank" + cardNumber + "' class='card'></td>";
                    cardNumber += 1;
                }
                cards_html += "</tr>";
            }
            document.getElementById('cardsTable').innerHTML = cards_html;
        }
        this.fillEmptyCards = function(deck) {
            let cards = this.cardSlider.value * 17;
            for(let i = 0; i < cards; i++) {
                let suit = deck.deck[i] % 4;
                let suitASCII;
                let suitClass;
                if(suit == 0) {
                    suitASCII = "&diams;";
                    suitClass = "diamond";
                }
                else if(suit == 1) {
                    suitASCII = "&clubs;";
                    suitClass = "club";
                }
                else if(suit == 2) {
                    suitASCII = "&hearts;";
                    suitClass = "heart";
                }
                else if(suit == 3) {
                    suitASCII = "&spades;";
                    suitClass = "spade";
                }
                let rank = parseInt((+deck.deck[i] / 4) + 2);
                if(rank == 11) {
                    rank = "J";
                }
                else if(rank == 12) {
                    rank = "Q";
                }
                else if(rank == 13) {
                    rank = "K";
                }
                else if(rank == 14){
                    rank = "A";
                }
                
                document.getElementById('rank'+i).innerHTML = "<div class='top rank'>" + rank.toString() + "</div><div class='" + suitClass +"'>"+ suitASCII +"</div><div class='bottom rank'>"+ rank.toString() +"</div>";
            }
        }


        this.init = function() {
            this.deck = new Deck(7);
            this.cardSlider = document.getElementById('cardSlider');

            this.deck.shuffle();
            this.deck.printContents('test', this.cardSlider.value);
            this.generateEmptyCards(this.cardSlider.value);
            this.cardSliderHandler(this.deck);
            this.fillEmptyCards(this.deck);
        }
    }
    
    return {
        init: CardSorter.init.bind(CardSorter)
    }
})