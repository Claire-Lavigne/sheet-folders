# Case Study — Sheet Folders

## Contexte

Google Sheets n'offre aucun outil pour organiser les onglets. Sur 20+ feuilles, retrouver ce qu'on cherche devient pénible.  
Sheet Folders ajoute un système de dossiers directement dans une sidebar native.

## Méthode

Implémenté avec Claude.ai. Mon rôle : spécifier, tester, repérer les bugs, diriger les correctifs. Je n'ai pas écrit le code.

---

## Fonctionnalités

| | |
|---|---|
| Dossiers | Créer avec nom et couleur — synchronisée automatiquement sur les onglets |
| Assignation | Associer des feuilles à un dossier |
| Navigation | Aller sur une feuille directement depuis la sidebar |
| Visibilité | Masquer / afficher un dossier entier ou feuille par feuille |
| Gestion | Renommer, supprimer — avec choix de dissocier les feuilles ou supprimer tout le dossier |

---

## Contraintes API Google Sheets

| Contrainte | Solution |
|---|---|
| Sidebar limitée à 280px | Pas contournable — design adapté |
| Impossible de masquer la feuille active | Basculer sur une autre feuille avant de masquer |
| Impossible de masquer toutes les feuilles | Vérification côté client avant tout appel serveur |
| Latence par appel asynchrone `google.script.run` | Optimistic UI — mise à jour de l'état local, sync serveur en arrière-plan pour + de rapidité |

---

## Décisions

| | |
|---|---|
| Accessibilité | Balises HTML natives (`<button>`, `<select>`, `<input>`) — navigation clavier fonctionnelle |
| UX | Contrôles contextuels visibles uniquement quand pertinents — retour immédiat via toast sans bloquer l'interface — Design moderne et intuitif |
