class Time{
	constructor(id, cor){
		this.id = id;
		this.cor = cor;
		this.pecas = [];
		this.diferenciarTimes();
	}
	diferenciarTimes(){   //extensão do construtor -- Diferenciar Times
		if(this.id === 0){
			this.py = 5;   //primeiro altura y de montagem
			this.vy = -1;  //direção permitida do time em relação a velocidade y
			this.damaY = 0
		}
		else if( this.id === 1){
			this.py = 0
			this.vy = 1
			this.damaY = 7
		}
	}
	montarTabuleiro(){
		for(let qy = this.py; qy < this.py+3; qy++){
			for(let qx = 0; qx < 8; qx++){
				if(isInBlackSquare(qx,qy)){
					this.pecas.push(new Peca(qx,qy,this));
				}
			}
		}
	}
	Draw(){
		for(let i = 0; i < this.pecas.length; i++){
			let peca = this.pecas[i];
			peca.Draw();
		}
	}
	existPeca(qx,qy){
		return this.getPeca(qx,qy) !== null
	}
	getPeca(qx,qy){
		for(let i = 0; i < this.pecas.length; i++){
			let peca = this.pecas[i];
			if(qx === peca.qx && qy === peca.qy){
				return peca;
			}
		}
		return null;
	}
	getPotentialAssassinas(){  //Pecas que podem realizar capturas
		let potentialAssassinas = []
		for(let peca of this.pecas){
			let positions = peca.calculatePositions()
			if(positions.captura.length > 0){
				potentialAssassinas.push(peca)
			}
		}
		return potentialAssassinas
	}
	removePeca(peca){
		let index = this.pecas.indexOf(peca);
		if(index !== -1){
			this.pecas.splice(index,1);
			return true;
		}
		return false;
	}
}

class Peca{
	constructor(qx,qy,time){   
		this.qx = qx; //coordenada X do quadrado de 0 a 7
		this.qy = qy; //coordenada Y do quadrado de 0 a 7
		this.centralize();
		this.radius = 0.4* squareWidth
		this.time = time;
		this.isDama = false
	}
	centralize(){  //Atualizar a posição da peça para desenho de acordo com as coordenadas
		this.cx = this.qx * squareWidth + squareWidth/2;    //Coordenada X do Pixel do centro do circulo
		this.cy = this.qy * squareHeight + squareHeight/2;  //Coordenada Y do Pixel do centro do circulo
	}
	Draw(){
		fill(this.time.cor)	
		ellipse(this.cx,this.cy,2*this.radius,2*this.radius);
		if(this.isDama){
			fill(0)
			ellipse(this.cx,this.cy,1.6*this.radius,1.6*this.radius);
		}
	}
	inArea(x,y){
		let distanceSquared = Math.pow(this.cx-x,2)+Math.pow(this.cy-y,2);
		let radiusSquared = Math.pow(this.radius,2)
		return distanceSquared < radiusSquared
	}
	calculatePositions(){
		let posicoesNormais = []
		let posicoesCaptura = []
		
		let normais = [];
		let capturas = [];
		
		if(this.isDama){
			let directions = [{"vx":1,"vy":1},{"vx":-1,"vy":1},{"vx":1,"vy":-1},{"vx":-1,"vy":-1}]
			for(let direction of directions){
				let qx = this.qx
				let qy = this.qy
				qx += direction.vx
				qy += direction.vy
				while(qx >= 0 && qx < qH && qy >= 0 && qy < qV){
					normais.push({"qx": qx,"qy": qy})
					capturas.push({"qx": qx,"qy": qy})
					qx += direction.vx
					qy += direction.vy
				}
			}
		}
		else{
			normais = [{"qx":this.qx+1,"qy":this.qy+this.time.vy},{"qx":this.qx-1,"qy":this.qy+this.time.vy}]; //Temporário
			capturas =[{"qx":this.qx+2,"qy":this.qy+2*this.time.vy},{"qx":this.qx-2,"qy":this.qy+2*this.time.vy},
						  {"qx":this.qx+2,"qy":this.qy-2*this.time.vy},{"qx":this.qx-2,"qy":this.qy-2*this.time.vy}] //Temporário
		}
		let otherTime = getOtherTime(this.time)
		for(let normal of normais){
			if(!this.time.existPeca(normal.qx,normal.qy) && 
			!otherTime.existPeca(normal.qx,normal.qy) && 
			isInBlackSquare(normal.qx,normal.qy)){
				posicoesNormais.push(normal);
			}
		}
		for(let captura of capturas){
			let pecaCapturada = otherTime.getPeca(captura.qx - Math.sign(captura.qx-this.qx), captura.qy - Math.sign(captura.qy-this.qy));
			if(pecaCapturada !== null){
				if(!this.time.existPeca(captura.qx,captura.qy) && 
				!otherTime.existPeca(captura.qx,captura.qy) &&
				isInBlackSquare(captura.qx,captura.qy)){
					captura.pecaCapturada = pecaCapturada;
					posicoesCaptura.push(captura);
				}
			}
		}
		return {"normal": posicoesNormais, "captura": posicoesCaptura}
	}
	calculateQxQy(x,y){ //calcular as coordenadas de 0 a 7 dado x e y (coordenadas do Pixel)
		let qx = ~~(x / squareWidth)
		let qy = ~~(y / squareWidth)
		
		if(this.time === timeTurno){
			let potentialAssassinas = this.time.getPotentialAssassinas();
			if(potentialAssassinas.length === 0 || potentialAssassinas.includes(this)){
				let positions = this.calculatePositions()
				if(positions.captura.length !== 0){
					if(this === pecaAssassina || pecaAssassina === null){
						for(let captura of positions.captura){
							if(captura.qx == qx && captura.qy == qy){
								this.qx = qx;
								this.qy = qy;
								if(this.qy === this.time.damaY){
									this.isDama = true;
								}
								let otherTime = captura.pecaCapturada.time;
								otherTime.removePeca(captura.pecaCapturada);
								pecaAssassina = this;
								
								let newPositions = this.calculatePositions()
								if(newPositions.captura.length === 0){
									timeTurno = getOtherTime(timeTurno);
									pecaAssassina = null;
									if(timeTurno.pecas.length === 0){
										declareWinner(this.time.id);
									}
									else{
										setTurnoText(timeTurno.id);
									}
								}
								break;
							}
						}
					}
				}
				else if(positions.normal.length !== 0){
					if(pecaAssassina === null){
						for(let normal of positions.normal){
							if(normal.qx == qx && normal.qy == qy){
								this.qx = qx;
								this.qy = qy;
								if(this.qy === this.time.damaY){
									this.isDama = true;
								}
								timeTurno = getOtherTime(timeTurno);
								pecaAssassina = null;
								setTurnoText(timeTurno.id);
								break;
							}
						}
					}
				}	
			}
		}
		
	}
	setFinalPosition(x,y){
		this.calculateQxQy(x,y)
		this.centralize()
	}
}

