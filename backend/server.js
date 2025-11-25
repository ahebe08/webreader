require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/sequelize');
const { sequelize } = require('./src/config/sequelize');

// Charger les associations
require('./src/models/associations');

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB()
  .then(async () => {
    // Synchroniser les modèles avec la base
    await sequelize.sync({ alter: true }); // ← AJOUT
    console.log('✅ Database models synchronized');
    
    app.listen(PORT, () => {
      console.log(`Serveur demarre sur le PORT ${PORT}`);
      console.log(`APIs WebReader prêtes !`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Utilise Sequelize ORM`);
    });
  })
  .catch((error) => {
    console.error('Echec au démarrage du serveur:', error);
    process.exit(1);
  });