/*
*   Purpose A simple trivia game 
*           The game utilizes a 30 second and 6 second timer 
*           The game utilizes Jquery for DOM manipulation
*
*   Author  Daryl Bilderback
*   Email   dbilderback@gmail.com
*
*
*
*
*/

//Global variable decalration for each question's timer
var questionTimer;

//Global variable associated to a function and then immediately invoke it
//This pattern also exposes specific member(s) while protecting the remaining members and properties
//This is my implementation of the Revealing Module Pattern
var TriviaGame = function() {
    //This array will hold all the questions and answers
    //The answer that starts  with ***** is the correct answer
    var questions = new Array ();
    var correct = 0;
    var incorrect = 0;
    var unAnswered = 0;
    var answerPosition = 0;
    questions[0] = new Array (
        "Which Georgia head coach is credited with bringing the red helmet to the Georgia uniform?",
        "Johnny Griffith", "*****Vince Dooley", "Wally Butts", "Ray Goff", "Joel Hunt"
    );
    questions[1] = new Array (
        "Which Georgia QB has two of the top four single seasons in Georgia history based on passing yards?",
        "Aaron Murray", "David Greene", "*****Eric Zeier", "Matthew Stafford", "Quincy Carter"
    );
    questions[2] = new Array (
        "Which Georgia running back has NOT accumulated over 3,000 rushing yards over their career at Georgia?",
        "Herschel Walker", "*****Knowshon Moreno", "Lars Tate", "Todd Gurley", "Garrison Hearst"
    );
    questions[3] = new Array (
        "Which Georgia head coach is 2nd all-time in wins behind Vince Dooley?",
        "Mark Richt", "Harry Mehre", "*****Wally Butts", "Ray Goff", "Jim Donnan"
    );
    questions[4] = new Array (
        "QB DJ Shockley set the record for total touchdowns in a single game with 6 TDs against which team?",
        "Auburn", "Georgia Tech", "Tennessee", "LSU", "*****Boise State"
    );
    questions[5] = new Array (
        "Mark Richt ordered his team to get an excessive celebration penalty against Florida in what season?",
        "2001", "2003", "2005", "*****2007", "2009"
    );
    questions[6] = new Array (
        "What is the name of the Georgia football player whose on-field death nearly resulted in the banning of the sport of football in the state of Georgia (and maybe throughout the south)?",
        "Frank Dobson", "*****Richard Von Albade Gammon", "Ernest Brown", "Charles Herty", "Harold Hirsch"
    );
    questions[7] = new Array (
        "Which of the following professional football teams did Herschel Walker NOT play for?",
        "Dallas Cowboys", "*****Atlanta Falcons", "Minnesota Vikings", "New Jersey Generals", "Philadelphia Eagles"
    );
    questions[8] = new Array (
        "Which Georgia player won the Heisman Trophy?",
        "*****Frank Sinkwich", "Charley Trippi", "Johnny Griffith", "David Pollack", "Garrison Hearst"
    );
    questions[9] = new Array (
        "Which Georgia player was a three-time All-American?",
        "*****David Pollack", "Matthew Stafford", "Garrison Hearst", "Knowshon Moreno", "AJ Green"
    );

    //This function wipes the gameboard 
    //Check if all the questions have been asked
    //Either gets a question out of the questions array or end the game 
    //By totalling the correct incorrect and unanswered counters we can iterate through each question
    var askQuestion = function() {
        clearGameBoard();
        if ((correct + incorrect + unAnswered) < 10) {
            createElement('timer', 'text timer', '<div>', "", 'timerContainer');
            createElement('questionLabel', 'text questionLabel', '<h3>', 'Question #' + (correct + incorrect + unAnswered + 1), 'questionContainer');
            createElement('question', 'text question', '<div>', questions[(correct + incorrect + unAnswered)][0], 'questionContainer');
            displayAnswers();
            var questionTimer = new startTimer();
        } else {
            endGame();
        }
        
    }

    //This function displays each possible answer to the question
    //Check each question to determine the correct answer
    //If the correct answer assign the index position to the answerPosition variable
    //then create element and bind the event
    //If incorrect answer create the element and bind the event
    var displayAnswers = function() {
        var qCount = (correct + incorrect + unAnswered);
        var event = function(event) {checkAnswer($(this))};
        for (var i = 1; i < questions[qCount].length; i++) {
            if (questions[qCount][i].substring(0,5) == '*****') {
                answerPosition = i;
                createElement('answer' + i, 'answer', '<div>', questions[qCount][i].substring(5), 'answersContainer');
                bindEvent('answer' + i, event, 'click.answer', 'answersContainer');
            } else {
                createElement('answer' + i, 'answer', '<div>', questions[qCount][i], 'answersContainer');
                bindEvent('answer' + i, event, 'click.answer', 'answersContainer');
            }
        }   
    }

    //This function initializes the timer and sets ui
    //After each second elapses check for no time left and clear the game board
    //Otherwise update the ui again 
    var startTimer = function() {
        var timeLeft = 30;
        $('#timer').text('Time Remaining: ' + timeLeft);
        questionTimer = setInterval(countdown, 1000);

        function countdown() {
            if (timeLeft == 0) {
               clearTimeout(questionTimer);
                outOfTime();
            } else {
                $('#timer').text('Time Remaining: ' + timeLeft);
                timeLeft--;
            }
        }
    }

    //This function is invoked when the question timer is expired
    //Increment the unAnswered counter and clear the game board
    //Set the ui to notify the user time expired and display the correct answer
    //Set a timer to wait 5 seconds and then ask the next question
    var outOfTime = function() {
        unAnswered++;
        var qCount = (correct + incorrect + unAnswered);
        clearGameBoard();
        createElement('wrongAnswer', 'text wrongAnswer', '<div>', 'Sorry Out Of Time, The Correct Answer Is Below', 'timerContainer');
        for (var i = 1; i < questions[qCount].length; i++) {
            if (questions[qCount][i].substring(0,5) == '*****') {
                createElement('answer' + i, 'text answer', '<div>', questions[qCount][i].substring(5), 'answersContainer');    
            }
        }
        var transTimer = setTimeout(function(){ askQuestion() }, 5000);
    }

    //Check the selected answer by comparing the last digit of the id to answerPosition 
    var checkAnswer = function(element) {
        if (element[0].id.substring(6) == answerPosition) {
            correctAnswer();
        } else {
            incorrectAnswer();
        }
        
    }

    //This function is invoke when the correct answer is selected
    //Increment the correct answer counter and clear the game board and question timer
    //Update the UI to notify the user the answer is correct
    //Set a timer to wait 5 seconds and then ask the next question
    var correctAnswer = function() {
        correct++;
        clearGameBoard();
        clearTimeout(questionTimer);
        createElement('correctAnswer', 'text correctAnswer', '<div>', 'Correct, Good Job!', 'timerContainer');
        setTimeout(function(){ askQuestion() }, 5000);
    }

    //This function is invoke when the incorrect answer is selected
    //Increment the incorrect answer counter and clear the game board and question timer
    //Update the UI to notify the user the answer is incorrect and display the correct answer
    //Set a timer to wait 5 seconds and then ask the next question
    var incorrectAnswer = function() {
        var qCount = (correct + incorrect + unAnswered);
        incorrect++;
        clearGameBoard();
        clearTimeout(questionTimer);
        createElement('wrongAnswer', 'text wrongAnswer', '<div>', 'Sorry Incorrect, The Correct Answer Is Below', 'timerContainer');
        for (var i = 1; i < questions[qCount].length; i++) {
            if (questions[qCount][i].substring(0,5) == '*****') {
                createElement('answer' + i, 'text answer', '<div>', questions[qCount][i].substring(5), 'answersContainer');    
            }
        }
        setTimeout(function(){ askQuestion() }, 5000);   
    }

    //This is a reusable function that creates UI elements
    var createElement = function(id, cssClass, type, text, parent) {
        var divElement = $(type);
        divElement.attr('class', cssClass);
        divElement.attr('id', id);
        divElement.text(text);  
        $('#' + parent).append(divElement);
    }

    //This is a reusable function that binds events to elements
    var bindEvent = function(elementID, event, eventType, parent) {
        var bindElement = $('#' + elementID);
        bindElement.bind(eventType, event);
        $('#' + elementID).appendTo('#' + parent);
        
    }

    //This function removes the children elements of the game board
    var clearGameBoard = function() {
        $('#timerContainer').empty();
        $('#questionContainer').empty();
        $('#answersContainer').empty();
    }

    //This function is invoked when the game is over
    //Set the UI to display the game results to the user
    //Create a button and assign an event to restart the game
    var endGame = function() {
        var event = function(event) {askQuestion()};
        createElement('gameOver', 'text gameOver', '<div>', 'Game Over', 'questionContainer');
        createElement('correct', 'text correct', '<div>', 'Correct Answers ' + correct, 'questionContainer');
        createElement('incorrect', 'text incorrect', '<div>', 'Incorrect Answers: ' + incorrect, 'questionContainer');
        createElement('unAnswered', 'text unAnswered', '<div>', 'Questions Not Answered: ' + unAnswered, 'questionContainer');
        createElement('restart', 'text restart', '<button>', 'Restart Game', 'questionContainer');
        $(document).on('click', 'button.restart' , function() {
            init();
        });
    }

    //Initialize the game variables and get the first question
    var init = function() {
        correct = 0;
        incorrect = 0;
        unAnswered = 0;
        askQuestion();
    }

    //Exposes public member(s)
    return {
        init: init
    };
//The final parenthesis immediately invokes the initial function    
} ();
