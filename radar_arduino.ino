#include <Servo.h>

Servo myServo;

// Pin Definitions
const int trigPin = 7;
const int echoPin = 6;
const int buzzerPin = 8;
const int red1 = 12, red2 = 11, green1 = 5, green2 = 4;

// Timing Constants
const int sweepDuration = 2100; // Time to move 180 degrees
const int edgePause = 200;      // Time to stay still at the ends
unsigned long lastLoopTime = 0; 
unsigned long activeElapsed = 0; // The "frozen" timer

// State Variables
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
  // 1. Calculate the "Time Slice"
  unsigned long currentMillis = millis();
  unsigned long deltaTime = currentMillis - lastLoopTime;
  lastLoopTime = currentMillis;

  // 2. Measure Distance
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); 
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;

  // 3. Logic Branching
  if (distance > 0 && distance < 30) {
    // --- ALARM MODE (Object Detected) ---
    myServo.write(90); // Stop moving
    digitalWrite(green1, LOW); 
    digitalWrite(green2, LOW);
    digitalWrite(red1, HIGH); 
    digitalWrite(red2, HIGH);
    tone(buzzerPin, 1000);
    
    // Notice: activeElapsed is NOT updated here. 
    // The radar "memory" stays exactly where it was.
  } 
  else {
    // --- SCANNING MODE (Path Clear) ---
    noTone(buzzerPin);
    digitalWrite(red1, LOW); 
    digitalWrite(red2, LOW);
    digitalWrite(green1, HIGH); 
    digitalWrite(green2, HIGH);

    // Update the movement timer only when scanning
    activeElapsed += deltaTime; 

    if (!isPaused) {
      // Logic for Sweeping
      if (activeElapsed >= sweepDuration) {
        isPaused = true;
        activeElapsed = 0; 
      } else {
        if (movingCCW) {
          myServo.write(100); // Your specific CCW speed
          virtualAngle = map(activeElapsed, 0, sweepDuration, 0, 180);
        } else {
          myServo.write(83);  // Your specific CW speed
          virtualAngle = map(activeElapsed, 0, sweepDuration, 180, 0);
        }
      }
    } else {
      // Logic for the Edge Pause
      myServo.write(90); 
      if (activeElapsed >= edgePause) {
        isPaused = false;
        movingCCW = !movingCCW; 
        activeElapsed = 0; 
      }
    }
  }

  // 4. Send Data to Processing
  sendData(virtualAngle, distance);
  
  delay(20); // Small delay for stability
}

void sendData(int angle, int dist) {
  Serial.print(angle);
  Serial.print(",");
  Serial.print(dist);
  Serial.print("."); 
}