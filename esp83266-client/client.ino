#include <IRremoteESP8266.h>
#include <IRremoteInt.h>

#define DEBUG = 1

#define MESSAGE_IDENTIFY 0x01
#define MESSAGE_ECHO 0x02
#define MESSAGE_EMIT 0x03

#include <ESP8266WiFi.h>
#include <WiFiClient.h>

const char* ssid = "";
const char* password = "";

//int khz = 38; 
//unsigned int  rawData[100] = 

IRsend irsend(2); //an IR emitter led is connected to GPIO pin 2

//const char* host = "192.168.2.107";
const char* host = "192.168.2.254";
const int port = 10240;
const char uuid[16] = { 0x11, 0x0e, 0x84, 0x00, 0xe2, 0x9b, 0x11, 0xd4, 0xa7, 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00 };
WiFiClient client;


void sendRaw(int freq, unsigned int data[]) {
  
}


void setup() {
  irsend.begin();
  Serial.begin(9600);
  
 WiFi.begin(ssid, password);
    // Wait for connection
    Serial.print("try to connect to : ");
    Serial.println(ssid);

}

int get_freq() {
  return net_readInt();
}

int get_message_length() {
  return net_readInt();
}

void decode_incoming_data() {

      if(client.available()) {
        char packet_type = client.read();
        Serial.print(packet_type, HEX);
        if(packet_type == MESSAGE_EMIT) {
          int freq = get_freq();
          int length = get_message_length();
          #ifdef DEBUG
            Serial.println("receiving command");
            Serial.println(freq);
            Serial.println(length);
          #endif
          unsigned int rawData[length];
          for( int i = 0; i < length; i++) {
            int c = net_readInt();
            #ifdef DEBUG
              Serial.print(c, DEC);
              Serial.print(", ");
            #endif
            rawData[i] = (unsigned int) c;
          }
          irsend.sendRaw(rawData, length, freq); 
      }
     }

}
int connect_to_server()
{
    if (!client.connect(host, port)) {
    #ifdef DEBUG
    Serial.println("connection failed");
    delay(5000);
    #endif
  } else {
           #ifdef DEBUG
    Serial.println("connected to gladys");
    delay(500);
    #endif 
  }

}


int connect_to_Wifi()
{
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
#ifdef DEBUG
    Serial.print(".");
#endif
  }
  #ifdef DEBUG
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Connected to WIFI");
#endif

}

void loop() {
  if(WiFi.status() != WL_CONNECTED) {
    connect_to_Wifi();
  }
    if (!client.connected()) {
        connect_to_server();
  }
 
  if(client.connected())
  {
    decode_incoming_data();
  }
   
  
}


void send_idetification_frame() {
    client.write(MESSAGE_IDENTIFY);
    client.write(uuid, 16);
}


int net_readInt()
{
 
  int num = 
    (int) client.read() << 24 |
    (int) client.read() << 16 |
    (int) client.read() << 8  |
    (int) client.read();

  return num;
}

