<template>
  <div class="container" v-if="admin">
    <v-alert v-model="alert" dismissible border="left" elevation="2" colored-border type="info">
      {{alerta_informacion}}
    </v-alert>

    <form>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label>Nombre del producto</label>
          <input type="text" v-model="name" class="form-control" placeholder="Coca-Cola" />
        </div>

        <div class="form-group col-md-6">
          <label>Descripción</label>
          <input type="text" v-model="description" class="form-control" placeholder="Bebida gaseosa" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-md-3">
          <label>Cantidad</label>
          <input type="number" v-model="quantity" class="form-control" value="45" placeholder="12">
        </div>

        <div class="form-group col-md-3">
          <label>Price</label>
          <input type="number" v-model="price" class="form-control" placeholder="2.1" />
        </div>

        <div class="form-group col-md-3">
          <label>Tax</label>
          <input type="number" v-model="tax" class="form-control" placeholder="21" />
        </div>

        <div class="form-group col-md-3">
          <label>Codigo</label>
          <input type="number" v-model="code" class="form-control" placeholder="21" />
        </div>

        <button type="button" class="btn btn-primary btn-sm btn-block bt-sm" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" @click="btn_tomar_foto()">Tomar foto</button>
        
          <div class="collapse" id="collapseExample">
            <div id="app">
                  <div class="camera-modal">
                    <video ref="video" class="camera-stream"/>
                    <div class="camera-modal-container">
                          <span @click="capture" class="take-picture-button mdl-button mdl-js-button mdl-button--fab mdl-button--colored" data-toggle="collapse" data-target="#collapseExample">
                            <i class="material-icons">camera</i>
                          </span>
                      </div>
                  </div>
                </div>
          </div> 
          <br>
          
          <button type="button" class="btn btn-success btn-lg-sm btn-block" @click="guardarProducto()" >Guardar</button>
        
      </div>
    </form>
  </div>
</template>

<script>
require("material-design-lite");
import firebase from "firebase";
import axios from "axios";

export default {
  name: "app",
  components: {},
  data() {
    return {
      alerta_informacion: '',
      alert: false,

      image_url: "",
      code: "",
      name: "",
      description: "",
      quantity: "",
      price: "",
      tax: "",

      url : '',
      config: '',
      token: '',
      mediaStream: null,
      admin: false
    };
  },
  methods: {
    guardarProducto(){
      let params = { 
        "image_url": this.image_url, 
        "code": this.code, 
        "name": this.name, 
        "description": this.description, 
        "quantity": this.quantity, 
        "price": this.price, 
        "tax": this.tax 
      }
    
      console.log("espero que esto funcione ");
      console.log(params);
      console.log("ruta img " + this.url)
      console.log("config")
      console.log(this.config)

      axios.post(this.url + "products/", params, this.config).then((response) => {
        this.alerta_informacion = "Producto " + params.name  + " Agregado con exito!!";
        this.alert = true;
      });
    },
    btn_tomar_foto(){
      navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(mediaStream => {
        this.mediaStream = mediaStream;
        this.$refs.video.srcObject = mediaStream;
        this.$refs.video.play();
      })
      .catch(error => {
        console.error("getUserMedia() error:", error);
      });
    },
    stop() {
      console.log("stop camera")
      return mediaStream.srcObject && mediaStream.srcObject.getTracks().map(t => t.stop());    
    },
    capture() {
      const mediaStreamTrack = this.mediaStream.getVideoTracks()[0];
      const imageCapture = new window.ImageCapture(mediaStreamTrack);

      return imageCapture.takePhoto().then(blob => {
        console.log("file ====", blob);
        firebase
          .storage()
          .ref()
          .child(`images/picture-${new Date().getTime()}`)
          .put(blob)
          .then(snapshop => {
            console.log("snapshop file ====", snapshop);
            console.log("stop camera")
            mediaStreamTrack.srcObject && mediaStreamTrack.srcObject.getTracks().map(t => t.stop());  
            firebase
              .storage()
              .ref()
              .child(snapshop.ref.location.path)
              .getDownloadURL()
              .then(ruta => {
                this.image_url = ruta;
                console.log("url ====", ruta);
                //Insertamos en una tabla el id del usuario, la foto y  descripción.
              })
              .catch(error => {
                console.error("error get url file", error);
                switch (error.code) {
                  case "storage/object_not_found":
                    // File doesn't exist
                    break;
                  case "storage/unauthorized":
                    // User doesn't have permission to access the object
                    break;
                  case "storage/canceled":
                    // User canceled the upload
                    break;
                  case "storage/unknown":
                    // Unknown error occurred, inspect the server response
                    break;
                }
              });
          });
      });
    }
  },
  close() {
    this.dialog = false;
    this.dialog2 = false;
    this.dialog3 = false;
  },
  mounted() {
    this.url = "https://bodegaapi.herokuapp.com/api/v1/";
    this.token = JSON.parse(localStorage.getItem("token")).key;
      console.log("este es mi token" + this.token)
      if(JSON.parse(localStorage.getItem("user")).rol==1){
        this.admin = true
      }

    this.config = {
      headers: {
        Authorization: 'token ' + this.token
      }
    }
  },
  destroyed() {
    const tracks = this.mediaStream.getTracks();
    tracks.map(track => track.stop());
  }
  
};
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://code.getmdl.io/1.2.1/material.blue-red.min.css");

body {
  background-color: #f0f0f0;
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