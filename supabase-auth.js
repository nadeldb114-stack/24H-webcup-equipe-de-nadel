// ==========================================
// TERRA NOVA - AUTHENTIFICATION SUPABASE
// ==========================================

const SUPABASE_URL = "https://txckzekuwkklhkphxmtt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ut2wTEi-OWQ4swbcL0Msqw_HhX5khN_";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("🟢 Supabase Terra Nova initialisé");


// ==========================================
// ÉLÉMENTS DU SITE
// ==========================================

const loginForm = document.getElementById("form-login");
const registerForm = document.getElementById("form-register");

console.log("Formulaire connexion trouvé :", loginForm);
console.log("Formulaire inscription trouvé :", registerForm);


// ==========================================
// CONNEXION
// ==========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();
        e.stopImmediatePropagation();

        const email = loginForm.querySelector(
            'input[name="email"]'
        ).value.trim();

        const password = loginForm.querySelector(
            'input[name="password"]'
        ).value;

        const message = document.getElementById(
            "confirmation-login"
        );

        if (message) {
            message.hidden = false;
            message.textContent = "Connexion en cours...";
        }

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {

            console.error(error);

            if (message) {
                message.hidden = false;
                message.textContent =
                    "❌ Adresse e-mail ou mot de passe incorrect.";
            }

            return;
        }

        console.log("🟢 Utilisateur connecté :", data.user);

        if (message) {
            message.hidden = false;
            message.textContent =
                "✅ Connexion réussie. Bienvenue sur Terra Nova !";
        }

        // Direction vers l'espace citoyen
        setTimeout(() => {
            window.location.hash = "#espace";
        }, 700);

    }, true);
}


// ==========================================
// RÈGLES DU MOT DE PASSE
// ==========================================

function verifierMotDePasse(password) {

    if (password.length < 12) {
        return "Le mot de passe doit contenir au moins 12 caractères.";
    }

    if (!/[a-z]/.test(password)) {
        return "Ajoutez au moins une lettre minuscule.";
    }

    if (!/[A-Z]/.test(password)) {
        return "Ajoutez au moins une lettre majuscule.";
    }

    if (!/[0-9]/.test(password)) {
        return "Ajoutez au moins un chiffre.";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return "Ajoutez au moins un caractère spécial.";
    }

    return null;
}


// ==========================================
// CRÉATION DU COMPTE
// ==========================================

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();
        e.stopImmediatePropagation();

        const nom = registerForm.querySelector(
            'input[name="nom"]'
        ).value.trim();

        const email = registerForm.querySelector(
            'input[name="email"]'
        ).value.trim();

        const password = registerForm.querySelector(
            'input[name="password"]'
        ).value;

        const confirmation = registerForm.querySelector(
            'input[name="confirmation"]'
        ).value;

        const message = document.getElementById(
            "confirmation-register"
        );

        // Vérification des champs

        if (!nom || !email || !password || !confirmation) {

            afficherErreur(
                message,
                "❌ Tous les champs sont obligatoires."
            );

            return;
        }

        // Vérification des règles du mot de passe

        const erreurPassword =
            verifierMotDePasse(password);

        if (erreurPassword) {

            afficherErreur(
                message,
                "❌ " + erreurPassword
            );

            return;
        }

        // Vérification de la confirmation

        if (password !== confirmation) {

            afficherErreur(
                message,
                "❌ Les deux mots de passe ne sont pas identiques."
            );

            return;
        }

        if (message) {
            message.hidden = false;
            message.textContent =
                "Création du compte en cours...";
        }


        // ==================================
        // ENVOI VERS SUPABASE
        // ==================================

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {
                        nom: nom,
                        role: "citoyen"
                    }

                }

            });


        if (error) {

            console.error(error);

            afficherErreur(
                message,
                "❌ Impossible de créer le compte : " +
                error.message
            );

            return;
        }


        console.log(
            "🟢 Compte Terra Nova créé :",
            data.user
        );


        if (message) {

            message.hidden = false;

            message.textContent =
                "✅ Compte créé avec succès ! Bienvenue sur Terra Nova.";

        }


        // Nettoyage du formulaire

        registerForm.reset();


        // Retour connexion après création

        setTimeout(() => {

            window.location.hash = "#connexion";

        }, 1200);

    }, true);
}


