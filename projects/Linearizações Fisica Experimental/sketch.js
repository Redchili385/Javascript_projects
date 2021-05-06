//Física Experimental Gráficos e Linearizações
//Autor: Vinícius Pereira Duarte

class Point
{
	constructor(x,y,grafico,errox,erroy)
	{
		this.x = x;
		this.y = y;
		if(grafico)
		{
			this.Cx = grafico.x;
			this.Cy = grafico.y;
		}
		else
		{
			this.Cx = 0;
			this.Cy = 0;
		}
		if(errox){this.errox = errox}else{this.errox = 0}
		if(erroy){this.erroy = erroy}else{this.erroy = 0}
	}
	pontoConvertido()
	{
		this.cPontoy = -1 * this.y;
		this.cPontox = this.x + this.Cx;
		this.cPontoy = this.cPontoy + this.Cy;
		return new Point(this.cPontox,this.cPontoy);
	}
	Draw()
	{
		this.cPoint = this.pontoConvertido();
		fill(150,0,0);
		stroke(0,0,0);
		strokeWeight(2);
		ellipse(this.cPoint.x,this.cPoint.y,10,10);
		strokeWeight(1);
		if(this.errox !== 0){line(this.cPoint.x-this.errox,this.cPoint.y,this.cPoint.x+this.errox,this.cPoint.y);}
		if(this.erroy !== 0){line(this.cPoint.x,this.cPoint.y-this.erroy,this.cPoint.x,this.cPoint.y+this.erroy);}
	}
}

class Line
{
	constructor(a,b,grafico)
	{
		this.a = a;
		this.b = b;
		if(grafico){} else {grafico = new Grafico(0,0,width,height)}
		this.iPoint = new Point((-1/2 * grafico.H - b)/a,-1/2 * grafico.H, grafico);
		this.fPoint = new Point((grafico.H/2 -b)/a , grafico.H / 2, grafico);
	}
	Draw()
	{
		this.CiPoint = this.iPoint.pontoConvertido();
		this.CfPoint = this.fPoint.pontoConvertido();
		stroke(0,0,100);
		strokeWeight(3);
		line(this.CiPoint.x,this.CiPoint.y,this.CfPoint.x,this.CfPoint.y);
	}
}

class Grafico
{
	constructor(x,y,W,H)
	{
		this.x = x;
		this.y = y;
		this.W = W;
		this.H = H;
		this.points = [];
		this.lines = [];
	}
	Draw()
	{
		this.DrawAxis();
		this.DrawPoints(this.points);
		this.DrawLines(this.lines);
	}
	DrawAxis()
	{
		stroke(0);
		strokeWeight(5);
		line(this.x,this.y-this.H,this.x,this.y+this.H) //eixo Y
		line(this.x-this.W,this.y,this.x+this.W,this.y) //eixo X
	}
	DrawPoints(points)
	{
		for(this.i = 0; this.i< points.length; (this.i)++)
		{
			points[this.i].Draw();
			//print(points[this.i]);
		}
	}
	DrawLines(Lines)
	{
		for(this.i = 0; this.i < Lines.length; this.i++)
		{
			Lines[this.i].Draw();
		}
		//print(Lines);
	}
	generateRandomPoints(Vpoints,Q,Xmin,Xmax,Ymin,Ymax,erroxMin,erroxMax,erroyMin,erroyMax)
	{
		for(this.i = 0; this.i < Q; this.i++)
		{
			this.Rpoint = new Point((Xmax-Xmin)*Math.random()+Xmin,(Ymax-Ymin)*Math.random()+Ymin,this,(erroxMax-erroxMin)*Math.random()+erroxMin,(erroyMax-erroyMin)*Math.random()+erroyMin);
			//print(this.Rpoint);
			this.points.push(this.Rpoint);
		}
	}
	linearizar1(Points)
	{
		this.xye2 = 0;
		this.xxe2 = 0;
		for(this.i = 0; this.i < Points.length; (this.i)++)
		{
			if(Points[this.i].erroy === 0){this.novoerroy = 0.01;}else{this.novoerroy = Points[this.i].erroy;}
			this.xye2 += (Points[this.i].x*Points[this.i].y)/(this.novoerroy*this.novoerroy);
			this.xxe2 += (Points[this.i].x*Points[this.i].x)/(this.novoerroy*this.novoerroy);
		}
		print(this.xye2,this.xxe2);
		this.a = this.xye2/this.xxe2;
		this.b = 0;
		return new Line(this.a,this.b,this);
	}
	linearizar2(Points)
	{
		this.swi = 0;
		this.swixi = 0;
		this.swiyi = 0;
		this.swixixi = 0;
		this.swixiyi = 0;
		for(this.i = 0; this.i < Points.length; (this.i)++)
		{
			if(Points[this.i].erroy === 0){this.novoerroy = 0.01;}else{this.novoerroy = Points[this.i].erroy;}
			this.wi = 1/(this.novoerroy * this.novoerroy);
			this.wixi = this.wi * Points[this.i].x;
			this.wiyi = this.wi * Points[this.i].y;
			this.wixixi = this.wixi * Points[this.i].x;
			this.wixiyi = this.wixi * Points[this.i].y;
			this.swi += this.wi;
			this.swixi += this.wixi;
			this.swiyi += this.wiyi;
			this.swixixi += this.wixixi;
			this.swixiyi += this.wixiyi;
		}
		this.Delta = this.swi*this.swixixi - this.swixi*this.swixi;
		this.a = (this.swi*this.swixiyi-this.swiyi*this.swixi)/this.Delta;
		this.b = (this.swiyi*this.swixixi-this.swixiyi*this.swixi)/this.Delta;
		return new Line(this.a,this.b,this);
	}
}


function setup() {
  createCanvas(900,500);
  background(150);
  grafico = new Grafico(450,250,900,500);
  grafico.generateRandomPoints(grafico.points,10,-450,450,-250,250,0.01,50,0.01,50);
  grafico.lines.push(grafico.linearizar1(grafico.points));
  grafico.lines.push(grafico.linearizar2(grafico.points));
  print(grafico.Line);
  grafico.Draw();
  setTimeout(setup,5000);
}

function draw() {
}