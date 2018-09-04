var pts = [];
var k = 6;
var cent = [];
var img; //placeholder variable to store map in

function dot (r,g,b){
  this.r=r;
  this.g=g;
  this.b=b;
  this.centIndex=null

  this.closestCentroid = function(centroids){
    var s = Infinity;
    for (var i=0; i<centroids.length; i++){
      if (s>d(this,centroids[i])){
        s=d(this,centroids[i]);
        this.centIndex=i;
      }
    }
  }
  this.recenter = function(points){
    var _r=0,_g=0,_b=0,num=0;
    for (var i=0; i<points.length; i++){
      if (points[i].centIndex==this.centIndex){
        _r += points[i].r;
        _g += points[i].g;
        _b += points[i].b;
        num++;
      }
    }
    this.r = (_r/num);
    this.g = (_g/num);
    this.b = (_b/num);
  }
  this.perturbCentroid = function(e){
    this.r += 2*e*Math.random()-e;
    this.g += 2*e*Math.random()-e;
    this.b += 2*e*Math.random()-e;
  }
}

function preload(){ //preloading the image in p5.js context
  img = loadImage("plant.JPG");
}

function setup() { //setting up canvas for p5.js to work on
  createCanvas(img.width, img.height); //canvas dimensions
  image(img,0,0,img.width, img.height);
  var d = pixelDensity();
  loadPixels();
  for (var i = 0; i < 4*(width*d)*(height*d); i+=4){
    pts.push(new dot(pixels[i],pixels[i+1],pixels[i+2]));
  }
  for (var i = 0; i < k; i++){
    cent.push(new dot(floor(random(255)),floor(random(255)),floor(random(255))));
    cent[i].centIndex=i;
  }
  strength = createSlider(0, 100, 0);
  strength.position(10, img.height+5);
  createP('Slider adjusts perturbation strength of '+k+" centroids").position(10, img.height+10);
  updatePixels();
  background(0);
}

function draw() { //p5.js draw function. This is called once per frame
  //image(img,0,0,img.width/2, img.height/2);
   for(var i=0; i<pts.length; i++){
     if (frameCount%2==1){
         pts[i].closestCentroid(cent);
     }
   }

   for (var i=0; i<k; i++){
     if (frameCount>20){
       if (frameCount%2==0){
         cent[i].recenter(pts);
         if(isNaN(cent[i].r) || cent[i].r<0 || cent[i].r>255){
           cent[i].r = random(255);
         }
         if(isNaN(cent[i].g) || cent[i].g<0 || cent[i].g>255){
           cent[i].g = random(255);
         }
         if(isNaN(cent[i].b) || cent[i].b<0 || cent[i].b>255){
           cent[i].b = random(255);
         }

       }
       if (frameCount%50==0 && frameCount<1000){
         cent[i].perturbCentroid(strength.value());
       }
     }
   }
   loadPixels();
   for(var i=0; i<pts.length; i++){
     pixels[4*i]=cent[pts[i].centIndex].r;
     pixels[4*i+1]=cent[pts[i].centIndex].g;
     pixels[4*i+2]=cent[pts[i].centIndex].b;
   }
   updatePixels();


}

d = (dot1,dot2) => ((dot1.r-dot2.r)*(dot1.r-dot2.r) + (dot1.g-dot2.g)*(dot1.g-dot2.g) + (dot1.g-dot2.b)*(dot1.g-dot2.b));
