<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">Tiendita</span>
      </v-toolbar-title>
      <div style="margin-left:15px;" text target="_blank">
        <router-link to="/">
          <span class="mr-2" v-if="conectado">Inventario</span>
        </router-link>
        <router-link to="/ventas">
          <span class="mr-2">Ventas</span>
        </router-link>
        <router-link to="/register" v-if="admin">
          <span class="mr-2">Registro</span>
        </router-link>
      </div>
      <v-spacer></v-spacer>
      <div text target="_blank">
        <router-link to="/login" v-if="!conectado">
          <span class="mr-2">Iniciar Sesión</span>
        </router-link>
        <router-link to>
          <span class="mr-2" v-if="conectado" @click="cerrarSesion()">Cerrar Sesión</span>
        </router-link>
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
    conectado: false,
    admin: false
  }),
  mounted() {
    const loggedIn = localStorage.getItem("token");
    if (loggedIn) {
      if(localStorage.getItem("user")){
        if (JSON.parse(localStorage.getItem("user") || '{}').rol == 1) {
          this.admin = true;
        }
      }
      
      this.conectado = true;
    }
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }
});
</script>
<style>
</style>