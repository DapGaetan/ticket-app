document.getElementById('ticket-form').addEventListener('submit', function(Event) {
    Event.preventDefault(); // Empêcher le formulaire de se soumettre normalement

    const count = document.getElementById('count').value; // Récupérer le nombre de tickets à générer

    // Récupérer les valeurs des autres champs
    const event = document.getElementById('event').value;
    const structure = document.getElementById('structure').value;
    const adresse = document.getElementById('adresse').value;
    const code_postal_ville = document.getElementById('code_postal_ville').value;
    const sgc = "SGC - ARRAS";
    const serie = "Série : A";
    const placement = document.getElementById('placement').value;
    const numero_billet = document.getElementById('count').value;
    const numero_siret = "N°Siret 200 044 048 000 11 /  PLATESV-R-2021-011694";
    const licence = "Licence 3 : PLATESV-R-2021-011694";

    // Effectuer une requête POST vers la route '/bulk/:count' pour générer les tickets
    fetch(`/tickets/bulk/${count}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event,
            structure,
            adresse,
            code_postal_ville,
            sgc,
            serie,
            placement,
            numero_billet,
            numero_siret,
            licence
        })
    })
    .then(response => {
        if (response.ok) {
            alert(`${count} tickets ont été générés avec succès.`);
        } else {
            throw new Error('Erreur lors de la génération des tickets.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la génération des tickets. Veuillez réessayer.');
    });
});