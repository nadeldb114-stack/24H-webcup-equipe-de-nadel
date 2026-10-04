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
