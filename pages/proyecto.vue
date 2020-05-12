<template>
  <v-layout>
    <v-flex class="text-center">
      <div id="app">
        <v-app id="inspire">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >

                <v-text-field
                  v-model="editedItem.centro_de_coste"
                  :counter="20"
                  :rules="centro_de_coste_Rules"
                  label="Centro de coste"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.nombre_proyecto"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Nombre proyecto"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.ubicacion"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Ubicación"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.cliente"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Cliente"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.rut_cliente"
                  :counter="100"
                  :rules="editedItem.nombre_proyecto_Rules"
                  label="Rut cliente"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.mandante"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Mandante"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.rut_mandante"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Rut mandante"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.mandante_final"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Mandante Final"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.cantidad_voucher_imprimir"
                  :counter="1"
                  :rules="nro_imprimir_Rules"
                  label="Cantidad de voucher a imprimir"
                  type="number"
                  required
                ></v-text-field>

                <v-btn
                  :disabled="!valid"
                  color="primary"
                  class="mr-4"
                  @click="validaryactualizar"
                >
                  Actualizar
                </v-btn>


            <!-- <v-row>
              
              <v-col cols="12" sm="12" >
                <v-text-field
                  v-model="centro_de_coste"
                  :counter="20"
                  :rules="centro_de_coste_Rules"
                  label="Centro de coste"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="nombre_proyecto"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Nombre proyecto"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="ubicacion"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Ubicación"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="cliente"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Cliente"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="rut_cliente"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Rut cliente"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="mandante"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Mandante"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="rut_mandante"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Rut mandante"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="mandante_final"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Mandante Final"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="cantidad_voucher_imprimir"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Cantidad de voucher a imprimir"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12">
                <v-select
                  v-model="select"
                  :items="items"
                  :rules="[v => !!v || 'Item is required']"
                  label="Item"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  class="mr-4"
                  @click="validate"
                >
                  Actualizar
                </v-btn>
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

            </v-row> -->
                
              <!--             
                <v-checkbox
                  v-model="checkbox"
                  :rules="[v => !!v || 'You must agree to continue!']"
                  label="Do you agree?"
                  required
                ></v-checkbox>
            
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  class="mr-4"
                  @click="validate"
                >
                  Validate
                </v-btn>
            
                <v-btn
                  color="error"
                  class="mr-4"
                  @click="reset"
                >
                  Reset Form
                </v-btn>
            
                <v-btn
                  color="warning"
                  @click="resetValidation"
                >
                  Reset Validation
                </v-btn> 
              -->
          </v-form>
        </v-app>
      </div>
    </v-flex>
  </v-layout>
</template>


<script>
export default {
  middleware: 'authenticated',

  data: () => ({
    valid: true,
    editedIndex: -1,
    editedItem: {
      id: '',
      centro_de_coste: '',
      nombre_proyecto: '',
      ubicacion: '',
      cliente: '',
      rut_cliente: '',
      mandante: '',
      rut_mandante: '',
      mandante_final: '',
      cantidad_voucher_imprimir: '',
    },
    centro_de_coste: '',
    centro_de_coste_Rules: [
      v => !!v || 'Este campo es requerido',
      v => (v && v.length <= 20) || 'Este campo debe tener menos de 20 caracteres',
    ],
    nombre_proyecto: '',
    nombre_proyecto_Rules: [
      v => !!v || 'Este campo es requerido',
      v => (v && v.length <= 100) || 'Este campo debe tener menos de 100 caracteres',
    ],
    emailRules: [
      v => !!v || 'E-mail es requerido',
      v => /.+@.+\..+/.test(v) || 'E-mail debe ser valido',
    ],
    nro_imprimir_Rules: [
      v => !!v || 'Es requerido',
      v => v <= 5 || 'No puede ser superior a 5 impresiones',
    ],
    select: null,
    items: [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
    ],
    checkbox: false,
  }),

  methods: {
    validaryactualizar () {
      //validación
      this.$refs.form.validate()
      //actualización
      console.log("this.editedItem:",this.editedItem)
      this.$axios.put(`/Proyecto/${this.editedItem.id}/`,this.editedItem)
      .then(res => {
        console.log("res.data:",res.data)
        alert("Actualizado correctamente")
      })
      .catch(error => {
        console.error(error)
        alert("No se pudo actualizar")
      });
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
  computed: {
    idProyecto () {
      return this.$store.state.auth['Proyecto'].id;
    }
  },
  async created(){
    try {
      // const res = await axios.get('http://157.245.237.33:5000/api/v1/Camion/')
      const id = this.idProyecto
      const res = await this.$axios.get(`/Proyecto/${id}/`)
      this.editedItem = res.data;
      this.editedItem.cantidad_voucher_imprimir = String(this.editedItem.cantidad_voucher_imprimir);
      console.log("proyecto",this.editedItem )

    } catch (error) {
      console.log(error)
    }
  }
  
}
</script>