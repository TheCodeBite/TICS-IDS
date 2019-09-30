<template>
  <v-container>
    <v-card>
      <v-card-title style="background-color:#5CD5C6">
        Productos
        <div class="flex-grow-1"></div>
        <v-text-field style="margin-bottom:15px;" v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
        <div class="flex-grow-1"></div>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo producto</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Hola</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field label="Dessert name"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Agregar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      dialog: false,
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
  },
  methods: {
    close() {
      this.dialog = false;
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>