let count = 3;
function startGame(){
    toggleOptions(true);
    initNewGame();
    
    count = 3;
    if(gameState.running === false){
        gameState.running = null;
        document.getElementById('overlay').classList.remove('hide');
        countdown();
    }
    
    gameState.running = true;
}

function toggleOptions(onOrOff){
    let options = document.getElementById('options').querySelectorAll('.input');
    options.forEach(option => option.disabled = onOrOff);
}


function countdown(){
    document.getElementById('countdown').innerHTML = count;
    if(count>0){
        count--;
        setTimeout(countdown, 500);
        return;
    }
    gameTick = setInterval(move, gameState.speed);
    document.getElementById('overlay').classList.add('hide');
}

function changeNumberOfPlayers(element){
    let newValue = parseInt(element.value);
    gameState.players = newValue;
    initNewGame();
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
}

changeWinCondition
function changeWinCondition(element){
    let newValue = parseInt(element.value);
    gameState.winningScore = newValue;
}