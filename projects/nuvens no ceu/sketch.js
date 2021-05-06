function setup() 
{
	createCanvas(1280,720);
	nuvens = [];
	estrelas = [];
	numero = 0;
	for(i=1;i<200;i++)
	{
		estrelas.push(new Estrela(random(0,width),random(0,height/2)));
	}
	window.setInterval(CriarNuvem,300);
	{
		time = 0;
		TimeConverted = 8
		Hour = 8;
		Minute = 0;
		Day = 0;
	}
	Score = 0;
	Health = 10;
	HighScore = 0;
	GameState = true;
	permission = true;
}

function ZeroNumber (Number)
{
	if(Number<10)
	{
		Number = "0" + Number;
	}
	return Number;
}

function CriarNuvem ()
{
	nuvens.push(new Nuvem(-500,0,random(1,min(sqrt(time),25))));
	time = time + 0.3;
	TimeConverted = ((24/125.6125) * time) + 8;
	Day = floor(TimeConverted/24);
	Hour = floor(TimeConverted)- 24 * Day;
	Minute = floor(60 * TimeConverted) - 60*Hour - 24*60*Day;
}

class Estrela
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		this.a = 0;
	}
	Draw()
	{
		noStroke();
		fill(255,255,255,this.a);
		ellipse(this.x,this.y,random(5,10),random(5,10));
	}
}

class Nuvem
{
	constructor(x,y,z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
		this.sqrtz = Math.sqrt(z);
		this.size = Math.pow(2.7,(-1)*this.sqrtz) * sqrt(sqrt(random(0,1000)));
		this.x = this.x + 100*this.sqrtz;
		this.y = this.y + 100*this.sqrtz;
		if(this.y>360)
		{
			this.diference = this.y - 360;
			this.y = 360 - this.diference;
		}
		this.Redstate = false;
	}
	Draw()
	{
		noStroke();
		if(this.Redstate)
		{
			fill(255*iluminacao,0,0);
		}
		else
		{
			fill(255*iluminacao,255*iluminacao,255*iluminacao);
		}
		ellipse(this.x,              this.y,              50*this.size, 50*this.size);
		ellipse(this.x+25*this.size, this.y,              50*this.size, 50*this.size);
		ellipse(this.x,              this.y-25*this.size, 60*this.size, 60*this.size);
		ellipse(this.x-25*this.size, this.y,              55*this.size, 55*this.size);
		ellipse(this.x-50*this.size, this.y+7*this.size,  35*this.size, 35*this.size);
	}
	EstaNaNuvem(x,y)
	{
		this.flag = 0;
		if(dist(x,y,this.x,this.y)<= 50*this.size/2)
		{
			this.flag = 1;
		}
		if(dist(x,y,this.x+25*this.size,this.y) <= 50*this.size/2)
		{
			this.flag = 1;
		}
		if(dist(x,y,this.x,this.y-25*this.size)<= 60*this.size/2)
		{
			this.flag = 1;
		}
		if(dist(x,y,this.x-25*this.size,this.y)<= 55*this.size/2)
		{
			this.flag = 1;
		}
		if(dist(x,y,this.x-50*this.size,this.y+7*this.size)<= 35*this.size)
		{
			this.flag = 1;
		}
		return this.flag;
	}
}

function mousePressed ()
{
	//print(permission);
	if(GameState === false && permission === true)
	{
		GameState = true;
		Health = 10;
		Score = 0;
		nuvens.splice(0,nuvens.length);
		time = 0;
	}
	X = mouseX;
	Y = mouseY;
	for(i=1;i<nuvens.length;i++)
	{
		if(nuvens[i].EstaNaNuvem(X,Y)&&nuvens[i].Redstate === false)
		{
			nuvens[i].Redstate = true;
			Score++;
		}
	}
}

function GameOver()
{
	GameState = false;
	textSize(60);
	text('Game Over!',440,650);
	permission = false;
	window.setTimeout(function(){permission = true},2000);
}

function draw() 
{
	if(GameState === true)
	{
		iluminacao = Math.max(Math.min(cos((time-20)/20)+0.5,1),0.1);
		background(0,191*iluminacao,255*sqrt(iluminacao));
		for(i=1;i<estrelas.length;i++)
		{
			estrelas[i].a = 255*(1-iluminacao);
			estrelas[i].Draw();
		}
		for(i=1;i<nuvens.length;i++)
		{
			nuvens[i].Draw();
			nuvens[i].x = nuvens[i].x + 20/nuvens[i].z * time/100;
			if(nuvens[i].x>width+100)
			{
				if(nuvens[i].Redstate===false)
				{
					Health--;
					print(nuvens[i]);
				}
				nuvens.splice(i, 1);
			}
		}
		fill(127*iluminacao,255*iluminacao,0);
		rect(0,360,width,height-360);
		textSize(32);
		fill(0,0,0);
		text('Score:',50,650);
		text(Score,150,650);
		text('Health: ',1000,650);
		text(Health,1100,650);
		text('High Score: ',50,700);
		if(Score>HighScore)
		{
			HighScore = Score;
		}
		text(HighScore,225,700);
		text('Day: ',860,700);
		text(Day+1,930,700);
		text('Time: ',1000,700);
		text(ZeroNumber(Hour),1100,700);
		text(':',1136,700);
		text(ZeroNumber(Minute),1145,700);
		if(Health <= 0)
		{
			GameOver();
		}
	}
}