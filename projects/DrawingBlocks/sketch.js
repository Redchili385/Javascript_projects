function changeDirection()
{
	i = 0;
	decision = Math.random();
	if(decision > 0.5) //virar a direita
	{
		if(vx == 0) //movendo verticalmente
		{
			if(vy > 0)
			{
				vx = -1;
				vy = 0;
			}
			else
			{
				vx = 1;
				vy = 0;
			}
		}
		else //movendo horizontalmente
		{
			if(vx > 0)
			{
				vy = 1;
				vx = 0;
			}
			else
			{
				vy = -1;
				vx = 0;
			}
		}
	}
	else  //virar a esquerda
	{
		if(vx == 0) //movendo verticalmente
		{
			if(vy > 0)
			{
				vx = 1;
				vy = 0;
			}
			else
			{
				vx = -1;
				vy = 0;
			}
		}
		else //movendo horizontalmente
		{
			if(vx > 0)
			{
				vy = -1;
				vx = 0;
			}
			else
			{
				vy = 1;
				vx = 0;
			}
		}
	}
}

function verificarParedes()
{
	if(x >= width)
	{
		x--;
		changeDirection();
	}
	else if(x < 0)
	{
		x++;
		changeDirection();
	}
	else if(y >= height)
	{
		y--;
		changeDirection();
	}
	else if(y < 0)
	{
		y++;
		changeDirection();
	}
}

function setup() 
{
	//frameRate(1);
	CanvasXini = 306;
	CanvasYini = 150;
	side = 1;
	RetiradaX = CanvasXini % side - 1;
	RetiradaY = CanvasYini % side - 1;
	createCanvas(CanvasXini - RetiradaX, CanvasYini - RetiradaY);
	background(200,200,200);
	x = width/2 - (width/2 % side);
	y = height/2 - (height/2 % side);
	vx = 0;
	vy = 0;
	changeDirection();
	i = 0;
}

function draw() 
{
	point(x,y);
	x = x + vx;
	y = y + vy;
	i++;
	if(i === 1)
	{
		verificarParedes();
	}
	if(i === side)
	{
		changeDirection();
	}
}