<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">{{nombreProyecto}}</h1>
      
      <div class="container mt-5">
          <v-app>
              <v-data-table
                :headers="headers"
                :items="destinos"
                :items-per-page="10"
                :footer-props="{
                  itemsPerPageAllText: 'Todo',
                  itemsPerPageText: 'Filas por página'
                }"
                sort-by="nombre_destino"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Destinos</v-toolbar-title>
                    <v-divider
                      class="mx-4"
                      inset
                      vertical
                    ></v-divider>
                    <v-spacer></v-spacer>

                    <v-dialog v-model="dialog" max-width="900px">
                      <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on" @click="forceRerender">Agregar Nuevo</v-btn>
                      </template>

                      <v-card>
                        <v-card-title>
                          <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-form
                          ref="form"
                          v-model="valid"
                          lazy-validation
                        >

                            <v-card-text>
                              <v-container>
                                  
                                  <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.nombre_destino" :rules="nombredestinoRules" label="Nombre destino"  required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.nombre_propietario" :rules="nombredestinoRules" label="nombre propietario"  required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.rut_propietario" label="Rut propietario" :rules="rutRules" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.comuna" label="Comuna" :rules="comunacalleRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.calle" label="Calle" :rules="comunacalleRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                      <v-text-field v-model="editedItem.numero" label="Número" :rules="numeroRules"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" v-if="formTitle === 'Editar Destino'">
                                      <v-data-table 
                                        dense
                                        :headers="headers_material"
                                        :items="filteredMateriales"
                                        hide-default-header
                                        hide-default-footer
                                        sort-by="material"
                                        class="elevation-1"
                                        >
                                              <template v-slot:top>
                                                <v-toolbar class="grey lighten-5" flat short dense>
                                                      Materiales
                                                  <v-divider
                                                    class="mx-4"
                                                    inset
                                                    vertical
                                                  ></v-divider>
                                                  <v-spacer></v-spacer>
                                                      <v-btn color="primary" class="mr-5" small @click="dialog_material=true">Agregar</v-btn>
                                                      <!-- <v-icon color="primary" class="align-right" @click="dialog_suborigen=true">
                                                          mdi-plus-circle
                                                      </v-icon> -->
                                                </v-toolbar>
                                                <v-divider></v-divider>
                                                <v-dialog v-model="dialog_material" max-width="300px">
                                                    <v-card>
                                                      <v-card-title>Nuevo Material</v-card-title>
                                                      <v-card-text>
                                                        <v-container>
                                                          <v-row justify="center">
                                                            <v-col>
                                                              <v-text-field v-model="editedItemMaterial.material" label="Tipo Material"></v-text-field>
                                                            </v-col>
                                                          </v-row>
                                                        </v-container>
                                                      </v-card-text>
                                                      <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="blue darken-1" text @click="cancelmaterial">Cancelar</v-btn>
                                                        <v-btn color="blue darken-1" text @click="saveCreateMaterial">Guardar</v-btn>
                                                      </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                              </template> 
                                              

                                              <template v-slot:item.material="props">
                                                  <v-edit-dialog
                                                    dense
                                                    :return-value.sync="props.item.material"
                                                    @save="saveEditMaterial(props.item)"
                                                    @cancel="cancelmaterial"
                                                    @open="openmaterial"
                                                    @close="closematerial"
                                                  > {{props.item.material}}
                                                      <template v-slot:input>
                                                          <v-text-field
                                                              dense
                                                              v-model="props.item.material"
                                                              :rules="[maxchars]"
                                                              label="Edit"
                                                              single-line
                                                              counter
                                                              autofocus
                                                          ></v-text-field>
                                                      </template>
                                                  </v-edit-dialog>
                                              </template>
                                              <template v-slot:item.actions="{ item }">
                                                <v-container fill-height fluid>
                                                <v-row class="mr-2" justify="end">
                                                  <v-icon
                                                    small
                                                    @click="deletematerial(item)"
                                                  >
                                                    mdi-delete
                                                  </v-icon>
                                                </v-row>
                                                </v-container>
                                              </template>
                                      </v-data-table> 
                                    </v-col>
                                    <v-col cols="12">
                                      <Map 
                                          class="map" 
                                          :key="componentKey"
                                          :lat="editedItem.latitud" 
                                          :lng="editedItem.longitud" 
                                          @latitudeChange="editedItem.latitud = $event" 
                                          @longitudeChange="editedItem.longitud = $event">
                                      </Map>
                                    </v-col>
                                  </v-row>
                              
                            
                              </v-container>
                            </v-card-text>
                        </v-form>


                        <!-- <v-container fill-height fluid>
                          <v-row justify="center" align="center">
                              <Map 
                                  class="map" 
                                  :key="componentKey"
                                  :lat="editedItem.latitud" 
                                  :lng="editedItem.longitud" 
                                  @latitudeChange="editedItem.latitud = $event" 
                                  @longitudeChange="editedItem.longitud = $event">
                              </Map>
                          </v-row>
                        </v-container> -->
                          
            
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                          <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Guardar</v-btn>
                        </v-card-actions>
                      </v-card>
                      
                    </v-dialog>
                  </v-toolbar>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item); forceRerender();"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    small
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
import Map from '~/components/Map.vue';

