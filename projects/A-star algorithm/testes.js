//Nome: Vinícius Pereira Duarte
//Matrícula: 11721ECP003

function teste1(){
	console.log("Teste 1");
	let a = new Tile(5,5,1,1);
	let b = new Tile(4,3,1,1);
	let c = new Tile(0,0,1,1);
	
	console.log(a.calculateHeuristic(b));
	console.log(a.calculateHeuristic(c));
	console.log(b.calculateHeuristic(a));
	console.log(b.calculateHeuristic(c));
	console.log(c.calculateHeuristic(a));
	console.log(c.calculateHeuristic(c));
}

//TESTE 1 
//
//teste1()
//testes.js:2 Teste 1
//testes.js:7 2.414213562373095
//testes.js:8 7.0710678118654755
//testes.js:9 2.414213562373095
//testes.js:10 5.242640687119286
//testes.js:11 7.0710678118654755
//testes.js:12 0
//undefined


function teste2(){
	console.log("Teste 1");
	let a = new Tile(5,5,1,1);
	let b = new Tile(4,3,1,1);
	let c = new Tile(0,0,1,1);
	
	a.setBidirectionalNeighbors(b);
	a.setBidirectionalNeighbors(c);
	b.setBidirectionalNeighbors(c);

	console.log(a.neighbors);
	console.log(b.neighbors);
	console.log(c.neighbors);
}

//TESTE 2 
//
//teste2()
//testes.js:29 Teste 1
//testes.js:38 (2) [Tile, Tile]0: Tile {w: 1, h: 1, tx: 4, ty: 3, x: 4, …}1: Tile {w: 1, h: 1, tx: 0, ty: 0, x: 0, …}length: 2__proto__: Array(0)
//testes.js:39 (2) [Tile, Tile]0: Tile {w: 1, h: 1, tx: 5, ty: 5, x: 5, …}1: Tile {w: 1, h: 1, tx: 0, ty: 0, x: 0, …}length: 2__proto__: Array(0)
//testes.js:40 (2) [Tile, Tile]0: Tile {w: 1, h: 1, tx: 5, ty: 5, x: 5, …}1: Tile {w: 1, h: 1, tx: 4, ty: 3, x: 4, …}length: 2__proto__: Array(0)
//undefined

function teste3(){
	console.log("Teste 3");
	let a = new Tile(5,5,1,1);
	let b = new Tile(4,3,1,1);
	let c = new Tile(0,0,1,1);

	console.log("a.x: "+a.x,"a.y: "+a.y);
	console.log("b.x: "+b.x,"b.y: "+b.y);
	console.log("c.x: "+c.x,"c.y: "+c.y);
}

//TESTE 3 
//
//teste3()
//testes.js:51 Teste 3
//testes.js:56 a.x: 5 a.y: 5
//testes.js:57 b.x: 4 b.y: 3
//testes.js:58 c.x: 0 c.y: 0
//undefined