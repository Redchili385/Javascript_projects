class Charge
{
	constructor(x,y,value)
	{
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.value = value;
		this.chargeDensity = Math.pow(10,-10);  //charge per mass
		this.density = Math.pow(10,8);
		this.encostado = [];
		this.strokeBrightness = 0;
		this.Color = this.value > 0 ? [150,0,0]:[0,0,150];
		this.strokeColor = this.value > 0 ? [0,0,255]:[255,0,0];
	}
	get mass(){return Math.abs(this.value/this.chargeDensity);}
	get radius(){return Math.cbrt(this.mass/this.density)} //World Radius
	Draw()
	{
		fill(this.Color);
		//print(this.Color);
		let vectorStroke = this.strokeColor.map(x => x * this.strokeBrightness)
		//print(vectorStroke)
		stroke(vectorStroke);
		strokeWeight(0.2*this.radius*Scale);
		ellipse(WtS(this.x,0)[0],WtS(0,this.y)[1],2*this.radius * Scale,2*this.radius * Scale);
	}
	UpdateVelocity(charges)
	{
		var forceX = 0, forceY = 0, distX, distY, force, distance,accX,accY;
		var distanceSquared,dIncrease,dXIncrease,dYIncrease,sumRadius,i;
		for(i = 0; i< charges.length; i++)
		{
			if(this != charges[i])
			{
				distX = this.x-charges[i].x;
				distY = this.y-charges[i].y;
				distanceSquared = Math.pow(distX,2)+Math.pow(distY,2);
				force = k*this.value*charges[i].value/distanceSquared;
				//print(this.x,this.y,charges[i].x,charges[i].y);
				distance = Math.sqrt(distanceSquared);
				if(activateCollisions)
				{
					sumRadius = this.radius + charges[i].radius;
					if
					(
						force > 0 ||
							(distance > sumRadius 
								&& ((this.encostado[0] != charges[i]) || distance > sumRadius * 1.1))
					)
					{
						forceX += force * distX/distance;
						forceY += force * distY/distance;
						/*if(random() > 0.9)
						{
							print("Não encostados ou Cargas Iguais",this);
							print(distance, this.radius + charges[i].radius);
						}*/
					}
					else
					{
						this.vx = charges[i].vx;
						this.vy = charges[i].vy;
						/*if(random() > 0.9)
						{
							print("Encostados",this);
							print(distance, this.radius + charges[i].radius);
						}*/
						this.encostado[0] == charges[i];
						if(distance < sumRadius * 0.9)
						{
							dIncrease = sumRadius/distance;
							dXIncrease = distX * dIncrease;
							dYIncrease = distY * dIncrease;
							this.x = dXIncrease + charges[i].x;
							this.y = dYIncrease + charges[i].y;
						}
					}
				}
				else
				{
					forceX += force * distX/distance;
					forceY += force * distY/distance;
				}
			}
		}
		var factor = Math.pow(10,0);
		accX = forceX*factor/this.mass;
		accY = forceY*factor/this.mass;
		//print(accX,accY);
		//print(force,distanceSquared,accX,accY,this.mass,forceX,forceY,factor);
		this.vx += accX;
		this.vy += accY;
	}
	Move()
	{
		this.x += this.vx;
		this.y += this.vy;
	}
}