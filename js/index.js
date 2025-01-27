let inputDir  = {x: 0, y: 0};
const foodSound = new Audio('../music/food.mp3');
const gameOverSound = new Audio('../music/gameover.mp3');
const moveSound = new Audio('../music/move.mp3');
const musicSound = new Audio('../music/music.mp3');
let speed = 8;
let index = 0;
let lastPaintTime = 0;
let score = 0;
let snakeArr = [
    {x: 13, y: 15}
];
let food = {x: 6, y: 7};


//Main Game Function
function main(ctime){
   window.requestAnimationFrame(main);
    // console.log(ctime);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake){
  //If you bummb into yourself
  for(let i = 1; i < snake.length; i++){
    //snake head bumping to itself
    if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
      return true;
    }
  }
  
  //snake bumping to the grid of the border
  if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0){
    return true;
  }

  return false;
}

function gameEngine(){
  //Updating the snake array and food
  if(isCollide(snakeArr)){
    gameOverSound.play();
    musicSound.pause();
    inputDir = {x: 0, y: 0};
    alert("Game Over. Press any key to play again!");
    scoreBox.innerHTML = "Score: 0";
    snakeArr = [{x: 13, y: 15}];
    food = {x: 6, y: 7};
    // musicSound.play();
    score = 0;
    highScoreBox.innerHTML = "High Score: " + highScoreVal;
  }

  //If you have eaten the food, increment the score and regenerate the food
  if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
    foodSound.play();
    score += 1;
    if(score > highScoreVal){
      highScoreVal = score;
      localStorage.setItem("highScore", JSON.stringify(highScoreVal));
      // highScoreBox.innerHTML = "High Score: " + highScoreVal;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
    //Our grid size is from 0 to 18 thus to keep things simple its 2 to 16
    let a = 2;
    let b = 16;
    // food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())}; //Its a direct formula for generating a Random number b/w a to b.
    // Ensure the new food does not overlap with the snake body
    let isFoodOnSnake = true;
    while (isFoodOnSnake) {
      // Generate new random food position
      food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())};
      // Check if the new position overlaps with the snake
      isFoodOnSnake = snakeArr.some(segment => segment.x === food.x && segment.y === food.y);
    }

  }

  //Moving the snake
  for(let i = snakeArr.length-2; i>=0; i--){
    //the last element will move to the second last element and so on

    snakeArr[i+1] = {...snakeArr[i]};
  }

  //new position of
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;


  //Displaying the Snake
  board.innerHTML = "";
  snakeArr.forEach((e,index)=>{
    snakeElement = document.createElement('div');
    //The div created will start at the row of e.y and column of e.x
    snakeElement.style.gridRowStart = e.y; //as the row is moving downwars so we are using y
    snakeElement.style.gridColumnStart = e.x; //as the column is moving rightwards so we are using x
    if(index === 0){
      snakeElement.classList.add('head');
    }
    else{
      snakeElement.classList.add('snake');
    }
    board.appendChild(snakeElement);  
  });

  //Displaying the Food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y; 
    foodElement.style.gridColumnStart = food.x; 
    foodElement.classList.add('food');
    board.appendChild(foodElement);  
}


//Main Logic Starts here
let highScore = localStorage.getItem("highScore");
if(highScore === null){
  highScoreVal = 0;
  localStorage.setItem("highScore", JSON.stringify(highScoreVal));
}
else{
  highScoreVal = JSON.parse(highScore);
  highScoreBox.innerHTML = "High Score: " + highScore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: 1}; //Start the game 
    moveSound.play();
    switch(e.key){
      case "ArrowUp":
        // console.log("ArrowUp");
        inputDir.x = 0;
        inputDir.y = -1;  //-1 because the origin in js starts from top left corner of the box.
        break;

      case "ArrowDown":
        // console.log("ArrowDown");
        inputDir.x = 0;
        inputDir.y = 1;
        break;

      case "ArrowLeft":
        // console.log("ArrowLeft");
        inputDir.x = -1;
        inputDir.y = 0;
        break;

      case "ArrowRight":
        // console.log("ArrowRight");'
        inputDir.x = 1;
        inputDir.y = 0;
        break;

      default:
        break;
    }
});