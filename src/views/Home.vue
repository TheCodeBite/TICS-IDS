<template>
  <v-container>
    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModalLong"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
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

        <!-- MODAL DE CAMARA -->
        <template>
          <v-row justify="center">
            

            <v-dialog
              v-model="dialogazo"
              max-width="900px"
            >
              <v-card>
                <div id="app">
                  <div class="camera-modal">
                    <video ref="video" class="camera-stream"/>
                    <div class="camera-modal-container">
                          <span @click="capture" class="take-picture-button mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                            <i class="material-icons">camera</i>
                          </span>
                      </div>
                  </div>
                </div>

                <v-card-actions>
                  <div class="flex-grow-1"></div>

                  <v-btn
                    color="green darken-1"
                    text
                    @click="dialog = false"
                  >
                    Capturar
                  </v-btn>

                  <v-btn
                    color="green darken-1"
                    text
                    @click="dialog = false"
                  >
                    Cancelar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
</template>
        
        <!---MODAL DE AGREGAR PRODUCTO-->
        <v-dialog v-if="admin" v-model="dialog" max-width="500px">
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
                  :counter="20"
                  :rules="nameRules"
                  label="Descripción"
                  v-model="description"
                  required
                ></v-text-field>

                <v-text-field v-model="code" :counter="20" :rules="nameRules" label="Code" required></v-text-field>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-file-input 
                    accept="image/*"
                    v-model="image_url"
                    prepend-icon="mdi-camera"
                    label="Seleccionar"></v-file-input>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-btn
                      color="primary"
                      dark
                      @click.stop="dialogazo = true"
                    >
                      Tomar Foto
                    </v-btn>
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field 
                      v-model="quantity" 
                      type="number" 
                      label="Cantidad"/>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field 
                      v-model="price" 
                      type="number" 
                      label="Precio"/>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field 
                      v-model="tax" 
                      type="number" 
                      label="Tax"/>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="guardarProducto()">Agregar</v-btn>
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
      dialog3: false,
      cantidad:null,
      admin:false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      token: "",
      url: "",
      mediaStream: null,

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
    if(JSON.parse(localStorage.getItem("user")).rol==1){
      this.admin = true
    }
    
    this.url = "https://bodegaapi.herokuapp.com/api/v1/";
    this.config = {
      headers: {
        Authorization: "token " + this.token
      }
    };
    navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
      this.mediaStream = mediaStream;
      this.$refs.video.srcObject = mediaStream;
      this.$refs.video.play();
    }).catch(error => {
      console.error('getUserMedia() error:', error);
    });
    this.verInventario();
  },destroyed () {
    const tracks = this.mediaStream.getTracks();
    tracks.map(track => track.stop());
  },
  methods: {
    verInventario() {
      axios.get(this.url + "inventories/", this.config).then(response => {
        this.desserts = response.data;
      });
    },
    capture () {
      const mediaStreamTrack = this.mediaStream.getVideoTracks()[0];
      const imageCapture = new window.ImageCapture(mediaStreamTrack);

      return imageCapture.takePhoto().then(blob => {
        console.log('file ====', blob)
        firebase.storage().ref().child(`images/picture-${new Date().getTime()}`).put(blob).then(snapshop => {
          console.log('snapshop file ====', snapshop);
          firebase.storage().ref().child(snapshop.ref.location.path).getDownloadURL().then(url => {
            console.log('url ====', url);
            //Insertamos en una tabla el id del usuario, la foto y  descripción.

          }).catch(error => {
            console.error('error get url file', error)
            switch (error.code) {
              case 'storage/object_not_found':
                // File doesn't exist
                break;
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                break;
              case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;
            }
          });
        });
      })
    },
    guardarProducto(){
      let parama = { image_url: this.image_url.name, code: this.code, name: this.name, description: this.description, quantity: this.quantity, price: this.price, tax: this.tax }
    
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

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://code.getmdl.io/1.2.1/material.blue-red.min.css');

  body {
      background-color: #F0F0F0;
  }
  #app {
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
  }
   .camera-modal {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        background-color: white;
        z-index: 10;
    }
    .camera-stream {
        width: 100%;
        max-height: 100%;
    }

    .camera-modal-container {
        position: absolute;
        bottom: 0;
        width: 100%;
        align-items: center;
        margin-bottom: 24px;
    }
    .take-picture-button {
        display: flex;
    }
</style>