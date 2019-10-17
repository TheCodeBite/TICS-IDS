<template>
  <div class="container">
    <table class="table ">
      <thead>
        <tr class="table-primary">
          <th scope="col">#</th>
          <th scope="col">Fecha</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Acción</th>
          <th scope="col">Inventario</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <th scope="row">{{item.id}}</th>
          <td>{{item.date}}</td>
          <td>{{item.acction}}</td>
          <td>{{item.quantity}}</td>
          <td>{{item.inventory}}</td>
        </tr>
      </tbody>
    </table>
      
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'transacction',
  data(){
    return{
      url: '',
      admin: false,
      token: '',
      items: [],
      config: ''
    };
  },
  mounted(){
    this.url = 'https://bodegaapi.herokuapp.com/api/v1/'
    this.token = JSON.parse(localStorage.getItem("token")).key;

    if(JSON.parse(localStorage.getItem("user")).rol==1){
      this.admin = true
    }

    this.config = {
      headers: {
        Authorization: 'token ' + this.token
      }
    }

    axios.get(this.url + "transactions/", this.config).then((response) => {
      this.items = response.data
      console.log(response.data)
    });
  }

}
</script>

<style>

</style>