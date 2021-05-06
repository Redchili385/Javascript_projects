function preload(){
	W = 1920
	H = 1080
	FramesPerAngle = 60
	//animation = render(W,H,FramesPerAngle) 
}

function setup() {
	createCanvas(W,H)
	pixelDensity(1)
	frameRate(60)
	time = 0
}

function girar(pos,sinacosa){
	let x = pos[0]
	let y = pos[1]
	let sina = sinacosa[0]
	let cosa = sinacosa[1]
	pos[0] = x*cosa - y*sina
	pos[1] = x*sina + y*cosa
	return [~~pos[0],~~pos[1]]
}

function render(Width,Height,angleStep){
	let arrayOfFrames = []
	for(let frame = 0; frame < 360 * angleStep; frame++){
		let sinet = ~~(50*Math.pow(Math.sin(frame/angleStep),2)+2)
		let sinacosa = [Math.sin(frame/angleStep),Math.cos(frame/angleStep)]
		let arrayOfY = []
		let halfheight = Height/2
		let halfwidth = Width/2
		for(let y = 0; y < Width; y++){
			let arrayOfX = []
			for(let x=0; x< Height; x++){
				let pixels = [100,0,0,255]
				let xx = x - halfwidth
				let yy = y - halfheight
				let sina = sinacosa[0]
				let cosa = sinacosa[1]
				let X = xx*cosa - yy*sina
				let Y = xx*sina + yy*cosa
				X = ~~X
				Y = ~~Y
				if(X%sinet && Y%sinet){
					pixels[0] = 255
				}
				else if(X === 0 || Y === 0){
					pixels[0] = 255
					pixels[1] = 255
					pixels[2] = 255
				}
				arrayOfX[x] = pixels
			}
			arrayOfY[y] = arrayOfX
		}
		arrayOfFrames[frame] = arrayOfY
	}
	return arrayOfFrames
}


function draw() {
	background(0)
	loadPixels()
	let index = 0
	let sinet = floor(50*Math.pow(Math.sin(time/64),2)+2)
	let sinacosa = [sin(time/64),cos(time/64)]
	let halfheight = height/2
	let halfwidth = width/2
	for(let y = 0; y < height; y++){
		for(let x = 0; x < width; x++){
			let posRot = girar([x-halfwidth,y-halfheight],sinacosa)
			if(posRot[0]%sinet && posRot[1]%sinet){
				pixels[index] = 255
			}
			else if(posRot[0] === 0 || posRot[1] === 0){
				pixels[index] = 255
				pixels[index+1] = 255
				pixels[index+2] = 255
			}
			else{
				pixels[index] = 0
			}
			pixels[index+3] = 255;
			index = index + 4;
		}
	}
	updatePixels()
	time++;
}