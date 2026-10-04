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