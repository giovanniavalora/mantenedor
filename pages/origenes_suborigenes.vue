<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">{{nombreProyecto}}</h1>
      
    
      <div class="container mt-5">
          <v-app>
              <v-data-table
                :headers="headers"
                :items="origenes"
                :items-per-page="10"
                :footer-props="{
                  itemsPerPageAllText: 'Todo',
                  itemsPerPageText: 'Filas por página'
                }"
                sort-by="nombre_origen"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Origenes</v-toolbar-title>
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

                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.nombre_origen" label="Nombre Origen"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.comuna" label="Comuna"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.calle" label="Calle"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.numero" label="Número"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="12" md="8">
                                <v-divider
                                  class="mx-4"
                                  inset
                                  vertical
                                ></v-divider>
                                <v-data-table 
                                  dense
                                  :headers="headers_suborigen"
                                  :items="filteredSuborigenes"
                                  hide-default-header
                                  hide-default-footer
                                  sort-by="nombre_suborigen"
                                  class="elevation-1"
                                  >
                                        <template v-slot:top>
                                          <v-toolbar class="grey lighten-5" flat short dense>
                                                Suborigenes
                                            <v-divider
                                              class="mx-4"
                                              inset
                                              vertical
                                            ></v-divider>
                                            <v-spacer></v-spacer>
                                                <v-btn color="primary" class="mr-5" small @click="dialog_suborigen=true">Agregar</v-btn>
                                                <!-- <v-icon color="primary" class="align-right" @click="dialog_suborigen=true">
                                                    mdi-plus-circle
                                                </v-icon> -->
                                          </v-toolbar>
                                          <v-divider></v-divider>
                                          <v-dialog v-model="dialog_suborigen" max-width="300px">
                                              <v-card>
                                                <v-card-title>Nuevo Suborigen</v-card-title>
                                                <v-card-text>
                                                  <v-container>
                                                    <v-row justify="center">
                                                      <v-col>
                                                        <v-text-field v-model="editedItemSuborigen.nombre_suborigen" label="Nombre Suborigen"></v-text-field>
                                                      </v-col>
                                                    </v-row>
                                                  </v-container>
                                                </v-card-text>
                                                <v-card-actions>
                                                  <v-spacer></v-spacer>
                                                  <v-btn color="blue darken-1" text @click="cancelsuborigen">Cancelar</v-btn>
                                                  <v-btn color="blue darken-1" text @click="saveCreateSuborigen">Guardar</v-btn>
                                                </v-card-actions>
                                              </v-card>
                                          </v-dialog>
                                        </template> 
                                        

                                        <template v-slot:item.nombre_suborigen="props">
                                            <v-edit-dialog
                                              dense
                                              :return-value.sync="props.item.nombre_suborigen"
                                              @save="saveEditSuborigen(props.item)"
                                              @cancel="cancelsuborigen"
                                              @open="opensuborigen"
                                              @close="closesuborigen"
                                            > {{props.item.nombre_suborigen}}
                                                <template v-slot:input>
                                                    <v-text-field
                                                        dense
                                                        v-model="props.item.nombre_suborigen"
                                                        :rules="[maxchars]"
                                                        label="Edit"
                                                        single-line
                                                        counter
                                                        autofocus
                                                    ></v-text-field>
                                                </template>
                                            </v-edit-dialog>
                                        </template>
                                        <template v-slot:item.activo="props">
                                            <v-switch
                                              dense
                                              class="shrink mr-2"
                                              v-model="props.item.activo"
                                              @change="saveEditSuborigen(props.item)"
                                            >
                                            </v-switch>
                                        </template>
                                        <template v-slot:item.actions="{ item }">
                                          <v-icon
                                            small
                                            @click="deletesuborigen(item)"
                                          >
                                            mdi-delete
                                          </v-icon>
                                        </template>
                                </v-data-table> 
                                
                              </v-col>
                            </v-row>
                            
                          </v-container>
                         
                        </v-card-text>
                          <v-container fill-height fluid>
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
                          </v-container>
                          
            
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                          <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
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

      /*Origen*/
      dialog: false,
      headers: [
        {
          text: 'Nombre Origen',
          align: 'start',
          sortable: false,
          value: 'nombre_origen',
        },
        { text: 'Comuna', value: 'comuna' },
        { text: 'Calle', value: 'calle' },
        { text: 'Numero', value: 'numero' },
        { text: 'Latitud', value: 'latitud' },
        { text: 'Longitud', value: 'longitud' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      
      origenes: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        nombre_origen: '',
        comuna: '',
        calle: '',
        numero: '',
        longitud: '',
        latitud: '',
        proyecto: ''
      },

      /* Suborigen */
      dialog_suborigen: false,
      snack: false,
      snackColor: '',
      snackText: '',
      snackTop: true,
      maxchars: v => v.length <= 25 || 'Máximo de caracteres excedido',
      headers_suborigen: [
        {
          text: 'Nombre Suborigen',
          align: 'start',
          sortable: false,
          value: 'nombre_suborigen',
        },
        { text: 'Activo', value: 'activo' },
        // { text: 'Origen', value: 'origen' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      suborigenes: [],
      // editedIndexSuborigen: -1,
      editedItemSuborigen: {
        id: '',
        nombre_suborigen: '',
        activo: '',
        origen: '',
      },

      
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
        return 'Agregar Nuevo Origen'
      }else{
        return 'Editar Origen'
      }
      // return this.editedIndex === -1 ? 'Agregar Nuevo Origen' : 'Editar Origen'
    },
    idProyecto () {
      return this.$store.state.auth['Proyecto'].id;
    },
    nombreProyecto () {
      return this.$store.state.auth['Proyecto'].nombre_proyecto;
    },
    filteredSuborigenes(){
        return this.suborigenes.filter(item => item.origen === this.editedItem.id)
        
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialog_suborigen (value) {
      value || this.closesuborigen()
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
    saveEditSuborigen (item) {
      this.$axios.put(`/Suborigen/${item.id}/`,item)
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Guardado'
    },
    saveCreateSuborigen () {
      this.editedItemSuborigen.origen = this.editedItem.id
      this.editedItemSuborigen.activo = true
      this.$axios.post(`/Suborigen/`,this.editedItemSuborigen)
        .then(res => {
          if(res.data){
            this.editedItemSuborigen['id']=res.data['id']
            this.suborigenes.push(this.editedItemSuborigen) 
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Guardado'
            this.dialog_suborigen = false
          }
        })
        .catch(error => {
          this.snack = true
          this.snackColor = 'error'
          this.snackText = error
          this.dialog_suborigen = false
        });
    },
    deletesuborigen (item) {
      console.log("Delete: ",item)
      const index = this.suborigenes.indexOf(item)
      var result = confirm('¿Desea eliminar item?') && this.suborigenes.splice(index, 1)
      if (result){
        this.$axios.delete(`/Suborigen/${item.id}/`)
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Suborigen Eliminado'
      }
    },
    cancelsuborigen () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Cancelado'
      this.dialog_suborigen = false
    },
    opensuborigen () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Modo edición'
    },
    closesuborigen () {
      setTimeout(() => {
        this.editedItemSuborigen = Object.assign({}, this.defaultItem)
        // this.editedIndex = -1
      }, 300),
      this.dialog_suborigen = false
      console.log('Dialog closed')
    },


    /*Métodos de Origen*/
    editItem (item) {
      this.editedIndex = this.origenes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.origenes.indexOf(item)
      let id = item.id
      var result = confirm('¿Desea eliminar item?') && this.origenes.splice(index, 1)
      if (result)
        this.$axios.delete(`/Origen/${id}/`)
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



    save () {
      if (this.editedIndex > -1) {
        this.editedItem.proyecto = this.idProyecto

        
        this.$axios.put(`/Origen/${this.editedItem.id}/`,this.editedItem)
        .then(res => {
          if(res.data){
            Object.assign(this.origenes[this.editedIndex], this.editedItem)
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Actualizado'
          }
        })
        .catch(error => {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = error
        });
      } else {
        this.editedItem.proyecto = this.idProyecto
        this.$axios.post('/Origen/',this.editedItem)
        .then(res => {
          console.log("new res.data:",res.data)
          if(res.data){
            this.editedItem['id']=res.data['id']
            this.origenes.push(this.editedItem)
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Creado'
          }
        })
        .catch(error => {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = error
        });
      }
      this.close()
    },
  },

  async created(){
    try {
      const res = await this.$axios.get('/Origen/')
      this.origenes = res.data;

      /** Para mostrar los nombres de los Suborigenes en el dropdown del modal **/
      const resp_suborigenes = await this.$axios.get('/Suborigen/')
      this.suborigenes = resp_suborigenes.data;

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
