//Nome: Vinícius Pereira Duarte
//Matrícula: 11721ECP003


//A classe Tile representa cada quadrado na tela, onde pode possuir sua própria cor e estados, 
//além de ser utilizado pelo algoritmo A* 
class Tile{
	//Para a criação do objeto Tile, é utilizado um construtor com parâmetros da posição em relação à matriz a qual o contém,
   //além dos respectivos tamanhos de largura e altura, a posição x e y é inferida a partir da relação abaixo, e são setadas
   //outras configurações padrão, muitas do próprio A* como o gCost, hCost e cameFrom.
	constructor(tx,ty,w,h){   //tx = posição x na matriz de Tiles, ty = posição y na matriz, w = comprimento do quadrado(Tile), h = altura do quadrado  args(int,int,float,float)
		this.w = w;
		this.h = h;
		this.tx = tx;
		this.ty = ty;
		this.x = tx*w;
		this.y = ty*h;
		this.color = color(255,255,255)//getRandomColor();
		this.neighbors = [];          //Vetor de vizinhos começa vazio
		this.gCost = Number.POSITIVE_INFINITY;
		this.hCost = Number.POSITIVE_INFINITY;
		this.cameFrom = null;
		this.wall = false;
	}
	//Função responsável por desenhar o Tile(quadrado) na tela, se for parede é uma cor escura, 
	//e caso tenha um valor de F calculado, mostrar um texto deste valor no centro do quadrado
	Draw(){
		if(this.wall){
			fill(0);      //Cor preta para paredes
		}
		else{
			fill(this.color);
		}
		stroke(0);
		strokeWeight(this.w* 0.05);
		rect(this.x,this.y,this.x+this.w,this.y+this.h);  //Criação dos retângulos em desenho na tela
		let fCost = this.getFCost();
		if(fCost !== Number.POSITIVE_INFINITY){
			fill(255);
			textSize(this.w*0.3);  //Tamanho do texto
			stroke(0);
			strokeWeight(1);
			textAlign(CENTER, CENTER);
			text(int(fCost), this.x + this.w/2, this.y + this.h/2);  //Criação do texto
		}
	}
	//Função de heuristica h(x) responsável por calcular uma distância mínima entre dois Tiles
	//Foi utilizada uma função que calcula a distância mínima quando utilizado caminhos diagonais de 45º e os perpendiculares normais
	//Também chamado de "octile distance"
	calculateHeuristic(tile){     //tile = quadrado a ser utilizado para comparar as distâncias com o próprio objeto chamador do método  args(Tile)
		let dx = Math.abs(this.tx - tile.tx)   //Valor absoluto da diferença
		let dy = Math.abs(this.ty - tile.ty)
		let minDxDy = Math.min(dx,dy)    //Função matemática que pega o menor de dois valores
		let maxDxDy = Math.max(dx,dy)    //Função matemática que pega o maior de dois valores
		let heuristic = minDxDy * Math.sqrt(2) + (maxDxDy - minDxDy);   //Distâncias considerando uma diagonal maior com uma reta da diferença, equivalente à qualquer permutação otimizada de movimentos diagonais e perpendiculares
		this.color = color(0,200,0);        //Ao calcular uma heuristica, setar o valor da cor do quadrado para verde
		return heuristic;   //Retorna o valor da heurística h(x), a mínima distância necessária    return(float)
	}
	//Esta função define os vizinhos de forma bidirecional, se this = a e tile = b, então a armazena b como vizinho e b armazena a como vizinho.
	setBidirectionalNeighbors(tile){  //tile = quadrado vizinho a ser feito a operação   args(Tile)
		tile.neighbors.push(this);   //push = inserir um valor no final de um vetor
		this.neighbors.push(tile);
	}
	// Utiliza dos valores de g e h determinados do atribuito do quadrado(Tile) para retornar o valor da soma destes, o valor de F do algoritmo A*
	getFCost(){
		return this.gCost + this.hCost;   //return(float)
	}
	//Verifica terrenos impassáveis como paredes ou diagonais cercadas por paredes
	isValidNeighbor(neighbor){ //vizinho a ser verificado como válido para próxima etapa do algoritmo, como caminho final   args(Tile)
		if(neighbor.wall){
			return false;
		}
		let dx = neighbor.tx - this.tx;
		let dy = neighbor.ty - this.ty;
		if(tiles[this.ty][this.tx+dx].wall && tiles[this.ty+dy][this.tx].wall){   //Identifica as paredes com a diagonal perpendicular ao vetor de posição entre o vizinho e o próprio objeto chamado, para impedir travessias de paredes diagonais
			return false;
		}
		return true;    //return(bool)
	}
}

