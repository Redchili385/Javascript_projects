function DistanceSquared(x1,y1,x2,y2){   //faster than Distance
	return (x1-x2)**2 + (y1-y2)**2;
}

function random(x){
	return x*random();
}

class Circle{
	constructor(id,x,y,radius){
		this.x = x;
		this.y = y;
		this.id = id;
		this.vx = 0;
		this.vy = 0;
		this.radius = radius;
		this.borderRadius = this.radius/5;
		this.outerRadius = this.radius + this.borderRadius;
		this.initialClick = null;
		this.rgba = {"r": random(255),"g": random(255),"b": random(255),"a": 255};
	}
	Draw(){
		fill(this.rgba.r,this.rgba.g,this.rgba.b,this.rgba.a/2);
		strokeWeight(2 * this.borderRadius);
		stroke(this.rgba.r,this.rgba.g,this.rgba.b,this.rgba.a);
		ellipse(this.x,this.y,2 * this.radius,2 * this.radius);
		strokeWeight(0);
		fill(0);
		textAlign(CENTER, CENTER);
		textSize(this.radius);
		text(this.id,this.x,this.y);
	}
	inArea(x,y){
		return DistanceSquared(x,y,this.x,this.y) < this.outerRadius**2;
	}
	Move(){
		if(this !== circleClicked){
			this.x += this.vx;
			this.y += this.vy;
		}
	}
	verifyWalls(){
		let outerRadius = this.outerRadius;
		let wallsCollided = {"x":0, "y":0}
		if(this.x + outerRadius > W ){
			wallsCollided.x = 1;
		}
		if(this.x - outerRadius < 0){
			wallsCollided.x = -1;
		}
		if(this.y + outerRadius > H){
			wallsCollided.y = 1;
		}
		if(this.y - outerRadius < 0){
			wallsCollided.y = -1;
		}
		return wallsCollided;
	}
	collideWithWalls(){
		let wallsCollided = this.verifyWalls();
		for(let wall in wallsCollided){
			if(wallsCollided[wall] !== 0){
				this["v" + wall] = wallsCollided[wall] * (-1) * Math.abs(this["v" + wall]);
			}
		}
	}
	calcularAtritoOneVariable(v){
		let reduction = Atrito;
		if(v > 0){
			if(v > reduction)	{
				v -= reduction;
			}
			else{
				v = 0;
			}
		}
		return v;
	}
	calcularAtrito(){
		let v = Math.sqrt(this.vx**2 + this.vy**2);
		if(v > 0){
			let newV = this.calcularAtritoOneVariable(v);
			let reduction = newV/v;
			this.vx *= reduction;
			this.vy *= reduction;
		}
	}
}

function mousePressed(){
	let x = mouseX;
	let y = mouseY;
	for(let i = circles.length - 1; i >= 0; i--){
		let circle = circles[i];
		if(circle.inArea(x,y)){
			circle.initialClick = {"x": x - circle.x,"y": y - circle.y};
			//circles.splice(i,1);
			//circles.push(circle);
			circleClicked = circle;
			break;
		}
	}
}

function mouseDragged(){
	if(circleClicked !== null){
		let lastX = circleClicked.x;
		let lastY = circleClicked.y;
		circleClicked.x = mouseX - circleClicked.initialClick.x;
		circleClicked.y = mouseY - circleClicked.initialClick.y;
		let walls = circleClicked.verifyWalls();
		if(walls.x !== 0){
			circleClicked.x = lastX;
		}
		if(walls.y !== 0){
			circleClicked.y = lastY;
		}
		circleClicked.vx = circleClicked.x - lastX;
		circleClicked.vy = circleClicked.y - lastY;
	}
}

function mouseReleased(){
	circleClicked = null;
}

function setup() {
	W = 1000
	H = 500
	Atrito = 0.1;
	circleClicked = null;
	
	createCanvas(W,H);
	circles = [];
	for(let i = 0; i< 10; i++){
		circles.push(new Circle(i,W * random(),H * random(),20+20*random()));
	}
}

function draw() {
	background(0,47,167);
	for(circle of circles){
		circle.collideWithWalls();
		circle.calcularAtrito();
		circle.Move();
		circle.Draw();
	}
}