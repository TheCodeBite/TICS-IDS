<template>
  <v-container>
    <v-card>
      <v-card-title style="background-color:#5CD5C6">
        Productos
        <div class="flex-grow-1"></div>
        <v-text-field
          style="margin-bottom:15px;"
          v-model="search"
          append-icon="search"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <div class="flex-grow-1"></div>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <button class="btn btn-primary btn-sm" v-on="on">Agregar Producto</button>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Nuevo Producto</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                  <v-text-field
                    v-model="name"
                    :counter="20"
                    :rules="nameRules"
                    label="Nombre del producto"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="name"
                    :counter="20"
                    :rules="nameRules"
                    label="Cantidad"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="name"
                    :counter="20"
                    :rules="nameRules"
                    label="Precio"
                    required
                  ></v-text-field>
                  
                  <v-file-input label="File input"></v-file-input>
                  
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
      >
        <template v-slot:item.action="{ item }">
          <v-dialog v-model="dialog2" max-width="250px">
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" title="Vender" v-on="on">mdi-tag</v-icon>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Cantidad</span>
              </v-card-title>

              <v-card-text>
                <v-text-field v-model="cantidad" type="number" label="Cantidas"></v-text-field>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="vender(item)">Vender</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-icon small title="Borrar" @click="deleteItem(item)">delete</v-icon>
        </template>
      </v-data-table>
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
      dialog2: false,
      cantidad:"",
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      token: "",
      url: "",
      config: "",
      headers: [
        {
          text: "Nombre",
          align: "left",
          value: "name"
        },
        { text: "Stock", value: "quantity" },
        { text: "Precio($)", value: "price" },
        { text: "Iva", value: "tax" },
        { text: "Acciones", value: "action", sortable: false }
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
    this.verInventario()
  },
  methods: {
    verInventario(){
      axios.get(this.url + "inventories/", this.config).then(response => {
        this.desserts = response.data;
      });
    },
    close() {
      this.dialog = false;
      this.dialog2= false;
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
    vender(item) {
      let params = {
        "id": item.id,
        "price": item.price,
        "tax": item.tax,
        "product": item.product,
        "user": item.user,
        "acction": 2,
        "quantity": this.cantidad
      };
      console.log(params)
      axios.put(this.url + "inventories/venta/"+item.id+"/", params, this.config)
        .then(response => {
          console.log(response.data)
        });
      this.verInventario();
      this.dialog2= false;
    },
    deleteItem(item) {
      axios.get(this.url + "inventories/", this.config).then(response => {
        this.desserts = response.data;
      });
    }
  }
};
</script>