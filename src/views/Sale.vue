<template>
  <div class="container">
    <h1>Ventas</h1>
    <table class="table table-bordered">
      <thead class="thead-dark">
        <th scope="col">Quantity</th>
        <th scope="col">Discount</th>
        <th scope="col">Status</th>
        <th scope="col">Fecha Compra</th>
        <th scope="col">Metodo de pago</th>
        <th scope="col">Producto</th>
        <th scope="col">Usuario</th>
        <th scope="col">Total</th>
      </thead>

      <tbody>
        <tr v-for="item in items">
          <td>{{item.quantity}}</td>
          <td>{{item.discount}}</td>
          <td>{{item.status}}</td>
          <td>{{item.date}}</td>
          <td>{{item.payment_method}}</td>
          <td>{{item.name}}</td>
          <td>{{item.user}}</td>
          <td>{{item.total}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "register",
  data() {
    return {
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

    this.config = {
      headers: {
        Authorization: "token " + this.token
      }
    };
    axios.get(this.url + "sales/", this.config).then(response => {
      this.items = response.data;
      console.log("VENTAS REALIZADASS")
      console.log(response.data);
    });
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
    }
  }
};
</script>