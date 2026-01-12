#include 

Servo myServo;
const int PIN_SERVO = 9;
const int SPEED_CCW = 100;  
const int SPEED_CW  = 83;   
const int STOP_VAL  = 90;   
const int TIME_TURN = 2100; 
const int TIME_WAIT = 1000; 

void setup() {
  myServo.attach(PIN_SERVO);
  Serial.begin(9600);
  
  myServo.write(STOP_VAL); 
  delay(2000); 
  Serial.println("System Ready. Starting Loop...");
}

void loop() {
  
  Serial.println("Moving CCW...");
  myServo.write(SPEED_CCW);
  delay(TIME_TURN);
  
  
  myServo.write(STOP_VAL);
  delay(TIME_WAIT);

  
  Serial.println("Moving CW...");
  myServo.write(SPEED_CW);
  delay(TIME_TURN);
  
  
  myServo.write(STOP_VAL);
  delay(TIME_WAIT);
}
