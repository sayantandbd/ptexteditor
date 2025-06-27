import { saveTabMeta } from './autosave.js';

export function saveAs(tab) {
  const content = tab.textarea.value;
  window.api.saveAsFile(content).then((filePath) => {
    if (filePath) {
      tab.tab.dataset.filePath = tab.filePath = filePath;
      tab.tabButton.firstChild.textContent = filePath.split('/').pop();
      console.log(tab);
      saveTabMeta();
    }
  });
}
