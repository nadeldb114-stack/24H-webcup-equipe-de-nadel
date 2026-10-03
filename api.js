async function chargerDemandesWebcup() {
  try {
    const response = await fetch("/api/webcup");

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const data = await response.json();

    console.log("🌍 TERRA NOVA - API CONNECTÉE");
    console.log("Session :", data.session);
    console.log("Demandes disponibles :", data.requests);

    return data;

  } catch (error) {
    console.error("❌ Terra Nova - erreur API :", error);
  }
}

chargerDemandesWebcup();