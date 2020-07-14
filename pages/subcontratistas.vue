<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">{{nombreProyecto}}</h1>
    
      <div class="container mt-5">
          <v-app>
              <v-data-table
                :headers="headers"
                :items="subcontratistas"
                :items-per-page="10"
                :footer-props="{
                  itemsPerPageAllText: 'Todo',
                  itemsPerPageText: 'Filas por página'
                }"
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
                            <v-form
                              ref="form"
                              v-model="valid"
                              lazy-validation
                            >
                                <v-row>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.rut" label="Rut" :rules="rutRules" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.razon_social" label="Razón social" :rules="razonsocialRules" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.nombre_subcontratista" label="Nombre subcontratista" :rules="nomsubcontratistaRules" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.nombre_contacto" label="Nombre contacto" :rules="nombreapellidoRules" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.apellido_contacto" label="Apellido contacto" :rules="nombreapellidoRules" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.telefono_contacto" label="Telefono contacto" :rules="telefonoRules" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.email_contacto" label="email contacto" :rules="emailRules"></v-text-field>
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
export default {
  middleware: 'authenticated',
  data(){
    return {
      /* SnackBar */
      snack: false,
      snackColor: '',
      snackText: '',
      snackTop: true,

      /* Subcontratista */
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
        { text: 'Numero flota', value: 'numero_flota' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
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
        proyecto: '',
        numero_flota: "", //no es propio del modelo, se agrega en el front
      },

      /* Validación de formulario */
      valid: false,
      rutRules:[
        v => !!v || 'Este campo es requerido',
        v => /^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(v) || 'Ingrese Rut sin puntos y con guión',
      ],
      razonsocialRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 50) || 'Este campo debe tener menos de 50 caracteres',
      ],
      nomsubcontratistaRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 50) || 'Este campo debe tener menos de 50 caracteres',
      ],
      nombreapellidoRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 20) || 'Este campo debe tener menos de 20 caracteres',
      ],
      telefonoRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 16) || 'Este campo debe tener menos de 16 caracteres',
      ],
      emailRules: [
        v => {
          if (v) return /.+@.+\..+/.test(v) || 'E-mail debe ser valido: ejemplo@dominio.ej';
          else return true;
        },
      ],
      // emailRules: [
      //   v => !!v || 'E-mail es requerido',
      //   v => /.+@.+\..+/.test(v) || 'E-mail debe ser valido',
      // ],

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
      this.editedIndex = this.subcontratistas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.subcontratistas.indexOf(item)
      let id = item.id
      var result = confirm('¿Desea eliminar item?') && this.subcontratistas.splice(index, 1)
      if (result)
        this.$axios.delete(`/backend/Subcontratista/${id}/`)
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



    async save () {
        /* Validación formulario */
        if (this.$refs.form.validate() ){

            /* Para editar un registro */
            if (this.editedIndex > -1) {
              this.editedItem.proyecto = this.idProyecto
              try {
                let res = await this.$axios.put(`/backend/Subcontratista/${this.editedItem.id}/`,this.editedItem)
                if(res.status == 200){
                  Object.assign(this.subcontratistas[this.editedIndex], this.editedItem)
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
              }
            /*Para crear un nuevo registro*/
            } else {
              this.editedItem.proyecto = this.idProyecto
              try {
                let res = await this.$axios.post('/backend/Subcontratista/',this.editedItem)
                if (res.status == 201) {
                  this.editedItem['id']=res.data['id']
                  this.subcontratistas.push(this.editedItem)
                  
                } else {
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
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      const res = await this.$axios.get('/backend/Subcontratista/')
      // console.log("get all subcontratistas",res.data)
      this.subcontratistas = res.data;
      

      // const res = await this.$axios.get(`/FlotaSubcontratista/${id}`)
      // this.subcontratistas = res.data;

      for(var prop in this.subcontratistas){
        let id = this.subcontratistas[prop].id
        // console.log("id:",id)

        // this.$axios.get('/backend/FlotaSubcontratista/1/')
        // .then(resp=>{
        //   console.log("resp1: ", resp)
        // }).catch(e=>{
        //   console.log(e)
        // })

        // this.$axios.get(`/backend/FlotaSubcontratista/${id}/`)
        // .then(resp=>{
        //   console.log("resp2: ", resp)
        // }).catch(e=>{
        //   console.log(e)
        // })

        let res_fs= await this.$axios.get(`/backend/FlotaSubcontratista/${id}/`);
        this.subcontratistas[prop].numero_flota = res_fs.data.data['cantidad_camiones']
        this.editedItem = Object.assign({}, {}) //para actualizar la tabla
      }
      this.editedItem = Object.assign({}, {}) //para actualizar la tabla


    } catch (error) {
      console.log("error: ", error)
    }
  }

}
</script>

<style>
</style>
