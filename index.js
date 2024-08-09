require('dotenv').config();

const express = require('express');
const cors = require('cors');

const myApp = require('./myApp.js');

// Crear una instancia de la aplicación Express
const app = express();

const port = process.env.PORT || 3000; // Definir el puerto en el que el servidor escuchará

// Middleware para permitir solicitudes CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware para analizar cuerpos de solicitud en formato JSON
app.use(express.json());

// Middleware para analizar cuerpos de solicitud en formato 'application/x-www-form-urlencoded' - 'extended: true' permite estructuras de datos complejas
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use('/public', express.static(`${process.cwd()}/public`));

// Ruta para servir el archivo HTML principal
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Primer endpoint de la API para pruebas
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:short', myApp.buscarUrl)
app.post('/api/shorturl', myApp.agregarUrl)

// Iniciar el servidor y escuchar en el puerto configurado
app.listen(port, function() {
  console.log(`Listening on port ${port}`); // Mostrar un mensaje en la consola indicando que el servidor está en funcionamiento
});
