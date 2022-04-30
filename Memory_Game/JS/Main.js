class AudioControllar {
    constructor() {
        this.backGroundMusic = new Audio("../Audio/Super Mario Bros. Theme Song.mp3");
        this.flipCardSound = new Audio("../Audio/Assets_Audio_flip.wav");
        this.matchedCardSound = new Audio("../Audio/Assets_Audio_match.wav");
        this.unMatchedCardSound = new Audio("../Audio/fail.mp4");
        this.victoryGameSound = new Audio("../Audio/Assets_Audio_victory.wav");
        this.gameOverSound = new Audio("../Audio/Assets_Audio_gameOver.wav");
        this.tictacSound = new Audio("../Audio/clock-ticking-2.mp3");
        this.backGroundMusic.volume = 0.15;
        this.backGroundMusic.loop = true;
    }

    startGameMusic() {
        this.backGroundMusic.play();
    }

    stopGameMusic() {
        this.backGroundMusic.pause();
    }

    flipCardMusic() {
        this.flipCardSound.play();
    }

    matchedCardMusic() {
        this.matchedCardSound.play();
    }

    unMatchedCardMusic() {
        this.unMatchedCardSound.play();
    }

    victoryGameMusic() {
        this.stopGameMusic();
        this.victoryGameSound.play();
    }

    gameOverMusic() {
        this.stopGameMusic();
        this.gameOverSound.play();
    }

    tictacMusic() {
        this.stopGameMusic();
        this.tictacSound.play();
    }

    stopTictacMusic() {
        this.tictacSound.pause();
    }
}
let popup = document.querySelector(".popup");
let popupInput = document.querySelector(`[name="playerName"]`);
let arrayOfLevels = Array.from(document.querySelectorAll("form .level"));
let theMainFace = document.forms[0].lastElementChild;
let mainFaceButton = theMainFace.firstElementChild;
let playerName = document.querySelector(".name span");
let wrongTries = document.querySelector(".tries span");
let timeRemaining = document.querySelector(".time-remaining span")
let gameBlockContainer = document.querySelector(".memory-game-container");
let gameBlocks = Array.from(gameBlockContainer.children);
let orderRange = [...Array(gameBlocks.length).keys()];
let arrayOfMatchedBlocks = [];
let playerScore = document.querySelector(".player-score");
let playerScoreNumber = document.querySelector(".player-score .score-info .score-number");
let audioButtons = Array.from(document.querySelectorAll(".backgroundMusic-Controllar span"));
let timeBonus = document.querySelector(".time-remaining .bonus");
let audioController = new AudioControllar();


startGame();


function countDown() {
    let countingDown = setInterval(() => {
        if (timeRemaining.innerText > 0) {

            timeRemaining.innerText--;

            if (arrayOfMatchedBlocks.length === gameBlocks.length) {
                clearInterval(countingDown);
                audioController.victoryGameMusic();

                playerScoreNumber.innerText = timeRemaining.innerText;
                window.localStorage.setItem("bestScore", playerScoreNumber.innerText);

                if (+playerScoreNumber.innerText > +window.localStorage.getItem("bestScore")) {
                    window.localStorage.setItem("bestScore", playerScoreNumber.innerText);
                }

                restartTheVictoryGame();
            }

            if (timeRemaining.innerText <= 10) {
                audioController.stopGameMusic();
                audioController.tictacMusic();
            }
        } else if (arrayOfMatchedBlocks.length !== gameBlocks.length) {
            clearInterval(countingDown);
            audioController.stopGameMusic();
            audioController.gameOverMusic();
            restartGameOver();
        }

    }, 1000);
}

function flipped(selectedBlock) {

    selectedBlock.classList.add("flipped");
    audioController.flipCardMusic();

    let allFlippedBlocks = gameBlocks.filter(flippedBlock => {
        return flippedBlock.classList.contains("flipped");
    });

    if ( allFlippedBlocks.length === 2) {
        stopClicking();

        matchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
    }

    arrayOfMatchedBlocks.forEach(matchedBlock => {
        matchedBlock.classList.remove("flipped");
    });
}

function stopClicking() {

    gameBlockContainer.classList.add("no-clicking");
    setTimeout(() => {
        gameBlockContainer.classList.remove("no-clicking");
    }, 500);
}

