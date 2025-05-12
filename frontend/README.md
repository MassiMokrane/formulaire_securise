# 🔐 Formulaire Sécurisé – Application Web avec chiffrement, reCAPTCHA, sessions & HTTPS

## 📖 Présentation

Cette application web full-stack permet à des utilisateurs d’envoyer des messages via un **formulaire sécurisé**. L’objectif principal est de mettre en œuvre des **mécanismes de sécurité avancés** (chiffrement AES, reCAPTCHA, CSP, HTTPS, etc.) dans une architecture claire et modulaire en **Node.js / MongoDB** pour le backend et du **HTML/CSS/JS natif** côté frontend.

## 🏗️ Architecture générale

```
formulaire_securise/
│
├── backend/             → Partie serveur (Node.js, Express, MongoDB, crypto, sécurité)
│   ├── certs/           → Certificats SSL pour HTTPS
│   ├── config/          → Fichiers de configuration (BD, HTTPS)
│   ├── logs/            → Fichiers de journalisation
│   ├── src/
│   │   ├── controllers/ → Logique métier des routes
│   │   ├── middleware/  → Middlewares personnalisés (auth, reCAPTCHA)
│   │   ├── models/      → Schémas Mongoose (MongoDB)
│   │   └── routes/      → Définition des routes API
│   ├── server.js        → Point d’entrée principal du backend (serveur HTTPS)
│   └── .env             → Variables d’environnement
│
├── frontend/            → Partie cliente statique
│   └── public/
│       ├── css/         → Styles CSS
│       ├── js/          → Scripts JS pour chaque page
│       ├── *.html       → Pages HTML (contact, inscription, etc.)
│
├── logs/                → Répertoire général des logs
└── README.md            → Document explicatif du projet
```

## 🧠 Ce que j’ai fait

- 🔐 **Sécurisé un formulaire HTML** par :

  - Chiffrement **AES-256** avec IV aléatoire &bcrypt
  - **Google reCAPTCHA v2** pour limiter les bots
  - **Sessions sécurisées** (`httpOnly`, `secure`, `sameSite`)
  - Mise en place d’un **HTTPS local** via certificats auto-signés
  - **Helmet + CSP stricte** pour renforcer la sécurité

- 🗂️ **Organisé le backend** en modules (routes, controllers, middlewares)
- 🧪 **Validé les champs** côté client & serveur
- 🧾 **Journalisé les messages** et les accès avec Morgan et fichier `contact.log`
- 🔄 **Créé un front dynamique** avec vanilla JS et interaction Fetch API
- 📁 **Conçu une structure propre et scalable** pour réutilisation et extension

## 🛠️ Technologies utilisées

| Côté Backend         | Côté Frontend       | Sécurité & DevOps          |
| -------------------- | ------------------- | -------------------------- |
| Node.js / Express    | HTML / CSS / JS     | HTTPS (certs auto-signés)  |
| MongoDB (Mongoose)   | SCSS (si utilisé)   | Helmet (CSP personnalisée) |
| Crypto (AES-256-CBC) | Google reCAPTCHA v2 | Morgan, dotenv, sessions   |
| express-session      |                     | Structure MVC              |

## 📁 Détail des dossiers/fichiers

### `backend/`

- **`certs/`** : `cert.pem`, `key.pem` pour HTTPS local
- **`config/`**
  - `db.js` : Connexion MongoDB
  - `httpsOptions.js` : Lecture des certificats
- **`logs/`**
  - `contact.log` : Enregistrement des messages envoyés
- **`src/controllers/`**
  - `authController.js` : Gestion des connexions
  - `contactController.js` : Traitement et chiffrement du formulaire de contact
- **`src/middleware/`**
  - `isAuthenticated.js` : Vérification de session utilisateur
  - `verifyCaptcha.js` : Vérification du token reCAPTCHA
- **`src/models/User.js`** : Schéma utilisateur pour inscription/connexion
- **`src/routes/`** : Définition des routes `/contact`, `/auth`, etc.
- **`server.js`** : Serveur principal en HTTPS avec tous les middlewares
- **`.env`** : Clés secrètes, Mongo URI, etc.

### `frontend/public/`

- **`js/`**
  - `connexion.js` : Gestion du formulaire de login
  - `contact.js` : Récupération, validation et envoi du formulaire contact
  - `inscription.js` : Gestion de l'inscription avec JS
- **`html/`**
  - `index.html` : Page d’accueil (ou redirection)
  - `connexion.html` : Formulaire de login
  - `contact.html` : Formulaire de contact avec reCAPTCHA
  - `inscription.html` : Formulaire d'inscription
- **`css/`** : Feuilles de style (si présentes)

## 🔐 Sécurité implémentée

| Type                | Détail technique                                   |
| ------------------- | -------------------------------------------------- |
| Chiffrement         | AES-256-CBC, IV généré dynamiquement, `crypto`     |
| Sessions sécurisées | express-session avec cookies sécurisés et httpOnly |
| HTTPS               | Certificats SSL (dev/local)                        |
| Anti-bot            | Google reCAPTCHA v2 avec vérification serveur      |
| XSS/Injection       | Helmet, CSP stricte, validation des entrées        |
| Logs                | Morgan + fichier `contact.log` pour les messages   |

## ▶️ Démarrer le projet en local

1. **Cloner le repo**

   ```bash
   git clone https://github.com/ton-utilisateur/formulaire_securise.git
   cd formulaire_securise
   ```

2. **Configurer l’environnement**
   Crée un fichier `.env` dans `/backend/` :

   ```env
   SESSION_SECRET=ton_secret
   MONGO_URI=mongodb://localhost:27017/formulaireDB
   CRYPTO_SECRET=une_cle_32_caracteres_pour_AES
   ```

3. **Générer les certificats (si manquants)**

   ```bash
   cd backend/certs
   openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
   ```

4. **Installer les dépendances**

   ```bash
   npm install
   ```

5. **Lancer le serveur**

   ```bash
   node backend/server.js
   ```

6. **Accéder à l'app**
   Ouvre [https://localhost:3000](https://localhost:3000) et accepte le certificat

## 🚀 Déploiement (idées)

- 🔒 Obtenir un vrai certificat (via Let’s Encrypt)
- ☁️ Héberger MongoDB sur Atlas
- 🛡️ Utiliser un reverse proxy (Nginx) pour gérer le HTTPS + redirection

## 🧠 Auteur

**👨‍💻 Mokrane Rabah**  
Étudiant en informatique, passionné par l'**informatique **, le **développement Full-stack** et les **architectures sécurisées**.
