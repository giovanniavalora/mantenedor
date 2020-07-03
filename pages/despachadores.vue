<template>
  <v-layout>
    <v-flex>

      <h1 class="text-center">{{nombreProyecto}}</h1>
    
      <div class="container mt-5">
          <v-app>
              <v-data-table
                :headers="headers"
                :items="despachadores"
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
                    <v-toolbar-title>Despachadores</v-toolbar-title>
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

                        <v-form
                          ref="form"
                          v-model="valid"
                          lazy-validation
                        >
                            <v-card-text>
                              <v-container>
                                <v-row>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.rut" :rules="rutRules" label="Rut" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.nombre" :rules="nombreapellidoRules" label="Nombre despachador" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.apellido" :rules="nombreapellidoRules" label="Apellido despachador" required></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.telefono" :rules="telefonoRules" label="Nro telefónico entregado"></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-select
                                      v-model="editedItem.origen_asignado"
                                      :items= origenes
                                      :rules="origenasignadoRules"
                                      item-text="nombre_origen" 
                                      item-value="id" 
                                      single-line 
                                      auto 
                                      label="Origen"
                                      required
                                    ></v-select>
                                    <!-- <v-text-field v-model="editedItem.origen_asignado" label="Origen"></v-text-field> -->
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.password" :rules="passwordRules" type="password" label="Contraseña" required></v-text-field>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-card-text>
                          
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                              <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Guardar</v-btn>
                            </v-card-actions>
                          </v-form>
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
      valid: true,
      /* SnackBar */
      snack: false,
      snackColor: '',
      snackText: '',
      snackTop: true,

      /* Despachadores */
      dialog: false,
      headers: [
        {
          text: 'Rut',
          align: 'start',
          sortable: false,
          value: 'rut',
        },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Apellido', value: 'apellido' },
        { text: 'Numero entregado', value: 'telefono' },
        { text: 'Origen', value: 'origen_asignado' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      origenes: [],
      despachadores: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        rut: '',
        password: '',
        nombre: '',
        apellido: '',
        telefono: '',
        origen_asignado: '',
        // nom_origen: "", //no es propio del modelo, se agrega en el front
        proyecto: '',
      },

      /* Validación de formulario */
      valid: false,
      rutRules:[
        v => !!v || 'Este campo es requerido',
        v => /^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(v) || 'Ingrese Rut sin puntos y con guión',
      ],
      nombreapellidoRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 20) || 'Este campo debe tener menos de 20 caracteres',
      ],
      origenasignadoRules: [
        v => !!v || 'Este campo es requerido',
        // v => (v && v.length <= 50) || 'Este campo debe tener menos de 50 caracteres',
      ],
      telefonoRules: [
        // v => !!v || 'Este campo es requerido',
        v => {
          if (v) return v.length <= 16 || 'Este campo debe tener menos de 16 caracteres';
          else return true;
        },
      ],
      passwordRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length > 7) || 'Debe tener a lo menos 8 caracteres',
      ],
    }
  },
  // fetch ({ store, redirect }) {
  //   if (!store.state.user) {
  //     return redirect('/')
  //   }
  // },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Agregar Nuevo Despachador' : 'Editar Despachador'
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
      this.editedIndex = this.despachadores.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.despachadores.indexOf(item)
      let id = item.id
      var result = confirm('¿Desea eliminar item?') && this.despachadores.splice(index, 1)
      if (result)
        this.$axios.delete(`/backend/Despachador/${id}/`)
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



    async save () {
        /* Validación formulario */
        if (this.$refs.form.validate() ){

            /* Para editar un registro */
            if (this.editedIndex > -1) {
              this.editedItem.proyecto = this.idProyecto
              try {
                let res = await this.$axios.put(`/backend/Despachador/${this.editedItem.id}/`,this.editedItem)
                if(res.status == 200){
                    Object.assign(this.despachadores[this.editedIndex], this.editedItem)
                    this.snack = true
                    this.snackColor = 'success'
                    this.snackText = 'Guardado'
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
                let res = await this.$axios.post('/backend/Despachador/',this.editedItem)
                console.log("res",res)
                if (res.status = 201) {
                  this.editedItem['id']=res.data.data.id
                  console.log("editedItem",this.editedItem)
                  this.despachadores.push(this.editedItem)
                  this.snack = true
                  this.snackColor = 'success'
                  this.snackText = 'Creado'
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
      // console.log("token: ", this.$store.state.auth['Token'])
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      const res = await this.$axios.get('/backend/Despachador/')
      this.despachadores = res.data;
      this.despachadores = this.despachadores.filter(x => x.proyecto === this.idProyecto)

      /** Para mostrar los nombres de los Subcontratista en el dropdown del modal **/
      const resp_origenes = await this.$axios.get('/backend/Origen/') //Se obtienen todos, pero debieran ser solo los del proyecto?
      this.origenes = resp_origenes.data;
      this.origenes = this.origenes.filter(x => x.proyecto === this.idProyecto)//Aquí se filtran los origenes pertenecientes al proyecto
    } catch (error) {
      console.log(error)
    }
  }

}
</script>

<style>
</style>
