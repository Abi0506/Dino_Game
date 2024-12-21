export default class Cactus {
    constructor(ctx,x,y,width,height,image) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;

    }

    update(speed,gameSpeed,frameTimeDelta,scaleRatio){
        this.x -= speed*gameSpeed*frameTimeDelta*scaleRatio;
    }

    draw(){
        this.ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

   
    collideWith(sprite) {
       
            return (
                (this.x < sprite.x + sprite.width/1.4 &&
                this.x + this.width/1.4 > sprite.x*(1.85) &&
                this.y < sprite.y + sprite.height/(1.4) &&
                this.y + this.height/1.4 > sprite.y)
            );
        }    
    
  

}  


