class Wave{
	constructor(cx,cy,v,ri, duration, ti){
		this.cx = cx
		this.cy = cy
		this.v = v
		this.ri = ri
		this.duration = duration
		this.ti = ti
	}
	draw(t){
		noFill()
		let r = this.v * (t-this.ti) + this.ri
		ellipse(this.cx,this.cy,2*r,2*r)
	}
	exists(t){
		return t <= (duration+ti)
	}
}


function setup() {
  	createCanvas(1000,500)
  	t = 0
  	waves = []
  	numberOfWaves = 20
  	
  	vSlider = createSlider(0,10,2,0.2)
  	vSlider.position(0.02*width, 0.05*height)
  	vWaveSlider = createSlider(0,10,5,0.2)
  	vWaveSlider.position(0.02*width, 0.1*height)
  	vParticleSpan = createSpan('')
  	vParticleSpan.position(0.15*width, 0.05*height)
  	vWaveSpan = createSpan('')
  	vWaveSpan.position(0.15*width, 0.1*height)
  	
  	cx = width/2
  	cy = height/2
}

function draw() {
	background(220);
	
	let vc = vSlider.value();
	let vw = vWaveSlider.value();
	vParticleSpan.html('v Particle = '+vc)
	vWaveSpan.html('v Wave = '+vw)
	cx = (cx+vc)%width
	//cy = (cy+vc)%height
	let ri = 10
	if(t % 7 == 0){
		waves.push(new Wave(cx,cy,vw,ri,20,t))
	}
	if(waves.length > numberOfWaves){
		waves.splice(0,1)
	}
	print(waves)
	fill(150,0,0)
	ellipse(cx,cy,2*ri,2*ri)
	for(wave of waves){
		wave.draw(t)
	}
	t++
}