function controlSnake(e){
    if(e.keyCode == 13){ // Enter
        stopMove();
        startGame();
        //initNewGame();
        return;
    }

    d0 = model.snakes[0].direction;
    if (e.keyCode == 37 && d0.x != 1) { // left
        model.snakes[0].nextDirection = { y: 0, x: -1 };
    }
    if (e.keyCode == 39 && d0.x != -1) { // right
        model.snakes[0].nextDirection = { y: 0, x: 1 };
    }
    if (e.keyCode == 38 && d0.y != 1) { // up
        model.snakes[0].nextDirection = { y: -1, x: 0 };
    }
    if (e.keyCode == 40 && d0.y != -1) { // down
        model.snakes[0].nextDirection = { y: 1, x: 0 };
    }

    try{
        d1 = model.snakes[1].direction;
        if (e.keyCode == 65 && d1.x != 1) { // left
            model.snakes[1].nextDirection = { y: 0, x: -1 };
        }
        if (e.keyCode == 68 && d1.x != -1) { // right
            model.snakes[1].nextDirection = { y: 0, x: 1 };
        }
        if (e.keyCode == 87 && d1.y != 1) { // up
            model.snakes[1].nextDirection = { y: -1, x: 0 };
        }
        if (e.keyCode == 83 && d1.y != -1) { // down
            model.snakes[1].nextDirection = { y: 1, x: 0 };
        }
    } catch{}
}

let listOfTails = undefined;
function move(){
    let result = []
    
    for(let snake=0; snake<gameState.players; snake++){
        if(snake===0){
            listOfTails = undefined;
        }
        result.push(moveSnake(model.snakes[snake], snake));
    }
    listOfTails = result.map(s => s.lastTail)//////////////////
    console.log(listOfTails)
    result.forEach(s => {if(s.ateApple){placeApple()}})

    // Marks both snakes as crashed if their heads move into the same area at the same time.
    for(let i=0; i<gameState.players-1; i++){
        for(let j=i+1; j<gameState.players; j++){
            if(result[i].head.x===result[j].head.x && result[i].head.y===result[j].head.y){
                result[i].crashed = true;
                result[j].crashed = true;
            }
        }
    }
    
    let listOfCrashes = result.map(p => p.crashed);
    let livingSnakes = 0;
    for(let i=0; i<gameState.players; i++){
        if(!result[i].crashed){
            livingSnakes++;
        }
    }

    let colors = ['Blue', 'Green'];
    for(let i=0; i<gameState.players; i++){
        if(result[i].points >= gameState.winningScore){
            winnerTxt = `${colors[i]} won!`;
            showBoard();
            stopMove();
            return;
        }
    }

    let winner;
    if(livingSnakes===1 && gameState.players>1){
        winner = listOfCrashes.indexOf(false);
        winnerTxt = `${colors[winner]} won!`;
        stopMove();
        return;
    }
    else if(livingSnakes===0){
        winnerTxt = `It's a tie!`;
        stopMove();
        return;
    }

    showBoard();
}

function moveSnake(snake, index){
    let head = snake.position[0];

    let result = {ateApple: false, crashed: false};
    result.lastTail = snake.position[snake.position.length-1];
    snake.direction = checkDirection(snake.direction, snake.nextDirection);
    d = snake.direction;

    let newHead = {y: head.y + d.y, x: head.x + d.x}
    result.head = newHead;
    result.points = snake.position.length - gameState.startLength;
    if(checkCrashWithWall(newHead)){
        result.crashed = true;
        return(result);
    }

    snake.position.splice(0, 0, newHead);
    if(model.board.rows[newHead.y].cells[newHead.x].hasApple){
        model.board.rows[newHead.y].cells[newHead.x].hasApple = false;
        snake.size++;
        result.points++;
        result.ateApple = true;
    }
    else{
        let tail = snake.position.splice(snake.size, 1)[0];
        model.board.rows[tail.y].cells[tail.x].hasBody = false;
        model.board.rows[tail.y].cells[tail.x].anyBody = false;
        result.ateApple = false;
    }

    if(checkCrashWithSnake(newHead)){
        result.crashed = true;
        return(result);
    } //////////////////////////// Fix tail collision

    placeSnake(snake, index)
    return(result);
}

function checkCrashWithWall(head){
    if(head.y < 0 || head.y >= gameState.boardSize.height || head.x < 0 || head.x >= gameState.boardSize.width){
        return(true);
    }
    return(false);
}

function checkCrashWithSnake(head){
    if(model.board.rows[head.y].cells[head.x].anyBody){
        return(true);
    }
    return(false);
}

function checkDirection(d, nd){ // (direction, nextDirection)
    if(d.x != 0 && nd.x == 0 || d.x == 0 && nd.x != 0){
        return(nd);
    }
    return(d);
}


function stopMove(){
    clearInterval(gameTick);
    document.getElementById('winner').innerHTML = winnerTxt;
    gameState.running = 'no';
    toggleOptions(false);
}