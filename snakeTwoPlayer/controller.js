function controlSnake(e){
    if(e.keyCode == 13 && gameState.running == false){ // Enter
        stopMove();
        startGame();
        //initNewGame();
        return;
    }

    let snake0 = model.snakes[0];
    let d0 = snake0.direction;
    if (e.keyCode == 37 && d0.x != 1) { // left 'Left Arrow'
        snake0.nextDirection = { y: 0, x: -1 };
    }
    if (e.keyCode == 39 && d0.x != -1) { // right 'Right Arrow'
        snake0.nextDirection = { y: 0, x: 1 };
    }
    if (e.keyCode == 38 && d0.y != 1) { // up 'Up Arrow'
        snake0.nextDirection = { y: -1, x: 0 };
    }
    if (e.keyCode == 40 && d0.y != -1) { // down 'Down Arrow'
        snake0.nextDirection = { y: 1, x: 0 };
    }

    try{
        snake1 = model.snakes[1];
        let d1 = snake1.direction;
        if (e.keyCode == 65 && d1.x != 1) { // left 'A'
            snake1.nextDirection = { y: 0, x: -1 };
        }
        if (e.keyCode == 68 && d1.x != -1) { // right 'D'
            snake1.nextDirection = { y: 0, x: 1 };
        }
        if (e.keyCode == 87 && d1.y != 1) { // up 'W'
            snake1.nextDirection = { y: -1, x: 0 };
        }
        if (e.keyCode == 83 && d1.y != -1) { // down 'S'
            snake1.nextDirection = { y: 1, x: 0 };
        }
    } catch{}

    try{
        let snake2 = model.snakes[2];
        let d2 = snake2.direction;
        if (e.keyCode == 76 && d2.x != 1) { // left 'L'
            snake2.nextDirection = { y: 0, x: -1 };
        }
        if (e.keyCode == 222 && d2.x != -1) { // right 'Æ'
            snake2.nextDirection = { y: 0, x: 1 };
        }
        if (e.keyCode == 80 && d2.y != 1) { // up 'P'
            snake2.nextDirection = { y: -1, x: 0 };
        }
        if (e.keyCode == 192 && d2.y != -1) { // down 'Ø'
            snake2.nextDirection = { y: 1, x: 0 };
        }
    } catch{}

    try{
        let snake3 = model.snakes[3];
        let d3 = snake3.direction;
        if ((e.keyCode == 71 || e.keyCode == 100) && d3.x != 1) { // left 'G' or '4' (numpad)
            snake3.nextDirection = { y: 0, x: -1 };
        }
        if ((e.keyCode == 74 || e.keyCode == 102) && d3.x != -1) { // right 'J' or '6' (numpad)
            snake3.nextDirection = { y: 0, x: 1 };
        }
        if ((e.keyCode == 89 || e.keyCode == 104) && d3.y != 1) { // up 'Y' or '8' (numpad)
            snake3.nextDirection = { y: -1, x: 0 };
        }
        if ((e.keyCode == 72 || e.keyCode == 101) && d3.y != -1) { // down 'H' or '5' (numpad)
            snake3.nextDirection = { y: 1, x: 0 };
        }
    } catch{}
}



