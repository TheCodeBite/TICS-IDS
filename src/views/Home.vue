<template>
  <v-container>
    <v-card>
      <v-card-title style="background-color:#5CD5C6">
        Productos
        <div class="flex-grow-1"></div>
        <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1"
        @page-count="pageCount = $event"
      ></v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      token: "",
      url: "",
      config: "",
      headers: [
        {
          text: "id",
          align: "left",
          value: "id"
        },
        { text: "Stock", value: "quantity" },
        { text: "Precio($)", value: "price" },
        { text: "Iva", value: "tax" }
      ],
      desserts: []
    };
  },
  mounted() {
    this.token = JSON.parse(localStorage.getItem("token")).key;
    this.url = "https://bodegaapi.herokuapp.com/api/v1/";
    this.config = {
      headers: {
        Authorization: "token " + this.token
      }
    };
    axios.get(this.url + "inventories/", this.config).then(response => {
      this.desserts = response.data;
    });
  }
};
</script>
