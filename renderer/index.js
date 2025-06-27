import { restoreTabs } from './modules/autosave.js';
import { bindKeyEvents, bindMenuEvents } from './modules/events.js';
import { createTab, switchToTab, tabs } from './modules/tabs.js';
export let tempDir;
window.addEventListener('DOMContentLoaded', () => {
  bindMenuEvents();
  bindKeyEvents();

  console.log('dom content loaded');
  tempDir = window.api.getTempDir();
  console.log(tempDir);

  if (restoreTabs() == 0) {
    // open blank tab
    createTab({});
  }
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Tab') {
    e.preventDefault();
    const currentIndex = tabs.findIndex((t) => t.tab.style.display === 'block');
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % tabs.length;
      switchToTab(tabs[nextIndex].id);
    }
  }
});
