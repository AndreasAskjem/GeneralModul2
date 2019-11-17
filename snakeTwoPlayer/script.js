let model = {
    snakes: []
};

let gameState = {
    boardSize: {
        height: 10,
        width: 10
    },
    players: 2,
    startLength: 3,
    winningScore: 20,
    numberOfApples: 1,
    speed: 400,
    ongoing: false
}
let gameTick;
let boardView = document.getElementById('snakeTable');
let winnerTxt = '';

initNewGame();
function initNewGame(){
    initBoard();
    model.snakes = [];
    gameState.ongoing = false;
    for(let i=0; i<gameState.players; i++){
        initSnakePosition(i);
    }
    model.snakes.forEach(placeSnake);
    winnerTxt = '';
    for(let i=0; i<gameState.numberOfApples; i++){
        placeApple();
    }
    
    showBoard();
}

function initSnakePosition(index){
    snake = {};
    snake.position = [];
    snake.size = gameState.startLength;
    let width = gameState.boardSize.width;
    let height = gameState.boardSize.height;
    if(index===0){
        let startHeight = Math.floor(height*3/4-1);
        for(i=width-snake.size; i<width; i++){
            snake.position.push({y: startHeight, x: i});
        }
        snake.direction     = {y: 0, x: -1};
        snake.nextDirection = {y: 0, x: -1};
    }
    if(index===1){
        let startHeight = Math.ceil(height/4);
        for(i=snake.size; i>0; i--){
            snake.position.push({y: startHeight, x: i-1});
        }
        snake.direction     = {y: 0, x: 1};
        snake.nextDirection = {y: 0, x: 1}
    }
    snake.player = index;
    model.snakes.push(snake);
}

function initBoard(){
    model.board = {};
    model.board.rows = [];

    for(rowIndex=0; rowIndex<gameState.boardSize.height; rowIndex++){
        let newRow = {};
        newRow.cells = [];
        for(cellIndex=0; cellIndex<gameState.boardSize.width; cellIndex++){
            let newCell = {};
            newCell.hasHead = false;
            newCell.hasBody = false;
            newCell.hasApple = false;
            newCell.anyBody = false;
            newRow.cells.push(newCell);
        }
        model.board.rows.push(newRow);
    }
}

function placeSnake(snake, number){
    for(let index in snake.position){
        y = snake.position[index].y;
        x = snake.position[index].x;
        if(index==0){
            //console.log(snake.position[0].x, snake.position[0].y)
            model.board.rows[y].cells[x].hasHead = true;
        }
        else{
            model.board.rows[y].cells[x].hasHead = false;
        }
        model.board.rows[y].cells[x].hasBody = true;
        model.board.rows[y].cells[x].anyBody = true;
        model.board.rows[y].cells[x].player = number;
    }
}

function placeApple(){
    let y;
    let x;
    let cell;
    do{
        y = Math.floor(Math.random()*gameState.boardSize.height);
        x = Math.floor(Math.random()*gameState.boardSize.width);
        cell = model.board.rows[y].cells[x];
    } while(cell.hasBody || cell.hasHead || cell.hasApple);

    model.board.rows[y].cells[x].hasApple = true;
}


function showBoard(){
    boardView.innerHTML = '';
    for(rowIndex=0; rowIndex<gameState.boardSize.height; rowIndex++){
        let viewRow = boardView.insertRow();
        let modelRow = model.board.rows[rowIndex];
        for(cellIndex=0; cellIndex<gameState.boardSize.width; cellIndex++){
            let viewCell = viewRow.insertCell();
            let modelCell = modelRow.cells[cellIndex];

            if(modelCell.hasApple){
                viewCell.classList.add('apple');
            }
            if(modelCell.hasHead){
                viewCell.classList.add(`snakeHead${modelCell.player}`);
            }
            else if(modelCell.hasBody){
                viewCell.classList.add(`snakeBody${modelCell.player}`);
                
                try{
                    viewCell.classList.remove('snakeHead0');
                    viewCell.classList.remove('snakeHead1');
                } catch{}
            }
        }
    }
    model.snakes.forEach(updateScore);
    document.getElementById('winner').innerHTML = winnerTxt;
}

function updateScore(snake, index){
    document.getElementById(`score${index}`).innerHTML = snake.size - gameState.startLength;
}


function controlSnake(e){
    if(e.keyCode == 13){ // Enter
        stopMove();
        initNewGame();
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
}


function move(){
    let result = []
    for(let snake=0; snake<gameState.players; snake++){
        result.push(moveSnake(model.snakes[snake], snake));
    }

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
    if(livingSnakes===1){
        
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
        model.board.rows[tail.y].cells[tail.x].anyBody = false
        result.ateApple = false
    }

    if(checkCrashWithSnake(newHead)){
        result.crashed = true;
        return(result);
    }

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
}
