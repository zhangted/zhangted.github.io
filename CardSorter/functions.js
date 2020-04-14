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
        shuffle(times) {
            for(let shufflecnt = 0; shufflecnt < times; shufflecnt++) {
                for(let i = 0; i < this.deck.length; i++) {
                    const j = Math.floor(Math.random() * i);
                    const temp = this.deck[i];
                    this.deck[i] = this.deck[j];
                    this.deck[j] = temp;
                }
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
        this.cardSliderHandler = function() {
            let generateEmptyCards = this.generateEmptyCards;
            let fillEmptyCards = this.fillEmptyCards;
            let deck = this.deck;
            this.cardSlider.oninput = function() {
                generateEmptyCards(this.value);
                fillEmptyCards(deck);
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
        this.fillEmptyCards = async function(deck, completedIdxs) {
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

        this.newCardsButtonHandler = function() {
            this.deck = new Deck(7);
            this.deck.shuffle(2);
            this.generateEmptyCards(this.cardSlider.value);
            this.fillEmptyCards(this.deck);
        }
        this.sortButtonHandler = async function() {
            this.sortButton.disabled = true;
            this.newCardsButton.disabled = true;
            this.cardSlider.disabled = true;
            this.speedSlider.disabled = true;
            let algorithm = document.getElementById('selectedAlgo').innerHTML;
            if(algorithm == "Bubble Sort") {
                await this.bubbleSort(this.deck);
            }
            else if(algorithm == "Merge Sort") {
                this.cero = 0;
                this.mergeSortMid = Math.floor((this.cardSlider.value*17 - 1 )/ 2);
                await this.mergeSort(this.deck.deck, 0, this.cardSlider.value*17 - 1);
            }
            else if(algorithm == "Quick Sort") {
            }
            else if(algorithm == "Heap Sort") {
            }
            this.sortButton.disabled = false;
            this.newCardsButton.disabled = false;
            this.cardSlider.disabled = false;
            this.speedSlider.disabled = false;
        }
        this.bubbleSortSelectHandler = function() {
            document.getElementById('selectedAlgo').innerHTML = "Bubble Sort";
        }
        this.mergeSortSelectHandler = function() {
            document.getElementById('selectedAlgo').innerHTML = "Merge Sort";
        }
        this.quickSortSelectHandler = function() {
            document.getElementById('selectedAlgo').innerHTML = "Quick Sort";
        }
        this.heapSortSelectHandler = function() {
            document.getElementById('selectedAlgo').innerHTML = "Heap Sort";
        }
        this.sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }
        this.highlightColor = async function(a, b, color) {
            await this.sleep(this.speedSlider.value*-1);
            document.getElementById("rank"+a).classList.add("card"+color);
            document.getElementById("rank"+b).classList.add("card"+color);
        }
        this.unhighlightColor = async function(a, b, color) {
            await this.sleep(this.speedSlider.value*-1);
            document.getElementById("rank"+a).classList.remove("card"+color);
            if(b) {
                document.getElementById("rank"+b).classList.remove("card"+color);
            }
        }
        this.mergeSort = async function(deck, l, r) {
            if (l < r) { 
                var m = Math.floor(l+(r-l)/2);
                await this.mergeSort(deck, l, m);
                await this.mergeSort(deck, m + 1, r); 
                await this.merge(deck, l, m, r); 
            } 
        }
        this.merge = async function(deck, start, mid, end) {
            var start2 = mid + 1;
            let cacheStart = start;
            if(deck[mid] <= deck[start2]) {
                await this.highlightColor(mid, start2, "Yellow");
                await this.unhighlightColor(mid, start2, "Yellow");
                return;
            }
            while(start <= mid && start2 <= end) {
                await this.highlightColor(start, start2, "Yellow");
                if(deck[start] <= deck[start2]) {
                    if(mid == this.mergeSortMid) {
                        await this.highlightColor(cacheStart, cacheStart, "Green");
                        cacheStart += 1;
                    }
                    await this.unhighlightColor(start, start2, "Yellow");
                    start++;
                }
                else {
                    await this.unhighlightColor(start, start2, "Yellow");
                    await this.highlightColor(start, start2, "Blue");
                    let value = deck[start2];
                    let temp = document.getElementById('rank'+start2).innerHTML;
                    let index = start2;
                    while (index != start) { 
                        document.getElementById("rank"+(index)).innerHTML = document.getElementById("rank"+(index-1)).innerHTML;
                        deck[index] = deck[index - 1]; 
                        index--; 
                    } 
                    await this.sleep(22);
                    document.getElementById("rank"+start).innerHTML = temp;
                    deck[start] = value; 
                    await this.unhighlightColor(start, start2, "Blue");
                    start++; 
                    if(mid == this.mergeSortMid) {
                        await this.highlightColor(cacheStart, cacheStart, "Green");
                        cacheStart += 1;
                        this.mergeSortMid += 1;
                    }
                    mid++; 
                    start2++; 
                }
            }
        }
        this.bubbleSort = async function(deck) {
            let lastIdx = (this.cardSlider.value * 17) - 1;
            let swapped = true;
            let counter = 0;
            while(swapped) {
                swapped = false;
                for(let j = 0; j <= lastIdx-1-counter; j++) {
                    await this.highlightColor(j, j+1, "Yellow");
                    if(deck.deck[j] > deck.deck[j+1]) {
                        await this.swap(deck.deck, j, j+1);
                        swapped = true;
                    }
                    else {
                        await this.swap(deck.deck, j, j);
                    }
                    await this.unhighlightColor(j, j+1, "Yellow");
                }
                document.getElementById("rank"+(lastIdx-counter)).classList.add("cardGreen");
                counter++;
            }
        }
        this.swap = async function(arr, x, y) {
            await this.sleep(this.speedSlider.value*-1);
            if(x != y) {
                let temp = arr[x];
                arr[x] = arr[y];
                arr[y] = temp;
                await this.highlightColor(x, y, "Blue");
                let temp2 = document.getElementById('rank'+x).innerHTML;
                document.getElementById('rank'+x).innerHTML = document.getElementById('rank'+y).innerHTML;
                document.getElementById('rank'+y).innerHTML = temp2;
                await this.unhighlightColor(x, y, "Blue");
            }
        }
        this.init = function() {
            this.deck = new Deck(7);
            this.cardSlider = document.getElementById('cardSlider');
            this.cardSlider.addEventListener('input', this.cardSliderHandler.bind(this));

            this.speedSlider = document.getElementById('speedSlider');

            this.deck.shuffle(2);
            this.generateEmptyCards(this.cardSlider.value);
            this.fillEmptyCards(this.deck);

            this.newCardsButton = document.getElementById('newBtn');
            this.newCardsButton.addEventListener('click', this.newCardsButtonHandler.bind(this));

            this.sortButton = document.getElementById('sortBtn');
            this.sortButton.addEventListener('click', this.sortButtonHandler.bind(this));

            this.bubbleSortSelect = document.getElementById('bubbleSort');
            this.bubbleSortSelect.addEventListener('click', this.bubbleSortSelectHandler.bind(this));
            this.mergeSortSelect = document.getElementById('mergeSort');
            this.mergeSortSelect.addEventListener('click', this.mergeSortSelectHandler.bind(this));
            this.quickSortSelect = document.getElementById('quickSort');
            this.quickSortSelect.addEventListener('click', this.quickSortSelectHandler.bind(this));
            this.heapSortSelect = document.getElementById('heapSort');
            this.heapSortSelect.addEventListener('click', this.heapSortSelectHandler.bind(this));
        }
    }
    
    return {
        init: CardSorter.init.bind(CardSorter)
    }
})