function setup() {
	pixelsize = 80;
  createCanvas(16*pixelsize,9*pixelsize);
  snake = new Snake(RandomPixelInTheBoard("x"),RandomPixelInTheBoard("y"));
  food  = new Food(RandomPixelInTheBoard("x"),RandomPixelInTheBoard("y"));
  variavel=0;
}

function draw() {
	frameRate(10);
  background(0);
  noFill();
  stroke(110,60,0);
  strokeWeight(pixelsize*2);
  rect(0,0,width,height);
  food.Draw();
  snake.verifymove();
  snake.Draw();
}

function keyPressed(){
	if(keyCode===UP_ARROW && snake.speedY==0)
	{
		variavel=keyCode;
		snake.command(0,-1)
	}
	if(keyCode===RIGHT_ARROW && snake.speedX==0)
	{
		variavel=keyCode;
		snake.command(1,0)
	}
	if(keyCode===DOWN_ARROW && snake.speedY==0)
	{
		variavel=keyCode;
		snake.command(0,1)
	}
	if(keyCode===LEFT_ARROW && snake.speedX==0)
	{
		variavel=keyCode;
		snake.command(-1,0)
	}
	print(variavel);
}

class Snake {
	constructor(x,y){
		this.x=x;
		this.y=y;
		this.comprimento=1;
		this.bodyX=[];
		this.bodyY=[];
		this.bodyX[0]=x;
		this.bodyY[0]=y;
		this.speed=pixelsize;
		this.speedX=0;
		this.speedY=0;
	}
	
	command(dirX,dirY){
		this.command_dirX=dirX;
		this.command_dirY=dirY;
	}
	
	verifymove(){
		if(this.x%pixelsize==0&&this.y%pixelsize==0&&this.command_dirX!=undefined&&this.command_dirY!=undefined)
		{
			this.speedX=this.speed*this.command_dirX;
			this.speedY=this.speed*this.command_dirY;
			this.move();
		}
	}
	
	move(){
		this.x=this.x+this.speedX;
		this.y=this.y+this.speedY;
		if(this.x==food.x&&this.y==food.y)
		{
			this.comprimento++
			do
			{
				food.x=RandomPixelInTheBoard("x");
				food.y=RandomPixelInTheBoard("y");
			}
			while(foodinsnake())
		}
		if(this.x>= width-pixelsize || this.y >= height-pixelsize || this.x<pixelsize || this.y<pixelsize)
		{
			GameOver();
		}
		for(this.i=0;this.i<(this.comprimento)-1;this.i++)
		{
			if(this.x == this.bodyX[this.i] && this.y == this.bodyY[this.i])
			{
				this.comprimento = this.i+1;
				break;
			}
		}
		for(this.i=(this.comprimento)-1;this.i>0;this.i--)
		{
			this.bodyX[this.i]=this.bodyX[(this.i)-1];
			this.bodyY[this.i]=this.bodyY[(this.i)-1];
		}
		this.bodyX[0]=this.x;
		this.bodyY[0]=this.y;
	}
	Draw(){
		stroke(255,255,255);
		fill(100,0,0);
		strokeWeight(1);
		for(this.i=0;this.i<this.comprimento;this.i++)
		{
			rect(this.bodyX[this.i],this.bodyY[this.i],pixelsize,pixelsize);
		}
	}
}

class Food {
	constructor(x,y){
		this.x=x;
		this.y=y;
	}
	Draw()
	{
		noStroke();
		fill(255,0,0);
		rect(this.x,this.y,pixelsize,pixelsize);
	}
}

function RandomPixelInTheBoard(argument){
	if(argument == "x"){
		return floor(random(1,width/pixelsize-1))*pixelsize;
	}
	if(argument == "y"){
		return floor(random(1,height/pixelsize-1))*pixelsize;
	}
}

function GameOver (){
	print("Game Over");
	snake.comprimento = 1
	variavel=0;
	snake.command_dirX = 0;
	snake.command_dirY = 0;
	snake.x = RandomPixelInTheBoard("x");
	snake.y = RandomPixelInTheBoard("y");
}

function foodinsnake(){
	for(i=0;i<snake.comprimento;i++)
	{
		if(food.x==snake.bodyX[i] && food.y==snake.bodyY[i])
		{
			return true;
		}
	}
	return false;
}