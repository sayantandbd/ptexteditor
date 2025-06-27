import { tempDir } from '../index.js';
import { createTab, tabs } from './tabs.js';

export function setupAutosave(tabData, textarea) {
  let lastSavedContent = '';
  let debounceTimer;

  textarea.addEventListener('input', () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const content = textarea.value;
      const lines = content.split('\n');

      if (lines.length < 5 || content === lastSavedContent) return;

      lastSavedContent = content;

      const filePath = tabData.filePath;

      if (filePath) {
        window.api.saveFile(filePath, content);
      } else {
        if (!tabData.tempPath) {
          tabData.tempPath = `${tempDir}/temp-${tabData.id}.txt`;
        }
        window.api.saveFile(tabData.tempPath, content);
        saveTabMeta();
      }
    }, 1000); // debounce time: 1 second after typing stops
  });
}

export function saveTabMeta() {
  const openTabs = tabs.map((t) => ({
    id: t.id,
    filePath: t.filePath,
    tempPath: t.tempPath,
  }));
  localStorage.setItem('openTabs', JSON.stringify(openTabs));
}

export function restoreTabs() {
  const stored = JSON.parse(localStorage.getItem('openTabs') || '[]');
  stored.forEach(async (tabMeta) => {
    const pathToLoad = tabMeta.filePath || tabMeta.tempPath;
    if (!pathToLoad) return;
    const content = await window.api.readFile(pathToLoad);
    createTab({
      content,
      filePath: tabMeta.filePath,
      id: tabMeta.id,
      tempPath: tabMeta.tempPath,
    });
  });
  return stored.length;
}
