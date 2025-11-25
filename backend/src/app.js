const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();

// Configuration de la limitation de débit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer dans 15 minutes.'
  }
});

// Middleware de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers uploadés statiquement
app.use('/uploads', express.static('/app/uploads'));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Vérification de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'OK', 
    message: 'API WebReader fonctionne correctement!',
    timestamp: new Date().toISOString(),
    environnement: process.env.NODE_ENV
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API WebReader',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Gestionnaire 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route non trouvée',
    path: req.originalUrl 
  });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  
  // Erreur Multer
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      success: false,
      error: 'Fichier trop volumineux.' 
    });
  }
  
  // Erreur JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false,
      error: 'Token d\'authentification invalide.' 
    });
  }
  
  // Erreur de validation
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }

  // Erreur serveur par défaut
  res.status(500).json({ 
    success: false,
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  });
});

module.exports = app;