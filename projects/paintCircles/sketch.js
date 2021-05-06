class PaintCircle{
	constructor(red,green,blue,cx,cy,angle,distance){
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.cx = cx;
		this.cy = cy;
		this.angle = angle;
		this.distance = distance;
		this.updatePosition();
	}
	updatePosition(){
		this.x = this.cx + this.distance * Math.cos(this.angle * Math.PI/180);
		this.y = this.cy + this.distance * Math.sin(this.angle * Math.PI/180);
	}
	move(){
		this.angle++;
		this.angle%=360;
		this.updatePosition();
	}
	dist(x,y){
		let dx = x - this.x
		let dy = y - this.y;
		return Math.sqrt(dx*dx+dy*dy);
	}
	distanceToValue(distance){
		return Math.max(0,255-distance);
	}
	draw(){
		let maxX = ~~Math.min(width,this.x + 255);
		let maxY = ~~Math.min(height,this.y + 255);
		let minX = ~~Math.max(0,this.x-255);
		let minY = ~~Math.max(0,this.y-255);
		for(let y = minY; y < maxY; y++){
			let index = 4*(y*width+minX);
			for(let x = minX; x < maxX; x++){
				let percentageValue = this.distanceToValue(this.dist(x,y))/255
				pixels[index + 0] += percentageValue * this.red;
				pixels[index + 1] += percentageValue * this.green;
				pixels[index + 2] += percentageValue * this.blue;
				pixels[index + 3] = 255;
				index += 4;
			}
		}
	}
}
function setup() {
  createCanvas(1900,1080);
  pixelDensity(1);
  circles = [
  		new PaintCircle(255,0,0,width/2,height/2,0,200),
  		new PaintCircle(0,255,0,width/2,height/2,120,200),
  		new PaintCircle(0,0,255,width/2,height/2,240,200),
  		new PaintCircle(255,255,0,width/2,height/2,60,400),
  		new PaintCircle(0,255,255,width/2,height/2,180,400),
  		new PaintCircle(255,0,255,width/2,height/2,300,400),
  	]
}

function draw() {
	background(0);
	loadPixels();
	for(let circle of circles){
		circle.move();
		circle.draw();
	}
	updatePixels();
	print(frameRate());
}