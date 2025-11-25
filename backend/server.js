require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connexion à la base de données et démarrage du serveur
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📚 API WebReader est opérationnelle !`);
      console.log(`📍 Vérification de santé: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error('❌ Échec du démarrage du serveur:', error);
    process.exit(1);
  });