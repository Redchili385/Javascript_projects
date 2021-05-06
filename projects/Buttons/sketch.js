class Button {
	constructor(id, x = 0,y = 0,sizeX = buttonSeparationX * 2/3,sizeY = buttonSeparationY * 2/3){
		if(typeof(id) === "undefined")
			throw "Id do Botão não pode ser Nulo"
		
		this.id = id
		this.x = x
		this.y = y
		this.sizeX = sizeX
		this.sizeY = sizeY
		
		this.colorOff = [255,255,255]
		this.colorOn = [255,0,0]
		this.isPressed = false
		this.isHovered = false
		this.character = String.fromCharCode(this.id)
		
	}
	Draw(){
		stroke(0)
		strokeWeight(this.sizeY/3)
		if(this.isHovered ^ this.isPressed){
			fill(this.colorOn)
		}
		else{
			fill(this.colorOff)
		}
		rect(this.x,this.y,this.sizeX,this.sizeY)
		textAlign(CENTER,CENTER)
		strokeWeight(this.sizeY/12)
		text(this.character,this.x + this.sizeX/2,this.y + this.sizeY/2)
	}
	inArea(x,y){
		if(x > this.x && x < this.x + this.sizeX &&
			y > this.y && y < this.y + this.sizeY){
			return true		
		}
		return false
	}
}

function mouseReleased(){
	let mX = ~~mouseX
	let mY = ~~mouseY
	if(typeof(pixelSpace[mY]) !== "undefined" && typeof(pixelSpace[mY][mX]) !== "undefined"){
		let button = pixelSpace[mY][mX]
		button.isPressed = !button.isPressed
		print(button.character)
	}
}

function setup() {
	const W = 3200
	const H = 1600
	createCanvas(W,H)
	pixelDensity(1)
  	background(150)
  	nButtonsX = 64
  	nButtonsY = 64
  	buttonSeparationX = W/nButtonsX
  	buttonSeparationY = H/nButtonsY
  	buttons = []
  	pixelSpace = []
  	hoveredButton = undefined;
  	let id = 0
  	for(let y = 0; y < height; y += buttonSeparationY){
  		for(let x = 0; x < width; x += buttonSeparationX){
  			let button = new Button(id++,x,y)
  			buttons.push(button)
  			for(let sY = ~~button.y; sY < button.y + button.sizeY; sY++){
  				if(typeof(pixelSpace[sY]) == "undefined"){
  					pixelSpace[sY] = []
  				}
  				for(let sX = ~~button.x; sX < button.x + button.sizeX; sX++){
  					pixelSpace[sY][sX] = button
  				}
  			}
  		}
  	}
  	print(pixelSpace)
}

function draw() {
  	background(150)
  	let mX = ~~mouseX
	let mY = ~~mouseY
	if(typeof(hoveredButton) !== "undefined"){
		hoveredButton.isHovered = false;
	}
	if(typeof(pixelSpace[mY]) !== "undefined" && typeof(pixelSpace[mY][mX]) !== "undefined"){
		hoveredButton = pixelSpace[mY][mX]
		hoveredButton.isHovered = true
	}
  	for(let i = 0; i < buttons.length; i++){
  		buttons[i].Draw()
  }
}