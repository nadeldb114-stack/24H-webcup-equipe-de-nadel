const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('open', !isOpen);
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const profileKey = 'nadel.profile.v1';
let currentUser = null;
let csrfToken = '';
let authMode = 'login';
const authButton = document.createElement('button');
authButton.className = 'account-button';
authButton.type = 'button';
authButton.textContent = 'Connexion';
document.querySelector('.topbar')?.append(authButton);
const authDialog = document.createElement('dialog');
authDialog.className = 'auth-dialog';
authDialog.innerHTML = `<button class="auth-close" type="button" aria-label="Fermer">×</button><div class="section-kicker">ESPACE MEMBRE</div><h2 id="auth-title">Connexion</h2><p class="auth-description">Connectez-vous pour participer aux échanges locaux.</p><div class="auth-switch"><button type="button" data-mode="login">Connexion</button><button type="button" data-mode="register">Créer un compte</button></div><form id="auth-form"><label class="field-label" for="auth-name">Votre nom</label><input id="auth-name" name="name" maxlength="40" autocomplete="name" required><label class="field-label" for="auth-email">Adresse courriel</label><input id="auth-email" name="email" type="email" maxlength="254" autocomplete="email" required><label class="field-label" for="auth-password">Mot de passe</label><input id="auth-password" name="password" type="password" minlength="10" maxlength="200" autocomplete="current-password" required><p class="privacy-note auth-password-hint">10 caractères minimum.</p><button class="button button-primary" type="submit">Se connecter <span aria-hidden="true">→</span></button><p class="auth-feedback" role="status" aria-live="polite"></p></form><p class="privacy-note">Vos identifiants sont enregistrés sur le serveur du site. Ne réutilisez pas le mot de passe d’un autre compte.</p>`;
document.body.append(authDialog);
const profileLink = document.createElement('a');
profileLink.href = '#personnaliser';
profileLink.textContent = 'Mon parcours';
navigation?.append(profileLink);
profileLink.addEventListener('click', () => {
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
});
const section = document.createElement('section');
section.className = 'personalize-section';
section.id = 'personnaliser';
section.setAttribute('aria-labelledby', 'personalize-title');
section.innerHTML = `
  <div class="personalize-intro">
    <div class="section-kicker">UN PARCOURS QUI VOUS RESSEMBLE</div>
    <h2 id="personalize-title">On s’adapte à <span class="accent-text">votre profil.</span></h2>
    <p>Quelques réponses suffisent pour trier les conseils et les étapes qui vous seront les plus utiles.</p>
    <p class="privacy-note">Vos réponses restent enregistrées sur cet appareil, sans être envoyées à un serveur.</p>
  </div>
  <form class="profile-form" id="profile-form">
    <label class="field-label" for="participant-name">Comment vous appeler ? <span>(facultatif)</span></label>
    <input id="participant-name" name="name" type="text" maxlength="40" autocomplete="given-name" placeholder="Votre prénom">
    <fieldset><legend>Qu’est-ce qui vous intéresse ? <span>Choisissez une ou plusieurs options</span></legend>
      <div class="interest-options">
        <label><input type="checkbox" name="interests" value="mobilite"><span>Mobilité</span></label>
        <label><input type="checkbox" name="interests" value="entraide"><span>Entraide</span></label>
        <label><input type="checkbox" name="interests" value="vie-locale"><span>Vie locale</span></label>
        <label><input type="checkbox" name="interests" value="services"><span>Accès aux services</span></label>
      </div>
    </fieldset>
    <label class="field-label" for="participant-role">Quel rôle vous attire le plus ?</label>
    <select id="participant-role" name="role"><option value="">Je ne sais pas encore</option><option value="idee">Trouver une idée</option><option value="design">Design et expérience</option><option value="tech">Développement technique</option><option value="pitch">Présentation et communication</option></select>
    <label class="field-label" for="participant-experience">Votre expérience en projet numérique</label>
    <select id="participant-experience" name="experience"><option value="debutant">Je débute</option><option value="intermediaire">J’ai déjà participé à un projet</option><option value="avance">Je peux accompagner l’équipe</option></select>
    <button class="button button-primary" type="submit">Voir mon parcours <span aria-hidden="true">→</span></button>
  </form>
  <div class="recommendations" id="recommendations" aria-live="polite" hidden></div>`;

