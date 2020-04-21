//An array holds all of the cards
let cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-bomb', 'fa-bomb'];

//template literal used in a function that generates the cards programatically
function generateCard(card) {
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

// Shuffle function 
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

 //function to initiate the game
function initiateGame() {
  //stores the unorderd list with the class .deck from the HTML file, where we will put cards
  var deck = document.querySelector('.deck');
  var cardHTML = shuffle(cards).map(function(card) {
    //calls generateCard function for each card
    return generateCard(card);
  });
  deck.innerHTML = cardHTML.join('');
}

initiateGame();
gameStopwatch();

// ***** Global Scope Variables ***** //
//variable hold all cards
let allCards = document.querySelectorAll('.card');
//Array to hold cards that are open. Initially empty.
let openCards = [];
//moves counter - begins at 0
let moves = 0;
//selects the moves counter in index.html
let movesCounter = document.querySelector('.moves');
//selects the restart game "fa-repeat" icon
let restartGame = document.querySelector('.fa-repeat');
//selects minutes section of HTML stopwatch
let displayMinutes = document.querySelector('.minutes');
//selects seconds section of HTML stopwatch
let displaySeconds = document.querySelector('.seconds');
//variable for timer to keep track of elapsed milliseconds
let milliseconds = 0;
//variable to track matched cards to evaluate if game has been won
let matched = 0;
//need 8 pairs to win the gameStopwatch
const winningPairs = 1;
//selects modal window
const modal = document.querySelector('.modal');
//selects the yes button
const yesButton = document.querySelector('.play-again');
//selects the no button
const noButton = document.querySelector('.no-play-again');

 //event listener for restart game button
 restartGame.addEventListener('click', function(e) {
   //removes any open, show or match classes from cards
   allCards.forEach(function(card) {
     card.classList.remove('open', 'show', 'match');
   });
   initiateGame();
   console.log('Reinitiate game');
 });

 //game stopwatch function
 function gameStopwatch() {
    //clearInterval(interval); Supposed to reset stopwatch, but not doing anything
    //setInterval evaluates an expression at specified intervals (every 1000 milliseconds/1 second here)
      var interval = setInterval(function() {
      milliseconds++;
      convertSeconds(Math.floor(milliseconds));
    }, 1000);
 }

//converts milliseconds to seconds and minutes to be displayed
 function convertSeconds(milliseconds) {
   let minutes = Math.floor(((milliseconds % 864000) % 3600) / 60);
   let seconds = ((milliseconds % 86400) % 3600) % 60;
   displayMinutes.innerHTML = minutes;
   if(seconds < 10) {
      displaySeconds.innerHTML = "0" + seconds;
 } else {
      displaySeconds.innerHTML = seconds;
    }
 }

//function to check how many moves have been made & change star rating
function starRating() {
  const three = document.querySelector('.three');
  const two = document.querySelector('.two');
  const one = document.querySelector('.one');
  if (moves === 10) {
    three.style.display = 'none';
    console.log('moves = 10');
  } else if (moves === 15) {
    two.style.display = 'none';
    console.log('moves = 15')
  } else if (moves === 20) {
    one.style.display = 'none';
    console.log('moves = 20')
  }
}

 //event listner for clicks on cards
 allCards.forEach(function(card) {
   card.addEventListener('click', function(e) {
    //disables ability to click on a matched card or the same card twice
     if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
         //when a card is clicked, the card gets added to the openCards array
         openCards.push(card);
         //adds .open and .show classes when card is clicked
         card.classList.add('open', 'show');

         //if 2 or more cards are showing, see if they are a match or not
         //since the array gets cleared out each time, there will only be 2 cards in the array at a time
         if (openCards.length == 2) {
           //if the cards match, add the .match, .open & .show classes
           if (openCards[0].dataset.card == openCards[1].dataset.card) {
               openCards[0].classList.add('match');
               openCards[0].classList.add('open');
               openCards[0].classList.add('show');

               openCards[1].classList.add('match');
               openCards[1].classList.add('open');
               openCards[1].classList.add('show');

               openCards = [];
               //Adds 1 to matched variable for each pair of matched cards
               matched++;
               if (matched === winningPairs) {
                 console.log("Game over!");
                 moves += 1;
                 //writes final game stats to the modal window
                 finalStats();
               }
           } else {
          //if it's not a match, hide the cards again
           setTimeout(function() {
             openCards.forEach(function(card) {
               card.classList.remove('open', 'show');
             });
             moves += 1;
             openCards = [];
           }, 1000);
         }
         movesCounter.innerText = moves;
       }
      starRating();
     }
   });
 });

function finalStats() {
  const officialTime = document.querySelector('.official-time');
  const officialMoves = document.querySelector('.official-moves');
  const officialStars = document.querySelector('.official-stars');
  const officialMinutes = document.querySelector('.minutes').innerHTML;
  const officialSeconds = document.querySelector('.seconds').innerHTML;
  const stars = starCount();

  officialTime.innerHTML = `Time: ${officialMinutes}:${officialSeconds}`;
  officialMoves.innerHTML = `Moves: ${moves}`;

  function starCount() {
    findStars = document.querySelectorAll('.stars li');
    finalStars = 0;
    for (findStar of findStars) {
      if (findStar.style.display !== 'none') {
        finalStars++;
        officialStars.innerHTML = `Stars: ${finalStars}`;
        console.log(finalStars);
      }
    }
  }

  //displays modal window
  modal.style.display = "block";
}

//event listener for play again button
yesButton.addEventListener('click', function(e) {
  modal.style.display = 'none';
  initiateGame();
  console.log('Reinitiate game');
});

//event listener for don't play again button
noButton.addEventListener('click', function(e) {
  modal.style.display = 'none';
});