const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos del frontend
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));

const reactBuildPath = path.join(__dirname, '..', 'frontend-react', 'dist');
app.use(express.static(reactBuildPath));

// Configuración de base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iot_monitor'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Agente 2 conectado a MySQL');
});

// --- RUTA AGENTE 1 (Hardware -> Backend) ---
app.post('/api/save-data', (req, res) => {
    const { temperature, humidity } = req.body;

    if (!temperature || !humidity) {
        return res.status(400).json({ error: 'Faltan datos de temperatura o humedad' });
    }

    const query = 'INSERT INTO readings (temperature, humidity) VALUES (?, ?)';
    db.query(query, [temperature, humidity], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al guardar los datos' });
        }
        res.status(201).json({ message: 'Lectura guardada correctamente', id: result.insertId });
    });
});

// --- RUTA AGENTE 3 (Backend -> Dashboard) ---
app.get('/api/get-readings', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const query = 'SELECT * FROM readings ORDER BY recorded_at DESC LIMIT ?';

    db.query(query, [limit], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener los datos' });
        }
        res.json(results.reverse());
    });
});

// Ruta para servir el index de React para cualquier otra ruta (SPA)
app.get('*', (req, res) => {
    const indexPath = path.join(reactBuildPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            if (req.path.startsWith('/api')) {
                res.status(404).json({ error: 'Endpoint no encontrado' });
            } else {
                res.status(404).send('Not Found');
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Backend Agente 2 ejecutándose en http://localhost:${port}`);
});
