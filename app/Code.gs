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

// Un seul appel getDocumentProperties() au lieu de deux (getData + saveData)
function modifyData(fn) {
  const props = PropertiesService.getDocumentProperties();
  const raw   = props.getProperty(STORAGE_KEY);
  const data  = raw ? JSON.parse(raw) : { folders: {}, assignments: {} };
  fn(data);
  props.setProperty(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function getSheets() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()
    .map(s => ({ name: s.getName(), index: s.getIndex(), hidden: s.isSheetHidden() }));
}

function getFullState() {
  const raw = PropertiesService.getDocumentProperties().getProperty(STORAGE_KEY);
  return {
    data:   raw ? JSON.parse(raw) : { folders: {}, assignments: {} },
    sheets: getSheets()
  };
}

function createFolder(name, color) {
  const id = 'f_' + Date.now();
  modifyData(d => { d.folders[id] = { name, color: color || '' }; });
  return id;
}

function renameFolder(folderId, newName) {
  modifyData(d => { if (d.folders[folderId]) d.folders[folderId].name = newName; });
}

function updateFolderColor(folderId, color) {
  const data = modifyData(d => { if (d.folders[folderId]) d.folders[folderId].color = color; });
  if (!data.folders[folderId]) return;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // sheetMap évite O(n×m) getSheetByName en boucle → O(1) par lookup
  const sheetMap = Object.fromEntries(ss.getSheets().map(s => [s.getName(), s]));
  for (const name in data.assignments) {
    if (data.assignments[name] !== folderId) continue;
    sheetMap[name]?.setTabColor(color || null);
  }
}

// Supprime le dossier et dissocie les feuilles (conservées)
function deleteFolder(folderId) {
  const ss       = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMap = Object.fromEntries(ss.getSheets().map(s => [s.getName(), s]));
  modifyData(d => {
    for (const name in d.assignments) {
      if (d.assignments[name] !== folderId) continue;
      const sheet = sheetMap[name];
      if (sheet) { sheet.setTabColor(null); sheet.showSheet(); }
      delete d.assignments[name];
    }
    delete d.folders[folderId];
  });
}

// Supprime le dossier ET toutes les feuilles associées
function deleteFolderAndSheets(folderId) {
  const props     = PropertiesService.getDocumentProperties();
  const raw       = props.getProperty(STORAGE_KEY);
  const data      = raw ? JSON.parse(raw) : { folders: {}, assignments: {} };
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();
  const sheetMap  = Object.fromEntries(allSheets.map(s => [s.getName(), s]));
  const toDelete  = Object.keys(data.assignments).filter(n => data.assignments[n] === folderId);
  const remaining = allSheets.filter(s => !toDelete.includes(s.getName()));
  if (!remaining.length) return false;

  toDelete.forEach(n => delete data.assignments[n]);
  delete data.folders[folderId];
  props.setProperty(STORAGE_KEY, JSON.stringify(data));

  ss.setActiveSheet(remaining[0]);
  toDelete.forEach(n => { if (sheetMap[n]) ss.deleteSheet(sheetMap[n]); });
  return true;
}

function assignSheet(sheetName, folderId) {
  const data = modifyData(d => {
    if (!folderId) delete d.assignments[sheetName];
    else d.assignments[sheetName] = folderId;
  });
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (sheet) sheet.setTabColor((folderId && data.folders[folderId]?.color) || null);
}

function goToSheet(sheetName) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (sheet) ss.setActiveSheet(sheet);
}

// Basculer visibilité d'un dossier (sans toucher aux autres dossiers)
function toggleFolderVisibility(folderId, makeVisible) {
  const raw       = PropertiesService.getDocumentProperties().getProperty(STORAGE_KEY);
  const parsed    = raw ? JSON.parse(raw) : { folders: {}, assignments: {} };
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();
  const folderSheets = allSheets.filter(s => parsed.assignments[s.getName()] === folderId);
  if (!folderSheets.length) return false;

  if (makeVisible) { folderSheets.forEach(s => s.showSheet()); return true; }

  const visibleElsewhere = allSheets.filter(s =>
    parsed.assignments[s.getName()] !== folderId && !s.isSheetHidden()
  );
  if (!visibleElsewhere.length) return false;

  ss.setActiveSheet(visibleElsewhere[0]);
  folderSheets.forEach(s => { try { s.hideSheet(); } catch(e) {} });
  return true;
}

function showAllSheets() {
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(s => s.showSheet());
}

// Visibilité individuelle — remplace showSheetByName / hideSheetByName
function setSheetVisible(name, show) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) return;
  if (show) { sheet.showSheet(); return; }
  const others = ss.getSheets().filter(s => s.getName() !== name && !s.isSheetHidden());
  if (!others.length) return;
  if (ss.getActiveSheet().getName() === name) ss.setActiveSheet(others[0]);
  sheet.hideSheet();
}
