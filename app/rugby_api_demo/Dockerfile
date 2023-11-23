# Utilisation du runtime Node.js officiel comme image de base (Docker Registry)
FROM node:lts-alpine3.10

# Définir le répertoire de travail dans le conteneur (/app)
WORKDIR /app

# Copie package.json et package-lock.json dans le répertoire de travail (/app)
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copier le reste du code de l'application dans le répertoire de travail
COPY . .

# Expose l'application sur le port 3000
EXPOSE 3000

# lance l'application
CMD [ "node", "index.js" ]