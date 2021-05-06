function setup() 
{
		createCanvas(1920,1080);
		CB = new Color3(0,0,0);
		balls = [];
		for(i=0;i<20;i++)
		{
			balls[i] = new Ball(random(50,width-50),random(50,height-50));
		}
}

class Color3
{
	constructor(r,g,b)
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.rs = 1;
		this.gs = 1;
		this.bs = 1;
	}
	VariarSuave(Red, Green, Blue)
	{
		this.r = this.r + this.rs * Red;
		this.g = this.g + this.gs * Green;
		this.b = this.b + this.bs * Blue;
		if(this.r < 0 || this.r > 255)
		{
			this.rs = this.rs * (-1);
		}
		if(this.g < 0 || this.g > 255)
		{
			this.gs = this.gs * (-1);
		}
		if(this.b < 0 || this.b > 255)
		{
			this.bs = this.bs * (-1);
		}
	}
}

class Ball
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		this.Color = new Color3(random(0,255),random(0,255),random(0,255));
	}
	Draw()
	{
		this.Color.VariarSuave(5,7,11);
		stroke(0,0,0);
		fill(this.Color.r,this.Color.g,this.Color.b);
		ellipse(this.x,this.y,100,100);
	}
}

function draw() 
{
	CB.VariarSuave(2,3,5);
	background(CB.r,CB.g,CB.b);
	for(i=0;i<20;i++)
	{
		balls[i].Draw();
	}
}