const steps = document.querySelector('#etapes');
steps?.before(section);
const form = section.querySelector('#profile-form');
const results = section.querySelector('#recommendations');
const copy = {
  mobilite: ['Mobilité', 'Repérez un trajet ou un déplacement du quotidien à améliorer.'],
  entraide: ['Entraide', 'Partez d’un besoin concret entre voisins et imaginez comment faciliter la mise en relation.'],
  'vie-locale': ['Vie locale', 'Observez un service ou un lieu de votre quartier à rendre plus accessible.'],
  services: ['Accès aux services', 'Choisissez une démarche ou un service local que le numérique pourrait simplifier.']
};
const roleTips = {
  idee: 'Commencez par écouter les besoins autour de vous et formuler le problème en une phrase.',
  design: 'Dessinez le parcours d’une personne qui utiliserait votre solution, écran par écran.',
  tech: 'Listez les trois fonctions indispensables à une première démo et choisissez une seule à construire d’abord.',
  pitch: 'Préparez une présentation courte : problème, solution, démonstration et bénéfice local.'
};
function renderProfile(profile) {
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const name = profile.name ? `, ${escapeHTML(profile.name)}` : '';
  const topics = profile.interests.filter((topic) => copy[topic]);
  if (!topics.length) topics.push('vie-locale');
  const tips = topics.map((topic) => {
    const item = copy[topic];
    return `<li><strong>${item[0]} :</strong> ${item[1]}</li>`;
  });
  const roleTip = roleTips[profile.role] || 'Réunissez votre équipe et choisissez ensemble un problème concret à résoudre.';
  const experienceTip = profile.experience === 'debutant'
    ? 'Vous débutez ? C’est parfait : commencez par une idée simple et une maquette papier.'
    : profile.experience === 'avance'
      ? 'Votre expérience peut aider l’équipe à cadrer un objectif réaliste et à débloquer les autres.'
      : 'Votre expérience vous donne de bonnes bases pour prototyper et partager vos apprentissages.';
  results.innerHTML = `<div class="recommendation-heading"><div class="section-kicker">VOTRE PARCOURS CONSEILLÉ</div><h3>Bienvenue${name} !</h3></div><div class="recommendation-columns"><div><h4>Les sujets à explorer</h4><ul>${tips.join('')}</ul></div><div><h4>Votre prochaine action</h4><p>${roleTip}</p><p>${experienceTip}</p><a class="text-link" href="#etapes">Voir les étapes du défi <span aria-hidden="true">→</span></a></div></div><button class="reset-profile" type="button">Effacer mes réponses</button>`;
  results.hidden = false;
  results.querySelector('.reset-profile').addEventListener('click', () => {
    try { localStorage.removeItem(profileKey); } catch { /* Le stockage peut être désactivé. */ }
    form.reset();
    results.hidden = true;
    form.querySelector('button[type="submit"]').textContent = 'Voir mon parcours →';
  });
}

function readSavedProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(profileKey) || 'null');
    if (saved && typeof saved === 'object' && Array.isArray(saved.interests)) {
      return { name: typeof saved.name === 'string' ? saved.name.slice(0, 40) : '', interests: saved.interests.filter((topic) => Object.hasOwn(copy, topic)), role: Object.hasOwn(roleTips, saved.role) ? saved.role : '', experience: ['debutant', 'intermediaire', 'avance'].includes(saved.experience) ? saved.experience : 'debutant' };
    }
  } catch { /* Afficher le questionnaire si le stockage est indisponible ou invalide. */ }
  return null;
}
const savedProfile = readSavedProfile();
if (savedProfile) {
  form.elements.name.value = savedProfile.name || '';
  form.elements.role.value = savedProfile.role || '';
  form.elements.experience.value = savedProfile.experience || 'debutant';
  form.querySelectorAll('[name="interests"]').forEach((input) => { input.checked = savedProfile.interests.includes(input.value); });
  renderProfile(savedProfile);
  form.querySelector('button[type="submit"]').textContent = 'Mettre à jour mon parcours →';
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = {
    name: form.elements.name.value.trim(),
    interests: [...form.querySelectorAll('[name="interests"]:checked')].map((input) => input.value),
    role: form.elements.role.value,
    experience: form.elements.experience.value
  };
  try { localStorage.setItem(profileKey, JSON.stringify(profile)); } catch { /* Les recommandations fonctionnent aussi sans stockage. */ }
  renderProfile(profile);
});

const community = document.createElement('section');
community.className = 'community-section';
community.id = 'communaute';
community.innerHTML = `
  <div class="community-heading"><div class="section-kicker">ORGANISATIONS ET HABITANTS</div><h2>La vie locale, <span class="accent-text">en commun.</span></h2><p>Associations, commerces, collectivités et habitants peuvent partager une information, échanger ou signaler un problème.</p></div>
  <div class="org-panel"><div><span class="org-badge">ESPACE ORGANISATION</span><h3>Votre organisation agit ici ?</h3><p>Créez une fiche locale pour identifier vos publications et faciliter le dialogue avec les habitants.</p></div><form id="org-form" class="org-form"><label class="field-label" for="org-name">Nom de l’organisation</label><input id="org-name" name="name" type="text" maxlength="60" required placeholder="Association, commerce, mairie…"><label class="field-label" for="org-type">Votre structure</label><select id="org-type" name="type"><option>Association</option><option>Commerce</option><option>Collectivité</option><option>Autre organisation</option></select><label class="field-label" for="org-area">Quartier ou commune</label><input id="org-area" name="area" type="text" maxlength="60" required placeholder="Votre secteur"><button class="button button-primary" type="submit">Enregistrer ma fiche <span aria-hidden="true">→</span></button><p class="privacy-note">Fiche enregistrée sur cet appareil uniquement.</p></form><div class="org-confirmation" id="org-confirmation" aria-live="polite" hidden></div></div>
  <div class="exchange-heading"><div><div class="section-kicker">LE FIL LOCAL</div><h3>Informations et échanges</h3></div><label class="feed-filter-label" for="feed-filter">Afficher<select id="feed-filter"><option value="all">Toutes les publications</option><option value="announcement">Informations</option><option value="discussion">Échanges</option><option value="report">Signalements</option><option value="interest">Mes centres d’intérêt</option></select></label></div>
  <form id="post-form" class="post-form"><h4>Partager avec la communauté</h4><div class="post-fields"><label class="field-label" for="post-kind">Type de publication<select id="post-kind" name="kind"><option value="announcement">Information locale</option><option value="discussion">Question ou échange</option><option value="report">Signaler un problème</option></select></label><label class="field-label" for="post-topic">Sujet<select id="post-topic" name="topic"><option value="mobilite">Mobilité</option><option value="entraide">Entraide</option><option value="vie-locale">Vie locale</option><option value="services">Accès aux services</option></select></label><label class="field-label" for="post-area">Quartier ou commune<input id="post-area" name="area" maxlength="60" required placeholder="Où cela se passe-t-il ?"></label></div><label class="field-label" for="post-message">Votre message<textarea id="post-message" name="message" rows="3" minlength="8" maxlength="500" required placeholder="Décrivez l’information, votre question ou le problème à résoudre…"></textarea></label><button class="button button-primary" type="submit">Publier <span aria-hidden="true">→</span></button><p class="privacy-note">Les publications de démonstration sont stockées localement et visibles uniquement dans ce navigateur. N’incluez pas de coordonnées privées ni de données personnelles sur autrui.</p></form>
  <div id="community-feed" class="community-feed" aria-live="polite"></div>`;
