-- Crear base de datos para el monitoreo IoT
CREATE DATABASE IF NOT EXISTS iot_monitor;
USE iot_monitor;

-- Tabla para almacenar las lecturas de temperatura y humedad
CREATE TABLE IF NOT EXISTS readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
