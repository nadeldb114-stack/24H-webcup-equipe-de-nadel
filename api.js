async function chargerDemandesWebcup() {
    try {
        const response = await fetch("/api/webcup");

        if (!response.ok) {
            throw new Error("Erreur API : " + response.status);
        }

        const data = await response.json();

        console.log("✅ TERRA NOVA - API CONNECTÉE");
        console.log("Session :", data.session);
        console.log("Demandes disponibles :", data.requests);

        // Rend les données accessibles au reste du site
        window.webcupData = data;
        window.webcupRequests = data.requests || [];

        return data;

    } catch (error) {
        console.error("❌ TERRA NOVA - ERREUR API :", error);
        return null;
    }
}

// Premier chargement
chargerDemandesWebcup();

// Actualisation automatique toutes les 30 secondes
setInterval(chargerDemandesWebcup, 30000);