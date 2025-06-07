// server.js
const app = require('./src/app');
const { PORT } = require('./src/config/env');

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🔍 Test: http://localhost:${PORT}/api/health`);
});

module.exports = app;