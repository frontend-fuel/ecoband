#include <DHT.h>
#include <ESP8266WiFi.h>
#include "ThingSpeak.h"

// Pin Configurations
#define DHTPIN 4              // GPIO4 (D2)
#define DHTTYPE DHT11
#define MQ135_PIN A0          // Analog pin for MQ135
#define BUZZER_PIN 14         // GPIO14 (D5)

const char* ssid = "Chinnu";
const char* password = "chinnu123";

// ThingSpeak Settings for Sensor Data
unsigned long mySensorChannelNumber = 2928017;  // Sensor data channel ID
const char* mySensorWriteAPIKey = "FOWHMD27MS329S9Z";  // Sensor Write API Key
const char* mySensorReadAPIKey = "4VPCWH5REJ3RN21T";  // Sensor Read API Key

// ThingSpeak Settings for Buzzer Control
unsigned long myBuzzerChannelNumber = 2931414;  // Buzzer control channel ID (new)
const char* myBuzzerWriteAPIKey = "REXGXHUD3G0CWGVX";  // Buzzer Write API Key
const char* myBuzzerReadAPIKey = "RZ9GNS62NC5PA9JT";  // Buzzer Read API Key

WiFiClient client;
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);  // Ensure buzzer is off initially
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  
  ThingSpeak.begin(client);  // Initialize ThingSpeak
}

void loop() {
  // Read sensors
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int airQualityRaw = analogRead(MQ135_PIN);

  // Display values
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("❌ Failed to read from DHT sensor!");
  } else {
    Serial.print("🌡 Temp: ");
    Serial.print(temperature);
    Serial.print(" °C\t💧 Humidity: ");
    Serial.print(humidity);
    Serial.print(" %\t");
  }

  Serial.print("🧪 Air Quality: ");
  Serial.println(airQualityRaw);

  // Send data to ThingSpeak (Sensor Data Channel)
  ThingSpeak.setField(1, airQualityRaw);
  ThingSpeak.setField(2, temperature);
  ThingSpeak.setField(3, humidity);
  int writeResult = ThingSpeak.writeFields(mySensorChannelNumber, mySensorWriteAPIKey);
  if (writeResult == 200) {
    Serial.println("✅ Data sent to Sensor Channel on ThingSpeak.");
  } else {
    Serial.print("❌ Error sending data to Sensor Channel: ");
    Serial.println(writeResult);
  }

  // Read buzzer control from Field 1 of the Buzzer Channel
  int buzzerCommand = ThingSpeak.readLongField(myBuzzerChannelNumber, 1, myBuzzerReadAPIKey); // Reading from Field 1
  Serial.print("🔄 Buzzer Command (Field 1): ");
  Serial.println(buzzerCommand);

  // Control buzzer
  if (buzzerCommand == 1) {
    digitalWrite(BUZZER_PIN, HIGH);
    Serial.println("🚨 Buzzer ON");
  } else if (buzzerCommand == 0) {
    digitalWrite(BUZZER_PIN, LOW);
    Serial.println("✅ Buzzer OFF");
  } else {
    Serial.println("⚠️ Invalid buzzer command.");
  }

  delay(5000);  // Wait before next update
}
