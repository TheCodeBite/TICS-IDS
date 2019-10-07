importScripts('https://www.gstatic.com/firebasejs/7.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.1.0/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId' : '837519649274'
});

const messaging = firebase.messaging();