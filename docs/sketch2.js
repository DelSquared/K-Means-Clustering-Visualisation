var w = 500;
//var n = 1000;
var pts = [];
var k = 10;
var cent = [];
var data;

function dot (x,y){
  this.x=x;
  this.y=y;
  this.h=255;
  this.s=0;
  this.b=255;
  this.centIndex=null
  this.drawPoint = function(){
    stroke(this.h,this.s,this.b);
    point(this.x,this.y);
  }
  this.drawCentroid = function(){
    stroke(this.h,this.s,this.b);
    ellipse(this.x,this.y,5);
  }
  this.closestCentroid = function(centroids){
    var s = Infinity;
    for (var i=0; i<centroids.length; i++){
      if (s>d(this,centroids[i])){
        s=d(this,centroids[i]);
        this.centIndex=i;
        this.h = centroids[i].h;
        this.s = centroids[i].s;
        this.b = centroids[i].b;
      }
    }
  }
  this.recenter = function(points){
    var _x=0,_y=0,num=0;
    for (var i=0; i<points.length; i++){
      if (points[i].centIndex==this.centIndex){
        _x += points[i].x;
        _y += points[i].y;
        num++;
      }
    }
    this.x = _x/num;
    this.y = _y/num;
  }
  this.perturbCentroid = function(e){
    this.x += 2*e*Math.random()-e;
    this.y += 2*e*Math.random()-e;
  }
}

function preload() {
  data = loadTable("spec.csv");
}

function setup() {
  for (var i=0; i<data.getRowCount(); i++){
    pts.push(new dot(w*Number(data.getRow(i).get(0))/data.getRowCount(),Number(data.getRow(i).get(1))+w/2));
  }
  for (var i=0; i<k; i++){
    var x = Math.floor(w*Math.random());
    var y = Math.floor(w*Math.random());
    cent.push(new dot(x,y));
    cent[i].centIndex=i;
    cent[i].h=255*i/k;
    cent[i].s=255;
    cent[i].b=255;
  }

  colorMode(HSB);
  createCanvas(w, w);
  noFill();
  strokeWeight(3);
  frameRate(50);
  strength = createSlider(0, 100, 20);
  strength.position(10, w+25);
  createP('Slider adjusts perturbation strength').position(10, w+35);
}

function draw() {
  background(0);
  for (var i=0; i<pts.length; i++){
    pts[i].drawPoint();
    if (frameCount>20){
      if (frameCount%2==1){
          pts[i].closestCentroid(cent);
      }
    }
  }
  for (var i=0; i<k; i++){
    cent[i].drawCentroid();
    if (frameCount>20){
      if (frameCount%2==1){
        cent[i].recenter(pts);
        if(isNaN(cent[i].x) || cent[i].x<0 || cent[i].x>w){
          cent[i].x = w/2;
        }
        if(isNaN(cent[i].y) || cent[i].y<0 || cent[i].y>w){
          cent[i].y = w/2;
        }

      }
      if (frameCount%50==0 && frameCount<1000){
        cent[i].perturbCentroid(strength.value());
      }
    }
  }
}

d = (dot1,dot2) => ((dot1.x-dot2.x)*(dot1.x-dot2.x) + (dot1.y-dot2.y)*(dot1.y-dot2.y));


//d(Tg-T)/dt = -(Tg-T)
//D = (1 - 1/FR) + sq(3T/m)/FR*c
