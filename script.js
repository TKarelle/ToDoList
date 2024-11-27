// Récupérer les éléments du DOM
const taskInput = document.getElementById("new-task");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

const eventsInput = document.getElementById("new-events");
const eventDateInput = document.getElementById("event-date");
const addEventsButton = document.getElementById("add-events");
const eventsList = document.getElementById("events-list");

const notesInput = document.getElementById("new-notes");
const addNotesButton = document.getElementById("add-notes");
const notesList = document.getElementById("notes-list");

// Charger les données depuis localStorage
function loadFromStorage(key, listElement, createFunction) {
    const storedItems = JSON.parse(localStorage.getItem(key)) || [];
    storedItems.forEach(item => {
        createFunction(item.text, listElement, false, key, item.date, item.isDone, item.isInProgress);
    });
}


function saveToStorage(key, listElement, hasDate = false) {
    const items = Array.from(listElement.children).map(item => {
        const data = {
            id: item.id, // ID de la tâche
            text: item.querySelector(".task, .list_other_text").innerText.trim(), // Texte de la tâche
            isDone: item.classList.contains("button__done_selected"), // État terminé
            isInProgress: item.classList.contains("button__progress_selected") // État en cours
        };

        // Sauvegarder la date si applicable
        if (hasDate) {
            const dateElement = item.querySelector(".date_item p");
            data.date = dateElement ? dateElement.innerText.trim() : ""; // Sauvegarde de la date
        }

        return data;
    });
    // Sauvegarder les données dans localStorage
    localStorage.setItem(key, JSON.stringify(items));
}


// Fonction pour générer un ID unique
function generateUniqueId() {
    return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Gestion des tâches 
function createTask(text, listElement, save = true, storageKey = "tasks", date = "", isDone = false, isInProgress = false) {
    const taskId = generateUniqueId();
    const newTask = document.createElement("a");
    newTask.classList.add("list_task_card");
    newTask.setAttribute("id", taskId); // Attribuer un ID unique à chaque tâche

    newTask.innerHTML = `
        <div class="task__progress">
            <button class="button__progress" data-task-id="${taskId}">
                <i class="fas fa-hourglass-half"></i> 
            </button>
        </div>
        <p class="task task-text">${text}</p>
        <div class="card_right">
            <div class="task__done">
                <button class="button__done" data-task-id="${taskId}">
                   <i class="fas fa-check-circle"></i>
                </button>
            </div>
            <div class="task__deleted">
                <button class="button__delete delete-task">
                   <i class="fas fa-trash"></i> 
                </button>
            </div>
        </div>
    `;

    // Appliquer les classes en fonction de l'état de la tâche
    if (isDone) {
        newTask.classList.add("button__done_selected");
        newTask.querySelector(".button__done").classList.add("button__done_selected");
    }
    if (isInProgress) {
        newTask.classList.add("button__progress_selected");
        newTask.querySelector(".button__progress").classList.add("button__progress_selected");
    }

    // Ajouter l'événement de suppression
    newTask.querySelector(".delete-task").addEventListener("click", () => {
        listElement.removeChild(newTask);
        saveToStorage(storageKey, listElement);
    });

    // Ajouter l'élément à la liste
    listElement.appendChild(newTask);

    // Sauvegarder si nécessaire
    if (save) {
        saveToStorage(storageKey, listElement);
    }
}


function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;
    createTask(taskText, taskList);
    taskInput.value = ""; // Réinitialiser le champ
}

function handleTaskDone(event) {
    const button = event.target.closest(".button__done"); // Trouver le bouton cliqué
    if (!button) return; // Si aucun bouton, on arrête

    const taskId = button.getAttribute("data-task-id"); // Récupérer l'ID de la tâche
    const taskElement = document.getElementById(taskId); // Trouver la tâche associée

    if (!taskElement) {
        console.error("Tâche introuvable pour l'ID :", taskId);
        return;
    }

    // Vérifier si la tâche est déjà marquée comme terminée
    const isDone = taskElement.classList.contains("button__done_selected");
    if (isDone) {
        // Annuler l'effet "fait"
        taskElement.classList.remove("button__done_selected");
        button.classList.remove("button__done_selected");
        console.log("Tâche marquée comme non terminée :", taskElement);

    } else {
        // Marquer la tâche comme terminée
        taskElement.classList.add("button__done_selected");
        button.classList.add("button__done_selected");
        console.log("Tâche marquée comme terminée :", taskElement);

        // Déplacer la tâche à la fin de la liste
        const parentList = taskElement.parentNode;
        parentList.appendChild(taskElement);
    }

    // Supprimer la classe "en cours" si elle est présente
    if (taskElement.classList.contains("button__progress_selected")) {
        taskElement.classList.remove("button__progress_selected");
        const progressButton = taskElement.querySelector(".button__progress");
        if (progressButton) {
            progressButton.classList.remove("button__progress_selected");
        }
    }
    saveToStorage("tasks", taskList);
}


