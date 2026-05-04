// =====================================================
// SHEET FOLDERS — Google Apps Script
// =====================================================

const STORAGE_KEY = 'sheetFolders';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📁 Sheet Folders')
    .addItem('Gérer les dossiers', 'openSidebar')
    .addToUi();
}

function openSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('📁 Sheet Folders')
    .setWidth(280);
  SpreadsheetApp.getUi().showSidebar(html);
}

function getData() {
  const raw = PropertiesService.getDocumentProperties().getProperty(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { folders: {}, assignments: {} };
}

function saveData(data) {
  PropertiesService.getDocumentProperties().setProperty(STORAGE_KEY, JSON.stringify(data));
}

function getSheets() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()
    .map(s => ({ name: s.getName(), index: s.getIndex(), hidden: s.isSheetHidden() }));
}

function getFullState() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    data: getData(),
    sheets: ss.getSheets().map(s => ({
      name:   s.getName(),
      index:  s.getIndex(),
      hidden: s.isSheetHidden()
    }))
  };
}

function createFolder(name, color) {
  const data = getData();
  const id   = 'f_' + Date.now();
  data.folders[id] = { name, color: color || '' };
  saveData(data);
  return id;
}

function renameFolder(folderId, newName) {
  const data = getData();
  if (!data.folders[folderId]) return;
  data.folders[folderId].name = newName;
  saveData(data);
}

function updateFolderColor(folderId, color) {
  const data = getData();
  if (!data.folders[folderId]) return;
  data.folders[folderId].color = color;
  saveData(data);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  for (const sheetName in data.assignments) {
    if (data.assignments[sheetName] !== folderId) continue;
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) sheet.setTabColor(color || null);
  }
}

// Supprime le dossier et dissocie les feuilles (les feuilles sont conservées)
function deleteFolder(folderId) {
  const data = getData();
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  for (const sheetName in data.assignments) {
    if (data.assignments[sheetName] !== folderId) continue;
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      sheet.setTabColor(null);
      sheet.showSheet();
    }
    delete data.assignments[sheetName];
  }
  delete data.folders[folderId];
  saveData(data);
}

// Supprime le dossier ET toutes les feuilles associées
function deleteFolderAndSheets(folderId) {
  const data = getData();
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const sheetsToDelete = [];

  for (const sheetName in data.assignments) {
    if (data.assignments[sheetName] === folderId) sheetsToDelete.push(sheetName);
  }

  // Vérifier qu'il restera au moins une feuille après suppression — AVANT toute modification
  const allSheets = ss.getSheets();
  const remaining = allSheets.filter(s => !sheetsToDelete.includes(s.getName()));
  if (remaining.length === 0) return false;

  sheetsToDelete.forEach(name => delete data.assignments[name]);
  delete data.folders[folderId];
  saveData(data);

  // Activer une feuille qui survivra avant de supprimer
  ss.setActiveSheet(remaining[0]);
  sheetsToDelete.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) ss.deleteSheet(sheet);
  });
  return true;
}

function assignSheet(sheetName, folderId) {
  const data = getData();
  if (!folderId) {
    delete data.assignments[sheetName];
  } else {
    data.assignments[sheetName] = folderId;
  }
  saveData(data);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return;
  const color = folderId && data.folders[folderId] ? data.folders[folderId].color : null;
  sheet.setTabColor(color || null);
}

function goToSheet(sheetName) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (sheet) ss.setActiveSheet(sheet);
}

// Basculer visibilité d'un dossier (sans toucher aux autres dossiers)
function toggleFolderVisibility(folderId, makeVisible) {
  const data      = getData();
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();

  const folderSheets = allSheets.filter(s => data.assignments[s.getName()] === folderId);
  if (folderSheets.length === 0) return false;

  if (makeVisible) {
    folderSheets.forEach(s => s.showSheet());
    return true;
  }

  // Pour masquer : s'assurer qu'il reste au moins une feuille visible ailleurs
  const visibleElsewhere = allSheets.filter(s =>
    data.assignments[s.getName()] !== folderId && !s.isSheetHidden()
  );
  if (visibleElsewhere.length === 0) return false;

  // Activer une feuille hors du dossier pour libérer la feuille active
  ss.setActiveSheet(visibleElsewhere[0]);
  folderSheets.forEach(s => { try { s.hideSheet(); } catch(e) {} });
  return true;
}

function showAllSheets() {
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(s => s.showSheet());
}

// Visibilité individuelle par feuille
function showSheetByName(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (sheet) sheet.showSheet();
}

function hideSheetByName(sheetName) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  const visibleOthers = ss.getSheets().filter(s => s.getName() !== sheetName && !s.isSheetHidden());
  if (visibleOthers.length === 0) return;
  if (ss.getActiveSheet().getName() === sheetName) ss.setActiveSheet(visibleOthers[0]);
  sheet.hideSheet();
}
