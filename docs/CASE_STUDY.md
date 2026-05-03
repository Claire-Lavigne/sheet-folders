# Case Study — Sheet Folders

## Contexte

Sur les fichiers Google Sheets complexes, les onglets s'accumulent rapidement. Google Sheets ne propose aucun outil pour les organiser — pas de groupes, pas de dossiers, juste une rangée à faire défiler.

**Question de départ** : est-ce qu'on peut ajouter un système de dossiers directement dans Google Sheets, sans quitter l'interface ?

---

## Méthode

Ce projet a été construit avec [Claude.ai](https://claude.ai) comme outil d'implémentation. Je n'ai pas écrit le code moi-même — j'ai spécifié, testé, repéré les bugs et validé les correctifs.

---

## Contraintes techniques

| Contrainte | Raison |
|---|---|
| Pas de serveur externe | Tout doit tourner dans l'écosystème Google |
| Sidebar de 280px | Limite imposée par l'API Google Sheets |
| Pas de compte utilisateur | Aucune donnée ne quitte le fichier |
| Zéro dépendance externe | Installable sans npm, sans build |
| Utilisable sans formation | Outil personnel, pas d'onboarding possible |

---

## Problèmes rencontrés

### Architecture & performance

| Problème | Contrainte | Solution | Résultat |
|---|---|---|---|
| Latence de 1–2s sur chaque action serveur | `google.script.run` est asynchrone et lent | Optimistic UI — l'état local se met à jour immédiatement, le serveur sync en arrière-plan | Interface instantanée, latence invisible |
| Rechargement global après chaque action | Sans état local, chaque action rechargeait tout | Un seul `getFullState()` au démarrage, état géré côté client ensuite | Zéro rechargement visible |
| Deux appels `init()` au chargement | Deux balises `<script>` dans le HTML par accident | Suppression du bloc script dupliqué | Plus de doublon de dossier à la création |

### Contraintes de l'API Google Sheets

| Problème | Contrainte | Solution | Résultat |
|---|---|---|---|
| Impossible de masquer la feuille active | Limitation de l'API `hideSheet()` | Basculer sur une autre feuille avant de masquer | Masquage fiable sans erreur |
| Impossible de masquer toutes les feuilles | Google Sheets exige au moins une feuille visible | Vérification côté client avant tout appel serveur | Blocage propre avec message explicite |
| Couleur bleue appliquée automatiquement | `createFolder` utilisait `'#4A90D9'` comme fallback | Stocker `''` si pas de couleur, passer `null` à `setTabColor()` | Onglets sans couleur respectés |

### Interface & UX

| Problème | Contrainte | Solution | Résultat |
|---|---|---|---|
| Clic sur input de renommage fermait le dossier | Le `onclick` du header se propageait jusqu'à l'input | `event.stopPropagation()` sur l'input | Renommage stable |
| Valider avec "Renommer" n'est pas intuitif | Le bouton ouvrait l'input mais ne validait pas | Remplacement par "✓ Valider" et "✕ Annuler" au moment de l'édition | Flow de renommage clair |
| Panel de suppression restait ouvert après "Renommer" | Deux actions indépendantes sans se connaître | `querySelectorAll('.delete-confirm').forEach(el => el.remove())` dans `startRename()` | États proprement réinitialisés |
| Supprimer un dossier vide demandait quoi faire des 0 feuilles | Panel générique pour tous les cas | Suppression directe si `count === 0`, panel uniquement si des feuilles sont présentes | Moins de clics pour les cas simples |
| Nouvelles feuilles non détectées dans "Assigner" | L'état était chargé une seule fois au démarrage | Refresh de la liste des feuilles à chaque ouverture de l'onglet Assigner | Feuilles toujours à jour |

### Color picker

| Problème | Contrainte | Solution | Résultat |
|---|---|---|---|
| `<input type="color">` natif non embarquable inline | Fenêtre système séparée, incontrôlable | Color picker custom HTML/CSS/JS avec gradient SL + slider teinte + input hex | Picker entièrement dans la sidebar |
| `onfocus` fermait le panel avant l'ouverture du picker | Événement déclenché trop tôt | Suppression du `onfocus`, fermeture sur `onchange` uniquement | Picker natif utilisable sans fermeture intempestive |
| `swatch.style.background` retournait `rgb()` au lieu de `#hex` | Le navigateur convertit les couleurs à la lecture | Stockage du hex brut dans `dataset.color`, lecture depuis là | Couleur correctement transmise au serveur |
| Aucune option "pas de couleur" dans le picker natif | Limitation du navigateur | Pastille dédiée avec rond barré + `null` passé à `setTabColor()` | Dossiers sans couleur fonctionnels |

---

## Résultats

| Objectif | Atteint |
|---|---|
| Organiser les onglets en dossiers | ✓ |
| Navigation directe depuis la sidebar | ✓ |
| Couleurs synchronisées avec les onglets | ✓ |
| Masquage par dossier ou par feuille | ✓ |
| Interface sans latence visible | ✓ |
| Zéro serveur externe | ✓ |
| Zéro dépendance | ✓ |