section.after(community);
const orgKey = 'nadel.organization.v1';
const postsKey = 'nadel.community.v1';
const orgForm = community.querySelector('#org-form');
const orgConfirmation = community.querySelector('#org-confirmation');
const safeText = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
function loadLocal(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value ?? fallback; } catch { return fallback; }
}
const savedOrg = loadLocal(orgKey, null);
if (savedOrg && typeof savedOrg.name === 'string') {
  orgForm.elements.name.value = savedOrg.name;
  orgForm.elements.type.value = savedOrg.type;
  orgForm.elements.area.value = savedOrg.area;
  orgConfirmation.textContent = `Fiche active : ${savedOrg.name} · ${savedOrg.area}`;
  orgConfirmation.hidden = false;
  orgForm.querySelector('button').textContent = 'Mettre à jour ma fiche →';
}
orgForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!currentUser) { showAuth('login'); return; }
  const org = { name: orgForm.elements.name.value.trim(), type: orgForm.elements.type.value, area: orgForm.elements.area.value.trim() };
  if (serverReady) {
    apiRequest('organizations', { method: 'POST', body: JSON.stringify({ ...org, website: '' }) })
      .then((result) => {
        orgConfirmation.textContent = result.message;
        orgConfirmation.hidden = false;
        try { localStorage.setItem(orgKey, JSON.stringify(org)); } catch { /* Le message de confirmation reste visible. */ }
      })
      .catch((error) => { orgConfirmation.textContent = `Fiche non envoyée : ${error.message}`; orgConfirmation.hidden = false; });
    return;
  }
  try { localStorage.setItem(orgKey, JSON.stringify(org)); } catch { /* La fiche reste affichée dans la session. */ }
  orgConfirmation.textContent = `Fiche enregistrée : ${org.name} · ${org.type} · ${org.area}`;
  orgConfirmation.hidden = false;
});
const initialPosts = [
  { id: 'demo-1', kind: 'announcement', topic: 'mobilite', area: 'Centre-ville', author: 'Info locale', message: 'Travaux sur l’avenue principale samedi matin. Prévoyez un itinéraire alternatif.', date: 'Information de démonstration' },
  { id: 'demo-2', kind: 'discussion', topic: 'entraide', area: 'Quartier des jardins', author: 'Voisinage', message: 'Des personnes seraient-elles intéressées par un groupe d’entraide pour les petites courses ?', date: 'Échange de démonstration' },
  { id: 'demo-3', kind: 'report', topic: 'services', area: 'Place du marché', author: 'Habitant', message: 'Le point lumineux près de l’arrêt de bus ne fonctionne plus depuis plusieurs soirs.', date: 'Signalement de démonstration' }
];
let posts = loadLocal(postsKey, initialPosts);
if (!Array.isArray(posts)) posts = initialPosts;
const postForm = community.querySelector('#post-form');
const feed = community.querySelector('#community-feed');
const filter = community.querySelector('#feed-filter');
const apiUrl = '/api/index.php';
let serverReady = false;
const serverNotice = document.createElement('p');
serverNotice.className = 'server-notice';
serverNotice.setAttribute('role', 'status');
postForm.before(serverNotice);
const kindNames = { announcement: 'Information', discussion: 'Échange', report: 'Signalement' };
const topicNames = { mobilite: 'Mobilité', entraide: 'Entraide', 'vie-locale': 'Vie locale', services: 'Accès aux services' };
async function apiRequest(action, options = {}) {
  const response = await fetch(`${apiUrl}?action=${encodeURIComponent(action)}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}), ...(options.headers || {}) }
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error || 'Le serveur a refusé la demande.');
    error.code = payload.code || '';
    throw error;
  }
  return payload;
}
const authForm = authDialog.querySelector('#auth-form');
const authFeedback = authDialog.querySelector('.auth-feedback');
const authNameField = authDialog.querySelector('#auth-name');
const authPasswordField = authDialog.querySelector('#auth-password');
function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === 'register';
  authDialog.querySelector('#auth-title').textContent = registering ? 'Créer un compte' : 'Connexion';
  authDialog.querySelector('.auth-description').textContent = registering ? 'Inscrivez-vous pour publier et échanger avec votre communauté.' : 'Connectez-vous pour participer aux échanges locaux.';
  authNameField.required = registering;
  authNameField.hidden = !registering;
  authDialog.querySelector('label[for="auth-name"]').hidden = !registering;
  authPasswordField.autocomplete = registering ? 'new-password' : 'current-password';
  authDialog.querySelector('.auth-password-hint').hidden = !registering;
  authForm.querySelector('button[type="submit"]').innerHTML = registering ? 'Créer mon compte <span aria-hidden="true">→</span>' : 'Se connecter <span aria-hidden="true">→</span>';
  authFeedback.textContent = '';
  authDialog.querySelectorAll('.auth-switch button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
}
function showAuth(mode = 'login') {
  setAuthMode(mode);
  if (!authDialog.open) authDialog.showModal();
}
function updateAuthUI() {
  authButton.textContent = currentUser ? `Bonjour ${currentUser.name}` : 'Connexion';
  authButton.setAttribute('aria-label', currentUser ? `Compte de ${currentUser.name}, se déconnecter` : 'Se connecter ou créer un compte');
  postForm.querySelector('button[type="submit"]').textContent = currentUser ? 'Publier →' : 'Connectez-vous pour publier →';
  orgForm.querySelector('button[type="submit"]').textContent = currentUser ? 'Enregistrer ma fiche →' : 'Connectez-vous pour enregistrer →';
}
authButton.addEventListener('click', async () => {
  if (!currentUser) { showAuth('login'); return; }
  authButton.disabled = true;
  try {
    await apiRequest('logout', { method: 'POST', body: '{}' });
    currentUser = null;
    csrfToken = '';
    updateAuthUI();
    const session = await apiRequest('session');
    csrfToken = session.csrf || '';
  } catch (error) {
    authFeedback.textContent = error.message;
    showAuth('login');
  } finally { authButton.disabled = false; }
});
authDialog.querySelector('.auth-close').addEventListener('click', () => authDialog.close());
authDialog.querySelectorAll('.auth-switch button').forEach((button) => button.addEventListener('click', () => setAuthMode(button.dataset.mode)));
authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  authFeedback.textContent = 'Connexion en cours…';
  const data = { email: authForm.elements.email.value.trim(), password: authForm.elements.password.value, website: '' };
  if (authMode === 'register') data.name = authForm.elements.name.value.trim();
  try {
    if (!csrfToken) {
      const session = await apiRequest('session');
      csrfToken = session.csrf || '';
    }
    const result = await apiRequest(authMode, { method: 'POST', body: JSON.stringify(data) });
    currentUser = result.user;
    csrfToken = result.csrf || csrfToken;
    updateAuthUI();
    authDialog.close();
    authForm.reset();
  } catch (error) {
    if (error.code === 'ACCOUNT_NOT_FOUND' && authMode === 'login') {
      const email = authForm.elements.email.value;
      const password = authForm.elements.password.value;
      setAuthMode('register');
      authForm.elements.email.value = email;
      authForm.elements.password.value = password;
      authFeedback.textContent = 'Renseignez votre nom puis confirmez pour créer et enregistrer votre compte.';
      authNameField.focus();
    } else {
      authFeedback.textContent = error.message;
    }
  }
});
apiRequest('session').then((session) => {
  currentUser = session.user || null;
  csrfToken = session.csrf || '';
  updateAuthUI();
}).catch(() => { authButton.title = 'Le serveur de comptes sera disponible après configuration de l’API.'; });
function renderFeed() {
  const preferred = readSavedProfile()?.interests || [];
  const visible = posts.filter((post) => {
    if (filter.value === 'all') return true;
    if (filter.value === 'interest') return preferred.includes(post.topic);
    return post.kind === filter.value;
  });
  feed.innerHTML = visible.length ? visible.map((post) => `<article class="community-post"><div class="post-meta"><span class="post-kind kind-${safeText(post.kind)}">${safeText(kindNames[post.kind] || 'Publication')}</span><span>${safeText(topicNames[post.topic] || 'Vie locale')}</span><span>${safeText(post.area)}</span></div><p>${safeText(post.message)}</p><div class="post-footer"><span>${safeText(post.author || 'Membre')} · ${safeText(post.created_at || post.date || 'À l’instant')}</span><button type="button" class="flag-post" data-id="${safeText(post.id)}">Signaler cette publication</button></div></article>`).join('') : '<p class="empty-feed">Aucune publication dans ce filtre pour le moment.</p>';
feed.querySelectorAll('.flag-post').forEach((button) => button.addEventListener('click', () => {
    if (!currentUser) { showAuth('login'); return; }
    button.textContent = 'Signalement reçu';
    button.disabled = true;
    if (serverReady && /^\d+$/.test(button.dataset.id || '')) {
      apiRequest('report', { method: 'POST', body: JSON.stringify({ post_id: Number(button.dataset.id) }) })
        .then((result) => { button.textContent = result.message; })
        .catch(() => { button.textContent = 'Échec : réessayez plus tard'; button.disabled = false; });
    }
  }));
}
filter.addEventListener('change', renderFeed);
postForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!currentUser) { showAuth('login'); return; }
  const post = { id: `post-${Date.now()}`, kind: postForm.elements.kind.value, topic: postForm.elements.topic.value, area: postForm.elements.area.value.trim(), author: savedOrg?.name || 'Habitant', message: postForm.elements.message.value.trim(), date: 'À l’instant' };
  if (serverReady) {
    apiRequest('posts', { method: 'POST', body: JSON.stringify({ ...post, website: '' }) })
      .then((result) => {
        postForm.reset();
        serverNotice.textContent = result.message;
      })
      .catch((error) => { serverNotice.textContent = `Publication non envoyée : ${error.message}`; });
    return;
  }
  posts.unshift(post);
  posts = posts.slice(0, 80);
  try { localStorage.setItem(postsKey, JSON.stringify(posts)); } catch { /* Le fil fonctionne pendant cette session. */ }
  postForm.reset();
  filter.value = 'all';
  renderFeed();
});
serverNotice.textContent = 'Mode aperçu local : les publications ne sont pas encore partagées.';
renderFeed();
apiRequest('posts')
  .then((result) => {
    serverReady = true;
    posts = Array.isArray(result.posts) ? result.posts : [];
    serverNotice.textContent = 'Connecté au fil partagé. Les publications envoyées attendent une validation avant diffusion.';
    renderFeed();
  })
  .catch(() => { serverNotice.textContent = 'Mode aperçu local : configurez l’API cPanel pour partager les publications.'; });
apiRequest('organizations')
  .then((result) => {
    const approved = Array.isArray(result.organizations) ? result.organizations : [];
    if (approved.length) {
      const directory = document.createElement('div');
      directory.className = 'organization-directory';
      directory.innerHTML = `<h4>Organisations locales</h4>${approved.map((org) => `<span>${safeText(org.name)} · ${safeText(org.type)} · ${safeText(org.area)}</span>`).join('')}`;
      orgConfirmation.after(directory);
    }
  })
  .catch(() => {});
const communityLink = document.createElement('a');
communityLink.href = '#communaute';
communityLink.textContent = 'Espace local';
navigation?.append(communityLink);
communityLink.addEventListener('click', () => {
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
});
<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gestion des requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Données de la session
$session = [
    'status' => 'active',
    'is_running' => true,
    'current_wave' => 6,
    'elapsed_minutes' => 471,
    'visible_requests_count' => 42,
    'initial_requests_count' => 10,
    'wave_requests_count' => 32,
    'next_wave_number' => 7,
    'minutes_until_next_wave' => 9
];

// Réponse JSON
echo json_encode([
    'api_version' => '1.0',
    'session' => $session
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
