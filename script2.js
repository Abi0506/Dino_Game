export default class Player {
    WALK_ANIMATION_TIMER = 100;
    JUMP_SPEED = 0.45
  
    GRAVITY = 0.35;
  

    constructor(ctx, height, width, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 25 * scaleRatio;
        this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
        this.yStandingPosition = this.y;

        this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        this.dinoRunImages = [];
        this.image = null;

        this.jumpPressed = false;
        this.jumpInProgress = false;
        this.falling = false;
       

        this.loadImages();
        this.setupEventListeners();
    }

    loadImages() {
       
        this.standingStillImage = new Image();
        this.standingStillImage.src = "standing_still.png";
        this.standingStillImage.onload = () => {
            this.image = this.standingStillImage;
        };

        const dinoRunImage1 = new Image();
        dinoRunImage1.src = "dino_run1.png";
        const dinoRunImage2 = new Image();
        dinoRunImage2.src = "dino_run2.png";

        this.dinoRunImages.push(dinoRunImage1, dinoRunImage2);
    }

    setupEventListeners() {
        
        window.addEventListener("touchstart", () => (this.jumpPressed = true));
        window.addEventListener("touchend", () => (this.jumpPressed = false));
        window.addEventListener("keydown", (event) => {
            if (event.code === "Space") this.jumpPressed = true;
        });
        window.addEventListener("keyup", (event) => {
            if (event.code === "Space") this.jumpPressed = false;
        });
    }

    draw() {
        if (this.image) {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);
        this.jump(frameTimeDelta);
    }



    jump(frameTimeDelta) {
        if (this.jumpPressed && !this.falling) {
            this.jumpInProgress = true;
        }

        if (this.jumpInProgress && !this.falling) {
      
            if (
                this.y > this.canvas.height - this.maxJumpHeight &&
                (this.jumpPressed || this.y > this.canvas.height - this.minJumpHeight)
            ) {
                
               
              
                this.y -= (this.JUMP_SPEED * frameTimeDelta * this.scaleRatio) ;
               console.log(this.y);
             
            
            } else {
                this.falling = true;
            }
    
        }else if (this.falling) {
            if (this.y < this.yStandingPosition) {

               
                this.y += (this.GRAVITY * frameTimeDelta * this.scaleRatio); 
           
            if (this.y >= this.yStandingPosition) {
                this.y = this.yStandingPosition; 
                this.falling = false; 
                this.jumpInProgress=false;

               
            }
        }
    }
}

    run(gameSpeed, frameTimeDelta) {

        if (this.jumpInProgress || this.falling) {
            this.image = this.standingStillImage; 
            return;
        }
        
        if (this.walkAnimationTimer <= 0 ) {
            
            this.image === this.dinoRunImages[0];

            if (this.image === this.dinoRunImages[0]){
                this.image = this.dinoRunImages[1];
            }
            else{
                this.image = this.dinoRunImages[0];
            }
                   
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= gameSpeed * frameTimeDelta;
    }
    jumpstat(){
        return this.jumpInProgress||this.falling;
        }
    
}
