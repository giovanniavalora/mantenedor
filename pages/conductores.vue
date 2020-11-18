<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">{{nombreProyecto}}</h1>
    
      <div class="container mt-5">
          <v-app>
              <v-data-table
                :headers="headers"
                :items="conductores"
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
                      <v-toolbar-title>Conductores</v-toolbar-title>
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
                                        <v-text-field v-model="editedItem.nombre" label="Nombre" :rules="nombreapellidoRules" required></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.apellido" label="Apellido" :rules="nombreapellidoRules" required></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.rut" label="Rut" :rules="rutRules" required></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.telefono" label="Telefono" :rules="telefonoRules" required></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.email" label="Email" :rules="emailRules"></v-text-field>
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


                      <v-dialog v-model="dialogCamiones" persistent max-width="500px">
                          <v-card>
                              <v-card-title>
                                <span class="headline">Asignar Camiones</span>
                              </v-card-title>
                              <v-card-text>
                                  <v-container fluid>
                                    <v-data-iterator
                                      :items="camiones"
                                      item-key="patente_camion"
                                      :single-expand="singleExpand"
                                      hide-default-footer
                                    >
                                        <template v-slot:default="{ items, isExpanded, expand }">
                                            <v-row>
                                              <v-col
                                                v-for="item in items"
                                                :key="item.patente_camion"
                                                cols="12"
                                                sm="12"
                                                md="12"
                                                lg="12"
                                              >
                                                  <v-row align="center">
                                                      <v-col>
                                                          <v-checkbox
                                                            v-model="camionesAsignados.camiones"
                                                            v-bind:label=item.patente_camion
                                                            v-bind:value=item.id
                                                          ></v-checkbox>
                                                      </v-col>
                                                      <v-col>
                                                          <v-switch
                                                            :input-value="isExpanded(item)"
                                                            :label="isExpanded(item) ? 'Ocultar' : 'Mostrar más'"
                                                            dense
                                                            @change="(v) => expand(item, v)"
                                                          ></v-switch>
                                                      </v-col>
                                                  </v-row>
                                                  
                                                  <v-list
                                                    v-if="isExpanded(item)"
                                                    dense
                                                  >
                                                    <v-list-item>
                                                      <v-list-item-content>Marca:</v-list-item-content>
                                                      <v-list-item-content class="align-end">
                                                        {{ item.marca_camion }}
                                                      </v-list-item-content>
                                                    </v-list-item>
                                                    <v-list-item>
                                                      <v-list-item-content>Modelo:</v-list-item-content>
                                                      <v-list-item-content class="align-end">
                                                        {{ item.modelo_camion }}
                                                      </v-list-item-content>
                                                    </v-list-item>
                                                    
                                                  </v-list>
                                                  <v-divider></v-divider>
                                              </v-col>
                                            </v-row>
                                            
                                        </template>
                                        <!-- <template v-slot:footer>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                                    <v-btn color="blue darken-1" text @click="saveAsignacionCamiones">Guardar</v-btn>
                                            </v-card-actions>
                                        </template> -->
                                        
                                    </v-data-iterator>
                                  </v-container>
                              </v-card-text>

                              <v-card-actions>
                                  <v-spacer></v-spacer>
                                      <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                      <v-btn color="blue darken-1" text @click="saveAsignacionCamiones">Guardar</v-btn>
                              </v-card-actions>

                          </v-card>
                      </v-dialog>

                  </v-toolbar>
                </template>

                <template v-slot:item.actions="{ item }">

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
                    @click="getCamiones(item)"
                  >
                    mdi-dump-truck
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

      /* Camion */
      dialogCamiones: false,
      singleExpand: true, //Para expandir la información de un camión a la vez
      camiones: [],
      camionesAsignados: {
        id_conductor: '',
        camiones:[]
      },


      /* Conductor */
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
        { text: 'Nombre', value: 'nombre' },
        { text: 'Apellido', value: 'apellido' },
        { text: 'Rut', value: 'rut' },
        { text: 'telefono', value: 'telefono' },
        { text: 'email', value: 'email' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      subcontratistas: [],
      conductores: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        nombre: "",
        apellido: "",
        rut: "",
        telefono: "",
        email: "",
        subcontratista: "",
        camion: [],
        nom_subcontratista: "", //no es propio del modelo, se agrega en el front
      },

      /* Validación de formulario */
      valid: false,
      nombreapellidoRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 20) || 'Este campo debe tener menos de 20 caracteres',
      ],
      // rutRules:[
      //   v => /^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(v) || 'Ingrese Rut sin puntos y con guión',
      // ],
      rutRules:[
        v => {
          if (v) return /^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(v) || 'Ingrese Rut sin puntos y con guión';
          else return true;
        },
      ],
      telefonoRules: [
        // v => !!v || 'Este campo es requerido',
        v => {
          if (v) return v.length <= 16 || 'Este campo debe tener menos de 16 caracteres';
          else return true;
        },
      ],      
      emailRules: [
        v => {
          if (v) return /.+@.+\..+/.test(v) || 'E-mail debe ser valido: ejemplo@dominio.ej';
          else return true;
        },
      ],
      // telefonoRules: [
      //   v => !!v || 'Este campo es requerido',
      //   v => (v && v.length <= 16) || 'Este campo debe tener menos de 16 caracteres',
      // ],
      subcontratistaRules: [
        v => !!v || 'Este campo es requerido',
        // v => (v && v.length <= 50) || 'Este campo debe tener menos de 50 caracteres',
      ],

    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Agregar Nuevo Conductor' : 'Editar Conductor'
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
    getCamiones(item) {
      this.editedIndex = this.conductores.indexOf(item)
      this.editedItem = Object.assign({}, item)
      // console.log("ns1:",item.nom_subcontratista)
      console.log("itemgetCamiones:",this.editedItem)
      this.camionesAsignados = Object.assign({}, {'id_conductor':item.id, 'camiones':item.camion}) //se obtienen los camiones actualmente asignados al conductor
      console.log("camionesAsignados:",this.camionesAsignados)
      var ns = this.subcontratistas.find(x => x.id === item.subcontratista).nombre_subcontratista;
      this.$axios.get(`/backend/Subcontratista/${item.subcontratista}/Camion/`)
      .then(res => {
        console.log("res:",res)
        this.camiones=res.data //se obtienen todos los camiones pertenecientes al subcontratista del conductor
      })
      .catch(error => {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = error
      });
      // this.datosCamionQR = Object.assign({}, item)
      this.dialogCamiones=true
    },
    saveAsignacionCamiones () {
      console.log("camiones: ",this.camiones)
      console.log("ID conductor: ",this.camionesAsignados.id_conductor)
      console.log("ID camiones: ",this.camionesAsignados.camiones)
      console.log("editedIndex: ",this.editedIndex)
      console.log("editedItem: ",this.editedItem)
      this.$axios.patch(`/backend/Conductor/${this.camionesAsignados.id_conductor}/`,{'camion':this.camionesAsignados.camiones})
      .then(res => {
        console.log("res:",res)
      })
      .catch(error => {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = error
      });
      // falta asignar a la lista de objetos conductores los nuevos camiones asignados:
      //algo así Object.assign(conductores[index].camion, camionesAsignados.camiones)
      Object.assign(this.conductores[this.editedIndex].camion, this.camionesAsignados.camiones)
      //pero falta el index
      this.close()

    },



    editItem (item) {
      this.editedIndex = this.conductores.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.conductores.indexOf(item)
      let id = item.id
      var result = confirm('¿Desea eliminar item?') && this.conductores.splice(index, 1)
      if (result){
        this.$axios.delete(`/backend/Conductor/${id}/`)
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
      this.dialogCamiones=false
    },



    async save () {
        /* Validación formulario */
        if (this.$refs.form.validate() ){

            /* Para editar un registro */
            if (this.editedIndex > -1) {
              try {
                console.log("item a editar:",this.editedItem)
                let res = await this.$axios.put(`/backend/Conductor/${this.editedItem['id']}/`,this.editedItem)
                if(res.status == 200){
                  Object.assign(this.conductores[this.editedIndex], this.editedItem)
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
                  let res = await this.$axios.post('/backend/Conductor/',this.editedItem)
                  if(res.status == 201){
                      this.editedItem['id']=res.data['id']
                      this.editedItem.nom_subcontratista = this.subcontratistas.find(x => x.id === this.editedItem.subcontratista).nombre_subcontratista;
                      // console.log("verification",this.editedItem)
                      this.conductores.push(this.editedItem)
                      this.snack = true
                      this.snackColor = 'success'
                      this.snackText = 'Creado'
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
      // const res = await axios.get('http://157.245.237.33:5000/api/v1/Conductor/')
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      const resconductor = await this.$axios.get(`/backend/Proyecto/${this.idProyecto}/Conductor/`)
      this.conductores = resconductor.data;
      console.log("resconductor", resconductor.data)

      /** Para mostrar los nombres de los Subcontratista en el dropdown del modal **/
      const resp_subcontratistas = await this.$axios.get('/backend/Subcontratista/') //Se obtienen todos, pero debieran ser solo los del proyecto
      this.subcontratistas = resp_subcontratistas.data;
      console.log("subcontratistas", this.subcontratistas)
      this.subcontratistas = this.subcontratistas.filter(x => x.proyecto === this.idProyecto)

      /* Lo siguiente debiera ocurrir en el backend, el cual debiera enviar el nombre del subcontratista al que pertenece */
      /* Asigna a 'conductores' el atributo del nombre del subcontratista al que pertenece */
      for(var prop in this.conductores){
        this.conductores[prop].nom_subcontratista = this.subcontratistas.find(x => x.id === this.conductores[prop].subcontratista).nombre_subcontratista;
      }
      this.editedItem = Object.assign({}, {}) //para actualizar la tabla (solo en caso si llegase a demorarse más que la carga de la misma tabla)

    } catch (error) {
      console.log(error)
    }
  },
  // async asyncData({$axios}){
  // async asyncData({req,res}){
  //   try {
  //     // const res = await axios.get('http://157.245.237.33:5000/api/v1/Conductor/')
  //     if(process.server){
  //       console.log("Servidori")
  //       const resconductor = await axios.get('http://127.0.0.1:5000/api/v1/Camion/')
  //       console.log("resconductor.data",resconductor.data);
  //       console.log("req.headers.host",req.headers.host)
  //       console.log("Servidorf")
  //     }
      
  //     const resp_subcontratistas = await axios.get('http://127.0.0.1:5000/api/v1/Subcontratista/') //Se obtienen todos, pero debieran ser solo los del proyecto
  //     console.log("resp_subcontratistas.data",resp_subcontratistas.data);

  //     // for(var prop in this.conductores){
  //     //   this.conductores[prop].nom_subcontratista = this.subcontratistas.find(x => x.id === this.conductores[prop].subcontratista).nombre_subcontratista;
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