export default {
  middleware: 'authenticated',
  data(){
    return {
      /*Forzar Render de Map*/
      componentKey: 0,

      /* SnackBar */
      snack: false,
      snackColor: '',
      snackText: '',
      snackTop: true,

      /*Destino*/
      dialog: false,
      headers: [
        {
          text: 'Destino',
          align: 'start',
          sortable: false,
          value: 'nombre_destino',
        },
        { text: 'Propietario', value: 'nombre_propietario' },
        { text: 'Rut propietario', value: 'rut_propietario' },
        { text: 'Comuna', value: 'comuna' },
        { text: 'Calle', value: 'calle' },
        { text: 'Número', value: 'numero' },
        // { text: 'Longitud', value: 'longitud' },
        // { text: 'Latitud', value: 'latitud' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      
      destinos: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        nombre_destino: '',
        nombre_propietario: '',
        rut_propietario: '',
        comuna: '',
        calle: '',
        numero: '',
        longitud: '',
        latitud: '',
        proyecto: ''
      },

      /* Material */
      dialog_material: false,
      maxchars: v => v.length <= 25 || 'Máximo de caracteres excedido',
      headers_material: [
        {
          text: 'Material',
          align: 'start',
          sortable: false,
          value: 'material',
        },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      materiales: [],
      // editedIndexSuborigen: -1,
      editedItemMaterial: {
        id: '',
        material: '',
        destino: '',
      },

      /* Validación de formulario */
      valid: false,
      nombredestinoRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 50) || 'Este campo debe tener menos de 50 caracteres',
      ],
      comunacalleRules: [
        v => {
          if (v) return v.length <= 50 || 'Este campo debe tener menos de 50 caracteres';
          else return true;
        },
      ],
      numeroRules: [
        v => String(v).length == 0 || Number.isInteger(Number(v)) || 'Este campo debe ser un número entero',
        v => String(v).length == 0 || v > 0 || 'Este campo debe ser mayor que 0',
        v => String(v).length == 0 || v < 9999999 || 'Este campo debe ser menor que 9 999 999',
        // v => {
        //   if (v) return v.length <= 6 || 'Este campo debe tener menos de 6 caracteres';
        //   else return true;
        // },
      ],
      rutRules:[
        v => !!v || 'Este campo es requerido',
        v => /^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(v) || 'Ingrese Rut sin puntos y con guión',
      ],

      
    }
  },
  components: {
      Map
  },
  computed: {
    formTitle () {
      if (this.editedIndex === -1){
        this.editedItem.longitud = '-70.567663758'
        this.editedItem.latitud = '-33.404889471'
        return 'Agregar Nuevo Destino'
      }else{
        return 'Editar Destino'
      }
      // return this.editedIndex === -1 ? 'Agregar Nuevo Origen' : 'Editar Origen'
    },
    idProyecto () {
      return this.$store.state.auth['Proyecto'].id;
    },
    nombreProyecto () {
      return this.$store.state.auth['Proyecto'].nombre_proyecto;
    },
    filteredMateriales(){
        return this.materiales.filter(item => item.destino === this.editedItem.id)
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialog_material (value) {
      value || this.closematerial()
    },
  },

  methods: {
    /*Forzar Render de Map*/
    forceRerender(){
      setTimeout(() => {
        this.componentKey += 1;
      }, 200)
      
    },

    /*Métodos de Suborigen*/
    saveEditMaterial (item) {
      this.$axios.put(`/backend/Material/${item.id}/`,item)
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Guardado'
    },
    saveCreateMaterial () {
      this.editedItemMaterial.destino = this.editedItem.id
      this.editedItemMaterial.activo = true
      this.$axios.post(`/backend/Material/`,this.editedItemMaterial)
        .then(res => {
          if(res.data){
            this.editedItemMaterial['id']=res.data['id']
            this.materiales.push(this.editedItemMaterial) 
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Guardado'
            this.dialog_material = false
          }
        })
        .catch(error => {
          this.snack = true
          this.snackColor = 'error'
          this.snackText = error
          this.dialog_material = false
        });
    },
    deletematerial (item) {
      const index = this.materiales.indexOf(item)
      var result = confirm('¿Desea eliminar item?') && this.materiales.splice(index, 1)
      if (result){
        this.$axios.delete(`/backend/Material/${item.id}/`)
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Material Eliminado'
      }
    },
    cancelmaterial () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Cancelado'
      this.dialog_material = false
    },
    openmaterial () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Modo edición'
    },
    closematerial () {
      setTimeout(() => {
        this.editedItemMaterial = Object.assign({}, this.defaultItem)
        // this.editedIndex = -1
      }, 300),
      this.dialog_material = false
    },


    /*Métodos de Destino*/
    editItem (item) {
      this.editedIndex = this.destinos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.destinos.indexOf(item)
      let id = item.id
      var result = confirm('¿Desea eliminar item?') && this.destinos.splice(index, 1)
      if (result)
        this.$axios.delete(`/backend/Destino/${id}/`)
        .catch(error => {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = error
        });
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
              this.editedItem.proyecto = this.idProyecto
              try{
                  let res = await this.$axios.put(`/backend/Destino/${this.editedItem.id}/`,this.editedItem)
                  if(res.status == 200){
                    Object.assign(this.destinos[this.editedIndex], this.editedItem)
                    this.snack = true
                    this.snackColor = 'success'
                    this.snackText = 'Actualizado'
                  }else{
                    this.snack = true
                    this.snackColor = 'error'
                    this.snackText = 'Hubo un error al actualizar. Refresque el navegador.'
                  }

              }catch(error){
                this.snack = true
                this.snackColor = 'error'
                this.snackText = error
              }
            /*Para crear un nuevo registro*/
            } else {      
              this.editedItem.proyecto = this.idProyecto
              try{
                  let res= await this.$axios.post('/backend/Destino/',this.editedItem)
                  if(res.status == 201){
                      this.editedItem['id']=res.data['id']
                      this.destinos.push(this.editedItem)
                      this.snack = true
                      this.snackColor = 'success'
                      this.snackText = 'Creado'
                  }else{
                    this.snack = true
                    this.snackColor = 'error'
                    this.snackText = 'Hubo un error al crear. Refresque el navegador.'+res.error
                  }
              }catch(error){
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
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      const res = await this.$axios.get('/backend/Destino/')
      this.destinos = res.data;

      /** Para mostrar los nombres de los Materiales en el dropdown del modal **/
      const resp_materiales = await this.$axios.get('/backend/Material/')
      this.materiales = resp_materiales.data;

    } catch (error) {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'No se han podido obtener los datos. Refresque la página.'
    }
  }

}
</script>

<style>

</style>
