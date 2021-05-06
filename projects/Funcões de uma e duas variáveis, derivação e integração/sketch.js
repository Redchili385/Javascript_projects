function SingleToMulti(x,y,value,epsilon)
{
	let permission = 0;
	if(y < value + epsilon && y > value - epsilon)
	{	
		permission = 256;
	}
	else if((y < value && y > 0) || (y > value && y < 0))
	{
		permission = 50;
	}
	return permission;
}

function Integralof(f,n)
{
	return function(x)
	{
		let h = x/n;
		let value = 0;
		
		for(let i = 0; i < n ; i ++)
		{
			let addValue = (h/2)*(f(i*h)+f((i+1)*h));
			if(isFinite(addValue)){value += addValue}
		}
		return value;
	}
}

function Derivativeof(f,h)
{
	return function(x)
	{
		return (f(x+h)-f(x))/h;
	}
}

function Color(value, colorID) //0 -> red 1-> green 2-> blue
{
	let x = value -1 + colorID;
	return 255*Math.exp((-1)*Math.pow(x,2));
}

function drawAxis()
{
	loadPixels();
	let graph = function(x,y,t)
	{
		let value  = false;
		if(x === 0 || y === 0)
		{
			value = true;
		}
		return value;
	}
	for(let X = 0; X<width ; X++)
	{
		let x = X - width/2;
		for(let Y = 0; Y < height ; Y++)
  		{
  			let y = -Y + height/2;
  			let index = 4*(X + Y*width);
  			if(graph(x,y,t))
	  		{
	  			for(let i = 0; i < 3; i++)
	  			{
	  				//OriginalColor = pixels[index + i]
	  				pixels[index + i] = 255 - bgColor;// - OriginalColor;
	  			}
	  		}
  		}
	}
	updatePixels();
}

function drawFunction(F,colorValue)  // -1 to 1
{
	if(typeof colorValue === "undefined"){colorValue = random(-1,1)}
	loadPixels();
	let f = [];
	let G = Derivativeof(F,Math.pow(10,-10));
	let g = [];
	for(let X = 0; X<width ; X++)
	{
		let x = X - width/2;
		if(!f[X]){f[X] = F(x)}
		if(!g[X]){g[X] = G(x)}
		for(let Y = 0; Y < height ; Y++)
  		{
  			let y = -Y + height/2;
  			let index = 4*(X + Y*width);
  			let permission = SingleToMulti(x,y,f[X],(Math.abs(g[X])+5));
  			if(permission > 0 || f[X] !== undefined)
  			{
  				let percentage = permission/256;
	  			for(let i = 0; i < 3; i++)
	  			{
	  				let oldColor = pixels[index+1];
	  				pixels[index + i] = oldColor*(1-percentage) + Color(-1/(Math.abs(g[X]/2)+0.5)+1,i) * (percentage);
	  			}
  			}
  		}
  	}
  	updatePixels();
}

function setup() 
{
	createCanvas(500,250);
	pixelDensity(1);
	frameRate(60);
  	background(0);
	t = 0;
}

function draw()
{
	//if(t>=0){frameRate(0.001)}
	let F = function(A)
	{
		//return 150*sin(t/17)*(Math.sin(A/(30*sin(t/57))))
		return Math.pow(sin(t/40),5)*100*sin((A-t)/30);
	}
	let G = function(A)
	{
		let period = 1500;
		let time = t%period;
		if(time >= 100 && time < 100 + 20){return 50*exp(A/50)}
		else if(time >= 300 && time < 300 + 20){return 20*Math.pow(A/20,2)-100}
		else if(time >= 420 && time < 420 + 20){return 40*Math.log(Math.abs(A/80))}
		else if(time >= 670 && time < 670 + 20){return 100*Math.exp(-Math.pow(A/50,2))}
		else if(time >= 850 && time < 850 + 20){return height/3}
		else if(time >= 1050 && time < 1050 + 20){return 2000/A}
		else if(time >= 1200 && time < 1200 + 20){return 50 * Math.tan(A/40 + Math.PI/2)}
		else if(time >= 1400 && time < 1400 + 30){return 10*Math.sin(A/10) + A}
		return undefined;
	}
	let Daylight = function(A)
	{
		B = Math.sin(A);
		if(B>=0)
		{
			return Math.pow(B,1/3);
		}
		return -Math.pow((-1)*B,1/3);
	}
	bgColor = (-Daylight(t/360)+1)*128;
	background(bgColor);
	drawFunction(F);
	drawFunction(G);
	drawAxis();
  	t++;
}