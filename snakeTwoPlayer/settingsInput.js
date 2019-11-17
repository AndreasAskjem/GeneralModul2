function startGame(){
    if(gameState.ongoing === false){
        gameTick = setInterval(move, gameState.speed);
    }
    gameState.ongoing = true;
}

function changeSize(element){
    let newValue = parseInt(element.value);
    gameState.boardSize.height = newValue;
    gameState.boardSize.width = newValue;
    initNewGame();
}

function changeApples(element){
    let newValue = parseInt(element.value);
    gameState.numberOfApples = newValue;
    initNewGame();
}

function changeSpeed(element){
    let newValue = parseInt(element.value);
    gameState.speed = newValue;
    initNewGame();
}

changeWinCondition
function changeWinCondition(element){
    let newValue = parseInt(element.value);
    gameState.winningScore = newValue;
    initNewGame();
}