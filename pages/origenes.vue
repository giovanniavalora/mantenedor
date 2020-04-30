<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">{{nombreProyecto}}</h1>
      
    
      <div class="container mt-5">
          <!-- <portal to="mapita"> -->
            <!-- <Map class="map" 
                :lat="editedItem.latitud" 
                :lng="editedItem.longitud" 
                @latitudeChange="editedItem.latitud = $event" 
                @longitudeChange="editedItem.longitud = $event">
            </Map> -->
          <!-- </portal> -->
          <v-app>
              <v-data-table
                :headers="headers"
                :items="origenes"
                :items-per-page="10"
                :footer-props="{
                  itemsPerPageAllText: 'Todo',
                  itemsPerPageText: 'Filas por página'
                }"
                sort-by="rut"
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
                              
                              <!-- <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.longitud" label="Longitud"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.latitud" label="Latitud"></v-text-field>
                              </v-col> -->
                            </v-row>
                            
                          </v-container>
                         
                        </v-card-text>
                        <!-- <div>
                          <v-img height="100%" width="100%">
                          <client-only> -->
                          <v-container fill-height fluid>
                            <v-row justify="center">
                              <Map class="map" 
                                  :lat="editedItem.latitud" 
                                  :lng="editedItem.longitud" 
                                  @latitudeChange="editedItem.latitud = $event" 
                                  @longitudeChange="editedItem.longitud = $event">
                              </Map>
                            </v-row>
                          </v-container>
                          <!-- </client-only>
                          </v-img>
                        </div> -->
                        <!-- <iframe style="width:80%; height: 100%;" src="/mapa"></iframe> -->
                          
            
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
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
import Map from '~/components/Map.vue';

export default {
  middleware: 'authenticated',
  data(){
    return {
      dialog: true,
      headers: [
        {
          text: 'Nombre Origen',
          align: 'start',
          sortable: false,
          value: 'nombre_origen',
        },
        { text: 'Latitud', value: 'latitud' },
        { text: 'Longitud', value: 'longitud' },
        { text: 'Actions', value: 'actions', sortable: false }
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
      }
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
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {
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
            // alert(Object.values(error.response.data))
            // alert(Object.values(error.response))
            console.log(error.response)
            alert(error.response)
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
        console.log("edit 0:",this.editedItem)
        this.editedItem.proyecto = this.idProyecto
        console.log("edit 1:",this.editedItem)
        console.log("edit idP:", this.idProyecto)

        Object.assign(this.origenes[this.editedIndex], this.editedItem)
        this.$axios.put(`/Origen/${this.editedItem.id}/`,this.editedItem)
        .then(res => {
          if(res.data){
            console.log("edit 2:",this.editedItem)
            // this.editedItem['id']=res.data.id
            console.log("edit 3:",this.editedItem['id'])
          }
        })
        .catch(error => {
          alert(Object.values(error.response.data))
        });
      } else {
        this.editedItem.proyecto = this.idProyecto
        this.origenes.push(this.editedItem)
        this.$axios.post('/Origen/',this.editedItem)
        .then(res => {
          console.log("new re.data:",res.data)
          if(res.data){
            // this.editedItem['id']=res.data['id']
            // this.origenes.push(this.editedItem)
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
      const res = await this.$axios.get('/Origen/')
      console.log("get all origenes",res.data)
      this.origenes = res.data;
      this.dialog=false
    } catch (error) {
      console.log(error)
    }
  }

}
</script>

<style>
/* Map {
    position: fixed !important;
}
.map {
    position: fixed !important;
} */
  /* .map{ */
    /* height: 100%;
    width: 100%; */
    /* position: fixed !important; */
    /* position: absolute;
    height: inherit;
    width: inherit;
  } */

  /* .map {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
  } */
  /* .map{
    transform: translate3d(-50px,-50px);
  } */
  /* .map{
    transform: translate(50%,50%);
  } */

</style>
