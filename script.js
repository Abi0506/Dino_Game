import Player from "./script2.js";
import Ground from "./script3.js";
import CactiController from "./script4.js";
import Score from "./score.js";


const canvas = document.getElementById("game");
const ctx=canvas.getContext("2d");

const GAME_SPEED_START = .75
const GAME_SPEED_INCREMENT = 0.000005;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 250;
const PLAYER_WIDTH = 58;
const PLAYER_HEIGHT = 62;
const MAX_JUMP_HEIGHT = 220;
const MIN_JUMP_HEIGHT = 190;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.5;
const CACTI_CONFIG = [
    {width:48/1.5,height:100/1.5,image:'cactus_1.png'},
    {width:98/1.5,height:100/1.5,image:'cactus_2.png'},
    {width:68/1.5,height:70/1.5,image:'cactus_3.png'},
];

let score = null;
let player = null;
let ground = null;
let cactiController = null;
let waitingToStart = true;
let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false; 
let hasAddedEventListenerForRestart = false;

function createSprites(){
    const playerWidthInGame = PLAYER_WIDTH*scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT*scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT*scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT*scaleRatio;
    const groundWidthInGame = GROUND_WIDTH*scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT*scaleRatio;
    


player = new Player(ctx,playerHeightInGame,playerWidthInGame,minJumpHeightInGame,maxJumpHeightInGame,scaleRatio);
ground = new Ground(ctx,groundWidthInGame,groundHeightInGame,GROUND_AND_CACTUS_SPEED,scaleRatio);
const cactiImages =   CACTI_CONFIG.map((cactus) =>{
    const image = new Image();
    image.src = cactus.image;
    return{
        image:image,
        width:cactus.width*scaleRatio,
        height:cactus.height*scaleRatio
    };

} );

cactiController = new CactiController(ctx,cactiImages,scaleRatio,GROUND_AND_CACTUS_SPEED);

score = new Score(ctx,scaleRatio);

}


function setScreen(){
    scaleRatio = getScaleRatio();
    canvas.height = GAME_HEIGHT*scaleRatio;
    canvas.width = GAME_WIDTH*scaleRatio;
    createSprites()
}
setScreen();

window.addEventListener("resize",() => setTimeout(setScreen,500));

if(screen.orientation){
    screen.orientation.addEventListener("change",setScreen);
}


 
function getScaleRatio(){
    const screenHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
    );

    const screenWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth
    );

    if(screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT){
        return ((screenWidth*0.6) / GAME_WIDTH);
    }else{
        return ((screenHeight*0.6) / GAME_HEIGHT);
    }

}

    


function clearscreen(){
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function showGameOver(){
    const fontSize = 70*scaleRatio;
    ctx.font = `${fontSize}px Veranda`;
    ctx.fillStyle = "grey";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText("GAME OVER",x,y);
}

function showStartText(){
    const fontSize = 40*scaleRatio;
    ctx.font = `${fontSize}px Veranda`;
    ctx.fillStyle = "grey";
    const x = canvas.width /4.5;
    const y = canvas.height / 2;
    ctx.fillText("Tap Screen or Press To Start",x,y);
}





function setupGameReset() {
    if (!hasAddedEventListenerForRestart) {
        hasAddedEventListenerForRestart = true; 
    
        setTimeout(() => {
            window.addEventListener("keyup", (event) => {
                if (event.code === "Space") reset();
            }, { once: true });
        }, 1000);
    
        setTimeout(() => {
            window.addEventListener("touchstart", reset, { once: true });
        }, 1000);
    }
}

function reset() {
    hasAddedEventListenerForRestart=false;
    waitingToStart=false;
    gameOver = false; 
    ground.reset();
    cactiController.reset();
    score.reset(); 
    gameSpeed = GAME_SPEED_START; 
     
}


function gameLoop(currentTime){
  
 
    
    if(previousTime === null){
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;       
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime

   

    if (!gameOver && !waitingToStart){
    ground.update(gameSpeed,frameTimeDelta);
    cactiController.update(gameSpeed,frameTimeDelta);
    player.update(gameSpeed,frameTimeDelta);
    gameSpeed += frameTimeDelta*GAME_SPEED_INCREMENT;
    score.update(frameTimeDelta);   
    
}
    clearscreen();
    
    
    
    if (!gameOver && cactiController.collide(player)) {
       gameOver = true;
       score.setHighScore();

     
    }

    if (waitingToStart){
        showStartText();
    }
    
    ground.draw();
    score.draw();
    cactiController.draw();
    player.draw();

    if(gameOver){
        setupGameReset();
        showGameOver();
       
   
    }   
        
    
 

    requestAnimationFrame(gameLoop); 
    
}
window.addEventListener("keydown", (event) => {
    if (event.code === "Space") reset();},{once:true}
);
window.addEventListener("touchstart",reset,{once:true});
requestAnimationFrame(gameLoop);


