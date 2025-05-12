document.addEventListener("DOMContentLoaded", async function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Afficher un message de chargement
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalBtnText = submitBtn ? submitBtn.textContent : "Envoyer";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Envoi en cours...";
      }

      try {
        // Vérifier si reCAPTCHA est chargé
        if (typeof grecaptcha === "undefined") {
          throw new Error("reCAPTCHA n'est pas chargé");
        }

        // Récupérer le token reCAPTCHA
        const token = grecaptcha.getResponse();
        if (!token) {
          alert("Veuillez compléter le reCAPTCHA.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
          return;
        }

        const data = {
          name: contactForm.elements.name.value,
          email: contactForm.elements.email.value,
          message: contactForm.elements.message.value,
          recaptchaToken: token,
        };

        console.log("Envoi des données:", data);

        // Définir un timeout pour la requête
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout

        const res = await fetch("/contact/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: controller.signal,
          credentials: "include", // ⬅️ AJOUTER ceci pour transmettre la session
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          alert("Message envoyé avec succès !");
          contactForm.reset();
          grecaptcha.reset();
        } else {
          const msg = await res.text();
          throw new Error(msg || "Erreur lors de l'envoi du message");
        }
      } catch (error) {
        console.error("Erreur:", error);

        if (error.name === "AbortError") {
          alert("La requête a expiré. Veuillez réessayer.");
        } else {
          alert("Erreur : " + (error.message || "Une erreur est survenue"));
        }
      } finally {
        // Rétablir le bouton
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  } else {
    console.error("Le formulaire de contact n'a pas été trouvé");
  }
});
