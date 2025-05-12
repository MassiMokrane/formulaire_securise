const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).send("Utilisateur enregistré");
  } catch (err) {
    res.status(400).send("Erreur à l'inscription : " + err.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Utilisateur inconnu");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Mot de passe incorrect");

    req.session.userId = user._id;
    res.send("Connexion réussie");
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};
