<template>
  <div class="container">
    <h1>Ventas</h1>

    <!-- ADMINISTRADORES -->
    <table class="table table-bordered" v-if="usuario.rol === 1" >
      <thead class="thead-dark">
        <th scope="col">Quantity</th>
        <th scope="col">Discount</th>
        <th scope="col">Fecha Compra</th>
        <th scope="col">Metodo de pago</th>
        <th scope="col">Producto</th>
        <th scope="col">Usuario</th>
        <th scope="col">Total</th>
        <th scope="col">Venta</th>
      </thead>

      <tbody>
        <tr v-for="item in items">
          
            <td v-if="item.cancellation_request === 1 || item.status == 1">{{item.quantity}}</td>
            <td v-if="item.cancellation_request === 1 || item.status == 1">{{item.discount}}</td>
            <td v-if="item.cancellation_request === 1 || item.status == 1">{{item.date}}</td>
            <td v-if="item.cancellation_request === 1 || item.status == 1">{{item.payment_method}}</td>
            <td v-if="item.cancellation_request === 1 || item.status == 1">{{item.name}}</td>
            <td v-if="item.cancellation_request === 1 || item.status == 1">{{item.user}}</td>
            <td v-if="item.cancellation_request === 1 || item.status == 1">{{item.total}}</td>
            <td v-if="item.cancellation_request === 1 || item.status == 1"><button v-if="item.cancellation_request === 0" class="btn btn-sm btn-danger" @click='cancelarVenta(item)'>Cancelar venta</button>  <button v-if="item.cancellation_request === 1" class="btn btn-sm btn-danger" @click='cancelarVenta(item)'>Cancelacion pendiente</button></td>
          
        </tr>
      </tbody>
    </table>

    <!-- SOLO CAJEROS -->
    <table class="table table-bordered" v-if="usuario.rol === 2" >
      <thead class="thead-dark">
        <th scope="col">Quantity</th>
        <th scope="col">Discount</th>
        <th scope="col">Fecha Compra</th>
        <th scope="col">Metodo de pago</th>
        <th scope="col">Producto</th>
        <th scope="col">Usuario</th>
        <th scope="col">Total</th>
        <th scope="col">Venta</th>
      </thead>

      <tbody>
        <tr v-for="item in items">
            <td v-if="item.user === usuario.id && item.cancellation_request == 0">{{item.quantity}}</td>
            <td v-if="item.user === usuario.id && item.cancellation_request == 0">{{item.discount}}</td>
            <td v-if="item.user === usuario.id && item.cancellation_request == 0">{{item.date}}</td>
            <td v-if="item.user === usuario.id && item.cancellation_request == 0">{{item.payment_method}}</td>
            <td v-if="item.user === usuario.id && item.cancellation_request == 0">{{item.name}}</td>
            <td v-if="item.user === usuario.id && item.cancellation_request == 0">{{item.user}}</td>
            <td v-if="item.user === usuario.id && item.cancellation_request == 0">{{item.total}}</td>
            <td v-if="item.user === usuario.id && item.cancellation_request == 0"><button class="btn btn-sm btn-danger" @click='notificarSolicitud(item)'>Solicitar cancelación</button> </td>
          
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";
import Axios from 'axios';
export default {
  name: "register",
  data() {
    return {
      usuario: [],

      token: "",
      username: "",
      items: [],
      email: "",
      password: "",
      rol: "",
      url: "",
      config: ""
    };
  },
  mounted() {
    console.log("Componente listo");
    this.token = JSON.parse(localStorage.getItem("token")).key;
    this.url = "https://bodegaapi.herokuapp.com/api/v1/";
    this.usuario = JSON.parse(localStorage.getItem("user"))
    console.log("tu id es " + this.usuario.id + " rol " + this.usuario.rol)

    this.config = {
      headers: {
        Authorization: "token " + this.token
      }
    };
    axios.get(this.url + "sales/", this.config).then(response => {
      this.items = response.data;
      console.log("VENTAS REALIZADASS")
      console.log(response.data);
    }).catch (function (error){
      console.log("algo salio mal papu")
    }) ;
  },
  methods: {
    registrar() {
      let params = {
        username: this.username,
        email: this.email,
        password: this.password,
        rol: this.rol
      };
      console.log("Estos son los parametros");
      console.log(params);
    },
    cancelarVenta(item){
      item.status = 2;
      console.log("Se canselo: ",item)
      axios.put(this.url + "sales/cancellation/" + item.id + "/", item, this.config).then((response) => {
        console.log(item)
      })
    },
    notificarSolicitud(item){   
      item.cancellation_request=1
      console.log("Este quiere cancelar: ",item)
      axios.put(this.url+"sales/"+item.id+"/",item,this.config).then((response) =>{
        console.log(response.data)

        let configNoti={
          headers: {
            Authorization: "key=AIzaSyABcbCVjWB1VEwFJO_Z19p62zuNS87yqsY"
          }
        }
        let params = {
          "to": "fwZ6QR5bkt4:APA91bGT4IMg9GBtzuOABBEqhpTMB4FmCxVeo9IYJBCl0XYtfFFQfSwoicpse-1ZsOAW9HY4-WJIfkJBBlzouMZ72nQlm6a1qIe-SNpXBzV5XLM08RdIcmreHMAes4_iF591bnDMe-T_",
          "notification": {
            "title": "Solicitud de cancelación",
            "body": "Haz click para cancelar.",
            "icon": "./img/icons/android-chrome-192x192.png",
            "click_action": "/ventas"
          }
        }
        axios.post("https://fcm.googleapis.com/fcm/send", params,this.configNoti).then((response) => {
          console.log("Solicito cancelar")
        })
      })
    }
  }
};
</script>