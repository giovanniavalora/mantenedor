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
                sort-by="rut"
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
                                <v-text-field v-model="editedItem.nombre_destino" label="Nombre destino"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.nombre_propietario" label="nombre propietario"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.rut_propietario" label="Rut propietario"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.direccion" label="Dirección"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.longitud" label="Longitud"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.latitud" label="Latitud"></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>

                        <!-- <iframe style="width:80%" src="/materiales"></iframe> -->
            
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
export default {
  middleware: 'authenticated',
  data(){
    return {
      dialog: false,
      headers: [
        {
          text: 'Nombre Destino',
          align: 'start',
          sortable: false,
          value: 'nombre_destino',
        },
        { text: 'Nombre propietario', value: 'nombre_propietario' },
        { text: 'Rut propietario', value: 'rut_propietario' },
        { text: 'Dirección', value: 'direccion' },
        { text: 'Longitud', value: 'longitud' },
        { text: 'Latitud', value: 'latitud' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      destinos: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        nombre_destino: '',
        nombre_propietario: '',
        rut_propietario: '',
        direccion: '',
        longitud: '',
        latitud: '',
        proyecto: ''
      }
    }
  },
  // fetch ({ store, redirect }) {
  //   if (!store.state.user) {
  //     return redirect('/')
  //   }
  // },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Agregar Nuevo Destino' : 'Editar Destino'
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
      this.editedIndex = this.destinos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.destinos.indexOf(item)
      let id = item.id
      var result = confirm('¿Desea eliminar item?') && this.destinos.splice(index, 1)
      if (result)
        this.$axios.delete(`/Destino/${id}/`)
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

        Object.assign(this.destinos[this.editedIndex], this.editedItem)
        this.$axios.put(`/Destino/${this.editedItem.id}/`,this.editedItem)
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
        this.destinos.push(this.editedItem)
        this.$axios.post('/Destino/',this.editedItem)
        .then(res => {
          console.log("new re.data:",res.data)
          if(res.data){
            // this.editedItem['id']=res.data['id']
            // this.destinos.push(this.editedItem)
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
      const res = await this.$axios.get('/Destino/')
      console.log("get all destinos",res.data)
      this.destinos = res.data;
    } catch (error) {
      console.log(error)
    }
  }

}
</script>

<style>
</style>
