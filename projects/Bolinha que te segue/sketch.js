class Circle
{
	constructor()
	{
		this.x = width/2;
		this.y = height/2;
	}
	move()
	{
		this.Vx = mouseX - this.x;
		this.Vy = mouseY - this.y;
		this.Ux = this.Vx/sqrt(this.Vx * this.Vx + this.Vy * this.Vy);
		this.Uy = this.Vy/sqrt(this.Vx * this.Vx + this.Vy * this.Vy);
		this.x = this.x + 1 * this.Ux;
		this.y = this.y + 1 * this.Uy;
	}
	Draw()
	{
		fill(255);
		ellipse(this.x,this.y,40,40);
	}
}

function setup() {
  createCanvas(1500,700);
  circle = new Circle();
}

function draw() {
  background(100,100,255);
  circle.move();
  circle.Draw();
}