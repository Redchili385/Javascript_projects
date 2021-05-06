let capture;

function convolve(im, kernel, resultPixels){
	console.log(typeof(kernel))
	if(typeof(kernel) === 'undefined' || typeof(kernel.length) !== 'number'){
		return resultPixels;
	}
	console.log("Kernel is an array")
	let n = kernel.length
	let m = (n-1)/2
	let resultIndex = 4*(width+m);
	for(let cy = m; cy < height - m; cy++){
		for(let cx = m; cx < width - m; cx++){
			for(let i = 0; i< 3; i++){  //color
				let sum = 0
				for(let ky = 0; ky < kernel.length; ky++){
					let row = kernel[ky];
					let y = cy+ky-m
					for(let kx = 0; kx < row.length; kx++){
						let x = cx+kx-m
						let index = 4*(y*width + x) + i
						sum += row[kx]*im[index]
					}
				}
				resultPixels[resultIndex] = sum;	
				resultIndex++;
			}
			resultPixels[resultIndex] = 255;
			resultIndex++
		}
		resultIndex += 2*m*4;
	}
}

kernels = {
	'identity': [[0,0,0],[0,1,0],[0,0,0]],
	'laplacian': [[0,-1,0],[-1,4,-1],[0,-1,0]],
	'laplacian w/ diagonals': [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],
	'laplacian of gaussian': [[0,0,-1,0,0],[0,-1,-2,-1,0],[-1,-2,16,-2,-1],[0,-1,-2,-1,0],[0,0,-1,0,0]],
	'scharr': [[-3, 0, 3],[-10,0,10],[-3, 0, 3]],
	'sobel edge horizontal': [[-1,-2,-1],[0,0,0],[1,2,1]],
	'sobel edge vertical': [[-1,0,1],[-2,0,2],[-1,0,1]],
	'line detection horizontal': [[-1,-1,-1],[2,2,2],[-1,-1,-1]],
	'line detection vertical': [[-1,2,-1],[-1,2,-1],[-1,2,-1]],
	'line detection 45°': [[-1,-1,2],[-1,2,-1],[2,-1,-1]],
	'line detection 135°': [[2,-1,-1],[-1,2,-1],[-1,-1,2]],
	'box blur': [[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]],
	'gaussian blur 3x3': [[1/16,2/16,1/16],[2/16,4/16,2/16],[1/16,2/16,1/16]],
	'gaussian blur 5x5': [[1/256,4/256,6/256,4/256,1/256],[4/256,16/256,24/256,16/256,4/256],[6/256,24/256,36/256,24/256,6/256],[4/256,16/256,24/256,16/256,4/256],[1/256,4/256,6/256,4/256,1/256]],
	'sharpen': [[0,-1,0],[-1,5,-1],[0,-1,0]],
	'unsharp masking': [[-1/256,-4/256,-6/256,-4/256,-1/256],[-4/256,-16/256,-24/256,-16/256,-4/256],[-6/256,-24/256,476/256,-24/256,-6/256],[-4/256,-16/256,-24/256,-16/256,-4/256],[-1/256,-4/256,-6/256,-4/256,-1/256]]
}


function changeRGB(pixels){
	let index = 0;
	for(let y = 0; y < height; y++){
		for(let x = 0; x < width; x++){
			R = pixels[index];
			G = pixels[index + 1];
			B = pixels[index + 2];
			A = pixels[index + 3];
			
			r = B
			g = G
			b = R
			a = A
			
			pixels[index] = r
			pixels[index + 1] = g 
			pixels[index + 2] = b 
			pixels[index + 3] = a
			
			index += 4
		}
	}
}


function setup() {
	capture = createCapture(VIDEO);
	pixelDensity(1)
	createCanvas(640, 480);
	radioKernel = createRadio();
	for(let kernelName in kernels){
	  	radioKernel.option(kernelName)
	}
	capture.hide()
}

function draw() {
	background(100);
	capture.loadPixels()
	let snapshot = capture.get()
	snapshot.loadPixels()
	loadPixels()
	for(let i = 0; i< pixels.length; i++){
		pixels[i] = snapshot.pixels[i]
	}
	//convolve(snapshot.pixels, [[1,0,-1],[0,0,0],[-1,0,1]] ,pixels);
	//convolve(snapshot.pixels,[[0,-1,0],[-1,5,-1],[0,-1,0]], pixels);
	convolve(snapshot.pixels, kernels[radioKernel.value()], pixels);
	//changeRGB(pixels)
	//console.log(pixels)
	updatePixels();
	console.log('fps: '+frameRate())
}
