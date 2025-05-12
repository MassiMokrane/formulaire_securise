module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    // L'utilisateur est connecté
    next();
  } else {
    // L'utilisateur n'est pas connecté
    res.status(401).send("Accès refusé : veuillez vous connecter.");
  }
};
