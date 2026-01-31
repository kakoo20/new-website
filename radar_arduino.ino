#include <Servo.h>

Servo myServo;

const int trigPin = 7;
const int echoPin = 6;
const int buzzerPin = 8;
const int red1 = 12, red2 = 11, green1 = 5, green2 = 4;

const int sweepDuration = 2100;
const int edgePause = 200;      
unsigned long lastLoopTime = 0; 
unsigned long activeElapsed = 0; 

bool movingCCW = true;
bool isPaused = false;
int virtualAngle = 0;

void setup() {
  myServo.attach(9);
  pinMode(trigPin, OUTPUT); 
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(red1, OUTPUT); 
  pinMode(red2, OUTPUT);
  pinMode(green1, OUTPUT); 
  pinMode(green2, OUTPUT);
  
  Serial.begin(9600);
  lastLoopTime = millis();
}

void loop() {
  
  unsigned long currentMillis = millis();
  unsigned long deltaTime = currentMillis - lastLoopTime;
  lastLoopTime = currentMillis;

  
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); 
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;

  
  if (distance > 0 && distance < 30) {
    
    myServo.write(90); 
    digitalWrite(green1, LOW); 
    digitalWrite(green2, LOW);
    digitalWrite(red1, HIGH); 
    digitalWrite(red2, HIGH);
    tone(buzzerPin, 1000);
    
  } 
  else {
   
    noTone(buzzerPin);
    digitalWrite(red1, LOW); 
    digitalWrite(red2, LOW);
    digitalWrite(green1, HIGH); 
    digitalWrite(green2, HIGH);

    activeElapsed += deltaTime; 

    if (!isPaused) {
      if (activeElapsed >= sweepDuration) {
        isPaused = true;
        activeElapsed = 0; 
      } else {
        if (movingCCW) {
          myServo.write(100); 
          virtualAngle = map(activeElapsed, 0, sweepDuration, 0, 180);
        } else {
          myServo.write(83);  
          virtualAngle = map(activeElapsed, 0, sweepDuration, 180, 0);
        }
      }
    } else {
      myServo.write(90); 
      if (activeElapsed >= edgePause) {
        isPaused = false;
        movingCCW = !movingCCW; 
        activeElapsed = 0; 
      }
    }
  }

  
  sendData(virtualAngle, distance);
  
  delay(20);

void sendData(int angle, int dist) {
  Serial.print(angle);
  Serial.print(",");
  Serial.print(dist);
  Serial.print("."); 
}