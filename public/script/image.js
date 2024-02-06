document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const renameInput = document.getElementById('rename-input');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();
            image.src = reader.result;

            dropZone.innerHTML = '';
            dropZone.appendChild(image);

            const newName = renameInput.value.trim() || file.name;
            const newNameParts = newName.split('.');
            const extension = newNameParts.pop();
            const fileName = `${newNameParts.join('.')}.${extension}`;

            saveImage(reader.result, fileName);
        };

        reader.readAsDataURL(file);
    }

    function saveImage(dataURL, fileName) {
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const imageGrid = document.querySelector('.image-grid');

    // Récupérer la liste des noms de fichiers d'images depuis le serveur
    fetch('/images')
        .then(response => response.json())
        .then(imageFiles => {
            // Boucler à travers la liste des noms de fichiers d'images pour créer les balises d'images
            imageFiles.forEach(imageFile => {
                const img = document.createElement('img');
                img.src = `/image/${imageFile}`; // Le chemin relatif pour les images statiques
                img.alt = imageFile;
                imageGrid.appendChild(img);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des images:', error));
});


