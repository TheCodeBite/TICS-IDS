<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">Tiendita</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div text target="_blank">
        <router-link to="/login" v-if="!conectado"> <span class="mr-2">Iniciar Sesión</span></router-link>
        <router-link to=""><span class="mr-2" v-if="conectado" @click="cerrarSesion()">Cerrar Sesión</span></router-link>
      </div>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "App",
  data: () => ({
    conectado:false,
    config: {
      headers: {
        Authorization: "token af81d0628ae7af0ea728eb7cdcec5eb69dc2a660"
      }
    }
  }),
  mounted(){
    const loggedIn = localStorage.getItem('token');
    if(loggedIn){
      this.conectado=true;
    }
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
});
</script>
<style>
</style>