// Fonction pour le statut "En cours" d'une tâche
function handleTaskProgress(event) {
    const button = event.target.closest(".button__progress");
    if (!button) return; //Si aucun bouton on arrete 

    const taskId = button.getAttribute("data-task-id"); // Récupérer l'ID de la tâche
    const taskElement = document.getElementById(taskId); // Trouver la tâche associée

    if (!taskElement) {
        console.error("Tâche introuvable pour l'ID :", taskId);
        return;
    }

    // Verifier si la tâche est déja marquée comme en cour
    const isProgress = taskElement.classList.contains("button__progress_selected");
    if (isProgress) {
        //Annuler l'effet "en cour"
        taskElement.classList.remove("button__progress_selected");
        button.classList.remove("button__progress_selected");
        console.log("Tâche marquée comme non commencée :", taskElement);
        
    } else {
        //Marquer la tâche comme en cour 
        taskElement.classList.add("button__progress_selected");
        button.classList.add("button__progress_selected");
        console.log("Tâche marquée comme commencée :", taskElement);

        // Déplacer la tâche vers le début de la liste
        const parentList = taskElement.parentNode;
        parentList.prepend(taskElement);
    }
    saveToStorage("tasks", taskList);
}

// Gestionnaire global pour les clics sur les boutons
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("fa-check-circle") || event.target.closest(".button__done")) {
        handleTaskDone(event);
    } else if (event.target.classList.contains("fa-hourglass-half") || event.target.closest(".button__progress")) {
        handleTaskProgress(event);
    }
});




// Fonction pour appliquer les classes en fonction du temps restant avant l'événement
function updateEventProgressClass(eventElement, eventDate) {
    const currentDate = new Date(); // Date actuelle
    const eventDateObj = new Date(eventDate); // Convertir la date de l'événement en objet Date

    // Comparer les dates sous la même forme pour éviter les incohérences
    const currentDateFormatted = new Date(currentDate.setHours(0, 0, 0, 0)); // Rendre la date actuelle "neutre" (sans heures)
    const eventDateFormatted = new Date(eventDateObj.setHours(0, 0, 0, 0)); // Rendre la date de l'événement "neutre"

    // Différence de temps entre l'événement et maintenant
    const timeDiff = eventDateFormatted - currentDateFormatted;
    const daysLeft = timeDiff / (1000 * 3600 * 24); // Convertir en jours

    // Cacher toutes les icônes par défaut
    const allButtons = eventElement.querySelectorAll('.button__progress-start, .button__progress-middle, .button__progress-end');
    allButtons.forEach(button => {
        button.style.display = 'none'; // Cacher toutes les icônes
    });

    // Ajouter la classe appropriée en fonction du temps restant et afficher l'icône correspondante
    if (daysLeft <= 30 && daysLeft > 14) {
        // Si l'événement est entre 2 semaines et 1 mois
        eventElement.querySelector('.button__progress-start').style.display = 'inline-block'; // Afficher l'icône "start"
    } else if (daysLeft <= 14 && daysLeft > 7) {
        // Si l'événement est entre 1 et 2 semaines
        eventElement.querySelector('.button__progress-middle').style.display = 'inline-block'; // Afficher l'icône "middle"
    } else if (daysLeft <= 7) {
        // Si l'événement est en dessous de 1 semaines
        eventElement.querySelector('.button__progress-end').style.display = 'inline-block'; // Afficher l'icône "end"
    }
}



// Tableau pour stocker les événements
let eventsListNew = [];

