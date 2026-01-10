#include 
Servo myServo;

const int trigPin = 7;
const int echoPin = 6;
const int buzzerPin = 8;
const int red1 = 12, red2 = 11, green1 = 5, green2 = 4;

// NEW TIMING LOGIC
unsigned long activeElapsed = 0;   // This only grows when moving
unsigned long lastUpdate = 0;      // Tracks the last time the loop ran
const int sweepDuration = 2100; 
const int edgePause = 200; 

bool movingCCW = true;
bool isPaused = false;
int virtualAngle = 0;

void setup() {
  myServo.attach(9);
  pinMode(trigPin, OUTPUT); pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(red1, OUTPUT); pinMode(red2, OUTPUT);
  pinMode(green1, OUTPUT); pinMode(green2, OUTPUT);
  
  Serial.begin(9600);
  lastUpdate = millis(); // Initialize the tracker
}

void loop() {
  unsigned long currentTime = millis();
  unsigned long deltaTime = currentTime - lastUpdate; // How much time passed since last loop
  lastUpdate = currentTime;

  long duration;
  int distance;
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

  // 1. OBJECT DETECTED (Alarm Mode)
  if (distance > 0 && distance < 0) {
    myServo.write(90); 
    digitalWrite(green1, LOW); digitalWrite(green2, LOW);
    digitalWrite(red1, HIGH); digitalWrite(red2, HIGH);
    tone(buzzerPin, 1000);
    
    // We DO NOT add deltaTime to activeElapsed here. 
    // The "clock" stays frozen.
    sendData(virtualAngle, distance);
  } 
  // 2. SCANNING MODE (Moving)
  else {
    noTone(buzzerPin);
    digitalWrite(red1, LOW); digitalWrite(red2, LOW);
    digitalWrite(green1, HIGH); digitalWrite(green2, HIGH);

    activeElapsed += deltaTime; // The clock only moves when no object is detected

    if (!isPaused) {
      if (activeElapsed >= sweepDuration) {
        isPaused = true;
        activeElapsed = 0; // Reset for the pause phase
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
      // Logic for the 200ms Edge Pause
      myServo.write(90); 
      if (activeElapsed >= edgePause) {
        isPaused = false;
        movingCCW = !movingCCW; 
        activeElapsed = 0; // Reset for the next sweep trip
      }
    }
    sendData(virtualAngle, distance);
  }
  delay(20); 
}

void sendData(int angle, int dist) {
  Serial.print(angle);
  Serial.print(",");
  Serial.print(dist);
  Serial.print("."); 
}
