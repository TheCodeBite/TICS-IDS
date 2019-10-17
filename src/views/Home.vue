<template>
  <div class="container">
    <v-alert v-model="alert" dismissible border="left" elevation="2" colored-border type="info">
      {{alerta_informacion}}
    </v-alert>

    <v-btn v-if="admin" to="/about" absolute dark fab top right color="pink"> <p/>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Stock</th>
          <th scope="col">Precio($)</th>
          <th scope="col">IVA</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>{{item.name}}</td>
          <td>{{item.quantity}}</td>
          <td>{{item.price}}</td>
          <td>{{item.tax}}</td>
          <td>
            <v-icon
              small
              class="mr-2" title="Borrar" @click="getProduct(item)" data-toggle="modal" data-target="#modalDelete">delete</v-icon>
            <v-icon small class="mr-2" title="Detalles" data-toggle="modal" data-target="#modalInformacion" @click="getProduct(item)">info</v-icon>
            <v-icon small class="mr-2" title="Vender" data-toggle="modal" data-target="#modalStore" @click="getProduct(item)">mdi-tag</v-icon>
          </td>
        </tr>
      </tbody>
    </table>

    <!--MODAL VENDER-->
    <div class="modal fade" id="modalStore" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel" >Vender {{detailproduct.name}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <label><h3>Cantidad</h3></label>
              <input type="text" class="form-control" v-model="cantidad" placeholder="12">

              <label><h3>Método de pago</h3></label>
              <select v-model="metodo_pago" class="form-control">
                <option value="1">Tarjeta</option>
                <option value="2">Efectivo</option>
              </select>
            </form>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="vender(detailproduct)" >Vender</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DETALLES -->
    <div class="modal fade" id="modalInformacion" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel" >Detalles de {{detailproduct.name}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="card bg-dark text-white">
              <img v-bind:src="detailproduct.image_url" class="card-img" >
              <div class="card-img-overlay">
                <h5 class="card-title">{{detailproduct.name}}</h5>
                <p class="card-text">{{detailproduct.description}}</p>
              </div>
            </div>  
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DELETE -->
    <div class="modal fade" id="modalDelete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel" >Borrado de {{detailproduct.name}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <label><h3>Cantidad</h3></label>
              <input type="text" class="form-control" v-model="cantidad" placeholder="12">
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal" @click="deleteItem(detailproduct)" >Eliminar</button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>



<script>
require("material-design-lite");
import firebase from "firebase";
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      items: [],
      detailproduct: [],
      usuario_informacion: [],
      cantidad: '',
      alerta_informacion: '',
      metodo_pago: '',
      alert: false,

      dialog: false,
      dialog2: false,
      dialog_detalles: false,
      dialog3: false,
      admin: false,
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
    console.log("este es mi token" + this.token);
    this.usuario_informacion = JSON.parse(localStorage.getItem("user"));
    if (JSON.parse(localStorage.getItem("user")).rol == 1) {
      this.admin = true;
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
        console.log("PRODUCTO");
        console.log(response);
        this.items = response.data;
      });
    },
    close() {
      (dialog = false),
        (dialog2 = false),
        (dialog_detalles = false),
        (dialog3 = false);
    },
    getProduct(item){
      this.cantidad = ""
      this.detailproduct = []
      this.detailproduct = item
      console.log("este es el producto obtenido " + item.name)
      console.log("imagen " + item.image_url)
    },
    guardarProducto(item) {

      console.log("espero que esto funcione ");
      console.log(item);

      axios.post(this.url + "products/", parama, this.config).then(response => {
        console.log("Producto agregado");
        console.log(response);
        alerta_informacion = "Producto guardado con exito!"
        alert = true
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

      item.quantity = parseInt(this.cantidad)
      axios.put(
          this.url + "inventories/venta/" + item.id + "/",
          params,
          this.config
        ).then(response => {
          let total = parseInt(this.cantidad) * parseFloat(item.price)
          let sale = { "product": response.data.product, "user": this.usuario_informacion.id, "quantity": this.cantidad, "discount": 0, "total": total, "payment_method": this.metodo_pago}
          axios.post(this.url + "sales/",sale, this.config).then(respuesta => {
            this.alert = true;
            this.alerta_informacion = "Se ha realizado la venta de " + this.cantidad + " producto(s) de " + item.name + " con exito!!";       
          }) 
        });
      this.verInventario();
      this.dialog2 = false;
    },
    deleteItem(item) {
      let c = item.quantity - this.cantidad;
      let params = {
        id: item.id,
        price: item.price,
        tax: item.tax,
        product: item.product,
        user: item.user,
        quantity: c
      };
      axios
        .put(this.url + "inventories/" + item.id + "/", item, this.config)
        .then(response => {
          console.log(response.data);
          this.alert = true;
          this.alerta_informacion = "Se han eliminado " +  this.cantidad + " producto(s) de " + item.name + " con exito!!!";
        });
      this.verInventario();
      this.dialog3 = false;
    }
  }
};
</script>
