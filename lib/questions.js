// Toutes les questions du quiz d'évaluation Next.js Full-Stack ("Dir Khir").

export const CATEGORIES = ["architecture", "rendering", "mongodb", "serveractions", "caching"];

export const CATEGORY_LABELS = {
  architecture: "Architecture & Routing",
  rendering: "Rendu (SSR/SSG/ISR)",
  mongodb: "MongoDB & Auth",
  serveractions: "Server Actions & CRUD",
  caching: "Caching & Déploiement",
};

function mcq(id, difficulty, category, question, options, correctAnswer, explanation) {
  return {
    id,
    type: "mcq",
    category,
    difficulty,
    timeLimit: 60,
    points: 5,
    question,
    options: options.map((text, i) => ({ id: "abcd"[i], text })),
    correctAnswer,
    explanation,
  };
}

export const questions = [
  // ==================================================================
  // QCM — 45 questions (5 pts, 60s)
  // ==================================================================

  // ---- Jour 1 : Architecture & Routing (10) ----
  mcq(
    "mcq-1", "easy", "architecture",
    "Quel fichier Next.js permet de définir le layout commun à toutes les pages d'un dossier ?",
    [
      "Le fichier _app.js hérité du Pages Router",
      "Le fichier layout.js placé dans le dossier concerné",
      "Le fichier template.js qui wrapping chaque page individuellement",
      "Le fichier global.js configuré dans next.config.js",
    ],
    "b",
    "Dans l'App Router, layout.js est un fichier spécial qui enveloppe toutes les pages du dossier et de ses sous-dossiers. Contrairement à template.js, il persiste entre les navigations sans être re-monté. _app.js appartient à l'ancien Pages Router."
  ),
  mcq(
    "mcq-2", "easy", "architecture",
    "Quelle convention de fichier Next.js affiche une UI pendant le chargement d'une page ?",
    [
      "Le fichier spinner.js dans le dossier components/",
      "Le fichier loading.js dans le même dossier que la page",
      "Le fichier skeleton.js configuré dans le layout parent",
      "Le fichier fallback.js utilisé avec React Suspense manuellement",
    ],
    "b",
    "loading.js est un fichier spécial Next.js qui s'affiche automatiquement pendant que la page charge, grâce à React Suspense. Il n'a pas besoin d'être importé manuellement — Next.js gère tout."
  ),
  mcq(
    "mcq-3", "easy", "architecture",
    "Comment créer une route dynamique `/besoins/[id]` dans l'App Router ?",
    [
      "Créer app/besoins/:id/page.js avec la syntaxe Express",
      "Créer app/besoins/[id]/page.js avec des crochets autour du segment",
      "Créer app/besoins/id/page.js et utiliser useRouter pour lire l'id",
      "Créer pages/besoins/[id].js dans le dossier pages/ du projet",
    ],
    "b",
    "Dans l'App Router, les segments dynamiques s'écrivent entre crochets : [id]. Le fichier pages/ appartient à l'ancien Pages Router. La syntaxe :id vient d'Express et ne fonctionne pas en Next.js."
  ),
  mcq(
    "mcq-4", "medium", "architecture",
    "Quelle est la différence principale entre un Server Component et un Client Component ?",
    [
      "Les Server Components exécutent JavaScript dans le navigateur uniquement",
      "Les Client Components peuvent accéder directement à MongoDB sans API",
      "Les Server Components tournent côté serveur et ne peuvent pas utiliser useState",
      "Les Client Components sont toujours plus lents car ils hydratent le DOM",
    ],
    "c",
    "Les Server Components s'exécutent exclusivement sur le serveur — ils peuvent accéder à la base de données directement, mais ils n'ont pas accès aux hooks React (useState, useEffect) ni aux APIs browser. Les Client Components sont marqués 'use client' et s'exécutent dans le navigateur."
  ),
  mcq(
    "mcq-5", "medium", "architecture",
    "Dans Dir Khir, la page `/besoins` affiche une liste filtrée côté client. Quelle architecture est correcte ?",
    [
      "Un Client Component unique qui fetch MongoDB avec useEffect au chargement",
      "Un Server Component qui fetch les données et passe les besoins à un Client Component enfant pour le filtre",
      "Un Server Component qui recharge la page entière à chaque changement de filtre",
      "Un Route Handler GET appelé depuis un useEffect dans le Server Component",
    ],
    "b",
    "C'est le pattern composition Server/Client : le Server Component parent fetch les données (accès direct MongoDB, performant) et passe les données en props au Client Component enfant qui gère l'interactivité (useState pour le filtre). On ne convertit pas toute une page en Client Component juste pour un filtre."
  ),
  mcq(
    "mcq-6", "medium", "architecture",
    "À quoi servent les Route Groups comme `(public)` et `(dashboard)` dans l'App Router ?",
    [
      "À protéger automatiquement les routes avec un middleware d'authentification",
      "À organiser les dossiers sans affecter l'URL — (public) ne crée pas de segment /public",
      "À créer des sous-domaines différents pour chaque groupe de routes",
      "À définir des permissions par groupe directement dans next.config.js",
    ],
    "b",
    "Les parenthèses dans le nom d'un dossier créent un Route Group : le dossier (public) organise les fichiers mais ne crée pas de segment /public dans l'URL. C'est purement organisationnel — pratique pour avoir des layouts différents par groupe sans changer les URLs."
  ),
  mcq(
    "mcq-7", "medium", "architecture",
    "Que se passe-t-il si on oublie d'ajouter `'use client'` à un composant qui utilise useState ?",
    [
      "Next.js ajoute automatiquement 'use client' lors du build",
      "useState fonctionne quand même mais sans hydration côté client",
      "Next.js lance une erreur car useState n'est pas disponible côté serveur",
      "Le composant devient un Server Component qui ignore le useState",
    ],
    "c",
    "useState est une API React réservée aux Client Components. Si un Server Component tente d'utiliser useState, Next.js génère une erreur à la compilation ou au runtime car ces APIs ne sont pas disponibles dans l'environnement serveur (Node.js)."
  ),
  mcq(
    "mcq-8", "hard", "architecture",
    "Pourquoi le fichier `not-found.js` de la page `/besoins/[id]` ne s'affiche que pour ce segment ?",
    [
      "Parce qu'il faut l'importer manuellement dans chaque layout parent",
      "Parce que Next.js cherche le not-found.js le plus proche du segment qui lève l'erreur",
      "Parce que not-found.js est configuré globalement dans next.config.js",
      "Parce que la fonction notFound() précise le chemin du fichier à afficher",
    ],
    "b",
    "Next.js remonte l'arborescence pour trouver le not-found.js le plus proche. Si app/besoins/[id]/not-found.js existe, c'est lui qui s'affiche quand notFound() est appelé dans cette page. S'il n'existe pas, Next.js remonte à app/not-found.js. La granularité est donc contrôlée par l'emplacement du fichier."
  ),
  mcq(
    "mcq-9", "hard", "architecture",
    "Quelle est la différence entre `layout.js` et `template.js` dans l'App Router ?",
    [
      "template.js est l'ancien nom de layout.js dans Next.js 13",
      "layout.js persiste entre navigations, template.js est re-monté à chaque navigation",
      "template.js accepte des props enfants, layout.js est purement statique",
      "layout.js s'applique au dossier courant, template.js s'applique à tous les sous-dossiers",
    ],
    "b",
    "C'est la distinction fondamentale : layout.js garde son state entre les navigations (il n'est pas démonté/remonté). template.js est re-créé à chaque navigation — utile quand tu veux des animations d'entrée/sortie ou réinitialiser un état à chaque changement de page."
  ),
  mcq(
    "mcq-10", "hard", "architecture",
    "Dans l'App Router, que signifie le préfixe `_` dans un nom de dossier comme `_components` ?",
    [
      "C'est une convention Next.js pour les dossiers privés exclus du routing",
      "C'est une convention Next.js pour les composants client uniquement",
      "C'est une convention communautaire — Next.js traite _ comme n'importe quel dossier",
      "Le préfixe _ force Next.js à ne pas générer de bundle pour ce dossier",
    ],
    "a",
    "Dans l'App Router, un dossier préfixé par _ est exclu du système de routing — Next.js ne créera pas de route pour son contenu. C'est une fonctionnalité native appelée Private Folders. Pratique pour coloquer des composants, tests ou utilitaires à côté des routes sans créer de pages accidentelles."
  ),

  // ---- Jour 1 : Modes de rendu (8) ----
  mcq(
    "mcq-11", "easy", "rendering",
    "Que signifie SSG (Static Site Generation) dans Next.js ?",
    [
      "La page est générée dynamiquement à chaque requête côté serveur",
      "La page est générée une seule fois au moment du build et mise en cache",
      "La page est générée côté client avec JavaScript après le chargement",
      "La page est générée périodiquement selon un intervalle configuré",
    ],
    "b",
    "SSG génère le HTML au moment du npm run build. La page est ensuite servie identique à tous les utilisateurs depuis le cache (CDN). C'est le mode le plus performant mais adapté uniquement aux contenus qui ne changent pas souvent : /connexion, /inscription, /contact dans Dir Khir."
  ),
  mcq(
    "mcq-12", "easy", "rendering",
    "Quel mode de rendu Next.js utilise Dir Khir pour la page `/connexion` ?",
    [
      "SSR — car la session doit être vérifiée à chaque requête",
      "ISR — pour mettre à jour le formulaire si besoin",
      "SSG — c'est un formulaire statique sans données dynamiques",
      "CSR — car c'est un formulaire interactif avec useState",
    ],
    "c",
    "La page /connexion est un formulaire HTML pur. Elle ne dépend d'aucune donnée serveur ni d'aucune session. SSG est parfait : généré une fois au build, ultra-rapide à servir. Le fait qu'il y ait de l'interactivité (useState) dans le formulaire ne change pas le mode de rendu de la page."
  ),
  mcq(
    "mcq-13", "medium", "rendering",
    "Quel mode de rendu utilise Dir Khir pour la page `/besoins/[id]` et pourquoi ?",
    [
      "ISR car les besoins sont mis à jour toutes les 60 secondes maximum",
      "SSG car les besoins ne changent pas fréquemment dans la journée",
      "SSR car les participants changent constamment et la session doit être vérifiée",
      "CSR car les boutons Participer/Enregistrer nécessitent du JavaScript",
    ],
    "c",
    "SSR est nécessaire pour deux raisons cumulées : (1) le nombre de participants change à chaque interaction d'un utilisateur — ISR serait trop en retard, (2) les boutons Participer/Enregistrer/Modifier/Supprimer s'affichent selon la session — on doit vérifier qui est connecté à chaque requête."
  ),
  mcq(
    "mcq-14", "medium", "rendering",
    "Comment forcer le mode SSR sur une page dans l'App Router ?",
    [
      "Ajouter `export const ssr = true` en haut du fichier page.js",
      "Utiliser `getServerSideProps` comme dans l'ancien Pages Router",
      "Ajouter `export const dynamic = 'force-dynamic'` dans le fichier page.js",
      "Importer `headers` ou `cookies` de next/headers pour déclencher le SSR automatique",
    ],
    "c",
    "Dans l'App Router, `export const dynamic = 'force-dynamic'` force le SSR (recalcul à chaque requête). Importer headers() ou cookies() déclenche aussi le SSR automatiquement (option D est partiellement vraie mais moins explicite). getServerSideProps n'existe pas dans l'App Router."
  ),
  mcq(
    "mcq-15", "medium", "rendering",
    "Quelle est la différence entre ISR et SSR pour la page `/besoins` de Dir Khir ?",
    [
      "ISR génère la page à chaque requête, SSR la met en cache plusieurs heures",
      "ISR sert une page en cache et la régénère en arrière-plan, SSR recalcule à chaque requête",
      "ISR et SSR sont identiques dans l'App Router de Next.js 14",
      "ISR nécessite une base de données, SSR peut fonctionner sans MongoDB",
    ],
    "b",
    "ISR (Incremental Static Regeneration) sert la version mise en cache et déclenche une régénération en arrière-plan après l'expiration du revalidate. L'utilisateur reçoit toujours une réponse rapide. SSR recalcule le HTML à chaque requête — plus lent mais toujours à jour. Pour /besoins (liste publique), ISR est préférable."
  ),
  mcq(
    "mcq-16", "hard", "rendering",
    "Dans Next.js App Router, comment configurer ISR avec un revalidate de 60 secondes ?",
    [
      "Ajouter `export const revalidate = 60` dans le fichier page.js du segment",
      "Passer `{ next: { revalidate: 60 } }` comme option dans chaque fetch() de la page",
      "Les deux options A et B fonctionnent mais à des niveaux différents",
      "Configurer revalidate uniquement dans next.config.js pour toute l'application",
    ],
    "c",
    "Les deux approches sont valides et complémentaires. export const revalidate = 60 dans page.js applique ISR à toute la page. { next: { revalidate: 60 } } dans un fetch() précis applique ISR uniquement à ce fetch. On peut mixer les deux pour un contrôle fin."
  ),
  mcq(
    "mcq-17", "hard", "rendering",
    "Que se passe-t-il si une page utilise `cookies()` de next/headers sans `export const dynamic` ?",
    [
      "Next.js génère une erreur car cookies() est incompatible avec le cache",
      "Next.js détecte l'usage de cookies() et bascule automatiquement en mode dynamique (SSR)",
      "La page reste en SSG et cookies() retourne toujours une valeur vide",
      "Next.js utilise ISR par défaut avec un revalidate de 0 secondes",
    ],
    "b",
    "C'est l'opt-out automatique du cache dans Next.js. Certaines APIs comme cookies(), headers(), searchParams accèdent à des données spécifiques à la requête — Next.js le détecte et rend automatiquement la page dynamique, même sans export const dynamic = 'force-dynamic' explicite."
  ),
  mcq(
    "mcq-18", "hard", "rendering",
    "Pour la page d'accueil `/` de Dir Khir qui affiche les 6 derniers besoins, quel est le risque d'utiliser SSG pur ?",
    [
      "SSG est impossible car la page d'accueil ne peut pas faire de requête MongoDB",
      "Les 6 besoins affichés ne se mettent jamais à jour sans ISR ou revalidate",
      "SSG pur charge les besoins en temps réel mais consomme trop de mémoire",
      "SSG nécessite generateStaticParams pour les pages avec des données",
    ],
    "b",
    "Avec SSG pur (pas de revalidate), la page est figée au moment du build. Si de nouveaux besoins sont créés, la page d'accueil continuera à afficher les 6 besoins d'avant le build jusqu'au prochain npm run build. C'est pourquoi Dir Khir utilise ISR avec un revalidate raisonnable pour cette page."
  ),

  // ---- Jour 2 : MongoDB & Authentification (9) ----
  mcq(
    "mcq-19", "easy", "mongodb",
    "Quelle est la syntaxe correcte pour définir un modèle Mongoose avec un champ `titre` obligatoire ?",
    [
      "`titre: { type: String, required: true }` dans le schéma Mongoose",
      "`titre: String.required()` comme en TypeScript avec Zod",
      "`titre: { String, notNull: true }` comme en SQL",
      "`titre: required(String)` avec la fonction helper de Mongoose",
    ],
    "a",
    "Dans Mongoose, un schéma se définit avec des objets de configuration : { type: String, required: true }. On peut aussi utiliser le raccourci titre: String si le champ n'est pas obligatoire, mais pour required il faut la forme objet."
  ),
  mcq(
    "mcq-20", "easy", "mongodb",
    "Dans le modèle Besoin de Dir Khir, que stocke le champ `participants` ?",
    [
      "Le nombre total de participants sous forme d'entier (Number)",
      "Un tableau d'ObjectId référençant les utilisateurs participants",
      "Un tableau d'objets contenant nom et email de chaque participant",
      "Une chaîne de caractères avec les noms séparés par des virgules",
    ],
    "b",
    "Dans Dir Khir, participants: [{ type: ObjectId, ref: 'user' }] est un tableau de références MongoDB. On stocke uniquement les IDs des utilisateurs, pas leurs données complètes. Cela évite la duplication et permet de toujours avoir les infos à jour via .populate()."
  ),
  mcq(
    "mcq-21", "medium", "mongodb",
    "Pourquoi le fichier `lib/db.js` dans Dir Khir utilise-t-il un pattern singleton pour la connexion MongoDB ?",
    [
      "Pour empêcher plusieurs utilisateurs de se connecter simultanément",
      "Pour éviter de créer de nouvelles connexions à chaque hot-reload en développement",
      "Pour améliorer les performances des requêtes MongoDB en production",
      "Pour partager la même instance de Mongoose entre le frontend et le backend",
    ],
    "b",
    "En développement, Next.js recharge les modules à chaque sauvegarde (hot-reload). Sans singleton, chaque rechargement appellerait mongoose.connect() et créerait une nouvelle connexion. MongoDB Atlas a une limite de connexions simultanées — le singleton stocke la connexion dans global._mongoose pour la réutiliser."
  ),
  mcq(
    "mcq-22", "medium", "mongodb",
    "Quelle est la différence entre un Route Handler GET et une Server Action pour récupérer les besoins ?",
    [
      "Le Route Handler est plus lent car il passe par une URL HTTP externe",
      "La Server Action peut être appelée depuis n'importe quelle application externe",
      "Le Route Handler expose un endpoint HTTP public, la Server Action est une fonction interne",
      "La Server Action est automatiquement mise en cache, le Route Handler ne l'est jamais",
    ],
    "c",
    "Un Route Handler GET /api/besoins crée un endpoint HTTP accessible depuis n'importe où (Postman, mobile, autre app). Une Server Action est une fonction serveur privée appelée directement depuis les composants React de l'app. Pour les données publiques comme la liste des besoins, un Route Handler est plus adapté car consommable par d'autres clients."
  ),
  mcq(
    "mcq-23", "medium", "mongodb",
    "Dans Better Auth, pourquoi ne faut-il pas créer manuellement les routes `/api/auth/register` et `/api/auth/login` ?",
    [
      "Ces routes sont définies dans proxy.js et non dans le dossier api/",
      "Better Auth génère ses endpoints via le fichier catch-all `[...all]/route.js`",
      "Ces routes n'existent pas dans Better Auth qui utilise des Server Actions",
      "Il faut les créer mais dans le dossier `lib/` et non dans `api/`",
    ],
    "b",
    "Better Auth gère lui-même tous ses endpoints d'authentification. Le fichier app/api/auth/[...all]/route.js est un catch-all qui délègue toutes les requêtes vers /api/auth/* à Better Auth. Créer manuellement ces routes casserait le système d'authentification."
  ),
  mcq(
    "mcq-24", "medium", "mongodb",
    "Dans Dir Khir, à quoi sert `proxy.js` à la racine du projet dans Next.js 16 ?",
    [
      "À configurer un reverse proxy pour rediriger vers un backend Express externe",
      "À intercepter les requêtes avant le routing et vérifier la session utilisateur",
      "À créer un service worker qui intercepte les requêtes réseau",
      "À définir les headers de sécurité CORS pour toutes les API routes",
    ],
    "b",
    "Dans Next.js 16, proxy.js remplace middleware.js pour la protection des routes. Il s'exécute avant que Next.js ne serve la page et peut vérifier la session, rediriger vers /connexion si l'utilisateur n'est pas authentifié, et protéger des routes comme /profil, /besoins/creer ou /besoins/[id]/modifier."
  ),
  mcq(
    "mcq-25", "hard", "mongodb",
    "Comment récupérer les 6 besoins les plus récents dans un Route Handler avec Mongoose ?",
    [
      "`Besoin.find().sort({ createdAt: -1 }).limit(6)` dans une fonction async",
      "`Besoin.findRecent(6)` avec la méthode utilitaire de Mongoose",
      "`Besoin.find({ limit: 6, sort: 'desc' })` avec les options dans find()",
      "`Besoin.aggregate([{ $sort: { createdAt: -1 } }, { $take: 6 }])`",
    ],
    "a",
    "Avec Mongoose, .sort({ createdAt: -1 }) trie par date décroissante (plus récent en premier, -1 = DESC). .limit(6) limite à 6 résultats. Ces méthodes chaînées sont des Query Methods de Mongoose. L'option D utilise $limit (pas $take) et serait dans une aggregation pipeline — correct mais inutilement complexe ici."
  ),
  mcq(
    "mcq-26", "hard", "mongodb",
    "Pourquoi `JSON.stringify(besoin)` est nécessaire avant de passer un document Mongoose à un Client Component ?",
    [
      "Pour compresser les données et réduire la taille du payload réseau",
      "Parce que les objets Mongoose contiennent des méthodes et des ObjectId non sérialisables en React",
      "Pour chiffrer les données sensibles avant de les envoyer au client",
      "Parce que les Client Components ne peuvent recevoir que des chaînes de caractères en props",
    ],
    "b",
    "Les documents Mongoose sont des instances de classe avec des méthodes (.save(), .toObject()...) et des types spéciaux comme ObjectId qui ne sont pas de simples objets JavaScript. React ne peut pas sérialiser ces objets pour les passer en props depuis un Server Component. JSON.stringify + JSON.parse les convertit en plain objects."
  ),
  mcq(
    "mcq-27", "hard", "mongodb",
    "Dans le modèle Besoin, que fait `{ timestamps: true }` passé en second argument du Schema ?",
    [
      "Ajoute un champ `timestamp` unique qui combine date et heure en Unix epoch",
      "Ajoute automatiquement les champs `createdAt` et `updatedAt` gérés par Mongoose",
      "Active la validation des champs de type Date dans le schéma",
      "Enregistre l'historique de toutes les modifications du document",
    ],
    "b",
    "{ timestamps: true } est une option de SchemaOptions qui demande à Mongoose d'ajouter et gérer automatiquement deux champs : createdAt (date de création, jamais modifié) et updatedAt (date de dernière modification, mis à jour à chaque .save()). C'est pour ça qu'on ne les déclare pas dans le schéma de Dir Khir."
  ),

  // ---- Jour 3 : Server Actions & CRUD (9) ----
  mcq(
    "mcq-28", "easy", "serveractions",
    "Que doit-on ajouter en haut d'un fichier ou d'une fonction pour créer une Server Action ?",
    [
      "La directive `'use server'` au début du fichier ou de la fonction",
      "Le décorateur `@serverAction` avant la déclaration de la fonction",
      "L'import `{ serverAction }` depuis le package next/server",
      "La configuration `action: 'server'` dans next.config.js",
    ],
    "a",
    "'use server' est la directive Next.js qui marque une fonction comme Server Action. Elle peut être placée en haut du fichier (toutes les fonctions exportées deviennent des Server Actions) ou en première ligne d'une fonction spécifique (plus granulaire). Sans cette directive, la fonction s'exécute côté client."
  ),
  mcq(
    "mcq-29", "easy", "serveractions",
    "Comment appeler une Server Action depuis un formulaire HTML dans un Server Component ?",
    [
      "En utilisant `onSubmit={serverAction}` comme un événement React classique",
      "En passant la Server Action à l'attribut `action` du tag `<form>`",
      "En créant un Route Handler POST et en l'appelant avec fetch() dans useEffect",
      "En important la Server Action dans le Client Component qui gère le formulaire",
    ],
    "b",
    "Dans l'App Router, <form action={maServerAction}> permet d'appeler directement une Server Action. Next.js gère l'envoi des données (FormData) automatiquement. Ça fonctionne même sans JavaScript côté client (progressive enhancement)."
  ),
  mcq(
    "mcq-30", "medium", "serveractions",
    "Pourquoi faut-il appeler `revalidatePath('/besoins')` dans la Server Action `creerBesoin` ?",
    [
      "Pour forcer Next.js à reconstruire l'application après chaque création",
      "Pour invalider le cache de /besoins et afficher le nouveau besoin créé",
      "Pour synchroniser la base de données MongoDB avec le cache Redis",
      "Pour déclencher un rebuild de la page d'accueil sur Vercel automatiquement",
    ],
    "b",
    "Sans revalidatePath('/besoins'), Next.js serve la version en cache de la liste des besoins — le nouveau besoin n'y apparaît pas même s'il est bien en base de données. revalidatePath invalide le cache de cette route, forçant Next.js à régénérer la page à la prochaine requête avec les données fraîches."
  ),
  mcq(
    "mcq-31", "medium", "serveractions",
    "Dans `supprimerBesoin`, pourquoi doit-on vérifier que `besoin.createdBy.toString() === session.user.id` ?",
    [
      "Car MongoDB stocke les ObjectId en binaire et la comparaison directe échoue",
      "Car createdBy est un ObjectId Mongoose et session.user.id est une string — il faut les convertir",
      "Car Next.js convertit automatiquement les IDs en UUID lors des Server Actions",
      "Car Better Auth utilise des IDs différents de ceux de MongoDB",
    ],
    "b",
    "C'est un piège classique de Mongoose : createdBy est un ObjectId (type spécial MongoDB), pas une string. objectId === string retourne toujours false en JavaScript. Il faut .toString() pour convertir l'ObjectId en string avant de comparer avec session.user.id qui est déjà une string."
  ),
  mcq(
    "mcq-32", "medium", "serveractions",
    "Quelle opération MongoDB utilise `toggleParticipation` pour ajouter ou retirer un utilisateur ?",
    [
      "$set pour mettre à jour le tableau participants avec le nouvel état",
      "$push pour ajouter et $pull pour retirer un userId du tableau participants",
      "$update pour modifier le document et $delete pour retirer l'userId",
      "$addToSet pour ajouter sans doublon et $unset pour retirer l'userId",
    ],
    "b",
    "Le pattern toggleParticipation dans Dir Khir : si l'userId est déjà dans participants → findByIdAndUpdate avec $pull pour le retirer. Sinon → findByIdAndUpdate avec $push pour l'ajouter. $addToSet (option D) empêche les doublons mais ne retire pas — il faudrait quand même $pull pour retirer."
  ),
  mcq(
    "mcq-33", "hard", "serveractions",
    "Quelle est la différence entre `redirect()` et `revalidatePath()` dans une Server Action ?",
    [
      "redirect() change l'URL côté client, revalidatePath() change l'URL côté serveur",
      "redirect() envoie l'utilisateur vers une nouvelle URL, revalidatePath() invalide le cache d'une route sans changer l'URL",
      "redirect() fonctionne uniquement dans les Route Handlers, revalidatePath() dans les Server Actions",
      "redirect() est synchrone, revalidatePath() est asynchrone et non bloquant",
    ],
    "b",
    "Ce sont deux actions distinctes et complémentaires. revalidatePath('/besoins') invalide le cache d'une route — la prochaine requête vers /besoins recalculera la page. redirect('/besoins') envoie l'utilisateur vers /besoins. Dans creerBesoin : on appelle d'abord revalidatePath puis redirect pour que l'utilisateur atterrisse sur une page à jour."
  ),
  mcq(
    "mcq-34", "hard", "serveractions",
    "Dans `modifierBesoin`, pourquoi utilise-t-on `findByIdAndUpdate` plutôt que `.save()` ?",
    [
      "findByIdAndUpdate est plus performant car il évite un aller-retour MongoDB inutile",
      ".save() ne fonctionne pas dans les Server Actions de Next.js",
      "findByIdAndUpdate est atomique — il lit et modifie en une seule opération sans race condition",
      ".save() nécessite d'avoir chargé tout le document, findByIdAndUpdate est plus sécurisé",
    ],
    "c",
    "findByIdAndUpdate est une opération atomique côté MongoDB : lecture + modification en une seule instruction. Avec .save(), tu risques une race condition si deux requêtes modifient le même document simultanément. Pour les mutations concurrentes (participants, savedBy), c'est encore plus critique."
  ),
  mcq(
    "mcq-35", "hard", "serveractions",
    "Que retourne une Server Action qui appelle `redirect()` à la fin ?",
    [
      "Un objet Response avec status 302 que le Client Component doit gérer",
      "Elle ne retourne rien — redirect() lève une erreur interceptée par Next.js",
      "Une Promise<void> que le formulaire résout après la redirection",
      "Un objet { redirect: '/chemin' } que Next.js interprète côté client",
    ],
    "b",
    "redirect() dans Next.js lève une erreur spéciale (NEXT_REDIRECT) qui est interceptée par le framework pour effectuer la redirection. La Server Action ne retourne donc rien après redirect(). C'est pourquoi il faut appeler redirect() APRÈS toutes les opérations (revalidatePath, etc.) — tout ce qui suit ne s'exécutera pas."
  ),
  mcq(
    "mcq-36", "medium", "serveractions",
    "Comment récupérer les données d'un formulaire dans une Server Action ?",
    [
      "En utilisant `useFormData()` hook dans la Server Action",
      "En accédant au paramètre `formData` de type FormData et en appelant `.get('nomDuChamp')`",
      "En parsant `request.body` comme dans un Route Handler Express",
      "En destructurant les props du composant parent dans la Server Action",
    ],
    "b",
    "Une Server Action appelée depuis <form action={action}> reçoit automatiquement un objet FormData en premier paramètre. On accède à chaque champ avec formData.get('titre'), formData.get('description'), etc. Ces noms correspondent aux attributs name des inputs du formulaire."
  ),

  // ---- Jour 4 : Caching & Déploiement (9) ----
  mcq(
    "mcq-37", "easy", "caching",
    "Quelle est la différence principale entre `revalidatePath` et `revalidateTag` ?",
    [
      "revalidatePath invalide une URL spécifique, revalidateTag invalide des requêtes taggées",
      "revalidateTag est plus rapide et recommandé pour toutes les pages ISR",
      "revalidatePath fonctionne en SSR, revalidateTag uniquement en ISR",
      "Il n'y a pas de différence fonctionnelle entre les deux dans Next.js 14",
    ],
    "a",
    "revalidatePath('/besoins') invalide le cache de la route /besoins entière. revalidateTag('besoins') invalide tous les fetch() dans l'app qui ont été taggés { next: { tags: ['besoins'] } }, quelle que soit la page. revalidateTag est plus granulaire et plus flexible sur de grandes applications."
  ),
  mcq(
    "mcq-38", "easy", "caching",
    "Comment configurer un fetch() pour qu'il ne soit jamais mis en cache dans Next.js ?",
    [
      "Passer `{ cache: 'no-store' }` comme option au fetch()",
      "Passer `{ next: { revalidate: 0 } }` pour un revalidate immédiat",
      "Appeler `revalidatePath()` juste avant le fetch() dans le composant",
      "Ajouter `'use client'` en haut du fichier pour désactiver le cache serveur",
    ],
    "a",
    "fetch(url, { cache: 'no-store' }) équivaut à SSR pour ce fetch spécifique : la donnée est toujours récupérée en temps réel, jamais mise en cache. { next: { revalidate: 0 } } (option B) est similaire mais pas strictement identique selon la version de Next.js."
  ),
  mcq(
    "mcq-39", "medium", "caching",
    "Dans quel ordre Next.js applique-t-il ses différentes couches de cache ?",
    [
      "Browser cache → CDN → Data Cache → Full Route Cache",
      "Request Memoization → Data Cache → Full Route Cache → Router Cache",
      "Full Route Cache → Data Cache → Request Memoization → Router Cache",
      "Router Cache → Full Route Cache → Data Cache → Request Memoization",
    ],
    "b",
    "L'ordre est : (1) Request Memoization déduplique les fetch() identiques dans un même render, (2) Data Cache garde les données fetch() entre requêtes, (3) Full Route Cache garde le HTML/RSC payload en production, (4) Router Cache côté client garde les segments de routes pour la navigation."
  ),
  mcq(
    "mcq-40", "medium", "caching",
    "Pourquoi faut-il vérifier les revalidations dans toutes les Server Actions avant le déploiement ?",
    [
      "Car Vercel supprime automatiquement tous les caches lors du déploiement",
      "Car sans revalidatePath, les pages en cache ne reflètent pas les mutations en base de données",
      "Car les Server Actions ne s'exécutent pas en production sans revalidation explicite",
      "Car MongoDB Atlas nécessite une notification de revalidation après chaque écriture",
    ],
    "b",
    "En production avec ISR ou SSG, les pages sont servies depuis le cache. Si une Server Action modifie la base de données sans appeler revalidatePath(), les utilisateurs continueront à voir l'ancienne version. Oublier un revalidatePath est le bug le plus courant en production."
  ),
  mcq(
    "mcq-41", "medium", "caching",
    "Dans Dir Khir, une Server Action `toggleParticipation` modifie les participants du besoin. Quel revalidatePath appeler ?",
    [
      "revalidatePath('/') uniquement pour la page d'accueil",
      "revalidatePath('/besoins') pour invalider la liste uniquement",
      "revalidatePath(`/besoins/${id}`) pour invalider la page détail du besoin modifié",
      "revalidatePath('/besoins') et revalidatePath(`/besoins/${id}`) pour les deux",
    ],
    "d",
    "toggleParticipation affecte deux pages : /besoins/[id] (le nombre de participants sur la page détail) et /besoins (les cards affichent aussi le nombre de participants). Pour être complet, il faut invalider les deux. En production, oublier l'une des deux créerait une incohérence visuelle."
  ),
  mcq(
    "mcq-42", "hard", "caching",
    "Quelle est la différence entre le Data Cache et le Full Route Cache de Next.js ?",
    [
      "Data Cache met en cache les requêtes fetch(), Full Route Cache met en cache le HTML rendu",
      "Data Cache est côté client, Full Route Cache est côté serveur sur Vercel",
      "Data Cache est persistant entre builds, Full Route Cache est vidé à chaque déploiement",
      "Les options A et C sont toutes les deux correctes",
    ],
    "d",
    "Les deux affirmations sont exactes. Data Cache (côté serveur) : met en cache le résultat des fetch() entre les requêtes — persistant entre builds, invalidé par revalidatePath/revalidateTag. Full Route Cache (côté serveur) : met en cache le HTML + RSC payload généré — vidé à chaque nouveau déploiement Vercel."
  ),
  mcq(
    "mcq-43", "hard", "caching",
    "Pourquoi `npm run build` doit être testé en local avant le déploiement sur Vercel ?",
    [
      "Car Vercel facture chaque build échoué sur les plans payants",
      "Car certaines erreurs n'apparaissent qu'au build (imports incorrects, async dans Client Components...)",
      "Car npm run dev utilise Webpack et Vercel utilise un bundler différent",
      "Car le build local vérifie la connexion à MongoDB Atlas avant le déploiement",
    ],
    "b",
    "npm run dev est tolérant : il compile à la volée et certaines erreurs passent inaperçues. npm run build est strict : il analyse tout le code statiquement et détecte des erreurs comme les async Client Components, les imports de modules serveur dans du code client, les pages sans export default, etc."
  ),
  mcq(
    "mcq-44", "hard", "caching",
    "Comment Vercel gère-t-il les variables d'environnement différemment de `.env.local` ?",
    [
      ".env.local est chiffré, les variables Vercel sont en clair dans le dashboard",
      ".env.local n'existe que localement — il faut reconfigurer chaque variable dans le dashboard Vercel",
      "Vercel lit automatiquement le .env.local du dépôt Git si le fichier est commité",
      ".env.local est copié automatiquement lors du premier git push vers Vercel",
    ],
    "b",
    ".env.local doit TOUJOURS être dans .gitignore — il ne doit jamais être commité (sécurité). Les variables d'environnement de production doivent être configurées manuellement dans le dashboard Vercel (Settings → Environment Variables)."
  ),
  mcq(
    "mcq-45", "medium", "caching",
    "Qu'est-ce que le Request Memoization dans Next.js et quand est-il utile ?",
    [
      "Il met en cache les requêtes MongoDB entre les redémarrages du serveur",
      "Il déduplique les fetch() identiques appelés plusieurs fois dans un même cycle de rendu",
      "Il mémorise les paramètres des URL pour éviter les redirections infinies",
      "Il stocke les Server Actions en mémoire pour accélérer les mutations répétées",
    ],
    "b",
    "Le Request Memoization déduplique automatiquement les fetch() avec la même URL dans un même cycle de rendu React. Si layout.js et page.js font tous les deux fetch('/api/session'), Next.js n'exécute la requête qu'une seule fois. Ce cache ne dure que le temps d'un rendu — il ne persiste pas entre requêtes."
  ),

  // ==================================================================
  // DRAG & DROP — 2 questions (15 pts, 120s) — arborescence visuelle
  // ==================================================================
  {
    id: "dragdrop-1",
    type: "dragdrop",
    category: "architecture",
    difficulty: "medium",
    timeLimit: 120,
    points: 15,
    question: "Réorganise l'arborescence du projet Dir Khir pour qu'elle soit correcte et professionnelle.",
    instruction:
      "Glisse les fichiers pour reconstituer la structure correcte du projet. L'indentation représente la hiérarchie des dossiers.",
    items: [
      { id: "1", label: "lib/", depth: 0, icon: "📁", isFolder: true },
      { id: "2", label: "db.js", depth: 1, icon: "📄", isFolder: false },
      { id: "3", label: "auth.js", depth: 1, icon: "📄", isFolder: false },
      { id: "4", label: "models/", depth: 0, icon: "📁", isFolder: true },
      { id: "5", label: "Besoin.js", depth: 1, icon: "📄", isFolder: false },
      { id: "6", label: "Message.js", depth: 1, icon: "📄", isFolder: false },
      { id: "7", label: "app/", depth: 0, icon: "📁", isFolder: true },
      { id: "8", label: "layout.js", depth: 1, icon: "📄", isFolder: false },
      { id: "9", label: "page.js", depth: 1, icon: "📄", isFolder: false },
      { id: "10", label: "besoins/", depth: 1, icon: "📁", isFolder: true },
      { id: "11", label: "page.js", depth: 2, icon: "📄", isFolder: false },
      { id: "12", label: "[id]/", depth: 2, icon: "📁", isFolder: true },
      { id: "13", label: "page.js", depth: 3, icon: "📄", isFolder: false },
      { id: "14", label: "modifier/", depth: 3, icon: "📁", isFolder: true },
      { id: "15", label: "page.js", depth: 4, icon: "📄", isFolder: false },
      { id: "16", label: "api/", depth: 1, icon: "📁", isFolder: true },
      { id: "17", label: "besoins/", depth: 2, icon: "📁", isFolder: true },
      { id: "18", label: "route.js", depth: 3, icon: "📄", isFolder: false },
      { id: "19", label: "proxy.js", depth: 0, icon: "📄", isFolder: false },
    ],
    correctOrder: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
    explanation:
      "L'architecture correcte sépare les utilitaires (lib/), les modèles de données (models/), et l'app (app/) avec ses sous-routes imbriquées. proxy.js est à la racine car c'est un middleware global Next.js 16. Les routes API sont dans app/api/ et les routes de page dans app/ directement.",
  },
  {
    id: "dragdrop-2",
    type: "dragdrop",
    category: "serveractions",
    difficulty: "medium",
    timeLimit: 120,
    points: 15,
    question: "Remets dans l'ordre les étapes du cycle de vie d'une Server Action `creerBesoin` dans Dir Khir.",
    instruction: "Glisse les étapes pour reconstituer le flux correct d'exécution de la Server Action.",
    items: [
      { id: "1", label: "Soumission du formulaire /besoins/creer", depth: 0, icon: "🖱️", isFolder: false },
      { id: "2", label: "Next.js exécute la Server Action côté serveur", depth: 0, icon: "⚙️", isFolder: false },
      { id: "3", label: "Vérification de la session utilisateur", depth: 1, icon: "🔒", isFolder: false },
      { id: "4", label: "Validation des données du formData", depth: 1, icon: "✅", isFolder: false },
      { id: "5", label: "Connexion à MongoDB via connectDB()", depth: 1, icon: "🗄️", isFolder: false },
      { id: "6", label: "Création du document Besoin avec Mongoose", depth: 1, icon: "📝", isFolder: false },
      { id: "7", label: "Appel de revalidatePath('/besoins')", depth: 1, icon: "♻️", isFolder: false },
      { id: "8", label: "redirect() vers la page du besoin créé", depth: 0, icon: "↗️", isFolder: false },
    ],
    correctOrder: ["1","2","3","4","5","6","7","8"],
    explanation:
      "L'ordre est crucial : (1) vérifier la session AVANT de valider les données (on ne révèle pas les erreurs de validation à un non-authentifié), (2) valider les données AVANT de toucher MongoDB, (3) revalidatePath AVANT redirect() car redirect() lève une exception qui interrompt l'exécution.",
  },

  // ==================================================================
  // CODE — 4 questions (15 pts, 60s)
  // ==================================================================
  {
    id: "code-1",
    type: "code",
    category: "architecture",
    difficulty: "medium",
    timeLimit: 60,
    points: 15,
    question:
      "Parmi ces 4 implémentations, laquelle respecte correctement le pattern Server/Client Component pour la page `/besoins` de Dir Khir ?",
    codeSnippet: null,
    options: [
      {
        id: "a",
        text: "Option A — Client Component avec useEffect et fetch vers l'API",
        code: `'use client'
export default function BesoinsPage() {
  const [besoins, setBesoins] = useState([])
  useEffect(() => {
    fetch('/api/besoins').then(r => r.json()).then(setBesoins)
  }, [])
  return <BesoinList besoins={besoins} />
}`,
      },
      {
        id: "b",
        text: "Option B — Server Component async qui utilise useState",
        code: `export default async function BesoinsPage() {
  const besoins = await getBesoinsDirect()
  const [filtre, setFiltre] = useState('tous')
  return <BesoinList besoins={besoins} filtre={filtre} />
}`,
      },
      {
        id: "c",
        text: "Option C — Server Component qui passe les données à un Client Component enfant",
        code: `export default async function BesoinsPage() {
  const besoins = await getBesoinsDirect()
  return <BesoinListClient besoins={besoins} />
}
// BesoinListClient.js -> 'use client' avec useState pour le filtre`,
      },
      {
        id: "d",
        text: "Option D — Server Component qui fetch via l'API Route au lieu de MongoDB directement",
        code: `export default async function BesoinsPage() {
  const res = await fetch('/api/besoins')
  const besoins = await res.json()
  return <BesoinList besoins={besoins} />
}`,
      },
    ],
    correctAnswer: "c",
    explanation:
      "Option C est correcte : le Server Component fetch directement depuis MongoDB (plus performant, pas d'aller-retour réseau superflu) et passe les données au Client Component enfant qui gère le filtre avec useState. Option A fonctionne mais perd tous les avantages des Server Components. Option B est invalide : on ne peut pas mélanger async et useState dans le même composant. Option D fonctionne mais est sous-optimal (double aller-retour réseau).",
  },
  {
    id: "code-2",
    type: "code",
    category: "mongodb",
    difficulty: "hard",
    timeLimit: 60,
    points: 15,
    question: "Quel code de connexion MongoDB est correct pour Next.js avec le pattern singleton ?",
    codeSnippet: null,
    options: [
      {
        id: "a",
        text: "Option A — connect() appelé directement sans aucune mise en cache",
        code: `import mongoose from 'mongoose'
export async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI)
}`,
      },
      {
        id: "b",
        text: "Option B — une variable locale au module sert de cache de connexion",
        code: `import mongoose from 'mongoose'
let connection = null
export async function connectDB() {
  if (!connection) {
    connection = await mongoose.connect(process.env.MONGODB_URI)
  }
}`,
      },
      {
        id: "c",
        text: "Option C — la promesse de connexion est stockée sur l'objet global",
        code: `import mongoose from 'mongoose'
let cached = global._mongoose
if (!cached) cached = global._mongoose = { conn: null, promise: null }
export async function connectDB() {
  if (!cached.conn) {
    cached.promise = cached.promise || mongoose.connect(process.env.MONGODB_URI)
    cached.conn = await cached.promise
  }
  return cached.conn
}`,
      },
      {
        id: "d",
        text: "Option D — connect() est appelé une seule fois au chargement du module",
        code: `import mongoose from 'mongoose'
export const db = mongoose.connect(process.env.MONGODB_URI)`,
      },
    ],
    correctAnswer: "c",
    explanation:
      "Option C est le seul vrai singleton : il utilise global._mongoose pour survivre au hot-reload de Next.js (les modules locaux sont recréés, mais global persiste). Option A crée une nouvelle connexion à chaque appel. Option B utilise une variable locale qui est réinitialisée à chaque hot-reload. Option D appelle connect() au chargement du module, ce qui casse avec les variables d'environnement non encore disponibles.",
  },
  {
    id: "code-3",
    type: "code",
    category: "serveractions",
    difficulty: "medium",
    timeLimit: 60,
    points: 15,
    question: "Parmi ces Server Actions, laquelle gère correctement la suppression sécurisée d'un besoin ?",
    codeSnippet: null,
    options: [
      { id: "a", text: "Supprimer directement par id, sans vérifier session ni propriétaire" },
      { id: "b", text: "Vérifier la session utilisateur, mais pas la propriété du besoin" },
      { id: "c", text: "Vérifier session et propriété avec .toString(), supprimer, revalider puis rediriger" },
      { id: "d", text: "Utiliser un Route Handler DELETE public à la place d'une Server Action" },
    ],
    correctAnswer: "c",
    explanation:
      "Une Server Action de suppression doit obligatoirement : (1) vérifier que l'utilisateur est connecté (session), (2) vérifier qu'il est propriétaire du besoin (comparaison avec .toString() car ObjectId ≠ string), (3) supprimer avec findByIdAndDelete, (4) appeler revalidatePath pour invalider les caches, (5) redirect() pour renvoyer l'utilisateur. Manquer une seule étape crée une faille de sécurité ou un bug de cache.",
  },
  {
    id: "code-4",
    type: "code",
    category: "caching",
    difficulty: "hard",
    timeLimit: 60,
    points: 15,
    question: "Quel fetch() est correctement configuré pour la page ISR `/besoins` avec revalidation de 60 secondes ?",
    codeSnippet: null,
    options: [
      {
        id: "a",
        text: "Option A — cache: 'no-store' pour ne jamais mettre en cache",
        code: `const besoins = await fetch('/api/besoins', {
  cache: 'no-store'
})`,
      },
      {
        id: "b",
        text: "Option B — export const revalidate = 60 au niveau de la page",
        code: `export const revalidate = 60
const besoins = await fetch('/api/besoins')`,
      },
      {
        id: "c",
        text: "Option C — next: { revalidate: 60 } directement dans le fetch",
        code: `const besoins = await fetch('/api/besoins', {
  next: { revalidate: 60 }
})`,
      },
      {
        id: "d",
        text: "Option D — next: { tags et revalidate } combinés dans le fetch",
        code: `const besoins = await fetch('/api/besoins', {
  next: { tags: ['besoins'], revalidate: 60 }
})`,
      },
    ],
    correctAnswer: "d",
    explanation:
      "Option D est la plus complète : elle configure ISR (revalidate: 60) ET ajoute un tag ('besoins') qui permet d'invalider manuellement avec revalidateTag('besoins') dans les Server Actions. Option B fonctionne mais s'applique à toute la page, pas spécifiquement à ce fetch. Option C manque le tag, donc pas d'invalidation manuelle possible. Option A est SSR (pas de cache).",
  },

  // ==================================================================
  // BUG FIX — 3 questions (15 pts, 80s)
  // ==================================================================
  {
    id: "bugfix-1",
    type: "bugfix",
    category: "architecture",
    difficulty: "medium",
    timeLimit: 80,
    points: 15,
    question: "Quel est le bug dans ce code ?",
    bugDescription: "Ce component génère une erreur au démarrage du serveur Next.js.",
    codeWithBug: `'use client'

export default async function ProfilPage() {
  const session = await getSession()
  return <ProfilContent user={session.user} />
}`,
    options: [
      { id: "a", text: "Il manque l'import de getSession depuis next/headers" },
      { id: "b", text: "ProfilContent devrait être importé depuis '@/components' et non défini en ligne" },
      { id: "c", text: "Un composant marqué 'use client' ne peut pas être async — retirer async ou retirer 'use client'" },
      { id: "d", text: "getSession() ne peut pas être appelé dans un Client Component sans useSession()" },
    ],
    correctAnswer: "c",
    explanation:
      "Un composant 'use client' est un composant React classique — les fonctions async ne sont pas valides dans ce contexte. Si tu as besoin de getSession() côté serveur, retire 'use client' (et fais un Server Component). Si tu as besoin d'interactivité, utilise un hook comme useSession() dans le Client Component au lieu d'async/await. Ces deux patterns sont incompatibles dans le même composant.",
  },
  {
    id: "bugfix-2",
    type: "bugfix",
    category: "caching",
    difficulty: "hard",
    timeLimit: 80,
    points: 15,
    question: "Quelle ligne est manquante pour corriger ce bug ?",
    bugDescription:
      "Cette Server Action crée bien le besoin en base de données, mais après la redirection, l'utilisateur ne voit pas son nouveau besoin dans la liste /besoins.",
    codeWithBug: `'use server'
export async function creerBesoin(formData) {
  await connectDB()
  const session = await getSession()
  if (!session) throw new Error('Non autorisé')
  const besoin = new Besoin({
    titre: formData.get('titre'),
    description: formData.get('description'),
    categorie: formData.get('categorie'),
    ville: formData.get('ville'),
    createdBy: session.user.id,
  })
  await besoin.save()
  redirect('/besoins')
}`,
    options: [
      { id: "a", text: "Ajouter await besoin.populate('createdBy') avant le redirect" },
      { id: "b", text: "Ajouter revalidatePath('/besoins') juste avant le redirect('/besoins')" },
      { id: "c", text: "Remplacer redirect('/besoins') par redirect('/besoins?refresh=true')" },
      { id: "d", text: "Ajouter { cache: 'no-store' } dans le fetch de la page /besoins" },
    ],
    correctAnswer: "b",
    explanation:
      "Le besoin est créé en MongoDB mais Next.js sert la version en cache de la page /besoins, qui ne contient pas encore le nouveau besoin. Sans revalidatePath('/besoins'), le Full Route Cache continue de servir l'ancienne liste jusqu'à sa prochaine expiration naturelle. C'est le bug de production le plus fréquent avec les Server Actions : la mutation réussit en base de données mais reste invisible tant que le cache n'est pas explicitement invalidé.",
  },
  {
    id: "bugfix-3",
    type: "bugfix",
    category: "mongodb",
    difficulty: "hard",
    timeLimit: 80,
    points: 15,
    question: "Un utilisateur non connecté qui arrive sur le site tombe dans une boucle de redirections infinies. Quel est le bug ?",
    bugDescription:
      "Le proxy.js redirige vers /connexion quand il n'y a pas de session, mais quelque chose cloche dans sa configuration.",
    codeWithBug: `// proxy.js
import { NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export function proxy(request) {
  const session = getSessionCookie(request)
  if (!session) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}`,
    options: [
      { id: "a", text: "getSessionCookie() ne fonctionne pas côté proxy et retourne toujours null" },
      { id: "b", text: "Le matcher protège aussi /connexion, qui redirige alors vers elle-même en boucle" },
      { id: "c", text: "NextResponse.redirect() doit être appelé avec await dans le proxy" },
      { id: "d", text: "Le proxy doit vérifier request.cookies.session au lieu de getSessionCookie()" },
    ],
    correctAnswer: "b",
    explanation:
      "Le matcher /((?!_next|favicon.ico).*) protège TOUTES les routes, y compris /connexion elle-même. Un utilisateur non connecté qui arrive sur /connexion est donc redirigé... vers /connexion, en boucle infinie. Il faut exclure explicitement /connexion (et /inscription) du matcher, ou ajouter une condition qui laisse passer ces routes publiques avant la vérification de session.",
  },
];

export default questions;
