import Cactus from '../cactus.js';
export default class CactiController{
    nextCactusInterval = null;
    cacti = [];
    CACTUS_INTERVAL_MIN = 600;
    CACTUS_INTERVAL_MAX = 1500;
 
    constructor(ctx, cactiImages,scaleRatio,speed) {
        this.ctx = ctx;
        this.scaleRatio = scaleRatio;
        this.canvas = ctx.canvas;
        this.cactiImages = cactiImages;
        this.speed = speed;
       
       
        this.setNextTimeInterval();
    
    }

    setNextTimeInterval(){
        const num = this.getRandomNumber(this.CACTUS_INTERVAL_MIN,this.CACTUS_INTERVAL_MAX);
        this.nextCactusInterval = num;

    }

    getRandomNumber(min,max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    createCactus(){
        const index = this.getRandomNumber(0,this.cactiImages.length-1);
        const cactusImage = this.cactiImages[index]; 
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - cactusImage.height;
        const cactus = new Cactus(this.ctx,x,y,cactusImage.width,cactusImage.height,cactusImage.image);
        this.cacti.push(cactus);
    }
    
    draw() {
        this.cacti.forEach((cactus) => cactus.draw());    
    }

    reset(){
        this.cacti.length = 0;
     
    }

    update(gameSpeed, frameTimeDelta) {
        if (this.nextCactusInterval <= 0) {   
            this.createCactus();
            this.setNextTimeInterval();
        }
        this.nextCactusInterval -= frameTimeDelta;
        
        this.cacti.forEach((c)=>{
        c.update(this.speed,gameSpeed,frameTimeDelta,this.scaleRatio)
        });
        this.cacti = this.cacti.filter((cactus) => cactus.x>-cactus.width);
    }

    collide(sprite) {
       return this.cacti.some(cactus => cactus.collideWith(sprite));
    } 
    }

