let tabId = 0;
const tabs = [];
let tempDir;

function createTab({ content = '', filePath = null }) {
  const id = tabId++;
  const name = filePath ? filePath.split('/').pop() : `Untitled ${id}`;

  // --- Create tab button ---
  const tabButton = document.createElement('div');
  tabButton.className = 'tab-button';
  tabButton.dataset.id = id;

  // ⬇️ Add this draggable section here ⬇️
  tabButton.draggable = true;

  tabButton.addEventListener('dragstart', (e) => {
    console.log('drag start');
    e.dataTransfer.setData('text/tab-id', id);
  });

  tabButton.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  tabButton.addEventListener('drop', (e) => {
    e.preventDefault();
    const fromId = parseInt(e.dataTransfer.getData('text/tab-id'));
    const toId = parseInt(tabButton.dataset.id);
    if (fromId === toId) return;

    const fromTab = tabs.find(t => t.id === fromId);
    const toTab = tabs.find(t => t.id === toId);

    const tabBar = document.getElementById('tab-bar');
    tabBar.insertBefore(fromTab.tabButton, toTab.tabButton);

    const tabsContainer = document.getElementById('tabs');
    tabsContainer.insertBefore(fromTab.tab, toTab.tab);

    const fromIndex = tabs.findIndex(t => t.id === fromId);
    const toIndex = tabs.findIndex(t => t.id === toId);
    const [moved] = tabs.splice(fromIndex, 1);
    tabs.splice(toIndex, 0, moved);
  });

  // Continue creating tab button UI
  const titleSpan = document.createElement('span');
  titleSpan.textContent = name;

  const closeBtn = document.createElement('span');
  closeBtn.textContent = ' ×';
  closeBtn.className = 'close-btn';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(id);
  });

  tabButton.appendChild(titleSpan);
  tabButton.appendChild(closeBtn);

  tabButton.addEventListener('click', () => switchToTab(id));
  document.getElementById('tab-bar').appendChild(tabButton);

  // Create tab content
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.dataset.id = id;
  tab.dataset.filePath = filePath || '';

  const textarea = document.createElement('textarea');
  textarea.value = content;
  tab.appendChild(textarea);
  document.getElementById('tabs').appendChild(tab);
  const tabData = { id, textarea, tab, tabButton, filePath };
  tabs.push(tabData);
  switchToTab(id);
  setTimeout(() => textarea.focus(), 0);

  // file name update
  textarea.addEventListener('input', () => {
    if (!filePath) { // Only for new/unsaved files
      const updatedTitle = getTitleFromContent(textarea.value);
      tabButton.innerHTML = `${updatedTitle} <span class="close-btn">×</span>`;

      // regain
      tabButton.querySelector('.close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(id);
      });
    }
  });

  //auto save
  setupAutosave(tabData, textarea);

  
}


function switchToTab(id) {
  tabs.forEach(({ id: tabId, tab, tabButton }) => {
    const isActive = tabId === id;
    tab.style.display = isActive ? 'block' : 'none';
    tabButton.classList.toggle('active', isActive);
  });
}

function closeTab(id) {
  const tabIndex = tabs.findIndex(t => t.id === id);
  if (tabIndex === -1) return;

  const tabData = tabs[tabIndex];

  // Remove elements
  tabData.tab.remove();
  tabData.tabButton.remove();

  // Remove from array
  tabs.splice(tabIndex, 1);

  // Show another tab if any
  if (tabs.length > 0) {
    switchToTab(tabs[Math.max(0, tabIndex - 1)].id);
  }

  saveTabMeta();
}

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

function saveAs(tab) {
  const content = tab.textarea.value;
  window.api.saveAsFile(content).then(filePath => {
    if (filePath) {
      tab.tab.dataset.filePath = filePath;
      tab.tabButton.firstChild.textContent = filePath.split('/').pop();
    }
  });
}

function getCurrentTab() {
  const tabElement = document.querySelector('.tab[style*="display: block"]');
  if (!tabElement) return null;
  const id = Number(tabElement.dataset.id);
  return tabs.find(t => t.id === id);
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Tab') {
    e.preventDefault();
    const currentIndex = tabs.findIndex(t => t.tab.style.display === 'block');
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % tabs.length;
      switchToTab(tabs[nextIndex].id);
    }
  }
});

// FILE DRAG AND DROP FEATURE
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', async (e) => {
  e.preventDefault();

  const files = Array.from(e.dataTransfer.files);

  for (const file of files) {
    console.log(files);
    if (file.name.endsWith('.txt')) {
      const filePath = file.path;

      if (!filePath || typeof filePath !== 'string') {
        alert('File path not available. Please grant file access permission to the app.');
        console.error('Invalid file path:', filePath);
        continue;
      }

      const alreadyOpen = tabs.some(t => t.tab.dataset.filePath === filePath);
      if (!alreadyOpen) {
        const content = await window.api.readFile(filePath);
        createTab({ content, filePath });
      }
    }
  }
});


window.addEventListener('drop', async (e) => {
  e.preventDefault();

  const files = Array.from(e.dataTransfer.files);

  for (const file of files) {
    console.log('Dragged file:', file);
    console.log('file.path:', file.path);
  }
});


// FILE NAME AUTOMATICALLY

function getTitleFromContent(content) {
  if (!content) return 'Untitled';

  const firstLine = content.split('\n')[0].trim();
  const words = firstLine.split(/\s+/).slice(0, 5); // max 5 words
  return words.join(' ') || 'Untitled';
}


// autosave

function setupAutosave(tabData, textarea) {
  let lastSavedContent = '';

  console.log(tabData, textarea);

  setInterval(() => {
    const content = textarea.value;
    const lines = content.split('\n');

    if (lines.length < 5 || content === lastSavedContent) return;

    lastSavedContent = content;

    const filePath = tabData.filePath;

    if (filePath) {
      // Save to actual file
      window.api.saveFile(filePath, content);
    } else {
      // Save to temporary file
      if (!tabData.tempPath) {
        tabData.tempPath = `${tempDir}/temp-${tabData.id}.txt`;
      }
      window.api.saveFile(tabData.tempPath, content);
    }

    saveTabMeta(); // store for reopen
  }, 3000); // autosave every 3s
}

// restore feature
function saveTabMeta() {
  const openTabs = tabs.map(t => ({
    id: t.id,
    filePath: t.filePath,
    tempPath: t.tempPath,
  }));
  localStorage.setItem('openTabs', JSON.stringify(openTabs));
}

function restoreTabs() {
  const stored = JSON.parse(localStorage.getItem('openTabs') || '[]');
  console.log(stored);
  stored.forEach(async tabMeta => {
    const pathToLoad = tabMeta.filePath || tabMeta.tempPath;
    if (!pathToLoad) return;
    const content = await window.api.readFile(pathToLoad);
    createTab({
      content,
      filePath: tabMeta.filePath,
      id: tabMeta.id,
      tempPath: tabMeta.tempPath
    });
  });
  return stored.length;
}

window.addEventListener('DOMContentLoaded', () => {
  tempDir = window.api.getTempDir();
  console.log(tempDir);
  
  if(restoreTabs()==0) {
    // open blank tab
    createTab({});
  };
});


// title bar

document.getElementById('min-btn').addEventListener('click', () => {
  window.electronAPI.minimize();
});

document.getElementById('max-btn').addEventListener('click', () => {
  window.electronAPI.maximizeOrRestore();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.electronAPI.close();
});