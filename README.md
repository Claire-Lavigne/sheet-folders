# 📁 Sheet Folders

> Organise tes onglets Google Sheets en dossiers, avec navigation, couleurs et contrôle de visibilité.

Google Sheets ne propose pas de système de dossiers pour les onglets. Sur des fichiers complexes avec 20+ feuilles, retrouver ce qu'on cherche devient vite un problème. **Sheet Folders** résout ça avec une sidebar légère directement intégrée dans Sheets.

![Sheet Folders preview](preview.png)

---

## Fonctionnalités

- **Créer des dossiers** avec nom et couleur personnalisable
- **Assigner des feuilles** à un dossier (la couleur de l'onglet se met à jour automatiquement)
- **Naviguer** directement vers une feuille depuis la sidebar
- **Masquer / afficher** un dossier entier ou feuille par feuille
- **Supprimer** un dossier avec choix : dissocier les feuilles ou les supprimer définitivement
- **UI réactive** — les actions sont instantanées (optimistic updates), la synchro serveur tourne en arrière-plan

---

## Installation

### 1. Ouvre l'éditeur Apps Script

Dans ton Google Sheet : **Extensions → Apps Script**

### 2. Crée les fichiers

**Fichier `Code.gs`** (remplace le contenu existant) → colle le contenu de [`Code.gs`](Code.gs)

**Fichier `Sidebar.html`** (nouveau fichier HTML) → colle le contenu de [`Sidebar.html`](Sidebar.html)

> Dans l'éditeur : clique sur **+** à côté de "Fichiers" → choisis **HTML** → nomme-le exactement `Sidebar`

### 3. Sauvegarde et recharge

`Ctrl+S` dans l'éditeur, puis **rafraîchis** ton Google Sheet.  
Le menu **📁 Dossiers** apparaît dans la barre de menu.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Interface | HTML · CSS · JavaScript vanilla |
| Logique serveur | Google Apps Script (JavaScript) |
| Stockage | `PropertiesService` (clé-valeur Google) |
| Déploiement | Natif dans Google Sheets, sans serveur |

---

## Choix techniques notables

**Optimistic UI** — chaque action met à jour l'état local immédiatement sans attendre le serveur. L'appel Apps Script tourne en arrière-plan. Résultat : zéro latence perçue pour l'utilisateur.

**Un seul `getFullState()` au chargement** — après l'init, le client maintient son propre état en mémoire. Les fonctions serveur font chacune 1 read + 1 write sur `PropertiesService`, rien de plus.

**Refresh ciblé** — l'onglet "Assigner" recharge uniquement la liste des feuilles (`getSheets()`) à chaque ouverture, pour détecter les nouvelles feuilles sans recharger toute la config.

---

## Limitations connues

- Google Sheets exige au minimum une feuille visible — le script gère ce cas et refuse de tout masquer
- On ne peut pas masquer la feuille active — le script bascule automatiquement sur une autre avant de masquer
- Les dossiers sont liés au fichier (stockage `DocumentProperties`), pas à l'utilisateur

---

## Auteur

Claire — développeuse front-end  
[Portfolio](#) · [GitHub](#)
