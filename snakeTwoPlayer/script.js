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
    running: 'no'
}
let gameTick;
let boardView = document.getElementById('snakeTable');
let winnerTxt = '';

initNewGame();
function initNewGame(){
    initBoard();
    model.snakes = [];
    gameState.running = 'no';
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
    snake.alive = true;
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
        snake.nextDirection = {y: 0, x: 1};
    }
    if(index===2){
        let startWidth = Math.floor(width*3/4-1);
        for(i=snake.size; i>0; i--){
            snake.position.push({y: i-1, x: startWidth});
        }
        snake.direction     = {y: 1, x: 0};
        snake.nextDirection = {y: 1, x: 0};
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
    if(aboveAppleLimit()){
        return;
    }

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

function aboveAppleLimit(){
    let emptyCells = 0;
    let placedApples = 0;

    //This variable decides the maximum fraction of non-snake cells that can have apples
    let maxFractionOfApples = 0.5;

    for(rowIndex=0; rowIndex<gameState.boardSize.height; rowIndex++){
        let modelRow = model.board.rows[rowIndex];
        for(cellIndex=0; cellIndex<gameState.boardSize.width; cellIndex++){
            let cell = modelRow.cells[cellIndex];
            if((cell.hasApple || cell.hasHead || cell.hasBody) === false){
                emptyCells++;
            }
            if(cell.hasApple){
                placedApples++;
            }
        }
    }
    let appleOrEmpty = emptyCells + placedApples;
    if(placedApples/appleOrEmpty > maxFractionOfApples){
        return(true);
    }
    return(false);
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
            else if(modelCell.hasHead){
                viewCell.classList.add(`snakeHead${modelCell.player}`);
            }
            else if(modelCell.hasBody){
                viewCell.classList.add(`snakeBody${modelCell.player}`);
                
                for(let i in gameState.players){
                    viewCell.classList.remove(`snakeHead${i}`);
                }
            }
            // Helps keep cells square in a narrow window, along with CSS for "td".
            viewCell.innerHTML = `<div style="min-width:30px"></div>`;
        }
    }
    model.snakes.forEach(updateScore);
    document.getElementById('winner').innerHTML = winnerTxt;

    // Enables the score-boxes for players
    for(let i=0; i<4; i++){
        if(i < gameState.players){
            document.getElementById(`score${i}`).classList.remove('hide');
        }
        else{
            document.getElementById(`score${i}`).classList.add('hide');
        }
    }
}

function updateScore(snake, index){
    document.getElementById(`score${index}`).innerHTML = snake.size - gameState.startLength;
}