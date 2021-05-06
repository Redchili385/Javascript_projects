function Distance2D(x1,y1,x2,y2)
{
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function GetCoordinateToDraw(type, number, object)
{
	if(type === "x")
	{
		x = number;
		while(object)
		{
			if(object.x)
			{
				x += object.x;
			}
			object = object.Parent;
		}
		return x;
	}
	if(type === "y")
	{
		y = number;
		while(object)
		{
			if(object.y)
			{
				y += object.y
			}
			object = object.Parent;
		}
		return y;
	}
	return undefined;
}

function Random(vmin,vmax)
{
	return Math.random()*(vmax-vmin)+vmin;
}

function DFloor(number, limiteInferior) //Different Floor Function
{
	return Math.floor(number / limiteInferior) * (limiteInferior);
}


class Vector2
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}
	DotProduct(Vector1,Vector2)
	{
		return (Vector1.x*Vector2.x + Vector1.y*Vector2.y);
	}
	EscalarTimesVector(escalar,Vector)
	{
		return new Vector2(Vector.x * escalar, Vector.y * escalar);
	}
	VectorProjection(Principal,Director)
	{
		// https://en.wikipedia.org/wiki/Vector_projection
		return this.EscalarTimesVector(this.DotProduct(Principal,Director)/this.DotProduct(Director,Director),Director);
	}
}

class Space
{
	constructor(x,y,xmax,ymax)
	{
		this.xmax = xmax;
		this.ymax = ymax;
		this.x = x;
		this.y = y;
		this.k = 9 * Math.pow(10,9);
		this.charges = [];
		for(let i = 0; i<nCharges; i++)
		{
			this.charges[i] = new Carga(Random(width/-2,width/2),Random(height/-2,height/2),random(-0.00001,0.00001),this,0,0);//Random(-1,1),Random(-1,1));
		}
		this.GenerateEletricField();
	}
	GenerateEletricField()
	{
		if(this.EletricField)
		{
			delete this.EletricField;
		}
		this.EletricField = [];
		let k = this.k;
		let xmax = this.xmax;
		let ymax = this.ymax;
		for(let i = 0; i < this.charges.length; i++)
		{
			for(let y = (-1) * ymax; y <ymax; y += 1/PixelDensity)
			{
				for(let x = (-1) * xmax; x < xmax; x += 1/PixelDensity)
				{
					let d = Distance2D(x,y,this.charges[i].x,this.charges[i].y);
					let E = k * this.charges[i].charge/d;
					let index = PixelDensity * ((x+xmax) + (y+ymax) *2*PixelDensity* xmax);
					if(this.EletricField[index])
					{ 
						this.EletricField[index] += E;
					}
					else
					{
						this.EletricField[index] = E;
					}
				}
			}
		}
	}
	DrawEFCondition(number)
	{
		let sqrtNumber = Math.sqrt(Math.abs(number));
		if(number%100<=5 && number%100>= -5)
		{
			return true;
		}
		return false;
	}
	DrawEletricField()
	{
		let DrawX = GetCoordinateToDraw("x",0,this);
		let DrawY = GetCoordinateToDraw("y",0,this);
		loadPixels();
		for(let i=0;i<this.EletricField.length;i++)
		{
			if(this.DrawEFCondition(this.EletricField[i]))
			{
				let index = i*4;
				pixels[index+0] = 0;
				pixels[index+1] = 0;
				pixels[index+2] = 0;
				pixels[index+3] = 255;
			}
		}
		updatePixels();
	}
	DrawCharges()
	{
		for(let i = 0; i<this.charges.length; i++)
		{
			this.charges[i].Draw();
		}
	}
	UpdateCharges()
	{
		for(let i = 0; i<this.charges.length; i++)
		{
			this.charges[i].Update();
		}
	}
	Update()
	{
		this.UpdateCharges();
		this.GenerateEletricField();
	}
	Draw()
	{
		this.DrawEletricField();
		this.DrawCharges();
	}
}


class Carga
{
	constructor(x,y,charge,Parent,vx,vy)
	{
		this.x = x;
		this.y = y;
		this.charge = charge;
		this.mass = Math.abs(charge);
		let Scharge = Math.sqrt(Math.abs(this.charge));
		this.radius = Scharge * 20000;
		this.Parent = Parent;
		this.vx = vx;
		this.vy = vy;
		this.normal = undefined;
	}
	move()
	{
		this.x += this.vx;
		this.y += this.vy;
	}
	accelerate()
	{
		if(this.mass > 0)
		{
			let timeFactor = Math.pow(10,-2);
			let charges = this.Parent.charges;
			this.normal = undefined;
			for(let i = 0; i < charges.length; i++)
			{
				if(charges[i] !== this)
				{
					let Dx = this.x - charges[i].x ;
					let Dy = this.y - charges[i].y ;
					let d = Distance2D(Dx,Dy,0,0);
					if(d > 0)
					{
						let F = ((this.Parent.k * this.charge * charges[i].charge)/(d*d));
						//print("d",d,"F",F);
						let Fx = (F/d)*Dx;
						let Fy = (F/d)*Dy;
						this.vx += (Fx/this.mass)*timeFactor;
						this.vy += (Fy/this.mass)*timeFactor;
						if(d < this.radius + charges[i].radius)
						{
							this.normal = charges[i];
						}
					}
				}
			}
			if(this.normal !== undefined)
			{
				let velocity = new Vector2(this.vx,this.vy);
				let vectorToCenter = new Vector2(this.normal.x - this.x,this.normal.y - this.y);
				let Projection = velocity.VectorProjection(velocity,vectorToCenter);
				let Normal = velocity.EscalarTimesVector(-1,Projection);
				this.vx += Normal.x;
				this.vy += Normal.y;
			}
		}
	}
	Update()
	{
		this.accelerate();
		this.move();
		//print(this);
	}
	Draw()
	{
		let x = GetCoordinateToDraw("x",0,this);
		let y = GetCoordinateToDraw("y",0,this);
		strokeWeight(this.radius/10);
		stroke(0);
		if(this.charge > 0)
		{
			fill(100,0,0);
		}
		else if(this.charge < 0)
		{
			fill(0,0,100);
		}
		else
		{
			fill(0,0,0,255);
		}
		ellipse(x,y,2*this.radius,2*this.radius);
	}
}

function keyPressed() {
  if (keyCode == 82) 
  {
    setup();
  }
}

function setup() {
	frameRate(60);
	PixelDensity = 0.5;
	createCanvas(1530,750);
	nCharges = 10;
	pixelDensity(PixelDensity);
  	space = new Space(width/2,height/2,width/2,height/2);
}

function draw() {
	background(200,200,200);
	space.Update();
	space.Draw();
}