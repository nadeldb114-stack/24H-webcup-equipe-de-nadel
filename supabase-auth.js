const SUPABASE_URL = "https://txckzekuwkklhkphxmtt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ut2wTEi-OWQ4swbcL0Msqw_HhX5khN_";


const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("🟢 Supabase Terra Nova initialisé");

const loginForm = document.getElementById("form-login");
console.log("formulaire connexion trouvé :" , loginForm);

const inscriptionBtn = document.querySelector('[data-ouvrir="inscription"]');

console.log("Boutton inscription trouvé :", inscriptionBtn);

inscriptionBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const nom = prompt("Nom et prénom :");
    if (!nom) return;

    const email = prompt("Adresse e-mail :");
    if (!email) return;

    const password = prompt("Mot de passe (6 caractères minimum) :");
    if (!password) return;

    creerCompte(nom, email, password);
}, true);

async function creerCompte(nom, email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                nom: nom
            }
        }
    });

    if (error) {
        alert("❌ Erreur : " + error.message);
        return;
    }

    alert("✅ Compte Terra Nova créé avec succès !");
    console.log("Utilisateur créé :", data.user);