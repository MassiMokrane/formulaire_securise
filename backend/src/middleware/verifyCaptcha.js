const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = async (req, res, next) => {
  const token = req.body.recaptchaToken;

  // Vérifier si le token existe
  if (!token) {
    return res.status(400).send("Token reCAPTCHA manquant");
  }

  const secret = process.env.RECAPTCHA_SECRET;

  // Vérifier si la clé secrète existe
  if (!secret) {
    console.error(
      "Erreur: RECAPTCHA_SECRET n'est pas défini dans les variables d'environnement"
    );
    return res.status(500).send("Erreur de configuration du serveur");
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${token}`,
      }
    );

    const data = await response.json();
    console.log("Réponse reCAPTCHA:", data);

    if (!data.success) {
      return res.status(400).send("Captcha invalide");
    }

    next();
  } catch (err) {
    console.error("Erreur lors de la vérification du captcha:", err);
    res.status(500).send("Erreur lors de la vérification du captcha");
  }
};
