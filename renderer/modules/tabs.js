import { saveTabMeta, setupAutosave } from './autosave.js';
import { getTitleFromContent } from './titleBar.js';

let tabId = 0;
export const tabs = [];

export function createTab({ content = '', filePath = null, id = 0, tempPath = '' }) {
  id = tabId++;
  const name = filePath ? filePath.split('/').pop() : `Untitled ${id}`;

  // --- Create tab button ---
  const tabButton = document.createElement('div');
  tabButton.className = 'tab-button';
  tabButton.dataset.id = id;
  tabButton.draggable = true;

  const titleSpan = document.createElement('span');
  titleSpan.textContent = name;

  const closeBtn = document.createElement('span');
  closeBtn.textContent = ' ×';
  closeBtn.className = 'close-btn';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(id);
  });

  tabButton.append(titleSpan, closeBtn);
  tabButton.addEventListener('click', () => switchToTab(id));

  // --- Drag and drop for reordering ---
  tabButton.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/tab-id', id);
  });

  tabButton.addEventListener('dragover', (e) => e.preventDefault());

  tabButton.addEventListener('drop', (e) => {
    e.preventDefault();
    const fromId = parseInt(e.dataTransfer.getData('text/tab-id'));
    const toId = parseInt(tabButton.dataset.id);
    if (fromId === toId) return;

    const fromTab = tabs.find((t) => t.id === fromId);
    const toTab = tabs.find((t) => t.id === toId);
    const tabBar = document.getElementById('tab-bar');
    const tabsContainer = document.getElementById('tabs');

    tabBar.insertBefore(fromTab.tabButton, toTab.tabButton);
    tabsContainer.insertBefore(fromTab.tab, toTab.tab);

    const fromIndex = tabs.findIndex((t) => t.id === fromId);
    const toIndex = tabs.findIndex((t) => t.id === toId);
    tabs.splice(toIndex, 0, tabs.splice(fromIndex, 1)[0]);
  });

  document.getElementById('tab-bar').appendChild(tabButton);

  // --- Create tab content ---
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.dataset.id = id;
  tab.dataset.filePath = filePath || '';

  const textarea = document.createElement('textarea');
  textarea.value = content;
  tab.appendChild(textarea);
  document.getElementById('tabs').appendChild(tab);

  const tabData = { id, textarea, tab, tabButton, filePath, tempPath };
  tabs.push(tabData);

  switchToTab(id);
  setTimeout(() => textarea.focus(), 0);

  // --- Auto naming for unsaved files ---
  if (!filePath) tabNamming(tabData, tabButton, textarea);
  textarea.addEventListener('input', () => {
    if (!filePath) tabNamming(tabData, tabButton, textarea);
  });

  // --- Auto save ---
  setupAutosave(tabData, textarea);

  saveTabMeta();
}

export function tabNamming(tabData, tabButton) {
  const newTitle = getTitleFromContent(tabData.textarea.value);
  if (tabData.title !== newTitle) {
    tabData.title = newTitle;
    tabButton.innerHTML = `${newTitle} <span class="close-btn">×</span>`;
    tabButton.querySelector('.close-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      closeTab(tabData.id);
    });
  }
}

export function switchToTab(id) {
  tabs.forEach(({ id: tabId, tab, tabButton }) => {
    const active = tabId === id;
    tab.style.display = active ? 'block' : 'none';
    tabButton.classList.toggle('active', active);
  });
  saveTabMeta();
}

export function closeTab(id) {
  const tabIndex = tabs.findIndex((t) => t.id === id);
  if (tabIndex === -1) return;

  const tabData = tabs[tabIndex];
  tabData.tab.remove();
  tabData.tabButton.remove();
  tabs.splice(tabIndex, 1);

  if (tabs.length > 0) {
    switchToTab(tabs[Math.max(0, tabIndex - 1)].id);
  }

  saveTabMeta();
}

export function getCurrentTab() {
  const tabElement = document.querySelector('.tab[style*="display: block"]');
  if (!tabElement) return null;
  const id = Number(tabElement.dataset.id);
  return tabs.find((t) => t.id === id);
}
