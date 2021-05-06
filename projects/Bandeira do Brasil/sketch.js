function setup() {
	createCanvas(1000,700);
	pixelDensity(1);
   t = 0;	
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function draw() {
	background(0,156,59);
	let modulo = width/20;
	let distLosango = 1.7*modulo
	fill(225,223,0);
	noStroke();
	quad(width/2,distLosango,width-distLosango,height/2,width/2,height-distLosango,distLosango,height/2);
	fill(0,39,118)
	let circleRadius = 3.5*modulo
	ellipse(width/2,height/2,2*circleRadius,2*circleRadius)
	loadPixels()
	let oldPixels = pixels.slice();
	strokeWeight(modulo/2)
	stroke(255);
	noFill();
	ellipse(width/2-2*modulo,height,2*8.25*modulo,2*8.25*modulo)
	loadPixels()
	//console.log(pixels);
	//console.log(oldPixels);
	let index = 0
	for(let y = 0; y < height; y++){
		for(let x = 0; x < width; x++){
			let distanceFromCenterSquared = (x-width/2)*(x-width/2) + (y-height/2)*(y-height/2);
			let circleRadiusSquared = circleRadius*circleRadius;
			let inDistance = distanceFromCenterSquared <= (circleRadiusSquared)
			
			if((oldPixels[index + 0] !== pixels[index + 0] ||
				oldPixels[index + 1] !== pixels[index + 1] ||
				oldPixels[index + 2] !== pixels[index + 2]) && !inDistance){
				pixels[index + 0] = oldPixels[index + 0];
				pixels[index + 1] = oldPixels[index + 1];
				pixels[index + 2] = oldPixels[index + 2];
			}
			index += 4;
		}
	}
	updatePixels();
	stroke(0);
	strokeWeight(0.5);
	noFill();
	ellipse(width/2,height/2,2*circleRadius,2*circleRadius);
	
	fill(255,255,255)
	let counter = 0;
	while(counter < 1000){
		let r = Math.pow(Math.random(0,1),1/2)*8*modulo
		let theta = random(Math.PI/180*(180),Math.PI/180*(360));
		let x = r*Math.cos(theta)+width/2-2*modulo
		let y = r*Math.sin(theta)+height
		let distanceFromCenterSquared = (x-width/2)*(x-width/2) + (y-height/2)*(y-height/2);
		let circleRadiusSquared = circleRadius*circleRadius;
		let inDistance = distanceFromCenterSquared <= (circleRadiusSquared)
		let R = 3
		if(inDistance){
			star(x,y,R,R/2,5);
			//counter++;
		}
		counter++;
	}
	console.log(frameRate())
	t=t%180
	t++;
}