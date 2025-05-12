#!/bin/bash

echo "🛠️  Lancement du projet sécurisé..."

# Vérifie si .env existe
if [ ! -f .env ]; then
  echo "❌ Fichier .env manquant. Veuillez le créer avec vos variables d'environnement."
  exit 1
fi

# Démarre le serveur avec Node.js
echo "🚀 Démarrage du serveur HTTPS sécurisé..."
node src/server.js
