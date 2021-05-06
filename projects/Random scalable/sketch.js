function setup() {
	createCanvas(1920,1080);
	canvas.getContext
	pixelDensity(1);
	background(0);
	buffer = new ArrayBuffer(8);
	loadPixels();
	sizePixels = 1;
	sizePixelsFloat = sizePixels;
}

function mouseWheel(event){
	if(event.delta < 0){
		sizePixelsFloat *= 1.25;
	}
	else if(sizePixels > 1){
		sizePixelsFloat *= 0.8;
	}
	sizePixels = Math.ceil(sizePixelsFloat);
}


function draw() {
	let index = 0;
	for(let y = 0; y < height; y+= sizePixels){
		for(let x = 0; x < width; x+= 2*sizePixels){
			let r = random()
			for(let i = 0; i < 8; i++){
				r = r * r * 256;
				let j = i;
				if(i > 3){
					j = 4*(sizePixels-1)+i;
				}
				for(let xi = 0; xi < sizePixels; xi++){
					for(let yi = 0; yi < sizePixels; yi++){
						let smallerIndex = 4*(yi*width+xi);
						if(x + xi + j/4 < width && y + yi < height){
							pixels[index+j+smallerIndex] = r;
							if(i === 2 || i === 6){
								pixels[index+j+1+smallerIndex] = 255;
							}
						}		
					}
				}
				if(i === 2 || i === 6){
					i++;
				}
				r = r - ~~r;
			}
			index += 8*sizePixels;
			if(index%(4*width) < 8*sizePixels){
				index = index - index%(4*width);
			}
		}
		index+=(sizePixels-1)*4*1920;
	}
  	updatePixels();
  	console.log(frameRate());
}