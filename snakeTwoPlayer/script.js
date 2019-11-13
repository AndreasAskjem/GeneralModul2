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
    speed: 1000
}
let gameTick;
let boardView = document.getElementById('snakeTable');

startNewGame();
function startNewGame(){
    initBoard();
    model.snakes = [];
    for(let i=0; i<gameState.players; i++){
        initSnakePosition(i);
    }
    model.snakes.forEach(placeSnake);
    placeApple();
    showBoard();
    gameTick = setInterval(move, gameState.speed);
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
    //console.log(snake);
    for(let index in snake.position){
        console.log(snake.position[index]);
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
    do{
        y = Math.floor(Math.random()*gameState.boardSize.height);
        x = Math.floor(Math.random()*gameState.boardSize.width);
    } while(model.board.rows[y].cells[x].hasBody);

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
}

function controlSnake(e){
    if(e.keyCode == 13){ // Enter
        stopMove();
        startNewGame();
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



////////////////////////////////////////////
/*
Order of move events:
    move snake 1 (grow?)
    move snake 2 (grow?)
    crash ? stopMove : continue
    ateApple ? placeApple : continue
    showBoard()
*/


function move(){
    let result = []
    for(let snake=0; snake<gameState.players; snake++){
        //console.log(model.snakes[snake])
        result.push(moveSnake(model.snakes[snake], snake));
    }
    //console.log(result)
    /*
    for(let snake=0; snake<gameState.players; snake++){
        result[snake].crashed = checkCrash(model.snakes[snake], snake);
    }
    */



    for(let snake=0; snake<gameState.players; snake++){
        if(result[snake].crashed){
            stopMove();
            break;
        }
    }
    showBoard();
}

function moveSnake(snake, index){
    let head = snake.position[0];
    let result = {};
    //console.log(head.x + ' ' + head.y);
    snake.direction = checkDirection(snake.direction, snake.nextDirection);
    d = snake.direction;
    let newHead = {y: head.y + d.y, x: head.x + d.x}
    //console.log(newHead.x, newHead.y, snake.player);
    snake.position.splice(0, 0, newHead);
    

    if(model.board.rows[newHead.y].cells[newHead.x].hasApple){
        model.board.rows[newHead.y].cells[newHead.x].hasApple = false;
        snake.size++;
        result.ateApple = true;
    }
    else{
        let tail = snake.position.splice(snake.size, 1)[0];
        model.board.rows[tail.y].cells[tail.x].hasBody = false;
        model.board.rows[tail.y].cells[tail.x].anyBody = false
        result.ateApple = false
    }

    result.crash = checkCrash(snake);

    //model.snakes[index] = snake;
    placeSnake(snake, index)
    return(result);
}

function checkCrash(snake){
    let head = snake.position[0]
    //console.log(snake);
    if(head.y < 0 || head.y >= gameState.boardSize.height || head.x < 0 || head.x >= gameState.boardSize.width){
        console.log('it should have stopped');
        //alert(`${index === 0 ? 'Blue' : 'Green'} player crashed with the wall and ate ${model.snakes[index].size-gameState.startLength} apples!`);
        return(true);
    }
    // Crash with snake /////////////////////////////////
    if(model.board.rows[head.y].cells[head.x].anyBody){
        //alert(`${index === 0 ? 'Blue' : 'Green'} player crashed with snake and ate ${model.snakes[index].size-gameState.startLength} apples!`);
        console.log(`${snake.player === 0 ? 'Blue' : 'Green'} player crashed with snake and ate ${model.snakes[index].size-gameState.startLength} apples!`)
        return(true);
    }
    return(false);
}

//////////////////////////////////////////


function checkDirection(d, nd){ // (direction, nextDirection)
    if(d.x != 0 && nd.x == 0 || d.x == 0 && nd.x != 0){
        return(nd);
    }
    return(d);
}


function stopMove(){
    clearInterval(gameTick);
}


// Possible model setup.
/*
let model = {
    boardSize: {
        height: 10,
        width: 10
    },
    board: {
        0: {
            0: {
                hasApple: false,
                hasBody1: false,
                hasHead1: false,
                hasBody2: false,
                hasHead2: false
            },
            1: {
                adawd: 'has stuff'
            }
        },
        1: {
            row: 'has cells'
        }
    },
    snakes: [
        {
            position: [
                {
                    x: 3,
                    y: 3
                },
                {
                    x: 4,
                    y: 3
                }
            ],
            size: 3,
            direction: {y: 0, x:1},
            nextDirection: {y: 0, x: 1}
        },
        {
            position: [
                {
                    x: 8,
                    y: 4
                },
                {
                    x: 7,
                    y: 4
                }
            ],
            size: 3,
            direction: {y: 0, x: -1},
            nextDirection: {y: 0, x: 1}
        }
    ]
}
*/