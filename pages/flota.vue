<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">Túnel Hibrido</h1>
    
      <div class="container mt-5">
          <v-app>
              <v-data-table
                :headers="headers"
                :items="camiones"
                :items-per-page="10"
                sort-by="nombre_subcontratista"
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
                                <v-text-field v-model="editedItem.patente_camion" label="Patente"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.marca_camion" label="Marca"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.modelo_camion" label="Modelo"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.capacidad_camion" label="Capacidad"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.unidad_medida" label="Unidad de medida"></v-text-field>
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
                                <v-text-field v-model="editedItem.subcontratista" label="Subcontratista"></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
            
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
export default {
  middleware: 'authenticated',
  data(){
    return {
      dialog: false,
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
      nombreproyecto: '',
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
        subcontratista: ""
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
      return this.editedIndex === -1 ? 'Agregar Nuevo Camión' : 'Editar Camión'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.camiones.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      console.log("editItem() - editedIndex:",this.editedIndex)
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
        this.$axios.put(`/Camion/${this.editedItem['id']}/`,this.editedItem)
        .then(res => {
          console.log("edit re.data:",res.data)
          this.editedItem['id']=res.data['id']
          Object.assign(this.camiones[this.editedIndex], this.editedItem)
          
        })
        .catch(error => {
          alert(Object.values(error.response.data))
        });
       
      } else {
        console.log("this.editedItem",this.editedItem)
        this.$axios.post('/Camion/',this.editedItem)
        .then(res => {
          console.log("new re.data:",res.data)
          if(res.data){
            this.editedItem['id']=res.data['id']
            this.camiones.push(this.editedItem)
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
      const res = await this.$axios.get('/Camion/')
      // console.log(res.data)
      this.camiones = res.data;
    } catch (error) {
      console.log(error)
    }
  // asyncData({$axios}){
  //     const res = await $axios.get('/camion/')
  //     this.camiones = res.data;
  // }
    
    
  }

}
</script>

<style>
</style>
