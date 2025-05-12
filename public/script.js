'use strict'

const $ = document.querySelector.bind(document);

// link handlers
$('#loginLink').addEventListener('click', openLoginScreen);
$('#registerLink').addEventListener('click', openRegisterScreen);
$('#logoutLink').addEventListener('click', openLoginScreen);

// Sign In button action
$('#loginBtn').addEventListener('click', () => {
    const username = $('#loginUsername').value;
    const password = $('#loginPassword').value;
    if (!username || !password) return;

    fetch(`/users/${username}`)
        .then(res => res.json())
        .then(doc => {
            if (doc.error) {
                showError(doc.error);
            } else if (doc.password !== password) {
                showError('Username and password do not match.');
            } else {
                openHomeScreen(doc);
            }
        })
        .catch(err => showError('ERROR: ' + err));
});

// Register button action
$('#registerBtn').addEventListener('click', () => {
    const data = {
        username: $('#registerUsername').value,
        password: $('#registerPassword').value,
        name: $('#registerName').value,
        email: $('#registerEmail').value
    };

    if (!data.username || !data.password || !data.name || !data.email) {
        showError('All fields are required.');
        return;
    }

    fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(doc => {
            if (doc.error) showError(doc.error);
            else openHomeScreen(doc);
        })
        .catch(err => showError('ERROR: ' + err));
});

// Update button action
$('#updateBtn').addEventListener('click', () => {
    const username = $('#username').innerText;
    const data = {
        name: $('#updateName').value,
        email: $('#updateEmail').value
    };

    if (!data.name || !data.email) {
        showError('Fields cannot be blank.');
        return;
    }

    fetch(`/users/${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(doc => {
            if (doc.error) showError(doc.error);
            else if (doc.ok) alert("Your name and email have been updated.");
        })
        .catch(err => showError('ERROR: ' + err));
});

// Delete button action
$('#deleteBtn').addEventListener('click', () => {
    const username = $('#username').innerText;
    if (!confirm("Are you sure you want to delete your profile?")) return;

    fetch(`/users/${username}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(doc => {
            if (doc.error) showError(doc.error);
            else openLoginScreen();
        })
        .catch(err => showError('ERROR: ' + err));
});

function showListOfUsers() {
    fetch('/users')
        .then(res => res.json())
        .then(docs => {
            docs.forEach(showUserInList);
        })
        .catch(err => showError('Could not get user list: ' + err));
}

function showUserInList(doc) {
    const item = document.createElement('li');
    item.innerText = doc.username;
    $('#userlist').appendChild(item);
}

function showError(err) {
    $('#error').innerText = err;
}

function resetInputs() {
    document.querySelectorAll("input").forEach(input => input.value = '');
}

function openHomeScreen(doc) {
    $('#loginScreen').classList.add('hidden');
    $('#registerScreen').classList.add('hidden');
    resetInputs();
    showError('');
    $('#homeScreen').classList.remove('hidden');
    $('#name').innerText = doc.name;
    $('#username').innerText = doc.username;
    $('#updateName').value = doc.name;
    $('#updateEmail').value = doc.email;
    $('#userlist').innerHTML = '';
    showListOfUsers();
}

function openLoginScreen() {
    $('#registerScreen').classList.add('hidden');
    $('#homeScreen').classList.add('hidden');
    resetInputs();
    showError('');
    $('#loginScreen').classList.remove('hidden');
}

function openRegisterScreen() {
    $('#loginScreen').classList.add('hidden');
    $('#homeScreen').classList.add('hidden');
    resetInputs();
    showError('');
    $('#registerScreen').classList.remove('hidden');
}
