class Selection
{
	constructor(charge)
	{
		this.charge = charge
		this.Brightness = 0;
		this.centralized = false;
		//this.radius = addElement("","TEXTAREA","Selection_TEXTAREA_Radius","");
		
		//this.radius.position = (0,height+10);
	}
	destructor()
	{
		this.charge.strokeBrightness = 0;
		//this.radius.parentNode.removeChild(element);
	}
	drawMarker()
	{
		this.Brightness += 0.1;
		this.charge.strokeBrightness = 0.5*(Math.sin(this.Brightness) + 1);
		//print(this.charge.strokeBrightness);
	}
}

function addElement(parentId, elementTag, elementId, html) {
    // Adds an element to the document
    
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    var p;
    if(parentId === "")
    	p = document.body
    else
    	p = document.getElementById(parentId);
    p.appendChild(newElement);
    return newElement;
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function mouseWheel(event) //*Scale = World -> Window
{
	if(event.deltaY < 0)
	{
		Scale *= 1.25;
	}
	else
	{
		Scale *= 0.8;
	}
	//print(Scale);
}

function WtS(x,y)  //World coordinates to Screen pixel coordinates
{
	return [
		(x - centerPixelX) * Scale + width/2,
		(y - centerPixelY) * Scale + height/2
	]
}

function StW(x,y)
{
	return[
		x/Scale + centerPixelX,
		y/Scale + centerPixelY,
	]
}

function OnArea(charge)
{
	/*print
	(
		Math.pow(mouseX - WtS(charge.x,0)[0],2),
		Math.pow(mouseY - WtS(0,charge.y)[1],2),
		Math.pow(Math.max(charge.radius * Scale,5),2)
	)*/
	if
	(
		  Math.pow(mouseX - WtS(charge.x,0)[0],2)
		+ Math.pow(mouseY - WtS(0,charge.y)[1],2) 
		< Math.pow(Math.max(charge.radius * Scale,5),2)
	)
	return true;
	return false;
}

function mouseClicked()
{
	if(selection && !OnArea(selection))
	{	
		selection.destructor();
		selection = null;
	}
	for(i = 0; i< charges.length; i++)
	{
		//print(OnArea(charges[i]))
		if(OnArea(charges[i]))
		{
			selection = new Selection(charges[i])
			break;
			//charges[i].radius *= 2;
			//charges[i].mass *= 8;
			//charges[i].value *= 8;
		}
	}
}


function mousePressed()
{
	if(selection && !OnArea(selection))
	{	
		selection.centralized = false;
	}
	windowPointClickedX = mouseX;
	windowPointClickedY = mouseY;
	initialCenterPixelX = centerPixelX;
	initialCenterPixelY = centerPixelY;
}

function keyPressed() 
{
  if (keyCode === 32 && selection !== null)
    selection.centralized = true;
}

function createCharges()
{
	for(let i = 0; i < nCharges; i++)
	{
	  	charges[i] = new Charge(width*(random()-0.5),height*(random()-0.5),random()*2 - 1);
	}
	/*var theta;
	var quantity = nCharges;
	var tau = 2 * Math.PI; //Full Circunference length
	var radius = 1000;
	var count;
	var newCharge;
	charges.push(new Charge(0,0,(nCharges-1) * 1))
	for(count = 0; count < quantity - 1; count++)
	{
		theta = count/(quantity-1) * tau;
		newCharge = new Charge(radius * cos(theta),radius * sin(theta),-1)
		newCharge.vx = (random() - 0.5);
		newCharge.vy = (random() - 0.5);
		charges.push(newCharge);
	}*/
}

function setup() 
{
	width = 600;
	height = 300;
	nCharges = 20;
	activateCollisions = false;
	//frameRate(60);
	selection = null
	
	centerPixelX = 0;//width/2;
	centerPixelY = 0;//height/2;
	k = 9 * Math.pow(10,9);
	Scale = 1;
	createCanvas(width,height);
	pixelDensity(1);
	charges = [];
	createCharges();
	//print(charges);
}


function draw()
{
	if(mouseIsPressed)
	{
		centerPixelX = initialCenterPixelX + (windowPointClickedX - mouseX)/Scale
		centerPixelY = initialCenterPixelY + (windowPointClickedY - mouseY)/Scale
	}
	for(let i = 0; i< charges.length; i++){charges[i].UpdateVelocity(charges);}
	for(let i = 0; i< charges.length; i++){charges[i].Move(charges);}
	if(selection !== null && selection.centralized)
	{
		centerPixelX = selection.charge.x;
		centerPixelY = selection.charge.y;
		selection.drawMarker();
	}
	background(150);
	loadPixels();
	let index = 0, y, x, potential, preDistX, preDistY,i,distX,distY,distance,Log,Brightness,ColorLog;
	for(y = 0; y<height; y++)
	{
	  	for(x = 0; x< width; x++)
	  	{
	  		potential = 0;
	  		preDistX = (x - width/2) / Scale + centerPixelX;
	  		preDistY = (y - height/2)/ Scale + centerPixelY
	  		for(i = 0; i< charges.length; i++)
	  		{
	  			distX = preDistX - charges[i].x;
	  			distY = preDistY - charges[i].y;
	  			distance = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
	  			if(distance > 0){potential += charges[i].value/distance}
	  		}
	  		potential *= k;
	  		Log = Math.log(Math.abs(potential));
	  		Brightness = 2 * Math.abs(Math.round(Log) - Log);
	  		ColorLog = Math.max(Math.pow(Math.max(0,(Log - 13) * 0.1),2),0.1);
	  		if(potential > 0)
	  		{
	  			pixels[index] = 256 * (Brightness + ColorLog);
	  			pixels[index + 1] = 256 * (Brightness - ColorLog);
	  			pixels[index + 2] = 256 * (Brightness - ColorLog);
	  		}
	  		else
	  		{
	  			pixels[index] = 256 * (Brightness - ColorLog);
	  			pixels[index + 1] = 256 * (Brightness - ColorLog);
	  			pixels[index + 2] = 256 * (Brightness + ColorLog);
	  		}
	  		
	  		index += 4;
	  	}
	}
	updatePixels();
	for(i = 0; i< charges.length; i++)
	{
	  	charges[i].Draw();
	}
	if(selection !== null)selection.drawMarker();
}