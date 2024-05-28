const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close');
    const minimizeBtn = document.getElementById('minimize');
    const maximizeBtn = document.getElementById('maximize');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            ipcRenderer.send('close-app');
        });
    }

    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            ipcRenderer.send('minimize-app');
        });
    }

    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            ipcRenderer.send('maximize-app');
        });
    }
});
