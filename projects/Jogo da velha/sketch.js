const L = 60;   //Tamanho do lado do quadrado central

function setup() 
{
	createCanvas(640,480);
	GameState = [];      //Top 1,2,3 Center 4,5,6   Botton 7,8,9    Esquerda para Direita
	Objects = [];
	Turn = 1;    //Player 1 Or Player 2 
	Winner = 0;
}

function CreateGrid()
{
	stroke(255,255,255); //Center (320,240)
	strokeWeight(10);
	line(-3*L/2 + width/2, -1*L/2 + height/2, 3/2 * L + width/2, (-1/2)*L + height/2);      //Cima
	line(-3*L/2 + width/2, L/2 + height/2, 3/2 * L + width/2, L/2 + height/2);              //Baixo
	line(-1*L/2 + width/2, -3*L/2 + height/2, (-1/2)*L + width/2, 3/2 * L + height/2);      //Esquerda
	line(L/2 + width/2, -3*L/2 + height/2, 1/2 * L + width/2, (3/2)*L + height/2);					//Direita
}

class Circle    //Id = 2
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}
	Draw()
	{
		noFill();
		ellipse(this.x,this.y,L*0.6,L*0.6);
	}
}

class Xmark     //Id = 1
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}
	Draw()
	{
		stroke(255);
		line(this.x - L*0.3, this.y - L*0.3, this.x + L*0.3, this.y + L*0.3);
		line(this.x - L*0.3, this.y + L*0.3, this.x + L*0.3, this.y - L*0.3);
	}
}

function mousePressed ()
{
	X = mouseX;
	Y = mouseY;
	print(X);
	print(Y);
	if(X < width/2 + 3/2 * L && X > width/2 - 3/2 * L && Y < height/2 + 3/2 * L && Y > height/2 - 3/2 * L)
	{
		print("Passed first If");
		n = 3 * YSpace(Y) + XSpace(X);
		if(GameState[n] === undefined)
		{
			print('Turn: %d, n: %d',Turn, n);
			GameState[n] = Turn;
			if(Turn === 1)
			{
				Objects.push(new Xmark(FTXS(XSpace(X)),FTYS(YSpace(Y))));
				Turn = 2;
			}
			else
			{
				Objects.push(new Circle(FTXS(XSpace(X)),FTYS(YSpace(Y))));
				Turn = 1;
			}
			VerifyGameState();
		}
	}
}

function XSpace(X)
{
		if(X < width/2 - 1/2 * L)
		{
			return 1;
		}
		else if(X > width/2 + 1/2 * L)
		{
			return 3;
		}
		else
		{
			return 2;
		}
}

function YSpace(Y)
{
	if(Y < height/2 - 1/2 * L)
	{
		return 0;
	}
	else if(Y > height/2 + 1/2 * L)
	{
		return 2;
	}
	else
	{
		return 1;
	}
}

function FTXS (Xspace)  //Função transformadora XSpace  Transforma n em suas posições no Canvas
{
	return width/2 + (Xspace - 2) * L;
}

function FTYS (Yspace)
{
	return height/2 + (Yspace - 1) * L;
}

function CreateInterface()
{
	noStroke();
	fill(255);
	textSize(L/2);
	text("Player ", width/2 - L,height/2 - 2*L);
	text(Turn, width/2 + 0.6*L, height/2 - 2*L);
	if(Winner != 0)
	{
		text("Player",width/2 - 2*L,height/2 + 2*L);
		text(Winner, width/2 - 0.4*L, height/2 + 2*L);
		text("Winner", width/2, height/2 + 2*L);
	}
}

function VerifyGameState()
{
	if(GameState[1] === GameState[2] && GameState[2] === GameState[3] && GameState[1] !== undefined)
	{
		Objects.push(new RedLine(1,3));
		Winner = DeclareWinner(Turn);
	}
	if(GameState[4] === GameState[5] && GameState[5] === GameState[6] && GameState[4] !== undefined)
	{
		Objects.push(new RedLine(4,6));
		Winner = DeclareWinner(Turn);
	}
	if(GameState[7] === GameState[8] && GameState[8] === GameState[9] && GameState[7] !== undefined)
	{
		Objects.push(new RedLine(4,6));
		Winner = DeclareWinner(Turn);
	}
	if(GameState[1] === GameState[4] && GameState[4] === GameState[7] && GameState[1] !== undefined)
	{
		Objects.push(new RedLine(1,7));
		Winner = DeclareWinner(Turn);
	}
	if(GameState[2] === GameState[5] && GameState[5] === GameState[8] && GameState[2] !== undefined)
	{
		Objects.push(new RedLine(2,8));
		Winner = DeclareWinner(Turn);
	}
	if(GameState[3] === GameState[6] && GameState[6] === GameState[9] && GameState[3] !== undefined)
	{
		Objects.push(new RedLine(3,9));
		Winner = DeclareWinner(Turn);
	}
	if(GameState[1] === GameState[5] && GameState[5] === GameState[9] && GameState[1] !== undefined)
	{
		Objects.push(new RedLine(1,9));
		Winner = DeclareWinner(Turn);
	}
	if(GameState[3] === GameState[5] && GameState[5] === GameState[7] && GameState[3] !== undefined)
	{
		Objects.push(new RedLine(3,7));
		Winner = DeclareWinner(Turn);
	}
}

function DeclareWinner()
{
	window.setTimeout(NextRound,1000);
	if(Turn == 1)
	{
		return 2;
	}
	else
	{
		return 1;
	}
}

function NextRound()
{
	print("NextRound");
	Objects.splice(0,Objects.length);
	GameState.splice(0,GameState.length);
	Winner = 0;
}

class RedLine
{
	constructor(n1,n2)
	{
		this.n1 = n1;
		this.n2 = n2;
		this.x1 = FTXS(((this.n1-1)%3)+1);
		this.y1 = FTYS(floor((this.n1-1)/3));
		this.x2 = FTXS(((this.n2-1)%3)+1);
		this.y2 = FTYS(floor((this.n2-1)/3));
	}
	Draw()
	{
		stroke(255,0,0);
		strokeWeight(10);
		line(this.x1,this.y1,this.x2,this.y2);
	}
}

function draw() 
{
	background(0);
	CreateGrid();
	for(i = 0; i < Objects.length ; i++)
	{
		Objects[i].Draw();
	}
	CreateInterface();
}