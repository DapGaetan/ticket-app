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

document.addEventListener("DOMContentLoaded", function() {
    var nav = document.getElementById("menu-accordeon");
    var body = document.getElementById("body-bg");
    var content = document.getElementById("content");
    console.log("Script loaded, nav element:", nav);

    nav.addEventListener("mouseenter", function() {
        console.log("mouseenter triggered");
        body.classList.add("nav-hover");
        content.classList.add("menu-moving");
    });

    nav.addEventListener("mouseleave", function() {
        console.log("mouseleave triggered");
        body.classList.remove("nav-hover");
        content.classList.remove("menu-moving");
    });
});
