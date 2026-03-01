# SISTEMA DE MONITOREO IOT (NODE.JS)

**Proyecto:** Monitoreo de Temperatura y Humedad con ESP8266, DHT11 y Backend en Node.js.

---

## 1. Arquitectura del Sistema
El sistema ha sido migrado a una arquitectura basada íntegramente en **Node.js**, eliminando la dependencia de Apache y PHP. Consta de:

1.  **Hardware (ESP8266 + DHT11):** Adquisición de datos cada 30 segundos y envío vía HTTP POST.
2.  **Base de Datos (MySQL/MariaDB):** Almacenamiento persistente de las lecturas.
3.  **Backend (Node.js + Express):** 
    - Actúa como API para recibir y entregar datos.
    - Sirve los archivos estáticos de los frontends (Legacy y React).
4.  **Frontend Legacy (HTML/CSS/JS):** Dashboard clásico utilizando Chart.js.
5.  **Frontend Moderno (React + Tailwind + Recharts):** Dashboard premium con visualización avanzada.

---

## 2. Base de Datos (SQL)
### Archivo de Configuración: `database/db_setup.sql`
```sql
CREATE DATABASE IF NOT EXISTS iot_monitor;
USE iot_monitor;

CREATE TABLE IF NOT EXISTS readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Servidor Backend (Node.js)
El servidor centraliza toda la lógica de la aplicación.

### Características Principales:
- **Puerto por defecto:** 3001
- **Ruta API (Guardar):** `POST /api/save-data` (Recibe `temperature` y `humidity`).
- **Ruta API (Obtener):** `GET /api/get-readings?limit=X` (Entrega las últimas X lecturas en orden cronológico).
- **Servicio de Archivos:** 
    - Dashboard Legacy: Disponible en `/frontend/index.html`.
    - Dashboard React: Disponible en la raíz `/` (sirve la carpeta `dist` de React).

### Instalación de Dependencias:
```bash
cd backend-node
npm install
```

---

## 4. Dashboards (Frontends)

### Dashboard Legacy (HTML/JS)
- **Ubicación:** `frontend/`
- **Lógica:** Se comunica con el backend mediante `fetch('/api/get-readings')`.
- **Estilo:** Diseño oscuro con efecto glassmorphism.

### Dashboard Moderno (React)
- **Ubicación:** `frontend-react/`
- **Tecnologías:** React, Vite, Tailwind CSS, Lucide icons, Framer Motion y Recharts.
- **Acceso:** Se accede directamente desde la URL raíz del servidor Node.js.

---

## 5. Firmware (ESP8266)
### Ubicación: `firmware/esp8266_dht11.ino`
El código del microcontrolador debe configurarse con la IP de la Raspberry Pi o el servidor donde corra Node.js, apuntando al puerto `3001`.

```cpp
const char* serverUrl = "http://IP_DEL_SERVIDOR:3001/api/save-data";
```

---

## 6. Instrucciones de Instalación y Uso

1.  **Preparar la Base de Datos:**
    - Asegúrate de tener MySQL/MariaDB instalado.
    - Ejecuta el script `database/db_setup.sql` para crear la tabla necesaria.
    
2.  **Configurar el Backend:**
    - Entra en la carpeta `backend-node`.
    - Ejecuta `npm install` para instalar las dependencias (express, mysql2, cors, dotenv).
    - Edita `server.js` para configurar tus credenciales de base de datos si es necesario.
    
3.  **Iniciar el Servidor:**
    - Ejecuta `node server.js` (o usa `pm2` para mantenerlo activo en producción).
    - El servidor te indicará: `Backend Agente 2 ejecutándose en http://localhost:3001`.

4.  **Cargar el Firmware:**
    - Abre el archivo `.ino` con el IDE de Arduino.
    - Configura tu WiFi y la IP de tu servidor.
    - Carga el código al ESP8266.

5.  **Visualizar los Datos:**
    - Abre tu navegador en `http://IP_DEL_SERVIDOR:3001` para ver el dashboard de React.
    - Alternativamente, usa `http://IP_DEL_SERVIDOR:3001/frontend/index.html` para la versión legacy.

---
*Documentación regenerada para el sistema unificado de monitoreo IoT.*
