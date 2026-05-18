# Case Study — Sheet Folders

## Contexte

Google Sheets n'offre aucun outil pour organiser les onglets. Sur 20+ feuilles, retrouver ce qu'on cherche devient pénible.  
Sheet Folders ajoute un système de dossiers directement dans une sidebar native, avec une interface moderne et intuitive.

## Méthode

Implémenté avec Claude.ai.  
Mon rôle : spécifier les fonctionnalités et l'UX/UI, tester, repérer les bugs et comportements inattendus, diriger les correctifs.
  
## Fonctionnalités

<table>
    <tbody>
        <tr>
            <td>Dossiers</td>
            <td>Créer avec nom et couleur — synchronisée automatiquement sur les onglets</td>
        </tr>
        <tr>
            <td>Assignation</td>
            <td>Associer des feuilles à un dossier</td>
        </tr>
        <tr>
            <td>Navigation</td>
            <td>Aller sur une feuille directement depuis la sidebar</td>
        </tr>
        <tr>
            <td>Visibilité</td>
            <td>Masquer / afficher un dossier entier ou feuille par feuille</td>
        </tr>
        <tr>
            <td>Gestion</td>
            <td>Renommer, supprimer — avec choix de dissocier les feuilles ou supprimer tout le dossier</td>
        </tr>
        <tr>
            <td>Accessibilité</td>
            <td>Balises HTML natives — navigation clavier fonctionnelle</td>
        </tr>
    </tbody>
</table>
  
  
## Contraintes API Google Sheets

| Contrainte | Solution |
|---|---|
| Sidebar limitée à 280px | Pas contournable — design adapté |
| Impossible de masquer la feuille active | Basculer sur une autre feuille avant de masquer |
| Impossible de masquer toutes les feuilles | Vérification côté client avant tout appel serveur |
| Latence par appel asynchrone `google.script.run` | Optimistic UI — mise à jour de l'état local, sync serveur en arrière-plan pour + de rapidité |
  
