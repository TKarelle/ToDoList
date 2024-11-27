
// Vérification si l'utilisateur est connecté (présence du token)
function checkAuth() {
    const token = localStorage.getItem('token');  // Ou sessionStorage.getItem('token');
    if (!token) {
        // Si aucun token trouvé, redirection vers login.html
        window.location.href = 'login.html';
    }
}

// Appel de checkAuth pour vérifier si l'utilisateur est connecté
checkAuth();

// Fonction pour gérer la déconnexion
function logout() {
    localStorage.removeItem('token'); // Supprimer le token du localStorage
    window.location.href = 'login.html'; // Rediriger l'utilisateur vers la page de connexion
}

// Ajouter un écouteur d'événements sur le bouton de déconnexion
document.getElementById('logoutButton').addEventListener('click', logout);




