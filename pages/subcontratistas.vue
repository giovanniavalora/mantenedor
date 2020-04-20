<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">Túnel Hibrido</h1>
    
      <div class="container mt-5">
          <v-app>
              <v-data-table
                :headers="headers"
                :items="subcontratistas"
                :items-per-page="10"
                sort-by="nombre_subcontratista"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Subcontratistas</v-toolbar-title>
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
                                <v-text-field v-model="editedItem.rut" label="Rut"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.razon_social" label="Razón social"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.nombre_subcontratista" label="Nombre subcontratista"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.nombre_contacto" label="Nombre contacto"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.apellido_contacto" label="Apellido contacto"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.telefono_contacto" label="Telefono contacto"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.email_contacto" label="email contacto"></v-text-field>
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
          text: 'Subcontratista',
          align: 'start',
          sortable: false,
          value: 'nombre_subcontratista',
        },
        { text: 'Rut', value: 'rut' },
        { text: 'Nombre Contacto', value: 'nombre_contacto' },
        { text: 'Telefono', value: 'telefono_contacto' },
        { text: 'Email de contacto', value: 'email_contacto' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      nombreproyecto: '',
      subcontratistas: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        razon_social: '',
        nombre_subcontratista: '',
        rut: '',
        nombre_contacto: '',
        apellido_contacto: '',
        telefono_contacto: '',
        email_contacto: '',
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
      return this.editedIndex === -1 ? 'Agregar Nuevo Subcontratista' : 'Editar Subcontratista'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.subcontratistas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      console.log("editItem() - editedIndex:",this.editedIndex)
    },

    deleteItem (item) {
      const index = this.subcontratistas.indexOf(item)
      let id = item.id
      var result = confirm('¿Desea eliminar item?') && this.subcontratistas.splice(index, 1)
      if (result)
        this.$axios.delete(`/Subcontratista/${id}/`)
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
        this.editedItem['proyecto']=1
        this.$axios.put(`/Subcontratista/${this.editedItem['id']}/`,this.editedItem)
        .then(res => {
          console.log("edit res:",res)
          if(res.data){
            console.log("edit antes:",this.editedItem['id'])
            this.editedItem['id']=res.data.id
            console.log("edit despues",this.editedItem['id'])
            Object.assign(this.subcontratistas[this.editedIndex], this.editedItem)
          }
        })
        .catch(error => {
          alert(Object.values(error.response.data))
        });
      } else {
        this.editedItem['proyecto']=1
        this.$axios.post('/Subcontratista/',this.editedItem)
        .then(res => {
          console.log("new re.data:",res.data)
          if(res.data){
            // this.editedItem['id']=res.data['id']
            this.subcontratistas.push(this.editedItem)
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
      const res = await this.$axios.get('/Subcontratista/')
      console.log("get all subcontratistas",res.data)
      this.subcontratistas = res.data;
    } catch (error) {
      console.log(error)
    }
  }

}
</script>

<style>
</style>