function matchedBlocks(blockOne, blockTwo) {

    if (blockOne.getAttribute("data-tech") === blockTwo.getAttribute("data-tech")) {

        blockOne.classList.remove("flipped");
        blockTwo.classList.remove("flipped");

        blockOne.classList.add("matched");
        blockTwo.classList.add("matched");

        audioController.matchedCardMusic();

        timeBonus.style.cssText = "display: flex; justify-content: center; align-items: center;";

        setTimeout(() => {
            timeBonus.style.display = "none";
        }, 1300);

        for (let i = 0; i < 4; i++) {

            timeRemaining.innerText ++;
        }

        arrayOfMatchedBlocks.push(blockOne);
        arrayOfMatchedBlocks.push(blockTwo);

    } else {
        
        audioController.unMatchedCardMusic();
        wrongTries.innerText = +wrongTries.innerText + 1;
        setTimeout(() => {
            blockOne.classList.remove("flipped");
            blockTwo.classList.remove("flipped");
        }, 1000);
    }

}


function startGame() {

    shuffleCards(orderRange);

    audioButtons[0].onclick = () => {
        muted();
    };

    audioButtons[1].onclick = () => {
        unMuted();
    };

    document.querySelector(".best-score span").innerText = window.localStorage.getItem("bestScore");

    mainFaceButton.addEventListener("click", () => {
        audioController.flipCardMusic();

        if (popupInput.value === "") {

            document.querySelector(".sweet-alert-container").style.display = "block";
            document.querySelector(".sweet-alert").style.cssText = "display: flex; justify-content: center, align-items: center;";
            popup.style.display ="none";
            gameBlockContainer.classList.add("no-clicking");

            document.querySelector(".sweet-alert-container .sweet-alert .button span").onclick = () => {
                audioController.flipCardMusic();
                document.querySelector(".sweet-alert-container").style.display = "none";
                popup.style.display ="block";
                gameBlockContainer.classList.remove("no-clicking");
            }

        } else {

            playerName.innerHTML = popupInput.value; 

            if (arrayOfLevels[0].firstElementChild.checked || arrayOfLevels[1].firstElementChild.checked || arrayOfLevels[2].firstElementChild.checked) {
            
                
                popup.style.display = "none";
                audioController.startGameMusic();
                countDown();  

                if (arrayOfLevels[0].firstElementChild.checked) {
    
                    
                    timeRemaining.innerText = "100";
    
                    gameBlocks.forEach(block => {
                        block.classList.add("flipped");
                    });
        
                    setTimeout(() => {

                        gameBlocks.forEach(block => {
                            block.classList.remove("flipped");
                        });

                    }, 10000);
    
                } else if (arrayOfLevels[1].firstElementChild.checked) {
    
                    timeRemaining.innerText = "50";

                    gameBlocks.forEach(block => {
                        block.classList.add("flipped");
                    });
        
                    setTimeout(() => {

                        gameBlocks.forEach(block => {
                            block.classList.remove("flipped");
                        });

                    }, 7000);
    
                } else {
    
                    timeRemaining.innerText = "30";
    
                    gameBlocks.forEach(block => {
                        block.classList.add("flipped");
                    });
        
                    setTimeout(() => {

                        gameBlocks.forEach(block => {
                            block.classList.remove("flipped");
                        });

                    }, 4000);
    
                }

    
            } else {  

                document.querySelector(".sweet-alert-container .sweet-alert .error-text span").innerText = "You Must Take A level !!!!";
                document.querySelector(".sweet-alert-container").style.display = "block";
                document.querySelector(".sweet-alert").style.cssText = "display: flex; justify-content: center, align-items: center;";
                popup.style.display ="none";
                gameBlockContainer.classList.add("no-clicking");
    
                document.querySelector(".sweet-alert .button span").onclick = () => {
                    audioController.flipCardMusic();
                    document.querySelector(".sweet-alert-container").style.display = "none";
                    popup.style.display ="block";
                    gameBlockContainer.classList.remove("no-clicking");
                }

            }

        }

    });
    
    // Add fliped Class To All Cards
    
    gameBlocks.forEach((block, index) => {

        block.style.order = orderRange[index];

        block.addEventListener("click", () => {
    
            flipped(block);
        });
    });


}

