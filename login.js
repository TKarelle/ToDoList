document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Sauvegarder le token dans localStorage
            window.location.href = 'index.html'; // Rediriger vers la page index.html
        } else {
            alert('Erreur de connexion');
        }
    })
    .catch(error => {
        console.error('Erreur de connexion:', error);
        alert('Nom d\'utilisateur ou mot de passe incorrect');
    });
});


// Fonction pour vérifier si l'utilisateur est connecté (présence du token)
function checkAuth() {
    const token = localStorage.getItem('token');  // Ou sessionStorage.getItem('token');
    if (!token) {
        // Si aucun token, rediriger vers la page de connexion
        window.location.href = 'login.html';
    }
}

// Appel de checkAuth() pour protéger index.html
checkAuth();


