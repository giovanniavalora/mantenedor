<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">{{nombreProyecto}}</h1>
    
      <div class="container mt-5">
          <v-app>
              <v-data-table
                :headers="headers"
                :items="camiones"
                :items-per-page="10"
                :footer-props="{
                  itemsPerPageAllText: 'Todo',
                  itemsPerPageText: 'Filas por página'
                }"
                sort-by="subcontratista"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Flota</v-toolbar-title>
                    <v-divider
                      class="mx-4"
                      inset
                      vertical
                    ></v-divider>
                    <v-spacer></v-spacer>

                    <v-dialog v-model="dialog" persistent max-width="900px">
                      <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Agregar Nuevo</v-btn>
                      </template>

                      <v-card>
                        <v-card-title>
                          <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
            
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.patente_camion" label="Patente" required></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.marca_camion" label="Marca" required></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.modelo_camion" label="Modelo" required></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.capacidad_camion" label="Capacidad" required></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-select
                                  v-model="editedItem.unidad_medida"
                                  :items="['m3', 'ton']"
                                  label="Unidad de medida"
                                  required
                                ></v-select>
                                <!-- <v-text-field v-model="editedItem.unidad_medida" label="Unidad de medida"></v-text-field> -->
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.numero_ejes" label="Número de ejes"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.color_camion" label="Color camión"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.descripcion" label="Descripción camión"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.nombre_conductor_principal" label="Nombre conductor principal"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.apellido_conductor_principal" label="Apellido conductor principal"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.telefono_conductor_principal" label="Teléfono conductor principal"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-select
                                  v-model="editedItem.subcontratista"
                                  :items= subcontratistas
                                  item-text="nombre_subcontratista" 
                                  item-value="id" 
                                  single-line 
                                  auto 
                                  label="Subcontratista"
                                  required
                                ></v-select>
                                <!-- <v-text-field v-model="editedItem.subcontratista" label="Subcontratista"></v-text-field> -->
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
            
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                          <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogqr" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <!-- <v-dialog v-model="dialogqr" hide-overlay transition="dialog-bottom-transition"> -->
                      <v-card id="imprimirQR">
                        <v-toolbar dark color="primary">
                          <v-btn icon dark @click="dialogqr = false">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                          <v-toolbar-title>Codigo QR</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-toolbar-items>
                            <v-btn dark text @click="imprimirqr">Imprimir</v-btn>
                          </v-toolbar-items>
                        </v-toolbar>
                        <!-- <v-card-title>
                          <span class="headline">Código QR</span>
                        </v-card-title> -->
                        <v-card-text class="text-center mt-12">
                          <v-container id="qrcamion" fluid>
                            <div>
                              <qrcode-vue :value="qrvalue" :size="size" level="H"></qrcode-vue>
                            </div>
                            <div><h1>
                              <br><br>{{datosCamionQR.patente_camion}} <br><br>
                            </h1></div>
                            <div><h1>
                              {{datosCamionQR.marca_camion}}<br><br>
                            </h1></div>
                            <div><h1>
                              {{datosCamionQR.modelo_camion}}<br><br>
                            </h1></div>
                            
                          </v-container>
                        </v-card-text>
                        <!-- <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="dialogqr=false">Cancelar</v-btn>
                          <v-btn id="btnPrint" color="blue darken-1" text @click="imprimirqr">Imprimir</v-btn>
                        </v-card-actions> -->
                      </v-card>
                    </v-dialog>

                  </v-toolbar>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="getDatosCamionQR(item)"
                  >
                    mdi-qrcode
                  </v-icon>

                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  
                  <v-icon
                    small
                    class="mr-2"
                    @click="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                  
                </template>

              </v-data-table>
          </v-app>
      </div>
    </v-flex>
  </v-layout>
</template>



<script>
import axios from 'axios';
import QrcodeVue from 'qrcode.vue'

