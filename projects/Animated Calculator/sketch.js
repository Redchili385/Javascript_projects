class Numero
{
	constructor(x,y,number,font)
	{
		this.x = x;
		this.y = y;
		this.font = font;
		this.number = number;
	}
	Draw()
	{
		fill(0);
		stroke(0);
		strokeWeight(1);
		textSize(this.font);
		textAlign(RIGHT);
		if(this.number === undefined)
		{
			text("",this.x,this.y);
		}
		else
		{
			text(this.number,this.x,this.y);
		}
	}
}

class LineResult
{
	constructor(x1,y1,x2,y2)
	{
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2
	}
	Draw()
	{
		stroke(0);
		strokeWeight(font * 8/50);
		line(this.x1,this.y1,this.x2,this.y2);
	}
}

class Operation
{
	constructor(x,y,size,operation)
	{
		this.x = x;
		this.y = y;
		this.size = size;
		this.operation = operation;
	}
	Draw()
	{
		strokeWeight(font * 0.1);
		fill(225);
		rect(this.x,this.y,this.size,this.size);
		fill(0);
		strokeWeight(1);
		textSize(font/2);
		textAlign(CENTER);
		if(this.operation === "adição")
		{
			text("+",this.x + this.size/2,this.y + 0.85*this.size);
		}
		if(this.operation === "subtração")
		{
			text("-",this.x + this.size/2,this.y + 0.76*this.size);
		}
		if(this.operation === "multiplicação")
		{
			text("*",this.x + this.size/2,this.y + 1.09*this.size);
		}
		if(this.operation === "quociente")
		{
			text("/",this.x + this.size/2,this.y + 0.85*this.size);
		}
		if(this.operation === "resto")
		{
			text("%",this.x + this.size/2,this.y + 0.85*this.size);
		}
	}
}

function mousePressed ()
{
	if(operation.operation === "adição")
	{
		print("mouse");
		print(operation.operation);
		operation.operation = "subtração";
		print(operation.operation);
	}
	else if(operation.operation === "subtração")
	{
		operation.operation = "multiplicação";
	}
	else if(operation.operation === "multiplicação")
	{
		operation.operation = "quociente";
	}
	else if(operation.operation === "quociente")
	{
		operation.operation = "resto";
	}
	else if(operation.operation === "resto")
	{
		operation.operation = "adição";
	}
}

function keyPressed ()
{
	if(time === 0)
	{
		parcela = parcela1;
	}
	else
	{
		parcela = parcela2;
	}
	if(parcela.number === undefined)
	{
		parcela.number = 0;
	}
	if(keyCode > 47 && keyCode < 58)
	{
		parcela.number = parcela.number * 10 + (keyCode - 47); 
	}
	else if(keyCode > 95 && keyCode < 106)
	{
		parcela.number = parcela.number * 10 + (keyCode - 96);
	}
	else if(keyCode == 8)  //backspace
	{
		if(parcela.number >= 0)
		{
			parcela.number = floor(parcela.number/10);
		}
		else
		{
			parcela.number = ceil(parcela.number/10);
		}
	}
	else if(keyCode == 13) //enter
	{
		time++;
	}
	else if(keyCode == 109 || keyCode == 189) //minus
	{
		parcela.number = -1* parcela.number;
	}
}

function setup() {
  createCanvas(720,480);
  frameRate(60);
  time = 0;
  font = 100;
  operation = 				new Operation(2*width/3 + font/3, height/3, font/2,"adição");
  parcela1 = 					new Numero(2*width/3,height/3,undefined,font);
  parcela2 = 					new Numero(2*width/3,height/3 + font,undefined,font);
  LinhaDoResultado = 	new LineResult(2*width/3, height/3 + 1.25 * font,2*width/3, height/3 + 1.25*font);
  resultado = 				new Numero(2*width/3,height/3 + 2.3*font,undefined,font);
}

function draw() {
  background(225);
  if(time === 0)
  {
  	operation.Draw();
  	parcela1.Draw();
  }
  else if (time === 1)
  {
  	operation.Draw();
  	parcela1.Draw();
		parcela2.Draw();
  }
  else if (time === 2)
  {
  	if(operation.operation === "adição")
	{
		resultado.number = parcela1.number + parcela2.number;
	}
	else if(operation.operation === "subtração")
	{
		resultado.number = parcela1.number - parcela2.number;
	}
	else if(operation.operation === "multiplicação")
	{
		resultado.number = parcela1.number * parcela2.number;
	}
	else if(operation.operation === "quociente")
	{
		resultado.number = (parcela1.number - (parcela1.number % parcela2.number)) / parcela2.number;
	}
	else if(operation.operation === "resto")
	{
		resultado.number = parcela1.number % parcela2.number;
	}
  	if(LinhaDoResultado.x1 > 2*width/3 - textWidth(resultado.number))
  	{
  		LinhaDoResultado.x1 = LinhaDoResultado.x1 - 0.02*font;
  	}
  	else
  	{
  		time++;
  	}
  	operation.Draw();
  	parcela1.Draw();
	parcela2.Draw();
	LinhaDoResultado.Draw();
  }
  else if (time === 3)
  {
  	operation.Draw();
  	parcela1.Draw();
	parcela2.Draw();
  	LinhaDoResultado.Draw();
  	resultado.Draw();
  }
  else if(time > 3)
  {
  	time = 0;
  	parcela1.number = undefined;
  	parcela2.number = undefined;
  	LinhaDoResultado.x1 = 2*width/3;
  	resultado.number = undefined;
  }
}