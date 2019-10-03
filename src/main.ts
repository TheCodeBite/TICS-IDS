import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './registerServiceWorker';

import firebase from 'firebase';
import vuetify from 'vuetify';

Vue.config.productionTip = false;

const config={
  apiKey: "AIzaSyAgzULyx-AYpaXrVvGCcfWNdj_kBFaVL-M",
  authDomain: "pwa-example-e8751.firebaseapp.com",
  databaseURL: "https://pwa-example-e8751.firebaseio.com",
  projectId: "pwa-example-e8751",
  storageBucket: "gs://pwa-example-e8751.appspot.com",
  messagingSenderId: "837519649274",
  appId: "1:837519649274:web:591ed0d7fb092465045c43"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.usePublicVapidKey("BLiBy6FzKEeDilYY12nadmdYbkw7bvHhEzu_mQEZo9-4_SSh9RyHRN8h4kjSrlD8fbZuouk7N2cG24EHnx-SqUo")

messaging.requestPermission().then(()=>{
  console.log('Notificacion permission granted.');
  messaging.getToken().then((token) =>{
    console.log(token)
  });
}).catch((err) =>{
  console.log("Unable to get permission tu notify",err);
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
