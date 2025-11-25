# Utiliser une version Node compatible avec Vite 5+
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package pour profiter du cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Utiliser un host accessible depuis l'extérieur du conteneur pour le dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]