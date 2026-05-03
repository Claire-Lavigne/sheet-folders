# 📁 Sheet Folders

Google Sheets ne propose pas de système de dossiers. Sur un fichier avec 20+ feuilles, retrouver ce qu'on cherche devient vite pénible. 

Avec Sheet Folders, organise tes onglets Google Sheets en dossiers, avec navigation, couleurs et contrôle de visibilité  — directement dans une sidebar.  

![Sheet Folders preview](/docs/preview.gif)

---

## Fonctionnalités

- **Créer des dossiers** avec nom et couleur personnalisable (la couleur de l'onglet se met à jour automatiquement)
- **Assigner des feuilles** à un dossier
- **Naviguer** directement vers une feuille depuis la sidebar
- **Masquer / afficher** un dossier entier ou feuille par feuille
- **Renommer** un dossier
- **Supprimer** un dossier avec choix : dissocier les feuilles ou les supprimer définitivement

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

### 4. Autorisation requise

Au premier lancement, Google affiche un avertissement de sécurité.  
C'est normal pour tout script non publié officiellement.

1. Clique sur **Avancé**
2. Clique sur **Accéder à Sheet Folders (non sécurisé)**
3. Accepte les permissions

Le script accède uniquement au fichier Google Sheets dans lequel  
il est installé — rien d'autre.

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

## A faire

- Améliorer le code
- Ajouter un gif pour montrer l'app
  
---