//Função auxiliar que retorna uma cor aleatória para desenhos utilizando o p5 como funções fill e stroke
function getRandomColor(){
	return color(random()*255,random()*255,random()*255);  //return(P5.Color)
}

//Função principal do script, executa uma vez após o carregamento da página, estão os códigos de inicialização de variáveis do A*,
//como a matriz de quadrados(tiles) e do p5, como o Canvas, os botões, configurações de frames
function setup() {
	// Criando Canvas para representação gráfica e setando parâmetros 
	// como largura dos blocos e quantidade de pixels verticais e horizontais
	let W = 1200;
	let H = 1200;
	pixelDensity(1);          //Definindo densidade de pixels para desenho
	frameRate(60);            //Definindo os Frames por segundo da aplicação
  	createCanvas(W,H);        //Criando a região gráfica da aplicação, utilizando os tamanhos de pixels W = width e H = height
  	background(200);          //Definindo cor inicial de fundo
	w = 20;
	h = 20;
	tW = W/w;  //Tile Width - Tamanho dos quadrados
	tH = H/h;  //Tile Height
	
	// Criando matriz de blocos e setando seus vizinhos
	tiles = [];
	for(let ty = 0; ty < h; ty++){
		let lineOfTiles = [];
		for(let tx = 0; tx < w; tx++){
			let tile = new Tile(tx,ty, tW, tH);
			//Método de ligamento de vizinhos eficiente, cada vetor liga com os 3 quadrados passados (já criados) em vetores diferentes
			if(ty > 0)tile.setBidirectionalNeighbors(tiles[ty-1][tx]);
  			if(tx > 0)tile.setBidirectionalNeighbors(lineOfTiles[tx-1]);
  			if(tx > 0 && ty > 0)tile.setBidirectionalNeighbors(tiles[ty-1][tx-1]);
			lineOfTiles.push(tile);
		}
		tiles.push(lineOfTiles);
	}
	
	//Setando as posições iniciais e finais
	start = tiles[0][0];
	finish = tiles[h-1][w-1];
	
	//Definindo as condições iniciais do algoritmo A*
	start.gCost = 0;
	start.hCost = start.calculateHeuristic(finish);
	
	
	openTiles = [start];   //open são os blocos disponíveis para futura análise
	closedTiles = [];     //closed são os blocos que não serão mais analisados
	
	//Definindo estados para execução do código
	started = false
	finished = false
	
	//Criando botão de Start
	button_start = createButton('Start');
	button_start.style('font-size', '30px');
  	button_start.mousePressed(() => started = true);
  	
  	//Criando botão de geração aleatória de obstáculos
	button_walls = createButton('Generate Walls');
	button_walls.style('font-size', '30px');
  	button_walls.mousePressed(() => {
  		let wallRandomness = 0.3;
  		for(let lineOfTiles of tiles){
  			for(let tile of lineOfTiles){
  				tile.wall = false;
  				if(random() < wallRandomness){
					tile.wall = true;
				}
  			}
  		}
  		start.wall = false;
		finish.wall = false;
  	});
  	
  	//Criando botão que limpa os obstáculos
	button_clear_walls = createButton('Clear Walls');
	button_clear_walls.style('font-size', '30px');
  	button_clear_walls.mousePressed(() => {
  		let wallRandomness = 0.3;
  		for(let lineOfTiles of tiles){
  			for(let tile of lineOfTiles){
  				tile.wall = false;
  			}
  		}
  	});
}