// Fonction pour créer un événement et l'ajouter au tableau
function createEvent(text, date, listElement, save = true, storageKey = "events") {
    const newEvent = document.createElement("a");
    newEvent.classList.add("list_events_card");
    newEvent.innerHTML = `
        <div class="date_item">
            <p class="newdate">${date}</p>
        </div>
        <p class="task events-text">${text}</p>
        <div class="events__progress">
            <button class="button__progress-start events-btn">
                <i class="fas fa-clock"></i>
            </button>
            <button class="button__progress-middle events-btn">
                <i class="fas fa-clock"></i>
            </button>
            <button class="button__progress-end events-btn">
                <i class="fas fa-exclamation-circle"></i>
            </button>
        </div>
        <div class="task__deleted">
            <button class="button__delete delete-events">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Ajouter l'événement de suppression
    newEvent.querySelector(".delete-events").addEventListener("click", () => {
        listElement.removeChild(newEvent);
        saveToStorage(storageKey, listElement, true);
    });

    // Ajouter l'élément à la liste
    listElement.appendChild(newEvent);

    // Ajouter l'événement au tableau
    const event = { text, date };
    eventsListNew.push(event);

    // Appeler la fonction pour mettre à jour la progression de l'événement
    updateEventProgressClass(newEvent, date);

    // Sauvegarder si nécessaire
    if (save) {
        saveToStorage(storageKey, listElement, true); 
    }

    // Mettre à jour la section topTask après ajout de l'événement
    updateTopTask();
}

// Fonction pour trier et afficher les événements dans la section topTask
function updateTopTask() {
    // Trier les événements par date (les plus récents en premier)
    eventsListNew.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Sélectionner le conteneur où les événements seront affichés
    const topTaskContainer = document.querySelector('.toptask_container');
    topTaskContainer.innerHTML = ''; // Vider le conteneur avant de l'actualiser

    // Limiter le nombre d'événements affichés à 3
    const eventsToDisplay = eventsListNew.slice(0, 3);

    // Ajouter les événements triés dans le conteneur
    eventsToDisplay.forEach(event => {
        const topTaskCard = document.createElement("a");
        topTaskCard.classList.add("toptask_card");
        topTaskCard.innerHTML = `
            <div class="toptask_card_head">
                <p class="toptask_title">${event.text}</p>
            </div>
            <div class="date_card">
                <p class="date_toptask">${event.date}</p>
            </div>
        `;
        topTaskContainer.appendChild(topTaskCard);
    });
}



function addEvent() {
    const eventText = eventsInput.value.trim();
    const rawDate = document.getElementById("event-date").value; // Date brute entrée par l'utilisateur

    if (eventText === "" || rawDate === "") return;
    createEvent(eventText, rawDate, eventsList);
    eventsInput.value = ""; // Réinitialiser le champ de texte
    document.getElementById("event-date").value = ""; // Réinitialiser le champ de date
    
}


// Charger les événements depuis localStorage
function loadEventsFromStorage() {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    storedEvents.forEach(event => {
        if (event.text && event.date) { // Vérifier la présence de texte et de date
            createEvent(event.text, event.date, eventsList, false); // Utiliser la date brute sans modification
        }
    });
}


// Gestion des notes (avec date de création automatique)
function createNote(text, listElement, save = true, storageKey, savedDate = null) {
    // Utiliser la date sauvegardée ou la date actuelle
    const currentDate = savedDate || new Date().toLocaleDateString();

    const newNote = document.createElement("a");
    newNote.classList.add("list_notes_card");
    newNote.innerHTML = `
        <div class="date_item">
            <p>${currentDate}</p>
        </div>
        <p class="task notes-text">${text}</p>
        <div class="task__deleted">
            <button class="button__delete delete-item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    // Ajouter l'événement de suppression
    newNote.querySelector(".delete-item").addEventListener("click", () => {
        listElement.removeChild(newNote);
        saveToStorage(storageKey, listElement, true);
    });

    // Ajouter l'élément à la liste
    listElement.appendChild(newNote);

    // Sauvegarder si nécessaire
    if (save) {
        let items = JSON.parse(localStorage.getItem(storageKey)) || [];
        items.push({ text, date: currentDate });
        localStorage.setItem(storageKey, JSON.stringify(items));
    }
}

function addNote() {
    const noteText = notesInput.value.trim();
    if (noteText === "") return;
    createNote(noteText, notesList, true, "notes");
    notesInput.value = ""; // Réinitialiser le champ
}

function loadNotesFromStorage(storageKey, listElement) {
    const savedNotes = JSON.parse(localStorage.getItem(storageKey)) || [];
    savedNotes.forEach(note => {
        createNote(note.text, listElement, false, storageKey, note.date);
    });
}


// Charger les éléments au démarrage
window.addEventListener("DOMContentLoaded", () => {
    loadFromStorage("tasks", taskList, createTask);
    loadEventsFromStorage();
    loadNotesFromStorage("notes", notesList);
});

// Écouteurs pour ajouter les éléments
addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", event => {
    if (event.key === "Enter") addTask();
});

addEventsButton.addEventListener("click", addEvent);
eventsInput.addEventListener("keypress", event => {
    if (event.key === "Enter") addEvent();
});

addNotesButton.addEventListener("click", addNote);
notesInput.addEventListener("keypress", event => {
    if (event.key === "Enter") addNote();
});

