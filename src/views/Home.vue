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
        <router-link to="/about" class="btn btn-primary btn-sm" >Agregar Producto</router-link>
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

          <v-dialog v-if="admin" v-model="dialog3" max-width="250px">
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" title="Borrar" v-on="on">delete</v-icon>
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
                <v-btn color="blue darken-1" text @click="deleteItem(item)">Borrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialog_detalles" max-width="250px">
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" title="Detalles" v-on="on">info</v-icon>
            </template>
            <v-card
              class="mx-auto"
            >
              <v-img
              class="black--text"
              height="300px"
              v-bind:src="item.image_url"
              >

              <v-card-title
              class="align-end fill-height"
              >
                {{item.name}}
              </v-card-title>

              </v-img>

              <v-card-text>
                {{item.description}}
                
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="detalles(item)">Vender</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
  </v-container>
</template>

<script>
require('material-design-lite')
import firebase from 'firebase';
import axios from "axios";
export default {
  name: 'app',
  data() {
    return {
      dialog: false,
      dialog2: false,
      dialog_detalles: false,
      dialog3: false,
      cantidad:null,
      admin:false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      token: "",
      url: "",

      image_url: [],
      code: "",
      name: "",
      description: "",
      quantity: "",
      price: "",
      tax: "",

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
    console.log("este es mi token" + this.token)
    if(JSON.parse(localStorage.getItem("user")).rol==1){
      this.admin = true
    }
    
    this.url = "https://bodegaapi.herokuapp.com/api/v1/";
    this.config = {
      headers: {
        Authorization: "token " + this.token
      }
    };
    
    this.verInventario();
  },
  methods: {
    verInventario() {
      axios.get(this.url + "inventories/", this.config).then(response => {
        this.desserts = response.data;
        console.log("PRODUCTO")
        console.log(response)
      });
    },
    close(){
      dialog= false,
      dialog2= false,
      dialog_detalles= false,
      dialog3= false
    },
    guardarProducto(){
      let parama = { image_url: this.image_url, code: this.code, name: this.name, description: this.description, quantity: this.quantity, price: this.price, tax: this.tax }
    
      console.log("espero que esto funcione ");
      console.log(parama);

      axios.post(this.url + "products/", parama, this.config).then((response) => {
        console.log("Producto agregado");
        console.log(response)
      });
    },
    vender(item) {
        let params = {
            "id": item.id,
            "price": item.price,
            "tax": item.tax,
            "product": item.product,
            "user": item.user,
            "acction": 2,
            "quantity": parseInt(this.cantidad)
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
        let c=item.quantity - this.cantidad
        let params = {
            "id": item.id,
            "price": item.price,
            "tax": item.tax,
            "product": item.product,
            "user": item.user,
            "quantity": c
        };
        console.log(params)
        axios.put(this.url + "inventories/"+item.id+"/", params, this.config)
            .then(response => {
            console.log(response.data)
            });
        this.verInventario();
        this.dialog3= false;
    }
  }
};
</script>
