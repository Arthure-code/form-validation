// Chaque règle rend un message, ou une chaîne vide quand le champ est bon.
// Aucun attribut HTML5 ne participe : le formulaire porte novalidate et tout
// se décide ici.
const refFormulaire = document.getElementById('monForm');
const refInfos = document.getElementById('chkInfos');

// 999-999-9999 ou (999)999-9999, et rien d'autre : 12 ou 13 caractères.
const FORMAT_TELEPHONE = /^(\d{3}-\d{3}-\d{4}|\(\d{3}\)\d{3}-\d{4})$/;
// Quelque chose, une arobase, quelque chose, un point, quelque chose.
const FORMAT_COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REGLES = {
    txtNom: (valeur) => (valeur.trim() === '' ? 'Le nom est obligatoire.' : ''),
    txtPrenom: (valeur) => (valeur.trim() === '' ? 'Le prénom est obligatoire.' : ''),
    txtTelephone: (valeur) => {
        if (valeur.length !== 12 && valeur.length !== 13) {
            return 'Le téléphone compte 12 ou 13 caractères.';
        }
        return FORMAT_TELEPHONE.test(valeur) ? '' : 'Format attendu : 999-999-9999 ou (999)999-9999.';
    },
    txtCourriel: (valeur) => {
        if (!refInfos.checked) {
            return '';
        }
        if (valeur.trim() === '') {
            return 'Le courriel est obligatoire pour recevoir des informations.';
        }
        return FORMAT_COURRIEL.test(valeur.trim()) ? '' : 'Le courriel doit ressembler à nom@domaine.com.';
    },
};

refFormulaire.addEventListener('submit', validerFormulaire);

// Un champ corrigé se revalide en tapant, et la case décide du courriel.
for (const id of Object.keys(REGLES)) {
    document.getElementById(id).addEventListener('input', () => validerChamp(id));
}
refInfos.addEventListener('change', () => validerChamp('txtCourriel'));

/**
* Valider un champ et afficher son message, à côté de lui.
* @param {string} id - L'identifiant du champ
* @returns {boolean} Vrai si le champ est correct
*/
function validerChamp(id) {
    const refChamp = document.getElementById(id);
    const message = REGLES[id](refChamp.value);

    document.getElementById('erreur-' + id).textContent = message;
    refChamp.classList.toggle('is-invalid', message !== '');
    return message === '';
}

/**
* Valider tous les champs ; la soumission n'a lieu que si aucun n'est en
* erreur. Le premier champ fautif reçoit le focus.
* @param {Event} e - L'événement submit
*/
function validerFormulaire(e) {
    const fautifs = Object.keys(REGLES).filter((id) => !validerChamp(id));

    if (fautifs.length > 0) {
        e.preventDefault();
        document.getElementById(fautifs[0]).focus();
    }
}
