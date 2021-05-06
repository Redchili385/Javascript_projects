function setup() {
	createCanvas(480,240);
	pixelDensity(1);
	count = 0;
}

function draw() 
{
	print(count);
	background(51);
	loadPixels();
	index = 0;
	greenValue = (sin(count/10)+1)*256/2
	for(y = 0; y < height; y++)
	{
		for(x = 0; x < width; x++)
		{
			pixels[index+0] = x * 256/width;
			pixels[index+1] = greenValue;
			pixels[index+2] = y * 256/height;
			pixels[index+3] = 255;
			index = index + 4;
		}
	}
	updatePixels();
	count++;
}