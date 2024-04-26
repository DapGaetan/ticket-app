document.getElementById('ticket-form').addEventListener('submit', function(Event) {
    Event.preventDefault();

    const count = parseInt(document.getElementById('count').value);

    let event = document.getElementById('event').value;
    const structure = document.getElementById('structure').value;
    const adresse = document.getElementById('adresse').value;
    const code_postal_ville = document.getElementById('code_postal_ville').value;
    const sgc = "SGC - ARRAS";
    const serie = "Série : A";
    const placement = document.getElementById('placement').value;
    const numero_siret = "N°Siret 200 044 048 000 11 /  PLATESV-R-2021-011694";
    const licence = "Licence 3 : PLATESV-R-2021-011694";

    event = event.replace(/\s/g, '_');

    const imageFile = document.getElementById('image').files[0];
    const img = imageFile ? imageFile.name : '';

    document.getElementById('loading-overlay').style.display = 'flex';

    for (let i = 1; i <= count; i++) {
        const ticketData = {
            event,
            structure,
            adresse,
            code_postal_ville,
            sgc,
            serie,
            placement,
            numero_billet: i,
            numero_siret,
            licence,
            img
        };

        fetch('/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticketData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la génération des tickets.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la génération des tickets. Veuillez réessayer.');
        })
        .finally(() => {
            if (i === count) {
                document.getElementById('loading-overlay').style.display = 'none';
                alert(`${count} tickets ont été générés avec succès.`);
            }
        });
    }
});
