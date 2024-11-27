document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { username, password };

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        alert('Utilisateur créé !');
        window.location.href = 'login.html';  // Redirection vers la page de connexion
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'inscription');
    });
});