//Durante o desenvolvimento do algoritmo A*, são definidos os caminhos pelo armazenamento do valor do quadrado anterior, de forma encadeada, como uma fila
//Assim essa função consegue ler todo este encadeamento voltando, para desenhar o caminho final na tela
function reconstructPath(tile){    //tile = quadrado final do encadeamento que contem um valor de quadrado anterior pelo cameFrom.
	while(tile.cameFrom !== null){
		tile.color = color(125,0,0);
		tile = tile.cameFrom;
	}
	tile.color = color(200,0,0);
}

//Executado a cada frame após o setup em loop, veja que cada passo do A* passa por essa função, assim podemos observar as animações enquanto o código está calculando as operações
function draw() {
	aStarStep();
	if(mouseIsPressed){  //Se o mouse estiver pressionado sobre a tela, criar obstáculos no caminho
		let tx = ~~(mouseX/tW);  //Mesmo que a função floor para converter para inteiro
		let ty = ~~(mouseY/tH);
		if(tx > 0 && tx < w && ty > 0 && ty < h){
			let tile = tiles[ty][tx];
			tile.wall = true;
		}
	}
	//Desenhar todos os quadrados a todo frame
	for(let row of tiles){
	  	for(let tile of row){
	  		tile.Draw();
	  	}
	}
}

//Código principal do A*, apenas um passo a cada vez, observando o vetor openTiles
function aStarStep(){
	if(started === true && finished === false){
		if(openTiles.length > 0){
			// Definir current como sendo o bloco com o menor valor de F
		  	let current = openTiles[0];
		  	//Caso tenha o mesmo valor de F, sortear pelo que tem menor valor de H(x) heuristic
		  	for(let tile of openTiles){
		  		if(tile.getFCost() == current.getFCost()){
		  			if(tile.calculateHeuristic(finish) < current.calculateHeuristic(finish)){
		  				current = tile;
		  			}
		  		}
		  		if(tile.getFCost() < current.getFCost()){
		  			current = tile;
		  		}
		  	}
		  	openTiles.splice(openTiles.indexOf(current),1);   //Removendo current de open
		  	closedTiles.push(current);                   //Adicionando current em closed
		  	
		  	//Se o vetor a ser analisado é o final, finalizar o algoritmo e realizar um traceback com o reconstruct path
		  	if(current === finish){
		  		print("Caminho encontrado");
		  		reconstructPath(finish);
		  		finished = true;
		  	}
		  	else{
		  		//Analisar todos os vizinhos do bloco atual e verificar validade de parede e se está contido no vetor closedTiles
		  		for(let neighbor of current.neighbors){
			  		if(current.isValidNeighbor(neighbor) && closedTiles.indexOf(neighbor) === -1){
			  			let tentative_gCost = current.gCost + current.calculateHeuristic(neighbor);
			  			//Caso o valor de g for menor, substituir os valores do vizinho e setar o atual como sendo o anterior do novo vizinho, atualizando os valores de g e h
			  			if(tentative_gCost  < neighbor.gCost){
			  				neighbor.cameFrom = current;
			  				neighbor.gCost = tentative_gCost;
			  				neighbor.hCost = neighbor.calculateHeuristic(finish);
			  				//Se o vizinho não estiver contido no vetor de abertos, inserir este
			  				if(openTiles.indexOf(neighbor) === -1){
			  					openTiles.push(neighbor);
			  				}
			  			}
			  		}
			  	}
		  	}
		  	
		}
		else{
			print("Caminho não encontrado");
			finished = true;
		}
	}
}