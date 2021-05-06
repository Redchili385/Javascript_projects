function setup() {
  createCanvas(1280,720)
  time=0;
}

function draw() {
  background(0);
  translate(width/2-time,height/2);
  stroke(255,255,255,255);
  line((-1)*width/2,0,(width/2)-1+time,0) //x axis
  line(0,height/2,0,(-1)*height/2) //y axis
  for(x=(-1)*(width/2)+time;x<width/2+time;x++)
  {
  	y=100*sin(x/30);
  	point(x,(-1)*y);
  }
  time++;
}