function move(){
    let result = [];

    model.snakes.forEach((snake, i) => {
        if(snake.alive){
            result[i] = {};
            result[i].head = nextHeadPosition(snake);
            result[i].crashedThisTurn = checkCrashWithWall(result[i].head, i);
            //snake.alive = checkCrashWithWall(result[i].head, i);
        }
        else{
            try{
                result[i].crashedThisTurn = false;
            } catch{}
        }
    })
    model.snakes.forEach((snake, i) => {
        if(snake.alive && !result[i].crashedThisTurn){
            result[i].ateApple = ateApple(result[i].head, i);
        }
    })
    model.snakes.forEach((snake, i) => {
        if(snake.alive){
            if(!result[i].ateApple){
                removeTail(snake, i);
            }
        }
    })
    model.snakes.forEach((snake, i) => {
        if(snake.alive && !result[i].crashedThisTurn){
            result[i].crashedThisTurn = checkCrashWithSnake(result[i].head, i);
            //snake.alive = checkCrashWithSnake(result[i].head, i);
        }
    })

    // Checks for cases where 2 snake heads move into the same cell.
    for(let i=0; i<gameState.players-1; i++){
        for(let j=i+1; j<gameState.players; j++){
            if(model.snakes[i].alive && model.snakes[j].alive){
                if(result[i].head.x===result[j].head.x && result[i].head.y===result[j].head.y){
                    result[i].crashedThisTurn = true;
                    result[j].crashedThisTurn = true;
                    //model.snakes[i].alive = false;
                    //model.snakes[j].alive = false;
                }
            }
        }
    }

    
    result.forEach((res, i) => {
        if(res.crashedThisTurn){
            model.snakes[i].alive = false;
            removeSnake(model.snakes[i], i);
        }
    })

    // Puts in the new head position
    model.snakes.forEach((snake, i) => {
        if(snake.alive){
            snake.position.splice(0, 0, result[i].head);
        }
    })

    model.snakes.forEach((snake, i) => {
        if(snake.alive){
            placeSnake(snake, i);
        }
    })



    let listOfLiving = model.snakes.map(s => s.alive);
    let numberOfLivingSnakes = 0;
    for(let i=0; i<gameState.players; i++){
        if(model.snakes[i].alive){
            numberOfLivingSnakes++;
        }
    }
    let colors = ['Blue', 'Green', 'Yellow', 'Purple'];
    for(let i=0; i<gameState.players; i++){
        if(model.snakes[i].points   >= gameState.winningScore){
            winnerTxt = gameState.players>1 ? `${colors[i]} won!` : `You Won!`;
            showBoard();
            stopMove();
            return;
        }
    }
    let winner;
    if(numberOfLivingSnakes===1 && gameState.players>1){
        winner = listOfLiving.indexOf(true);
        winnerTxt = `${colors[winner]} won!`;
        stopMove();
        return;
    }
    else if(numberOfLivingSnakes===0){
        winnerTxt = gameState.players>1 ? `It's a tie!` : `Game Over!`;
        stopMove();
        return;
    }


    result.forEach((snake, i) => {
        if(snake.ateApple && model.snakes[i].alive){placeApple()}
        else{return}
    })
    showBoard();
}

function nextHeadPosition(snake){
    let head = snake.position[0];
    snake.direction = checkDirection(snake.direction, snake.nextDirection);
    let d = snake.direction;

    let newHeadPosition = {y: head.y + d.y, x: head.x + d.x};
    return(newHeadPosition);
}

function ateApple(head, i){
    if(model.board.rows[head.y].cells[head.x].hasApple){
        model.board.rows[head.y].cells[head.x].hasApple = false;
        model.snakes[i].points++;
        return(true);
    }
    return(false); 
}

function removeTail(snake, i){
    let tail = snake.position.splice(snake.position.length -1, 1)[0];
    model.board.rows[tail.y].cells[tail.x].hasBody = false;
    model.board.rows[tail.y].cells[tail.x].anyBody = false;
}

function checkCrashWithWall(head, i){
    if(head.y < 0 || head.y >= gameState.boardSize.height || head.x < 0 || head.x >= gameState.boardSize.width){
        //removeSnake(model.snakes[i]);
        return(true);
    }
    return(false);
}

function checkCrashWithSnake(head, i){
    if(model.board.rows[head.y].cells[head.x].anyBody){
        //removeSnake(model.snakes[i]);
        return(true);
    }
    return(false);
}

// Ignores input if it's forward or backward relative to the current direction.
function checkDirection(d, nd){ // (direction, nextDirection)
    if(d.x != 0 && nd.x == 0 || d.x == 0 && nd.x != 0){
        return(nd);
    }
    return(d);
}

function removeSnake(snake){
    snake.position.forEach(cell => {
        model.board.rows[cell.y].cells[cell.x].hasBody = false;
        model.board.rows[cell.y].cells[cell.x].hasHead = false;
        model.board.rows[cell.y].cells[cell.x].anyBody = false;
    })
}


function stopMove(){
    clearInterval(gameTick);
    document.getElementById('winner').innerHTML = winnerTxt;
    gameState.running = false;
    toggleOptions(false);
}