function restartTheVictoryGame() {
    shuffleCards(orderRange);

    if (audioButtons[1].classList.contains("visible")) {
        
        audioButtons[1].classList.remove("visible");
        audioButtons[0].classList.add("visible");
    }

    audioButtons[0].onclick = () => {
        muted();
    };

    audioButtons[1].onclick = () => {
        unMuted();
    };

    document.querySelector(".best-score span").innerText = window.localStorage.getItem("bestScore");
    document.querySelector(".player-score .score-info .winner-name").innerText = popupInput.value;

    
    gameBlocks.forEach(block => {
        block.classList.remove("flipped");

        block.classList.remove("matched");
    });

    playerScore.style.display = "block";

    setTimeout(() => {
        playerScore.style.display = "none";
        popup.style.display = "block";
    }, 4000);

    popupInput.style.display = "none";
    theMainFace.style.cssText = "margin-left: -3%; margin-top: 27px;";
    
    mainFaceButton.addEventListener("click", () => {

        audioController.flipCardMusic();

        if (arrayOfLevels[0].firstElementChild.checked || arrayOfLevels[1].firstElementChild.checked || arrayOfLevels[2].firstElementChild.checked) {

                wrongTries.innerText = "0";
                arrayOfMatchedBlocks = [];
                allFlippedBlocks = [];
                audioController.startGameMusic();
                countDown();
                
            if (arrayOfLevels[0].firstElementChild.checked) {
                
                timeRemaining.innerText = "100";

                popup.style.display = "none";
                gameBlocks.forEach(block => {
                    block.classList.add("flipped");
                });
    
                setTimeout(() => {
                    gameBlocks.forEach(block => {
                        block.classList.remove("flipped");
                    });
                }, 10000);

            } else if (arrayOfLevels[1].firstElementChild.checked) {
                
                timeRemaining.innerText = "50";

                popup.style.display = "none";
                gameBlocks.forEach(block => {
                    block.classList.add("flipped");
                });
    
                setTimeout(() => {
                    gameBlocks.forEach(block => {
                        block.classList.remove("flipped");
                    });
                }, 7000);

            } else {

                timeRemaining.innerText = "30";

                popup.style.display = "none";
                gameBlocks.forEach(block => {
                    block.classList.add("flipped");
                });
    
                setTimeout(() => {
                    gameBlocks.forEach(block => {
                        block.classList.remove("flipped");
                    });
                }, 4000);

            }    
        }
        
    });

    gameBlocks.forEach((block, index) => {

        block.style.order = orderRange[index];

        block.addEventListener("click", () => {
            
            flipped(block);
        });
    });
}

function restartGameOver() {

    shuffleCards(orderRange);

    if (audioButtons[1].classList.contains("visible")) {

        audioButtons[1].classList.remove("visible");
        audioButtons[0].classList.add("visible");
    }

    audioButtons[0].onclick = () => {
        muted();
    };

    audioButtons[1].onclick = () => {
        unMuted();
    };
    
    document.querySelector(".game-over").classList.add("visible");
    document.querySelector(".game-over .loser-name").innerText = popupInput.value;
    
    gameBlocks.forEach(block => {
        block.classList.remove("flipped");

        block.classList.remove("matched");
    });

    setTimeout(() => {
        document.querySelector(".game-over").classList.remove("visible");
        popup.style.display = "block";
    }, 3500);
    
    popupInput.style.display = "none";
    theMainFace.style.cssText = "margin-left: -3%; margin-top: 27px;";

    mainFaceButton.addEventListener("click", () => {

        audioController.flipCardMusic();

        if (arrayOfLevels[0].firstElementChild.checked || arrayOfLevels[1].firstElementChild.checked || arrayOfLevels[2].firstElementChild.checked) {

            wrongTries.innerText = "0";
            arrayOfMatchedBlocks = [];
            allFlippedBlocks = [];
            audioController.startGameMusic();
            countDown();
            
            if (arrayOfLevels[0].firstElementChild.checked) {

                timeRemaining.innerText = "100";

                popup.style.display = "none";
                gameBlocks.forEach(block => {
                    block.classList.add("flipped");
                });
    
                setTimeout(() => {
                    gameBlocks.forEach(block => {
                        block.classList.remove("flipped");
                    });
                }, 10000);

            } else if (arrayOfLevels[1].firstElementChild.checked) {

                timeRemaining.innerText = "50";

                popup.style.display = "none";
                gameBlocks.forEach(block => {
                    block.classList.add("flipped");
                });
    
                setTimeout(() => {
                    gameBlocks.forEach(block => {
                        block.classList.remove("flipped");
                    });
                }, 7000);

            } else {

                timeRemaining.innerText = "30";

                popup.style.display = "none";
                gameBlocks.forEach(block => {
                    block.classList.add("flipped");
                });
    
                setTimeout(() => {
                    gameBlocks.forEach(block => {
                        block.classList.remove("flipped");
                    });
                }, 4000);

            }    

        }
    
    });
    gameBlocks.forEach((block, index) => {

        block.style.order = orderRange[index];

        block.addEventListener("click", () => {
    
            flipped(block);
        });
    });
}

function shuffleCards(array) {
    let currentIndex = array.length, randomNumber, currentValue;

    while ( currentIndex > 0) {

        randomNumber = Math.floor(Math.random() * currentIndex);

        currentIndex--;

        currentValue = array[currentIndex];

        array[currentIndex] = array[randomNumber];

        array[randomNumber] = currentValue;
    }

    return array;

}

function muted() {

    audioButtons[0].classList.remove("visible");
    audioButtons[1].classList.add("visible");
    audioController.stopGameMusic();
}


function unMuted() {

    audioButtons[0].classList.add("visible");
    audioButtons[1].classList.remove("visible");
    audioController.startGameMusic();
}
