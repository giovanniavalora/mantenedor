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

                            <v-form
                              ref="form"
                              v-model="valid"
                              lazy-validation
                            >
                                  <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.patente_camion" label="Patente" :rules="patenteRules" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.marca_camion" label="Marca" :rules="marcamodeloRules" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.modelo_camion" label="Modelo" :rules="marcamodeloRules" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.capacidad_camion" label="Capacidad" :rules="capacidadRules" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-select
                                        v-model="editedItem.unidad_medida"
                                        :items="['m3', 'ton']"
                                        label="Unidad de medida"
                                        :rules="unidadmedidaRules"
                                        required
                                      ></v-select>
                                      <!-- <v-text-field v-model="editedItem.unidad_medida" label="Unidad de medida"></v-text-field> -->
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.numero_ejes" label="Número de ejes" :rules="nroejesRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.color_camion" label="Color camión" :rules="colorRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.nombre_conductor_principal" label="Nombre conductor principal" :rules="nombreapellidoRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.apellido_conductor_principal" label="Apellido conductor principal" :rules="nombreapellidoRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.telefono_conductor_principal" label="Teléfono conductor principal" :rules="telefonoRules"></v-text-field>
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
                                        :rules="subcontratistaRules"
                                        required
                                      ></v-select>
                                      <!-- <v-select
                                        v-model="editedItem.nom_subcontratista"
                                        :items= subcontratistas
                                        item-text="nombre_subcontratista" 
                                        item-value="id" 
                                        single-line 
                                        auto 
                                        label="Subcontratista"
                                        required
                                      ></v-select> -->
                                      <!-- <v-text-field v-model="editedItem.subcontratista" label="Subcontratista"></v-text-field> -->
                                    </v-col>
                                  </v-row>
                            </v-form>
                          </v-container>
                        </v-card-text>
            
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                          <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Guardar</v-btn>
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
                                  <v-btn dark text  @click="nuevoqr">Nuevo QR</v-btn>
                                  <v-btn dark text @click="imprimirqr">Imprimir</v-btn>
                              </v-toolbar-items>
                        </v-toolbar>
                        <!-- <v-card-title>
                          <span class="headline">Código QR</span>
                        </v-card-title> -->
                        <v-container fill-height fluid>
                          
                          <v-row justify="center">
                            <v-col cols="12" sm="10" md="9">
                                  <v-col cols="12">
                                        <v-row justify="center">
                                        <h1>{{editedItem.nom_subcontratista}}</h1>
                                        </v-row>
                                  </v-col>
                                  <v-col cols="12">
                                        <v-row justify="center">
                                        <qrcode-vue :value="qrvalue" :size="size" level="H"></qrcode-vue>
                                        </v-row>
                                  </v-col>
                                  <v-col cols="12">
                                        <v-row justify="center">
                                        <h2>{{datosCamionQR.patente_camion}}</h2>
                                        </v-row>
                                  </v-col>
                                  <v-col cols="12">
                                        <v-row justify="center">
                                        <h3>{{datosCamionQR.marca_camion}} {{datosCamionQR.modelo_camion}}</h3>
                                        </v-row>
                                  </v-col>
                                  <!-- <v-col cols="12">
                                        <v-row justify="center">
                                        <h3>{{datosCamionQR.modelo_camion}}</h3>
                                        </v-row>
                                  </v-col> -->
                            </v-col>
                            <v-col cols="12" sm="2" md="3">
                                <v-col cols="12">
                                  <!-- <v-subheader class="pa-2"> Tamaño QR</v-subheader> -->
                                  Tamaño QR
                                  <v-slider
                                    v-model="size"
                                    :thumb-size="24"
                                    min="100"
                                    max="300"
                                    thumb-label
                                    inverse-label=""
                                  ></v-slider>
                                </v-col>
                                <v-col cols="12">
                                    <!-- <v-subheader class="pa-2"> Activar/Desactivar Código QR</v-subheader> -->
                                    Activar/Desactivar
                                    <!-- <v-row justify="center"> -->
                                      <v-switch
                                          dense
                                          v-model="datosqractivo.activo"
                                          @change="activacionqr"
                                      ></v-switch>
                                    <!-- </v-row> -->
                                </v-col>
                                
                            </v-col>
                            
                          </v-row>
                        </v-container>
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
              <v-snackbar v-model="snack" :timeout="3000" :color="snackColor" :top="snackTop">
                {{ snackText }}
                <v-btn text @click="snack = false">cerrar</v-btn>
              </v-snackbar>
          </v-app>
      </div>
    </v-flex>
  </v-layout>
</template>



<script>
import axios from 'axios';
import QrcodeVue from 'qrcode.vue'

