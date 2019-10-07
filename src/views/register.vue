<template>
  <div class="container">
      <div class="card">
    <div class="card-header">
      <h1>REGITRO DE USUARIO</h1>
    </div>
    <form>
      <br />
      <div class="form-group">
        <label>Nombre de usuario</label>
        <input type="text" v-model="username" class="form-control" placeholder="TheCodeBite" />

        <label>Correo</label>
        <input type="email" class="form-control" v-model="email" placeholder="example@example.com" />

        <label>Contraseña</label>
        <input type="password" v-model="password" class="form-control" />

        <label>Rol</label>
        <select v-model="rol" class="form-control">
          <option value="1">Cajero</option>
          <option value="2">Administrador</option>
        </select>
        <p/>

        <input type="button" class="form-control btn btn-primary" value="Registrar" @click="registrar()">
      </div>
    </form>
  </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "register",
  data() {
    return {
        token: '',
        username: '',
        email: '',
        password: '',
        rol: '',
        url: "",
        config: "",
    };
  },
  mounted() {
    console.log("Componente listo");
    this.token = JSON.parse(localStorage.getItem("token")).key;
    this.url = "https://bodegaapi.herokuapp.com/api/v1/";

    this.config = {
        headers: {
          Authorization: 'token ' + this.token
        }
    }
  },
  methods: {
      registrar(){
        let params = { "username" : this.username, "email": this.email, "password": this.password, "rol": this.rol }
        console.log("Estos son los parametros" );
        console.log(params);
        
        axios.post(this.url + "users/", params, this.config).then((response) => {
            console.log(response); 
        });
      }
  }
};
</script>