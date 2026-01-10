import processing.serial.*;

Serial myPort;
String data = "";
int angle, distance;
float pixDist;

void setup() {
  size(1200, 700); 
  smooth();
  // IMPORTANT: Ensure COM port matches your Arduino IDE
  myPort = new Serial(this, "COM4", 9600); 
  myPort.bufferUntil('.'); 
  background(0);
}

void draw() {
  fill(0, 15); // Trail effect
  noStroke();
  rect(0, 0, width, height);
  
  drawRadar();
  drawLine();
  drawObject();
  drawText(); // Added labels
}

void serialEvent(Serial myPort) {
  data = myPort.readStringUntil('.');
  if (data != null) {
    data = data.substring(0, data.length()-1);
    String[] list = split(data, ',');
    if (list.length == 2) {
      int rawAngle = int(list[0]);
      distance = int(list[1]);
      
      // FLIP LOGIC: 
      // If 0 shows as 180 and 180 shows as 0, this line fixes it:
      angle = 180 - rawAngle; 
    }
  }
}

void drawRadar() {
  pushMatrix();
  translate(width/2, height - height/10); 
  noFill();
  strokeWeight(2);
  stroke(98, 245, 31);
  
  // Distance Circles
  arc(0, 0, (width-width/6), (width-width/6), PI, TWO_PI);
  arc(0, 0, (width-width/3), (width-width/3), PI, TWO_PI);
  arc(0, 0, (width-width/1.5), (width-width/1.5), PI, TWO_PI);
  
  line(-width/2, 0, width/2, 0);
  popMatrix();
}

void drawText() {
  pushMatrix();
  translate(width/2, height - height/10);
  fill(98, 245, 31);
  textSize(18);
  text("5cm", width/10, 0);
  text("10cm", width/5, 0);
  text("15cm", width/3.5, 0);
  text("20cm", width/2.5, 0);
  
  fill(255);
  text("Angle: " + angle + "°", -width/2 + 50, 50);
  text("Distance: " + (distance < 40 ? distance + " cm" : "Out of Range"), width/2 - 200, 50);
  popMatrix();
}

void drawLine() {
  pushMatrix();
  strokeWeight(9);
  stroke(30, 250, 60); 
  translate(width/2, height - height/10);
  line(0, 0, (height-height/10)*cos(radians(angle+180)), (height-height/10)*sin(radians(angle+180)));
  popMatrix();
}

void drawObject() {
  pushMatrix();
  translate(width/2, height - height/10);
  strokeWeight(10);
  stroke(255, 10, 10); 
  pixDist = distance * ((height-height/10)*0.035); // Adjusted scale
  
  if (distance < 25 && distance > 0) {
    line(pixDist*cos(radians(angle+180)), pixDist*sin(radians(angle+180)), 
         (height-height/10)*cos(radians(angle+180)), (height-height/10)*sin(radians(angle+180)));
  }
  popMatrix();
}