function mousePressed(){
	for(let i = 0; i < times.length; i++){
		let time = times[i];
		for(let j = 0; j < time.pecas.length; j++){
			let peca = time.pecas[j];
			if(peca.inArea(mouseX,mouseY) && pecaArrastada === null){
				pecaArrastada = peca;
				peca.cx = mouseX;
				peca.cy = mouseY;
			}
		}
	}
}

function mouseDragged() {  //Repete a todo frame de arrasto do mouse clicado
	if(pecaArrastada !== null){
		pecaArrastada.cx = mouseX;
		pecaArrastada.cy = mouseY;
	}
	return false;
}

function mouseReleased(){
	if(pecaArrastada !== null){
		pecaArrastada.setFinalPosition(mouseX,mouseY)
		pecaArrastada = null;
	}
}

function isInBlackSquare(qx,qy){
	return (qx + qy) % 2 === 0 && qx < qH && qx >= 0 && qy < qV && qy >= 0;
}

function getOtherTime(initialTime){
	for(let time of times){
		if(time !== initialTime){
			return time;
		}
	}
	return null;
}

function setTurnoText(idTime){
	let turnoText = document.getElementById("turno")
	turnoText.innerHTML = "Turno do jogador " + (idTime + 1) 
}

function declareWinner(idTime){
	let turnoText = document.getElementById("turno")
	turnoText.innerHTML = "Jogador " + (idTime + 1) + " ganhou!!!"
}

function setup() {
	createCanvas(600,600);
	qH = 8 //Quantidade de quadrados horizontalmente
	qV = 8 //Quantidade de quadrados verticalmente
	squareHeight = height/qH
	squareWidth = width/qV
	pecaArrastada = null;
	pecaAssassina = null;   //Peça que capturou a outra em um mesmo turno
	
	times = [];
	times.push(new Time(0,[255,255,100]))
	times.push(new Time(1,[50,125,255]))
	for(let i = 0; i < times.length; i++){
		let time = times[i];
		time.montarTabuleiro()
	}
	timeTurno = times[0]
}

function draw() {
	background(175);
	fill(0)
	noStroke();
	for(let qy = 0; qy < qV; qy++){
		for(let qx = 0; qx < qH; qx++){
			if(isInBlackSquare(qx,qy)){
				let x = qx * squareWidth;
				let y = qy * squareHeight;
				rect(x,y,squareHeight,squareWidth);
			}
		}
	}
 	if(pecaArrastada !== null){
 		let position = pecaArrastada.calculatePositions()
 		fill(0,255,0,125)
 		print(position);
 		for(let normal of position.normal){
 			let x = normal.qx * squareWidth;
			let y = normal.qy * squareHeight;
			rect(x,y,squareHeight,squareWidth);
 		}
 		fill(255,100,0,125)
 		for(let captura of position.captura){
 			let x = captura.qx * squareWidth;
			let y = captura.qy * squareHeight;
			rect(x,y,squareHeight,squareWidth);
 		}
 	}
	for(let i = 0; i < times.length; i++){
		let time = times[i];
		time.Draw()
	}
}