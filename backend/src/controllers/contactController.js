const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

exports.sendMessage = (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Vérifier que les données requises sont présentes
    if (!name || !email || !message) {
      return res.status(400).send("Tous les champs sont obligatoires");
    }

    // Vérifier si la clé de chiffrement existe
    if (!process.env.CRYPTO_SECRET) {
      console.error(
        "Erreur: CRYPTO_SECRET n'est pas défini dans les variables d'environnement"
      );
      return res.status(500).send("Erreur de configuration du serveur");
    }

    // Obtenir un chemin absolu pour le répertoire de logs
    const logDir = path.resolve(process.cwd(), "logs");

    // Créer le répertoire logs s'il n'existe pas
    if (!fs.existsSync(logDir)) {
      try {
        fs.mkdirSync(logDir, { recursive: true });
        console.log(`Répertoire créé: ${logDir}`);
      } catch (dirErr) {
        console.error("Erreur lors de la création du répertoire:", dirErr);
        return res
          .status(500)
          .send("Erreur lors de la création du répertoire de logs");
      }
    }

    // Chiffrement AES-256
    const key = crypto.scryptSync(process.env.CRYPTO_SECRET, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(message, "utf8", "hex") + cipher.final("hex");

    const log = {
      name,
      email,
      message: encrypted,
      iv: iv.toString("hex"),
      date: new Date().toISOString(),
    };

    // Chemin complet vers le fichier de log
    const logFilePath = path.join(logDir, "contact.log");

    // Écrire dans le fichier de log
    fs.appendFile(logFilePath, JSON.stringify(log) + "\n", (err) => {
      if (err) {
        console.error("Erreur lors de l'écriture dans le fichier de log:", err);
        return res.status(500).send("Erreur de stockage");
      }
      console.log("Message enregistré avec succès");
      res.status(200).send("Message reçu");
    });
  } catch (error) {
    console.error("Erreur dans le contrôleur de contact:", error);
    res
      .status(500)
      .send("Une erreur est survenue lors du traitement de votre demande");
  }
};
exports.getMessages = (req, res) => {
  try {
    if (!process.env.CRYPTO_SECRET) {
      console.error("CRYPTO_SECRET non défini");
      return res.status(500).send("Erreur de configuration du serveur");
    }

    const logFilePath = path.resolve(process.cwd(), "logs/contact.log");

    if (!fs.existsSync(logFilePath)) {
      return res.status(200).json([]); // Aucun message
    }

    const data = fs.readFileSync(logFilePath, "utf8");
    const lines = data.trim().split("\n");

    const key = crypto.scryptSync(process.env.CRYPTO_SECRET, "salt", 32);
    const messages = lines.map((line) => {
      const log = JSON.parse(line);
      const iv = Buffer.from(log.iv, "hex");
      const encryptedText = log.message;

      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encryptedText, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return {
        name: log.name,
        email: log.email,
        message: decrypted,
        date: log.date,
      };
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Erreur lors de la lecture des messages:", err);
    res.status(500).send("Erreur lors de la lecture des messages");
  }
};
