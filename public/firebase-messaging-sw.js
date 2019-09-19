importScripts('http://www.gstatic.com/firebasejs/6.6.3/firebase-app.js');
importScripts('http://www.gstatic.com/firebasejs/6.2.3/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId':"837519649274"
});

const messaging = firebase.messaging();