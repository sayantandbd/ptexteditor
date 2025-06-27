<p align="center">
  <img src="https://i.ibb.co/CsPQm18Q/icon.png" alt="App Icon" width="120" height="120" />
</p>

# 📝 pTextEditor - made in India Open Source text editor

A clean and modern notepad application built using Electron, offering a tabbed interface, autosave, cross-platform support, and dark/light theming. Ideal for developers, writers, or anyone looking for a fast and distraction-free writing tool.

---

## 🚀 Download

| Platform       | Installer                                                                                                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🖥️ **macOS**   | [⬇️ Download for Apple Chip](https://github.com/sayantandbd/ptexteditor/releases/download/v0.0.2-alpha/PtextEditor-0.0.2-arm64.dmg) [⬇️ Download for Intel Chip .dmg](https://github.com/sayantandbd/ptexteditor/releases/download/v0.0.2-alpha/PtextEditor-0.0.2.dmg) |
| 🖼️ **Windows** | [⬇️ Download for Windows](https://github.com/sayantandbd/ptexteditor/releases/download/v0.0.2-alpha/PtextEditor.Setup.0.0.2.exe)                                                                                                                                       |
| 🐧 **Linux**   | coming soon                                                                                                                                                                                                                                                            |

# How to Allow the App on macOS (Gatekeeper Exception)

If macOS blocks your downloaded app, follow these steps to permanently allow it:

## 🛠 Steps to Add the App as an Exception

1. **Open System Settings**  
   Click the Apple menu  → `System Settings`.

2. **Go to Privacy & Security**  
   Scroll down and click `Privacy & Security` in the sidebar.

3. **Scroll to the Security Section**  
   Near the bottom of the screen, find the **Security** section.

4. **Allow the Blocked App**  
   If you see a message like:

   > "App was blocked from use because it is not from an identified developer"  
   > Click the `Open Anyway` button.

5. **Authenticate if Required**  
   You may need to click the 🔒 lock icon and enter your Mac password to approve the change.

6. **Launch the App Normally**  
   Now you can open the app by simply double-clicking it.  
   macOS will remember your choice and not block it again.

---

📌 _Note: This only needs to be done once per app version._

---

## ✨ Features

- 🗂️ **Tabbed interface** – Edit multiple files simultaneously
- 💾 **File operations** – Open, Save, Save As (.txt support)
- 🧠 **Autosave** – Automatically saves files with 5+ lines on content change
- 🔁 **Reopen last session** – Remembers open tabs after app relaunch
- 🌓 **Dark/light mode** – Automatically adapts to system theme
- 📄 **First-line title** – Tab name based on first line (max 25 chars)
- 🖱️ **Drag-and-drop support** – Drop `.txt` files anywhere to open
- 🔃 **Tab drag & reorder**
- 🪟 **Custom title bar** – Clean UI with modern window controls
- 🖥️ **Multiple window support**
- ⌨️ **Keyboard shortcuts**

---

## ⌨️ Keyboard Shortcuts

| Action     | Shortcut           |
| ---------- | ------------------ |
| New File   | `Ctrl + N`         |
| Open File  | `Ctrl + O`         |
| Save File  | `Ctrl + S`         |
| Save As    | `Ctrl + Shift + S` |
| Switch Tab | `Ctrl + Tab`       |

---

## 🧰 Getting Started (Dev Mode)

```bash
git clone https://github.com/sayantandbd/ptexteditor.git
cd ptexteditor
npm install
npm run start
```