// Fonction pour formater la date au format "jj mois aaaa"
function getFormattedDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Ajoute un zéro si nécessaire (ex. "01")
    
    // Tableau des mois en français
    const months = [
        "janvier", "février", "mars", "avril", "mai", "juin", 
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];

    const month = months[today.getMonth()]; // Utilise l'index du mois actuel pour obtenir le nom
    const year = today.getFullYear();

    return `${day} ${month} ${year}`; // Retourne la date formatée
}

// Afficher la date dans l'élément #current-date
function displayDate() {
    const dateElement = document.getElementById("current-date");
    dateElement.textContent = getFormattedDate();
}

// Appeler la fonction pour afficher la date au démarrage
window.addEventListener("DOMContentLoaded", displayDate);

// Récupérer les éléments du DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Fonction pour filtrer les éléments (tâches, événements, notes) en fonction de la recherche
function filterItems(searchText) {
    // Filtrer les tâches
    filterSectionItems('.list_task_card', '.task-text', searchText);

    // Filtrer les événements
    filterSectionItems('.list_events_card', '.events-text', searchText);

    // Filtrer les notes
    filterSectionItems('.list_notes_card', '.notes-text', searchText);
}

// Fonction de filtrage générique pour chaque section
function filterSectionItems(cardSelector, textSelector, searchText) {
    const items = document.querySelectorAll(cardSelector);
    items.forEach(item => {
        const itemText = item.querySelector(textSelector).innerText.toLowerCase();
        item.style.display = itemText.includes(searchText) ? 'flex' : 'none';
    });
}

// Écouteur d'événement pour le bouton de recherche
searchButton.addEventListener('click', () => {
    const searchText = searchInput.value.trim().toLowerCase();
    filterItems(searchText); // Appliquer le filtre avec le texte de recherche
});

// Écouteur d'événement pour la recherche en temps réel (optionnel)
searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.trim().toLowerCase();
    filterItems(searchText); // Appliquer le filtre en temps réel
});

// Optionnel : Permet de rechercher en appuyant sur la touche "Entrée"
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchButton.click(); // Simuler un clic sur le bouton si "Entrée" est pressé
    }
});

// Fonction pour appliquer le filtre de tri sur les éléments de type spécifique (tasks, events, notes)
function applyFilter(type, sortType) {
    const list = document.querySelectorAll(`.list_${type}_card`);

    let sortedList;
    if (sortType === 'asc') {
        sortedList = Array.from(list).sort((a, b) => {
            const textA = a.querySelector(`.${type}-text`).innerText.toLowerCase();
            const textB = b.querySelector(`.${type}-text`).innerText.toLowerCase();
            return textA.localeCompare(textB); // Tri croissant
        });
    } else if (sortType === 'desc') {
        sortedList = Array.from(list).sort((a, b) => {
            const textA = a.querySelector(`.${type}-text`).innerText.toLowerCase();
            const textB = b.querySelector(`.${type}-text`).innerText.toLowerCase();
            return textB.localeCompare(textA); // Tri décroissant
        });
    } else if (sortType === 'date') {
        sortedList = Array.from(list).sort((a, b) => {
            const dateA = new Date(a.querySelector('.newdate').textContent);
            const dateB = new Date(b.querySelector('.newdate').textContent);
            
            return dateA - dateB; // Tri par date
        });
    } else if (sortType === 'dateNote') {
        sortedList = Array.from(list).sort((a, b) => {
            const dateA = new Date(a.querySelector('.date_item').textContent);
            const dateB = new Date(b.querySelector('.date_item').textContent);

            return dateA - dateB; // Tri par date
        });
    }

    // Réorganiser l'affichage en fonction du tri
    const container = document.getElementById(`${type}-list`);
    container.innerHTML = ''; // Vider le container
    sortedList.forEach(item => {
        container.appendChild(item); // Ajouter chaque élément trié dans le container
    });
}

// Gestion des événements de tri
document.getElementById('task-asc').addEventListener('click', () => {
    applyFilter('task', 'asc');
});

document.getElementById('task-desc').addEventListener('click', () => {
    applyFilter('task', 'desc');
});

document.getElementById('events-asc').addEventListener('click', () => {
    applyFilter('events', 'asc');
});

document.getElementById('events-desc').addEventListener('click', () => {
    applyFilter('events', 'desc');
});

document.getElementById('events-date').addEventListener('click', () => {
    applyFilter('events', 'date');
});

document.getElementById('notes-asc').addEventListener('click', () => {
    applyFilter('notes', 'asc');
});

document.getElementById('notes-desc').addEventListener('click', () => {
    applyFilter('notes', 'desc');
});

document.getElementById('notes-date').addEventListener('click', () => {
    applyFilter('notes', 'dateNote');
});