// ==========================================
// AFFICHAGE DES ERREURS
// ==========================================

function afficherErreur(element, texte) {

    if (!element) {
        alert(texte);
        return;
    }

    element.hidden = false;
    element.textContent = texte;
}


// ==========================================
// SESSION UTILISATEUR
// ==========================================

async function verifierSession() {

    const { data } =
        await supabaseClient.auth.getSession();

    if (data.session) {

        console.log(
            "🟢 Session Terra Nova active :",
            data.session.user.email
        );

    } else {

        console.log(
            "⚪ Aucun utilisateur connecté"
        );

    }

}

verifierSession();


// ==========================================
// CHANGEMENT DE SESSION
// ==========================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Terra Nova Auth :",
            event
        );

        if (session) {

            console.log(
                "Utilisateur :",
                session.user.email
            );

        }

    }
);

// ==========================================
// UTILISATEUR CONNECTÉ - EN-TÊTE
// ==========================================

async function afficherUtilisateurConnecte() {

    const { data } = await supabaseClient.auth.getSession();
    const session = data.session;

    if (!session) return;

    const user = session.user;
    const nom = user.user_metadata?.nom || user.email;

    // Cherche la navigation du site
    const navigation = document.querySelector("header nav");
    document.querySelector("header") 
    document.body;

    if (!navigation) return;

    // Évite de créer deux fois le profil
    if (document.getElementById("profil-connecte")) return;

    const profil = document.createElement("div");

    profil.id = "profil-connecte";

    profil.innerHTML = `
        <button id="bouton-profil" type="button">
            <span class="profil-avatar">👤</span>
            <span>${nom}</span>
        </button>

        <div id="menu-profil" hidden>
            <a href="#espace">Mon espace</a>
            <a href="#demarches">Mes démarches</a>
            <button id="deconnexion" type="button">
                Se déconnecter
            </button>
        </div>
    `;

    navigation.appendChild(profil);


    // Petit style directement injecté
    const style = document.createElement("style");

    style.textContent = `
        #profil-connecte {
            position: relative;
            margin-left: 15px;
        }

        #bouton-profil {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 9px 13px;
            border: 1px solid rgba(255,255,255,.18);
            border-radius: 30px;
            background: rgba(8,25,35,.75);
            color: white;
            cursor: pointer;
            font: inherit;
            font-size: 13px;
        }

        #bouton-profil:hover {
            border-color: #78e6c8;
        }

        .profil-avatar {
            display: grid;
            place-items: center;
            width: 27px;
            height: 27px;
            border-radius: 50%;
            background: rgba(120,230,200,.15);
        }

        #menu-profil {
            position: absolute;
            right: 0;
            top: calc(100% + 10px);
            width: 190px;
            padding: 8px;
            border: 1px solid rgba(255,255,255,.15);
            border-radius: 12px;
            background: #091820;
            box-shadow: 0 15px 40px rgba(0,0,0,.35);
            z-index: 9999;
        }

        #menu-profil a,
        #menu-profil button {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 11px;
            border: 0;
            border-radius: 7px;
            background: transparent;
            color: white;
            text-align: left;
            text-decoration: none;
            cursor: pointer;
            font: inherit;
            font-size: 13px;
        }

        #menu-profil a:hover,
        #menu-profil button:hover {
            background: rgba(255,255,255,.07);
        }

        @media (max-width: 900px) {
            #bouton-profil span:nth-child(2) {
                display: none;
            }
        }
    `;

    document.head.appendChild(style);


    // Ouvrir / fermer le menu
    const bouton = document.getElementById("bouton-profil");
    const menu = document.getElementById("menu-profil");

    bouton.addEventListener("click", () => {
        menu.hidden = !menu.hidden;
    });


    // Déconnexion
    document
        .getElementById("deconnexion")
        .addEventListener("click", async () => {

            await supabaseClient.auth.signOut();

            window.location.hash = "#haut";
            window.location.reload();

        });
}


// Affichage au chargement
afficherUtilisateurConnecte();