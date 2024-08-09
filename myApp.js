require('dotenv').config({ path: 'sample.env' });
const mongoose = require('mongoose');

// Conectar a la base de datos de MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Definir el esquema para el modelo 'Url'
const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  short: {
    type: String,
    unique: true,
    required: true
  }
});

// Crear el modelo 'Url' basado en el esquema definido
let Url = mongoose.model('Url', UrlSchema);

// Función para agregar una URL corta
const agregarUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Generar un código corto (puedes usar un método más avanzado en producción)
  const short = Math.random().toString(36).substring(2, 8);

  try {
    // Crear una nueva entrada en la base de datos
    const newUrl = new Url({ url, short });
    const savedUrl = await newUrl.save(); // Usa await para esperar a que se guarde

    // Responder con la URL original y la URL corta
    res.json({ original_url: savedUrl.url, short_url: savedUrl.short });
  } catch (err) {
    // Manejar errores si ocurre un problema al guardar
    res.status(500).json({ error: 'Failed to save URL' });
  }
};

const buscarUrl = async (req, res) => {
    const { short } = req.params;
  
    try {
      const url = await Url.findOne({ short });
      if (url) {
        res.redirect(url.url);
      } else {
        res.status(404).json({ error: 'URL not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to find URL' });
    }
  };
  
  module.exports = { agregarUrl, buscarUrl };