export default {
  layout: 'login',
  middleware: 'authenticated',
  data(){
    return {
      dialog: false,
      dialogqr: false,

      qrvalue: '',
      size: 300,
      datosCamionQR: {
        id: '',
        patente_camion: "",
        marca_camion: "",
        modelo_camion: "",
      },

      textfootertable:{
        text: 'todo'
      },

      headers: [
        {
          text: 'Subcontratista',
          align: 'start',
          sortable: false,
          value: 'subcontratista',
        },
        { text: 'Patente', value: 'patente_camion' },
        { text: 'Marca', value: 'marca_camion' },
        { text: 'Modelo', value: 'modelo_camion' },
        { text: 'Capacidad', value: 'capacidad_camion' },
        { text: 'Número de ejes', value: 'numero_ejes' },
        { text: 'Nombre conductor', value: 'nombre_conductor_principal' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      subcontratistas: [],
      camiones: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        patente_camion: "",
        marca_camion: "",
        modelo_camion: "",
        capacidad_camion: "",
        nombre_conductor_principal: "",
        apellido_conductor_principal: "",
        telefono_conductor_principal: "",
        descripcion: "",
        numero_ejes: "",
        unidad_medida: "",
        color_camion: "",
        subcontratista: "",
        nom_subcontratista: "", //no es propio del modelo, se agrega en el front
      }
    }
  },
  components: {
    QrcodeVue,
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Agregar Nuevo Camión' : 'Editar Camión'
    },
    nombreProyecto () {
      return this.$store.state.auth['Proyecto'].nombre_proyecto;
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {
    imprimirqr() {
      const elem = document.getElementById("imprimirQR")
      var domClone = elem.cloneNode(true);
      var $printSection = document.getElementById("printSection");
      if (!$printSection) {
          var $printSection = document.createElement("div");
          $printSection.id = "printSection";
          document.body.appendChild($printSection);
      }
      $printSection.innerHTML = "";
      $printSection.appendChild(domClone);
      window.print();
      this.dialogqr=false

    },

    getDatosCamionQR (item) {
      console.log("datosCamionQR: ",item)
      this.$axios.get(`/CodigoQRCamion/${item.id}`)
      .then(res => {
        console.log("id_codigoqr_activo:",res.data.data.id_codigoqr_activo)
        this.qrvalue = String(res.data.data.id_codigoqr_activo)
        // this.editedItem['id']=res.data['id']
        // Object.assign(this.camiones[this.editedIndex], this.editedItem)
      })
      .catch(error => {
        this.qrvalue = 'error'
        alert(Object.values(error.response.data))
      });
      this.datosCamionQR = Object.assign({}, item)
      this.dialogqr=true
    },


    editItem (item) {
      this.editedIndex = this.camiones.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.camiones.indexOf(item)
      let id = item.id
      var result = confirm('¿Desea eliminar item?') && this.camiones.splice(index, 1)
      if (result)
        this.$axios.delete(`/Camion/${id}/`)
        .catch(error => {
            alert(Object.values(error.response.data))
        });
    },

    close () {
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300),
      this.dialog = false
    },



    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.camiones[this.editedIndex], this.editedItem)
        this.$axios.put(`/Camion/${this.editedItem['id']}/`,this.editedItem)
        .then(res => {
          console.log("edit re.data:",res.data)
        })
        .catch(error => {
          alert(Object.values(error.response.data))
        });
       
      } else {
        console.log("this.editedItem",this.editedItem)
        // this.editedItem['id']=res.data['id'] /** No va aqui (solucion parche) */
        this.camiones.push(this.editedItem) /** No va aqui (solucion parche) */
        this.$axios.post('/Camion/',this.editedItem)
        .then(res => {
          if(res.data){
            // this.camiones.push(this.editedItem)
            console.log("new re.data:",res.data)
          }
        })
        .catch(error => {
          alert(Object.values(error.response.data))
        });
      }
      this.close()
    },
  },

  async created(){
    try {
      // const res = await axios.get('http://157.245.237.33:5000/api/v1/Camion/')
      const rescamion = await this.$axios.get('/Camion/')
      this.camiones = rescamion.data;

      /** Para mostrar los nombres de los Subcontratista en el dropdown del modal **/
      const resp_subcontratistas = await this.$axios.get('/Subcontratista/')
      this.subcontratistas = resp_subcontratistas.data;

    } catch (error) {
      console.log(error)
    }
  }
  // asyncData({$axios}){
  //     const res = await $axios.get('/camion/')
  //     this.camiones = res.data;
  // }
    
    
  

}
</script>

<style>

/* @media screen {
    #printSection {
        display: none;
    }
}
@media print {
    body * {
        visibility:hidden;
    }
    .no-print {
        display: none;
    }
    .v-toolbar {
      padding: 0 !important;
    }
    #printSection, #printSection * {
        visibility:visible;
    }
    #printSection {
        position:absolute;
        left:0;
        top:0;
    }
} */

</style>
