const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connecté à MongoDB"))
    .catch((err) => console.error("Erreur MongoDB :", err));
};
