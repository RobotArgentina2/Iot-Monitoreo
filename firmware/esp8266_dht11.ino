// Agente 1: Adquisición de Datos
// Envía datos al Backend Node.js

// --- CONFIGURACIÓN ---
const char* ssid     = "TU_SSID_WIFI";
const char* password = "TU_PASSWORD_WIFI";

// Dirección IP de tu Raspberry Pi (Puerto 3001 para Node.js)
const char* serverUrl = "http://DIRECCION_IP_RASPBERRY:3001/api/save-data";

#define DHTPIN D2          // Pin donde está conectado el DHT11
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastTime = 0;
const unsigned long timerDelay = 30000; // 30 segundos

void setup() {
  Serial.begin(115200);
  
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado con éxito");
  Serial.print("IP del ESP8266: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Enviar datos cada 30 segundos
  if ((millis() - lastTime) > timerDelay) {
    if (WiFi.status() == WL_CONNECTED) {
      
      float h = dht.readHumidity();
      float t = dht.readTemperature();

      // Verificar si las lecturas son válidas
      if (isnan(h) || isnan(t)) {
        Serial.println("Fallo al leer del sensor DHT");
        return;
      }

      Serial.print("Temperatura: "); Serial.print(t);
      Serial.print("°C | Humedad: "); Serial.print(h); Serial.println("%");

      WiFiClient client;
      HTTPClient http;

      // Iniciar conexión HTTP
      http.begin(client, serverUrl);
      
      // Especificar contenido de tipo formulario (POST)
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      
      // Preparar los datos a enviar
      String httpRequestData = "temperature=" + String(t) + "&humidity=" + String(h);
      
      // Enviar petición POST
      int httpResponseCode = http.POST(httpRequestData);
      
      if (httpResponseCode > 0) {
        Serial.print("Respuesta del servidor: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      } else {
        Serial.print("Error en envío: ");
        Serial.println(httpResponseCode);
      }
      
      http.end();
    } else {
      Serial.println("WiFi Desconectado");
    }
    lastTime = millis();
  }
}
