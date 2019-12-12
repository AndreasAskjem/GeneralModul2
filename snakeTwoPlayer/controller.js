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
    } catch{return}
}



function move(){
    let result = [];

    model.snakes.forEach((snake, i) => {
        result[i] = {};
        result[i].head = nextHeadPosition(snake);
        result[i].crashed = checkCrashWithWall(result[i].head, i)
    })
    model.snakes.forEach((snake, i) => {
        if(!result[i].crashed){
            result[i].ateApple = ateApple(result[i].head, i);
        }
    })
    model.snakes.forEach((snake, i) => {
        if(!result[i].ateApple && !result[i].crashed){
            removeTail(snake, i);
        }
    })
    model.snakes.forEach((snake, i) => {
        if(!result[i].crashed){
            result[i].crashed = checkCrashWithSnake(result[i].head);
        }
    })

    for(let i=0; i<gameState.players-1; i++){
        for(let j=i+1; j<gameState.players; j++){
            if(result[i].head.x===result[j].head.x && result[i].head.y===result[j].head.y){
                result[i].crashed = true;
                result[j].crashed = true;
            }
        }
    }

    model.snakes.forEach((snake, i) => {
        if(!result[i].crashed){
            snake.position.splice(0, 0, result[i].head);
        }
    })

    model.snakes.forEach((snake, i) => {
        if(!result[i].crashed){
            placeSnake(snake, i);
        }
    })



    let listOfCrashes = result.map(s => s.crashed);
    let livingSnakes = 0;
    for(let i=0; i<gameState.players; i++){
        if(!result[i].crashed){
            livingSnakes++;
        }
    }
    //console.log(result);
    let colors = ['Blue', 'Green'];
    for(let i=0; i<gameState.players; i++){
        if(model.snakes[i].size - gameState.startLength >= gameState.winningScore){
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
        return(true)
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