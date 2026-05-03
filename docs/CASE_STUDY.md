# Case Study — Sheet Folders

## Le problème

Sur les projets Google Sheets avec beaucoup de données, on se retrouve facilement avec de multiples onglets. 
Mais Google Sheets ne propose aucun moyen de les organiser : pas de dossiers, pas de groupes, juste une rangée d'onglets à faire défiler horizontalement.

Le workflow habituel pour s'en sortir : renommer les onglets avec des préfixes (`[BUDGET] Mars`, `[BUDGET] Avril`), ou cacher manuellement les feuilles non utilisées. Les deux solutions sont lentes et fastidieuses.

**Question de départ** : est-ce qu'on peut ajouter un système de dossiers directement dans Google Sheets, sans quitter l'interface ?

---

## Contraintes

- Pas de serveur externe — le script doit tourner entièrement dans l'écosystème Google
- Interface dans une sidebar (280px de large, hauteur variable)
- Compatibilité totale avec l'API Google Sheets existante
- Utilisable sans formation par n'importe qui sachant utiliser Google Sheets

---

## Solution

Une extension Apps Script avec une sidebar HTML/CSS/JS qui s'intègre nativement dans Google Sheets.

Le stockage des dossiers et des assignations utilise `PropertiesService.getDocumentProperties()` — un système clé-valeur intégré à Apps Script, sans base de données externe, sans coût.

**Architecture simplifiée :**

```
Sidebar (HTML/JS)          Apps Script (serveur Google)
─────────────────          ────────────────────────────
state local (JS)    ←───   getFullState() — chargement initial
action utilisateur  ───→   createFolder / assignSheet / ...
render() immédiat          PropertiesService (stockage)
                           SpreadsheetApp (onglets)
```

---

## Décisions techniques

### Optimistic UI

Le principal problème de performance avec Apps Script est la latence des appels `google.script.run` (~1-2 secondes chacun). La version initiale rechargait tout l'état après chaque action, ce qui rendait l'interface lente et frustrante.

**Solution** : toutes les actions modifient d'abord l'état local en JavaScript, déclenchent un `render()` immédiat, puis envoient l'appel serveur en arrière-plan. L'interface répond instantanément. En cas d'erreur serveur (rare), un toast avertit l'utilisateur.

```javascript
function optimistic(localUpdate, serverFn, ...args) {
  localUpdate();   // mise à jour instantanée
  render();        // re-render sans latence
  google.script.run
    .withFailureHandler(() => showToast('⚠ Erreur serveur'))
    [serverFn](...args); // sync background
}
```

### Gestion de la visibilité

L'API Google Sheets a deux contraintes non documentées de façon évidente :
1. On ne peut pas masquer la feuille **active**
2. Il doit toujours rester au moins une feuille **visible**

La solution : avant de masquer un groupe de feuilles, activer programmatiquement une feuille qui restera visible. Avant de masquer la feuille active, basculer sur une autre.

### Refresh ciblé

Plutôt que de recharger toute la configuration quand l'utilisateur ouvre l'onglet "Assigner", seule la liste des feuilles est rechargée via `getSheets()`. La config des dossiers (stable) reste en mémoire.

---

## Problèmes rencontrés

**Bug rename** : l'input de renommage était injecté dans le header du dossier, qui avait un `onclick` pour ouvrir/fermer. Cliquer dans l'input déclenchait le toggle → `render()` → l'input disparaissait. Fix : `event.stopPropagation()` sur l'input.

**Bug visibilité** : `hideSheet()` échouait silencieusement sur la feuille active (erreur catchée). Fix : activer d'abord une feuille cible avant de masquer les autres.

**Nouvelles feuilles non détectées** : `state.sheets` était chargé une seule fois au démarrage. Les feuilles créées après n'apparaissaient pas dans l'onglet Assigner. Fix : refresh de la liste à chaque ouverture de l'onglet.

---

## Résultat

- Navigation instantanée entre groupes de feuilles
- Couleurs d'onglets synchronisées automatiquement avec la couleur du dossier
- Suppression avec choix : dissocier ou supprimer définitivement les feuilles
