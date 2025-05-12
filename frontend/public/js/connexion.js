document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // ⬅️ AJOUTER ceci pour stocker le cookie de session
  });

  if (res.ok) {
    alert("Connexion réussie !");
    window.location.href = "contact.html";
  } else {
    const msg = await res.text();
    alert("Erreur : " + msg);
  }
});
