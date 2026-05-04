# 📁 Sheet Folders

Sheet Folders est une extension Google Sheets (Apps Script + HTML/CSS/JS vanilla) qui organise les onglets Google Sheets en dossiers — navigation, couleurs et visibilité directement dans une sidebar.  

![Sheet Folders preview](/docs/demo.mp4)

---

## Fonctionnalités
- **Dossiers** — créer avec nom et couleur, synchronisée automatiquement sur les onglets
- **Assignation** — associer des feuilles à un dossier
- **Navigation** — aller sur une feuille directement depuis la sidebar
- **Visibilité** — masquer / afficher un dossier entier ou feuille par feuille
- **Gestion** — renommer, supprimer — avec choix de dissocier les feuilles ou supprimer tout le dossier

---

## Installation

> ⭐ Si cet outil t'est utile, une étoile sur le repo est la meilleure façon de me le faire savoir.

### 1. Ouvre l'éditeur Apps Script

Dans ton Google Sheet : **Extensions → Apps Script**

### 2. Crée les fichiers

**Fichier `Code.gs`** (remplace le contenu existant) → colle le contenu de [`Code.gs`](/app/Code.gs)

**Fichier `Sidebar.html`** (nouveau fichier HTML) → colle le contenu de [`Sidebar.html`](/app/Sidebar.html)

> Dans l'éditeur : clique sur **+** à côté de "Fichiers" → choisis **HTML** → nomme-le exactement `Sidebar`

### 3. Sauvegarde et recharge

`Ctrl+S` dans l'éditeur, puis **rafraîchis** ton Google Sheet.  
Le menu **📁 Sheet Folders** apparaît dans la barre de menu.

https://github.com/user-attachments/assets/153a2849-82bc-49ae-864a-f2cfbdd42833

### 4. Autorisation requise

Au premier lancement, Google affiche un avertissement de sécurité.  
C'est normal pour tout script non publié officiellement.

1. Clique sur **Avancé**
2. Clique sur **Accéder à Sheet Folders (non sécurisé)**
3. Accepte les permissions

Le script accède uniquement au fichier Google Sheets dans lequel  
il est installé — rien d'autre.

https://github.com/user-attachments/assets/eb4d1866-7708-435c-98f6-12c72ba09319

---

## Stack technique

| Couche | Technologie |
|---|---|
| Interface | HTML · CSS · JavaScript vanilla |
| Logique serveur | Google Apps Script (JavaScript) |
| Stockage | `PropertiesService` (clé-valeur Google) |
| Déploiement | Natif dans Google Sheets, sans serveur |

---

## Méthode de développement

Ce projet a été implémenté avec Claude.ai (Anthropic) comme outil de génération de code.
Mon rôle : identifier le problème, décrire précisément les fonctionnalités et l'UI souhaitées, tester le résultat, repérer les bugs et les comportements inattendus, puis diriger les correctifs et ajustements par itérations successives.  

---

## TODO

- mettre à jour vidéo demo
- créer visibilité

Le fichier Agents.md est inspiré de [211abhi](https://github.com/211abhi/Project0/blob/main/Agents.md)  
Le fichier SKILL.md provient de [anthropics](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)