export default {
  middleware: 'authenticated',
  data(){
    return {
      /* SnackBar */
      snack: false,
      snackColor: '',
      snackText: '',
      snackTop: true,

      /* CodigoQR */
      dialogqr: false,
      qrvalue: '',
      size: 200,
      datosqractivo: {
          id: '',
          camion: '',
          activo: '',
      },
      datosCamionQR: {
        id: '',
        patente_camion: "",
        marca_camion: "",
        modelo_camion: "",
      },

      /* Camion */
      dialog: false,
      textfootertable:{
        text: 'todo'
      },
      headers: [
        {
          text: 'Subcontratista',
          align: 'start',
          sortable: false,
          value: 'nom_subcontratista',
        },
        { text: 'Patente', value: 'patente_camion' },
        { text: 'Marca', value: 'marca_camion' },
        { text: 'Modelo', value: 'modelo_camion' },
        { text: 'Capacidad', value: 'capacidad_camion' },
        { text: 'Número de ejes', value: 'numero_ejes' },
        { text: 'Nombre conductor', value: 'nombre_conductor_principal' },
        { text: 'Acciones', value: 'actions', sortable: false }
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
        numero_ejes: "",
        unidad_medida: "",
        color_camion: "",
        subcontratista: "",
        nom_subcontratista: "", //no es propio del modelo, se agrega en el front
      },

      /* Validación de formulario */
      valid: false,
      patenteRules:[
        v => !!v || 'Este campo es requerido',
        v => (v && v.length == 6) || 'Este campo debe tener 6 caracteres',
      ],
      marcamodeloRules:[
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 20) || 'Este campo debe tener menos de 20 caracteres',
      ],
      capacidadRules: [
        v => !!v || 'Es requerido',
        v => v <= 100 || 'Este valor no puede ser superior a 100',
      ],
      unidadmedidaRules: [
        v => !!v || 'Este campo es requerido',
        // v => (v && v.length <= 50) || 'Este campo debe tener menos de 50 caracteres',
      ],
      nroejesRules: [
        v => {
          if (v) return v.length <= 5 || 'Este campo debe tener menos de 6 caracteres';
          else return true;
        },
      ],
      colorRules: [
        v => {
          if (v) return v.length <= 20 || 'Este campo debe tener menos de 20 caracteres';
          else return true;
        },
      ],
      nombreapellidoRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 20) || 'Este campo debe tener menos de 20 caracteres',
      ],
      telefonoRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 16) || 'Este campo debe tener menos de 16 caracteres',
      ],
      subcontratistaRules: [
        v => !!v || 'Este campo es requerido',
        // v => (v && v.length <= 50) || 'Este campo debe tener menos de 50 caracteres',
      ],

    }
  },
  components: {
    QrcodeVue,
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Agregar Nuevo Camión' : 'Editar Camión'
    },
    idProyecto () {
      return this.$store.state.auth['Proyecto'].id;
    },
    nombreProyecto () {
      return this.$store.state.auth['Proyecto'].nombre_proyecto;
    },
    // nombreSubcontratista(){
    //     var ns = this.subcontratistas.find(item => item.id === this.editedItem.id);
    //     console.log("ns",ns)
    //     return ns;
    // }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {
    nuevoqr() {
      // console.log("nqr.editedItem: ",this.editedItem)
      // console.log("nqr.datosCamionQR: ",this.datosCamionQR)
      let result = confirm('Al crear un nuevo código QR se desactivará el anterior, ¿Desea continuar?')
      if (result){
        this.$axios.post('/backend/CodigoQR/',{"camion":this.datosCamionQR.id})
        .then(res => {
          // console.log("nuevo qr:",res.data)
          this.datosqractivo=res.data
          this.qrvalue = '{\"id_qr\":'+String(res.data.id)+', \"id_camion\":'+String(res.data.camion)+'}'
          this.snack = true
          this.snackColor = 'success'
          this.snackText = 'Nuevo código qr creado'
        })
      }
    },
    activacionqr(){
      // console.log("dqr.datosCamionQR",this.datosqractivo)
      this.$axios.put(`/backend/CodigoQR/${this.datosqractivo.id}/`,this.datosqractivo)
      .then(res => {
          if(res.status == 200){
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Actualizado'
          }else{
            this.snack = true
            this.snackColor = 'error'
            this.snackText = 'Hubo un error al actualizar. Refresque el navegador.'
          }
      })
      .catch(error => {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'Hubo un error al actualizar. Refresque el navegador. '+error
      });
    },


    imprimirqr() {
      // const elem = document.getElementById("imprimirQR")
      // var domClone = elem.cloneNode(true);
      // var $printSection = document.getElementById("printSection");
      // if (!$printSection) {
      //     var $printSection = document.createElement("div");
      //     $printSection.id = "printSection";
      //     document.body.appendChild($printSection);
      // }
      // $printSection.innerHTML = "";
      // $printSection.appendChild(domClone);
      print() // window.print();
    },

    getDatosCamionQR (item) {
      this.editedItem = Object.assign({}, item)
      // console.log("ns1:",item.nom_subcontratista)
      // console.log("item:",item)
      var ns = this.subcontratistas.find(x => x.id === item.subcontratista).nombre_subcontratista;
      // console.log("ns2: ",ns)
      this.$axios.get(`/backend/CodigoQRCamion/${item.id}/`)
      .then(res => {
        // console.log("codigoqr_activo:",res.data.data.codigoqr_activo)
        this.datosqractivo=res.data.data.codigoqr_activo
        this.qrvalue = '{\"id_qr\":'+String(res.data.data.codigoqr_activo.id)+', \"id_camion\":'+String(res.data.data.codigoqr_activo.camion)+'}'
      })
      .catch(error => {
        this.qrvalue = 'error'
        this.snack = true
        this.snackColor = 'error'
        this.snackText = error
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
      if (result){
        this.$axios.delete(`/backend/Camion/${id}/`)
        .catch(error => {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = error
        });
      }
    },

    close () {
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300),
      this.dialog = false
    },



    async save () {
        /* Validación formulario */
        if (this.$refs.form.validate() ){

            /* Para editar un registro */
            if (this.editedIndex > -1) {
              try {
                console.log("item a editar:",this.editedItem)
                let res = await this.$axios.put(`/backend/Camion/${this.editedItem['id']}/`,this.editedItem)
                if(res.status == 200){
                  Object.assign(this.camiones[this.editedIndex], this.editedItem)
                  this.snack = true
                  this.snackColor = 'success'
                  this.snackText = 'Actualizado'
                }else{
                  this.snack = true
                  this.snackColor = 'error'
                  this.snackText = 'Hubo un error al actualizar. Refresque el navegador.'
                }
              } catch (error) {
                this.snack = true
                this.snackColor = 'error'
                this.snackText = error
                console.log(error)
              }
            /*Para crear un nuevo registro*/
            } else {
              try {
                  let res = await this.$axios.post('/backend/Camion/',this.editedItem)
                  if(res.status == 201){
                      this.editedItem['id']=res.data['id']
                      this.editedItem.nom_subcontratista = this.subcontratistas.find(x => x.id === this.editedItem.subcontratista).nombre_subcontratista;
                      // console.log("verification",this.editedItem)
                      this.camiones.push(this.editedItem)
                      this.snack = true
                      this.snackColor = 'success'
                      this.snackText = 'Creado'
                      this.$axios.post('/backend/CodigoQR/',{'camion':res.data['id']})
                  }else{
                      this.snack = true
                      this.snackColor = 'error'
                      this.snackText = 'Hubo un error al crear. Refresque el navegador.'+res.error
                  }
              } catch (error) {
                  this.snack = true
                  this.snackColor = 'error'
                  this.snackText = error
              }
            }
            this.close()
        }
    },
  },

  async created(){
    try {
      // const res = await axios.get('http://157.245.237.33:5000/api/v1/Camion/')
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      const rescamion = await this.$axios.get(`/backend/Proyecto/${this.idProyecto}/Camion/`)
      this.camiones = rescamion.data;
      console.log("rescamion", rescamion.data)

      /** Para mostrar los nombres de los Subcontratista en el dropdown del modal **/
      const resp_subcontratistas = await this.$axios.get('/backend/Subcontratista/') //Se obtienen todos, pero debieran ser solo los del proyecto
      this.subcontratistas = resp_subcontratistas.data;
      console.log("subcontratistas", this.subcontratistas)
      this.subcontratistas = this.subcontratistas.filter(x => x.proyecto === this.idProyecto)

      /* Lo siguiente debiera ocurrir en el backend, el cual debiera enviar el nombre del subcontratista al que pertenece */
      /* Asigna a 'camiones' el atributo del nombre del subcontratista al que pertenece */
      for(var prop in this.camiones){
        this.camiones[prop].nom_subcontratista = this.subcontratistas.find(x => x.id === this.camiones[prop].subcontratista).nombre_subcontratista;
      }
      this.editedItem = Object.assign({}, {}) //para actualizar la tabla (solo en caso si llegase a demorarse más que la carga de la misma tabla)

    } catch (error) {
      console.log(error)
    }
  },
  // async asyncData({$axios}){
  // async asyncData({req,res}){
  //   try {
  //     // const res = await axios.get('http://157.245.237.33:5000/api/v1/Camion/')
  //     if(process.server){
  //       console.log("Servidori")
  //       const rescamion = await axios.get('http://127.0.0.1:5000/api/v1/Camion/')
  //       console.log("rescamion.data",rescamion.data);
  //       console.log("req.headers.host",req.headers.host)
  //       console.log("Servidorf")
  //     }
      
  //     const resp_subcontratistas = await axios.get('http://127.0.0.1:5000/api/v1/Subcontratista/') //Se obtienen todos, pero debieran ser solo los del proyecto
  //     console.log("resp_subcontratistas.data",resp_subcontratistas.data);

  //     // for(var prop in this.camiones){
  //     //   this.camiones[prop].nom_subcontratista = this.subcontratistas.find(x => x.id === this.camiones[prop].subcontratista).nombre_subcontratista;
  //     // }

  //   } catch (error) {
  //     console.log("errorcito:",error)
  //   }
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
