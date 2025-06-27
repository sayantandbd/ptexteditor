import { saveAs } from './fileManager.js';
import { createTab, getCurrentTab } from './tabs.js';

export function bindMenuEvents() {
  window.api.onMenu('menu-new', () => createTab({}));

  window.api.onMenu('menu-save', () => {
    const tab = getCurrentTab();
    if (tab) {
      const content = tab.textarea.value;
      const filePath = tab.tab.dataset.filePath;
      if (filePath) {
        window.api.saveFile({ filePath, content });
      } else {
        saveAs(tab);
      }
    }
  });

  window.api.onMenu('menu-save-as', () => {
    const tab = getCurrentTab();
    if (tab) saveAs(tab);
  });

  window.api.onFileOpened(({ filePath, content }) => {
    createTab({ content, filePath });
  });
}

export function bindKeyEvents() {}

export function bindFileEvents() {}
