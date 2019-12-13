function controlSnake(e){
    if(e.keyCode == 13){ // Enter
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
    } catch{return}

    
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
    } catch{return}
    
}



function move(){
    let result = [];

    model.snakes.forEach((snake, i) => {
        result[i] = {};
        result[i].head = nextHeadPosition(snake);
        snake.alive = checkCrashWithWall(result[i].head, i)
    })
    model.snakes.forEach((snake, i) => {
        if(snake.alive){
            result[i].ateApple = ateApple(result[i].head, i);
        }
    })
    model.snakes.forEach((snake, i) => {
        if(!result[i].ateApple && snake.alive){
            removeTail(snake, i);
        }
    })
    model.snakes.forEach((snake, i) => {
        if(snake.alive){
            snake.alive = checkCrashWithSnake(result[i].head);
        }
    })

    for(let i=0; i<gameState.players-1; i++){
        for(let j=i+1; j<gameState.players; j++){
            if(result[i].head.x===result[j].head.x && result[i].head.y===result[j].head.y){
                model.snakes[i].alive = false;
                model.snakes[j].alive = false;
            }
        }
    }

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
    let livingSnakes = 0;
    for(let i=0; i<gameState.players; i++){
        if(model.snakes[i].alive){
            livingSnakes++;
        }
    }
    let colors = ['Blue', 'Green', 'Yellow'];
    for(let i=0; i<gameState.players; i++){
        if(model.snakes[i].size - gameState.startLength >= gameState.winningScore){
            winnerTxt = gameState.players>1 ? `${colors[i]} won!` : `You Won!`;
            showBoard();
            stopMove();
            return;
        }
    }
    let winner;
    if(livingSnakes===1 && gameState.players>1){
        winner = listOfLiving.indexOf(true);
        winnerTxt = `${colors[winner]} won!`;
        stopMove();
        return;
    }
    else if(livingSnakes===0){
        winnerTxt = gameState.players>1 ? `It's a tie!` : `Game Over!`;
        stopMove();
        return;
    }


    result.forEach(s => {if(s.ateApple){placeApple()}})
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
        model.snakes[i].size++;
        return(true);
    }
    return(false); 
}

function removeTail(snake, i){
    let tail = snake.position.splice(snake.size -1, 1)[0];
    model.board.rows[tail.y].cells[tail.x].hasBody = false;
    model.board.rows[tail.y].cells[tail.x].anyBody = false;
}

function checkCrashWithWall(head){
    if(head.y < 0 || head.y >= gameState.boardSize.height || head.x < 0 || head.x >= gameState.boardSize.width){
        return(false);
    }
    return(true);
}

function checkCrashWithSnake(head){
    if(model.board.rows[head.y].cells[head.x].anyBody){
        return(false);
    }
    return(true);
}

// Ignores input if it's forward or backward relative to the current direction.
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