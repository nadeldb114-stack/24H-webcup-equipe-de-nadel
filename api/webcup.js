export default async function handler(req, res) {
  try {
    const apiKey = process.env.WEBCUP_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Clé API Webcup non configurée"
      });
    }

    const response = await fetch(
      "https://24h.webcup.fr/wp-json/webcup/v1/requests",
      {
        headers: {
          "X-Webcup-Api-Key": apiKey
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Erreur API Webcup :", error);

    return res.status(500).json({
      error: "Impossible de contacter l'API Webcup"
    });
  }
}