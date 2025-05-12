const fs = require("fs");
const https = require("https");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const path = require("path");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");
require("dotenv").config();

const httpsOptions = require("../config/httpsOptions");
const dbConnect = require("../config/db");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");

const app = express();

// Sécurité HTTP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Limiter les ressources aux mêmes origines
      scriptSrc: [
        "'self'",
        "https://www.google.com", // Autoriser Google pour les scripts
        "https://www.gstatic.com", // Autoriser les scripts reCAPTCHA
      ],
      frameSrc: [
        "https://www.google.com", // Autoriser les iframes de Google (nécessaire pour reCAPTCHA)
        "https://www.gstatic.com", // Autoriser également les iframes de gstatic
      ],
      connectSrc: [
        "'self'", // Autoriser la connexion à la même origine
        "https://www.google.com", // Autoriser les connexions vers Google pour reCAPTCHA
      ],
      objectSrc: ["'none'"], // Empêcher les objets
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // Autoriser les styles externes
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Autoriser les fontes externes
    },
  })
);

// Logger
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(
      path.join(__dirname, "../../logs/access.log"),
      { flags: "a" }
    ),
  })
);

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve les fichiers statiques depuis le dossier public
// Serve les fichiers statiques depuis le dossier frontend/public
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Sessions sécurisées
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    },
  })
);

// Routes API
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);

// Connexion à la base de données
dbConnect();

// Serveur HTTPS
https.createServer(httpsOptions, app).listen(3000, () => {
  console.log("Serveur HTTPS démarré sur https://localhost:3000");
});
